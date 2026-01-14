import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { TrendingUp, CheckCircle, Clock, Flag, Database } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    total: 0, 
    completed: 0, 
    pending: 0, 
    highPriority: 0 
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks/stats'),
        axios.get('http://localhost:5000/api/tasks')
      ]);
      
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [stats.completed, stats.pending],
      backgroundColor: ['#10b981', '#f59e0b'],
      borderColor: ['#0da271', '#d97706'],
      borderWidth: 2
    }]
  };

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      label: 'Tasks by Priority',
      data: [
        tasks.filter(t => t.priority === 'high').length,
        tasks.filter(t => t.priority === 'medium').length,
        tasks.filter(t => t.priority === 'low').length
      ],
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
    }]
  };

  const recentTasks = tasks.slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h2>📊 Analytics Dashboard</h2>
        <p>Real-time insights into your productivity</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card total"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Database size={32} />
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card completed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle size={32} />
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card pending"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Clock size={32} />
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card high-priority"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Flag size={32} />
          <div className="stat-content">
            <div className="stat-value">{stats.highPriority}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </motion.div>
      </div>

      {/* Completion Rate */}
      <motion.div 
        className="completion-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="completion-header">
          <TrendingUp size={24} />
          <h3>Completion Progress</h3>
        </div>
        <div className="completion-content">
          <div className="completion-rate">
            <div className="rate-value">{completionRate}%</div>
            <div className="rate-label">Tasks Completed</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {completionRate >= 80 ? '🎉 Excellent work!' :
             completionRate >= 50 ? '👍 Keep it up!' :
             '💪 You can do it!'}
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="charts-grid">
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Task Distribution</h3>
          <div className="chart-container">
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
        </motion.div>

        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Priority Overview</h3>
          <div className="chart-container">
            <Bar 
              data={priorityData} 
              options={{ 
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div 
        className="recent-tasks-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3>Recent Tasks</h3>
        {recentTasks.length === 0 ? (
          <p className="no-tasks">No recent tasks</p>
        ) : (
          <div className="recent-tasks-list">
            {recentTasks.map((task) => (
              <div key={task._id} className="recent-task-item">
                <div className="recent-task-info">
                  <span className={`recent-task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                  <div className="recent-task-meta">
                    <span className={`priority-tag priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className="task-status">
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className={`status-indicator ${task.completed ? 'completed' : 'pending'}`} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;