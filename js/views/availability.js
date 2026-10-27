// Menú de disponibilidad (egresado y estudiante): cantidad de sesiones, plazo y franjas horarias preferenciales.

const AVAIL_TEXT = {
  egr: {
    count: '¿Cuántas sesiones podés dar?',
    countHint: 'Nunca te vamos a asignar más sesiones de las que definas acá.',
    summary: d => `Vas a recibir hasta <strong>${availabilitySummary(d)}</strong> (cupo estimado de ${monthlyCapacity({ avail: d })} por mes).`,
    bandsHint: 'Marcá las franjas en las que podés dar sesiones. Las usamos para proponerte horarios concretos.',
  },
  est: {
    count: '¿Cuántas sesiones querés tener?',
    countHint: 'Le contamos al egresado con qué frecuencia te gustaría encontrarte.',
    summary: d => `Buscás hasta <strong>${availabilitySummary(d)}</strong> (unas ${monthlyCapacity({ avail: d })} por mes).`,
    bandsHint: 'Marcá las franjas en las que podés tener sesiones. El egresado elige un horario donde coincidan.',
  },
};

function bandGrid(bands) {
  return `<div class="band-wrap"><table class="band-grid"><thead><tr><td></td>${DAYS.map(x => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>
    ${TIME_BANDS.map(b => `<tr><th scope="row">${b.l}<small>${b.h}</small></th>${DAYS.map((_, i) => {
      const key = `${i}-${b.k}`;
      const on = bands.includes(key);
      return `<td><button class="band-btn" aria-pressed="${on}" aria-label="${DAYS_LONG[i]}, ${b.l}" data-a="toggle" data-path="bands" data-val="${key}">${on ? '✓' : ''}</button></td>`;
    }).join('')}</tr>`).join('')}
  </tbody></table></div>`;
}

function availabilityView() {
  const d = S.draft;
  const r = role();
  const t = AVAIL_TEXT[r];
  const side = r === 'egr'
    ? (m => `<div class="card"><p class="eyebrow">Participación</p><h3>${m.on ? 'Estás recibiendo solicitudes' : 'Tu participación está en pausa'}</h3><p class="muted">Podés pausar cuando lo necesites sin perder tus mentorías confirmadas.</p><button class="btn ghost small" data-a="pausa">${m.on ? 'Pausar participación' : 'Volver a participar'}</button></div>`)(currentMentor())
    : '<div class="card"><p class="eyebrow">Cómo la usamos</p><h3>Se adjunta a cada solicitud</h3><p class="muted">Cuando pedís una mentoría, el egresado ve estas franjas y te propone un horario en el que ambos estén disponibles.</p></div>';
  return `<div class="grid"><section>
    <div class="card"><p class="eyebrow">Cantidad y plazo</p><h2>${t.count}</h2>
      <p class="muted">${t.countHint}</p>
      <label class="field">Cantidad de sesiones</label>${chips('count', SESSION_COUNTS.map(String), d.count, { values: SESSION_COUNTS, multi: false })}
      <label class="field">Plazo</label>${chips('unit', SESSION_UNITS.map(u => u.l), d.unit, { values: SESSION_UNITS.map(u => u.k), multi: false })}
      <div class="summary-box">${t.summary(d)}</div>
    </div>
    <div class="card"><p class="eyebrow">Franjas horarias preferenciales</p><h2>¿En qué horarios preferís?</h2>
      <p class="muted">${t.bandsHint}</p>
      <div class="row mt"><button class="btn ghost small" data-a="bands-preset" data-preset="man">Todas las mañanas</button><button class="btn ghost small" data-a="bands-preset" data-preset="noc">Todas las noches</button><button class="btn ghost small" data-a="bands-preset" data-preset="tar">Todas las tardes</button><button class="btn ghost small" data-a="bands-preset" data-preset="clear">Limpiar</button></div>
      ${bandGrid(d.bands)}
    </div>
    <div class="row"><button class="btn" data-a="save-avail">Guardar disponibilidad</button><button class="btn secondary" data-a="go" data-v="home">Cancelar</button></div>
  </section><aside>
    <div class="card"><p class="eyebrow">Resumen</p><h3>${availabilitySummary(d)}</h3><p class="muted">${bandsSummary(d).join('<br>')}</p></div>
    ${side}
  </aside></div>`;
}
