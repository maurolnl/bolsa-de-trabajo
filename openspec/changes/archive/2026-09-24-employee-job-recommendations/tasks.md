## 1. Modelo y capa de datos

- [x] 1.1 Crear `src/features/job-recommendations/models/job-recommendation.ts` con
  `RecommendationStatus` (los cinco valores), `JobRecommendation` —`score` como
  `number | null`— y `JobRecommendationsPage` con `status`, `items` y `page`; verificar con
  `yarn tsc --noEmit` que ningún consumidor pueda derivar `status` de `items.length`.
- [x] 1.2 Crear `repo/job-recommendation-repository.ts` con la interfaz
  `listJobRecommendations(employeeId, { limit, offset })`, nombrada para admitir el método
  del lado del empleador que agrega LAB-38; verificar que compila sin implementación.
- [x] 1.3 Crear `repo/rest/types.ts` con el DTO exacto de la respuesta del backend
  (`status`, `items[]` con los trece campos en snake_case, `page.limit/offset/total`);
  verificar contra `internal/recommendation/models.go` del backend, campo por campo.
- [x] 1.4 Crear `repo/rest/helpers.ts` con el mapper DTO → modelo: camelCase, `score`
  preservado como `null` cuando llega nulo, y `status` desconocido normalizado a `"none"`;
  verificar que el mapper no produce `score: 0` para ningún input.
- [x] 1.5 Crear `repo/rest/job-recommendation-repository.rest.ts` sobre
  `GET employees/{employeeId}/job-recommendations` con `limit` y `offset` como query params;
  verificar que `limit` sale de una constante dentro de `[1, 100]`.
- [x] 1.6 Registrar `jobRecommendationRepository` en `src/api/index.ts` siguiendo el patrón
  de los tres repositorios existentes; verificar con `yarn tsc --noEmit`.

## 2. Consulta con sondeo

- [x] 2.1 Crear `hooks/use-job-recommendations.ts` con `jobRecommendationKeys.byEmployee(employeeId, offset)`
  y la constante de `limit`; verificar que el prefijo del key permite invalidar todos los
  tramos de una vez.
- [x] 2.2 Implementar `useJobRecommendations(employeeId, offset)` con `enabled` condicionado
  a un `employeeId` numérico y positivo; verificar que sin perfil cargado no se emite ninguna
  petición (DevTools de red).
- [x] 2.3 Agregar `refetchInterval` como función del estado: intervalo constante mientras
  `status` sea `pending` o `processing`, `false` en `none`, `completed` y `failed`; verificar
  en red que el sondeo arranca en `processing` y se detiene al llegar a `completed`.
- [x] 2.4 Agregar `retry: false` y `placeholderData: keepPreviousData`; verificar que un
  error corta el sondeo en vez de reintentar en silencio, y que cambiar de página no
  parpadea a vacío.
- [x] 2.5 Verificar que al navegar fuera de la pantalla no se emite ninguna petición más del
  sondeo (DevTools de red, con un batch en `processing`).
- [x] 2.6 Agregar el helper de autorización (`403`) análogo a `isForeignJobPositionError`;
  verificar que distingue `403` de un error de red.

## 3. Pantalla de recomendaciones

- [x] 3.1 Crear `pages/job-recommendations-page.tsx` que resuelve el `employeeID` desde
  `useEmployeeProfile(userId).data.id` y muestra carga mientras el perfil está pendiente; verificar
  que no consulta recomendaciones antes de tener el identificador.
- [x] 3.2 Implementar el desenlace de error de carga reutilizando el patrón de
  `JobPositionState` con reintento, y el de `403` sin reintento; verificar ambos forzando
  las respuestas.
- [x] 3.3 Implementar los estados vacíos diferenciados: `none` orienta a completar o
  actualizar el perfil, `completed` sin items explica que no hay coincidencias; verificar que
  los textos son distintos y que ninguno se muestra mientras la consulta está pendiente.
- [x] 3.4 Implementar el estado `failed` con explicación de generación fallida y acción de
  reintento; verificar que no se presenta como ausencia de coincidencias.
- [x] 3.5 Implementar el indicador de generación en curso para `pending` y `processing`,
  compatible con la presencia simultánea de items del conjunto anterior; verificar que con
  `processing` + items se ven ambas cosas.
