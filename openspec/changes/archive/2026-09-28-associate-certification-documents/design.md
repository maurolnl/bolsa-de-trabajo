## Context

- El paso de experiencia (`steps/experience-form.tsx`) usa `AutocompleteInput` para una lista
  `certifications: string[]` y un único `certificationFile`, visible solo si hay alguna
  certificación. `mapEmployeeFormData` envía `certifications[]` repetido y
  `certifications_file`.
- El perfil propio es el mismo asistente en `/main/employee/profile`: se precarga con
  `GET /users/{userID}/employee` (`getEmployeeMapper`). Hoy no muestra el PDF cargado.
- El panel del candidato lee `GET /employees/{employeeID}` y muestra `certifications` como
  texto y una sección «Archivos» con descarga por `fileId`, usando
  `useCandidateFileDownload`.
- Educación ya resuelve el mismo problema con un JSON y un archivo por clave
  (`education_document_{index}`); este cambio replica ese patrón.

## Goals / Non-Goals

**Goals:**
- Un PDF opcional por certificación, en alta y edición, sin perder el PDF ya cargado si el
  empleado no lo toca.
- Presentar qué PDF corresponde a cada certificación en el perfil propio y en el del
  candidato.
- Perfiles viejos visibles sin romperse: PDF sin asociar como «Certificado sin asociar».

**Non-Goals:**
- Asociar desde la UI un certificado viejo a una certificación (el backend lo admite con
  `document_id`, pero la UI solo lo muestra y permite descargarlo).
- Tocar documentos de educación o la tarjeta de recomendación de empleos.

## Contrato API (compartido con el backend)

Request multipart (`POST /employees`, `PUT /employees/{employeeID}`):

```
position, role, years_of_experience, portfolio_url   (sin cambios)
certifications = '[{"name":"Scrum Master","document":"certification_document_0"},
                   {"name":"AWS Cloud Practitioner","document_id":12},
                   {"name":"ITIL"}]'
certification_document_0 = <PDF>
```

- `name`: obligatorio, sin espacios sobrantes, no vacío, único por perfil sin distinguir
  mayúsculas.
- `document`: clave del archivo nuevo en el multipart; reemplaza el PDF previo del ítem.
- `document_id`: identificador de un certificado ya cargado del empleado que se conserva
  (y queda asociado a este nombre). Excluyente con `document`.
- Ninguno de los dos: la certificación queda sin PDF y el que tuviera se da de baja.
- `certifications` ausente o `[]`: sin certificaciones.

Respuesta de lectura (`GET /users/{userID}/employee` y `GET /employees/{employeeID}`):

```json
"certifications": [
  { "name": "Scrum Master", "document_id": 31 },
  { "name": "ITIL", "document_id": null }
],
"files": [ { "id": 7, "title": "certificado.pdf" } ]
```

`files` contiene solo certificados subidos sin certificación asociada (datos anteriores al
cambio). Errores de validación: `400 {"error": "..."}`.

## Decisions

- **Modelo de formulario como lista de ítems.** `certifications` pasa a
  `{ name: string; documentId: number | null; document?: File }[]` manejado con
  `useFieldArray`. Un campo de texto + «Agregar» crea el ítem; cada fila muestra el nombre,
  «Quitar», el estado del PDF actual (con «Descargar» y «Quitar PDF») y un input de archivo
  para agregar o reemplazar. Alternativa descartada: mantener `AutocompleteInput` con un mapa
  paralelo nombre → archivo; se desincroniza al renombrar o borrar.
- **Mapeo a multipart.** Por ítem: con `document` (File) → `document:
  "certification_document_{index}"` y se adjunta el archivo; si no, con `documentId` →
  `document_id`; si no, solo `name`. Mismo esquema que `mapEmployeeEducationFormData`.
- **Validación en el formulario.** Zod: nombre recortado no vacío, únicos sin distinguir
  mayúsculas, `document` con `pdfFileValidation` (PDF, ≤ 5 MB). El backend sigue siendo la
  autoridad.
- **Descarga compartida.** `useCandidateFileDownload` se mueve a
  `src/features/employees/hooks/use-employee-file-download.ts` y lo usan el panel del candidato
  y el paso de experiencia. Conserva la regla de LAB-38: URL pedida en el clic, abierta en el
  acto, nunca en estado ni en `href`.
- **Modelos de lectura.** `Employee.certifications` y `EmployeeProfile.certifications` pasan a
  `{ name; documentId }[]`; `files` queda como certificados sin asociar
  (`{ id; title }[]`) en ambos. La tarjeta de recomendaciones no cambia (otro endpoint).

## Risks / Trade-offs

- [FE y BE desplegados en momentos distintos rompen el paso 1] → Mergear y desplegar ambos PR
  juntos; el backend rechaza el formato viejo con `400` en vez de borrar datos en silencio.
- [Quitar una certificación borra su PDF sin confirmación] → Aceptado: el cambio recién se
  aplica al presionar «Siguiente»; la fila deja claro qué PDF tiene.

## Migration Plan

Sin migración de datos en el FE. Desplegar después (o junto con) el backend. Rollback:
revertir ambos PR a la vez.
