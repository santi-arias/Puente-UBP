// Estructura común de la app logueada: barra superior, riel de navegación y encabezado de cada página.

// [vista, etiqueta del riel, descripción, ícono]
const NAV = {
  est: [
    ['home', 'Inicio', 'Tus mentorías', 'home'],
    ['form', 'Solicitar', 'Nueva mentoría', 'add'],
    ['profile', 'Perfil', 'Datos, CV y LinkedIn', 'person'],
    ['support', 'Ayuda', 'Canal directo con la UBP', 'help'],
  ],
  egr: [
    ['home', 'Inicio', 'Solicitudes y mentorías', 'home'],
    ['availability', 'Agenda', 'Sesiones y horarios', 'calendar'],
    ['profile', 'Perfil', 'Mentorías que ofrecés', 'person'],
    ['support', 'Ayuda', 'Canal directo con la UBP', 'help'],
  ],
  adm: [
    ['home', 'Red', 'Centro de Graduados', 'team'],
    ['support', 'Ayuda', 'Mensajes', 'help'],
  ],
};

const INTROS = {
  'est.home': ['Inicio', 'Tus solicitudes de mentoría y su estado'],
  'est.form': ['Nueva mentoría', 'Contanos qué necesitás y te conectamos con el egresado que mejor coincida'],
  'est.profile': ['Mi perfil', 'Datos personales, CV y LinkedIn'],
  'egr.home': ['Inicio', 'Solicitudes recibidas y mentorías en curso'],
  'egr.profile': ['Mi perfil', 'Qué tipo de mentorías das y a qué carreras llegás'],
  'egr.availability': ['Disponibilidad', 'Cantidad de sesiones y franjas horarias'],
  'adm.home': ['Centro de Graduados', 'Solicitudes, coincidencias y cobertura de la red'],
  support: ['Soporte', 'Centro de Graduados · Te respondemos por este mismo canal'],
};

function accountMenu(name, label) {
  const dark = currentTheme() === 'dark';
  return `<details class="account">
    <summary aria-label="Cuenta de ${esc(name)}"><span class="avatar" aria-hidden="true">${initials(name)}<i class="presence"></i></span></summary>
    <div class="account-menu" role="menu">
      <div class="account-head"><span class="avatar" aria-hidden="true">${initials(name)}<i class="presence"></i></span><div><strong>${esc(name)}</strong><span>${label} · @${esc(currentUser().user)}</span></div></div>
      <button class="menu-item" role="menuitem" data-a="theme">${dark ? ICONS.sun : ICONS.moon}Tema ${dark ? 'claro' : 'oscuro'}</button>
      <button class="menu-item" role="menuitem" data-a="reset">${ICONS.reset}Reiniciar demo</button>
      <button class="menu-item" role="menuitem" data-a="logout">${ICONS.logout}Cerrar sesión</button>
    </div>
  </details>`;
}

function shell(content) {
  const r = role();
  const label = ROLES[r].label;
  const [title, text] = INTROS[`${r}.${S.view}`] || INTROS[S.view] || ['Puente UBP', ''];
  return `<div class="app">
  <header class="topbar">${brand()}
    <div class="topbar-title"><span class="brand-name">Puente UBP</span><span class="tag">${label}</span></div>
    <div class="header-actions">${accountMenu(displayName(), label)}</div>
  </header>
  <aside class="rail">
    <nav aria-label="Secciones">${NAV[r].map(([k, l, d, ico]) => `<button class="rail-item" data-a="go" data-v="${k}" title="${d}" ${S.view === k ? 'aria-current="page"' : ''}>${ICONS[ico]}<span>${l}</span></button>`).join('')}</nav>
  </aside>
  <main class="surface">
    <section class="page-head"><div><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div></section>
    <div class="page-body">${content}</div>
  </main></div>`;
}
