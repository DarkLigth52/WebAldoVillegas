// ── SEGURIDAD: Sanitización XSS ──────────────────────────────────────────────
// Escapa caracteres especiales HTML para prevenir inyección de scripts
function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitiza una URL — solo permite http y https
function sanitizeUrl(url) {
  if (!url) return '';
  url = url.trim();
  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) return '';
  return url.replace(/[<>"']/g, '');
}

// ── SEGURIDAD: Hash SHA-256 de contraseña ────────────────────────────────────
// La contraseña NUNCA se guarda en texto plano — solo su hash irreversible
async function hashPassword(pass) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(pass)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function isHash(str) {
  return typeof str === 'string' && /^[0-9a-f]{64}$/.test(str);
}

// ── SEGURIDAD: Token CSRF ─────────────────────────────────────────────────────
// Token aleatorio por carga de página — protege el formulario de login
const CSRF_TOKEN = (function() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
})();

// ── SEGURIDAD: Límites de tamaño de campos ───────────────────────────────────
// Evita saturar localStorage (límite ~5 MB del navegador)
const LIMITES = {
  nombre:      60,   slogan:      250,  partido:     100,
  propTitulo:  120,  propDesc:    500,  propIcono:   15,
  evTitulo:    180,  evDesc:      400,  evLugar:     150,
  evTipo:      60,   galPie:      150,
  credIcono:   15,   credTexto:   120,
  bioTexto:    3000, misionTxt:   1500, contactDesc: 400,
  cfgNombre:   80,   areaTitulo:  120,  areaDesc:    400,
  comNombre:   200,  comDesc:     2000,
  funcNombre:  100,  funcCargo:   120,  funcDesc:    200,
};
function truncar(str, max) {
  if (!str) return '';
  return String(str).substring(0, max);
}

// ── SEGURIDAD: Validación de estructura de datos ─────────────────────────────
// Protege contra localStorage manipulado manualmente o datos corruptos
function validarDatos(d) {
  if (!d || typeof d !== 'object') return null;
  if (typeof d.nombre1 !== 'string') d.nombre1 = 'Aldo';
  if (typeof d.nombre2 !== 'string') d.nombre2 = 'Villegas';
  if (typeof d.slogan  !== 'string') d.slogan  = '';
  if (typeof d.partido !== 'string') d.partido  = '';
  if (!Array.isArray(d.propuestas))   d.propuestas  = [];
  if (!Array.isArray(d.eventos))      d.eventos     = [];
  if (!Array.isArray(d.galeria))      d.galeria     = [];
  if (!Array.isArray(d.credenciales)) d.credenciales = [];
  if (!d.colores || typeof d.colores !== 'object') d.colores = TEMAS[0].c;
  if (!d.comision || typeof d.comision !== 'object') d.comision = null;
  if (typeof d.pass !== 'string' || d.pass === '') d.pass = '';
  if (typeof d.logoPartido !== 'string') d.logoPartido = '';
  if (!d.redes || typeof d.redes !== 'object') d.redes = {};
  return d;
}

// ── SEGURIDAD: Validación de contraseña fuerte ────────────────────────────────
function isStrongPassword(pass) {
  if (pass.length < 8)              return 'Mínimo 8 caracteres';
  if (!/[A-Z]/.test(pass))         return 'Debe incluir al menos una mayúscula';
  if (!/[0-9]/.test(pass))         return 'Debe incluir al menos un número';
  if (!/[^A-Za-z0-9]/.test(pass))  return 'Debe incluir al menos un símbolo (!@#$...)';
  return null;
}

const STORE_KEY = 'pagina_politica_v1';
let D = null;

// ── TEMAS PREDEFINIDOS ──────────────────────────────────────
const TEMAS = [
  {
    id:'patriota', nombre:'Patriota', desc:'Blanco · Azul · Rojo',
    c:{ primary:'#1B3A6B', primaryDk:'#122951', accent:'#C0392B', accentLt:'#E74C3C',
        bg:'#F8F9FC', bg2:'#FFFFFF', bg3:'#EEF1F7', text:'#1A1F2E', muted:'#5A6578', border:'#D4DBE8' }
  },
  {
    id:'republica', nombre:'República', desc:'Azul real · Dorado',
    c:{ primary:'#0D2B6B', primaryDk:'#071A45', accent:'#C5962A', accentLt:'#E0B040',
        bg:'#F7F8FC', bg2:'#FFFFFF', bg3:'#ECEEF5', text:'#12192E', muted:'#556070', border:'#CDD3E3' }
  },
  {
    id:'democracia', nombre:'Democracia', desc:'Verde · Blanco · Rojo',
    c:{ primary:'#145A32', primaryDk:'#0B3D22', accent:'#C0392B', accentLt:'#E74C3C',
        bg:'#F5FAF6', bg2:'#FFFFFF', bg3:'#E8F4EA', text:'#1A231C', muted:'#4A6050', border:'#C5DCC9' }
  },
  {
    id:'progresista', nombre:'Progresista', desc:'Azul eléctrico · Naranja',
    c:{ primary:'#1565C0', primaryDk:'#0D47A1', accent:'#E65100', accentLt:'#F57C00',
        bg:'#F4F7FD', bg2:'#FFFFFF', bg3:'#E8EFF9', text:'#0D1B35', muted:'#4A5A78', border:'#C8D5EE' }
  },
  {
    id:'elegante', nombre:'Elegante', desc:'Negro · Dorado',
    c:{ primary:'#1A1A2E', primaryDk:'#0D0D1A', accent:'#C9A84C', accentLt:'#E0C070',
        bg:'#F6F4F0', bg2:'#FFFFFF', bg3:'#EDEBE5', text:'#1A1A1A', muted:'#6A6058', border:'#D8D0C0' }
  },
  {
    id:'liberal', nombre:'Liberal', desc:'Azul cielo · Blanco',
    c:{ primary:'#1976D2', primaryDk:'#1155A0', accent:'#D32F2F', accentLt:'#EF5350',
        bg:'#F0F6FF', bg2:'#FFFFFF', bg3:'#E3EFFC', text:'#0D1E35', muted:'#4A6080', border:'#C2D8F0' }
  },
];

// ── COLORES PERSONALIZADOS (campos para editar) ─────────────
const COLOR_FIELDS = [
  { key:'primary',   label:'Color principal',     hint:'Azul nav, tarjetas' },
  { key:'primaryDk', label:'Color principal oscuro', hint:'Hover, footer' },
  { key:'accent',    label:'Color acento',         hint:'Botones, fechas' },
  { key:'accentLt',  label:'Acento claro',          hint:'Hover acento' },
  { key:'bg',        label:'Fondo general',         hint:'Fondo de secciones' },
  { key:'bg2',       label:'Fondo blanco',          hint:'Tarjetas, formularios' },
  { key:'text',      label:'Texto principal',       hint:'Títulos y cuerpo' },
  { key:'muted',     label:'Texto secundario',      hint:'Descripciones' },
  { key:'border',    label:'Bordes',                hint:'Líneas y divisores' },
];

