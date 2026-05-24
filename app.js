const STORAGE_KEY = "boddy-board-v2";
const SESSION_KEY = "boddy-board-session-v1";
const LEGACY_KEYS = ["boddy-board-v1", "goal-board-v1"];
const SHARED_STATE_URL = "https://boddy-board-github.vercel.app/api/state";
const ADMIN_LOGIN = "Sasha";
const DEFAULT_ADMIN_PASSWORD = "S_asha2305";
const PASSWORD_RESET_CODE = "Любовь";
const LEGACY_DEFAULT_LOGO_URL = "assets/boddy-logo.jpg";
const DEFAULT_LOGO_URL = "assets/boddy-rocket-logo.png";
const LEGACY_DEFAULT_COVER_URL = "assets/boddy-cover.png";
const DEFAULT_COVER_URL = "assets/boddy-premium-cover.png";
const COMPLETED_GOAL_NOTICE_TTL = 7 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const STATUS_TIERS = [
  {
    key: "newbie",
    title: "НОВИЧОК",
    iconName: "sprout",
    description: "человек только начал путь.",
    minStreak: 0,
    maxStreak: 2,
  },
  {
    key: "walker",
    title: "ИДУЩИЙ",
    iconName: "path",
    description: "человек начинает двигаться стабильно.",
    minStreak: 3,
    maxStreak: 6,
  },
  {
    key: "stable",
    title: "СТАБИЛЬНЫЙ",
    iconName: "medal",
    description: "человек держит дисциплину.",
    minStreak: 7,
    maxStreak: 14,
  },
  {
    key: "champion",
    title: "ЧЕМПИОН",
    iconName: "trophy",
    description: "человек показывает высокий уровень стабильности.",
    minStreak: 15,
    maxStreak: 29,
  },
  {
    key: "legend",
    title: "ЛЕГЕНДА",
    iconName: "crown",
    description: "человек стал примером дисциплины.",
    minStreak: 30,
    maxStreak: Infinity,
  },
];
const PATH_ZONE_TITLES = {
  newbie: "Начало пути",
  walker: "Формирование привычки",
  stable: "Стабильность",
  champion: "Сильная форма",
  legend: "Пик дисциплины",
};
const PATH_ZONE_LIMIT = 3;
const PREMIUM_EMOJI_PATTERN = /[🌱🔥🏅🏆👑🚶✨✦⚡❄️⚠️🥇🥈🥉🎖️🎯📅]/gu;
const SVG_NS = "http://www.w3.org/2000/svg";
const PREMIUM_ICON_PATHS = {
  sprout: [
    { tag: "path", d: "M12 20V10" },
    { tag: "path", d: "M12 10C8 6 5 6 3 9c3 1 6 2 9 1Z" },
    { tag: "path", d: "M12 10c4-5 8-5 10-1-4 0-7 1-10 1Z" },
  ],
  flame: [
    { tag: "path", d: "M12 21c4 0 7-3 7-7 0-3-2-6-5-9-.3 2-1.1 3.5-2.4 4.7C10.4 8 9.8 6.2 10 4 7 6.8 5 10 5 14c0 4 3 7 7 7Z" },
    { tag: "path", d: "M12 17c1.7 0 3-1.3 3-3 0-1.2-.7-2.3-2-3.5-.2 1-.7 1.8-1.5 2.4-.7-.8-1-1.7-.9-2.9C9.5 11.2 9 12.5 9 14c0 1.7 1.3 3 3 3Z" },
  ],
  medal: [
    { tag: "path", d: "M8 3h8l-2.5 5h-3L8 3Z" },
    { tag: "circle", cx: "12", cy: "14", r: "5" },
    { tag: "path", d: "m10.5 14 1 1 2-2.2" },
  ],
  trophy: [
    { tag: "path", d: "M8 4h8v4a4 4 0 0 1-8 0V4Z" },
    { tag: "path", d: "M8 6H5a3 3 0 0 0 3 4" },
    { tag: "path", d: "M16 6h3a3 3 0 0 1-3 4" },
    { tag: "path", d: "M12 12v4" },
    { tag: "path", d: "M8.5 20h7" },
    { tag: "path", d: "M10 16h4l1 4H9l1-4Z" },
  ],
  crown: [
    { tag: "path", d: "m4 9 4 3 4-7 4 7 4-3-1.5 10h-13L4 9Z" },
    { tag: "path", d: "M6 19h12" },
  ],
  path: [
    { tag: "path", d: "M5 18c3-6 10 0 14-8" },
    { tag: "circle", cx: "5", cy: "18", r: "1.7" },
    { tag: "circle", cx: "19", cy: "10", r: "1.7" },
    { tag: "path", d: "M10 14h.01" },
    { tag: "path", d: "M14 13h.01" },
  ],
  sparkle: [
    { tag: "path", d: "M12 3v5" },
    { tag: "path", d: "M12 16v5" },
    { tag: "path", d: "M3 12h5" },
    { tag: "path", d: "M16 12h5" },
    { tag: "path", d: "m7.8 7.8-2-2" },
    { tag: "path", d: "m18.2 18.2-2-2" },
    { tag: "path", d: "m16.2 7.8 2-2" },
    { tag: "path", d: "m5.8 18.2 2-2" },
  ],
  dot: [{ tag: "circle", cx: "12", cy: "12", r: "4" }],
  bolt: [{ tag: "path", d: "M13 2 5 13h6l-1 9 8-12h-6l1-8Z" }],
  calendar: [
    { tag: "path", d: "M7 3v4" },
    { tag: "path", d: "M17 3v4" },
    { tag: "path", d: "M4 8h16" },
    { tag: "rect", x: "4", y: "5", width: "16", height: "15", rx: "3" },
  ],
  warning: [
    { tag: "path", d: "M12 4 3.5 19h17L12 4Z" },
    { tag: "path", d: "M12 9v4" },
    { tag: "path", d: "M12 17h.01" },
  ],
  snow: [
    { tag: "path", d: "M12 3v18" },
    { tag: "path", d: "M5 7l14 10" },
    { tag: "path", d: "M19 7 5 17" },
  ],
};

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
let currentView = "community";
const readonlySubtasksOpen = new Set();
const expandedArchiveParticipants = new Set();
let pendingGoalCompletion = null;
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
const adminLogoUrlInput = document.querySelector("#adminLogoUrlInput");
const adminLogoFileInput = document.querySelector("#adminLogoFileInput");
const saveAdminLogoButton = document.querySelector("#saveAdminLogoButton");
const resetAdminLogoButton = document.querySelector("#resetAdminLogoButton");
const adminCoverUrlInput = document.querySelector("#adminCoverUrlInput");
const adminCoverFileInput = document.querySelector("#adminCoverFileInput");
const saveAdminCoverButton = document.querySelector("#saveAdminCoverButton");
const resetAdminCoverButton = document.querySelector("#resetAdminCoverButton");
const participantPhotoSelect = document.querySelector("#participantPhotoSelect");
const participantPhotoUrlInput = document.querySelector("#participantPhotoUrlInput");
const participantPhotoFileInput = document.querySelector("#participantPhotoFileInput");
const saveParticipantPhotoButton = document.querySelector("#saveParticipantPhotoButton");
const clearParticipantPhotoButton = document.querySelector("#clearParticipantPhotoButton");
const toggleAdminParticipantsButton = document.querySelector("#toggleAdminParticipantsButton");
const adminParticipantsPanel = document.querySelector("#adminParticipantsPanel");
const adminParticipantsList = document.querySelector("#adminParticipantsList");
const inactivityThresholdInput = document.querySelector("#inactivityThresholdInput");
const inactivityThresholdUnit = document.querySelector("#inactivityThresholdUnit");
const saveInactivityThresholdButton = document.querySelector("#saveInactivityThresholdButton");
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
const welcomeCover = document.querySelector("#welcomeCover");
const authMessage = document.querySelector("#authMessage");
const adminMessage = document.querySelector("#adminMessage");
const peopleCount = document.querySelector("#peopleCount");
const totalTasks = document.querySelector("#totalTasks");
const doneTasks = document.querySelector("#doneTasks");
const resultChart = document.querySelector("#resultChart");
const resultTable = document.querySelector("#resultTable");
const participantPath = document.querySelector("#participantPath");
const deleteColumnHeader = document.querySelector("#deleteColumnHeader");
const personalEntry = document.querySelector("#personalEntry");
const profileView = document.querySelector("#profileView");
const chartTemplate = document.querySelector("#chartTemplate");
const tableRowTemplate = document.querySelector("#tableRowTemplate");
const profileTemplate = document.querySelector("#profileTemplate");
const taskTemplate = document.querySelector("#taskTemplate");
const subtaskTemplate = document.querySelector("#subtaskTemplate");
const goalCompletionModal = document.querySelector("#goalCompletionModal");
const goalCompletionHeading = document.querySelector("#goalCompletionHeading");
const goalCompletionTitle = document.querySelector("#goalCompletionTitle");
const goalCompletionStreak = document.querySelector("#goalCompletionStreak");
const goalCompletionSteps = document.querySelector("#goalCompletionSteps");
const goalCompletionStatus = document.querySelector("#goalCompletionStatus");
const goalCompletionDate = document.querySelector("#goalCompletionDate");
const goalCompletionNewGoalButton = document.querySelector("#goalCompletionNewGoalButton");
const goalCompletionArchiveButton = document.querySelector("#goalCompletionArchiveButton");

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
saveAdminLogoButton?.addEventListener("click", () => saveAdminSiteImage("logo"));
resetAdminLogoButton?.addEventListener("click", () => resetAdminSiteImage("logo"));
saveAdminCoverButton?.addEventListener("click", () => saveAdminSiteImage("cover"));
resetAdminCoverButton?.addEventListener("click", () => resetAdminSiteImage("cover"));
saveParticipantPhotoButton?.addEventListener("click", saveParticipantPhoto);
clearParticipantPhotoButton?.addEventListener("click", clearParticipantPhoto);
participantPhotoSelect?.addEventListener("change", syncParticipantPhotoInput);
toggleAdminParticipantsButton?.addEventListener("click", toggleAdminParticipantsPanel);
saveInactivityThresholdButton?.addEventListener("click", saveInactivityThreshold);
openAnnouncementButton.addEventListener("click", openAdminNewsModal);
openRegistrationPasswordButton?.addEventListener("click", () => openModal(registrationPasswordModal, registrationPasswordInput));
saveRegistrationPasswordButton?.addEventListener("click", saveRegistrationPassword);
clearRegistrationPasswordButton?.addEventListener("click", clearRegistrationPassword);
adminLogoutButton.addEventListener("click", logoutAdmin);
publishAnnouncementButton.addEventListener("click", publishAnnouncement);
deleteAnnouncementButton.addEventListener("click", () => deleteAnnouncement());
closeAnnouncementButton.addEventListener("click", markAnnouncementRead);
closeDeadlineWarningButton?.addEventListener("click", dismissDeadlineWarning);
editDeadlineConfirmButton?.addEventListener("click", () => resolveDeadlineConfirmation("edit"));
closeDeadlineConfirmButton?.addEventListener("click", () => resolveDeadlineConfirmation(false));
cancelDeadlineConfirmButton?.addEventListener("click", () => resolveDeadlineConfirmation("edit"));
confirmDeadlineButton?.addEventListener("click", () => resolveDeadlineConfirmation(true));
goalCompletionNewGoalButton?.addEventListener("click", () => {
  const participantId = pendingGoalCompletion?.participantId || state.activeParticipantId;
  pendingGoalCompletion = null;
  if (goalCompletionModal) goalCompletionModal.hidden = true;
  startNextGoal(participantId);
});
goalCompletionArchiveButton?.addEventListener("click", () => {
  const participantId = pendingGoalCompletion?.participantId || state.activeParticipantId;
  pendingGoalCompletion = null;
  if (goalCompletionModal) goalCompletionModal.hidden = true;
  viewParticipant(participantId);
  requestAnimationFrame(() => {
    document.querySelector(".goal-archive")?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
});
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

function createTask(title, done = false, subtasks = [], order = 0) {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title,
    done,
    order,
    createdAt: now,
    updatedAt: now,
    completedAt: done ? now : 0,
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
  if (maintainParticipantStatuses()) {
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
    const hasStatusChanges = maintainParticipantStatuses();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
    if (hasArchivedGoals || hasExpiredNotices || hasStatusChanges) {
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
    const mergedState = mergeSharedStates(sharedState, localState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(mergedState)));
    if (JSON.stringify(toSharedState(mergedState)) !== JSON.stringify(toSharedState(sharedState))) {
      saveSharedState(mergedState);
    }
    return mergedState;
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
    profileUpdatedAt: Number(person.profileUpdatedAt || 0),
    authProvider: person.authProvider || "",
    passwordHash: person.passwordHash || "",
    goal: person.goal || "",
    deadline: person.deadline || "",
    deadlineLocked: Boolean(person.deadlineLocked),
    deadlineWarningDismissedFor: person.deadlineWarningDismissedFor || "",
    goalCycleStartedAt: Number(person.goalCycleStartedAt || 0),
    goalArchivedAt: Number(person.goalArchivedAt || 0),
    taskListUpdatedAt: Number(person.taskListUpdatedAt || 0),
    activityDates: normalizeActivityDates(person.activityDates),
    currentStreak: Number(person.currentStreak || 0),
    bestStreak: Number(person.bestStreak || 0),
    lastActivityDate: person.lastActivityDate || "",
    lastStatusKey: person.lastStatusKey || "",
    tempoWarningShownFor: person.tempoWarningShownFor || "",
    onboardingCompleted: Boolean(person.onboardingCompleted),
    completedGoalNotice: normalizeCompletedGoalNotice(person.completedGoalNotice),
    archivedGoals: Array.isArray(person.archivedGoals)
      ? sortArchivedGoals(person.archivedGoals.map((goal) => ({
          id: goal.id || crypto.randomUUID(),
          title: goal.title || "Цель без названия",
          deadline: goal.deadline || "",
          status: goal.status === "completed" ? "completed" : "expired",
          progress: Number.isFinite(goal.progress) ? goal.progress : 0,
          doneTasks: Number.isFinite(goal.doneTasks) ? goal.doneTasks : 0,
          totalTasks: Number.isFinite(goal.totalTasks) ? goal.totalTasks : 0,
          completedSteps: Number.isFinite(goal.completedSteps) ? goal.completedSteps : Number(goal.doneTasks || 0),
          completedAt: Number(goal.completedAt || goal.archivedAt || Date.now()),
          streakAtCompletion: Number(goal.streakAtCompletion || 0),
          statusTitle: goal.statusTitle || "",
          statusIcon: goal.statusIcon || "",
          archivedAt: goal.archivedAt || Date.now(),
        })))
      : [],
    tasks: Array.isArray(person.tasks)
      ? person.tasks.map((task, taskIndex) => ({
          id: task.id || crypto.randomUUID(),
          title: task.title || "Шаг",
          done: Boolean(task.done || task.status === "done"),
          order: getOrderValue(task, taskIndex),
          createdAt: task.createdAt || Date.now(),
          updatedAt: task.updatedAt || task.createdAt || Date.now(),
          completedAt: Number(task.completedAt || 0),
          subtasks: Array.isArray(task.subtasks)
            ? task.subtasks.map((subtask, subtaskIndex) => ({
                id: subtask.id || crypto.randomUUID(),
                title: subtask.title || "Доп. шаг",
                done: Boolean(subtask.done || subtask.status === "done"),
                order: getOrderValue(subtask, subtaskIndex),
                createdAt: subtask.createdAt || Date.now(),
                updatedAt: subtask.updatedAt || subtask.createdAt || Date.now(),
                completedAt: Number(subtask.completedAt || 0),
              }))
            : [],
          subtasksHidden: typeof task.subtasksHidden === "boolean" ? task.subtasksHidden : true,
        }))
      : [],
  }));
  participants.forEach(normalizeParticipantTasks);
  participants.forEach(normalizeParticipantStatus);
  const announcements = normalizeAnnouncementList(candidate);

  return {
    activeParticipantId: "",
    viewedParticipantId: candidate.viewedParticipantId || participants[0]?.id || "",
    adminPasswordHash: candidate.adminPasswordHashV2 || "",
    adminPasswordChanged: Boolean(candidate.adminPasswordChanged),
    registrationPasswordHash: candidate.registrationPasswordHash || "",
    siteImages: normalizeSiteImages(candidate.siteImages),
    siteImagesUpdatedAt: Number(candidate.siteImagesUpdatedAt || 0),
    uiText: normalizeEditableMap(candidate.uiText),
    uiPlaceholders: normalizeEditableMap(candidate.uiPlaceholders),
    inactivityThresholdDays: normalizeInactivityThresholdDays(candidate.inactivityThresholdDays),
    inactivityThresholdUpdatedAt: Number(candidate.inactivityThresholdUpdatedAt || 0),
    announcements,
    announcement: announcements[0] || null,
    announcementDeletedAt: Number(candidate.announcementDeletedAt || 0),
    deletedAnnouncementIds: Array.isArray(candidate.deletedAnnouncementIds)
      ? candidate.deletedAnnouncementIds.map((id) => String(id)).filter(Boolean)
      : [],
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

  const logo = String(siteImages.logo || "").trim();
  const cover = String(siteImages.cover || "").trim();
  return {
    logo: !logo || logo === LEGACY_DEFAULT_LOGO_URL ? defaults.logo : logo,
    cover: !cover || cover === DEFAULT_LOGO_URL || cover === LEGACY_DEFAULT_COVER_URL ? defaults.cover : cover,
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

function normalizeInactivityThresholdDays(value) {
  const days = Number(value || 7);
  if (!Number.isFinite(days)) return 7;
  return Math.min(365, Math.max(1, Math.round(days)));
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
      siteImagesUpdatedAt: 0,
      uiText: {},
      uiPlaceholders: {},
      inactivityThresholdDays: 7,
      inactivityThresholdUpdatedAt: 0,
      announcements: [],
      announcement: null,
      announcementDeletedAt: 0,
      deletedAnnouncementIds: [],
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
    siteImagesUpdatedAt: 0,
    uiText: {},
    uiPlaceholders: {},
    inactivityThresholdDays: 7,
    inactivityThresholdUpdatedAt: 0,
    announcements: [],
    announcement: null,
    announcementDeletedAt: 0,
    deletedAnnouncementIds: [],
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
  if (picture && picture !== participant.picture) {
    participant.picture = picture;
    participant.profileUpdatedAt = Date.now();
  }
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
    profileUpdatedAt: picture ? Date.now() : 0,
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
  return saveSharedState(state, options).then((savedState) => {
    if (savedState) {
      const activeParticipantId = state.activeParticipantId;
      const viewedParticipantId = state.viewedParticipantId;
      const isAdmin = state.isAdmin;
      state = normalizeState(savedState);
      state.activeParticipantId = state.participants.some((person) => person.id === activeParticipantId)
        ? activeParticipantId
        : "";
      state.viewedParticipantId = state.participants.some((person) => person.id === viewedParticipantId)
        ? viewedParticipantId
        : state.participants[0]?.id || "";
      state.isAdmin = isAdmin;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
    }
    return Boolean(savedState);
  }).finally(() => {
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
    selector: ".participant-path-panel",
    title: "Путь участников",
    text: "Здесь видно, как участники поднимаются по этапам дисциплины: от начала пути до пика стабильности.",
    placement: "bottom",
  },
  {
    selector: "#resultTable",
    title: "Таблица участников",
    text: "В таблице показаны участники, их цель, срок и сколько шагов выполнено.",
    placement: "right",
  },
  {
    selector: ".status-card",
    title: "Мой статус",
    text: "Эта карточка показывает вашу серию дней, рекорд, активность и текущий статус дисциплины.",
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
let adminParticipantsExpanded = false;

function openTour(participantId) {
  if (!tourModal || !tourCard) return;
  const participant = findParticipant(participantId);
  if (participant) {
    state.viewedParticipantId = participant.id;
    currentView = "profile";
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
  const announcements = normalizeAnnouncementList(source);
  return {
    participants: source.participants,
    adminPasswordHashV2: source.adminPasswordHash,
    adminPasswordChanged: Boolean(source.adminPasswordChanged),
    registrationPasswordHash: source.registrationPasswordHash || "",
    siteImages: normalizeSiteImages(source.siteImages),
    siteImagesUpdatedAt: Number(source.siteImagesUpdatedAt || 0),
    uiText: normalizeEditableMap(source.uiText),
    uiPlaceholders: normalizeEditableMap(source.uiPlaceholders),
    inactivityThresholdDays: normalizeInactivityThresholdDays(source.inactivityThresholdDays),
    inactivityThresholdUpdatedAt: Number(source.inactivityThresholdUpdatedAt || 0),
    announcements,
    announcement: announcements[0] || null,
    announcementDeletedAt: Number(source.announcementDeletedAt || 0),
    deletedAnnouncementIds: Array.isArray(source.deletedAnnouncementIds) ? source.deletedAnnouncementIds : [],
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
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(SHARED_STATE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharedState),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Shared state PUT failed: ${response.status}`);
    }
    return normalizeState(await response.json());
  } catch (error) {
    console.warn("Не удалось синхронизировать общую доску.", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState));
    return null;
  } finally {
    window.clearTimeout(timeoutId);
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

  const deletedAnnouncementIds = [
    ...new Set([
      ...(base.deletedAnnouncementIds || []),
      ...(next.deletedAnnouncementIds || []),
    ]),
  ];
  const announcementDeletedAt = Math.max(
    Number(base.announcementDeletedAt || 0),
    Number(next.announcementDeletedAt || 0),
  );
  const announcements = mergeAnnouncements(base, next, deletedAnnouncementIds, announcementDeletedAt);
  const siteImagesUpdatedAt = Math.max(
    Number(base.siteImagesUpdatedAt || 0),
    Number(next.siteImagesUpdatedAt || 0),
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
    siteImages: getNewestSiteImages(base, next),
    siteImagesUpdatedAt,
    uiText: {
      ...base.uiText,
      ...next.uiText,
    },
    uiPlaceholders: {
      ...base.uiPlaceholders,
      ...next.uiPlaceholders,
    },
    inactivityThresholdDays: getNewestInactivityThreshold(base, next),
    inactivityThresholdUpdatedAt: Math.max(
      Number(base.inactivityThresholdUpdatedAt || 0),
      Number(next.inactivityThresholdUpdatedAt || 0),
    ),
    announcements,
    announcement: announcements[0] || null,
    announcementDeletedAt,
    deletedAnnouncementIds,
    deletedParticipantIds: deletedIds,
    activeParticipantId: next.activeParticipantId || base.activeParticipantId,
    viewedParticipantId: next.viewedParticipantId || base.viewedParticipantId,
    isAdmin: next.isAdmin || base.isAdmin,
  };
}

function getNewestSiteImages(baseState, nextState) {
  const baseTime = Number(baseState.siteImagesUpdatedAt || 0);
  const nextTime = Number(nextState.siteImagesUpdatedAt || 0);
  const source = nextTime > baseTime ? nextState : baseState;
  return normalizeSiteImages(source.siteImages);
}

function getNewestProfileSource(baseParticipant = {}, nextParticipant = {}) {
  const baseTime = Number(baseParticipant.profileUpdatedAt || 0);
  const nextTime = Number(nextParticipant.profileUpdatedAt || 0);
  if (baseTime || nextTime) {
    return nextTime >= baseTime ? nextParticipant : baseParticipant;
  }
  return nextParticipant.picture || !baseParticipant.picture ? nextParticipant : baseParticipant;
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
  const profileSource = getNewestProfileSource(baseParticipant, nextParticipant);

  return {
    ...baseParticipant,
    ...nextParticipant,
    passwordHash: nextParticipant.passwordHash || baseParticipant.passwordHash || "",
    picture: hasOwn(profileSource, "picture") ? profileSource.picture || "" : nextParticipant.picture || baseParticipant.picture || "",
    profileUpdatedAt: Math.max(
      Number(baseParticipant.profileUpdatedAt || 0),
      Number(nextParticipant.profileUpdatedAt || 0),
    ),
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
    activityDates: mergeActivityDates(baseParticipant.activityDates, nextParticipant.activityDates),
    currentStreak: Math.max(Number(baseParticipant.currentStreak || 0), Number(nextParticipant.currentStreak || 0)),
    bestStreak: Math.max(Number(baseParticipant.bestStreak || 0), Number(nextParticipant.bestStreak || 0)),
    lastActivityDate: getLatestDateValue(baseParticipant.lastActivityDate, nextParticipant.lastActivityDate),
    lastStatusKey: nextParticipant.lastStatusKey || baseParticipant.lastStatusKey || "",
    tempoWarningShownFor: getLatestDateValue(
      baseParticipant.tempoWarningShownFor,
      nextParticipant.tempoWarningShownFor,
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
  return sortArchivedGoals([...itemsById.values()]);
}

function sortArchivedGoals(goals = []) {
  return [...goals].sort((a, b) => getArchivedGoalTime(b) - getArchivedGoalTime(a));
}

function getArchivedGoalTime(goal = {}) {
  return Math.max(Number(goal.completedAt || 0), Number(goal.archivedAt || 0));
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
  const hasSubtasks = subtasks.length > 0;

  return {
    ...fallbackTask,
    ...preferredTask,
    done: hasSubtasks ? false : Boolean(preferredTask.done),
    order: getPreferredOrder(preferredTask, fallbackTask),
    completedAt: Number(preferredTask.completedAt || fallbackTask.completedAt || 0),
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

function getNextOrder(items = []) {
  return items.reduce((maxOrder, item, index) => Math.max(maxOrder, getOrderValue(item, index)), 0) + 1;
}

function refreshListOrder(items = []) {
  items.forEach((item, index) => {
    item.order = index + 1;
  });
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
    done: Boolean(preferredSubtask.done),
    order: getPreferredOrder(preferredSubtask, fallbackSubtask),
    completedAt: Number(preferredSubtask.completedAt || fallbackSubtask.completedAt || 0),
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

function mergeAnnouncements(baseState, nextState, deletedIds = [], deletedAt = 0) {
  const deletedSet = new Set(deletedIds);
  const announcementsById = new Map();

  [...normalizeAnnouncementList(baseState), ...normalizeAnnouncementList(nextState)].forEach((announcement) => {
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

function mergeAnnouncementReadBy(baseAnnouncement, nextAnnouncement) {
  return [
    ...new Set([
      ...(Array.isArray(baseAnnouncement?.readBy) ? baseAnnouncement.readBy : []),
      ...(Array.isArray(nextAnnouncement?.readBy) ? nextAnnouncement.readBy : []),
    ]),
  ];
}

function getNewestInactivityThreshold(baseState, nextState) {
  const baseTime = Number(baseState.inactivityThresholdUpdatedAt || 0);
  const nextTime = Number(nextState.inactivityThresholdUpdatedAt || 0);
  return normalizeInactivityThresholdDays(
    nextTime >= baseTime
      ? nextState.inactivityThresholdDays
      : baseState.inactivityThresholdDays,
  );
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
      profileUpdatedAt: uploadedPicture ? Date.now() : 0,
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
    if (uploadedPicture) {
      participant.picture = uploadedPicture;
      participant.profileUpdatedAt = Date.now();
    }
    showAuthMessage("Пароль сохранён для этого имени.", false, messageElement);
  } else if (participant.passwordHash !== passwordHash) {
    await syncStateBeforeParticipantLogin();
    participant = state.participants.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );
    if (participant?.passwordHash === passwordHash) {
      if (uploadedPicture) {
        participant.picture = uploadedPicture;
        participant.profileUpdatedAt = Date.now();
      }
      showAuthMessage("Вы вошли в свою страницу.", false, messageElement);
    } else {
      showAuthMessage("Пароль не подходит для этого имени.", true, messageElement);
      participantPasswordInput?.select();
      return;
    }
  } else {
    if (uploadedPicture) {
      participant.picture = uploadedPicture;
      participant.profileUpdatedAt = Date.now();
    }
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
  currentView = "community";
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
    syncSiteImageInputs();
    renderParticipantPhotoOptions();
    renderAdminParticipantsPanel();
  }
}

function toggleAdminParticipantsPanel() {
  if (!state.isAdmin) return;
  adminParticipantsExpanded = !adminParticipantsExpanded;
  renderAdminParticipantsPanel();
}

function saveInactivityThreshold() {
  if (!state.isAdmin) return;
  const value = Number(inactivityThresholdInput?.value || 1);
  const unit = inactivityThresholdUnit?.value === "weeks" ? "weeks" : "days";
  const days = normalizeInactivityThresholdDays(unit === "weeks" ? value * 7 : value);
  state.inactivityThresholdDays = days;
  state.inactivityThresholdUpdatedAt = Date.now();
  saveState();
  showAdminMessage(`Период неактивности сохранён: ${formatDayCount(days)}.`, false);
  renderAdminParticipantsPanel();
}

function renderAdminParticipantsPanel() {
  if (!toggleAdminParticipantsButton || !adminParticipantsPanel || !adminParticipantsList) return;

  const thresholdDays = normalizeInactivityThresholdDays(state.inactivityThresholdDays);
  syncInactivityThresholdControls(thresholdDays);

  adminParticipantsPanel.hidden = !adminParticipantsExpanded;
  toggleAdminParticipantsButton.textContent = adminParticipantsExpanded
    ? "Скрыть участников"
    : "Показать всех участников";

  adminParticipantsList.replaceChildren();
  if (!adminParticipantsExpanded) return;

  if (state.participants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Участников пока нет.";
    adminParticipantsList.append(empty);
    return;
  }

  getAdminParticipantRows(thresholdDays).forEach(({ participant, status, progress, inactive }) => {
    adminParticipantsList.append(createAdminParticipantRow(participant, status, progress, inactive, thresholdDays));
  });
}

function syncInactivityThresholdControls(thresholdDays) {
  if (!inactivityThresholdInput || !inactivityThresholdUnit) return;

  const useWeeks = thresholdDays % 7 === 0 && thresholdDays >= 7;
  inactivityThresholdUnit.value = useWeeks ? "weeks" : "days";
  inactivityThresholdInput.value = String(useWeeks ? thresholdDays / 7 : thresholdDays);
}

function getAdminParticipantRows(thresholdDays) {
  return state.participants
    .map((participant) => {
      const status = getParticipantStatusInfo(participant);
      const progress = getActionProgress(participant.tasks || []);
      const inactive = isParticipantInactiveFor(status, thresholdDays);
      return { participant, status, progress, inactive };
    })
    .sort((first, second) => {
      const inactiveDiff = Number(second.inactive) - Number(first.inactive);
      if (inactiveDiff !== 0) return inactiveDiff;
      const firstDays = Number.isFinite(first.status.daysWithoutActivity) ? first.status.daysWithoutActivity : 9999;
      const secondDays = Number.isFinite(second.status.daysWithoutActivity) ? second.status.daysWithoutActivity : 9999;
      if (secondDays !== firstDays) return secondDays - firstDays;
      return first.participant.name.localeCompare(second.participant.name, "ru");
    });
}

function isParticipantInactiveFor(status, thresholdDays) {
  return !status.lastActivityDate || status.daysWithoutActivity >= thresholdDays;
}

function createAdminParticipantRow(participant, status, progress, inactive, thresholdDays) {
  const row = document.createElement("article");
  const main = document.createElement("div");
  const name = document.createElement("strong");
  const meta = document.createElement("span");
  const details = document.createElement("span");
  const statusBadge = document.createElement("span");
  const deleteButton = document.createElement("button");

  row.className = "admin-participant-row";
  row.classList.toggle("is-inactive", inactive);
  main.className = "admin-participant-main";
  name.textContent = participant.name;
  meta.textContent = getAdminParticipantActivityText(status, inactive, thresholdDays);
  details.textContent = `${participant.goal?.trim() || "Цель не указана"} · шаги ${progress.done} из ${progress.total}`;
  statusBadge.className = "admin-participant-status";
  statusBadge.textContent = inactive ? "Неактивен" : "В движении";
  deleteButton.className = "admin-participant-delete";
  deleteButton.type = "button";
  deleteButton.textContent = "Удалить";
  deleteButton.addEventListener("click", () => deleteAccount(participant.id));

  main.append(name, meta, details);
  row.append(main, statusBadge, deleteButton);
  return row;
}

function getAdminParticipantActivityText(status, inactive, thresholdDays) {
  if (!status.lastActivityDate) {
    return `Нет выполненных шагов · порог ${formatDayCount(thresholdDays)}`;
  }
  if (status.daysWithoutActivity === 0) {
    return "Делал шаг сегодня";
  }
  const prefix = inactive ? "Не делал" : "Последний шаг";
  return `${prefix}: ${formatDayCount(status.daysWithoutActivity)} назад · серия ${formatDayCount(status.streak)}`;
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
  if (welcomeCover) {
    welcomeCover.src = siteImages.cover;
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
  state.siteImagesUpdatedAt = Date.now();
  clearFileInput(input);
  saveState();
  showAdminMessage(type === "logo" ? "Логотип обновлён." : "Обложка обновлена.", false);
  render();
}

function syncSiteImageInputs() {
  const siteImages = normalizeSiteImages(state.siteImages);
  if (adminLogoUrlInput) adminLogoUrlInput.value = siteImages.logo || "";
  if (adminCoverUrlInput) adminCoverUrlInput.value = siteImages.cover || "";
}

function getSiteImageInputs(type) {
  return type === "logo"
    ? { urlInput: adminLogoUrlInput, fileInput: adminLogoFileInput }
    : { urlInput: adminCoverUrlInput, fileInput: adminCoverFileInput };
}

async function saveAdminSiteImage(type) {
  if (!state.isAdmin) return;

  const { urlInput, fileInput } = getSiteImageInputs(type);
  const siteImages = normalizeSiteImages(state.siteImages);
  siteImages[type] = await getImageValue(urlInput, fileInput, siteImages[type]);
  state.siteImages = siteImages;
  state.siteImagesUpdatedAt = Date.now();
  clearFileInput(fileInput);
  saveState();
  showAdminMessage(type === "logo" ? "Логотип сохранён." : "Обложка сохранена.", false);
  render();
  openAdminPanel();
}

function resetAdminSiteImage(type) {
  if (!state.isAdmin) return;

  const { fileInput } = getSiteImageInputs(type);
  const siteImages = normalizeSiteImages(state.siteImages);
  siteImages[type] = type === "logo" ? DEFAULT_LOGO_URL : DEFAULT_COVER_URL;
  state.siteImages = siteImages;
  state.siteImagesUpdatedAt = Date.now();
  clearFileInput(fileInput);
  saveState();
  showAdminMessage(type === "logo" ? "Логотип возвращён." : "Обложка возвращена.", false);
  render();
  openAdminPanel();
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
  participant.profileUpdatedAt = Date.now();
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
  participant.profileUpdatedAt = Date.now();
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
      element.textContent = stripPremiumEmoji(value);
    }
  });

  document.querySelectorAll("[data-placeholder-key]").forEach((element) => {
    const value = uiPlaceholders[element.dataset.placeholderKey];
    if (typeof value === "string") {
      element.placeholder = value;
    }
  });
}

function stripPremiumEmoji(value) {
  return String(value || "").replace(PREMIUM_EMOJI_PATTERN, "").replace(/\s{2,}/g, " ").trim();
}

function createPremiumIcon(name, options = {}) {
  const wrapper = document.createElement("span");
  const svg = document.createElementNS(SVG_NS, "svg");
  const iconName = PREMIUM_ICON_PATHS[name] ? name : "dot";

  wrapper.className = `premium-icon premium-icon-${iconName}`;
  if (options.size) wrapper.classList.add(`premium-icon-${options.size}`);
  wrapper.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  PREMIUM_ICON_PATHS[iconName].forEach((shape) => {
    const node = document.createElementNS(SVG_NS, shape.tag);
    Object.entries(shape).forEach(([key, value]) => {
      if (key !== "tag") node.setAttribute(key, value);
    });
    svg.append(node);
  });

  wrapper.append(svg);
  return wrapper;
}

function setPremiumIconText(element, iconName, text, options = {}) {
  if (!element) return;
  const iconNames = Array.isArray(iconName) ? iconName : [iconName];
  element.replaceChildren();
  iconNames.forEach((name) => {
    element.append(createPremiumIcon(name, options));
  });
  if (text) {
    const label = document.createElement("span");
    label.textContent = stripPremiumEmoji(text);
    element.append(label);
  }
}

function createIconText(iconName, text, className = "") {
  const wrapper = document.createElement("span");
  wrapper.className = className || "premium-icon-text";
  setPremiumIconText(wrapper, iconName, text);
  return wrapper;
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
  const recipient = getSelectedAnnouncementRecipient();
  const targetParticipants = getAnnouncementTargetParticipants({ recipient });

  if (!text) {
    showAnnouncementMessage("Напишите текст новости.", true);
    announcementInput.focus();
    return;
  }

  if (targetParticipants.length === 0) {
    showAnnouncementMessage("Выберите хотя бы одного участника.", true);
    announcementRecipientSelect?.querySelector("input")?.focus();
    return;
  }

  const now = Date.now();
  const announcement = {
    id: crypto.randomUUID(),
    text,
    createdAt: now,
    updatedAt: now,
    recipient,
    readBy: [],
  };
  state.announcements = normalizeAnnouncementList({
    announcements: [announcement, ...(state.announcements || [])],
    deletedAnnouncementIds: state.deletedAnnouncementIds || [],
  });
  state.announcement = state.announcements[0] || null;
  state.announcementDeletedAt = 0;
  announcementInput.value = "";
  showAnnouncementMessage("", false);
  showAdminMessage(`Новость отправлена: ${formatRecipientSummary(targetParticipants)}.`, false);
  saveState();
  render();
}

function deleteAnnouncement(announcementId = "") {
  if (!state.isAdmin) return;
  const announcements = normalizeAnnouncementList(state);
  const targetId = announcementId || announcements[0]?.id || "";
  if (!targetId) return;

  const target = announcements.find((announcement) => announcement.id === targetId);
  const confirmed = window.confirm(`Удалить новость "${target?.text || "без текста"}"?`);
  if (!confirmed) return;

  state.deletedAnnouncementIds = [
    ...new Set([
      ...(state.deletedAnnouncementIds || []),
      targetId,
    ]),
  ];
  state.announcements = announcements.filter((announcement) => announcement.id !== targetId);
  state.announcement = state.announcements[0] || null;
  showAnnouncementMessage("Новость удалена.", false);
  showAdminMessage("Новость удалена у выбранных участников.", false);
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
  const announcementId = announcementModal?.dataset?.announcementId || "";
  const announcements = normalizeAnnouncementList(state);
  const announcement = announcements.find((item) => item.id === announcementId) || getUnreadAnnouncementForParticipant(active);
  if (!active || !announcement) {
    announcementModal.hidden = true;
    return;
  }

  if (!announcement.readBy.includes(active.id)) {
    announcement.readBy.push(active.id);
    state.announcements = announcements.map((item) => (item.id === announcement.id ? announcement : item));
    state.announcement = state.announcements[0] || null;
    saveState();
  }

  announcementModal.hidden = true;
  delete announcementModal.dataset.announcementId;
  renderAdminControls();
  renderDeadlineWarningModal();
  renderAnnouncementModal();
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
  currentView = "profile";
  saveState();
  render();
}

function showCommunityView() {
  currentView = "community";
  render();
}

function openActiveParticipantProfile() {
  const active = findParticipant(state.activeParticipantId);
  if (active) {
    state.viewedParticipantId = active.id;
    currentView = "profile";
    saveState();
    render();
    return;
  }
  openModal(loginModal, registrationKeyInput || nameInput);
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
  const completedSteps = getCompletedActionCount(participant.tasks);
  const statusInfo = getParticipantStatusInfo(participant);
  const archiveEntry = {
    id: crypto.randomUUID(),
    title: goalTitle,
    deadline: participant.deadline || "",
    status: completed ? "completed" : "expired",
    progress: progress.percent,
    doneTasks: progress.done,
    totalTasks: progress.total,
    completedSteps,
    completedAt: archivedAt,
    streakAtCompletion: completed ? statusInfo.streak : 0,
    statusTitle: completed ? statusInfo.title : "",
    statusIcon: completed ? statusInfo.iconName : "",
    archivedAt,
  };
  participant.archivedGoals = Array.isArray(participant.archivedGoals) ? participant.archivedGoals : [];
  participant.archivedGoals.unshift(archiveEntry);
  if (completed) {
    participant.completedGoalNotice = {
      id: crypto.randomUUID(),
      title: goalTitle,
      completedAt: archivedAt,
      expiresAt: archivedAt + COMPLETED_GOAL_NOTICE_TTL,
    };
    if (isActive(participant.id)) {
      pendingGoalCompletion = {
        participantId: participant.id,
        ...archiveEntry,
      };
    }
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
  participant.tasks.push(createTask(title.trim(), false, [], getNextOrder(participant.tasks)));
  reorderTasks(participant);
  saveState();
  render();
}

function toggleTask(participantId, taskId, done) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || (Array.isArray(task.subtasks) && task.subtasks.length > 0)) return;
  if (done && !canCompleteTaskSequentially(participant, taskId)) {
    showSequentialProgressWarning();
    return;
  }

  task.done = done;
  const now = Date.now();
  task.completedAt = done ? now : 0;
  const promotedStatus = done ? recordParticipantActivity(participant, now) : null;
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  reorderTasks(participant);
  archiveFinishedGoal(participant);
  saveState();
  render();
  if (promotedStatus) {
    showStatusToast(`Новый статус: ${promotedStatus.title}`, promotedStatus.iconName);
  }
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
  task.subtasks.push({
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    order: getNextOrder(task.subtasks),
    createdAt: now,
    updatedAt: now,
  });
  task.subtasksHidden = false;
  task.done = false;
  task.updatedAt = now;
  participant.taskListUpdatedAt = now;
  reorderSubtasks(task);
  reorderTasks(participant);
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
  if (done && !canCompleteSubtaskSequentially(participant, taskId, subtaskId)) {
    showSequentialProgressWarning();
    return;
  }

  const now = Date.now();
  subtask.done = done;
  subtask.completedAt = done ? now : 0;
  const promotedStatus = done ? recordParticipantActivity(participant, now) : null;
  subtask.updatedAt = now;
  task.updatedAt = now;
  if (!done) {
    task.done = false;
    task.subtasksHidden = false;
  }
  participant.taskListUpdatedAt = now;
  reorderSubtasks(task);
  if (task.subtasks.length > 0 && task.subtasks.every((item) => item.done)) {
    task.subtasksHidden = true;
  }
  reorderTasks(participant);
  archiveFinishedGoal(participant);
  saveState();
  render();
  if (promotedStatus) {
    showStatusToast(`Новый статус: ${promotedStatus.title}`, promotedStatus.iconName);
  }
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
  refreshListOrder(participant.tasks);
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
  refreshListOrder(task.subtasks);
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
  state.announcements = normalizeAnnouncementList(state).map((announcement) => ({
    ...announcement,
    readBy: announcement.readBy.filter((id) => id !== participantId),
    recipient: announcement.recipient.type === "participants"
      ? {
          ...announcement.recipient,
          participantIds: announcement.recipient.participantIds.filter((id) => id !== participantId),
        }
      : announcement.recipient.type === "participant" && announcement.recipient.participantId === participantId
        ? { type: "participants", participantId: "", participantIds: [] }
        : announcement.recipient,
  }));
  state.announcement = state.announcements[0] || null;
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

function getProgress(tasks) {
  return getGoalProgress(tasks);
}

function getCompletedActionCount(tasks = []) {
  return getGoalProgress(tasks).done;
}

function getActionProgress(tasks = []) {
  return getGoalProgress(tasks);
}

function getGoalProgress(tasks = []) {
  const points = getGoalJourneyPoints(tasks);
  const total = points.length;
  const done = points.filter((point) => point.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
}

function canCompleteTaskSequentially(participant, taskId) {
  const tasks = Array.isArray(participant?.tasks) ? participant.tasks : [];
  for (const task of tasks) {
    if (task.id === taskId) return true;
    if (!isTaskComplete(task)) return false;
  }
  return false;
}

function canCompleteSubtaskSequentially(participant, taskId, subtaskId) {
  const tasks = Array.isArray(participant?.tasks) ? participant.tasks : [];
  for (const task of tasks) {
    if (task.id !== taskId) {
      if (!isTaskComplete(task)) return false;
      continue;
    }
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    for (const subtask of subtasks) {
      if (subtask.id === subtaskId) return true;
      if (!subtask.done) return false;
    }
    return false;
  }
  return false;
}

function showSequentialProgressWarning() {
  showStatusToast(
    "Вы идёте не последовательно. Сначала завершите предыдущий шаг или перенесите этот шаг выше в списке",
    "warning",
  );
  render();
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

function normalizeActivityDates(dates) {
  if (!Array.isArray(dates)) return [];
  return [...new Set(dates.filter(isDateValue))].sort();
}

function seedActivityDatesFromTasks(participant) {
  const dates = normalizeActivityDates(participant.activityDates);
  const seen = new Set(dates);
  (participant.tasks || []).forEach((task) => {
    if (task.done) {
      const completedAt = Number(task.completedAt || task.updatedAt || task.createdAt || 0);
      const dateValue = timestampToDateValue(completedAt);
      if (dateValue && !seen.has(dateValue)) {
        seen.add(dateValue);
        dates.push(dateValue);
      }
      if (!task.completedAt && completedAt) task.completedAt = completedAt;
    }
    (task.subtasks || []).forEach((subtask) => {
      if (!subtask.done) return;
      const completedAt = Number(subtask.completedAt || subtask.updatedAt || subtask.createdAt || 0);
      const dateValue = timestampToDateValue(completedAt);
      if (dateValue && !seen.has(dateValue)) {
        seen.add(dateValue);
        dates.push(dateValue);
      }
      if (!subtask.completedAt && completedAt) subtask.completedAt = completedAt;
    });
  });
  return dates.sort();
}

function normalizeParticipantStatus(participant) {
  if (!participant) return false;
  const before = JSON.stringify({
    activityDates: participant.activityDates,
    currentStreak: participant.currentStreak,
    bestStreak: participant.bestStreak,
    lastActivityDate: participant.lastActivityDate,
    lastStatusKey: participant.lastStatusKey,
  });
  participant.activityDates = seedActivityDatesFromTasks(participant);
  const streak = getStreakFromActivityDates(participant.activityDates);
  const daysWithoutActivity = getDaysSinceActivity(streak.lastDate);
  participant.currentStreak = daysWithoutActivity >= 5 ? 0 : streak.current;
  participant.bestStreak = Math.max(Number(participant.bestStreak || 0), streak.best);
  participant.lastActivityDate = streak.lastDate;
  const status = getStatusTier(participant.currentStreak);
  participant.lastStatusKey = status.key;
  return before !== JSON.stringify({
    activityDates: participant.activityDates,
    currentStreak: participant.currentStreak,
    bestStreak: participant.bestStreak,
    lastActivityDate: participant.lastActivityDate,
    lastStatusKey: participant.lastStatusKey,
  });
}

function maintainParticipantStatuses() {
  return state.participants.reduce((changed, participant) => {
    const normalized = normalizeParticipantStatus(participant);
    const info = getParticipantStatusInfo(participant);
    if (info.daysWithoutActivity >= 5 && participant.currentStreak !== 0) {
      participant.currentStreak = 0;
      participant.lastStatusKey = getStatusTier(0).key;
      return true;
    }
    return changed || normalized;
  }, false);
}

function recordParticipantActivity(participant, timestamp = Date.now()) {
  if (!participant) return null;
  normalizeParticipantStatus(participant);
  const previousStatus = getStatusTier(getParticipantDisplayStreak(participant));
  const dateValue = timestampToDateValue(timestamp);
  participant.activityDates = normalizeActivityDates([...(participant.activityDates || []), dateValue]);
  const streak = getStreakFromActivityDates(participant.activityDates);
  participant.currentStreak = streak.current;
  participant.bestStreak = Math.max(Number(participant.bestStreak || 0), streak.best);
  participant.lastActivityDate = streak.lastDate;
  participant.tempoWarningShownFor = "";
  const nextStatus = getStatusTier(participant.currentStreak);
  const promoted = getStatusRank(nextStatus.key) > getStatusRank(previousStatus.key);
  participant.lastStatusKey = nextStatus.key;
  return promoted ? nextStatus : null;
}

function getParticipantStatusInfo(participant) {
  normalizeParticipantStatus(participant);
  const streak = getParticipantDisplayStreak(participant);
  const status = getStatusTier(streak);
  const daysWithoutActivity = getDaysSinceActivity(participant.lastActivityDate);
  const activity = getActivityState(daysWithoutActivity);
  return {
    ...status,
    streak,
    bestStreak: Number(participant.bestStreak || 0),
    daysWithoutActivity,
    activity,
  };
}

function getParticipantDisplayStreak(participant) {
  return getDaysSinceActivity(participant?.lastActivityDate) >= 5 ? 0 : Number(participant?.currentStreak || 0);
}

function getActivityState(daysWithoutActivity) {
  if (daysWithoutActivity >= 5 || daysWithoutActivity === Infinity) {
    return { key: "inactive", iconName: "snow", label: "НЕАКТИВЕН" };
  }
  if (daysWithoutActivity >= 3) {
    return { key: "slowing", iconName: "warning", label: "ТЕРЯЕТ ТЕМП" };
  }
  return { key: "active", iconName: "flame", label: "В СТРОЮ" };
}

function getStatusTier(streak) {
  return STATUS_TIERS.find((tier) => streak >= tier.minStreak && streak <= tier.maxStreak) || STATUS_TIERS[0];
}

function getStatusIconNameByTitle(title) {
  const normalizedTitle = String(title || "").toUpperCase();
  return STATUS_TIERS.find((tier) => tier.title === normalizedTitle)?.iconName || "sprout";
}

function getStatusRank(statusKey) {
  return Math.max(0, STATUS_TIERS.findIndex((tier) => tier.key === statusKey));
}

function getStreakFromActivityDates(dates) {
  const normalized = normalizeActivityDates(dates);
  if (normalized.length === 0) {
    return { current: 0, best: 0, lastDate: "" };
  }
  let best = 1;
  let run = 1;
  for (let index = 1; index < normalized.length; index += 1) {
    const previous = dateValueToDayIndex(normalized[index - 1]);
    const current = dateValueToDayIndex(normalized[index]);
    if (current - previous === 1) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
  }
  return {
    current: run,
    best,
    lastDate: normalized[normalized.length - 1],
  };
}

function getDaysSinceActivity(dateValue) {
  if (!isDateValue(dateValue)) return Infinity;
  return Math.max(0, dateValueToDayIndex(getTodayDateValue()) - dateValueToDayIndex(dateValue));
}

function isDateValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function timestampToDateValue(timestamp) {
  const date = new Date(Number(timestamp || 0));
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateValueToDayIndex(dateValue) {
  const [year, month, day] = String(dateValue || "").split("-").map(Number);
  if (!year || !month || !day) return 0;
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
}

function mergeActivityDates(baseDates, nextDates) {
  return normalizeActivityDates([...(baseDates || []), ...(nextDates || [])]);
}

function getLatestDateValue(baseDate, nextDate) {
  if (!isDateValue(baseDate)) return isDateValue(nextDate) ? nextDate : "";
  if (!isDateValue(nextDate)) return baseDate;
  return dateValueToDayIndex(nextDate) >= dateValueToDayIndex(baseDate) ? nextDate : baseDate;
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
  if (maintainParticipantStatuses()) {
    saveState();
  }
  renderWelcomeGate();
  document.body.classList.toggle("is-profile-view", currentView === "profile");
  document.body.classList.toggle("is-community-view", currentView !== "profile");
  renderSiteImages();
  renderAdminControls();
  renderActiveBadge();
  renderResults();
  renderParticipantPath();
  renderPersonalEntry();
  renderProfile();
  renderGoalCompletionModal();
  renderAnnouncementModal();
  renderDeadlineWarningModal();
  applyEditableText();
  decoratePremiumStaticText();
  if (tourModal && !tourModal.hidden) {
    renderTourStep();
  }
}

function decoratePremiumStaticText() {
  document.querySelectorAll("[data-edit-key='goalCardBadge']").forEach((element) => {
    setPremiumIconText(element, "trophy", state.uiText?.goalCardBadge || element.textContent || "Основная цель");
  });
  document.querySelectorAll("[data-edit-key='nextGoalTitle']").forEach((element) => {
    setPremiumIconText(element, "flame", state.uiText?.nextGoalTitle || element.textContent || "Ты завершил этот путь.");
  });
  document.querySelectorAll("[data-edit-key='archiveBadge']").forEach((element) => {
    setPremiumIconText(element, "medal", state.uiText?.archiveBadge || element.textContent || "Архив целей");
  });
  document.querySelectorAll(".champion-badge[data-edit-key]").forEach((element) => {
    const iconNames = element.dataset.editKey === "secondPlaceBadge"
      ? ["medal", "medal"]
      : element.dataset.editKey === "thirdPlaceBadge"
        ? ["medal"]
        : ["trophy"];
    setPremiumIconText(element, iconNames, state.uiText?.[element.dataset.editKey] || element.textContent || "Чемпион");
  });
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

  const announcements = normalizeAnnouncementList(state);
  state.announcements = announcements;
  state.announcement = announcements[0] || null;
  announcementInput.placeholder = "Напишите важную новость для группы";
  deleteAnnouncementButton.hidden = announcements.length === 0;

  if (announcements.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Новости ещё не опубликованы.";
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

  announcements.forEach((announcement) => {
    announcementReadList.append(createAnnouncementHistoryCard(announcement));
  });
}

function createAnnouncementHistoryCard(announcement) {
  const card = document.createElement("article");
  const header = document.createElement("div");
  const text = document.createElement("p");
  const removeButton = document.createElement("button");
  const meta = document.createElement("div");
  const targetList = document.createElement("div");
  const targetParticipants = getAnnouncementTargetParticipants(announcement);
  const readCount = targetParticipants.filter((participant) => announcement.readBy.includes(participant.id)).length;

  card.className = "announcement-history-card";
  header.className = "announcement-history-header";
  text.className = "announcement-history-text";
  text.textContent = announcement.text;
  removeButton.className = "announcement-delete-one";
  removeButton.type = "button";
  removeButton.textContent = "Удалить";
  removeButton.addEventListener("click", () => deleteAnnouncement(announcement.id));
  header.append(text, removeButton);

  meta.className = "announcement-history-meta";
  meta.textContent = `Отправлено: ${formatAnnouncementDate(announcement.createdAt)} · Получатели: ${formatRecipientSummary(targetParticipants)} · Прочитано ${readCount} из ${targetParticipants.length}`;

  targetList.className = "announcement-target-list";
  if (targetParticipants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Получатели этой новости не найдены.";
    targetList.append(empty);
  } else {
    targetParticipants.forEach((participant) => {
      const row = document.createElement("div");
      const name = document.createElement("span");
      const status = document.createElement("strong");
      row.className = "read-person";
      const hasRead = Boolean(announcement.readBy.includes(participant.id));
      row.classList.toggle("has-read", hasRead);
      name.textContent = participant.name;
      status.textContent = hasRead ? "✓ Прочитано" : "✓ Отправлено";
      row.append(name, status);
      targetList.append(row);
    });
  }

  card.append(header, meta, targetList);
  return card;
}

function renderAnnouncementRecipientOptions() {
  if (!announcementRecipientSelect) return;

  const selectedRecipient = getCurrentAnnouncementRecipientSelection();
  announcementRecipientSelect.replaceChildren();

  const allLabel = createAnnouncementRecipientCheckbox({
    id: "all",
    label: "Все участники",
    checked: selectedRecipient.type === "all",
    isAll: true,
  });
  announcementRecipientSelect.append(allLabel);

  state.participants.forEach((participant) => {
    announcementRecipientSelect.append(createAnnouncementRecipientCheckbox({
      id: participant.id,
      label: participant.name,
      checked:
        selectedRecipient.type === "participants" &&
        selectedRecipient.participantIds.includes(participant.id),
      isAll: false,
    }));
  });
}

function createAnnouncementRecipientCheckbox({ id, label, checked, isAll }) {
  const item = document.createElement("label");
  const checkbox = document.createElement("input");
  const text = document.createElement("span");
  item.className = "announcement-recipient-option";
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  if (isAll) {
    checkbox.dataset.recipientAll = "true";
  } else {
    checkbox.dataset.participantId = id;
  }
  text.textContent = label;
  checkbox.addEventListener("change", () => handleAnnouncementRecipientChange(checkbox));
  item.append(checkbox, text);
  return item;
}

function handleAnnouncementRecipientChange(changedCheckbox) {
  if (!announcementRecipientSelect) return;
  const allCheckbox = announcementRecipientSelect.querySelector("[data-recipient-all]");
  const participantCheckboxes = [...announcementRecipientSelect.querySelectorAll("[data-participant-id]")];

  if (changedCheckbox?.dataset.recipientAll === "true" && changedCheckbox.checked) {
    participantCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    return;
  }

  if (participantCheckboxes.some((checkbox) => checkbox.checked)) {
    if (allCheckbox) allCheckbox.checked = false;
    return;
  }

  if (allCheckbox) allCheckbox.checked = true;
}

function getCurrentAnnouncementRecipientSelection() {
  if (!announcementRecipientSelect) {
    return { type: "all", participantId: "", participantIds: [] };
  }
  const checkedParticipants = [...announcementRecipientSelect.querySelectorAll("[data-participant-id]:checked")]
    .map((checkbox) => checkbox.dataset.participantId)
    .filter(Boolean);
  const allChecked = Boolean(announcementRecipientSelect.querySelector("[data-recipient-all]:checked"));
  if (checkedParticipants.length > 0) {
    return { type: "participants", participantId: "", participantIds: checkedParticipants };
  }
  if (allChecked) {
    return { type: "all", participantId: "", participantIds: [] };
  }
  return { type: "all", participantId: "", participantIds: [] };
}

function getSelectedAnnouncementRecipient() {
  if (!announcementRecipientSelect) {
    return { type: "all", participantId: "", participantIds: [] };
  }
  const participantIds = [...announcementRecipientSelect.querySelectorAll("[data-participant-id]:checked")]
    .map((checkbox) => checkbox.dataset.participantId)
    .filter((id) => Boolean(id && findParticipant(id)));
  const isAll = Boolean(announcementRecipientSelect.querySelector("[data-recipient-all]:checked"));
  if (isAll) {
    return { type: "all", participantId: "", participantIds: [] };
  }
  return {
    type: "participants",
    participantId: "",
    participantIds: [...new Set(participantIds)],
  };
}

function getAnnouncementTargetParticipants(announcement) {
  const recipient = normalizeAnnouncementRecipient(announcement?.recipient);
  if (recipient.type === "participant") {
    return state.participants.filter((participant) => participant.id === recipient.participantId);
  }
  if (recipient.type === "participants") {
    const recipientIds = new Set(recipient.participantIds);
    return state.participants.filter((participant) => recipientIds.has(participant.id));
  }

  return state.participants;
}

function formatRecipientSummary(participants) {
  if (!participants.length) return "получатели не найдены";
  if (participants.length === state.participants.length) return "всем участникам";
  if (participants.length <= 3) return participants.map((participant) => participant.name).join(", ");
  return `${participants.slice(0, 3).map((participant) => participant.name).join(", ")} и ещё ${participants.length - 3}`;
}

function formatAnnouncementDate(timestamp) {
  const date = new Date(Number(timestamp || Date.now()));
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shouldShowAnnouncementToParticipant(announcement, participant) {
  if (!participant || !announcement?.text) return false;
  if (announcement.readBy.includes(participant.id)) return false;

  const recipient = normalizeAnnouncementRecipient(announcement.recipient);
  if (recipient.type === "participant" && recipient.participantId !== participant.id) return false;
  if (recipient.type === "participants" && !recipient.participantIds.includes(participant.id)) return false;
  if (recipient.type === "all" && !participant.onboardingCompleted) return false;

  return true;
}

function getUnreadAnnouncementForParticipant(participant) {
  if (!participant) return null;
  return normalizeAnnouncementList(state)
    .slice()
    .reverse()
    .find((announcement) => shouldShowAnnouncementToParticipant(announcement, participant)) || null;
}

function renderAnnouncementModal() {
  const active = findParticipant(state.activeParticipantId);
  const announcement = getUnreadAnnouncementForParticipant(active);
  const shouldShow =
    active &&
    !state.isAdmin &&
    announcement &&
    welcomeGate.hidden &&
    loginModal.hidden &&
    adminModal.hidden &&
    adminNewsModal.hidden &&
    tourModal.hidden;

  announcementModal.hidden = !shouldShow;
  if (shouldShow) {
    announcementModal.dataset.announcementId = announcement.id;
    announcementText.textContent = announcement.text;
  } else {
    delete announcementModal.dataset.announcementId;
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

    renderEmptyResultsTable("Здесь появятся участники, их цели и текущий прогресс.");
    return;
  }

  const rankedParticipants = getSortedParticipants();
  const championParticipants = rankedParticipants.filter((participant) =>
    Boolean(getActiveCompletedGoalNotice(participant)),
  );
  const activeParticipants = rankedParticipants
    .filter((participant) => !getActiveCompletedGoalNotice(participant) && hasLeaderboardActivity(participant))
    .slice(0, 3);

  if (championParticipants.length === 0 && activeParticipants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока никто не выполнил шаги.";
    resultChart.append(empty);
  } else {
    championParticipants.forEach((participant) => {
      const progress = getDashboardProgress(participant);
      renderChartRow(participant, progress, 1);
    });
    activeParticipants.forEach((participant, index) => {
      const progress = getDashboardProgress(participant);
      renderChartRow(participant, progress, index + 1);
    });
  }

  const tableParticipants = getResultsTableParticipants();
  if (tableParticipants.length === 0) {
    renderEmptyResultsTable("Здесь появятся участники, которые указали цель и дату.");
    return;
  }

  tableParticipants.forEach((participant) => {
    const progress = getActionProgress(participant.tasks);
    renderTableRow(participant, progress);
  });
}

function renderPersonalEntry() {
  if (!personalEntry) return;
  personalEntry.replaceChildren();
  personalEntry.hidden = false;

  const active = findParticipant(state.activeParticipantId);
  const card = document.createElement("button");
  const avatar = document.createElement("span");
  const content = document.createElement("span");
  const eyebrow = document.createElement("span");
  const title = document.createElement("strong");
  const meta = document.createElement("span");
  const action = document.createElement("span");

  card.type = "button";
  card.className = "personal-entry-card";
  avatar.className = "personal-entry-avatar";
  content.className = "personal-entry-content";
  eyebrow.className = "personal-entry-eyebrow";
  meta.className = "personal-entry-meta";
  action.className = "personal-entry-action";

  if (active) {
    const status = getParticipantStatusInfo(active);
    const progress = getActionProgress(active.tasks || []);
    if (active.picture) {
      const image = document.createElement("img");
      image.src = active.picture;
      image.alt = `Фото ${active.name}`;
      avatar.append(image);
    } else {
      avatar.textContent = getParticipantInitial(active.name);
    }
    eyebrow.textContent = "Личный кабинет";
    title.textContent = active.name;
    meta.append(
      createIconText(status.iconName, status.title, "personal-entry-pill"),
      createIconText("flame", formatDaysLeft(status.streak), "personal-entry-pill"),
      createIconText("path", `${progress.percent}% цели`, "personal-entry-pill"),
    );
    action.textContent = "Открыть мой путь";
    card.addEventListener("click", openActiveParticipantProfile);
  } else {
    avatar.append(createPremiumIcon("path", { size: "medium" }));
    eyebrow.textContent = "Личный кабинет";
    title.textContent = "Войдите как участник";
    meta.append(createIconText("calendar", "Ваши цели, шаги и архив будут здесь", "personal-entry-pill"));
    action.textContent = "Войти как участник";
    card.addEventListener("click", () => openModal(loginModal, registrationKeyInput || nameInput));
  }

  content.append(eyebrow, title, meta);
  card.append(avatar, content, action);
  personalEntry.append(card);
}

function getResultsTableParticipants() {
  return state.participants
    .filter(shouldShowInResultsTable)
    .sort((a, b) => {
      const progressDiff = getActionProgress(b.tasks).percent - getActionProgress(a.tasks).percent;
      if (progressDiff !== 0) return progressDiff;
      return a.name.localeCompare(b.name, "ru");
    });
}

function shouldShowInResultsTable(participant) {
  return Boolean(participant.goal?.trim() && participant.deadline);
}

function renderEmptyResultsTable(message) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = state.isAdmin ? 6 : 5;
  cell.className = "table-empty";
  cell.textContent = message;
  row.append(cell);
  resultTable.append(row);
}

function hasLeaderboardActivity(participant) {
  const progress = getDashboardProgress(participant);
  return progress.percent > 0 || progress.done > 0;
}

function getPlaceBadge(place) {
  if (place === 1) {
    return {
      key: "championBadge",
      icons: ["trophy"],
      text: state.uiText?.championBadge || "Чемпион дня",
    };
  }
  if (place === 2) {
    return {
      key: "secondPlaceBadge",
      icons: ["medal", "medal"],
      text: state.uiText?.secondPlaceBadge || "Второе место",
    };
  }
  return {
    key: "thirdPlaceBadge",
    icons: ["medal"],
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
        icons: ["trophy"],
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
    placeIcon.replaceChildren(...placeBadge.icons.map((iconName) => createPremiumIcon(iconName, { size: "small" })));
    placeIcon.setAttribute("aria-label", placeBadge.text);
  }
  node.querySelector(".chart-name").textContent = participant.name;
  node.querySelector(".chart-person").append(createStatusMiniBadge(participant));
  championBadge.dataset.editKey = placeBadge.key;
  setPremiumIconText(championBadge, placeBadge.icons, placeBadge.text);
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
  nameButton.append(createStatusMiniBadge(participant));
  if (avatar) {
    avatar.src = participant.picture || "";
    avatar.hidden = !participant.picture;
    avatar.alt = participant.picture ? `Фото ${participant.name}` : "";
  }
  nameButton.addEventListener("click", () => viewParticipant(participant.id));
  row.querySelector(".table-goal").textContent = participant.goal || "Цель ещё не указана";
  const deadlinePill = row.querySelector(".deadline-pill");
  const deadlineInfo = getDeadlineInfo(participant.deadline);
  setPremiumIconText(deadlinePill, "calendar", deadlineInfo.label, { size: "small" });
  deadlinePill.classList.add(`deadline-${deadlineInfo.tone}`);
  row.querySelector(".table-count").textContent = `${progress.done} из ${progress.total}`;
  row.querySelector(".table-progress-bar").style.width = `${progress.percent}%`;
  row.querySelector(".table-progress-percent").textContent = `${progress.percent}%`;
  adminCell.hidden = !state.isAdmin;
  adminDeleteButton.addEventListener("click", () => deleteAccount(participant.id));

  resultTable.append(row);
}

function renderParticipantPath() {
  if (!participantPath) return;

  participantPath.replaceChildren();

  if (state.participants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Путь появится, когда участники начнут движение.";
    participantPath.append(empty);
    return;
  }

  const road = document.createElement("div");
  road.className = "participant-path-road";

  STATUS_TIERS.forEach((tier, zoneIndex) => {
    const zone = document.createElement("article");
    const header = document.createElement("div");
    const title = document.createElement("strong");
    const range = document.createElement("span");
    const members = document.createElement("div");
    const zoneParticipants = getPathZoneParticipants(tier);
    const visibleParticipants = zoneParticipants.slice(0, PATH_ZONE_LIMIT);
    const hiddenCount = Math.max(0, zoneParticipants.length - visibleParticipants.length);

    zone.className = "participant-path-zone";
    zone.dataset.status = tier.key;
    zone.style.setProperty("--zone-index", String(zoneIndex));
    zone.style.setProperty("--zone-offset", `${zoneIndex * -12}px`);
    header.className = "participant-path-zone-header";
    title.className = "participant-path-zone-title";
    setPremiumIconText(title, tier.iconName, PATH_ZONE_TITLES[tier.key] || tier.title, { size: "medium" });
    range.textContent = formatPathZoneRange(tier);
    members.className = "participant-path-members";

    header.append(title, range);
    visibleParticipants.forEach((participant) => {
      members.append(createPathParticipant(participant));
    });

    if (hiddenCount > 0) {
      const more = document.createElement("div");
      more.className = "participant-path-more";
      more.textContent = `+${hiddenCount} ${getParticipantPlural(hiddenCount)}`;
      members.append(more);
    }

    if (zoneParticipants.length === 0) {
      const empty = document.createElement("p");
      empty.className = "participant-path-empty";
      empty.textContent = "Следующий этап роста";
      members.append(empty);
    }

    zone.append(header, members);
    road.append(zone);
  });

  const peak = document.createElement("div");
  peak.className = "participant-path-peak";
  peak.setAttribute("aria-label", "Вершина пути");
  peak.append(createPremiumIcon("sparkle", { size: "small" }));
  road.append(peak);
  participantPath.append(road);
}

function getPathZoneParticipants(tier) {
  return state.participants
    .map((participant) => ({
      participant,
      status: getParticipantStatusInfo(participant),
    }))
    .filter(({ status }) => status.key === tier.key)
    .sort((first, second) => {
      const activeDiff = Number(isActive(second.participant.id)) - Number(isActive(first.participant.id));
      if (activeDiff !== 0) return activeDiff;
      const streakDiff = second.status.streak - first.status.streak;
      if (streakDiff !== 0) return streakDiff;
      return first.participant.name.localeCompare(second.participant.name, "ru");
    })
    .map(({ participant }) => participant);
}

function createPathParticipant(participant) {
  const status = getParticipantStatusInfo(participant);
  const button = document.createElement("button");
  const avatar = document.createElement("span");
  const info = document.createElement("span");
  const name = document.createElement("strong");
  const statusText = document.createElement("span");
  const streak = document.createElement("span");

  button.className = "participant-path-person";
  button.type = "button";
  button.classList.toggle("is-active", isActive(participant.id));
  button.addEventListener("click", () => viewParticipant(participant.id));

  avatar.className = "participant-path-avatar";
  if (participant.picture) {
    const image = document.createElement("img");
    image.src = participant.picture;
    image.alt = `Фото ${participant.name}`;
    avatar.append(image);
  } else {
    avatar.textContent = getParticipantInitial(participant.name);
  }

  info.className = "participant-path-info";
  name.textContent = participant.name;
  setPremiumIconText(statusText, status.iconName, formatStatusTitle(status.title));
  setPremiumIconText(streak, "flame", formatDayCount(status.streak));
  info.append(name, statusText, streak);
  button.append(avatar, info);
  return button;
}

function formatPathZoneRange(tier) {
  if (tier.maxStreak === Infinity) return `${tier.minStreak}+ дней`;
  return `${tier.minStreak}–${tier.maxStreak} дня`;
}

function formatStatusTitle(title) {
  const normalized = String(title || "").toLowerCase();
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "";
}

function getParticipantInitial(name) {
  return String(name || "У").trim().charAt(0).toUpperCase() || "У";
}

function getParticipantPlural(count) {
  const value = Math.abs(Number(count || 0));
  const lastTwo = value % 100;
  const last = value % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "участников";
  if (last === 1) return "участник";
  if (last >= 2 && last <= 4) return "участника";
  return "участников";
}

function GoalJourney(props) {
  const {
    participantName,
    participantAvatar,
    currentGoal,
    mainSteps,
  } = props;
  const card = document.createElement("section");
  const header = document.createElement("div");
  const heading = document.createElement("div");
  const title = document.createElement("h3");
  const goal = document.createElement("p");
  const map = document.createElement("div");
  const points = getGoalJourneyPoints(mainSteps);
  const totalPoints = points.length;
  const completedPoints = points.filter((point) => point.done).length;
  const remainingPoints = Math.max(0, totalPoints - completedPoints);
  const journeyPercent = totalPoints === 0 ? 0 : Math.round((completedPoints / totalPoints) * 100);
  const currentIndex = getLastCompletedJourneyIndex(points);
  const markerRatio = currentIndex === -1 ? null : getJourneyRatio(currentIndex, totalPoints);
  const lineRatio = currentIndex === -1
    ? 0
    : completedPoints >= totalPoints
      ? 1
      : getJourneyRatio(currentIndex, totalPoints);
  const svg = createJourneyLineSvg(lineRatio * 100);
  const participantPoint = markerRatio === null
    ? null
    : getJourneyPosition(markerRatio);
  const trophy = document.createElement("div");
  const trophyPosition = getJourneyPosition(1);
  const footer = document.createElement("div");

  card.className = "goal-journey-card";
  header.className = "goal-journey-header";
  heading.className = "goal-journey-heading";
  title.textContent = "Путь к цели";
  goal.textContent = currentGoal?.trim() || "Цель пока не указана";
  map.className = "goal-journey-map";
  map.style.setProperty("--journey-depth", `${Math.min(1, journeyPercent / 100).toFixed(2)}`);
  footer.className = "goal-journey-stats";

  heading.append(title, goal);
  header.append(heading);
  map.append(svg);

  if (totalPoints === 0) {
    const empty = document.createElement("p");
    empty.className = "goal-journey-empty";
    empty.textContent = "Добавьте первый шаг — и путь начнётся.";
    map.append(empty);
  } else {
    points.forEach((point, index) => {
      map.append(createJourneyPoint(point, getJourneyRatio(index, totalPoints), index === currentIndex));
    });
    if (participantPoint) {
      map.append(createJourneyMarker(participantName, participantAvatar, participantPoint, {
        isFinished: remainingPoints === 0,
      }));
    }
  }

  trophy.className = "goal-journey-trophy";
  trophy.classList.toggle("is-complete", totalPoints > 0 && remainingPoints === 0);
  trophy.style.left = `${trophyPosition.x}%`;
  trophy.style.top = `${trophyPosition.y}%`;
  trophy.append(createPremiumIcon("trophy", { size: "medium" }));
  map.append(trophy);

  footer.append(
    createJourneyStat("medal", "Выполнено", `${completedPoints} из ${totalPoints}`),
    createJourneyStat("path", "До цели", `${remainingPoints} ${getStepWord(remainingPoints)}`),
    createJourneyStat("flame", "Прогресс", `${journeyPercent}%`),
  );

  card.append(header, map, footer);
  return card;
}

function renderGoalJourney(container, props) {
  if (!container) return;
  container.replaceChildren(GoalJourney(props));
}

function getGoalJourneyPoints(mainSteps = []) {
  const orderedPoints = [];
  const orderedTasks = sortByOrder(mainSteps);
  orderedTasks.forEach((task, taskIndex) => {
    const subtasks = Array.isArray(task.subtasks) ? sortByOrder(task.subtasks) : [];
    orderedPoints.push({
      id: task.id || `task-${taskIndex}`,
      type: "main",
      title: task.title || "Шаг",
      isContainer: subtasks.length > 0,
      done: isTaskComplete(task),
    });
    subtasks.forEach((subtask, subtaskIndex) => {
      orderedPoints.push({
        id: subtask.id || `${task.id || taskIndex}-subtask-${subtaskIndex}`,
        type: "sub",
        title: subtask.title || "Доп. шаг",
        done: Boolean(subtask.done),
      });
    });
  });
  return orderJourneyPointsByProgress(orderedPoints);
}

function orderJourneyPointsByProgress(points = []) {
  const completed = [];
  const pending = [];
  points.forEach((point) => {
    if (point.done) {
      completed.push(point);
    } else {
      pending.push(point);
    }
  });
  return [...completed, ...pending];
}

function getJourneyRatio(index, total) {
  if (total <= 1) return 0.72;
  return index / (total - 1);
}

function getLastCompletedJourneyIndex(points = []) {
  let lastSequentialCompletedIndex = -1;
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    if (point?.done) {
      lastSequentialCompletedIndex = index;
      continue;
    }
    if (point?.isContainer) {
      continue;
    }
    break;
  }
  return lastSequentialCompletedIndex;
}

function getJourneyPosition(ratio) {
  const clamped = Math.max(0, Math.min(1, Number(ratio || 0)));
  const x = 7 + clamped * 80;
  const y = 84 - clamped * 62 + Math.sin(clamped * Math.PI * 1.05) * 7;
  return { x, y };
}

function createJourneyPoint(point, ratio, isCurrent = false) {
  const position = getJourneyPosition(ratio);
  const node = document.createElement("span");
  node.className = `goal-journey-point goal-journey-point-${point.type}`;
  node.classList.toggle("is-complete", point.done);
  node.classList.toggle("is-current", isCurrent);
  node.style.left = `${position.x}%`;
  node.style.top = `${position.y}%`;
  node.title = stripPremiumEmoji(point.title);
  node.setAttribute("aria-label", `${point.type === "main" ? "Шаг" : "Подшаг"}: ${stripPremiumEmoji(point.title)}`);
  return node;
}

function createJourneyMarker(name, avatarUrl, position, options = {}) {
  const marker = document.createElement("div");
  const avatar = document.createElement("span");
  marker.className = "goal-journey-marker";
  marker.classList.toggle("is-finished", Boolean(options.isFinished));
  marker.style.left = `${position.x}%`;
  marker.style.top = `${position.y}%`;
  marker.setAttribute("aria-label", `Текущая позиция: ${name}`);
  avatar.className = "goal-journey-avatar";
  if (avatarUrl) {
    const image = document.createElement("img");
    image.src = avatarUrl;
    image.alt = `Фото ${name}`;
    avatar.append(image);
  } else {
    avatar.textContent = getParticipantInitial(name);
  }
  marker.append(avatar);
  return marker;
}

function createJourneyLineSvg(progressPercent) {
  const svg = document.createElementNS(SVG_NS, "svg");
  const defs = document.createElementNS(SVG_NS, "defs");
  const baseGradient = document.createElementNS(SVG_NS, "linearGradient");
  const progressGradient = document.createElementNS(SVG_NS, "linearGradient");
  const basePath = document.createElementNS(SVG_NS, "path");
  const progressPath = document.createElementNS(SVG_NS, "path");
  const d = "M7 84 C20 80 30 73 39 66 C51 57 57 56 66 43 C75 30 81 29 87 22";
  const gradientId = `goalJourneyGold-${Math.random().toString(36).slice(2)}`;
  const baseGradientId = `goalJourneyBase-${Math.random().toString(36).slice(2)}`;

  svg.classList.add("goal-journey-line");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  baseGradient.id = baseGradientId;
  progressGradient.id = gradientId;
  [baseGradient, progressGradient].forEach((gradient) => {
    gradient.setAttribute("x1", "7");
    gradient.setAttribute("y1", "84");
    gradient.setAttribute("x2", "87");
    gradient.setAttribute("y2", "22");
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
  });
  [
    [baseGradient, "0%", "#efe2ca", "0.36"],
    [baseGradient, "55%", "#e8d8b8", "0.58"],
    [baseGradient, "100%", "#c9a45c", "0.34"],
    [progressGradient, "0%", "#e8d8b8", "0.68"],
    [progressGradient, "42%", "#c9a45c", "1"],
    [progressGradient, "100%", "#b88a32", "1"],
  ].forEach(([gradient, offset, color, opacity]) => {
    const stop = document.createElementNS(SVG_NS, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    stop.setAttribute("stop-opacity", opacity);
    gradient.append(stop);
  });
  defs.append(baseGradient, progressGradient);

  [basePath, progressPath].forEach((path) => {
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("pathLength", "100");
  });
  basePath.classList.add("goal-journey-line-base");
  progressPath.classList.add("goal-journey-line-progress");
  basePath.setAttribute("stroke", `url(#${baseGradientId})`);
  progressPath.setAttribute("stroke", `url(#${gradientId})`);
  progressPath.style.strokeDasharray = "100";
  progressPath.style.strokeDashoffset = String(100 - Math.max(0, Math.min(100, Number(progressPercent || 0))));
  svg.append(defs, basePath, progressPath);
  return svg;
}

function createJourneyStat(iconName, label, value) {
  const item = document.createElement("span");
  const text = document.createElement("span");
  const strong = document.createElement("strong");
  item.className = "goal-journey-stat";
  text.textContent = label;
  strong.textContent = value;
  item.append(createPremiumIcon(iconName, { size: "small" }), text, strong);
  return item;
}

function getStepWord(count) {
  const value = Math.abs(Number(count || 0));
  const lastTwo = value % 100;
  const last = value % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "шагов";
  if (last === 1) return "шаг";
  if (last >= 2 && last <= 4) return "шага";
  return "шагов";
}

function renderProfile() {
  profileView.replaceChildren();
  if (currentView !== "profile") {
    return;
  }

  const participant = findParticipant(state.viewedParticipantId) || state.participants[0];
  const backButton = document.createElement("button");
  backButton.className = "profile-back-button";
  backButton.type = "button";
  backButton.textContent = "← Назад к общей странице";
  backButton.addEventListener("click", showCommunityView);

  if (!participant) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока нет участников. Создайте первый аккаунт.";
    profileView.append(backButton);
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
  const goalJourneyContainer = node.querySelector(".goal-journey");
  const nextGoalPanel = node.querySelector(".next-goal-panel");
  const newGoalButton = node.querySelector(".new-goal-button");
  const profileAvatar = node.querySelector(".profile-avatar");
  const deleteAccountButton = node.querySelector(".delete-account");
  const statusInfo = getParticipantStatusInfo(participant);

  node.classList.toggle("is-active", editable);
  node.querySelector(".person-label").textContent = editable ? "Ваша страница" : "Публичный просмотр";
  node.querySelector("h2").textContent = participant.name;
  node.querySelector(".person-percent").textContent = `${progress.percent}%`;
  node.querySelector(".person-count").textContent = `${progress.done} из ${progress.total} выполнено`;
  node.querySelector(".progress-bar").style.width = `${progress.percent}%`;
  setPremiumIconText(node.querySelector(".goal-card-badge"), "trophy", state.uiText?.goalCardBadge || "Основная цель");
  setPremiumIconText(node.querySelector("[data-edit-key='nextGoalTitle']"), "flame", state.uiText?.nextGoalTitle || "Ты завершил этот путь.");

  deleteAccountButton.hidden = !state.isAdmin;
  deleteAccountButton.addEventListener("click", () => deleteAccount(participant.id));

  if (profileAvatar) {
    profileAvatar.src = participant.picture || "";
    profileAvatar.hidden = !participant.picture;
  }
  renderGoalJourney(goalJourneyContainer, {
    participantName: participant.name,
    participantAvatar: participant.picture || "",
    currentGoal: participant.goal || "",
    mainSteps: participant.tasks || [],
    completedSteps: progress.done,
    progressPercent: progress.percent,
    currentLevel: statusInfo,
    streakDays: statusInfo.streak,
    recordDays: statusInfo.bestStreak,
    activityStatus: statusInfo.activity,
  });
  renderStatusCard(node, statusInfo);

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
    Number(participant.goalArchivedAt || 0) >= Number(participant.goalCycleStartedAt || 0) &&
    Array.isArray(participant.archivedGoals) &&
    participant.archivedGoals.length > 0;
  if (nextGoalPanel) {
    nextGoalPanel.hidden = !canStartNextGoal;
  }
  newGoalButton?.addEventListener("click", () => {
    startNextGoal(participant.id);
  });

  profileView.append(backButton, node);
  maybeShowTempoWarning(participant, editable);
}

function startNextGoal(participantId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participant.id)) return;
  const now = Date.now();
  if (participant.completedGoalNotice) {
    participant.completedGoalNotice = null;
  }
  participant.goalCycleStartedAt = now;
  participant.goalArchivedAt = 0;
  participant.tasks = [];
  participant.taskListUpdatedAt = now;
  saveState();
  render();
  requestAnimationFrame(() => {
    const goalInput = document.querySelector(".person-goal");
    goalInput?.focus();
    goalInput?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}

function renderGoalCompletionModal() {
  if (!goalCompletionModal) return;
  if (!pendingGoalCompletion) {
    goalCompletionModal.hidden = true;
    return;
  }
  goalCompletionModal.hidden = false;
  setPremiumIconText(goalCompletionHeading, "crown", "ЦЕЛЬ ДОСТИГНУТА", { size: "small" });
  setPremiumIconText(goalCompletionTitle, "trophy", pendingGoalCompletion.title || "Цель без названия");
  setPremiumIconText(goalCompletionStreak, "flame", `Серия дней: ${pendingGoalCompletion.streakAtCompletion || 0}`);
  setPremiumIconText(goalCompletionSteps, "bolt", `Выполнено шагов: ${pendingGoalCompletion.completedSteps || 0}`);
  setPremiumIconText(goalCompletionStatus, getStatusIconNameByTitle(pendingGoalCompletion.statusTitle), `Статус: ${pendingGoalCompletion.statusTitle || "НОВИЧОК"}`);
  setPremiumIconText(goalCompletionDate, "calendar", `Дата завершения: ${formatCompletedDate(pendingGoalCompletion.completedAt || Date.now())}`);
  requestAnimationFrame(() => {
    goalCompletionNewGoalButton?.focus();
  });
}

function maybeShowTempoWarning(participant, editable) {
  if (!editable) return;
  const status = getParticipantStatusInfo(participant);
  const today = getTodayDateValue();
  if (status.daysWithoutActivity < 3 || status.daysWithoutActivity >= 5) return;
  if (participant.tempoWarningShownFor === today) return;
  participant.tempoWarningShownFor = today;
  saveState();
  showStatusToast("Ты начинаешь терять темп", "warning");
}

function renderStatusCard(node, status) {
  const card = node.querySelector(".status-card");
  if (!card) return;
  card.dataset.status = status.key;
  card.dataset.activity = status.activity.key;
  setPremiumIconText(card.querySelector(".status-pill"), status.iconName, status.title);
  const emblem = card.querySelector(".status-emblem");
  emblem.replaceChildren(createPremiumIcon(status.iconName, { size: "large" }));
  card.querySelector(".status-title").textContent = status.title;
  card.querySelector(".status-description").textContent = status.description;
  setPremiumIconText(card.querySelector(".status-streak"), "flame", `Серия: ${formatDayCount(status.streak)}`);
  setPremiumIconText(card.querySelector(".status-record"), "trophy", `Рекорд: ${formatDayCount(status.bestStreak)}`);
  setPremiumIconText(card.querySelector(".status-activity"), status.activity.iconName, `Активность: ${status.activity.label}`);
}

function createStatusMiniBadge(participant) {
  const status = getParticipantStatusInfo(participant);
  const badge = document.createElement("span");
  const title = document.createElement("span");
  const streak = document.createElement("span");
  badge.className = "status-mini";
  badge.dataset.status = status.key;
  title.className = "status-mini-title";
  streak.className = "status-mini-streak";
  setPremiumIconText(title, status.iconName, status.title);
  setPremiumIconText(streak, "flame", formatDayCount(status.streak));
  badge.append(title, streak);
  return badge;
}

function formatDayCount(days) {
  const safeDays = Number(days || 0);
  const lastDigit = safeDays % 10;
  const lastTwoDigits = safeDays % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) return `${safeDays} день`;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${safeDays} дня`;
  }
  return `${safeDays} дней`;
}

function showStatusToast(message, iconName = "sparkle") {
  const toast = document.createElement("div");
  toast.className = "status-toast";
  setPremiumIconText(toast, iconName, message);
  document.body.append(toast);
  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 3600);
}

function renderGoalArchive(container, participant) {
  if (!container) return;
  container.replaceChildren();

  const archivedGoals = sortArchivedGoals(Array.isArray(participant.archivedGoals) ? participant.archivedGoals : []);
  if (archivedGoals.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Архив целей пока пуст.";
    container.append(empty);
    return;
  }

  const isExpanded = expandedArchiveParticipants.has(participant.id);
  const visibleGoals = isExpanded ? archivedGoals : archivedGoals.slice(0, 1);

  visibleGoals.forEach((goal) => {
    const card = document.createElement("article");
    const main = document.createElement("div");
    const title = document.createElement("strong");
    const status = document.createElement("span");
    const isCompleted = goal.status === "completed";

    card.className = "archive-card";
    card.classList.toggle("archive-card-completed", isCompleted);
    card.classList.toggle("archive-card-expired", !isCompleted);
    main.className = "archive-main";
    if (isCompleted) {
      setPremiumIconText(title, "trophy", goal.title || "Цель без названия");
    } else {
      title.textContent = goal.title || "Цель без названия";
    }
    status.className = `archive-status archive-${isCompleted ? "completed" : "expired"}`;
    status.textContent = isCompleted ? "Цель достигнута" : "Не достигнута";

    if (isCompleted) {
      const trophy = document.createElement("span");
      const metrics = document.createElement("div");
      trophy.className = "archive-trophy";
      trophy.append(createPremiumIcon("trophy", { size: "medium" }));
      trophy.setAttribute("aria-label", "Цель достигнута");
      metrics.className = "archive-achievement-grid";
      metrics.append(
        createArchiveMetric("calendar", "Дата завершения", formatCompletedDate(goal.completedAt || goal.archivedAt)),
        createArchiveMetric("flame", "Серия", formatDayCount(goal.streakAtCompletion || 0)),
        createArchiveMetric("bolt", "Выполнено шагов", String(goal.completedSteps || goal.doneTasks || 0)),
        createArchiveMetric(getStatusIconNameByTitle(goal.statusTitle), "Статус", stripPremiumEmoji(goal.statusTitle || "НОВИЧОК")),
      );
      main.append(title, metrics);
      card.append(trophy);
    } else {
      const meta = document.createElement("p");
      meta.textContent = getArchiveMeta(goal);
      main.append(title, meta);
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

  if (archivedGoals.length > 1) {
    const toggleButton = document.createElement("button");
    toggleButton.className = "archive-toggle";
    toggleButton.type = "button";
    toggleButton.textContent = isExpanded
      ? "Свернуть"
      : `Посмотреть все (${archivedGoals.length})`;
    toggleButton.addEventListener("click", () => {
      if (expandedArchiveParticipants.has(participant.id)) {
        expandedArchiveParticipants.delete(participant.id);
      } else {
        expandedArchiveParticipants.add(participant.id);
      }
      render();
      requestAnimationFrame(() => {
        document.querySelector(".goal-archive")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    });
    container.append(toggleButton);
  }
}

function createArchiveMetric(iconName, label, value) {
  const metric = document.createElement("span");
  metric.className = "archive-achievement-metric";
  const labelEl = document.createElement("small");
  const valueEl = document.createElement("strong");
  setPremiumIconText(labelEl, iconName, label);
  valueEl.textContent = value;
  metric.append(labelEl, valueEl);
  return metric;
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
  checkbox.disabled = !editable;
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

function getSubtaskToggleText(isOpen, remaining) {
  return `${isOpen ? "Свернуть" : "Показать"} доп. шаги (${remaining})`;
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
  const canManageSubtasks = editable && !completed;
  const canToggleSubtasks = subtasks.length > 0 && (editable || !completed);
  const canReadonlyToggleSubtasks = !editable && subtasks.length > 0 && !completed;
  const readonlySubtasksKey = `${participantId}:${task.id}`;
  const readonlySubtasksAreOpen = readonlySubtasksOpen.has(readonlySubtasksKey);
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
  checkbox.disabled = !editable || subtasks.length > 0;
  editButton.hidden = !editable || completed;
  completeBadge.hidden = !completed;
  if (completed) {
    setPremiumIconText(completeBadge, "badge", completeBadge.textContent || "Молодец!", { size: "small" });
  }
  addSubtaskButton.hidden = !canManageSubtasks;
  subtaskToggle.hidden = !canToggleSubtasks;
  subtaskToggle.textContent = getSubtaskToggleText(
    canReadonlyToggleSubtasks ? readonlySubtasksAreOpen : !task.subtasksHidden,
    remaining,
  );
  subtaskPanel.hidden =
    subtasks.length === 0 ||
    !canToggleSubtasks ||
    (canReadonlyToggleSubtasks ? !readonlySubtasksAreOpen : task.subtasksHidden);
  subtaskForm.hidden = !canManageSubtasks;

  checkbox.addEventListener("change", () => toggleTask(participantId, task.id, checkbox.checked));
  card.addEventListener("pointerdown", (event) => beginCardDrag(event, participantId, task.id));
  subtaskToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!canReadonlyToggleSubtasks) {
      toggleSubtasksVisibility(participantId, task.id);
      return;
    }
    const shouldOpen = subtaskPanel.hidden;
    subtaskPanel.hidden = !shouldOpen;
    if (shouldOpen) {
      readonlySubtasksOpen.add(readonlySubtasksKey);
    } else {
      readonlySubtasksOpen.delete(readonlySubtasksKey);
    }
    subtaskToggle.textContent = getSubtaskToggleText(shouldOpen, remaining);
  });
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
