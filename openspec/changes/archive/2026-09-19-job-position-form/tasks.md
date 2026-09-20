## 1. Dominio y contrato

- [x] 1.1 Crear `src/features/job-positions/models/job-position.ts` con `JobPosition`,
  `CreateJobPosition` y los tipos de enums alineados al contrato del backend; verificar
  con `yarn tsc --noEmit`.
- [x] 1.2 Crear `src/features/job-positions/repo/job-position-repository.ts` con
  `createJobPosition`, `getJobPosition` y `updateJobPosition`; verificar que el tipo
  compila y que no expone ningún identificador que no provenga del perfil propio.
- [x] 1.3 Crear `src/features/job-positions/repo/rest/types.ts` con el cuerpo y la
  respuesta en `snake_case` exactamente como los define `internal/jobposition/models.go`;
  verificar campo por campo contra ese archivo.
- [x] 1.4 Crear `src/features/job-positions/repo/rest/helpers.ts` con los mappers
  respuesta → dominio y dominio → cuerpo, enviando `technical_resources` siempre como
  array; verificar con `yarn tsc --noEmit`.
- [x] 1.5 Crear `src/features/job-positions/repo/rest/job-position-repository.rest.ts`
  contra `POST /employers/{employerID}/jobs`, `GET /jobs/{jobPositionID}` y
  `PUT /jobs/{jobPositionID}`; verificar las rutas contra `RegisterRoutes` del backend.
- [x] 1.6 Exportar `jobPositionRepository` desde `src/api/index.ts` siguiendo el patrón
  de `employerRepository`; verificar que el import resuelve con `yarn tsc --noEmit`.

## 2. Estado remoto

- [x] 2.1 Crear `src/features/job-positions/hooks/use-job-positions.ts` con
  `jobPositionKeys`, `useJobPosition`, `useCreateJobPosition` y `useUpdateJobPosition`,
  invalidando la colección del empleador y el puesto individual tras cada mutación;
  verificar que las keys no colisionan con `employerKeys` ni `employeeKeys`.
- [x] 2.2 Agregar en la feature `employers` un hook de lectura del perfil propio que
  reutilice `employerKeys.employer(userId)` sin `select`, para obtener el `employerID`;
  verificar en el navegador que abrir el formulario no dispara una segunda petición a
  `GET /users/{userID}/employer`.

## 3. Formulario

- [x] 3.1 Crear `src/features/job-positions/forms/job-position/options.ts` con las
  opciones código/etiqueta de experiencia y nivel educativo derivadas de las constantes
  existentes de `employees`, y las opciones de horas por día de 1 a 8; verificar que los
  códigos coinciden con los `oneof` del backend.
- [x] 3.2 Crear `src/features/job-positions/forms/job-position/schema.ts` con Zod,
  derivando `JobPositionFormValues` con `z.infer`, exigiendo todos los campos salvo
  recursos técnicos y acotando horas por día a 1–8; verificar que no hay ningún tipo del
  formulario escrito a mano.
- [x] 3.3 Crear `job-position-form.tsx` como componente único de alta y edición,
  parametrizado por valores iniciales y mutación, con selects para rol, experiencia,
  nivel educativo, horas y timezone, y lista editable de recursos técnicos; verificar
  manualmente ambos modos.
- [x] 3.4 Poblar el selector de timezone con `useTimezones`, bloqueando el envío mientras
  el catálogo esté pendiente y mostrando un estado recuperable si falla; verificar
  simulando un fallo de `GET /timezones`.
- [x] 3.5 Impedir envíos repetidos mientras la mutación está pendiente y conservar los
  valores ingresados ante error; verificar que el botón queda deshabilitado durante el
  envío.

## 4. Páginas, rutas y guards

- [x] 4.1 Crear la página de alta que resuelve el `employerID` del perfil propio, muestra
  carga mientras el perfil está pendiente y redirige a `/main/employer/profile` si no
  existe; verificar los tres estados.
- [x] 4.2 Crear la página de edición que carga el puesto con `GET /jobs/{jobPositionID}`,
  precarga el formulario y presenta un estado de error explícito ante `404` o `403`;
  verificar simulando ambas respuestas.
- [x] 4.3 Crear la vista de resultado posterior al alta con el puesto publicado y el
  bloque estático de recomendaciones pendientes, sin ninguna acción de reapertura;
  verificar que no se emite ninguna petición adicional.
- [x] 4.4 Agregar `jobsNew` y `jobsEdit` a `src/router/paths.ts` y registrar ambas rutas
  en `src/router/index.tsx` bajo `RequireRole` con rol `employer`; verificar que
  `/main/employer/jobs` sigue mostrando la página temporal.

## 5. Validación y pruebas

- [x] 5.1 Agregar `e2e/job-position-form.spec.ts` con respuestas HTTP simuladas cubriendo
  validación de campos obligatorios, alta exitosa con estado de recomendaciones, edición
  precargada, error `{"error":"..."}` del backend, `403` sobre puesto ajeno y guard de
  empleador sin perfil; verificar con `yarn test:e2e`.
- [x] 5.2 Ejecutar `yarn tsc --noEmit`, `yarn eslint` sobre los archivos tocados y
  `yarn build`, y comprobar explícitamente cada criterio de aceptación de LAB-26.
