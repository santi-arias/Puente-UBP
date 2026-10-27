// Canal directo de comunicación con el Centro de Graduados (soporte).

const FAQ = [
  ['¿Cuánto tarda en asignarse una mentoría?', 'Buscamos coincidencias automáticamente al enviar la solicitud. El egresado suele confirmar en 48 h.'],
  ['¿Quién puede ver mi CV?', 'Solo el egresado asignado, y únicamente si elegiste adjuntarlo a la solicitud.'],
  ['¿Puedo cambiar mis horarios?', 'Sí. Los egresados los modifican desde Disponibilidad; los estudiantes, al crear cada solicitud.'],
];

function supportView() {
  const thread = supportThread();
  const d = S.supportDraft;
  const ubp = '<span class="avatar org" aria-hidden="true">UBP</span>';
  return `<div class="grid"><section>
    <div class="card chat-card">
      <div class="chat-head profile"><span class="avatar org" aria-hidden="true">UBP<i class="presence"></i></span><div><h2>${SUPPORT.team}</h2><p>Disponible · ${SUPPORT.sla}</p></div></div>
      <div class="chat" id="chat" aria-live="polite">${thread.map(msg => {
        const me = msg.from === 'me';
        return `<div class="msg-row ${me ? 'me' : ''}">${me ? '' : ubp}<div class="msg"><small>${me ? '' : `${SUPPORT.team} · `}${msg.at}</small>${msg.topic != null ? `<b>${SUPPORT.topics[msg.topic]}</b><br>` : ''}${esc(msg.text)}</div></div>`;
      }).join('')}
        ${S.supportTyping ? `<div class="msg-row">${ubp}<div class="msg typing">Escribiendo…</div></div>` : ''}</div>
      <div class="composer">
        <label class="field" for="s-topic" style="margin-top:0">Motivo</label>
        <select id="s-topic" data-bind-support="topic" data-num>${SUPPORT.topics.map((t, i) => `<option value="${i}" ${i === d.topic ? 'selected' : ''}>${t}</option>`).join('')}</select>
        <label class="field" for="s-text">Mensaje</label>
        <textarea id="s-text" maxlength="600" data-bind-support="text" placeholder="Escribí un mensaje">${esc(d.text)}</textarea>
        ${S.err ? `<div class="error" role="alert">${S.err}</div>` : ''}
        <div class="composer-actions"><button class="btn" data-a="support-send">Enviar</button></div>
      </div></div>
  </section><aside>
    <div class="card"><p class="eyebrow">Otros canales</p>
      <div class="channel"><span class="ico">${ICONS.mail}</span><div><b>Email</b><br><a href="mailto:${SUPPORT.email}">${SUPPORT.email}</a></div></div>
      <div class="channel"><span class="ico">${ICONS.chat}</span><div><b>WhatsApp</b><br>${SUPPORT.whatsapp}</div></div>
      <div class="channel"><span class="ico">${ICONS.clock}</span><div><b>Horario de atención</b><br>${SUPPORT.hours}</div></div>
    </div>
    <div class="card faq"><p class="eyebrow">Preguntas frecuentes</p>${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </aside></div>`;
}
