import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
export function GroupsView() {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            setIsLoading(false);
            return;
        }
        axiosInstance.get('https://eventmanager-1-l2dr.onrender.com/groups')
            .then((response) => {
                setGroups(response.data.groups || []);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch groups: ' + (err.response?.data.message || err.message));
                setIsLoading(false);
            });
    }, []);

    if (error) {
        return <div><p>{error}</p></div>;
    }

    const handleGroupClick = async (groupId) => {
        navigate(`/groups/details/${groupId}`);
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
                Groups
            </Typography>
            {groups.length > 0 ? (
                <Grid container spacing={3}>
                    {groups.map((group) => (
                        <Grid item xs={12} sm={6} md={4} key={group._id}>
                            <Card
                                onClick={() => handleGroupClick(group.id)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 4, // Add shadow effect on hover
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {group.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {group.description || 'No description available'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No groups found</Typography>
            )}
        </Box>
    );
}