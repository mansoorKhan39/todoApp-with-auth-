import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Home size={24} />
          <span>TaskMaster Pro</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Tasks</span>
          </Link>
          <Link to="/dashboard" className="nav-link">
            <BarChart3 size={18} />
            <span>Analytics</span>
          </Link>
        </div>
        
        {user ? (
          <div className="user-menu">
            <div className="user-info">
              <User size={18} />
              <span>{user.username}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;