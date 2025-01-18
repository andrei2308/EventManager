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
        <Box
            sx={{
                padding: 3,
                backgroundColor: '#f3f4f6', // Light gray background
                minHeight: '100vh', // Full viewport height
            }}
        >
            {/* Logout Button Positioned at the Top Right */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="outlined"
                    sx={{
                        color: '#d32f2f', // Red text for logout
                        borderColor: '#d32f2f', // Red border
                        '&:hover': { backgroundColor: '#f8d7da', borderColor: '#c62828' }, // Light red hover effect
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            {/* Welcome Section */}
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 3,
                    backgroundColor: '#ffffff', // Pure white background
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: '#0d47a1', // Deep blue for header
                        fontWeight: 'bold',
                    }}
                >
                    Welcome, {userData.username}!
                </Typography>
                <Typography variant="body1" sx={{ color: '#424242' }}>
                    Email: {userData.email}
                </Typography>
                <Typography variant="body1" sx={{ color: '#424242' }}>
                    User ID: {userData._id}
                </Typography>
            </Paper>

            {/* Buttons Section */}
            <Grid container spacing={3}>
                {/* User Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            padding: 3,
                            backgroundColor: '#f7faff', // Very light blue background
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                color: '#0d47a1', // Deep blue for header
                                fontWeight: 'bold',
                            }}
                        >
                            User Section
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: '#0d47a1', // Deep blue button
                                '&:hover': { backgroundColor: '#002171' },
                            }}
                            onClick={handleViewEvents}
                        >
                            View Events
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: '#1976d2', // Slightly lighter blue button
                                marginTop: 1,
                                '&:hover': { backgroundColor: '#115293' },
                            }}
                            onClick={handleViewGroups}
                        >
                            View Groups
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: '#42a5f5', // Medium blue button
                                marginTop: 1,
                                '&:hover': { backgroundColor: '#1e88e5' },
                            }}
                            onClick={handleViewAttendedEvents}
                        >
                            Joined Events
                        </Button>
                    </Paper>
                </Grid>

                {/* Administrator Section */}
                {userData.role === 'organizer' && (
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                padding: 3,
                                backgroundColor: '#ffffff', // Pure white background
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    color: '#0d47a1', // Deep blue for header
                                    fontWeight: 'bold',
                                }}
                            >
                                Administrator Section
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1565c0', // Medium blue
                                    '&:hover': { backgroundColor: '#0d47a1' }, // Darker blue on hover
                                }}
                                onClick={handleCreateEvent}
                            >
                                Create Event
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1e88e5', // Bright blue
                                    marginTop: 1,
                                    '&:hover': { backgroundColor: '#1565c0' },
                                }}
                                onClick={handleCreateGroup}
                            >
                                Create Group of Events
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#64b5f6', // Lighter blue
                                    marginTop: 1,
                                    '&:hover': { backgroundColor: '#42a5f5' },
                                }}
                                onClick={handleViewMyEvents}
                            >
                                My Events
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#bbdefb', // Very light blue
                                    marginTop: 1,
                                    '&:hover': { backgroundColor: '#90caf9' },
                                }}
                                onClick={handleViewMyGroups}
                            >
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