let tempColors = null; // colores en edición (antes de guardar)

function defaults() {
  return {
    pass:'admin123', nombre1:'Tu', nombre2:'Nombre Aquí',
    slogan:'Tu eslogan político va aquí. Una frase poderosa que inspire a la ciudadanía.',
    partido:'Partido · Cargo', badge:'Senador 2025–2030', heroBg:'', sobreImg:'', logoPartido:'',
    sobreTexto:'Esta es tu sección biográfica.\n\nEdítala desde el panel de administración para contar tu historia política, tu trayectoria y tus valores.',
    propuestas:[
      {icono:'🏥',titulo:'Salud Pública',desc:'Garantizar acceso universal a la salud para todos los ciudadanos sin excepción.'},
      {icono:'📚',titulo:'Educación',desc:'Inversión en educación de calidad desde la primera infancia.'},
      {icono:'🌱',titulo:'Medio Ambiente',desc:'Políticas verdes para un futuro sostenible y justo.'},
      {icono:'🏗️',titulo:'Infraestructura',desc:'Modernizar vías, servicios y espacios públicos para todos.'},
    ],
    eventos:[
      {titulo:'Mitin de Apertura',fecha:'2025-07-15',lugar:'Plaza Central',desc:'Gran acto ciudadano.',tipo:'Mitin'},
      {titulo:'Debate Público',fecha:'2025-07-28',lugar:'Teatro Municipal',desc:'Encuentro con la ciudadanía.',tipo:'Debate'},
    ],
    galeria:[],
    email:'correo@ejemplo.com', tel:'+00 000 000 000',
    lugar:'Ciudad, País', contactoDesc:'¿Tienes preguntas o quieres unirte al movimiento? Escríbenos.',
    cfgNombre:'Nombre del Político',
    colores: TEMAS[0].c,
  };
}

function load(){
  try {
    const r = localStorage.getItem(STORE_KEY);
    const d = r ? JSON.parse(r) : defaults();
    const validated = validarDatos(d);
    if (!validated) return defaults();
    if (!validated.colores) validated.colores = TEMAS[0].c;
    return validated;
  } catch(e) {
    console.warn('localStorage corrupto — cargando valores por defecto:', e);
    return defaults();
  }
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(D)); }
function toast(msg){ const t=document.getElementById('toast'); t.textContent='✔ '+(msg||'Guardado'); t.style.display='block'; setTimeout(()=>t.style.display='none',2800); }

// LOGIN
// ── SEGURIDAD: Control de intentos fallidos ──────────────────────────────────
var _loginAttempts = 0;
var _lockoutUntil  = 0;
var _sessionTimer  = null;
var SESSION_TIMEOUT    = 30 * 60 * 1000; // 30 min inactividad
var SESSION_MAX_AGE    =  8 * 60 * 60 * 1000; // 8 h expiración absoluta

function _resetSessionTimer() {
  clearTimeout(_sessionTimer);
  // Verificar expiración absoluta (independiente de actividad)
  var start = parseInt(sessionStorage.getItem('admin_session_start') || '0');
  if (Date.now() - start > SESSION_MAX_AGE) {
    logout();
    alert('⏱️ Sesión expirada (8 horas). Inicia sesión de nuevo.');
    return;
  }
  _sessionTimer = setTimeout(function() {
    logout();
    alert('⏱️ Sesión cerrada por inactividad (30 minutos).');
  }, SESSION_TIMEOUT);
}

// Inyectar token CSRF en el campo oculto del formulario de login
(function() {
  var el = document.getElementById('csrf-token-field');
  if (el) el.value = CSRF_TOKEN;
})();

function login() {
  // ── Verificar CSRF token ─────────────────────────────────────
  var csrfField = document.getElementById('csrf-token-field');
  if (!csrfField || csrfField.value !== CSRF_TOKEN) {
    alert('Error de seguridad. Recarga la página e intenta de nuevo.');
    return;
  }

  // ── Verificar bloqueo por intentos ───────────────────────────
  var now = Date.now();
  if (_lockoutUntil > now) {
    var segsLeft = Math.ceil((_lockoutUntil - now) / 1000);
    var errEl = document.getElementById('login-error');
    if (errEl) {
      errEl.textContent = '🔒 Demasiados intentos. Espera ' + segsLeft + ' segundos.';
      errEl.style.display = 'block';
    }
    document.getElementById('pass-input').value = '';
    return;
  }

  D = load();
  var inputPass = document.getElementById('pass-input').value;

  // ── Verificación de contraseña (con soporte hash + migración) ─
  var doVerify = function(storedPass) {
    hashPassword(inputPass).then(function(inputHash) {
      var ok;
      if (isHash(storedPass)) {
        // Contraseña ya hasheada — comparar hashes
        ok = (inputHash === storedPass);
      } else {
        // Contraseña en texto plano (legado) — comparar directo y migrar
        ok = (inputPass === storedPass);
        if (ok) {
          // Migrar a hash automáticamente al primer login exitoso
          D.pass = inputHash;
          save();
        }
      }

      if (ok) {
        _loginAttempts = 0;
        _lockoutUntil  = 0;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        var ts = Date.now().toString();
        sessionStorage.setItem('admin_session', ts);
        sessionStorage.setItem('admin_session_start', ts); // expiración absoluta
        _resetSessionTimer();
        document.addEventListener('mousemove', _resetSessionTimer, { passive: true });
        document.addEventListener('keydown',   _resetSessionTimer, { passive: true });
        initApp();
      } else {
        _loginAttempts++;
        document.getElementById('pass-input').value = '';
        var errEl = document.getElementById('login-error');
        var remaining = 3 - _loginAttempts;
        if (_loginAttempts >= 3) {
          _lockoutUntil = Date.now() + 60000;
          _loginAttempts = 0;
          if (errEl) {
            errEl.textContent = '🔒 Demasiados intentos. Bloqueado por 60 segundos.';
            errEl.style.display = 'block';
          }
        } else {
          if (errEl) {
            errEl.textContent = '❌ Contraseña incorrecta. ' + remaining + ' intento(s) restante(s).';
            errEl.style.display = 'block';
          }
        }
      }
    });
  };

  doVerify(D.pass);
}

