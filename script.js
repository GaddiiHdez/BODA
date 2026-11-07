/* ========================================================
   LÓGICA INTERACTIVA · INVITACIÓN DIGITAL
   Boda: Alexis & Estefanía · 26 de Diciembre de 2026
======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const carousel = document.getElementById('storyCarousel');
  if (carousel) {
    const slides = [...carousel.children];
    let current = 0;
    function move(delta) {
      current = (current + delta + slides.length) % slides.length;
      carousel.scrollTo({left: slides[current].offsetLeft - slides[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
    document.getElementById('storyPrev').onclick = () => move(-1);
    document.getElementById('storyNext').onclick = () => move(1);
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); }
    });
    carousel.addEventListener('scroll', () => {
      current = slides.reduce((best, slide, i) => Math.abs(slide.offsetLeft-slides[0].offsetLeft-carousel.scrollLeft) < Math.abs(slides[best].offsetLeft-slides[0].offsetLeft-carousel.scrollLeft) ? i : best, 0);
      document.getElementById('storyPosition').textContent = `0${current+1} / 0${slides.length}`;
    }, {passive:true});
  }

  // ==========================================
  // 1. CUENTA REGRESIVA EN TIEMPO REAL
  // ==========================================
  // Fecha: 26 de Diciembre de 2026, 17:00:00 (5:00 PM)
  const WEDDING_TIMESTAMP = new Date(2026, 11, 26, 17, 0, 0).getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_TIMESTAMP - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();


  // ==========================================
  // 2. REPRODUCTOR DE MÚSICA & CONTROL DE VOLUMEN DISCRETO
  // ==========================================
  const audio = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeMuteBtn = document.getElementById('volumeMuteBtn');
  const volumeIcon = document.getElementById('volumeIcon');

  if (audio) {
    // Volumen sutil y agradable por defecto (22%)
    const DEFAULT_VOLUME = 0.22;
    audio.volume = DEFAULT_VOLUME;
    if (volumeSlider) volumeSlider.value = DEFAULT_VOLUME;

    let previousVolume = DEFAULT_VOLUME;

    function updateVolumeIcon(vol) {
      if (!volumeIcon) return;
      if (vol === 0) {
        // Icono Silenciado
        volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
      } else if (vol < 0.5) {
        // Icono Volumen Bajo
        volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
      } else {
        // Icono Volumen Alto
        volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>`;
      }
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.volume = val;
        if (val > 0) previousVolume = val;
        updateVolumeIcon(val);
      });
    }

    if (volumeMuteBtn) {
      volumeMuteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (audio.volume > 0) {
          previousVolume = audio.volume;
          audio.volume = 0;
          if (volumeSlider) volumeSlider.value = 0;
          updateVolumeIcon(0);
        } else {
          const restoreVol = previousVolume > 0 ? previousVolume : DEFAULT_VOLUME;
          audio.volume = restoreVol;
          if (volumeSlider) volumeSlider.value = restoreVol;
          updateVolumeIcon(restoreVol);
        }
      });
    }

    if (musicBtn) {
      let isPlaying = false;

      function playAudio() {
        audio.play().then(() => {
          isPlaying = true;
          musicBtn.classList.add('playing');
          if (musicLabel) musicLabel.textContent = 'Pausar';
        }).catch(err => {
          console.log('Autoplay bloqueado por el navegador (requiere interacción del usuario):', err);
        });
      }

      function pauseAudio() {
        audio.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        if (musicLabel) musicLabel.textContent = 'Música';
      }

      musicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio();
        }
      });

      // Iniciar suavemente al primer clic en cualquier lugar si aún no está sonando
      const startAudioOnFirstTouch = () => {
        if (!isPlaying) {
          playAudio();
        }
        document.removeEventListener('click', startAudioOnFirstTouch);
        document.removeEventListener('touchstart', startAudioOnFirstTouch);
      };

      document.addEventListener('click', startAudioOnFirstTouch, { once: true });
      document.addEventListener('touchstart', startAudioOnFirstTouch, { once: true });
    }
  }


  // ==========================================
  // 3. EFECTO DE DESTELLOS FLOTANTES EN HERO
  // ==========================================
  const sparklesContainer = document.getElementById('sparkles');
  if (sparklesContainer) {
    const totalSparkles = 22;
    for (let i = 0; i < totalSparkles; i++) {
      const p = document.createElement('div');
      p.classList.add('sparkle-particle');
      
      const left = Math.random() * 100;
      const top = 30 + Math.random() * 70;
      const delay = Math.random() * 6;
      const duration = 4 + Math.random() * 4;
      const size = 3 + Math.random() * 3;

      p.style.left = `${left}%`;
      p.style.top = `${top}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDelay = `${delay}s`;
      p.style.animationDuration = `${duration}s`;

      sparklesContainer.appendChild(p);
    }
  }


  // ==========================================
  // 4. ANIMACIONES AL HACER SCROLL (60 FPS)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Respaldo para navegadores antiguos
    revealElements.forEach(el => el.classList.add('active'));
  }


  // ==========================================
  // 5. AGREGAR A CALENDARIO (GOOGLE / APPLE)
  // ==========================================
  const calendarBtn = document.getElementById('addToCalendarBtn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      // 26 de Diciembre de 2026 de 17:00 a 23:59 (UTC-6 estándar aproximado)
      const title = encodeURIComponent("Boda Alexis & Estefanía");
      const details = encodeURIComponent("¡Acompáñanos a celebrar nuestro matrimonio!\n\n17:00 hrs: Ceremonia en Parroquia Inmaculada Concepción\n18:00 hrs: Recepción en Casino El Campesino");
      const location = encodeURIComponent("Parroquia Inmaculada Concepción & Casino El Campesino");
      const dates = "20261226T230000Z/20261227T080000Z";

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank');
    });
  }


  // ==========================================
  // CONFIGURACIÓN PERSONALIZABLE
  // ==========================================
  // 1. Enlace a la carpeta de Google Drive donde los invitados subirán sus fotos
  const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1BodaAlexisEstefaniaDriveFolder?usp=sharing";

  // 2. URL de Google Apps Script para guardar confirmaciones en Google Sheets en tiempo real
  const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDgRmvmNH7FMLr6Tfp31uURt8r7ICrPDJP2zwfli8eJ4Y5uiVjBZ78oQC0DW9ZT8mL/exec";

  // Actualizar enlace y QR automáticamente
  const driveUploadBtn = document.getElementById('driveUploadBtn');
  const driveQrImage = document.getElementById('driveQrImage');
  if (driveUploadBtn) {
    driveUploadBtn.href = GOOGLE_DRIVE_FOLDER_URL;
  }
  if (driveQrImage) {
    const encodedDriveUrl = encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL);
    driveQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&color=2d382b&bgcolor=ffffff&data=${encodedDriveUrl}`;
  }

  // Descarga del código QR para las mesas
  const downloadQrBtn = document.getElementById('downloadQrBtn');
  if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', async () => {
      const qrUrl = driveQrImage ? driveQrImage.src : `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=15&color=2d382b&bgcolor=ffffff&data=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`;
      try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = "QR_Subir_Fotos_Boda_Alexis_y_Estefania.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        // En caso de bloqueo por CORS, abrir la imagen directamente para guardar
        window.open(qrUrl, '_blank');
      }
    });
  }

  // ==========================================
  // 6. SISTEMA MEJORADO DE MESA DE REGALOS (1-CLIC)
  // ==========================================
  // Copiar número de evento de Liverpool
  const copyLiverpoolBtn = document.getElementById('copyLiverpoolBtn');
  const liverpoolEventCode = document.getElementById('liverpoolEventCode');
  const liverpoolFeedback = document.getElementById('liverpoolFeedback');

  if (copyLiverpoolBtn && liverpoolEventCode) {
    copyLiverpoolBtn.addEventListener('click', () => {
      const code = liverpoolEventCode.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        if (liverpoolFeedback) {
          liverpoolFeedback.style.display = 'block';
          setTimeout(() => {
            liverpoolFeedback.style.display = 'none';
          }, 3500);
        }
      }).catch(err => {
        console.error('Error al copiar evento de Liverpool:', err);
      });
    });
  }

  // ==========================================
  // 7. FORMULARIO RSVP INTELIGENTE & WHATSAPP
  // ==========================================
  const pillSi = document.getElementById('pillSi');
  const pillNo = document.getElementById('pillNo');
  const guestCountGroup = document.getElementById('guestCountGroup');
  const sendRsvpBtn = document.getElementById('sendRsvpWhatsApp');

  if (pillSi && pillNo) {
    const radioInputs = document.querySelectorAll('input[name="attendance"]');
    radioInputs.forEach(input => {
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

  // Referencias del Modal de Boleto
  const ticketModal = document.getElementById('ticketModal');
  const closeTicketModal = document.getElementById('closeTicketModal');
  const ticketGuestName = document.getElementById('ticketGuestName');
  const ticketPassesQty = document.getElementById('ticketPassesQty');
  const ticketCodeDisplay = document.getElementById('ticketCodeDisplay');
  const ticketQrContainer = document.getElementById('ticketQrContainer');
  const downloadTicketPdfBtn = document.getElementById('downloadTicketPdfBtn');
  const ticketWhatsAppBtn = document.getElementById('ticketWhatsAppBtn');

  // Cerrar modal
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

  // Generador de código aleatorio único de pase
  function generateTicketCode() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `AE-2612-${randomDigits}`;
  }

  // Enviar a Google Sheets en tiempo real
  async function saveToGoogleSheets(record) {
    if (!GOOGLE_SHEETS_SCRIPT_URL) return;
    try {
      await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      console.log('Registro enviado a Google Sheets');
    } catch (err) {
      console.warn('Nota sobre Google Sheets (no interrumpe el pase):', err);
    }
  }

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

      // Evitar códigos duplicados si el invitado ya se registró previamente en este dispositivo
      const normalizedNameKey = `rsvp_ticket_${guestName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_')}`;
      const savedCode = localStorage.getItem(normalizedNameKey);
      const ticketCode = savedCode || generateTicketCode();
      if (!savedCode && attendance === 'si') {
        localStorage.setItem(normalizedNameKey, ticketCode);
      }

      // Guardar en Google Sheets en segundo plano
      saveToGoogleSheets({
        timestamp: new Date().toLocaleString('es-MX'),
        guestName: guestName,
        attendance: attendance === 'si' ? 'Confirmado' : 'Declinado',
        guestCount: attendance === 'si' ? guestCount : '0',
        guestMessage: guestMessage,
        ticketCode: attendance === 'si' ? ticketCode : 'N/A'
      });

      // Preparar mensaje para WhatsApp
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

      // Si confirma que SÍ asiste, mostrar el boleto de gala en pantalla
      if (attendance === 'si') {
        if (ticketGuestName) ticketGuestName.textContent = guestName;
        if (ticketPassesQty) ticketPassesQty.textContent = guestCount;
        if (ticketCodeDisplay) ticketCodeDisplay.textContent = ticketCode;
        const ticketBarcodeDisplay = document.getElementById('ticketBarcodeDisplay');
        if (ticketBarcodeDisplay) {
          ticketBarcodeDisplay.textContent = `*${ticketCode.replace(/-/g, '')}*`;
        }

        // Renderizar Código QR de alta precisión localmente (Vector/Canvas offline)
        if (ticketQrContainer) {
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

        // Configurar botón de WhatsApp dentro del modal
        if (ticketWhatsAppBtn) {
          ticketWhatsAppBtn.onclick = () => window.open(whatsappUrl, '_blank');
        }

        // Configurar descarga de PDF del boleto (Aislado de fixed modal para evitar páginas en blanco)
        if (downloadTicketPdfBtn) {
          downloadTicketPdfBtn.onclick = async () => {
            const ticketElement = document.getElementById('weddingTicket');
            if (!ticketElement) return;

            const originalBtnHtml = downloadTicketPdfBtn.innerHTML;
            downloadTicketPdfBtn.disabled = true;
            downloadTicketPdfBtn.innerHTML = `<span>⏳ Generando Boleto en PDF...</span>`;

            try {
              await document.fonts.ready;
              if (!window.html2canvas || !window.jspdf) throw new Error('Librerías PDF no disponibles');
              // Capture at an explicit desktop width, independent of modal scroll and viewport.
              const canvas = await html2canvas(ticketElement, {
                scale: 3, useCORS: true, backgroundColor: '#f6efe2',
                windowWidth: 1100, scrollX: 0, scrollY: 0,
                onclone: (doc) => {
                  const ticket = doc.getElementById('weddingTicket');
                  const stage = doc.createElement('div');
                  stage.style.cssText = 'position:absolute;left:0;top:0;width:780px;background:#f6efe2;z-index:999999;padding:0;margin:0;';
                  doc.body.appendChild(stage);
                  stage.appendChild(ticket);
                  ticket.style.cssText = 'width:780px;min-width:780px;height:auto;min-height:330px;margin:0;border-radius:0;box-shadow:none;transform:none;display:flex;flex-direction:row;';
                }
              });
              // Full-bleed PDF matching the exact dimensions of the ticket (0 white margins).
              const pdfW = canvas.width / 3;
              const pdfH = canvas.height / 3;
              const pdf = new window.jspdf.jsPDF({
                orientation: pdfW >= pdfH ? 'landscape' : 'portrait',
                unit: 'px',
                format: [pdfW, pdfH],
                hotfixes: ['px_scaling']
              });
              pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH);
              pdf.save(`Pase_Boda_Alexis_y_Estefania_${guestName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

              downloadTicketPdfBtn.innerHTML = `<span>✓ ¡Boleto Descargado!</span>`;
              setTimeout(() => {
                downloadTicketPdfBtn.innerHTML = originalBtnHtml;
                downloadTicketPdfBtn.disabled = false;
              }, 3000);

            } catch (err) {
              console.error('Error generando PDF:', err);
              alert('Hubo un detalle al descargar el PDF. Puedes tomar captura de pantalla a tu boleto.');
              downloadTicketPdfBtn.innerHTML = originalBtnHtml;
              downloadTicketPdfBtn.disabled = false;
            }
          };
        }

        // Abrir el modal del boleto
        if (ticketModal) {
          ticketModal.classList.add('open');
        }
      } else {
        // Si declina amablemente, abrir WhatsApp de inmediato
        window.open(whatsappUrl, '_blank');
      }
    });
  }

});
