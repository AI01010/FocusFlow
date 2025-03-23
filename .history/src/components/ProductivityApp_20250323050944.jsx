// ProductivityApp.jsx

'use client';

import React, { useState, useEffect } from 'react';

const ProductivityApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete project proposal', completed: false, priority: 'high' },
    { id: 2, text: 'Schedule team meeting', completed: false, priority: 'medium' },
    { id: 3, text: 'Review quarterly goals', completed: false, priority: 'low' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setTimerActive(false);
            setCompletedPomodoros(count => count + 1);
            return 25 * 60;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Task handling functions
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { 
          id: Date.now(), 
          text: newTask, 
          completed: false,
          priority: newPriority
        }
      ]);
      setNewTask('');
    }
  };
  
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Focus Flow</h1>
        <p className="text-center text-gray-600">Get things done with focus and purpose</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Task management */}
        <div className="md:col-span-2 space-y-6">
          {/* Add task form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Add New Task</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What needs to be done?"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Task filters */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Completed
              </button>
            </div>
          </div>
          
          {/* Task list */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks to display</p>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.text}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right column: Pomodoro timer */}
        <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center space-y-6">
          <h2 className="text-xl font-semibold">Focus Timer</h2>
          
          <div className="w-48 h-48 relative flex items-center justify-center rounded-full bg-white shadow-inner">
            <div className="absolute inset-3 rounded-full border-4 border-blue-200"></div>
            <div className="text-4xl font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                timerActive ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
              }`}
            >
              {timerActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                setTimeRemaining(25 * 60);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">The Completed Pomodoros</p>
            <div className="flex justify-center space-x-1 mt-2">
              {[...Array(Math.min(completedPomodoros, 8))].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-blue-600 rounded-full"></div>
              ))}
              {completedPomodoros > 8 && (
                <div className="text-xs text-blue-600 ml-1">+{completedPomodoros - 8}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityApp;