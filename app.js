const STORAGE_KEY = "boddy-board-v2";
const SESSION_KEY = "boddy-board-session-v1";
const LEGACY_KEYS = ["boddy-board-v1", "goal-board-v1"];
const SHARED_STATE_URL = "https://boddy-board-github.vercel.app/api/state";
const ADMIN_LOGIN = "Sasha";
const DEFAULT_ADMIN_PASSWORD = "S_asha2305";
const PASSWORD_RESET_CODE = "Любовь";
const DEFAULT_LOGO_URL = "assets/boddy-logo.jpg";
const DEFAULT_COVER_URL = "assets/boddy-cover.png";
const COMPLETED_GOAL_NOTICE_TTL = 7 * 24 * 60 * 60 * 1000;

const defaultParticipant = {
  id: crypto.randomUUID(),
  name: "Пример",
  passwordHash: "",
  goal: "Провести сильную неделю Boddy",
  deadline: "",
  deadlineLocked: false,
  tasks: [
    createTask("Написать цель", true),
    createTask("Разбить цель на шаги", true),
    createTask("Сделать первый шаг", false),
  ],
};

let state = createInitialState();
let dragState = null;
let pendingTouchDrag = null;
let textEditMode = false;
let pendingSharedSaveCount = 0;
let lastLocalWriteAt = 0;
let scheduledSaveTimer = 0;
let pendingDeadlineConfirmation = null;
const LOCAL_WRITE_GRACE_MS = 3000;

const openLoginButton = document.querySelector("#openLoginButton");
const participantLogoutButton = document.querySelector("#participantLogoutButton");
const openAdminButton = document.querySelector("#openAdminButton");
const openAdminSettingsButton = document.querySelector("#openAdminSettingsButton");
const toggleTextEditButton = document.querySelector("#toggleTextEditButton");
const openRegistrationPasswordButton = document.querySelector("#openRegistrationPasswordButton");
const registrationStatus = document.querySelector("#registrationStatus");
const welcomeGate = document.querySelector("#welcomeGate");
const welcomeRegistrationKeyInput = document.querySelector("#welcomeRegistrationKeyInput");
const welcomeNameInput = document.querySelector("#welcomeNameInput");
const welcomePasswordInput = document.querySelector("#welcomePasswordInput");
const welcomeParticipantPhotoInput = document.querySelector("#welcomeParticipantPhotoInput");
const welcomeJoinButton = document.querySelector("#welcomeJoinButton");
const welcomeAuthMessage = document.querySelector("#welcomeAuthMessage");
const loginModal = document.querySelector("#loginModal");
const adminModal = document.querySelector("#adminModal");
const adminNewsModal = document.querySelector("#adminNewsModal");
const registrationPasswordModal = document.querySelector("#registrationPasswordModal");
const tourModal = document.querySelector("#tourModal");
const tourCard = document.querySelector("#tourCard");
const tourTitle = document.querySelector("#tourTitle");
const tourDescription = document.querySelector("#tourDescription");
const tourStepCounter = document.querySelector("#tourStepCounter");
const tourNextButton = document.querySelector("#tourNextButton");
const tourSkipButton = document.querySelector("#tourSkipButton");
const nameInput = document.querySelector("#nameInput");
const passwordInput = document.querySelector("#passwordInput");
const registrationKeyInput = document.querySelector("#registrationKeyInput");
const participantPhotoInput = document.querySelector("#participantPhotoInput");
const joinButton = document.querySelector("#joinButton");
const googleSignInButton = document.querySelector("#googleSignInButton");
const adminLoginPanel = document.querySelector("#adminLoginPanel");
const adminSettingsPanel = document.querySelector("#adminSettingsPanel");
const adminUsernameInput = document.querySelector("#adminUsernameInput");
const adminPasswordInput = document.querySelector("#adminPasswordInput");
const newAdminPasswordInput = document.querySelector("#newAdminPasswordInput");
const saveAdminPasswordButton = document.querySelector("#saveAdminPasswordButton");
const forgotAdminPasswordButton = document.querySelector("#forgotAdminPasswordButton");
const passwordResetModal = document.querySelector("#passwordResetModal");
const passwordResetCodeInput = document.querySelector("#passwordResetCodeInput");
const resetAllPasswordsButton = document.querySelector("#resetAllPasswordsButton");
const passwordResetMessage = document.querySelector("#passwordResetMessage");
const participantPhotoSelect = document.querySelector("#participantPhotoSelect");
const participantPhotoUrlInput = document.querySelector("#participantPhotoUrlInput");
const participantPhotoFileInput = document.querySelector("#participantPhotoFileInput");
const saveParticipantPhotoButton = document.querySelector("#saveParticipantPhotoButton");
const clearParticipantPhotoButton = document.querySelector("#clearParticipantPhotoButton");
const saveRegistrationPasswordButton = document.querySelector("#saveRegistrationPasswordButton");
const clearRegistrationPasswordButton = document.querySelector("#clearRegistrationPasswordButton");
const registrationPasswordInput = document.querySelector("#registrationPasswordInput");
const registrationPasswordStatus = document.querySelector("#registrationPasswordStatus");
const registrationPasswordMessage = document.querySelector("#registrationPasswordMessage");
const adminLoginButton = document.querySelector("#adminLoginButton");
const openAnnouncementButton = document.querySelector("#openAnnouncementButton");
const adminLogoutButton = document.querySelector("#adminLogoutButton");
const adminAnnouncementPanel = document.querySelector("#adminAnnouncementPanel");
const announcementInput = document.querySelector("#announcementInput");
const announcementRecipientSelect = document.querySelector("#announcementRecipientSelect");
const publishAnnouncementButton = document.querySelector("#publishAnnouncementButton");
const deleteAnnouncementButton = document.querySelector("#deleteAnnouncementButton");
const announcementMessage = document.querySelector("#announcementMessage");
const announcementReadList = document.querySelector("#announcementReadList");
const announcementModal = document.querySelector("#announcementModal");
const closeAnnouncementButton = document.querySelector("#closeAnnouncementButton");
const announcementText = document.querySelector("#announcementText");
const deadlineWarningModal = document.querySelector("#deadlineWarningModal");
const closeDeadlineWarningButton = document.querySelector("#closeDeadlineWarningButton");
const deadlineWarningText = document.querySelector("#deadlineWarningText");
const deadlineConfirmModal = document.querySelector("#deadlineConfirmModal");
const deadlineConfirmDate = document.querySelector("#deadlineConfirmDate");
const editDeadlineConfirmButton = document.querySelector("#editDeadlineConfirmButton");
const closeDeadlineConfirmButton = document.querySelector("#closeDeadlineConfirmButton");
const cancelDeadlineConfirmButton = document.querySelector("#cancelDeadlineConfirmButton");
const confirmDeadlineButton = document.querySelector("#confirmDeadlineButton");
const activeBadge = document.querySelector("#activeBadge");
const brandLogo = document.querySelector("#brandLogo");
const logoImageInput = document.querySelector("#logoImageInput");
const heroCover = document.querySelector("#heroCover");
const coverImageInput = document.querySelector("#coverImageInput");
const authMessage = document.querySelector("#authMessage");
const adminMessage = document.querySelector("#adminMessage");
const peopleCount = document.querySelector("#peopleCount");
const totalTasks = document.querySelector("#totalTasks");
const doneTasks = document.querySelector("#doneTasks");
const resultChart = document.querySelector("#resultChart");
const resultTable = document.querySelector("#resultTable");
const deleteColumnHeader = document.querySelector("#deleteColumnHeader");
const profileView = document.querySelector("#profileView");
const chartTemplate = document.querySelector("#chartTemplate");
const tableRowTemplate = document.querySelector("#tableRowTemplate");
const profileTemplate = document.querySelector("#profileTemplate");
const taskTemplate = document.querySelector("#taskTemplate");
const subtaskTemplate = document.querySelector("#subtaskTemplate");

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_OAUTH_CLIENT_ID";

initialize();

openLoginButton.addEventListener("click", () => openModal(loginModal, registrationKeyInput || nameInput));
openAdminButton?.addEventListener("click", openAdminPanel);
openAdminSettingsButton?.addEventListener("click", openAdminPanel);
toggleTextEditButton?.addEventListener("click", toggleTextEditMode);
openRegistrationPasswordButton?.addEventListener("click", () => openModal(registrationPasswordModal, registrationPasswordInput));
tourNextButton?.addEventListener("click", advanceTour);
tourSkipButton?.addEventListener("click", skipTour);
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.closest("#tourModal")) {
      skipTour();
      return;
    }
    closeModals();
  });
});
document.querySelectorAll(".modal-layer").forEach((layer) => {
  layer.addEventListener("click", (event) => {
    if (event.target !== layer) return;
    if (layer === tourModal) return;
    if (layer === announcementModal) {
      markAnnouncementRead();
      return;
    }
    if (layer === deadlineWarningModal) {
      dismissDeadlineWarning();
      return;
    }
    if (layer === deadlineConfirmModal) {
      resolveDeadlineConfirmation(false);
      return;
    }
    closeModals();
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!announcementModal.hidden) {
    markAnnouncementRead();
    return;
  }
  if (deadlineWarningModal && !deadlineWarningModal.hidden) {
    dismissDeadlineWarning();
    return;
  }
  if (deadlineConfirmModal && !deadlineConfirmModal.hidden) {
    resolveDeadlineConfirmation(false);
    return;
  }
  closeModals();
});
document.addEventListener("click", handleEditableTextClick, true);
joinButton.addEventListener("click", joinAsParticipant);
welcomeJoinButton?.addEventListener("click", () => joinAsParticipant({
  nameInput: welcomeNameInput,
  passwordInput: welcomePasswordInput,
  registrationKeyInput: welcomeRegistrationKeyInput,
  participantPhotoInput: welcomeParticipantPhotoInput,
  messageElement: welcomeAuthMessage,
}));
participantLogoutButton.addEventListener("click", logoutParticipant);
adminLoginButton.addEventListener("click", loginAsAdmin);
saveAdminPasswordButton?.addEventListener("click", saveAdminPassword);
forgotAdminPasswordButton?.addEventListener("click", openPasswordResetModal);
resetAllPasswordsButton?.addEventListener("click", resetAllPasswords);
brandLogo?.addEventListener("click", () => openSiteImagePicker(logoImageInput));
heroCover?.addEventListener("click", () => openSiteImagePicker(coverImageInput));
logoImageInput?.addEventListener("change", () => updateSiteImage("logo", logoImageInput));
coverImageInput?.addEventListener("change", () => updateSiteImage("cover", coverImageInput));
saveParticipantPhotoButton?.addEventListener("click", saveParticipantPhoto);
clearParticipantPhotoButton?.addEventListener("click", clearParticipantPhoto);
participantPhotoSelect?.addEventListener("change", syncParticipantPhotoInput);
openAnnouncementButton.addEventListener("click", openAdminNewsModal);
openRegistrationPasswordButton?.addEventListener("click", () => openModal(registrationPasswordModal, registrationPasswordInput));
saveRegistrationPasswordButton?.addEventListener("click", saveRegistrationPassword);
clearRegistrationPasswordButton?.addEventListener("click", clearRegistrationPassword);
adminLogoutButton.addEventListener("click", logoutAdmin);
publishAnnouncementButton.addEventListener("click", publishAnnouncement);
deleteAnnouncementButton.addEventListener("click", deleteAnnouncement);
closeAnnouncementButton.addEventListener("click", markAnnouncementRead);
closeDeadlineWarningButton?.addEventListener("click", dismissDeadlineWarning);
editDeadlineConfirmButton?.addEventListener("click", () => resolveDeadlineConfirmation("edit"));
closeDeadlineConfirmButton?.addEventListener("click", () => resolveDeadlineConfirmation(false));
cancelDeadlineConfirmButton?.addEventListener("click", () => resolveDeadlineConfirmation("edit"));
confirmDeadlineButton?.addEventListener("click", () => resolveDeadlineConfirmation(true));
window.addEventListener("resize", scheduleTourPositionUpdate);
window.addEventListener("scroll", scheduleTourPositionUpdate, { passive: true });
window.addEventListener("focus", refreshSharedState);
window.addEventListener("beforeunload", () => {
  if (scheduledSaveTimer) {
    saveState();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && scheduledSaveTimer) {
    saveState();
  }
  if (!document.hidden) {
    refreshSharedState();
  }
});
setInterval(refreshSharedState, 5000);
[registrationKeyInput, nameInput, passwordInput].forEach((input) => {
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      joinAsParticipant();
    }
  });
});
[welcomeRegistrationKeyInput, welcomeNameInput, welcomePasswordInput].forEach((input) => {
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      joinAsParticipant({
        nameInput: welcomeNameInput,
        passwordInput: welcomePasswordInput,
        registrationKeyInput: welcomeRegistrationKeyInput,
        participantPhotoInput: welcomeParticipantPhotoInput,
        messageElement: welcomeAuthMessage,
      });
    }
  });
});
adminPasswordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loginAsAdmin();
  }
});
passwordResetCodeInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    resetAllPasswords();
  }
});
adminUsernameInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    adminPasswordInput.focus();
  }
});
newAdminPasswordInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveAdminPassword();
  }
});

function createTask(title, done = false, subtasks = []) {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title,
    done,
    createdAt: now,
    updatedAt: now,
    subtasks,
    subtasksHidden: true,
  };
}

function createDefaultSiteImages() {
  return {
    logo: DEFAULT_LOGO_URL,
    cover: DEFAULT_COVER_URL,
  };
}

async function initialize() {
  state = await loadState();
  restoreLocalSession();
  loadGoogleIdentity();
  if (archiveFinishedGoals()) {
    saveState();
  }
  if (clearExpiredCompletedGoalNotices()) {
    saveState();
  }
  render();
  if (isAdminRoute()) {
    openAdminPanel();
  }
}

