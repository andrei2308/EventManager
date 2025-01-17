import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from '@mui/material';

export function JoinByQR() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');
    const [showGuestInput, setShowGuestInput] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const redirect = useNavigate();

    useEffect(() => {
        // Fetch event details
        axiosInstance
            .get(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join`)
            .then((response) => {
                setEvent(response.data.event);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch event details: ' + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, [eventId]);

    // Handles logging in and redirecting back to the event
    const handleLogin = () => {
        redirect(`/EventManager?eventId=${eventId}&action=login`);
    };

    // Handles registering and redirecting back to the event
    const handleRegister = () => {
        redirect(`/EventManager?eventId=${eventId}&action=register`);
    };

    // Handles joining as a guest
    const handleGuestJoin = () => {
        if (!guestName) {
            setError('Please enter your name to join as a guest.');
            return;
        }
        axiosInstance
            .post(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join-guest`, { name: guestName })
            .then(() => {
                alert('Successfully joined the event as a guest!');
                redirect(`/EventManager`);
            })
            .catch((err) => {
                setError('Failed to join as guest: ' + (err.response?.data.message || err.message));
            });
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
                maxWidth: 600,
                margin: '0 auto',
                backgroundColor: '#f3f4f6', // Light gray background
                minHeight: '100vh', // Full viewport height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    color: '#0d47a1', // Deep blue header color
                    fontWeight: 'bold',
                }}
            >
                Join Event
            </Typography>

            {error && (
                <Alert severity="error" sx={{ marginBottom: 3 }}>
                    {error}
                </Alert>
            )}

            {event && (
                <Card
                    sx={{
                        marginTop: 3,
                        padding: 2,
                        borderRadius: 2, // Rounded corners
                        boxShadow: 4, // Subtle shadow for card
                        backgroundColor: '#ffffff', // White card background
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#2e7d32', // Green for event name
                            }}
                        >
                            {event.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ marginBottom: 2, color: '#424242' }} // Subtle gray for description
                        >
                            {event.description}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ marginBottom: 1 }}
                        >
                            <strong>Start time:</strong> {new Date(event.start_time).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                        >
                            <strong>End time:</strong> {new Date(event.end_time).toLocaleString()}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: 3,
                                gap: 2, // Add space between buttons
                                flexWrap: 'wrap', // Handle smaller screens
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ flex: 1, minWidth: '30%' }} // Flexible width for buttons
                                onClick={handleLogin}
                            >
                                Log in
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ flex: 1, minWidth: '30%' }}
                                onClick={handleRegister}
                            >
                                Register
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{ flex: 1, minWidth: '30%' }}
                                onClick={() => setShowGuestInput(true)}
                            >
                                Join as Guest
                            </Button>
                        </Box>

                        {showGuestInput && (
                            <Box sx={{ marginTop: 3 }}>
                                <TextField
                                    label="Enter your name"
                                    variant="outlined"
                                    fullWidth
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    sx={{
                                        marginBottom: 2,
                                        backgroundColor: '#f9fbe7', // Light yellow input background
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    onClick={handleGuestJoin}
                                >
                                    Confirm
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
