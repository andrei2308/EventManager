import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfiguration';
import { QRCodeCanvas } from 'qrcode.react'; // Correctly import QRCodeCanvas
import { TextField, Button, Grid, Typography, Box, Paper } from '@mui/material';
export function EventsCreate() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [group, setGroup] = useState('');
    const [accessCode, setAccessCode] = useState(''); // Store the generated access code
    const [qrCode, setQrCode] = useState(''); // Store the QR code
    const [message, setMessage] = useState('');
    const [eventId, setEventId] = useState(null);
    // Function to generate the random access code
    const generateAccessCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) { // Generate an 8-character random string
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            }

            // Generate access code
            const generatedAccessCode = generateAccessCode();
            setAccessCode(generatedAccessCode); // Store the generated access code
            // Generate QR code for the access code
            setQrCode(generatedAccessCode); // Store the access code for QR code generation
            const eventData = {
                name,
                description,
                start_time: startTime,
                end_time: endTime,
                access_code: generatedAccessCode,
                group: group || null,
                qrCode: qrCode
            };

            // Send the event data to the backend
            const response = await axiosInstance.post('https://eventmanager-1-l2dr.onrender.com/events', eventData);
            setEventId(response.data.eventId);
            setMessage(`Event created successfully: ${response.data.message}`);

        } catch (err) {
            setMessage(`Error creating event: ${err.response?.data.message || err.message}`);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create Event
            </Typography>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Event Name */}
                        <Grid item xs={12}>
                            <TextField
                                label="Event Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Event Description */}
                        <Grid item xs={12}>
                            <TextField
                                label="Event Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        {/* Start Time */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Start Time"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* End Time */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="End Time"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
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
                                Create Event
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Message Section */}
            {message && (
                <Box sx={{ marginBottom: 3 }}>
                    <Typography variant="h6" color={message.startsWith('Error') ? 'error' : 'success'}>
                        {message}
                    </Typography>
                </Box>
            )}

            {/* QR Code Section */}
            {qrCode && (
                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Access Code QR Code
                    </Typography>
                    <Typography variant="body1">Access Code: {accessCode}</Typography>
                    <Box sx={{ display: 'inline-block', marginTop: 2 }}>
                        <QRCodeCanvas
                            value={`https://andrei2308.github.io/EventManager?eventId=${eventId}&action=join`}
                            size={256}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
