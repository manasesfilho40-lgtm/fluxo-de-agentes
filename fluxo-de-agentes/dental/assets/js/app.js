// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    if (!open) {
      nav.style.cssText = `
        position:absolute;top:64px;left:0;right:0;
        background:#141414;flex-direction:column;
        padding:24px;gap:16px;border-bottom:1px solid #262626;
        z-index:99;
      `;
    }
  });
}

// FAQ accordion
document.querySelectorAll('.faq__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Before/after slider
const ba = document.getElementById('ba');
if (ba) {
  const overlay = ba.querySelector('.ba__overlay');
  const handle = ba.querySelector('.ba__handle');
  let dragging = false;

  function setPos(x) {
    const r = ba.getBoundingClientRect();
    let pct = ((x - r.left) / r.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    overlay.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  ba.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
  ba.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('touchend', () => dragging = false);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Header opacity on scroll
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 50
      ? 'rgba(10,10,10,0.95)'
      : 'rgba(10,10,10,0.85)';
  }, { passive: true });
}
