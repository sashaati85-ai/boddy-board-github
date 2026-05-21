const STORE_URL = "https://jsonblob.com/api/jsonBlob/019e46e2-c1d5-7c5b-bd04-d9710184ec78";

function normalizeSharedState(value) {
  const source = value && typeof value === "object" ? value : {};
  const announcements = normalizeAnnouncementList(source);

  return {
    participants: Array.isArray(source.participants)
      ? source.participants.map(normalizeParticipant)
      : [],
    adminPasswordHashV2: source.adminPasswordHashV2 || source.adminPasswordHash || "",
    adminPasswordChanged: Boolean(source.adminPasswordChanged),
    registrationPasswordHash: source.registrationPasswordHash || "",
    siteImages: normalizeSiteImages(source.siteImages),
    uiText: normalizeEditableMap(source.uiText),
    uiPlaceholders: normalizeEditableMap(source.uiPlaceholders),
    announcements,
    announcement: announcements[0] || null,
    announcementDeletedAt: Number(source.announcementDeletedAt || 0),
    deletedAnnouncementIds: Array.isArray(source.deletedAnnouncementIds)
      ? source.deletedAnnouncementIds.map((id) => String(id)).filter(Boolean)
      : [],
    deletedParticipantIds: Array.isArray(source.deletedParticipantIds)
      ? source.deletedParticipantIds
      : [],
    allowEmptyParticipants: Boolean(source.allowEmptyParticipants),
    allowEmptyRegistrationPassword: Boolean(source.allowEmptyRegistrationPassword),
  };
}

function normalizeParticipant(participant = {}) {
  return {
    ...participant,
    archivedGoals: sortArchivedGoals(Array.isArray(participant.archivedGoals) ? participant.archivedGoals : []),
  };
}

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Cache-Control", "no-store, max-age=0");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method === "GET") {
    const storeResponse = await fetch(STORE_URL, {
      headers: { Accept: "application/json" },
    });

    if (!storeResponse.ok) {
      response.status(502).json({ error: "Не удалось загрузить общую доску." });
      return;
    }

    response.status(200).json(normalizeSharedState(await storeResponse.json()));
    return;
  }

  if (request.method === "PUT" || request.method === "POST") {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const data = normalizeSharedState(body);
    const currentResponse = await fetch(STORE_URL, {
      headers: { Accept: "application/json" },
    });
    const currentData = currentResponse.ok
      ? normalizeSharedState(await currentResponse.json())
      : { participants: [], adminPasswordHashV2: "", adminPasswordChanged: false, registrationPasswordHash: "", siteImages: normalizeSiteImages(), uiText: {}, uiPlaceholders: {}, announcements: [], announcement: null, announcementDeletedAt: 0, deletedAnnouncementIds: [], deletedParticipantIds: [] };
    const deletedIds = new Set([
      ...currentData.deletedParticipantIds,
      ...data.deletedParticipantIds,
    ]);

    data.adminPasswordChanged = data.adminPasswordChanged || currentData.adminPasswordChanged;
    data.adminPasswordHashV2 = data.adminPasswordHashV2 || currentData.adminPasswordHashV2;
    data.registrationPasswordHash = data.registrationPasswordHash || (
      data.allowEmptyRegistrationPassword ? "" : currentData.registrationPasswordHash
    );
    data.siteImages = {
      logo: data.siteImages.logo || currentData.siteImages.logo,
      cover: data.siteImages.cover || currentData.siteImages.cover,
    };
    data.uiText = { ...currentData.uiText, ...data.uiText };
    data.uiPlaceholders = { ...currentData.uiPlaceholders, ...data.uiPlaceholders };
    data.deletedAnnouncementIds = [
      ...new Set([
        ...(currentData.deletedAnnouncementIds || []),
        ...(data.deletedAnnouncementIds || []),
      ]),
    ];
    data.announcementDeletedAt = Math.max(currentData.announcementDeletedAt || 0, data.announcementDeletedAt || 0);
    data.announcements = mergeAnnouncements(currentData, data, data.deletedAnnouncementIds, data.announcementDeletedAt);
    data.announcement = data.announcements[0] || null;
    data.deletedParticipantIds = [...deletedIds];
    data.participants = mergeParticipants(currentData.participants, data.participants, deletedIds);

    if (!data.allowEmptyParticipants && data.participants.length === 0 && currentData.participants.length > 0) {
      data.participants = mergeParticipants(currentData.participants, [], deletedIds);
    }

    const storeResponse = await fetch(STORE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!storeResponse.ok) {
      response.status(502).json({ error: "Не удалось сохранить общую доску." });
      return;
    }

    response.status(200).json(normalizeSharedState(await storeResponse.json()));
    return;
  }

  response.setHeader("Allow", "GET, PUT, POST, OPTIONS");
  response.status(405).json({ error: "Метод не поддерживается." });
};

