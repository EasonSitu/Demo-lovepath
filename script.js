const {
  startDate,
  tagNotes,
  journeyStops,
  password,
  heroGallery = [],
  memoryWall = [],
  scrapbookNotes = [],
  guestbookSeed = []
} = window.SITE_DATA;

const timer = document.getElementById('timer');
const journeyBoard = document.getElementById('journeyBoard');
const gate = document.getElementById('gate');
const siteShell = document.getElementById('siteShell');
const gateForm = document.getElementById('gateForm');
const passwordInput = document.getElementById('passwordInput');
const gateError = document.getElementById('gateError');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicStatus = document.getElementById('musicStatus');
const heroGalleryEl = document.getElementById('heroGallery');
const memoryWallEl = document.getElementById('memoryWall');
const scrapbookEl = document.getElementById('scrapbookNotes');
const guestbookList = document.getElementById('guestbookList');
const guestbookForm = document.getElementById('guestbookForm');
const guestbookName = document.getElementById('guestbookName');
const guestbookMessage = document.getElementById('guestbookMessage');

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

function renderHeroGallery() {
  if (!heroGalleryEl) return;
  heroGalleryEl.innerHTML = heroGallery.map((item, index) => `
    <figure class="hero-shot ${index === 0 ? 'is-large' : ''}">
      <img src="${item.src}" alt="${item.alt}" loading="eager" />
      <figcaption>${item.caption}</figcaption>
    </figure>
  `).join('');
}

function renderMemoryWall() {
  if (!memoryWallEl) return;
  memoryWallEl.innerHTML = memoryWall.map((group) => `
    <article class="memory-group reveal visible">
      <div class="memory-group-head">
        <div>
          <h3>${group.title}</h3>
          <p>${group.text}</p>
        </div>
        <span>${group.items.length} 张</span>
      </div>
      <div class="memory-grid">
        ${group.items.map((src, index) => `
          <button class="memory-photo" type="button" data-photo="${src}" data-alt="${group.title} ${index + 1}">
            <img src="${src}" alt="${group.title} ${index + 1}" loading="lazy" />
          </button>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function renderScrapbook() {
  if (!scrapbookEl) return;
  scrapbookEl.innerHTML = scrapbookNotes.map((item) => `<li>${item}</li>`).join('');
}

function getGuestbookStorage() {
  try {
    const raw = localStorage.getItem('anniversary-guestbook');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestbookStorage(items) {
  localStorage.setItem('anniversary-guestbook', JSON.stringify(items));
}

function renderGuestbook() {
  if (!guestbookList) return;
  const items = [...guestbookSeed, ...getGuestbookStorage()];
  guestbookList.innerHTML = items.map((item) => `
    <article class="guestbook-item">
      <strong>${item.author}</strong>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function bindGuestbook() {
  if (!guestbookForm) return;
  guestbookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const author = guestbookName.value.trim() || '匿名来宾';
    const text = guestbookMessage.value.trim();
    if (!text) return;

    const items = getGuestbookStorage();
    items.unshift({ author, text });
    saveGuestbookStorage(items.slice(0, 12));
    guestbookForm.reset();
    renderGuestbook();
  });
}

function bindLightbox() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;

    const src = button.dataset.photo;
    const alt = button.dataset.alt || '照片预览';
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" type="button" aria-label="关闭预览">×</button>
        <img src="${src}" alt="${alt}" />
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('lightbox-open');

    const close = () => {
      overlay.remove();
      document.body.classList.remove('lightbox-open');
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
    });
  });
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

function updateMusicButton(playing) {
  if (!musicToggle) return;
  musicToggle.textContent = playing ? '暂停 Mojito' : '播放 Mojito';
  if (musicStatus) {
    musicStatus.textContent = bgMusic?.src ? (playing ? '正在播放周杰伦《Mojito》' : '《Mojito》已接入，点一下就能播放') : '暂未放入音频文件';
  }
}

function bindMusic() {
  if (!musicToggle) return;
  const hasSource = !!bgMusic?.querySelector('source')?.getAttribute('src');
  updateMusicButton(false);

  musicToggle.addEventListener('click', async () => {
    if (!hasSource || !bgMusic) {
      alert('音乐开关已经接好了，但当前还没有音频文件。后面把音频放进 assets/audio/ 并改一下标签就能直接播。');
      return;
    }

    try {
      if (bgMusic.paused) {
        await bgMusic.play();
        updateMusicButton(true);
      } else {
        bgMusic.pause();
        updateMusicButton(false);
      }
    } catch {
      alert('浏览器拦截了自动播放，手动再点一次一般就可以。');
    }
  });

  bgMusic?.addEventListener('ended', () => updateMusicButton(false));
  bgMusic?.addEventListener('pause', () => updateMusicButton(false));
  bgMusic?.addEventListener('play', () => updateMusicButton(true));
}

renderTimer();
renderJourney();
renderHeroGallery();
renderMemoryWall();
renderScrapbook();
renderGuestbook();
setInterval(renderTimer, 60000);
bindReveal();
bindTags();
bindGate();
bindMusic();
bindGuestbook();
bindLightbox();