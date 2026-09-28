# job-position-management Specification

## Purpose
Permitir que un empleador con perfil vea los puestos activos que publicó, los abra para
editarlos, los retire con una confirmación explícita y acceda a los candidatos
recomendados de cada uno.

## Requirements

### Requirement: Listado de los puestos activos del empleador autenticado
El frontend SHALL listar los puestos activos del empleador derivado del perfil propio
consultado, MUST NOT aceptar un identificador de empleador ingresado por el usuario o
tomado de la URL, y SHALL mostrar de cada puesto su posición, rol, experiencia requerida,
nivel educativo pretendido, horas disponibles por día, timezone y recursos técnicos.

#### Scenario: Empleador con puestos publicados
- **WHEN** un empleador con perfil abre el área de puestos y la colección responde con al
  menos un puesto
- **THEN** el frontend presenta cada puesto con sus datos y sus acciones disponibles

#### Scenario: Identificador de empleador derivado del perfil
- **WHEN** el frontend solicita la colección de puestos
- **THEN** usa el identificador del perfil de empleador de la sesión y no un valor
  provisto por el navegador

#### Scenario: Recursos técnicos vacíos
- **WHEN** un puesto del listado no declara recursos técnicos
- **THEN** el frontend lo indica explícitamente en lugar de dejar el campo en blanco

### Requirement: Estados de carga, vacío y error del listado
El frontend SHALL distinguir los estados de carga, colección vacía y error del listado,
MUST ofrecer un reintento cuando el error sea recuperable, y MUST NOT presentar el estado
vacío mientras la consulta siga pendiente o haya fallado.

#### Scenario: Consulta pendiente
- **WHEN** la colección de puestos todavía no resolvió
- **THEN** el frontend muestra un estado de carga y no anticipa el listado ni el estado
  vacío

#### Scenario: Empleador sin puestos publicados
- **WHEN** la colección resuelve sin puestos
- **THEN** el frontend muestra un estado vacío que explica la situación y ofrece publicar
  un puesto nuevo

#### Scenario: Error al obtener la colección
- **WHEN** la consulta de la colección falla
- **THEN** el frontend muestra un estado de error con una acción de reintento y no
  presenta un listado parcial

### Requirement: Edición desde el listado
El frontend SHALL ofrecer en cada puesto del listado una acción que abra su edición
reutilizando el formulario existente.

#### Scenario: Apertura de la edición
- **WHEN** el empleador activa la acción de editar de un puesto del listado
- **THEN** el frontend navega a la edición de ese puesto

### Requirement: Eliminación confirmada de un puesto
El frontend SHALL exigir una confirmación explícita antes de eliminar un puesto, MUST
identificar en la confirmación el puesto afectado, MUST advertir que la acción no se
revierte, y MUST NOT solicitar la eliminación a la API si el empleador cancela.

#### Scenario: Confirmación aceptada
- **WHEN** el empleador activa la acción de eliminar y confirma
- **THEN** el frontend solicita la eliminación del puesto a la API

#### Scenario: Confirmación cancelada
- **WHEN** el empleador activa la acción de eliminar y cancela
- **THEN** el frontend no solicita ninguna operación y conserva el listado intacto

#### Scenario: Eliminación en curso
- **WHEN** una eliminación está pendiente
- **THEN** el frontend impide reenviarla y mantiene visible que la operación está en
  progreso

### Requirement: Actualización del listado tras eliminar
El frontend SHALL invalidar el estado remoto de la colección del empleador y del puesto
eliminado al completarse la operación, de modo que el puesto desaparezca del listado sin
requerir una recarga manual.

#### Scenario: Eliminación exitosa
- **WHEN** la API confirma la eliminación de un puesto
- **THEN** el puesto deja de aparecer en el listado y el frontend informa el resultado

#### Scenario: Eliminación rechazada
- **WHEN** la API rechaza la eliminación
- **THEN** el frontend conserva el puesto en el listado y presenta el error recibido

#### Scenario: Puesto ya inexistente
- **WHEN** la API responde que el puesto no existe o no pertenece al empleador
- **THEN** el frontend actualiza el listado contra la API en lugar de mantener el puesto
  visible

### Requirement: Ausencia de reapertura
El frontend MUST NOT ofrecer ninguna acción de reapertura, restauración o reactivación de
un puesto eliminado, ni listar puestos eliminados.

#### Scenario: Puesto eliminado
- **WHEN** el empleador vuelve al listado después de eliminar un puesto
- **THEN** el frontend no presenta ese puesto ni acción alguna para recuperarlo

### Requirement: Acceso a los candidatos recomendados de un puesto
El frontend SHALL ofrecer en cada puesto del listado un acceso a sus candidatos
recomendados, y ese destino SHALL presentar los candidatos que la API informa para el puesto
en lugar de anunciarse como pendiente. El destino MUST quedar reservado a una sesión con rol
`employer`, y MUST NOT presentar candidatos de un puesto que la API ya no resuelve como
propio y vigente.

#### Scenario: Apertura de los candidatos de un puesto
- **WHEN** el empleador activa el acceso a los candidatos recomendados de un puesto
- **THEN** el frontend navega al destino de candidatos de ese puesto y consulta sus
  candidatos recomendados

#### Scenario: Recomendaciones todavía no disponibles
- **WHEN** el empleador abre el destino de candidatos y la generación para ese puesto
  todavía no terminó
- **THEN** el frontend explica que las recomendaciones se calculan de forma diferida, no
  muestra candidatos inventados y actualiza la pantalla cuando la generación concluye

#### Scenario: Puesto eliminado
- **WHEN** el empleador abre el destino de candidatos de un puesto que fue eliminado
- **THEN** el frontend informa que el puesto ya no está disponible, no presenta candidatos y
  ofrece regresar al listado

#### Scenario: Empleado intenta abrir los candidatos de un puesto
- **WHEN** una sesión `employee` solicita directamente el destino de candidatos de un puesto
- **THEN** el frontend reemplaza la ubicación por el destino válido del empleado