function logout() {
  clearTimeout(_sessionTimer);
  sessionStorage.removeItem('admin_session');
  sessionStorage.removeItem('admin_session_start');
  document.removeEventListener('mousemove', _resetSessionTimer);
  document.removeEventListener('keydown',   _resetSessionTimer);
  D = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display          = 'none';
  document.getElementById('pass-input').value           = '';
  var errEl = document.getElementById('login-error');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
}
document.getElementById('pass-input').addEventListener('keydown',e=>{ if(e.key==='Enter')login(); });

// PAGES
const PAGE_TITLES = {dashboard:'Dashboard',hero:'Hero & Portada',sobre:'Sobre Mí',propuestas:'Propuestas',eventos:'Eventos',galeria:'Galería',redes:'Redes Sociales',contacto:'Contacto',comisiones:'Comisiones',funcionarios:'Funcionarios',colores:'Colores del Sitio',config:'Configuración'};
function go(id, el){
  // Hide all pages
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });

  // Show target page
  var targetPage = document.getElementById('page-'+id);
  if(targetPage) targetPage.classList.add('active');

  // Close mobile sidebar
  if(window.innerWidth <= 768) closeSidebar();

  // Activate nav item
  if(el) {
    el.classList.add('active');
  } else {
    var prefix = (PAGE_TITLES[id] || id).substring(0,4).toLowerCase();
    document.querySelectorAll('.nav-item').forEach(function(n){
      if(n.textContent.trim().toLowerCase().startsWith(prefix)) n.classList.add('active');
    });
  }

  // Update topbar title
  var tbTitle = document.getElementById('tb-title');
  if(tbTitle) tbTitle.textContent = PAGE_TITLES[id] || id;
  if(id==='colores') renderColorPage();
  // Lazy-fill forms when navigating to pages with inputs
  if(id==='mision') {
    setVal('f-mision-titulo', D.misionTitulo || 'Compromiso con Bolivia');
    setVal('f-mision-texto', D.misionTexto || '');
    setVal('f-vision-titulo', D.visionTitulo || 'Bolivia Próspera e Integrada');
    setVal('f-vision-texto', D.visionTexto || '');
  }
  if(id==='comisiones') { fillComisiones(); renderComAreasLista('eco'); renderComAreasLista('int'); }
  if(id==='funcionarios') { renderFuncListas(); }
  if(id==='sobre') {
    setVal('f-sobre-titulo', D.sobreTitulo || '');
    setVal('f-sobre-lead', D.sobreLeadDesc || '');
    setVal('f-sobre-texto', D.sobreTexto || '');
    if(D.sobreImg) setImg('sobre-preview', D.sobreImg);
    if(D.logoPartido) setImg('logo-partido-preview', D.logoPartido);
    renderCredLista();
  }
  if(id==='contacto') {
    setVal('f-c-email', D.contactoEmail || D.email || '');
    setVal('f-c-emailp', D.contactoEmailP || '');
    setVal('f-c-tel1', D.contactoTel1 || D.tel || '');
    setVal('f-c-tel2', D.contactoTel2 || '');
    setVal('f-c-lugar', D.lugar || '');
    setVal('f-c-desc', D.contactoDesc || '');
  }
  if(id==='redes') {
    var r = D.redes || {};
    setVal('f-red-fb', r.fb || '');
    setVal('f-red-of', r.of || '');
    setVal('f-red-ig', r.ig || '');
    setVal('f-red-tw', r.tw || '');
    setVal('f-red-tk', r.tk || '');
    setVal('f-red-yt', r.yt || '');
    setVal('f-red-tg', r.tg || '');
    setVal('f-red-wa', r.wa || '');
    setVal('f-red-cv', r.cv || '');
  }
  if(id==='config') setVal('f-cfg-nombre', D.cfgNombre || '');
  if(id==='hero') {
    setVal('f-nombre1', D.nombre1 || '');
    setVal('f-nombre2', D.nombre2 || '');
    setVal('f-slogan', D.slogan || '');
    setVal('f-partido', D.partido || '');
    setVal('f-badge', D.badge || '');
    if(D.heroBg) setImg('hero-preview', D.heroBg);
  }
  if(id==='propuestas') { setVal('f-prop-icono',''); setVal('f-prop-titulo',''); setVal('f-prop-desc',''); }
  if(id==='dashboard') renderDashboard();
}

// INIT
function initApp(){
  D=load();
  tempColors = {...D.colores};
  document.getElementById('sb-nombre').textContent = D.cfgNombre;
  document.getElementById('sb-emblem').textContent = (D.nombre1[0]||'N').toUpperCase();
  document.getElementById('tb-badge').textContent = D.cfgNombre;
  fillForms(); renderListas(); renderDashboard(); renderFuncListas(); renderCredLista(); fillComisiones();
}

function setVal(id, val) {
  var el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}
function setImg(id, src) {
  var el = document.getElementById(id);
  if (el && src) { el.src = src; el.style.display = 'block'; }
  // Mostrar botón quitar si es el logo del partido
  if (id === 'logo-partido-preview') {
    var btn = document.getElementById('btn-quitar-logo');
    if (btn) btn.style.display = src ? 'inline-block' : 'none';
  }
}

function quitarLogoPartido() {
  D.logoPartido = '';
  var prev = document.getElementById('logo-partido-preview');
  if (prev) { prev.src = ''; prev.style.display = 'none'; }
  var btn = document.getElementById('btn-quitar-logo');
  if (btn) btn.style.display = 'none';
  var input = document.getElementById('f-logo-partido-file');
  if (input) input.value = '';
  save();
  toast('Logo eliminado');
}

function fillForms() {
  // Hero
  setVal('f-nombre1', D.nombre1);
  setVal('f-nombre2', D.nombre2);
  setVal('f-slogan', D.slogan);
  setVal('f-partido', D.partido);
  setVal('f-badge', D.badge || '');
  if (D.heroBg) setImg('hero-preview', D.heroBg);

  // Sobre Mí
  if (D.sobreImg) setImg('sobre-preview', D.sobreImg);
  if (D.logoPartido) setImg('logo-partido-preview', D.logoPartido);
  setVal('f-sobre-titulo', D.sobreTitulo || 'Lic. Aldo Sergio Villegas Mora');
  setVal('f-sobre-lead', D.sobreLeadDesc || '');
  setVal('f-sobre-texto', D.sobreTexto || '');

  // Misión & Visión
  setVal('f-mision-titulo', D.misionTitulo || 'Compromiso con Bolivia');
  setVal('f-mision-texto', D.misionTexto || '');
  setVal('f-vision-titulo', D.visionTitulo || 'Bolivia Próspera e Integrada');
  setVal('f-vision-texto', D.visionTexto || '');

  // Contacto
  setVal('f-c-email', D.contactoEmail || D.email || '');
  setVal('f-c-emailp', D.contactoEmailP || '');
  setVal('f-c-tel1', D.contactoTel1 || D.tel || '');
  setVal('f-c-tel2', D.contactoTel2 || '');
  setVal('f-c-lugar', D.lugar || '');
  setVal('f-c-desc', D.contactoDesc || '');

  // Config
  setVal('f-cfg-nombre', D.cfgNombre || '');

  // Comisiones (fill only if page elements exist)
  fillComisiones();
  renderCredLista();
  renderFuncListas();
}

