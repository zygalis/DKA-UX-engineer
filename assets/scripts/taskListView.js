document.addEventListener("DOMContentLoaded", () => {
  const taskListView = document.querySelector(".task-list-view");
  const taskListButtons = document.querySelectorAll(".task-list-button");

  taskListButtons.forEach((button) => {
    button.addEventListener("click", () => {
      taskListView.classList.add("active");
    });
  });

  const closeButton = document.querySelector(".close-task-list-view");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      taskListView.classList.remove("active");
    });
  }
});
