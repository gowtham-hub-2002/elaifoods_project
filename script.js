// ============================================================
//  NAVBAR — scroll shadow
// ============================================================
window.addEventListener('scroll', () => {
  document.getElementById('mainNavbar')
    .classList.toggle('scrolled', window.scrollY > 20);
});

// ============================================================
//  GOLD CURSOR GLOW TRAIL
// ============================================================
(function initCursorGlow() {
  const glow = document.getElementById('efCursorGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }
  let mx = -200, my = -200, cx = -200, cy = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function raf() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(raf);
  })();
})();

// ============================================================
//  HERO VIDEO SLIDESHOW
//  - Auto-advances every AUTO_DELAY ms
//  - Also advances when video naturally ends (whichever comes first)
//  - Dot indicators are clickable
//  - Gold progress bar shows countdown
// ============================================================
(function initVideoSlideshow() {
  const videos = Array.from(document.querySelectorAll('.ef-hero-vid'));
  const dots   = Array.from(document.querySelectorAll('.ef-dot'));
  if (!videos.length) return;

  const AUTO_DELAY = 5000; // 5 seconds per slide
  let current = 0;
  let autoTimer = null;
  let progressBar = null;

  // Create a progress bar element inside the hero
  function createProgressBar() {
    progressBar = document.createElement('div');
    progressBar.className = 'ef-hero-progress';
    const hero = document.getElementById('heroSection');
    if (hero) hero.appendChild(progressBar);
  }

  function startProgress() {
    if (!progressBar) return;
    // Reset
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // Trigger reflow then animate
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${AUTO_DELAY}ms linear`;
    progressBar.style.width = '100%';
  }

  function goTo(idx) {
    // Clear existing timer
    if (autoTimer) clearTimeout(autoTimer);

    // Deactivate current
    videos[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    videos[current].pause();

    // Activate new
    current = (idx + videos.length) % videos.length;
    const vid = videos[current];
    vid.currentTime = 0;
    vid.classList.add('active');
    if (dots[current]) dots[current].classList.add('active');

    // Play (autoplay may be blocked — video still shows as poster)
    const p = vid.play();
    if (p !== undefined) p.catch(() => {});

    // Start progress bar
    startProgress();

    // Schedule auto-advance after AUTO_DELAY
    autoTimer = setTimeout(() => {
      goTo(current + 1);
    }, AUTO_DELAY);
  }

  // If video ends before the timer, advance immediately
  videos.forEach((vid, i) => {
    vid.addEventListener('ended', () => {
      if (i === current) goTo(current + 1);
    });
  });

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.idx, 10));
    });
  });

  // Boot
  createProgressBar();
  goTo(0);
})();

// ============================================================
//  MENU TABS
// ============================================================
document.querySelectorAll('.ef-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ef-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ef-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ============================================================
//  WHATSAPP ORDER
// ============================================================
function sendWhatsApp() {
  const name    = document.getElementById('name')?.value.trim();
  const meal    = document.getElementById('meal')?.value;
  const address = document.getElementById('address')?.value.trim();

  if (!name || !meal || !address) {
    alert('Please fill in all fields before ordering!');
    return;
  }

  const phone   = '919876543210';
  const message = `Hello Elai Foods!\n\n*New Order*\nName: ${name}\nMeal: ${meal}\nAddress: ${address}\n\nPlease confirm my order. Thank you!`;
  const url     = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ============================================================
//  SCROLL ANIMATIONS (IntersectionObserver) — enhanced
// ============================================================
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  // Standard fade-up
  document.querySelectorAll('.ef-card, .ef-review-card, .ef-step, .ef-dinfo').forEach((el, i) => {
    el.classList.add('ef-animate');
    el.style.transitionDelay = (i % 3) * 110 + 'ms';
    observer.observe(el);
  });

  // Stagger — section headers
  document.querySelectorAll('.ef-section-header').forEach(el => {
    el.classList.add('ef-animate');
    observer.observe(el);
  });

  // Social cards — fade from right
  document.querySelectorAll('.ef-scard').forEach((el, i) => {
    el.classList.add('ef-animate');
    el.style.transitionDelay = i * 80 + 'ms';
    observer.observe(el);
  });

  // App section elements
  document.querySelectorAll('.ef-qr-card, .ef-store-btn').forEach((el, i) => {
    el.classList.add('ef-animate-scale');
    el.style.transitionDelay = i * 120 + 'ms';
    observer.observe(el);
  });

  // Contact strip
  document.querySelectorAll('.ef-strip-item').forEach((el, i) => {
    el.classList.add('ef-animate');
    el.style.transitionDelay = i * 100 + 'ms';
    observer.observe(el);
  });
})();

// ============================================================
//  WHY ELAI — Scroll Reveal + Animated Counters
// ============================================================
(function initWhyElai() {

  // ── Scroll Reveal ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('ef-visible');
      }, delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));

  // ── Animated Counters ─────────────────────────────────────
  const counters = document.querySelectorAll('.ef-why2-stat-num[data-count]');
  let countersStarted = false;

  const counterObs = new IntersectionObserver((entries) => {
    if (countersStarted) return;
    if (!entries.some(e => e.isIntersecting)) return;
    countersStarted = true;

    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const steps = 50;
      const step = target / steps;
      let current = 0;
      const interval = duration / steps;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, interval);
    });
    counterObs.disconnect();
  }, { threshold: 0.3 });

  const statsEl = document.querySelector('.ef-why2-stats');
  if (statsEl) counterObs.observe(statsEl);

  // ── Subtle parallax on leaf layers on mouse move ──────────
  const leafL = document.querySelector('.ef-why2-leaf-left');
  const leafR = document.querySelector('.ef-why2-leaf-right');
  const section = document.querySelector('.ef-why2-section');
  if (leafL && leafR && section) {
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
      leafL.style.transform = `translate(${xPct * 18}px, ${yPct * 10}px)`;
      leafR.style.transform = `scaleX(-1) translate(${xPct * -18}px, ${yPct * 10}px)`;
    }, { passive: true });
  }

  // ── Card stagger on section enter ─────────────────────────
  const cards = document.querySelectorAll('.ef-why2-card');
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 130);
      });
      cardObs.disconnect();
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(36px)';
    card.style.transition = 'opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1)';
  });
  if (cards.length) cardObs.observe(cards[0]);

})();

// ============================================================
//  MOBILE OFFCANVAS NAV — Fix: scroll to section after drawer closes
//  Problem: data-bs-dismiss closes the drawer but Bootstrap's
//  offcanvas backdrop blocks the anchor hash scroll on mobile.
//  Fix: intercept clicks, close the drawer programmatically,
//  then smooth-scroll to the target section once it's fully hidden.
// ============================================================
(function fixMobileNavLinks() {
  const drawerEl = document.getElementById('mobileDrawer');
  if (!drawerEl) return;

  drawerEl.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1); // strip the '#'

      // Get (or create) the Bootstrap Offcanvas instance and hide it
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
      bsOffcanvas.hide();

      // Wait for the offcanvas 'hidden' event, then scroll
      drawerEl.addEventListener('hidden.bs.offcanvas', function scrollAfterClose() {
        drawerEl.removeEventListener('hidden.bs.offcanvas', scrollAfterClose);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });
})();

// ============================================================
//  FULL-PAGE WATER RIPPLE
//  Canvas sits fixed above every section (pointer-events:none).
//  Each click / tap spawns a burst of 3 concentric rings
//  in Elai's brand palette: gold · green · water-blue ·
//  champagne · soft-green. Rings expand, fade, then clean up.
// ============================================================
(function initWaterRipple() {
  const canvas = document.getElementById('ef-ripple-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const ripples = [];

  // ── Keep canvas pixel-perfect on resize / orientation change ──
  function resize() {
    // Save physical pixel ratio for crisp lines on retina screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Brand colour palette ───────────────────────────────────
  const COLORS = [
    'rgba(212,175,55,',    // --gold-primary
    'rgba(126,200,50,',    // --green-primary
    'rgba(160,215,245,',   // water-blue accent
    'rgba(247,231,169,',   // --champagne-gold
    'rgba(170,223,90,',    // --green-light
    'rgba(184,134,11,',    // --gold-dark
  ];

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  // ── Spawn 3-ring burst at (cx, cy) ────────────────────────
  function spawnBurst(cx, cy) {
    // 1 — large outer ring
    ripples.push({
      x: cx, y: cy, r: 0,
      maxR : 95 + Math.random() * 75,
      alpha: 0.52,
      color: randomColor(),
      lw   : 1.6 + Math.random() * 1.0,
      spd  : 3.2 + Math.random() * 1.4,
    });
    // 2 — medium ring (slight positional offset for organic feel)
    ripples.push({
      x: cx + (Math.random() - 0.5) * 12,
      y: cy + (Math.random() - 0.5) * 12,
      r: 0,
      maxR : 58 + Math.random() * 38,
      alpha: 0.40,
      color: randomColor(),
      lw   : 1.0 + Math.random() * 0.8,
      spd  : 2.2 + Math.random() * 1.8,
    });
    // 3 — small tight ring
    ripples.push({
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 20,
      r: 0,
      maxR : 26 + Math.random() * 24,
      alpha: 0.28,
      color: randomColor(),
      lw   : 0.7 + Math.random() * 0.5,
      spd  : 1.5 + Math.random() * 1.6,
    });
  }

  // ── Event listeners — every section, every click ──────────
  document.addEventListener('click', function (e) {
    spawnBurst(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', function (e) {
    Array.from(e.touches).forEach(function (t) {
      spawnBurst(t.clientX, t.clientY);
    });
  }, { passive: true });

  // ── RAF draw loop ─────────────────────────────────────────
  function draw() {
    // Clear with logical (CSS) pixel dimensions
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = ripples.length - 1; i >= 0; i--) {
      var rp = ripples[i];
      rp.r    += rp.spd;
      rp.alpha = 0.55 * (1 - rp.r / rp.maxR);   // linear fade-out

      if (rp.alpha <= 0.004 || rp.r >= rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = rp.color + rp.alpha.toFixed(3) + ')';
      ctx.lineWidth   = rp.lw;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
const scrollBtn = document.getElementById("scrollTopBtn");

/* Show button after scroll */
window.addEventListener("scroll", () => {
  if(window.scrollY > 250){
    scrollBtn.classList.add("show");
  }else{
    scrollBtn.classList.remove("show");
  }
});

/* Smooth scroll top */
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});