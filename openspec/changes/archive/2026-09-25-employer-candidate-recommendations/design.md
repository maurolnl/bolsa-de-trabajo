## Context

Ver `proposal.md` — Why para la motivación.

El contrato del backend ya está fijo (LAB-35 y LAB-36, mergeados en `main` del backend).

**`GET /jobs/{jobPositionID}/employee-recommendations?limit&offset`**

- Solo detrás del middleware de autenticación; el rol y la propiedad se verifican en el
  servicio (`internal/recommendation/service.go`, `authorizeJobPosition`).
- Respuesta `200`: `{ status, items, page: { limit, offset, total } }`.
- `status`: `none | pending | processing | completed | failed`. Sale del batch **más
  reciente**; `items` sale del **último batch completado**. No son el mismo batch.
- `items[]`: `recommendation_id`, `employee_id`, `user_id`, `position`, `role`,
  `years_of_experience`, `certifications`, `portfolio_url`, `score`, `created_at`,
  `profile_updated_at`. `score` y `portfolio_url` son nullable.
- `limit` por defecto 20 y máximo 100; `offset` por defecto 0. Un valor fuera de rango
  responde `400` y no se recorta en silencio.
- `403` (`"forbidden"`): rol `employee`, o puesto de otro empleador.
- `404` (`"subject not found"`): puesto inexistente **o eliminado lógicamente**. La
  resolución de propiedad excluye los eliminados, así que el borrado y el identificador
  inventado son indistinguibles para el cliente, y eso es deliberado del lado del servidor.

**`GET /employees/{employeeID}`**

- Respuesta `200`: el perfil completo —`position`, `role`, `years_of_experience`,
  `certifications`, `portfolio_url`, `timezone`, `os`, `paid_software`,
  `available_hours_per_day`, `compatible_projects`, `incompatible_projects`,
  `internet_connections[]`, `education[]`, `files[]`, `created_at`, `updated_at`—.
- `email` viaja **solo** cuando quien lee es el propio empleado. El empleador no lo recibe:
  una recomendación habilita a evaluar a un candidato dentro de la plataforma, no a
  contactarlo por fuera.
- `files[]` es `{ id, title }` y `education[].certification_document_id` es
  `number | null`. **Ningún archivo viaja con su ubicación**: solo el identificador con el
  que se pide su entrega. Es un tipo distinto del que devuelve `GET /users/{userID}/employee`,
  que sí expone el `object_key` del documento de educación.
- `403` (`"profile access forbidden"`) es la **única** respuesta a toda falla de
  autorización: perfil ajeno, empleado inexistente y empleador sin vínculo de recomendación
  vigente. El backend no los distingue para que un empleador no pueda enumerar qué empleados
  existen recorriendo identificadores.

**`GET /employees/{employeeID}/files/{fileID}/download-url`** y
**`GET /employees/{employeeID}/education-documents/{educationID}/download-url`**

- Respuesta `200`: `{ url, expires_at }`. Sin bucket ni clave de objeto.
- Autorizan con la misma regla que el perfil, de modo que la entrega no sea la puerta de
  atrás del perfil.

Todos los errores responden JSON `{"error":"..."}`, así que el `MutationCache.onError` de
`src/App.tsx` los entiende.

Restricción de producto heredada de la épica: el algoritmo de indicadores todavía no existe
(LAB-30 solo define su interfaz). Hoy `score` llega `null` en todos los items y los batches
pueden terminar en `failed` por falta de scoring. La pantalla tiene que ser legible en ese
escenario sin inventar afinidad.

Estado del frontend: LAB-37 dejó en `src/features/job-recommendations/` el modelo de estados,
la pantalla de estado, la paginación y el badge de puntaje, más un repositorio cuyo comentario
declara que `listEmployeeRecommendations` entra ahí sin renombrar nada. El repositorio de
empleado solo sabe leer el perfil propio por `GET /users/{userID}/employee`, y sus mappers
traducen los códigos del backend (`fiber`, `less_10mb`, `2_to_5y`, …) a etiquetas en español.

## Goals / Non-Goals

**Goals:**

