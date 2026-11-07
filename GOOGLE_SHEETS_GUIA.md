# 📊 Hoja de Confirmaciones (RSVP) · Alexis & Estefanía

La hoja de cálculo está configurada en tu cuenta de Google Drive con reglas automáticas de validación contra duplicados, cabeceras en verde olivo y dorado, y métricas en tiempo real.

🔗 **Enlace directo a tu hoja en Google Drive:**
[Invitados Boda Alexis y Estefania](https://docs.google.com/spreadsheets/d/1EC_qJbsk1kA3BSK8ZhOIatQ1kb1-7PvY3uQQjqit0kw/edit)

---

### 🛡️ Reglas de Validación Antiduplicados Implementadas

1. **Validación Estricta en la Hoja (Columna B - Nombres):**
   - Se configuró la regla `=COUNTIF($B$2:$B, B2)<=1` con rechazo estricto. Si alguien intenta ingresar o pegar manualmente un nombre duplicado en la Columna B, Google Sheets rechazará la entrada y mostrará el aviso: *"No se permiten nombres duplicados. Este invitado ya está registrado en la lista."*
2. **Formato Condicional de Alerta:**
   - Si existiera alguna coincidencia, la celda se resaltará en rojo suave y negrita de inmediato.
3. **Manejo Inteligente en Apps Script (Actualización sin Duplicar):**
   - El script busca coincidencias ignorando mayúsculas/minúsculas y acentos (ejemplo: *"Gaddiel Hernández"* coincide con *"gaddiel hernandez"*).
   - Si el invitado ya existe, **actualiza su fila** (número de pases, asistencia y mensaje) manteniendo su código original de boleto, en lugar de crear un registro duplicado que distorsione los totales.

---

### 🔄 Código del Script con Prevención de Duplicados

Para activar la regla en tu Web App:

1. Abre tu hoja: [Invitados Boda Alexis y Estefania](https://docs.google.com/spreadsheets/d/1EC_qJbsk1kA3BSK8ZhOIatQ1kb1-7PvY3uQQjqit0kw/edit)
2. Ve a **Extensiones** > **Apps Script**.
3. Sustituye el código por este:

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Confirmaciones") || ss.getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    var rawName = (data.guestName || "Invitado").trim();
    var isYes = data.attendance === "Confirmado" || data.attendance === "si";
    var passCount = isYes ? Number(data.guestCount || 1) : 0;
    var nowStr = data.timestamp || new Date().toLocaleString("es-MX");
    var message = data.guestMessage || "";
    var ticketCode = isYes ? (data.ticketCode || "N/A") : "N/A";

    // Función para normalizar texto (minúsculas, sin acentos ni espacios extra)
    function normalize(str) {
      if (!str) return "";
      return str.toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    var cleanTarget = normalize(rawName);
    var values = sheet.getDataRange().getValues();
    var existingRow = -1;

    // Buscar si ya existe en la Columna B (Nombre del Invitado)
    for (var i = 1; i < values.length; i++) {
      var rowName = values[i][1];
      if (rowName && normalize(rowName) === cleanTarget) {
        existingRow = i + 1; // 1-indexed para getRange
        break;
      }
    }

    if (existingRow > 0) {
      // YA EXISTE: Actualizar la fila para no duplicar invitados ni inflar métricas
      var oldCode = values[existingRow - 1][5]; // Mantener código previo si existe
      var finalCode = (oldCode && oldCode.toString().indexOf("AE-") !== -1) ? oldCode : ticketCode;

      sheet.getRange(existingRow, 1, 1, 6).setValues([[
        nowStr + " (Actualizado)",
        rawName,
        isYes ? "Sí, asistiré con gusto" : "No podré asistir",
        passCount,
        message,
        isYes ? finalCode : "N/A"
      ]]);

      return ContentService.createTextOutput(JSON.stringify({
        "status": "updated",
        "message": "Registro actualizado exitosamente sin duplicados",
        "ticketCode": finalCode
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      // NUEVO INVITADO: Agregar nueva fila
      sheet.appendRow([
        nowStr,
        rawName,
        isYes ? "Sí, asistiré con gusto" : "No podré asistir",
        passCount,
        message,
        isYes ? ticketCode : "N/A"
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Invitado registrado exitosamente",
        "ticketCode": ticketCode
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Arriba haz clic en **Guardar** (icono de disquete 💾).
5. Haz clic en **Implementar** > **Gestionar implementaciones**.
6. Haz clic en el lápiz ✏️ de editar, en **Versión** selecciona **Nueva versión**, y haz clic en **Implementar**.

¡Listo! Con esto, tanto la hoja de cálculo como el endpoint web protegen tu base de datos contra duplicados.