function normalizeSiteImages(siteImages = {}) {
  return {
    logo: typeof siteImages.logo === "string" ? siteImages.logo : "",
    cover: typeof siteImages.cover === "string" ? siteImages.cover : "",
  };
}

function normalizeAnnouncement(announcement) {
  if (!announcement || typeof announcement !== "object") return null;
  return {
    ...announcement,
    id: announcement.id || crypto.randomUUID(),
    text: String(announcement.text || "").trim(),
    createdAt: announcement.createdAt || Date.now(),
    updatedAt: announcement.updatedAt || announcement.createdAt || Date.now(),
    recipient: normalizeAnnouncementRecipient(announcement.recipient),
    readBy: Array.isArray(announcement.readBy)
      ? [...new Set(announcement.readBy.map((id) => String(id)).filter(Boolean))]
      : [],
  };
}

function normalizeAnnouncementList(source = {}) {
  const rawAnnouncements = Array.isArray(source.announcements) ? source.announcements : [];
  const legacyAnnouncement = source.announcement ? [source.announcement] : [];
  const deletedIds = new Set(
    Array.isArray(source.deletedAnnouncementIds)
      ? source.deletedAnnouncementIds.map((id) => String(id)).filter(Boolean)
      : [],
  );
  const deletedAt = Number(source.announcementDeletedAt || 0);
  const announcementsById = new Map();

  [...rawAnnouncements, ...legacyAnnouncement].forEach((item) => {
    const announcement = normalizeAnnouncement(item);
    if (!announcement?.text || deletedIds.has(announcement.id)) return;
    if (deletedAt && deletedAt >= getAnnouncementUpdatedAt(announcement)) return;

    const existing = announcementsById.get(announcement.id);
    if (!existing) {
      announcementsById.set(announcement.id, announcement);
      return;
    }

    const preferred = getAnnouncementUpdatedAt(announcement) >= getAnnouncementUpdatedAt(existing)
      ? announcement
      : existing;
    announcementsById.set(announcement.id, {
      ...preferred,
      readBy: mergeAnnouncementReadBy(existing, announcement),
    });
  });

  return [...announcementsById.values()].sort((first, second) => {
    const timeDiff = Number(second.createdAt || second.updatedAt || 0) - Number(first.createdAt || first.updatedAt || 0);
    if (timeDiff !== 0) return timeDiff;
    return String(second.id).localeCompare(String(first.id));
  });
}

function normalizeAnnouncementRecipient(recipient) {
  if (!recipient || typeof recipient !== "object") {
    return { type: "all", participantId: "", participantIds: [] };
  }
  const participantIds = Array.isArray(recipient.participantIds)
    ? [...new Set(recipient.participantIds.map((id) => String(id)).filter(Boolean))]
    : [];
  const hasMultipleRecipients = recipient.type === "participants" || participantIds.length > 1;
  const type = hasMultipleRecipients
    ? "participants"
    : recipient.type === "participant"
      ? "participant"
      : "all";
  return {
    type,
    participantId: type === "participant" ? String(recipient.participantId || "") : "",
    participantIds: type === "participants" ? participantIds : [],
  };
}

