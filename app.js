/* ============================================
   CORTIJO — app.js
   SPA navigation · Animations · Form
   ============================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. PAGE NAVIGATION
  ────────────────────────────────────────── */
  const pages    = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger reveal animations for the new page
      setTimeout(() => triggerReveal(target), 80);
    }

    navLinks.forEach(l => {
      if (l.dataset.page === pageId) l.classList.add('active');
    });

    // Close mobile menu if open
    closeMobileMenu();
  }

  // Nav links (desktop)
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = link.dataset.page;
      if (page) showPage(page);
    });
  });

  // Mobile links
  mobileLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href').replace('#', '');
      showPage(href);
    });
  });

  // Logo → home
  document.querySelector('.nav-logo').addEventListener('click', () => showPage('inicio'));

  // Inline buttons with data-page
  document.querySelectorAll('[data-page]').forEach(el => {
    if (!el.classList.contains('nav-link')) {
      el.addEventListener('click', e => {
        const page = el.dataset.page;
        if (page) { e.preventDefault(); showPage(page); }
      });
    }
  });

  // Handle hash on load
  const hash = window.location.hash.replace('#', '') || 'inicio';
  showPage(hash);

  /* ──────────────────────────────────────────
     2. HAMBURGER MENU
  ────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ──────────────────────────────────────────
     3. NAVBAR SCROLL SHADOW
  ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ──────────────────────────────────────────
     4. REVEAL ON SCROLL (IntersectionObserver)
  ────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  function triggerReveal(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      revealObserver.observe(el);
    });
  }

  /* ──────────────────────────────────────────
     5. CARTA — CATEGORY CARDS
  ────────────────────────────────────────── */
  const catCards = document.querySelectorAll(".cat-card");
  const grids    = document.querySelectorAll(".menu-grid");

  function activateCat(cat, color) {
    catCards.forEach(c => c.classList.remove("active"));
    grids.forEach(g => g.classList.remove("active"));
    const card = document.querySelector('[data-cat="' + cat + '"].cat-card');
    if (card) card.classList.add("active");
    const grid = document.getElementById("cat-" + cat);
    if (grid) {
      grid.classList.add("active");
      const col = color || grid.dataset.color || "var(--accent)";
      grid.style.setProperty("--panel-color", col);
    }
  }

  catCards.forEach(card => {
    card.addEventListener("click", () => {
      const cat   = card.dataset.cat;
      const style = card.getAttribute("style") || "";
      const match = style.match(/--cc:\s*([^;]+)/);
      const color = match ? match[1].trim() : null;
      activateCat(cat, color);
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  });

  // Init first panel colour
  const firstGrid = document.getElementById("cat-cafes");
  if (firstGrid) firstGrid.style.setProperty("--panel-color", "#7B4F2E");

  /* ──────────────────────────────────────────
     6. CONTACT FORM
  ────────────────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre  = form.querySelector('#nombre').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const mensaje = form.querySelector('#mensaje').value.trim();

      // Basic validation
      let valid = true;
      [form.querySelector('#nombre'), form.querySelector('#email'), form.querySelector('#mensaje')]
        .forEach(input => {
          if (!input.value.trim()) {
            input.style.borderColor = '#c0392b';
            valid = false;
          } else {
            input.style.borderColor = '';
          }
        });

      if (!valid) return;

      // Email format check
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailEl = form.querySelector('#email');
      if (!emailRe.test(email)) {
        emailEl.style.borderColor = '#c0392b';
        return;
      }

      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Enviando…';
      btn.disabled = true;

      try {
        const res = await fetch('https://formspree.io/f/xlgkbnda', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (res.ok) {
          form.reset();
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        } else {
          alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        }
      } catch (err) {
        alert('No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo.');
      }

      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
    });

    // Clear red border on input
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
  }

  /* ──────────────────────────────────────────
     7. HERO CARD PARALLAX (subtle)
  ────────────────────────────────────────── */
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    document.addEventListener('mousemove', e => {
      const page = document.getElementById('inicio');
      if (!page || !page.classList.contains('active')) return;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      heroCard.style.transform = `
        perspective(800px)
        rotateY(${dx * 6}deg)
        rotateX(${-dy * 4}deg)
        translateY(-2px)
      `;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
      heroCard.style.transition = 'transform 0.8s ease';
      setTimeout(() => { heroCard.style.transition = ''; }, 800);
    });
  }

  /* ──────────────────────────────────────────
     8. STAGGER HIGHLIGHT ITEMS
  ────────────────────────────────────────── */
  document.querySelectorAll('.highlight').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });

})();
