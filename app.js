const STORAGE_KEY = "boddy-board-v2";
const SESSION_KEY = "boddy-board-session-v1";
const LEGACY_KEYS = ["boddy-board-v1", "goal-board-v1"];
const SHARED_STATE_URL = "https://boddy-board-github.vercel.app/api/state";
const ADMIN_LOGIN = "Sasha";
const DEFAULT_ADMIN_PASSWORD = "S_asha2305";
const DEFAULT_LOGO_URL = "assets/boddy-logo.jpg";
const DEFAULT_COVER_URL = "assets/boddy-cover.png";

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
let textEditMode = false;

const openLoginButton = document.querySelector("#openLoginButton");
const participantLogoutButton = document.querySelector("#participantLogoutButton");
const openAdminButton = document.querySelector("#openAdminButton");
const openAdminSettingsButton = document.querySelector("#openAdminSettingsButton");
const toggleTextEditButton = document.querySelector("#toggleTextEditButton");
const openRegistrationPasswordButton = document.querySelector("#openRegistrationPasswordButton");
const registrationStatus = document.querySelector("#registrationStatus");
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
const publishAnnouncementButton = document.querySelector("#publishAnnouncementButton");
const deleteAnnouncementButton = document.querySelector("#deleteAnnouncementButton");
const announcementMessage = document.querySelector("#announcementMessage");
const announcementReadList = document.querySelector("#announcementReadList");
const announcementModal = document.querySelector("#announcementModal");
const closeAnnouncementButton = document.querySelector("#closeAnnouncementButton");
const announcementText = document.querySelector("#announcementText");
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
    closeModals();
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!announcementModal.hidden) {
    markAnnouncementRead();
    return;
  }
  closeModals();
});
document.addEventListener("click", handleEditableTextClick, true);
joinButton.addEventListener("click", joinAsParticipant);
participantLogoutButton.addEventListener("click", logoutParticipant);
adminLoginButton.addEventListener("click", loginAsAdmin);
saveAdminPasswordButton?.addEventListener("click", saveAdminPassword);
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
window.addEventListener("resize", scheduleTourPositionUpdate);
window.addEventListener("scroll", scheduleTourPositionUpdate, { passive: true });
window.addEventListener("focus", refreshSharedState);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshSharedState();
  }
});
setInterval(refreshSharedState, 5000);
[nameInput, passwordInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      joinAsParticipant();
    }
  });
});
adminPasswordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loginAsAdmin();
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
  return {
    id: crypto.randomUUID(),
    title,
    done,
    createdAt: Date.now(),
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
  render();
  if (isAdminRoute()) {
    openAdminPanel();
  }
}

async function refreshSharedState() {
  if (!SHARED_STATE_URL) return;
  if (loginModal && !loginModal.hidden) return;
  if (adminNewsModal && !adminNewsModal.hidden && document.activeElement === announcementInput) return;

  try {
    const response = await fetch(SHARED_STATE_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return;

    const freshState = normalizeState(await response.json());
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
    if (hasArchivedGoals) {
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
  if (!SHARED_STATE_URL) return localState;

  try {
    const response = await fetch(SHARED_STATE_URL, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Shared state unavailable");

    const sharedState = normalizeState(await response.json());
    if (sharedState.participants.length === 0 && localState.participants.length > 0) {
      await saveSharedState(localState);
      return localState;
    }

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
    onboardingCompleted: Boolean(person.onboardingCompleted),
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
          subtasks: Array.isArray(task.subtasks)
            ? task.subtasks.map((subtask) => ({
                id: subtask.id || crypto.randomUUID(),
                title: subtask.title || "Доп. шаг",
                done: Boolean(subtask.done || subtask.status === "done"),
                createdAt: subtask.createdAt || Date.now(),
              }))
            : [],
          subtasksHidden: typeof task.subtasksHidden === "boolean" ? task.subtasksHidden : true,
        }))
      : [],
  }));

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
    readBy: Array.isArray(announcement.readBy) ? announcement.readBy : [],
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
      archivedGoals: [],
      tasks: parsed.tasks.map((task) => ({
        id: crypto.randomUUID(),
        title: task.title,
        done: task.status === "done",
        createdAt: task.createdAt || Date.now(),
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
  saveState();
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

function saveState() {
  const sharedState = toSharedState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState));
  persistLocalSession();
  saveSharedState(state);
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
    deletedParticipantIds: source.deletedParticipantIds || [],
    allowEmptyParticipants: Boolean(options.allowEmptyParticipants),
  };
}

async function saveSharedState(source, options = {}) {
  if (!SHARED_STATE_URL) return;

  try {
    await fetch(SHARED_STATE_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSharedState(source, options)),
    });
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(source)));
  }
}

