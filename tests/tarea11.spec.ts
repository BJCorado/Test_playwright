import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';

const ISSUE_IMAGENES = 'https://github.com/BJCorado/Test_playwright/issues/2';
const ISSUE_TYPOS = 'https://github.com/BJCorado/Test_playwright/issues/3';

test.describe('Tarea 11 - Documentar defectos con Playwright', () => {

  // ─────────────────────────────────────────────────────────────
  // Reto 3: borrador de reporte desde un afterEach.
  // Se ejecuta después de cada test; solo adjunta el borrador si el test tuvo errores.
  // ─────────────────────────────────────────────────────────────
  test.afterEach(async ({ page, browserName }, testInfo) => {
    if (testInfo.errors.length === 0) return;

    // El mensaje de error trae códigos de color de la terminal: se limpian.
    const limpiar = (texto: string) => texto.replace(/\u001b\[[0-9;]*m/g, '');
    const obtenido = testInfo.errors
      .map(e => limpiar(e.message ?? String(e.value ?? 'Error sin mensaje')))
      .join('\n\n');
    const version = page.context().browser()?.version() ?? 'desconocida';

    const borrador = [
      `# Borrador de Bug Report`,
      ``,
      `**Título:** ${testInfo.title}`,
      `**Fecha:** ${new Date().toLocaleString('es-GT')}`,
      `**Ambiente:** ${process.platform}, ${browserName} ${version} (proyecto: ${testInfo.project.name})`,
      `**URL:** ${page.url()}`,
      ``,
      `## Resultado obtenido`,
      '```',
      obtenido,
      '```',
      ``,
      `## Pendiente de completar`,
      `- Pasos para reproducir`,
      `- Resultado esperado`,
      `- Severidad, prioridad y frecuencia`,
    ].join('\n');

    await testInfo.attach('borrador-bug-report.md', {
      body: borrador,
      contentType: 'text/markdown',
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Reto 1: medir un defecto intermitente.
  // /typos introduce el error "won,t" al azar en cada carga.
  // ─────────────────────────────────────────────────────────────
  test('Typos: medir la frecuencia del error de texto en 12 recargas',
    async ({ page }, testInfo) => {
      // 12 recargas con slowMo pueden pasar de 60 s: se amplía el límite de este test.
      test.setTimeout(180000);

      const intentos = 12;
      let conError = 0;
      const detalle: string[] = [];

      await page.goto(`${BASE_URL}/typos`);
      const parrafo = page.locator('p', { hasText: 'Sometimes you' });

      for (let i = 1; i <= intentos; i++) {
        if (i > 1) await page.reload();
        await expect(parrafo).toBeVisible();
        const texto = (await parrafo.textContent()) ?? '';
        const tieneError = texto.includes('won,t');
        if (tieneError) conError++;
        detalle.push(`Carga ${i}: ${tieneError ? 'CON error' : 'sin error'} -> "${texto.trim()}"`);
      }

      const frecuencia = `${conError} de ${intentos}`;

      // Anotación: aparece en el encabezado del test dentro del reporte HTML.
      testInfo.annotations.push({
        type: 'frecuencia',
        description: `Error de texto "won,t" en ${frecuencia} cargas`,
      });

      // Adjunto: el detalle de cada recarga.
      await testInfo.attach('frecuencia-typos', {
        body: `Frecuencia: ${frecuencia}\n\n${detalle.join('\n')}`,
        contentType: 'text/plain',
      });

      // El test mide, no exige: solo comprueba que se hicieron las 12 mediciones.
      expect(detalle).toHaveLength(intentos);
    });

  // ─────────────────────────────────────────────────────────────
  // Reto 2: test.fixme con una anotación de issue.
  // Queda escrito, pero no se ejecuta mientras el defecto siga abierto (sale como skipped).
  // ─────────────────────────────────────────────────────────────
  test.fixme('Typos: el texto no debe tener errores ortográficos',
    { annotation: { type: 'issue', description: ISSUE_TYPOS } },
    async ({ page }) => {
      await page.goto(`${BASE_URL}/typos`);
      const parrafo = page.locator('p', { hasText: 'Sometimes you' });
      await expect(parrafo).not.toContainText('won,t');
    });

  // ─────────────────────────────────────────────────────────────
  // Test sobre /broken-images que dispara el afterEach del Reto 3.
  // test.fail() lo mantiene en verde (falla como se espera) y aun así tiene errores,
  // así que el afterEach adjunta el borrador del reporte.
  // ─────────────────────────────────────────────────────────────
  test('Imágenes rotas: todas las imágenes deben cargar', { tag: '@bug' },
    async ({ page }) => {
      test.fail(true, 'BUG-001: asdf.jpg y hjkl.jpg responden 404');
      test.info().annotations.push({ type: 'issue', description: ISSUE_IMAGENES });

      await page.goto(`${BASE_URL}/broken-images`);
      const imagenes = page.locator('main img');
      await expect.poll(() => imagenes.evaluateAll(
        imgs => imgs.every(img => (img as HTMLImageElement).complete),
      )).toBe(true);
      const anchos = await imagenes.evaluateAll(
        imgs => imgs.map(img => (img as HTMLImageElement).naturalWidth),
      );
      for (const ancho of anchos) {
        expect(ancho).toBeGreaterThan(0);
      }
    });
});