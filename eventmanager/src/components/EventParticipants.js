import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfiguration';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export function EventParticipants() {
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { eventId } = useParams();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }
        axiosInstance.get(`/events/${eventId}/participants`)
            .then((response) => {
                setParticipants(response.data.participants || []);
                console.log(response.data.participants);
            })
            .catch((err) => {
                setError('Failed to fetch participants: ' + (err.response?.data.message || err.message));
            });
    }, []);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    return (
        <div>
            <h2>Participants</h2>
            {participants.length > 0 ? (
                <ul>
                    {participants.map((participant) => (
                        <li key={participant._id}>
                            {participant.username}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No participants found</p>
            )}
        </div>
    );
}