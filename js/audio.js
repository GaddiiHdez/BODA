/* ========================================================
   REPRODUCTOR DE MÚSICA & CONTROL DE VOLUMEN DISCRETO
======================================================== */

function initAudioPlayer() {
  const audio = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeMuteBtn = document.getElementById('volumeMuteBtn');
  const volumeIcon = document.getElementById('volumeIcon');

  if (!audio) return;

  // Volumen sutil y agradable por defecto (22%)
  const DEFAULT_VOLUME = 0.22;
  audio.volume = DEFAULT_VOLUME;
  if (volumeSlider) volumeSlider.value = DEFAULT_VOLUME;

  let previousVolume = DEFAULT_VOLUME;

  function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    if (vol === 0) {
      volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
    } else if (vol < 0.5) {
      volumeIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
    } else {
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
      }).catch((err) => {
        console.log('Autoplay requiere interacción del usuario:', err);
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

    // Iniciar suavemente al primer toque/clic si el navegador bloquea autoplay
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
