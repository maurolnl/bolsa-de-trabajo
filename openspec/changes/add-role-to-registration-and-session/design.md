## Context

El repositorio de autenticación modela registro y login con el mismo tipo de credenciales, `/auth/me` mapea únicamente `ID` y `Email`, y el usuario mantenido por `AuthProvider` no contiene rol. Existe además un tipo `Role` legacy con valores ajenos al dominio de Laburi.to. La ruta de registro está comentada y LAB-21 agregará el selector y los guards de interfaz.

## Goals / Non-Goals

**Goals:**
- Representar el nuevo contrato backend sin duplicar tipos incompatibles.
- Conservar el rol al iniciar o restaurar una sesión.
- Mantener explícito el mapeo desde el casing real de `/auth/me`.

**Non-Goals:**
- Crear o habilitar una pantalla de registro.
- Elegir automáticamente un rol por defecto.
- Autorizar rutas o renderizar experiencias distintas según rol.
- Interpretar localmente el JWT como fuente de autorización.

## Decisions

### Separar credenciales de login y registro

Login seguirá recibiendo email y contraseña; registro usará un tipo propio que agrega `role`. Esto evita volver opcional el rol o contaminar el payload de login. Se descarta extender el tipo compartido actual con un campo opcional porque permitiría seguir compilando altas sin rol.

### Definir un rol de cuenta separado

El flujo de autenticación usará `UserRole`, una unión `employee | employer`. Las respuestas de login, usuario actual y estado de sesión referenciarán ese tipo. Los tipos legacy de autorización de rutas quedan sin reutilizar ni ampliar hasta LAB-21, y el campo profesional `role` del perfil employee mantiene otro significado. No se introduce un enum runtime ni una dependencia nueva para dos valores estables.

### Mapear el contrato real en el borde HTTP

El mapper de `/auth/me` leerá `Role` junto con `ID` y `Email` y expondrá propiedades camelCase. Login conservará el formato camelCase de la API y agregará `role`. Ambos bordes validarán en runtime que el rol sea `employee` o `employer`; una respuesta inválida fallará y `AuthProvider` no establecerá o limpiará la sesión. `AuthProvider` tomará el rol del usuario actual devuelto por el servidor; no decodificará el JWT ni confiará en datos elegidos por el navegador.

Los DTO coordinados serán `POST /auth/register` con `{"email":"user@example.com","password":"secret123","role":"employee"}`, login con `{"id":1,"email":"user@example.com","role":"employee","token":"...","refreshToken":"..."}` y `/auth/me` con `{"ID":1,"Email":"user@example.com","Role":"employee"}`.

### Limitar la validación al alcance disponible

Como no existe una pantalla de registro activa ni una suite unitaria de auth, este cambio verificará tipos, lint y build sin agregar infraestructura de tests ni UI fuera de alcance. Los casos de requests inválidos y autorización se cubrirán de forma autoritativa en backend; el frontend sí validará las respuestas de sesión en runtime.

## Risks / Trade-offs

- [Los tipos legacy pueden confundirse con el rol de cuenta] → Usar un nombre explícito y no modificar los guards hasta LAB-21.
- [La API devuelve un casing diferente entre login y `/auth/me`] → Mantener DTOs separados y mapeo explícito en lugar de normalizar por suposición.
- [No hay formulario activo para demostrar el payload] → Dejar el repositorio y hook tipados para que LAB-21 construya el selector sin redefinir el contrato.

## Entregable de documentación externo

El repositorio separado `docs/` no tiene raíz OpenSpec. Durante el apply aprobado se actualizará `docs/use-cases.md` en la rama `mauroleoquiroga/lab-19-be-incorporar-el-rol-inmutable-al-registro-y-la-sesion` para reflejar el payload de registro, el rol de sesión y Argon2id. Este entregable deberá quedar validado y commiteado en su propio repositorio antes de cerrar LAB-19.
