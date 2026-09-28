(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.is-reveal');
  const scenes = document.querySelectorAll('.scene');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    scenes.forEach((scene) => scene.classList.add('is-active'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  revealItems.forEach((item) => revealObserver.observe(item));

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-active'); });
  }, { threshold: .16 });
  scenes.forEach((scene) => sceneObserver.observe(scene));

  const parallaxScene = document.getElementById('palace-transition');
  const parallaxAssets = [...document.querySelectorAll('.parallax-asset')];
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  let scheduled = false;
  const updateParallax = () => {
    if (!parallaxScene) return;
    const rect = parallaxScene.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
    // Keep depth visible without allowing the illustrated layers to detach on
    // tall screens. Touch devices use a quieter range than pointer devices.
    const maxShift = Math.min(36, Math.max(16, window.innerHeight * .04)) * (coarsePointer ? .62 : 1);
    parallaxAssets.forEach((asset) => {
      const depth = Number(asset.dataset.depth || 0);
      const distance = Math.max(-maxShift, Math.min(maxShift, centerOffset * depth));
      asset.style.setProperty('--scroll-shift', `${distance.toFixed(1)}px`);
    });
    scheduled = false;
  };
  const requestUpdate = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateParallax); } };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
})();
