# Laburi.to Frontend

Espejo de `AGENTS.md` (mismo contenido). Mantener ambos alineados cuando se cambie una
regla.

## Stack y comandos

SPA con Vite 6, React 18 y TypeScript. Yarn Classic, React Router 6, TanStack React
Query 5, Axios, React Hook Form + Zod, Tailwind, shadcn/ui + Radix, i18next, Playwright.

```bash
yarn                  # instalar dependencias
yarn start            # dev server (Vite, puerto 5173)
yarn build            # tsc && vite build
yarn lint             # ESLint; --max-warnings 0
yarn tsc --noEmit     # typecheck aislado
yarn eslint ruta.tsx  # lint enfocado
yarn test:e2e         # Playwright en Chromium
```

Las E2E viven en `e2e/`, mockean las respuestas HTTP y no deben depender de APIs ni
datos compartidos. Hoy cubren: reglas de título de educación, formulario de perfil de
empleador, navegación por rol y registro con rol.

## Estructura

- `src/features/<dominio>/`: `pages/`, `forms/`, `hooks/`, `models/`, `repo/`.
  Dominios actuales: `auth`, `employees`, `employers`, `layout`, `app`.
- `src/components/ui/`: primitivas shadcn compartidas; reutilizarlas antes de crear otras.
- `src/api/index.ts`: punto de selección de adaptadores — exporta la implementación
  concreta de `employeeRepository` y `employerRepository`.
- `src/core/`: `services/httpClient.ts`, `environment/`, `i18n/`, `cookies/`, `theme/`,
  `hooks/`, `utils/`.
- `src/router/`: `index.tsx` (rutas y guards) y `paths.ts` (constantes).
- `src/models/User.ts`: tipos de usuario y `UserRoles`, compartidos entre features.
- `src/hooks/`, `src/lib/utils.ts`: helpers transversales pequeños.

Mantener la lógica dentro de su feature. `@/` para imports entre áreas, rutas relativas
dentro del mismo subárbol. No mover lógica de features a `App.tsx`.

Deuda conocida — no arreglar de oficio, pero no ampliar:

- `src/api/clients/http-client.ts` duplica `src/core/services/httpClient.ts` y no lo
  importa nadie. Usar siempre `@/core/services/httpClient`.
- `src/features/employees/repo/supabase/` es un adaptador legado; el activo es `rest/`.
- `PATHS_PER_ROLE` en `src/router/paths.ts` está declarado vacío.
- `App.tsx` crea el `QueryClient` dentro del render.

## Flujo de datos y contratos

- Componentes consumen hooks de React Query; no duplicar estado remoto con `useEffect`
  + `useState`.
- Las llamadas HTTP pertenecen al repositorio de cada feature. Mantener alineados
  interfaz, implementación REST, tipos y mappers.
- Respetar el contrato real de cada endpoint; no es uniforme:
  - employee usa mayormente `snake_case`;
  - `POST /auth/login` responde camelCase (`token`, `refreshToken`, `role`);
  - `GET /auth/me` serializa el struct Go sin tags → **claves capitalizadas**
    (`ID`, `Email`, `Role`).
  Mapear explícitamente en el borde, con tipos concretos, y usar nombres idiomáticos
  en la UI.
- Tras una mutación exitosa, invalidar las query keys afectadas.
- Centralizar paths de pantalla en `src/router/paths.ts`.
- No crear otro cliente Axios: usar `src/core/services/httpClient.ts`.

Al cambiar una ruta o payload, verificar el handler y los modelos de
`../bolsa-de-trabajo-back/`; no inferir el contrato solo desde `docs/`.

## Autenticación y roles

- `AuthProvider` (`src/features/auth/context/auth-context.tsx`) es dueño del estado de
  sesión.
- Persistir el access token con `LocalStorage`/`LSKeys` y configurar la sesión con
  `setSession`; evitar `window.localStorage` disperso.
- El rol (`employee` | `employer`) viaja en el JWT, es inmutable y define qué perfil
  puede crearse. El backend responde `403` si no coincide; la UI no debe ofrecer el
  flujo del otro rol.
- Las rutas protegidas pasan por los guards existentes en `src/router/index.tsx`.
- No confiar en IDs del navegador para autorizar recursos; el BE valida identidad y
  propiedad.
- No registrar tokens ni credenciales.

## Formularios

El asistente de empleado sigue el orden documentado: experiencia, locación, recursos,
disponibilidad y educación. Cada paso puede crear o actualizar su sección según el
perfil recuperado. El perfil de empleador es un formulario único en
`features/employers/forms/employer-profile/`.

- React Hook Form; derivar tipos con `z.infer` cuando exista schema Zod.
- Mantener schemas junto al flujo (`forms/new-employee/`, `forms/employer-profile/`).
- Preservar los enums exactos enviados por la API.
- Los endpoints REST de experiencia y educación siempre exigen `multipart/form-data`,
  incluso sin PDFs; dejar que el navegador/Axios genere el boundary.
- Reutilizar `src/core/utils/forms/fileValidation.ts`; la validación del servidor sigue
  siendo autoritativa.
- Errores: centralizados en el toast global de React Query
  (`MutationCache.onError` en `App.tsx`), que lee `{error}` y cae a `{messages}`.
  Capturar localmente solo si hay recuperación real. Ojo: los errores de validación del
  backend llegan como **texto plano**, no JSON, y caen al mensaje genérico; si una
  pantalla necesita mostrarlos, es un cambio de contrato a coordinar con el BE.

## UI y estilo

- Reutilizar primitivas shadcn/Radix y `cn()` de `src/lib/utils.ts`.
- Usar tokens y variables existentes de Tailwind/`src/globals.css`; no introducir un
  segundo sistema de estilos.
- Componentes en PascalCase, hooks `useX`, variables en camelCase, archivos nuevos
  preferentemente kebab-case.
- TypeScript estricto: evitar `any`, non-null assertions y contratos duplicados.
- Seguir el formato local; en archivos nuevos, comillas dobles y punto y coma.
- Mantener textos y validaciones visibles coherentes con el español actual.

## Finalización

Primero lint enfocado y typecheck; luego `yarn build` cuando el cambio lo justifique, y
`yarn test:e2e` si tocaste un flujo cubierto. No empeorar warnings preexistentes, no
hacer refactors ajenos, no modificar `.env`. No hacer commit, push ni deploy sin pedido
explícito.

## OpenSpec

Raíz OpenSpec propia en `openspec/`, schema `spec-driven`. Artefactos en español,
headings estructurales y SHALL/MUST en inglés.

Los comandos `/opsx-*` viven en `.opencode/commands/` y **no están disponibles como
slash commands en Claude Code**: usar el CLI `openspec` desde esta carpeta o pedir al
usuario que los corra en opencode.

Flujo: crear aquí la rama con el `gitBranchName` de Linear cuando el frontend esté
afectado, generar la propuesta y detenerse para revisión antes de editar código. Tras
aprobación explícita, commitear primero los artefactos del spec y después implementar.
Al finalizar, validar la implementación contra todos los criterios de aceptación,
archivar y validar el cambio OpenSpec, y recién entonces pushear o abrir PR contra la
rama base real (`main` o `master`), incluyendo el archivo OpenSpec en los commits.
