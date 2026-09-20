## Context

Ver `proposal.md` — Why. La feature `src/features/job-positions/` ya tiene modelo,
mapeadores REST, hooks de detalle/alta/edición y las páginas de formulario. `use-job-positions.ts`
declara `jobPositionKeys.byEmployer(employerId)` e invalida esa clave tras crear y editar,
pero nunca existió una consulta que la poblara. El backend expone
`GET /employers/{employerID}/jobs` → `200` con un arreglo de puestos y
`DELETE /jobs/{jobPositionID}` → `204` sin cuerpo; ambos responden `403` ante rol o
propiedad incorrectos y `404` ante un puesto inexistente o ya eliminado, siempre con JSON
`{"error":"..."}`, que el `MutationCache.onError` global de `src/App.tsx` ya entiende.

No hay primitivo de confirmación en `src/components/ui/`, pero `@radix-ui/react-dialog`
ya está entre las dependencias: `sheet.tsx` lo usa.

## Goals / Non-Goals

**Goals:**

- Cerrar la gestión de puestos del empleador sin tocar el backend ni el contrato HTTP.
- Reutilizar el modelo, los mapeadores y las claves de query existentes en lugar de
  duplicarlos.
- Dejar preparado el punto de entrada a candidatos recomendados para LAB-38.

**Non-Goals:**

- No se implementa ninguna recomendación real ni se consume una API de recomendaciones.
- No se agrega paginación, búsqueda ni ordenamiento: el backend devuelve la colección
  completa del empleador.
- No se introduce una acción de reapertura ni se exponen puestos eliminados.
- No se agregan dependencias nuevas.

## Decisions

**Extender el repositorio existente en lugar de crear uno nuevo.**
`listJobPositions(employerId): Promise<JobPosition[]>` y
`deleteJobPosition(jobPositionId): Promise<void>` se agregan a `JobPositionRepository` y a
`jobPositionRepositoryRest`, reutilizando `mapJobPositionResponse`. La alternativa de un
repositorio separado para lectura de colección partiría el contrato de la feature en dos
piezas que cambian juntas.

**Reutilizar `jobPositionKeys.byEmployer` como clave de la colección.**
Ya es la clave que invalidan `useCreateJobPosition` y `useUpdateJobPosition`, así que
publicar y editar refrescan el listado sin cambiar nada más. `useDeleteJobPosition`
invalida la colección y además el detalle del puesto eliminado, para que una edición
abierta en otra pestaña no quede sirviendo un puesto inexistente desde caché.

**Derivar el `employerId` de `useEmployerContext`, no de la URL.**
Es el mismo patrón que ya usan las páginas de alta y edición, y evita que el listado
dependa de un identificador manipulable desde el navegador. `useEmployerContext` también
resuelve la redirección al onboarding cuando no hay perfil. El catálogo de timezones que
ese hook trae no lo necesita el listado, pero ya está cacheado por el resto de la feature
y no justifica un hook paralelo.

**Confirmación con un primitivo propio sobre `@radix-ui/react-dialog`.**
Se agrega `src/components/ui/alert-dialog.tsx` siguiendo el estilo de `sheet.tsx`, en vez
de instalar `@radix-ui/react-alert-dialog`. Evita una dependencia nueva para un único uso
y mantiene el control de foco y `Escape` que da Radix. Un `window.confirm` quedaría fuera
del sistema de diseño y no es testeable con Playwright de forma estable.

**Tratar `404`/`403` de la eliminación como desincronización, no como error de red.**
Si la API responde que el puesto no existe o es ajeno, el listado se invalida contra la
API: el estado local estaba viejo. Solo los errores genuinamente recuperables conservan la
opción de reintentar. Es la misma lectura que ya hace `job-position-edit-page.tsx` con el
detalle.

**Candidatos recomendados como ruta propia con pantalla de continuidad.**
`/main/employer/jobs/:jobPositionId/candidates`, guardada por rol `employer` igual que el
resto del área. Reusa `ContinuityPage`, como hoy hace la ruta de listado. Un botón
deshabilitado en la card habría sido más barato, pero deja a LAB-38 sin ruta ni guard y
no comunica qué va a aparecer ahí.

**Cards en vez de tabla.**
Consistente con `job-position-published.tsx` y con el resto de la feature, y legible en
mobile sin scroll horizontal. El `table.tsx` existente rendiría más en densidad, pero
ningún otro punto del producto lo usa todavía.

## Risks / Trade-offs

- **El listado carga la colección completa sin paginar** → El backend no ofrece
  paginación y el volumen esperado por empleador es bajo. Si crece, es un cambio de
  contrato que toca ambos repositorios y sale de este alcance.
- **Un `alert-dialog` propio puede divergir del que se instale más adelante** → Se
  construye con la misma estructura y API que los primitivos shadcn equivalentes, de modo
  que reemplazarlo por el paquete oficial sea sustituir el archivo.
- **La pantalla de candidatos promete algo que todavía no existe** → El texto declara
  explícitamente que las recomendaciones se calculan de forma diferida y no muestra
  ningún dato; es el mismo mensaje que ya usa `job-position-published.tsx`.
- **`useEmployerContext` arrastra la consulta de timezones al listado** → Ya está
  cacheada por el alta y la edición; el costo es un hit de caché, no una request extra en
  el flujo habitual.
