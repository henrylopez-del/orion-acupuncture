/* @acuwithgigi reels-style snap, mobile only.
   One swipe = one card. No free scroll between snap points. */
(function () {
  const MQ = window.matchMedia('(max-width: 768px)');
  if (!MQ.matches) return;

  const TARGET_SELECTOR = [
    '.hero',
    '.page-hero',
    '.teaser',
    '.test-card',
    '.service-card',
    '.element-detail',
    '.step-card',
    '.photo-inset',
    '.practitioner',
    '.prac-extended',
    '.notes',
    '.pricing',
    '.book',
    '.book-teaser',
    '.book-form-wrap',
    '.first-intro',
    'footer'
  ].join(',');

  let targets = [];
  let positions = [];
  let currentIndex = 0;
  let isAnimating = false;
  let touchStartY = null;
  let touchStartTime = 0;
  let touchStartScroll = 0;
  let wheelLocked = false;
  let resizeTimer = null;

  function refresh() {
    targets = Array.from(document.querySelectorAll(TARGET_SELECTOR))
      .filter(el => el.offsetParent !== null);
    positions = targets.map(el => Math.round(el.getBoundingClientRect().top + window.scrollY));
    currentIndex = closestIndex(window.scrollY);
  }

  function closestIndex(y) {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < positions.length; i++) {
      const d = Math.abs(positions[i] - y);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  function snapTo(i, smooth = true) {
    if (i < 0) i = 0;
    if (i >= positions.length) i = positions.length - 1;
    isAnimating = true;
    currentIndex = i;
    window.scrollTo({ top: positions[i], behavior: smooth ? 'smooth' : 'instant' });
    clearTimeout(snapTo._t);
    snapTo._t = setTimeout(() => { isAnimating = false; }, 520);
  }

  function go(delta) {
    if (isAnimating) return;
    snapTo(currentIndex + delta, true);
  }

  /* TOUCH */
  document.addEventListener('touchstart', (e) => {
    if (isAnimating) return;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    touchStartScroll = window.scrollY;
    currentIndex = closestIndex(window.scrollY);
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (isAnimating) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (touchStartY === null || isAnimating) { touchStartY = null; return; }
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const deltaT = Date.now() - touchStartTime;
    const absD = Math.abs(deltaY);

    const fast = absD > 25 && deltaT < 280;
    const long = absD > 70;

    if (fast || long) {
      go(deltaY > 0 ? 1 : -1);
    } else {
      snapTo(currentIndex, true);
    }
    touchStartY = null;
  }, { passive: true });

  /* WHEEL (trackpad / desktop dev testing) */
  document.addEventListener('wheel', (e) => {
    if (isAnimating || wheelLocked) { e.preventDefault(); return; }
    if (Math.abs(e.deltaY) < 24) return;
    e.preventDefault();
    wheelLocked = true;
    currentIndex = closestIndex(window.scrollY);
    go(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLocked = false; }, 620);
  }, { passive: false });

  /* KEYBOARD */
  document.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    else if (e.key === 'Home') { e.preventDefault(); snapTo(0); }
    else if (e.key === 'End') { e.preventDefault(); snapTo(positions.length - 1); }
  });

  /* RESIZE */
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!MQ.matches) { window.location.reload(); return; }
      refresh();
    }, 200);
  });

  /* Disable native scroll-snap so JS owns it */
  document.documentElement.style.scrollSnapType = 'none';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { refresh(); setTimeout(refresh, 100); });
  } else {
    refresh(); setTimeout(refresh, 100);
  }

  /* Snap to nearest on any unexpected scroll settle (iOS momentum cleanup) */
  let settleTimer = null;
  window.addEventListener('scroll', () => {
    if (isAnimating) return;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      if (isAnimating) return;
      const nearest = closestIndex(window.scrollY);
      if (Math.abs(positions[nearest] - window.scrollY) > 4) {
        snapTo(nearest, true);
      }
    }, 180);
  }, { passive: true });
})();
