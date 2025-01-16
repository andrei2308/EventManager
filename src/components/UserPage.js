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

        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/user`)
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
        navigate("/EventManager")
    }
    const handleViewEvents = () => {
        navigate("/events")
    }
    const handleCreateEvent = () => {
        navigate("/events/create")
    }
    const handleCreateGroup = () => {
        navigate("/groups")
    }
    const handleViewGroups = () => {
        navigate("/groups/view")
    }
    const handleViewMyEvents = () => {
        navigate(`/events/${userData._id}`)
    }
    const handleViewMyGroups = () => {
        navigate(`/groups/${userData._id}`)
    }
    return (
        <div>
            <h2>Welcome, {userData.username}!</h2>
            <p>Email: {userData.email}</p>
            <p>User ID: {userData._id}</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleViewEvents}>View Events</button>
            {userData.role === 'organizer' && (
                <button onClick={handleCreateEvent}>Create Event</button>
            )}
            {userData.role === "organizer" && (
                <div>
                    <button onClick={handleCreateGroup}>Create group of events</button>
                    <button onClick={handleViewMyEvents}>My events</button>
                    <button onClick={handleViewMyGroups}>My groups</button>
                </div>
            )}
            <button onClick={handleViewGroups}>View groups</button>
        </div>
    );
}

export default UserPage;