- Cerrar el sentido puesto → empleado del caso de uso «Busca empleados para un puesto».
- Presentar con honestidad los cinco estados de una generación asíncrona, más los dos
  desenlaces de autorización y disponibilidad que este sentido agrega: puesto ajeno y puesto
  eliminado.
- Permitir evaluar a un candidato con su perfil completo y sus archivos, sin filtrar la
  ubicación de esos archivos ni dejar una URL prefirmada sobreviviendo al clic.
- Compartir con LAB-37 lo que es el mismo concepto en los dos sentidos, en vez de duplicarlo.

**Non-Goals:**

- No se define ni se simula el algoritmo de indicadores: `score` se muestra tal como llega o
  no se muestra.
- No se agrega contacto con el candidato, postulación, ni marcado de candidatos vistos o
  descartados: nada de eso existe en el backend.
- No se toca el contrato HTTP ni el backend.
- No se hace enlazable por URL el perfil de un candidato.
- No se reordena ni se filtra el conjunto en el cliente: el orden —puntaje descendente,
  actualización de perfil más reciente como desempate— ya es comportamiento de la
  persistencia.

## Decisions

### Las primitivas de recomendación se extraen a `src/features/recommendations/`

`RecommendationStatus`, `isGenerationInProgress`, `RecommendationPageInfo`,
`RecommendationsState`, `RecommendationsPagination` y `RecommendationScore` describen el
concepto «recomendación», no el sentido empleado → puesto. Dejarlos donde están obligaría a
la feature del empleador a importar de `job-recommendations/pages/`, es decir a que una
pantalla del empleador dependa de la carpeta de páginas del empleado; duplicarlos dejaría dos
definiciones del mismo estado vacío, la misma paginación y el mismo badge.

El módulo compartido expone `models/` y `components/`. Las dos features consumen de ahí y no
se conocen entre sí.

Es una extracción **sin cambio de comportamiento**: los componentes se mueven tal cual y solo
cambian los imports de LAB-37. Cualquier cambio de contenido de esos componentes que este
ticket necesite se hace por composición —`title`, `description`, `action`— y no editándolos.

### Feature propia `src/features/employee-recommendations/`

El sujeto es el puesto y el actor es el empleador: distinto rol, distinta autorización y
distinta forma de los items que `job-recommendations`. Compartir la carpeta obligaría a que
cada archivo aclarara de qué sentido habla. La anatomía repite la de LAB-37 —`repo/`,
`repo/rest/`, `models/`, `hooks/`, `pages/`— que a su vez repite la de `job-positions`.

El método vive en el repositorio que LAB-37 ya declaró:
`JobRecommendationRepository.listEmployeeRecommendations(jobPositionId, page)`. El nombre del
método lleva el sujeto del que se piden recomendaciones, no lo que devuelve, así que los dos
conviven sin renombrar nada. El repositorio pasa a llamarse `RecommendationRepository` en el
módulo compartido para que su nombre deje de nombrar solo un sentido.

### El identificador del puesto sí sale de la URL, y eso no es una regresión

En LAB-37 el `employeeID` se deriva del perfil propio porque la sesión tiene exactamente un
perfil de empleado. Acá el empleador tiene N puestos y el que mira es el de la ruta, así que
el `jobPositionID` sale del path. No debilita nada: la autorización vive en el backend, que
compara el dueño del puesto contra el usuario del JWT y responde `403` a un puesto ajeno. El
frontend no decide nada de autorización; presenta lo que la API resuelve.

### El perfil completo se abre en un panel lateral, no en una ruta propia

Una ruta `/candidates/:employeeId` sería enlazable, pero el enlace no serviría: el acceso
depende de un vínculo de recomendación **vigente**, que desaparece con la siguiente
generación. Compartirlo produciría un `403` con más frecuencia que un perfil.

El panel además conserva el tramo paginado y el sondeo: abrir y cerrar un candidato no
remonta la lista ni reinicia el intervalo. El estado de selección vive fuera del estado de
paginación, igual que el `JobRecommendationDetailSheet` de LAB-37.

### La consulta del perfil se dispara al abrir el panel y no con la lista

Consultar los N perfiles junto con la página serían N peticiones para una pantalla en la que
el empleador abre unos pocos. La consulta se habilita con el candidato seleccionado
(`enabled`), de modo que cerrar el panel no cancela lo ya cacheado pero tampoco pide nada.

