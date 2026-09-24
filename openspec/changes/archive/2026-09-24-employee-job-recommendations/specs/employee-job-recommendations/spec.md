## Purpose

Presentar al empleado autenticado los puestos de trabajo que el backend recomendó para su
perfil, informando con honestidad en qué estado está una generación que es asíncrona y no
atribuyendo afinidad a un puesto cuando la API no la calculó.

## ADDED Requirements

### Requirement: Consulta de los puestos recomendados del empleado autenticado
El frontend SHALL obtener los puestos recomendados desde
`GET /employees/{employeeID}/job-recommendations`, SHALL resolver `employeeID` a partir del
perfil de empleado de la sesión y no de un identificador ingresado en la navegación, y MUST
NOT emitir la consulta antes de conocer ese identificador.

#### Scenario: Empleado con perfil abre sus recomendaciones
- **WHEN** una sesión `employee` con perfil propio abre la pantalla de recomendaciones
- **THEN** el frontend consulta las recomendaciones del identificador de ese perfil y
  presenta el resultado que la API informa

#### Scenario: Identificador de perfil todavía desconocido
- **WHEN** la consulta del perfil de empleado está pendiente
- **THEN** el frontend muestra un estado de carga y no emite la consulta de recomendaciones

#### Scenario: Consulta rechazada por autorización
- **WHEN** la API responde `403` a la consulta de recomendaciones
- **THEN** el frontend presenta un estado que explica la indisponibilidad y no reintenta
  automáticamente una operación que la API ya rechazó por autorización

### Requirement: Estado de generación distinguido del conjunto de resultados
El frontend SHALL tratar el estado informado por la API y la lista de puestos como dos datos
independientes, porque la API deriva el estado del batch más reciente y los items del último
batch completado, que pueden no ser el mismo. Los tipos del frontend MUST representar los
cinco estados `none`, `pending`, `processing`, `completed` y `failed` sin colapsarlos en un
booleano ni inferirlos a partir de la cantidad de items.

#### Scenario: Regeneración en curso sobre un conjunto anterior
- **WHEN** la API informa estado `processing` junto con items de un conjunto anterior
- **THEN** el frontend presenta esos puestos y además indica que hay una generación en curso

#### Scenario: Generación fallida distinguida de un resultado vacío
- **WHEN** la API informa estado `failed`
- **THEN** el frontend explica que la generación falló y ofrece reintentarla, y no lo
  presenta como ausencia de coincidencias

#### Scenario: Estado desconocido en la respuesta
- **WHEN** la API informa un estado que el frontend no reconoce
- **THEN** el frontend lo trata como un resultado sin generación solicitada y no rompe la
  pantalla

### Requirement: Sondeo acotado al estado de generación
El frontend SHALL repetir la consulta mientras el estado informado sea `pending` o
`processing`, y MUST detener el sondeo cuando el estado sea `none`, `completed` o `failed`,
cuando la consulta falle y cuando la pantalla se desmonte.

#### Scenario: Generación pendiente o en curso
- **WHEN** la API informa estado `pending` o `processing`
- **THEN** el frontend vuelve a consultar periódicamente hasta que el estado cambie

#### Scenario: Desenlace alcanzado
- **WHEN** la API informa estado `none`, `completed` o `failed`
- **THEN** el frontend deja de consultar periódicamente

#### Scenario: Pantalla abandonada durante el sondeo
- **WHEN** el empleado abandona la pantalla mientras el sondeo está activo
- **THEN** el frontend no emite ninguna consulta posterior asociada a esa pantalla

#### Scenario: Consulta fallida durante el sondeo
- **WHEN** una consulta del sondeo falla
- **THEN** el frontend detiene el sondeo, presenta el error y ofrece reintentar de forma
  explícita

### Requirement: Desenlaces visibles de la pantalla de recomendaciones
El frontend SHALL presentar un desenlace explícito para cada situación y MUST distinguir
"nunca se solicitó una generación" de "la generación terminó sin coincidencias", porque la
acción que le corresponde al empleado es distinta en cada caso.

#### Scenario: Sin generación solicitada
- **WHEN** la API informa estado `none`
- **THEN** el frontend explica que todavía no hay una generación pedida para su perfil y
  orienta a completar o actualizar el perfil

