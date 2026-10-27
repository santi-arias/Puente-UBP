// Configuración de perfil del estudiante y del egresado. Ambos editan una copia en S.draft.

function profileActions() {
  return `${S.err ? `<div class="error" role="alert">${S.err}</div>` : ''}<div class="row mt"><button class="btn" data-a="save-profile">Guardar cambios</button><button class="btn secondary" data-a="go" data-v="home">Cancelar</button></div>`;
}

function studentProfile() {
  const d = S.draft;
  return `<div class="card">
    <div class="profile"><span class="avatar" aria-hidden="true">${initials(d.nombre)}</span><div><h2>${esc(d.nombre)}</h2><p>Estudiante · ${esc(d.car)} · ${esc(d.anio)}</p></div></div>
    <div class="form-section"><h3>Datos personales</h3>
      <div class="form-grid">
        <div><label class="field" for="p-nombre">Nombre y apellido</label><input id="p-nombre" type="text" data-bind="nombre" value="${esc(d.nombre)}"></div>
        <div><label class="field" for="p-email">Email institucional</label><input id="p-email" type="email" value="${esc(d.email)}" readonly></div>
        <div><label class="field" for="p-car">Carrera</label><select id="p-car" data-bind="car">${CAREERS.map(c => `<option ${c === d.car ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div><label class="field" for="p-anio">Año de cursado</label><select id="p-anio" data-bind="anio">${STUDENT_YEARS.map(y => `<option ${y === d.anio ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
      </div>
      <label class="field" for="p-bio">Sobre mí</label><textarea id="p-bio" maxlength="240" data-bind="bio">${esc(d.bio)}</textarea>
      <label class="field">Me interesa trabajar en <span class="muted">(podés elegir varias)</span></label>${chips('intereses', NEEDS, d.intereses)}
    </div>
    <div class="form-section"><h3>Curriculum</h3>${uploadField('cv', 'Tu CV (PDF o imagen)')}</div>
    <div class="form-section"><h3>LinkedIn</h3>${linkedinField()}</div>
    ${profileActions()}
  </div>`;
}

function graduateProfile() {
  const d = S.draft;
  return `<div class="card">
    <div class="profile"><span class="avatar" aria-hidden="true">${initials(d.n)}</span><div><h2>${esc(d.n)}</h2><p>Egresado/a · ${esc(d.car)}</p></div></div>
    <div class="form-section"><h3>Datos profesionales</h3>
      <div class="form-grid">
        <div><label class="field" for="p-n">Nombre y apellido</label><input id="p-n" type="text" data-bind="n" value="${esc(d.n)}"></div>
        <div><label class="field" for="p-car">Carrera de egreso</label><select id="p-car" data-bind="car">${CAREERS.map(c => `<option ${c === d.car ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div><label class="field" for="p-rol">Rol actual</label><input id="p-rol" type="text" data-bind="rol" value="${esc(d.rol)}"></div>
        <div><label class="field" for="p-lug">Ubicación</label><input id="p-lug" type="text" data-bind="lug" value="${esc(d.lug)}"></div>
      </div>
      <label class="field" for="p-bio">Sobre mí</label><textarea id="p-bio" maxlength="240" data-bind="bio">${esc(d.bio)}</textarea>
    </div>
    <div class="form-section"><h3>Mentorías que ofrecés</h3>
      <label class="field">Tipos de mentoría que podés dar</label>${chips('t', NEEDS, d.t)}
      <label class="field">Otras carreras a las que podés llegar <span class="muted">(además de ${esc(d.car)})</span></label>${chips('alcance', CAREERS.filter(c => c !== d.car), d.alcance, { values: CAREERS.filter(c => c !== d.car) })}
      <label class="field">Formatos que aceptás</label>${chips('formatos', FORMATS, d.formatos)}
      <div class="summary-box">Tus tiempos: <strong>${availabilitySummary(d.avail)}</strong>. <a href="#" data-a="go" data-v="availability">Configurar cantidad de sesiones y franjas horarias</a></div>
    </div>
    <div class="form-section"><h3>Curriculum</h3>${uploadField('cv', 'Tu CV o presentación profesional (PDF o imagen)')}</div>
    <div class="form-section"><h3>LinkedIn <span class="muted">(opcional)</span></h3>${linkedinField()}</div>
    ${profileActions()}
  </div>`;
}
