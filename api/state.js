const STORE_URL = "https://jsonblob.com/api/jsonBlob/019e46e2-c1d5-7c5b-bd04-d9710184ec78";

function normalizeSharedState(value) {
  const source = value && typeof value === "object" ? value : {};

  return {
    participants: Array.isArray(source.participants) ? source.participants : [],
    adminPasswordHashV2: source.adminPasswordHashV2 || source.adminPasswordHash || "",
    adminPasswordChanged: Boolean(source.adminPasswordChanged),
    registrationPasswordHash: source.registrationPasswordHash || "",
    siteImages: normalizeSiteImages(source.siteImages),
    uiText: normalizeEditableMap(source.uiText),
    uiPlaceholders: normalizeEditableMap(source.uiPlaceholders),
    announcement: source.announcement || null,
    deletedParticipantIds: Array.isArray(source.deletedParticipantIds)
      ? source.deletedParticipantIds
      : [],
    allowEmptyParticipants: Boolean(source.allowEmptyParticipants),
    allowEmptyRegistrationPassword: Boolean(source.allowEmptyRegistrationPassword),
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
      : { participants: [], adminPasswordHashV2: "", adminPasswordChanged: false, registrationPasswordHash: "", siteImages: normalizeSiteImages(), uiText: {}, uiPlaceholders: {}, announcement: null, deletedParticipantIds: [] };
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
  return {
    ...currentParticipant,
    ...incomingParticipant,
    passwordHash: incomingParticipant.passwordHash || currentParticipant.passwordHash || "",
    picture: incomingParticipant.picture || currentParticipant.picture || "",
    email: incomingParticipant.email || currentParticipant.email || "",
    authProvider: incomingParticipant.authProvider || currentParticipant.authProvider || "",
    goal: incomingParticipant.goal || currentParticipant.goal || "",
    deadline: incomingParticipant.deadline || currentParticipant.deadline || "",
    deadlineLocked: Boolean(incomingParticipant.deadlineLocked || currentParticipant.deadlineLocked),
    deadlineWarningDismissedFor:
      incomingParticipant.deadlineWarningDismissedFor || currentParticipant.deadlineWarningDismissedFor || "",
    onboardingCompleted: Boolean(incomingParticipant.onboardingCompleted || currentParticipant.onboardingCompleted),
    archivedGoals: mergeById(currentParticipant.archivedGoals, incomingParticipant.archivedGoals),
    tasks: chooseTaskList(currentParticipant.tasks, incomingParticipant.tasks),
    completedGoalNotice: incomingParticipant.completedGoalNotice || currentParticipant.completedGoalNotice || null,
  };
}

function mergeById(currentItems = [], incomingItems = []) {
  const itemsById = new Map();
  currentItems.forEach((item) => {
    if (item?.id) itemsById.set(item.id, item);
  });
  incomingItems.forEach((item) => {
    if (item?.id) itemsById.set(item.id, item);
  });
  return [...itemsById.values()];
}

function chooseTaskList(currentTasks = [], incomingTasks = []) {
  if (incomingTasks.length === 0 && currentTasks.length > 0) return currentTasks;
  if (currentTasks.length === 0) return incomingTasks;
  return incomingTasks.length >= currentTasks.length ? incomingTasks : currentTasks;
}

function normalizeEditableMap(value = {}) {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, text]) => [String(key), String(text)])
      .filter(([key]) => key),
  );
}