function mergeAnnouncements(currentData, incomingData, deletedIds = [], deletedAt = 0) {
  const deletedSet = new Set(deletedIds);
  const announcementsById = new Map();

  [...normalizeAnnouncementList(currentData), ...normalizeAnnouncementList(incomingData)].forEach((announcement) => {
    if (!announcement?.id || deletedSet.has(announcement.id)) return;
    if (deletedAt && deletedAt >= getAnnouncementUpdatedAt(announcement)) return;

    const existing = announcementsById.get(announcement.id);
    if (!existing) {
      announcementsById.set(announcement.id, announcement);
      return;
    }

    const preferred = getAnnouncementUpdatedAt(announcement) >= getAnnouncementUpdatedAt(existing)
      ? announcement
      : existing;
    announcementsById.set(announcement.id, {
      ...preferred,
      readBy: mergeAnnouncementReadBy(existing, announcement),
    });
  });

  return [...announcementsById.values()].sort((first, second) => {
    const timeDiff = Number(second.createdAt || second.updatedAt || 0) - Number(first.createdAt || first.updatedAt || 0);
    if (timeDiff !== 0) return timeDiff;
    return String(second.id).localeCompare(String(first.id));
  });
}

function getAnnouncementUpdatedAt(announcement) {
  if (!announcement) return 0;
  return Number(announcement.updatedAt || announcement.createdAt || 0);
}

function mergeAnnouncementReadBy(currentAnnouncement, incomingAnnouncement) {
  return [
    ...new Set([
      ...(Array.isArray(currentAnnouncement?.readBy) ? currentAnnouncement.readBy : []),
      ...(Array.isArray(incomingAnnouncement?.readBy) ? incomingAnnouncement.readBy : []),
    ]),
  ];
}

function mergeParticipants(currentParticipants = [], incomingParticipants = [], deletedIds = new Set()) {
  const participantsById = new Map();

  currentParticipants.forEach((participant) => {
    if (participant?.id) {
      participantsById.set(participant.id, participant);
    }
  });

  incomingParticipants.forEach((participant) => {
    if (participant?.id) {
      participantsById.set(participant.id, mergeParticipant(participantsById.get(participant.id), participant));
    }
  });

  return [...participantsById.values()].filter((participant) => !deletedIds.has(participant.id));
}

function mergeParticipant(currentParticipant = {}, incomingParticipant = {}) {
  const currentGoalArchivedAt = Number(currentParticipant.goalArchivedAt || 0);
  const incomingGoalArchivedAt = Number(incomingParticipant.goalArchivedAt || 0);
  const currentGoalCycleStartedAt = Number(currentParticipant.goalCycleStartedAt || 0);
  const incomingGoalCycleStartedAt = Number(incomingParticipant.goalCycleStartedAt || 0);
  const useIncomingGoalState =
    incomingGoalArchivedAt > currentGoalArchivedAt ||
    incomingGoalCycleStartedAt > currentGoalCycleStartedAt;
  const useCurrentGoalState =
    currentGoalArchivedAt > incomingGoalArchivedAt ||
    currentGoalCycleStartedAt > incomingGoalCycleStartedAt;
  const goalSource = useIncomingGoalState
    ? incomingParticipant
    : useCurrentGoalState
      ? currentParticipant
      : incomingParticipant;

  return {
    ...currentParticipant,
    ...incomingParticipant,
    passwordHash: incomingParticipant.passwordHash || currentParticipant.passwordHash || "",
    picture: incomingParticipant.picture || currentParticipant.picture || "",
    email: incomingParticipant.email || currentParticipant.email || "",
    authProvider: incomingParticipant.authProvider || currentParticipant.authProvider || "",
    goal: hasOwn(goalSource, "goal") ? goalSource.goal || "" : currentParticipant.goal || "",
    deadline: hasOwn(goalSource, "deadline") ? goalSource.deadline || "" : currentParticipant.deadline || "",
    deadlineLocked: Boolean(goalSource.deadlineLocked),
    goalCycleStartedAt: Math.max(currentGoalCycleStartedAt, incomingGoalCycleStartedAt),
    goalArchivedAt: Math.max(currentGoalArchivedAt, incomingGoalArchivedAt),
    taskListUpdatedAt: Math.max(
      getParticipantTaskListUpdatedAt(currentParticipant),
      getParticipantTaskListUpdatedAt(incomingParticipant),
    ),
    deadlineWarningDismissedFor:
      incomingParticipant.deadlineWarningDismissedFor || currentParticipant.deadlineWarningDismissedFor || "",
    onboardingCompleted: Boolean(incomingParticipant.onboardingCompleted || currentParticipant.onboardingCompleted),
    archivedGoals: mergeById(currentParticipant.archivedGoals, incomingParticipant.archivedGoals),
    tasks: chooseTaskList(currentParticipant.tasks, incomingParticipant.tasks, currentParticipant, incomingParticipant),
    completedGoalNotice: chooseCompletedGoalNotice(currentParticipant, incomingParticipant),
  };
}

