import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateList.css';

const CreateList = () => {
  const location = useLocation();
  const history = useHistory();
  const { book } = location.state || {};
  const [listName, setListName] = useState('');
  const [error, setError] = useState('');

  const handleCreateList = async () => {
    if (!listName) {
      setError('Please enter a list name');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/create-list', {
        listName
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (book) {
        await axios.post('http://localhost:5000/api/users/add-book-to-list', {
          listName,
          book: {
            bookId: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            cover: book.cover,
            genre: book.genre,
          }
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      history.push('/library');
    } catch (error) {
      console.error('Error creating list:', error);
      setError('Failed to create list');
    }
  };

  return (
    <div className="create-list">
      <h2>Create New List</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Enter list name"
        />
        <button onClick={handleCreateList}>Create</button>
      </div>
    </div>
  );
};

export default CreateList;