function openModal(modal, focusTarget) {
  closeModals();
  if (modal === adminModal) {
    renderAdminPanel();
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
  loginModal.hidden = true;
  adminModal.hidden = true;
  adminNewsModal.hidden = true;
  registrationPasswordModal.hidden = true;
  tourModal.hidden = true;
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

async function joinAsParticipant() {
  const name = nameInput.value.trim();
  const password = passwordInput.value;
  const registrationKey = registrationKeyInput?.value.trim();
  const uploadedPicture = await readOptionalImageFile(participantPhotoInput);

  if (!name) {
    showAuthMessage("Введите имя.", true);
    nameInput.focus();
    return;
  }

  if (!password) {
    showAuthMessage("Введите пароль.", true);
    passwordInput.focus();
    return;
  }

  let participant = state.participants.find(
    (person) => person.name.toLowerCase() === name.toLowerCase(),
  );
  const passwordHash = await hashPassword(name, password);

  if (!participant) {
    if (state.registrationPasswordHash) {
      if (!registrationKey) {
        showAuthMessage("Для регистрации нового участника введите пароль администратора.", true);
        registrationKeyInput.focus();
        return;
      }
      const registrationHash = await hashPassword("registration", registrationKey);
      if (registrationHash !== state.registrationPasswordHash) {
        showAuthMessage("Неверный пароль регистрации. Узнайте его у администратора.", true);
        registrationKeyInput.select();
        return;
      }
    } else {
      showAuthMessage("Регистрация закрыта. Узнайте пароль у администратора.", true);
      return;
    }

    if (state.deletedParticipantIds.includes(name.toLowerCase())) {
      state.deletedParticipantIds = state.deletedParticipantIds.filter((item) => item !== name.toLowerCase());
    }
    participant = {
      id: crypto.randomUUID(),
      name,
      passwordHash,
      picture: uploadedPicture,
      goal: "",
      deadline: "",
      deadlineLocked: false,
      tasks: [],
      archivedGoals: [],
      onboardingCompleted: false,
    };
    state.participants.push(participant);
    showAuthMessage("Аккаунт создан. Теперь это ваша страница.", false);
  } else if (!participant.passwordHash) {
    participant.passwordHash = passwordHash;
    participant.picture = uploadedPicture || participant.picture || "";
    showAuthMessage("Пароль сохранён для этого имени.", false);
  } else if (participant.passwordHash !== passwordHash) {
    showAuthMessage("Пароль не подходит для этого имени.", true);
    passwordInput.select();
    return;
  } else {
    participant.picture = uploadedPicture || participant.picture || "";
    showAuthMessage("Вы вошли в свою страницу.", false);
  }

  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
  nameInput.value = "";
  passwordInput.value = "";
  clearFileInput(participantPhotoInput);
  if (registrationKeyInput) registrationKeyInput.value = "";
  saveState();
  closeModals();
  render();
  if (!participant.onboardingCompleted) {
    openTour(participant.id);
  }
}

function logoutParticipant() {
  state.activeParticipantId = "";
  localStorage.removeItem(SESSION_KEY);
  closeModals();
  render();
}

function showAuthMessage(message, isError) {
  authMessage.textContent = message;
  authMessage.classList.toggle("is-error", isError);
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
    (!state.adminPasswordChanged && usesDefaultPassword);

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

  if (!text) {
    showAnnouncementMessage("Напишите текст новости.", true);
    announcementInput.focus();
    return;
  }

  state.announcement = {
    id: crypto.randomUUID(),
    text,
    createdAt: Date.now(),
    readBy: [],
  };
  announcementInput.value = "";
  showAnnouncementMessage("", false);
  showAdminMessage("Новость опубликована для участников.", false);
  saveState();
  closeModals();
  render();
}

function deleteAnnouncement() {
  if (!state.isAdmin || !state.announcement) return;

  state.announcement = null;
  announcementInput.value = "";
  showAnnouncementMessage("Новость удалена.", false);
  showAdminMessage("Новость удалена у всех участников.", false);
  saveState();
  render();
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
    saveState();
  }

  announcementModal.hidden = true;
  renderAdminControls();
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

function archiveFinishedGoal(participant) {
  if (!participant || !hasActiveGoal(participant)) return false;

  const progress = getProgress(participant.tasks);
  const completed = progress.total > 0 && progress.done === progress.total;
  const expired = isDeadlineExpired(participant.deadline) && !completed;
  if (!completed && !expired) return false;

  participant.archivedGoals = Array.isArray(participant.archivedGoals) ? participant.archivedGoals : [];
  participant.archivedGoals.unshift({
    id: crypto.randomUUID(),
    title: participant.goal || "Цель без названия",
    deadline: participant.deadline || "",
    status: completed ? "completed" : "expired",
    progress: progress.percent,
    doneTasks: progress.done,
    totalTasks: progress.total,
    archivedAt: Date.now(),
  });
  participant.goal = "";
  participant.deadline = "";
  participant.deadlineLocked = false;
  participant.tasks = [];
  return true;
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

  participant.goal = goal;
  saveState();
  renderResults();
}

function updateDeadline(participantId, deadline) {
  const participant = findParticipant(participantId);
  if (!participant || (!isActive(participantId) && !state.isAdmin)) return;

  participant.deadline = deadline;
  participant.deadlineLocked = Boolean(deadline);
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function addTask(participantId, title) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId) || !title.trim()) return;

  participant.tasks.unshift(createTask(title.trim()));
  saveState();
  render();
}

