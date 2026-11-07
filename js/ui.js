/* ========================================================
   EFECTOS VISUALES & UTILIDADES DE INTERFAZ
======================================================== */

// Destellos dorados flotantes en el Hero
function initSparkles() {
  const sparklesContainer = document.getElementById('sparkles');
  if (!sparklesContainer) return;

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

// Animaciones de aparición fluida al hacer scroll (60 FPS)
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }
}

// Agregar al Calendario (Google Calendar)
function initCalendar() {
  const calendarBtn = document.getElementById('addToCalendarBtn');
  if (!calendarBtn) return;

  calendarBtn.addEventListener('click', () => {
    const title = encodeURIComponent("Boda Alexis & Estefanía");
    const details = encodeURIComponent(
      "¡Acompáñanos a celebrar nuestro matrimonio!\n\n17:00 hrs: Ceremonia en Parroquia Inmaculada Concepción\n18:00 hrs: Recepción en Casino El Campesino"
    );
    const location = encodeURIComponent("Parroquia Inmaculada Concepción & Casino El Campesino");
    const dates = "20261226T230000Z/20261227T080000Z";

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  });
}

// Copiar número de evento de Liverpool
function initCopyLiverpool() {
  const copyLiverpoolBtn = document.getElementById('copyLiverpoolBtn');
  const liverpoolEventCode = document.getElementById('liverpoolEventCode');
  const liverpoolFeedback = document.getElementById('liverpoolFeedback');

  if (!copyLiverpoolBtn || !liverpoolEventCode) return;

  copyLiverpoolBtn.addEventListener('click', () => {
    const code = liverpoolEventCode.textContent.trim();
    navigator.clipboard.writeText(code).then(() => {
      if (liverpoolFeedback) {
        liverpoolFeedback.style.display = 'block';
        setTimeout(() => {
          liverpoolFeedback.style.display = 'none';
        }, 3500);
      }
    }).catch((err) => {
      console.error('Error al copiar evento de Liverpool:', err);
    });
  });
}

// Configuración y descarga del QR de Fotos de Invitados (Google Drive)
function initDrivePhotos() {
  const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1BodaAlexisEstefaniaDriveFolder?usp=sharing";

  const driveUploadBtn = document.getElementById('driveUploadBtn');
  const driveQrImage = document.getElementById('driveQrImage');
  const downloadQrBtn = document.getElementById('downloadQrBtn');

  if (driveUploadBtn) {
    driveUploadBtn.href = GOOGLE_DRIVE_FOLDER_URL;
  }

  if (driveQrImage) {
    const encodedDriveUrl = encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL);
    driveQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&color=2d382b&bgcolor=ffffff&data=${encodedDriveUrl}`;
  }

  if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', async () => {
      const qrUrl = driveQrImage
        ? driveQrImage.src
        : `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=15&color=2d382b&bgcolor=ffffff&data=${encodeURIComponent(GOOGLE_DRIVE_FOLDER_URL)}`;
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
        window.open(qrUrl, '_blank');
      }
    });
  }
}
