// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close mobile nav when a link is clicked
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Appointment form (front-end only — shows confirmation)
const form = document.getElementById('apptForm');
const note = document.getElementById('formNote');

if (form) {
  // Prevent picking a past date
  const dateInput = document.getElementById('date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = 'Please fill in all required fields.';
      note.className = 'form__note err';
      form.reportValidity();
      return;
    }
    const name = document.getElementById('name').value.trim();
    note.textContent = `Thank you, ${name}! We'll call you shortly to confirm your appointment.`;
    note.className = 'form__note ok';
    form.reset();
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  });
}

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
