// Asignación de egresados a solicitudes y generación de horarios.

function monthlyCapacity(m) {
  const unit = SESSION_UNITS.find(u => u.k === m.avail.unit) || SESSION_UNITS[2];
  return m.avail.count * unit.perMonth;
}

function score(r, m) {
  let s = 0;
  if (r.car === m.car) s += 3;
  else if (m.alcance.includes(r.car)) s += 2;
  else if (AFFINITY[r.car] && AFFINITY[r.car] === AFFINITY[m.car]) s += 1;
  if (sharedBands(r, m).length) s += 1;
  return s + r.needs.filter(n => m.t.includes(n)).length;
}

// Franjas en las que coinciden el estudiante (al pedir la mentoría) y el egresado.
const sharedBands = (r, m) => (r.bands || []).filter(b => m.avail.bands.includes(b));

// Horarios a proponer: primero los que coinciden con el estudiante; si no hay, los del egresado.
function slotsFor(r, m) {
  const shared = sharedBands(r, m);
  return shared.length ? nextSlots({ avail: { bands: shared } }) : nextSlots(m);
}

function candidates(r) {
  return S.mentors
    .filter(m => m.on && m.us < monthlyCapacity(m) && !r.ex.includes(m.id))
    .map(m => ({ m, s: score(r, m) }))
    .sort((a, b) => b.s - a.s);
}

// Con el Centro de Graduados desestimado, las solicitudes se presentan automáticamente a la mejor coincidencia.
function autoMatch(r) {
  const best = candidates(r)[0];
  if (best && best.s > 0) { r.st = 'pres'; r.m = best.m.id; }
  else { r.st = 'pend'; r.m = null; }
}

// Próximos horarios concretos según las franjas preferenciales del egresado.
function nextSlots(m, limit = 4) {
  const out = [];
  const d = new Date();
  for (let i = 1; i <= 14 && out.length < limit; i++) {
    d.setDate(d.getDate() + 1);
    const day = (d.getDay() + 6) % 7;
    if (day > 5) continue; // domingo
    TIME_BANDS.forEach(b => {
      if (out.length < limit && m.avail.bands.includes(`${day}-${b.k}`)) {
        out.push(`${DAYS[day]} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} · ${b.start}`);
      }
    });
  }
  return out;
}

function availabilitySummary(avail) {
  const unit = SESSION_UNITS.find(u => u.k === avail.unit);
  return `${avail.count} ${avail.count === 1 ? 'sesión' : 'sesiones'} ${unit ? unit.l : ''}`;
}

function bandsSummary(avail) {
  const byDay = DAYS_LONG.map((name, d) => {
    const bands = TIME_BANDS.filter(b => avail.bands.includes(`${d}-${b.k}`)).map(b => b.l.toLowerCase());
    return bands.length ? `${name}: ${bands.join(', ')}` : '';
  }).filter(Boolean);
  return byDay.length ? byDay : ['Sin franjas cargadas'];
}
