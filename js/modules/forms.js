export function submitNewsletter() {
  const emailField = document.getElementById('newsletterEmail');
  const message = document.getElementById('newsletterMsg');
  const email = emailField?.value.trim() || '';

  if (!message || !emailField) {
    return;
  }

  if (!email || !email.includes('@')) {
    message.style.color = '#E8A58C';
    message.textContent = "Merci d'entrer une adresse email valide.";
    return;
  }

  message.style.color = '#A8C5AB';
  message.textContent = '✓ Merci ! Tu es bien inscrit(e) à la newsletter.';
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
    feedback.style.color = '#E0627A';
    feedback.textContent = 'Merci de remplir tous les champs.';
    return;
  }

  if (!email.includes('@')) {
    feedback.style.color = '#E0627A';
    feedback.textContent = 'Adresse email invalide.';
    return;
  }

  feedback.style.color = '#5A7A5E';
  feedback.textContent = '✓ Message envoyé avec succès ! On te répond très vite.';
  nameField.value = '';
  emailField.value = '';
  subjectField.value = '';
  messageField.value = '';
}
