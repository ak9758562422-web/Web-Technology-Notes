// DOM references
const grid = document.getElementById('unitGrid');
const notesView = document.getElementById('notesView');
const mainView = document.querySelector('main');
const mainNav = document.getElementById('mainNav');

// Home page: build one card per unit
function renderCards() {
  grid.innerHTML = units.map(u => `
    <a class="unit-card" href="#unit-${u.id}">
      <div class="unit-number">0${u.id}</div>
      <h3>Unit ${u.id}: ${u.title}</h3>
      <p>${u.short}</p>
      <div class="card-bottom">
        <span>${u.topics.length} topics · ${u.hours} hours</span>
        <span class="open-link">Open notes →</span>
      </div>
    </a>`).join('');
}

function showHome() {
  notesView.classList.add('hidden');
  mainView.classList.remove('hidden');
}

// Notes page for a single unit
function openUnit(id) {
  const unit = units.find(u => u.id === Number(id));
  if (!unit) {
    showHome();
    return;
  }

  mainView.classList.add('hidden');
  notesView.classList.remove('hidden');

  // Sidebar topic list
  document.getElementById('topicNav').innerHTML = unit.topics.map((t, i) => `
    <a class="topic-link" href="#topic-${i}" data-topic="${i}">
      ${String(i + 1).padStart(2, '0')} · ${t.title}
    </a>`).join('');

  // Main article
  const topicsHtml = unit.topics.map((t, i) => `
    <section class="topic-section" id="topic-${i}">
      <h2>${i + 1}. ${t.title}</h2>
      ${t.body}
    </section>`).join('');

  const checklistHtml = unit.topics.map(t => `<li>${t.title}</li>`).join('');

  document.getElementById('unitContent').innerHTML = `
    <span class="unit-kicker">UNIT 0${unit.id} · ${unit.hours} HOURS</span>
    <h1>${unit.title}</h1>
    <p class="unit-intro">${unit.intro}</p>
    <div class="note-box"><b>How to study:</b> Read each topic, understand the diagram, then revise the key terms and examples. Use the topic list to jump directly to a section.</div>
    ${topicsHtml}
    <div class="revision"><strong>Quick revision checklist</strong><ul>${checklistHtml}</ul></div>
    <p class="topic-progress">End of Unit ${unit.id} · ${unit.topics.length} topics covered</p>`;

  // Sidebar: scroll to the topic without touching the URL hash.
  // (Letting the browser follow href="#topic-N" changes the hash,
  // and the router would treat that as "go back home".)
  const topicLinks = document.querySelectorAll('.topic-link');
  topicLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      topicLinks.forEach(x => x.classList.remove('active'));
      link.classList.add('active');
      document.getElementById(`topic-${link.dataset.topic}`)
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  window.scrollTo(0, 0);
}

// Hash-based routing: #unit-N opens a unit, anything else shows home
function route() {
  const match = location.hash.match(/^#unit-(\d+)$/);

  if (match) openUnit(match[1]);
  else showHome();

  document.querySelectorAll('.nav-link').forEach(link => {
    const isCurrent =
      link.getAttribute('href') === location.hash ||
      (!match && link.getAttribute('href') === '#home');
    link.classList.toggle('active', isCurrent);
  });
}

// Mobile menu
document.getElementById('menuToggle').addEventListener('click', () => {
  mainNav.classList.toggle('show');
});
document.querySelectorAll('#mainNav a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('show'));
});

// Dark mode toggle (theme itself is applied early by the script in <head>)
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

// Start
renderCards();
window.addEventListener('hashchange', route);
route();
