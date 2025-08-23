export function openModal(container, modalBackground, containerWrapper) {
  container.classList.add('modal-open');
  modalBackground.style.display = 'block';
  containerWrapper.classList.add('dimmed');
}

export function closeModal(modalBackground, containerWrapper) {
  const openContainer = document.querySelector('.container.modal-open');
  if (openContainer) openContainer.classList.remove('modal-open');
  modalBackground.style.display = 'none';
  containerWrapper.classList.remove('dimmed');
}