async function refreshSharedState() {
  if (pendingSharedSaveCount > 0 || Date.now() - lastLocalWriteAt < LOCAL_WRITE_GRACE_MS) return;
  if (isEditingParticipantContent()) return;
  if (loginModal && !loginModal.hidden) return;
  if (adminNewsModal && !adminNewsModal.hidden && document.activeElement === announcementInput) return;

  try {
    const freshState = await fetchSharedState();
    const previousSharedState = JSON.stringify(toSharedState(state));
    const nextSharedState = JSON.stringify(toSharedState(freshState));
    if (previousSharedState === nextSharedState) return;

    const activeParticipantId = state.activeParticipantId;
    const viewedParticipantId = state.viewedParticipantId;
    const isAdmin = state.isAdmin;
    const activeAnnouncementText = announcementInput.value;

    state = freshState;
    state.activeParticipantId = freshState.participants.some((person) => person.id === activeParticipantId)
      ? activeParticipantId
      : "";
    state.viewedParticipantId = freshState.participants.some((person) => person.id === viewedParticipantId)
      ? viewedParticipantId
      : freshState.participants[0]?.id || "";
    state.isAdmin = isAdmin;
    persistLocalSession();
    const hasArchivedGoals = archiveFinishedGoals();
    const hasExpiredNotices = clearExpiredCompletedGoalNotices();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
    if (hasArchivedGoals || hasExpiredNotices) {
      saveSharedState(state);
    }
    render();
    if (adminNewsModal && !adminNewsModal.hidden && document.activeElement === announcementInput) {
      announcementInput.value = activeAnnouncementText;
    }
  } catch {
    // Если связь пропала, продолжаем работать с последней локальной копией.
  }
}

async function loadState() {
  const localState = loadLocalState();

  try {
    const sharedState = await fetchSharedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(sharedState)));
    return sharedState;
  } catch {
    return localState;
  }
}

function loadLocalState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.participants)) return normalizeState(parsed);
    } catch {
      return createInitialState();
    }
  }

  return migrateLegacyState() || createInitialState();
}

function normalizeState(candidate) {
  const participants = candidate.participants.map((person) => ({
    id: person.id || crypto.randomUUID(),
    name: person.name || "Участник",
    email: person.email || "",
    picture: person.picture || "",
    authProvider: person.authProvider || "",
    passwordHash: person.passwordHash || "",
    goal: person.goal || "",
    deadline: person.deadline || "",
    deadlineLocked: Boolean(person.deadlineLocked),
    deadlineWarningDismissedFor: person.deadlineWarningDismissedFor || "",
    goalCycleStartedAt: Number(person.goalCycleStartedAt || 0),
    goalArchivedAt: Number(person.goalArchivedAt || 0),
    taskListUpdatedAt: Number(person.taskListUpdatedAt || 0),
    onboardingCompleted: Boolean(person.onboardingCompleted),
    completedGoalNotice: normalizeCompletedGoalNotice(person.completedGoalNotice),
    archivedGoals: Array.isArray(person.archivedGoals)
      ? person.archivedGoals.map((goal) => ({
          id: goal.id || crypto.randomUUID(),
          title: goal.title || "Цель без названия",
          deadline: goal.deadline || "",
          status: goal.status === "completed" ? "completed" : "expired",
          progress: Number.isFinite(goal.progress) ? goal.progress : 0,
          doneTasks: Number.isFinite(goal.doneTasks) ? goal.doneTasks : 0,
          totalTasks: Number.isFinite(goal.totalTasks) ? goal.totalTasks : 0,
          archivedAt: goal.archivedAt || Date.now(),
        }))
      : [],
    tasks: Array.isArray(person.tasks)
      ? person.tasks.map((task) => ({
          id: task.id || crypto.randomUUID(),
          title: task.title || "Шаг",
          done: Boolean(task.done || task.status === "done"),
          createdAt: task.createdAt || Date.now(),
          updatedAt: task.updatedAt || task.createdAt || Date.now(),
          subtasks: Array.isArray(task.subtasks)
            ? task.subtasks.map((subtask) => ({
                id: subtask.id || crypto.randomUUID(),
                title: subtask.title || "Доп. шаг",
                done: Boolean(subtask.done || subtask.status === "done"),
                createdAt: subtask.createdAt || Date.now(),
                updatedAt: subtask.updatedAt || subtask.createdAt || Date.now(),
              }))
            : [],
          subtasksHidden: typeof task.subtasksHidden === "boolean" ? task.subtasksHidden : true,
        }))
      : [],
  }));
  participants.forEach(normalizeParticipantTasks);

  return {
    activeParticipantId: "",
    viewedParticipantId: candidate.viewedParticipantId || participants[0]?.id || "",
    adminPasswordHash: candidate.adminPasswordHashV2 || "",
    adminPasswordChanged: Boolean(candidate.adminPasswordChanged),
    registrationPasswordHash: candidate.registrationPasswordHash || "",
    siteImages: normalizeSiteImages(candidate.siteImages),
    uiText: normalizeEditableMap(candidate.uiText),
    uiPlaceholders: normalizeEditableMap(candidate.uiPlaceholders),
    announcement: normalizeAnnouncement(candidate.announcement),
    announcementDeletedAt: Number(candidate.announcementDeletedAt || 0),
    deletedParticipantIds: Array.isArray(candidate.deletedParticipantIds)
      ? candidate.deletedParticipantIds
      : [],
    isAdmin: false,
    participants,
  };
}

function normalizeAnnouncement(announcement) {
  if (!announcement || typeof announcement !== "object") {
    return null;
  }

  return {
    id: announcement.id || crypto.randomUUID(),
    text: String(announcement.text || "").trim(),
    createdAt: announcement.createdAt || Date.now(),
    updatedAt: announcement.updatedAt || announcement.createdAt || Date.now(),
    recipient: normalizeAnnouncementRecipient(announcement.recipient),
    readBy: Array.isArray(announcement.readBy) ? announcement.readBy : [],
  };
}

function normalizeAnnouncementRecipient(recipient) {
  if (!recipient || typeof recipient !== "object") {
    return { type: "all", participantId: "" };
  }

  const type = recipient.type === "participant" ? "participant" : "all";
  return {
    type,
    participantId: type === "participant" ? String(recipient.participantId || "") : "",
  };
}

function normalizeCompletedGoalNotice(notice) {
  if (!notice || typeof notice !== "object") return null;

  const completedAt = Number(notice.completedAt) || Date.now();
  const expiresAt = Number(notice.expiresAt) || completedAt + COMPLETED_GOAL_NOTICE_TTL;
  if (expiresAt <= Date.now()) return null;

  return {
    id: notice.id || crypto.randomUUID(),
    title: String(notice.title || "Цель без названия"),
    completedAt,
    expiresAt,
  };
}

function normalizeSiteImages(siteImages) {
  const defaults = createDefaultSiteImages();
  if (!siteImages || typeof siteImages !== "object") {
    return defaults;
  }

  const cover = String(siteImages.cover || "").trim();
  return {
    logo: String(siteImages.logo || "").trim() || defaults.logo,
    cover: !cover || cover === DEFAULT_LOGO_URL ? defaults.cover : cover,
  };
}

function normalizeEditableMap(value) {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, text]) => [String(key), String(text)])
      .filter(([key]) => key),
  );
}

function migrateLegacyState() {
  const groupState = localStorage.getItem(LEGACY_KEYS[0]);
  if (groupState) {
    try {
      const parsed = JSON.parse(groupState);
      if (Array.isArray(parsed.participants)) {
        return normalizeState({
          ...parsed,
          viewedParticipantId: parsed.activeParticipantId || parsed.participants[0]?.id || "",
        });
      }
    } catch {
      return null;
    }
  }

  const singleState = localStorage.getItem(LEGACY_KEYS[1]);
  if (!singleState) return null;

  try {
    const parsed = JSON.parse(singleState);
    if (!Array.isArray(parsed.tasks)) return null;
    const participant = {
      id: crypto.randomUUID(),
      name: "Я",
      passwordHash: "",
      goal: parsed.goal || "Моя цель",
      deadline: parsed.deadline || "",
      goalCycleStartedAt: Date.now(),
      goalArchivedAt: 0,
      taskListUpdatedAt: Date.now(),
      archivedGoals: [],
      tasks: parsed.tasks.map((task) => ({
        id: crypto.randomUUID(),
        title: task.title,
        done: task.status === "done",
        createdAt: task.createdAt || Date.now(),
        updatedAt: task.updatedAt || task.createdAt || Date.now(),
      })),
    };

    return {
      activeParticipantId: "",
      viewedParticipantId: participant.id,
      adminPasswordHash: "",
      adminPasswordChanged: false,
      siteImages: createDefaultSiteImages(),
      uiText: {},
      uiPlaceholders: {},
      announcement: null,
      deletedParticipantIds: [],
      isAdmin: false,
      participants: [participant],
    };
  } catch {
    return null;
  }
}

function createInitialState() {
  return {
    activeParticipantId: "",
    viewedParticipantId: "",
    adminPasswordHash: "",
    adminPasswordChanged: false,
    registrationPasswordHash: "",
    siteImages: createDefaultSiteImages(),
    uiText: {},
    uiPlaceholders: {},
    announcement: null,
    announcementDeletedAt: 0,
    deletedParticipantIds: [],
    isAdmin: false,
    participants: [],
  };
}

function restoreLocalSession() {
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }

  if (!session?.participantId) return;

  const participant = state.participants.find((person) => person.id === session.participantId);
  if (!participant) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
}

function persistLocalSession() {
  if (!state.activeParticipantId) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    participantId: state.activeParticipantId,
  }));
}

function loadGoogleIdentity() {
  if (!googleSignInButton) return;
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_OAUTH_CLIENT_ID") {
    googleSignInButton.hidden = true;
    return;
  }

  const existing = document.querySelector("#google-identity-script");
  if (existing) {
    if (window.google?.accounts?.id) {
      initGoogleIdentity();
    }
    return;
  }

  const script = document.createElement("script");
  script.id = "google-identity-script";
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = initGoogleIdentity;
  document.head.appendChild(script);
}

function initGoogleIdentity() {
  if (!window.google?.accounts?.id || !googleSignInButton) return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredentialResponse,
    cancel_on_tap_outside: true,
  });

  google.accounts.id.renderButton(googleSignInButton, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    locale: "ru",
  });
}

function handleGoogleCredentialResponse(response) {
  if (!response?.credential) {
    showAuthMessage("Не удалось получить данные Google.", true);
    return;
  }

  const profile = parseJwt(response.credential);
  if (!profile) {
    showAuthMessage("Не удалось разобрать данные Google.", true);
    return;
  }

  joinWithGoogle({
    email: profile.email || "",
    name: profile.name || "Пользователь",
    picture: profile.picture || "",
  });
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function joinWithGoogle({ email, name, picture }) {
  if (!email) {
    showAuthMessage("Google не вернул адрес электронной почту.", true);
    return;
  }

  let participant = state.participants.find((person) => person.email === email);
  const isNew = !participant;

  if (!participant) {
    if (state.registrationPasswordHash) {
      const registrationKey = registrationKeyInput?.value.trim();
      if (!registrationKey) {
        showAuthMessage("Для регистрации нового участника введите пароль администратора.", true);
        registrationKeyInput?.focus();
        return;
      }
      const registrationHash = await hashPassword("registration", registrationKey);
      if (registrationHash !== state.registrationPasswordHash) {
        showAuthMessage("Неверный пароль регистрации. Узнайте его у администратора.", true);
        registrationKeyInput?.select();
        return;
      }
    } else {
      showAuthMessage("Регистрация закрыта. Узнайте пароль у администратора.", true);
      return;
    }

    createGoogleParticipant({ email, name, picture, isNew });
    return;
  }

  participant.name = name || participant.name;
  participant.picture = picture || participant.picture;
  participant.authProvider = "google";
  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
  saveState();
  closeModals();
  render();
  showAuthMessage("С возвращением!", false);
  if (!participant.onboardingCompleted) {
    openTour(participant.id);
  }
}

function createGoogleParticipant({ email, name, picture, isNew }) {
  const participant = {
    id: crypto.randomUUID(),
    name,
    email,
    picture,
    authProvider: "google",
    passwordHash: "",
    goal: "",
    deadline: "",
    deadlineLocked: false,
    goalCycleStartedAt: Date.now(),
    goalArchivedAt: 0,
    taskListUpdatedAt: Date.now(),
    tasks: [],
    archivedGoals: [],
    onboardingCompleted: false,
  };
  state.participants.push(participant);
  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
  if (registrationKeyInput) registrationKeyInput.value = "";
  saveState();
  closeModals();
  render();
  showAuthMessage(isNew ? "Вы вошли через Google." : "С возвращением!", false);
  if (!participant.onboardingCompleted) {
    openTour(participant.id);
  }
}

async function saveRegistrationPassword() {
  const value = registrationPasswordInput?.value.trim();
  if (!value) {
    if (registrationPasswordMessage) {
      registrationPasswordMessage.textContent = "Введите пароль для регистрации.";
      registrationPasswordMessage.classList.add("is-error");
    }
    registrationPasswordInput?.focus();
    return;
  }

  state.registrationPasswordHash = await hashPassword("registration", value);
  saveState();
  if (registrationPasswordStatus) {
    registrationPasswordStatus.textContent = "Пароль регистрации установлен. Новые участники смогут регистрироваться только при его вводе.";
  }
  if (registrationPasswordMessage) {
    registrationPasswordMessage.textContent = "Пароль регистрации установлен.";
    registrationPasswordMessage.classList.remove("is-error");
  }
  if (clearRegistrationPasswordButton) {
    clearRegistrationPasswordButton.hidden = false;
  }
  registrationPasswordInput.value = "";
}

function clearRegistrationPassword() {
  state.registrationPasswordHash = "";
  saveState({ allowEmptyRegistrationPassword: true });
  if (registrationPasswordStatus) {
    registrationPasswordStatus.textContent = "Пароль регистрации удалён. Регистрация новых участников теперь закрыта.";
  }
  if (registrationPasswordMessage) {
    registrationPasswordMessage.textContent = "Пароль регистрации удалён. Регистрация новых участников будет закрыта.";
    registrationPasswordMessage.classList.remove("is-error");
  }
  if (clearRegistrationPasswordButton) {
    clearRegistrationPasswordButton.hidden = true;
  }
  registrationPasswordInput.value = "";
}

function saveState(options = {}) {
  if (scheduledSaveTimer) {
    clearTimeout(scheduledSaveTimer);
    scheduledSaveTimer = 0;
  }
  const sharedState = toSharedState(state, options);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState));
  persistLocalSession();
  lastLocalWriteAt = Date.now();
  pendingSharedSaveCount += 1;
  return saveSharedState(state, options).finally(() => {
    pendingSharedSaveCount = Math.max(0, pendingSharedSaveCount - 1);
  });
}

function scheduleSaveState(delay = 450) {
  lastLocalWriteAt = Date.now();
  if (scheduledSaveTimer) {
    clearTimeout(scheduledSaveTimer);
  }
  scheduledSaveTimer = window.setTimeout(() => {
    scheduledSaveTimer = 0;
    saveState();
  }, delay);
}

