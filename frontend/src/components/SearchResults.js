import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const { books = [], error = '' } = location.state || {};

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {error && <p className="error">{error}</p>}
      <ul className="book-list">
        {books.length > 0 ? (
          books.map((book, index) => (
            <li key={index} className="book-item">
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>{book.description}</p>
            </li>
          ))
        ) : (
          !error && <p>No books found.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchResults;