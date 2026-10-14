# Bug Report - BR-CLASE11-001

**Título:** Página Broken Images: las imágenes asdf.jpg y hjkl.jpg no cargan (responden 404)
**Fecha:** 10/10/2026
**Reportado por:** Brayan Josué Corado Robles
**Ambiente:** Windows, Firefox (Playwright), https://practice.expandtesting.com/broken-images
**Issue en GitHub:** https://github.com/BJCorado/Test_playwright/issues/2

## Descripción
En la página /broken-images, dos de las imágenes del contenido principal no se muestran. El servidor responde 404 al solicitar los archivos asdf.jpg y hjkl.jpg, por lo que el navegador las dibuja como imágenes rotas (ancho natural 0).

## Severidad: Baja
Es un problema visual: la página carga y no se bloquea ningún flujo, solo falta contenido gráfico.

## Prioridad: P3
No impide usar el sitio; se puede corregir en el próximo sprint.

## Frecuencia: Siempre
Ocurre en cada ejecución (manual y automatizada).

## Pasos para reproducir
1. Abrir https://practice.expandtesting.com/broken-images
2. Esperar a que la página termine de cargar.
3. Observar las imágenes del área principal.

## Resultado esperado
Todas las imágenes de la página cargan y se muestran (ancho natural mayor que 0).

## Resultado obtenido
Las imágenes asdf.jpg y hjkl.jpg aparecen rotas; su ancho natural es 0 y en la pestaña Network responden 404.

## Evidencia
- Test automatizado: `tests/clase11.spec.ts` → "Imágenes rotas: todas las imágenes de la página deben cargar" (tag `@bug`).
- Error del test (sin `test.fail()`): `Expected: > 0` / `Received: 0`.
- Captura, video y traza en el reporte HTML (`npx playwright show-report`); en la traza, pestaña Network, se ven los 404.

## Notas adicionales
El test está marcado con `test.fail()` para que la suite siga en verde mientras el defecto esté abierto. Cuando se corrija, el test pasará a rojo y habrá que quitar esa línea para verificar y cerrar el Issue.