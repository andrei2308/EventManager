import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
export function EventsByGroup() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { groupId } = useParams();
    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/groups/details/${groupId}`);
                setEvents(response.data.events);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError('Error fetching events. Please try again.');
                setIsLoading(false);
            }
        };

        fetchEvents();
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
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Events
            </Typography>
            {events.length > 0 ? (
                <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card
                                onClick={() => handleEventClick(event._id)}
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        boxShadow: 4, // Add shadow on hover
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {event.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Start:</strong> {new Date(event.start_time).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>End:</strong> {new Date(event.end_time).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: event.status === "CLOSED" ? "green" : "red",
                                            fontWeight: "bold",
                                            marginTop: 1,
                                        }}
                                    >
                                        Status: {event.status === "CLOSED" ? "Not started" : "In progress"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No events found</Typography>
            )}
        </Box>
    );
}