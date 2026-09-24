## 1. Extracción del módulo compartido de recomendaciones

- [ ] 1.1 Crear `src/features/recommendations/models/recommendation-status.ts` moviendo
  `RECOMMENDATION_STATUSES`, `RecommendationStatus`, `isGenerationInProgress` y
  `RecommendationPageInfo` desde `job-recommendations/models/job-recommendation.ts`, con sus
  comentarios; verificar que el archivo de origen deja de definirlos y los reexporta o los
  importa.
- [ ] 1.2 Mover `RecommendationsState`, `RecommendationsPagination` y `RecommendationScore` a
  `src/features/recommendations/components/`, **sin editar su contenido**; verificar con
  `git diff -M` que los tres se registran como renombres y no como reescrituras.
- [ ] 1.3 Actualizar los imports de `src/features/job-recommendations/` para consumir el
  módulo compartido; verificar con `yarn tsc --noEmit` y ejecutando
  `yarn test:e2e e2e/employee-job-recommendations.spec.ts` que los 13 tests de LAB-37 siguen
  en verde sin tocar el spec.

## 2. Contrato de candidatos recomendados

- [ ] 2.1 Renombrar la interfaz `JobRecommendationRepository` a `RecommendationRepository` en
  `src/features/recommendations/repo/recommendation-repository.ts` y agregarle
  `listEmployeeRecommendations(jobPositionId, page)`; verificar que
  `listJobRecommendations` queda intacta en firma y nombre.
- [ ] 2.2 Crear `src/features/employee-recommendations/models/employee-recommendation.ts` con
  `EmployeeRecommendation` —`score` y `portfolioUrl` como `number | null` y
  `string | null`— y `EmployeeRecommendationsPage` con `status`, `items` y `page`, apoyado en
  el estado compartido; verificar que ningún consumidor puede derivar `status` de
  `items.length`.
- [ ] 2.3 Crear `repo/rest/types.ts` con el DTO exacto de la respuesta del backend
  (`status`, `items[]` con los once campos en snake_case, `page.limit/offset/total`);
  verificar campo por campo contra `EmployeeRecommendation` y
  `EmployeeRecommendationsResponse` en `internal/recommendation/models.go` del backend.
- [ ] 2.4 Crear `repo/rest/helpers.ts` con el mapper DTO → modelo: camelCase, `score` y
  `portfolio_url` preservados como `null`, `certifications` nula normalizada a arreglo vacío
  y `status` desconocido normalizado a `"none"`; verificar que el mapper no produce
  `score: 0` para ningún input.
- [ ] 2.5 Implementar `listEmployeeRecommendations` en
  `repo/rest/employee-recommendation-repository.rest.ts` sobre
  `GET jobs/{jobPositionId}/employee-recommendations` con `limit` y `offset` como query
  params; verificar que no envía ningún otro parámetro.
- [ ] 2.6 Registrar el repositorio en `src/api/index.ts` y actualizar el tipo del adaptador
  existente al nombre compartido; verificar que la app compila y que
  `job-recommendations` sigue resolviendo su repositorio.

## 3. Contrato de perfil del candidato y descargas

- [ ] 3.1 Agregar a `src/features/employees/repo/employee-repository.ts` la lectura
  `getEmployeeProfileById(employeeId)` y las dos consultas de descarga
  `getCertificateDownloadUrl(employeeId, fileId)` y
  `getEducationDocumentDownloadUrl(employeeId, educationId)`; verificar que `getById`
  —el perfil propio por `GET /users/{userID}/employee`— queda sin tocar.
- [ ] 3.2 Agregar a `repo/rest/types.ts` los DTO de `EmployeeProfileResponse` —incluidos
  `files[]` como `{ id, title }` y `education[].certification_document_id` nullable, y
  `email` opcional— y de `DownloadURLResponse` (`url`, `expires_at`); verificar contra
  `internal/employee/models.go` del backend que ningún campo de ubicación de archivo aparece
  en el DTO.
- [ ] 3.3 Crear el modelo `EmployeeProfile` y su mapper reutilizando las traducciones ya
  existentes de años de experiencia, tipo y velocidad de conexión, sistema operativo, tipo de
  título y estado de título; verificar que un código desconocido se muestra tal como llegó y
  no como `undefined`.
- [ ] 3.4 Implementar las tres llamadas REST; verificar que las dos de descarga no se
  registran en ningún adaptador con caché y que devuelven la respuesta sin almacenarla.

## 4. Consulta con sondeo

- [ ] 4.1 Crear `hooks/use-employee-recommendations.ts` con `employeeRecommendationKeys`
  —prefijo común más clave por puesto y `offset`—, tamaño de página constante dentro del
  rango que el backend acepta, `enabled` atado a un `jobPositionId` numérico y positivo, y
  `placeholderData: keepPreviousData`; verificar que un identificador inválido no emite
  petición.
- [ ] 4.2 Declarar el sondeo con `refetchInterval` en función del último dato, devolviendo
  `false` en `none`, `completed` y `failed`, con `refetchIntervalInBackground: false` y
  `retry: false`; verificar que no queda ningún `setInterval` propio y que el desmontaje lo
  apaga sin limpieza manual.
