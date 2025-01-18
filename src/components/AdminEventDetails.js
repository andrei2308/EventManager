import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Grid,
    Stack,
} from "@mui/material";
export function AdminEventsDetails() {
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const redirect = useNavigate();
    const { eventId } = useParams();
    const userId = JSON.parse(localStorage.getItem('userID'));
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            setIsLoading(false);
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/details/admin/${eventId}`)
            .then((response) => {
                setEvent(response.data.event || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch events: " + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, [eventId]);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    const handleClickEdit = () => {
        alert('Edit event clicked');
    };
    const handleClickSeeParticipants = () => {
        redirect(`/events/${eventId}/participants`);
    };
    const handleDeleteEvent = () => {
        // are you sure?
        axiosInstance.delete(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}`)
            .then(() => {
                alert('Event deleted');
                redirect(`/events/${userId}`);
            })
            .catch((err) => {
                setError('Failed to delete event: ' + (err.response?.data.message || err.message));
            });
    }
    if (error) {
        return <div><p>{error}</p></div>;
    }
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
                Event Details
            </Typography>
            {event && (
                <Card
                    sx={{
                        maxWidth: 600,
                        margin: '0 auto',
                        padding: 3,
                        backgroundColor: '#ffffff', // White card background
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
                        borderRadius: 4, // Rounded corners
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                color: '#1976d2', // Blue title
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: 2,
                            }}
                        >
                            {event.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: '#424242', marginBottom: 1 }}
                        >
                            <strong>Description:</strong> {event.description}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: '#424242', marginBottom: 1 }}
                        >
                            <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: '#424242', marginBottom: 1 }}
                        >
                            <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: '#424242', marginBottom: 1 }}
                        >
                            <strong>Access Code:</strong> {event.access_code}
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: event.status === 'OPEN' ? '#d32f2f' : '#388e3c', // Red for CLOSED, green for OPEN
                                backgroundColor:
                                    event.status === 'OPEN' ? '#ffebee' : '#e8f5e9', // Light red/green background
                                padding: '4px 8px',
                                borderRadius: 2,
                                display: 'inline-block',
                                textAlign: 'center',
                            }}
                        >
                            Status: {event.status === 'OPEN' ? 'In progress' : 'Not started'}
                        </Typography>
                        <Box
                            sx={{
                                textAlign: 'center',
                                marginTop: 3,
                                padding: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 4,
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <QRCodeCanvas
                                value={`https://andrei2308.github.io/EventManager?eventId=${event._id}&action=join`}
                                size={200}
                            />
                        </Box>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                            sx={{ marginTop: 3 }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    color: '#ffffff',
                                    '&:hover': { backgroundColor: '#1565c0' },
                                }}
                                onClick={handleClickSeeParticipants}
                            >
                                See Participants
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: '#d32f2f',
                                    borderColor: '#d32f2f',
                                    '&:hover': {
                                        backgroundColor: '#ffebee',
                                        borderColor: '#d32f2f',
                                    },
                                }}
                                onClick={handleDeleteEvent}
                            >
                                Delete Event
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}