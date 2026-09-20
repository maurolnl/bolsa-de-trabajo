## Purpose

Permitir que un empleador con perfil publique y corrija puestos de trabajo mediante un
formulario único, validado en el navegador y alineado con el contrato HTTP protegido de
puestos.

## ADDED Requirements

### Requirement: Formulario único de alta y edición
El frontend SHALL presentar un formulario único para alta y edición de un puesto con
posición, rol, experiencia requerida, nivel educativo pretendido, horas disponibles por
día, timezone y recursos técnicos, y MUST exigir todos los campos salvo los recursos
técnicos.

#### Scenario: Campos obligatorios incompletos
- **WHEN** el empleador intenta enviar el formulario con posición, rol, experiencia
  requerida, nivel educativo pretendido, horas disponibles por día o timezone vacío o
  compuesto solo por espacios
- **THEN** el frontend muestra la validación correspondiente y no solicita la operación
  a la API

#### Scenario: Valores fuera del dominio aceptado
- **WHEN** el empleador selecciona un valor de experiencia o de nivel educativo que no
  pertenece al conjunto aceptado por la API, o unas horas disponibles por día fuera del
  rango de 1 a 8
- **THEN** el frontend rechaza el valor antes de enviar y explica el dominio admitido

#### Scenario: Recursos técnicos opcionales
- **WHEN** el empleador agrega o elimina recursos técnicos
- **THEN** el frontend conserva los recursos como `string[]`, permite una lista vacía y
  no admite elementos vacíos ni compuestos solo por espacios

### Requirement: Coherencia de enums y timezones con el contrato existente
El frontend SHALL ofrecer para experiencia requerida y nivel educativo pretendido
exactamente los mismos valores que ya utiliza el perfil de empleado, SHALL enviarlos con
la codificación que la API acepta, y MUST poblar el selector de timezone desde el
catálogo remoto existente en lugar de una lista propia.

#### Scenario: Envío de enums codificados
- **WHEN** el empleador elige una opción de experiencia o de nivel educativo presentada
  en español
- **THEN** el frontend envía el código correspondiente del contrato y no la etiqueta
  visible

#### Scenario: Catálogo de timezones disponible
- **WHEN** el formulario se abre
- **THEN** el frontend obtiene los timezones del catálogo remoto compartido, reutiliza su
  estado cacheado y no permite enviar mientras el catálogo esté pendiente

#### Scenario: Catálogo de timezones no disponible
- **WHEN** la consulta del catálogo de timezones falla
- **THEN** el frontend presenta un estado de error recuperable y no ofrece el formulario
  con un selector vacío

### Requirement: Publicación de un puesto nuevo
El frontend SHALL crear el puesto contra la colección del empleador autenticado,
derivando el identificador de empleador del perfil propio consultado y nunca de un valor
ingresado por el usuario, y MUST impedir envíos repetidos mientras la creación esté
pendiente.

#### Scenario: Creación exitosa
- **WHEN** el empleador envía datos válidos y la API responde `201`
- **THEN** el frontend considera publicado el puesto, invalida el estado remoto de los
  puestos del empleador y presenta el puesto creado

#### Scenario: Identificador de empleador desconocido
- **WHEN** el perfil propio del empleador todavía no está disponible
- **THEN** el frontend no ofrece el envío y espera la resolución del perfil

#### Scenario: Error de creación
- **WHEN** la API rechaza la creación o falla la comunicación
- **THEN** el frontend conserva los valores ingresados, vuelve a habilitar el formulario
  y presenta el error mediante el patrón global existente sin navegar

### Requirement: Edición de un puesto existente
El frontend SHALL cargar el puesto a editar desde la API antes de mostrar el formulario,
SHALL inicializarlo con los valores vigentes y MUST enviar el conjunto completo de campos
en la actualización, porque la API reemplaza el puesto entero.

#### Scenario: Carga previa a la edición
- **WHEN** el empleador abre la edición de un puesto propio
- **THEN** el frontend muestra un estado de carga, obtiene el puesto y precarga todos los
  campos con los valores vigentes

#### Scenario: Edición exitosa
- **WHEN** el empleador envía cambios válidos y la API responde `200`
- **THEN** el frontend invalida el estado remoto del puesto y de los puestos del
  empleador, y presenta el puesto actualizado

#### Scenario: Puesto inexistente o ajeno
- **WHEN** la API responde `404` o `403` al cargar el puesto a editar
- **THEN** el frontend presenta un estado de error explícito y no muestra un formulario
  de edición vacío

### Requirement: Presentación de errores del contrato
El frontend MUST interpretar las respuestas de error de puestos con el formato
`{"error": "..."}` y SHALL mostrar el mensaje recibido en lugar de un texto genérico
cuando la API lo provea.

#### Scenario: Error de validación del servidor
- **WHEN** la API rechaza el cuerpo con `400` y un mensaje de validación
- **THEN** el frontend muestra ese mensaje y conserva los datos del formulario

#### Scenario: Operación prohibida
- **WHEN** la API responde `403` sobre un puesto ajeno o sobre una cuenta sin perfil de
  empleador
- **THEN** el frontend muestra el error recibido y no expone información sobre puestos de
  otros empleadores

### Requirement: Estado inicial de recomendaciones tras publicar
El frontend SHALL mostrar, junto al puesto recién publicado, un estado inicial de
recomendaciones declarado como pendiente, y MUST NOT consultar ningún endpoint ni exponer
ningún campo de recomendaciones mientras la capacidad no exista en la API.

#### Scenario: Puesto publicado
- **WHEN** la creación del puesto se completa correctamente
- **THEN** el frontend presenta el puesto publicado y un estado de recomendaciones
  pendiente, sin cifras ni candidatos

#### Scenario: Edición de un puesto
- **WHEN** la actualización de un puesto se completa correctamente
- **THEN** el frontend no presenta resultados de recomendaciones como si ya existieran