- [ ] 4.3 Agregar los predicados `isForbiddenCandidatesError` (403) y
  `isMissingJobPositionCandidatesError` (404) para que las pantallas no conozcan axios ni los
  códigos; verificar que ninguna pantalla importa axios.
- [ ] 4.4 Crear `hooks/use-candidate-profile.ts` con la consulta del perfil habilitada solo
  con un candidato seleccionado; verificar que cerrar el panel no emite ninguna petición.
- [ ] 4.5 Implementar la obtención de la URL prefirmada como llamada imperativa en el clic
  —sin `useQuery` montado y con `gcTime: 0` si se resuelve vía `fetchQuery`—; verificar
  inspeccionando la caché de React Query que la URL no queda almacenada después de usarse.

## 5. Pantalla de candidatos

- [ ] 5.1 Crear `pages/employee-recommendations-page.tsx` que tome `jobPositionId` del path,
  valide que es numérico y positivo, y presente carga, error, 403 y 404 con la pantalla de
  estado compartida; verificar que el 403 y el 404 no ofrecen reintento y que el 404 ofrece
  volver al listado de puestos.
- [ ] 5.2 Diferenciar los desenlaces de generación: `failed` con reintento; `none` y
  `completed` sin items con textos distintos; `pending`/`processing` sin items como espera; y
  `pending`/`processing` con items mostrando el conjunto anterior más el aviso de
  actualización. Verificar los cinco recorriendo cada estado.
- [ ] 5.3 Crear `pages/employee-recommendation-card.tsx` con posición, rol, años de
  experiencia y certificaciones del candidato, más el badge de puntaje compartido y el acceso
  al perfil; verificar que la tarjeta no dispara ninguna consulta propia.
- [ ] 5.4 Montar la paginación con el componente compartido; verificar que el cambio de tramo
  envía el `offset` esperado y que el conjunto reducido entre generaciones vuelve al primer
  tramo.

## 6. Perfil completo del candidato

- [ ] 6.1 Crear `pages/candidate-profile-sheet.tsx` que se abra con el candidato
  seleccionado, presente su propio estado de carga y su propio 403, y no altere el tramo
  paginado ni el sondeo al abrirse o cerrarse; verificar abriendo y cerrando en medio de una
  generación en curso.
- [ ] 6.2 Presentar las cinco secciones del perfil —experiencia, locación, recursos,
  disponibilidad y educación— con las etiquetas en español ya existentes; verificar que
  ningún valor se muestra como código crudo del backend salvo los desconocidos.
- [ ] 6.3 Presentar los archivos disponibles: certificados por título e identificador, y
  documentos de educación solo en los títulos cuyo `certification_document_id` no es nulo;
  verificar que un título sin documento no ofrece descarga.
- [ ] 6.4 Implementar la descarga como botón —nunca `<a href>`— que pide la URL en el clic y
  la consume inmediatamente; verificar en el DOM que ninguna URL prefirmada aparece como
  atributo y que un rechazo informa el fallo sin dejar la descarga ofrecida como disponible.

## 7. Ruta

- [ ] 7.1 Reemplazar en `src/router/index.tsx` la `ContinuityPage` de
  `employer/jobs/:jobPositionId/candidates` por la nueva pantalla, conservando
  `RequireRole allowedRoles={["employer"]}`; verificar que una sesión `employee` que solicita
  la ruta es redirigida a su destino válido.
- [ ] 7.2 Verificar que `PATHS.main.employer.jobsCandidates` y el botón «Ver candidatos» del
  listado de puestos siguen funcionando sin cambios.

## 8. Cobertura E2E

- [ ] 8.1 Agregar `e2e/employer-candidate-recommendations.spec.ts` con las respuestas del
  backend mockeadas, cubriendo: listado de candidatos, ausencia y presencia de puntaje, los
  tres desenlaces vacíos, `failed`, arranque y detención del sondeo (al completar y al
  desmontar), el 403 sin reintento, el 404 de puesto eliminado con regreso al listado, el 500
  con reintento, el recorrido de páginas con `limit`/`offset` verificados en la URL, la
  apertura del perfil con su consulta propia, el título sin documento sin descarga, la
  descarga que pide la URL en el clic y no la deja en el DOM, y el bloqueo por rol.

## 9. Validación

- [ ] 9.1 Ejecutar lint enfocado sobre los archivos tocados y dejarlo en cero problemas,
  anotando si persisten los 4 warnings preexistentes de `src/components/ui/`.
- [ ] 9.2 Ejecutar `yarn tsc --noEmit` sin errores.
- [ ] 9.3 Ejecutar `yarn build` sin errores.
- [ ] 9.4 Ejecutar la suite E2E completa y confirmar que los specs previos —en particular
  `employee-job-recommendations.spec.ts`, afectado por la extracción del paso 1— siguen en
  verde.
- [ ] 9.5 Recorrer uno por uno los criterios de aceptación de LAB-38 y dejar constancia de
  cómo se comprobó cada uno.
