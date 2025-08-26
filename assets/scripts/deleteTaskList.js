import { getTaskLists, saveToLocalStorage } from './localStorageHelpers.js';

export function addDeleteFunctionality(taskListContainer) {
  taskListContainer.querySelectorAll('.delete-task-list-button').forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      const confirmation = confirm('Are you sure you want to delete this task list?');
      if (confirmation) {
        const container = deleteButton.closest('.container');
        const taskListName = container.querySelector('h2').textContent;

        // Retrieve current task lists
        const taskLists = getTaskLists();

        // Remove the task list from the array
        const updatedTaskLists = taskLists.filter(taskList => taskList.name !== taskListName);

        // Save the updated list back to local storage
        saveToLocalStorage('taskLists', updatedTaskLists);

        // Remove the task list from the DOM
        container.remove();
      }
    });
  });
}