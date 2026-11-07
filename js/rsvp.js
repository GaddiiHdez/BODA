/* ========================================================
   FORMULARIO RSVP INTELIGENTE & SINCRONIZACIÓN
======================================================== */

// URL de Google Apps Script para almacenar confirmaciones en Google Sheets
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDgRmvmNH7FMLr6Tfp31uURt8r7ICrPDJP2zwfli8eJ4Y5uiVjBZ78oQC0DW9ZT8mL/exec";

// Guardar en Google Sheets en segundo plano
async function saveToGoogleSheets(record) {
  if (!GOOGLE_SHEETS_SCRIPT_URL) return;
  try {
    await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    console.log('Registro sincronizado con Google Sheets');
  } catch (err) {
    console.warn('Nota sobre Google Sheets (no bloquea el pase):', err);
  }
}

// Inicializar el formulario RSVP y vinculación con WhatsApp y Boleto
function initRsvpForm() {
  const pillSi = document.getElementById('pillSi');
  const pillNo = document.getElementById('pillNo');
  const guestCountGroup = document.getElementById('guestCountGroup');
  const sendRsvpBtn = document.getElementById('sendRsvpWhatsApp');

  // Alternar selección entre Sí / No
  if (pillSi && pillNo) {
    const radioInputs = document.querySelectorAll('input[name="attendance"]');
    radioInputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.value === 'si') {
          pillSi.classList.add('active');
          pillNo.classList.remove('active');
          if (guestCountGroup) guestCountGroup.style.display = 'block';
        } else {
          pillNo.classList.add('active');
          pillSi.classList.remove('active');
          if (guestCountGroup) guestCountGroup.style.display = 'none';
        }
      });
    });
  }

  // Manejo del envío
  if (sendRsvpBtn) {
    sendRsvpBtn.addEventListener('click', async () => {
      const guestNameInput = document.getElementById('guestName');
      const guestName = guestNameInput ? guestNameInput.value.trim() : '';

      if (!guestName) {
        alert('Por favor ingresa tu nombre completo antes de enviar tu confirmación.');
        if (guestNameInput) guestNameInput.focus();
        return;
      }

      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'si';
      const guestCount = document.getElementById('guestCount')?.value || '1';
      const guestMessage = document.getElementById('guestMessage')?.value.trim() || '';

      // Evitar duplicados por dispositivo para un mismo invitado
      const normalizedNameKey = `rsvp_ticket_${guestName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_')}`;
      const savedCode = localStorage.getItem(normalizedNameKey);
      const ticketCode = savedCode || generateTicketCode();
      if (!savedCode && attendance === 'si') {
        localStorage.setItem(normalizedNameKey, ticketCode);
      }

      // Registro en Google Sheets
      saveToGoogleSheets({
        timestamp: new Date().toLocaleString('es-MX'),
        guestName: guestName,
        attendance: attendance === 'si' ? 'Confirmado' : 'Declinado',
        guestCount: attendance === 'si' ? guestCount : '0',
        guestMessage: guestMessage,
        ticketCode: attendance === 'si' ? ticketCode : 'N/A'
      });

      // Construcción del mensaje de WhatsApp
      let text = `¡Hola Alexis y Estefanía! 💍✨\n\n`;

      if (attendance === 'si') {
        text += `Confirmo con mucha alegría mi asistencia a su boda el *26 de Diciembre de 2026*.\n\n`;
        text += `👤 *Invitado / Familia:* ${guestName}\n`;
        text += `🎟️ *Pases Confirmados:* ${guestCount} persona(s)\n`;
        text += `🏷️ *Código de Boleto:* ${ticketCode}\n`;
      } else {
        text += `Muchísimas gracias por la invitación a su boda. Lamentablemente no podré asistir, pero les envío todo mi cariño y bendiciones en esta maravillosa etapa. ❤️\n\n`;
        text += `👤 *De parte de:* ${guestName}\n`;
      }

      if (guestMessage) {
        text += `💌 *Mensaje:* "${guestMessage}"\n`;
      }

      text += `\n¡Felicidades por su matrimonio! 🥂🌿`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/?text=${encodedText}`;

      // Si asiste, poblar y abrir el pase de gala
      if (attendance === 'si') {
        const ticketGuestName = document.getElementById('ticketGuestName');
        const ticketPassesQty = document.getElementById('ticketPassesQty');
        const ticketCodeDisplay = document.getElementById('ticketCodeDisplay');
        const ticketBarcodeDisplay = document.getElementById('ticketBarcodeDisplay');
        const ticketWhatsAppBtn = document.getElementById('ticketWhatsAppBtn');
        const downloadTicketPdfBtn = document.getElementById('downloadTicketPdfBtn');
        const ticketModal = document.getElementById('ticketModal');

        if (ticketGuestName) ticketGuestName.textContent = guestName;
        if (ticketPassesQty) ticketPassesQty.textContent = guestCount;
        if (ticketCodeDisplay) ticketCodeDisplay.textContent = ticketCode;
        if (ticketBarcodeDisplay) {
          ticketBarcodeDisplay.textContent = `*${ticketCode.replace(/-/g, '')}*`;
        }

        renderTicketQr(guestName, guestCount, ticketCode);

        if (ticketWhatsAppBtn) {
          ticketWhatsAppBtn.onclick = () => window.open(whatsappUrl, '_blank');
        }

        if (downloadTicketPdfBtn) {
          downloadTicketPdfBtn.onclick = () => downloadTicketPdf(guestName);
        }

        if (ticketModal) {
          ticketModal.classList.add('open');
        }
      } else {
        window.open(whatsappUrl, '_blank');
      }
    });
  }
}
