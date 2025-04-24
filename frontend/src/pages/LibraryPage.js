import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LibraryPage.css';

const LibraryPage = () => {
  const [library, setLibrary] = useState({ saved: [], ongoing: [] });

  useEffect(() => {
    axios.get('/api/users/library')
      .then(response => setLibrary(response.data))
      .catch(error => console.error('Error fetching library:', error));
  }, []);

  return (
    <div className="library-page">
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

export default LibraryPage;