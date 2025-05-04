import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/GenrePage.css';

const GenrePage = () => {
  const location = useLocation();
  const history = useHistory();
  const { books = [], error = '' } = location.state || {};
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLists(response.data.lists || []);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
    fetchLists();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleAddToLibrary = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-list', {
        listName: 'Default',
        book: {
          bookId: selectedBook.id,
          title: selectedBook.title,
          author: selectedBook.author,
          description: selectedBook.description,
          cover: selectedBook.cover,
          genre: selectedBook.genre,
          volumeInfo: selectedBook.volumeInfo,
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Book added to your library!');
      setSelectedBook(null);
    } catch (error) {
      console.error('Error adding book to library:', error);
      alert('Failed to add book to library.');
    }
  };

  const handleAddToProfileList = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-profile-list', {
        book: {
          bookId: selectedBook.id,
          title: selectedBook.title,
          author: selectedBook.author,
          description: selectedBook.description,
          cover: selectedBook.cover,
          genre: selectedBook.genre,
          volumeInfo: selectedBook.volumeInfo,
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Book added to your profile reading list!');
      setSelectedBook(null);
    } catch (error) {
      console.error('Error adding book to profile list:', error);
      alert('Failed to add book to profile list.');
    }
  };

  const handleReadNow = (book) => {
    if (book.volumeInfo?.infoLink) {
      window.open(book.volumeInfo.infoLink, '_blank');
    } else {
      alert('No link available for this book.');
    }
  };

  return (
    <div className="genre-page">
      <h2>Books in Genre</h2>
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
          !error && <p>No books found for this genre.</p>
        )}
      </div>

      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>×</span>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Genre:</strong> {selectedBook.genre}</p>
            <p>{selectedBook.description}</p>
            <div className="modal-actions">
              <button className="read-now-btn" onClick={() => handleReadNow(selectedBook)}>Read Now</button>
              <button className="add-to-library-btn" onClick={handleAddToLibrary}>Add to Library</button>
              <button className="add-to-list-btn" onClick={handleAddToProfileList}>Add to List</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenrePage;