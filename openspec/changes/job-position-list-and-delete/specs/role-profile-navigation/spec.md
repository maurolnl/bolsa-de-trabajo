## MODIFIED Requirements

### Requirement: Rutas de gestión de puestos condicionadas a perfil existente
El frontend MUST reservar las rutas de gestión de puestos —listado, alta, edición y
candidatos recomendados— a una sesión autenticada con rol `employer` que ya posea perfil
propio, y SHALL redirigir al onboarding de empleador cuando ese perfil no exista.

#### Scenario: Empleador con perfil abre el alta de un puesto
- **WHEN** una sesión `employer` con perfil solicita la ruta de alta de un puesto
- **THEN** el frontend muestra el formulario de creación

#### Scenario: Empleador con perfil abre el listado de puestos
- **WHEN** una sesión `employer` con perfil solicita la ruta de listado de puestos
- **THEN** el frontend muestra el listado de sus puestos activos

#### Scenario: Empleador sin perfil abre una ruta de puestos
- **WHEN** una sesión `employer` sin perfil solicita la ruta de listado, de alta, de
  edición o de candidatos recomendados de un puesto
- **THEN** el frontend reemplaza la ubicación por `/main/employer/profile` sin mostrar la
  pantalla de puestos

#### Scenario: Empleado intenta abrir una ruta de puestos
- **WHEN** una sesión `employee` solicita directamente la ruta de listado, de alta, de
  edición o de candidatos recomendados de un puesto
- **THEN** el frontend reemplaza la ubicación por el destino válido del empleado

#### Scenario: Perfil de empleador todavía pendiente
- **WHEN** la consulta del perfil de empleador está pendiente al abrir una ruta de puestos
- **THEN** el frontend muestra un estado de carga y no ejecuta una redirección provisional

#### Scenario: Puesto ajeno o inexistente
- **WHEN** una sesión `employer` con perfil solicita la edición o los candidatos
  recomendados de un puesto que no le pertenece o que fue eliminado
- **THEN** el frontend presenta un estado que explica la indisponibilidad y no ofrece
  reintentar una operación que la API ya rechazó por autorización
