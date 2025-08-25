import { createTaskItem } from './taskItem.js';
import { addDeleteFunctionality } from './deleteTaskList.js';

export function createTaskListContainer(taskListContainer) {
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
  title.textContent = 'New Task List';

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

  const filterFieldset = document.createElement('fieldset');
  filterFieldset.className = 'filter-fieldset';
  filterFieldset.setAttribute('aria-label', 'Task Filters');

  const legend = document.createElement('legend');
  legend.textContent = 'Filter tasks by status';
  filterFieldset.appendChild(legend);

  const filters = [
    { value: 'all', label: 'Show All' },
    { value: '1', label: 'Not Started' },
    { value: '2', label: 'In Progress' },
    { value: '3', label: 'Completed' },
  ];

  const radioGroupName = `filter-group`;

  filters.forEach(filter => {
    const label = document.createElement('label');
    label.className = 'filter-label';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = radioGroupName;
    radio.value = filter.value;
    radio.className = 'filter-radio';
    radio.setAttribute('tabindex', '0');
    radio.setAttribute('aria-label', filter.label);

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
    filterFieldset.appendChild(label);
  });

  // Add keyboard navigation for radio buttons
  filterFieldset.addEventListener('keydown', (event) => {
    const radios = Array.from(filterFieldset.querySelectorAll('.filter-radio'));
    const currentIndex = radios.indexOf(document.activeElement);

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % radios.length;
      radios[nextIndex].focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + radios.length) % radios.length;
      radios[prevIndex].focus();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (currentIndex !== -1) {
        radios[currentIndex].checked = true;
        radios[currentIndex].dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  newContainer.append(title, filterFieldset, addTaskBtn, ul);
  taskListContainer.appendChild(newContainer);

  // Call the delete functionality after creating the task list container
  addDeleteFunctionality(taskListContainer);
}