function renderListas(){
  // propuestas
  document.getElementById('prop-count').textContent=D.propuestas.length;
  document.getElementById('lista-propuestas').innerHTML=D.propuestas.map((p,i)=>`
    <div class="item-row">
      <div class="item-row-info"><strong>${sanitize(p.icono)} ${sanitize(p.titulo)}</strong><span>${sanitize(p.desc.substring(0,80))}${p.desc.length>80?'...':''}</span></div>
      <button class="btn btn-danger btn-sm" onclick="elimProp(${i})">Eliminar</button>
    </div>`).join('') || '<p style="color:var(--muted);font-size:0.86rem">No hay propuestas.</p>';

  // eventos
  const evs=[...D.eventos].sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
  document.getElementById('ev-count').textContent=D.eventos.length;
  document.getElementById('lista-eventos').innerHTML=evs.map((e)=>{
    const idx=D.eventos.findIndex(x=>x.titulo===e.titulo&&x.fecha===e.fecha);
    const mapBadge = e.mapLink
      ? '<span style="background:rgba(27,58,107,0.1);color:var(--c-primary);padding:0.1rem 0.45rem;font-size:0.68rem;font-weight:700;margin-left:0.4rem;" title="'+sanitize(e.mapLink)+'">🗺️ Maps</span>'
      : '<span style="color:var(--muted);font-size:0.72rem;margin-left:0.4rem;">Sin mapa</span>';
    return`<div class="item-row">
      <div class="item-row-info"><strong>${sanitize(e.titulo)}</strong><span>📅 ${sanitize(e.fecha)} · 📍 ${sanitize(e.lugar)}${mapBadge}</span></div>
      <span class="item-tag">${sanitize(e.tipo)}</span>
      <button class="btn btn-danger btn-sm" onclick="elimEv(${idx})">Eliminar</button>
    </div>`;
  }).join('') || '<p style="color:var(--muted);font-size:0.86rem">No hay eventos.</p>';

  // galería
  var galCount = document.getElementById('gal-count');
  var gg = document.getElementById('gal-grid');
  var ge = document.getElementById('gal-empty');
  if(galCount) galCount.textContent = D.galeria.length;
  if(!gg) return;
  if(D.galeria.length===0){gg.innerHTML='';if(ge)ge.style.display='block';}
  else{
    if(ge) ge.style.display='none';
    var rows='';
    for(var gi=0;gi<D.galeria.length;gi++){
      var g=D.galeria[gi];
      var linkBadge = g.link ? '<span style="background:#e8f4fd;color:#1565C0;padding:0.1rem 0.4rem;font-size:0.66rem;font-weight:700;margin-left:0.3rem;" title="'+sanitize(g.link)+'">🔗</span>' : '';
      rows+='<div class="gal-item">'
        +'<img src="'+sanitize(g.src)+'" alt="'+sanitize(g.pie||'')+'" title="'+sanitize(g.pie||'')+'">'
        +'<button class="gal-del" data-idx="'+gi+'" onclick="elimGalBtn(this)">✕</button>'
        +'</div>';
    }
    gg.innerHTML=rows;
  }
}

function renderDashboard(){
  function setText(id, val) { var e=document.getElementById(id); if(e) e.textContent=val; }
  setText('st-prop', D.propuestas.length);
  setText('st-ev', D.eventos.length);
  setText('st-gal', D.galeria.length);
  setText('st-img', D.heroBg ? '✔' : '✕');
  const hoy=new Date();
  const evs=[...D.eventos].filter(e=>new Date(e.fecha+'T12:00:00')>=hoy).sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
  const prox=document.getElementById('dash-proximo');
  if(evs.length){const e=evs[0];prox.innerHTML=`<strong style="font-size:1rem">${sanitize(e.titulo)}</strong><br><span style="color:var(--muted);font-size:0.84rem">📅 ${sanitize(e.fecha)} &nbsp;·&nbsp; 📍 ${sanitize(e.lugar)} &nbsp;·&nbsp; <span class="item-tag">${sanitize(e.tipo)}</span></span>`;}
  else prox.innerHTML='<span style="color:var(--muted)">No hay eventos próximos programados.</span>';
}

// ══ COLOR PAGE ══════════════════════════════════════════════
function renderColorPage(){
  // TEMAS
  const tg = document.getElementById('themes-grid');
  tg.innerHTML = TEMAS.map(t=>`
    <div class="theme-chip ${JSON.stringify(D.colores)===JSON.stringify(t.c)?'selected':''}" onclick="aplicarTema('${t.id}')">
      <div class="theme-swatch">
        <span style="background:${t.c.primary}"></span>
        <span style="background:${t.c.bg2}"></span>
        <span style="background:${t.c.accent}"></span>
      </div>
      <div>${t.nombre}</div>
      <div style="font-weight:400;font-size:0.68rem;color:var(--muted)">${t.desc}</div>
    </div>`).join('');

  // BARRA PREVIEW
  renderPreviewBar();

  // CAMPOS PERSONALIZADOS
  const cg = document.getElementById('custom-colors-grid');
  cg.innerHTML = COLOR_FIELDS.map(f=>`
    <div class="color-pick">
      <label>${f.label}</label>
      <div class="color-pick-row">
        <input type="color" value="${tempColors[f.key]||'#000000'}" id="cp-${f.key}"
          oninput="syncColorField('${f.key}',this.value)">
        <input type="text" value="${tempColors[f.key]||'#000000'}" id="ct-${f.key}" maxlength="7"
          oninput="syncColorPicker('${f.key}',this.value)" placeholder="#000000">
      </div>
      <div style="font-size:0.68rem;color:var(--muted);margin-top:0.2rem">${f.hint}</div>
    </div>`).join('');
}

function renderPreviewBar(){
  const bar = document.getElementById('color-preview-bar');
  if(!bar) return;
  const keys = ['primary','accent','bg2','bg3','text','muted','border'];
  bar.innerHTML = keys.map(k=>`<span style="background:${tempColors[k]||'#ccc'}" title="${k}"></span>`).join('');
}

