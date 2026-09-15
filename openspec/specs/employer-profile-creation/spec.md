## Purpose

Permitir que una cuenta con rol `employer` complete una única vez su perfil propio mediante un formulario validado y conectado al contrato HTTP protegido.

## Requirements

### Requirement: Formulario único del perfil de empleador
El frontend SHALL presentar en `/main/employer/profile` un formulario único con nombre, industria, ubicación y modalidades de contratación libres, y MUST exigir que nombre, industria y ubicación contengan texto distinto de espacios.

#### Scenario: Datos obligatorios incompletos
- **WHEN** el empleador intenta enviar el formulario con nombre, industria o ubicación vacío o compuesto solo por espacios
- **THEN** el frontend muestra la validación correspondiente y no solicita la creación del perfil

#### Scenario: Modalidades libres
- **WHEN** el empleador agrega o elimina modalidades de contratación
- **THEN** el frontend conserva las modalidades como `string[]`, permite una lista vacía y no admite elementos vacíos ni compuestos solo por espacios

### Requirement: Creación del perfil propio mediante la API
El frontend SHALL enviar nombre, industria, ubicación y `hiring_modalities` a `POST /employers`, sin incluir un identificador de usuario, y MUST impedir envíos repetidos mientras la creación esté pendiente.

#### Scenario: Creación exitosa
- **WHEN** un empleador sin perfil envía datos válidos y la API responde `201`
- **THEN** el frontend considera completada la creación, actualiza el estado remoto del perfil y navega a `/main/employer/jobs`

#### Scenario: Error de creación
- **WHEN** la API rechaza la creación o falla la comunicación
- **THEN** el frontend conserva los valores ingresados, vuelve a habilitar el formulario y presenta el error mediante el patrón global existente sin navegar

### Requirement: Coherencia entre consulta y creación
El frontend MUST consultar `GET /users/{userID}/employer` antes de ofrecer el alta y SHALL compartir el estado cacheado del perfil entre la resolución de navegación y la mutación de creación.

#### Scenario: Perfil ya existente
- **WHEN** la consulta devuelve un perfil de empleador existente
- **THEN** el frontend no muestra ni envía el formulario de alta y reemplaza el destino por `/main/employer/jobs`

#### Scenario: Verificación pendiente
- **WHEN** la existencia del perfil todavía se está consultando
- **THEN** el frontend muestra un estado de carga y no permite enviar datos

#### Scenario: Error al verificar el perfil
- **WHEN** la consulta falla por una causa distinta de perfil inexistente
- **THEN** el frontend muestra un estado de error recuperable y no presenta el formulario como si el perfil faltara
