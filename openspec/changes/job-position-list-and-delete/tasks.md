## 1. Contrato de datos

- [ ] 1.1 Agregar `listJobPositions(employerId)` y `deleteJobPosition(jobPositionId)` a
  `JobPositionRepository` y verificar que `yarn tsc --noEmit` falle únicamente por la
  implementación REST todavía ausente
- [ ] 1.2 Implementar ambos métodos en `jobPositionRepositoryRest` sobre
  `GET employers/{employerId}/jobs` y `DELETE jobs/{jobPositionId}`, reutilizando
  `mapJobPositionResponse`, y verificar que `yarn tsc --noEmit` pase

## 2. Estado remoto

- [ ] 2.1 Agregar `useEmployerJobPositions(employerId)` sobre
  `jobPositionKeys.byEmployer`, habilitada solo con un `employerId` válido, y verificar
  que el listado reciba los puestos y refleje los estados pendiente y de error
- [ ] 2.2 Agregar `useDeleteJobPosition(employerId)` que invalide la colección del
  empleador y el detalle del puesto eliminado, y verificar que tras eliminar el puesto
  desaparezca del listado sin recargar la página

## 3. Confirmación reutilizable

- [ ] 3.1 Agregar `src/components/ui/alert-dialog.tsx` sobre `@radix-ui/react-dialog`
  siguiendo el estilo de `sheet.tsx`, y verificar que cierre con `Escape`, devuelva el
  foco al disparador y no agregue dependencias a `package.json`

## 4. Listado de puestos

- [ ] 4.1 Crear la card de un puesto con posición, rol, experiencia requerida, nivel
  educativo pretendido, horas por día, timezone y recursos técnicos —con texto explícito
  cuando la lista esté vacía— reutilizando `requiredExperienceLabels` y
  `requiredEducationLevelLabels`, y verificar que muestre las etiquetas en español y no
  los códigos del contrato
- [ ] 4.2 Crear `JobPositionsListPage` derivando el `employerId` de `useEmployerContext`,
  redirigiendo al onboarding cuando no haya perfil, y verificar los tres estados: carga,
  vacío con acción de publicar, y error con reintento
- [ ] 4.3 Conectar la acción de editar de cada card a `PATHS.main.employer.jobsEdit` y
  verificar que abra el formulario de edición del puesto correcto
- [ ] 4.4 Conectar la acción de eliminar al `alert-dialog`, nombrando el puesto y
  advirtiendo que la acción no se revierte, y verificar que cancelar no dispare ninguna
  request y que confirmar deshabilite el botón mientras la mutación esté pendiente
- [ ] 4.5 Tratar `403` y `404` de la eliminación como desincronización invalidando la
  colección, y verificar que el puesto desaparezca en lugar de ofrecer un reintento inútil
- [ ] 4.6 Verificar por inspección que ninguna pantalla del área ofrezca reapertura,
  restauración o reactivación de un puesto eliminado

## 5. Rutas y navegación

- [ ] 5.1 Agregar `PATHS.main.employer.jobsCandidates(jobPositionId)` y verificar que
  `yarn tsc --noEmit` pase
- [ ] 5.2 Reemplazar el `ContinuityPage` de `/main/employer/jobs` por
  `JobPositionsListPage` bajo `RequireRole allowedRoles={["employer"]}`, y verificar que
  una sesión `employee` sea redirigida a su destino válido
- [ ] 5.3 Agregar la ruta `/main/employer/jobs/:jobPositionId/candidates` con
  `ContinuityPage` explicando que las recomendaciones se calculan de forma diferida y un
  regreso al listado, guardada por rol `employer`, y verificar la redirección de una
  sesión `employee`
- [ ] 5.4 Conectar el acceso a candidatos recomendados desde cada card y verificar que
  navegue al destino del puesto correcto

## 6. Validación

- [ ] 6.1 Agregar `e2e/job-position-list-and-delete.spec.ts` con rutas mockeadas
  siguiendo `e2e/job-position-form.spec.ts`, cubriendo listado con datos, estado vacío,
  error con reintento, cancelación y confirmación de la eliminación, y el acceso a
  candidatos; verificar que `yarn test:e2e` pase
- [ ] 6.2 Ejecutar `yarn lint`, `yarn tsc --noEmit` y `yarn build`, y verificar que los
  tres terminen sin errores
- [ ] 6.3 Recorrer los criterios de aceptación de LAB-27 uno por uno y verificar cada uno
  contra el comportamiento implementado
