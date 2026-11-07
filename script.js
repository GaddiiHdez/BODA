/* ========================================================
   LÓGICA INTERACTIVA · INVITACIÓN DIGITAL
   Boda: Alexis & Estefanía · 26 de Diciembre de 2026
======================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  // 2. REPRODUCTOR DE MÚSICA & ONDAS SONORAS
  // ==========================================
  const audio = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');

  if (musicBtn && audio) {
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
  // Enlace a la carpeta de Google Drive donde los invitados subirán sus fotos
  const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1BodaAlexisEstefaniaDriveFolder?usp=sharing";

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

  // Copiar datos bancarios
  const copyClabeBtn = document.getElementById('copyClabeBtn');
  const copyAllBankBtn = document.getElementById('copyAllBankBtn');
  const clabeCode = document.getElementById('clabeCode');
  const copyFeedback = document.getElementById('copyFeedback');

  function showCopyFeedback(msg = "✓ ¡Copiado con éxito!") {
    if (copyFeedback) {
      copyFeedback.textContent = msg;
      copyFeedback.style.display = 'block';
      setTimeout(() => {
        copyFeedback.style.display = 'none';
      }, 3500);
    }
  }

  if (copyClabeBtn && clabeCode) {
    copyClabeBtn.addEventListener('click', () => {
      const text = clabeCode.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback("✓ ¡CLABE copiada al portapapeles!");
      }).catch(err => {
        console.error('Error al copiar:', err);
      });
    });
  }

  if (copyAllBankBtn) {
    copyAllBankBtn.addEventListener('click', () => {
      const bankDetailsText = `DATOS PARA TRANSFERENCIA · BODA ALEXIS & ESTEFANÍA\nBanco: BBVA\nBeneficiario: Alexis & Estefanía\nCLABE Interbancaria: ${clabeCode ? clabeCode.textContent.trim() : '012345678901234567'}`;
      navigator.clipboard.writeText(bankDetailsText).then(() => {
        showCopyFeedback("✓ ¡Todos los datos bancarios copiados!");
      }).catch(err => {
        console.error('Error al copiar:', err);
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

  if (sendRsvpBtn) {
    sendRsvpBtn.addEventListener('click', () => {
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

      let text = `¡Hola Alexis y Estefanía! 💍✨\n\n`;

      if (attendance === 'si') {
        text += `Confirmo con mucha alegría mi asistencia a su boda el *26 de Diciembre de 2026*.\n\n`;
        text += `👤 *Invitado / Familia:* ${guestName}\n`;
        text += `🎟️ *Pases Confirmados:* ${guestCount} persona(s)\n`;
      } else {
        text += `Muchísimas gracias por la invitación a su boda. Lamentablemente no podré asistir, pero les envío todo mi cariño y bendiciones en esta maravillosa etapa. ❤️\n\n`;
        text += `👤 *De parte de:* ${guestName}\n`;
      }

      if (guestMessage) {
        text += `💌 *Mensaje:* "${guestMessage}"\n`;
      }

      text += `\n¡Felicidades por su matrimonio! 🥂🌿`;

      // Enlace para WhatsApp (número predeterminado o selector directo de contacto)
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
    });
  }

});
