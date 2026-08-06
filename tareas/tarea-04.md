# Reflexión - Tarea 04

## ¿Cuál principio es más importante y por qué?

Considero que el principio **DRY (Don't Repeat Yourself)** es el más importante en la automatización de pruebas porque evita la duplicación de código y facilita el mantenimiento del proyecto.

Durante esta tarea se implementó una función llamada `loginConReintento()`, la cual permitió reutilizar el mismo procedimiento de inicio de sesión en varios casos de prueba. Gracias a esto fue posible mantener un código más limpio, reducir la cantidad de instrucciones repetidas y facilitar futuras modificaciones.

Si el proceso de inicio de sesión cambiara, únicamente sería necesario actualizar la función reutilizable en un solo lugar, en lugar de modificar todos los tests donde se utiliza. Esto disminuye el riesgo de errores y hace que el proyecto sea más fácil de mantener.

Por estas razones considero que aplicar el principio DRY mejora la organización, la reutilización del código y la calidad de las pruebas automatizadas.