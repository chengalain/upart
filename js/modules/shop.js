import { state } from '../core/state.js';
import { products } from '../data/products.js';

let showPageHandler = () => {};

export function setShopNavigator(handler) {
  showPageHandler = typeof handler === 'function' ? handler : () => {};
}

function getProductGradient(backgroundKey) {
  const gradients = {
    p1: 'linear-gradient(135deg, #F7C4CF, #E0627A)',
    p2: 'linear-gradient(135deg, #D5D5D5, #333333)',
    p3: 'linear-gradient(135deg, #F2A0B0, #D44D67)',
    p4: 'linear-gradient(135deg, #4A4A4A, #1A1A1A)',
    p5: 'linear-gradient(135deg, #F7D4DC, #E8839A)',
    p6: 'linear-gradient(135deg, #E0E0E0, #2A2A2A)',
  };

  return gradients[backgroundKey] || gradients.p1;
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
      <div class="product-card" onclick="openProduct(${product.id})">
        <div class="product-img" style="background:${getProductGradient(product.bg)};height:340px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;">${product.emoji}</div>
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <button class="product-wishlist" onclick="toggleFav(event, ${product.id})">${isFavorite ? '♥' : '♡'}</button>
        <div class="product-body">
          <h3>${product.name}</h3>
          <div class="product-technique">${product.technique}</div>
          <div class="product-footer">
            <div class="product-price">${product.price}€</div>
            <div class="product-sizes">${product.sizes.join(', ')}</div>
          </div>
          <button class="btn-cart" onclick="addToCart(event, ${product.id})">Ajouter au panier</button>
        </div>
      </div>`;
  }).join('');
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
      <div class="pd-main-img" style="background:${getProductGradient(product.bg)}">${product.emoji}</div>
      <div class="pd-thumbs">
        <div class="pd-thumb active" style="background:${getProductGradient(product.bg)}">${product.emoji}</div>
        <div class="pd-thumb" style="background:var(--bg);font-size:1.2rem;">📐</div>
        <div class="pd-thumb" style="background:var(--bg);font-size:1.2rem;">🏷️</div>
      </div>
    </div>
    <div class="pd-info">
      <button class="pd-back" onclick="showPage('boutique')">← Retour à la boutique</button>
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
          ${product.sizes.map((size, index) => `<button class="pd-size${index === 0 ? ' selected' : ''}" onclick="selectSize(this)">${size}</button>`).join('')}
        </div>
      </div>
      <div class="pd-actions">
        <button class="pd-btn-cart" onclick="addToCart(event, ${product.id})">Ajouter au panier</button>
        <button class="pd-btn-fav${isFavorite ? ' faved' : ''}" onclick="toggleFavDetail(this, ${product.id})">${isFavorite ? '♥' : '♡'}</button>
      </div>
    </div>`;

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
      const originalBackground = button.style.background;
      const originalColor = button.style.color;

      button.textContent = '✓ Ajouté';
      button.style.background = 'var(--text)';
      button.style.color = 'white';

      window.setTimeout(() => {
        button.textContent = originalText || 'Ajouter au panier';
        button.style.background = originalBackground;
        button.style.color = originalColor;
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
    content.innerHTML = `<div class="cart-empty"><span>🛒</span>Ton panier est vide.<br><br><button class="btn-primary" onclick="showPage('boutique')">Voir la boutique</button></div>`;
    return;
  }

  const items = state.cart.map((id) => findProduct(id)).filter(Boolean);
  const total = items.reduce((sum, product) => sum + product.price, 0);

  content.innerHTML = items.map((product) => `
      <div class="cart-item">
        <div class="cart-item-img" style="background:${getProductGradient(product.bg)}">${product.emoji}</div>
        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <p>${product.technique}</p>
        </div>
        <div class="cart-item-price">${product.price}€</div>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})">✕</button>
      </div>`).join('') + `
      <div class="cart-total">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-price">${total}€</span>
      </div>
      <button class="cart-checkout">Commander</button>`;
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
    content.innerHTML = `<div class="fav-empty"><span>♡</span>Aucun favori pour le moment.<br><br><button class="btn-primary" onclick="showPage('boutique')">Découvrir la boutique</button></div>`;
    return;
  }

  const items = state.favorites.map((id) => findProduct(id)).filter(Boolean);

  content.innerHTML = items.map((product) => `
      <div class="fav-item">
        <div class="fav-item-img" style="background:${getProductGradient(product.bg)}">${product.emoji}</div>
        <div class="fav-item-info" style="cursor:pointer" onclick="openProduct(${product.id})">
          <h3>${product.name}</h3>
          <p>${product.technique}</p>
        </div>
        <div class="fav-item-price">${product.price}€</div>
        <button class="fav-item-cartbtn" onclick="addToCart(event, ${product.id})">Ajouter au panier</button>
        <button class="fav-item-remove" onclick="removeFromFav(${product.id})">✕</button>
      </div>`).join('');
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
