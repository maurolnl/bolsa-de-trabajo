## Purpose

Presentar al empleador autenticado los candidatos que el backend recomendó para un puesto
propio, informando con honestidad en qué estado está una generación que es asíncrona,
permitiendo evaluar a cada candidato con su perfil completo y sus archivos, y sin exponer ni
conservar la ubicación de esos archivos.

## ADDED Requirements

### Requirement: Consulta de los candidatos recomendados de un puesto propio
El frontend SHALL obtener los candidatos recomendados desde
`GET /jobs/{jobPositionID}/employee-recommendations`, SHALL tomar `jobPositionID` del puesto
que la navegación identifica, y MUST NOT derivar de ese identificador ninguna decisión de
autorización: la propiedad del puesto la resuelve la API contra la identidad del token.

#### Scenario: Empleador abre los candidatos de un puesto propio
- **WHEN** una sesión `employer` abre el destino de candidatos de un puesto que le pertenece
- **THEN** el frontend consulta los candidatos recomendados de ese puesto y presenta el
  resultado que la API informa

#### Scenario: Consulta rechazada por autorización
- **WHEN** la API responde `403` a la consulta de candidatos
- **THEN** el frontend presenta un estado que explica la indisponibilidad, no distingue el
  puesto ajeno del rol incorrecto y no reintenta automáticamente una operación que la API ya
  rechazó por autorización

#### Scenario: Puesto inexistente o eliminado
- **WHEN** la API responde `404` a la consulta de candidatos
- **THEN** el frontend presenta un único estado que informa que el puesto ya no está
  disponible, MUST NOT afirmar si el puesto fue eliminado o nunca existió, y ofrece regresar
  al listado de puestos sin reintentar la consulta

### Requirement: Estado de generación distinguido del conjunto de resultados
El frontend SHALL tratar el estado informado por la API y la lista de candidatos como dos
datos independientes, porque la API deriva el estado del batch más reciente y los items del
último batch completado, que pueden no ser el mismo. Los tipos del frontend MUST representar
los cinco estados `none`, `pending`, `processing`, `completed` y `failed` sin colapsarlos en
un booleano ni inferirlos a partir de la cantidad de items.

#### Scenario: Generación en curso con resultados anteriores
- **WHEN** la API informa `processing` junto con items de una generación previa
- **THEN** el frontend presenta esos candidatos e indica además que las recomendaciones se
  están actualizando

#### Scenario: Generación terminada sin coincidencias
- **WHEN** la API informa `completed` con la lista de candidatos vacía
- **THEN** el frontend presenta un estado vacío que explica que no se encontraron candidatos
  para el puesto

#### Scenario: Generación nunca solicitada
- **WHEN** la API informa `none`
- **THEN** el frontend presenta un estado vacío distinto del anterior, que explica que
  todavía no se generaron candidatos para ese puesto

#### Scenario: Generación fallida
- **WHEN** la API informa `failed`
- **THEN** el frontend presenta un estado de error que explica que la generación no pudo
  completarse y ofrece volver a consultar

#### Scenario: Estado desconocido
- **WHEN** la API informa un estado que el frontend no conoce
- **THEN** el frontend lo trata como `none` y MUST NOT propagarlo a la interfaz

### Requirement: Sondeo acotado al estado de generación
El frontend SHALL volver a consultar los candidatos mientras el estado informado sea
`pending` o `processing`, y SHALL detener el sondeo cuando el estado sea `none`, `completed`
o `failed`, cuando la consulta falle, y cuando la pantalla se desmonte. El sondeo MUST NOT
continuar con la pestaña en segundo plano.

#### Scenario: Espera de una generación en curso
- **WHEN** la API informa `pending` o `processing`
- **THEN** el frontend vuelve a consultar periódicamente hasta que el estado informe un
  desenlace, sin que el empleador tenga que recargar la pantalla

#### Scenario: Desenlace alcanzado
- **WHEN** el estado pasa a `completed`, `failed` o `none`
- **THEN** el frontend deja de consultar periódicamente

#### Scenario: Error durante la espera
- **WHEN** una consulta del sondeo falla
- **THEN** el frontend detiene el sondeo y presenta el error en lugar de repetir la consulta
  en silencio detrás de una pantalla que sigue diciendo que carga

#### Scenario: Abandono de la pantalla
- **WHEN** el empleador navega fuera del destino de candidatos durante una generación en
  curso
- **THEN** el frontend deja de consultar

