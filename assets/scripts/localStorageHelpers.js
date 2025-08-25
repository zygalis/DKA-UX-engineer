document.addEventListener("DOMContentLoaded", () => {
    // Task list management
    const TASK_LISTS_KEY = "taskLists";

    // Retrieve task lists from localStorage or initialize as an empty array
    const taskLists = getFromLocalStorage(TASK_LISTS_KEY) || [];

    // Debugging log to verify retrieval
    console.log("Retrieved Task Lists:", taskLists);

    // Function to save task lists to localStorage
    function saveTaskLists() {
        saveToLocalStorage(TASK_LISTS_KEY, taskLists);
    }

    function addTaskList(name) {
        taskLists.push({ name, tasks: [] });
        saveTaskLists();
    }

    console.log("Initial Task Lists:", taskLists);
    addTaskList("New Task List");
    console.log("Updated Task Lists:", taskLists);
});

// Save task lists to localStorage
export function saveTaskLists(taskLists) {
  if (!Array.isArray(taskLists)) {
    console.error('Expected taskLists to be an array, but got:', taskLists);
    return;
  }

  const data = taskLists.map((taskListElement) => {
    const name = taskListElement.querySelector('h3').textContent;
    const tasks = Array.from(taskListElement.querySelectorAll('li')).map((task) => {
      return {
        text: task.querySelector('.task-text').textContent,
        status: parseInt(task.getAttribute('data-status'), 10),
      };
    });
    return { name, tasks };
  });

  localStorage.setItem('taskLists', JSON.stringify(data));
}

// Retrieve task lists from localStorage
export function getTaskLists() {
  const data = localStorage.getItem('taskLists');
  if (!data) return [];

  return JSON.parse(data).map((taskList) => {
    return {
      name: taskList.name,
      tasks: taskList.tasks.map((task) => ({
        text: task.text || 'Unnamed Task',
        status: task.status || 1,
      })),
    };
  });
}

// Function to save data to localStorage
export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Function to retrieve data from localStorage
export function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error parsing data from localStorage for key "${key}":`, error);
        return null;
    }
}