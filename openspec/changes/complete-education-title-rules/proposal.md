## Why

El formulario de educación ya unifica las formaciones, pero todavía permite escribir títulos libres y agregar combinaciones que contradicen las reglas del producto. Completar LAB-12 hará que las opciones dependan del tipo de educación y evitará duplicados en las formaciones definidas como únicas.

## What Changes

- Reemplazar el campo libre de título por las opciones existentes correspondientes al tipo seleccionado: universitario, posgrado, orientación secundaria o terciario.
- Permitir como máximo una entrada para cada título universitario único: `Abogacia`, `Contabilidad` y `Administracion`.
- Permitir como máximo una formación de tipo `high-school-orientation`, sin importar la orientación elegida.
- Mantener múltiples entradas para los demás títulos universitarios, posgrados y terciarios.
- Excluir de las opciones nuevas aquellas que ya alcanzaron su límite y validar también el conjunto antes de guardarlo.
- Conservar el contrato REST actual: los valores de `title` siguen siendo strings del catálogo y el tipo de orientación continúa siendo `high-school-orientation`.
- Incorporar Playwright y una prueba end-to-end que cubra los criterios de aceptación del flujo educativo con respuestas de API controladas.

## Capabilities

### New Capabilities

- `employee-education-title-selection`: Selección de títulos educativos por tipo y aplicación de límites de unicidad durante la edición del perfil de empleado.

### Modified Capabilities

Ninguna.

## Impact

- Frontend: formulario, catálogos y validación Zod del paso de educación del empleado.
- API y backend: sin cambios de ruta, payload, persistencia ni enum.
- Pruebas: nueva configuración y suite E2E de Playwright, scripts de ejecución y exclusión de artefactos generados.
- Dependencias externas: `@playwright/test` como dependencia de desarrollo y navegador Chromium para ejecutar la suite.
