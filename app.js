/* ============================================
   CORTIJO — app.js
   ============================================ */
(function () {
  'use strict';

  /* ─── HAMBURGUESA (definida primero para que showPage pueda usarla) ─── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    var open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.addEventListener('click', function(e) {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ─── NAVEGACIÓN SPA ─── */
  var pages    = document.querySelectorAll('.page');
  var navLinks = document.querySelectorAll('.nav-link');

  function showPage(id) {
    pages.forEach(function(p) {
      p.style.display = 'none';
      p.classList.remove('active');
    });
    navLinks.forEach(function(l) { l.classList.remove('active'); });

    var target = document.getElementById(id);
    if (!target) return;

    target.style.display = 'block';
    target.classList.add('active');
    window.scrollTo(0, 0);

    navLinks.forEach(function(l) {
      if (l.dataset.page === id) l.classList.add('active');
    });

    // Animar .reveal con escalonado
    target.querySelectorAll('.reveal').forEach(function(el, i) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease ' + (i * 60) + 'ms, transform 0.5s ease ' + (i * 60) + 'ms';
      setTimeout(function() {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 30);
    });

    closeMobileMenu();
  }

  // Nav links escritorio
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      if (link.dataset.page) showPage(link.dataset.page);
    });
  });

  // Nav links móvil
  document.querySelectorAll('.mobile-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showPage(link.getAttribute('href').replace('#', ''));
    });
  });

  // Logo → Inicio
  document.querySelector('.nav-logo').addEventListener('click', function() {
    showPage('inicio');
  });

  // Cualquier elemento con data-page (ej: botón "Ver la carta")
  document.querySelectorAll('[data-page]').forEach(function(el) {
    if (!el.classList.contains('nav-link')) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(el.dataset.page);
      });
    }
  });

  /* ─── NAVBAR SOMBRA AL HACER SCROLL ─── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ─── TARJETAS DE CATEGORÍA (CARTA) ─── */
  var catCards  = document.querySelectorAll('.cat-card');
  var menuGrids = document.querySelectorAll('.menu-grid');

  // Construir mapa de colores desde data-color de cada grid
  var colorMap = {};
  menuGrids.forEach(function(g) {
    colorMap[g.id.replace('cat-', '')] = g.dataset.color || '#b8341b';
  });

  function activateCat(cat) {
    // Quitar active de todas las tarjetas
    catCards.forEach(function(c) { c.classList.remove('active'); });

    // Ocultar todos los grids
    menuGrids.forEach(function(g) { g.style.display = 'none'; });

    // Marcar tarjeta activa
    var card = document.querySelector('.cat-card[data-cat="' + cat + '"]');
    if (card) card.classList.add('active');

    // Mostrar grid con animación
    var grid = document.getElementById('cat-' + cat);
    if (!grid) return;

    grid.style.display    = 'block';
    grid.style.setProperty('--panel-color', colorMap[cat] || '#b8341b');
    grid.style.opacity    = '0';
    grid.style.transform  = 'translateY(14px)';
    grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(function() {
      grid.style.opacity   = '1';
      grid.style.transform = 'translateY(0)';
    }, 20);
  }

  catCards.forEach(function(card) {
    card.addEventListener('click', function() {
      activateCat(card.dataset.cat);
    });
  });

  /* ─── FORMULARIO DE CONTACTO ─── */
  var form        = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      var campos = ['#nombre', '#email', '#mensaje'];
      var valid  = true;

      campos.forEach(function(sel) {
        var input = form.querySelector(sel);
        if (!input.value.trim()) {
          input.style.borderColor = '#c0392b';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!valid) return;

      var emailEl = form.querySelector('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        emailEl.style.borderColor = '#c0392b';
        return;
      }

      var btn = form.querySelector('.btn-submit');
      btn.textContent = 'Enviando…';
      btn.disabled    = true;

      try {
        var res = await fetch('https://formspree.io/f/xlgkbnda', {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(form)
        });
        if (res.ok) {
          form.reset();
          formSuccess.classList.add('show');
          setTimeout(function() { formSuccess.classList.remove('show'); }, 5000);
        } else {
          alert('Error al enviar. Inténtalo de nuevo.');
        }
      } catch (err) {
        alert('Sin conexión. Inténtalo de nuevo.');
      }

      btn.textContent = 'Enviar mensaje';
      btn.disabled    = false;
    });

    form.querySelectorAll('input, textarea').forEach(function(el) {
      el.addEventListener('input', function() { el.style.borderColor = ''; });
    });
  }

  /* ─── PARALLAX HERO CARD ─── */
  var heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    document.addEventListener('mousemove', function(e) {
      var inicio = document.getElementById('inicio');
      if (!inicio || !inicio.classList.contains('active')) return;
      var dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
      var dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      heroCard.style.transform =
        'perspective(800px) rotateY(' + (dx * 6) + 'deg) rotateX(' + (-dy * 4) + 'deg) translateY(-2px)';
    });
    heroCard.addEventListener('mouseleave', function() {
      heroCard.style.transition = 'transform 0.8s ease';
      heroCard.style.transform  = '';
      setTimeout(function() { heroCard.style.transition = ''; }, 800);
    });
  }

  /* ─── HIGHLIGHTS ESCALONADO ─── */
  document.querySelectorAll('.highlight').forEach(function(el, i) {
    el.style.setProperty('--i', i);
  });

  /* ─── ARRANQUE: mostrar inicio y activar Cafés ─── */
  showPage('inicio');
  activateCat('cafes');

})();