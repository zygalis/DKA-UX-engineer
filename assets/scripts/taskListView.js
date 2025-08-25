import { createTaskListContainer } from './taskListContainer.js';
import { statuses } from './taskItem.js';
import { getTaskLists } from './localStorageHelpers.js';

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
    openButton.textContent = "Open";
    openButton.classList.add('open-button');
    openButton.addEventListener("click", () => {
      console.log("Open button clicked for task list:", taskList.name);

      // Ensure the taskListView element is visible
      if (!taskListView.classList.contains("active")) {
        console.warn("Adding 'active' class to taskListView.");
      }

      taskListView.classList.add("active");
      console.log("taskListView classes:", taskListView.className);

      // Clear the detailed view container
      taskListContainer.innerHTML = "";

      const newContainer = createTaskListContainer(taskListContainer, taskList.name, true);
      console.log("New container created:", newContainer);

      // Set the title and tasks for the selected task list
      const titleElement = newContainer.querySelector(".editable-title");
      const ul = newContainer.querySelector("ul");

      titleElement.textContent = taskList.name;
      ul.innerHTML = ""; // Clear existing tasks
      taskList.tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = `status-${task.status}`;
        taskItem.setAttribute("data-status", task.status);

        const taskName = document.createElement("div");
        taskName.classList.add("task-name");
        taskName.setAttribute("contenteditable", "true");
        taskName.textContent = task.text || '';

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
        taskContent.appendChild(taskName);

        taskItem.appendChild(taskContent);
        ul.appendChild(taskItem);
      });

      console.log("Task list populated with tasks:", taskList.tasks);

      // Show the detailed view
      taskListView.classList.add("active");
      console.log("Detailed view activated.");

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
        taskListElement.remove();
      }
    });

    openButton.insertAdjacentElement('afterend', deleteButton);

    mainViewContainer.appendChild(taskListElement);
  });

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.classList.add("close-task-list-view-button");
  console.log("Close button created:", closeButton);

  if (taskListContainer) {
    console.log("taskListContainer found:", taskListContainer);
    taskListContainer.appendChild(closeButton);
    console.log("Close button appended to taskListContainer:", taskListContainer);
  } else {
    console.error("taskListContainer not found in the DOM.");
  }

  closeButton.addEventListener("click", () => {
    console.log("Close button clicked. Removing 'active' class from taskListView.");
    taskListView.classList.remove("active");
  });

  // Log the entire taskListView structure for debugging
  console.log("taskListView structure:", taskListView);

  document.addEventListener("click", (event) => {
    if (taskListView && !taskListView.contains(event.target)) {
      // taskListView.classList.remove("active");
    }
  });
});