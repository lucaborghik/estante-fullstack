# Estante – Catálogo de libros

Aplicación Full Stack desarrollada como Trabajo Práctico Final. Permite consultar un catálogo de libros, visualizar sus detalles y administrar los registros mediante un sistema de autenticación y autorización por roles.

## 1. Descripción del proyecto

**Estante** es una aplicación web destinada a la gestión y consulta de libros.

Los visitantes pueden acceder al catálogo público y consultar los libros disponibles. Los usuarios registrados pueden iniciar sesión y, según su rol, acceder a diferentes funcionalidades.

La aplicación cuenta con dos roles:

- **user:** puede consultar el catálogo y visualizar los detalles de los libros.
- **admin:** puede crear, editar y eliminar libros desde un panel de administración.

La autenticación se realiza mediante Better Auth, utilizando email y contraseña, además de inicio de sesión con GitHub cuando está configurado el proveedor OAuth.

## 2. Tecnologías utilizadas

### Frontend
- React
- Vite
- TypeScript
- React Hook Form
- Zod
- Better Auth Client

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Better Auth
- Zod

### Infraestructura
- MongoDB Atlas: base de datos.
- Render: despliegue del frontend y backend.
- GitHub: control de versiones y repositorio del proyecto.

## 3. Enlaces del proyecto

| Recurso | URL |
|---|---|
| Repositorio GitHub | https://github.com/lucaborghik/estante-fullstack |
| Frontend | https://estante-web-jdw3.onrender.com/ |
| Backend | https://estante-api-w034.onrender.com |
| Health Check | https://estante-api-w034.onrender.com/api/health |

**Plataforma de despliegue:** Render.

**Base de datos:** MongoDB Atlas.

## 4. Estructura del repositorio

El proyecto está organizado en dos directorios principales:

```text
estante-fullstack/
│
├── backend/
│   ├── src/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── env.ts
│   │   ├── seed.ts
│   │   ├── server.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── routes/
│   │       └── books.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── BookForm.tsx
│   │   ├── api.ts
│   │   ├── auth-client.ts
│   │   ├── main.tsx
│   │   └── styles.css
│   │
│   ├── package.json
│   ├── index.html
│   └── vite.config.ts
│
├── render.yaml
├── README.md
└── .gitignore
```

## 5. Entidad principal: Books

La entidad elegida para el proyecto es **Book (Libro)**.

Cada libro contiene los siguientes atributos:

| Campo | Tipo | Descripción |
|---|---|---|
| title | String | Título del libro |
| author | String | Autor del libro |
| genre | String | Género literario |
| publishedYear | Number | Año de publicación |
| available | Boolean | Indica si está disponible |
| createdAt | Date | Fecha de creación |
| updatedAt | Date | Fecha de última actualización |

Los registros se almacenan en MongoDB, dentro de la colección `books`.

## 6. Funcionalidades implementadas

### Catálogo público
- Listado de libros.
- Visualización de detalles.
- Información del autor, género y año de publicación.
- Estado de disponibilidad.

### Autenticación
- Registro de usuarios.
- Inicio de sesión mediante email y contraseña.
- Inicio de sesión con GitHub, sujeto a la configuración de OAuth.
- Cierre de sesión.
- Persistencia de sesión mediante Better Auth.

### Administración
- Panel de administración protegido por rol.
- Creación de libros.
- Edición de libros.
- Eliminación de libros.
- Validación de formularios.

### Autorización
- Asignación del rol `user` por defecto.
- Acceso administrativo exclusivo para usuarios con rol `admin`.
- Protección de las operaciones de escritura en el Backend mediante middleware de autenticación y autorización.

## 7. API REST – Endpoints

La API utiliza el prefijo `/api`.

Las rutas de lectura son públicas. Las operaciones de escritura requieren autenticación y el rol `admin`.

| Método | Ruta | Descripción | Rol requerido |
|---|---|---|---|
| GET | `/api/books` | Obtener todos los libros | Público |
| GET | `/api/books/:id` | Obtener un libro por ID | Público |
| POST | `/api/books` | Crear un libro | admin |
| PUT | `/api/books/:id` | Editar un libro | admin |
| DELETE | `/api/books/:id` | Eliminar un libro | admin |
| GET | `/api/me` | Obtener información del usuario autenticado | user / admin |
| ALL | `/api/auth/*` | Endpoints de autenticación de Better Auth | Según operación |
| GET | `/api/health` | Comprobar el estado del servidor | Público |

### Códigos HTTP utilizados

| Código | Descripción |
|---|---|
| 200 | Solicitud procesada correctamente |
| 201 | Recurso creado correctamente |
| 204 | Recurso eliminado correctamente |
| 400 | Error de validación de datos |
| 401 | Usuario no autenticado |
| 403 | Usuario sin permisos suficientes |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## 8. Validaciones

Se utiliza **Zod** para validar los datos enviados al Backend al crear y editar libros.

Se validan los siguientes campos:

- Título obligatorio.
- Autor obligatorio.
- Género obligatorio.
- Año de publicación numérico y entero.
- Disponibilidad de tipo booleano.

Las solicitudes con datos inválidos devuelven un error HTTP 400 con información sobre los campos que no cumplen las validaciones.

En el Frontend se utilizan React Hook Form y Zod para validar los formularios y mostrar los errores correspondientes.

## 9. Autenticación y roles

La autenticación está implementada mediante Better Auth con almacenamiento de usuarios y sesiones en MongoDB.