const tourSteps = [
  {
    selector: "#activeBadge",
    title: "Ваша текущая учётная запись",
    text: "Стрелка указывает на вашу текущую учётную запись: имя, статус и аватар.",
    placement: "bottom",
  },
  {
    selector: "#resultChart",
    title: "Движение участников",
    text: "Здесь виден прогресс команды. Чем выше столбец — тем ближе участник к цели.",
    placement: "bottom",
  },
  {
    selector: "#resultTable",
    title: "Таблица участников",
    text: "В таблице показаны участники, их цель, срок и сколько шагов выполнено.",
    placement: "right",
  },
  {
    selector: ".person-goal",
    title: "Основная цель",
    text: "Впишите сюда основную цель. Она станет центральной задачей вашего профиля.",
    placement: "right",
  },
  {
    selector: ".task-form .task-input",
    title: "Добавление шагов",
    text: "Введите основной шаг сюда, чтобы создать новую карточку плана.",
    placement: "top",
  },
  {
    selector: ".add-subtask",
    title: "Дополнительные шаги",
    text: "Нажмите «Добавить доп. шаг», чтобы разбить основной шаг на дополнительные действия.",
    placement: "top",
  },
  {
    selector: ".person-progress",
    title: "Прогресс цели",
    text: "Здесь отображается ваш прогресс: процент и количество выполненных шагов.",
    placement: "left",
  },
];

let currentTourParticipantId = "";
let currentTourStep = 0;
let currentTourTarget = null;
let tourPositionFrame = 0;

function openTour(participantId) {
  if (!tourModal || !tourCard) return;
  const participant = findParticipant(participantId);
  if (participant) {
    state.viewedParticipantId = participant.id;
    render();
  }
  currentTourParticipantId = participantId;
  currentTourStep = 0;
  loginModal.hidden = true;
  adminModal.hidden = true;
  adminNewsModal.hidden = true;
  announcementModal.hidden = true;
  registrationPasswordModal.hidden = true;
  tourModal.hidden = false;
  renderTourStep();
}

function renderTourStep() {
  if (!tourModal || tourModal.hidden) return;
  const step = tourSteps[currentTourStep];
  tourTitle.textContent = step.title;
  tourDescription.textContent = step.text;
  tourStepCounter.textContent = `Шаг ${currentTourStep + 1} из ${tourSteps.length}`;
  tourNextButton.textContent = currentTourStep < tourSteps.length - 1 ? "Далее" : "Завершить";

  const target = getTourTarget(step);
  updateTourHighlight(target);
  positionTourCard(target, step.placement || "bottom");
}

function getTourTarget(step) {
  const primaryTarget = document.querySelector(step.selector);
  if (isTourTargetVisible(primaryTarget)) {
    return primaryTarget;
  }

  if (step.selector === ".add-subtask") {
    return document.querySelector(".task-list") || document.querySelector(".task-form") || document.querySelector("#profileView");
  }

  if (step.selector === ".person-goal") {
    return document.querySelector(".person-goal") || document.querySelector("#profileView");
  }

  return document.querySelector("#profileView") || document.body;
}

