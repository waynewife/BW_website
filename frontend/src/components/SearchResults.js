import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const history = useHistory();
  const { books = [], error = '' } = location.state || {};
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleAddToLibrary = () => {
    history.push('/add-to-library', { book: selectedBook });
  };

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {error && <p className="error">{error}</p>}
      <div className="book-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book)}>
              <img src={book.cover} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
            </div>
          ))
        ) : (
          !error && <p>No books found.</p>
        )}
      </div>

      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            <p>{selectedBook.description}</p>
            <div className="modal-actions">
              <button className="read-now-btn">Read Now</button>
              <button className="add-to-library-btn" onClick={handleAddToLibrary}>Add to Library</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;