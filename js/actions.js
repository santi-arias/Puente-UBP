// Acciones disparadas por elementos con data-a. Devolver false evita volver a renderizar.

const LINKEDIN_RE = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[\w\-%.]+\/?$/i;

function draftFor(view) {
  if (view === 'form') return { car: currentStudent().car, needs: [], ctx: '', period: 1, fmt: 0, consent: false, attachCv: !!currentStudent().cv };
  if (view === 'profile') return clone(profileTarget());
  if (view === 'availability') return clone(profileTarget().avail);
  return null;
}

function go(view) {
  S.view = view;
  S.err = '';
  S.liErr = '';
  S.fileErr = null;
  S.draft = draftFor(view);
  window.scrollTo(0, 0);
}

function chipValue(b) {
  return b.dataset.num !== undefined ? +b.dataset.val : b.dataset.val;
}

function replyFromSupport(thread, topic) {
  S.supportTyping = true;
  setTimeout(() => {
    S.supportTyping = false;
    thread.push({ from: 'ubp', text: SUPPORT.replies[topic] || SUPPORT.replies[SUPPORT.replies.length - 1], at: nowTime() });
    render();
  }, 1200);
}

// Pantallas de acceso
function showAuth(mode, user = '') {
  S.authView = mode;
  S.draft = authDraft(mode, user);
  S.err = '';
}

function startSession(u) {
  S.session = { user: u.user, role: u.role, pid: u.pid };
  S.authView = 'login';
}

// Las acciones asíncronas (hash de contraseñas) redibujan al terminar.
function runAsync(task) {
  task()
    .catch(() => { S.err = 'No se pudo completar la operación en este navegador.'; })
    .finally(render);
  return false;
}

