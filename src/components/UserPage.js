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
        <Box sx={{ padding: 3, backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            {/* Logout Button Positioned at the Top Right */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            {/* Welcome Section */}
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: '#0d47a1', fontWeight: 'bold' }}
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
                            backgroundColor: '#e3f2fd', // Light blue
                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ color: '#0d47a1', fontWeight: 'bold' }}
                        >
                            User Section
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                backgroundColor: '#0d47a1',
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
                                backgroundColor: '#1976d2',
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
                                backgroundColor: '#64b5f6',
                                marginTop: 1,
                                '&:hover': { backgroundColor: '#42a5f5' },
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
                                backgroundColor: '#fffde7', // Light yellow
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ color: '#f57f17', fontWeight: 'bold' }}
                            >
                                Administrator Section
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#f57f17',
                                    '&:hover': { backgroundColor: '#e65100' },
                                }}
                                onClick={handleCreateEvent}
                            >
                                Create Event
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ffb300',
                                    marginTop: 1,
                                    '&:hover': { backgroundColor: '#ffa000' },
                                }}
                                onClick={handleCreateGroup}
                            >
                                Create Group of Events
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ffca28',
                                    marginTop: 1,
                                    '&:hover': { backgroundColor: '#ffb300' },
                                }}
                                onClick={handleViewMyEvents}
                            >
                                My Events
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#ffe082',
                                    marginTop: 1,
                                    '&:hover': { backgroundColor: '#ffd54f' },
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