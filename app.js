const STORAGE_KEY = "boddy-board-v2";
const SESSION_KEY = "boddy-board-session-v1";
const LEGACY_KEYS = ["boddy-board-v1", "goal-board-v1"];
const SHARED_STATE_URL =
  window.location.protocol === "file:"
    ? "https://trello-three-green.vercel.app/api/state"
    : "/api/state";

const defaultParticipant = {
  id: crypto.randomUUID(),
  name: "Пример",
  passwordHash: "",
  goal: "Провести сильную неделю Boddy",
  deadline: "",
  tasks: [
    createTask("Написать цель", true),
    createTask("Разбить цель на шаги", true),
    createTask("Сделать первый шаг", false),
  ],
};

let state = createInitialState();
let dragState = null;

const openLoginButton = document.querySelector("#openLoginButton");
const participantLogoutButton = document.querySelector("#participantLogoutButton");
const openAdminButton = document.querySelector("#openAdminButton");
const openRegistrationPasswordButton = document.querySelector("#openRegistrationPasswordButton");
const registrationStatus = document.querySelector("#registrationStatus");
const loginModal = document.querySelector("#loginModal");
const adminModal = document.querySelector("#adminModal");
const adminNewsModal = document.querySelector("#adminNewsModal");
const registrationPasswordModal = document.querySelector("#registrationPasswordModal");
const nameInput = document.querySelector("#nameInput");
const passwordInput = document.querySelector("#passwordInput");
const registrationKeyInput = document.querySelector("#registrationKeyInput");
const joinButton = document.querySelector("#joinButton");
const googleSignInButton = document.querySelector("#googleSignInButton");
const adminPasswordInput = document.querySelector("#adminPasswordInput");
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
openAdminButton.addEventListener("click", () => openModal(adminModal, adminPasswordInput));
openRegistrationPasswordButton?.addEventListener("click", () => openModal(registrationPasswordModal, registrationPasswordInput));
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModals);
});
document.querySelectorAll(".modal-layer").forEach((layer) => {
  layer.addEventListener("click", (event) => {
    if (event.target !== layer) return;
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
joinButton.addEventListener("click", joinAsParticipant);
participantLogoutButton.addEventListener("click", logoutParticipant);
adminLoginButton.addEventListener("click", loginAsAdmin);
openAnnouncementButton.addEventListener("click", openAdminNewsModal);
openRegistrationPasswordButton?.addEventListener("click", () => openModal(registrationPasswordModal, registrationPasswordInput));
saveRegistrationPasswordButton?.addEventListener("click", saveRegistrationPassword);
clearRegistrationPasswordButton?.addEventListener("click", clearRegistrationPassword);
adminLogoutButton.addEventListener("click", logoutAdmin);
publishAnnouncementButton.addEventListener("click", publishAnnouncement);
deleteAnnouncementButton.addEventListener("click", deleteAnnouncement);
closeAnnouncementButton.addEventListener("click", markAnnouncementRead);
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

async function initialize() {
  state = await loadState();
  restoreLocalSession();
  loadGoogleIdentity();
  render();
}

async function refreshSharedState() {
  if (!SHARED_STATE_URL) return;
  if (loginModal && !loginModal.hidden) return;
  if (adminNewsModal && !adminNewsModal.hidden && document.activeElement === announcementInput) return;

  try {
    const response = await fetch(SHARED_STATE_URL, {
      headers: { Accept: "application/json" },
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSharedState(state)));
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
    registrationPasswordHash: candidate.registrationPasswordHash || "",
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
    registrationPasswordHash: "",
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

function joinWithGoogle({ email, name, picture }) {
  if (!email) {
    showAuthMessage("Google не вернул адрес электронной почты.", true);
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
      hashPassword("registration", registrationKey).then((registrationHash) => {
        if (registrationHash !== state.registrationPasswordHash) {
          showAuthMessage("Неверный пароль регистрации. Узнайте его у администратора.", true);
          registrationKeyInput?.select();
          return;
        }
        createGoogleParticipant({ email, name, picture, isNew });
      });
      return;
    }
    showAuthMessage("Регистрация закрыта. Узнайте пароль у администратора.", true);
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
    tasks: [],
  };
  state.participants.push(participant);
  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
  if (registrationKeyInput) registrationKeyInput.value = "";
  saveState();
  closeModals();
  render();
  showAuthMessage(isNew ? "Вы вошли через Google." : "С возвращением!", false);
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

function toSharedState(source, options = {}) {
  return {
    participants: source.participants,
    adminPasswordHashV2: source.adminPasswordHash,
    registrationPasswordHash: source.registrationPasswordHash || "",
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
  requestAnimationFrame(() => focusTarget.focus());
}

function closeModals() {
  loginModal.hidden = true;
  adminModal.hidden = true;
  adminNewsModal.hidden = true;
  registrationPasswordModal.hidden = true;
}

function openAdminNewsModal() {
  if (!state.isAdmin) return;
  openModal(adminNewsModal, announcementInput);
}

async function joinAsParticipant() {
  const name = nameInput.value.trim();
  const password = passwordInput.value;
  const registrationKey = registrationKeyInput?.value.trim();

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
      goal: "",
      deadline: "",
      tasks: [],
    };
    state.participants.push(participant);
    showAuthMessage("Аккаунт создан. Теперь это ваша страница.", false);
  } else if (!participant.passwordHash) {
    participant.passwordHash = passwordHash;
    showAuthMessage("Пароль сохранён для этого имени.", false);
  } else if (participant.passwordHash !== passwordHash) {
    showAuthMessage("Пароль не подходит для этого имени.", true);
    passwordInput.select();
    return;
  } else {
    showAuthMessage("Вы вошли в свою страницу.", false);
  }

  state.activeParticipantId = participant.id;
  state.viewedParticipantId = participant.id;
  nameInput.value = "";
  passwordInput.value = "";
  if (registrationKeyInput) registrationKeyInput.value = "";
  closeModals();
  saveState();
  render();
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
  const password = adminPasswordInput.value;
  if (!password) {
    showAdminMessage("Введите пароль администратора.", true);
    adminPasswordInput.focus();
    return;
  }

  const passwordHash = await hashPassword("admin", password);
  if (!state.adminPasswordHash) {
    state.adminPasswordHash = passwordHash;
    state.isAdmin = true;
    showAdminMessage("Пароль администратора задан. Вы вошли как администратор.", false);
  } else if (state.adminPasswordHash !== passwordHash) {
    state.isAdmin = false;
    showAdminMessage("Неверный пароль администратора.", true);
    adminPasswordInput.select();
    saveState();
    render();
    return;
  } else {
    state.isAdmin = true;
    showAdminMessage("Вы вошли как администратор.", false);
  }

  adminPasswordInput.value = "";
  saveState();
  render();
  closeModals();
}

function logoutAdmin() {
  state.isAdmin = false;
  closeModals();
  showAdminMessage("Администратор вышел.", false);
  saveState();
  render();
}

function showAdminMessage(message, isError) {
  adminMessage.textContent = message;
  adminMessage.classList.toggle("is-error", isError);
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

function viewParticipant(id) {
  state.viewedParticipantId = id;
  saveState();
  render();
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
  if (!participant || !isActive(participantId)) return;

  participant.deadline = deadline;
  saveState();
  renderResults();
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
  reorderTasks(participant);
  saveState();
  render();
}

function deleteSubtask(participantId, taskId, subtaskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  const task = participant.tasks.find((item) => item.id === taskId);
  if (!task || !Array.isArray(task.subtasks)) return;

  task.subtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
  reorderTasks(participant);
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

function deleteTask(participantId, taskId) {
  const participant = findParticipant(participantId);
  if (!participant || !isActive(participantId)) return;

  participant.tasks = participant.tasks.filter((task) => task.id !== taskId);
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

function getProgress(tasks) {
  const total = tasks.length;
  const done = tasks.filter((task) => isTaskComplete(task)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent };
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
  renderAdminControls();
  renderActiveBadge();
  renderResults();
  renderProfile();
  renderAnnouncementModal();
}

function renderAdminControls() {
  openAdminButton.textContent = state.isAdmin ? "Админ: включен" : "Для администратора";
  adminLoginButton.hidden = state.isAdmin;
  openAnnouncementButton.hidden = !state.isAdmin;
  openRegistrationPasswordButton.hidden = !state.isAdmin;
  adminLogoutButton.hidden = !state.isAdmin;
  adminAnnouncementPanel.hidden = !state.isAdmin;
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
  const activeParticipants = rankedParticipants.filter((participant) => getProgress(participant.tasks).done > 0);

  if (activeParticipants.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Пока никто не сделал шаги. Здесь появится рейтинг участников, когда появятся выполненные задачи.";
    resultChart.append(empty);
  } else {
    const visibleParticipants = [];
    let visibleGroups = 0;
    let lastPercent = null;

    for (const participant of activeParticipants) {
      const progress = getProgress(participant.tasks);
      if (progress.percent !== lastPercent) {
        visibleGroups += 1;
        if (visibleGroups > 3) break;
        lastPercent = progress.percent;
      }
      visibleParticipants.push(participant);
    }

    const championPercent = visibleParticipants.reduce((maxPercent, participant) => {
      const progress = getProgress(participant.tasks);
      return Math.max(maxPercent, progress.percent);
    }, 0);

    visibleParticipants.forEach((participant) => {
      const progress = getProgress(participant.tasks);
      const isChampion = progress.percent === championPercent;
      renderChartRow(participant, progress, isChampion);
    });
  }

  rankedParticipants.forEach((participant) => {
    const progress = getProgress(participant.tasks);
    renderTableRow(participant, progress);
  });
}

function renderChartRow(participant, progress, isChampion) {
  const node = chartTemplate.content.firstElementChild.cloneNode(true);
  const championBadge = node.querySelector(".champion-badge");

  node.classList.toggle("is-active", isActive(participant.id));
  node.classList.toggle("is-viewed", state.viewedParticipantId === participant.id);
  node.classList.toggle("is-champion", isChampion);
  node.querySelector(".chart-name").textContent = participant.name;
  championBadge.hidden = !isChampion;
  node.querySelector(".chart-percent").textContent = `${progress.percent}%`;
  node.querySelector(".chart-bar").style.width = `${progress.percent}%`;
  node.addEventListener("click", () => viewParticipant(participant.id));

  resultChart.append(node);
}

function renderTableRow(participant, progress) {
  const row = tableRowTemplate.content.firstElementChild.cloneNode(true);
  const nameButton = row.querySelector(".table-name");
  const adminCell = row.querySelector(".table-admin");
  const adminDeleteButton = row.querySelector(".admin-delete");

  row.classList.toggle("is-viewed", state.viewedParticipantId === participant.id);
  nameButton.textContent = participant.name;
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
  const node = profileTemplate.content.firstElementChild.cloneNode(true);
  const goalInput = node.querySelector(".person-goal");
  const deadlineInput = node.querySelector(".person-deadline");
  const taskForm = node.querySelector(".task-form");
  const taskInput = node.querySelector(".task-input");
  const taskList = node.querySelector(".task-list");
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
  deadlineInput.disabled = !editable;
  deadlineInput.addEventListener("input", () => updateDeadline(participant.id, deadlineInput.value));

  taskForm.hidden = !editable;
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
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

  profileView.append(node);
}

function createSubtaskCard(participantId, taskId, subtask, editable) {
  const card = subtaskTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = card.querySelector(".complete-checkbox");
  const editButton = card.querySelector(".edit-subtask");

  card.classList.toggle("is-done", Boolean(subtask.done));
  card.querySelector(".card-title").textContent = subtask.title;
  checkbox.checked = Boolean(subtask.done);
  checkbox.disabled = !editable;
  editButton.hidden = !editable;

  checkbox.addEventListener("change", () => toggleSubtask(participantId, taskId, subtask.id, checkbox.checked));

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
