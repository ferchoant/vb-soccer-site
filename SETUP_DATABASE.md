# Guía de Configuración: Base de Datos en Google Sheets

Sigue estos pasos para conectar tu formulario web a una Hoja de Cálculo de Google.

## Paso 1: Crear la Hoja de Cálculo
1.  Ve a [Google Sheets](https://sheets.google.com) y crea una **Hoja en blanco**.
2.  Ponle el nombre que quieras, por ejemplo: `VB Soccer - Leads`.
3.  En la primera fila (fila 1), escribe los encabezados exactos de las columnas:
    *   A1: `fecha`
    *   B1: `nombre`
    *   C1: `empresa`
    *   D1: `correo`
    *   E1: `telefono`
    *   F1: `objetivo`
    *   G1: `presupuesto`

## Paso 2: Crear el Script
1.  En la hoja de cálculo, ve al menú **Extensiones** > **Apps Script**.
2.  Se abrirá una nueva pestaña. Borra todo el código que aparece ahí.
3.  Copia y pega el siguiente código:

```javascript
const SHEET_NAME = "Hoja 1"; // Asegúrate que coincida con el nombre de la pestaña abajo a la izquierda

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName(SHEET_NAME);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      if (header === 'fecha') {
        return new Date();
      }
      // Busca el dato enviado con el mismo nombre que la columna
      return e.parameter[header] || '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
```

4.  Si cambiaste el nombre de la pestaña de la hoja (abajo a la izquierda), actualiza `SHEET_NAME` en la primera línea del código. Por defecto es "Hoja 1".

## Paso 3: Publicar el Script
1.  Haz clic en el botón azul **Implementar** (arriba a la derecha) > **Nueva implementación**.
2.  En la ventana que aparece:
    *   Haz clic en el engranaje (Seleccionar tipo) y elige **Aplicación web**.
    *   **Descripción:** Formulario VB Soccer.
    *   **Ejecutar como:** `Yo` (tu correo).
    *   **Quién tiene acceso:** `Cualquier usuario` (IMPORTANTE: Si no eliges esto, no funcionará).
3.  Haz clic en **Implementar**.
4.  Te pedirá permisos. Haz clic en **Autorizar acceso**, elige tu cuenta, luego **Avanzado** > **Ir a... (inseguro)** (es seguro, es tu propio script) > **Permitir**.
5.  Copia la **URL de la aplicación web** (empieza con `https://script.google.com/...`).

## Paso 4: Conectar al Sitio Web
1.  Abre el archivo `js/main.js` en tu proyecto.
2.  Busca la línea que dice: `const SCRIPT_URL = 'TU_URL_AQUI';`
3.  Reemplaza `'TU_URL_AQUI'` con la URL que copiaste en el paso anterior.
4.  Guarda el archivo.

¡Listo! Ahora cuando alguien llene el formulario, los datos aparecerán en tu hoja de cálculo.
