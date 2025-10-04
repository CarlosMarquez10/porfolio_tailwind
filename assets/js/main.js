// Año
document.getElementById('year').textContent = new Date().getFullYear();

// Tema
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const THEME_KEY = 'theme-preference';
const setTheme = t => {
  if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  localStorage.setItem(THEME_KEY, t);
}
const initTheme = () => {
  const pref = localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(pref);
}
initTheme();
toggle.addEventListener('click', () => {
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});

// Reveal on scroll (IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Modales
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => document.getElementById(btn.dataset.open)?.showModal());
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('dialog')?.close());
});

// Formulario (demo)
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.textContent = 'Enviando…';
  const data = Object.fromEntries(new FormData(form).entries());
  if ((data.message||'').length < 30) { formMsg.textContent = 'El mensaje debe tener al menos 30 caracteres.'; return; }
  try {
    // Cambia esta URL por tu API de contacto o Formspree
    const res = await fetch('https://httpbin.org/post', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Network error');
    form.reset();
    formMsg.textContent = '¡Gracias! Te responderé en menos de 24 horas.';
  } catch (err) {
    formMsg.textContent = 'Ocurrió un error al enviar. Por favor, intenta de nuevo.';
  }
});