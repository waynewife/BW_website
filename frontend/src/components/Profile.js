import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [lists, setLists] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLists(response.data.lists || []); // Ensure lists is always an array
        setUsername(response.data.username || 'Guest');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  if (error) {
    return <div className="profile-page">{error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>{username}'s Profile</h1>
      <h2>Your Lists</h2>
      {lists.length === 0 ? (
        <p>You have no lists yet. Start adding books to your library!</p>
      ) : (
        lists.map(list => (
          <div key={list.name} className="list-section">
            <h3>{list.name}</h3>
            {list.books.length === 0 ? (
              <p>No books in this list.</p>
            ) : (
              <div className="book-grid">
                {list.books.map(book => (
                  <div key={book.bookId} className="book-card">
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <h4>{book.title}</h4>
                    <p>Author: {book.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;