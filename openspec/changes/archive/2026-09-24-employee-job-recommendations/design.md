## Context

Ver `proposal.md` — Why para la motivación.

El contrato del backend ya está fijo (LAB-35, mergeado en `main` del backend):

- `GET /employees/{employeeID}/job-recommendations?limit&offset`, solo detrás del middleware
  de autenticación; el rol y la propiedad se verifican en el servicio.
- Respuesta `200`: `{ status, items, page: { limit, offset, total } }`.
- `status`: `none | pending | processing | completed | failed`. Sale del batch **más
  reciente**; `items` sale del **último batch completado**. No son el mismo batch.
- `items[]`: `recommendation_id`, `job_position_id`, `employer_id`, `position`, `role`,
  `required_experience`, `required_education_level`, `available_hours_per_day`, `timezone`,
  `technical_resources`, `score`, `published_at`, `updated_at`. `score` es nullable.
- `limit` por defecto 20 y máximo 100; `offset` por defecto 0. Un valor fuera de rango
  responde `400` y no se recorta en silencio.
- Todos los errores responden JSON `{"error":"..."}`, así que el `MutationCache.onError` de
  `src/App.tsx` los entiende. Códigos: `400`, `401`, `403` (`"forbidden"`), `404`, `500`.

Restricción de producto: el algoritmo de indicadores todavía no existe (LAB-30 solo define
su interfaz). Hoy `score` llega `null` en todos los items y los batches pueden terminar en
`failed` por falta de scoring. El frontend tiene que ser legible en ese escenario sin
inventar afinidad.

En el frontend no hay precedente de paginación ni de sondeo: ambos se introducen acá.

## Goals / Non-Goals

**Goals:**

- Un único punto de acceso a las recomendaciones del empleado, alineado con el destino que
  `MainResolverPage` ya resuelve.
- Tipos que hagan imposible confundir el estado de la generación con el contenido del
  conjunto.
- Sondeo que se apague solo, sin depender de que el componente recuerde limpiarlo.
- Una forma de paginar reutilizable por LAB-38, que consume el endpoint espejo con la misma
  forma de respuesta.

**Non-Goals:**

- No se implementa el lado del empleador (`GET /jobs/{jobPositionID}/employee-recommendations`):
  es LAB-38. Sí se deja el repositorio con un nombre que admita el segundo método.
- No se toca el contrato HTTP ni el backend.
- No se agrega scroll infinito ni prefetch de páginas.
- No se define ni se simula ninguna noción de afinidad propia del frontend.

## Decisions

### La pantalla reemplaza `/main/employee/home` en vez de estrenar una ruta

`/main/employee/home` ya es el destino que `MainResolverPage` le da a todo empleado con
perfil, y su `ContinuityPage` ya promete "tus próximas oportunidades laborales". Reemplazar
su contenido deja `MainResolverPage` intacto y evita una ruta huérfana.

Es el mismo movimiento que hizo LAB-27 con `/main/employer/jobs`, que era una pantalla de
continuidad y pasó a ser el listado real.

Alternativa descartada: una ruta nueva `/main/employee/recommendations`. Obligaba a decidir
qué queda en `home` —placeholder indefinido o redirección— y a modificar el destino del
resolver, sin ganar nada.

### Feature propia `src/features/job-recommendations/`

Las recomendaciones no son ni una sección del perfil de empleado ni parte del CRUD de
puestos: son un tercer recurso con su propio endpoint, su propio estado y, en LAB-38, su
propio consumidor del lado del empleador. Colgarlas de `employees/` las mezclaría con el
asistente de perfil; colgarlas de `job-positions/` mezclaría la lectura del empleado con la
escritura del empleador.

La anatomía copia la de `job-positions/`: `repo/` con la interfaz, `repo/rest/` con la
implementación y los mappers, `models/`, `hooks/` y `pages/`. El repositorio se registra en
`src/api/index.ts` como los tres existentes.

### El estado de generación y los items son dos campos distintos del modelo

El modelo del frontend replica la separación del backend en vez de aplanarla:

```ts
type RecommendationStatus =
  | "none" | "pending" | "processing" | "completed" | "failed";

type JobRecommendationsPage = {
  status: RecommendationStatus;
  items: JobRecommendation[];
  page: { limit: number; offset: number; total: number };
};
```

`status` no se deriva de `items.length`: un `processing` con items del conjunto anterior y un
`completed` sin items son estados distintos que se verían iguales si se infiriera. Un valor
de `status` que el frontend no reconozca se normaliza a `"none"` en el mapper, que es lo
mismo que hace el backend ante un estado desconocido.

`score` se mapea a `number | null` y no a `number | undefined`: `null` es el valor que el
backend envía explícitamente y distinguirlo de "el campo no vino" no aporta nada acá, pero
colapsarlo a `0` sí sería inventar un puntaje.

### Sondeo con `refetchInterval` en función del último dato