function isTourTargetVisible(target) {
  if (!target || !target.closest("body")) return false;
  const rect = target.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function advanceTour() {
  if (currentTourStep < tourSteps.length - 1) {
    currentTourStep += 1;
    renderTourStep();
    return;
  }

  const participant = findParticipant(currentTourParticipantId);
  if (participant) {
    participant.onboardingCompleted = true;
    saveState();
  }
  tourModal.hidden = true;
  clearTourHighlight();
  cancelTourPositionUpdate();
}

function skipTour() {
  const participant = findParticipant(currentTourParticipantId);
  if (participant) {
    participant.onboardingCompleted = true;
    saveState();
  }
  closeModals();
}

function updateTourHighlight(target) {
  clearTourHighlight();
  if (!target || target === document.body) return;
  currentTourTarget = target;
  target.classList.add("tour-highlight");
}

function clearTourHighlight() {
  if (currentTourTarget) {
    currentTourTarget.classList.remove("tour-highlight");
    currentTourTarget = null;
  }
}

function positionTourCard(target, placement) {
  if (!tourCard) return;

  if (target !== document.body) {
    target.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }

  cancelTourPositionUpdate();
  tourPositionFrame = requestAnimationFrame(() => {
    placeTourCard(target, placement);
    window.setTimeout(() => placeTourCard(target, placement), 320);
  });
}

function scheduleTourPositionUpdate() {
  if (!tourModal || tourModal.hidden || !currentTourTarget) return;
  cancelTourPositionUpdate();
  tourPositionFrame = requestAnimationFrame(() => {
    const step = tourSteps[currentTourStep];
    placeTourCard(currentTourTarget, step?.placement || "bottom");
  });
}

function cancelTourPositionUpdate() {
  if (!tourPositionFrame) return;
  cancelAnimationFrame(tourPositionFrame);
  tourPositionFrame = 0;
}

function placeTourCard(target, placement) {
  if (!tourCard || !target) return;

  const rect = target.getBoundingClientRect();
  const cardRect = tourCard.getBoundingClientRect();
  const offset = 14;
  let top = 0;
  let left = 0;

  if (isSmallTourViewport()) {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    tourCard.classList.add("placement-bottom");
    tourCard.classList.remove("placement-top", "placement-left", "placement-right");
    tourCard.style.top = `${Math.max(10, viewportHeight - cardRect.height - 10)}px`;
    tourCard.style.left = "10px";
    return;
  }

  switch (placement) {
    case "top":
      top = rect.top - cardRect.height - offset;
      left = rect.left + rect.width / 2 - cardRect.width / 2;
      tourCard.classList.add("placement-top");
      tourCard.classList.remove("placement-left", "placement-right", "placement-bottom");
      break;
    case "left":
      top = rect.top + rect.height / 2 - cardRect.height / 2;
      left = rect.left - cardRect.width - offset;
      tourCard.classList.add("placement-left");
      tourCard.classList.remove("placement-top", "placement-right", "placement-bottom");
      break;
    case "right":
      top = rect.top + rect.height / 2 - cardRect.height / 2;
      left = rect.right + offset;
      tourCard.classList.add("placement-right");
      tourCard.classList.remove("placement-top", "placement-left", "placement-bottom");
      break;
    default:
      top = rect.bottom + offset;
      left = rect.left + rect.width / 2 - cardRect.width / 2;
      tourCard.classList.add("placement-bottom");
      tourCard.classList.remove("placement-top", "placement-left", "placement-right");
  }

  top = Math.max(12, Math.min(top, window.innerHeight - cardRect.height - 12));
  left = Math.max(12, Math.min(left, window.innerWidth - cardRect.width - 12));

  tourCard.style.top = `${top}px`;
  tourCard.style.left = `${left}px`;
}

function toSharedState(source, options = {}) {
  return {
    participants: source.participants,
    adminPasswordHashV2: source.adminPasswordHash,
    adminPasswordChanged: Boolean(source.adminPasswordChanged),
    registrationPasswordHash: source.registrationPasswordHash || "",
    siteImages: normalizeSiteImages(source.siteImages),
    uiText: normalizeEditableMap(source.uiText),
    uiPlaceholders: normalizeEditableMap(source.uiPlaceholders),
    announcement: source.announcement,
    announcementDeletedAt: Number(source.announcementDeletedAt || 0),
    deletedParticipantIds: source.deletedParticipantIds || [],
    allowEmptyParticipants: Boolean(options.allowEmptyParticipants),
    allowEmptyRegistrationPassword: Boolean(options.allowEmptyRegistrationPassword),
  };
}

async function fetchSharedState() {
  const response = await fetch(SHARED_STATE_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Shared state GET failed: ${response.status}`);
  }
  return normalizeState(await response.json());
}

async function fetchSharedStateWithTimeout(timeout = 2500) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(SHARED_STATE_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Shared state GET failed: ${response.status}`);
    }
    return normalizeState(await response.json());
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function saveSharedState(source, options = {}) {
  const sharedState = await prepareSharedStateForSave(source, options);

  try {
    const response = await fetch(SHARED_STATE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharedState),
    });
    if (!response.ok) {
      throw new Error(`Shared state PUT failed: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.warn("Не удалось синхронизировать общую доску.", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState));
    return false;
  }
}

async function prepareSharedStateForSave(source, options = {}) {
  const incomingState = normalizeState(toSharedState(source, options));

  try {
    const remoteState = await fetchSharedStateWithTimeout();
    return toSharedState(mergeSharedStates(remoteState, incomingState, options), options);
  } catch {
    return toSharedState(incomingState, options);
  }
}

function mergeSharedStates(baseState, nextState, options = {}) {
  const base = normalizeState(baseState);
  const next = normalizeState(nextState);
  const deletedIds = [
    ...new Set([
      ...(base.deletedParticipantIds || []),
      ...(next.deletedParticipantIds || []),
    ]),
  ];
  const deletedSet = new Set(deletedIds);
  const participantsById = new Map();

  base.participants.forEach((participant) => {
    if (participant.id) participantsById.set(participant.id, participant);
  });
  next.participants.forEach((participant) => {
    if (participant.id) {
      participantsById.set(participant.id, mergeParticipant(participantsById.get(participant.id), participant));
    }
  });

  const announcement = getNewestAnnouncement(base, next);
  const announcementDeletedAt = Math.max(
    Number(base.announcementDeletedAt || 0),
    Number(next.announcementDeletedAt || 0),
  );

  return {
    ...base,
    ...next,
    participants: [...participantsById.values()].filter((participant) => !deletedSet.has(participant.id)),
    adminPasswordHash: next.adminPasswordHash || base.adminPasswordHash,
    adminPasswordChanged: Boolean(base.adminPasswordChanged || next.adminPasswordChanged),
    registrationPasswordHash:
      next.registrationPasswordHash ||
      (options.allowEmptyRegistrationPassword ? "" : base.registrationPasswordHash),
    siteImages: {
      logo: next.siteImages?.logo || base.siteImages?.logo || DEFAULT_LOGO_URL,
      cover: next.siteImages?.cover || base.siteImages?.cover || DEFAULT_COVER_URL,
    },
    uiText: {
      ...base.uiText,
      ...next.uiText,
    },
    uiPlaceholders: {
      ...base.uiPlaceholders,
      ...next.uiPlaceholders,
    },
    announcement,
    announcementDeletedAt,
    deletedParticipantIds: deletedIds,
    activeParticipantId: next.activeParticipantId || base.activeParticipantId,
    viewedParticipantId: next.viewedParticipantId || base.viewedParticipantId,
    isAdmin: next.isAdmin || base.isAdmin,
  };
}

function mergeParticipant(baseParticipant, nextParticipant) {
  if (!baseParticipant) return nextParticipant;
  if (!nextParticipant) return baseParticipant;
  const baseGoalArchivedAt = Number(baseParticipant.goalArchivedAt || 0);
  const nextGoalArchivedAt = Number(nextParticipant.goalArchivedAt || 0);
  const baseGoalCycleStartedAt = Number(baseParticipant.goalCycleStartedAt || 0);
  const nextGoalCycleStartedAt = Number(nextParticipant.goalCycleStartedAt || 0);
  const useNextGoalState =
    nextGoalArchivedAt > baseGoalArchivedAt ||
    nextGoalCycleStartedAt > baseGoalCycleStartedAt;
  const useBaseGoalState =
    baseGoalArchivedAt > nextGoalArchivedAt ||
    baseGoalCycleStartedAt > nextGoalCycleStartedAt;
  const goalSource = useNextGoalState ? nextParticipant : useBaseGoalState ? baseParticipant : nextParticipant;

  return {
    ...baseParticipant,
    ...nextParticipant,
    passwordHash: nextParticipant.passwordHash || baseParticipant.passwordHash || "",
    picture: nextParticipant.picture || baseParticipant.picture || "",
    email: nextParticipant.email || baseParticipant.email || "",
    authProvider: nextParticipant.authProvider || baseParticipant.authProvider || "",
    goal: hasOwn(goalSource, "goal") ? goalSource.goal || "" : baseParticipant.goal || "",
    deadline: hasOwn(goalSource, "deadline") ? goalSource.deadline || "" : baseParticipant.deadline || "",
    deadlineLocked: Boolean(goalSource.deadlineLocked),
    goalCycleStartedAt: Math.max(baseGoalCycleStartedAt, nextGoalCycleStartedAt),
    goalArchivedAt: Math.max(baseGoalArchivedAt, nextGoalArchivedAt),
    taskListUpdatedAt: Math.max(
      getParticipantTaskListUpdatedAt(baseParticipant),
      getParticipantTaskListUpdatedAt(nextParticipant),
    ),
    deadlineWarningDismissedFor:
      nextParticipant.deadlineWarningDismissedFor || baseParticipant.deadlineWarningDismissedFor || "",
    onboardingCompleted: Boolean(nextParticipant.onboardingCompleted || baseParticipant.onboardingCompleted),
    archivedGoals: mergeById(baseParticipant.archivedGoals, nextParticipant.archivedGoals),
    tasks: chooseTaskList(baseParticipant.tasks, nextParticipant.tasks, baseParticipant, nextParticipant),
    completedGoalNotice: chooseCompletedGoalNotice(baseParticipant, nextParticipant),
  };
}

function chooseCompletedGoalNotice(baseParticipant, nextParticipant) {
  const baseTime = Math.max(
    Number(baseParticipant.goalArchivedAt || 0),
    Number(baseParticipant.goalCycleStartedAt || 0),
  );
  const nextTime = Math.max(
    Number(nextParticipant.goalArchivedAt || 0),
    Number(nextParticipant.goalCycleStartedAt || 0),
  );
  if (nextTime >= baseTime && hasOwn(nextParticipant, "completedGoalNotice")) {
    return nextParticipant.completedGoalNotice || null;
  }
  if (hasOwn(baseParticipant, "completedGoalNotice")) {
    return baseParticipant.completedGoalNotice || null;
  }
  return null;
}

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source || {}, key);
}

function mergeById(baseItems = [], nextItems = []) {
  const itemsById = new Map();
  baseItems.forEach((item) => {
    if (item?.id) itemsById.set(item.id, item);
  });
  nextItems.forEach((item) => {
    if (item?.id) itemsById.set(item.id, item);
  });
  return [...itemsById.values()];
}

function chooseTaskList(baseTasks = [], nextTasks = [], baseParticipant = {}, nextParticipant = {}) {
  const baseTaskListUpdatedAt = getParticipantTaskListUpdatedAt(baseParticipant);
  const nextTaskListUpdatedAt = getParticipantTaskListUpdatedAt(nextParticipant);
  if (nextTasks.length === 0 && baseTasks.length > 0) {
    return nextTaskListUpdatedAt >= baseTaskListUpdatedAt ? [] : baseTasks;
  }
  if (baseTasks.length === 0) return nextTasks;
  const tasksById = new Map();
  baseTasks.forEach((task) => {
    if (task?.id) tasksById.set(task.id, task);
  });
  nextTasks.forEach((task) => {
    if (task?.id) tasksById.set(task.id, mergeTask(tasksById.get(task.id), task));
  });

  const preferredOrder = getTaskListUpdatedAt(nextTasks) >= getTaskListUpdatedAt(baseTasks)
    ? nextTasks
    : baseTasks;
  const orderedTasks = [];
  preferredOrder.forEach((task) => {
    const mergedTask = tasksById.get(task.id);
    if (mergedTask) orderedTasks.push(mergedTask);
    tasksById.delete(task.id);
  });
  return orderTasksByCompletion([...orderedTasks, ...tasksById.values()]);
}

function mergeTask(baseTask, nextTask) {
  if (!baseTask) return nextTask;
  if (!nextTask) return baseTask;

  const useNextTask = getItemUpdatedAt(nextTask) >= getItemUpdatedAt(baseTask);
  const preferredTask = useNextTask ? nextTask : baseTask;
  const fallbackTask = useNextTask ? baseTask : nextTask;
  const subtasks = mergeSubtasks(baseTask.subtasks, nextTask.subtasks);

  return {
    ...fallbackTask,
    ...preferredTask,
    done: Boolean(baseTask.done || nextTask.done),
    subtasksHidden: isTaskComplete({ ...fallbackTask, ...preferredTask, subtasks })
      ? true
      : Boolean(preferredTask.subtasksHidden),
    subtasks,
  };
}

function mergeSubtasks(baseSubtasks = [], nextSubtasks = []) {
  const subtasksById = new Map();
  baseSubtasks.forEach((subtask) => {
    if (subtask?.id) subtasksById.set(subtask.id, subtask);
  });
  nextSubtasks.forEach((subtask) => {
    if (!subtask?.id) return;
    const currentSubtask = subtasksById.get(subtask.id);
    subtasksById.set(subtask.id, mergeSubtask(currentSubtask, subtask));
  });

  const preferredOrder = getTaskListUpdatedAt(nextSubtasks) >= getTaskListUpdatedAt(baseSubtasks)
    ? nextSubtasks
    : baseSubtasks;
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
    if (isTaskComplete(task)) {
      complete.push(task);
    } else {
      incomplete.push(task);
    }
  });
  return [...incomplete, ...complete];
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
  return [...incomplete, ...complete];
}

function mergeSubtask(baseSubtask, nextSubtask) {
  if (!baseSubtask) return nextSubtask;
  if (!nextSubtask) return baseSubtask;

  const useNextSubtask = getItemUpdatedAt(nextSubtask) >= getItemUpdatedAt(baseSubtask);
  const preferredSubtask = useNextSubtask ? nextSubtask : baseSubtask;
  const fallbackSubtask = useNextSubtask ? baseSubtask : nextSubtask;
  return {
    ...fallbackSubtask,
    ...preferredSubtask,
    done: Boolean(baseSubtask.done || nextSubtask.done),
  };
}

function getTaskListUpdatedAt(items = []) {
  return items.reduce((latest, item) => Math.max(latest, getItemUpdatedAt(item)), 0);
}

function getItemUpdatedAt(item = {}) {
  return Number(item.updatedAt || item.createdAt || 0);
}

function getParticipantTaskListUpdatedAt(participant = {}) {
  return Math.max(
    Number(participant.taskListUpdatedAt || 0),
    Number(participant.goalArchivedAt || 0),
    getTaskListUpdatedAt(participant.tasks || []),
  );
}

function getNewestAnnouncement(baseState, nextState) {
  const baseAnnouncement = baseState.announcement || null;
  const nextAnnouncement = nextState.announcement || null;
  const deletedAt = Math.max(
    Number(baseState.announcementDeletedAt || 0),
    Number(nextState.announcementDeletedAt || 0),
  );
  const baseTime = getAnnouncementUpdatedAt(baseAnnouncement);
  const nextTime = getAnnouncementUpdatedAt(nextAnnouncement);
  const newestAnnouncement = nextTime >= baseTime ? nextAnnouncement : baseAnnouncement;

  if (deletedAt >= getAnnouncementUpdatedAt(newestAnnouncement)) {
    return null;
  }
  return newestAnnouncement;
}

function getAnnouncementUpdatedAt(announcement) {
  if (!announcement) return 0;
  return Number(announcement.updatedAt || announcement.createdAt || 0);
}

function isEditingParticipantContent() {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  if (!profileView.contains(activeElement)) return false;
  return activeElement.matches("input, textarea, select");
}

function isSmallTourViewport() {
  return window.matchMedia("(max-width: 620px)").matches;
}

function openModal(modal, focusTarget) {
  closeModals();
  if (modal === adminModal) {
    renderAdminPanel();
  }
  if (modal === passwordResetModal) {
    if (passwordResetMessage) {
      passwordResetMessage.textContent = "";
      passwordResetMessage.classList.remove("is-error");
    }
    if (passwordResetCodeInput) {
      passwordResetCodeInput.value = "";
    }
  }
  if (modal === registrationPasswordModal) {
    if (registrationPasswordStatus) {
      registrationPasswordStatus.textContent = state.registrationPasswordHash
        ? "Текущий пароль регистрации установлен. Чтобы изменить, введите новый пароль и нажмите «Сохранить пароль»."
        : "Пароль регистрации пока не задан. Установите его, чтобы новые участники могли регистрироваться.";
    }
    if (registrationPasswordMessage) {
      registrationPasswordMessage.textContent = "";
    }
  }
  modal.hidden = false;
  requestAnimationFrame(() => focusTarget?.focus());
}

function closeModals() {
  if (pendingDeadlineConfirmation) {
    const { resolve } = pendingDeadlineConfirmation;
    pendingDeadlineConfirmation = null;
    resolve(false);
  }
  loginModal.hidden = true;
  adminModal.hidden = true;
  passwordResetModal.hidden = true;
  adminNewsModal.hidden = true;
  registrationPasswordModal.hidden = true;
  tourModal.hidden = true;
  if (deadlineWarningModal) {
    deadlineWarningModal.hidden = true;
  }
  if (deadlineConfirmModal) {
    deadlineConfirmModal.hidden = true;
  }
  clearTourHighlight();
  cancelTourPositionUpdate();
}

function openAdminNewsModal() {
  if (!state.isAdmin) return;
  openModal(adminNewsModal, announcementInput);
}

function openAdminPanel() {
  openModal(adminModal, state.isAdmin ? newAdminPasswordInput : adminUsernameInput);
}

function openPasswordResetModal() {
  openModal(passwordResetModal, passwordResetCodeInput);
}

async function joinAsParticipant(source = {}) {
  const fields = {
    nameInput,
    passwordInput,
    registrationKeyInput,
    participantPhotoInput,
    messageElement: authMessage,
    ...source,
  };
  const participantNameInput = fields.nameInput;
  const participantPasswordInput = fields.passwordInput;
  const participantRegistrationKeyInput = fields.registrationKeyInput;
  const participantPhotoFileInput = fields.participantPhotoInput;
  const messageElement = fields.messageElement;
  const name = participantNameInput?.value.trim() || "";
  const password = participantPasswordInput?.value || "";
  const registrationKey = participantRegistrationKeyInput?.value.trim();
  const uploadedPicture = await readOptionalImageFile(participantPhotoFileInput);

  if (!name) {
    showAuthMessage("Введите имя.", true, messageElement);
    participantNameInput?.focus();
    return;
  }

  if (!password) {
    showAuthMessage("Введите пароль.", true, messageElement);
    participantPasswordInput?.focus();
    return;
  }

  let participant = state.participants.find(
    (person) => person.name.toLowerCase() === name.toLowerCase(),
  );
  const passwordHash = await hashPassword(name, password);

  if (!participant || (!state.registrationPasswordHash && registrationKey)) {
    await syncStateBeforeParticipantLogin();
    participant = state.participants.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );
  }

  if (!participant) {
    if (state.registrationPasswordHash) {
      if (!registrationKey) {
        showAuthMessage("Нужно знать пароль у администратора.", true, messageElement);
        participantRegistrationKeyInput?.focus();
        return;
      }
      const registrationHash = await hashPassword("registration", registrationKey);
      if (registrationHash !== state.registrationPasswordHash) {
        showAuthMessage("Неверный пароль регистрации. Узнайте его у администратора.", true, messageElement);
        participantRegistrationKeyInput?.select();
        return;
      }
    } else {
      showAuthMessage("Регистрация закрыта. Узнайте пароль у администратора.", true, messageElement);
      return;
    }

    state.deletedParticipantIds = (state.deletedParticipantIds || []).filter((item) => item !== name.toLowerCase());
    participant = {
      id: crypto.randomUUID(),
      name,
      passwordHash,
      picture: uploadedPicture,
      goal: "",
      deadline: "",
      deadlineLocked: false,
      goalCycleStartedAt: Date.now(),
      goalArchivedAt: 0,
      taskListUpdatedAt: Date.now(),
      tasks: [],
      archivedGoals: [],
      onboardingCompleted: false,
    };
    state.participants.push(participant);
    showAuthMessage("Аккаунт создан. Теперь это ваша страница.", false, messageElement);
  } else if (!participant.passwordHash) {
    participant.passwordHash = passwordHash;
    participant.picture = uploadedPicture || participant.picture || "";
    showAuthMessage("Пароль сохранён для этого имени.", false, messageElement);
  } else if (participant.passwordHash !== passwordHash) {
    await syncStateBeforeParticipantLogin();
    participant = state.participants.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );
    if (participant?.passwordHash === passwordHash) {
      participant.picture = uploadedPicture || participant.picture || "";
      showAuthMessage("Вы вошли в свою страницу.", false, messageElement);
    } else {
      showAuthMessage("Пароль не подходит для этого имени.", true, messageElement);
      participantPasswordInput?.select();
      return;
    }
  } else {
    participant.picture = uploadedPicture || participant.picture || "";
    showAuthMessage("Вы вошли в свою страницу.", false, messageElement);
  }

  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
  if (participantNameInput) participantNameInput.value = "";
  if (participantPasswordInput) participantPasswordInput.value = "";
  clearFileInput(participantPhotoFileInput);
  if (participantRegistrationKeyInput) participantRegistrationKeyInput.value = "";
  saveState();
  closeModals();
  render();
  if (!participant.onboardingCompleted) {
    openTour(participant.id);
  }
  syncStateAfterParticipantLogin(participant.id);
}

function logoutParticipant() {
  state.activeParticipantId = "";
  localStorage.removeItem(SESSION_KEY);
  closeModals();
  render();
}

function showAuthMessage(message, isError, target = authMessage) {
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("is-error", isError);
}

async function syncStateBeforeParticipantLogin() {
  try {
    const freshState = await fetchSharedStateWithTimeout();
    const activeParticipantId = state.activeParticipantId;
    const viewedParticipantId = state.viewedParticipantId;
    const isAdmin = state.isAdmin;

    state = freshState;
    state.activeParticipantId = freshState.participants.some((person) => person.id === activeParticipantId)
      ? activeParticipantId
      : "";
    state.viewedParticipantId = freshState.participants.some((person) => person.id === viewedParticipantId)
      ? viewedParticipantId
      : freshState.participants[0]?.id || "";
    state.isAdmin = isAdmin;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
  } catch {
    // Если сеть недоступна, пробуем вход по последней локальной копии.
  }
}

async function syncStateAfterParticipantLogin(participantId) {
  try {
    const freshState = await fetchSharedState();
    const currentParticipant = findParticipant(participantId);
    if (!currentParticipant) return;

    const mergedState = mergeSharedStates(freshState, state);
    state = mergedState;
    state.activeParticipantId = participantId;
    state.viewedParticipantId = participantId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
    render();
    saveSharedState(state);
  } catch {
    // Вход уже выполнен локально; синхронизация повторится по таймеру.
  }
}

async function loginAsAdmin() {
  const username = adminUsernameInput?.value.trim() || "";
  const password = adminPasswordInput.value;
  if (username !== ADMIN_LOGIN) {
    showAdminMessage("Неверный логин администратора.", true);
    adminUsernameInput?.select();
    return;
  }

  if (!password) {
    showAdminMessage("Введите пароль администратора.", true);
    adminPasswordInput.focus();
    return;
  }

  const passwordHash = await getAdminPasswordHash(password);
  const defaultPasswordHash = await getAdminPasswordHash(DEFAULT_ADMIN_PASSWORD);
  if (!state.adminPasswordHash) {
    state.adminPasswordHash = defaultPasswordHash;
  }

  const usesDefaultPassword = passwordHash === defaultPasswordHash;
  const isPasswordAccepted =
    state.adminPasswordHash === passwordHash ||
    usesDefaultPassword;

  if (!isPasswordAccepted) {
    state.isAdmin = false;
    showAdminMessage("Неверный пароль администратора.", true);
    adminPasswordInput.select();
    saveState();
    render();
    return;
  }

  state.isAdmin = true;
  if (usesDefaultPassword) {
    state.adminPasswordHash = defaultPasswordHash;
  }
  showAdminMessage("Вы вошли как администратор.", false);
  adminUsernameInput.value = "";
  adminPasswordInput.value = "";
  saveState();
  render();
  closeModals();
}

async function saveAdminPassword() {
  if (!state.isAdmin) return;

  const value = newAdminPasswordInput?.value.trim() || "";
  if (!value) {
    showAdminMessage("Введите новый пароль администратора.", true);
    newAdminPasswordInput?.focus();
    return;
  }

  state.adminPasswordHash = await getAdminPasswordHash(value);
  state.adminPasswordChanged = true;
  saveState();
  newAdminPasswordInput.value = "";
  showAdminMessage("Пароль администратора изменён.", false);
  render();
  openAdminPanel();
}

async function resetAllPasswords() {
  const code = passwordResetCodeInput?.value.trim() || "";
  if (code.toLowerCase() !== PASSWORD_RESET_CODE.toLowerCase()) {
    if (passwordResetMessage) {
      passwordResetMessage.textContent = "Кодовое слово неверное.";
      passwordResetMessage.classList.add("is-error");
    }
    passwordResetCodeInput?.select();
    return;
  }

  state.adminPasswordHash = await getAdminPasswordHash(DEFAULT_ADMIN_PASSWORD);
  state.adminPasswordChanged = false;
  state.registrationPasswordHash = "";
  state.participants.forEach((participant) => {
    participant.passwordHash = "";
  });
  state.isAdmin = false;
  localStorage.removeItem(SESSION_KEY);
  saveState({ allowEmptyRegistrationPassword: true });

  if (passwordResetMessage) {
    passwordResetMessage.textContent =
      "Пароли сброшены. Теперь войдите как администратор: Sasha / S_asha2305.";
    passwordResetMessage.classList.remove("is-error");
  }
  passwordResetCodeInput.value = "";
  render();
}

function logoutAdmin() {
  state.isAdmin = false;
  textEditMode = false;
  closeModals();
  showAdminMessage("Администратор вышел.", false);
  saveState();
  render();
}

function showAdminMessage(message, isError) {
  adminMessage.textContent = message;
  adminMessage.classList.toggle("is-error", isError);
}

function renderAdminPanel() {
  if (!adminLoginPanel || !adminSettingsPanel) return;
  adminLoginPanel.hidden = state.isAdmin;
  adminSettingsPanel.hidden = !state.isAdmin;
  adminLoginButton.hidden = state.isAdmin;
  adminLogoutButton.hidden = !state.isAdmin;
  if (state.isAdmin) {
    renderParticipantPhotoOptions();
  }
}

function renderSiteImages() {
  const siteImages = normalizeSiteImages(state.siteImages);
  if (brandLogo) {
    brandLogo.src = siteImages.logo;
    brandLogo.title = state.isAdmin ? "Нажмите, чтобы поменять логотип" : "";
  }
  if (heroCover) {
    heroCover.src = siteImages.cover;
    heroCover.title = state.isAdmin ? "Нажмите, чтобы поменять обложку" : "";
  }
}

function openSiteImagePicker(input) {
  if (!state.isAdmin || !input) return;
  input.click();
}

async function updateSiteImage(type, input) {
  if (!state.isAdmin || !input?.files?.[0]) return;

  const siteImages = normalizeSiteImages(state.siteImages);
  siteImages[type] = await readImageFile(input.files[0]);
  state.siteImages = siteImages;
  clearFileInput(input);
  saveState();
  showAdminMessage(type === "logo" ? "Логотип обновлён." : "Обложка обновлена.", false);
  render();
}

function renderParticipantPhotoOptions() {
  if (!participantPhotoSelect) return;

  const selectedId = participantPhotoSelect.value || state.viewedParticipantId || state.participants[0]?.id || "";
  participantPhotoSelect.replaceChildren();
  state.participants.forEach((participant) => {
    const option = document.createElement("option");
    option.value = participant.id;
    option.textContent = participant.name;
    participantPhotoSelect.append(option);
  });
  participantPhotoSelect.value = state.participants.some((participant) => participant.id === selectedId)
    ? selectedId
    : state.participants[0]?.id || "";
  syncParticipantPhotoInput();
}

function syncParticipantPhotoInput() {
  if (!participantPhotoUrlInput || !participantPhotoSelect) return;
  const participant = findParticipant(participantPhotoSelect.value);
  participantPhotoUrlInput.value = participant?.picture || "";
}

async function saveParticipantPhoto() {
  if (!state.isAdmin || !participantPhotoSelect) return;

  const participant = findParticipant(participantPhotoSelect.value);
  if (!participant) {
    showAdminMessage("Выберите участника для смены фото.", true);
    return;
  }

  participant.picture = await getImageValue(participantPhotoUrlInput, participantPhotoFileInput, participant.picture || "");
  clearFileInput(participantPhotoFileInput);
  saveState();
  showAdminMessage("Фото участника сохранено.", false);
  render();
  openAdminPanel();
}

function clearParticipantPhoto() {
  if (!state.isAdmin || !participantPhotoSelect) return;

  const participant = findParticipant(participantPhotoSelect.value);
  if (!participant) return;
  participant.picture = "";
  clearFileInput(participantPhotoFileInput);
  saveState();
  showAdminMessage("Фото участника удалено.", false);
  render();
  openAdminPanel();
}

function toggleTextEditMode() {
  if (!state.isAdmin) return;
  textEditMode = !textEditMode;
  render();
  showAdminMessage(
    textEditMode
      ? "Режим редактирования включён. Нажмите на текст или кнопку на сайте."
      : "Режим редактирования выключен.",
    false,
  );
}

function handleEditableTextClick(event) {
  if (!state.isAdmin || !textEditMode) return;

  const target = event.target.closest("[data-edit-key], [data-placeholder-key]");
  if (!target || !document.body.contains(target)) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (target.dataset.placeholderKey) {
    editPlaceholder(target);
    return;
  }

  editText(target);
}

function editText(element) {
  const key = element.dataset.editKey;
  const currentText = state.uiText?.[key] ?? element.textContent.trim();
  const nextText = window.prompt("Изменить текст", currentText);
  if (nextText === null) return;

  state.uiText = normalizeEditableMap({
    ...state.uiText,
    [key]: nextText.trim(),
  });
  saveState();
  applyEditableText();
}

function editPlaceholder(element) {
  const key = element.dataset.placeholderKey;
  const currentText = state.uiPlaceholders?.[key] ?? element.placeholder;
  const nextText = window.prompt("Изменить подсказку в поле", currentText);
  if (nextText === null) return;

  state.uiPlaceholders = normalizeEditableMap({
    ...state.uiPlaceholders,
    [key]: nextText.trim(),
  });
  saveState();
  applyEditableText();
}

function applyEditableText() {
  const uiText = normalizeEditableMap(state.uiText);
  const uiPlaceholders = normalizeEditableMap(state.uiPlaceholders);

  document.querySelectorAll("[data-edit-key]").forEach((element) => {
    const value = uiText[element.dataset.editKey];
    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-placeholder-key]").forEach((element) => {
    const value = uiPlaceholders[element.dataset.placeholderKey];
    if (typeof value === "string") {
      element.placeholder = value;
    }
  });
}

async function getImageValue(urlInput, fileInput, fallback) {
  if (fileInput?.files?.[0]) {
    return readImageFile(fileInput.files[0]);
  }

  return urlInput?.value.trim() || fallback;
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

async function readOptionalImageFile(input) {
  if (!input?.files?.[0]) return "";
  return readImageFile(input.files[0]);
}

function clearFileInput(input) {
  if (input) input.value = "";
}

function showAnnouncementMessage(message, isError) {
  announcementMessage.textContent = message;
  announcementMessage.classList.toggle("is-error", isError);
}

function publishAnnouncement() {
  const text = announcementInput.value.trim();
  if (!state.isAdmin) return;
  const recipientValue = announcementRecipientSelect?.value || "all";
  const isPersonalRecipient = recipientValue.startsWith("participant:");
  const participantId = isPersonalRecipient ? recipientValue.replace("participant:", "") : "";

  if (!text) {
    showAnnouncementMessage("Напишите текст новости.", true);
    announcementInput.focus();
    return;
  }

  if (isPersonalRecipient && !findParticipant(participantId)) {
    showAnnouncementMessage("Выберите участника для личной новости.", true);
    announcementRecipientSelect?.focus();
    return;
  }

  const now = Date.now();
  state.announcement = {
    id: crypto.randomUUID(),
    text,
    createdAt: now,
    updatedAt: now,
    recipient: {
      type: isPersonalRecipient ? "participant" : "all",
      participantId,
    },
    readBy: [],
  };
  state.announcementDeletedAt = 0;
  announcementInput.value = "";
  showAnnouncementMessage("", false);
  showAdminMessage(isPersonalRecipient ? "Новость отправлена выбранному участнику." : "Новость опубликована для всех участников.", false);
  saveState();
  closeModals();
  render();
}

function deleteAnnouncement() {
  if (!state.isAdmin || !state.announcement) return;

  state.announcement = null;
  state.announcementDeletedAt = Date.now();
  announcementInput.value = "";
  showAnnouncementMessage("Новость удалена.", false);
  showAdminMessage("Новость удалена у всех участников.", false);
  saveState();
  render();
}

function confirmDeadlineChoice(deadline) {
  const dateText = formatDate(deadline);
  if (!deadlineConfirmModal || !deadlineConfirmDate) {
    return Promise.resolve(window.confirm(
      `Вы выбрали дату: ${dateText}.\nЕсли нажмёте «Да», изменить дату уже будет нельзя.`,
    ));
  }

  if (pendingDeadlineConfirmation) {
    resolveDeadlineConfirmation(false);
  }

  closeModals();
  deadlineConfirmDate.textContent = dateText;
  deadlineConfirmModal.hidden = false;
  requestAnimationFrame(() => confirmDeadlineButton?.focus());

  return new Promise((resolve) => {
    pendingDeadlineConfirmation = { resolve };
  });
}

function resolveDeadlineConfirmation(confirmed) {
  if (!pendingDeadlineConfirmation) {
    if (deadlineConfirmModal) deadlineConfirmModal.hidden = true;
    return;
  }

  const { resolve } = pendingDeadlineConfirmation;
  pendingDeadlineConfirmation = null;
  if (deadlineConfirmModal) {
    deadlineConfirmModal.hidden = true;
  }
  resolve(confirmed);
}

function reopenDatePicker(input) {
  requestAnimationFrame(() => {
    input.focus();
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.click();
  });
}

function dismissDeadlineWarning() {
  const active = findParticipant(state.activeParticipantId);
  if (active?.deadline) {
    active.deadlineWarningDismissedFor = active.deadline;
    saveState();
  }
  if (deadlineWarningModal) {
    deadlineWarningModal.hidden = true;
  }
}

function deleteArchivedGoal(participantId, archiveId) {
  const participant = findParticipant(participantId);
  if (!participant || !state.isAdmin) return;

  participant.archivedGoals = (participant.archivedGoals || []).filter((goal) => goal.id !== archiveId);
  saveState();
  render();
}

function markAnnouncementRead() {
  const active = findParticipant(state.activeParticipantId);
  if (!active || !state.announcement) {
    announcementModal.hidden = true;
    return;
  }

  if (!state.announcement.readBy.includes(active.id)) {
    state.announcement.readBy.push(active.id);
    state.announcement.updatedAt = Date.now();
    saveState();
  }

  announcementModal.hidden = true;
  renderAdminControls();
  renderDeadlineWarningModal();
}

async function hashPassword(name, password) {
  const normalized = `${name.trim().toLowerCase()}::${password}`;
  if (crypto.subtle) {
    const bytes = new TextEncoder().encode(normalized);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(index);
    hash |= 0;
  }
  return `fallback-${hash}`;
}

function getAdminPasswordHash(password) {
  return hashPassword(`admin:${ADMIN_LOGIN}`, password);
}

function isAdminRoute() {
  const path = decodeURIComponent(window.location.pathname)
    .replace(/\/+$/, "")
    .toLowerCase();
  return path === "/admin" || path === "/админ";
}

function viewParticipant(id) {
  state.viewedParticipantId = id;
  saveState();
  render();
}

function archiveFinishedGoals() {
  return state.participants.reduce((changed, participant) => {
    return archiveFinishedGoal(participant) || changed;
  }, false);
}

function clearExpiredCompletedGoalNotices() {
  const now = Date.now();
  return state.participants.reduce((changed, participant) => {
    if (participant.completedGoalNotice?.expiresAt && participant.completedGoalNotice.expiresAt <= now) {
      participant.completedGoalNotice = null;
      return true;
    }
    return changed;
  }, false);
}

function archiveFinishedGoal(participant) {
  if (!participant || !hasActiveGoal(participant)) return false;

  const progress = getProgress(participant.tasks);
  const completed = progress.total > 0 && progress.done === progress.total;
  const expired = isDeadlineExpired(participant.deadline) && !completed;
  if (!completed && !expired) return false;

  const archivedAt = Date.now();
  const goalTitle = participant.goal || "Цель без названия";
  participant.archivedGoals = Array.isArray(participant.archivedGoals) ? participant.archivedGoals : [];
  participant.archivedGoals.unshift({
    id: crypto.randomUUID(),
    title: goalTitle,
    deadline: participant.deadline || "",
    status: completed ? "completed" : "expired",
    progress: progress.percent,
    doneTasks: progress.done,
    totalTasks: progress.total,
    archivedAt,
  });
  if (completed) {
    participant.completedGoalNotice = {
      id: crypto.randomUUID(),
      title: goalTitle,
      completedAt: archivedAt,
      expiresAt: archivedAt + COMPLETED_GOAL_NOTICE_TTL,
    };
  }
  participant.goal = "";
  participant.deadline = "";
  participant.deadlineLocked = false;
  participant.tasks = [];
  participant.goalArchivedAt = archivedAt;
  participant.taskListUpdatedAt = archivedAt;
  return true;
}

function clearCompletedGoalNotice(participantId) {
  const participant = findParticipant(participantId);
  if (!participant) return;

  participant.completedGoalNotice = null;
  saveState();
  render();
}

function hasActiveGoal(participant) {
  return Boolean(
    participant.goal?.trim() ||
      participant.deadline ||
      (Array.isArray(participant.tasks) && participant.tasks.length > 0),
  );
}

function updateGoal(participantId, goal) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  if (goal && !hasActiveGoal(participant)) {
    const now = Date.now();
    participant.goalCycleStartedAt = now;
    participant.goalArchivedAt = 0;
    participant.taskListUpdatedAt = now;
  }
  participant.goal = goal;
  scheduleSaveState();
  renderResults();
}

function updateDeadline(participantId, deadline) {
  const participant = findParticipant(participantId);
  if (!participant || (!isActive(participantId) && !state.isAdmin)) return;

  participant.deadline = deadline;
  participant.deadlineLocked = Boolean(deadline);
  participant.deadlineWarningDismissedFor = "";
  if (deadline && !participant.goalCycleStartedAt) {
    participant.goalCycleStartedAt = Date.now();
  }
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function addTask(participantId, title) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId) || !title.trim()) return;

  participant.taskListUpdatedAt = Date.now();
  participant.tasks.unshift(createTask(title.trim()));
  saveState();
  render();
}

function toggleTask(participantId, taskId, done) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || (Array.isArray(task.subtasks) && task.subtasks.length > 0) || isTaskComplete(task)) return;

  task.done = done;
  const now = Date.now();
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  reorderTasks(participant);
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function reorderTasks(participant) {
  participant.tasks = orderTasksByCompletion(participant.tasks);
}

function normalizeParticipantTasks(participant) {
  if (!participant || !Array.isArray(participant.tasks)) return;

  participant.tasks.forEach((task) => {
    if (!Array.isArray(task.subtasks)) {
      task.subtasks = [];
    }
    reorderSubtasks(task);
    if (isTaskComplete(task)) {
      task.subtasksHidden = true;
    }
  });
  reorderTasks(participant);
  if (!participant.taskListUpdatedAt) {
    participant.taskListUpdatedAt = getParticipantTaskListUpdatedAt(participant);
  }
}

function reorderSubtasks(task) {
  if (!Array.isArray(task.subtasks)) return;
  task.subtasks = orderSubtasksByCompletion(task.subtasks);
}

function addSubtask(participantId, taskId, title) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId) || !title.trim()) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || isTaskComplete(task)) return;

  const now = Date.now();
  task.subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  task.subtasks.unshift({
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    createdAt: now,
    updatedAt: now,
  });
  task.subtasksHidden = false;
  task.done = false;
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  saveState();
  render();
}

function toggleSubtask(participantId, taskId, subtaskId, done) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || !Array.isArray(task.subtasks)) return;

  const subtask = task.subtasks.find((item) => item.id === subtaskId);
  if (!subtask) return;

  const now = Date.now();
  subtask.done = done;
  subtask.updatedAt = now;
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  reorderSubtasks(task);
  if (task.subtasks.length > 0 && task.subtasks.every((item) => item.done)) {
    task.subtasksHidden = true;
  }
  reorderTasks(participant);
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function deleteSubtask(participantId, taskId, subtaskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || !Array.isArray(task.subtasks)) return;

  task.subtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
  const now = Date.now();
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  reorderSubtasks(task);
  reorderTasks(participant);
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function toggleSubtasksVisibility(participantId, taskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task) return;
  if (isTaskComplete(task)) {
    task.subtasksHidden = true;
    saveState();
    render();
    return;
  }

  task.subtasksHidden = !task.subtasksHidden;
  const now = Date.now();
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  saveState();
  render();
}

function editTask(participantId, taskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || isTaskComplete(task)) return;

  const newTitle = window.prompt("Изменить текст шага", task.title);
  if (!newTitle || !newTitle.trim()) return;

  task.title = newTitle.trim();
  const now = Date.now();
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  saveState();
  render();
}

function beginCardDrag(event, participantId, taskId) {
  if (event.button !== 0) return;
  if (event.target.closest("button, input, label, textarea")) return;
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;
  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || isTaskComplete(task)) return;
  const card = event.currentTarget;
  const clientX = event.clientX;
  const clientY = event.clientY;

  if (event.pointerType && event.pointerType !== "mouse") {
    scheduleTouchDrag(event, () => startTaskDrag(card, participantId, taskId, clientX, clientY));
    return;
  }

  startTaskDrag(card, participantId, taskId, clientX, clientY);
  event.preventDefault();
}

function startTaskDrag(card, participantId, taskId, clientX, clientY) {
  const rect = card.getBoundingClientRect();
  const clone = card.cloneNode(true);
  clone.classList.add("drag-ghost");
  clone.style.position = "fixed";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = "0";
  clone.style.pointerEvents = "none";
  clone.style.opacity = "0.92";
  clone.style.zIndex = "10000";
  document.body.append(clone);
  card.classList.add("is-dragging");

  dragState = {
    type: "task",
    participantId,
    taskId,
    card,
    clone,
    offsetX: clientX - rect.left,
    offsetY: clientY - rect.top,
    targetTaskId: null,
  };

  document.body.classList.add("is-dragging-card");
  window.addEventListener("pointermove", onCardDragMove);
  window.addEventListener("pointerup", endCardDrag);
  window.addEventListener("pointercancel", endCardDrag);
}

function scheduleTouchDrag(event, startDrag) {
  clearPendingTouchDrag();

  const startX = event.clientX;
  const startY = event.clientY;

  const cancel = () => clearPendingTouchDrag();
  const move = (moveEvent) => {
    if (Math.abs(moveEvent.clientX - startX) > 12 || Math.abs(moveEvent.clientY - startY) > 12) {
      clearPendingTouchDrag();
    }
  };

  pendingTouchDrag = {
    timeout: window.setTimeout(() => {
      const pending = pendingTouchDrag;
      if (!pending) return;
      pendingTouchDrag = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", cancel);
      window.removeEventListener("pointercancel", cancel);
      startDrag();
    }, 520),
    move,
    cancel,
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", cancel);
  window.addEventListener("pointercancel", cancel);
}

function clearPendingTouchDrag() {
  if (!pendingTouchDrag) return;

  window.clearTimeout(pendingTouchDrag.timeout);
  window.removeEventListener("pointermove", pendingTouchDrag.move);
  window.removeEventListener("pointerup", pendingTouchDrag.cancel);
  window.removeEventListener("pointercancel", pendingTouchDrag.cancel);
  pendingTouchDrag = null;
}

function onCardDragMove(event) {
  if (!dragState) return;
  event.preventDefault();
  dragState.clone.style.left = `${event.clientX - dragState.offsetX}px`;
  dragState.clone.style.top = `${event.clientY - dragState.offsetY}px`;

  if (dragState.type === "subtask") {
    onSubtaskDragMove(event);
    return;
  }

  const element = document.elementFromPoint(event.clientX, event.clientY);
  const newTarget = element?.closest(".task-card");
  if (newTarget && newTarget !== dragState.card) {
    document.querySelectorAll(".task-card.drag-over").forEach((node) => node.classList.remove("drag-over"));
    newTarget.classList.add("drag-over");
    dragState.targetTaskId = newTarget.dataset.taskId;
  } else {
    document.querySelectorAll(".task-card.drag-over").forEach((node) => node.classList.remove("drag-over"));
    dragState.targetTaskId = null;
  }
}

function endCardDrag() {
  if (!dragState) return;
  if (dragState.type === "subtask") {
    endSubtaskDrag();
    return;
  }

  const { participantId, taskId, card, clone, targetTaskId } = dragState;
  window.removeEventListener("pointermove", onCardDragMove);
  window.removeEventListener("pointerup", endCardDrag);
  window.removeEventListener("pointercancel", endCardDrag);
  document.body.classList.remove("is-dragging-card");
  card.classList.remove("is-dragging");
  clone.remove();
  document.querySelectorAll(".task-card.drag-over").forEach((node) => node.classList.remove("drag-over"));

  if (targetTaskId && targetTaskId !== taskId) {
    moveDraggedTask(participantId, taskId, targetTaskId);
  }

  dragState = null;
}

function moveDraggedTask(participantId, draggedTaskId, targetTaskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const draggedIndex = participant.tasks.findIndex((item) => item.id === draggedTaskId);
  const targetIndex = participant.tasks.findIndex((item) => item.id === targetTaskId);
  if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return;
  if (isTaskComplete(participant.tasks[draggedIndex]) || isTaskComplete(participant.tasks[targetIndex])) return;

  const [draggedTask] = participant.tasks.splice(draggedIndex, 1);
  participant.tasks.splice(targetIndex, 0, draggedTask);
  const now = Date.now();
  draggedTask.updatedAt = now;
  participant.taskListUpdatedAt = now;
  saveState();
  render();
}

function beginSubtaskDrag(event, participantId, taskId, subtaskId) {
  if (event.button !== 0) return;
  if (event.target.closest("button, input, label, textarea")) return;
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task?.subtasks?.some((subtask) => subtask.id === subtaskId)) return;
  if (isTaskComplete(task)) return;
  const subtask = task.subtasks.find((item) => item.id === subtaskId);
  if (!subtask || subtask.done) return;

  event.stopPropagation();
  const card = event.currentTarget;
  const clientX = event.clientX;
  const clientY = event.clientY;
  if (event.pointerType && event.pointerType !== "mouse") {
    scheduleTouchDrag(event, () => startSubtaskDrag(card, participantId, taskId, subtaskId, clientX, clientY));
    return;
  }

  startSubtaskDrag(card, participantId, taskId, subtaskId, clientX, clientY);
  event.preventDefault();
}

function startSubtaskDrag(card, participantId, taskId, subtaskId, clientX, clientY) {
  const rect = card.getBoundingClientRect();
  const clone = card.cloneNode(true);
  clone.classList.add("drag-ghost");
  clone.style.position = "fixed";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = "0";
  clone.style.pointerEvents = "none";
  clone.style.opacity = "0.92";
  clone.style.zIndex = "10000";
  document.body.append(clone);
  card.classList.add("is-dragging");

  dragState = {
    type: "subtask",
    participantId,
    taskId,
    subtaskId,
    card,
    clone,
    offsetX: clientX - rect.left,
    offsetY: clientY - rect.top,
    targetSubtaskId: null,
  };

  document.body.classList.add("is-dragging-card");
  window.addEventListener("pointermove", onCardDragMove);
  window.addEventListener("pointerup", endCardDrag);
  window.addEventListener("pointercancel", endCardDrag);
}

function onSubtaskDragMove(event) {
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const newTarget = element?.closest(".subtask-card");
  const targetTaskCard = newTarget?.closest(".task-card");
  const isSameTask = targetTaskCard?.dataset.taskId === dragState.taskId;
  if (newTarget && newTarget !== dragState.card && isSameTask) {
    document.querySelectorAll(".subtask-card.drag-over").forEach((node) => node.classList.remove("drag-over"));
    newTarget.classList.add("drag-over");
    dragState.targetSubtaskId = newTarget.dataset.subtaskId;
  } else {
    document.querySelectorAll(".subtask-card.drag-over").forEach((node) => node.classList.remove("drag-over"));
    dragState.targetSubtaskId = null;
  }
}

function endSubtaskDrag() {
  const { participantId, taskId, subtaskId, card, clone, targetSubtaskId } = dragState;
  window.removeEventListener("pointermove", onCardDragMove);
  window.removeEventListener("pointerup", endCardDrag);
  window.removeEventListener("pointercancel", endCardDrag);
  document.body.classList.remove("is-dragging-card");
  card.classList.remove("is-dragging");
  clone.remove();
  document.querySelectorAll(".subtask-card.drag-over").forEach((node) => node.classList.remove("drag-over"));

  if (targetSubtaskId && targetSubtaskId !== subtaskId) {
    moveDraggedSubtask(participantId, taskId, subtaskId, targetSubtaskId);
  }

  dragState = null;
}

function moveDraggedSubtask(participantId, taskId, draggedSubtaskId, targetSubtaskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || !Array.isArray(task.subtasks)) return;
  if (isTaskComplete(task)) return;

  const draggedIndex = task.subtasks.findIndex((item) => item.id === draggedSubtaskId);
  const targetIndex = task.subtasks.findIndex((item) => item.id === targetSubtaskId);
  if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return;
  if (task.subtasks[draggedIndex].done || task.subtasks[targetIndex].done) return;

  const [draggedSubtask] = task.subtasks.splice(draggedIndex, 1);
  task.subtasks.splice(targetIndex, 0, draggedSubtask);
  const now = Date.now();
  draggedSubtask.updatedAt = now;
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  reorderSubtasks(task);
  saveState();
  render();
}

function deleteTask(participantId, taskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  participant.tasks = participant.tasks.filter((task) => task.id !== taskId);
  participant.taskListUpdatedAt = Date.now();
  archiveFinishedGoal(participant);
  saveState();
  render();
}

async function deleteAccount(participantId) {
  const participant = findParticipant(participantId);
  if (!participant || !state.isAdmin) return;

  const confirmed = window.confirm(
    `Администратор удаляет "${participant.name}". Все его цель, шаги и прогресс будут стерты.`,
  );
  if (!confirmed) return;

  state.participants = state.participants.filter((person) => person.id !== participantId);
  state.deletedParticipantIds = [
    ...new Set([
      ...(state.deletedParticipantIds || []),
      participant.id,
    ]),
  ];
  if (state.announcement?.readBy) {
    state.announcement.readBy = state.announcement.readBy.filter((id) => id !== participantId);
  }
  if (state.activeParticipantId === participantId) {
    state.activeParticipantId = "";
    localStorage.removeItem(SESSION_KEY);
  }
  state.viewedParticipantId = state.participants[0]?.id || "";
  const sharedState = toSharedState(state, { allowEmptyParticipants: true });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState));
  render();
  const saved = await saveSharedState(state, { allowEmptyParticipants: true });
  if (!saved) {
    showAdminMessage("Не удалось синхронизировать удаление. Проверьте интернет и попробуйте ещё раз.", true);
    return;
  }
  await refreshSharedState();
  showAdminMessage("Участник удалён на всех устройствах.", false);
}

function findParticipant(id) {
  return state.participants.find((person) => person.id === id);
}

function isActive(id) {
  return state.activeParticipantId === id;
}

function isTaskComplete(task) {
  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    return task.subtasks.every((subtask) => Boolean(subtask.done));
  }
  return Boolean(task.done);
}

function getTaskProgressRatio(task) {
  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    const doneSubtasks = task.subtasks.filter((subtask) => Boolean(subtask.done)).length;
    return doneSubtasks / task.subtasks.length;
  }
  return task.done ? 1 : 0;
}

function getProgress(tasks) {
  const total = tasks.length;
  const done = tasks.filter((task) => isTaskComplete(task)).length;
  const progressUnits = tasks.reduce((sum, task) => sum + getTaskProgressRatio(task), 0);
  const percent = total === 0 ? 0 : Math.round((progressUnits / total) * 100);
  return { total, done, percent };
}

function isDeadlineExpired(deadline) {
  if (!deadline) return false;
  const [year, month, day] = deadline.split("-").map(Number);
  if (!year || !month || !day) return false;

  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return target < today;
}

function getDaysLeft(deadline) {
  if (!deadline) return null;
  const [year, month, day] = deadline.split("-").map(Number);
  if (!year || !month || !day) return null;

  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

function getDeadlineInfo(deadline) {
  if (!deadline) {
    return { label: "Срок не указан", tone: "empty" };
  }

  const [year, month, day] = deadline.split("-").map(Number);
  if (!year || !month || !day) {
    return { label: "Срок не указан", tone: "empty" };
  }

  const daysLeft = getDaysLeft(deadline);
  const label = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;

  if (daysLeft < 0) {
    return { label: `${label} · срок прошёл`, tone: "danger" };
  }
  if (daysLeft === 0) {
    return { label: `${label} · сегодня`, tone: "danger" };
  }
  if (daysLeft <= 3) {
    return { label: `${label} · ${formatDaysLeft(daysLeft)}`, tone: "danger" };
  }
  if (daysLeft <= 7) {
    return { label: `${label} · ${formatDaysLeft(daysLeft)}`, tone: "warning" };
  }

  return { label: `${label} · ${formatDaysLeft(daysLeft)}`, tone: "success" };
}

function formatDaysLeft(days) {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) return `${days} день`;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${days} дня`;
  }
  return `${days} дней`;
}

function getSortedParticipants() {
  return [...state.participants].sort((a, b) => {
    const progressDiff = getDashboardProgress(b).percent - getDashboardProgress(a).percent;
    if (progressDiff !== 0) return progressDiff;
    return a.name.localeCompare(b.name, "ru");
  });
}

function getDashboardProgress(participant) {
  if (getActiveCompletedGoalNotice(participant)) {
    return { total: 1, done: 1, percent: 100 };
  }

  return getProgress(participant.tasks);
}

function getActiveCompletedGoalNotice(participant) {
  const notice = normalizeCompletedGoalNotice(participant?.completedGoalNotice);
  if (!notice) {
    if (participant) participant.completedGoalNotice = null;
    return null;
  }
  participant.completedGoalNotice = notice;
  return notice;
}

function render() {
  if (archiveFinishedGoals()) {
    saveState();
  }
  renderWelcomeGate();
  renderSiteImages();
  renderAdminControls();
  renderActiveBadge();
  renderResults();
  renderProfile();
  renderAnnouncementModal();
  renderDeadlineWarningModal();
  applyEditableText();
  if (tourModal && !tourModal.hidden) {
    renderTourStep();
  }
}

function renderWelcomeGate() {
  if (!welcomeGate) return;
  const active = findParticipant(state.activeParticipantId);
  const shouldShow = !active && !state.isAdmin && !isAdminRoute();
  welcomeGate.hidden = !shouldShow;
  document.body.classList.toggle("is-welcome-gate", shouldShow);
}

function renderAdminControls() {
  document.body.classList.toggle("is-admin", state.isAdmin);
  document.body.classList.toggle("is-text-edit-mode", state.isAdmin && textEditMode);
  if (openAdminButton) {
    openAdminButton.hidden = true;
  }
  adminLoginButton.hidden = state.isAdmin;
  openAnnouncementButton.hidden = !state.isAdmin;
  openRegistrationPasswordButton.hidden = !state.isAdmin;
  if (openAdminSettingsButton) {
    openAdminSettingsButton.hidden = !state.isAdmin;
  }
  if (toggleTextEditButton) {
    toggleTextEditButton.hidden = !state.isAdmin;
    toggleTextEditButton.textContent = textEditMode ? "Готово с текстами" : "Редактировать тексты";
  }
  adminLogoutButton.hidden = !state.isAdmin;
  adminAnnouncementPanel.hidden = !state.isAdmin;
  renderAdminPanel();
  if (clearRegistrationPasswordButton) {
    clearRegistrationPasswordButton.hidden = !state.isAdmin || !state.registrationPasswordHash;
  }
  if (registrationStatus) {
    registrationStatus.textContent = state.isAdmin
      ? state.registrationPasswordHash
        ? "Пароль регистрации включён"
        : "Регистрация новых участников закрыта"
      : "";
  }
  renderAnnouncementAdminPanel();
}

function renderAnnouncementAdminPanel() {
  if (!state.isAdmin) return;

  announcementReadList.replaceChildren();
  renderAnnouncementRecipientOptions();

  if (state.announcement?.text) {
    announcementInput.placeholder = state.announcement.text;
    deleteAnnouncementButton.hidden = false;
  } else {
    announcementInput.placeholder = "Напишите важную новость для группы";
    deleteAnnouncementButton.hidden = true;
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Новость ещё не опубликована.";
    announcementReadList.append(empty);
    return;
  }

  if (state.participants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока нет участников для списка прочтения.";
    announcementReadList.append(empty);
    return;
  }

  const targetParticipants = getAnnouncementTargetParticipants(state.announcement);
  if (targetParticipants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Получатель новости не найден.";
    announcementReadList.append(empty);
    return;
  }

  targetParticipants.forEach((participant) => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const status = document.createElement("strong");
    row.className = "read-person";
    const hasRead = Boolean(state.announcement?.readBy?.includes(participant.id));
    row.classList.toggle("has-read", hasRead);
    name.textContent = participant.name;
    status.textContent = hasRead ? "✓ Прочитал" : "Ждём";
    row.append(name, status);
    announcementReadList.append(row);
  });
}

