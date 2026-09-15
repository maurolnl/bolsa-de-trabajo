## Why

La ruta de onboarding del empleador ya distingue cuentas con y sin perfil, pero todavía muestra un estado temporal y no permite completar el alta. LAB-22 debe conectar esa ruta con el contrato de empleadores existente para habilitar el primer acceso del rol `employer` sin duplicar perfiles.

## What Changes

- Reemplazar el estado temporal de `/main/employer/profile` por un formulario único con nombre, industria, ubicación y modalidades de contratación libres.
- Validar los campos requeridos con Zod y representar las modalidades como una lista `string[]` editable.
- Tipar el dominio y el repositorio de empleadores, consumir `POST /employers` mediante React Query y reutilizar la consulta existente `GET /users/{userID}/employer`.
- Compartir las query keys del perfil, invalidarlas después del alta y redirigir a `/main/employer/jobs` solo tras una creación exitosa.
- Impedir que una cuenta sin rol `employer` o un empleador que ya posee perfil utilice el formulario.
- Cubrir validación, envío, errores, prevención de duplicados y redirección con pruebas HTTP simuladas.

## Capabilities

### New Capabilities

- `employer-profile-creation`: Formulario, validación, contrato HTTP y estados para crear el perfil propio del empleador.

### Modified Capabilities

- `role-profile-navigation`: Convertir la ruta temporal del empleador en onboarding funcional, restringirla a empleadores sin perfil y resolver el destino después del alta.

## Impact

- Frontend: feature `employers`, query keys de existencia de perfil, formulario/página de onboarding, router y pruebas Playwright.
- API consumida sin cambios: `POST /employers` y `GET /users/{userID}/employer` autenticados.
- Sin cambios de backend, base de datos, documentación raíz ni dependencias externas.
- `/main/employer/jobs` continúa como destino temporal; la gestión de puestos permanece fuera de alcance.
