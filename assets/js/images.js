// ── ASSET IMAGES ─────────────────────────────────────────────────────────────
// All images are loaded from assets/img/ — no base64 embedding
(function() {
  var BASE = 'assets/img/';
  var IMGS = {
    aldo:           BASE + 'aldo_villegas.jpg',
    camaraSenadores:BASE + 'camara_senadores.jpg',
    camaraDiputados:BASE + 'camara_diputados.jpg',
    cochabamba:     BASE + 'cochabamba.jpg',
    escudoCbba:     BASE + 'escudo_cbba.png',
    escudoBolivia:  BASE + 'escudo_bolivia.gif',
    banderaBolivia: BASE + 'bandera_bolivia.jpg',
    boliviaManos:   BASE + 'bolivia.png',
  };

  var stored = localStorage.getItem('pagina_politica_v1');
  var d = stored ? JSON.parse(stored) : null;

  // 1. Foto del Senador
  var sobreImg    = document.getElementById('sobre-img');
  var sobreVacio  = document.getElementById('sobre-img-vacio');
  if (!d || !d.sobreImg) {
    if (sobreImg)   { sobreImg.src = IMGS.aldo; sobreImg.style.display = 'block'; }
    if (sobreVacio)   sobreVacio.style.display = 'none';
  }

  // 2. Hero background
  if (!d || !d.heroBg) {
    var heroBgImg = document.getElementById('hero-bg-img');
    if (heroBgImg) {
      heroBgImg.src = IMGS.camaraSenadores;
      heroBgImg.style.display = 'block';
    }
  }

  // 3. Escudo Bolivia en nav emblem
  var navEmb = document.getElementById('nav-emblem');
  if (navEmb) {
    navEmb.innerHTML = '';
    navEmb.style.background = 'transparent';
    navEmb.style.padding    = '2px';
    var eImg = document.createElement('img');
    eImg.src = IMGS.escudoBolivia;
    eImg.style.cssText = 'width:100%;height:100%;object-fit:contain;border-radius:50%;';
    navEmb.appendChild(eImg);
  }

  // 4. Logo del partido — se controla desde app.js con d.logoPartido
  // (no se inyecta escudo_cbba.png por defecto aquí)

  // 5. Escudo Cbba en comisión economía — solo si no hay imagen subida desde el admin
  var comData = d && d.comision;
  var escCbba = document.getElementById('escudo-cbba');
  if (escCbba && (!comData || !comData.ecoImagen)) {
    escCbba.innerHTML = '';
    escCbba.classList.remove('has-img');
    var eImg2 = document.createElement('img');
    eImg2.src = IMGS.escudoCbba;
    eImg2.alt = 'Escudo Cochabamba';
    escCbba.appendChild(eImg2);
  }

  // 6. Escudo Bolivia en comisión internacional — solo si no hay imagen subida desde el admin
  var escBol = document.getElementById('escudo-bolivia');
  if (escBol && (!comData || !comData.intImagen)) {
    escBol.innerHTML = '';
    escBol.classList.remove('has-img');
    var eImg3 = document.createElement('img');
    eImg3.src = IMGS.escudoBolivia;
    eImg3.alt = 'Escudo Bolivia';
    escBol.appendChild(eImg3);
  }

  // 7. Galería vacía por defecto
  var galContainer = document.getElementById('galeria-container');
  if (galContainer && (!d || !d.galeria || d.galeria.length === 0)) {
    galContainer.innerHTML = '<p class="galeria-empty">Las noticias se añadirán desde el panel de administración.</p>';
  }

  // 8. Banner Bolivia
  var bannerBg = document.getElementById('banner-bolivia-bg');
  if (bannerBg) bannerBg.style.backgroundImage = "url('" + IMGS.boliviaManos + "')";

  // 9. Visión card background
  var mvBg = document.getElementById('mv-cochabamba');
  if (mvBg) {
    mvBg.style.backgroundImage    = "linear-gradient(rgba(192,57,43,0.88),rgba(150,30,20,0.92)), url('" + IMGS.cochabamba + "')";
    mvBg.style.backgroundSize    = 'cover';
    mvBg.style.backgroundPosition= 'center';
  }

})();