### Requirement: Paginación explícita derivada del total informado
El frontend SHALL pedir los candidatos con `limit` y `offset` dentro del rango que la API
acepta, SHALL derivar el recorrido de páginas del `total` que la respuesta informa, y
MUST NOT acumular páginas en memoria ni reordenar o filtrar el conjunto que la API devuelve.

#### Scenario: Conjunto de varias páginas
- **WHEN** el total informado supera el tamaño de página
- **THEN** el frontend ofrece avanzar y retroceder, y presenta un solo tramo por vez

#### Scenario: Conjunto de una sola página
- **WHEN** el total informado no supera el tamaño de página
- **THEN** el frontend no ofrece controles de paginación

#### Scenario: Conjunto reducido entre dos generaciones
- **WHEN** una nueva generación deja el tramo que se está mirando fuera del total informado
- **THEN** el frontend vuelve al primer tramo en lugar de presentar una página vacía que no
  es el resultado real

### Requirement: Puntaje presentado solo cuando la API lo provee
El frontend SHALL presentar el puntaje de afinidad de un candidato únicamente cuando la API
lo envía con valor. MUST NOT sustituir un puntaje ausente por cero, por un texto de ausencia,
ni por una posición derivada del orden, y MUST NOT reescalar el valor recibido.

#### Scenario: Candidato sin puntaje calculado
- **WHEN** la API envía el candidato con puntaje nulo
- **THEN** el frontend no presenta ninguna indicación de afinidad para ese candidato

#### Scenario: Candidato con puntaje calculado
- **WHEN** la API envía el candidato con un puntaje
- **THEN** el frontend lo presenta tal como lo recibió

### Requirement: Perfil completo del candidato consultado bajo demanda
El frontend SHALL ofrecer en cada candidato la apertura de su perfil completo, SHALL
obtenerlo desde `GET /employees/{employeeID}` en el momento de abrirlo, y MUST NOT consultar
los perfiles de los candidatos que el empleador no abrió. La apertura y el cierre del perfil
MUST NOT alterar el tramo paginado que se está mirando ni reiniciar el sondeo.

#### Scenario: Apertura del perfil de un candidato
- **WHEN** el empleador abre el perfil de un candidato del listado
- **THEN** el frontend consulta ese perfil y presenta experiencia, locación, recursos,
  disponibilidad, educación y los archivos disponibles

#### Scenario: Perfil en carga
- **WHEN** la consulta del perfil todavía no resolvió
- **THEN** el frontend presenta un estado de carga dentro del perfil y mantiene el listado
  visible

#### Scenario: Perfil no autorizado
- **WHEN** la API responde `403` a la consulta del perfil
- **THEN** el frontend explica que el perfil no está disponible y MUST NOT afirmar si el
  empleado existe

#### Scenario: Cierre del perfil
- **WHEN** el empleador cierra el perfil de un candidato
- **THEN** el frontend vuelve al listado en el mismo tramo y sin emitir una nueva consulta de
  candidatos

### Requirement: Descarga de archivos mediante URL prefirmada de un solo uso
El frontend SHALL obtener la URL de descarga de un certificado o de un documento de educación
desde su endpoint de URL prefirmada en el momento en que el empleador pide la descarga.
La URL obtenida MUST NOT persistirse en caché, en estado de la aplicación, ni como destino de
un enlace en el documento, y el frontend MUST NOT construir ninguna ubicación de archivo por
su cuenta.

#### Scenario: Descarga de un certificado
- **WHEN** el empleador pide descargar un certificado del perfil de un candidato
- **THEN** el frontend solicita la URL prefirmada de ese archivo y la usa inmediatamente para
  entregarlo

#### Scenario: Descarga de un documento de educación
- **WHEN** el empleador pide descargar el documento de un título del candidato
- **THEN** el frontend solicita la URL prefirmada de ese documento y la usa inmediatamente
  para entregarlo

#### Scenario: Título sin documento asociado
- **WHEN** un título del candidato no tiene documento
- **THEN** el frontend no ofrece descarga para ese título

#### Scenario: Descarga rechazada
- **WHEN** la API rechaza la solicitud de URL prefirmada
- **THEN** el frontend informa que el archivo no está disponible y no deja una descarga a
  medias ofrecida como disponible

#### Scenario: Ubicación del archivo nunca expuesta
- **WHEN** el frontend presenta los archivos de un candidato
- **THEN** identifica cada archivo por su título y su identificador, y MUST NOT presentar ni
  conservar la clave de objeto ni el bucket de almacenamiento
