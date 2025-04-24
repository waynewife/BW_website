import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ username: 'Guest', readingList: [] });

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  return (
    <div className="profile">
      <h1>{user.username}'s Profile</h1>
      <button>Edit Profile</button>
      <div className="reading-list">
        <h2>Reading List</h2>
        {user.readingList.map(book => (
          <div key={book._id} className="book-item">{book.title}</div>
        ))}
      </div>
    </div>
  );
};

export default Profile;