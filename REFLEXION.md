# Reflexión: Auto-wait vs. sleep() en Playwright

Playwright implementa la característica de **auto-wait** porque permite que las pruebas esperen automáticamente a 
que un elemento esté disponible, visible o listo para recibir una interacción antes de ejecutar la siguiente 
acción. Esto evita que el desarrollador tenga que agregar tiempos de espera fijos mediante `sleep()` o 
`waitForTimeout()`.

El uso de `sleep()` detiene la ejecución durante un tiempo determinado sin verificar si la página ya está lista. 
Si el tiempo es demasiado corto, la prueba puede fallar; si es demasiado largo, las pruebas tardan más de lo 
necesario en ejecutarse. En ambos casos se reduce la eficiencia y la confiabilidad de la automatización.

En cambio, el **auto-wait** de Playwright detecta automáticamente cuándo un elemento cumple las condiciones 
necesarias para interactuar con él y continúa la ejecución en ese momento. Esto hace que las pruebas sean más 
rápidas, más estables y menos propensas a errores ocasionados por diferencias en los tiempos de carga de la aplicación.

En este laboratorio se pudo observar esta ventaja al navegar entre páginas y al realizar la captura del footer, ya 
que Playwright esperó a que los elementos estuvieran disponibles antes de interactuar con ellos, sin necesidad de 
utilizar pausas artificiales.