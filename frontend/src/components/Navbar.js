import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useTheme } from '../theme';

const Navbar = () => {
  const [genres] = useState(['Romance', 'Mystery', 'Fantasy', 'Thriller', 'Sci-Fi']);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    // Simulate fetching username
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
  }, []);

  return (
    <nav className={`navbar ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white'}`}>
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="ReadVibe Logo" className="h-12" />
        </Link>
      </div>
      <div className="nav-items">
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="browse-btn">
            Browse
          </button>
          {isOpen && (
            <div className="dropdown">
              {genres.map(genre => (
                <Link key={genre} to={`/genre/${genre}`} onClick={() => setIsOpen(false)}>
                  {genre}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/library" className="nav-btn">Library</Link>
        <input type="text" placeholder="Search books..." className="search-tab" />
        <button onClick={toggleTheme} className="toggle-btn">
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <Link to="/profile" className="nav-btn">{username}</Link>
      </div>
    </nav>
  );
};

export default Navbar;