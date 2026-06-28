const API = "https://web-production-9312ae.up.railway.app";

async function apiPost(endpoint, data) {
  const r = await fetch(API + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail || 'Erreur serveur');
  return json;
}

async function apiGet(endpoint, token) {
  const r = await fetch(API + endpoint, {
    headers: token ? { Authorization: 'Bearer ' + token } : {},
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json.detail || 'Erreur serveur');
  return json;
}

function getToken() { return localStorage.getItem('at_token'); }
function getUser()  { try { return JSON.parse(localStorage.getItem('at_user')); } catch { return null; } }
function getPlan()  { try { return JSON.parse(localStorage.getItem('at_plan')); } catch { return null; } }

function saveSession(token, user, plan) {
  localStorage.setItem('at_token', token);
  localStorage.setItem('at_user', JSON.stringify(user));
  localStorage.setItem('at_plan', JSON.stringify(plan));
}

function logout() {
  localStorage.removeItem('at_token');
  localStorage.removeItem('at_user');
  localStorage.removeItem('at_plan');
  window.location.href = 'connexion.html';
}

function requireAuth(redirectIfNo = 'connexion.html') {
  if (!getToken()) { window.location.href = redirectIfNo; return false; }
  return true;
}

function requirePlan(redirectIfNo = 'tarifs.html') {
  const plan = getPlan();
  if (!plan || !plan.active) { window.location.href = redirectIfNo; return false; }
  return true;
}

function notify(msg, type = 'green') {
  const el = document.getElementById('notif');
  if (!el) return;
  el.textContent = msg;
  el.style.background = type === 'red' ? '#dc2626' : type === 'yellow' ? '#ca8a04' : '#16a34a';
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3500);
}

// Met à jour le nav selon la connexion
function updateNav() {
  const user = getUser();
  const navLogin = document.getElementById('navLogin');
  const navRegister = document.getElementById('navRegister');
  const navDash = document.getElementById('navDash');
  const navLogout = document.getElementById('navLogout');
  if (user) {
    if (navLogin) navLogin.style.display = 'none';
    if (navRegister) navRegister.style.display = 'none';
    if (navDash) navDash.style.display = 'inline-flex';
    if (navLogout) navLogout.style.display = 'inline-flex';
  } else {
    if (navDash) navDash.style.display = 'none';
    if (navLogout) navLogout.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', updateNav);
