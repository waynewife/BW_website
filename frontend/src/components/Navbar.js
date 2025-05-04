import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/Navbar.css';
import { useTheme } from '../theme';

const Navbar = () => {
  const [genres] = useState(['Romance', 'Mystery', 'Fantasy', 'Thriller', 'Sci-Fi']);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('Guest');
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('Guest');
    window.location.href = '/login';
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      history.push('/search', { books: [], error: 'Please enter a search term.' });
      return;
    }
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=40`
      );
      if (!response.data.items) {
        history.push('/search', { books: [], error: 'No books found for this search term.' });
        return;
      }
      const fetchedBooks = response.data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        description: item.volumeInfo.description || 'No description available',
        cover: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Cover',
        genre: item.volumeInfo.categories?.[0] || 'Unknown',
        volumeInfo: item.volumeInfo,
      }));
      history.push('/search', { books: fetchedBooks });
    } catch (error) {
      console.error('Error fetching books:', error);
      history.push('/search', { books: [], error: 'Failed to fetch books. Please check your internet connection or try again later.' });
    }
  };

  const handleGenreClick = async (genre) => {
    setIsOpen(false);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=40`
      );
      if (!response.data.items) {
        history.push(`/genre/${genre}`, { books: [], error: 'No books found for this genre.' });
        return;
      }
      const fetchedBooks = response.data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        description: item.volumeInfo.description || 'No description available',
        cover: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Cover',
        genre: item.volumeInfo.categories?.[0] || genre,
        volumeInfo: item.volumeInfo,
      }));
      history.push(`/genre/${genre}`, { books: fetchedBooks });
    } catch (error) {
      console.error('Error fetching genre books:', error);
      history.push(`/genre/${genre}`, { books: [], error: 'Failed to fetch books for this genre.' });
    }
  };

  return (
    <nav className={`navbar ${theme}-mode`}>
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="BookWorm Logo" className="h-12" />
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
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className="dropdown-item"
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link to="/library" className="nav-btn">Library</Link>
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books..."
            className="search-tab"
          />
          <button onClick={handleSearch} className="search-btn">Search</button>
        </div>
        <button onClick={toggleTheme} className="toggle-btn">
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
        <Link to={`/profile/${username}`} className="nav-btn">{username}</Link>
        <button onClick={handleLogout} className="nav-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;