// ══════════════════════════════════════════════════════════════════════════════
// MEJORAS VISUALES — enhancements.js
// 1. Scroll animations (Intersection Observer)
// 2. Hover effects en tarjetas
// 3. Efecto typewriter en hero
// 4. Botón volver arriba
// 5. Barra de progreso de lectura
// 6. Lightbox en galería/noticias
// 7. Propuestas con estado visual
// ══════════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ── 1. SCROLL ANIMATIONS ──────────────────────────────────────────────────
  function initScrollAnimations() {
    var style = document.createElement('style');
    style.textContent = `
      .sa-hidden { opacity: 0; transform: translateY(32px); transition: opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1); }
      .sa-hidden.sa-delay-1 { transition-delay: 0.1s; }
      .sa-hidden.sa-delay-2 { transition-delay: 0.2s; }
      .sa-hidden.sa-delay-3 { transition-delay: 0.3s; }
      .sa-hidden.sa-delay-4 { transition-delay: 0.4s; }
      .sa-visible { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);

    var selectors = [
      '.section-eyebrow', '.section-title', '.section-lead',
      '.propuesta-card', '.evento-card', '.galeria-item',
      '.mv-card', '.cred-badge', '.sobre-bio p',
      '.comision-nombre', '.funcionario-card', '.red-card',
      '.contacto-dato', '.area-item'
    ];

    function markElements() {
      selectors.forEach(function(sel) {
        document.querySelectorAll(sel).forEach(function(el, i) {
          if (!el.classList.contains('sa-hidden')) {
            el.classList.add('sa-hidden');
            var delay = Math.min(i % 5, 4);
            if (delay > 0) el.classList.add('sa-delay-' + delay);
          }
        });
      });
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('sa-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function observeAll() {
      document.querySelectorAll('.sa-hidden').forEach(function(el) {
        observer.observe(el);
      });
    }

    // Run after app.js renders content
    setTimeout(function() {
      markElements();
      observeAll();
      // Re-run after dynamic content loads
      setTimeout(function() { markElements(); observeAll(); }, 800);
    }, 300);
  }

  // ── 2. HOVER EFFECTS EN TARJETAS ─────────────────────────────────────────
  function initCardHovers() {
    var style = document.createElement('style');
    style.textContent = `
      .propuesta-card { transition: transform 0.22s ease, box-shadow 0.22s ease !important; cursor: default; }
      .propuesta-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(27,58,107,0.18) !important; }
      .galeria-item { transition: transform 0.22s ease, box-shadow 0.22s ease; }
      .galeria-item:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
      .galeria-item .galeria-img-wrap img { transition: transform 0.35s ease; }
      .galeria-item:hover .galeria-img-wrap img { transform: scale(1.04); }
      .galeria-img-wrap { overflow: hidden; }
      .evento-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
      .evento-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(18,41,81,0.22) !important; }
      .red-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
      .red-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.13) !important; }
      .funcionario-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .funcionario-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
      .mv-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
      .mv-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(27,58,107,0.14) !important; }
    `;
    document.head.appendChild(style);
  }

  // ── 3. TYPEWRITER EN HERO ────────────────────────────────────────────────
  function initTypewriter() {
    var style = document.createElement('style');
    style.textContent = `
      .tw-cursor { display: inline-block; width: 3px; height: 1em; background: var(--c-accent, #C03928); margin-left: 2px; vertical-align: middle; animation: tw-blink 0.9s step-end infinite; }
      @keyframes tw-blink { 50% { opacity: 0; } }
    `;
    document.head.appendChild(style);

    function typewriter(el, text, speed, onDone) {
      if (!el || !text) { if (onDone) onDone(); return; }
      el.textContent = '';
      var cursor = document.createElement('span');
      cursor.className = 'tw-cursor';
      el.parentNode && el.parentNode.insertBefore(cursor, el.nextSibling);
      var i = 0;
      var interval = setInterval(function() {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(function() {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            if (onDone) onDone();
          }, 800);
        }
      }, speed);
    }

    // Wait for app.js to render the slogan
    setTimeout(function() {
      var sloganEl = document.getElementById('hero-slogan');
      if (!sloganEl) return;
      var text = sloganEl.textContent.trim();
      if (!text || text.length < 5) return;
      sloganEl.textContent = '';
      // Small delay so hero loads visually first
      setTimeout(function() { typewriter(sloganEl, text, 28, null); }, 600);
    }, 500);
  }

  // ── 4. BOTÓN VOLVER ARRIBA ───────────────────────────────────────────────
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'btn-back-top';
    btn.setAttribute('aria-label', 'Volver al inicio');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);

    var style = document.createElement('style');
    style.textContent = `
      #btn-back-top {
        position: fixed; bottom: 2rem; right: 1.75rem; z-index: 800;
        width: 46px; height: 46px; border-radius: 50%;
        background: var(--c-primary, #1B3A6B); color: #fff; border: none;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 20px rgba(27,58,107,0.35); cursor: pointer;
        opacity: 0; transform: translateY(16px) scale(0.85);
        transition: opacity 0.3s ease, transform 0.3s ease, background 0.18s ease;
        pointer-events: none;
      }
      #btn-back-top.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
      #btn-back-top:hover { background: var(--c-accent, #C03928); transform: translateY(-2px) scale(1.05); }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 5. BARRA DE PROGRESO DE LECTURA ─────────────────────────────────────
  function initReadingProgress() {
    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.appendChild(bar);

    var style = document.createElement('style');
    style.textContent = `
      #reading-progress {
        position: fixed; top: 0; left: 0; z-index: 9999;
        height: 3px; width: 0%; background: var(--c-accent, #C03928);
        transition: width 0.1s linear;
        box-shadow: 0 0 8px rgba(192,57,40,0.5);
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', function() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── 6. LIGHTBOX EN GALERÍA ───────────────────────────────────────────────
  function initLightbox() {
    var overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.innerHTML = `
      <div id="lightbox-box">
        <button id="lb-close" aria-label="Cerrar">✕</button>
        <button id="lb-prev" aria-label="Anterior">&#8249;</button>
        <button id="lb-next" aria-label="Siguiente">&#8250;</button>
        <img id="lb-img" src="" alt="">
        <div id="lb-caption"></div>
        <div id="lb-counter"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    var style = document.createElement('style');
    style.textContent = `
      #lightbox-overlay {
        display: none; position: fixed; inset: 0; z-index: 1000;
        background: rgba(8,15,30,0.94); backdrop-filter: blur(6px);
        align-items: center; justify-content: center;
      }
      #lightbox-overlay.open { display: flex; }
      #lightbox-box {
        position: relative; max-width: 92vw; max-height: 90vh;
        display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
        animation: lb-in 0.25s cubic-bezier(.22,1,.36,1);
      }
      @keyframes lb-in { from { opacity:0; transform: scale(0.92); } to { opacity:1; transform: scale(1); } }
      #lb-img { max-width: 88vw; max-height: 75vh; object-fit: contain; border-radius: 4px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); display: block; }
      #lb-caption { color: rgba(255,255,255,0.88); font-size: 0.9rem; text-align: center; max-width: 600px; }
      #lb-counter { color: rgba(255,255,255,0.45); font-size: 0.75rem; }
      #lb-close {
        position: fixed; top: 1.25rem; right: 1.5rem;
        background: rgba(255,255,255,0.12); border: none; color: #fff;
        width: 40px; height: 40px; border-radius: 50%; font-size: 1rem;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background 0.18s;
      }
      #lb-close:hover { background: var(--c-accent, #C03928); }
      #lb-prev, #lb-next {
        position: fixed; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.1); border: none; color: #fff;
        width: 48px; height: 64px; font-size: 2rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.18s; border-radius: 4px;
      }
      #lb-prev { left: 1rem; } #lb-next { right: 1rem; }
      #lb-prev:hover, #lb-next:hover { background: rgba(255,255,255,0.22); }
      @media(max-width:600px){ #lb-prev{left:0.25rem;} #lb-next{right:0.25rem;} }
    `;
    document.head.appendChild(style);

    var currentIndex = 0;
    var images = [];

    function openLightbox(idx) {
      currentIndex = idx;
      updateLightbox();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      var item = images[currentIndex];
      var img = document.getElementById('lb-img');
      img.style.opacity = '0';
      img.onload = function() { img.style.transition='opacity 0.22s'; img.style.opacity='1'; };
      img.src = item.src;
      img.alt = item.caption || '';
      document.getElementById('lb-caption').textContent = item.caption || '';
      document.getElementById('lb-counter').textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeLightbox(); });
    document.getElementById('lb-prev').addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    });
    document.getElementById('lb-next').addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + images.length) % images.length; updateLightbox(); }
      if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % images.length; updateLightbox(); }
    });

    // Build image list and attach click handlers after render
    function buildGallery() {
      images = [];
      var items = document.querySelectorAll('.galeria-item');
      items.forEach(function(item, i) {
        var img = item.querySelector('img');
        var cap = item.querySelector('.noticia-sin-link, .noticia-btn span');
        if (!img) return;
        var src = img.src;
        var caption = cap ? cap.textContent.trim() : (img.alt || '');
        images.push({ src: src, caption: caption });
        item.querySelector('.galeria-img-wrap').style.cursor = 'zoom-in';
        item.querySelector('.galeria-img-wrap').addEventListener('click', function() {
          openLightbox(i);
        });
      });
    }

    setTimeout(buildGallery, 600);
    setTimeout(buildGallery, 1500); // re-run in case of late render
  }

  // ── 7. PROPUESTAS CON ESTADO VISUAL ──────────────────────────────────────
  // Adds a status badge to each proposal card based on its icon or title keywords
  function initProposalStatus() {
    var style = document.createElement('style');
    style.textContent = `
      .prop-status { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.65rem; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 2px; }
      .prop-status.aprobada { background: #dcfce7; color: #15803d; }
      .prop-status.en-comite { background: #fef9c3; color: #854d0e; }
      .prop-status.en-estudio { background: #dbeafe; color: #1e40af; }
      .prop-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; }
    `;
    document.head.appendChild(style);

    function inferStatus(titulo, icono) {
      var t = (titulo + icono).toLowerCase();
      if (t.includes('aprobad') || t.includes('✅') || t.includes('🏆') || t.includes('✔')) return 'aprobada';
      if (t.includes('comité') || t.includes('comite') || t.includes('sesión') || t.includes('debate') || t.includes('⚖') || t.includes('🏛')) return 'en-comite';
      return 'en-estudio';
    }

    var labels = { 'aprobada': '✔ Aprobada', 'en-comite': '⏳ En Comité', 'en-estudio': '🔎 En Estudio' };

    function addStatuses() {
      document.querySelectorAll('.propuesta-card').forEach(function(card) {
        if (card.querySelector('.prop-status')) return; // already added
        var titulo = (card.querySelector('.propuesta-titulo') || {}).textContent || '';
        var icono  = (card.querySelector('.propuesta-icon') || {}).textContent || '';
        var status = inferStatus(titulo, icono);
        var badge  = document.createElement('div');
        badge.className = 'prop-status ' + status;
        badge.textContent = labels[status];
        card.appendChild(badge);
      });
    }

    setTimeout(addStatuses, 700);
    setTimeout(addStatuses, 1500);
  }

  // ── INIT ALL ─────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollAnimations();
    initCardHovers();
    initTypewriter();
    initBackToTop();
    initReadingProgress();
    initLightbox();
    initProposalStatus();
  }

})();
