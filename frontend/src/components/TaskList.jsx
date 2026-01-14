import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Edit2, Save, X, Calendar, Flag } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const task = {
        title: newTask,
        description: newDescription,
        priority: newPriority
      };
      
      const res = await axios.post('http://localhost:5000/api/tasks', task);
      setTasks([res.data, ...tasks]);
      setNewTask('');
      setNewDescription('');
      setNewPriority('medium');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        title: editTitle,
        description: editDescription
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {/* Add Task Form */}
      <motion.div 
        className="add-task-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>Add New Task</h3>
        <div className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task title"
            className="task-input"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="task-description-input"
            rows="2"
          />
          <div className="task-options">
            <div className="priority-selector">
              <Flag size={16} />
              <select 
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="priority-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button onClick={addTask} className="add-task-btn">
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tasks List */}
      <div className="tasks-section">
        <h3>Your Tasks ({tasks.length})</h3>
        
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div 
              className="empty-tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No tasks yet. Add your first task above!</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task._id}
                className={`task-card ${task.completed ? 'completed' : ''}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="task-main">
                  <div className="task-header">
                    <div 
                      className="task-checkbox"
                      onClick={() => toggleTask(task)}
                    >
                      <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                        {task.completed && <Check size={14} />}
                      </div>
                    </div>
                    
                    {editingId === task._id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="edit-input"
                          autoFocus
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="edit-textarea"
                          placeholder="Description"
                        />
                        <div className="edit-actions">
                          <button onClick={() => saveEdit(task._id)} className="save-btn">
                            <Save size={16} />
                            Save
                          </button>
                          <button onClick={cancelEdit} className="cancel-btn">
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="task-content"
                          onClick={() => toggleTask(task)}
                        >
                          <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="task-description">{task.description}</p>
                          )}
                        </div>
                        
                        <div className="task-meta">
                          <span 
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="due-date">
                              <Calendar size={14} />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingId !== task._id && (
                    <div className="task-actions">
                      <button 
                        onClick={() => startEditing(task)}
                        className="edit-btn"
                        title="Edit task"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task._id)}
                        className="delete-btn"
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;