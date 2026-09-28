## ADDED Requirements

### Requirement: Certificaciones del candidato con su documento
El perfil del candidato SHALL presentar cada certificación de `certifications` con su nombre
y, cuando `document_id` no es nulo, un botón que descarga ese PDF mediante
`GET /employees/{employeeID}/files/{document_id}/download-url` con las mismas reglas de URL
prefirmada de un solo uso. Los ítems de `files` SHALL presentarse como «Certificado sin
asociar». El frontend MUST NOT inferir a qué certificación corresponde un certificado sin
asociar.

#### Scenario: Descarga del PDF de una certificación puntual
- **WHEN** el empleador abre el perfil de un candidato con «Scrum Master» y «AWS Cloud
  Practitioner», cada una con su PDF, y pide descargar el de «AWS Cloud Practitioner»
- **THEN** el frontend solicita la URL prefirmada del `document_id` de esa certificación y la
  usa inmediatamente

#### Scenario: Certificación sin documento
- **WHEN** una certificación del candidato trae `document_id: null`
- **THEN** el frontend la muestra sin ofrecer descarga

#### Scenario: Certificado viejo sin asociar
- **WHEN** el perfil del candidato trae ítems en `files`
- **THEN** el frontend los presenta como «Certificado sin asociar» con su descarga

#### Scenario: Candidato sin certificaciones
- **WHEN** `certifications` y `files` llegan vacíos
- **THEN** el frontend indica que el candidato no tiene certificaciones
