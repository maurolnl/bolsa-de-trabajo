## Context

El paso de educación ya administra una lista unificada y el backend recibe cada entrada como strings `title`, `status` y `type`. Sin embargo, el editor usa texto libre aunque `forms/utils.ts` conserva cuatro catálogos de opciones, y el schema de la lista solo exige una entrada. Ver `proposal.md` y `specs/employee-education-title-selection/spec.md`.

## Goals / Non-Goals

**Goals:**

- Reutilizar los catálogos actuales como única fuente de opciones visibles.
- Aplicar los límites mientras se crea o edita una tarjeta y volver a validarlos sobre la lista completa.
- Mantener una edición estable: la tarjeta editada no debe bloquear su propio valor único.
- Mantener el contrato REST actual.
- Automatizar la comprobación de todos los criterios de aceptación en un navegador real.

**Non-Goals:**

- Cambiar rutas, payloads, enums, persistencia o validación del backend.
- Crear un catálogo remoto o permitir altas de títulos fuera de las opciones actuales.
- Limitar títulos distintos de `Abogacia`, `Contabilidad`, `Administracion` u orientaciones secundarias.
- Probar contra una API o base de datos compartida; la prueba E2E controlará las respuestas HTTP necesarias.

## Decisions

### Centralizar catálogos y reglas en utilidades del formulario

Se expondrá una relación tipada entre cada tipo educativo y su catálogo, junto con las constantes o helpers que determinan títulos únicos y disponibilidad. Esto evita duplicar condiciones entre el editor y el schema. La alternativa de definir opciones dentro del componente fue descartada porque dificultaría validar la lista completa con las mismas reglas.

### Filtrar antes de seleccionar y validar después

El editor recibirá las demás entradas de educación, sin incluir la entrada actualmente editada. Con esa colección filtrará los tres títulos universitarios únicos ya utilizados y ocultará `high-school-orientation` cuando otra entrada de ese tipo exista. El schema de la lista aplicará además una validación defensiva para impedir el guardado de datos duplicados precargados o producidos fuera del flujo normal.

La alternativa de confiar solo en opciones deshabilitadas fue descartada porque no cubre valores precargados ni cambios programáticos del formulario.

### Restablecer el título al cambiar el tipo

El cambio de tipo vaciará la selección de título para evitar enviar un valor perteneciente al catálogo anterior. Al abrir una edición se conservarán los valores iniciales; el restablecimiento ocurrirá únicamente ante un cambio realizado por el usuario.

### Conservar valores del contrato actual

Las etiquetas visibles pueden mantener tildes y textos legibles, pero los values seguirán siendo los strings existentes en los catálogos y el tipo de orientación seguirá siendo `high-school-orientation`. No se modifica el mapper REST.

### Ejecutar aceptación E2E con Playwright y API interceptada

Se añadirá `@playwright/test`, una configuración que levante Vite mediante `webServer` y una suite enfocada en `/main/home?step=5`. La prueba inicializará el token local antes de cargar la aplicación e interceptará autenticación, zonas horarias, consulta del empleado y actualización de educación mediante `page.route`. Así podrá preparar perfiles vacíos o con títulos existentes, observar los selectores y capturar el multipart enviado sin depender de credenciales, Railway ni datos compartidos.

La suite comprobará los cuatro catálogos, el restablecimiento del título al cambiar el tipo, los límites independientes de los tres títulos universitarios, la unicidad global de orientación secundaria, la repetición permitida de otros títulos, la edición de la propia entrada única y la conservación del payload REST. Se usará Chromium como proyecto mínimo para mantener rápida la validación del ticket.

La alternativa de probar contra el backend real fue descartada porque introduciría estado compartido, credenciales y variabilidad ajena a este cambio de frontend.

## Risks / Trade-offs

- [Los catálogos son locales y pueden quedar desactualizados] → Mantener la relación tipo-catálogo centralizada para que una actualización futura sea única.
- [Un valor histórico fuera del catálogo no podrá volver a guardarse desde el editor] → Exigir que toda creación o edición seleccione un valor vigente del catálogo correspondiente.
- [La regla existe solo en frontend] → Mantener validación defensiva en el schema del formulario; una regla autoritativa de dominio en backend queda fuera del alcance FE de LAB-12 y requeriría otro ticket.
- [Una prueba con API interceptada no detecta incompatibilidades de despliegue] → Afirmar solo la aceptación del frontend y mantener la revisión estática del mapper REST; la integración real queda cubierta por validaciones separadas del contrato.
