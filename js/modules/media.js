function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getFileName(path) {
  return path.split('/').pop() || path;
}

export function renderMediaMarkup({ wrapperClass = '', imageClass = '', src = '', alt = '', compact = false } = {}) {
  const frameClassName = [wrapperClass, 'media-frame'].filter(Boolean).join(' ');
  const imageClassName = ['media-image', imageClass].filter(Boolean).join(' ');
  const placeholderClassName = ['media-placeholder', compact ? 'media-placeholder-compact' : ''].filter(Boolean).join(' ');

  return `
    <div class="${frameClassName}" data-media-frame>
      <img class="${imageClassName}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" data-media-image>
      <div class="${placeholderClassName}" aria-hidden="true">
        <span class="media-placeholder-kicker">Ajoute l'image</span>
        <strong class="media-placeholder-name">${escapeHtml(getFileName(src))}</strong>
        <small class="media-placeholder-path">${escapeHtml(src)}</small>
      </div>
    </div>`;
}