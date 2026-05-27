/* @acuwithgigi mobile reels — designed 9:16 slides.
   Pattern: .tiktok-container scrolls, .reel slides snap, .nav-dots tracks. */
(function () {
  if (!window.matchMedia('(max-width: 768px)').matches) return;

  const container = document.querySelector('.tiktok-container');
  const dotsHost = document.querySelector('.nav-dots');
  if (!container || !dotsHost) return;

  // Prefer new designed reels; fall back to legacy section-based snap if absent
  let slides = Array.from(container.querySelectorAll('.reels-mobile .reel'));
  if (!slides.length) {
    slides = Array.from(container.querySelectorAll(
      '.hero, .page-hero, .teaser, .service-card, .element, .element-detail, ' +
      '.test-card, .step-card, .photo-inset, .practitioner, .prac-extended, ' +
      '.pricing, .notes, .first-intro, .book, .book-teaser, .book-form-wrap, footer'
    ));
  }
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

  const MAX_VISIBLE = 12;
  if (dots.length > MAX_VISIBLE) {
    dots.forEach((d, i) => { if (i >= MAX_VISIBLE) d.style.display = 'none'; });
  }

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

  if (slides[0]) {
    slides[0].classList.add('reel-active');
    if (dots[0]) dots[0].classList.add('active');
  }
})();