function syncColorField(key, val){
  tempColors[key] = val;
  const tf = document.getElementById('ct-'+key);
  if(tf) tf.value = val;
  renderPreviewBar();
}
function syncColorPicker(key, val){
  if(/^#[0-9A-Fa-f]{6}$/.test(val)){
    tempColors[key] = val;
    const cp = document.getElementById('cp-'+key);
    if(cp) cp.value = val;
    renderPreviewBar();
  }
}
function aplicarTema(id){
  const t = TEMAS.find(x=>x.id===id);
  if(!t) return;
  tempColors = {...t.c};
  renderColorPage();
}
function guardarColores(){
  D.colores = {...tempColors};
  save(); toast('Colores aplicados al sitio'); renderColorPage();
}
function resetColores(){
  tempColors = {...TEMAS[0].c};
  renderColorPage(); toast('Colores restaurados');
}

// ── FILE → base64 ───────────────────────────────────────────
function fileToData(input, field, previewId){
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    D[field]=e.target.result;
    const p=document.getElementById(previewId);
    if(p){ p.src=e.target.result; p.style.display='block'; }
    // Mostrar botón quitar si es el logo del partido
    if(field === 'logoPartido') {
      var btn = document.getElementById('btn-quitar-logo');
      if(btn) btn.style.display = 'inline-block';
    }
    save();
    toast('Imagen cargada y guardada ✓');
  };
  r.readAsDataURL(file);
}

// ── GUARDAR SECCIONES ───────────────────────────────────────
function guardarHero(){
  D.nombre1 = truncar(sanitize(document.getElementById('f-nombre1').value.trim()), LIMITES.nombre)  || D.nombre1;
  D.nombre2 = truncar(sanitize(document.getElementById('f-nombre2').value.trim()), LIMITES.nombre)  || D.nombre2;
  D.slogan  = truncar(sanitize(document.getElementById('f-slogan').value),          LIMITES.slogan);
  D.partido = truncar(sanitize(document.getElementById('f-partido').value),         LIMITES.partido);
  D.badge   = truncar(sanitize(document.getElementById('f-badge').value),           LIMITES.partido);
  save(); toast('Hero guardado'); renderDashboard();
}
function guardarSobre(){
  D.sobreTitulo   = truncar(document.getElementById('f-sobre-titulo').value, LIMITES.funcNombre * 2);
  D.sobreLeadDesc = truncar(document.getElementById('f-sobre-lead').value,   LIMITES.contactDesc);
  D.sobreTexto    = truncar(document.getElementById('f-sobre-texto').value,   LIMITES.bioTexto);
  // La imagen se guarda en tiempo real via fileToData() — no se toca aquí
  save(); toast('Sobre Mí guardado');
}

function guardarMision(){
  D.misionTitulo = truncar(sanitize(document.getElementById('f-mision-titulo').value), LIMITES.comNombre);
  D.misionTexto  = truncar(sanitize(document.getElementById('f-mision-texto').value),  LIMITES.misionTxt);
  D.visionTitulo = truncar(sanitize(document.getElementById('f-vision-titulo').value), LIMITES.comNombre);
  D.visionTexto  = truncar(sanitize(document.getElementById('f-vision-texto').value),  LIMITES.misionTxt);
  save(); toast('Misión & Visión guardados');
}

// ── CREDENCIALES ──────────────────────────────────────────────────────────────
function agregarCredencial(){
  const icono = truncar(document.getElementById('f-cred-icono').value.trim() || '📌', LIMITES.credIcono);
  const texto = truncar(document.getElementById('f-cred-texto').value.trim(), LIMITES.credTexto);
  if(!texto){ alert('Escribe el texto de la credencial.'); return; }
  if(!D.credenciales) D.credenciales = [];
  D.credenciales.push({icono, texto});
  document.getElementById('f-cred-icono').value = '';
  document.getElementById('f-cred-texto').value = '';
  save(); renderCredLista(); toast('Credencial añadida');
}

function elimCredencial(i){
  if(!D.credenciales) return;
  D.credenciales.splice(i,1);
  save(); renderCredLista();
}

function renderCredLista() {
  var el = document.getElementById('lista-credenciales');
  if (!el) return;
  var creds = D.credenciales || [];
  if (creds.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">No hay credenciales.</p>';
    return;
  }
  var rows = '';
  for (var i = 0; i < creds.length; i++) {
    var c = creds[i];
    rows += '<div class="item-row">'
      + '<div class="item-row-info"><strong>' + sanitize(c.icono) + ' ' + sanitize(c.texto) + '</strong></div>'
      + '<button class="btn btn-danger btn-sm" data-idx="' + i + '" onclick="elimCredencialBtn(this)">Eliminar</button>'
      + '</div>';
  }
  el.innerHTML = rows;
}

// propuestas
function agregarPropuesta(){
  const icono  = truncar(document.getElementById('f-prop-icono').value  || '📌', LIMITES.propIcono);
  const titulo = truncar(document.getElementById('f-prop-titulo').value.trim(),   LIMITES.propTitulo);
  const desc   = truncar(document.getElementById('f-prop-desc').value.trim(),     LIMITES.propDesc);
  if(!titulo||!desc){alert('Completa el título y la descripción.');return;}
  D.propuestas.push({icono,titulo,desc});
  document.getElementById('f-prop-titulo').value='';
  document.getElementById('f-prop-desc').value='';
  document.getElementById('f-prop-icono').value='';
  save(); renderListas(); renderDashboard(); toast('Propuesta añadida');
}
function elimProp(i){if(confirm('¿Eliminar esta propuesta?')){D.propuestas.splice(i,1);save();renderListas();renderDashboard();}}

// eventos
function agregarEvento(){
  const titulo  = truncar(document.getElementById('f-ev-titulo').value.trim(), LIMITES.evTitulo);
  const fecha   = document.getElementById('f-ev-fecha').value;
  const lugar   = truncar(document.getElementById('f-ev-lugar').value.trim(),  LIMITES.evLugar);
  const desc    = truncar(document.getElementById('f-ev-desc').value.trim(),   LIMITES.evDesc);
  const tipo    = truncar(document.getElementById('f-ev-tipo').value,          LIMITES.evTipo);
  const mapLink  = sanitizeUrl(document.getElementById('f-ev-maplink').value.trim());
  const registro = sanitizeUrl(document.getElementById('f-ev-registro').value.trim());
  if(!titulo||!fecha||!lugar){alert('Completa título, fecha y lugar.');return;}
  D.eventos.push({titulo,fecha,lugar,desc,tipo,mapLink,registro});
  document.getElementById('f-ev-titulo').value   = '';
  document.getElementById('f-ev-fecha').value    = '';
  document.getElementById('f-ev-lugar').value    = '';
  document.getElementById('f-ev-desc').value     = '';
  document.getElementById('f-ev-maplink').value  = '';
  document.getElementById('f-ev-registro').value = '';
  save(); renderListas(); renderDashboard(); toast('Evento añadido');
}
function elimEv(i){if(confirm('¿Eliminar este evento?')){D.eventos.splice(i,1);save();renderListas();renderDashboard();}}

