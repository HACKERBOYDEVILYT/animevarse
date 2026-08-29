export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  return {
    id: "demo-user",
    name: "Anime Fan",
    email,
  };
}

export async function register(name, email, password) {
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  return {
    id: crypto.randomUUID(),
    name,
    email,
  };
}
