document.addEventListener("DOMContentLoaded", () => {
  const taskListView = document.querySelector(".task-list-view");
  const taskListContainer = document.querySelector(".task-list-container");
  const taskListButtons = document.querySelectorAll(".add-new-button");

  taskListButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (taskListView) {
        taskListView.classList.add("active");
      }
    });
  });

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.classList.add("close-task-list-view-button");

  if (taskListContainer) {
    taskListContainer.appendChild(closeButton);
  }

  closeButton.addEventListener("click", () => {
    taskListView.classList.remove("active");
  });

  document.addEventListener("click", (event) => {
    if (taskListView && !taskListView.contains(event.target) && !event.target.closest(".add-new-button")) {
      taskListView.classList.remove("active");
    }
  });
});
