import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/GenrePage.css';

const GenrePage = () => {
  const location = useLocation();
  const { books = [], error = '' } = location.state || {};

  return (
    <div className="genre-page">
      <h2>Books in Genre</h2>
      {error && <p className="error">{error}</p>}
      <div className="book-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.cover} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
            </div>
          ))
        ) : (
          !error && <p>No books found for this genre.</p>
        )}
      </div>
    </div>
  );
};

export default GenrePage;