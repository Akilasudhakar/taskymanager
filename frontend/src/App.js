import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [page, setPage] = useState("register");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("users")) || null);
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")) || []);
  const [taskInput, setTaskInput] = useState("");
  const [taskPriority, setTaskPriority] = useState("low");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/api/tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          }
        });
        const data = await response.json();
        if(response.status==200){
          setTasks(data);
        }
      }catch(error){
        console.error('Error during login:', error);
      }
    }
    fetchTasks();
  }, [page]);

  const handleRegister = async (name, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try{
      const newUser = { name, email, password };
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if(response.status==201){
        alert("Registration successful!");
        setPage("login");
      }else{
        alert(data?.message);
      }
    }catch(error){
      console.error('Error during register:', error);
    }
  };

  const handleLogin = async (email, password) => {
    try{
      const newUser = { email, password };
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if(response.status==200){
        alert("Login successful!");
        setUser(data);
        localStorage.setItem('users', JSON.stringify(data));
        setPage("dashboard");
      }else{
        alert("Invalid credentials!");
      }
    }catch(error){
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  const addTask = async () => {
    if (!taskInput.trim()) {
      alert("Task cannot be empty!");
      return;
    }
    try{
      const newTask = { taskItem: taskInput, priority: taskPriority, favorite: false, taskCompleted: false };
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newTask)
      });
      const data = await response.json();
      if(response.status==201){
        setTasks([...tasks, data]);
        setTaskInput("");
      }
    }catch(error){
      console.error('Error adding task:', error);
    }
  };


  const updateTask = async (id, field) => {
    try{
      const updatedTask = tasks.find((item) => item._id == id);
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ [field]: !updatedTask[field] })
      });
      const data = await response.json();
      if(response.status==200){
        setTasks(tasks.map(task => task._id === id ? { ...task, ...data } : task));
      }
    }catch(error){
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try{
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      if(response.status==200){
        setTasks(tasks.filter((item) => item._id !== id));
      }
    }catch(error){
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "favorites") return t.favorite;
    if (filter === "completed") return t.taskCompleted;
  });

  return (
    <div className="container">
      {page === "register" && (
        <div className="auth-page">
          <h2>Register</h2>
          <input type="text" placeholder="Name" id="regName" />
          <input type="email" placeholder="Email" id="regEmail" />
          <input type="password" placeholder="Password" id="regPassword" />
          <input type="password" placeholder="Confirm Password" id="regConfirmPassword" />
          <button onClick={() => handleRegister(
            document.getElementById("regName").value,
            document.getElementById("regEmail").value,
            document.getElementById("regPassword").value,
            document.getElementById("regConfirmPassword").value
          )}>Register</button>
          <p>Already have an account? <a onClick={() => setPage("login")} href="#">Login</a></p>
        </div>
      )}

      {page === "login" && (
        <div className="auth-page">
          <h2>Login</h2>
          <input type="email" placeholder="Email" id="loginEmail" />
          <input type="password" placeholder="Password" id="loginPassword" />
          <button onClick={() => handleLogin(
            document.getElementById("loginEmail").value,
            document.getElementById("loginPassword").value
          )}>Login</button>
          <p>Don't have an account? <a onClick={() => setPage("register")} href="#">Register</a></p>
        </div>
      )}

      {page === "dashboard" && (
        <div>
          <h2>Task Manager</h2>
          <button onClick={handleLogout}>Sign Out</button>
          <div className="add-task">
            <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="Task" />
            <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button onClick={addTask}>Add Task</button>
          </div>
          <div className="tabs">
            <button onClick={() => setFilter("all")}>All Tasks</button>
            <button onClick={() => setFilter("favorites")}>Favorite Tasks</button>
            <button onClick={() => setFilter("completed")}>Completed Tasks</button>
          </div>
          <ul>
            {filteredTasks.map((t, index) => (
              <li key={index} className="task-item">
                {t.taskItem} ({t.priority})
                <div>
                  <button onClick={() => updateTask(t._id, "taskCompleted")}>{!t.taskCompleted ? "Pending" : "Completed"}</button>
                  <button onClick={() => updateTask(t._id, "favorite")}>{!t.favorite ? "Unfavorite" : "Favorite"}</button>
                  <button onClick={() => deleteTask(t._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
