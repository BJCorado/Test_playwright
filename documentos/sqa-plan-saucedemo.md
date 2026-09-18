# SQA Plan mínimo — Sauce Demo

**Propósito:** Verificar que las funciones críticas de Sauce Demo (login, inventario, carrito y checkout) funcionen correctamente antes de considerar la aplicación lista para un deploy.

**Alcance:** Se prueba el flujo de autenticación, la visualización del inventario (cantidad, precios e imágenes de productos), el menú de navegación, el logout y el proceso de checkout. No se prueban aspectos de backend, seguridad avanzada, ni compatibilidad entre navegadores distintos a Chromium.

**Herramientas:** Playwright con TypeScript, ejecutado en modo paralelo y secuencial, con reportes HTML y capturas de evidencia automáticas en caso de fallo.

**Criterios de salida:** Se considera listo cuando el 100% de los tests críticos (login, inventario, checkout) pasan tanto en ejecución paralela como secuencial, sin errores no documentados.