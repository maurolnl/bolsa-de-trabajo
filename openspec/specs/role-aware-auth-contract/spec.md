## Purpose

Definir cómo el frontend representa el rol de dominio al registrar una cuenta y al reconstruir una sesión autenticada con las respuestas de la API.

## Requirements

### Requirement: Contrato de registro con rol
El frontend SHALL modelar el registro con email, contraseña y un rol cuyo valor MUST ser `employee` o `employer`, y SHALL enviar esos tres campos a `POST /auth/register`.

#### Scenario: Envío de registro tipado
- **WHEN** el flujo de registro invoca el repositorio con credenciales y un rol válido
- **THEN** el frontend envía `email`, `password` y `role` sin transformar el valor del rol

#### Scenario: Rol fuera del dominio
- **WHEN** código consumidor intenta construir credenciales de registro con otro valor de rol
- **THEN** el contrato TypeScript rechaza ese valor como incompatible

### Requirement: Rol disponible en la sesión
El frontend SHALL mapear el rol recibido desde login y `GET /auth/me` al usuario autenticado y MUST conservarlo al reconstruir el estado de sesión desde un access token persistido.

#### Scenario: Login con rol
- **WHEN** `POST /auth/login` devuelve un usuario con rol válido y tokens
- **THEN** el repositorio expone el rol junto con id, email y grants de la respuesta

#### Scenario: Restauración de sesión
- **WHEN** `AuthProvider` restaura una sesión y `GET /auth/me` devuelve `ID`, `Email` y `Role`
- **THEN** el estado autenticado contiene id, email y el rol mapeado como `role`

#### Scenario: Respuesta con rol ausente o inválido
- **WHEN** login o `GET /auth/me` devuelve un rol distinto de `employee` o `employer`
- **THEN** el frontend rechaza la respuesta y no establece una sesión autenticada

#### Scenario: Cierre o fallo de sesión
- **WHEN** el usuario cierra sesión o falla la restauración
- **THEN** el frontend elimina la identidad autenticada sin conservar un rol anterior
