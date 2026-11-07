# 📋 Conexión de Confirmaciones con Google Sheets

Este archivo contiene el código y los pasos para guardar automáticamente cada invitado registrado en una hoja de Google Sheets en tiempo real.

---

### Paso 1: Crear tu Hoja de Cálculo en Google Drive
1. Ve a [Google Sheets (Hojas de cálculo)](https://sheets.new) y crea una hoja nueva.
2. Nómbrala por ejemplo: `Invitados Boda Alexis y Estefanía`.
3. En la fila 1 (los encabezados), escribe en las columnas:
   - **Columna A:** `Fecha de Registro`
   - **Columna B:** `Invitado / Familia`
   - **Columna C:** `Asistencia`
   - **Columna D:** `Pases Confirmados`
   - **Columna E:** `Mensaje / Buenos Deseos`
   - **Columna F:** `Código de Pase`

---

### Paso 2: Agregar el Script
1. En tu hoja de cálculo, ve al menú superior: **Extensiones** > **Apps Script**.
2. Borra cualquier código que aparezca y pega exactamente lo siguiente:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("es-MX"),
      data.guestName || "N/A",
      data.attendance || "Confirmado",
      data.guestCount || "1",
      data.guestMessage || "",
      data.ticketCode || "N/A"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Paso 3: Publicar como Web App
1. Arriba a la derecha, haz clic en el botón azul **Implementar** > **Nueva implementación**.
2. En el engrane ⚙️ de la izquierda (Seleccionar tipo), elige: **Aplicación web**.
3. Configura:
   - **Descripción:** `RSVP Boda`
   - **Ejecutar como:** `Yo (tu correo)`
   - **Quién tiene acceso:** `Cualquiera` (¡Muy importante para que la web pueda enviar datos sin pedir login!).
4. Haz clic en **Implementar**.
5. Copia la **URL de la aplicación web** generada (empieza con `https://script.google.com/macros/s/.../exec`).

---

### Paso 4: Conectar con tu Invitación
Abre el archivo `script.js` en tu proyecto y en la línea 17 pega tu URL:

```javascript
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/TU_CODIGO_AQUI/exec";
```

¡Y listo! Cada vez que un invitado confirme su asistencia y descargue su pase, aparecerá al instante en tu Excel de Google Drive.
