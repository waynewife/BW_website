import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './GenrePage.css';

const GenrePage = () => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`/api/books/genre/${genre}`)
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, [genre]);

  return (
    <div className="genre-page">
      <h1>{genre} Books</h1>
      <div className="book-list">
        {books.map(book => (
          <div key={book._id} className="book-item">
            <h3>{book.title}</h3>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenrePage;