## ADDED Requirements

### Requirement: Rutas de gestión de puestos condicionadas a perfil existente
El frontend MUST reservar las rutas de alta y edición de puestos a una sesión autenticada
con rol `employer` que ya posea perfil propio, y SHALL redirigir al onboarding de
empleador cuando ese perfil no exista.

#### Scenario: Empleador con perfil abre el alta de un puesto
- **WHEN** una sesión `employer` con perfil solicita la ruta de alta de un puesto
- **THEN** el frontend muestra el formulario de creación

#### Scenario: Empleador sin perfil abre una ruta de puestos
- **WHEN** una sesión `employer` sin perfil solicita la ruta de alta o de edición de un
  puesto
- **THEN** el frontend reemplaza la ubicación por `/main/employer/profile` sin mostrar el
  formulario de puestos

#### Scenario: Empleado intenta abrir una ruta de puestos
- **WHEN** una sesión `employee` solicita directamente la ruta de alta o de edición de un
  puesto
- **THEN** el frontend reemplaza la ubicación por el destino válido del empleado

#### Scenario: Perfil de empleador todavía pendiente
- **WHEN** la consulta del perfil de empleador está pendiente al abrir una ruta de puestos
- **THEN** el frontend muestra un estado de carga y no ejecuta una redirección provisional

### Requirement: Destino posterior al alta y a la edición de un puesto
El frontend SHALL mantener al empleador dentro del área de puestos después de publicar o
actualizar, y MUST NOT ofrecer ninguna acción de reapertura de un puesto.

#### Scenario: Puesto publicado
- **WHEN** la creación de un puesto finaliza correctamente
- **THEN** el frontend invalida el estado remoto de los puestos del empleador y presenta
  el resultado dentro del área `/main/employer/jobs`

#### Scenario: Puesto actualizado
- **WHEN** la edición de un puesto finaliza correctamente
- **THEN** el frontend invalida el estado remoto del puesto y de la colección, y regresa
  al área `/main/employer/jobs`

#### Scenario: Sin reapertura
- **WHEN** el empleador visualiza el formulario o el resultado de una operación sobre un
  puesto
- **THEN** el frontend no presenta ninguna acción de reapertura ni de cambio de estado de
  publicación
