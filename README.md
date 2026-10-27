# Puente UBP · Prototipo

Plataforma de mentorías entre estudiantes y egresados de la Universidad Blas Pascal.
Prototipo en HTML, CSS y JavaScript sin dependencias: abrí `index.html` en el navegador (no requiere servidor).

## Estructura

```
index.html              Punto de entrada
assets/img/             Logo de Puente UBP (Logo Puente UBP.svg, también usado como favicon)
css/
  tokens.css            Paleta UBP y variables de modo claro/oscuro
  base.css              Reset, tipografía y utilidades
  layout.css            Encabezado, barra lateral y grilla
  components.css        Botones, campos, chips, carga de archivos, etc.
  views.css             Estilos propios de login, disponibilidad y soporte
js/
  config.js             Feature flags y catálogos (carreras, necesidades, franjas, soporte)
  data/seed.js          Datos ficticios y usuarios de prueba
  core/                 Estado, cuentas (auth.js), tema, matching y manejo de archivos
  views/                Una vista por archivo (login, estudiante, egresado, perfil, disponibilidad, soporte, admin)
  actions.js            Acciones de la interfaz (data-a="...")
  main.js               Render, enrutado y eventos
legacy/                 Versión anterior en un solo archivo
```

## Despliegue en Render

El repositorio incluye `render.yaml`. En Render: **New → Blueprint**, elegir este repositorio y confirmar.
Alternativa manual: **New → Static Site**, Build Command vacío y Publish Directory `.`.

## Notas

- **Cuentas:** se ingresa con usuario (o email) y contraseña; el sistema detecta si la cuenta es de estudiante o egresado/a.
  Cuentas iniciales: `alumno` / `alumno` (estudiante) y `egresado` / `egresado` (egresado/a).
  Desde "Crear usuario" se dan de alta cuentas nuevas eligiendo el tipo, y "Olvidé mi contraseña" la restablece verificando usuario y email.
- **Seguridad:** las contraseñas se guardan como hash SHA-256 con sal, pero las cuentas viven en el `localStorage` del navegador.
  Es suficiente para la demo, no para producción: ahí la autenticación y el envío del enlace de recuperación por email tienen que estar en un servidor.
- **Centro de Graduados:** desestimado temporalmente. Se reactiva con `FEATURES.centroGraduados = true` en `js/config.js`.
  Mientras tanto, cada solicitud se presenta automáticamente al egresado con mejor coincidencia.
- **Persistencia:** el estado de la demo se guarda en `localStorage`. "Reiniciar demo" vuelve a los datos iniciales.
- **LinkedIn:** la vinculación está simulada (valida la URL del perfil). La integración real requiere OAuth desde un backend.
- **Soporte:** los canales de email y WhatsApp en `js/config.js` son de ejemplo.
