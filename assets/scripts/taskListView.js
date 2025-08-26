import { createTaskListContainer } from './taskListContainer.js';
import { statuses } from './taskItem.js';
import { getTaskLists, saveToLocalStorage } from './localStorageHelpers.js';

document.addEventListener("DOMContentLoaded", () => {
  const taskListView = document.querySelector(".task-list-view");
  if (!taskListView) {
    console.error(".task-list-view element not found in the DOM.");
    return;
  }
  const taskListContainer = document.querySelector(".task-list-container");
  const mainViewContainer = document.querySelector(".task-list-container-main-view");

  // Retrieve saved task lists from local storage
  const savedTaskLists = getTaskLists();

  savedTaskLists.forEach((taskList) => {
    const taskListElement = document.createElement("div");
    taskListElement.classList.add("task-list-item");

    // Set the title of the task list
    const title = document.createElement("h3");
    title.textContent = taskList.name;
    taskListElement.appendChild(title);

    // Add a button to open the detailed view
    const openButton = document.createElement("button");
    openButton.textContent = "Open Task List";  
    openButton.classList.add('open-button');
        // Add focus event for audio cue on the open button
    openButton.addEventListener("focus", () => {
      const focusUtterance = new SpeechSynthesisUtterance(`Focus on Open Task List button for: ${taskList.name}`);
      speechSynthesis.speak(focusUtterance);
    });
    openButton.addEventListener("click", () => {
      taskListView.classList.add("active");

      // Clear the detailed view container
      taskListContainer.innerHTML = "";

      const newContainer = createTaskListContainer(taskListContainer, taskList.name, true);

      // Set the title and tasks for the selected task list
      const titleElement = newContainer.querySelector(".editable-title");
      const ul = newContainer.querySelector("ul");

      titleElement.textContent = taskList.name;
      ul.innerHTML = ""; // Clear existing tasks
      taskList.tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = `status-${task.status}`;
        taskItem.setAttribute("data-status", task.status);

        const taskText = document.createElement("div");
        taskText.classList.add("task-text");
        taskText.setAttribute("contenteditable", "true");
        taskText.textContent = task.text || '';

        // Add status icon to the task item
        const statusIcon = document.createElement("span");
        statusIcon.className = `status-icon status-${task.status}`;
        statusIcon.textContent = statuses[task.status - 1].icon; // Set default value
        taskItem.prepend(statusIcon);

        // Add interactivity to the status icon
        statusIcon.classList.add('status-toggle');
        statusIcon.setAttribute('role', 'button');
        statusIcon.setAttribute('tabindex', '0');
        statusIcon.setAttribute('aria-label', `Change status. Current status: ${statuses[task.status - 1].label}`);

        statusIcon.addEventListener('click', () => {
          const currentStatus = parseInt(taskItem.getAttribute('data-status'), 10);
          const nextStatus = currentStatus === statuses.length ? 1 : currentStatus + 1;

          taskItem.className = `status-${nextStatus}`;
          taskItem.setAttribute('data-status', nextStatus);
          statusIcon.className = `status-icon status-${nextStatus} status-toggle`;
          statusIcon.textContent = statuses[nextStatus - 1].icon;
          statusIcon.setAttribute('aria-label', `Change status. Current status: ${statuses[nextStatus - 1].label}`);
        });

        // Add keyboard support for status icon
        statusIcon.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            statusIcon.click();
          }
        });

        // Wrap status toggle and task name in a flex container
        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content'); // Add a class for styling

        taskContent.style.display = 'flex'; // Ensure horizontal alignment
        taskContent.style.alignItems = 'center'; // Vertically center the content

        taskContent.appendChild(statusIcon);
        taskContent.appendChild(taskText);

        taskItem.appendChild(taskContent);
        ul.appendChild(taskItem);
      });

      // Show the detailed view
      taskListView.classList.add("active");

      // Add the close-task-list-view-button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.classList.add('close-task-list-view-button');
      closeButton.addEventListener('click', () => {
        taskListView.classList.remove('active');
      });
      taskListView.appendChild(closeButton);
    });

    taskListElement.appendChild(openButton);

    // Add delete button next to the open button during initial rendering
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-task-list-button');
    deleteButton.innerHTML = '🗑️'; // Trashcan icon
    deleteButton.setAttribute('aria-label', 'Delete this task list');
    deleteButton.style.marginLeft = '10px'; // Add spacing between buttons
    deleteButton.addEventListener('click', () => {
      const confirmation = confirm('Are you sure you want to delete this task list?');
      if (confirmation) {
        const taskListName = taskList.name;

        // Remove the task list from the DOM
        taskListElement.remove();

        // Update local storage
        const taskLists = getTaskLists();
        const updatedTaskLists = taskLists.filter(taskList => taskList.name !== taskListName);
        saveToLocalStorage('taskLists', updatedTaskLists);
      }
    });
    deleteButton.addEventListener("focus", () => {
      const focusUtterance = new SpeechSynthesisUtterance(`Focus on Delete Task List button for: ${taskList.name}`);
      speechSynthesis.speak(focusUtterance);
    });

    openButton.insertAdjacentElement('afterend', deleteButton);

    mainViewContainer.appendChild(taskListElement);
  });

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.classList.add("close-task-list-view-button");

  if (taskListContainer) {
    taskListContainer.appendChild(closeButton);
  } else {
    console.error("taskListContainer not found in the DOM.");
  }

  closeButton.addEventListener("click", () => {
    taskListView.classList.remove("active");
  });

  document.addEventListener("click", (event) => {
    if (taskListView && !taskListView.contains(event.target)) {
      // taskListView.classList.remove("active");
    }
  });
});