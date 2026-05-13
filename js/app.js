import { addComment, closeCreation, initCreationModal, openCreation, toggleModalLike } from './modules/creations.js';
import { initDialogAccessibility } from './modules/dialog.js';
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
import { hydrateMediaFrames, initReviewsMarquee, initStaggeredAnimations } from './modules/ui.js';
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
initDialogAccessibility();
initReviewsMarquee();
hydrateMediaFrames();
initStaggeredAnimations();

function getNumericData(element, key) {
  const value = element.dataset[key];
  return value ? Number(value) : NaN;
}

function initDelegatedInteractions() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.matches('#resvModal')) {
      closeResv(event);
      return;
    }

    if (target.matches('#creationModal')) {
      closeCreation(event);
      return;
    }

    const trigger = target.closest('[data-action], [data-page]');
    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();

    if (trigger.dataset.page) {
      showPage(trigger.dataset.page);
      return;
    }

    const action = trigger.dataset.action;
    switch (action) {
      case 'toggle-menu':
        toggleMenu();
        break;
      case 'submit-newsletter':
        submitNewsletter();
        break;
      case 'submit-contact':
        submitContact();
        break;
      case 'open-resv':
        openResv(getNumericData(trigger, 'id'), trigger);
        break;
      case 'close-resv':
        closeResv(event, trigger.dataset.force === 'true');
        break;
      case 'select-persons':
        selectPersons(getNumericData(trigger, 'value'));
        break;
      case 'go-resv-step':
        goResvStep(getNumericData(trigger, 'step'));
        break;
      case 'fake-login':
        fakeLogin();
        break;
      case 'confirm-resv':
        confirmResv();
        break;
      case 'select-date':
        selectDate(getNumericData(trigger, 'index'));
        break;
      case 'open-creation':
        openCreation(trigger);
        break;
      case 'close-creation':
        closeCreation(event, trigger.dataset.force === 'true');
        break;
      case 'toggle-modal-like':
        toggleModalLike(event);
        break;
      case 'add-comment':
        addComment();
        break;
      case 'open-product':
        openProduct(getNumericData(trigger, 'id'));
        break;
      case 'toggle-fav':
        toggleFav(event, getNumericData(trigger, 'id'));
        break;
      case 'toggle-fav-detail':
        toggleFavDetail(trigger, getNumericData(trigger, 'id'));
        break;
      case 'add-to-cart':
        addToCart(event, getNumericData(trigger, 'id'));
        break;
      case 'remove-from-cart':
        removeFromCart(getNumericData(trigger, 'id'));
        break;
      case 'remove-from-fav':
        removeFromFav(getNumericData(trigger, 'id'));
        break;
      case 'select-size':
        selectSize(trigger);
        break;
      default:
        break;
    }
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.id === 'commentInput' && event.key === 'Enter') {
      event.preventDefault();
      addComment();
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && target.matches('[role="button"][data-action], [role="button"][data-page]')) {
      event.preventDefault();
      target.click();
    }
  });
}

initDelegatedInteractions();
