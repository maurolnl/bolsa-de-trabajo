## MODIFIED Requirements

### Requirement: Destino autenticado determinado por rol y perfil
El frontend SHALL obtener el rol desde la sesión reconstruida mediante `GET /auth/me`, SHALL consultar la existencia del perfil propio correspondiente y SHALL elegir el destino mediante la ruta neutral `/main`, sin confiar en un rol almacenado por separado en el navegador.

#### Scenario: Empleado sin perfil
- **WHEN** `/auth/me` identifica al usuario como `employee` y la API informa que su perfil de empleado no existe
- **THEN** el frontend navega a `/main/employee/profile`

#### Scenario: Empleado con perfil
- **WHEN** `/auth/me` identifica al usuario como `employee` y la API devuelve su perfil de empleado
- **THEN** el frontend navega a `/main/employee/home`, que presenta sus puestos recomendados

#### Scenario: Empleador sin perfil
- **WHEN** `/auth/me` identifica al usuario como `employer` y la API informa que su perfil de empleador no existe
- **THEN** el frontend navega a `/main/employer/profile`, ruta estable preparada para LAB-22

#### Scenario: Empleador con perfil
- **WHEN** `/auth/me` identifica al usuario como `employer` y la API devuelve su perfil de empleador
- **THEN** el frontend navega a `/main/employer/jobs`, destino preparado para la futura gestión de puestos

#### Scenario: Destino posterior al login
- **WHEN** el login finaliza y `/auth/me` reconstruye una sesión válida
- **THEN** el frontend resuelve el destino con el rol confirmado y la existencia del perfil antes de navegar

#### Scenario: Entrada legacy a main home
- **WHEN** una navegación existente solicita `/main/home`
- **THEN** el frontend reemplaza esa ubicación por `/main` para resolver el destino canónico

## ADDED Requirements

### Requirement: Ruta de recomendaciones del empleado condicionada a perfil existente
El frontend MUST reservar `/main/employee/home` a una sesión autenticada con rol `employee`
que ya posea perfil propio, y SHALL redirigir al onboarding de empleado cuando ese perfil no
exista. La ruta deja de presentar una pantalla de continuidad y pasa a presentar los puestos
recomendados del empleado.

#### Scenario: Empleado con perfil abre sus recomendaciones
- **WHEN** una sesión `employee` con perfil solicita `/main/employee/home`
- **THEN** el frontend presenta la pantalla de puestos recomendados

#### Scenario: Empleado sin perfil abre sus recomendaciones
- **WHEN** una sesión `employee` sin perfil solicita `/main/employee/home`
- **THEN** el frontend reemplaza la ubicación por `/main/employee/profile` sin consultar
  recomendaciones

#### Scenario: Empleador intenta abrir las recomendaciones del empleado
- **WHEN** una sesión `employer` solicita directamente `/main/employee/home`
- **THEN** el frontend reemplaza la ubicación por el destino válido del empleador

#### Scenario: Perfil de empleado todavía pendiente
- **WHEN** la consulta del perfil de empleado está pendiente al abrir `/main/employee/home`
- **THEN** el frontend muestra un estado de carga y no ejecuta una redirección provisional
