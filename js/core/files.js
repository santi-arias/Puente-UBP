// Carga de archivos (CV en PDF o imagen): validación, vista previa y persistencia local.

const FILE_URLS = {};

function handleFile(input) {
  const path = input.dataset.upload;
  const f = input.files[0];
  if (!f) return;
  if (!FILE_RULES.types.includes(f.type)) {
    S.fileErr = { path, msg: 'Formato no válido. Subí un PDF o una imagen (PNG, JPG o WEBP).' };
    return render();
  }
  if (f.size > FILE_RULES.maxMB * 1024 * 1024) {
    S.fileErr = { path, msg: `El archivo supera los ${FILE_RULES.maxMB} MB.` };
    return render();
  }
  const meta = { id: `f${Date.now()}`, name: f.name, size: f.size, type: f.type, at: today() };
  FILE_URLS[meta.id] = URL.createObjectURL(f);
  const done = () => { setPath(S.draft, path, meta); S.fileErr = null; render(); };
  if (f.size <= FILE_RULES.persistMaxBytes) {
    const reader = new FileReader();
    reader.onload = () => { meta.data = reader.result; done(); };
    reader.onerror = done;
    reader.readAsDataURL(f);
  } else {
    done();
  }
}

// Devuelve una URL para ver el archivo; tras recargar, solo existe si se guardó su contenido.
function fileUrl(meta) {
  if (!meta) return '';
  if (FILE_URLS[meta.id]) return FILE_URLS[meta.id];
  if (!meta.data) return '';
  try {
    const bin = atob(meta.data.split(',')[1]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return (FILE_URLS[meta.id] = URL.createObjectURL(new Blob([bytes], { type: meta.type })));
  } catch (e) {
    return '';
  }
}

// Referencia liviana para adjuntar el CV a una solicitud sin duplicar su contenido.
const fileRef = meta => meta && { id: meta.id, name: meta.name, size: meta.size, type: meta.type, at: meta.at };
const resolveFile = ref => (ref && S.students.map(s => s.cv).find(cv => cv && cv.id === ref.id)) || ref;