// galería
// Galería - archivo pendiente para confirmar
let galeriaFilesPending = [];

function previewGaleriaFiles(input) {
  galeriaFilesPending = Array.from(input.files);
  const label = document.getElementById('gal-file-label');
  const strip = document.getElementById('gal-preview-strip');
  if (!galeriaFilesPending.length) return;

  if (galeriaFilesPending.length === 1) {
    label.textContent = galeriaFilesPending[0].name;
  } else {
    label.textContent = galeriaFilesPending.length + ' imágenes seleccionadas';
  }

  // Show preview thumbnails
  strip.style.display = 'flex';
  strip.innerHTML = '';
  galeriaFilesPending.forEach(function(file) {
    var r = new FileReader();
    r.onload = function(e) {
      var img = document.createElement('img');
      img.src = e.target.result;
      img.style.cssText = 'width:60px;height:60px;object-fit:cover;border:2px solid var(--border);border-radius:2px;';
      strip.appendChild(img);
    };
    r.readAsDataURL(file);
  });
}

function confirmarSubirGaleria() {
  if (!galeriaFilesPending.length) {
    alert('Primero selecciona al menos una imagen haciendo clic en la zona de selección.');
    return;
  }
  var pie  = truncar(document.getElementById('f-gal-pie').value.trim(), LIMITES.galPie);
  var link = document.getElementById('f-gal-link') ? sanitizeUrl(document.getElementById('f-gal-link').value.trim()) : '';
  var loaded = 0;
  galeriaFilesPending.forEach(function(file, idx) {
    var r = new FileReader();
    r.onload = function(e) {
      var desc = galeriaFilesPending.length === 1 ? (pie || file.name) : (pie ? pie + ' (' + (idx+1) + ')' : file.name);
      D.galeria.push({src: e.target.result, pie: desc, link: link});
      loaded++;
      if (loaded === galeriaFilesPending.length) {
        save(); renderListas(); renderDashboard();
        galeriaFilesPending = [];
        document.getElementById('f-gal-file').value = '';
        document.getElementById('f-gal-pie').value = '';
        var linkEl = document.getElementById('f-gal-link');
        if(linkEl) linkEl.value = '';
        document.getElementById('gal-file-label').textContent = 'Seleccionar imagen(es)';
        document.getElementById('gal-preview-strip').style.display = 'none';
        document.getElementById('gal-preview-strip').innerHTML = '';
        toast('✅ ' + loaded + ' noticia' + (loaded > 1 ? 's subidas' : ' subida') + ' correctamente');
      }
    };
    r.readAsDataURL(file);
  });
}

function subirGaleria(input) {
  // kept for compatibility - now handled by previewGaleriaFiles + confirmarSubirGaleria
  previewGaleriaFiles(input);
}
function elimGal(i){D.galeria.splice(i,1);save();renderListas();renderDashboard();}
function elimGalBtn(btn){elimGal(parseInt(btn.getAttribute('data-idx')));}

// contacto
function guardarRedes(){
  if(!D.redes) D.redes = {};
  D.redes.fb = sanitizeUrl(document.getElementById('f-red-fb').value.trim());
  D.redes.of = sanitizeUrl(document.getElementById('f-red-of').value.trim());
  D.redes.ig = sanitizeUrl(document.getElementById('f-red-ig').value.trim());
  D.redes.tw = sanitizeUrl(document.getElementById('f-red-tw').value.trim());
  D.redes.tk = sanitizeUrl(document.getElementById('f-red-tk').value.trim());
  D.redes.yt = sanitizeUrl(document.getElementById('f-red-yt').value.trim());
  D.redes.tg = sanitizeUrl(document.getElementById('f-red-tg').value.trim());
  D.redes.wa = sanitizeUrl(document.getElementById('f-red-wa').value.trim());
  D.redes.cv = sanitizeUrl(document.getElementById('f-red-cv').value.trim());
  save(); toast('✅ Redes sociales guardadas');
}

function guardarContacto(){
  D.contactoEmail = document.getElementById('f-c-email').value;
  D.contactoEmailP = document.getElementById('f-c-emailp').value;
  D.contactoTel1 = document.getElementById('f-c-tel1').value;
  D.contactoTel2 = document.getElementById('f-c-tel2').value;
  D.lugar = document.getElementById('f-c-lugar').value;
  D.contactoDesc = sanitize(document.getElementById('f-c-desc').value);
  // backwards compat
  D.email = D.contactoEmail;
  D.tel = D.contactoTel1;
  save(); toast('Contacto guardado');
}

// config
function guardarConfig(){
  D.cfgNombre = truncar(document.getElementById('f-cfg-nombre').value, LIMITES.cfgNombre);
  document.getElementById('sb-nombre').textContent = D.cfgNombre;
  document.getElementById('tb-badge').textContent  = D.cfgNombre;
  save(); toast('Configuración guardada');
}
function cambiarPass(){
  var p1 = document.getElementById('f-pass1').value;
  var p2 = document.getElementById('f-pass2').value;
  if (!p1) { alert('Ingresa la nueva contraseña.'); return; }
  if (p1 !== p2) { alert('Las contraseñas no coinciden.'); return; }
  var weakReason = isStrongPassword(p1);
  if (weakReason) { alert('⚠️ Contraseña débil: ' + weakReason); return; }
  // Guardar como hash SHA-256 — nunca en texto plano
  hashPassword(p1).then(function(hash) {
    D.pass = hash;
    document.getElementById('f-pass1').value = '';
    document.getElementById('f-pass2').value = '';
    save(); toast('🔐 Contraseña actualizada y cifrada correctamente');
  });
}
function resetearTodo(){
  if(confirm('¿Seguro? Se borrarán TODOS los datos. Esta acción no se puede deshacer.')){
    localStorage.removeItem(STORE_KEY); location.reload();
  }
}

