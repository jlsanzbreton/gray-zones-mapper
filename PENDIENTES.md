# Pendientes

Estado a 21-11-2026: **publicado**. El sitio `grayzones` de Netlify despliega `main` en grayzonesmapper.com, y `dev` tiene vista previa en `dev--grayzones.netlify.app`.

## 1. Publicar (Netlify, sitio `grayzones`): hecho

- [x] **Deploy settings → Repository:** enlazar a `jlsanzbreton/gray-zones-mapper`.
  - Build command: vacío
  - Publish directory: `.`
  - Production branch: `main`
- [x] **Branch deploys:** activar para `dev` (vista previa en `dev--grayzones.netlify.app`).
- [x] **Domain management:** poner `grayzonesmapper.com` como dominio **principal**. grayzonemapper.com y los `www` redirigen a él.
- (Forms no hace falta: ya no hay formulario.)

## 2. Comprobar en producción: Claude

- [x] Cabeceras de seguridad (CSP, HSTS, etc.) aplicadas en `https://grayzonesmapper.com`.
- [x] Landing, matriz y aviso legal cargan en ES y EN, sin errores de CSP en la consola.
- [x] Redirecciones: `www` → raíz, `http` → `https`, `/matriz` → `/app/`, `/diario/` → `/`.
- [x] grayzonemapper.com (sin «s») → grayzonesmapper.com, conservando la ruta.
- [x] README.md y PENDIENTES.md no se sirven en la web (404).
- [x] HTTPS válido también en `www.grayzonesmapper.com`.

## 3. Comprobar a mano: José

- [ ] Instalar la app en el móvil ("Añadir a pantalla de inicio"): icono de la espiral, abre en la matriz y funciona sin conexión.
- [ ] Mandar un correo de prueba a `hola@grayzonesmapper.com` (reenvío de Porkbun a Gmail).
- [ ] Mandar un correo de prueba a `hola@jlsanzbreton.com` (reenvío recién configurado).
- [ ] Activar la verificación en dos pasos en GitHub, Netlify y Porkbun, si no está ya.

## 4. Después

- [ ] Enlazar Gray Zones desde jlsanzbreton.com (repo `jose-website`); ahora solo aparece en una nota de la home.
- [ ] Traer el diario (`gray-zones-v3`) a `/diario/`, adaptado a la matriz. Lentes en inglés.
- [ ] Ejemplos de crisis para el vídeo de crisis management.
- [ ] Curso de Gray Zones en la parte privada de jlsanzbreton.com (`/courses/<id>/` con rol de Netlify Identity y carpeta de tutor en `tutor/cursos/`).
- [ ] Renovar `Expires` en `/.well-known/security.txt` antes de noviembre de 2027.
- [ ] Si algún día vuelve la lista de correo: política de privacidad con consentimiento y, si hay actividad económica, aviso legal con NIF y domicilio (LSSI).
