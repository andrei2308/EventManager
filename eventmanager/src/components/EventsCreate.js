import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfiguration';
export function EventsCreate() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [accessCode, setAccessCode] = useState('');
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
            const eventData = {
                name,
                description,
                start_time: startTime,
                end_time: endTime,
                access_code: accessCode,
                group,
            };
            const response = await axiosInstance.post('http://localhost:10001/events', eventData);

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
                    placeholder="Access Code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
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
        </div>
    );
}