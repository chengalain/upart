const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

let activeDialog = null;
let previousFocusedElement = null;

function isFocusableElement(element) {
  return element instanceof HTMLElement
    && !element.hasAttribute('hidden')
    && element.getAttribute('aria-hidden') !== 'true'
    && !element.classList.contains('is-hidden')
    && element.getClientRects().length > 0;
}

function getFocusableElements(dialog) {
  return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusableElement);
}

function getInitialFocusTarget(dialog, initialFocusSelector) {
  if (initialFocusSelector) {
    const matchedElement = dialog.querySelector(initialFocusSelector);
    if (matchedElement instanceof HTMLElement) {
      return matchedElement;
    }
  }

  return getFocusableElements(dialog)[0] || dialog;
}

function trapFocus(event) {
  if (event.key !== 'Tab' || !(activeDialog instanceof HTMLElement)) {
    return;
  }

  const focusableElements = getFocusableElements(activeDialog);
  if (focusableElements.length === 0) {
    event.preventDefault();
    activeDialog.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const currentElement = document.activeElement;

  if (!(currentElement instanceof HTMLElement) || !activeDialog.contains(currentElement)) {
    event.preventDefault();
    firstElement.focus();
    return;
  }

  if (event.shiftKey && currentElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && currentElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

export function initDialogAccessibility() {
  document.addEventListener('keydown', trapFocus);
}

export function openDialog(dialog, { trigger, initialFocusSelector } = {}) {
  previousFocusedElement = trigger instanceof HTMLElement
    ? trigger
    : document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  activeDialog = dialog;
  dialog.setAttribute('aria-hidden', 'false');

  const focusTarget = getInitialFocusTarget(dialog, initialFocusSelector);
  window.requestAnimationFrame(() => {
    focusTarget.focus({ preventScroll: true });
  });
}

export function closeDialog(dialog, { restoreFocus = true } = {}) {
  dialog.setAttribute('aria-hidden', 'true');

  if (activeDialog === dialog) {
    activeDialog = null;
  }

  const focusTarget = previousFocusedElement;
  previousFocusedElement = null;

  if (restoreFocus && focusTarget instanceof HTMLElement && focusTarget.isConnected) {
    window.requestAnimationFrame(() => {
      focusTarget.focus({ preventScroll: true });
    });
  }
}