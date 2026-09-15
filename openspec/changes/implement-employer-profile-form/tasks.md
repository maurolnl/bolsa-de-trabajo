## 1. Contrato y estado remoto de empleadores

- [ ] 1.1 Definir los tipos de dominio, creación y DTO REST de empleador, junto con el mapper explícito de campos `snake_case`; verificar con `yarn tsc --noEmit` que lectura y escritura quedan tipadas sin `unknown`.
- [ ] 1.2 Ampliar la interfaz e implementación REST del repositorio para consultar el perfil tipado y enviar `POST /employers` con `hiring_modalities` y sin identificador de usuario; verificar el payload mediante una prueba Playwright interceptada.
- [ ] 1.3 Crear query keys compartidas y la mutación de alta que invalida la consulta del perfil propio; actualizar `useProfileExistence` para reutilizar la misma key y verificar con typecheck que no quedan contratos duplicados.

## 2. Formulario y navegación

- [ ] 2.1 Crear el schema Zod y formulario React Hook Form con nombre, industria, ubicación y modalidades libres repetibles; verificar que campos obligatorios y modalidades vacías no se envían, que una lista vacía es válida y que el botón queda deshabilitado durante la mutación.
- [ ] 2.2 Crear la página de onboarding que muestra loading/error recuperable mientras consulta el perfil, renderiza el formulario solo para estado `missing` y reemplaza la ruta por `/main/employer/jobs` cuando el perfil existe; verificar los tres estados con pruebas HTTP simuladas.
- [ ] 2.3 Reemplazar el estado temporal de `/main/employer/profile` por la nueva página sin alterar el guard `employer` ni el destino temporal de puestos; verificar acceso directo para ambos roles y para empleador con perfil.
- [ ] 2.4 Conectar el éxito de `POST /employers` con la invalidación esperada y navegación a `/main/employer/jobs`, conservando datos y ubicación ante errores; verificar respuestas `201`, error HTTP y doble envío en Playwright.

## 3. Pruebas y validación

- [ ] 3.1 Añadir una spec E2E autocontenida para validación, serialización de `string[]`, carga, error, perfil preexistente y redirección exitosa; verificar que la spec enfocada pasa en Chromium sin API externa.
- [ ] 3.2 Ejecutar ESLint enfocado sobre todos los archivos TypeScript/TSX modificados y corregir errores o warnings.
- [ ] 3.3 Ejecutar `yarn tsc --noEmit`, la suite E2E relevante y `yarn build`; contrastar sus resultados con cada criterio de aceptación de LAB-22.
