import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/public-profile/${username}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };
    fetchPublicProfile();
  }, [username]);

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
          bookId: book.bookId,
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
          bookId: book.bookId,
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
    } catch (error) {
      console.error('Error adding book to profile list:', error);
      alert('Failed to add book to profile list.');
    }
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  if (error) {
    return <div className="profile-page">{error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-pic">Profile Pic</div>
        <h1>{profile.username}</h1>
        <p>Reading Lists: {profile.profileReadingList.length}  Followers: 0</p>
      </div>
      <div className="profile-section">
        <h2>About</h2>
        <p>{profile.description}</p>
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
        <h2>{profile.username}'s Reading List</h2>
        {profile.profileReadingList.length === 0 ? (
          <p>No books in this reading list yet.</p>
        ) : (
          <div className="book-grid">
            {profile.profileReadingList.map(book => (
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

export default PublicProfile;