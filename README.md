# Gray Zones Mapper

Las zonas grises son aquellas a las que dedicamos insuficiente materia gris. Gray Zones Mapper es una matriz de cuatro lentes (Over-reliance, Ownership, Uncertainty, Constraints) que da un código de cuatro cifras y una recta que muestra dónde cojea un proyecto.

Publicado en **https://grayzonesmapper.com**.

## Estructura

| Ruta | Qué es |
|---|---|
| `/` (`index.html`) | Landing: qué es Gray Zones, las lentes, usos y contacto por email. |
| `/app/` (`app/index.html`) | La matriz, en español e inglés (selector ES/EN). El código y el idioma van en la URL: `/app/?lang=en#3121`. |
| `/en/` | Landing en inglés. |
| `/legal/`, `/en/legal/` | Aviso legal, condiciones de uso y privacidad. |
| `fonts/` | Inter alojada en el propio sitio (sin Google Fonts), con su licencia OFL. |
| `/diario/` | Reservado para el diario (antiguo `gray-zones-v3`). De momento redirige a la landing. |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA instalable. Al instalarla se abre en `/app/`; funciona sin conexión. |
| `netlify.toml` | Sitio estático sin build, cabeceras de caché y redirecciones. |

## Desarrollo

No hay build. Cualquier servidor estático vale:

```bash
python3 -m http.server 8765
```

y abrir http://localhost:8765.

Si cambias un archivo que el service worker guarda (las páginas o los iconos), sube `VERSION` en `sw.js` para que los dispositivos instalados se actualicen.

## Ramas

- `main`: producción (lo que sirve Netlify).
- `dev`: trabajo diario. Netlify publica una vista previa por rama.

Se trabaja en `dev` y se fusiona en `main` cuando está listo.
