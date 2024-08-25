// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex align-items-center justify-content-between';

        const taskContent = document.createElement('div');
        taskContent.className = 'd-flex align-items-center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'mr-3';
        checkbox.style.transform = 'scale(1.5)';
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            updateProgress();
        });

        const label = document.createElement('label');
        label.textContent = task.text;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(label);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            deleteTask(index);
        });

        listItem.appendChild(taskContent);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });

    updateProgress();
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList .list-group-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        tasks.push({ text: label.textContent, completed: checkbox.checked });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update progress bar
function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressBar.textContent = `${Math.round(percentage)}% Complete`;
}

// Function to delete a task by index
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1); // Remove the task at the given index
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks(); // Reload tasks to reflect changes
}

// Function to add a new task
document.getElementById('addTaskButton').addEventListener('click', () => {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    loadTasks();
});

// Function to render subjects
function renderSubjects() {
    const subjectList = document.getElementById('subjectList');
    subjectList.innerHTML = ''; // Clear current list

    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

    subjects.forEach((subject) => {
        const subjectCard = document.createElement('div');
        subjectCard.classList.add('col-md-4', 'mb-4');
        subjectCard.innerHTML = `
            <div class="card text-center border-primary">
                <div class="card-body">
                    <i class="fas fa-book fa-3x mb-3"></i>
                    <h5 class="card-title">${subject.name}</h5>
                    <p class="card-text">${subject.description}</p>
                    <a href="tasks.html?subject=${subject.name.toLowerCase()}" class="btn btn-primary">Manage Tasks</a>
                </div>
            </div>
        `;
        subjectList.appendChild(subjectCard);
    });
}

// Function to add a new subject
document.getElementById('addSubjectForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const subjectName = document.getElementById('subjectName').value.trim();
    const subjectDescription = document.getElementById('subjectDescription').value.trim();

    if (subjectName && subjectDescription) {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];

        subjects.push({ name: subjectName, description: subjectDescription });

        localStorage.setItem('subjects', JSON.stringify(subjects));

        renderSubjects();

        // Clear form and close modal
        document.getElementById('subjectName').value = '';
        document.getElementById('subjectDescription').value = '';
        $('#addSubjectModal').modal('hide');
    }
});

// Initialize the page by rendering subjects
document.addEventListener('DOMContentLoaded', renderSubjects);

