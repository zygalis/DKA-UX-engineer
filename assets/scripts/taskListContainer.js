import { createTaskItem } from './taskItem.js';

export function createTaskListContainer(taskListContainer) {
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

  // Create radio button filters
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container';

  const filters = [
    { value: '1', label: 'Not Started' },
    { value: '2', label: 'In Progress' },
    { value: '3', label: 'Completed' },
    { value: 'all', label: 'Show All' },
  ];

  filters.forEach(filter => {
    const label = document.createElement('label');
    label.className = 'filter-label';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `filter-${Date.now()}`;
    radio.value = filter.value;
    radio.className = 'filter-radio';

    if (filter.value === 'all') {
      radio.checked = true;
    }

    radio.addEventListener('change', () => {
      const status = radio.value;
      newContainer.querySelectorAll('li').forEach(task => {
        if (status === 'all') {
          task.style.display = 'block';
        } else {
          const taskStatus = task.getAttribute('data-status');
          task.style.display = taskStatus === status ? 'block' : 'none';
        }
      });
    });

    label.append(radio, document.createTextNode(filter.label));
    filterContainer.appendChild(label);
  });

  // Reorder elements for accessibility
  newContainer.append(title, addTaskBtn, filterContainer, ul);
  taskListContainer.appendChild(newContainer);

  // Ensure global click listener is added only once
  if (!document.body.hasAttribute('dropdown-listener')) {
    document.body.setAttribute('dropdown-listener', 'true');
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
    });
  }
}