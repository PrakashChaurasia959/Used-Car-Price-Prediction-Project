const BASE = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const api = {
  register: (body) => request("POST", "/auth/register", body),
  login: (body) => request("POST", "/auth/login", body),
  logout: () => request("POST", "/auth/logout"),
  me: () => request("GET", "/auth/me"),

  predict: (body) => request("POST", "/predict", body),
  savePrediction: (body) => request("POST", "/predict/save", body),
  history: () => request("GET", "/predict/history"),
  stats: () => request("GET", "/predict/stats"),
  deletePrediction: (id) => request("DELETE", `/predict/${id}`),
};