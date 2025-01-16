import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { HashRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UserPage from './components/UserPage.js';  // Import UserPage component
import { Events } from './components/Events.js';
import { EventsCreate } from './components/EventsCreate.js';
import { EventsDetails } from './components/EventsDetails.js';
import { EventParticipants } from './components/EventParticipants.js';
import { CreateGroup } from './components/CreateGroup.js';
import { GroupsView } from './components/GroupsView.js';
import { EventsByGroup } from './components/EventsByGroup.js';
import { AdminEvents } from './components/AdminEvents.js';
import { AdminEventsDetails } from './components/AdminEventDetails.js';
import { AdminGroups } from './components/AdminGroups.js';
import { AdminEventsFromGroup } from './components/AdminEventsFromGroup.js';
import { JoinByQR } from './components/JoinByQR.js';
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
      const response = await axios.post(`https://eventmanager-1-l2dr.onrender.com/login`, { username, password });
      setMessage('Login successful!');
      console.log("Token", response.data.token);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', JSON.stringify(response.data.user._id));
      await sleep(1500);
      setMessage('Logging in...');
      await sleep(2000);

      // Redirect to /api/user after successful login
      navigate('/user');

    } catch (error) {
      setMessage('Login failed. ' + (error.response?.data.message || error.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://eventmanager-1-l2dr.onrender.com/register`, { username, password, email });
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
        <Route path="/EventManager" element={<App />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/create" element={<EventsCreate />} />
        <Route path="/events/details/:eventId" element={<EventsDetails />} />
        <Route path="events/:eventId/participants" element={<EventParticipants />} />
        <Route path="/groups" element={<CreateGroup />} />
        <Route path="/groups/view" element={<GroupsView />} />
        <Route path="/groups/details/:groupId" element={<EventsByGroup />} />
        <Route path="/events/:userId" element={<AdminEvents />} />
        <Route path="/events/details/admin/:eventId" element={<AdminEventsDetails />} />
        <Route path="/groups/:userId" element={<AdminGroups />} />
        <Route path="/groups/details/admin/:groupId" element={<AdminEventsFromGroup />} />
        <Route path="/events/:eventId/join" element={<JoinByQR />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;