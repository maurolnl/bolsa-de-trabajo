# Laburi.to Frontend

## Stack y comandos

SPA con Vite, React 18 y TypeScript. Usa Yarn Classic, React Router, TanStack
React Query, Axios, React Hook Form, Zod, Tailwind, shadcn/ui y Radix.

```bash
yarn                 # instalar dependencias
yarn start           # servidor de desarrollo
yarn build           # tsc + build de Vite
yarn lint            # ESLint; cero warnings permitidos
yarn tsc --noEmit     # typecheck aislado
yarn eslint ruta.tsx # lint enfocado
```

No hay runner ni script de tests configurado. No afirmar que los tests pasaron ni
inventar un comando de test. Si se incorpora uno, agregar scripts y actualizar este
archivo.

## Estructura

- `src/features/`: páginas, formularios, hooks, modelos y repositorios por dominio.
- `src/components/ui/`: primitivas compartidas; reutilizarlas antes de crear otras.
- `src/api/`: clientes y selección de adaptadores.
- `src/core/`: HTTP, entorno, auth storage, i18n y utilidades transversales.
- `src/router/`: rutas y constantes de navegación.
- `src/lib/`: helpers pequeños y reutilizables.

Mantener la lógica dentro de su feature. Usar `@/` para imports entre áreas y rutas
relativas dentro del mismo subárbol. No mover lógica de features a `App.tsx`.

## Flujo de datos y contratos

- Componentes consumen hooks de React Query; no duplicar estado remoto con
  `useEffect` y `useState`.
- Las llamadas HTTP pertenecen a repositorios de cada feature. Mantener interfaz,
  implementación REST/Supabase, tipos y mappers alineados.
- Respetar el contrato real de cada endpoint: employee usa mayormente `snake_case`,
  login combina campos camelCase y `/auth/me` expone campos Go en mayúscula. Mapear
  explícitamente en el borde con tipos concretos y usar nombres idiomáticos en la UI.
- Tras una mutación exitosa, invalidar las query keys afectadas.
- Centralizar paths de pantalla en `src/router/paths.ts`.
- No crear otro cliente Axios: el código de features usa
  `src/core/services/httpClient.ts`.

Al cambiar una ruta o payload, verificar el handler y los modelos de
`../bolsa-de-trabajo-back/`; no inferir el contrato solo desde `docs/`.

## Autenticación

- `AuthProvider` es dueño del estado de sesión.
- Persistir el access token mediante `LocalStorage`/`LSKeys` y configurar la sesión
  mediante `setSession`; evitar llamadas directas dispersas a `window.localStorage`.
- Las rutas protegidas pasan por los guards existentes.
- No confiar en IDs del navegador para autorizar recursos; el BE valida identidad y
  propiedad.
- No registrar tokens ni credenciales.

## Formularios del empleado

El asistente sigue el orden documentado: experiencia, locación, recursos,
disponibilidad y educación. Cada paso puede crear o actualizar su sección según el
perfil recuperado.

- Usar React Hook Form y derivar tipos con `z.infer` cuando exista schema Zod.
- Mantener schemas junto al flujo en `forms/new-employee/`.
- Preservar los enums exactos enviados por la API.
- Los endpoints REST de experiencia y educación siempre exigen
  `multipart/form-data`, incluso sin PDFs; dejar que el navegador/Axios genere el
  boundary.
- Reutilizar `src/core/utils/forms/fileValidation.ts`, pero recordar que la validación
  del servidor sigue siendo autoritativa.
- Centralizar errores en el toast global de React Query y capturar localmente solo si
  existe recuperación. El backend normalmente devuelve `{ "error": "..." }`; todo
  manejo nuevo debe leer ese campo. Si se modifica el handler global, corregir su
  expectativa legacy de `messages` o estandarizar ambos lados en el mismo cambio.

## UI y estilo

- Reutilizar primitivas shadcn/Radix y `cn()` de `src/lib/utils.ts`.
- Usar tokens y variables existentes de Tailwind/`src/globals.css`; no introducir un
  segundo sistema de estilos.
- Componentes en PascalCase, hooks `useX`, variables en camelCase y archivos nuevos
  preferentemente kebab-case.
- TypeScript estricto: evitar `any`, non-null assertions y contratos duplicados.
- Seguir el formato local; para archivos nuevos, comillas dobles y punto y coma.
- Mantener textos y validaciones visibles coherentes con el español actual.

## Finalización

Ejecutar primero lint enfocado y typecheck; luego `yarn build` cuando el cambio lo
justifique. No empeorar warnings preexistentes, hacer refactors ajenos ni modificar
`.env`. No hacer commit, push o deploy sin solicitud explícita.

## OpenSpec

Este repositorio tiene una raíz OpenSpec propia en `openspec/`, configurada con el
schema `spec-driven`. Los artefactos se escriben en español, conservando headings
estructurales y palabras normativas SHALL/MUST en inglés.

Para tickets iniciados mediante `/start-ticket`, crear aquí la rama indicada por
`gitBranchName` de Linear cuando el frontend esté afectado. Ejecutar
`/opsx-propose` desde esta carpeta y detenerse para revisión antes de editar código.
Tras aprobación explícita, commitear primero los artefactos del spec y después
ejecutar `/opsx-apply`. Al finalizar, validar la implementación y comprobar todos los
criterios de aceptación. Después, archivar y validar el cambio OpenSpec antes de
pushear o abrir un PR contra la rama base real (`main` o `master`); incluir el archivo
OpenSpec resultante en los commits de la rama.