function renderAnnouncementRecipientOptions() {
  if (!announcementRecipientSelect) return;

  const selectedValue = announcementRecipientSelect.value || getAnnouncementRecipientValue(state.announcement);
  announcementRecipientSelect.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Все пользователи";
  announcementRecipientSelect.append(allOption);

  state.participants.forEach((participant) => {
    const option = document.createElement("option");
    option.value = `participant:${participant.id}`;
    option.textContent = participant.name;
    announcementRecipientSelect.append(option);
  });

  announcementRecipientSelect.value = [...announcementRecipientSelect.options].some(
    (option) => option.value === selectedValue,
  )
    ? selectedValue
    : "all";
}

function getAnnouncementRecipientValue(announcement) {
  const recipient = normalizeAnnouncementRecipient(announcement?.recipient);
  return recipient.type === "participant" && recipient.participantId
    ? `participant:${recipient.participantId}`
    : "all";
}

function getAnnouncementTargetParticipants(announcement) {
  const recipient = normalizeAnnouncementRecipient(announcement?.recipient);
  if (recipient.type === "participant") {
    return state.participants.filter((participant) => participant.id === recipient.participantId);
  }

  return state.participants;
}

function shouldShowAnnouncementToParticipant(participant) {
  if (!participant || !state.announcement?.text) return false;
  if (state.announcement.readBy.includes(participant.id)) return false;

  const recipient = normalizeAnnouncementRecipient(state.announcement.recipient);
  if (recipient.type === "participant" && recipient.participantId !== participant.id) return false;
  if (recipient.type === "all" && !participant.onboardingCompleted) return false;

  return true;
}

