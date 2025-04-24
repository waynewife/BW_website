import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        password,
      });
      console.log('Signup response:', response.data);
      history.push('/login');
    } catch (err) {
      console.error('Signup error:', err.response);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up for BookWorm</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;