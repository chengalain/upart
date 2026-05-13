import { state } from '../core/state.js';
import { products } from '../data/products.js';
import { renderMediaMarkup } from './media.js';
import { hydrateMediaFrames } from './ui.js';

let showPageHandler = () => {};

export function setShopNavigator(handler) {
  showPageHandler = typeof handler === 'function' ? handler : () => {};
}

function getBackgroundClass(backgroundKey) {
  return `bg-${backgroundKey}`;
}

function renderProductMedia(product, wrapperClass, compact = false) {
  return renderMediaMarkup({
    wrapperClass,
    src: product.image,
    alt: product.name,
    compact,
  });
}

function findProduct(productId) {
  return products.find((product) => product.id === productId) || null;
}

export function updateBadges() {
  const cartBadge = document.getElementById('cartBadge');
  const favBadge = document.getElementById('favBadge');

  if (cartBadge) {
    cartBadge.textContent = String(state.cart.length);
    cartBadge.classList.toggle('empty', state.cart.length === 0);
  }

  if (favBadge) {
    favBadge.textContent = String(state.favorites.length);
    favBadge.classList.toggle('empty', state.favorites.length === 0);
  }
}

export function renderBoutique() {
  const grid = document.getElementById('boutiqueGrid');
  if (!grid) {
    return;
  }

  grid.innerHTML = products.map((product) => {
    const isFavorite = state.favorites.includes(product.id);

    return `
      <div class="product-card" data-action="open-product" data-id="${product.id}" role="button" tabindex="0">
        ${renderProductMedia(product, `product-img ${getBackgroundClass(product.bg)}`)}
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <button class="product-wishlist" type="button" data-action="toggle-fav" data-id="${product.id}">${isFavorite ? '♥' : '♡'}</button>
        <div class="product-body">
          <h3>${product.name}</h3>
          <div class="product-technique">${product.technique}</div>
          <div class="product-footer">
            <div class="product-price">${product.price}€</div>
            <div class="product-sizes">${product.sizes.join(', ')}</div>
          </div>
          <button class="btn-cart" type="button" data-action="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        </div>
      </div>`;
  }).join('');

  hydrateMediaFrames(grid);
}

export function openProduct(productId) {
  const product = findProduct(productId);
  const detail = document.getElementById('productDetail');

  if (!product || !detail) {
    return;
  }

  const isFavorite = state.favorites.includes(product.id);

  detail.innerHTML = `
    <div class="pd-gallery">
      ${renderProductMedia(product, `pd-main-img ${getBackgroundClass(product.bg)}`)}
      <div class="pd-thumbs">
        ${renderProductMedia(product, `pd-thumb active ${getBackgroundClass(product.bg)}`, true)}
        <div class="pd-thumb pd-thumb-meta">📐</div>
        <div class="pd-thumb pd-thumb-meta">🏷️</div>
      </div>
    </div>
    <div class="pd-info">
      <button class="pd-back" type="button" data-page="boutique">← Retour à la boutique</button>
      ${product.badge ? `<div class="pd-badge">${product.badge}</div>` : ''}
      <h1 class="pd-title">${product.name}</h1>
      <div class="pd-technique">${product.technique} — par ${product.artisan}</div>
      <div class="pd-price">${product.price}€</div>
      <p class="pd-desc">${product.desc}</p>
      <div class="pd-specs">
        <div class="pd-spec"><span class="pd-spec-label">Matière</span><span class="pd-spec-value">${product.matiere}</span></div>
        <div class="pd-spec"><span class="pd-spec-label">Entretien</span><span class="pd-spec-value">${product.entretien}</span></div>
        <div class="pd-spec"><span class="pd-spec-label">Artisan</span><span class="pd-spec-value">${product.artisan}</span></div>
        <div class="pd-spec"><span class="pd-spec-label">Type</span><span class="pd-spec-value">Pièce unique</span></div>
      </div>
      <div class="pd-sizes">
        <div class="pd-sizes-label">Taille</div>
        <div class="pd-sizes-list">
          ${product.sizes.map((size, index) => `<button class="pd-size${index === 0 ? ' selected' : ''}" type="button" data-action="select-size">${size}</button>`).join('')}
        </div>
      </div>
      <div class="pd-actions">
        <button class="pd-btn-cart" type="button" data-action="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        <button class="pd-btn-fav${isFavorite ? ' faved' : ''}" type="button" data-action="toggle-fav-detail" data-id="${product.id}">${isFavorite ? '♥' : '♡'}</button>
      </div>
    </div>`;

  hydrateMediaFrames(detail);

  showPageHandler('product');
}

