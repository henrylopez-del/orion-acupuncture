/* @acuwithgigi mobile reels.
   Native CSS scroll-snap on body handles the snap. JS only adds the
   .active class to the current slide for fade-in animation. */
(function () {
  if (!window.matchMedia('(max-width: 768px)').matches) return;

  const slides = document.querySelectorAll(
    '.hero, .page-hero, .teaser, .service-card, .element, .element-detail, ' +
    '.test-card, .step-card, .photo-inset, .practitioner, .prac-extended, ' +
    '.pricing, .notes, .first-intro, .book, .book-teaser, .book-form-wrap, footer'
  );
  if (!slides.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          e.target.classList.add('reel-active');
        }
      });
    },
    { threshold: [0.5, 0.75] }
  );

  slides.forEach((s) => io.observe(s));
})();
