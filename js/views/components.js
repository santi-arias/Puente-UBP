// Piezas de interfaz reutilizadas por varias vistas.

const ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  mail: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  chat: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg>',
  clock: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  // Navegación del riel
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/></svg>',
  add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3"/><path d="M12 8v8M8 12h8"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.6-3.6 3.6-6 7.5-6s6.9 2.4 7.5 6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><rect x="3.75" y="5" width="16.5" height="15" rx="2.5"/><path d="M3.75 9.5h16.5M8 3v3.5M16 3v3.5M8 13.5h2M14 13.5h2M8 16.5h2"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v10a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17h0A1.5 1.5 0 0 1 4 15.5z"/><path d="M8 9h8M8 12.5h5" stroke-linecap="round"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="8.5" r="3.25"/><circle cx="17" cy="9.5" r="2.25"/><path d="M3 19c.4-3 2.9-5 6-5s5.6 2 6 5M15.5 14.2c.5-.1 1-.2 1.5-.2 2.3 0 4 1.5 4.3 3.8"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/></svg>',
};

const LOGO = 'assets/img/Logo%20Puente%20UBP.svg';

const STATUS = {
  pend: { l: 'Buscando egresado', cls: 'amber' },
  pres: { l: 'Presentada', cls: '' },
  conf: { l: 'Confirmada', cls: 'green' },
  done: { l: 'Realizada', cls: 'green' },
};

function brand() {
  return `<div class="brand"><img src="${LOGO}" alt="Puente UBP"><span class="brand-name">Puente UBP</span></div>`;
}

// Grupo de chips ligado a S.draft[path]. Por defecto el valor de cada chip es su índice.
function chips(path, labels, selected, { values = labels.map((_, i) => i), multi = true } = {}) {
  return `<div class="chips" role="group">${labels.map((label, i) => {
    const val = values[i];
    const on = multi ? selected.includes(val) : selected === val;
    return `<button type="button" class="chip" aria-pressed="${on}" data-a="${multi ? 'toggle' : 'pick'}" data-path="${path}" data-val="${esc(val)}"${typeof val === 'number' ? ' data-num' : ''}>${esc(label)}</button>`;
  }).join('')}</div>`;
}

function stepsBar(r) {
  const i = { pend: 0, pres: 2, conf: 3, done: 4 }[r.st];
  return `<div class="steps">${[0, 1, 2, 3, 4].map(x => `<i class="${x <= i ? 'done' : ''}"></i>`).join('')}</div><div class="steps-label"><span>Enviada</span><span>Revisada</span><span>Asignada</span><span>Confirmada</span><span>Realizada</span></div>`;
}

function fileLink(ref, label = 'Ver CV') {
  const url = fileUrl(resolveFile(ref));
  return url
    ? `<a href="${url}" target="_blank" rel="noopener">${label}: ${esc(ref.name)}</a>`
    : `<span>${esc(ref.name)}</span>`;
}

function requestCard(r, extra = '') {
  return `<div class="card request"><div class="row between"><h3>${esc(needsText(r))}</h3><span class="tag">${esc(r.car)}</span></div>
  <div class="kv"><span>Estudiante</span><span>${esc(r.al)}</span><span>Situación</span><span>${esc(r.ctx)}</span><span>Disponibilidad</span><span>${esc(r.disp)}</span><span>Período</span><span>${PERIODS[r.period - 1]}</span><span>Formato</span><span>${FORMATS[r.fmt || 0]}</span>${r.cv ? `<span>CV adjunto</span><span>${fileLink(r.cv)}</span>` : ''}</div>${extra}</div>`;
}

function uploadField(path, label, hint = `PDF o imagen (PNG, JPG, WEBP) · máximo ${FILE_RULES.maxMB} MB`) {
  const meta = getPath(S.draft, path);
  const err = S.fileErr && S.fileErr.path === path ? S.fileErr.msg : '';
  const url = fileUrl(meta);
  const preview = meta && meta.type.startsWith('image/') && url
    ? `<img src="${url}" alt="Vista previa de ${esc(meta.name)}">`
    : `<span class="file-icon" aria-hidden="true">${meta && meta.type.startsWith('image/') ? 'IMG' : 'PDF'}</span>`;
  return `<div class="upload ${meta ? 'has-file' : ''}"><b>${label}</b><div class="hint">${hint}</div>
  ${meta ? `<div class="file-card">${preview}<div class="file-meta"><b>${esc(meta.name)}</b><span>${fmtSize(meta.size)} · subido el ${esc(meta.at)}</span></div><div class="row">${url ? `<a class="btn ghost small" href="${url}" target="_blank" rel="noopener">Ver</a>` : ''}<button class="btn ghost small" data-a="file-remove" data-path="${path}">Quitar</button></div></div>` : ''}
  <label class="file-drop"><input type="file" data-upload="${path}" accept="${FILE_RULES.accept}" aria-label="${label}"><span>${meta ? 'Reemplazar archivo' : 'Elegir archivo'}</span></label>
  ${err ? `<div class="error" role="alert">${err}</div>` : ''}</div>`;
}

function linkedinField() {
  const li = S.draft.linkedin;
  if (li.linked) {
    return `<div class="li-card"><span class="li-badge" aria-hidden="true">in</span><div><b>Perfil de LinkedIn vinculado</b><a href="${esc(li.url)}" target="_blank" rel="noopener">${esc(li.url.replace(/^https?:\/\/(www\.)?/, ''))}</a></div><button class="btn ghost small" data-a="li-unlink">Desvincular</button></div>`;
  }
  return `<label class="field" for="li-url">URL de tu perfil</label>
  <div class="input-group"><input id="li-url" type="url" placeholder="https://www.linkedin.com/in/tu-usuario" data-bind="linkedin.url" value="${esc(li.url)}"><button class="btn li-btn" data-a="li-link"><span aria-hidden="true">in</span> Vincular con LinkedIn</button></div>
  ${S.liErr ? `<div class="error" role="alert">${S.liErr}</div>` : ''}
  <p class="hint">Los egresados podrán ver tu perfil profesional cuando acepten tu solicitud.</p>`;
}
