# Estante

Estante es una aplicación full stack para consultar un catálogo de **libros**. Los visitantes pueden ver el listado y el detalle; las cuentas con rol `admin` pueden crear, editar y eliminar libros. Está construida con React, Vite, TypeScript, Express, MongoDB y Better Auth.

## Despliegue

- Frontend en Render: **pendiente de publicar** — completar con la URL asignada al Static Site.
- Backend en Render: **pendiente de publicar** — completar con la URL asignada al Web Service.
- El frontend usa rutas `/api`; `render.yaml` prepara el rewrite hacia `https://estante-api.onrender.com`. Si Render asigna otro hostname, actualizá el destino en el Blueprint.

El deploy real y el login de GitHub en producción requieren una base MongoDB, credenciales configuradas en Render y una OAuth App de GitHub. No se incluyen credenciales ni URLs ficticias.

## Requisitos

- Node.js 20 o superior y npm.
- MongoDB (local o Atlas).

## Ejecutar en local

1. Copiá `backend/.env.example` como `backend/.env`.
2. Configurá `MONGODB_URI` y generá un `BETTER_AUTH_SECRET` aleatorio de al menos 32 caracteres. Para generar uno con Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
3. En `backend/.env`, dejá `BETTER_AUTH_URL=http://localhost:5173` y `FRONTEND_URL=http://localhost:5173`. Las variables GitHub son opcionales en local; para usarlas, configurá una OAuth App con callback `http://localhost:5173/api/auth/callback/github`.
4. Instalá dependencias y levantá cada aplicación en una terminal:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Abrí `http://localhost:5173`. Vite reenvía `/api` al backend en `localhost:3000`.

5. Para preparar cuentas de prueba, cargá `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_USER_EMAIL` y `SEED_USER_PASSWORD` en `backend/.env`, y ejecutá `cd backend && npm run seed`. El script crea (si no existen) un admin y un user; **en producción, elegí contraseñas propias y compartilas con la cátedra por un canal seguro**. No guardes contraseñas reales en Git.

## Variables de entorno del backend

Todas están enumeradas en [`backend/.env.example`](backend/.env.example): puerto y entorno, URI/base de datos Mongo, secreto/base URL de Better Auth, URL confiable del frontend, credenciales opcionales de GitHub y credenciales opcionales para la carga inicial de las dos cuentas.

En Render, definí `BETTER_AUTH_URL` y `FRONTEND_URL` con la URL pública del Static Site. La OAuth App de producción debe tener callback `https://<URL-FRONTEND>/api/auth/callback/github`; el rewrite `/api/*` lo envía al backend conservando el origen/cookie del frontend. No agregues secretos a `render.yaml` ni al repositorio.

## Roles y autorización

- `user`: asignado por defecto al registrarse; puede leer el catálogo.
- `admin`: puede crear, editar y eliminar. Se exige sesión (`authMiddleware`) y el rol (`requireRole("admin")`) para cada escritura.
- La asignación inicial del rol admin se realiza únicamente mediante el script de seed; el rol no es editable durante el registro.

## API

Las rutas de lectura son públicas. Las escrituras requieren sesión y rol admin. Los cuerpos de POST/PUT se validan con Zod; ante datos inválidos se devuelve `400` con detalles.

| Método | Ruta | Rol requerido |
|---|---|---|
| GET | `/api/books` | Público |
| GET | `/api/books/:id` | Público |
| POST | `/api/books` | admin |
| PUT | `/api/books/:id` | admin |
| DELETE | `/api/books/:id` | admin |
| GET | `/api/me` | user o admin |
| Better Auth | `/api/auth/*` | Según operación |

Un libro tiene título, autor, género, año de publicación, disponibilidad y fechas de creación/actualización.

## Cuentas para corrección

Las cuentas se inicializan con las variables `SEED_*` descritas arriba. Las credenciales de producción aún deben ser creadas por quien despliegue la aplicación; se deben completar aquí junto con las URLs de Render antes de entregar:

| Rol | Email | Contraseña |
|---|---|---|
| admin | Pendiente de configurar en Render | Compartir por canal seguro |
| user | Pendiente de configurar en Render | Compartir por canal seguro |