- [x] 3.6 Crear `pages/job-recommendation-card.tsx` con los datos del puesto que ya vienen en
  la respuesta y el acceso a su detalle; verificar que no dispara una consulta por tarjeta.
- [x] 3.6b Crear `pages/job-recommendation-detail-sheet.tsx` sobre el primitivo `Sheet`,
  que ya está construido sobre `@radix-ui/react-dialog`,
  alimentado solo por el item ya cargado; verificar en DevTools de red que abrirlo y cerrarlo
  no emite ninguna petición y que al cerrar se conserva el tramo visible.
- [x] 3.7 Renderizar el puntaje solo cuando `score !== null`; verificar con la respuesta real
  de hoy —todos los `score` nulos— que no aparece ningún indicador de afinidad ni texto que
  prometa orden por afinidad.
- [x] 3.8 Presentar los items en el orden recibido, sin `sort` ni `filter`; verificar por
  inspección del componente y comparando con el orden de la respuesta.

## 4. Paginación

- [x] 4.1 Mantener el `offset` en estado local de la página y pasarlo al hook; verificar que
  cada tramo queda cacheado por separado en las DevTools de React Query.
- [x] 4.2 Implementar los controles anterior/siguiente derivados de `page.total`, `limit` y
  `offset`; verificar que en la primera página no se ofrece retroceder y en la última no se
  ofrece avanzar.
- [x] 4.3 Volver a `offset = 0` cuando `total` deja el tramo actual fuera de rango; verificar
  con un conjunto que se achica entre dos generaciones.
- [x] 4.4 Verificar que nunca se pide un `limit` fuera de `[1, 100]` ni un `offset` negativo,
  y que por lo tanto el `400` de paginación del backend no es alcanzable desde la UI.

## 5. Ruta y refresco

- [x] 5.1 Reemplazar en `src/router/index.tsx` el `ContinuityPage` de `employee/home` por la
  nueva página, conservando `RequireRole allowedRoles={["employee"]}` y el `errorElement`;
  verificar que `MainResolverPage` y `src/router/paths.ts` no necesitan cambios.
- [x] 5.2 Redirigir a `/main/employee/profile` cuando la sesión `employee` no tiene perfil,
  reutilizando la clasificación de perfil ausente existente; verificar con una cuenta sin
  perfil que no se consulta recomendaciones.
- [x] 5.3 Verificar que una sesión `employer` que abre `/main/employee/home` termina en su
  destino válido, y que con el perfil pendiente se ve carga y no una redirección provisional.
- [x] 5.4 Agregar la invalidación del prefijo `["job-recommendations"]` en el `onSuccess` de
  las mutaciones de perfil de `src/features/employees/hooks/useEmployee.ts`; verificar que
  una mutación fallida no invalida nada.
- [x] 5.5 Verificar el ciclo completo: editar una sección del perfil, volver a
  `/main/employee/home` y ver el estado de generación en curso sondeando hasta el desenlace.

## 6. Cobertura E2E

- [x] 6.1 Agregar `e2e/employee-job-recommendations.spec.ts` con las respuestas del backend
  mockeadas, cubriendo listado, ausencia y presencia de puntaje, los tres desenlaces vacíos,
  `failed`, el arranque y la detención del sondeo (al completar y al desmontar), el 403 sin
  reintento, el 500 con reintento, el recorrido de páginas con `limit`/`offset` verificados
  en la URL, el detalle sin petición extra y el bloqueo por rol; 13 tests en verde.

## 7. Validación

- [x] 7.1 Ejecutar lint enfocado sobre los archivos tocados y dejarlo en cero problemas.
  `yarn lint` completo falla por 4 warnings `react-refresh/only-export-components` en
  `src/components/ui/{badge,button,form,sidebar}.tsx`, preexistentes y reproducidas en
  `origin/master`: arreglarlas sería un refactor ajeno a este cambio.
- [x] 7.2 Ejecutar `yarn tsc --noEmit` sin errores.
- [x] 7.3 Ejecutar `yarn build` sin errores.
- [x] 7.4 Recorrer uno por uno los criterios de aceptación de LAB-37 y dejar constancia de
  cómo se comprobó cada uno.
