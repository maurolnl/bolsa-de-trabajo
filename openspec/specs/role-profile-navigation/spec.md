## Purpose

Dirigir cada sesión autenticada al flujo correspondiente a su identidad de dominio y evitar el acceso cruzado a perfiles de empleado y empleador.

## Requirements

### Requirement: Destino autenticado determinado por rol y perfil
El frontend SHALL obtener el rol desde la sesión reconstruida mediante `GET /auth/me`, SHALL consultar la existencia del perfil propio correspondiente y SHALL elegir el destino mediante la ruta neutral `/main`, sin confiar en un rol almacenado por separado en el navegador.

#### Scenario: Empleado sin perfil
- **WHEN** `/auth/me` identifica al usuario como `employee` y la API informa que su perfil de empleado no existe
- **THEN** el frontend navega a `/main/employee/profile`

#### Scenario: Empleado con perfil
- **WHEN** `/auth/me` identifica al usuario como `employee` y la API devuelve su perfil de empleado
- **THEN** el frontend navega a `/main/employee/home`

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

### Requirement: Rutas de perfil aisladas por rol
El frontend MUST impedir que una cuenta autenticada acceda al onboarding o a las pantallas reservadas al rol opuesto.

#### Scenario: Empleador intenta abrir onboarding de empleado
- **WHEN** una sesión `employer` solicita directamente la ruta de onboarding de empleado
- **THEN** el frontend reemplaza la ubicación por el destino válido del empleador

#### Scenario: Empleado intenta abrir onboarding de empleador
- **WHEN** una sesión `employee` solicita directamente la ruta de onboarding de empleador
- **THEN** el frontend reemplaza la ubicación por el destino válido del empleado

#### Scenario: Sesión no autenticada
- **WHEN** una persona sin sesión intenta abrir cualquier ruta protegida por rol
- **THEN** el frontend la dirige al login y conserva la ubicación solicitada según el comportamiento de autenticación existente

### Requirement: Resolución estable ante carga y errores
El frontend SHALL esperar la inicialización de la sesión y la consulta de perfil antes de decidir una redirección, y MUST presentar un estado recuperable ante errores que no representen ausencia de perfil.

#### Scenario: Sesión o perfil cargando
- **WHEN** `/auth/me` o la consulta del perfil correspondiente todavía está pendiente
- **THEN** el frontend muestra un estado de carga y no ejecuta una redirección provisional

#### Scenario: Perfil ausente según contrato
- **WHEN** la consulta de empleado devuelve el error contractual de perfil inexistente o la consulta de empleador devuelve `404`
- **THEN** el frontend clasifica el resultado como perfil ausente y navega una sola vez al onboarding correcto

#### Scenario: Error inesperado al consultar el perfil
- **WHEN** la consulta falla por autenticación, red, servidor u otro error distinto de perfil inexistente
- **THEN** el frontend muestra un error con opción de reintento y no redirige al onboarding ni entra en un ciclo

#### Scenario: Acceso a registro durante restauración
- **WHEN** la aplicación todavía restaura una sesión y se solicita una ruta pública exclusiva para personas no autenticadas
- **THEN** el frontend espera la inicialización antes de decidir si muestra la ruta o redirige

### Requirement: Onboarding de empleador condicionado a perfil ausente
El frontend MUST reservar `/main/employer/profile` para una sesión autenticada con rol `employer` cuyo perfil propio no exista, y SHALL resolver el destino posterior al alta con el mismo estado remoto utilizado por la navegación principal.

#### Scenario: Empleador sin perfil abre el onboarding
- **WHEN** una sesión `employer` solicita `/main/employer/profile` y la consulta informa que su perfil no existe
- **THEN** el frontend muestra el formulario de creación del perfil

#### Scenario: Empleador con perfil abre el onboarding
- **WHEN** una sesión `employer` solicita directamente `/main/employer/profile` y la consulta devuelve su perfil
- **THEN** el frontend reemplaza la ubicación por `/main/employer/jobs` sin mostrar el formulario

#### Scenario: Alta completada
- **WHEN** la creación del perfil finaliza correctamente
- **THEN** el frontend invalida el estado remoto correspondiente y navega a `/main/employer/jobs`

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