function chooseCompletedGoalNotice(currentParticipant, incomingParticipant) {
  const currentTime = Math.max(
    Number(currentParticipant.goalArchivedAt || 0),
    Number(currentParticipant.goalCycleStartedAt || 0),
  );
  const incomingTime = Math.max(
    Number(incomingParticipant.goalArchivedAt || 0),
    Number(incomingParticipant.goalCycleStartedAt || 0),
  );
  if (incomingTime >= currentTime && hasOwn(incomingParticipant, "completedGoalNotice")) {
    return incomingParticipant.completedGoalNotice || null;
  }
  if (hasOwn(currentParticipant, "completedGoalNotice")) {
    return currentParticipant.completedGoalNotice || null;
  }
  return null;
}

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source || {}, key);
}

function mergeById(currentItems = [], incomingItems = []) {
  const itemsById = new Map();
  currentItems.forEach((item) => {
    if (item?.id) itemsById.set(item.id, item);
  });
  incomingItems.forEach((item) => {
    if (item?.id) itemsById.set(item.id, item);
  });
  return sortArchivedGoals([...itemsById.values()]);
}

function sortArchivedGoals(goals = []) {
  return [...goals].sort((a, b) => getArchivedGoalTime(b) - getArchivedGoalTime(a));
}

function getArchivedGoalTime(goal = {}) {
  return Math.max(Number(goal.completedAt || 0), Number(goal.archivedAt || 0));
}

function chooseTaskList(currentTasks = [], incomingTasks = [], currentParticipant = {}, incomingParticipant = {}) {
  const currentTaskListUpdatedAt = getParticipantTaskListUpdatedAt(currentParticipant);
  const incomingTaskListUpdatedAt = getParticipantTaskListUpdatedAt(incomingParticipant);
  if (incomingTasks.length === 0 && currentTasks.length > 0) {
    return incomingTaskListUpdatedAt >= currentTaskListUpdatedAt ? [] : currentTasks;
  }
  if (currentTasks.length === 0) return incomingTasks;
  const tasksById = new Map();
  currentTasks.forEach((task) => {
    if (task?.id) tasksById.set(task.id, task);
  });
  incomingTasks.forEach((task) => {
    if (task?.id) tasksById.set(task.id, mergeTask(tasksById.get(task.id), task));
  });

  const preferredOrder = getListUpdatedAt(incomingTasks) >= getListUpdatedAt(currentTasks)
    ? incomingTasks
    : currentTasks;
  const orderedTasks = [];
  preferredOrder.forEach((task) => {
    const mergedTask = tasksById.get(task.id);
    if (mergedTask) orderedTasks.push(mergedTask);
    tasksById.delete(task.id);
  });
  return orderTasksByCompletion([...orderedTasks, ...tasksById.values()]);
}

function mergeTask(currentTask = {}, incomingTask = {}) {
  const useIncomingTask = getItemUpdatedAt(incomingTask) >= getItemUpdatedAt(currentTask);
  const preferredTask = useIncomingTask ? incomingTask : currentTask;
  const fallbackTask = useIncomingTask ? currentTask : incomingTask;
  const subtasks = mergeSubtasks(currentTask.subtasks, incomingTask.subtasks);

  return {
    ...fallbackTask,
    ...preferredTask,
    done: Boolean(currentTask.done || incomingTask.done),
    order: getPreferredOrder(preferredTask, fallbackTask),
    subtasksHidden: subtasks.length > 0 && subtasks.every((subtask) => Boolean(subtask.done))
      ? true
      : Boolean(preferredTask.subtasksHidden),
    subtasks,
  };
}

