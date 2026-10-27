// Modo claro / oscuro. Se carga en el <head> para aplicar el tema antes del primer pintado.

const THEME_KEY = 'puente-ubp:theme';

function storedTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch (e) { /* almacenamiento no disponible */ }
  return null;
}

function currentTheme() {
  return document.documentElement.dataset.theme;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* sin persistencia */ }
  applyTheme(next);
}

applyTheme(storedTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// Si el usuario no eligió un tema, seguimos el del sistema operativo.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
});
