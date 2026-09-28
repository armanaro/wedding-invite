(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A brief display avoids a flash of unstyled content without creating a forced wait.
  window.addEventListener('load', () => {
    window.setTimeout(() => $('#loading-screen')?.classList.add('is-hidden'), 280);
  }, { once: true });

  const menu = $('#site-menu');
  const menuToggle = $('#menu-toggle');
  const menuClose = $('#menu-close');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close invitation menu' : 'Open invitation menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menuClose.focus();
  };
  menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menuClose.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

  const openInvitation = $('#open-invitation');
  openInvitation.addEventListener('click', () => {
    $('#couple').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    setupMusicAfterGesture();
  });

  // Music is deliberately loaded only after a user gesture. To add it later, set
  // data-music-src on <html>, e.g. assets/audio/nikah-theme.mp3.
  const musicToggle = $('#music-toggle');
  let music = null;
  let musicAvailable = false;
  let musicAttempted = false;
  const musicSource = document.documentElement.dataset.musicSrc?.trim();
  const unavailableLabel = 'Music is unavailable until a local track is added';
  const updateMusicButton = (playing) => {
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : (musicAvailable ? 'Play background music' : unavailableLabel));
  };
  const setupMusicAfterGesture = () => {
    if (musicAttempted) return;
    musicAttempted = true;
    if (!musicSource) { updateMusicButton(false); return; }
    music = new Audio(musicSource);
    music.loop = true;
    music.preload = 'metadata';
    music.addEventListener('canplay', () => { musicAvailable = true; updateMusicButton(false); }, { once: true });
    music.addEventListener('error', () => { musicAvailable = false; updateMusicButton(false); }, { once: true });
    music.load();
  };
  updateMusicButton(false);
  musicToggle.addEventListener('click', async () => {
    setupMusicAfterGesture();
    if (!musicAvailable || !music) return;
    if (music.paused) {
      try { await music.play(); updateMusicButton(true); } catch (_) { updateMusicButton(false); }
    } else { music.pause(); updateMusicButton(false); }
  });

  // Reveal section content with a light-weight IntersectionObserver.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  // Subtle, rAF-throttled parallax uses only transforms so it remains inexpensive on mobile.
  const parallaxLayers = [...document.querySelectorAll('.parallax-layer')];
  let scheduled = false;
  const updateParallax = () => {
    const viewCenter = window.innerHeight / 2;
    parallaxLayers.forEach((layer) => {
      const rect = layer.parentElement.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - viewCenter;
      const speed = Number(layer.dataset.parallax || 0);
      const offset = Math.max(-48, Math.min(48, distance * speed));
      const base = layer.classList.contains('journey-palace') ? 'translateX(-50%) ' : '';
      layer.style.transform = `${base}translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    scheduled = false;
  };
  const scheduleParallax = () => { if (!scheduled && !reducedMotion) { scheduled = true; requestAnimationFrame(updateParallax); } };
  window.addEventListener('scroll', scheduleParallax, { passive: true });
  window.addEventListener('resize', scheduleParallax, { passive: true });
  scheduleParallax();

  // Scratch card: resolution-aware Canvas, Pointer Events, and an accessible fallback reveal.
  const canvas = $('#scratch-card');
  const scratchFrame = canvas.parentElement;
  const progressText = $('#scratch-help');
  const revealButton = $('#reveal-button');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  let isDrawing = false;
  let wasRevealed = false;
  let lastPoint = null;
  let scratchScheduled = false;
  const goldPattern = (ctx, width, height) => {
    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#94661f'); background.addColorStop(.48, '#e1bd67'); background.addColorStop(1, '#a97523');
    ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,242,187,.34)'; ctx.lineWidth = 1;
    const step = Math.max(18, Math.round(width / 16));
    for (let x = -height; x < width + height; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + height, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + step, 0); ctx.lineTo(x - height + step, height); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(67,43,9,.37)'; ctx.strokeRect(8, 8, width - 16, height - 16);
    ctx.fillStyle = '#fff0b3'; ctx.font = `600 ${Math.max(12, width * .036)}px Georgia`;
    ctx.textAlign = 'center'; ctx.fillText('GENTLY SCRATCH TO REVEAL', width / 2, height / 2 + 5);
  };
  const resizeCanvas = () => {
    if (wasRevealed) return;
    const rect = scratchFrame.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.globalCompositeOperation = 'source-over';
    goldPattern(context, rect.width, rect.height);
  };
  const pointForEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const erase = (from, to) => {
    const size = Math.max(28, Math.min(52, canvas.getBoundingClientRect().width * .11));
    context.globalCompositeOperation = 'destination-out';
    context.lineCap = 'round'; context.lineJoin = 'round'; context.lineWidth = size;
    context.beginPath(); context.moveTo(from.x, from.y); context.lineTo(to.x, to.y); context.stroke();
    context.beginPath(); context.arc(to.x, to.y, size / 2, 0, Math.PI * 2); context.fill();
  };
  const estimateReveal = () => {
    if (wasRevealed || scratchScheduled) return;
    scratchScheduled = true;
    requestAnimationFrame(() => {
      scratchScheduled = false;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const sampleWidth = 32; const sampleHeight = 20;
      const sample = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0; let total = 0;
      const strideX = Math.max(1, Math.floor(canvas.width / sampleWidth));
      const strideY = Math.max(1, Math.floor(canvas.height / sampleHeight));
      for (let y = 0; y < canvas.height; y += strideY) for (let x = 0; x < canvas.width; x += strideX) { total++; if (sample[(y * canvas.width + x) * 4 + 3] < 80) clear++; }
      const percent = Math.round((clear / total) * 100);
      progressText.textContent = percent > 68 ? 'Your surprise is revealed' : `${percent}% revealed — keep scratching`;
      if (percent > 68) revealScratch();
      void scale;
    });
  };
  const revealScratch = () => {
    if (wasRevealed) return;
    wasRevealed = true; isDrawing = false;
    canvas.style.transition = 'opacity .45s ease'; canvas.style.opacity = '0'; canvas.style.pointerEvents = 'none';
    progressText.textContent = 'Your surprise is revealed'; revealButton.hidden = true;
    window.setTimeout(() => { canvas.style.display = 'none'; }, 470);
  };
  canvas.addEventListener('pointerdown', (event) => { if (wasRevealed) return; isDrawing = true; lastPoint = pointForEvent(event); canvas.setPointerCapture(event.pointerId); erase(lastPoint, lastPoint); estimateReveal(); });
  canvas.addEventListener('pointermove', (event) => { if (!isDrawing || wasRevealed) return; const next = pointForEvent(event); erase(lastPoint, next); lastPoint = next; estimateReveal(); });
  const stopScratching = () => { isDrawing = false; lastPoint = null; };
  canvas.addEventListener('pointerup', stopScratching); canvas.addEventListener('pointercancel', stopScratching); canvas.addEventListener('lostpointercapture', stopScratching);
  revealButton.addEventListener('click', revealScratch);
  new ResizeObserver(resizeCanvas).observe(scratchFrame);
  resizeCanvas();

  // 6 April 2027, 2:30 PM in India is 09:00 UTC. UTC avoids a device timezone mismatch.
  const targetTime = Date.UTC(2027, 3, 6, 9, 0, 0);
  const timer = $('#timer'); const arrival = $('#arrival-message');
  const format = (value, digits = 2) => String(value).padStart(digits, '0');
  const updateCountdown = () => {
    let remaining = Math.max(0, targetTime - Date.now());
    const done = remaining === 0;
    const days = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); remaining %= 60000;
    const seconds = Math.floor(remaining / 1000);
    $('#days').textContent = format(days, 3); $('#hours').textContent = format(hours); $('#minutes').textContent = format(minutes); $('#seconds').textContent = format(seconds);
    if (done) { timer.hidden = true; arrival.hidden = false; }
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
