(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const menu = byId('invitation-menu');
  const menuButton = byId('menu-button');
  const closeButton = byId('menu-close');
  const openInvitation = byId('open-invitation');
  const loading = byId('loading');
  const introScreen = byId('intro-screen');
  const introOpenButton = byId('intro-open-button');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('intro-active');

  // The repository ships 1×1 placeholder files so every declared Canva path resolves.
  // Hide only those placeholders; replacement artwork retains its full independent layer.
  document.querySelectorAll('img.asset').forEach((image) => {
    const markPlaceholder = () => {
      if (image.naturalWidth <= 1 && image.naturalHeight <= 1) image.classList.add('is-placeholder');
    };
    if (image.complete) markPlaceholder(); else image.addEventListener('load', markPlaceholder, { once: true });
  });

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close invitation menu' : 'Open invitation menu');
    document.body.classList.toggle('menu-active', open);
    if (open) closeButton.focus();
  };

  menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  closeButton.addEventListener('click', () => setMenu(false));
  menu.addEventListener('click', (event) => { if (event.target === menu) setMenu(false); });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

  openInvitation.addEventListener('click', () => {
    if (openInvitation.dataset.opened === 'true') return;
    openInvitation.dataset.opened = 'true';
    document.documentElement.classList.add('invitation-opened');
    window.NikahMusic?.startFromGesture();
    byId('couple').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  // The intro leaves the established invitation in the DOM and only fades its own
  // overlay away. Music is intentionally requested before any asynchronous work.
  let introOpening = false;
  const openIntro = () => {
    if (introOpening || !introScreen) return;
    introOpening = true;
    introOpenButton.disabled = true;
    introOpenButton.setAttribute('aria-busy', 'true');

    // This is a genuine button activation, so startFromGesture can call the existing
    // HTMLAudioElement's play() method while the browser still considers it a gesture.
    Promise.resolve(window.NikahMusic?.startFromGesture?.()).catch(() => false);

    introScreen.classList.add('is-opening');
    const finishIntro = () => {
      introScreen.classList.add('is-hidden');
      introScreen.setAttribute('aria-hidden', 'true');
      introOpenButton.setAttribute('aria-busy', 'false');
      document.body.classList.remove('intro-active');
    };
    window.setTimeout(finishIntro, reduceMotion ? 0 : 720);
  };
  introOpenButton?.addEventListener('click', openIntro);

  window.addEventListener('load', () => {
    window.setTimeout(() => loading.classList.add('is-complete'), reduceMotion ? 0 : 320);
  }, { once: true });
})();
