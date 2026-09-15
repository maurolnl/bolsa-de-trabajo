## MODIFIED Requirements

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
