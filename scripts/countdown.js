(() => {
  'use strict';

  // 6 April 2027, 2:30 PM IST equals 09:00 UTC. UTC avoids device-timezone drift.
  const target = Date.UTC(2027, 3, 6, 9, 0, 0);
  const fields = { days: document.getElementById('days'), hours: document.getElementById('hours'), minutes: document.getElementById('minutes'), seconds: document.getElementById('seconds') };
  const timer = document.getElementById('timer');
  const arrival = document.getElementById('arrival-message');
  const pad = (value, length = 2) => String(value).padStart(length, '0');

  const tick = () => {
    let remaining = Math.max(0, target - Date.now());
    const complete = remaining === 0;
    const days = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); remaining %= 60000;
    const seconds = Math.floor(remaining / 1000);
    fields.days.textContent = pad(days, 3); fields.hours.textContent = pad(hours); fields.minutes.textContent = pad(minutes); fields.seconds.textContent = pad(seconds);
    if (complete) { timer.hidden = true; arrival.hidden = false; }
  };
  tick();
  window.setInterval(tick, 1000);
})();
