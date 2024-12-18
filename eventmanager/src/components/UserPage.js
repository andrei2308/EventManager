import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { redirect, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function UserPage() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');  // Retrieve the token from localStorage
        if (!token) {
            setError('No token found, please login.');
            navigate('/');  // Redirect to login if no token is found
            return;
        }

        axiosInstance.get(`http://localhost:10001/user`)
            .then(response => {
                setUserData(response.data.user);
            })
            .catch(err => {
                setError('Failed to fetch user data. ' + (err.response?.data.message || err.message));
            });
    }, [navigate]);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    if (!userData) {
        return <div><p>Loading user data...</p></div>;
    }
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate("/")
    }
    const handleViewEvents = () => {
        navigate("/events")
    }
    const handleCreateEvent = () => {
        navigate("/events/create")
    }
    return (
        <div>
            <h2>Welcome, {userData.username}!</h2>
            <p>Email: {userData.email}</p>
            <p>User ID: {userData._id}</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleViewEvents}>View Events</button>
            <button onClick={handleCreateEvent}>Create Event</button>
        </div>
    );
}

export default UserPage;