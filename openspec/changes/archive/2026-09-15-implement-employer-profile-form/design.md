## Context

LAB-21 dejó `/main/employer/profile` protegida por rol, un resolvedor que consulta la existencia del perfil y un repositorio REST de empleadores limitado a `GET`. La query key de employer vive actualmente dentro de `use-profile-existence`, mientras el patrón de employee centraliza keys y mutaciones en su feature.

El backend ya expone `POST /employers` y `GET /users/{userID}/employer`. La creación recibe JSON con `name`, `industry`, `location` y `hiring_modalities`, deriva el usuario del JWT y responde `201` sin cuerpo. Las modalidades pueden ser una lista vacía, pero cada elemento debe contener texto. La consulta responde `404` cuando el perfil falta.

## Goals / Non-Goals

**Goals:**

- Mantener tipos idiomáticos en la UI y mapear explícitamente el contrato `snake_case` en el borde REST.
- Reutilizar una única query key para resolver navegación, impedir duplicados e invalidar el perfil tras la creación.
- Integrar el formulario con React Hook Form, Zod y las primitivas visuales existentes sin introducir estado remoto paralelo.
- Conservar los valores del formulario ante errores y verificar el flujo completo con Playwright interceptando HTTP.

**Non-Goals:**

- Crear o listar puestos de trabajo; `/main/employer/jobs` seguirá siendo un estado temporal.
- Editar perfiles de empleador existentes.
- Cambiar contratos, validaciones o persistencia del backend.
- Incorporar catálogos cerrados para industria, ubicación o modalidades.

## Decisions

### 1. Centralizar tipos, mapper y query keys en la feature de empleadores

Se añadirá un modelo de dominio tipado y un DTO REST que traduzca `user_id`, `hiring_modalities`, `created_at` y `updated_at`. El repositorio expondrá lectura tipada y creación; la feature exportará una factoría de query keys compartida por `useProfileExistence` y la nueva mutación.

Alternativa descartada: mantener `unknown` y duplicar `['employers', userId]` en cada consumidor. Esto debilita el contrato y permite invalidaciones que no alcanzan la consulta del resolvedor.

### 2. Representar modalidades como entradas libres repetibles

El formulario mantendrá `hiringModalities` como `string[]`, inicialmente vacío. Permitirá agregar una modalidad no vacía y retirar cualquiera de las existentes, mostrando cada valor con controles accesibles. Zod normalizará espacios y rechazará elementos vacíos; el mapper enviará la propiedad como `hiring_modalities` sin convertirla en enum.

Alternativa descartada: reutilizar el multiselect de opciones fijas. El contrato permite texto libre y un catálogo local limitaría valores válidos sin respaldo del producto.

### 3. Condicionar la página a la consulta de existencia

La página de onboarding reutilizará `useProfileExistence` con el usuario autenticado. Durante carga mostrará el patrón de loading; ante un error inesperado mostrará recuperación; con perfil existente reemplazará la ruta por `/main/employer/jobs`; solo con estado `missing` montará el formulario. El guard de rol existente seguirá siendo la primera barrera.

Alternativa descartada: confiar únicamente en el paso previo por `/main`. Una URL directa permitiría mostrar el alta a un empleador que ya tiene perfil y depender exclusivamente del `409` del servidor.

### 4. Invalidar antes de navegar tras el `201`

La mutación esperará la invalidación de la query de perfil del usuario autenticado y después navegará a `/main/employer/jobs`. Mientras esté pendiente deshabilitará el envío. Los fallos permanecerán en el formulario y usarán el toast global de mutaciones, que ya interpreta `{ "error": "..." }`.

Alternativa descartada: escribir un perfil sintético en caché. `POST /employers` no devuelve cuerpo, por lo que inventar datos produciría un estado parcial distinto de la fuente autoritativa.

### 5. Probar el flujo en el borde HTTP

Playwright simulará `/auth/me`, la consulta del perfil y `POST /employers` para comprobar validación, serialización, bloqueo durante carga, error conservando datos, prevención de alta duplicada y redirección exitosa. Las pruebas no dependerán de una API ni datos compartidos.

## Risks / Trade-offs

- [La invalidación puede iniciar un GET al mismo tiempo que la navegación] → Compartir exactamente la query key y esperar la invalidación antes de cambiar de ruta.
- [Una creación concurrente puede responder `409` después de que GET indicó ausencia] → Conservar el formulario y mostrar el error autoritativo; una nueva resolución o reintento de consulta detectará el perfil existente.
- [Las modalidades libres pueden duplicarse] → No imponer unicidad no definida por el contrato; validar únicamente contenido no vacío y conservar el orden ingresado.
- [El destino de puestos aún no tiene funcionalidad] → Mantener la pantalla temporal existente y limitar LAB-22 a la redirección acordada.

## Migration Plan

1. Introducir contratos tipados, mapper y query keys compartidas sin cambiar rutas públicas.
2. Incorporar el formulario y la página condicionada por existencia de perfil.
3. Reemplazar únicamente el estado temporal de `/main/employer/profile` y validar el flujo con HTTP simulado.

El rollback restaura el estado temporal de la ruta y retira la mutación/formulario; no requiere migraciones ni cambios de datos.
