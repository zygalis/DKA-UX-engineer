import { createTaskItem } from './taskItem.js';

export function createTaskListContainer(containerWrapper) {
  const newContainer = document.createElement('div');
  newContainer.classList.add('container');
  newContainer.setAttribute('data-modal', `modal-${Date.now()}`);

  const title = document.createElement('h2');
  title.className = 'editable-title';
  title.setAttribute('contenteditable', 'true');
  title.textContent = 'New Task List';

  const ul = document.createElement('ul');
  ul.appendChild(createTaskItem('First Task', 1));

  const addTaskBtn = document.createElement('button');
  addTaskBtn.className = 'add-task-button';
  addTaskBtn.textContent = 'Add Task';
  addTaskBtn.addEventListener('click', () => {
    const newTask = createTaskItem('New Task', 1);
    ul.insertBefore(newTask, ul.firstChild);
  });

  newContainer.append(title, ul, addTaskBtn);
  containerWrapper.appendChild(newContainer);
}