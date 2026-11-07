/* ========================================================
   MODAL DE BOLETO, GENERACIÓN QR Y EXPORTACIÓN PDF
======================================================== */

// Generador de código alfanumérico estilo pase de gala (Ej: AE-26DEC-7K9A)
function generateTicketCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomSuffix = '';
  for (let i = 0; i < 4; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'AE-26DEC-' + randomSuffix;
}

// Renderizar Código QR de alta precisión localmente
function renderTicketQr(guestName, guestCount, ticketCode) {
  const ticketQrContainer = document.getElementById('ticketQrContainer');
  if (!ticketQrContainer) return;

  ticketQrContainer.innerHTML = '';
  const qrText = `PASE BODA ALEXIS & ESTEFANIA\nInvitado: ${guestName}\nPases: ${guestCount}\nCodigo: ${ticketCode}`;

  if (typeof QRCode !== 'undefined') {
    try {
      new QRCode(ticketQrContainer, {
        text: qrText,
        width: 90,
        height: 90,
        colorDark: "#3f4f3c",
        colorLight: "#fffdf9",
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (qrErr) {
      console.warn('Error con QRCode local, usando fallback:', qrErr);
      const encoded = encodeURIComponent(qrText);
      ticketQrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&color=3f4f3c&bgcolor=fffdf9&data=${encoded}" style="width:90px;height:90px;" crossorigin="anonymous">`;
    }
  } else {
    const encoded = encodeURIComponent(qrText);
    ticketQrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&color=3f4f3c&bgcolor=fffdf9&data=${encoded}" style="width:90px;height:90px;" crossorigin="anonymous">`;
  }
}

// Generación de PDF sin márgenes blancos (100% full-bleed al ras del pase)
async function downloadTicketPdf(guestName) {
  const downloadBtn = document.getElementById('downloadTicketPdfBtn');
  const ticketElement = document.getElementById('weddingTicket');
  if (!ticketElement) return;

  const originalBtnHtml = downloadBtn ? downloadBtn.innerHTML : '';
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = `<span>⏳ Generando Boleto en PDF...</span>`;
  }

  try {
    await document.fonts.ready;
    if (!window.html2canvas || !window.jspdf) {
      throw new Error('Librerías PDF (html2canvas / jsPDF) no disponibles');
    }

    // Captura con renderizado aislado a 780px
    const canvas = await window.html2canvas(ticketElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#f6efe2',
      windowWidth: 1100,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc) => {
        const ticket = doc.getElementById('weddingTicket');
        const stage = doc.createElement('div');
        stage.style.cssText = 'position:absolute;left:0;top:0;width:780px;background:#f6efe2;z-index:999999;padding:0;margin:0;';
        doc.body.appendChild(stage);
        stage.appendChild(ticket);
        ticket.style.cssText = 'width:780px;min-width:780px;height:auto;min-height:330px;margin:0;border-radius:0;box-shadow:none;transform:none;display:flex;flex-direction:row;';
      }
    });

    const pdfW = canvas.width / 3;
    const pdfH = canvas.height / 3;
    const pdf = new window.jspdf.jsPDF({
      orientation: pdfW >= pdfH ? 'landscape' : 'portrait',
      unit: 'px',
      format: [pdfW, pdfH],
      hotfixes: ['px_scaling']
    });

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH);
    const cleanGuestName = (guestName || 'Invitado').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Pase_Boda_Alexis_y_Estefania_${cleanGuestName}.pdf`);

    if (downloadBtn) {
      downloadBtn.innerHTML = `<span>✓ ¡Boleto Descargado!</span>`;
      setTimeout(() => {
        downloadBtn.innerHTML = originalBtnHtml;
        downloadBtn.disabled = false;
      }, 3000);
    }
  } catch (err) {
    console.error('Error generando PDF:', err);
    alert('Hubo un detalle al descargar el PDF. Puedes tomar captura de pantalla a tu boleto.');
    if (downloadBtn) {
      downloadBtn.innerHTML = originalBtnHtml;
      downloadBtn.disabled = false;
    }
  }
}

// Inicializar eventos de apertura y cierre del modal
function initTicketModal() {
  const ticketModal = document.getElementById('ticketModal');
  const closeTicketModal = document.getElementById('closeTicketModal');

  if (closeTicketModal && ticketModal) {
    closeTicketModal.addEventListener('click', () => {
      ticketModal.classList.remove('open');
    });
    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) {
        ticketModal.classList.remove('open');
      }
    });
  }
}
