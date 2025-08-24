import { createTaskListContainer } from './taskListContainer.js';

const taskListContainer = document.querySelector('.task-list-container');
const addNewButton = document.querySelector('.add-new-button');

// Add new container on button click
addNewButton.addEventListener('click', () => createTaskListContainer(taskListContainer));