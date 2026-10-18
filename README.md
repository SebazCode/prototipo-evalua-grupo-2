# EventosUchile · Prototipo navegable

Prototipo de la plataforma de eventos universitarios de la Universidad de Chile (Grupo 2, Tarea 2). Parte de los exports de Stitch (*Comunidad UChile*) y agrega las vistas que faltaban, conectadas entre sí.

## Cómo abrirlo

1. Abre **`index.html`** en Chrome (o cualquier navegador moderno). No necesita servidor.
2. Elige un perfil en la barra lateral (estudiante, organización verificada, organización en revisión o administrador) o un **recorrido** para la demo.
3. Los botones de la barra inferior, las tarjetas y los enlaces de cada pantalla funcionan entre sí.

Requiere conexión a internet para cargar las fuentes y los íconos (Google Fonts) y Tailwind (CDN) que usan los exports de Stitch.

## Estructura

```
stitch_comunidad_uchile_platform/
├── index.html                  ← visor: perfiles, recorridos y lista de las 21 pantallas
├── README.md                   ← este archivo
├── _proto/
│   └── router.js               ← navegación entre todas las vistas (rutas, reglas, avisos)
├── azul_austral/DESIGN.md      ← sistema de diseño (original)
│
├── portada_comunidad_uchile/                ┐
├── explorar_eventos_filtros_y_b_squeda/     │
├── calendario_de_eventos_comunidad_uchile/  │
├── eventos_guardados_comunidad_uchile/      │
├── detalle_de_evento_comunidad_uchile/      │  12 pantallas originales de Stitch
├── iniciar_sesi_n_comunidad_uchile/         │  (cada una trae code.html y screen.png;
├── registro_de_estudiantes_comunidad_uchile/│   solo se les agregó la línea del router
├── solicitud_de_organizaci_n_comunidad_uchile/ │   y, en el panel admin, la pestaña Importados)
├── panel_del_organizador_comunidad_uchile/  │
├── crear_nuevo_evento_comunidad_uchile/     │
├── panel_admin_solicitudes_de_verificaci_n/ │
├── revisi_n_y_dictamen_de_solicitud_admin_uchile/ ┘
│
└── nuevas/                     ← 9 vistas agregadas en este prototipo
    ├── notificaciones_comunidad_uchile/
    ├── perfil_y_ajustes_comunidad_uchile/
    ├── ayuda_y_privacidad_comunidad_uchile/
    ├── editar_o_cancelar_evento_comunidad_uchile/
    ├── informe_del_evento_comunidad_uchile/
    ├── admin_importaciones_comunidad_uchile/
    ├── admin_revision_de_evento_importado_comunidad_uchile/
    ├── admin_organizaciones_comunidad_uchile/
    └── admin_auditoria_y_registros_comunidad_uchile/
```

Las pantallas originales conservan sus nombres de carpeta de Stitch, así que se pueden volver a exportar sin cambiar nada más que agregar la línea del router (ver abajo).

## Perfiles de ingreso

| Perfil | Pantalla de inicio | Qué ve en la barra inferior |
|---|---|---|
| Estudiante | Inicio (portada) | Inicio, Explorar, Calendario, Guardados, Panel Org |
| Organización verificada | Panel del organizador | Mismo menú de comunidad + panel |
| Organización en revisión | Estado de la solicitud | Solicitud y acceso a la cartelera |
| Administrador | Solicitudes de verificación | Solicitudes, Importados, Organizaciones, Auditoría |

Las preferencias de avisos y la sede elegida se guardan en el navegador (`localStorage`), así que sobreviven entre pantallas y recargas.

## Recorridos para la demo

- **Comunidad** (estudiante): inicio → explorar → ficha → calendario → guardados → notificaciones → perfil.
- **Organización**: solicitud → revisión admin → dictamen → panel del organizador → crear evento → editar/cancelar → informe.
- **Administración**: solicitudes → dictamen → importados → revisar evento importado → organizaciones → auditoría.

## Vistas nuevas

