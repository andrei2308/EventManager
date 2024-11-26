import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UserPage from './components/UserPage.js';  // Import UserPage component

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:10001/login`, { username, password });
      setMessage('Login successful!');
      console.log("Token", response.data.token);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      await sleep(1500);
      setMessage('Logging in...');
      await sleep(2000);

      // Redirect to /api/user after successful login
      navigate('/api/user');

    } catch (error) {
      setMessage('Login failed. ' + (error.response?.data.message || error.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:10001/register`, { username, password, email });
      setMessage('Registration successful! Please login.');
      setIsLogin(true);
    } catch (error) {
      setMessage('Registration failed. ' + (error.response?.data.message || error.message));
    }
  };

  return (
    <div className="App">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
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
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

// Routing component
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/api/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;