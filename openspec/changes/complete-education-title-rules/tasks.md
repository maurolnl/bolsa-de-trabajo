## 1. Catálogos y reglas

- [ ] 1.1 Relacionar cada tipo educativo con sus opciones existentes y definir helpers tipados para detectar títulos universitarios únicos y orientación ya utilizada; verificar que `yarn tsc --noEmit` acepte los tipos sin casts inseguros.
- [ ] 1.2 Extender la validación de educación para rechazar títulos fuera del catálogo, duplicados de `Abogacia`, `Contabilidad` o `Administracion`, y más de una orientación secundaria; verificar mediante los errores de React Hook Form que cada colección inválida impida guardar.

## 2. Flujo de selección

- [ ] 2.1 Reemplazar el input libre por un selector cuyo catálogo cambie con el tipo y restablezca el título cuando el usuario cambie de tipo; verificar manualmente los cuatro catálogos y que no persista un título incompatible.
- [ ] 2.2 Pasar al editor el contexto de las demás tarjetas y filtrar títulos únicos ya usados y el tipo `high-school-orientation`, excluyendo la tarjeta editada del conteo; verificar creación y edición para cada límite.
- [ ] 2.3 Mantener disponibles múltiples entradas para los títulos sin restricción y conservar sin cambios el payload REST educativo; verificar dos entradas repetidas permitidas y revisar que el mapper no requiera modificaciones.

## 3. Validación final

- [ ] 3.1 Instalar y configurar `@playwright/test` con Chromium, `baseURL` y `webServer` de Vite; agregar el script E2E, ignorar reportes generados y actualizar `AGENTS.md` con el nuevo runner, verificando que Playwright liste la prueba configurada.
- [ ] 3.2 Crear una suite E2E que autentique mediante localStorage, intercepte la API y verifique los cuatro catálogos, el reinicio al cambiar tipo, los límites independientes de `Abogacia`, `Contabilidad` y `Administracion`, la orientación opcional y única, la edición de entradas únicas, la repetición permitida y el multipart final; verificar que la suite falle al retirar cualquiera de esas reglas.
- [ ] 3.3 Ejecutar ESLint enfocado sobre los archivos modificados, `yarn tsc --noEmit` y la suite E2E de Playwright en Chromium, corrigiendo todos los errores y warnings introducidos.
- [ ] 3.4 Ejecutar `yarn build` y confirmar que todos los escenarios de aceptación quedan cubiertos y aprobados por la prueba E2E.
