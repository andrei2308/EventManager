import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfiguration';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Box, Typography, Card, CardContent, TextField, Button, CircularProgress } from '@mui/material';
export function EventsDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const redirect = useNavigate();
    const userID = JSON.parse(localStorage.getItem('userID'));
    console.log('hit');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            setIsLoading(false);
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}`)
            .then((response) => {
                setEvent(response.data.event);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch event details: ' + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, [eventId]);

    const [enteredCode, setEnteredCode] = useState('');

    const handleJoinEvent = async () => {
        if (enteredCode === event.access_code) {
            if (event.status === 'OPEN') {
                setError('Event is already open.');
                return;
            }
            if (event.participants.includes(userID)) {
                setError('You are already a participant.');
                return;
            }
            try {
                // Logic to join event (e.g., API call)
                console.log('Successfully joined event!');
                await axiosInstance.post(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join`);
                redirect('/events');
            } catch (err) {
                console.error('Error joining event:', err);
                setError('Failed to join the event.');
            }
        } else {
            setError('Invalid access code.');
        }
    };
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box sx={{ padding: 3 }}>
            {error && (
                <Typography variant="body1" color="error" gutterBottom>
                    {error}
                </Typography>
            )}
            {event && (
                <Card sx={{ maxWidth: 600, margin: '0 auto', boxShadow: 4 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Event Details
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Name:</strong> {event.name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Description:</strong> {event.description}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Access Code:</strong> {"Hidden"}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{
                                color: event.status === 'CLOSED' ? 'red' : 'green',
                                fontWeight: 'bold',
                            }}
                        >
                            <strong>Status:</strong> {event.status}
                        </Typography>

                        <Box sx={{ marginTop: 3 }}>
                            <TextField
                                label="Enter Access Code"
                                variant="outlined"
                                fullWidth
                                value={enteredCode}
                                onChange={(e) => setEnteredCode(e.target.value)}
                                error={!!error && error.includes('Invalid access code')}
                                helperText={error.includes('Invalid access code') ? error : ''}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                fullWidth
                                onClick={handleJoinEvent}
                            >
                                Join Event
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}