#### Scenario: Generación completada sin coincidencias
- **WHEN** la API informa estado `completed` con un conjunto vacío
- **THEN** el frontend explica que no hay puestos disponibles que coincidan con su perfil

#### Scenario: Resultados disponibles
- **WHEN** la API informa un conjunto con al menos un puesto
- **THEN** el frontend presenta cada puesto con los datos que la respuesta trae, en el orden
  en que la API los devolvió

#### Scenario: Error de carga recuperable
- **WHEN** la consulta falla por red o por error del servidor
- **THEN** el frontend presenta un error con opción de reintentar y no muestra un conjunto
  vacío como si fuera el resultado

### Requirement: Orden y paginación delegados a la API
El frontend SHALL presentar los puestos en el orden que la API devuelve y MUST NOT
reordenarlos ni filtrarlos. La paginación SHALL pedirse con `limit` y `offset` dentro del
rango que la API acepta, y el recorrido SHALL derivarse del total que la respuesta informa.

#### Scenario: Recorrido entre páginas
- **WHEN** el total informado supera la cantidad de puestos de la página actual
- **THEN** el frontend ofrece avanzar a la página siguiente y consulta el tramo
  correspondiente

#### Scenario: Última página alcanzada
- **WHEN** la página actual cubre el final del total informado
- **THEN** el frontend no ofrece avanzar

#### Scenario: Primera página
- **WHEN** la página actual es la primera
- **THEN** el frontend no ofrece retroceder

#### Scenario: Conjunto reducido entre páginas
- **WHEN** el total informado deja la página actual fuera de rango
- **THEN** el frontend vuelve al comienzo del conjunto en lugar de mostrar una página vacía

### Requirement: Puntaje presentado solo cuando la API lo provee
El frontend MUST presentar el puntaje de afinidad únicamente cuando la respuesta lo trae con
un valor, y MUST NOT calcularlo, estimarlo, ni sustituir su ausencia por cero, por un texto
de afinidad ni por una posición derivada del orden.

#### Scenario: Puesto sin puntaje calculado
- **WHEN** un puesto recomendado llega con el puntaje ausente
- **THEN** el frontend presenta el puesto sin ningún indicador de afinidad

#### Scenario: Puesto con puntaje calculado
- **WHEN** un puesto recomendado llega con un puntaje
- **THEN** el frontend presenta ese valor tal como la API lo informó

#### Scenario: Conjunto completo sin puntajes
- **WHEN** ningún puesto del conjunto trae puntaje
- **THEN** el frontend presenta la lista sin prometer que está ordenada por afinidad

### Requirement: Acceso al detalle del puesto recomendado
El frontend SHALL ofrecer, desde cada puesto recomendado, el acceso a su detalle completo, y
MUST componerlo con los datos que la respuesta de recomendaciones ya trae embebidos. El
frontend MUST NOT consultar el recurso del puesto para abrir ese detalle: la lectura de un
puesto individual está reservada a su empleador y una sesión `employee` recibiría `403`.

#### Scenario: Detalle de un puesto recomendado
- **WHEN** el empleado activa el acceso al detalle de un puesto recomendado
- **THEN** el frontend presenta la información de ese puesto sin emitir ninguna petición
  adicional

#### Scenario: Detalle cerrado
- **WHEN** el empleado cierra el detalle
- **THEN** el frontend vuelve a la lista conservando el tramo que estaba viendo

### Requirement: Refresco de las recomendaciones tras cambios en el perfil
El frontend SHALL invalidar las recomendaciones del empleado cuando una operación de
creación o actualización de su perfil finalice correctamente, porque esa escritura dispara
una regeneración en el backend.

#### Scenario: Sección del perfil guardada
- **WHEN** la creación o la actualización de cualquier sección del perfil de empleado
  finaliza correctamente
- **THEN** el frontend descarta las recomendaciones en memoria y vuelve a consultarlas la
  próxima vez que la pantalla se presente

#### Scenario: Regeneración visible tras editar el perfil
- **WHEN** el empleado vuelve a la pantalla de recomendaciones después de editar su perfil y
  la API informa que hay una generación en curso
- **THEN** el frontend presenta el estado de generación en curso y sondea hasta el desenlace

#### Scenario: Guardado fallido
- **WHEN** una operación sobre el perfil falla
- **THEN** el frontend no invalida las recomendaciones
