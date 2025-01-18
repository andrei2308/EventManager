import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
export function AdminEventsFromGroup() {
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { groupId } = useParams();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            setIsLoading(false);
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/admin/groups/${groupId}`)
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
                backgroundColor: '#f5f7fa', // Light blue background for the container
                minHeight: '100vh', // Ensure the container takes full screen height
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#1565c0', // Blue color for heading
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid #1565c0', // Blue underline for emphasis
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
                                onClick={() => navigate(`/events/details/admin/${event._id}`)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: '#ffffff', // White card background
                                    border: `2px solid ${index % 2 === 0 ? '#90caf9' : '#bbdefb'
                                        }`, // Alternating light blue borders
                                    '&:hover': {
                                        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)', // Shadow effect on hover
                                        borderColor: index % 2 === 0 ? '#42a5f5' : '#64b5f6', // Darker hover border
                                    },
                                    borderRadius: 4, // Rounded corners
                                    transition: 'all 0.3s ease-in-out', // Smooth transition effect
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            color: '#0d47a1', // Dark blue for title
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {event.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#424242', // Subtle gray for meta information
                                            marginBottom: 1,
                                        }}
                                    >
                                        <strong>Start:</strong> {new Date(event.start_time).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#424242', // Subtle gray for meta information
                                            marginBottom: 1,
                                        }}
                                    >
                                        <strong>End:</strong> {new Date(event.end_time).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: event.status === 'CLOSED' ? '#388e3c' : '#d32f2f', // Green for "Not started", red for "In progress"
                                            backgroundColor: event.status === 'CLOSED' ? '#e8f5e9' : '#ffebee', // Light green/red background
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: 2,
                                            display: 'inline-block',
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
                        color: '#757575', // Subtle gray for "No events found"
                        marginTop: 5,
                    }}
                >
                    No events found
                </Typography>
            )}
        </Box>
    );
}