function renderAnnouncementModal() {
  const active = findParticipant(state.activeParticipantId);
  const shouldShow =
    active &&
    !state.isAdmin &&
    shouldShowAnnouncementToParticipant(active) &&
    welcomeGate.hidden &&
    loginModal.hidden &&
    adminModal.hidden &&
    adminNewsModal.hidden &&
    tourModal.hidden;

  announcementModal.hidden = !shouldShow;
  if (shouldShow) {
    announcementText.textContent = state.announcement.text;
  }
}

function renderDeadlineWarningModal() {
  if (!deadlineWarningModal) return;

  const active = findParticipant(state.activeParticipantId);
  const daysLeft = getDaysLeft(active?.deadline || "");
  const shouldShow =
    active &&
    !state.isAdmin &&
    hasActiveGoal(active) &&
    active.deadline &&
    active.deadlineWarningDismissedFor !== active.deadline &&
    daysLeft !== null &&
    daysLeft >= 0 &&
    daysLeft <= 7 &&
    welcomeGate.hidden &&
    loginModal.hidden &&
    adminModal.hidden &&
    adminNewsModal.hidden &&
    announcementModal.hidden &&
    tourModal.hidden;

  deadlineWarningModal.hidden = !shouldShow;
  if (!shouldShow) return;

  const timeText = daysLeft === 0 ? "сегодня последний день" : `осталось ${formatDaysLeft(daysLeft)}`;
  deadlineWarningText.textContent = `По цели «${active.goal || "без названия"}» ${timeText}. Самое время сделать следующий шаг.`;
}

