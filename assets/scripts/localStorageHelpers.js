// Save task lists to localStorage
export function saveTaskLists(taskLists) {
  if (!Array.isArray(taskLists)) {
    console.error('Expected taskLists to be an array, but got:', taskLists);
    return;
  }

  const existingNames = getTaskLists().map(taskList => taskList.name);

  const data = taskLists.map((taskListElement) => {
    const name = taskListElement.querySelector('h3').textContent;

    const validation = isValidTaskListName(name, existingNames);
    if (!validation.valid) {
      throw new Error(`Invalid task list name: ${name}. Error: ${validation.error}`);
    }

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

// Function to validate task list name
export function isValidTaskListName(name, existingNames = []) {
    const nameRegex = /^[\p{L}\p{N}]{1,60}$/u; // Unicode letters and numbers, max 60 chars
    if (!nameRegex.test(name)) {
        return { valid: false, error: 'Name must consist only of Unicode letters and numbers and be at most 60 characters long.' };
    }
    if (existingNames.includes(name)) {
        return { valid: false, error: 'Name must be unique. A task list with this name already exists.' };
    }
    return { valid: true };
}