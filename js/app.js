import { addComment, closeCreation, initCreationModal, openCreation, toggleModalLike } from './modules/creations.js';
import { submitContact, submitNewsletter } from './modules/forms.js';
import { configureNavigation, initNavigation, showPage, toggleMenu } from './modules/navigation.js';
import {
  addToCart,
  initBoutiqueFilters,
  openProduct,
  removeFromCart,
  removeFromFav,
  renderBoutique,
  renderCart,
  renderFavorites,
  selectSize,
  setShopNavigator,
  toggleFav,
  toggleFavDetail,
  updateBadges,
} from './modules/shop.js';
import { initReviewsMarquee, initStaggeredAnimations } from './modules/ui.js';
import {
  closeResv,
  confirmResv,
  fakeLogin,
  goResvStep,
  initWorkshopInteractions,
  openResv,
  renderAteliers,
  selectDate,
  selectPersons,
} from './modules/workshops.js';

configureNavigation({
  panier: renderCart,
  favoris: renderFavorites,
  boutique: renderBoutique,
});

setShopNavigator(showPage);

renderAteliers();
renderBoutique();
updateBadges();
initNavigation();
initBoutiqueFilters();
initWorkshopInteractions();
initCreationModal();
initReviewsMarquee();
initStaggeredAnimations();

Object.assign(window, {
  addComment,
  addToCart,
  closeCreation,
  closeResv,
  confirmResv,
  fakeLogin,
  goResvStep,
  openCreation,
  openProduct,
  openResv,
  removeFromCart,
  removeFromFav,
  renderBoutique,
  renderCart,
  renderFavorites,
  selectDate,
  selectPersons,
  selectSize,
  showPage,
  submitContact,
  submitNewsletter,
  toggleFav,
  toggleFavDetail,
  toggleMenu,
  toggleModalLike,
  updateBadges,
});
