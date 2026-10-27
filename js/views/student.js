// Vistas del estudiante: panel de inicio y formulario de nueva mentoría.

function studentHome() {
  const p = currentStudent();
  const mine = S.reqs.filter(r => r.alId === p.id);
  const active = mine.filter(r => r.st !== 'done').length;
  const list = mine.length ? mine.slice().reverse().map(r => {
    const st = STATUS[r.st];
    const m = r.m && mn(r.m);
    const msg = r.st === 'conf' ? `Confirmada con ${esc(m.n)} · ${esc(r.slot)}`
      : r.st === 'pres' ? `Te presentamos a ${esc(m.n)} (${esc(m.rol)}). Esperamos su confirmación.`
      : r.st === 'done' ? `Realizada con ${esc(m.n)}.`
      : 'Estamos buscando la mejor coincidencia para vos.';
    return `<div class="card request"><div class="row between"><h3>${esc(needsText(r))}</h3><span class="tag ${st.cls}">${st.l}</span></div>
      <div class="needs"><span class="tag">${esc(r.car)}</span><span class="tag">${PERIODS[r.period - 1]}</span><span class="tag">${FORMATS[r.fmt || 0]}</span></div>
      <p class="muted">${msg}</p>${stepsBar(r)}
      ${r.st === 'conf' ? `<button class="btn secondary small mt" data-a="done" data-id="${r.id}">Marcar como realizada</button>` : ''}
      ${r.st === 'done' && !r.rate ? `<div class="mt"><span class="muted">¿Cómo fue la sesión?</span><div class="row" style="margin-top:4px">${[1, 2, 3, 4, 5].map(n => `<button class="btn ghost small" data-a="rate" data-id="${r.id}" data-n="${n}">${n} ★</button>`).join('')}</div></div>` : ''}
      ${r.rate ? `<p class="muted">Tu valoración: ${'★'.repeat(r.rate)}</p>` : ''}</div>`;
  }).join('') : '<div class="card muted">Todavía no pediste una mentoría.</div>';

  const missing = [!p.cv && 'subir tu CV', !p.linkedin.linked && 'vincular LinkedIn'].filter(Boolean);
  return `<div class="grid"><section>
    <div class="card"><div class="row between"><div><h2>Hola, ${esc(firstName(p.nombre))}</h2><p class="muted" style="margin:0">Conectá con egresados de la UBP que ya recorrieron el camino que estás empezando.</p></div>
      <button class="btn" data-a="go" data-v="form">Nueva mentoría</button></div>
      <div class="quick"><div><b>${active}</b><span>Mentorías activas</span></div><div><b>120+</b><span>Egresados en la red</span></div><div><b>4,8</b><span>Valoración promedio</span></div></div></div>
    <h2 class="section-title">Mis mentorías</h2>${list}
  </section><aside>
    ${missing.length ? `<div class="card"><p class="eyebrow">Completá tu perfil</p><h3>Te falta ${missing.join(' y ')}</h3><p class="muted">Un perfil completo ayuda al egresado a preparar mejor la sesión.</p><button class="btn secondary small" data-a="go" data-v="profile">Ir a mi perfil</button></div>` : ''}
    <div class="card"><p class="eyebrow">Antes de empezar</p><h3>Una buena mentoría empieza con foco</h3><p class="muted">Podés elegir varias necesidades a la vez y definir cuánto tiempo querés acompañamiento.</p><hr class="divider"><span class="tag green">Datos protegidos</span><p class="muted">Tu contacto se comparte solo cuando ambas partes aceptan.</p></div>
  </aside></div>`;
}

function requestForm() {
  const f = S.draft;
  const cv = currentStudent().cv;
  return `<div class="card">
    <label class="field" for="car">Carrera</label>
    <select id="car" data-bind="car">${CAREERS.map(c => `<option ${c === f.car ? 'selected' : ''}>${c}</option>`).join('')}</select>
    <label class="field">Necesidad <span class="muted">(podés elegir más de una)</span></label>
    ${chips('needs', NEEDS, f.needs)}
    <label class="field" for="ctx">Contexto</label>
    <textarea id="ctx" maxlength="400" data-bind="ctx" placeholder="Ej.: estoy buscando mi primera práctica y quiero revisar mi portfolio.">${esc(f.ctx)}</textarea>
    <label class="field" for="disp">Tu disponibilidad</label>
    <input id="disp" type="text" data-bind="disp" value="${esc(f.disp)}" placeholder="Ej.: martes y jueves por la tarde">
    <label class="field">Período de acompañamiento</label>
    ${chips('period', PERIODS, f.period, { values: PERIODS.map((_, i) => i + 1), multi: false })}
    <p class="hint">La primera sesión se coordina dentro de los próximos 10 días hábiles.</p>
    <label class="field">Formato</label>
    ${chips('fmt', FORMATS, f.fmt, { multi: false })}
    <label class="field">CV</label>
    ${cv
      ? `<label class="check" style="margin-top:0"><input type="checkbox" data-bind="attachCv" ${f.attachCv ? 'checked' : ''}><span>Adjuntar el CV de mi perfil (${esc(cv.name)})</span></label>`
      : `<p class="muted" style="margin:0">Todavía no subiste tu CV. <a href="#" data-a="go" data-v="profile">Subilo desde tu perfil</a> para compartirlo con el egresado.</p>`}
    <label class="check"><input type="checkbox" data-bind="consent" ${f.consent ? 'checked' : ''}><span>Acepto que la UBP use mis datos para conectarme con un egresado. Mi contacto se comparte solo si ambos aceptamos.</span></label>
    ${S.err ? `<div class="error" role="alert">${S.err}</div>` : ''}
    <div class="row mt"><button class="btn" data-a="send">Enviar solicitud</button><button class="btn secondary" data-a="go" data-v="home">Cancelar</button></div>
  </div>`;
}
