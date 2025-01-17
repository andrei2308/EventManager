import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
export function AdminEvents() {
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            setIsLoading(false);
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/admin/${userId}`)
            .then((response) => {
                setEvents(response.data.events || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch events: " + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, []);
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
                backgroundColor: '#f3f4f6', // Light gray background for contrast
                minHeight: '100vh',
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#2e7d32', // Green heading color
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                Events
            </Typography>
            {events.length > 0 ? (
                <Grid container spacing={3}>
                    {events.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card
                                onClick={() => navigate(`/events/details/admin/${event._id}`)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: index % 2 === 0 ? '#c8e6c9' : '#fff9c4', // Alternating green and yellow
                                    '&:hover': {
                                        boxShadow: 6, // Shadow effect on hover
                                        backgroundColor: index % 2 === 0 ? '#a5d6a7' : '#fff59d', // Slightly darker shade on hover
                                    },
                                    borderRadius: 2, // Rounded corners
                                    transition: 'all 0.3s ease-in-out', // Smooth hover transition
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            color: '#1b5e20', // Dark green for title
                                            fontWeight: 'bold',
                                        }}
                                    >
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
                                            color: event.status === 'CLOSED' ? '#388e3c' : '#d32f2f', // Green for "Not started", red for "In progress"
                                            fontWeight: 'bold',
                                            marginTop: 1,
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
                        color: '#757575',
                        marginTop: 5,
                    }}
                >
                    No events found
                </Typography>
            )}
        </Box>
    );

}
