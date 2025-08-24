import { createTaskListContainer } from './taskListContainer.js';

const containerWrapper = document.querySelector('.container-wrapper');
const addNewButton = document.querySelector('.add-new-button');

// Add new container on button click
addNewButton.addEventListener('click', () => createTaskListContainer(containerWrapper));

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
});