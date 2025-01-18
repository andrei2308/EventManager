import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, Button, Paper, CircularProgress } from "@mui/material";
export function AdminGroups() {
    const [group, setGroup] = useState(null);
    const [groups, setGroups] = useState([]);
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
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/groups/admin/${userId}`)
            .then((response) => {
                setGroups(response.data.groups || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch groups: " + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, []);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    const handleExportParticipants = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/groups/admin/export/participants/${userId}`)
            .then((response) => {
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
                minHeight: '100vh', // Full height background
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#1e88e5', // Blue for heading
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderBottom: '2px solid #1e88e5', // Underline for heading
                    paddingBottom: 1,
                    marginBottom: 3,
                }}
            >
                Groups
            </Typography>
            {groups.length > 0 ? (
                <Grid container spacing={3}>
                    {groups.map((group, index) => (
                        <Grid item xs={12} sm={6} md={4} key={group._id}>
                            <Card
                                onClick={() => navigate(`/groups/details/admin/${group.id}`, { replace: true })}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: index % 2 === 0 ? '#e3f2fd' : '#ffffff', // Alternating light blue and white
                                    border: '1px solid #90caf9', // Subtle blue border
                                    '&:hover': {
                                        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)', // Subtle hover shadow
                                        backgroundColor: index % 2 === 0 ? '#bbdefb' : '#f5f7fa', // Slightly darker hover shade
                                    },
                                    borderRadius: 4, // Rounded corners
                                    transition: 'all 0.3s ease-in-out', // Smooth hover transition
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            color: '#1565c0', // Dark blue for title
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {group.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#424242', // Neutral gray for description
                                        }}
                                    >
                                        {group.description || 'No description available'}
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
                        color: '#757575', // Subtle gray for "No groups found"
                        marginTop: 5,
                    }}
                >
                    No groups found
                </Typography>
            )
            }
            <Box
                sx={{
                    marginTop: 3,
                    display: 'flex',
                    justifyContent: 'center', // Center the buttons
                    gap: 2, // Add spacing between buttons
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#1e88e5', // Blue button color
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#1565c0', // Darker blue on hover
                        },
                    }}
                    onClick={handleExportParticipants}
                >
                    Export Participants (CSV)
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#43a047', // Green button color
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#2e7d32', // Darker green on hover
                        },
                    }}
                    onClick={handleExportParticipantsXlsx}
                >
                    Export Participants (XLSX)
                </Button>
            </Box>
        </Box >
    );
}