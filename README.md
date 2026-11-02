# 🏛️ Página Web — Sen. Aldo Sergio Villegas Mora

Sitio web político del Senador Aldo Villegas, Cochabamba — Bolivia.
Gestión 2025–2030 · Alianza Libre · Cámara de Senadores de Bolivia.

**Versión:** 3.0 | **Stack:** HTML5 + CSS3 + Vanilla JS | **Hosting:** Netlify

---

## 📁 Estructura del proyecto

```
pagina-politica-v3/
├── index.html                  ← Página pública (visitantes)
├── panel-legislativo.html      ← Panel de administración (acceso /panel)
├── netlify.toml                ← Configuración Netlify + headers de seguridad
├── README.md                   ← Este archivo
└── assets/
    ├── css/
    │   ├── styles.css          ← Estilos página pública (responsive completo)
    │   ├── admin.css           ← Estilos panel admin
    │   └── fonts.css           ← @font-face fuentes auto-hosteadas
    ├── js/
    │   ├── app.js              ← Lógica pública (render, localStorage)
    │   ├── admin.js            ← Lógica panel admin (seguridad, edición)
    │   ├── enhancements.js     ← Mejoras visuales (scroll animations,
    │   │                          typewriter, lightbox, hover effects,
    │   │                          back-to-top, reading progress, prop. status)
    │   └── images.js           ← Carga de imágenes institucionales
    ├── fonts/
    │   ├── inter-latin-*.woff2         ← Inter 300/400/500/600/700
    │   └── playfair-display-*.woff2   ← Playfair Display 700/900
    └── img/
        ├── aldo_villegas.jpg   ← Foto del senador
        ├── camara_senadores.jpg← Imagen fondo hero (por defecto)
        ├── camara_diputados.jpg
        ├── cochabamba.jpg
        ├── bandera_bolivia.jpg
        ├── bolivia.png
        ├── escudo_bolivia.gif
        ├── escudo_cbba.png
        ├── logo-partido.png    ← Logo partido LIBRE (editable desde admin)
        └── favicon.svg         ← Favicon personalizado "AV"
```

---

## 💻 Probar localmente

### Opción A — Python (sin instalación extra)

```bash
cd pagina-politica-v3
python3 -m http.server 3000
```
Luego abre:
- Página pública → http://localhost:3000
- Panel admin → http://localhost:3000/panel-legislativo.html

### Opción B — Node.js

```bash
npm install -g serve
serve .
```
Luego abre:
- Página pública → http://localhost:3000
- Panel admin → http://localhost:3000/panel

> ⚠️ **No abras index.html directamente con doble clic.**
> Las fuentes, imágenes y JS requieren un servidor HTTP para funcionar.

---

## 🌐 Publicar en Netlify (GRATIS)

### Paso 1 — Crear cuenta
1. Ve a https://netlify.com → clic en **"Sign up"**
2. Regístrate con correo o Google

### Paso 2 — Subir el proyecto (arrastrar y soltar)
1. Entra a https://app.netlify.com
2. En **"Sites"**, busca el recuadro:
   *"Drag and drop your site output folder here"*
3. **Arrastra la carpeta `pagina-politica-v3`** completa
4. Netlify publica en ~30 segundos
5. Recibes una URL como: `https://nombre-aleatorio.netlify.app`

### Paso 3 — Personalizar el nombre (opcional)
1. Netlify → Site settings → **General → Site name**
2. Cambia a algo como `aldovillegas`
3. URL final: `https://aldovillegas.netlify.app`

### Paso 4 — Actualizar el sitio
Cuando hagas cambios:
1. Netlify → tu sitio → **Deploys**
2. Arrastra la carpeta actualizada al recuadro de deploy
3. Actualiza en segundos ✅

---

## 🔑 Acceso al Panel de Administración

| Campo | Valor |
|---|---|
| **URL pública** | `https://tusitio.netlify.app/panel` |
| **Contraseña inicial** | `Senado2025!` *(cámbiala al publicar)* |
| **URL real del archivo** | `/panel-legislativo.html` (no compartir) |

