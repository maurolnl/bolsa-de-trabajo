## Purpose

Definir cómo el frontend representa el rol de dominio al registrar una cuenta y al reconstruir una sesión autenticada con las respuestas de la API.

## Requirements

### Requirement: Contrato de registro con rol
El frontend SHALL ofrecer un formulario de registro con email, contraseña y un rol obligatorio cuyo valor MUST ser `employee` o `employer`, SHALL validar esos campos antes del envío y SHALL enviar los tres valores a `POST /auth/register` sin transformar el rol.

#### Scenario: Envío de registro tipado
- **WHEN** el flujo de registro invoca el repositorio con credenciales y un rol válido
- **THEN** el frontend envía `email`, `password` y `role` sin transformar el valor del rol

#### Scenario: Registro como empleado
- **WHEN** una persona completa credenciales válidas y selecciona Empleado
- **THEN** el frontend envía `email`, `password` y `role: "employee"` y, ante una respuesta exitosa, navega al login

#### Scenario: Registro como empleador
- **WHEN** una persona completa credenciales válidas y selecciona Empleador
- **THEN** el frontend envía `email`, `password` y `role: "employer"` y, ante una respuesta exitosa, navega al login

#### Scenario: Rol sin seleccionar
- **WHEN** una persona intenta registrarse sin seleccionar un rol
- **THEN** el formulario muestra un error de validación y no invoca la API

#### Scenario: Rol fuera del dominio
- **WHEN** el formulario o código consumidor intenta construir credenciales con un rol diferente de `employee` o `employer`
- **THEN** la validación en runtime y el contrato TypeScript rechazan ese valor

#### Scenario: Rol inmutable en la interfaz
- **WHEN** una cuenta ya fue creada o existe una sesión autenticada
- **THEN** la interfaz no ofrece ninguna acción para editar el rol de la cuenta

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
