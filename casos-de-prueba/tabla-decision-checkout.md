# Tabla de Decisión - Checkout

## Objetivo

Definir las condiciones y reglas que determinan el comportamiento esperado
del proceso de checkout en Sauce Demo.

La tabla considera diferentes combinaciones relacionadas con la autenticación
del usuario, el contenido del carrito, la información del formulario de
checkout y la finalización de la compra.

---

## Condiciones

| ID | Condición |
|---|---|
| C1 | El usuario está autenticado |
| C2 | El carrito contiene uno o más productos |
| C3 | El formulario de checkout está completo |
| C4 | El usuario hace clic en el botón `Finish` |

---

## Acciones

| ID | Acción |
|---|---|
| A1 | Permitir el acceso al proceso de checkout |
| A2 | Mostrar el formulario de información del cliente |
| A3 | Mostrar mensaje de validación por información incompleta |
| A4 | Mostrar la confirmación de la compra |
| A5 | Mantener al usuario en el proceso de checkout |

---

## Tabla de decisión

| Condición / Acción | R1 | R2 | R3 | R4 | R5 | R6 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **C1 - Usuario autenticado** | Sí | Sí | Sí | Sí | No | Sí |
| **C2 - Hay productos en carrito** | Sí | No | Sí | Sí | Sí | No |
| **C3 - Formulario completo** | No | No | Sí | Sí | No | Sí |
| **C4 - Clic en Finish** | No | No | No | Sí | No | No |
| **A1 - Permitir acceso al checkout** | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| **A2 - Mostrar formulario de checkout** | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ |
| **A3 - Mostrar validación por información incompleta** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **A4 - Mostrar confirmación de compra** | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| **A5 - Mantener al usuario en checkout** | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |

---

## Descripción de las reglas

### Regla 1 - Usuario autenticado con productos en el carrito

El usuario ha iniciado sesión y tiene productos en el carrito. Puede acceder
al proceso de checkout y visualizar el formulario para ingresar sus datos.

### Regla 2 - Usuario autenticado con carrito vacío

El usuario está autenticado, pero no tiene productos en el carrito. El
proceso de checkout puede ser accesible, pero el carrito se encuentra vacío.

En Sauce Demo, el botón `Checkout` aparece incluso cuando el carrito está
vacío, por lo que esta condición no debe evaluarse únicamente verificando
si el botón existe.

### Regla 3 - Formulario incompleto

El usuario está autenticado y tiene productos en el carrito, pero todavía no
ha completado la información requerida del formulario. El sistema debe
mantener al usuario en el proceso de checkout hasta completar los datos.

### Regla 4 - Compra completa

El usuario está autenticado, tiene productos en el carrito, completa
correctamente el formulario y hace clic en `Finish`. El sistema debe mostrar
la confirmación de que la compra fue completada.

### Regla 5 - Usuario no autenticado

El usuario no ha iniciado sesión. Por lo tanto, no debe poder completar el
proceso normal de checkout como usuario autenticado.

### Regla 6 - Carrito sin productos y formulario no aplicable

El usuario está autenticado, pero el carrito no contiene productos. No existe
una compra válida que completar, por lo que no debe mostrarse una confirmación
de compra.

---

## Conclusión

La tabla de decisión permite representar diferentes combinaciones de
condiciones del proceso de checkout y relacionarlas con las acciones o
resultados esperados.

Su utilidad consiste en identificar escenarios que podrían pasar
desapercibidos si solamente se prueban casos individuales. Al combinar las
condiciones de autenticación, contenido del carrito, información del
checkout y finalización de la compra, se obtiene una cobertura más organizada
del flujo.