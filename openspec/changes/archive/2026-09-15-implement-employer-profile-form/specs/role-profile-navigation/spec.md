## ADDED Requirements

### Requirement: Onboarding de empleador condicionado a perfil ausente
El frontend MUST reservar `/main/employer/profile` para una sesión autenticada con rol `employer` cuyo perfil propio no exista, y SHALL resolver el destino posterior al alta con el mismo estado remoto utilizado por la navegación principal.

#### Scenario: Empleador sin perfil abre el onboarding
- **WHEN** una sesión `employer` solicita `/main/employer/profile` y la consulta informa que su perfil no existe
- **THEN** el frontend muestra el formulario de creación del perfil

#### Scenario: Empleador con perfil abre el onboarding
- **WHEN** una sesión `employer` solicita directamente `/main/employer/profile` y la consulta devuelve su perfil
- **THEN** el frontend reemplaza la ubicación por `/main/employer/jobs` sin mostrar el formulario

#### Scenario: Alta completada
- **WHEN** la creación del perfil finaliza correctamente
- **THEN** el frontend invalida el estado remoto correspondiente y navega a `/main/employer/jobs`
