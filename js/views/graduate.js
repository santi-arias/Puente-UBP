// Vistas del egresado: panel con solicitudes recibidas y mentorías confirmadas.

function incomingCard(r, m) {
  const slots = nextSlots(m);
  const pick = slots.length
    ? `<p class="muted">Elegí un horario dentro de tus franjas preferenciales para aceptar:</p>${slots.map((s, i) => `<label class="slot"><input type="radio" name="slot${r.id}" value="${s}" ${i === 0 ? 'checked' : ''}>${s}</label>`).join('')}`
    : `<p class="muted">No tenés franjas horarias cargadas. <a href="#" data-a="go" data-v="availability">Configurá tu disponibilidad</a> para proponer horarios.</p>`;
  return requestCard(r, `${pick}<div class="row mt">${slots.length ? `<button class="btn" data-a="acc" data-id="${r.id}">Aceptar y confirmar</button>` : ''}<button class="btn secondary" data-a="dec" data-id="${r.id}">Ahora no puedo</button></div>`);
}

function graduateHome() {
  const m = currentMentor();
  const incoming = S.reqs.filter(r => r.st === 'pres' && r.m === m.id);
  const mine = S.reqs.filter(r => (r.st === 'conf' || r.st === 'done') && r.m === m.id);
  const cap = monthlyCapacity(m);
  return `<div class="grid"><section>
    <div class="card"><div class="profile"><span class="avatar" aria-hidden="true">${initials(m.n)}</span><div><h2>Hola, ${esc(firstName(m.n))}</h2><p>${esc(m.rol)} · ${esc(m.car)} · ${esc(m.lug)}</p></div></div>
      <div class="needs">${m.t.map(i => `<span class="tag">${NEEDS[i]}</span>`).join('')}</div>
      <div class="row mt"><span class="tag ${m.on ? 'green' : 'amber'}">${m.on ? 'Disponible para mentorías' : 'En pausa'}</span><button class="btn secondary small" data-a="go" data-v="profile">Editar mi perfil</button><button class="btn ghost small" data-a="pausa">${m.on ? 'Pausar participación' : 'Volver a participar'}</button></div></div>
    <h2 class="section-title">Solicitudes para vos</h2>
    ${incoming.length ? incoming.map(r => incomingCard(r, m)).join('') : '<div class="card muted">No tenés solicitudes pendientes. Cuando te presentemos una, va a aparecer acá.</div>'}
    ${mine.length ? `<h2 class="section-title">Tus mentorías</h2>${mine.map(r => `<div class="card"><div class="row between"><b>${esc(needsText(r))}</b><span class="tag green">${r.st === 'done' ? 'Realizada' : esc(r.slot)}</span></div><p class="muted">${esc(r.al)} · ${esc(r.car)} · ${PERIODS[r.period - 1]}</p>${r.cv ? `<p class="muted">${fileLink(r.cv)}</p>` : ''}</div>`).join('')}` : ''}
  </section><aside>
    <div class="card"><p class="eyebrow">Tu disponibilidad</p><h3>${availabilitySummary(m.avail)}</h3>
      <p class="muted">${bandsSummary(m.avail).join('<br>')}</p>
      <div class="bar" aria-label="Uso del cupo mensual"><i style="width:${Math.min(100, Math.round(m.us / cap * 100))}%"></i></div>
      <p class="muted">Usaste ${m.us} de ${cap} sesiones este mes.</p>
      <button class="btn secondary small" data-a="go" data-v="availability">Editar disponibilidad</button></div>
    <div class="card"><p class="eyebrow">Alcance</p><h3>Carreras a las que llegás</h3><div class="needs"><span class="tag">${esc(m.car)}</span>${m.alcance.map(c => `<span class="tag">${esc(c)}</span>`).join('')}</div></div>
  </aside></div>`;
}
