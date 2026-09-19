## Why

El backend ya expone el CRUD completo de puestos de trabajo (LAB-25, mergeado en
`main`), pero `/main/employer/jobs` sigue siendo un estado temporal: un empleador con
perfil no tiene ninguna forma de publicar ni corregir un puesto. LAB-26 conecta ese
contrato con un formulario único de alta y edición, que es la puerta de entrada de toda
la épica de gestión de puestos.

## What Changes

- Incorporar el dominio `jobPositions` al frontend: modelo, repositorio, adaptador REST
  y hooks de React Query para `POST /employers/{employerID}/jobs`,
  `GET /jobs/{jobPositionID}` y `PUT /jobs/{jobPositionID}`.
- Presentar un formulario único de alta y edición con posición, rol, experiencia
  requerida, nivel educativo pretendido, horas disponibles por día, timezone y recursos
  técnicos opcionales.
- Derivar los tipos del formulario desde Zod y reutilizar las opciones de enums ya
  definidas para empleado (`yearsOfExperienceOptions`, `educationTypeOptions`,
  `roleOptions`) manteniendo en el modelo los códigos del backend.
- Reutilizar el catálogo existente `GET /timezones` a través del hook compartido, sin
  duplicar la consulta.
- Habilitar las rutas `/main/employer/jobs/new` y
  `/main/employer/jobs/{jobPositionID}/edit`, reservadas a una sesión `employer` que ya
  posea perfil.
- Tras un alta exitosa, mostrar el puesto publicado junto con un estado inicial de
  recomendaciones explícitamente pendiente, sin consultar ningún endpoint inexistente.
- Cubrir validación, envío, edición, errores y guards con pruebas Playwright de
  respuestas simuladas.

## Capabilities

### New Capabilities

- `job-position-form`: Formulario de alta y edición de puestos, validación, contrato
  HTTP consumido y estados resultantes.

### Modified Capabilities

- `role-profile-navigation`: Reservar las rutas de gestión de puestos a un empleador con
  perfil existente y definir el destino posterior al alta y a la edición.

## Impact

- Frontend: nueva feature `job-positions` (`models/`, `repo/`, `repo/rest/`, `hooks/`,
  `forms/`, `pages/`), `src/api/index.ts`, `src/router/index.tsx`, `src/router/paths.ts`
  y pruebas Playwright.
- API consumida sin cambios: `POST /employers/{employerID}/jobs`,
  `GET /jobs/{jobPositionID}`, `PUT /jobs/{jobPositionID}`, `GET /users/{userID}/employer`
  y `GET /timezones`, todos autenticados.
- Sin cambios de backend, base de datos, documentación raíz ni dependencias externas.
- Fuera de alcance: listado de puestos, eliminación lógica (LAB-27) y la infraestructura
  real de recomendaciones.
