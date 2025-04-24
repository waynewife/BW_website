import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../theme';
import '../styles/Profile.css';

const Profile = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState({ username: 'Guest', readingList: [] });
  const [about, setAbout] = useState('Tap here to add a description about yourself...');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Profile data:', response.data);
        setUser(response.data);
        setAbout(response.data.about || 'Tap here to add a description about yourself...');
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleAboutEdit = () => {
    setIsEditingAbout(true);
  };

  const handleAboutSave = async () => {
    setIsEditingAbout(false);
    try {
      await axios.put('http://localhost:5000/api/users/profile', { about }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Error saving about:', error);
      setError('Failed to save about section');
    }
  };

  if (error) {
    return (
      <div className="profile-page">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/login'}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className={`profile-page ${theme}-mode`}>
      <div className="profile-header">
        <div className="profile-pic">
          <div className="pic-placeholder">Profile Pic</div>
        </div>
        <h1>{user.username}</h1>
        <div className="profile-stats">
          <span>Reading Lists: {user.readingList.length}</span>
          <span>Followers: 0</span>
        </div>
      </div>

      <div className="profile-section">
        <h2>About</h2>
        {isEditingAbout ? (
          <div className="about-edit">
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows="3"
              className="about-textarea"
            />
            <button onClick={handleAboutSave} className="save-btn">Save</button>
          </div>
        ) : (
          <p onClick={handleAboutEdit} className="about-text">{about}</p>
        )}
        <p>Joined {new Date().toLocaleDateString()}</p>
      </div>

      <div className="profile-section">
        <h2>Following</h2>
        <div className="following-item">
          <div className="following-pic">Pic</div>
          <span>SampleUser</span>
          <span>27.2K Followers</span>
        </div>
      </div>

      <div className="profile-section">
        <h2>{user.username}'s Reading List</h2>
        {user.readingList.length > 0 ? (
          user.readingList.map(book => (
            <div key={book._id} className="book-item">
              <span>{book.title}</span>
              <span>{book.views || '0'} Views</span>
              <span>{book.rating || '0'} Stars</span>
            </div>
          ))
        ) : (
          <p>No books in your reading list yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;