// ── FUNCIONARIOS ──────────────────────────────────────────────────────────────
const DEFAULT_FUNC_ECO = [
  { nombre:'Aldo Sergio Villegas Mora', descripcion:'Senador — Cochabamba', cargo:'3ra. Secretaría · Comercio, Turismo y MYPEs', foto:'' },
  { nombre:'Brigada Parlamentaria CB', descripcion:'Cochabamba', cargo:'Coordinación General', foto:'' },
];
const DEFAULT_FUNC_INT = [
  { nombre:'Aldo Sergio Villegas Mora', descripcion:'Senador — Cochabamba · Alianza Libre', cargo:'Miembro · Comité Rel. Económicas', foto:'' },
  { nombre:'Cámara de Senadores', descripcion:'Bolivia', cargo:'Secretaría de la Comisión', foto:'' },
];

// Temp foto store while adding
let tempFotoEco = '';
let tempFotoInt = '';

function showFTab(id, el) {
  document.getElementById('ftab-content-eco').style.display = id==='eco' ? 'block' : 'none';
  document.getElementById('ftab-content-int').style.display = id==='int' ? 'block' : 'none';
  document.querySelectorAll('.ftab').forEach(t => {
    t.style.color = 'var(--muted)';
    t.style.borderBottomColor = 'transparent';
  });
  if(el) {
    el.style.color = 'var(--c-primary)';
    el.style.borderBottomColor = 'var(--c-primary)';
  }
}

function previewFuncPhoto(input, tipo) {
  const file = input.files[0]; if(!file) return;
  const r = new FileReader();
  r.onload = e => {
    if(tipo === 'eco') {
      tempFotoEco = e.target.result;
      const p = document.getElementById('fe-foto-preview');
      p.src = e.target.result; p.style.display='block';
      p.style.borderRadius = '50%'; p.style.height = '60px'; p.style.width = '60px'; p.style.objectFit = 'cover';
    } else {
      tempFotoInt = e.target.result;
      const p = document.getElementById('fi-foto-preview');
      p.src = e.target.result; p.style.display='block';
      p.style.borderRadius = '50%'; p.style.height = '60px'; p.style.width = '60px'; p.style.objectFit = 'cover';
    }
  };
  r.readAsDataURL(file);
}

function agregarFuncionario(tipo) {
  const prefix = tipo === 'eco' ? 'fe' : 'fi';
  const nombre = document.getElementById(`f-f${prefix[1]}-nombre`).value.trim();
  const cargo  = document.getElementById(`f-f${prefix[1]}-cargo`).value.trim();
  const desc   = document.getElementById(`f-f${prefix[1]}-desc`).value.trim();
  const fotoUrl= document.getElementById(`f-f${prefix[1]}-foto-url`).value.trim();
  const foto   = tipo === 'eco' ? (tempFotoEco || fotoUrl) : (tempFotoInt || fotoUrl);

  if(!nombre || !cargo) { alert('Completa al menos el nombre y el cargo.'); return; }

  const entry = { nombre, cargo, descripcion: desc, foto };
  if(tipo === 'eco') {
    if(!D.funcionariosEco) D.funcionariosEco = [...DEFAULT_FUNC_ECO];
    D.funcionariosEco.push(entry);
    tempFotoEco = '';
    document.getElementById('f-fe-nombre').value = '';
    document.getElementById('f-fe-cargo').value  = '';
    document.getElementById('f-fe-desc').value   = '';
    document.getElementById('f-fe-foto-url').value = '';
    const p = document.getElementById('fe-foto-preview'); p.style.display='none'; p.src='';
  } else {
    if(!D.funcionariosInt) D.funcionariosInt = [...DEFAULT_FUNC_INT];
    D.funcionariosInt.push(entry);
    tempFotoInt = '';
    document.getElementById('f-fi-nombre').value = '';
    document.getElementById('f-fi-cargo').value  = '';
    document.getElementById('f-fi-desc').value   = '';
    document.getElementById('f-fi-foto-url').value = '';
    const p = document.getElementById('fi-foto-preview'); p.style.display='none'; p.src='';
  }
  save(); renderFuncListas(); toast('Funcionario añadido');
}

function elimFuncionario(tipo, i) {
  if(!confirm('¿Eliminar este funcionario?')) return;
  if(tipo === 'eco') {
    if(!D.funcionariosEco) D.funcionariosEco = [...DEFAULT_FUNC_ECO];
    D.funcionariosEco.splice(i, 1);
  } else {
    if(!D.funcionariosInt) D.funcionariosInt = [...DEFAULT_FUNC_INT];
    D.funcionariosInt.splice(i, 1);
  }
  save(); renderFuncListas();
}

function renderFuncListas() {
  const listEco = document.getElementById('lista-func-eco');
  const listInt = document.getElementById('lista-func-int');
  const feCount = document.getElementById('fe-count');
  const fiCount = document.getElementById('fi-count');

  const ecoData = D.funcionariosEco || DEFAULT_FUNC_ECO;
  const intData = D.funcionariosInt || DEFAULT_FUNC_INT;

  if(feCount) feCount.textContent = ecoData.length;
  if(fiCount) fiCount.textContent = intData.length;

  const renderList = (lista, tipo, container) => {
    if(!container) return;
    container.innerHTML = lista.map((f, i) => {
      const initials = f.nombre.split(' ').map(w=>w[0]).join('').substring(0,3).toUpperCase();
      const avatarHtml = f.foto
        ? `<img src="${sanitize(f.foto)}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0;" alt="">`
        : `<div style="width:36px;height:36px;border-radius:50%;background:var(--c-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;flex-shrink:0;">${sanitize(initials)}</div>`;
      return `<div class="item-row">
        ${avatarHtml}
        <div class="item-row-info">
          <strong>${sanitize(f.nombre)}</strong>
          <span>${sanitize(f.cargo)} · ${sanitize(f.descripcion)}</span>
        </div>
        <button class="btn btn-danger btn-sm" onclick="elimFuncionario('${tipo}',${i})">Eliminar</button>
      </div>`;
    }).join('') || '<p style="color:var(--muted);font-size:0.86rem">No hay funcionarios.</p>';
  };

  renderList(ecoData, 'eco', listEco);
  renderList(intData, 'int', listInt);
}


// ── COMISIONES ────────────────────────────────────────────────────────────────
function getComision() {
  if(!D.comision) D.comision = defaults().comision || {};
  return D.comision;
}

function showCTab(id, el) {
  ['gen','eco','int'].forEach(function(t){
    var c = document.getElementById('ctab2-content-'+t);
    if(c) c.style.display = 'none';
  });
  document.querySelectorAll('.ctab2').forEach(function(t){
    t.style.color='var(--muted)';t.style.borderBottomColor='transparent';
  });
  var content = document.getElementById('ctab2-content-'+id);
  if(content) content.style.display = 'block';
  if(el){ el.style.color='var(--c-primary)'; el.style.borderBottomColor='var(--c-primary)'; }
  fillComisiones();
  if(id==='eco') renderComAreasLista('eco');
  if(id==='int') renderComAreasLista('int');
}

