// Estado global de la app y persistencia en el navegador.

let S;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.version === SEED_VERSION) return saved;
  } catch (e) { /* estado ausente o corrupto: se usa la semilla */ }
  return seedState();
}

function persist() {
  try {
    // Sin sesión, el borrador es un formulario de acceso: nunca se guardan contraseñas tipeadas.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...S, toast: '', err: '', draft: S.session ? S.draft : null }));
  } catch (e) {
    console.warn('No se pudo guardar el estado de la demo en este navegador.', e);
  }
}

// Helpers de acceso
const mn = id => S.mentors.find(m => m.id === id);
const role = () => S.session && S.session.role;
const currentUser = () => S.session && S.users.find(u => u.user === S.session.user);
const currentStudent = () => S.students.find(s => s.id === S.session.pid);
const currentMentor = () => mn(S.session.pid);
const profileTarget = () => (role() === 'egr' ? currentMentor() : currentStudent());
const displayName = () => (role() === 'egr' ? currentMentor().n : currentStudent().nombre);
const needsText = r => r.needs.map(i => NEEDS[i]).join(' · ');

function supportThread() {
  return (S.support[S.session.user] ??= [welcomeMessage()]);
}

function flash(msg) {
  S.toast = msg;
}
