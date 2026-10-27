// Utilidades generales, sin dependencia del estado.

const $ = sel => document.querySelector(sel);
const clone = obj => JSON.parse(JSON.stringify(obj));

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = name => String(name || '').split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const firstName = name => String(name || '').split(' ')[0];

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
  target[last] = value;
}

function fmtSize(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const nowTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
const today = () => new Date().toLocaleDateString('es-AR');