function mergeSubtasks(currentSubtasks = [], incomingSubtasks = []) {
  const subtasksById = new Map();
  currentSubtasks.forEach((subtask) => {
    if (subtask?.id) subtasksById.set(subtask.id, subtask);
  });
  incomingSubtasks.forEach((subtask) => {
    if (!subtask?.id) return;
    const currentSubtask = subtasksById.get(subtask.id);
    subtasksById.set(subtask.id, mergeSubtask(currentSubtask, subtask));
  });

  const preferredOrder = getListUpdatedAt(incomingSubtasks) >= getListUpdatedAt(currentSubtasks)
    ? incomingSubtasks
    : currentSubtasks;
  const orderedSubtasks = [];
  preferredOrder.forEach((subtask) => {
    const mergedSubtask = subtasksById.get(subtask.id);
    if (mergedSubtask) orderedSubtasks.push(mergedSubtask);
    subtasksById.delete(subtask.id);
  });
  return orderSubtasksByCompletion([...orderedSubtasks, ...subtasksById.values()]);
}

function orderTasksByCompletion(tasks = []) {
  const incomplete = [];
  const complete = [];
  tasks.forEach((task) => {
    if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
      if (task.subtasks.every((subtask) => Boolean(subtask.done))) {
        complete.push(task);
      } else {
        incomplete.push(task);
      }
    } else if (task.done) {
      complete.push(task);
    } else {
      incomplete.push(task);
    }
  });
  return [...sortByOrder(incomplete), ...sortByOrder(complete)];
}

function orderSubtasksByCompletion(subtasks = []) {
  const incomplete = [];
  const complete = [];
  subtasks.forEach((subtask) => {
    if (subtask.done) {
      complete.push(subtask);
    } else {
      incomplete.push(subtask);
    }
  });
  return [...sortByOrder(incomplete), ...sortByOrder(complete)];
}

function sortByOrder(items = []) {
  return [...items].sort((a, b) => {
    const orderDiff = getOrderValue(a) - getOrderValue(b);
    if (orderDiff !== 0) return orderDiff;
    return Number(a.createdAt || 0) - Number(b.createdAt || 0);
  });
}

function getOrderValue(item = {}, fallback = 0) {
  const order = Number(item.order);
  if (Number.isFinite(order) && order > 0) return order;
  const createdAt = Number(item.createdAt);
  if (Number.isFinite(createdAt) && createdAt > 0) return createdAt;
  return fallback + 1;
}

function getPreferredOrder(preferredItem = {}, fallbackItem = {}) {
  const preferredOrder = Number(preferredItem.order);
  if (Number.isFinite(preferredOrder) && preferredOrder > 0) return preferredOrder;
  return getOrderValue(fallbackItem);
}

function mergeSubtask(currentSubtask = null, incomingSubtask = null) {
  if (!currentSubtask) return incomingSubtask;
  if (!incomingSubtask) return currentSubtask;

  const useIncomingSubtask = getItemUpdatedAt(incomingSubtask) >= getItemUpdatedAt(currentSubtask);
  const preferredSubtask = useIncomingSubtask ? incomingSubtask : currentSubtask;
  const fallbackSubtask = useIncomingSubtask ? currentSubtask : incomingSubtask;
  return {
    ...fallbackSubtask,
    ...preferredSubtask,
    done: Boolean(currentSubtask.done || incomingSubtask.done),
    order: getPreferredOrder(preferredSubtask, fallbackSubtask),
  };
}

function getListUpdatedAt(items = []) {
  return items.reduce((latest, item) => Math.max(latest, getItemUpdatedAt(item)), 0);
}

function getItemUpdatedAt(item = {}) {
  return Number(item.updatedAt || item.createdAt || 0);
}

function getParticipantTaskListUpdatedAt(participant = {}) {
  return Math.max(
    Number(participant.taskListUpdatedAt || 0),
    Number(participant.goalArchivedAt || 0),
    getListUpdatedAt(participant.tasks || []),
  );
}

function normalizeEditableMap(value = {}) {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, text]) => [String(key), String(text)])
      .filter(([key]) => key),
  );
}
