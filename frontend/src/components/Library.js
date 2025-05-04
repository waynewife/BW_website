import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Library.css';

const Library = () => {
  const [lists, setLists] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [listsForModal, setListsForModal] = useState([]);
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
    // Book is already in library, so this might be redundant
    alert('This book is already in your library.');
    setSelectedBook(null);
  };

  const handleAddToProfileList = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-profile-list', {
        book: {
          bookId: selectedBook.bookId,
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
    <div className="library-page">
      <h1>My Library</h1>
      {lists.length === 0 ? (
        <p>Your library is empty. Add books to start building your collection!</p>
      ) : (
        lists.map(list => (
          <div key={list.name} className="list-section">
            <h2>{list.name}</h2>
            {list.books.length === 0 ? (
              <p>No books in this list yet.</p>
            ) : (
              <div className="book-grid">
                {list.books.map(book => (
                  <div key={book.bookId} className="book-card" onClick={() => handleBookClick(book)}>
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <h3>{book.title}</h3>
                    <p>Author: {book.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
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

export default Library;