function renderActiveBadge() {
  const active = findParticipant(state.activeParticipantId);
  const activeAvatar = document.querySelector("#activeAvatar");

  participantLogoutButton.hidden = !active || state.isAdmin;
  openLoginButton.hidden = Boolean(active) && !state.isAdmin;

  if (state.isAdmin) {
    activeBadge.textContent = "Администратор";
    if (activeAvatar) {
      activeAvatar.hidden = true;
      activeAvatar.src = "";
    }
    return;
  }

  if (active) {
    activeBadge.textContent = `Вошли: ${active.name}`;
    if (activeAvatar) {
      activeAvatar.src = active.picture || "";
      activeAvatar.hidden = !active.picture;
    }
  } else {
    activeBadge.textContent = "Войдите по имени";
    if (activeAvatar) {
      activeAvatar.hidden = true;
      activeAvatar.src = "";
    }
  }
}

function renderResults() {
  const allTasks = state.participants.flatMap((person) => person.tasks);
  const group = getProgress(allTasks);

  peopleCount.textContent = state.participants.length;
  totalTasks.textContent = group.total;
  doneTasks.textContent = group.done;

  resultChart.replaceChildren();
  resultTable.replaceChildren();
  deleteColumnHeader.hidden = !state.isAdmin;

  if (state.participants.length === 0) {
    const chartEmpty = document.createElement("p");
    chartEmpty.className = "empty-state";
    chartEmpty.textContent = "Пока нет участников. Создайте первый аккаунт через кнопку «Войти».";
    resultChart.append(chartEmpty);

    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = state.isAdmin ? 6 : 5;
    cell.className = "table-empty";
    cell.textContent = "Здесь появятся участники, их цели и текущий прогресс.";
    row.append(cell);
    resultTable.append(row);
    return;
  }

  const rankedParticipants = getSortedParticipants();
  const visibleParticipants = rankedParticipants.filter(hasLeaderboardActivity).slice(0, 3);

  if (visibleParticipants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока никто не выполнил шаги.";
    resultChart.append(empty);
  } else {
    visibleParticipants.forEach((participant, index) => {
      const progress = getDashboardProgress(participant);
      renderChartRow(participant, progress, index + 1);
    });
  }

  rankedParticipants.forEach((participant) => {
    const progress = getDashboardProgress(participant);
    renderTableRow(participant, progress);
  });
}

function hasLeaderboardActivity(participant) {
  const progress = getDashboardProgress(participant);
  return progress.percent > 0 || progress.done > 0;
}

function getPlaceBadge(place) {
  if (place === 1) {
    return {
      key: "championBadge",
      icon: "🏆",
      text: state.uiText?.championBadge || "Чемпион дня",
    };
  }
  if (place === 2) {
    return {
      key: "secondPlaceBadge",
      icon: "🥈🥈",
      text: state.uiText?.secondPlaceBadge || "Второе место",
    };
  }
  return {
    key: "thirdPlaceBadge",
    icon: "🥉",
    text: state.uiText?.thirdPlaceBadge || "Третье место",
  };
}

function renderChartRow(participant, progress, place) {
  const node = chartTemplate.content.firstElementChild.cloneNode(true);
  const championBadge = node.querySelector(".champion-badge");
  const avatar = node.querySelector(".chart-avatar");
  const placeIcon = node.querySelector(".place-icon");
  const completedNotice = getActiveCompletedGoalNotice(participant);
  const isChampion = place === 1 || Boolean(completedNotice);
  const placeBadge = completedNotice
    ? {
        key: "completedGoalChampionBadge",
        icon: "🏆",
        text: state.uiText?.completedGoalChampionBadge || "Чемпион",
      }
    : getPlaceBadge(place);

  node.classList.toggle("is-active", isActive(participant.id));
  node.classList.toggle("is-viewed", state.viewedParticipantId === participant.id);
  node.classList.toggle("is-champion", isChampion);
  node.classList.toggle("has-completed-goal", Boolean(completedNotice));
  node.dataset.place = String(place);
  if (avatar) {
    avatar.src = participant.picture || "";
    avatar.hidden = !participant.picture;
    avatar.alt = participant.picture ? `Фото ${participant.name}` : "";
  }
  if (placeIcon) {
    placeIcon.textContent = placeBadge.icon;
    placeIcon.setAttribute("aria-label", placeBadge.text);
  }
  node.querySelector(".chart-name").textContent = participant.name;
  championBadge.dataset.editKey = placeBadge.key;
  championBadge.textContent = placeBadge.text;
  championBadge.hidden = false;
  if (completedNotice) {
    const completedText = document.createElement("span");
    completedText.className = "completed-goal-note";
    completedText.textContent = `${formatCompletedDate(completedNotice.completedAt)} выполнил свою цель`;
    node.querySelector(".chart-person").append(completedText);
    if (state.isAdmin) {
      const clearButton = document.createElement("span");
      clearButton.className = "completed-goal-clear";
      clearButton.textContent = "Удалить";
      clearButton.setAttribute("role", "button");
      clearButton.tabIndex = 0;
      clearButton.addEventListener("click", (event) => {
        event.stopPropagation();
        clearCompletedGoalNotice(participant.id);
      });
      clearButton.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        clearCompletedGoalNotice(participant.id);
      });
      node.querySelector(".chart-person").append(clearButton);
    }
  }
  node.querySelector(".chart-percent").textContent = `${progress.percent}%`;
  node.querySelector(".chart-bar").style.width = `${progress.percent}%`;
  node.addEventListener("click", () => viewParticipant(participant.id));

  resultChart.append(node);
}

function renderTableRow(participant, progress) {
  const row = tableRowTemplate.content.firstElementChild.cloneNode(true);
  const nameButton = row.querySelector(".table-name");
  const nameText = row.querySelector(".table-name-text");
  const avatar = row.querySelector(".table-avatar");
  const adminCell = row.querySelector(".table-admin");
  const adminDeleteButton = row.querySelector(".admin-delete");

  row.classList.toggle("is-viewed", state.viewedParticipantId === participant.id);
  nameText.textContent = participant.name;
  if (avatar) {
    avatar.src = participant.picture || "";
    avatar.hidden = !participant.picture;
    avatar.alt = participant.picture ? `Фото ${participant.name}` : "";
  }
  nameButton.addEventListener("click", () => viewParticipant(participant.id));
  const completedNotice = getActiveCompletedGoalNotice(participant);
  row.querySelector(".table-goal").textContent = completedNotice
    ? `${formatCompletedDate(completedNotice.completedAt)} выполнил свою цель`
    : participant.goal || "Цель ещё не указана";
  const deadlinePill = row.querySelector(".deadline-pill");
  const deadlineInfo = getDeadlineInfo(participant.deadline);
  deadlinePill.textContent = deadlineInfo.label;
  deadlinePill.classList.add(`deadline-${deadlineInfo.tone}`);
  row.querySelector(".table-count").textContent = completedNotice
    ? "Цель выполнена"
    : `${progress.done} из ${progress.total}`;
  row.querySelector(".table-progress-bar").style.width = `${progress.percent}%`;
  row.querySelector(".table-progress-percent").textContent = `${progress.percent}%`;
  adminCell.hidden = !state.isAdmin;
  adminDeleteButton.addEventListener("click", () => deleteAccount(participant.id));

  resultTable.append(row);
}

