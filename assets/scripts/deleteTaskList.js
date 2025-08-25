export function addDeleteFunctionality(taskListContainer) {
  taskListContainer.querySelectorAll('.container').forEach(container => {
    if (!container.querySelector('.delete-task-list-button')) {
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-task-list-button';
      deleteButton.innerHTML = '&times;';
      deleteButton.setAttribute('aria-label', 'Delete this task list');

      deleteButton.addEventListener('click', () => {
        const confirmation = confirm('Are you sure you want to delete this task list?');
        if (confirmation) {
          container.remove();
        }
      });

      container.prepend(deleteButton);
    }
  });
}