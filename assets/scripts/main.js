import { createTaskListContainer } from './taskListContainer.js';

const taskListContainer = document.querySelector('.task-list-container');
const addNewButton = document.querySelector('.add-new-button');

// Create a live region for screen readers
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('role', 'status');
liveRegion.className = 'visually-hidden';
document.body.appendChild(liveRegion);

// Add new container on button click
addNewButton.addEventListener('click', () => {
  createTaskListContainer(taskListContainer);

   liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = 'New task list added';
    }, 100); // Delay to allow screen readers to detect the change
});