import { createTaskListContainer } from './taskListContainer.js';
import { getTaskLists } from './localStorageHelpers.js';
import { createTaskItem } from './taskItem.js';

const taskListContainer = document.querySelector('.task-list-container');
const addNewButton = document.querySelector('.add-new-button');
const taskListView = document.querySelector('.task-list-view');

// Create a live region for screen readers
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('role', 'status');
liveRegion.className = 'visually-hidden';
document.body.appendChild(liveRegion);

// Load task lists from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const taskLists = getTaskLists();
  taskLists.forEach((taskList) => {
    const taskListElement = createTaskListContainer(taskListContainer, taskList.name);
    taskList.tasks.forEach((task) => {
      const taskItem = createTaskItem(task.text, task.status);
      taskListElement.querySelector('ul').appendChild(taskItem);
    });
  });
});

// Add new container on button click
addNewButton.addEventListener('click', () => {
  taskListContainer.innerHTML = '';

  const newTaskList = { name: 'New Task List', tasks: [] };
  const taskListElement = createTaskListContainer(taskListContainer, newTaskList.name);

  taskListView.classList.add('active');

  // Update the live region for screen readers
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = 'New task list added';
  }, 100); // Delay to allow screen readers to detect the change
});