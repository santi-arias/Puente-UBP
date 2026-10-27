// Centro de Graduados (estadísticas y asignación manual).
// Desestimado temporalmente: solo es accesible con FEATURES.centroGraduados = true.

function adminView() {
  const R = S.reqs;
  const active = S.mentors.filter(m => m.on).length;
  const answered = R.length ? Math.round(R.filter(r => r.st !== 'pend').length / R.length * 100) : 0;
  const open = R.filter(r => r.st === 'pend' || r.st === 'pres').map(r => {
    if (r.st === 'pres') return requestCard(r, `<span class="tag amber">Presentada a ${esc(mn(r.m).n)}, esperando respuesta</span>`);
    const top = candidates(r).slice(0, 3);
    return requestCard(r, `<p class="muted">Sugerencias de coincidencia:</p>${top.map(({ m }) => `<div class="row between" style="border-top:1px solid var(--line);padding:10px 0"><span><b>${esc(m.n)}</b><br><small class="muted">${esc(m.rol)} · ${esc(m.car)}</small></span><button class="btn small" data-a="pres" data-id="${r.id}" data-m="${m.id}">Presentar</button></div>`).join('')}`);
  }).join('');
  return `<div class="metric"><div><b>${R.length}</b><span>Pedidos</span></div><div><b>${answered}%</b><span>Con respuesta</span></div><div><b>${active}</b><span>Mentores activos</span></div><div><b>4,8</b><span>Satisfacción</span></div></div>
  <h2 class="section-title">Pedidos a resolver</h2>${open || '<div class="card muted">No hay pedidos pendientes.</div>'}
  <h2 class="section-title">Cobertura por carrera</h2><div class="card">${CAREERS.map(c => {
    const n = S.mentors.filter(m => m.car === c && m.on).length;
    return `<div class="row" style="margin:9px 0"><span style="width:190px;font-size:13px">${c}</span><div class="bar"><i style="width:${Math.min(100, n * 50)}%"></i></div><span class="tag ${n ? 'green' : 'amber'}">${n || 'Sin'} mentor${n === 1 ? '' : 'es'}</span></div>`;
  }).join('')}</div>`;
}
