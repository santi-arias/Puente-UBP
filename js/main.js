// Punto de entrada: enrutado de vistas, render y eventos.

const VIEWS = {
  est: { home: studentHome, form: requestForm, profile: studentProfile, support: supportView },
  egr: { home: graduateHome, profile: graduateProfile, availability: availabilityView, support: supportView },
  adm: { home: adminView, support: supportView },
};

function currentView() {
  const views = VIEWS[role()];
  return (views[S.view] || views.home)();
}

// Conserva el foco del teclado entre renders (la vista se redibuja completa).
function focusKey(el) {
  if (!el || el === document.body) return null;
  if (el.id) return `#${el.id}`;
  const attrs = ['a', 'path', 'val', 'v', 'id', 'role'].filter(k => el.dataset[k] !== undefined);
  return attrs.length ? attrs.map(k => `[data-${k}="${CSS.escape(el.dataset[k])}"]`).join('') : null;
}

function showToast() {
  if (!S.toast) return;
  const root = $('#toast-root');
  root.innerHTML = `<div class="toast" role="status">${esc(S.toast)}</div>`;
  S.toast = '';
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => { root.innerHTML = ''; }, 3200);
}

function render() {
  if (S.session && (!VIEWS[S.session.role] || !currentUser())) S.session = null;
  const fk = focusKey(document.activeElement);
  $('#app').innerHTML = S.session ? shell(currentView()) : loginView();
  document.title = S.session ? `Puente UBP · ${ROLES[role()].label}` : 'Puente UBP · Ingresar';
  if (fk) { const el = document.querySelector(fk); if (el) el.focus({ preventScroll: true }); }
  const chat = $('#chat');
  if (chat) chat.scrollTop = chat.scrollHeight;
  showToast();
  persist();
}

const app = $('#app');

app.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const action = ACTIONS[b.dataset.a];
  if (!action) return;
  e.preventDefault();
  if (action(b) !== false) render();
});

// Los campos escriben directo en el borrador, así no se pierde lo tipeado al redibujar.
function bindField(e) {
  const el = e.target;
  const root = el.dataset.bind !== undefined ? S.draft : el.dataset.bindSupport !== undefined ? S.supportDraft : null;
  if (!root) return;
  const path = el.dataset.bind ?? el.dataset.bindSupport;
  const value = el.type === 'checkbox' ? el.checked : el.dataset.num !== undefined ? +el.value : el.value;
  setPath(root, path, value);
}

// Cierra el menú de cuenta al hacer clic fuera de él o al presionar Escape.
document.addEventListener('click', e => {
  const menu = $('.account[open]');
  if (menu && !menu.contains(e.target)) menu.open = false;
});
document.addEventListener('keydown', e => {
  const menu = $('.account[open]');
  if (e.key === 'Escape' && menu) { menu.open = false; menu.querySelector('summary').focus(); }
});

// Enter en un formulario: el navegador ya dispara el clic del botón de envío; solo evitamos la recarga.
app.addEventListener('submit', e => e.preventDefault());

app.addEventListener('input', bindField);
app.addEventListener('change', e => {
  if (e.target.dataset.upload) return handleFile(e.target);
  bindField(e);
  // El encabezado del perfil muestra la carrera elegida y el alcance la excluye.
  if (e.target.tagName === 'SELECT' && S.view === 'profile') render();
});

S = loadState();
S.supportTyping = false;
if (!FEATURES.centroGraduados && S.session && S.session.role === 'adm') S.session = null;
render();
