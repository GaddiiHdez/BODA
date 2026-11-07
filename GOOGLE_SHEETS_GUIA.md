# 📊 Hoja de Confirmaciones (RSVP) · Alexis & Estefanía

La hoja de cálculo ya fue creada y configurada automáticamente en tu cuenta de Google Drive con diseño personalizado, cabeceras en verde olivo y dorado, y fórmulas de métricas en tiempo real.

🔗 **Enlace directo a tu hoja en Google Drive:**
[Invitados Boda Alexis y Estefania](https://docs.google.com/spreadsheets/d/1EC_qJbsk1kA3BSK8ZhOIatQ1kb1-7PvY3uQQjqit0kw/edit)

---

### ¿Qué contiene ya tu hoja?
1. **Pestaña "Confirmaciones":**
   - **Columna A:** Fecha de Registro (formato fecha y hora).
   - **Columna B:** Nombre de Invitado / Familia.
   - **Columna C:** Asistencia (con formato condicional verde para "Sí" y rosa para "No").
   - **Columna D:** No. Pases (conteo numérico para sumatorias automáticas).
   - **Columna E:** Mensaje de Felicitación.
   - **Columna F:** Código de Boleto (ejemplo: `AE-2612-4821`).
   - Fila de encabezado congelada para desplazarse cómodamente.
2. **Pestaña "Resumen":**
   - **Total Registros Respondidos:** Conteo automático en vivo.
   - **Total Personas Confirmadas (Pases):** Suma matemática en vivo de boletos reservados.
   - **Total que No Asistirán:** Conteo automático de declinaciones.
   - **Promedio de Pases por Invitado:** Cálculo en tiempo real.

---

### Paso Único: Activar la conexión Web en 1 minuto

Para que la página web pueda enviar los datos a tu hoja sin pedirle contraseñas a los invitados:

1. Abre tu hoja en Google Sheets:
   👉 **[Clic aquí para abrir la hoja](https://docs.google.com/spreadsheets/d/1EC_qJbsk1kA3BSK8ZhOIatQ1kb1-7PvY3uQQjqit0kw/edit)**
2. En el menú superior, haz clic en **Extensiones** > **Apps Script**.
3. Borra el código que aparezca y pega exactamente este bloque:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Confirmaciones") || ss.getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    var isYes = data.attendance === "Confirmado" || data.attendance === "si";
    var passCount = isYes ? Number(data.guestCount || 1) : 0;
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("es-MX"),
      data.guestName || "Invitado",
      isYes ? "Sí, asistiré con gusto" : "No podré asistir",
      passCount,
      data.guestMessage || "",
      isYes ? (data.ticketCode || "N/A") : "N/A"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Arriba a la derecha, haz clic en el botón azul **Implementar** > **Nueva implementación**.
5. En el icono de engranaje ⚙️ (Seleccionar tipo), elige **Aplicación web**.
6. Configura únicamente estos 3 campos:
   - **Descripción:** `RSVP Boda`
   - **Ejecutar como:** `Yo (tu correo)`
   - **Quién tiene acceso:** `Cualquiera` *(imprescindible para que el formulario de la web pueda registrar a los invitados)*.
7. Haz clic en **Implementar** y luego en **Autorizar acceso** (seleccionas tu cuenta).
8. Copia la **URL de la aplicación web** (inicia con `https://script.google.com/macros/s/.../exec`).
9. Pásame esa URL aquí en el chat (o pégala en `script.js` en la línea `const GOOGLE_SHEETS_SCRIPT_URL = "...";`).

¡Y listo! Todo quedará enlazado en tiempo real.
