# Test- Playwright

## Información

**Nombre:**
Brayan Josue Corado Robles

**Carné:**
1790-22-11094

**Curso:**
Aseguramiento de la Calidad del Software

**Versión de Node.js:** v24.14.0

---

## Captura 1 - Ejecución de los tests

![Tests ejecutándose correctamente](/test_terminal.png)

---

## Captura 2 - Reporte HTML de Playwright

![Reporte HTML](/reporte_html.png)

## Reflexion clase02

- 📄 [Reflexión: Auto-wait vs. sleep()](REFLEXION.md)

---

## Ejecución

Ejecutar todos los tests:

```bash
npx playwright test
```

Ejecutar únicamente los tests de la Clase 01:

```bash
npx playwright test tests/clase01.spec.ts
```

Ejecutar únicamente los tests de la Clase 02:

```bash
npx playwright test tests/clase02.spec.ts
```

Ejecutar únicamente los tests de la Clase 03:

```bash
npx playwright test tests/clase03.spec.ts
```

Abrir el reporte HTML generado por Playwright:

```bash
npx playwright show-report
```

# Casos de prueba

El caso de prueba solicitado en la clase03 se encuentra en:

- [TC-001 - Agregar un producto al carrito](casos-de-prueba/TC-001.md)