## Why

En el paso de experiencia el empleado declara una lista de certificaciones pero solo puede
adjuntar un único PDF (`certifications_file`), que el backend guarda sin asociarlo a ningún
nombre. Con dos o más certificaciones nadie puede saber a cuál corresponde el archivo: ni el
propio empleado ni el empleador que evalúa al candidato (LAB-40; en prod,
`emp01.completo@laburito.test` tiene dos certificaciones y un PDF).

El backend cambia el contrato en la misma tarea (cambio OpenSpec homónimo en
`bolsa-de-trabajo-back`): cada certificación pasa a ser un ítem con nombre y, opcionalmente,
su propio PDF.

## What Changes

- **BREAKING** El paso de experiencia deja de tener un único campo de PDF: cada
  certificación declarada ofrece su propio campo de PDF opcional, y puede conservar, reemplazar
  o quitar el PDF que ya tenía.
- **BREAKING** El multipart de `POST /employees` y `PUT /employees/{employeeID}` envía
  `certifications` como un único campo JSON `[{ "name", "document" | "document_id" }]` y un
  archivo por clave `certification_document_{index}`. Desaparecen `certifications[]` y
  `certifications_file`.
- **BREAKING** `certifications` en `GET /users/{userID}/employee` y `GET /employees/{employeeID}`
  pasa de `string[]` a `[{ "name", "document_id" }]`; `files` pasa a listar solo los
  certificados viejos sin asociar, con `id` y `title` en ambos endpoints.
- El paso de experiencia (perfil propio) muestra, por certificación, si tiene PDF y permite
  descargarlo; lista aparte los certificados sin asociar.
- El panel de perfil del candidato (`candidate-profile-sheet.tsx`) muestra cada certificación
  con su botón de descarga cuando tiene PDF, y los certificados viejos como «Certificado sin
  asociar».
- La descarga sigue por `GET /employees/{employeeID}/files/{fileID}/download-url`, pedida en el
  clic y sin persistir la URL.
- Los errores `400` de estos endpoints llegan como `{"error": "..."}` y el handler global los
  muestra tal cual.

## Capabilities

### New Capabilities
- `employee-certification-documents`: carga, edición y presentación en el perfil propio de las
  certificaciones del empleado, cada una con su PDF opcional, y el contrato multipart y de
  lectura que las transporta.

### Modified Capabilities
- `employer-candidate-recommendations`: el perfil del candidato presenta cada certificación
  con su documento propio y separa los certificados sin asociar.

## Impact

- Código: `src/features/employees/forms/new-employee/` (schema, initialValues, wizard,
  `steps/experience-form.tsx`), `src/features/employees/models/` (`Employee.ts`,
  `employee-profile.ts`), `src/features/employees/repo/rest/` (`types.ts`, `helpers.ts`,
  `profile-helpers.ts`), `src/features/employee-recommendations/pages/candidate-profile-sheet.tsx`
  y el hook de descarga, que pasa a usarse también desde el perfil propio.
- E2E: fixtures de perfil en `e2e/*.spec.ts` que hoy mandan `certifications: string[]`.
- API: depende del cambio `associate-certification-documents` del backend; FE y BE se
  despliegan juntos. El endpoint de recomendaciones (`certifications: string[]`) no cambia.
- Docs: `docs/use-cases.md` (caso 5) y `docs/create-employee-experience.md` en la carpeta
  suelta `laburi.to/docs/`, fuera de este repositorio.
