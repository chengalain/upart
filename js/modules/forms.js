function setFeedbackState(element, state, text) {
  element.classList.remove('is-error', 'is-success');
  element.classList.add(state === 'error' ? 'is-error' : 'is-success');
  element.textContent = text;
}

export function submitNewsletter() {
  const emailField = document.getElementById('newsletterEmail');
  const message = document.getElementById('newsletterMsg');
  const email = emailField?.value.trim() || '';

  if (!message || !emailField) {
    return;
  }

  if (!email || !email.includes('@')) {
    setFeedbackState(message, 'error', "Merci d'entrer une adresse email valide.");
    return;
  }

  setFeedbackState(message, 'success', '✓ Merci ! Tu es bien inscrit(e) à la newsletter.');
  emailField.value = '';
}

export function submitContact() {
  const nameField = document.getElementById('contactName');
  const emailField = document.getElementById('contactEmail');
  const subjectField = document.getElementById('contactSubject');
  const messageField = document.getElementById('contactMessage');
  const feedback = document.getElementById('contactMsg');

  const name = nameField?.value.trim() || '';
  const email = emailField?.value.trim() || '';
  const subject = subjectField?.value || '';
  const message = messageField?.value.trim() || '';

  if (!feedback || !nameField || !emailField || !subjectField || !messageField) {
    return;
  }

  if (!name || !email || !subject || !message) {
    setFeedbackState(feedback, 'error', 'Merci de remplir tous les champs.');
    return;
  }

  if (!email.includes('@')) {
    setFeedbackState(feedback, 'error', 'Adresse email invalide.');
    return;
  }

  setFeedbackState(feedback, 'success', '✓ Message envoyé avec succès ! On te répond très vite.');
  nameField.value = '';
  emailField.value = '';
  subjectField.value = '';
  messageField.value = '';
}
