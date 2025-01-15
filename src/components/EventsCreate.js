import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfiguration';
import { QRCodeCanvas } from 'qrcode.react'; // Correctly import QRCodeCanvas

export function EventsCreate() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [group, setGroup] = useState('');
    const [accessCode, setAccessCode] = useState(''); // Store the generated access code
    const [qrCode, setQrCode] = useState(''); // Store the QR code
    const [message, setMessage] = useState('');

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

            setMessage(`Event created successfully: ${response.data.message}`);

        } catch (err) {
            setMessage(`Error creating event: ${err.response?.data.message || err.message}`);
        }
    };

    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="Start Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    placeholder="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Group ID (optional)"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                />
                <button type="submit">Create Event</button>
            </form>

            {message && <p>{message}</p>}

            {qrCode && (
                <div>
                    <h3>Access Code QR Code</h3>
                    <p>Access Code: {accessCode}</p>
                    <QRCodeCanvas value={qrCode} size={256} />
                </div>
            )}
        </div>
    );
}
