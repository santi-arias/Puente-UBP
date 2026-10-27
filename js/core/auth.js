// Cuentas de usuario del prototipo: alta, verificación y cambio de contraseña.
// Las contraseñas se guardan como hash SHA-256 con sal, pero todo vive en el navegador:
// en producción la autenticación tiene que resolverse en un servidor.

const USER_RE = /^[a-z0-9._-]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_MIN = 8;

function newSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(salt, password) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
}

// Se puede ingresar con el usuario o con el email.
function findUser(id) {
  const key = String(id || '').trim().toLowerCase();
  return key ? S.users.find(u => u.user === key || u.email.toLowerCase() === key) : null;
}

async function verifyPassword(u, password) {
  return !!u && (await hashPassword(u.salt, password)) === u.hash;
}

async function setPassword(u, password) {
  u.salt = newSalt();
  u.hash = await hashPassword(u.salt, password);
}

function passwordError(pass, confirm) {
  if (pass.length < PASS_MIN) return `La contraseña debe tener al menos ${PASS_MIN} caracteres.`;
  if (!/[a-zA-Z]/.test(pass) || !/\d/.test(pass)) return 'La contraseña debe combinar letras y números.';
  if (pass !== confirm) return 'Las contraseñas no coinciden.';
  return '';
}

function registerError(d) {
  const user = d.user.trim().toLowerCase();
  if (!d.nombre.trim()) return 'Ingresá tu nombre y apellido.';
  if (!EMAIL_RE.test(d.email.trim())) return 'Ingresá un email válido.';
  if (findUser(d.email)) return 'Ya existe una cuenta con ese email.';
  if (!USER_RE.test(user)) return 'El usuario debe tener entre 3 y 20 caracteres: letras, números, punto, guion o guion bajo.';
  if (findUser(user)) return 'Ese nombre de usuario ya está en uso.';
  return passwordError(d.pass, d.pass2);
}

// Crea la cuenta y su perfil (estudiante o egresado/a) según el tipo elegido.
async function createAccount(d) {
  const user = d.user.trim().toLowerCase();
  const email = d.email.trim();
  let pid;
  if (d.role === 'egr') {
    pid = Math.max(...S.mentors.map(m => m.id)) + 1;
    S.mentors.push(mentor(pid, d.nombre.trim(), d.car, d.rol.trim() || 'Egresado/a', '', [], { email }));
  } else {
    pid = `est-${Date.now()}`;
    S.students.push(student(pid, d.nombre.trim(), email, d.car, d.anio));
  }
  const u = { user, role: d.role, pid, email };
  await setPassword(u, d.pass);
  S.users.push(u);
  return u;
}
