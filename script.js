// Configuración: Fecha de la boda (Año, Mes [0-11], Día, Hora, Minutos)
// Sábado 26 de Diciembre de 2026, 17:00 hrs (5:00 PM)
const WEDDING_DATE = new Date(2026, 11, 26, 17, 0, 0).getTime();

// Función de cuenta atrás
function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;

  if (distance < 0) {
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
      countdownEl.innerHTML = "<p style='font-family: var(--font-serif-titles); font-size: 1.1rem; color: var(--olive-leaf);'>¡Hoy es el gran día! 🎉</p>";
    }
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
  if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
  if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
}

// Inicializar cuenta regresiva cada segundo
setInterval(updateCountdown, 1000);
updateCountdown();

// Manejador del botón de impresión
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// Reproductor de música sutil
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

if (musicToggle && bgMusic) {
  let isPlaying = false;
  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.innerText = '🎵';
      musicToggle.title = 'Reproducir música';
    } else {
      bgMusic.play().then(() => {
        musicToggle.innerText = '⏸️';
        musicToggle.title = 'Pausar música';
      }).catch(err => {
        console.log('Error al reproducir audio:', err);
      });
    }
    isPlaying = !isPlaying;
  });
}
