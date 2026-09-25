## MODIFIED Requirements

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
