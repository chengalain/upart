import { state } from '../core/state.js';
import { fakeComments } from '../data/comments.js';

function getGradient(backgroundKey) {
  const gradients = {
    h1: 'linear-gradient(135deg, #D5D5D5, #333333)',
    h2: 'linear-gradient(135deg, #F7C4CF, #E0627A)',
    h3: 'linear-gradient(135deg, #4A4A4A, #1A1A1A)',
    h4: 'linear-gradient(135deg, #F2A0B0, #D44D67)',
    h5: 'linear-gradient(135deg, #E0E0E0, #2A2A2A)',
    h6: 'linear-gradient(135deg, #F7D4DC, #E8839A)',
    h7: 'linear-gradient(135deg, #3A3A3A, #1A1A1A)',
    h8: 'linear-gradient(135deg, #F0B8C4, #E0627A)',
    h9: 'linear-gradient(135deg, #D5D5D5, #4A4A4A)',
  };

  return gradients[backgroundKey] || gradients.h1;
}

export function openCreation(element) {
  const { dataset } = element;

  state.creationModal.backgroundKey = dataset.bg || '';
  state.creationModal.liked = false;
  state.creationModal.likes = Number(dataset.likes || 0);

  const modalImage = document.getElementById('modalImage');
  if (modalImage) {
    modalImage.style.background = getGradient(dataset.bg);
    modalImage.textContent = dataset.emoji || '';
  }

  const avatar = document.getElementById('modalAvatar');
  if (avatar) {
    avatar.textContent = dataset.initial || '';
    avatar.className = `creation-avatar ${dataset.avatar || ''}`;
  }

  const fieldMap = {
    modalAuthor: dataset.author,
    modalDate: dataset.date,
    modalTitle: dataset.title,
    modalDesc: dataset.desc,
    modalTechnique: `🛠 ${dataset.technique || ''}`,
    modalMatiere: `🧵 ${dataset.matiere || ''}`,
  };

  Object.entries(fieldMap).forEach(([fieldId, value]) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.textContent = value || '';
    }
  });

  const heart = document.getElementById('modalHeart');
  const likes = document.getElementById('modalLikes');
  const likeButton = document.getElementById('modalLikeBtn');
  if (heart) {
    heart.textContent = '♡';
  }
  if (likes) {
    likes.textContent = `${state.creationModal.likes} j'aime`;
  }
  likeButton?.classList.remove('liked');

  const commentsList = document.getElementById('modalComments');
  if (commentsList) {
    commentsList.innerHTML = (fakeComments[dataset.bg] || []).map((comment) => `
      <div class="comment">
        <div class="comment-avatar">${comment.initial}</div>
        <div class="comment-body">
          <div class="comment-author">${comment.author}</div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-time">${comment.time}</div>
        </div>
      </div>`).join('');
  }

  const commentInput = document.getElementById('commentInput');
  if (commentInput) {
    commentInput.value = '';
  }

  document.getElementById('creationModal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeCreation(event, force) {
  const modal = document.getElementById('creationModal');
  if (!modal) {
    return;
  }

  if (force || event?.target === modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

export function toggleModalLike(event) {
  event?.stopPropagation();

  state.creationModal.liked = !state.creationModal.liked;
  state.creationModal.likes += state.creationModal.liked ? 1 : -1;

  const heart = document.getElementById('modalHeart');
  const likes = document.getElementById('modalLikes');
  const button = document.getElementById('modalLikeBtn');

  if (heart) {
    heart.textContent = state.creationModal.liked ? '♥' : '♡';
  }

  if (likes) {
    likes.textContent = `${state.creationModal.likes} j'aime`;
  }

  button?.classList.toggle('liked', state.creationModal.liked);
}

export function addComment() {
  const input = document.getElementById('commentInput');
  const commentsList = document.getElementById('modalComments');
  const text = input?.value.trim() || '';

  if (!input || !commentsList || !text) {
    return;
  }

  const comment = document.createElement('div');
  comment.className = 'comment';
  comment.innerHTML = `
    <div class="comment-avatar" style="background:var(--accent);">T</div>
    <div class="comment-body">
      <div class="comment-author">Toi</div>
      <div class="comment-text">${text}</div>
      <div class="comment-time">À l'instant</div>
    </div>`;

  commentsList.appendChild(comment);
  commentsList.scrollTop = commentsList.scrollHeight;
  input.value = '';
}

export function initCreationModal() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCreation(null, true);
    }
  });
}
