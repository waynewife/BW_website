import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/AddToLibrary.css';

const AddToLibrary = () => {
  const location = useLocation();
  const history = useHistory();
  const { book } = location.state || {};
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

  const handleAddToList = async () => {
    if (!selectedList) return;
    if (selectedList === 'create-new') {
      history.push('/create-list', { book });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/users/add-book-to-list', {
        listName: selectedList,
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
      history.push('/library');
    } catch (error) {
      console.error('Error adding book to list:', error);
    }
  };

  return (
    <div className="add-to-library">
      <h2>Add "{book?.title}" to Library</h2>
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
        <button onClick={handleAddToList} disabled={!selectedList}>Add</button>
      </div>
    </div>
  );
};

export default AddToLibrary;