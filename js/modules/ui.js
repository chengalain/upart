export function initReviewsMarquee() {
  const track = document.getElementById('reviewsTrack');
  if (!track) {
    return;
  }

  const cards = track.innerHTML;
  track.innerHTML = cards + cards;
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
