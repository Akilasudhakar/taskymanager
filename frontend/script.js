// Authentication
const registerPage = document.getElementById('registerPage');
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');

// Task Management
const taskInput = document.getElementById('taskInput');
const taskPriority = document.getElementById('taskPriority');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const allTasksTab = document.getElementById('allTasksTab');
const favoriteTasksTab = document.getElementById('favoriteTasksTab');
const completedTasksTab = document.getElementById('completedTasksTab');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Registration
registerButton.addEventListener('click', () => {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  localStorage.setItem('user', JSON.stringify({ name, email, password }));
  alert('Registration successful!');
  registerPage.classList.add('hidden');
  loginPage.classList.remove('hidden');
});

// Login
loginButton.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.email === email && user.password === password) {
    alert('Login successful!');
    loginPage.classList.add('hidden');
    dashboard.classList.remove('hidden');
  } else {
    alert('Invalid credentials!');
  }
});

// Add Task
addTaskButton.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const priority = taskPriority.value;

  if (!task) {
    alert('Task cannot be empty!');
    return;
  }

  tasks.push({ task, priority, favorite: false, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  taskInput.value = '';
});

// Render Tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return t.favorite;
    if (filter === 'completed') return t.completed;
  });

  filteredTasks.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      ${t.task} (${t.priority})
      <div>
        <button onclick="markComplete(${index})">Complete</button>
        <button onclick="toggleFavorite(${index})">${t.favorite ? 'Unfavorite' : 'Favorite'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Task Actions
function markComplete(index) {
  tasks[index].completed = true;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function toggleFavorite(index) {
  tasks[index].favorite = !tasks[index].favorite;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Tabs
allTasksTab.addEventListener('click', () => renderTasks('all'));
favoriteTasksTab.addEventListener('click', () => renderTasks('favorites'));
completedTasksTab.addEventListener('click', () => renderTasks('completed'));

// Logout
logoutButton.addEventListener('click', () => {
  dashboard.classList.add('hidden');
  loginPage.classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', () => {
    registerPage.classList.add('hidden'); // Hide registration page
    loginPage.classList.remove('hidden'); // Show login page
  });
  
  document.getElementById('showRegister').addEventListener('click', () => {
    console.log('Login button clicked'); // Debugging log
    loginPage.classList.add('hidden');
    registerPage.classList.remove('hidden');
  });
    

// Initialize
renderTasks();
