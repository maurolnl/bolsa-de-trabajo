## Why

El empleador que publica un puesto llega desde «Ver candidatos» a
`/main/employer/jobs/{id}/candidates`, una pantalla de continuidad que promete candidatos
recomendados y nunca los entrega. El backend ya expone las tres consultas que faltaban:
`GET /jobs/{jobPositionID}/employee-recommendations` con estado, orden, paginación y
ownership verificada (LAB-35), y desde LAB-36 el perfil completo por identificador de
empleado más las dos rutas de entrega de archivos por URL prefirmada. Con eso, la única
pieza pendiente del sentido puesto → empleado es el frontend.

La generación es asíncrona igual que en el sentido empleado → puesto: el empleador puede
abrir la pantalla mientras el batch de su puesto está `pending` o `processing`, así que la
consulta sola no alcanza y hace falta sondear hasta que el backend informe un desenlace.

A diferencia de LAB-37, el candidato **no** viaja embebido en la recomendación: la tarjeta
trae un resumen y el perfil completo exige una consulta propia, autorizada por el vínculo de
recomendación vigente y no por la propiedad del perfil.

## What Changes

- `/main/employer/jobs/{jobPositionID}/candidates` deja de ser una pantalla de continuidad y
  pasa a presentar los candidatos recomendados para ese puesto.
- Se agrega `listEmployeeRecommendations(jobPositionId, page)` al repositorio de
  recomendaciones, que LAB-37 dejó nombrado para admitir exactamente este método.
- Se agrega la consulta con sondeo mientras el estado informado sea `pending` o
  `processing`, con los mismos cortes que el sentido del empleado: `none`, `completed`,
  `failed` y el desmontaje de la pantalla.
- La pantalla distingue los desenlaces: cargando, procesando, vacío, error de carga, puesto
  inexistente o eliminado, puesto ajeno y resultados. `none` y `completed` sin items
  comparten el estado vacío pero no el texto.
- **Un puesto eliminado no muestra candidatos.** La API resuelve la propiedad excluyendo los
  puestos eliminados lógicamente, así que responde `404` igual que ante un identificador
  inexistente; el frontend presenta esa respuesta como un puesto que ya no está disponible y
  no reintenta.
- Cada candidato ofrece abrir su perfil completo en un panel lateral que consulta
  `GET /employees/{employeeID}` al abrirse. El panel presenta experiencia, locación,
  recursos, disponibilidad, educación y los archivos disponibles.
- La descarga de un certificado o de un documento de educación pide su URL prefirmada en el
  momento del clic y la usa una sola vez para abrir el archivo. **La URL no se guarda en
  caché, ni en estado, ni en el DOM como destino de un enlace**, y la respuesta del backend
  no contiene bucket ni clave de objeto.
- El puntaje se muestra **solo cuando el backend lo envía**. Mientras el algoritmo de
  indicadores no exista, `score` llega en `null` y la pantalla no lo sustituye por un valor
  propio.
- Las primitivas de recomendación que LAB-37 dejó dentro de `job-recommendations` —estado de
  generación, pantalla de estado, paginación y badge de afinidad— se extraen a un módulo
  compartido `src/features/recommendations/`, del que pasan a depender las dos features. Es
  un movimiento sin cambio de comportamiento: ninguna pantalla existente cambia lo que
  muestra.

## Capabilities

### New Capabilities

- `employer-candidate-recommendations`: consulta paginada de los candidatos recomendados
  para un puesto propio del empleador autenticado, con sondeo acotado al estado de
  generación, desenlaces explícitos para procesando, vacío, error, puesto ajeno y puesto
  eliminado, apertura del perfil completo del candidato y descarga de sus archivos mediante
  URL prefirmada de un solo uso.

### Modified Capabilities

- `job-position-management`: el destino de candidatos recomendados de un puesto deja de
  presentarse como pendiente y pasa a presentar los candidatos que la API informa.

## Impact

- Nueva feature `src/features/employee-recommendations/` con `repo/`, `repo/rest/`,
  `models/`, `hooks/` y `pages/`, siguiendo la anatomía de `src/features/job-recommendations/`.
- Nuevo módulo compartido `src/features/recommendations/` con el modelo de estado de
  generación y los componentes de estado, paginación y puntaje;
  `src/features/job-recommendations/` pasa a importarlos de ahí y deja de definirlos.
- `src/features/employees/repo/`: se agrega la lectura del perfil por identificador de
  empleado y las dos consultas de URL de descarga, que hoy no existen —el repositorio de
  empleado solo lee el perfil propio por `GET /users/{userID}/employee`—.
- `src/api/index.ts` incorpora el nuevo repositorio al selector de adaptadores.
- `src/router/index.tsx`: `employer/jobs/:jobPositionId/candidates` deja de renderizar
  `ContinuityPage`.
- Sin cambios en el backend ni en el contrato HTTP: las tres consultas ya están en `main`
  del backend desde LAB-35 y LAB-36.
- `docs/employer-searching-for-employees.md` describe el flujo sin nombrar endpoint ni ruta;
  queda fuera de alcance de este cambio y se mantiene como está.
