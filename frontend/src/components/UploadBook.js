import React, { useState } from 'react';
import axios from 'axios';

const UploadBook = ({ onBookAdded }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (url) formData.append('url', url);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/users/upload-book', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
      if (onBookAdded) onBookAdded(response.data.book);
    } catch (error) {
      console.error('Error uploading book:', error);
    }
  };

  return (
    <div>
      <h2>Upload Book</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book Title"
          required
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="PDF URL (optional)"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadBook;