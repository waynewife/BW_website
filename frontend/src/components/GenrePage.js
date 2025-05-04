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

  const handleAddToLibrary = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedList('');
  };

  const handleAddBook = async () => {
    if (!selectedList) return;
    if (selectedList === 'create-new') {
      setShowAddModal(false);
      history.push('/create-list', { book: selectedBook });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-list', {
        listName: selectedList,
        book: {
          bookId: selectedBook.id,
          title: selectedBook.title,
          author: selectedBook.author,
          description: selectedBook.description,
          cover: selectedBook.cover,
          genre: selectedBook.genre,
        }
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowAddModal(false);
      setSelectedBook(null);
      setSelectedList('');
    } catch (error) {
      console.error('Error adding book to list:', error);
    }
  };

  const handleReadNow = (book) => {
    // Check if the book has a preview link
    if (book.volumeInfo?.previewLink) {
      window.open(book.volumeInfo.previewLink, '_blank'); // Open preview in new tab
    } else {
      alert('No preview available for this book. Here’s the description:\n\n' + book.description);
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
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseAddModal}>×</span>
            <h2>Add "{selectedBook.title}" to Library</h2>
            <div className="list-selection">
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
              >
                <option value="">Select a list</option>
                {lists.length > 0 && lists.map(list => (
                  <option key={list.name} value={list.name}>{list.name}</option>
                ))}
                <option value="create-new">Create New List</option>
              </select>
              <button onClick={handleAddBook} disabled={!selectedList}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenrePage;