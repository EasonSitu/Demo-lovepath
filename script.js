const { startDate, tagNotes, journeyStops, password } = window.SITE_DATA;
const timer = document.getElementById('timer');
const journeyBoard = document.getElementById('journeyBoard');
const gate = document.getElementById('gate');
const siteShell = document.getElementById('siteShell');
const gateForm = document.getElementById('gateForm');
const passwordInput = document.getElementById('passwordInput');
const gateError = document.getElementById('gateError');
const musicToggle = document.getElementById('musicToggle');

function exactDiff(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = to - from;
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  return { years, months, days, hours };
}

function renderTimer() {
  const now = new Date();
  const diff = exactDiff(new Date(startDate), now);
  timer.innerHTML = `
    <div class="timer-card"><strong>${diff.years}</strong><span>年</span></div>
    <div class="timer-card"><strong>${diff.months}</strong><span>个月</span></div>
    <div class="timer-card"><strong>${diff.days}</strong><span>天</span></div>
    <div class="timer-card"><strong>${diff.hours}</strong><span>小时</span></div>
  `;
}

function bindReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
}

function bindTags() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const key = tag.dataset.key;
      const note = tagNotes[key] || tag.dataset.note;
      if (note) alert(note);
    });
  });
}

function renderJourney() {
  if (!journeyBoard) return;
  journeyBoard.innerHTML = journeyStops.map((item) => `
    <article class="journey-stop">
      <strong>${item.city}</strong>
      <span>${item.note}</span>
    </article>
  `).join('');
}

function openGate() {
  gate.classList.add('hidden');
  siteShell.classList.remove('is-locked');
  siteShell.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('gate-locked');
  document.body.classList.add('gate-open');
  sessionStorage.setItem('anniversary-site-unlocked', '1');
}

function bindGate() {
  document.body.classList.add('gate-locked');

  if (sessionStorage.getItem('anniversary-site-unlocked') === '1') {
    openGate();
    return;
  }

  gateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = passwordInput.value.trim();
    if (value === password) {
      gateError.textContent = '';
      openGate();
      return;
    }

    gateError.textContent = '密码不对，再试一次。';
    passwordInput.select();
  });
}

function bindMusicPlaceholder() {
  if (!musicToggle) return;
  musicToggle.addEventListener('click', () => {
    alert('音乐开关位置已经留好。后面把音频文件放进 assets/audio/，我就可以继续帮您接成真开关。');
  });
}

renderTimer();
renderJourney();
setInterval(renderTimer, 60000);
bindReveal();
bindTags();
bindGate();
bindMusicPlaceholder();
