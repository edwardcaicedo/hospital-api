# Hospital API

API REST para la gestión de un hospital: pacientes, doctores, citas médicas y usuarios, con autenticación JWT y control de acceso por roles (`admin`).

## Tecnologías

- Node.js + Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) para autenticación
- `bcrypt` para hash de contraseñas
- `dotenv` para variables de entorno

## Requisitos previos

- Node.js instalado
- PostgreSQL instalado y corriendo
- Una base de datos creada (por ejemplo `hospital`) con las tablas `pacientes`, `doctores`, `citas` y `usuarios`

## Instalación

1. Clona o descarga el proyecto.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con estas variables:

   ```env
   DB_NAME=hospital
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=una_clave_secreta_larga_y_dificil_de_adivinar
   ```

   > ⚠️ El archivo `.env` nunca debe subirse a un repositorio — ya está incluido en `.gitignore`.

4. Asegúrate de tener las tablas creadas en tu base de datos (`pacientes`, `doctores`, `citas`, `usuarios`), con sus respectivas llaves foráneas (`citas.paciente_id → pacientes.id`, `citas.doctor_id → doctores.id`).

5. Levanta el servidor:

   ```bash
   node app.js
   ```

   Deberías ver en la consola:
   ```
   Servidor corriendo en el puerto 3000
   ```

## Autenticación

La mayoría de operaciones de escritura (crear, modificar, eliminar) requieren estar autenticado como `admin`.

1. Inicia sesión:

   ```
   POST /api/auth/login
   Body: { "email": "...", "password": "..." }
   ```

2. La respuesta incluye un `token`. Cópialo y envíalo en cada petición protegida como header:

   ```
   Authorization: Bearer <token>
   ```

   El token expira en 1 hora — pasado ese tiempo, hay que volver a iniciar sesión.

## Endpoints

### Pacientes (`/pacientes`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/pacientes` | Pública | Lista pacientes (paginado: `?page=1&limit=10`) |
| GET | `/pacientes/:id` | Pública | Busca un paciente por id |
| GET | `/pacientes/ciudad/:ciudad` | Admin | Filtra pacientes por ciudad |
| POST | `/pacientes` | Admin | Crea un paciente |
| PUT | `/pacientes/:id` | Admin | Modifica un paciente |
| DELETE | `/pacientes/:id` | Admin | Elimina un paciente (falla si tiene citas asociadas) |

### Doctores (`/doctores`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/doctores` | Pública | Lista doctores (paginado) |
| GET | `/doctores/:id` | Pública | Busca un doctor por id |
| POST | `/doctores` | Admin | Crea un doctor |
| PUT | `/doctores/:id` | Admin | Modifica un doctor |
| DELETE | `/doctores/:id` | Admin | Elimina un doctor (falla si tiene citas asociadas) |

### Citas (`/citas`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/citas` | Pública | Lista citas (paginado) |
| GET | `/citas/:id` | Pública | Busca una cita por id |
| GET | `/citas/nombre/:nombre` | Pública | Busca citas por nombre de paciente |
| GET | `/citas/doctor/:nombre` | Pública | Busca citas por nombre de doctor |
| POST | `/citas` | Admin | Crea una cita |
| PUT | `/citas/:id` | Admin | Modifica una cita |
| DELETE | `/citas/:id` | Admin | Elimina una cita |

### Usuarios (`/usuarios`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/usuarios` | Pública | Lista usuarios (paginado, sin exponer password) |
| GET | `/usuarios/:id` | Pública | Busca un usuario por id |
| POST | `/usuarios` | Admin | Crea un usuario |
| PUT | `/usuarios/:id` | Admin | Modifica un usuario |
| DELETE | `/usuarios/:id` | Admin | Elimina un usuario |

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Pública | Inicia sesión y devuelve un token JWT |

## Manejo de errores

La API responde con códigos HTTP consistentes:

- `400` — datos inválidos o campos faltantes
- `401` — token inválido, expirado o ausente
- `403` — autenticado pero sin permisos suficientes
- `404` — recurso no encontrado
- `409` — conflicto (duplicado, o violación de relación entre tablas)
- `500` — error interno del servidor

## Autor

Proyecto de práctica personal — Ingeniería en Sistemas.

   ## Colección de Postman
   Las peticiones de prueba están en la carpeta `.resources/` (generadas con la extensión de Postman para VS Code). Ábrela con esa extensión para probar todos los endpoints ya configurados.
