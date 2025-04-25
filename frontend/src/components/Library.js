import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Library.css';

const Library = () => {
  const [lists, setLists] = useState([]);

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

  return (
    <div className="library-page">
      <h1>My Library</h1>
      {lists.length === 0 ? (
        <p>Your library is empty. Add books to start building your collection!</p>
      ) : (
        lists.map(list => (
          <div key={list.name} className="list-section">
            <h2>{list.name}</h2>
            {list.books.length === 0 ? (
              <p>No books in this list yet.</p>
            ) : (
              <div className="book-grid">
                {list.books.map(book => (
                  <div key={book.bookId} className="book-card">
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <h3>{book.title}</h3>
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

export default Library;