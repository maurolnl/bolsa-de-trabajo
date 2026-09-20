## Why

El empleador ya puede publicar y editar puestos, pero `/main/employer/jobs` sigue siendo
una pantalla de continuidad: no existe forma de ver los puestos propios, abrir su edición
desde el listado ni retirarlos. El backend ya expone `GET /employers/{employerID}/jobs` y
`DELETE /jobs/{jobPositionID}` con ownership verificada, así que la gestión queda cerrada
sin tocar el contrato.

## What Changes

- Se reemplaza la pantalla de continuidad de `/main/employer/jobs` por el listado real de
  puestos activos del empleador autenticado, con estados de carga, vacío y error
  recuperable.
- El repositorio de puestos del frontend incorpora `listJobPositions(employerId)` y
  `deleteJobPosition(jobPositionId)` sobre los endpoints existentes.
- Se agregan la consulta de la colección del empleador y la mutación de eliminación, que
  invalidan la colección y el detalle afectado al finalizar.
- Cada puesto del listado ofrece editar, eliminar con confirmación explícita y acceso a
  sus candidatos recomendados.
- Se agrega la ruta `/main/employer/jobs/:jobPositionId/candidates` como punto de entrada
  reservado a los candidatos recomendados, presentado como pendiente mientras el backend
  de recomendaciones no exista.
- No se ofrece ninguna acción de reapertura: la eliminación del backend es definitiva
  para el frontend.

## Capabilities

### New Capabilities

- `job-position-management`: listado de los puestos activos del empleador autenticado,
  eliminación confirmada con actualización inmediata del listado, y acceso por puesto a
  sus candidatos recomendados.

### Modified Capabilities

- `role-profile-navigation`: la reserva de rutas de gestión de puestos a una sesión
  `employer` con perfil propio pasa a cubrir también el listado y la pantalla de
  candidatos recomendados, no solo el alta y la edición.

## Impact

- `src/features/job-positions/repo/job-position-repository.ts` y su implementación REST.
- `src/features/job-positions/hooks/use-job-positions.ts`.
- Nuevas páginas y componentes de listado en `src/features/job-positions/pages/`.
- `src/router/index.tsx` y `src/router/paths.ts`.
- Un primitivo de confirmación en `src/components/ui/`, construido sobre
  `@radix-ui/react-dialog`, ya presente entre las dependencias.
- Sin cambios en el backend ni en el contrato HTTP.
