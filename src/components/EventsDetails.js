import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfiguration';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
export function EventsDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');
    const redirect = useNavigate();
    const userID = JSON.parse(localStorage.getItem('userID'));
    console.log('hit');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}`)
            .then((response) => {
                setEvent(response.data.event);
            })
            .catch((err) => {
                setError('Failed to fetch event details: ' + (err.response?.data.message || err.message));
            });
    }, [eventId]);

    const [enteredCode, setEnteredCode] = useState('');

    const handleJoinEvent = async () => {
        if (enteredCode === event.access_code) {
            if (event.status === 'OPEN') {
                setError('Event is already open.');
                return;
            }
            if (event.participants.includes(userID)) {
                setError('You are already a participant.');
                return;
            }
            try {
                // Logic to join event (e.g., API call)
                console.log('Successfully joined event!');
                await axiosInstance.post(`/events/${eventId}/join`);
                redirect('/events');
            } catch (err) {
                console.error('Error joining event:', err);
                setError('Failed to join the event.');
            }
        } else {
            setError('Invalid access code.');
        }
    };
    return (
        <div>
            <h2>Event Details</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {event && (
                <div>
                    <p>Name: {event.name}</p>
                    <p>Description: {event.description}</p>
                    <p>Start time: {new Date(event.start_time).toLocaleString()}</p>
                    <p>End time: {new Date(event.end_time).toLocaleString()}</p>
                    <p>Access code: {"Hidden"}</p>
                    <p>Status:{event.status}</p>
                    {/* Participant: Enter Access Code */}
                    <input
                        type="text"
                        placeholder="Enter access code"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                    />
                    <button onClick={handleJoinEvent}>Join Event</button>
                </div>
            )}
        </div>
    );
}