Se utilizan dos roles:

**USER**
- Se asigna automáticamente al registrarse.
- Puede consultar el catálogo.
- No puede crear, modificar ni eliminar libros.
- No puede acceder al panel administrativo.

**ADMIN**
- Puede consultar el catálogo.
- Puede acceder al panel de administración.
- Puede crear libros.
- Puede editar libros.
- Puede eliminar libros.

Las operaciones de escritura están protegidas en el Backend mediante:

- `authMiddleware`
- `requireRole("admin")`

La asignación inicial del administrador se realiza mediante el script de inicialización `seed.ts`.

## 10. Instalación y ejecución local

### Requisitos previos

- Node.js 20 o superior.
- npm.
- Una instancia de MongoDB local o MongoDB Atlas.
- Git.

### Clonar el repositorio

```bash
git clone https://github.com/lucaborghik/estante-fullstack.git
cd estante-fullstack
```

### Configurar el Backend

Ingresar en la carpeta:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` a partir de `.env.example`.

Configurar las variables de entorno necesarias.

### Variables de entorno del Backend

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor |
| NODE_ENV | Entorno de ejecución |
| MONGODB_URI | Cadena de conexión de MongoDB |
| MONGODB_DATABASE | Nombre de la base de datos |
| BETTER_AUTH_SECRET | Secreto de Better Auth, mínimo 32 caracteres |
| BETTER_AUTH_URL | URL base de Better Auth |
| FRONTEND_URL | URL del Frontend autorizado |
| GITHUB_CLIENT_ID | Identificador de la aplicación OAuth de GitHub |
| GITHUB_CLIENT_SECRET | Secreto de la aplicación OAuth de GitHub |
| SEED_ADMIN_EMAIL | Email del administrador inicial |
| SEED_ADMIN_PASSWORD | Contraseña del administrador inicial |
| SEED_USER_EMAIL | Email del usuario común inicial |
| SEED_USER_PASSWORD | Contraseña del usuario común inicial |

Las variables de GitHub y las correspondientes al Seed son opcionales para el funcionamiento básico, aunque se necesitan para habilitar el login social y crear las cuentas iniciales, respectivamente.

**Importante:** nunca subir el archivo `.env` al repositorio. Utilizar `.env.example` como plantilla sin valores reales.

### Ejecutar el Backend

Desde la carpeta `backend`:

```bash
npm run dev
```

El servidor se ejecuta en:

```text
http://localhost:3000
```

### Ejecutar el Frontend

Abrir una segunda terminal y desde la carpeta principal ejecutar:

```bash
cd frontend
npm install
npm run dev
```

El Frontend estará disponible en:

```text
http://localhost:5173
```

El servidor de desarrollo de Vite reenvía las solicitudes `/api` al Backend local.

## 11. Inicialización de usuarios de prueba

El proyecto incluye un script de inicialización ubicado en:

```text
backend/src/seed.ts
```

Para crear las cuentas iniciales se deben configurar las siguientes variables en `backend/.env`:

```env
SEED_ADMIN_EMAIL=admin@estante.com
SEED_ADMIN_PASSWORD=CONTRASEÑA_ADMIN
SEED_USER_EMAIL=user@estante.com
SEED_USER_PASSWORD=CONTRASEÑA_USER
```

Ejecutar desde la carpeta `backend`:

```bash
npm run seed
```

El script crea las cuentas si no existen y asigna los roles correspondientes.

- Administrador: `admin`
- Usuario común: `user`

Si las cuentas ya existen, el script actualiza sus roles, pero no modifica sus contraseñas.

## 12. Despliegue en Render

La aplicación se encuentra desplegada utilizando Render.

Se utilizan dos servicios:

**Backend**
- Tipo: Web Service.
- Runtime: Node.js.
- Directorio: `backend`.
- Comando de compilación: `npm ci --include=dev && npm run build`.
- Comando de inicio: `npm start`.
- Health check: `/api/health`.

**Frontend**
- Tipo: Static Site.
- Runtime: React / Vite.
- Directorio: `frontend`.
- Comando de compilación: `npm ci && npm run build`.
- Directorio de publicación: `dist`.

El Frontend utiliza rutas `/api` para comunicarse con el Backend mediante las reglas de rewrite configuradas en Render.

Las variables de entorno y los secretos se configuran directamente en Render y no se almacenan en el repositorio.

### Configuración de GitHub OAuth

Para habilitar el inicio de sesión con GitHub se necesita una OAuth App con las siguientes configuraciones:

- Homepage URL: `https://estante-web-jdw3.onrender.com`
- Authorization callback URL: `https://estante-web-jdw3.onrender.com/api/auth/callback/github`

Las credenciales `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` deben configurarse en las variables de entorno del Backend.

## 13. Cuentas de prueba para corrección

Las siguientes cuentas están creadas en la base de datos de producción:

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin@estante.com | REEMPLAZAR POR LA CONTRASEÑA CONFIGURADA |
| Usuario común | user@estante.com | REEMPLAZAR POR LA CONTRASEÑA CONFIGURADA |

Las contraseñas corresponden a cuentas de demostración destinadas a la evaluación del proyecto.

## 14. Autor

**Proyecto:** Estante – Catálogo de libros.

**Tipo:** Trabajo Práctico Final – Aplicación Full Stack.

**Repositorio:** https://github.com/lucaborghik/estante-fullstack

**Despliegue:** Render.

**Base de datos:** MongoDB Atlas.