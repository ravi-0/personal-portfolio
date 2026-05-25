/* ============================================================
   RAVI PRASATH PORTFOLIO — script.js
   Vanilla JavaScript | Animations | Interactions
   ============================================================ */

'use strict';

/* ─── Preloader ─── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
  }, 1200);
});
document.body.style.overflow = 'hidden';

/* ─── Canvas Background Particles ─── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const COLORS = ['#00f0ff', '#7c3aed', '#ff00ff', '#00ffaa'];
  const particles = [];
  const MAX = 80;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.speed = Math.random() * 0.4 + 0.15;
      this.drift = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.pulse += this.pulseSpeed;
      const glow = Math.sin(this.pulse) * 0.3 + 0.7;
      this.currentOpacity = this.opacity * glow;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.currentOpacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < MAX; i++) particles.push(new Particle());

  // Grid lines
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,240,255,0.025)';
    ctx.lineWidth = 1;
    const step = 80;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ─── Custom Cursor ─── */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const trail = document.getElementById('cursor-trail-container');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    spawnTrail(mx, my);
  });

  function lerpCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  document.querySelectorAll('a, button, .filter-btn, .tilt-card, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });

  let trailCount = 0;
  function spawnTrail(x, y) {
    if (trailCount++ % 3 !== 0) return;
    const td = document.createElement('div');
    td.className = 'trail-dot';
    td.style.left = x + 'px';
    td.style.top = y + 'px';
    td.style.opacity = '0.5';
    trail.appendChild(td);
    setTimeout(() => td.remove(), 600);
  }
})();

/* ─── Mouse Glow ─── */
(function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;
  let gx = 0, gy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  function glowLoop() {
    gx += (tx - gx) * 0.06;
    gy += (ty - gy) * 0.06;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(glowLoop);
  }
  glowLoop();
})();

/* ─── Scroll Progress ─── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  });
})();

/* ─── Navbar ─── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });

    // Back to top
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ─── Theme Toggle ─── */
(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const body = document.body;
  let dark = true;
  btn.addEventListener('click', () => {
    dark = !dark;
    body.classList.toggle('dark-theme', dark);
    body.classList.toggle('light-theme', !dark);
    btn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
})();

/* ─── Typing Animation ─── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const words = ['Full-Stack Developer', 'Python Learner', 'Data Science Enthusiast', 'UI Designer'];
  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 45, PAUSE = 1800;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(type, 800);
})();

/* ─── Scroll Reveal ─── */
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ─── Counter Animation ─── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + (target >= 10 ? '+' : '');
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ─── Skill Bar Animation ─── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar[data-width]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 200);
      obs.unobserve(bar);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

/* ─── Card Tilt Effect ─── */
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── Project Filter ─── */
(function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          card.classList.remove('hidden');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => card.classList.add('hidden'), 400);
        }
      });
    });
  });
})();

/* ─── Smooth Scrolling ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Contact Form ─── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const btnText = btn.querySelector('.btn-text');
    btn.classList.add('sending');
    btnText.textContent = 'Sending...';

    setTimeout(() => {
      btn.classList.remove('sending');
      btn.classList.add('success');
      btnText.textContent = 'Message Sent!';
      btn.querySelector('i').className = 'fas fa-check';
      form.reset();

      setTimeout(() => {
        btn.classList.remove('success');
        btnText.textContent = 'Send Message';
        btn.querySelector('i').className = 'fas fa-paper-plane';
      }, 3000);
    }, 1800);
  });
})();

/* ─── Parallax Effect ─── */
(function initParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.18}px)`;
    }
  });
})();

/* ─── Floating Badges Glow on hover ─── */
document.querySelectorAll('.floating-badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.boxShadow = '0 0 30px rgba(0,240,255,0.6), 0 0 60px rgba(0,240,255,0.2)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.boxShadow = '';
  });
});

/* ─── Footer Quote Rotation ─── */
(function initQuotes() {
  const el = document.getElementById('footer-quote-text');
  if (!el) return;
  const quotes = [
    'Code is poetry. Data is the canvas.',
    'Build. Break. Learn. Repeat.',
    'Turning caffeine into commits since day one.',
    'The best UI is invisible; the best data is insightful.',
    'Dream in pixels, think in data, build in code.'
  ];
  let qi = 0;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      qi = (qi + 1) % quotes.length;
      el.textContent = quotes[qi];
      el.style.transition = 'opacity 0.6s';
      el.style.opacity = '1';
    }, 500);
  }, 4000);
})();

/* ─── Navbar overlay close on outside click ─── */
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('nav-links');
  const burger = document.getElementById('hamburger');
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    }
  }
});

/* ─── Achievement cards entrance animation ─── */
(function initAchievements() {
  const items = document.querySelectorAll('.achievement-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    item.style.transform = i % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)';
    obs.observe(item);
  });
})();

console.log('%c✦ Ravi Prasath Portfolio', 'color:#00f0ff;font-size:18px;font-weight:bold;font-family:monospace;');
console.log('%cBuilt with ♥ using HTML, CSS & Vanilla JS', 'color:#7c3aed;font-size:12px;font-family:monospace;');
