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
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Event Details
            </Typography>
            {event && (
                <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {event.name}
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
                            <strong>Access Code:</strong> {event.access_code}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Status:</strong>{" "}
                            <span
                                style={{
                                    color: event.status === "CLOSED" ? "red" : "green",
                                    fontWeight: "bold",
                                }}
                            >
                                {event.status}
                            </span>
                        </Typography>
                        <Box sx={{ textAlign: "center", marginTop: 3 }}>
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
                            <Button variant="contained" color="primary" onClick={handleClickEdit}>
                                Edit Event
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClickSeeParticipants}
                            >
                                See Participants
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleDeleteEvent}>
                                Delete Event
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}