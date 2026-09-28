(() => {
  'use strict';

  const card = document.getElementById('scratch-card');
  const canvas = document.getElementById('scratch-canvas');
  const overlay = document.getElementById('scratch-overlay');
  const status = document.getElementById('scratch-status');
  const revealButton = document.getElementById('reveal-message');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  let drawing = false;
  let lastPoint = null;
  let revealed = false;
  let measurePending = false;

  const drawOverlay = () => {
    if (revealed) return;
    const rect = card.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * scale));
    canvas.height = Math.max(1, Math.round(rect.height * scale));
    canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const gold = context.createLinearGradient(0, 0, rect.width, rect.height);
    gold.addColorStop(0, '#95671f'); gold.addColorStop(.48, '#dcb45e'); gold.addColorStop(1, '#9d6b20');
    context.globalCompositeOperation = 'source-over'; context.fillStyle = gold; context.fillRect(0, 0, rect.width, rect.height);
    context.strokeStyle = 'rgba(255,240,183,.36)'; context.lineWidth = 1;
    const step = Math.max(20, Math.round(rect.width / 16));
    for (let x = -rect.height; x < rect.width + rect.height; x += step) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x + rect.height, rect.height); context.stroke();
      context.beginPath(); context.moveTo(x + step, 0); context.lineTo(x - rect.height + step, rect.height); context.stroke();
    }
    context.fillStyle = '#fff0b4'; context.font = `600 ${Math.max(12, rect.width * .034)}px Georgia`; context.textAlign = 'center';
    context.fillText('GENTLY SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 + 4);
  };
  const point = (event) => { const rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
  const erase = (from, to) => {
    const size = Math.max(30, Math.min(56, canvas.getBoundingClientRect().width * .115));
    context.globalCompositeOperation = 'destination-out'; context.lineWidth = size; context.lineCap = 'round'; context.lineJoin = 'round';
    context.beginPath(); context.moveTo(from.x, from.y); context.lineTo(to.x, to.y); context.stroke(); context.beginPath(); context.arc(to.x, to.y, size / 2, 0, Math.PI * 2); context.fill();
  };
  const reveal = () => {
    if (revealed) return;
    revealed = true; drawing = false; card.classList.add('is-revealed'); status.textContent = 'The Save the Date message is revealed.'; revealButton.hidden = true;
    window.setTimeout(() => { canvas.hidden = true; overlay.hidden = true; }, 460);
  };
  const measure = () => {
    if (measurePending || revealed) return;
    measurePending = true;
    requestAnimationFrame(() => {
      measurePending = false;
      const image = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const stepX = Math.max(1, Math.floor(canvas.width / 34)); const stepY = Math.max(1, Math.floor(canvas.height / 22));
      let clear = 0; let total = 0;
      for (let y = 0; y < canvas.height; y += stepY) for (let x = 0; x < canvas.width; x += stepX) { total++; if (image[(y * canvas.width + x) * 4 + 3] < 85) clear++; }
      const percentage = Math.round(clear / total * 100);
      if (percentage >= 65) reveal(); else status.textContent = `${percentage}% revealed — keep scratching gently.`;
    });
  };
  canvas.addEventListener('pointerdown', (event) => { if (revealed) return; drawing = true; lastPoint = point(event); canvas.setPointerCapture(event.pointerId); erase(lastPoint, lastPoint); measure(); });
  canvas.addEventListener('pointermove', (event) => { if (!drawing || revealed) return; const next = point(event); erase(lastPoint, next); lastPoint = next; measure(); });
  const stop = () => { drawing = false; lastPoint = null; };
  canvas.addEventListener('pointerup', stop); canvas.addEventListener('pointercancel', stop); canvas.addEventListener('lostpointercapture', stop);
  revealButton.addEventListener('click', reveal);
  new ResizeObserver(drawOverlay).observe(card);
  overlay.addEventListener('load', drawOverlay, { once: true });
  drawOverlay();
})();
