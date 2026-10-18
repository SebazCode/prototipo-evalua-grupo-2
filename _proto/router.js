/* ============================================================================
 * EventosUchile · Prototipo navegable
 * ----------------------------------------------------------------------------
 * Este archivo conecta todas las vistas del prototipo (exportadas desde Stitch)
 * sin tocar su HTML. Cada vista solo incluye:
 *
 *     <script src="../_proto/router.js"></script>
 *
 * Para cambiar un enlace, edita la sección "RUTAS" o "REGLAS" de abajo.
 * ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------- RUTAS ---------------------------------- */
  // clave  ->  carpeta de la vista (cada carpeta tiene un code.html)
  var ROUTES = {
    // Acceso
    login:               'iniciar_sesi_n_comunidad_uchile',
    registro:            'registro_de_estudiantes_comunidad_uchile',
    solicitud:           'solicitud_de_organizaci_n_comunidad_uchile',
    ayuda:               'nuevas/ayuda_y_privacidad_comunidad_uchile',
    // Comunidad
    portada:             'portada_comunidad_uchile',
    explorar:            'explorar_eventos_filtros_y_b_squeda',
    calendario:          'calendario_de_eventos_comunidad_uchile',
    guardados:           'eventos_guardados_comunidad_uchile',
    detalle:             'detalle_de_evento_comunidad_uchile',
    notificaciones:      'nuevas/notificaciones_comunidad_uchile',
    perfil:              'nuevas/perfil_y_ajustes_comunidad_uchile',
    // Organizaciones
    panelOrg:            'panel_del_organizador_comunidad_uchile',
    crear:               'crear_nuevo_evento_comunidad_uchile',
    editar:              'nuevas/editar_o_cancelar_evento_comunidad_uchile',
    informe:             'nuevas/informe_del_evento_comunidad_uchile',
    // Administración
    adminSolicitudes:    'panel_admin_solicitudes_de_verificaci_n',
    adminDictamen:       'revisi_n_y_dictamen_de_solicitud_admin_uchile',
    adminImportados:     'nuevas/admin_importaciones_comunidad_uchile',
    adminImportado:      'nuevas/admin_revision_de_evento_importado_comunidad_uchile',
    adminOrganizaciones: 'nuevas/admin_organizaciones_comunidad_uchile',
    adminAuditoria:      'nuevas/admin_auditoria_y_registros_comunidad_uchile'
  };

  // Pantalla de inicio según el perfil con el que se ingresó
  var HOME = {
    estudiante:             'portada',
    organizacion:           'panelOrg',
    organizacion_pendiente: 'solicitud#seguimiento',
    administrador:          'adminSolicitudes'
  };

  /* --------------------------- UTILIDADES -------------------------------- */
  // Raíz del prototipo: se deduce de la ubicación de este mismo archivo,
  // así cada vista puede estar en la raíz o dentro de una subcarpeta.
  var ROOT = (function () {
    var cs = document.currentScript && document.currentScript.src;
    return cs ? cs.replace(/_proto\/router\.js[^]*$/, '') : '../';
  })();

  var parts = decodeURIComponent(location.pathname).split('/');
  var FOLDER = parts[parts.length - 2];
  var PAGE = null;
  Object.keys(ROUTES).forEach(function (k) { if (ROUTES[k] === FOLDER) PAGE = k; });

  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }

  // Estado mínimo (rol del usuario) que sobrevive entre vistas.
  var KEY = 'eventosuchile.proto';
  function readState() {
    try { var v = localStorage.getItem(KEY); if (v) return JSON.parse(v); } catch (e) {}
    try { if (window.name.indexOf('EUPROTO:') === 0) return JSON.parse(window.name.slice(8)); } catch (e) {}
    return {};
  }
  function writeState(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    try { window.name = 'EUPROTO:' + JSON.stringify(s); } catch (e) {}
  }
  function getRole() { return readState().role || 'estudiante'; }
  function setRole(r) { var s = readState(); s.role = r; writeState(s); }
  function homeKey() { return HOME[getRole()] || 'portada'; }

  // "clave", "clave#hash", "clave?x=1", "clave?x=1#hash"  ->  url relativa
  function url(to, toastMsg) {
    var hash = '', query = '';
    var h = to.indexOf('#'); if (h >= 0) { hash = to.slice(h); to = to.slice(0, h); }
    var q = to.indexOf('?'); if (q >= 0) { query = to.slice(q + 1); to = to.slice(0, q); }
    if (!ROUTES[to]) { console.warn('[router] ruta desconocida:', to); return '#'; }
    if (toastMsg) query += (query ? '&' : '') + 'toast=' + encodeURIComponent(toastMsg);
    return ROOT + ROUTES[to] + '/code.html' + (query ? '?' + query : '') + hash;
  }
  function go(to, toastMsg) { location.href = url(to, toastMsg); }

  // Aviso flotante (reemplaza a los toasts propios de cada vista)
  function toast(msg, icon) {
    var old = document.getElementById('proto-toast'); if (old) old.remove();
    var t = document.createElement('div');
    t.id = 'proto-toast';
    t.setAttribute('role', 'status');
    t.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:200;' +
      'max-width:calc(100vw - 32px);display:flex;align-items:center;gap:8px;padding:10px 16px;' +
      'border-radius:999px;background:#283044;color:#eef0ff;font:600 12px/16px "Plus Jakarta Sans",system-ui,sans-serif;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.25);transition:opacity .3s;opacity:0';
    t.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;color:#fe932c">' + (icon || 'check_circle') + '</span><span></span>';
    t.lastChild.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = '1'; });
    setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  window.proto = { root: ROOT, go: go, url: url, toast: toast, getRole: getRole, setRole: setRole, homeKey: homeKey, page: PAGE, routes: ROUTES };

  /* ------------------------------ REGLAS --------------------------------- */
  // sel: selector CSS · text: filtro por texto visible · to: destino · run: función
  // guard: en tarjetas completas, ignora clics sobre botones internos (favorito, etc.)
  var RULES = [];
  function rule(pages, sel, text, action, opts) {
    var r = { pages: pages, sel: sel, text: text };
    if (typeof action === 'function') r.run = action; else r.to = action;
    if (opts) for (var k in opts) r[k] = opts[k];
    RULES.push(r);
  }
  var AUTH = ['portada', 'explorar', 'calendario', 'guardados', 'panelOrg'];
  var ADMIN = ['adminSolicitudes', 'adminDictamen', 'adminImportados', 'adminImportado', 'adminOrganizaciones', 'adminAuditoria'];

  // ---- Barra inferior (todas las vistas con data-path)
  var NAVMAP = {
    'inicio': 'portada', 'explorar': 'explorar', 'calendario': 'calendario', 'guardados': 'guardados',
    'panel-org': 'panelOrg', 'solicitudes': 'adminSolicitudes', 'importados': 'adminImportados',
    'organizaciones': 'adminOrganizaciones', 'auditoria-logs': 'adminAuditoria', 'soporte-cuenta': 'ayuda'
  };
  Object.keys(NAVMAP).forEach(function (k) { rule(null, 'a[data-path="' + k + '"]', null, NAVMAP[k]); });

  // ---- Encabezado
  rule(null, 'button[aria-label^="Notificaciones"]', null, 'notificaciones');
  rule(null, 'img[alt="Profile"]', null, 'perfil');
  rule(ADMIN, 'header .w-8.h-8.rounded-full.bg-primary', null, 'perfil');
  rule(AUTH, 'header img[alt^="Logo"]', null, function () { go(homeKey()); });

  // ---- Portada
  rule(['portada'], '#filter-toggle', null, 'explorar');
  rule(['portada'], 'span', /^Ver mapa$/, 'explorar');
  rule(['portada'], 'button', /^Ver detalles/, 'detalle');
  rule(['portada'], 'button', /^Ver todo$/, 'explorar');
  rule(['portada'], 'button', /Ver feedback/, 'detalle');
  rule(['portada'], 'button', /^add$/, function () { go(getRole() === 'organizacion' ? 'crear' : 'solicitud'); });
  rule(['portada'], 'button', /Medicina|Antumapu/, 'explorar');
  rule(['portada'], 'article', null, 'detalle', { guard: true });

  // ---- Explorar
  rule(['explorar'], 'button', /^(Ver detalle|Inscribirme|Registrarme)$/, 'detalle');
  rule(['explorar'], 'article', null, 'detalle', { guard: true });

  // ---- Calendario
  rule(['calendario'], 'button', /^Ver detalle$/, 'detalle');
  rule(['calendario'], 'button', /Exportar \.ics/, function () { toast('Calendario .ics descargado', 'file_download'); });

  // ---- Guardados
  rule(['guardados'], 'button', /Ver detalle|Inscribirme ahora|Reservar Asistencia/, 'detalle');
  rule(['guardados'], 'article', null, 'detalle', { guard: true });
  rule(['guardados'], 'button', /Descargar calendario/, function () { toast('Archivo .ics generado con tus eventos guardados', 'file_download'); });

  // ---- Detalle de evento
  rule(['detalle'], 'button', /^Ver todos/, 'explorar');
  rule(['detalle'], 'button', /^Ver detalle$/, 'detalle');

  // ---- Crear evento
  rule(['crear'], 'button', /^close$/, function () { go('panelOrg'); });
  rule(['crear'], 'button', /Guardar Borrador|^drafts Borrador$/, function () { go('panelOrg', 'Borrador guardado'); });

  // ---- Panel del organizador
  rule(['panelOrg'], 'button', /^add Crear$|Crear Nuevo Evento/, 'crear');
  rule(['panelOrg'], 'button', /^edit Editar$|^more_vert$/, 'editar');
  rule(['panelOrg'], 'button', /Continuar edición/, 'crear');
  rule(['panelOrg'], 'button', /Asistencia/, 'informe?e=ros#asistencia');
  rule(['panelOrg'], 'button', /^query_stats$|Ver informe post-evento/, 'informe?e=charla#resumen');
  rule(['panelOrg'], '#view-events h3', null, 'detalle');
  rule(['panelOrg'], 'button', /^delete$/, function (el) {
    var card = el.closest('.bg-surface-container-lowest');
    if (card) { card.style.transition = 'all .3s'; card.style.opacity = '0'; setTimeout(function () { card.remove(); }, 300); }
    toast('Borrador eliminado', 'delete');
  });
  rule(['panelOrg'], 'button', /Publicar$/, function (el) {
    if (el.closest('#review-sheet')) return false;                 // el modal de importación mantiene su lógica
    toast('Evento publicado. Ya es visible para la comunidad', 'rocket_launch');
  });
  rule(['panelOrg'], 'button', /^Sincronizar$/, function () { toast('Fuentes sincronizadas · 2 eventos por revisar', 'sync'); });

  // ---- Acceso
  rule(['login'], 'button', /Crear o Activar Cuenta de Estudiante/, 'registro');
  rule(['login'], 'button', /Solicitar acreditación de organización/, 'solicitud');
  rule(['login'], 'a', /Privacidad y Términos/, 'ayuda#privacidad');
  rule(['registro'], 'button', /Ir a la Portada de Eventos/, function () { setRole('estudiante'); go('portada'); });
  rule(['registro'], 'a', /Inicia sesión aquí/, 'login');
  rule(['registro'], 'a', /^(Términos de Uso|Política de Privacidad)$/, 'ayuda#privacidad');
  rule(['solicitud'], 'a', /Volver al inicio/, 'login');

  // ---- Administración
  rule(['adminSolicitudes'], 'button,a', /Revisar Solicitud|Previsualizar|Ver Expediente Oficial|Ver Motivo y Registro/, 'adminDictamen');
  rule(['adminSolicitudes'], 'button,a', /Consultar registro de firmas/, 'adminAuditoria');
  rule(['adminDictamen'], 'button', /Volver a la Bandeja/, 'adminSolicitudes');

  /* ----------------------------- MOTOR ----------------------------------- */
  function applies(r) { return !r.pages || r.pages.indexOf(PAGE) >= 0; }
  function matches(r, el) { return !r.text || r.text.test(clean(el.textContent)); }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (!applies(r)) continue;
      var el = e.target.closest(r.sel);
      if (!el || !matches(r, el)) continue;
      if (r.guard) {
        var inner = e.target.closest('button,a,input,select,textarea');
        if (inner && inner !== el && el.contains(inner)) continue;
      }
      if (r.run) { if (r.run(el, e) === false) return; }
      else go(r.to);
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      return;
    }
  }, true);

  function decorate() {
    var st = document.createElement('style');
    st.textContent = '[data-proto-link]{cursor:pointer}';
    document.head.appendChild(st);
    RULES.forEach(function (r) {
      if (!applies(r)) return;
      var els; try { els = document.querySelectorAll(r.sel); } catch (e) { return; }
      Array.prototype.forEach.call(els, function (el) {
        if (!matches(r, el)) return;
        el.setAttribute('data-proto-link', '');
        if (el.tagName === 'A' && r.to) el.setAttribute('href', url(r.to));   // útil al pasar el mouse
      });
    });
  }

  /* ----------------------- COMPORTAMIENTOS POR VISTA --------------------- */
  function onReady() {
    decorate();

    // Aviso que viene de la vista anterior (?toast=...)
    var m = /[?&]toast=([^&#]*)/.exec(location.search);
    if (m) {
      setTimeout(function () { toast(decodeURIComponent(m[1])); }, 350);
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
    }

    // Aviso al padre (visor del prototipo) de la vista actual
    if (window.parent && window.parent !== window) {
      try { window.parent.postMessage({ eventosuchile: true, page: PAGE }, '*'); } catch (e) {}
    }

    if (PAGE === 'login') {
      // El perfil elegido decide a qué parte del sistema se entra.
      var type = 'estudiante';
      var origSim = window.simulatePersona;
      window.simulatePersona = function (t, d, n, kind) { type = kind; return origSim.apply(this, arguments); };
      window.proceedSimulatedDashboard = function () {
        var role = type === 'administrador' ? 'administrador'
                 : type === 'organizacion_aprobada' ? 'organizacion'
                 : type === 'organizacion_pendiente' ? 'organizacion_pendiente' : 'estudiante';
        setRole(role);
        if (typeof window.closeSimulationModal === 'function') window.closeSimulationModal();
        toast('Ingresando como ' + ({ estudiante: 'estudiante', organizacion: 'organización', organizacion_pendiente: 'organización en revisión', administrador: 'administrador' })[role] + '…', 'login');
        setTimeout(function () { go(HOME[role]); }, 900);
      };
    }

    if (PAGE === 'solicitud') {
      if (location.hash === '#seguimiento' && typeof window.switchTab === 'function') window.switchTab('status');
      var st = document.getElementById('tab-content-status');
      if (st && !document.getElementById('proto-cta')) {
        var b = document.createElement('button');
        b.id = 'proto-cta'; b.type = 'button';
        b.className = 'w-full mt-4 h-12 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all';
        b.innerHTML = '<span class="material-symbols-outlined text-[20px]">explore</span> Explorar cartelera mientras espero';
        b.addEventListener('click', function () { setRole('estudiante'); go('portada'); });
        st.appendChild(b);
      }
    }

    if (PAGE === 'portada') {
      var q = document.querySelector('input[placeholder^="Buscar"]');
      if (q) {
        q.addEventListener('keydown', function (e) { if (e.key === 'Enter') go('explorar'); });
        q.addEventListener('focus', function () { setTimeout(function () { go('explorar'); }, 150); });
      }
    }

    if (PAGE === 'crear') {
      // Tras la animación de "Publicando…", volver al panel con aviso
      var pb = document.getElementById('publish-btn');
      if (pb) pb.addEventListener('click', function () {
        setTimeout(function () { go('panelOrg', 'Evento publicado. Ya es visible para la comunidad'); }, 2000);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady); else onReady();
})();