| Vista | Qué muestra | Requisitos que cubre (Tarea 2) |
|---|---|---|
| `notificaciones` | Avisos agrupados por tipo y día, con filtros y marcado de leídos. Cambia según el perfil. | Aviso de cuenta aprobada o rechazada · Recordatorio de evento guardado · Aviso de cambio o cancelación · Aviso de eventos pendientes de revisión |
| `perfil_y_ajustes` | Datos de la cuenta, preferencias de avisos, cuándo recordar (24 h / 1 h antes), canal, sede y cierre de sesión. | Recordatorio de evento guardado (preferencias) · Acceso con cuenta institucional |
| `ayuda_y_privacidad` | Preguntas frecuentes, privacidad y datos personales, términos de uso y contacto. | Protección de datos personales · Operación a cargo de la universidad |
| `editar_o_cancelar_evento` | Edición de título, fecha, horas, cupos, lugar y descripción. Detecta qué cambió y avisa solo si cambian fecha, hora o lugar. Cancelación con motivo y confirmación. | Editar o cancelar un evento · Aviso de cambio o cancelación |
| `informe_del_evento` | Dos eventos de muestra. Resumen (KPIs, inscripciones por día, calificaciones), lista de asistencia con check-in y exportación, y comentarios. | Panel del organizador · Informe o reporte |
| `admin_importaciones` | Bandeja de eventos importados desde U-Cursos, redes sociales y correo, con filtros, marca de posibles duplicados y estado de las fuentes con sincronización manual. | Importación de U-Cursos · Importación desde redes sociales · Importación de correos institucionales · Revisión periódica de las fuentes · Detección de duplicados |
| `admin_revision_de_evento_importado` | Fuente de origen, datos detectados con su confianza, comparación con el evento ya publicado (si hay duplicado), y decisión: fusionar, publicar o rechazar con causal. | Revisar un evento importado · Registro de la fuente de origen · Revisión previa de lo importado |
| `admin_organizaciones` | Directorio de organizaciones verificadas con filtros, expediente y suspensión/reactivación. | Solo organizaciones verificadas · Aprobar o rechazar una cuenta (seguimiento) |
| `admin_auditoria_y_registros` | Registro de solo lectura de decisiones, importaciones y procesos automáticos (archivado, recordatorios, revisión de fuentes). | Registro de creación · Archivado de eventos pasados · Envío programado de recordatorios · Revisión periódica de las fuentes |

## Cambios en las pantallas originales

- **Todas las 12:** se agregó `<script src="../_proto/router.js"></script>` al final del `<body>`. Ningún otro cambio de contenido.
- **`panel_admin_solicitudes_de_verificaci_n`:** la barra inferior ahora tiene cuatro pestañas (Solicitudes, Importados, Organizaciones, Auditoría); antes tenía tres y "Auditoría / Logs".

## Cómo funciona la navegación

`_proto/router.js` tiene tres partes que se pueden editar sin tocar el HTML de las pantallas:

- **`ROUTES`**: clave → carpeta de cada vista. Para mover una vista, cambia su ruta aquí.
- **`RULES`**: qué hace cada elemento (por texto visible o por selector). Ej.: `rule(['portada'], 'article', null, 'detalle')`.
- **`HOME`**: a qué pantalla entra cada perfil.

Las rutas se calculan desde la ubicación del propio `router.js`, así que las vistas pueden estar en la raíz o en subcarpetas (como `nuevas/`).

Para agregar una pantalla nueva exportada desde Stitch: copia su carpeta a la raíz (o a `nuevas/`), agrega `<script src="../_proto/router.js"></script>` antes de `</body>` (ajusta `../` si está en `nuevas/`) y registra la ruta en `ROUTES`.

## Limitaciones conocidas

- **Datos de ejemplo.** Eventos, usuarios, inscritos, comentarios y calificaciones son ficticios. No hay base de datos ni backend: todo lo que "se guarda" se pierde al cerrar el navegador, salvo las preferencias.
- **Inicio de sesión simulado.** Cualquier clave con `uchile` o `@` o `-` entra. Los botones de perfil son el camino de la demo.
- **Fechas.** Las pantallas originales de Stitch están fechadas en abril de 2025; las nuevas usan el mismo criterio. Para el video conviene alinearlas con el calendario del proyecto.
- **Sin correos, calendario ni exportaciones reales.** Los botones de `.ics`, CSV, correo y "Google Calendar" muestran un aviso y no generan archivos.
- **Pendiente de verificación visual.** Los estilos de Tailwind se cargan desde CDN; la navegación se probó automáticamente con un navegador, pero el aspecto de las 9 vistas nuevas debe revisarse abriendo `index.html`.

## Fuentes

Diseño y pantallas originales: exportados desde Stitch (carpeta `azul_austral/` con `DESIGN.md`). Vistas nuevas y navegación: construidas para este prototipo siguiendo el sistema de diseño Azul Austral.
