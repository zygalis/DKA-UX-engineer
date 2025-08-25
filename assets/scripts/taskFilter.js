export function createTaskFilter(newContainer) {
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

  return filterFieldset;
}
