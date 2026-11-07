/* ========================================================
   CARRETE DE HISTORIA / CAROUSEL EDITORIAL
======================================================== */

function initStoryCarousel() {
  const carousel = document.getElementById('storyCarousel');
  if (!carousel) return;

  const slides = [...carousel.children];
  let current = 0;

  function move(delta) {
    current = (current + delta + slides.length) % slides.length;
    carousel.scrollTo({
      left: slides[current].offsetLeft - slides[0].offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }

  const prevBtn = document.getElementById('storyPrev');
  const nextBtn = document.getElementById('storyNext');
  const posEl = document.getElementById('storyPosition');

  if (posEl) {
    posEl.textContent = `01 / 0${slides.length}`;
  }

  if (prevBtn) prevBtn.onclick = () => move(-1);
  if (nextBtn) nextBtn.onclick = () => move(1);

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      move(e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  carousel.addEventListener('scroll', () => {
    current = slides.reduce((best, slide, i) => {
      const dist = Math.abs(slide.offsetLeft - slides[0].offsetLeft - carousel.scrollLeft);
      const bestDist = Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - carousel.scrollLeft);
      return dist < bestDist ? i : best;
    }, 0);

    if (posEl) {
      posEl.textContent = `0${current + 1} / 0${slides.length}`;
    }
  }, { passive: true });
}
