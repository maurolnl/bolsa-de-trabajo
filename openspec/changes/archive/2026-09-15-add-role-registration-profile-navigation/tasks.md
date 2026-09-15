## 1. Registro con rol

- [x] 1.1 Crear el schema Zod y el formulario React Hook Form de registro con email, contraseña y selector obligatorio `employee | employer`; verificar que los errores impiden el envío y que el tipo se deriva del schema.
- [x] 1.2 Crear la página de registro, conectarla con `useRegisterMutation` y navegar al login solo tras éxito; verificar con lint enfocado que no se introducen errores ni warnings.
- [x] 1.3 Habilitar `/auth/register`, enlazarla desde login y esperar `isInitialized` en `RequireNotLogged`; verificar manualmente que restaurar una sesión no produce flashes ni redirects repetidos.

## 2. Estado de perfil y destinos

- [x] 2.1 Implementar la consulta tipada de existencia del perfil según `UserRole`, reutilizando el repositorio employee y añadiendo la lectura mínima de employer; verificar que `400 "employee not found"` para employee y `404` para employer se clasifican como ausencia, mientras 401, 403, 5xx y red quedan como error.
- [x] 2.2 Definir `/main` como resolver neutral y las rutas canónicas `/main/employee/profile`, `/main/employee/home`, `/main/employer/profile` y `/main/employer/jobs`, sin reutilizar tipos legacy; verificar mediante typecheck la matriz completa rol/perfil.
- [x] 2.3 Implementar el resolver autenticado con estados loading, exists, missing y error recuperable; verificar que cada combinación rol/perfil produce un único destino y que reintentar un error no navega provisionalmente.
- [x] 2.4 Añadir estados de continuidad mínimos para onboarding de employer y destinos aún no implementados, documentando los puntos de integración de LAB-22; verificar que ninguna pantalla temporal permite crear o editar un perfil.

## 3. Autorización de rutas

- [x] 3.1 Implementar un guard declarativo basado en el rol confirmado por `/auth/me` y aplicarlo a las rutas de employee y employer; verificar que el rol opuesto vuelve al resolver usando navegación `replace`.
- [x] 3.2 Cambiar login, `RequireNotLogged`, wildcards y defaults para usar `/main`, convertir `/main/home` en alias hacia el resolver e integrar la ubicación protegida guardada con los guards; verificar que una ubicación del rol opuesto nunca evita la autorización ni causa un ciclo.

## 4. Pruebas y validación

- [x] 4.1 Añadir pruebas Playwright del registro para ambos roles, validación sin rol y navegación al login, interceptando la API sin depender de datos compartidos; verificar que la spec enfocada pasa en Chromium.
- [x] 4.2 Añadir pruebas Playwright de sesión restaurada, cuatro combinaciones rol/existencia, bloqueo cruzado, carga y error recuperable; verificar que las rutas HTTP simuladas distinguen las ausencias contractuales de otros errores.
- [x] 4.3 Ejecutar ESLint enfocado sobre archivos modificados y corregir todos los hallazgos; verificar salida sin warnings.
- [x] 4.4 Ejecutar `yarn tsc --noEmit`, `yarn test:e2e` y `yarn build`; verificar que todos finalizan correctamente y contrastar cada criterio de aceptación de LAB-21 con evidencia de la suite.
