import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({ username: 'Guest', readingList: [] });

  useEffect(() => {
    axios.get('/api/users/profile')
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  return (
    <div className="profile-page">
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

export default ProfilePage;