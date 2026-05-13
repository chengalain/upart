import { state } from '../core/state.js';
import { ateliers } from '../data/ateliers.js';
import { closeDialog, openDialog } from './dialog.js';
import { renderMediaMarkup } from './media.js';
import { hydrateMediaFrames } from './ui.js';

function getReservationState() {
  return state.reservation;
}

function getSelectedAtelier() {
  return getReservationState().atelier;
}

function setModalScrollLock(isLocked) {
  document.body.classList.toggle('modal-open', isLocked);
}

function updateReservationProgress(step, { complete = false } = {}) {
  const progressBar = document.getElementById('resvProgressBar');
  if (!progressBar) {
    return;
  }

  progressBar.classList.remove('step-1', 'step-2', 'step-3', 'step-4', 'is-complete');
  progressBar.classList.add(`step-${step}`);

  if (complete) {
    progressBar.classList.add('is-complete');
  }
}

function setReservationStepVisibility(activeStep, showDone = false) {
  for (let index = 1; index <= 4; index += 1) {
    const stepElement = document.getElementById(`resvStep${index}`);
    if (stepElement) {
      stepElement.classList.toggle('is-hidden', index !== activeStep);
      stepElement.setAttribute('aria-hidden', String(index !== activeStep));
    }
  }

  const doneElement = document.getElementById('resvStepDone');
  if (doneElement) {
    doneElement.classList.toggle('is-hidden', !showDone);
    doneElement.setAttribute('aria-hidden', String(!showDone));
  }
}

function renderResvDates() {
  const reservation = getReservationState();
  const atelier = getSelectedAtelier();
  const datesElement = document.getElementById('resvDates');

  if (!atelier || !datesElement) {
    return;
  }

  datesElement.innerHTML = atelier.dates.map((date, index) => {
    const isLow = date.left <= 5;
    const isSelected = reservation.date === index ? ' selected' : '';

    return `
      <button class="resv-date-option${isSelected}" type="button" data-action="select-date" data-index="${index}" aria-pressed="${reservation.date === index}">
        <div class="resv-date-left">
          <div class="resv-date-icon">📅</div>
          <div class="resv-date-info">
            <span>${date.label}</span>
            <small>${date.time} — ${atelier.location}</small>
          </div>
        </div>
        <span class="resv-date-places${isLow ? ' low' : ''}">${isLow ? '🔥 ' : ''}${date.left} places</span>
      </button>`;
  }).join('');
}

function renderResvRecap() {
  const reservation = getReservationState();
  const atelier = getSelectedAtelier();
  const recap = document.getElementById('resvRecap');

  if (!atelier || reservation.date === null || !recap) {
    return;
  }

  const selectedDate = atelier.dates[reservation.date];
  const name = document.getElementById('resvName')?.value.trim() || '';
  const email = document.getElementById('resvEmail')?.value.trim() || '';
  const total = atelier.price * reservation.persons;

  recap.innerHTML = `
    <div class="resv-recap-row"><span class="resv-recap-label">Atelier</span><span class="resv-recap-value">${atelier.title}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Date</span><span class="resv-recap-value">${selectedDate.label}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Horaire</span><span class="resv-recap-value">${selectedDate.time}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Lieu</span><span class="resv-recap-value">${atelier.type === 'online' ? '💻 ' : '📍 '}${atelier.location}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Participants</span><span class="resv-recap-value">${reservation.persons} personne${reservation.persons > 1 ? 's' : ''}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Nom</span><span class="resv-recap-value">${name}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Email</span><span class="resv-recap-value">${email}</span></div>
    <div class="resv-recap-row"><span class="resv-recap-label">Prix unitaire</span><span class="resv-recap-value">${atelier.price}€ /pers</span></div>
    <div class="resv-recap-total"><span class="resv-recap-label">Total</span><span class="resv-recap-value">${total}€</span></div>
  `;
}

