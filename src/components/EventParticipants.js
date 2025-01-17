import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
export function EventParticipants() {
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');
    const [guests, setGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { eventId } = useParams();
    const userId = JSON.parse(localStorage.getItem('userID'));
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            setIsLoading(false);
            return;
        }
        axiosInstance.get(`/events/${eventId}/participants`)
            .then((response) => {
                setParticipants(response.data.participants || []);
                setGuests(response.data.guests || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch participants: ' + (err.response?.data.message || err.message));
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
    const handleExportParticipants = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/groups/admin/export/participants/${userId}`)
            .then((response) => {
                console.log(response.data);

                // Extract usernames from the response data
                const usernames = response.data.users.map(user => user.username);

                // Generate CSV content
                const csvContent = "data:text/csv;charset=utf-8," + usernames.join("\n");

                // Create a downloadable link
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.href = encodedUri;
                link.setAttribute('download', 'participants.csv');
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                setError("Failed to fetch participants: " + (err.response?.data.message || err.message));
            });
    };
    const handleExportParticipantsXlsx = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/groups/admin/export/participants/${userId}`)
            .then((response) => {
                console.log(response.data);

                // Extract usernames from the response data
                const usernames = response.data.users.map(user => user.username);

                // Generate XLSX content
                const xlsx = require('xlsx');
                const wb = xlsx.utils.book_new();
                const ws = xlsx.utils.aoa_to_sheet([
                    ["Usernames"], // Add a header row
                    ...usernames.map(username => [username]) // Add rows for each username
                ]);
                xlsx.utils.book_append_sheet(wb, ws, "Participants");
                const wbout = xlsx.write(wb, { type: 'binary', bookType: 'xlsx' });

                // Helper function to convert binary data to an ArrayBuffer
                const s2ab = (s) => {
                    const buf = new ArrayBuffer(s.length);
                    const view = new Uint8Array(buf);
                    for (let i = 0; i < s.length; i++) {
                        view[i] = s.charCodeAt(i) & 0xFF;
                    }
                    return buf;
                };

                // Create a downloadable link
                const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'participants.xlsx');
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
            })
            .catch((err) => {
                setError("Failed to fetch participants: " + (err.response?.data.message || err.message));
            });
    };
    return (
        <Box
            sx={{
                padding: 3,
                backgroundColor: '#f5f5f5', // Light gray background for contrast
                minHeight: '100vh',
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#1976d2', // Deep blue title
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                Event Participants
            </Typography>

            {participants.length > 0 || guests.length > 0 ? (
                <>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#1b5e20', // Green for "Registered Participants"
                            fontWeight: 'bold',
                            marginTop: 3,
                        }}
                    >
                        Registered Participants
                    </Typography>
                    <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                        {participants.map((participant, index) => (
                            <Grid item xs={12} sm={6} md={4} key={participant._id}>
                                <Card
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#e3f2fd' : '#fffde7', // Alternating blue and yellow
                                        boxShadow: 2,
                                        '&:hover': {
                                            boxShadow: 6, // Subtle hover effect
                                        },
                                        transition: 'all 0.3s ease-in-out',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: '#0d47a1', fontWeight: 'bold' }} // Dark blue for participant name
                                        >
                                            {participant.username}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Joined at: {new Date(participant.joinedAt).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: '#f57f17', // Amber for "Guest Participants"
                            fontWeight: 'bold',
                            marginTop: 3,
                        }}
                    >
                        Guest Participants
                    </Typography>
                    <Grid container spacing={3}>
                        {guests.map((guest, index) => (
                            <Grid item xs={12} sm={6} md={4} key={guest.name}>
                                <Card
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#fffde7' : '#e3f2fd', // Alternating yellow and blue
                                        boxShadow: 2,
                                        '&:hover': {
                                            boxShadow: 6, // Subtle hover effect
                                        },
                                        transition: 'all 0.3s ease-in-out',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: '#e65100', fontWeight: 'bold' }} // Orange for guest name
                                        >
                                            Guest: {guest.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Joined at: {new Date(guest.joinedAt).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginRight: 2 }}
                            onClick={handleExportParticipants}
                        >
                            Export Participants (CSV)
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleExportParticipantsXlsx}>
                            Export Participants (XLSX)
                        </Button>
                    </Box>
                </>
            ) : (
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
                        color: '#757575', // Neutral gray for "No participants" message
                        marginTop: 5,
                    }}
                >
                    No participants or guests found
                </Typography>
            )}
        </Box>
    );
}