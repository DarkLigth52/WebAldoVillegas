// ── SEGURIDAD: Escape HTML para prevenir XSS en el renderizado ───────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;');
}

// URL segura — solo permite http/https
function safeUrl(url) {
  if (!url) return '#';
  url = String(url).trim();
  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) return '#';
  return url.replace(/[<>"']/g, '');
}

const STORE_KEY = 'pagina_politica_v1';

const DEFAULT_FUNC_ECO = [
  { nombre:'Aldo Sergio Villegas Mora', descripcion:'Senador — Cochabamba', cargo:'3ra. Secretaría · Comercio, Turismo y MYPEs', foto:'' },
  { nombre:'Brigada Parlamentaria CB', descripcion:'Cochabamba', cargo:'Coordinación General', foto:'' },
];
const DEFAULT_FUNC_INT = [
  { nombre:'Aldo Sergio Villegas Mora', descripcion:'Senador — Cochabamba · Alianza Libre', cargo:'Miembro · Comité Rel. Económicas', foto:'' },
  { nombre:'Cámara de Senadores', descripcion:'Bolivia', cargo:'Secretaría de la Comisión', foto:'' },
];

const DEFAULT_PROPUESTAS = [
  {icono:'🏭',titulo:'Desarrollo Productivo',desc:'Impulsar la industrialización y producción nacional como base del crecimiento económico de Bolivia.'},
  {icono:'🏪',titulo:'Apoyo a MYPEs y PYMEs',desc:'Legislar para facilitar acceso a crédito, mercados y formación para micro y pequeñas empresas.'},
  {icono:'🌐',titulo:'Comercio Internacional',desc:'Fortalecer acuerdos comerciales que abran mercados para exportadores bolivianos, especialmente de Cochabamba.'},
  {icono:'🚀',titulo:'Emprendimiento e Innovación',desc:'Crear ecosistemas favorables para emprendedores con herramientas digitales, financiamiento y asistencia técnica.'},
  {icono:'🌿',titulo:'Turismo Sostenible',desc:'Desarrollar el potencial turístico de Cochabamba y Bolivia generando empleo y divisas para el país.'},
  {icono:'📊',titulo:'Economía Plural',desc:'Articular los diferentes modelos económicos bolivianos en un marco legal equitativo e inclusivo.'},
];

function defaults() {
  return {
    pass:'admin123',
    nombre1:'Aldo', nombre2:'Villegas',
    slogan:'Trabajo legislativo comprometido con el desarrollo económico, productivo e industrial de Cochabamba y Bolivia.',
    partido:'Alianza Libre · Cochabamba', badge:'Senador 2025–2030', heroBg:'', sobreImg:'', logoPartido:'',
    sobreTexto:'Aldo Villegas es **Actual Senador de Bolivia, Gestión 2025–2030**, y Gerente General de CEDENEG (Centro de Desarrollo de Negocios). Consultor Empresarial y Experto en Gestión Comercial, Cobranzas y Medios de Pago, Herramientas de Productividad para el Empresario y Emprendedor.\nCuenta con un **Master en Comercio Internacional** y Post Grados en Finanzas y Marketing, además de ser Administrador de Empresas. Ha desempeñado roles como Gerente Regional de Laboratorios Roxell Pharma S.R.L., con gestiones administrativas y comerciales para Escuelas de PostGrado.\nPosee **8 años de experiencia en Instituciones Financieras** y ha ejercido como Consultor y Asesor de la Cámara de Exportaciones, asesorando empresas, MYPEs y PYMEs en Cadepia, SAT y el Ministerio de Desarrollo Económico. También se ha desempeñado como Gerente Regional Gladymar y Gerente y Estratega de Negocios en Vimpex.\nEscribió investigaciones sobre el Aprovechamiento del **ATPDEA en 2003**. Mantiene presencia activa en redes sociales con publicaciones sobre Política Nacional, Internacional, Emprendedurismo, Negocios y Finanzas. Interviene en más de 5 emprendimientos propios y es miembro de Cámaras, Instituciones y Organizaciones de fortalecimiento al empresario y profesional boliviano.',
    propuestas: DEFAULT_PROPUESTAS,
    eventos:[],
    galeria:[], // {src, pie, link} - link es opcional
    email:'aldo.villegas@senado.gob.bo',
    tel:'67200811',
    lugar:'Cochabamba, Bolivia',
    contactoDesc:'Para consultas legislativas o ciudadanas, escríbenos. El equipo del Senador responde a la brevedad.',
    cfgNombre:'Sen. Aldo Villegas',
    sobreTitulo:'Lic. Aldo Sergio Villegas Mora',
    sobreLeadDesc:'Senador de Bolivia por Cochabamba, empresario, consultor y referente en comercio internacional y desarrollo económico.',
    credenciales:[
      {icono:'🎓',texto:'Lic. Administración de Empresas'},
      {icono:'🌐',texto:'MCI — Comercio Internacional'},
      {icono:'📈',texto:'Post Grado en Finanzas y Marketing'},
      {icono:'🏛️',texto:'Senador Bolivia 2025–2030'},
      {icono:'🏢',texto:'Gerente General CEDENEG'},
      {icono:'🤝',texto:'Asesor Cámara de Exportaciones'},
    ],
    misionTitulo:'Compromiso con Bolivia',
    misionTexto:'Representar con transparencia, responsabilidad y vocación de servicio a la ciudadanía cochabambina y boliviana, impulsando leyes y políticas que promuevan el desarrollo económico, el fortalecimiento del aparato productivo, el comercio internacional y el crecimiento de las MYPEs y PYMEs. Trabajar por una Bolivia más justa, próspera y competitiva a través del diálogo, la concertación y la construcción de acuerdos en beneficio del pueblo.',
    visionTitulo:'Bolivia Próspera e Integrada',
    visionTexto:'Contribuir a consolidar un Bolivia con una economía diversificada, productiva e integrada al mundo, donde los emprendedores, empresarios y profesionales tengan las condiciones necesarias para crecer y generar empleo digno. Visualizamos un Cochabamba y un país donde la innovación, el comercio y la industria sean motores de desarrollo sostenible, con instituciones sólidas y ciudadanos empoderados que participen activamente en la construcción del bien común.',
    contactoTel1:'67200811', contactoTel2:'71554190',
    contactoEmail:'aldo.villegas@senado.gob.bo',
    contactoEmailP:'villegas_aldo@hotmail.com',
    funcionariosEco: null,
    funcionariosInt: null,
    comision:{
      seccionTitulo:'Comisiones y Comités',
      seccionLead:'El Sen. Villegas participa activamente en las siguientes comisiones del Senado de Bolivia y la Brigada Parlamentaria de Cochabamba.',
      ecoTabLabel:'Comisión de Economía Plural',
      ecoTag:'🏛️ Brigada Parlamentaria Cochabamba',
      ecoNombre:'Comisión de Economía Plural, Producción e Industria',
      ecoSub:'3ra. Secretaría — Comercio, Turismo y MYPEs · Brigada Parlamentaria CB',
      ecoDesc:'La **Comisión de Economía Plural, Producción e Industria** forma parte de la Brigada Parlamentaria de Cochabamba y tiene como objetivo impulsar políticas legislativas que fortalezcan el aparato productivo del departamento y del país. El Sen. Aldo Villegas ejerce la **3ra. Secretaría — Comercio, Turismo y MYPEs**, liderando iniciativas concretas para el desarrollo económico regional.\n\nEsta comisión trabaja en la articulación entre el sector público y privado, promoviendo leyes que favorezcan la producción nacional, el comercio justo, el turismo sostenible y el fortalecimiento de micro y pequeñas empresas como motor de empleo e innovación en Cochabamba.',
      ecoAreas:[
        {icono:'🏭',titulo:'Producción e Industria',desc:'Legislación para fomentar la producción nacional y la industrialización de recursos locales.'},
        {icono:'🛒',titulo:'Comercio y MYPEs',desc:'Apoyo normativo a micro y pequeñas empresas, facilitando su acceso a mercados y financiamiento.'},
        {icono:'🌿',titulo:'Turismo Sostenible',desc:'Políticas para el desarrollo del turismo en Cochabamba como fuente de ingreso y empleo.'},
        {icono:'📋',titulo:'Economía Plural',desc:'Marco legal para articular los diferentes modelos económicos que conviven en Bolivia.'},
        {icono:'🌐',titulo:'Comercio Internacional',desc:'Acuerdos y tratados que favorezcan las exportaciones bolivianas y la integración económica.'},
        {icono:'💡',titulo:'Emprendimiento',desc:'Ecosistema de apoyo para emprendedores con herramientas, formación y acceso a capital.'},
      ],
      ecoImagen:'',
      ecoDriveLink:'',
      ecoDriveLabel:'Documentos de la Comisión — Google Drive',
      intTabLabel:'Comisión Política Internacional',
      intTag:'🏛️ Cámara de Senadores de Bolivia',
      intNombre:'Comisión Política Internacional',
      intSub:'Comité de Relaciones Económicas Internacionales',
      intDesc:'La **Comisión Política Internacional** de la Cámara de Senadores de Bolivia es el órgano legislativo responsable de revisar, analizar y emitir criterios sobre los tratados, convenios y acuerdos internacionales que suscribe el Estado Boliviano, así como de las relaciones diplomáticas y de cooperación con otros países y organismos multilaterales.\n\nEl Sen. Aldo Villegas, como miembro de esta comisión y del **Comité de Relaciones Económicas Internacionales**, aporta su experiencia en comercio exterior y finanzas internacionales para fortalecer la inserción de Bolivia en la economía global, defendiendo los intereses nacionales y promoviendo acuerdos que beneficien al país y especialmente al sector productivo.',
      intAreas:[
        {icono:'🤝',titulo:'Tratados Internacionales',desc:'Análisis y aprobación de acuerdos bilaterales y multilaterales que vinculan al Estado Boliviano.'},
        {icono:'💹',titulo:'Relaciones Económicas',desc:'Fomento de vínculos comerciales y financieros con socios estratégicos regionales y globales.'},
        {icono:'🌎',titulo:'Integración Regional',desc:'Participación activa en organismos como la CAN, MERCOSUR, ALBA-TCP y UNASUR.'},
        {icono:'🚢',titulo:'Comercio Exterior',desc:'Políticas para incrementar las exportaciones bolivianas y diversificar mercados internacionales.'},
        {icono:'🌏',titulo:'Cooperación Internacional',desc:'Gestión de recursos de cooperación técnica y financiera para proyectos de desarrollo nacional.'},
        {icono:'📜',titulo:'Diplomacia Parlamentaria',desc:'Participación en foros y asambleas parlamentarias internacionales representando a Bolivia.'},
      ],
      intImagen:'',
    },
    redes:{
      fb:'https://www.facebook.com/people/Aldo-Villegas/1436712392/',
      of:'https://www.facebook.com/groups/oficinavirtualav',
      tw:'https://x.com/alvikava',
      tk:'https://www.tiktok.com/@aldovillegas3',
      tg:'https://t.me/AldoVillegasTelegram',
      cv:'https://cedeneg.my.canva.site/aldovillegas',
      wa:'https://docs.google.com/forms/d/e/1FAIpQLSdH72fSHystkcYx6w3SSAh5dNvFZxH9QVnIvEkjCyYj23ogSg/viewform',
      yt:'', ig:'',
    },
    colores:{
      primary:'#1B3A6B', primaryDk:'#122951',
      accent:'#C0392B', accentLt:'#E74C3C',
      bg:'#F8F9FC', bg2:'#FFFFFF', bg3:'#EEF1F7',
      text:'#1A1F2E', muted:'#5A6578', border:'#D4DBE8',
    }
  };
}

function getData() {
  try {
    const r = localStorage.getItem(STORE_KEY);
    const d = r ? JSON.parse(r) : defaults();
    // Validación de tipos básica — protege contra localStorage manipulado
    if (!d || typeof d !== 'object') return defaults();
    if (!Array.isArray(d.propuestas))   d.propuestas  = DEFAULT_PROPUESTAS;
    if (!Array.isArray(d.eventos))      d.eventos     = [];
    if (!Array.isArray(d.galeria))      d.galeria     = [];
    if (!Array.isArray(d.credenciales)) d.credenciales = [];
    if (!d.colores || typeof d.colores !== 'object') d.colores = defaults().colores;
    if (!d.propuestas || d.propuestas.length === 0)  d.propuestas = DEFAULT_PROPUESTAS;
    // Migración: si logoPartido tiene el mismo valor que ecoImagen, limpiarlo
    if (d.logoPartido && d.comision && d.comision.ecoImagen && d.logoPartido === d.comision.ecoImagen) {
      d.logoPartido = '';
    }
    return d;
  } catch(e) {
    console.warn('localStorage corrupto — cargando valores por defecto:', e);
    return defaults();
  }
}

function applyColors(c) {
  const r = document.documentElement.style;
  r.setProperty('--c-primary', c.primary);
  r.setProperty('--c-primary-dk', c.primaryDk);
  r.setProperty('--c-accent', c.accent);
  r.setProperty('--c-accent-lt', c.accentLt);
  r.setProperty('--c-bg', c.bg);
  r.setProperty('--c-bg2', c.bg2);
  r.setProperty('--c-bg3', c.bg3);
  r.setProperty('--c-text', c.text);
  r.setProperty('--c-muted', c.muted);
  r.setProperty('--c-border', c.border);
  const toRgba = (hex, a) => {
    const n = parseInt(hex.replace('#',''), 16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  };
  r.setProperty('--c-nav-bg', c.primary + 'f7');
  r.setProperty('--c-hero-overlay', toRgba(c.primaryDk, 0.80));
}

function render() {
  const d = getData();
  applyColors(d.colores);
  document.title = d.cfgNombre || 'Sen. Aldo Villegas';

  // ── HERO ──────────────────────────────────────────────────────────────────
  var heroN1 = document.getElementById('hero-nombre1');
  var heroN2 = document.getElementById('hero-nombre2');
  var heroSlogan = document.getElementById('hero-slogan');
  var heroBadge = document.getElementById('hero-badge');
  var navNombre = document.getElementById('nav-nombre');
  var navPartido = document.getElementById('nav-partido');
  var navEmblem = document.getElementById('nav-emblem');
  if(heroN1 && d.nombre1) heroN1.textContent = d.nombre1;
  if(heroN2 && d.nombre2) heroN2.textContent = d.nombre2;
  if(heroSlogan && d.slogan) heroSlogan.textContent = d.slogan;
  if(heroBadge) heroBadge.textContent = (d.badge  ? '🇧🇴 ' + d.badge  : '🇧🇴 Senador 2025–2030');
  if(navNombre) navNombre.textContent = (d.nombre1||'Aldo') + ' ' + (d.nombre2||'Villegas');
  if(navPartido && d.partido) navPartido.textContent = d.partido;
  if(navEmblem && d.nombre1) navEmblem.textContent = (d.nombre1[0]||'A').toUpperCase();

  var heroBgEl  = document.getElementById('hero-bg');
  var heroBgImg = document.getElementById('hero-bg-img');
  if(d.heroBg) {
    if(heroBgImg) {
      heroBgImg.src = d.heroBg;
      heroBgImg.style.display = 'block';
    }
    // Fallback: también como background por compatibilidad
    if(heroBgEl) {
      heroBgEl.style.backgroundImage = '';
    }
  }

  const sobreImg = document.getElementById('sobre-img');
  const sobreVacio = document.getElementById('sobre-img-vacio');
  if(d.sobreImg){ sobreImg.src=d.sobreImg; sobreImg.style.display='block'; sobreVacio.style.display='none'; }

  // Propuestas
  document.getElementById('propuestas-container').innerHTML = d.propuestas.map(p=>`
    <div class="propuesta-card">
      <div class="propuesta-icon">${escapeHtml(p.icono)}</div>
      <h3 class="propuesta-titulo">${escapeHtml(p.titulo)}</h3>
      <p class="propuesta-desc">${escapeHtml(p.desc)}</p>
    </div>`).join('');

  // Eventos
  const evs = [...d.eventos].sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
  document.getElementById('eventos-container').innerHTML = evs.length ? evs.map(ev=>{
    const dt = new Date(ev.fecha+'T12:00:00');
    const lugarHtml = ev.mapLink
      ? `<a href="${safeUrl(ev.mapLink)}" target="_blank" rel="noopener" class="evento-lugar-btn" title="Ver en Google Maps">📍 ${escapeHtml(ev.lugar)} <span class="mapa-icon">🗺️</span></a>`
      : `<span class="evento-lugar-txt">📍 ${escapeHtml(ev.lugar)}</span>`;
    const registroHtml = ev.registro
      ? `<a href="${safeUrl(ev.registro)}" target="_blank" rel="noopener" class="evento-registro-btn">📋 Registrarse</a>`
      : '';
    return `<div class="evento-card">
      <div class="evento-fecha-box">
        <div class="dia">${dt.getDate()}</div>
        <div class="mes">${dt.toLocaleString('es',{month:'short'}).toUpperCase()}</div>
      </div>
      <div class="evento-body">
        <h3>${escapeHtml(ev.titulo)}</h3>
        <p>${lugarHtml}</p>
        <p>${escapeHtml(ev.desc)}</p>
        <div class="evento-footer">
          <span class="evento-tipo">${escapeHtml(ev.tipo)}</span>
          ${registroHtml}
        </div>
      </div>
    </div>`;
  }).join('') : '<p style="color:rgba(255,255,255,0.5)">No hay eventos programados.</p>';

  // Galería
  const gc = document.getElementById('galeria-container');
  gc.innerHTML = d.galeria.length
    ? d.galeria.map(function(g){
    // URL siempre apunta a la sección noticias del index — para generar tráfico al sitio
    var noticiaUrl  = window.location.origin + window.location.pathname.replace(/\/panel-legislativo\.html.*/, '/') + '#noticias';
    var shareText   = encodeURIComponent((g.pie || 'Noticia legislativa') + ' — Ver más en:');
    var shareEncUrl = encodeURIComponent(noticiaUrl);
    var safeNurl    = escapeHtml(noticiaUrl);
    var shareHtml = '<button class="share-toggle" '
      + 'onclick="openShareModal(' + "'" + safeNurl + "','" + escapeHtml(g.pie||'Noticia') + "'" + ')" '
      + 'aria-label="Compartir noticia" title="Compartir">'
      + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
      + ' Compartir</button>';
    var capHtml = '';
    if(g.pie) {
      if(g.link) {
        capHtml = '<div class="galeria-caption"><div class="cap-row">'
          + '<a class="noticia-btn" href="' + safeUrl(g.link) + '" target="_blank" rel="noopener">'
          + '<span>' + escapeHtml(g.pie) + '</span><span class="noticia-arrow">↗</span></a>'
          + shareHtml + '</div></div>';
      } else {
        capHtml = '<div class="galeria-caption"><div class="cap-row">'
          + '<span class="noticia-sin-link">' + escapeHtml(g.pie) + '</span>'
          + shareHtml + '</div></div>';
      }
    } else {
      capHtml = '<div class="galeria-caption"><div class="cap-row">' + shareHtml + '</div></div>';
    }
    return '<div class="galeria-item"><div class="galeria-img-wrap"><img src="' + escapeHtml(g.src) + '" alt="' + escapeHtml(g.pie||'Noticia') + '"></div>' + capHtml + '</div>';
  }).join('')
    : '<p class="galeria-empty">Las noticias se añadirán desde el panel de administración.</p>';

  // Logo del partido (sección Sobre Mí) — solo visible si hay logo guardado explícitamente
  var logoEl = document.getElementById('sobre-escudo-cbba');
  if(logoEl) {
    // Usar SOLO d.logoPartido — nunca ecoImagen ni otro campo
    var logoSrc = (d.logoPartido && d.logoPartido.length > 10) ? d.logoPartido : '';
    if(logoSrc) {
      logoEl.src = logoSrc;
      logoEl.style.display = 'block';
    } else {
      logoEl.src = '';
      logoEl.style.display = 'none';
    }
  }

  // Sobre Mí - campos editables
  const sobreTitulo = document.getElementById('sobre-titulo-principal');
  if(sobreTitulo && d.sobreTitulo) sobreTitulo.textContent = d.sobreTitulo;
  const sobreLeadDesc = document.getElementById('sobre-lead-desc');
  if(sobreLeadDesc && d.sobreLeadDesc) sobreLeadDesc.textContent = d.sobreLeadDesc;

  // Texto biográfico — párrafos separados por línea en blanco, soporta **negrita**
  const sobreBio = document.getElementById('sobre-bio');
  if(sobreBio && d.sobreTexto) {
    const parrafos = d.sobreTexto.split('\n').filter(function(p){ return p.trim(); });
    sobreBio.innerHTML = parrafos.map(function(p) {
      return '<p>' + escapeHtml(p).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') + '</p>';
    }).join('');
  }
  // Credenciales
  if(d.credenciales && d.credenciales.length > 0) {
    const credEl = document.getElementById('sobre-credenciales');
    if(credEl) {
      credEl.innerHTML = d.credenciales.map(function(c) {
        return '<div class="cred-badge"><span class="ci">' + escapeHtml(c.icono) + '</span>' + escapeHtml(c.texto) + '</div>';
      }).join('');
    }
  }
  // Misión & Visión
  const misionTit = document.getElementById('mision-titulo');
  const misionTxt = document.getElementById('mision-texto');
  const visionTit = document.getElementById('vision-titulo');
  const visionTxt = document.getElementById('vision-texto');
  if(misionTit && d.misionTitulo) misionTit.textContent = d.misionTitulo;
  if(misionTxt && d.misionTexto) misionTxt.textContent = d.misionTexto;
  if(visionTit && d.visionTitulo) visionTit.textContent = d.visionTitulo;
  if(visionTxt && d.visionTexto) visionTxt.textContent = d.visionTexto;

  // Redes Sociales — dinámicas desde localStorage
  var redesGrid = document.getElementById('redes-grid-dynamic');
  if(redesGrid && d.redes) {
    var r = d.redes;
    var cards = [
      {key:'fb',  cls:'fb', icon:'📘', nombre:'Facebook',            desc:'Perfil oficial'},
      {key:'of',  cls:'of', icon:'🏢', nombre:'Oficina Virtual',     desc:'Grupo oficial del Senador'},
      {key:'ig',  cls:'ig', icon:'📷', nombre:'Instagram',           desc:'@aldovillegas'},
      {key:'tw',  cls:'tw', icon:'𝕏',  nombre:'X / Twitter',         desc:'@alvikava'},
      {key:'tk',  cls:'tk', icon:'🎵', nombre:'TikTok',              desc:'@aldovillegas3'},
      {key:'yt',  cls:'yt', icon:'▶️', nombre:'YouTube',             desc:'Canal oficial'},
      {key:'tg',  cls:'tg', icon:'✈️', nombre:'Telegram',            desc:'Canal oficial'},
      {key:'cv',  cls:'cv', icon:'🗺️', nombre:'Mapeo Político',      desc:'Perfil en CEDENEG'},
      {key:'wa',  cls:'wa', icon:'💬', nombre:'Comunicación CB',     desc:'💚 WhatsApp Cochabamba'},
    ];
    redesGrid.innerHTML = cards
      .filter(function(c){ return r[c.key] && r[c.key].trim(); })
      .map(function(c){
        return '<a href="' + safeUrl(r[c.key]) + '" target="_blank" rel="noopener" class="red-card ' + c.cls + '">'
          + '<div class="red-icon">' + c.icon + '</div>'
          + '<div class="red-info"><div class="red-nombre">' + escapeHtml(c.nombre) + '</div>'
          + '<div class="red-desc">' + escapeHtml(c.desc) + '</div></div></a>';
      }).join('');
  }

  // Contacto
  if(d.contactoDesc) document.getElementById('contacto-desc').textContent = d.contactoDesc;
  if(d.lugar) document.getElementById('contacto-lugar').textContent = d.lugar;

  // Contacto datos dinámicos
  const elEmail = document.getElementById('contacto-email-val');
  const elTel1 = document.getElementById('contacto-tel1-val');
  const elTel2 = document.getElementById('contacto-tel2-val');
  const elEmailP = document.getElementById('contacto-email-personal-val');
  if(elEmail && d.contactoEmail) { elEmail.textContent = d.contactoEmail; }
  if(elTel1 && d.contactoTel1) { elTel1.textContent = d.contactoTel1; }
  if(elTel2 && d.contactoTel2) { elTel2.textContent = d.contactoTel2; }
  if(elEmailP && d.contactoEmailP) { elEmailP.textContent = d.contactoEmailP; }
  // Update WhatsApp & email hrefs dynamically
  var wa1 = document.getElementById('btn-wa1');
  var wa2 = document.getElementById('btn-wa2');
  var gm1 = document.getElementById('btn-gmail1');
  var gm2 = document.getElementById('btn-gmail2');
  if(wa1 && d.contactoTel1) wa1.href = 'https://wa.me/591' + d.contactoTel1.replace(/[^0-9]/g,'');
  if(wa2 && d.contactoTel2) wa2.href = 'https://wa.me/591' + d.contactoTel2.replace(/[^0-9]/g,'');
  if(gm1 && d.contactoEmail) gm1.href = 'mailto:' + d.contactoEmail;
  if(gm2 && d.contactoEmailP) gm2.href = 'mailto:' + d.contactoEmailP;

  // Comisiones
  renderComisiones(d.comision || getData().comision);
  // Funcionarios
  renderFuncionarios('funcionarios-economia', d.funcionariosEco || DEFAULT_FUNC_ECO);
  renderFuncionarios('funcionarios-internacional', d.funcionariosInt || DEFAULT_FUNC_INT);
}

function renderComisiones(c) {
  if(!c) return;
  // Sección títulos
  var st = document.getElementById('com-titulo'); if(st && c.seccionTitulo) st.textContent = c.seccionTitulo;
  var sl = document.getElementById('com-lead'); if(sl && c.seccionLead) sl.textContent = c.seccionLead;

  // Tab labels
  var etl = document.getElementById('ctab-eco-label'); if(etl && c.ecoTabLabel) etl.textContent = c.ecoTabLabel;
  var itl = document.getElementById('ctab-int-label'); if(itl && c.intTabLabel) itl.textContent = c.intTabLabel;

  // ECO
  var eTag = document.getElementById('eco-tag'); if(eTag && c.ecoTag) eTag.textContent = c.ecoTag;
  var eNom = document.getElementById('eco-nombre'); if(eNom && c.ecoNombre) eNom.innerHTML = escapeHtml(c.ecoNombre).replace(/\n/g,'<br>');
  var eSub = document.getElementById('eco-sub'); if(eSub && c.ecoSub) eSub.textContent = c.ecoSub;
  var eDesc = document.getElementById('eco-desc');
  if(eDesc && c.ecoDesc) {
    eDesc.innerHTML = c.ecoDesc.split('\n').filter(function(p){return p.trim();}).map(function(p){
      return '<p>' + escapeHtml(p).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>') + '</p>';
    }).join('');
  }
  var eAreas = document.getElementById('eco-areas');
  if(eAreas && c.ecoAreas) {
    eAreas.innerHTML = c.ecoAreas.map(function(a){
      return '<div class="area-item"><h4>' + escapeHtml(a.icono) + ' ' + escapeHtml(a.titulo) + '</h4><p>' + escapeHtml(a.desc) + '</p></div>';
    }).join('');
  }
  // ECO imagen
  // Escudo comisión Economía
  var escCbba = document.getElementById('escudo-cbba');
  if(escCbba && c.ecoImagen) {
    escCbba.innerHTML = '<img src="' + escapeHtml(c.ecoImagen) + '" alt="Escudo Economía">';
    escCbba.classList.add('has-img');
    escCbba.style.display = 'flex';
  }
  // ECO drive link
  var driveLink = document.getElementById('eco-drive-link');
  var driveLabel = document.getElementById('eco-drive-label');
  if(driveLink) {
    if(c.ecoDriveLink) {
      driveLink.href = c.ecoDriveLink;
      driveLink.style.display = 'inline-flex';
      if(driveLabel && c.ecoDriveLabel) driveLabel.textContent = c.ecoDriveLabel;
    } else {
      driveLink.style.display = 'none';
    }
  }

  // INT
  var iTag = document.getElementById('int-tag'); if(iTag && c.intTag) iTag.textContent = c.intTag;
  var iNom = document.getElementById('int-nombre'); if(iNom && c.intNombre) iNom.textContent = c.intNombre;
  var iSub = document.getElementById('int-sub'); if(iSub && c.intSub) iSub.textContent = c.intSub;
  var iDesc = document.getElementById('int-desc');
  if(iDesc && c.intDesc) {
    iDesc.innerHTML = c.intDesc.split('\n').filter(function(p){return p.trim();}).map(function(p){
      return '<p>' + escapeHtml(p).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>') + '</p>';
    }).join('');
  }
  var iAreas = document.getElementById('int-areas');
  if(iAreas && c.intAreas) {
    iAreas.innerHTML = c.intAreas.map(function(a){
      return '<div class="area-item" style="border-left-color:var(--c-accent)"><h4>' + escapeHtml(a.icono) + ' ' + escapeHtml(a.titulo) + '</h4><p>' + escapeHtml(a.desc) + '</p></div>';
    }).join('');
  }
  // INT imagen
  // Escudo comisión Internacional
  var escBol = document.getElementById('escudo-bolivia');
  if(escBol && c.intImagen) {
    escBol.innerHTML = '<img src="' + escapeHtml(c.intImagen) + '" alt="Escudo Internacional">';
    escBol.classList.add('has-img');
    escBol.style.display = 'flex';
  }
}

function renderFuncionarios(containerId, lista) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!lista || lista.length === 0) {
    el.innerHTML = '<p style="color:var(--c-muted);font-size:0.88rem">No hay funcionarios registrados.</p>';
    return;
  }
  el.innerHTML = lista.map(function(f) {
    const initials = f.nombre.split(' ').map(function(w){return w[0];}).join('').substring(0,3).toUpperCase();
    const avatarHtml = f.foto
      ? '<img src="' + escapeHtml(f.foto) + '" alt="' + escapeHtml(f.nombre) + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">'
      : escapeHtml(initials);
    const avatarStyle = f.foto ? 'background:transparent;overflow:hidden;' : '';
    return '<div class="funcionario-card">'
      + '<div class="funcionario-avatar" style="' + avatarStyle + '">' + avatarHtml + '</div>'
      + '<div class="funcionario-info">'
      + '<h4>' + escapeHtml(f.nombre) + '</h4>'
      + '<span>' + escapeHtml(f.descripcion) + '</span><br>'
      + '<span class="funcionario-cargo">' + escapeHtml(f.cargo) + '</span>'
      + '</div></div>';
  }).join('');
}

