import { createTaskItem } from './taskItem.js';
import { addDeleteFunctionality } from './deleteTaskList.js';
import { createTaskFilter } from './taskFilter.js';

export function createTaskListContainer(taskListContainer, taskListName = 'New Task List', editMode = false) {
  const newContainer = document.createElement('div');
  newContainer.classList.add('container');
  newContainer.classList.add('full-width');
  newContainer.setAttribute('data-modal', `modal-${Date.now()}`);

  // Create a live region for screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');
  liveRegion.className = 'visually-hidden';
  newContainer.appendChild(liveRegion);

  const title = document.createElement('h2');
  title.className = 'editable-title';
  title.setAttribute('contenteditable', 'true');
  title.textContent = taskListName;

  const ul = document.createElement('ul');
  ul.appendChild(createTaskItem('Newly added task item', 1));

  const addTaskBtn = document.createElement('button');
  addTaskBtn.className = 'add-task-button';
  addTaskBtn.textContent = 'Add Task';
  addTaskBtn.addEventListener('click', () => {
    const newTask = createTaskItem('Newly added task item', 1);
    ul.insertBefore(newTask, ul.firstChild);
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = 'New task item added';
    }, 100); // Delay to allow screen readers to detect the change
  });

  const filterFieldset = createTaskFilter(newContainer);

  newContainer.append(title, filterFieldset, addTaskBtn, ul);
  taskListContainer.appendChild(newContainer);

  // Call the delete functionality after creating the task list container
  addDeleteFunctionality(taskListContainer);

  // Return the newly created container
  return newContainer;
}