function toggleTask(participantId, taskId, done) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || (Array.isArray(task.subtasks) && task.subtasks.length > 0)) return;

  task.done = done;
  reorderTasks(participant);
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function reorderTasks(participant) {
  const incomplete = [];
  const complete = [];
  participant.tasks.forEach((task) => {
    if (isTaskComplete(task)) {
      complete.push(task);
    } else {
      incomplete.push(task);
    }
  });
  participant.tasks = [...incomplete, ...complete];
}

function reorderSubtasks(task) {
  if (!Array.isArray(task.subtasks)) return;

  const incomplete = [];
  const complete = [];
  task.subtasks.forEach((subtask) => {
    if (subtask.done) {
      complete.push(subtask);
    } else {
      incomplete.push(subtask);
    }
  });
  task.subtasks = [...incomplete, ...complete];
}

function addSubtask(participantId, taskId, title) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId) || !title.trim()) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  task.subtasks.unshift({
    id: crypto.randomUUID(),
    title: title.trim(),
    done: false,
    createdAt: Date.now(),
  });
  task.subtasksHidden = false;
  task.done = false;
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

  subtask.done = done;
  reorderSubtasks(task);
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

  task.subtasksHidden = !task.subtasksHidden;
  saveState();
  render();
}

function editTask(participantId, taskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task) return;

  const newTitle = window.prompt("Изменить текст шага", task.title);
  if (!newTitle || !newTitle.trim()) return;

  task.title = newTitle.trim();
  saveState();
  render();
}

function beginCardDrag(event, participantId, taskId) {
  if (event.button !== 0) return;
  if (event.target.closest("button, input, label, textarea")) return;
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  event.preventDefault();
  const card = event.currentTarget;
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
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    targetTaskId: null,
  };

  window.addEventListener("pointermove", onCardDragMove);
  window.addEventListener("pointerup", endCardDrag);
}

function onCardDragMove(event) {
  if (!dragState) return;
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

  const [draggedTask] = participant.tasks.splice(draggedIndex, 1);
  participant.tasks.splice(targetIndex, 0, draggedTask);
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

  event.preventDefault();
  event.stopPropagation();
  const card = event.currentTarget;
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
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    targetSubtaskId: null,
  };

  window.addEventListener("pointermove", onCardDragMove);
  window.addEventListener("pointerup", endCardDrag);
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

  const draggedIndex = task.subtasks.findIndex((item) => item.id === draggedSubtaskId);
  const targetIndex = task.subtasks.findIndex((item) => item.id === targetSubtaskId);
  if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return;

  const [draggedSubtask] = task.subtasks.splice(draggedIndex, 1);
  task.subtasks.splice(targetIndex, 0, draggedSubtask);
  reorderSubtasks(task);
  saveState();
  render();
}

function deleteTask(participantId, taskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  participant.tasks = participant.tasks.filter((task) => task.id !== taskId);
  archiveFinishedGoal(participant);
  saveState();
  render();
}

function deleteAccount(participantId) {
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
      participant.name.toLowerCase(),
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
  saveSharedState(state, { allowEmptyParticipants: true });
  showAdminMessage("Участник удалён.", false);
  render();
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

function getDeadlineInfo(deadline) {
  if (!deadline) {
    return { label: "Срок не указан", tone: "empty" };
  }

  const [year, month, day] = deadline.split("-").map(Number);
  if (!year || !month || !day) {
    return { label: "Срок не указан", tone: "empty" };
  }

  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((target - today) / 86400000);
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
    const progressDiff = getProgress(b.tasks).percent - getProgress(a.tasks).percent;
    if (progressDiff !== 0) return progressDiff;
    return a.name.localeCompare(b.name, "ru");
  });
}

