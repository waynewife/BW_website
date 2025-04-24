import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme';
import '../styles/Home.css';

const Home = () => {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Simulate checking login status
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className={`home ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <h1 className="title">Welcome to BookWorm</h1>
      <p className="subtitle">Discover a world of stories!</p>
      <div className="content">
        {isLoggedIn ? (
          <div className="suggestions">
            <h2>Book Suggestions</h2>
            <div className="book-grid">
              {/* Placeholder for book cards */}
              <div className="book-card">Book 1</div>
              <div className="book-card">Book 2</div>
              <div className="book-card">Book 3</div>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn">Login</Link>
            <Link to="/signup" className="auth-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;