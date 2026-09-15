## Context

El contrato de rol ya existe en `features/auth`: registro acepta `UserRole`, las respuestas de login y `/auth/me` se validan en el borde y `AuthProvider` conserva el rol confirmado por el servidor. Sin embargo, la ruta de registro está comentada, el login siempre usa una ubicación genérica y `RequireAuth` solo verifica autenticación. `/main/home` monta directamente el asistente de empleado.

La existencia del perfil debe consultarse con contratos asimétricos: empleado comunica ausencia mediante su error contractual actual con estado 400, mientras empleador usa 404. LAB-22 implementará el formulario de empleador; este cambio debe dejar una ruta estable donde integrarlo sin asumir su UI.

## Goals / Non-Goals

**Goals:**

- Mantener una única fuente de verdad para el rol: el usuario de `AuthProvider`, reconstruido mediante `/auth/me`.
- Separar la resolución del destino, la consulta de perfil y la autorización de rutas para que los estados sean deterministas y comprobables.
- Establecer rutas explícitas para onboarding y destinos autenticados de ambos roles.
- Dejar el punto de integración de empleador listo para LAB-22 sin acoplar navegación a su formulario.

**Non-Goals:**

- Implementar, editar o enviar el formulario del perfil de empleador.
- Implementar puestos de trabajo, recomendaciones o dashboards finales.
- Cambiar contratos HTTP, persistencia o autorización de backend.
- Persistir el rol fuera del estado autenticado existente.

## Decisions

### 1. Resolver la navegación desde `/main`

La ruta neutral `/main` esperará `isInitialized`, leerá `user.role` y consultará solo el perfil correspondiente. Con el resultado aplicará esta matriz:

| Rol | Perfil | Destino |
| --- | --- | --- |
| `employee` | ausente | `/main/employee/profile` |
| `employee` | existente | `/main/employee/home` |
| `employer` | ausente | `/main/employer/profile` |
| `employer` | existente | `/main/employer/jobs` |

Login, `RequireNotLogged`, el wildcard global y los defaults enviarán a `/main` en vez de duplicar decisiones. `/main/home` se conservará como alias que reemplaza la ubicación por `/main`; las ubicaciones protegidas guardadas pasarán después por `RequireAuth` y el guard de rol antes de renderizarse.

Alternativa descartada: decidir en `LoginPage` con el rol de la respuesta de login. Aunque parece más directo, omite sesiones restauradas y contradice el criterio de usar `/auth/me`.

### 2. Modelar la existencia del perfil como estado remoto tipado

Se incorporará una consulta enfocada que seleccione el endpoint según `UserRole` y produzca `loading`, `exists`, `missing` o `error`. El contrato actual de employee colapsa en `400 "employee not found"` todos los fallos comunicados por ese handler, por lo que el frontend MUST tratar esa respuesta completa como `missing`; employer usa un `404` inequívoco. En ambos endpoints, 401, 403, 5xx y fallos de red permanecerán como errores recuperables. Esta limitación se documenta en vez de introducir un cambio backend fuera de LAB-21.

La consulta reutilizará `httpClient` y React Query. Para employee se preservará el repositorio actual; para employer se añadirá únicamente la lectura mínima que LAB-22 podrá ampliar, evitando implementar anticipadamente la mutación.

Alternativa descartada: considerar cualquier error como perfil ausente, patrón implícito del wizard actual. Eso convertiría fallos temporales o de autorización en redirects incorrectos y podría producir ciclos.

### 3. Proteger rutas con un guard declarativo de rol

El guard recibirá los roles permitidos y esperará a `AuthProvider` antes de evaluar. Un rol no permitido volverá al resolver neutral con `replace`; así la misma lógica determina su destino válido. El onboarding de empleado admitirá solo `employee` y el punto de integración de empleador solo `employer`.

Alternativa descartada: reutilizar `UserRoles`, `PATHS_PER_ROLE` e `isPathAuthorized`. Esos elementos pertenecen a un dominio legacy (`admin`, `customer`) y mezclarlos con `UserRole` debilitaría los tipos.

### 4. Crear destinos temporales explícitos para funcionalidades posteriores

Las rutas canónicas de la matriz distinguirán el onboarding del destino de una cuenta con perfil. El asistente existente se moverá a `/main/employee/profile`. Donde LAB-22 o las épicas de puestos todavía no aportan una pantalla funcional, se mostrará un estado mínimo y estable, sin formulario ni acciones de dominio. Esto permite comprobar la navegación ahora y reemplazar el contenido sin cambiar el contrato de rutas.

Alternativa descartada: dejar rutas sin elemento y depender del wildcard. Ese fallback devolvería al resolver y puede formar un ciclo imposible de distinguir de un error de carga.

### 5. Construir el registro con los patrones existentes

El formulario usará un schema Zod como fuente del tipo de React Hook Form, reutilizará primitivas UI y `useRegisterMutation`, y enviará `employee` o `employer` literalmente. Tras éxito navegará al login; un fallo conservará los datos y seguirá el manejo de errores de mutaciones existente. El selector existe solo en alta.

## Risks / Trade-offs

- [Los destinos temporales no ofrecen todavía funcionalidad completa al empleador] → Etiquetarlos como estados de continuidad e integrar LAB-22 sobre la ruta acordada sin modificar el guard.
- [El handler employee no permite distinguir ausencia de otros fallos que también expone como `400 "employee not found"`] → Aceptar esa respuesta completa como ausencia en LAB-21, mantener el resto de estados como error y dejar la corrección del contrato backend fuera de alcance.
- [Consultas repetidas al pasar por el resolver] → Compartir query keys y configuración de React Query para reutilizar caché y evitar requests innecesarios.
- [Una ubicación protegida guardada puede pertenecer al rol opuesto] → Validarla mediante el guard después de restaurar la sesión y usar el resolver como fallback seguro.
- [Los tipos de rol legacy inducen imports incorrectos] → Basar rutas nuevas exclusivamente en `features/auth/types.ts` y retirar del área modificada la configuración legacy no utilizada.

## Migration Plan

1. Introducir rutas canónicas y resolver neutral manteniendo `/main/home` como entrada compatible hacia el resolver.
2. Habilitar `/auth/register` y enlazarla desde login.
3. Aplicar guards a los destinos de perfil y verificar navegación con respuestas HTTP simuladas.
4. LAB-22 reemplazará el estado temporal del onboarding de empleador por su formulario sin cambiar la ruta ni la decisión de acceso.

El rollback puede retirar las rutas y guards nuevos y devolver `/main/home` al asistente de empleado; no existe migración de datos ni cambio de API.
