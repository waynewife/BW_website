import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookAPI = ({ onBooksFetched }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=10`
      );
      const fetchedBooks = response.data.items.map(item => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        description: item.volumeInfo.description || 'No description available',
      }));
      setBooks(fetchedBooks);
      if (onBooksFetched) onBooksFetched(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search books..."
      />
      <button onClick={fetchBooks}>Search</button>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} by {book.author} - {book.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookAPI;