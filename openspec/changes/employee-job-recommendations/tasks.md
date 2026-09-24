## 1. Modelo y capa de datos

- [ ] 1.1 Crear `src/features/job-recommendations/models/job-recommendation.ts` con
  `RecommendationStatus` (los cinco valores), `JobRecommendation` —`score` como
  `number | null`— y `JobRecommendationsPage` con `status`, `items` y `page`; verificar con
  `yarn tsc --noEmit` que ningún consumidor pueda derivar `status` de `items.length`.
- [ ] 1.2 Crear `repo/job-recommendation-repository.ts` con la interfaz
  `listJobRecommendations(employeeId, { limit, offset })`, nombrada para admitir el método
  del lado del empleador que agrega LAB-38; verificar que compila sin implementación.
- [ ] 1.3 Crear `repo/rest/types.ts` con el DTO exacto de la respuesta del backend
  (`status`, `items[]` con los trece campos en snake_case, `page.limit/offset/total`);
  verificar contra `internal/recommendation/models.go` del backend, campo por campo.
- [ ] 1.4 Crear `repo/rest/helpers.ts` con el mapper DTO → modelo: camelCase, `score`
  preservado como `null` cuando llega nulo, y `status` desconocido normalizado a `"none"`;
  verificar que el mapper no produce `score: 0` para ningún input.
- [ ] 1.5 Crear `repo/rest/job-recommendation-repository.rest.ts` sobre
  `GET employees/{employeeId}/job-recommendations` con `limit` y `offset` como query params;
  verificar que `limit` sale de una constante dentro de `[1, 100]`.
- [ ] 1.6 Registrar `jobRecommendationRepository` en `src/api/index.ts` siguiendo el patrón
  de los tres repositorios existentes; verificar con `yarn tsc --noEmit`.

## 2. Consulta con sondeo

- [ ] 2.1 Crear `hooks/use-job-recommendations.ts` con `jobRecommendationKeys.byEmployee(employeeId, offset)`
  y la constante de `limit`; verificar que el prefijo del key permite invalidar todos los
  tramos de una vez.
- [ ] 2.2 Implementar `useJobRecommendations(employeeId, offset)` con `enabled` condicionado
  a un `employeeId` numérico y positivo; verificar que sin perfil cargado no se emite ninguna
  petición (DevTools de red).
- [ ] 2.3 Agregar `refetchInterval` como función del estado: intervalo constante mientras
  `status` sea `pending` o `processing`, `false` en `none`, `completed` y `failed`; verificar
  en red que el sondeo arranca en `processing` y se detiene al llegar a `completed`.
- [ ] 2.4 Agregar `retry: false` y `placeholderData: keepPreviousData`; verificar que un
  error corta el sondeo en vez de reintentar en silencio, y que cambiar de página no
  parpadea a vacío.
- [ ] 2.5 Verificar que al navegar fuera de la pantalla no se emite ninguna petición más del
  sondeo (DevTools de red, con un batch en `processing`).
- [ ] 2.6 Agregar el helper de autorización (`403`) análogo a `isForeignJobPositionError`;
  verificar que distingue `403` de un error de red.

## 3. Pantalla de recomendaciones

- [ ] 3.1 Crear `pages/job-recommendations-page.tsx` que resuelve el `employeeID` desde
  `useEmployee(userId).data.id` y muestra carga mientras el perfil está pendiente; verificar
  que no consulta recomendaciones antes de tener el identificador.
- [ ] 3.2 Implementar el desenlace de error de carga reutilizando el patrón de
  `JobPositionState` con reintento, y el de `403` sin reintento; verificar ambos forzando
  las respuestas.
- [ ] 3.3 Implementar los estados vacíos diferenciados: `none` orienta a completar o
  actualizar el perfil, `completed` sin items explica que no hay coincidencias; verificar que
  los textos son distintos y que ninguno se muestra mientras la consulta está pendiente.
- [ ] 3.4 Implementar el estado `failed` con explicación de generación fallida y acción de
  reintento; verificar que no se presenta como ausencia de coincidencias.
- [ ] 3.5 Implementar el indicador de generación en curso para `pending` y `processing`,
  compatible con la presencia simultánea de items del conjunto anterior; verificar que con
  `processing` + items se ven ambas cosas.
- [ ] 3.6 Crear `pages/job-recommendation-card.tsx` con los datos del puesto que ya vienen en
  la respuesta y el acceso a su detalle; verificar que no dispara una consulta por tarjeta.
- [ ] 3.6b Crear `pages/job-recommendation-detail-dialog.tsx` sobre el primitivo `Dialog`,
  alimentado solo por el item ya cargado; verificar en DevTools de red que abrirlo y cerrarlo
  no emite ninguna petición y que al cerrar se conserva el tramo visible.
- [ ] 3.7 Renderizar el puntaje solo cuando `score !== null`; verificar con la respuesta real
  de hoy —todos los `score` nulos— que no aparece ningún indicador de afinidad ni texto que
  prometa orden por afinidad.
- [ ] 3.8 Presentar los items en el orden recibido, sin `sort` ni `filter`; verificar por
  inspección del componente y comparando con el orden de la respuesta.

## 4. Paginación

- [ ] 4.1 Mantener el `offset` en estado local de la página y pasarlo al hook; verificar que
  cada tramo queda cacheado por separado en las DevTools de React Query.
- [ ] 4.2 Implementar los controles anterior/siguiente derivados de `page.total`, `limit` y
  `offset`; verificar que en la primera página no se ofrece retroceder y en la última no se
  ofrece avanzar.
- [ ] 4.3 Volver a `offset = 0` cuando `total` deja el tramo actual fuera de rango; verificar
  con un conjunto que se achica entre dos generaciones.
- [ ] 4.4 Verificar que nunca se pide un `limit` fuera de `[1, 100]` ni un `offset` negativo,
  y que por lo tanto el `400` de paginación del backend no es alcanzable desde la UI.

## 5. Ruta y refresco

- [ ] 5.1 Reemplazar en `src/router/index.tsx` el `ContinuityPage` de `employee/home` por la
  nueva página, conservando `RequireRole allowedRoles={["employee"]}` y el `errorElement`;
  verificar que `MainResolverPage` y `src/router/paths.ts` no necesitan cambios.
- [ ] 5.2 Redirigir a `/main/employee/profile` cuando la sesión `employee` no tiene perfil,
  reutilizando la clasificación de perfil ausente existente; verificar con una cuenta sin
  perfil que no se consulta recomendaciones.
- [ ] 5.3 Verificar que una sesión `employer` que abre `/main/employee/home` termina en su
  destino válido, y que con el perfil pendiente se ve carga y no una redirección provisional.
- [ ] 5.4 Agregar la invalidación del prefijo `["job-recommendations"]` en el `onSuccess` de
  las mutaciones de perfil de `src/features/employees/hooks/useEmployee.ts`; verificar que
  una mutación fallida no invalida nada.
- [ ] 5.5 Verificar el ciclo completo: editar una sección del perfil, volver a
  `/main/employee/home` y ver el estado de generación en curso sondeando hasta el desenlace.

## 6. Validación

- [ ] 6.1 Ejecutar `yarn lint` y dejarlo en cero warnings.
- [ ] 6.2 Ejecutar `yarn tsc --noEmit` sin errores.
- [ ] 6.3 Ejecutar `yarn build` sin errores.
- [ ] 6.4 Recorrer uno por uno los criterios de aceptación de LAB-37 y dejar constancia de
  cómo se comprobó cada uno.
