import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { redirect, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button, Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
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
    const handleViewAttendedEvents = () => {
        navigate(`/events/attended/${userData._id}`)
    }
    return (
        <Box sx={{ padding: 3 }}>
            {/* Logout Button Positioned at the Top Right */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            {/* Welcome Section */}
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {userData.username}!
                </Typography>
                <Typography variant="body1">Email: {userData.email}</Typography>
                <Typography variant="body1">User ID: {userData._id}</Typography>
            </Paper>

            {/* Buttons Section */}
            <Grid container spacing={3}>
                {/* User Section */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            User Section
                        </Typography>
                        <Button fullWidth variant="contained" color="primary" onClick={handleViewEvents}>
                            View Events
                        </Button>
                        <Button fullWidth variant="contained" color="secondary" onClick={handleViewGroups} sx={{ marginTop: 1 }}>
                            View Groups
                        </Button>
                        <Button fullWidth variant="contained" color="success" onClick={handleViewAttendedEvents} sx={{ marginTop: 1 }}>
                            Joined Events
                        </Button>
                    </Paper>
                </Grid>

                {/* Administrator Section */}
                {userData.role === 'organizer' && (
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ padding: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Administrator Section
                            </Typography>
                            <Button fullWidth variant="contained" color="primary" onClick={handleCreateEvent}>
                                Create Event
                            </Button>
                            <Button fullWidth variant="contained" color="secondary" onClick={handleCreateGroup} sx={{ marginTop: 1 }}>
                                Create Group of Events
                            </Button>
                            <Button fullWidth variant="contained" color="info" onClick={handleViewMyEvents} sx={{ marginTop: 1 }}>
                                My Events
                            </Button>
                            <Button fullWidth variant="contained" color="warning" onClick={handleViewMyGroups} sx={{ marginTop: 1 }}>
                                My Groups
                            </Button>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default UserPage;