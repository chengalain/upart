const pageRenderers = new Map();

export function configureNavigation(renderers) {
  Object.entries(renderers).forEach(([page, renderer]) => {
    if (typeof renderer === 'function') {
      pageRenderers.set(page, renderer);
    }
  });
}

export function showPage(page) {
  document.querySelectorAll('section').forEach((section) => {
    section.classList.remove('section-visible');
    section.classList.add('section-hidden');
  });

  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.remove('section-hidden');
    target.classList.add('section-visible');
  }

  const newsletter = document.getElementById('newsletter-section');
  const reviews = document.getElementById('reviews-section');
  const isHome = page === 'accueil';

  if (newsletter) {
    newsletter.classList.toggle('is-hidden', !isHome);
  }

  if (reviews) {
    reviews.classList.toggle('is-hidden', !isHome);
  }

  const renderer = pageRenderers.get(page);
  if (renderer) {
    renderer();
  }

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('navLinks')?.classList.remove('open');
}

export function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

export function initNavigation() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });
}
