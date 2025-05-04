import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const history = useHistory();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [genres] = useState(['Romance', 'Mystery', 'Fantasy', 'Thriller', 'Sci-Fi']);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/books/v1/volumes?q=subject:Fiction&maxResults=5'
        );
        const books = response.data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', ') || 'Unknown',
          description: item.volumeInfo.description || 'No description available',
          cover: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Cover',
          genre: item.volumeInfo.categories?.[0] || 'Fiction',
          volumeInfo: item.volumeInfo,
        }));
        setFeaturedBooks(books);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      }
    };
    fetchFeaturedBooks();
  }, []);

  const handleGenreClick = async (genre) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=50`
      );
      const fetchedBooks = response.data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        description: item.volumeInfo.description || 'No description available',
        cover: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Cover',
        genre: item.volumeInfo.categories?.[0] || genre,
        volumeInfo: item.volumeInfo,
      }));
      history.push(`/genre/${genre}`, { books: fetchedBooks });
    } catch (error) {
      console.error('Error fetching genre books:', error);
      history.push(`/genre/${genre}`, { books: [], error: 'Failed to fetch books for this genre.' });
    }
  };

  const handleNextBook = () => {
    setCurrentBookIndex((prevIndex) => (prevIndex + 1) % featuredBooks.length);
  };

  const handlePrevBook = () => {
    setCurrentBookIndex((prevIndex) => (prevIndex - 1 + featuredBooks.length) % featuredBooks.length);
  };

  return (
    <div className="home-page">
      <h1>Welcome to BookWorm</h1>
      <p>Discover a world of stories!</p>

      <div className="featured-books">
        <h2>Featured Books</h2>
        {featuredBooks.length > 0 ? (
          <div className="carousel">
            <button className="carousel-btn prev" onClick={handlePrevBook}>❮</button>
            <div className="featured-book">
              <img src={featuredBooks[currentBookIndex].cover} alt={featuredBooks[currentBookIndex].title} className="featured-cover" />
              <div className="book-info">
                <h3>{featuredBooks[currentBookIndex].title}</h3>
                <p><strong>Author:</strong> {featuredBooks[currentBookIndex].author}</p>
                <p>{featuredBooks[currentBookIndex].description.substring(0, 150)}...</p>
                <button
                  className="explore-btn"
                  onClick={() => history.push(`/genre/${featuredBooks[currentBookIndex].genre}`, { books: featuredBooks })}
                >
                  Explore More
                </button>
              </div>
            </div>
            <button className="carousel-btn next" onClick={handleNextBook}>❯</button>
          </div>
        ) : (
          <p>Loading featured books...</p>
        )}
      </div>

      <div className="top-genres">
        <h2>Top Genres</h2>
        <div className="genre-grid">
          {genres.map(genre => (
            <div key={genre} className="genre-card" onClick={() => handleGenreClick(genre)}>
              <h3>{genre}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;