// ============================================================
// api.js — Service central de connexion au backend DigiSchool
// ============================================================

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
// Recuperer le token JWT stocke
const getToken = () => localStorage.getItem("token");

// Headers communs avec token
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// Gestion des erreurs
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur serveur");
  return data;
};

// ── AUTH ─────────────────────────────────────────────────────────────
export const authAPI = {
  login: (body) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  loginEtudiant: (body) =>
    fetch(`${BASE_URL}/auth/login-etudiant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  me: () =>
    fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(handleResponse),
};

// ── ETUDIANTS ─────────────────────────────────────────────────────────
export const etudiantAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/etudiants?${query}`, { headers: headers() }).then(handleResponse);
  },
  getOne: (id) =>
    fetch(`${BASE_URL}/etudiants/${id}`, { headers: headers() }).then(handleResponse),

  getStats: () =>
    fetch(`${BASE_URL}/etudiants/stats`, { headers: headers() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/etudiants`, {
      method: "POST", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/etudiants/${id}`, {
      method: "PUT", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/etudiants/${id}`, {
      method: "DELETE", headers: headers(),
    }).then(handleResponse),
};

// ── ENSEIGNANTS ───────────────────────────────────────────────────────
export const enseignantAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/enseignants?${query}`, { headers: headers() }).then(handleResponse);
  },
  getOne: (id) =>
    fetch(`${BASE_URL}/enseignants/${id}`, { headers: headers() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/enseignants`, {
      method: "POST", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/enseignants/${id}`, {
      method: "PUT", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/enseignants/${id}`, {
      method: "DELETE", headers: headers(),
    }).then(handleResponse),
};

// ── CLASSES ───────────────────────────────────────────────────────────
export const classeAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/classes?${query}`, { headers: headers() }).then(handleResponse);
  },
  getOne: (id) =>
    fetch(`${BASE_URL}/classes/${id}`, { headers: headers() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/classes`, {
      method: "POST", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/classes/${id}`, {
      method: "PUT", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/classes/${id}`, {
      method: "DELETE", headers: headers(),
    }).then(handleResponse),
};

// ── NOTES ─────────────────────────────────────────────────────────────
export const noteAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/notes?${query}`, { headers: headers() }).then(handleResponse);
  },
  getMoyennes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/notes/moyennes?${query}`, { headers: headers() }).then(handleResponse);
  },
  create: (body) =>
    fetch(`${BASE_URL}/notes`, {
      method: "POST", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/notes/${id}`, {
      method: "PUT", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE", headers: headers(),
    }).then(handleResponse),
};

// ── PAIEMENTS ─────────────────────────────────────────────────────────
export const paiementAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/paiements?${query}`, { headers: headers() }).then(handleResponse);
  },
  getStats: () =>
    fetch(`${BASE_URL}/paiements/stats`, { headers: headers() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/paiements`, {
      method: "POST", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/paiements/${id}`, {
      method: "PUT", headers: headers(), body: JSON.stringify(body),
    }).then(handleResponse),
};