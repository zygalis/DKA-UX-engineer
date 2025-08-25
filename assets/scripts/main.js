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

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.classList.add('close-task-list-view-button');
  closeButton.addEventListener('click', () => {
    taskListView.classList.remove('active');

    const updatedName = taskListElement.querySelector('.editable-title')?.textContent || 'Untitled Task List';
 
    const updatedTasks = Array.from(taskListElement.querySelectorAll('ul li')).map(taskItem => {
      const taskNameElement = taskItem.querySelector('.task-text');

      const taskText = taskNameElement && taskNameElement.textContent.trim() !== '' 
        ? taskNameElement.textContent.trim() 
        : 'Unnamed Task';
      const taskStatus = taskItem.getAttribute('data-status') || 'pending';

      return {
        text: taskText,
        status: taskStatus
      };
    });

    newTaskList.name = updatedName;
    newTaskList.tasks = updatedTasks;

    const taskLists = getTaskLists();
    taskLists.push(newTaskList);
    localStorage.setItem('taskLists', JSON.stringify(taskLists));
    console.log('Updated task list saved to local storage:', newTaskList);
  });
  taskListView.appendChild(closeButton);

  // Update the live region for screen readers
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = 'New task list added';
  }, 100); // Delay to allow screen readers to detect the change
});