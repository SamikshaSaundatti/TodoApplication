import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await axios.post('/tasks', { text: newTaskText, completed: false });
      setTasks([...tasks, response.data]);
      setNewTaskText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const response = await axios.put(`/tasks/${taskId}`, { completed: !tasks.find(task => task._id === taskId).completed });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <input type="checkbox" checked={task.completed} onChange={() => handleToggleComplete(task._id)} />
            {task.text}
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
