import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useParams, useNavigate } from 'react-router-dom';

export function JoinByQR() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');
    const [showGuestInput, setShowGuestInput] = useState(false);
    const [guestName, setGuestName] = useState('');
    const redirect = useNavigate();

    useEffect(() => {
        // Fetch event details
        axiosInstance
            .get(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join`)
            .then((response) => {
                setEvent(response.data.event);
            })
            .catch((err) => {
                setError('Failed to fetch event details: ' + (err.response?.data.message || err.message));
            });
    }, [eventId]);

    // Handles logging in and redirecting back to the event
    const handleLogin = () => {
        redirect(`/EventManager?eventId=${eventId}&action=login`);
    };

    // Handles registering and redirecting back to the event
    const handleRegister = () => {
        redirect(`/EventManager?eventId=${eventId}&action=register`);
    };

    // Handles joining as a guest
    const handleGuestJoin = () => {
        if (!guestName) {
            setError('Please enter your name to join as a guest.');
            return;
        }
        axiosInstance
            .post(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join-guest`, { name: guestName })
            .then(() => {
                alert('Successfully joined the event as a guest!');
                redirect(`/EventManager`);
            })
            .catch((err) => {
                setError('Failed to join as guest: ' + (err.response?.data.message || err.message));
            });
    };

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
                    <button onClick={handleLogin}>Log in</button>
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={() => setShowGuestInput(true)}>Join as Guest</button>
                    {showGuestInput && (
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                            />
                            <button onClick={handleGuestJoin}>Confirm</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
