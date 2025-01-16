import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export function AttendedEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { userId } = useParams();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/attended/${userId}`)
            .then((response) => {
                setEvents(response.data.events || []);
            })
            .catch((err) => {
                setError('Failed to fetch events: ' + (err.response?.data.message || err.message));
            });
    }, [userId]);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    const handleViewEvent = (eventId) => {
        navigate(`/events/${eventId}`);
    };
    return (
        <div>
            <h2>Attended Events</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {events.map((event) => (
                <div key={event._id}>
                    <p>Name: {event.name}</p>
                    <p>Description: {event.description}</p>
                    <p>Start time: {new Date(event.start_time).toLocaleString()}</p>
                    <p>End time: {new Date(event.end_time).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}