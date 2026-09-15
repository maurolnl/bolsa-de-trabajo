## Why

El frontend ya conserva el rol entregado por la API, pero todavía no permite elegirlo al registrarse ni lo usa para dirigir o proteger la experiencia autenticada. Esto deja el alta inaccesible y permite que cualquier cuenta entre al asistente de empleado, aunque su rol sea empleador.

## What Changes

- Incorporar una pantalla de registro con email, contraseña y selección obligatoria e inmutable de rol Empleado/Empleador, validada con Zod y React Hook Form.
- Enviar el rol mediante el repositorio de autenticación y conducir al usuario al login después de un registro exitoso.
- Resolver el destino autenticado usando exclusivamente el rol de `/auth/me` y la existencia del perfil correspondiente.
- Proteger las rutas de onboarding para impedir el acceso de un rol al flujo del rol opuesto.
- Mantener estados explícitos de inicialización, carga y error para evitar flashes y ciclos de redirección.
- Preparar una ruta estable de onboarding de empleador como punto de integración para LAB-22, sin implementar en este cambio su formulario ni la creación del perfil.

## Capabilities

### New Capabilities

- `role-profile-navigation`: Resolución de destinos y autorización de rutas según rol autenticado y existencia del perfil propio.

### Modified Capabilities

- `role-aware-auth-contract`: Añadir el formulario visible que valida y envía el rol obligatorio durante el registro.

## Impact

- Frontend: autenticación, formulario y página de registro, rutas, guards y consultas de existencia de perfiles.
- API consumida sin cambios: `POST /auth/register`, `GET /auth/me`, `GET /users/{userID}/employee` y `GET /users/{userID}/employer`.
- Integración futura: LAB-22 deberá montar el formulario de empleador en la ruta de onboarding preparada aquí.
- Sin cambios de backend, base de datos, documentación raíz ni dependencias externas.