> ⚠️ **Cambia la contraseña** al publicar por primera vez:
> Panel → Configuración → sección "Seguridad"
> Requisitos: 8+ caracteres, 1 mayúscula, 1 número, 1 símbolo
> Ejemplo: `AldoV2025#Senado`

---

## 🌎 Conectar dominio propio (ej: aldovillegas.bo)

### Registrar dominio .bo
1. Ve a https://www.nic.bo
2. Busca tu dominio → regístralo (~$30–50 USD/año)

### Conectar a Netlify
1. Netlify → Site settings → **Domain management → Add custom domain**
2. Escribe: `aldovillegas.bo`
3. Netlify te dará los nameservers (ej: `dns1.p01.nsone.net`)
4. En NIC.bo, actualiza los nameservers
5. Espera 24–48 horas para propagación
6. HTTPS se activa automáticamente (certificado SSL gratis) ✅

---

## 📊 Peso y rendimiento

| Archivo | Tamaño | Notas |
|---|---|---|
| `index.html` | ~32 KB | Incluye wave dividers SVG inline |
| `panel-legislativo.html` | ~42 KB | Panel admin completo |
| `styles.css` | ~32 KB | Responsive + animaciones + waves |
| `admin.css` | ~15 KB | Estilos panel |
| `fonts.css` | ~4 KB | Declaraciones @font-face |
| `app.js` | ~30 KB | Lógica pública |
| `admin.js` | ~48 KB | Lógica admin + seguridad |
| `enhancements.js` | ~17 KB | Mejoras visuales |
| `images.js` | ~4 KB | Carga imágenes |
| **Total JS + CSS** | **~150 KB** | Sin imágenes |
| Fuentes (woff2) | ~165 KB | Inter + Playfair (caché 1 año) |
| Imágenes | ~785 KB | Caché 1 año |

**Primera visita:** ~200–250 KB transferidos
**Segunda visita:** ~15 KB (todo en caché del navegador)

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica, sin frameworks |
| **CSS3** | Variables, Grid, Flexbox, animaciones, responsive |
| **JavaScript ES6+** | Vanilla JS, sin dependencias externas |
| **localStorage** | Persistencia de datos en el navegador |
| **Web Crypto API** | Hash SHA-256 de contraseñas |
| **Intersection Observer** | Scroll animations sin librerías |
| **Netlify** | Hosting, CDN global, headers HTTP, redirects |

---

## 🔐 Seguridad implementada

### 1. Hash SHA-256 de contraseña
La contraseña **nunca** se guarda en texto plano en `localStorage`.
Al guardar se convierte a hash SHA-256 irreversible vía `crypto.subtle.digest()`.
Al primer login con contraseña legacy (texto plano), se migra automáticamente a hash.

### 2. Protección contra fuerza bruta
- 3 intentos fallidos → bloqueo de **60 segundos**
- El contador se reinicia al hacer login exitoso

### 3. Token CSRF en login
- Se genera un UUID aleatorio por cada carga de página (`crypto.randomUUID()`)
- El formulario de login verifica el token antes de procesar la contraseña
- Protege contra ataques de formulario externo / clickjacking

### 4. Sesión segura con doble expiración
- **Inactividad:** cierre automático a los **30 minutos** sin actividad
- **Absoluta:** cierre forzado a las **8 horas** aunque el admin esté activo
- Usa `sessionStorage` (se borra al cerrar el navegador)

### 5. Sanitización XSS completa
- `sanitize()` en admin: escapa `< > & " '` antes de guardar
- `escapeHtml()` en app.js: escapa al renderizar en el DOM
- `sanitizeUrl()`: solo permite `http://` y `https://`
- Textos con markdown `**bold**`: se escapa HTML primero, luego se aplica el reemplazo

### 6. Validación de tipos en localStorage
- Al cargar datos, se verifica que cada campo sea del tipo correcto (string, array, object)
- JSON corrupto → carga valores por defecto en lugar de error
- Migración automática de campos obsoletos

### 7. Límites de tamaño de campos
- 23 límites definidos en el objeto `LIMITES` (ej: título 120 chars, descripción 500)
- Previene saturar el localStorage (~5 MB por dominio)
- Aplicado en todas las funciones de guardado del admin

