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
        <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Join Event
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {event && (
                <Card sx={{ marginTop: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {event.name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {event.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Start time:</strong> {new Date(event.start_time).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>End time:</strong> {new Date(event.end_time).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                            >
                                Log in
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleRegister}
                            >
                                Register
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
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
                                    sx={{ marginBottom: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="success"
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
