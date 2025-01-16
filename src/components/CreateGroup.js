import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Box, Typography, Paper, CircularProgress } from "@mui/material";
export function CreateGroup() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [group, setGroup] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            }
            const groupData = {
                name,
                description,
                group
            };
            const response = await axiosInstance.post('https://eventmanager-1-l2dr.onrender.com/group', groupData);

            setMessage(`Event created successfully: ${response.data.message}`);
        } catch (err) {
            setMessage(`Error creating event: ${err.response?.data.message || err.message}`);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create Group
            </Typography>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Group Name */}
                        <Grid item xs={12}>
                            <TextField
                                label="Group Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Group Description */}
                        <Grid item xs={12}>
                            <TextField
                                label="Group Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        {/* Group ID */}
                        <Grid item xs={12}>
                            <TextField
                                label="Group ID (optional)"
                                variant="outlined"
                                fullWidth
                                value={group}
                                onChange={(e) => setGroup(e.target.value)}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Create Group
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Message Section */}
            {message && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6" color={message.startsWith("Error") ? "error" : "success"}>
                        {message}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
