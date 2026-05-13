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
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 0.08}s`;
        entry.target.style.animation = 'fadeUp 0.5s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tuto-card, .atelier-card, .creation-item, .product-card').forEach((element) => {
    element.style.opacity = '0';
    observer.observe(element);
  });
}
