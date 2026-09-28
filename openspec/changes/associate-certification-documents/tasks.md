## 1. Contrato y modelos

- [ ] 1.1 Actualizar `repo/rest/types.ts`: `certifications: { name: string; document_id: number | null }[]` en `EmployeeResponse` y `EmployeeProfileResponse`, `files: { id: number; title: string }[]` en ambos, y el tipo del request multipart; verificar con `yarn tsc --noEmit`
- [ ] 1.2 Actualizar `models/Employee.ts` y `models/employee-profile.ts` (`certifications: { name; documentId }[]`, `unassignedCertificates`/`files` como certificados sin asociar) y los mappers `getEmployeeMapper` y `mapEmployeeProfileResponse`; verificar con `yarn tsc --noEmit`
- [ ] 1.3 Reescribir `mapEmployeeFormData` para enviar `certifications` como JSON (`name` + `document` | `document_id`) y adjuntar `certification_document_{index}` solo para archivos nuevos; verificar con un E2E que inspecciona el cuerpo del request

## 2. Paso de experiencia

- [ ] 2.1 Cambiar `schema.ts`, `initialValues.ts` y el wizard a `certifications: { name; documentId; document? }[]`, con validación de nombre no vacío, único sin distinguir mayúsculas y PDF ≤ 5 MB; verificar con `yarn tsc --noEmit`
- [ ] 2.2 Reemplazar en `experience-form.tsx` el campo único de PDF por una fila por certificación (nombre, quitar, PDF actual con descargar/quitar, input para agregar o reemplazar), usando `useFieldArray`; verificar a mano y con E2E
- [ ] 2.3 Mover `useCandidateFileDownload` a `src/features/employees/hooks/use-employee-file-download.ts`, actualizar el import del panel del candidato y usarlo en el paso de experiencia; verificar que el E2E de LAB-38 sigue en verde
- [ ] 2.4 Listar en el paso de experiencia los certificados sin asociar (`files`) como «Certificado sin asociar» con descarga; verificar con un E2E con un perfil viejo

## 3. Perfil del candidato

- [ ] 3.1 En `candidate-profile-sheet.tsx`, mostrar cada certificación con su botón de descarga cuando `documentId` no es nulo y reemplazar la sección «Archivos» por «Certificados sin asociar»; verificar con E2E que la descarga pide `/employees/{id}/files/{document_id}/download-url`

## 4. E2E y validación

- [ ] 4.1 Actualizar fixtures de `e2e/*.spec.ts` al nuevo contrato y agregar escenarios: dos certificaciones con PDF, certificación sin PDF, conservar PDF en edición, perfil viejo sin asociar; verificar con `yarn test:e2e`
- [ ] 4.2 Ejecutar `yarn lint`, `yarn tsc --noEmit` y `yarn build` en verde
- [ ] 4.3 Comprobar explícitamente los criterios de aceptación 1, 2, 4 y 6 de LAB-40 contra el backend local

## 5. Docs (carpeta suelta `laburi.to/docs/`)

- [ ] 5.1 Actualizar el caso 5 «Subir certificaciones» de `docs/use-cases.md` y `docs/create-employee-experience.md` con el multipart nuevo y la asociación por certificación; verificar leyendo el diff