### 8. URL del panel ofuscada
- El panel se llama `panel-legislativo.html`, no `admin.html`
- URL pública: `/panel` (redirect 200 interno en Netlify)
- Intentos a `/admin`, `/admin.html`, `/login`, `/wp-admin` → redirect a inicio
- `X-Robots-Tag: noindex, nofollow` → no aparece en buscadores

### 9. Headers HTTP de seguridad

| Header | Protege contra |
|---|---|
| `Strict-Transport-Security` | Downgrade a HTTP |
| `X-Frame-Options: DENY` | Clickjacking en iframes |
| `X-Content-Type-Options` | MIME sniffing |
| `Referrer-Policy` | Filtración de URLs a terceros |
| `Permissions-Policy` | Acceso a cámara/micrófono/GPS |
| `Content-Security-Policy` | XSS, inyección de scripts externos |

### 10. Fuentes auto-hosteadas
- Sin dependencia de Google Fonts → sin tracking de visitantes
- Archivos `.woff2` incluidos en el proyecto
- Cumple GDPR/privacidad

---

## ✨ Mejoras visuales (v3.0)

Implementadas en `enhancements.js` — no modifica código existente:

| Mejora | Descripción |
|---|---|
| **Scroll animations** | Fade-in escalonado al entrar en viewport (Intersection Observer) |
| **Hero entrance** | Nombre, badges y botones aparecen con animación al cargar |
| **Typewriter** | El eslogan del hero aparece letra por letra (28ms/char) |
| **Hover effects** | Elevación y transición en tarjetas de propuestas, eventos, noticias, redes |
| **Zoom en galería** | Las imágenes hacen scale(1.04) al hover con overflow hidden |
| **Lightbox** | Click en imagen → pantalla completa con navegación por teclado/flechas |
| **Back to top** | Botón flotante que aparece al hacer scroll > 400px |
| **Reading progress** | Barra roja de 3px en el top que avanza con el scroll |
| **Badge de estado** | Cada propuesta recibe "En Estudio / En Comité / Aprobada" automáticamente |
| **Wave dividers** | 9 separadores de ola SVG entre secciones (curvas únicas por transición) |
| **Favicon SVG** | Icono "AV" personalizado con colores institucionales |

---

## 🔧 Secciones editables desde el panel admin

| Sección | Campos editables |
|---|---|
| **Hero & Portada** | Nombre (2 líneas), partido, badge rojo, eslogan, imagen de fondo |
| **Sobre Mí** | Foto, logo del partido, título, descripción, credenciales, biografía |
| **Misión & Visión** | Título y texto de misión, título y texto de visión |
| **Comisiones** | Nombre, subtítulo, descripción, imagen/escudo, áreas, funcionarios, Google Drive |
| **Propuestas** | Ícono emoji, título, descripción (lista dinámica) |
| **Eventos** | Título, fecha, lugar, descripción, tipo, link Google Maps, link de registro |
| **Noticias** | Imagen (subida local), pie de foto, link externo |
| **Redes Sociales** | URL de cada red social (Facebook, Instagram, Twitter/X, YouTube, TikTok, WhatsApp) |
| **Contacto** | Email, teléfonos, lugar, descripción |
| **Colores** | Tema completo del sitio (colores primario, acento, fondo) |
| **Configuración** | Nombre en el panel, contraseña |

---

## ⚠️ Recomendaciones de uso

1. **Cambia la contraseña** al publicar — Panel → Configuración
2. **No compartas la URL del panel** públicamente
3. **Administra desde dispositivos de confianza** — los datos están en localStorage de ese navegador
4. **Haz backups periódicos** — exporta el contenido importante (los datos son locales al navegador)
5. **Para producción**, considera conectar un dominio `.bo` para mayor credibilidad institucional

---

## 📞 Contacto

- **Consultas técnicas:** contactar al desarrollador
- **Consultas legislativas:** aldo.villegas@senado.gob.bo

---

*Proyecto desarrollado con HTML5 + CSS3 + Vanilla JS · Sin dependencias externas · Listo para producción*