export function selectSize(button) {
  button.parentElement?.querySelectorAll('.pd-size').forEach((sizeButton) => {
    sizeButton.classList.remove('selected');
  });
  button.classList.add('selected');
}

export function addToCart(event, productId) {
  event?.stopPropagation();

  if (!state.cart.includes(productId)) {
    state.cart.push(productId);
    updateBadges();

    const button = event?.target;
    if (button instanceof HTMLElement) {
      const originalText = button.textContent;

      button.textContent = '✓ Ajouté';
      button.classList.add('is-added');

      window.setTimeout(() => {
        button.textContent = originalText || 'Ajouter au panier';
        button.classList.remove('is-added');
      }, 1500);
    }
  }
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter((id) => id !== productId);
  updateBadges();
  renderCart();
}

export function renderCart() {
  const content = document.getElementById('cartContent');
  if (!content) {
    return;
  }

  if (state.cart.length === 0) {
    content.innerHTML = `<div class="cart-empty"><span>🛒</span>Ton panier est vide.<br><br><button class="btn-primary" type="button" data-page="boutique">Voir la boutique</button></div>`;
    return;
  }

  const items = state.cart.map((id) => findProduct(id)).filter(Boolean);
  const total = items.reduce((sum, product) => sum + product.price, 0);

  content.innerHTML = items.map((product) => `
      <div class="cart-item">
        ${renderProductMedia(product, `cart-item-img ${getBackgroundClass(product.bg)}`, true)}
        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <p>${product.technique}</p>
        </div>
        <div class="cart-item-price">${product.price}€</div>
        <button class="cart-item-remove" type="button" data-action="remove-from-cart" data-id="${product.id}">✕</button>
      </div>`).join('') + `
      <div class="cart-total">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-price">${total}€</span>
      </div>
      <button class="cart-checkout">Commander</button>`;

  hydrateMediaFrames(content);
}

export function toggleFav(event, productId) {
  event?.stopPropagation();

  if (state.favorites.includes(productId)) {
    state.favorites = state.favorites.filter((id) => id !== productId);
  } else {
    state.favorites.push(productId);
  }

  updateBadges();
  renderBoutique();
}

export function toggleFavDetail(button, productId) {
  if (state.favorites.includes(productId)) {
    state.favorites = state.favorites.filter((id) => id !== productId);
    button.classList.remove('faved');
    button.textContent = '♡';
  } else {
    state.favorites.push(productId);
    button.classList.add('faved');
    button.textContent = '♥';
  }

  updateBadges();
}

export function removeFromFav(productId) {
  state.favorites = state.favorites.filter((id) => id !== productId);
  updateBadges();
  renderFavorites();
}

export function renderFavorites() {
  const content = document.getElementById('favContent');
  if (!content) {
    return;
  }

  if (state.favorites.length === 0) {
    content.innerHTML = `<div class="fav-empty"><span>♡</span>Aucun favori pour le moment.<br><br><button class="btn-primary" type="button" data-page="boutique">Découvrir la boutique</button></div>`;
    return;
  }

  const items = state.favorites.map((id) => findProduct(id)).filter(Boolean);

  content.innerHTML = items.map((product) => `
      <div class="fav-item">
        ${renderProductMedia(product, `fav-item-img ${getBackgroundClass(product.bg)}`, true)}
        <div class="fav-item-info" data-action="open-product" data-id="${product.id}" role="button" tabindex="0">
          <h3>${product.name}</h3>
          <p>${product.technique}</p>
        </div>
        <div class="fav-item-price">${product.price}€</div>
        <button class="fav-item-cartbtn" type="button" data-action="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        <button class="fav-item-remove" type="button" data-action="remove-from-fav" data-id="${product.id}">✕</button>
      </div>`).join('');

  hydrateMediaFrames(content);
}

export function initBoutiqueFilters() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((filterButton) => {
        filterButton.classList.remove('active');
      });
      button.classList.add('active');
    });
  });
}
