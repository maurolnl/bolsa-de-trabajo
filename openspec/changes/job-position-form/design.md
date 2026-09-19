## Context

Ver `proposal.md` — Why. Restricciones vigentes que condicionan el enfoque:

- El contrato de puestos ya está fijo en el backend (`internal/jobposition`): cuerpo con
  `position`, `role`, `required_experience`, `required_education_level`,
  `available_hours_per_day` (1 a 8), `timezone` (2 a 100 caracteres) y
  `technical_resources`. El backend normaliza `null` a `[]` y **siempre** devuelve una
  lista, nunca `null`.
- `PUT /jobs/{jobPositionID}` reutiliza exactamente el mismo cuerpo que el alta: es un
  reemplazo total, no un parche.
- Todos los errores de puestos responden `{"error": "..."}`, incluidos los de validación
  de DTO. El `MutationCache.onError` global de `src/App.tsx` ya interpreta ese formato,
  así que no hace falta un manejo de errores propio de la feature.
- El `employerID` del path solo sirve para detectar acceso ajeno: el backend deriva la
  identidad real del JWT y responde `403` genérico ante rol incorrecto, perfil ausente o
  puesto ajeno.
- El repositorio tiene dos patrones de enums conviviendo: `employees` guarda etiquetas en
  español en el modelo y mapea a códigos en `repo/rest/helpers.ts`; `employers` (LAB-22,
  más reciente) mantiene el modelo alineado con el contrato y solo cambia `snake_case` a
  `camelCase`.
- El catálogo de timezones ya existe como `GET /timezones`, expuesto por
  `employeeRepository.timezones()` y el hook `useTimezones`.

## Goals / Non-Goals

**Goals:**

- Un único componente de formulario que sirva alta y edición, parametrizado por modo.
- Modelo de dominio de puestos alineado uno a uno con el contrato, sin traducción de
  enums en el borde REST.
- Reutilizar las listas de opciones ya definidas para empleado, sin duplicarlas.

**Non-Goals:**

- Listado y eliminación de puestos (LAB-27).
- Cualquier consumo real de recomendaciones; el backend usa un publisher noop.
- Refactorizar el patrón de enums de `employees`.
- Mover el catálogo de timezones fuera de la feature `employees`.

## Decisions

### Modelo alineado al contrato en lugar de etiquetas traducidas

El modelo `JobPosition` guarda los códigos del backend (`less_1y`, `university`) y el
formulario resuelve las etiquetas visibles mediante mapas de constantes. Sigue el patrón
de `employers` en vez del de `employees`.

Alternativa descartada: replicar el patrón de `employees` con mappers bidireccionales
etiqueta ↔ código. Obliga a mantener dos `Record` inversos por enum y a que un valor
ilegal del backend rompa el mapeo silenciosamente. Al ser un dominio nuevo no hay
compatibilidad que conservar, y el ticket solo exige reutilizar las *opciones*, no la
representación interna.

Consecuencia: `educationTypeOptions` y el mapa de etiquetas de
`features/employees/forms/new-employee/steps/education-form/constants.ts` se reutilizan
tal cual. Para experiencia hace falta una lista de pares código/etiqueta, derivada de los
mismos valores que ya usa `yearsOfExperienceOptions` — se define una única vez en la
feature de puestos, sin duplicar textos en el formulario.

### `technical_resources` siempre como array

El formulario mantiene `string[]` y envía `[]` cuando está vacío. El backend acepta
`null` pero nunca lo devuelve, así que un modelo `string[] | null` obligaría a normalizar
al leer y dejaría dos representaciones del mismo estado vacío.

Alternativa descartada: enviar `null` cuando la lista está vacía, según la lectura
literal del ticket. Aporta una segunda representación sin ningún efecto observable en la
API.

### `employerID` derivado del perfil propio, nunca del usuario

El alta necesita el `employerID` del path. Se obtiene del perfil de empleador ya
consultado por `useProfileExistence` / `employerRepository.getByUserId`, reutilizando la
misma query key (`employerKeys.employer(userId)`) para no disparar una consulta
adicional. El formulario no se habilita mientras ese perfil no esté resuelto.

Alternativa descartada: pedir el `employerID` en algún estado local o de ruta. Rompería
la regla de no confiar en identificadores enviados por el navegador y duplicaría una
fuente de verdad que ya está cacheada.

Nota: `useProfileExistence` aplica `select` y expone solo `"exists" | "missing"`. La
feature de puestos necesita el `id`, así que consume la misma query key mediante un hook
de lectura propio sin `select`; React Query comparte la entrada de caché y no reconsulta.

### Un componente de formulario con dos modos

Alta y edición comparten campos, validación y cuerpo enviado. El componente recibe los
valores iniciales y la mutación a ejecutar; la página de edición resuelve la carga previa
del puesto y solo monta el formulario con datos disponibles.

Alternativa descartada: dos componentes separados. Duplicaría el esquema Zod y las
opciones de enums, y cualquier cambio de contrato exigiría tocar ambos.

### Rutas nuevas bajo `/main/employer/jobs`

Se agregan `/main/employer/jobs/new` y `/main/employer/jobs/{jobPositionID}/edit`.
`/main/employer/jobs` queda como está — LAB-27 la reemplaza por el listado real. Los
guards reutilizan `RequireRole` más la verificación de perfil existente.

### Estado de recomendaciones estático

Tras publicar, la vista de resultado muestra un bloque fijo que declara las
recomendaciones como pendientes. No hay endpoint ni campo que consultar: el backend
publica el evento contra `NoopEventPublisher` y la respuesta de `JobPosition` no contiene
nada relacionado.

Alternativa descartada: omitirlo por completo. El criterio de aceptación del ticket lo
pide explícitamente, y un texto declarado como pendiente es honesto respecto del estado
real del sistema.

## Risks / Trade-offs

- La feature de puestos importa opciones y el hook de timezones desde `employees` →
  acoplamiento entre features. Mitigación: importar solo constantes y el hook de
  catálogo, ambos sin estado de empleado; si aparece un tercer consumidor, mover el
  catálogo a `core`.
- Un `403` genérico no distingue puesto ajeno de perfil faltante → el mensaje al usuario
  puede ser impreciso. Mitigación: es deliberado del backend para no filtrar existencia
  de puestos ajenos; el frontend muestra el mensaje recibido sin interpretarlo.
- El mensaje de validación del backend llega en inglés y con nombres de campo Go (por
  ejemplo `AvailableHoursPerDay is required`) → ruido si el usuario lo ve. Mitigación: la
  validación Zod replica las reglas del backend, de modo que ese mensaje solo aparece
  ante una divergencia real de contrato.
- Reutilizar `employerKeys.employer(userId)` sin `select` acopla la feature de puestos a
  la forma cacheada del perfil de empleador. Mitigación: se consume a través de un hook
  propio, de modo que un cambio de key toca un solo archivo.

## Migration Plan

No aplica: la funcionalidad es aditiva, no hay datos persistidos en el navegador ni rutas
existentes que cambien de significado.
