/* @acuwithgigi mobile reels.
   Arqalum pattern: .tiktok-container scrolls, slides snap, nav-dots track position. */
(function () {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) return;

  const container = document.querySelector('.tiktok-container');
  const dotsHost = document.querySelector('.nav-dots');
  if (!container || !dotsHost) return;

  const SLIDE_SELECTOR = [
    '.hero',
    '.page-hero',
    '.teaser',
    '.service-card',
    '.element',
    '.element-detail',
    '.test-card',
    '.step-card',
    '.photo-inset',
    '.practitioner',
    '.prac-extended',
    '.pricing',
    '.notes',
    '.first-intro',
    '.book',
    '.book-teaser',
    '.book-form-wrap',
    'footer'
  ].join(',');

  const slides = Array.from(container.querySelectorAll(SLIDE_SELECTOR));
  if (!slides.length) return;

  // Build dots
  dotsHost.innerHTML = '';
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      container.scrollTo({ top: slide.offsetTop, behavior: 'smooth' });
    });
    dotsHost.appendChild(dot);
    return dot;
  });

  // Cap visible dots at 12 so the column doesn't get crazy long
  const MAX_VISIBLE = 12;
  if (dots.length > MAX_VISIBLE) {
    // Hide overflow dots but keep them in DOM for tracking
    dots.forEach((d, i) => {
      if (i >= MAX_VISIBLE) d.style.display = 'none';
    });
  }

  // Track active slide via IntersectionObserver, scoped to container
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const idx = slides.indexOf(entry.target);
        if (idx === -1) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          entry.target.classList.add('reel-active');
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    },
    { root: container, threshold: [0.55, 0.75] }
  );
  slides.forEach((s) => io.observe(s));

  // Activate first slide on load
  if (slides[0]) {
    slides[0].classList.add('reel-active');
    if (dots[0]) dots[0].classList.add('active');
  }
})();
