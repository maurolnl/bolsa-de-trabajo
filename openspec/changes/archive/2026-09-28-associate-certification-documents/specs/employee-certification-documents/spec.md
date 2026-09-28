## ADDED Requirements

### Requirement: Certificaciones con documento propio en el paso de experiencia
El paso de experiencia SHALL permitir declarar cero o más certificaciones, cada una con un
nombre y, opcionalmente, un único PDF propio. El frontend MUST NOT ofrecer un campo de PDF
compartido entre certificaciones. Cada nombre MUST ser no vacío tras recortar espacios y
único dentro del perfil sin distinguir mayúsculas; cada PDF MUST ser `application/pdf` de
hasta 5 MB. El frontend SHALL bloquear el envío y explicar el error cuando no se cumplan.

#### Scenario: Dos certificaciones con su PDF cada una
- **WHEN** el empleado agrega «Scrum Master» y «AWS Cloud Practitioner» y adjunta un PDF a
  cada una
- **THEN** el frontend envía ambas certificaciones, cada una referenciando su propio archivo

#### Scenario: Certificación sin PDF
- **WHEN** el empleado agrega una certificación y no adjunta PDF
- **THEN** el frontend la envía sin referencia a archivo

#### Scenario: Archivo inválido
- **WHEN** el empleado adjunta a una certificación un archivo que no es PDF o supera 5 MB
- **THEN** el frontend muestra el error en esa certificación y no envía el formulario

#### Scenario: Nombre repetido
- **WHEN** el empleado intenta agregar una certificación cuyo nombre ya existe en la lista
- **THEN** el frontend no la agrega dos veces e informa que ya existe

### Requirement: Contrato multipart de certificaciones
Al crear o actualizar el paso de experiencia, el frontend SHALL enviar `certifications` como
un único campo JSON con un arreglo de `{ "name" }` más, a lo sumo, uno de `"document"` (clave
`certification_document_{index}` del archivo nuevo adjuntado en el mismo multipart) o
`"document_id"` (identificador del PDF ya cargado que se conserva). El frontend MUST NOT
enviar `certifications[]` ni `certifications_file`, y MUST NOT adjuntar archivos que ninguna
certificación referencie.

#### Scenario: Edición sin tocar el PDF existente
- **WHEN** el empleado edita el paso de experiencia y no cambia el PDF de una certificación
  que ya tenía uno
- **THEN** el frontend envía esa certificación con su `document_id` y sin archivo

#### Scenario: Reemplazo del PDF
- **WHEN** el empleado adjunta un PDF nuevo a una certificación que ya tenía uno
- **THEN** el frontend envía la certificación con `document` y el archivo nuevo, y sin
  `document_id`

#### Scenario: Quitar el PDF
- **WHEN** el empleado quita el PDF de una certificación y guarda
- **THEN** el frontend envía la certificación solo con `name`

#### Scenario: Error de validación del backend
- **WHEN** la API responde `400` con `{"error": "..."}`
- **THEN** el frontend muestra ese mensaje y mantiene los datos cargados en el formulario

### Requirement: Certificaciones y certificados sin asociar en el perfil propio
Al precargar el paso de experiencia, el frontend SHALL leer `certifications` como
`[{ name, document_id }]` y SHALL indicar, por certificación, si tiene PDF, ofreciendo su
descarga cuando `document_id` no es nulo. Los ítems de `files` SHALL presentarse aparte como
«Certificado sin asociar», con descarga. La descarga SHALL pedir la URL prefirmada al hacer
clic y MUST NOT persistirla en caché, estado ni `href`.

#### Scenario: Certificación con PDF
- **WHEN** el perfil propio trae una certificación con `document_id` no nulo
- **THEN** el paso de experiencia la muestra con su PDF y un botón de descarga

#### Scenario: Certificación sin PDF
- **WHEN** una certificación trae `document_id: null`
- **THEN** el paso de experiencia la muestra sin botón de descarga

#### Scenario: Perfil con certificado viejo
- **WHEN** el perfil propio trae un ítem en `files`
- **THEN** el paso de experiencia lo lista como «Certificado sin asociar» con su descarga, y
  la vista no falla