function fillComisiones() {
  // Only fill if comisiones page elements exist in DOM
  if (!document.getElementById('f-com-titulo')) return;
  var c = getComision();
  var set = function(id, val){ var el=document.getElementById(id); if(el&&val!==undefined) el.value=val; };
  set('f-com-titulo', c.seccionTitulo);
  set('f-com-lead', c.seccionLead);
  set('f-eco-tablabel', c.ecoTabLabel);
  set('f-eco-tag', c.ecoTag);
  set('f-eco-nombre', c.ecoNombre);
  set('f-eco-sub', c.ecoSub);
  set('f-eco-desc', c.ecoDesc);
  set('f-eco-drive', c.ecoDriveLink);
  set('f-eco-drive-label', c.ecoDriveLabel);
  set('f-int-tablabel', c.intTabLabel);
  set('f-int-tag', c.intTag);
  set('f-int-nombre', c.intNombre);
  set('f-int-sub', c.intSub);
  set('f-int-desc', c.intDesc);
  if(c.ecoImagen){ var p=document.getElementById('eco-img-preview'); if(p){p.src=c.ecoImagen;p.style.display='block';} }
  if(c.intImagen){ var p=document.getElementById('int-img-preview'); if(p){p.src=c.intImagen;p.style.display='block';} }
  renderComAreasLista('eco');
  renderComAreasLista('int');
}

function subirComImg(input, tipo) {
  var file = input.files[0]; if(!file) return;
  var r = new FileReader();
  r.onload = function(e) {
    var c = getComision();
    if(tipo==='eco') c.ecoImagen = e.target.result;
    else c.intImagen = e.target.result;
    var prevId = tipo==='eco' ? 'eco-img-preview' : 'int-img-preview';
    var prev = document.getElementById(prevId);
    if(prev){ prev.src=e.target.result; prev.style.display='block'; }
  };
  r.readAsDataURL(file);
}

function guardarComGeneral() {
  var c = getComision();
  c.seccionTitulo = document.getElementById('f-com-titulo').value;
  c.seccionLead = document.getElementById('f-com-lead').value;
  save(); toast('Títulos guardados');
}

function guardarComEco() {
  var c = getComision();
  c.ecoTabLabel  = document.getElementById('f-eco-tablabel').value;
  c.ecoTag       = document.getElementById('f-eco-tag').value;
  c.ecoNombre    = document.getElementById('f-eco-nombre').value;
  c.ecoSub       = document.getElementById('f-eco-sub').value;
  c.ecoDesc      = document.getElementById('f-eco-desc').value;
  c.ecoDriveLink = document.getElementById('f-eco-drive').value;
  c.ecoDriveLabel= document.getElementById('f-eco-drive-label').value;
  save(); toast('Comisión Economía guardada');
}

function guardarComInt() {
  var c = getComision();
  c.intTabLabel = document.getElementById('f-int-tablabel').value;
  c.intTag      = document.getElementById('f-int-tag').value;
  c.intNombre   = document.getElementById('f-int-nombre').value;
  c.intSub      = document.getElementById('f-int-sub').value;
  c.intDesc     = document.getElementById('f-int-desc').value;
  save(); toast('Comisión Internacional guardada');
}

function agregarArea(tipo) {
  var c = getComision();
  var prefix = tipo === 'eco' ? 'eco' : 'int';
  var icono  = truncar(document.getElementById('f-'+prefix+'-area-icono').value.trim() || '📌', LIMITES.credIcono);
  var titulo = truncar(document.getElementById('f-'+prefix+'-area-titulo').value.trim(), LIMITES.areaTitulo);
  var desc   = truncar(document.getElementById('f-'+prefix+'-area-desc').value.trim(),   LIMITES.areaDesc);
  if(!titulo){alert('Escribe el título del área.');return;}
  var key = tipo==='eco' ? 'ecoAreas' : 'intAreas';
  if(!c[key]) c[key] = [];
  c[key].push({icono:icono, titulo:titulo, desc:desc});
  document.getElementById('f-'+prefix+'-area-icono').value = '';
  document.getElementById('f-'+prefix+'-area-titulo').value = '';
  document.getElementById('f-'+prefix+'-area-desc').value = '';
  save(); renderComAreasLista(tipo); toast('Área añadida');
}

function elimArea(tipo, i) {
  var c = getComision();
  var key = tipo==='eco' ? 'ecoAreas' : 'intAreas';
  if(!c[key]) return;
  c[key].splice(i,1);
  save(); renderComAreasLista(tipo);
}

function renderComAreasLista(tipo) {
  var c = getComision();
  var key = tipo === 'eco' ? 'ecoAreas' : 'intAreas';
  var listId = 'lista-' + tipo + '-areas';
  var countId = tipo + '-areas-count';
  var lista = c[key] || [];
  var el = document.getElementById(listId);
  var cnt = document.getElementById(countId);
  if (cnt) cnt.textContent = lista.length;
  if (!el) return;
  if (lista.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">No hay áreas definidas.</p>';
    return;
  }
  var rows = '';
  for (var i = 0; i < lista.length; i++) {
    var a = lista[i];
    rows += '<div class="item-row">'
      + '<div class="item-row-info"><strong>' + sanitize(a.icono) + ' ' + sanitize(a.titulo) + '</strong><span>' + sanitize(a.desc) + '</span></div>'
      + '<button class="btn btn-danger btn-sm" data-tipo="' + tipo + '" data-idx="' + i + '" onclick="elimAreaBtn(this)">Eliminar</button>'
      + '</div>';
  }
  el.innerHTML = rows;
}


function elimAreaBtn(btn) {
  elimArea(btn.getAttribute('data-tipo'), parseInt(btn.getAttribute('data-idx')));
}
function elimCredencialBtn(btn) {
  elimCredencial(parseInt(btn.getAttribute('data-idx')));
}

// ── MOBILE SIDEBAR ────────────────────────────────────────────────────────────
function toggleSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var btn = document.getElementById('admin-menu-btn');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
  var isOpen = sidebar.classList.contains('open');
  if(btn) {
    btn.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(4px,4px)' : '';
    btn.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '1';
    btn.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px,-4px)' : '';
  }
}
function closeSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  var btn = document.getElementById('admin-menu-btn');
  if(btn) btn.querySelectorAll('span').forEach(function(s){s.style.transform='';s.style.opacity='';});
}
// Close sidebar when a nav item is clicked on mobile
document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() {
    if(window.innerWidth <= 768) closeSidebar();
  });
});