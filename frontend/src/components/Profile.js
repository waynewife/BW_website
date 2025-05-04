import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [lists, setLists] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('Guest');
  const [description, setDescription] = useState('Tap here to add a description about yourself...');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLists(response.data.lists || []);
        setUsername(response.data.username || 'Guest');
        setDescription(response.data.description || 'Tap here to add a description about yourself...');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please ensure you are logged in.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleReadNow = (book) => {
    if (book.volumeInfo?.infoLink) {
      window.open(book.volumeInfo.infoLink, '_blank');
    } else {
      alert('No link available for this book.');
    }
  };

  const handleAddToLibrary = async (book) => {
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-list', {
        listName: 'Default',
        book: {
          bookId: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          cover: book.cover,
          genre: book.genre,
          volumeInfo: book.volumeInfo,
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

  const handleAddToProfileList = async (book) => {
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-profile-list', {
        book: {
          bookId: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          cover: book.cover,
          genre: book.genre,
          volumeInfo: book.volumeInfo,
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

  const handleDescriptionClick = () => {
    setIsEditing(true);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDescriptionSave = async () => {
    if (!description.trim()) {
      alert('Description cannot be empty.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/update-description', {
        description,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDescription(response.data.description);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset description to original value by refetching profile
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDescription(response.data.description || 'Tap here to add a description about yourself...');
      } catch (err) {
        console.error('Error refetching profile:', err);
      }
    };
    fetchProfile();
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  if (error) {
    return <div className="profile-page">{error}</div>;
  }

  const readingList = lists.find(list => list.name === 'Profile Reading List') || { books: [] };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-pic">Profile Pic</div>
        <h1>{username}</h1>
        <p>Reading Lists: {lists.length}  Followers: 0</p>
      </div>
      <div className="profile-section">
        <h2>About</h2>
        {isEditing ? (
          <div>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="description-textarea"
              rows="3"
              cols="50"
            />
            <div>
              <button onClick={handleDescriptionSave} className="save-btn">Save</button>
              <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <p onClick={handleDescriptionClick} className="description-text">
            {description}
          </p>
        )}
        <p>Joined 4/25/2025</p>
      </div>
      <div className="profile-section">
        <h2>Following</h2>
        <div className="following-item">
          <span className="following-pic">Pic</span>
          <span>SampleUser</span>
          <span>27.2K Followers</span>
        </div>
      </div>
      <div className="profile-section">
        <h2>{username}'s Reading List</h2>
        {readingList.books.length === 0 ? (
          <p>No books in your reading list yet.</p>
        ) : (
          <div className="book-grid">
            {readingList.books.map(book => (
              <div key={book.bookId} className="book-card" onClick={() => handleBookClick(book)}>
                <img src={book.cover} alt={book.title} className="book-cover" />
                <h4>{book.title}</h4>
                <p>Author: {book.author}</p>
              </div>
            ))}
          </div>
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
              <button className="add-to-library-btn" onClick={() => handleAddToLibrary(selectedBook)}>Add to Library</button>
              <button className="add-to-list-btn" onClick={() => handleAddToProfileList(selectedBook)}>Add to List</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;