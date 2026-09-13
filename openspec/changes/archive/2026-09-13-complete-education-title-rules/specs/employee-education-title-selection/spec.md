## Purpose

Define cómo el empleado selecciona títulos educativos válidos por tipo y cómo el formulario aplica las reglas de unicidad antes de guardar su educación.

## ADDED Requirements

### Requirement: Opciones de título dependientes del tipo
El formulario SHALL presentar el título como una selección y SHALL mostrar únicamente los valores del catálogo asociado al tipo de educación elegido.

#### Scenario: Selección de tipo universitario
- **WHEN** el empleado selecciona el tipo `university`
- **THEN** el formulario muestra las opciones del catálogo de títulos universitarios

#### Scenario: Selección de tipo posgrado
- **WHEN** el empleado selecciona el tipo `postgraduate`
- **THEN** el formulario muestra las opciones del catálogo de posgrados

#### Scenario: Selección de orientación secundaria
- **WHEN** el empleado selecciona el tipo `high-school-orientation`
- **THEN** el formulario muestra las opciones del catálogo de orientaciones secundarias

#### Scenario: Selección de tipo terciario
- **WHEN** el empleado selecciona el tipo `tertiary`
- **THEN** el formulario muestra las opciones del catálogo de estudios terciarios

#### Scenario: Cambio de tipo con título seleccionado
- **WHEN** el empleado cambia el tipo después de seleccionar un título
- **THEN** el formulario descarta el título anterior y exige elegir una opción válida para el nuevo tipo

### Requirement: Títulos universitarios únicos
El formulario MUST admitir como máximo una entrada con título `Abogacia`, una con título `Contabilidad` y una con título `Administracion` dentro de la educación del empleado. Estas restricciones son independientes, por lo que el empleado puede tener una entrada de cada título único.

#### Scenario: Opción única ya utilizada al crear
- **WHEN** el empleado abre una formación nueva y ya existe una entrada para uno de los títulos universitarios únicos
- **THEN** ese título no está disponible entre las opciones seleccionables

#### Scenario: Edición de un título único
- **WHEN** el empleado edita la entrada que contiene un título universitario único
- **THEN** puede conservar ese título porque la entrada actual no cuenta como un duplicado de sí misma

#### Scenario: Validación defensiva de duplicados únicos
- **WHEN** el conjunto de educación contiene más de una entrada con el mismo título universitario único
- **THEN** el formulario impide guardar la educación e informa la restricción

#### Scenario: Repetición de otros títulos
- **WHEN** el empleado agrega varias entradas de un título distinto de `Abogacia`, `Contabilidad` y `Administracion`
- **THEN** el formulario permite conservar todas las entradas si las demás validaciones se cumplen

### Requirement: Orientación secundaria única
El formulario MUST admitir como máximo una entrada de tipo `high-school-orientation`, independientemente del valor de orientación seleccionado.

#### Scenario: Orientación ya existente al crear
- **WHEN** el empleado abre una formación nueva y ya existe una entrada de tipo `high-school-orientation`
- **THEN** el tipo de orientación secundaria no está disponible para la nueva entrada

#### Scenario: Edición de la orientación existente
- **WHEN** el empleado edita la única entrada de tipo `high-school-orientation`
- **THEN** puede conservar el tipo y cambiar su orientación, estado o documento

#### Scenario: Validación defensiva de múltiples orientaciones
- **WHEN** el conjunto de educación contiene más de una entrada de tipo `high-school-orientation`
- **THEN** el formulario impide guardar la educación e informa la restricción

### Requirement: Compatibilidad del payload educativo
El formulario SHALL conservar los strings actuales de `title`, `status`, `type` y `document` al construir el payload educativo, incluido el valor `high-school-orientation` para orientación secundaria.

#### Scenario: Envío de educación válida
- **WHEN** el empleado guarda un conjunto de educación válido
- **THEN** el frontend envía el payload mediante el contrato REST existente sin introducir campos ni enums nuevos