function render() {
  renderSiteImages();
  renderAdminControls();
  renderActiveBadge();
  renderResults();
  renderProfile();
  renderAnnouncementModal();
  applyEditableText();
  if (tourModal && !tourModal.hidden) {
    renderTourStep();
  }
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

  state.participants.forEach((participant) => {
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

function renderAnnouncementModal() {
  const active = findParticipant(state.activeParticipantId);
  const shouldShow =
    active &&
    !state.isAdmin &&
    state.announcement?.text &&
    !state.announcement.readBy.includes(active.id) &&
    loginModal.hidden &&
    adminModal.hidden &&
    adminNewsModal.hidden;

  announcementModal.hidden = !shouldShow;
  if (shouldShow) {
    announcementText.textContent = state.announcement.text;
  }
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
  const activeParticipants = rankedParticipants.filter((participant) => getProgress(participant.tasks).percent > 0);

  if (activeParticipants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока никто не сделал шаги. Здесь появится рейтинг участников, когда появятся выполненные задачи.";
    resultChart.append(empty);
  } else {
    const visibleParticipants = activeParticipants.slice(0, 3);

    visibleParticipants.forEach((participant, index) => {
      const progress = getProgress(participant.tasks);
      renderChartRow(participant, progress, index + 1);
    });
  }

  rankedParticipants.forEach((participant) => {
    const progress = getProgress(participant.tasks);
    renderTableRow(participant, progress);
  });
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
  const isChampion = place === 1;
  const placeBadge = getPlaceBadge(place);

  node.classList.toggle("is-active", isActive(participant.id));
  node.classList.toggle("is-viewed", state.viewedParticipantId === participant.id);
  node.classList.toggle("is-champion", isChampion);
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
  row.querySelector(".table-goal").textContent = participant.goal || "Цель ещё не указана";
  const deadlinePill = row.querySelector(".deadline-pill");
  const deadlineInfo = getDeadlineInfo(participant.deadline);
  deadlinePill.textContent = deadlineInfo.label;
  deadlinePill.classList.add(`deadline-${deadlineInfo.tone}`);
  row.querySelector(".table-count").textContent = `${progress.done} из ${progress.total}`;
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

  deadlineInput.value = participant.deadline || "";
  deadlineInput.disabled = !canEditDeadline;
  deadlineInput.addEventListener("input", () => {
    const nextDeadline = deadlineInput.value;
    if (!state.isAdmin && nextDeadline) {
      const confirmed = window.confirm(
        "Вы точно хотите именно на этот период времени? Если нажмёте «Да», изменить уже будет нельзя.",
      );
      if (!confirmed) {
        deadlineInput.value = participant.deadline || "";
        return;
      }
    }
    deadlineInput.classList.remove("is-invalid");
    if (deadlineError) {
      deadlineError.hidden = true;
    }
    updateDeadline(participant.id, nextDeadline);
  });

  taskForm.hidden = !editable;
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
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

    card.className = "archive-card";
    main.className = "archive-main";
    title.textContent = goal.title || "Цель без названия";
    meta.textContent = getArchiveMeta(goal);
    status.className = `archive-status archive-${goal.status === "completed" ? "completed" : "expired"}`;
    status.textContent = goal.status === "completed" ? "Достигнута" : "Срок прошёл";

    main.append(title, meta);
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

function createSubtaskCard(participantId, taskId, subtask, editable) {
  const card = subtaskTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = card.querySelector(".complete-checkbox");
  const editButton = card.querySelector(".edit-subtask");

  card.dataset.subtaskId = subtask.id;
  card.classList.toggle("is-done", Boolean(subtask.done));
  card.querySelector(".card-title").textContent = subtask.title;
  checkbox.checked = Boolean(subtask.done);
  checkbox.disabled = !editable;
  editButton.hidden = !editable;

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
      subtask.title = v;
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
  editButton.hidden = !editable;
  completeBadge.hidden = !completed;
  addSubtaskButton.hidden = !editable;
  subtaskToggle.hidden = subtasks.length === 0;
  subtaskToggle.textContent = subtasks.length === 0
    ? ""
    : `${task.subtasksHidden ? "Показать" : "Скрыть"} доп. шаги (${remaining})`;
  subtaskPanel.hidden = subtasks.length === 0 || task.subtasksHidden;

  checkbox.addEventListener("change", () => toggleTask(participantId, task.id, checkbox.checked));
  card.addEventListener("pointerdown", (event) => beginCardDrag(event, participantId, task.id));
  subtaskToggle.addEventListener("click", () => toggleSubtasksVisibility(participantId, task.id));
  addSubtaskButton.addEventListener("click", (e) => {
    e.stopPropagation();
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
      task.title = v;
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
