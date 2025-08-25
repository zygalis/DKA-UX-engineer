import { saveTaskLists } from './localStorageHelpers.js';

export const statuses = [
  { class: 'status-1', label: 'Status: Not Started', icon: '⚪' },
  { class: 'status-2', label: 'Status: In Progress', icon: '⏳' },
  { class: 'status-3', label: 'Status: Completed', icon: '✔️' },
];

// Function to create a task item
export function createTaskItem(text = '', status = 1) {
  if (status < 1 || status > statuses.length || isNaN(status)) {
    console.warn(`Invalid status: ${status}. Defaulting to 1.`);
    status = 1; // Default to 'Not Started' if the status is invalid
  }

  // Create a live region for screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');
  liveRegion.className = 'visually-hidden';
  document.body.appendChild(liveRegion);

  const li = document.createElement('li');
  li.className = `status-${status}`;
  li.setAttribute('data-status', status);
  li.setAttribute('aria-label', statuses[status - 1].label);

  // Function to update the status of a task
  function updateTaskStatus(li, statusToggle, nextStatus) {
    li.className = `status-${nextStatus}`;
    li.setAttribute('data-status', nextStatus);
    li.setAttribute('aria-label', statuses[nextStatus - 1].label);
    statusToggle.textContent = statuses[nextStatus - 1].icon;
    statusToggle.setAttribute('aria-label', `Task status toggle: Current status is ${statuses[nextStatus - 1].label}. Change status to ${statuses[nextStatus % 3].label}`);
  }

  // Function to handle status toggle click
  function handleStatusToggleClick(e, li, statusToggle) {
    e.stopPropagation();
    const currentStatus = parseInt(li.getAttribute('data-status'), 10);
    const nextStatus = currentStatus === 3 ? 1 : currentStatus + 1;
    updateTaskStatus(li, statusToggle, nextStatus);

    // Notify taskListView.js about the status change
    const ul = li.closest('ul');
    if (ul) {
      const index = Array.from(ul.children).indexOf(li);
      const event = new CustomEvent('statusChange', {
        detail: { index, nextStatus },
      });
      ul.dispatchEvent(event);
    }
  }

  // Create the status toggle
  function createStatusToggle(li, status) {
    const statusToggle = document.createElement('span');
    statusToggle.className = 'status-toggle';
    statusToggle.setAttribute('role', 'button');
    statusToggle.setAttribute('aria-label', `Change status to ${statuses[status - 1].label}`);
    statusToggle.setAttribute('tabindex', '0'); // Make the element focusable
    statusToggle.textContent = statuses[status - 1].icon;

    statusToggle.addEventListener('click', (e) => handleStatusToggleClick(e, li, statusToggle));

    // Add keyboard support for Enter and Space keys
    statusToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStatusToggleClick(e, li, statusToggle);
      }
    });

    return statusToggle;
  }

  // Create the status toggle and task text
  const statusToggle = createStatusToggle(li, status);

  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = text;
  taskText.setAttribute('contenteditable', 'true');
  taskText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTask = createTaskItem();
      li.parentElement.insertBefore(newTask, li.nextSibling);
      newTask.querySelector('.task-text').focus();
      liveRegion.textContent = 'New task item added';
    }
  });

  // Notify screen readers and save tasks when a new task is added
  taskText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      liveRegion.textContent = 'New task item added';
      saveTaskLists(document.querySelectorAll('.task-list'));
    }
  });

  // Create the remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-task-button';
  removeBtn.innerHTML = '&times;';

  // Append a visually hidden text for screen readers
  const hiddenText = document.createElement('span');
  hiddenText.className = 'visually-hidden';
  hiddenText.textContent = 'Remove task'; // Accessible label for screen readers
  removeBtn.appendChild(hiddenText);

  // Add click event listener to remove the task
  removeBtn.addEventListener('click', () => {
    li.remove();
    saveTaskLists(document.querySelectorAll('.task-list'));
    liveRegion.textContent = 'Task removed';
  });

  // Append elements to the list item
  li.append(statusToggle, taskText, removeBtn);
  return li;
}