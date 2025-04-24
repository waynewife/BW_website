import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Library.css';

const Library = () => {
  const [library, setLibrary] = useState({ saved: [], ongoing: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/library', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setLibrary(response.data))
      .catch(error => console.error('Error fetching library:', error));
  }, []);

  return (
    <div className="library">
      <h1>My Library</h1>
      <div className="library-sections">
        <div className="saved-books">
          <h2>Saved Books</h2>
          {library.saved.map(book => (
            <div key={book._id} className="book-item">{book.title}</div>
          ))}
        </div>
        <div className="ongoing-books">
          <h2>Ongoing Reads</h2>
          {library.ongoing.map(book => (
            <div key={book._id} className="book-item">{book.title}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;