function renderProfile() {
  profileView.replaceChildren();

  const participant = findParticipant(state.viewedParticipantId) || state.participants[0];
  if (!participant) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока нет участников. Создайте первый аккаунт.";
    profileView.append(empty);
    return;
  }

  const progress = getProgress(participant.tasks);
  const editable = isActive(participant.id);
  const canEditDeadline = state.isAdmin || (editable && !participant.deadlineLocked);
  const node = profileTemplate.content.firstElementChild.cloneNode(true);
  const goalInput = node.querySelector(".person-goal");
  const deadlineInput = node.querySelector(".person-deadline");
  const deadlineError = node.querySelector(".deadline-error");
  const taskForm = node.querySelector(".task-form");
  const taskInput = node.querySelector(".task-input");
  const taskList = node.querySelector(".task-list");
  const archiveList = node.querySelector(".archive-list");
  const nextGoalPanel = node.querySelector(".next-goal-panel");
  const newGoalButton = node.querySelector(".new-goal-button");
  const profileAvatar = node.querySelector(".profile-avatar");
  const deleteAccountButton = node.querySelector(".delete-account");

  node.classList.toggle("is-active", editable);
  node.querySelector(".person-label").textContent = editable ? "Ваша страница" : "Публичный просмотр";
  node.querySelector("h2").textContent = participant.name;
  node.querySelector(".person-percent").textContent = `${progress.percent}%`;
  node.querySelector(".person-count").textContent = `${progress.done} из ${progress.total} выполнено`;
  node.querySelector(".progress-bar").style.width = `${progress.percent}%`;

  deleteAccountButton.hidden = !state.isAdmin;
  deleteAccountButton.addEventListener("click", () => deleteAccount(participant.id));

  if (profileAvatar) {
    profileAvatar.src = participant.picture || "";
    profileAvatar.hidden = !participant.picture;
  }

  goalInput.value = participant.goal;
  goalInput.disabled = !editable;
  goalInput.addEventListener("input", () => updateGoal(participant.id, goalInput.value.trim()));
  goalInput.addEventListener("blur", () => {
    if (scheduledSaveTimer) {
      saveState();
    }
  });

  deadlineInput.value = participant.deadline || "";
  deadlineInput.disabled = !canEditDeadline;
  let deadlineCommitTimer = 0;
  let datePickerOpenedAt = 0;
  let datePickerOpenedValue = deadlineInput.value;
  const clearDeadlineError = () => {
    deadlineInput.classList.remove("is-invalid");
    if (deadlineError) {
      deadlineError.hidden = true;
    }
  };
  let deadlineConfirmationInProgress = false;
  const commitDeadlineChange = async () => {
    window.clearTimeout(deadlineCommitTimer);
    deadlineCommitTimer = 0;
    const nextDeadline = deadlineInput.value;
    if (nextDeadline === (participant.deadline || "")) return;
    if (deadlineConfirmationInProgress) return;

    if (!state.isAdmin && nextDeadline) {
      deadlineConfirmationInProgress = true;
      const confirmationResult = await confirmDeadlineChoice(nextDeadline);
      deadlineConfirmationInProgress = false;
      if (confirmationResult === "edit") {
        reopenDatePicker(deadlineInput);
        return;
      }
      if (!confirmationResult) {
        deadlineInput.value = participant.deadline || "";
        return;
      }
    }
    clearDeadlineError();
    updateDeadline(participant.id, nextDeadline);
  };
  const scheduleDeadlineCommit = () => {
    window.clearTimeout(deadlineCommitTimer);
    deadlineCommitTimer = window.setTimeout(() => {
      commitDeadlineChange();
    }, 450);
  };
  const rememberDatePickerOpen = () => {
    datePickerOpenedAt = Date.now();
    datePickerOpenedValue = participant.deadline || "";
  };
  deadlineInput.addEventListener("input", clearDeadlineError);
  deadlineInput.addEventListener("pointerdown", rememberDatePickerOpen);
  deadlineInput.addEventListener("focus", rememberDatePickerOpen);
  deadlineInput.addEventListener("change", () => {
    const openedRecently = Date.now() - datePickerOpenedAt < 900;
    const nativeOpenedWithToday =
      !datePickerOpenedValue &&
      deadlineInput.value === getTodayDateValue() &&
      openedRecently;
    if (nativeOpenedWithToday) return;
    scheduleDeadlineCommit();
  });

  taskForm.hidden = !editable;
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await commitDeadlineChange();
    if (participant.goal.trim() && !participant.deadline) {
      deadlineInput.classList.add("is-invalid");
      if (deadlineError) {
        deadlineError.hidden = false;
      }
      deadlineInput.focus();
      return;
    }
    addTask(participant.id, taskInput.value);
    taskInput.value = "";
  });

  participant.tasks.forEach((task, index) => {
    taskList.append(createTaskCard(participant.id, task, editable, index, participant.tasks.length));
  });

  if (participant.tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = editable ? "Добавьте первый шаг к цели." : "Пока нет шагов.";
    taskList.append(empty);
  }

  renderGoalArchive(archiveList, participant);
  const canStartNextGoal =
    editable &&
    !hasActiveGoal(participant) &&
    Array.isArray(participant.archivedGoals) &&
    participant.archivedGoals.length > 0;
  if (nextGoalPanel) {
    nextGoalPanel.hidden = !canStartNextGoal;
  }
  newGoalButton?.addEventListener("click", () => {
    const now = Date.now();
    if (participant.completedGoalNotice) {
      participant.completedGoalNotice = null;
    }
    participant.goalCycleStartedAt = now;
    participant.goalArchivedAt = 0;
    participant.tasks = [];
    participant.taskListUpdatedAt = now;
    saveState();
    renderResults();
    goalInput.focus();
    goalInput.scrollIntoView({ block: "center", behavior: "smooth" });
  });

  profileView.append(node);
}

function renderGoalArchive(container, participant) {
  if (!container) return;
  container.replaceChildren();

  const archivedGoals = Array.isArray(participant.archivedGoals) ? participant.archivedGoals : [];
  if (archivedGoals.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Архив целей пока пуст.";
    container.append(empty);
    return;
  }

  archivedGoals.forEach((goal) => {
    const card = document.createElement("article");
    const main = document.createElement("div");
    const title = document.createElement("strong");
    const meta = document.createElement("p");
    const status = document.createElement("span");
    const isCompleted = goal.status === "completed";

    card.className = "archive-card";
    card.classList.toggle("archive-card-completed", isCompleted);
    card.classList.toggle("archive-card-expired", !isCompleted);
    main.className = "archive-main";
    title.textContent = goal.title || "Цель без названия";
    meta.textContent = getArchiveMeta(goal);
    status.className = `archive-status archive-${isCompleted ? "completed" : "expired"}`;
    status.textContent = isCompleted ? "Цель достигнута" : "Не достигнута";

    main.append(title, meta);
    if (isCompleted) {
      const trophy = document.createElement("span");
      trophy.className = "archive-trophy";
      trophy.textContent = "🏆";
      trophy.setAttribute("aria-label", "Цель достигнута");
      card.append(trophy);
    }
    card.append(main, status);

    if (state.isAdmin) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "archive-delete";
      deleteButton.type = "button";
      deleteButton.textContent = "Удалить";
      deleteButton.addEventListener("click", () => deleteArchivedGoal(participant.id, goal.id));
      card.append(deleteButton);
    }

    container.append(card);
  });
}

function getArchiveMeta(goal) {
  const parts = [];
  if (goal.deadline) {
    parts.push(`срок ${formatDate(goal.deadline)}`);
  }
  parts.push(`${goal.doneTasks || 0} из ${goal.totalTasks || 0} шагов`);
  parts.push(`${goal.progress || 0}%`);
  return parts.join(" · ");
}

function formatDate(dateValue) {
  const [year, month, day] = String(dateValue || "").split("-").map(Number);
  if (!year || !month || !day) return "без срока";
  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
}

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCompletedDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Сегодня";

  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function createSubtaskCard(participantId, taskId, subtask, editable) {
  const card = subtaskTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = card.querySelector(".complete-checkbox");
  const editButton = card.querySelector(".edit-subtask");

  card.dataset.subtaskId = subtask.id;
  card.classList.toggle("is-done", Boolean(subtask.done));
  card.querySelector(".card-title").textContent = subtask.title;
  checkbox.checked = Boolean(subtask.done);
  checkbox.disabled = !editable || subtask.done;
  editButton.hidden = !editable || subtask.done;

  checkbox.addEventListener("change", () => toggleSubtask(participantId, taskId, subtask.id, checkbox.checked));
  card.addEventListener("pointerdown", (event) => beginSubtaskDrag(event, participantId, taskId, subtask.id));

  // Inline editor for subtask
  let editor = null;
  function openEditor() {
    if (editor) return;
    editor = document.createElement("div");
    editor.className = "task-editor";
    const input = document.createElement("input");
    input.className = "task-editor-input";
    input.value = subtask.title;
    const save = document.createElement("button");
    save.type = "button";
    save.className = "task-editor-save";
    save.textContent = "Сохранить";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "task-editor-cancel";
    cancel.textContent = "Отмена";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "task-editor-delete";
    del.textContent = "Удалить";

    const row = document.createElement("div");
    row.className = "task-editor-row";
    row.append(save, cancel, del);

    editor.append(input, row);
    const main = card.querySelector(".subtask-main");
    main.append(editor);
    input.focus();

    save.addEventListener("click", () => {
      const v = input.value && input.value.trim();
      if (!v) return;
      const task = findParticipant(participantId)?.tasks.find((item) => item.id === taskId);
      const now = Date.now();
      subtask.title = v;
      subtask.updatedAt = now;
      if (task) task.updatedAt = now;
      const participant = findParticipant(participantId);
      if (participant) participant.taskListUpdatedAt = now;
      saveState();
      render();
    });

    cancel.addEventListener("click", () => {
      editor.remove();
      editor = null;
    });

    del.addEventListener("click", () => {
      const confirmed = window.confirm("Удалить этот дополнительный шаг? Это действие нельзя отменить.");
      if (!confirmed) return;
      deleteSubtask(participantId, taskId, subtask.id);
    });
  }

  editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditor();
  });

  return card;
}

function createTaskCard(participantId, task, editable, index, totalTasks) {
  const card = taskTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = card.querySelector(".complete-checkbox");
  const editButton = card.querySelector(".edit-task");
  const addSubtaskButton = card.querySelector(".add-subtask");
  const subtaskToggle = card.querySelector(".subtask-toggle");
  const subtaskPanel = card.querySelector(".subtask-panel");
  const subtaskForm = card.querySelector(".subtask-form");
  const subtaskInput = card.querySelector(".subtask-input");
  const subtaskList = card.querySelector(".subtask-list");

  const completed = isTaskComplete(task);
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const remaining = subtasks.filter((subtask) => !subtask.done).length;
  if (completed && subtasks.length > 0 && !task.subtasksHidden) {
    task.subtasksHidden = true;
  }

  const subtaskCountEl = card.querySelector(".subtask-count");
  if (subtasks.length > 0) {
    const completedSub = subtasks.length - remaining;
    subtaskCountEl.textContent = `${completedSub} из ${subtasks.length}`;
    subtaskCountEl.hidden = false;
  } else {
    subtaskCountEl.hidden = true;
  }

  const completeBadge = card.querySelector(".task-complete-badge");
  card.dataset.taskId = task.id;
  card.classList.toggle("is-done", completed);
  card.querySelector(".card-title").textContent = task.title;
  checkbox.checked = completed;
  checkbox.disabled = !editable || subtasks.length > 0 || completed;
  editButton.hidden = !editable || completed;
  completeBadge.hidden = !completed;
  addSubtaskButton.hidden = !editable || completed;
  subtaskToggle.hidden = subtasks.length === 0 || completed;
  subtaskToggle.textContent = subtasks.length === 0
    ? ""
    : `${task.subtasksHidden ? "Показать" : "Скрыть"} доп. шаги (${remaining})`;
  subtaskPanel.hidden = subtasks.length === 0 || task.subtasksHidden || completed;

  checkbox.addEventListener("change", () => toggleTask(participantId, task.id, checkbox.checked));
  card.addEventListener("pointerdown", (event) => beginCardDrag(event, participantId, task.id));
  subtaskToggle.addEventListener("click", () => toggleSubtasksVisibility(participantId, task.id));
  addSubtaskButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isTaskComplete(task)) return;
    task.subtasksHidden = false;
    // reveal panel immediately in current DOM
    subtaskPanel.hidden = false;
    saveState();
    // focus the input directly (no full re-render required)
    requestAnimationFrame(() => {
      subtaskInput.focus();
    });
  });

  subtaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addSubtask(participantId, task.id, subtaskInput.value);
    subtaskInput.value = "";
  });

  subtaskList.replaceChildren();
  if (subtasks.length === 0 && !subtaskPanel.hidden) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока нет дополнительных шагов.";
    subtaskList.append(empty);
  }

  subtasks.forEach((subtask) => {
    subtaskList.append(createSubtaskCard(participantId, task.id, subtask, editable));
  });

  // Inline editor
  let editor = null;
  function openEditor() {
    if (editor) return;
    editor = document.createElement("div");
    editor.className = "task-editor";
    const input = document.createElement("input");
    input.className = "task-editor-input";
    input.value = task.title;
    const save = document.createElement("button");
    save.type = "button";
    save.className = "task-editor-save";
    save.textContent = "Сохранить";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "task-editor-cancel";
    cancel.textContent = "Отмена";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "task-editor-delete";
    del.textContent = "Удалить";

    const row = document.createElement("div");
    row.className = "task-editor-row";
    row.append(save, cancel, del);

    editor.append(input, row);
    const main = card.querySelector(".task-main");
    main.append(editor);
    input.focus();

    save.addEventListener("click", () => {
      const v = input.value && input.value.trim();
      if (!v) return;
      if (isTaskComplete(task)) return;
      const now = Date.now();
      task.title = v;
      task.updatedAt = now;
      const participant = findParticipant(participantId);
      if (participant) participant.taskListUpdatedAt = now;
      saveState();
      render();
    });

    cancel.addEventListener("click", () => {
      editor.remove();
      editor = null;
    });

    del.addEventListener("click", () => {
      const confirmed = window.confirm("Удалить этот шаг? Это действие нельзя отменить.");
      if (!confirmed) return;
      deleteTask(participantId, task.id);
    });
  }

  editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    openEditor();
  });

  return card;
}
