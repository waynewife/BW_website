import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookList from '../components/BookList';
import '../styles/GenrePage.css';

const GenrePage = () => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/genre/${genre}`)
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, [genre]);

  return (
    <div className="genre-page">
      <h1>{genre} Books</h1>
      <BookList books={books} />
    </div>
  );
};

export default GenrePage;