const pageRenderers = new Map();

const pageLabels = {
  accueil: 'Accueil',
  tutoriels: 'Tutoriels',
  ateliers: 'Ateliers',
  creations: 'Creations',
  boutique: 'Boutique',
  product: 'Produit',
  panier: 'Panier',
  favoris: 'Favoris',
  contact: 'Contact',
};

let currentPage = 'accueil';

function updateMenuButtonState(isExpanded) {
  const menuButton = document.querySelector('.hamburger');
  if (!menuButton) {
    return;
  }

  menuButton.setAttribute('aria-expanded', String(isExpanded));
  menuButton.setAttribute('aria-label', isExpanded ? 'Fermer le menu principal' : 'Ouvrir le menu principal');
}

function getPageHeading(page) {
  const section = document.getElementById(`page-${page}`);
  if (!section) {
    return null;
  }

  return section.querySelector('h1, .section-title, .pd-title');
}

function updateAuxiliarySections(isHome) {
  const newsletter = document.getElementById('newsletter-section');
  const reviews = document.getElementById('reviews-section');

  if (newsletter) {
    newsletter.classList.toggle('is-hidden', !isHome);
    newsletter.setAttribute('aria-hidden', String(!isHome));
  }

  if (reviews) {
    reviews.classList.toggle('is-hidden', !isHome);
    reviews.setAttribute('aria-hidden', String(!isHome));
  }
}

function updateNavigationState(page) {
  document.querySelectorAll('.nav-links a, .footer-col a[data-page]').forEach((link) => {
    const isActive = link.dataset.page === page;
    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function announcePage(page) {
  const announcer = document.getElementById('pageAnnouncer');
  if (!announcer) {
    return;
  }

  announcer.textContent = `${pageLabels[page] || page} affiche.`;
}

function updateDocumentTitle(page) {
  const label = pageLabels[page] || 'UpArt';
  document.title = page === 'accueil' ? 'UpArt — Upcycling Textile' : `${label} — UpArt`;
}

function syncLocation(page, shouldUpdateHistory) {
  const targetHash = page === 'accueil' ? '#accueil' : `#${page}`;
  if (!shouldUpdateHistory || window.location.hash === targetHash) {
    return;
  }

  window.history.pushState({ page }, '', targetHash);
}

function focusPageContent(page) {
  const heading = getPageHeading(page);
  if (heading instanceof HTMLElement) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    return;
  }

  document.getElementById('mainContent')?.focus({ preventScroll: true });
}

function normalizePage(page) {
  if (page && document.getElementById(`page-${page}`)) {
    return page;
  }

  return 'accueil';
}

export function configureNavigation(renderers) {
  Object.entries(renderers).forEach(([page, renderer]) => {
    if (typeof renderer === 'function') {
      pageRenderers.set(page, renderer);
    }
  });
}

export function showPage(page, options = {}) {
  const { focusContent = true, updateHistory = true } = options;
  const resolvedPage = normalizePage(page);

  document.querySelectorAll('section').forEach((section) => {
    section.classList.remove('section-visible');
    section.classList.add('section-hidden');
    section.setAttribute('aria-hidden', 'true');
  });

  const target = document.getElementById(`page-${resolvedPage}`);
  if (target) {
    target.classList.remove('section-hidden');
    target.classList.add('section-visible');
    target.setAttribute('aria-hidden', 'false');
  }

  updateAuxiliarySections(resolvedPage === 'accueil');

  const renderer = pageRenderers.get(resolvedPage);
  if (renderer) {
    renderer();
  }

  updateNavigationState(resolvedPage);
  updateDocumentTitle(resolvedPage);
  announcePage(resolvedPage);
  syncLocation(resolvedPage, updateHistory);

  currentPage = resolvedPage;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('navLinks')?.classList.remove('open');
  updateMenuButtonState(false);

  if (focusContent) {
    window.requestAnimationFrame(() => focusPageContent(resolvedPage));
  }
}

export function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) {
    return;
  }

  const isExpanded = navLinks.classList.toggle('open');
  updateMenuButtonState(isExpanded);
}

export function initNavigation() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
  });

  const initialPage = normalizePage(window.location.hash.replace('#', ''));
  updateMenuButtonState(false);
  showPage(initialPage, { focusContent: false, updateHistory: false });

  window.addEventListener('popstate', () => {
    const targetPage = normalizePage(window.location.hash.replace('#', ''));
    if (targetPage !== currentPage) {
      showPage(targetPage, { updateHistory: false });
    }
  });
}
