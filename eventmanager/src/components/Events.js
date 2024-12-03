import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfiguration';

export function Events() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

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

    return (
        <div>
            <h2>Events</h2>
            {events.length > 0 ? (
                <ul>
                    {events.map((event) => (
                        <li key={event.id}>{event.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No events found</p>
            )}
        </div>
    );
}
