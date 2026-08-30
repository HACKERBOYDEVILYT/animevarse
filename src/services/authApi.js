const USERS_KEY = "animeverse-users";
const SESSION_KEY = "animeverse-session";

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function register(name, email, password) {
  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);

  if (!cleanName) {
    throw new Error("Please enter your name.");
  }

  if (cleanName.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  if (!validateEmail(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!password) {
    throw new Error("Please enter a password.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const users = getUsers();

  const exists = users.some(
    (user) => user.email.toLowerCase() === cleanEmail
  );

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    id: createId(),
    name: cleanName,
    email: cleanEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

export async function login(email, password) {
  const cleanEmail = normalizeEmail(email);

  if (!validateEmail(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!password) {
    throw new Error("Please enter your password.");
  }

  const users = getUsers();

  const user = users.find(
    (item) => item.email.toLowerCase() === cleanEmail
  );

  if (!user) {
    throw new Error("No account found with this email.");
  }

  if (user.password !== password) {
    throw new Error("Incorrect password.");
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
