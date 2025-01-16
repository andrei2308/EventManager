import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

export function JoinByQR() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');
    const redirect = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            redirect('/EventManager');
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/:eventId/join`)
            .then((response) => {
                setEvent(response.data.event);
            })
            .catch((err) => {
                setError('Failed to fetch event details: ' + (err.response?.data.message || err.message));
            });
        if (err.response.status === 401) {
            setError('You are not authorized to join this event');
        }
    }, [eventId]);


    return (
        <div>
            <h2>Join Event</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {event && (
                <div>
                    <p>Name: {event.name}</p>
                    <p>Description: {event.description}</p>
                    <p>Start time: {new Date(event.start_time).toLocaleString()}</p>
                    <p>End time: {new Date(event.end_time).toLocaleString()}</p>
                    <p>Access code: {event.access_code}</p>
                    <p>Status: {event.status}</p>
                    <p>Participants: {event.participants}</p>
                    <button onClick={handleJoinEvent}>Join Event</button>
                </div>
            )}
        </div>
    );
}
