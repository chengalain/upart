export function initReviewsMarquee() {
  const track = document.getElementById('reviewsTrack');
  if (!track) {
    return;
  }

  const cards = track.innerHTML;
  track.innerHTML = cards + cards;
}

export function hydrateMediaFrames(root = document) {
  root.querySelectorAll('[data-media-frame]').forEach((frame) => {
    const image = frame.querySelector('[data-media-image]');
    if (!(image instanceof HTMLImageElement) || image.dataset.mediaBound === 'true') {
      return;
    }

    const markLoaded = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        frame.style.setProperty('--media-ratio', `${image.naturalWidth} / ${image.naturalHeight}`);
      }

      frame.classList.add('is-loaded');
    };
    const markPending = () => frame.classList.remove('is-loaded');

    image.dataset.mediaBound = 'true';
    image.addEventListener('load', markLoaded);
    image.addEventListener('error', markPending);

    if (image.complete && image.naturalWidth > 0) {
      markLoaded();
    } else {
      markPending();
    }
  });
}

export function initStaggeredAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tuto-card, .atelier-card, .creation-item, .product-card').forEach((element) => {
    element.classList.add('reveal-pending');
    observer.observe(element);
  });
}
