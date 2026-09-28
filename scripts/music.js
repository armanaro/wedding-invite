(() => {
  'use strict';

  const audio = document.getElementById('background-nasheed');
  const button = document.getElementById('music-button');
  const source = 'assets/audio/nasheed.mp3';
  let unavailable = false;
  let sourceConfigured = false;

  const setState = (playing) => {
    button.classList.toggle('is-playing', playing);
    button.classList.toggle('is-unavailable', unavailable);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute(
      'aria-label',
      unavailable
        ? 'Background music is unavailable'
        : playing
          ? 'Pause background music'
          : 'Play background music',
    );
  };

  // Configure the one existing player only once. `preload="none"` keeps the
  // audio lightweight until a guest chooses to play it.
  const configureSource = () => {
    if (sourceConfigured) return;
    sourceConfigured = true;
    audio.src = source;
    audio.volume = .32;
    audio.loop = true;
  };

  // No await precedes play(): callers can use this directly in a click handler
  // and retain the browser's user-gesture permission. It also never rewinds an
  // already-playing nasheed.
  const startFromGesture = () => {
    if (!audio.paused) return Promise.resolve(true);
    if (unavailable) return Promise.resolve(false);
    configureSource();

    let playResult;
    try {
      playResult = audio.play();
    } catch (_) {
      setState(false);
      return Promise.resolve(false);
    }

    return Promise.resolve(playResult)
      .then(() => {
        unavailable = false;
        setState(true);
        return true;
      })
      .catch(() => {
        // A browser may decline playback; the invitation transition still proceeds.
        setState(false);
        return false;
      });
  };

  button.addEventListener('click', () => {
    if (audio.paused) {
      void startFromGesture();
      return;
    }
    audio.pause();
    setState(false);
  });

  audio.addEventListener('canplay', () => {
    unavailable = false;
    setState(!audio.paused);
  });
  audio.addEventListener('error', () => {
    unavailable = true;
    setState(false);
  });
  audio.addEventListener('pause', () => { if (!audio.ended) setState(false); });
  audio.addEventListener('play', () => setState(true));

  setState(false);
  window.NikahMusic = { startFromGesture };
})();
