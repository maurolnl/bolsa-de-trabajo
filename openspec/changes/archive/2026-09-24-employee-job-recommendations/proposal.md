## Why

El empleado que termina su perfil llega a `/main/employee/home`, una pantalla de
continuidad que promete "tus próximas oportunidades laborales" y nunca las entrega. El
backend ya expone `GET /employees/{employeeID}/job-recommendations` con estado del batch,
orden, paginación y ownership verificada, así que la única pieza que falta para cerrar el
caso de uso «Busca recomendaciones de puestos de trabajo» es el frontend.

La generación es asíncrona: el empleado puede llegar a la pantalla mientras su batch está
`pending` o `processing`, así que la consulta sola no alcanza y hace falta sondear hasta
que el backend informe un desenlace.

## What Changes

- `/main/employee/home` deja de ser una pantalla de continuidad y pasa a presentar los
  puestos recomendados del empleado autenticado. La ruta y el destino que resuelve
  `MainResolverPage` no cambian: cambia lo que la ruta muestra.
- Se agrega un repositorio de recomendaciones con `listJobRecommendations(employeeId, page)`
  sobre el endpoint existente, con `limit` y `offset` dentro del rango que el backend acepta.
- Se agrega la consulta de recomendaciones con sondeo mientras el estado informado sea
  `pending` o `processing`. El sondeo se detiene en `none`, `completed` y `failed`, y al
  desmontar la pantalla.
- La pantalla distingue cinco desenlaces: cargando, procesando, vacío, error de carga y
  resultados. `none` y `completed` sin items comparten el estado vacío pero no el texto:
  uno explica que todavía no se pidió una generación y el otro que no hubo coincidencias.
- Cada puesto recomendado ofrece el acceso a su detalle y muestra su puntaje **solo cuando
  el backend lo envía**. Mientras el algoritmo de indicadores no exista, `score` llega en
  `null` y la pantalla no lo presenta ni lo sustituye por un valor propio.
- La paginación es explícita, con anterior y siguiente derivados de `page.total`, y no
  acumula páginas en memoria.
- Al completar o editar cualquier sección del perfil de empleado, el frontend invalida las
  recomendaciones para que la pantalla refleje la regeneración que el backend dispara.
- Los tipos separan el estado del batch —un valor por respuesta— de los items del conjunto
  vigente, porque el backend los toma de batches que pueden ser distintos.

## Capabilities

### New Capabilities

- `employee-job-recommendations`: consulta paginada de los puestos recomendados del
  empleado autenticado, con sondeo acotado al estado de generación, desenlaces explícitos
  para procesando, vacío y error, puntaje solo cuando la API lo provee, acceso al detalle
  del puesto y refresco tras cambios en el perfil.

### Modified Capabilities

- `role-profile-navigation`: el destino del empleado con perfil deja de ser una pantalla de
  continuidad y pasa a ser la pantalla de recomendaciones, que queda reservada a una sesión
  `employee` con perfil propio existente.

## Impact

- Nueva feature `src/features/job-recommendations/` con `repo/`, `repo/rest/`, `models/`,
  `hooks/` y `pages/`, siguiendo la anatomía de `src/features/job-positions/`.
- `src/api/index.ts` incorpora el nuevo repositorio al selector de adaptadores.
- `src/router/index.tsx`: `employee/home` deja de renderizar `ContinuityPage`.
- `src/features/employees/hooks/useEmployee.ts`: las mutaciones del perfil invalidan también
  las recomendaciones.
- Sin cambios en el backend ni en el contrato HTTP: `GET /employees/{employeeID}/job-recommendations`
  ya está en `master` del backend desde LAB-35.
- `docs/use-cases.md` §11 describe el caso sin nombrar endpoint ni ruta; queda fuera de
  alcance de este cambio y se mantiene como está.
