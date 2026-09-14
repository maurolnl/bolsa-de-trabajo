## 1. Contratos de autenticación

- [ ] 1.1 Crear `UserRole` como tipo de cuenta `employee | employer` y mantener separados los tipos legacy de rutas y el `role` profesional de employee; verificar con búsqueda de referencias y typecheck que no se mezclen los conceptos.
- [ ] 1.2 Separar los tipos de credenciales de login y registro, exigir `role` solamente en registro y actualizar repositorio/hook; verificar que TypeScript rechace altas sin rol y que login conserve su payload actual.
- [ ] 1.3 Incorporar `role` a las respuestas tipadas de login y usuario actual, validar sus valores en runtime y mapear `Role` de `/auth/me` a `role`; verificar ambos DTO contra el contrato backend acordado.

## 2. Estado de sesión

- [ ] 2.1 Agregar el rol al usuario autenticado y propagarlo desde `getCurrentUser` al estado de `AuthProvider`; verificar que login y restauración desde token conserven el valor devuelto por la API.
- [ ] 2.2 Ajustar inicialización y logout para no conservar roles de sesiones anteriores; verificar por inspección tipada que el estado no autenticado vuelva a su valor inicial completo.

## 3. Documentación y validación

- [ ] 3.1 En el repositorio `docs/` y su rama LAB-19, actualizar `use-cases.md` para documentar el rol obligatorio del registro, su presencia en login y `/auth/me` y Argon2id en lugar de bcrypt; verificar el diff contra los DTO definitivos del backend y ejecutar `git diff --check` antes del commit separado.
- [ ] 3.2 Ejecutar ESLint enfocado sobre los archivos modificados, `yarn tsc --noEmit`, `yarn build` y `openspec validate add-role-to-registration-and-session --strict`; documentar cualquier fallo preexistente separado del cambio.
- [ ] 3.3 Comprobar los criterios frontend de LAB-19 y confirmar que no se agregaron selector, pantalla de registro ni guards correspondientes a LAB-21.
