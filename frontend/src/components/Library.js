import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Library.css';

const Library = () => {
  const [lists, setLists] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedList, setSelectedList] = useState('');
  const [newListName, setNewListName] = useState('');
  const [createNewList, setCreateNewList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLists(response.data.lists || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching library:', err);
        setError('Failed to load library data.');
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setShowAddModal(false);
    setCreateNewList(false);
    setNewListName('');
    setSelectedList('');
  };

  const handleAddToLibraryClick = () => {
    setShowAddModal(true);
  };

  const handleAddToLibrary = async () => {
    let listName = selectedList;
    if (createNewList) {
      if (!newListName.trim()) {
        alert('Please enter a name for the new list.');
        return;
      }
      listName = newListName.trim();
    } else if (!selectedList) {
      alert('Please select a list or create a new one to add the book to.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-list', {
        listName,
        book: {
          bookId: selectedBook.bookId,
          title: selectedBook.title,
          author: selectedBook.author,
          description: selectedBook.description,
          cover: selectedBook.cover,
          genre: selectedBook.genre,
          volumeInfo: selectedBook.volumeInfo,
        },
        createNew: createNewList,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(`Book added to ${listName}!`);
      setShowAddModal(false);
      setCreateNewList(false);
      setNewListName('');
      setSelectedList('');
      setSelectedBook(null);
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLists(response.data.lists || []);
    } catch (error) {
      console.error('Error adding book to library:', error);
      alert('Failed to add book to library.');
    }
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
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLists(response.data.lists || []);
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

  if (loading) {
    return <div className="library-page">Loading...</div>;
  }

  if (error) {
    return <div className="library-page">{error}</div>;
  }

  return (
    <div className="library-page">
      <h1>My Library</h1>
      {lists.map(list => (
        <div key={list.name} className="library-section">
          <h2>{list.name}</h2>
          {list.books.length === 0 ? (
            <p>No books in this list yet.</p>
          ) : (
            <div className="book-grid">
              {list.books.map(book => (
                <div key={book.bookId} className="book-card" onClick={() => handleBookClick(book)}>
                  <img src={book.cover} alt={book.title} className="book-cover" />
                  <h4>{book.title}</h4>
                  <p>Author: {book.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

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
              <button className="add-to-library-btn" onClick={handleAddToLibraryClick}>Add to Library</button>
              <button className="add-to-list-btn" onClick={handleAddToProfileList}>Add to Profile List</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>×</span>
            <h2>Add to Library</h2>
            <div className="list-options">
              <label>
                <input
                  type="radio"
                  checked={!createNewList}
                  onChange={() => setCreateNewList(false)}
                />
                Select Existing List
              </label>
              <label>
                <input
                  type="radio"
                  checked={createNewList}
                  onChange={() => setCreateNewList(true)}
                />
                Create New List
              </label>
            </div>
            {!createNewList ? (
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="list-select"
              >
                <option value="">Select a list</option>
                {lists.map(list => (
                  <option key={list.name} value={list.name}>{list.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter new list name (e.g., Romance)"
                className="list-input"
              />
            )}
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleAddToLibrary}>Confirm</button>
              <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;