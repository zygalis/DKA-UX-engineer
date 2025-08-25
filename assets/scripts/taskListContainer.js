import { createTaskItem } from './taskItem.js';
import { addDeleteFunctionality } from './deleteTaskList.js';
import { createTaskFilter } from './taskFilter.js';
import { getTaskLists } from './localStorageHelpers.js';

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

  if (editMode) {
    // Create and style the Save button
    const saveButton = document.createElement('button');
    saveButton.className = 'save-task-button';
    saveButton.textContent = 'Save';
    saveButton.style.marginLeft = '10px'; // Add spacing for alignment
    saveButton.addEventListener('click', () => {
      const updatedName = newContainer.querySelector('.editable-title')?.textContent || 'Untitled Task List';
      const updatedTasks = Array.from(newContainer.querySelectorAll('ul li')).map(taskItem => {
        const taskNameElement = taskItem.querySelector('.task-name');
        const taskText = taskNameElement && taskNameElement.textContent.trim() !== '' 
          ? taskNameElement.textContent.trim() 
          : 'Unnamed Task';
        const taskStatus = parseInt(taskItem.getAttribute('data-status'), 10) || 1;

        return {
          text: taskText,
          status: taskStatus
        };
      });

      const taskLists = getTaskLists();
      const taskListIndex = taskLists.findIndex(list => list.name === taskListName);
      if (taskListIndex !== -1) {
        taskLists[taskListIndex] = { name: updatedName, tasks: updatedTasks };
      } else {
        taskLists.push({ name: updatedName, tasks: updatedTasks });
      }

      localStorage.setItem('taskLists', JSON.stringify(taskLists));
      console.log('Task list saved:', { name: updatedName, tasks: updatedTasks });
      alert('Task list saved successfully!');

      // Close and refresh the page
      taskListContainer.innerHTML = '';
      location.reload();
    });

    addTaskBtn.insertAdjacentElement('afterend', saveButton);
  } else {
    // Create and style the Create List button
    const createListButton = document.createElement('button');
    createListButton.className = 'create-list-button';
    createListButton.textContent = 'Create List';
    createListButton.style.marginLeft = '10px'; // Add spacing for alignment
    createListButton.addEventListener('click', () => {
      const newListName = newContainer.querySelector('.editable-title')?.textContent || 'New Task List';
      const newTasks = Array.from(newContainer.querySelectorAll('ul li')).map(taskItem => {
        const taskNameElement = taskItem.querySelector('.task-name');
        const taskText = taskNameElement && taskNameElement.textContent.trim() !== '' 
          ? taskNameElement.textContent.trim() 
          : 'Unnamed Task';
        const taskStatus = parseInt(taskItem.getAttribute('data-status'), 10) || 1;

        return {
          text: taskText,
          status: taskStatus
        };
      });

      const taskLists = getTaskLists();
      taskLists.push({ name: newListName, tasks: newTasks });
      localStorage.setItem('taskLists', JSON.stringify(taskLists));
      console.log('New task list created:', { name: newListName, tasks: newTasks });
      alert('New task list created successfully!');

      // Close and refresh the page
      taskListContainer.innerHTML = '';
      location.reload();
    });

    addTaskBtn.insertAdjacentElement('afterend', createListButton);
  }

  // Add close button to the task list container
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.classList.add('close-task-list-view-button');
  closeButton.addEventListener('click', () => {
    taskListContainer.innerHTML = '';
    location.reload(); // Refresh the page
  });

  // Style the close button to position it in the top-right corner
  closeButton.style.position = 'absolute';
  closeButton.style.top = '8px';
  closeButton.style.right = '8px';

  newContainer.appendChild(closeButton);

  // Return the newly created container
  return newContainer;
}