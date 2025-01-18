import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
export function Events() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            setIsLoading(false);
            return;
        }
        axiosInstance.get('https://eventmanager-1-l2dr.onrender.com/events')
            .then((response) => {
                setEvents(response.data.events || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch events: ' + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, []);

    if (error) {
        return <div><p>{error}</p></div>;
    }

    const handleEventClick = async (eventId) => {
        navigate(`/events/details/${eventId}`);
    };
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box
            sx={{
                padding: 3,
                backgroundColor: '#f5f7fa', // Light blue background
                minHeight: '100vh',
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#1976d2', // Blue heading
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid #1976d2', // Blue underline for emphasis
                    paddingBottom: 1,
                    marginBottom: 3,
                }}
            >
                Events
            </Typography>
            {events.length > 0 ? (
                <Grid container spacing={3}>
                    {events.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card
                                onClick={() => handleEventClick(event._id)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: '#ffffff', // White background
                                    color: '#000000', // Black text
                                    border: '1px solid #e0e0e0', // Subtle border
                                    borderRadius: 4, // Rounded corners for the cards
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                    '&:hover': {
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Stronger shadow on hover
                                        backgroundColor: '#f0f0f0', // Slightly gray background on hover
                                    },
                                    transition: 'all 0.3s ease-in-out', // Smooth transition effect
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            color: '#1976d2', // Blue for title
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {event.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#555555', // Subtle gray for meta information
                                            marginBottom: 1,
                                        }}
                                    >
                                        <strong>Start:</strong> {new Date(event.start_time).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#555555',
                                            marginBottom: 1,
                                        }}
                                    >
                                        <strong>End:</strong> {new Date(event.end_time).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: event.status === 'CLOSED' ? '#d32f2f' : '#388e3c', // Red for closed, green for in progress
                                            backgroundColor: event.status === 'CLOSED' ? '#ffebee' : '#e8f5e9', // Light red/green background
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: 2,
                                            display: 'inline-block',
                                        }}
                                    >
                                        Status: {event.status === 'CLOSED' ? 'Not started' : 'In progress'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
                        color: '#9e9e9e',
                        marginTop: 5,
                        fontStyle: 'italic',
                    }}
                >
                    No events found
                </Typography>
            )}
        </Box>
    );




}