const ACTIONS = {
  auth(b) { showAuth(b.dataset.v); },
  'sign-in'() {
    const d = S.draft;
    if (!d.user.trim() || !d.pass) return void (S.err = 'Ingresá tu usuario y contraseña.');
    return runAsync(async () => {
      const u = findUser(d.user);
      if (!(await verifyPassword(u, d.pass))) {
        S.draft.pass = '';
        S.err = 'Usuario o contraseña incorrectos.';
        return;
      }
      startSession(u);
      go('home');
    });
  },
  register() {
    const d = S.draft;
    const err = registerError(d);
    if (err) return void (S.err = err);
    return runAsync(async () => {
      const u = await createAccount(d);
      startSession(u);
      go('profile');
      flash('Cuenta creada. Completá tu perfil para empezar.');
    });
  },
  'reset-pass'() {
    const d = S.draft;
    const u = findUser(d.user);
    if (!u || u.user !== d.user.trim().toLowerCase() || u.email.toLowerCase() !== d.email.trim().toLowerCase()) {
      return void (S.err = 'El usuario y el email no coinciden con ninguna cuenta.');
    }
    const err = passwordError(d.pass, d.pass2);
    if (err) return void (S.err = err);
    return runAsync(async () => {
      await setPassword(u, d.pass);
      showAuth('login', u.user);
      flash('Contraseña actualizada. Ya podés iniciar sesión.');
    });
  },
  logout() { S.session = null; S.view = 'home'; showAuth('login'); },
  go(b) { go(b.dataset.v); },
  theme() { toggleTheme(); },
  reset() {
    if (!confirm('¿Reiniciar la demo? Se borran los cambios y las cuentas creadas en este navegador.')) return false;
    const session = S.session;
    S = seedState();
    S.session = session && S.users.some(u => u.user === session.user) ? session : null;
    if (S.session) go('home'); else showAuth('login');
    flash('Demo reiniciada');
  },

  // Edición genérica de borradores
  toggle(b) {
    const arr = getPath(S.draft, b.dataset.path);
    const v = chipValue(b);
    const i = arr.indexOf(v);
    if (i < 0) arr.push(v); else arr.splice(i, 1);
  },
  pick(b) { setPath(S.draft, b.dataset.path, chipValue(b)); },
  'file-remove'(b) { setPath(S.draft, b.dataset.path, null); },

  // Estudiante
  send() {
    const d = S.draft;
    if (!d.needs.length) return void (S.err = 'Elegí al menos una necesidad.');
    if (!d.ctx.trim()) return void (S.err = 'Contá brevemente tu situación.');
    const st = currentStudent();
    if (!st.avail.bands.length) return void (S.err = 'Configurá tus franjas horarias en Agenda antes de enviar la solicitud.');
    if (!d.consent) return void (S.err = 'Aceptá el uso de tus datos para enviar la solicitud.');
    const r = {
      id: S.nid++, alId: st.id, al: st.nombre, car: d.car, needs: [...d.needs],
      ctx: d.ctx.trim(), disp: `${availabilitySummary(st.avail)} · ${bandsSummary(st.avail).join(' · ')}`,
      bands: [...st.avail.bands], period: d.period, fmt: d.fmt,
      st: 'pend', m: null, slot: null, ex: [], cv: d.attachCv ? fileRef(st.cv) : null,
    };
    autoMatch(r);
    S.reqs.push(r);
    go('home');
    flash(r.st === 'pres' ? `Solicitud enviada. Te presentamos a ${mn(r.m).n}.` : 'Solicitud enviada. Estamos buscando un egresado para vos.');
  },
  done(b) { S.reqs.find(r => r.id === +b.dataset.id).st = 'done'; },
  rate(b) { S.reqs.find(r => r.id === +b.dataset.id).rate = +b.dataset.n; flash('¡Gracias por tu valoración!'); },

  // Egresado
  acc(b) {
    const r = S.reqs.find(x => x.id === +b.dataset.id);
    const v = document.querySelector(`input[name=slot${r.id}]:checked`);
    r.st = 'conf';
    r.slot = v ? v.value : slotsFor(r, mn(r.m))[0];
    mn(r.m).us++;
    flash(`Mentoría confirmada con ${r.al}.`);
  },
  dec(b) {
    const r = S.reqs.find(x => x.id === +b.dataset.id);
    r.ex.push(r.m);
    autoMatch(r);
    flash('Listo, se la presentamos a otro egresado.');
  },
  pausa() {
    const m = currentMentor();
    m.on = m.on ? 0 : 1;
  },

  // Disponibilidad (estudiante y egresado)
  'save-avail'() {
    Object.assign(profileTarget().avail, S.draft);
    go('home');
    flash('Disponibilidad guardada.');
  },
  'bands-preset'(b) {
    const p = b.dataset.preset;
    S.draft.bands = p === 'clear' ? [] : [...new Set([...S.draft.bands, ...DAYS.map((_, i) => `${i}-${p}`)])];
  },

  // Perfil (estudiante y egresado)
  'save-profile'() {
    const d = S.draft;
    if (!(role() === 'egr' ? d.n : d.nombre).trim()) return void (S.err = 'Ingresá tu nombre.');
    if (role() === 'egr') {
      if (!d.t.length) return void (S.err = 'Elegí al menos un tipo de mentoría.');
      const { us, on, avail, ...rest } = d;
      rest.alcance = rest.alcance.filter(c => c !== rest.car);
      Object.assign(currentMentor(), rest);
    } else {
      const st = currentStudent();
      Object.assign(st, d);
      S.reqs.filter(r => r.alId === st.id).forEach(r => { r.al = st.nombre; });
    }
    go('home');
    flash('Perfil actualizado.');
  },
  'li-link'() {
    const url = S.draft.linkedin.url.trim();
    if (!LINKEDIN_RE.test(url)) return void (S.liErr = 'Ingresá una URL válida, por ejemplo https://www.linkedin.com/in/tu-usuario');
    S.liErr = '';
    // Prototipo: se simula la autorización de LinkedIn. La integración real requiere OAuth desde un backend.
    S.draft.linkedin = { url, linked: true };
    profileTarget().linkedin = { url, linked: true };
    flash('LinkedIn vinculado.');
  },
  'li-unlink'() {
    S.draft.linkedin = { url: '', linked: false };
    profileTarget().linkedin = { url: '', linked: false };
  },

  // Soporte
  'support-send'() {
    const d = S.supportDraft;
    if (!d.text.trim()) return void (S.err = 'Escribí tu mensaje.');
    S.err = '';
    const thread = supportThread();
    thread.push({ from: 'me', topic: d.topic, text: d.text.trim(), at: nowTime() });
    replyFromSupport(thread, d.topic);
    d.text = '';
  },

  // Centro de Graduados (desestimado)
  pres(b) {
    const r = S.reqs.find(x => x.id === +b.dataset.id);
    r.st = 'pres';
    r.m = +b.dataset.m;
  },
};
