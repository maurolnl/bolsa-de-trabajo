## Why

El backend incorporará un rol obligatorio e inmutable al registro y a la sesión, pero el contrato frontend actual solo modela email y contraseña y descarta el rol de `GET /auth/me`. El borde HTTP debe representar el nuevo payload sin adelantar el selector ni los guards visuales previstos para LAB-21.

## What Changes

- Definir un rol de cuenta para autenticación como la unión exacta `employee | employer`, sin reutilizar tipos legacy ni el campo profesional homónimo del perfil employee.
- Extender el contrato de registro para recibir email, contraseña y rol.
- Mapear el rol devuelto por login y `GET /auth/me` y conservarlo en el usuario de la sesión administrada por `AuthProvider`.
- Mantener fuera de alcance la pantalla/selector de registro y la autorización de rutas por rol, que corresponden a LAB-21.

## Capabilities

### New Capabilities
- `role-aware-auth-contract`: Contrato frontend tipado para registrar y mantener en sesión los roles `employee` y `employer` entregados por la API.

### Modified Capabilities

## Impact

- Tipos, repositorio, hooks y estado de sesión de `src/features/auth`.
- Contrato coordinado con `POST /auth/register`, `POST /auth/login` y `GET /auth/me` del backend.
- Caso de uso de registro y sesión en el repositorio separado `docs/`.
- No se agregan pantallas, selectores ni guards por rol en este cambio.
