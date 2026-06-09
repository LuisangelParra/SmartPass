/* SmartPass Landing Page — JS */

/* === Nav: glass on scroll + mobile toggle === */
const nav    = document.getElementById('nav');
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
});

/* Close mobile nav when a link is clicked */
links?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  });
});


/* === Scroll-reveal via IntersectionObserver === */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));


/* === Scan widget: cycle status text === */
const statusText = document.querySelector('.status-text');
const verified   = document.querySelector('.verified-overlay');

if (statusText) {
  /* After first scan completes (2.9s) switch text */
  setTimeout(() => {
    statusText.textContent = 'IDENTITY VERIFIED';
    if (statusText.parentElement) {
      statusText.parentElement.style.borderColor = 'rgba(0,229,200,0.5)';
    }
  }, 2900);

  /* Loop: revert to scanning after 1.5s of verified, repeat */
  let scanning = false;
  setInterval(() => {
    scanning = !scanning;
    if (scanning) {
      statusText.textContent = 'SCANNING...';
      if (verified) verified.style.opacity = '0';
    } else {
      statusText.textContent = 'IDENTITY VERIFIED';
      if (verified) verified.style.opacity = '1';
    }
  }, 4400);
}


/* === Animate data values (one-time on page load) === */
function animateValue(el, from, to, duration, suffix = '') {
  const start = performance.now();
  const isFloat = String(to).includes('.');
  const decimals = isFloat ? (String(to).split('.')[1]?.length ?? 1) : 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
    const current = from + (to - from) * eased;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const dataCards = document.querySelectorAll('.data-card');
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => animateValue(document.querySelector('[data-metric="dist"]'), 0, 0.34, 1400), 800);
        setTimeout(() => animateValue(document.querySelector('[data-metric="conf"]'), 0, 94.2, 1400, '%'), 800);
        setTimeout(() => animateValue(document.querySelector('[data-metric="lat"]'), 0, 12, 900, 'ms'), 800);
        heroObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

if (dataCards.length) heroObserver.observe(dataCards[0]);