// Tabs comisiones
function showTab(id, el) {
  document.querySelectorAll('.ctab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.ctab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  if(el) el.classList.add('active');
}


function toggleMobileNav() {
  var drawer = document.getElementById('nav-mobile-drawer');
  var btn = document.getElementById('nav-menu-btn');
  drawer.classList.toggle('open');
  var isOpen = drawer.classList.contains('open');
  btn.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(4px,4px)' : '';
  btn.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '1';
  btn.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px,-4px)' : '';
}
function closeMobileNav() {
  document.getElementById('nav-mobile-drawer').classList.remove('open');
  var btn = document.getElementById('nav-menu-btn');
  btn.querySelectorAll('span').forEach(function(s){s.style.transform='';s.style.opacity='';});
}
// Close drawer on outside click
document.addEventListener('click', function(e) {
  var drawer = document.getElementById('nav-mobile-drawer');
  var btn = document.getElementById('nav-menu-btn');
  if(drawer && drawer.classList.contains('open') && !drawer.contains(e.target) && !btn.contains(e.target)) {
    closeMobileNav();
  }
});

// ── Modal global de compartir ─────────────────────────────────────────────────
function openShareModal(url, titulo) {
  var text    = encodeURIComponent((titulo || 'Noticia legislativa') + ' — Ver más en:');
  var encUrl  = encodeURIComponent(url);
  var modal   = document.getElementById('share-modal');
  var overlay = document.getElementById('share-overlay');

  document.getElementById('sm-titulo').textContent = titulo || 'Noticia';
  document.getElementById('sm-url-display').textContent = url;
  document.getElementById('sm-wa').href  = 'https://wa.me/?text=' + text + '%20' + encUrl;
  document.getElementById('sm-fb').href  = 'https://www.facebook.com/sharer/sharer.php?u=' + encUrl;
  document.getElementById('sm-tw').href  = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + encUrl;
  document.getElementById('sm-tg').href  = 'https://t.me/share/url?url=' + encUrl + '&text=' + text;
  document.getElementById('sm-copy-url').value = url;

  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('open');
  document.getElementById('share-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function copyModalLink() {
  var input = document.getElementById('sm-copy-url');
  var btn   = document.getElementById('sm-copy-btn');
  navigator.clipboard.writeText(input.value).then(function() {
    btn.textContent = '✅ ¡Copiado!';
    btn.style.background = '#16a34a';
    setTimeout(function(){ btn.textContent = '📋 Copiar'; btn.style.background = ''; }, 2200);
  }).catch(function() {
    input.select();
    document.execCommand('copy');
    btn.textContent = '✅ ¡Copiado!';
    setTimeout(function(){ btn.textContent = '📋 Copiar'; }, 2200);
  });
}

document.getElementById('share-overlay').addEventListener('click', closeShareModal);

render();