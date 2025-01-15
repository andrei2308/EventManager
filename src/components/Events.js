import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useNavigate } from 'react-router-dom';
export function Events() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }
        axiosInstance.get('http://localhost:10001/events')
            .then((response) => {
                setEvents(response.data.events || []);
            })
            .catch((err) => {
                setError('Failed to fetch events: ' + (err.response?.data.message || err.message));
            });
    }, []);

    if (error) {
        return <div><p>{error}</p></div>;
    }

    const handleEventClick = async (eventId) => {
        navigate(`/events/details/${eventId}`);
    };

    return (
        <div>
            <h2>Events</h2>
            {events.length > 0 ? (
                <ul>
                    {events.map((event) => (
                        <li
                            key={event._id}
                            onClick={() => handleEventClick(event._id)} // Add click handler
                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Optional styles
                        >
                            {event.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found</p>
            )}
        </div>
    );
}