export function renderAteliers() {
  const grid = document.getElementById('ateliersGrid');
  if (!grid) {
    return;
  }

  grid.innerHTML = ateliers.map((atelier) => {
    const firstDate = atelier.dates[0];
    const [, day, month] = firstDate.label.split(' ');

    return `
      <div class="atelier-card">
        ${renderMediaMarkup({
          wrapperClass: `atelier-cover ${atelier.type}`,
          src: atelier.image,
          alt: atelier.title,
        })}
        <div class="atelier-header">
          <div class="atelier-date"><div class="day">${day}</div><div class="month">${month}</div></div>
          <span class="atelier-badge ${atelier.type === 'online' ? 'online' : 'offline'}">${atelier.type === 'online' ? 'En ligne' : 'Présentiel'}</span>
        </div>
        <div class="atelier-body">
          <h3>${atelier.title}</h3>
          <p>${atelier.desc}</p>
          <div class="atelier-info">
            <span>${atelier.type === 'online' ? '💻' : '📍'} ${atelier.location}</span>
            <span>👥 ${atelier.places} places</span>
            <span>⏱ ${atelier.duration}</span>
          </div>
          <div class="atelier-footer">
            <div class="atelier-price">${atelier.price}€ <small>/pers</small></div>
            <button class="btn-sm" type="button" data-action="open-resv" data-id="${atelier.id}">Réserver</button>
          </div>
        </div>
      </div>`;
  }).join('');

  hydrateMediaFrames(grid);
}

export function openResv(id, trigger) {
  const reservation = getReservationState();
  reservation.atelier = ateliers.find((atelier) => atelier.id === id) || null;

  if (!reservation.atelier) {
    return;
  }

  reservation.persons = 0;
  reservation.date = null;
  reservation.step = 1;
  reservation.loggedIn = false;

  ['resvName', 'resvEmail', 'resvPhone'].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = '';
      field.classList.remove('form-field-highlighted');
    }
  });

  const message = document.getElementById('resvFormMsg');
  if (message) {
    message.textContent = '';
  }

  document.querySelectorAll('.resv-person-btn').forEach((button) => {
    button.classList.remove('selected');
  });

  goResvStep(1);
  const modal = document.getElementById('resvModal');
  modal?.classList.add('open');
  setModalScrollLock(true);
  if (modal) {
    openDialog(modal, { trigger, initialFocusSelector: '[data-action="close-resv"]' });
  }
}

export function closeResv(event, force) {
  const modal = document.getElementById('resvModal');
  if (!modal) {
    return;
  }

  if (force || (event && event.target === modal)) {
    modal.classList.remove('open');
    setModalScrollLock(false);
    closeDialog(modal);
  }
}

export function goResvStep(step) {
  const reservation = getReservationState();

  if (step === 4 && !reservation.loggedIn) {
    const name = document.getElementById('resvName')?.value.trim() || '';
    const email = document.getElementById('resvEmail')?.value.trim() || '';
    const phone = document.getElementById('resvPhone')?.value.trim() || '';
    const message = document.getElementById('resvFormMsg');

    if (!name || !email || !phone) {
      if (message) {
        message.textContent = 'Merci de remplir tous les champs.';
      }
      return;
    }

    if (!email.includes('@')) {
      if (message) {
        message.textContent = 'Adresse email invalide.';
      }
      return;
    }

    if (message) {
      message.textContent = '';
    }
  }

  reservation.step = step;

  setReservationStepVisibility(step);
  updateReservationProgress(step);

  document.querySelectorAll('.resv-step-dot').forEach((dot) => {
    const dotStep = Number(dot.dataset.step);
    dot.classList.remove('active', 'done');
    dot.removeAttribute('aria-current');

    if (dotStep === step) {
      dot.classList.add('active');
      dot.setAttribute('aria-current', 'step');
    } else if (dotStep < step) {
      dot.classList.add('done');
    }
  });

  if (step === 2) {
    renderResvDates();
  }

  if (step === 4) {
    renderResvRecap();
  }
}

export function selectPersons(count) {
  const reservation = getReservationState();
  reservation.persons = count;

  document.querySelectorAll('.resv-person-btn').forEach((button, index) => {
    button.classList.toggle('selected', index + 1 === count);
    button.setAttribute('aria-pressed', String(index + 1 === count));
  });

  window.setTimeout(() => goResvStep(2), 300);
}

export function selectDate(index) {
  const reservation = getReservationState();
  reservation.date = index;
  renderResvDates();
  window.setTimeout(() => goResvStep(3), 300);
}

export function fakeLogin() {
  const reservation = getReservationState();
  reservation.loggedIn = true;

  const defaults = {
    resvName: 'Marie Dupont',
    resvEmail: 'marie@email.com',
    resvPhone: '06 12 34 56 78',
  };

  Object.entries(defaults).forEach(([fieldId, value]) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = value;
      field.classList.add('form-field-highlighted');
    }
  });
}

export function confirmResv() {
  setReservationStepVisibility(null, true);
  updateReservationProgress(4, { complete: true });
  document.querySelectorAll('.resv-step-dot').forEach((dot) => {
    dot.classList.add('done');
    dot.removeAttribute('aria-current');
  });
}

export function initWorkshopInteractions() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('resvModal')?.classList.contains('open')) {
      closeResv(null, true);
    }
  });
}
