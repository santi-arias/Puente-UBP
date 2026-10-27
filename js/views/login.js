// Acceso: inicio de sesión, creación de usuario y recuperación de contraseña.

const AUTH_TITLES = {
  login: 'Iniciá sesión con tu cuenta',
  register: 'Creá tu cuenta',
  forgot: 'Restablecé tu contraseña',
};

function authDraft(mode, user = '') {
  if (mode === 'register') return { role: 'est', nombre: '', email: '', car: CAREERS[0], anio: STUDENT_YEARS[0], rol: '', user: '', pass: '', pass2: '' };
  if (mode === 'forgot') return { user, email: '', pass: '', pass2: '' };
  return { user, pass: '' };
}

function authInput(id, label, path, type = 'text', autocomplete = 'off') {
  return `<label class="field" for="${id}">${label}</label>
  <input id="${id}" type="${type}" data-bind="${path}" value="${esc(S.draft[path])}" autocomplete="${autocomplete}"${type === 'text' ? ' autocapitalize="none" spellcheck="false"' : ''}>`;
}

function authError() {
  return S.err ? `<div class="error" role="alert">${S.err}</div>` : '';
}

function signInForm() {
  return `<form class="auth-form" novalidate>
    ${authInput('a-user', 'Usuario o email', 'user', 'text', 'username')}
    ${authInput('a-pass', 'Contraseña', 'pass', 'password', 'current-password')}
    <div class="auth-forgot"><a href="#" data-a="auth" data-v="forgot">Olvidé mi contraseña</a></div>
    ${authError()}
    <button class="btn block" type="submit" data-a="sign-in">Iniciar sesión</button>
  </form>
  <p class="auth-alt">¿No tenés cuenta? <a href="#" data-a="auth" data-v="register">Crear usuario</a></p>`;
}

function registerForm() {
  const d = S.draft;
  const egr = d.role === 'egr';
  return `<form class="auth-form" novalidate>
    <label class="field">Soy</label>
    ${chips('role', [ROLES.est.label, ROLES.egr.label], d.role, { values: ['est', 'egr'], multi: false })}
    ${authInput('r-nombre', 'Nombre y apellido', 'nombre', 'text', 'name')}
    ${authInput('r-email', egr ? 'Email' : 'Email institucional', 'email', 'email', 'email')}
    <div class="form-grid">
      <div><label class="field" for="r-car">${egr ? 'Carrera de egreso' : 'Carrera'}</label><select id="r-car" data-bind="car">${CAREERS.map(c => `<option ${c === d.car ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div>${egr
        ? authInput('r-rol', 'Rol actual', 'rol', 'text', 'organization-title')
        : `<label class="field" for="r-anio">Año de cursado</label><select id="r-anio" data-bind="anio">${STUDENT_YEARS.map(y => `<option ${y === d.anio ? 'selected' : ''}>${y}</option>`).join('')}</select>`}</div>
    </div>
    ${authInput('r-user', 'Usuario', 'user', 'text', 'username')}
    <div class="form-grid">
      <div>${authInput('r-pass', 'Contraseña', 'pass', 'password', 'new-password')}</div>
      <div>${authInput('r-pass2', 'Repetir contraseña', 'pass2', 'password', 'new-password')}</div>
    </div>
    <p class="hint">Al menos ${PASS_MIN} caracteres, con letras y números.</p>
    ${authError()}
    <button class="btn block" type="submit" data-a="register">Crear cuenta</button>
  </form>
  <p class="auth-alt">¿Ya tenés cuenta? <a href="#" data-a="auth" data-v="login">Iniciar sesión</a></p>`;
}

function forgotForm() {
  return `<form class="auth-form" novalidate>
    ${authInput('f-user', 'Usuario', 'user', 'text', 'username')}
    ${authInput('f-email', 'Email de la cuenta', 'email', 'email', 'email')}
    <div class="form-grid">
      <div>${authInput('f-pass', 'Nueva contraseña', 'pass', 'password', 'new-password')}</div>
      <div>${authInput('f-pass2', 'Repetir contraseña', 'pass2', 'password', 'new-password')}</div>
    </div>
    <p class="hint">Verificamos tu identidad con el email registrado en la cuenta.</p>
    ${authError()}
    <button class="btn block" type="submit" data-a="reset-pass">Cambiar contraseña</button>
  </form>
  <p class="auth-alt"><a href="#" data-a="auth" data-v="login">Volver a iniciar sesión</a></p>`;
}

function loginView() {
  const mode = S.authView || 'login';
  if (!S.draft) S.draft = authDraft(mode);
  const dark = currentTheme() === 'dark';
  const form = { login: signInForm, register: registerForm, forgot: forgotForm }[mode]();
  return `<div class="login">
  <button class="theme-switch" data-a="theme" aria-label="Cambiar a modo ${dark ? 'claro' : 'oscuro'}">${dark ? ICONS.sun : ICONS.moon}<span>Modo ${dark ? 'claro' : 'oscuro'}</span></button>
  <img class="login-logo" src="${LOGO}" alt="">
  <section class="login-card ${mode === 'register' ? 'wide' : ''}">
    <h1 class="login-title">Puente UBP</h1>
    <p class="login-sub">${AUTH_TITLES[mode]}</p>
    ${form}
  </section>
  <footer class="login-foot">Universidad Blas Pascal</footer>
  </div>`;
}