React Query acepta `refetchInterval` como función del query result, así que el sondeo se
declara en la consulta y no en un `useEffect` con `setInterval`:

```ts
refetchInterval: (query) => {
  const status = query.state.data?.status;
  return status === "pending" || status === "processing" ? POLL_MS : false;
}
```

Esto cubre tres de los cuatro criterios de parada sin código extra: el desenlace apaga el
intervalo, el desmontaje lo apaga porque React Query lo asocia al observer, y una consulta
fallida deja `data` sin cambiar pero se acompaña con `retry: false` para que el error sea
visible en vez de reintentarse en silencio.

Intervalo: 5 segundos. Es sensible para una espera que el usuario está mirando y no golpea
la API con una consulta que hace tres lecturas a la base. `refetchIntervalInBackground`
queda en su valor por defecto (`false`): una pestaña en segundo plano no sondea.

Alternativa descartada: `useEffect` con `setInterval` y limpieza manual. Es exactamente el
mecanismo que el criterio "el polling se detiene al desmontar" señala como frágil.

### Paginación por `offset` en el query key

El `offset` vive en el estado local de la página y entra en el query key:

```ts
jobRecommendationKeys.byEmployee(employeeId, offset)
```

Así cada tramo se cachea por separado y volver a una página anterior es instantáneo.
`placeholderData: keepPreviousData` evita que la lista parpadee a vacío al cambiar de
página, y con eso el sondeo sigue apuntando al tramo visible.

`limit` es una constante de 20 —el valor por defecto del backend— y no se expone al usuario:
no hay requisito de elegir el tamaño de página y cualquier valor fuera de `[1, 100]` sería
un `400`.

Si `total` deja el `offset` actual fuera de rango —el conjunto se achicó entre dos
generaciones— la página vuelve a `offset = 0` en vez de mostrar un tramo vacío.

Alternativa descartada: `useInfiniteQuery`. Acumula páginas en memoria, y combinar esa
acumulación con un sondeo que reemplaza el conjunto entero cada vez que un batch completa
produce listas inconsistentes.

### La invalidación tras editar el perfil vive en los hooks del perfil

Las once mutaciones de `useEmployee.ts` ya invalidan `employeeKeys.employee(id)` en
`onSuccess`. Se agrega la invalidación del prefijo `["job-recommendations"]` en ese mismo
lugar, porque es donde el backend dispara la regeneración (LAB-34).

Invalidar por prefijo y no por `offset` alcanza a todos los tramos cacheados de una vez.

### El detalle se compone con los datos embebidos, no con una consulta al puesto

`GET /jobs/{jobPositionID}` resuelve con `resolveOwnedPosition`
(`internal/jobposition/service.go:107`): exige que el solicitante sea el empleador dueño, así
que una sesión `employee` recibe `403`. No hay endpoint de detalle legible por el empleado y
este cambio no lo agrega.

No hace falta: `items[]` trae los trece campos del puesto embebidos —todo salvo el `id` del
puesto y su `created_at`— así que tanto la tarjeta como el detalle se arman sin una sola
petición extra. El detalle abre en un diálogo sobre `@radix-ui/react-dialog`, que ya está
entre las dependencias y ya se usa para la confirmación de borrado de puestos.

Como el dato es local, no existe el caso "el puesto ya no está disponible" al abrir el
detalle: el backend excluye los puestos eliminados del listado y del total, así que lo que
está en pantalla es lo que la última respuesta trajo.

Alternativa descartada: una ruta `/main/employee/jobs/:jobPositionId` alimentada por el
estado de navegación. Agrega una ruta que no sobrevive a un refresh ni a un enlace directo,
para mostrar exactamente el mismo contenido.

## Risks / Trade-offs

- **Sin scoring real, la pantalla más probable hoy es `failed` o un conjunto vacío** → Es el
  comportamiento correcto y está especificado: `failed` se explica como generación fallida y
  `completed` vacío como ausencia de coincidencias. La pantalla no promete afinidad que no
  existe, así que no hay que rehacerla cuando el algoritmo llegue.
- **Un sondeo de 5 s sobre un batch que tarda mucho genera muchas consultas** → El intervalo
  no corre con la pestaña en segundo plano, y el backend acota cada lectura con `limit`. Si
  se vuelve un problema, el intervalo es una constante en un solo archivo.
- **`keepPreviousData` puede mostrar el tramo anterior mientras llega el nuevo** → Es
  deliberado, y se acompaña de un indicador de carga para que no se lea como resultado final.
- **El `offset` no está en la URL, así que una página no es compartible ni sobrevive a un
  refresh** → Aceptado: las recomendaciones son personales y su conjunto cambia entre
  generaciones, así que un enlace a "la página 3" no tiene una identidad estable que valga la
  pena preservar.
- **La forma de paginar se estrena acá y LAB-38 la va a necesitar igual** → Los tipos de
  `page` y el manejo de `offset` se dejan genéricos respecto del tipo de item, para que el
  lado del empleador los reutilice sin refactor.
