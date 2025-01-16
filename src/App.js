import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import { AttendedEvents } from './components/AttendedEvents.js';
import { Button, Input, FormGroup } from "@mui/material"
function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const eventId = queryParams.get('eventId');
    const action = queryParams.get('action');

    if (eventId && action === 'join') {
      navigate(`/events/${eventId}/join`);
    }
    if (eventId && action === 'login') {
      localStorage.setItem('eventId', eventId);
      navigate('/EventManager');
    }
    if (eventId && action === 'register') {
      localStorage.setItem('eventId', eventId);
      navigate('/EventManager');
    }
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://eventmanager-1-l2dr.onrender.com/login`, { username, password });
      setMessage('Login successful!');
      console.log("Token", response.data.token);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', JSON.stringify(response.data.user._id));

      // Check if there's an eventId to join
      const eventId = localStorage.getItem('eventId');
      if (eventId) {
        try {
          // Make API call to join the event
          await axios.post(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join`, {}, {
            headers: { Authorization: `Bearer ${response.data.token}` },
          });
          setMessage(`Successfully joined event ${eventId}`);
          localStorage.removeItem('eventId');
          navigate(`/user`);
        } catch (joinError) {
          setMessage('Failed to join event: ' + (joinError.response?.data.message || joinError.message));
        }
      } else {
        // Redirect to the user dashboard if no eventId is present
        navigate('/user');
      }
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
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <Input
          style={{ marginTop: '20px' }}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          style={{ marginTop: '20px' }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }} type="submit">{isLogin ? 'Login' : 'Register'}</Button>
      </form>
      <p>{message}</p>
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </Button>
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
        <Route path="/events/:eventId/participants" element={<EventParticipants />} />
        <Route path="/groups" element={<CreateGroup />} />
        <Route path="/groups/view" element={<GroupsView />} />
        <Route path="/groups/details/:groupId" element={<EventsByGroup />} />
        <Route path="/events/:userId" element={<AdminEvents />} />
        <Route path="/events/details/admin/:eventId" element={<AdminEventsDetails />} />
        <Route path="/groups/:userId" element={<AdminGroups />} />
        <Route path="/groups/details/admin/:groupId" element={<AdminEventsFromGroup />} />
        <Route path="/events/:eventId/join" element={<JoinByQR />} />
        <Route path="/events/attended/:userId" element={<AttendedEvents />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;