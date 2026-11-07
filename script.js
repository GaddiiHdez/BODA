/* ========================================================
   ORQUESTADOR PRINCIPAL · ALEXIS & ESTEFANÍA
   Boda: 26 de Diciembre de 2026
   Arquitectura Modular: js/
======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Carrete editorial de historia
  if (typeof initStoryCarousel === 'function') initStoryCarousel();

  // 2. Cuenta regresiva en tiempo real
  if (typeof initCountdown === 'function') initCountdown();

  // 3. Reproductor musical de alta gama con control de volumen
  if (typeof initAudioPlayer === 'function') initAudioPlayer();

  // 4. Efectos visuales y utilidades de interfaz
  if (typeof initSparkles === 'function') initSparkles();
  if (typeof initScrollReveal === 'function') initScrollReveal();
  if (typeof initCalendar === 'function') initCalendar();
  if (typeof initCopyLiverpool === 'function') initCopyLiverpool();
  if (typeof initDrivePhotos === 'function') initDrivePhotos();

  // 5. Modal de Boleto y RSVP Inteligente
  if (typeof initTicketModal === 'function') initTicketModal();
  if (typeof initRsvpForm === 'function') initRsvpForm();
});
