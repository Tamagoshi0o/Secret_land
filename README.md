# Secret Land

Landing page de Secret Land, empresa que vende café de especialidad y máquinas de café. El objetivo principal de la página es que el visitante agende una cita: asesoría, demostración, cata o servicio técnico.

Es un sitio estático (HTML, CSS y JavaScript sin dependencias ni paso de build).

## Estructura

```
index.html     Contenido y estructura
styles.css     Estilos y diseño responsive
script.js      Horarios disponibles, validación y confirmación del formulario
vercel.json    Configuración de Vercel (URLs limpias y cabeceras de seguridad)
.vercelignore  Archivos que no se publican
```

## Ver en local

Desde la raíz del repositorio:

```bash
python -m http.server 5500
```

Y abre http://localhost:5500.

## Publicar en Vercel

1. En [vercel.com/new](https://vercel.com/new), importa el repositorio `Tamagoshi0o/Secret_land`.
2. Deja la configuración por defecto:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** vacío
   - **Output Directory:** vacío
3. Pulsa **Deploy**.

Cada push a `main` publica en producción; los demás branches y PRs generan una URL de vista previa.

## Pendiente antes de producción

- **Formulario de citas:** ahora solo simula el envío. Sustituye la función `submitBooking` en `script.js` por una llamada a tu backend o a un servicio de formularios (Formspree, Google Sheets, etc.). Hay un ejemplo comentado en el código.
- **Datos de ejemplo:** productos, precios, dirección, teléfono, correo y redes sociales son provisionales.
- **Horario de citas:** se configura en `SCHEDULE` dentro de `script.js`.