La tarjeta se compone con los campos que la recomendación ya trajo —posición, rol, años de
experiencia, certificaciones, portfolio, puntaje—, así que el listado no depende de esa
consulta para ser útil.

### La URL prefirmada se pide en el clic y no se guarda en ningún lado

El criterio de aceptación «no se persisten URLs prefirmadas ni se exponen keys S3» se cumple
por construcción, no por cuidado:

- La descarga es un **botón**, no un `<a href>`: un `href` dejaría la URL en el DOM, en el
  menú contextual y en el historial.
- La URL se pide con una llamada imperativa en el handler del clic —`queryClient.fetchQuery`
  con `gcTime: 0`, o el repositorio directo— y **no** con un `useQuery` montado, para que no
  quede en la caché de React Query después de usarse.
- La respuesta se consume dentro del mismo handler (`window.open`) y su valor no entra en
  ningún `useState`.
- El `object_key` no puede filtrarse porque el backend no lo manda: `files[]` es
  `{ id, title }` y la respuesta de descarga es `{ url, expires_at }`.

`expires_at` no se usa para programar nada: la URL se usa una vez, inmediatamente.

### El puesto eliminado y el inexistente comparten pantalla

El backend los hace indistinguibles a propósito. Inventar dos textos en el cliente afirmaría
una diferencia que el frontend no puede observar. Un solo estado —«este puesto ya no está
disponible»— con el acceso de vuelta al listado, y sin reintentar: ninguno de los dos se
resuelve reintentando.

Vale lo mismo para el `403`: puesto ajeno y rol incorrecto comparten mensaje, como en LAB-37.

### El perfil del candidato reutiliza los mappers de códigos existentes

`fiber`, `less_10mb`, `2_to_5y`, `university`, `in-progress` ya tienen etiqueta en español en
`employees/repo/rest/helpers.ts`, `employees/forms/utils.ts` y
`education-form/constants.ts`. El perfil del candidato consume esas mismas traducciones en
lugar de estrenar un vocabulario paralelo, para que el empleador y el empleado no lean
nombres distintos para el mismo dato.

Los códigos que el mapper del perfil no reconozca no se rompen: se muestran tal como llegaron
en vez de producir `undefined` en pantalla.

### Sondeo y paginación se resuelven como en LAB-37

`refetchInterval` en función del último dato, apagado devolviendo `false` en `none`,
`completed` y `failed`; `refetchIntervalInBackground: false`; `retry: false` para que un
error corte el sondeo y se haga visible; `placeholderData: keepPreviousData` al cambiar de
tramo; `offset` en el query key; y la corrección a `offset = 0` cuando el conjunto se achica
entre dos generaciones y deja el tramo actual fuera de rango.

Se repite la decisión, no el código: los hooks son distintos porque las claves de caché y el
sujeto lo son.

## Risks / Trade-offs

- **Mover los componentes de LAB-37 toca código recién mergeado.** El riesgo se acota a que
  la extracción sea un movimiento puro: si algún componente necesitara cambiar para servir a
  los dos sentidos, el cambio se hace por props y se verifica que la pantalla del empleado
  siga mostrando exactamente lo mismo.
- **El perfil se pide por candidato abierto.** Un empleador que abre muchos candidatos hace
  muchas peticiones. Es el costo de no pedir N perfiles que nadie va a mirar; la caché de
  React Query cubre la reapertura del mismo candidato dentro de la sesión.
- **La URL prefirmada puede expirar entre que se pide y que el navegador la usa.** La ventana
  es de milisegundos porque se pide en el clic, pero si ocurre el usuario ve el error de S3 y
  no uno nuestro. Programar un refresco sería guardar la URL, que es justo lo que el criterio
  prohíbe.
- **Con `score` siempre nulo, el orden de los candidatos no es explicable en pantalla.** La
  alternativa —mostrar la posición como si fuera afinidad— sería inventar el dato. Se asume
  la limitación hasta que exista el algoritmo de indicadores.
- **Un puesto recién creado muestra el estado vacío `none` hasta que el worker corra.** Es
  correcto y no hay nada que el frontend pueda adelantar, pero puede leerse como un fallo si
  el texto no explica que la generación es diferida.
