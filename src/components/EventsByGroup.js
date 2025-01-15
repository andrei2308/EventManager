import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function EventsByGroup() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { groupId } = useParams();
    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in.');
                return;
            }

            try {
                const response = await axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/groups/details/${groupId}`);
                setEvents(response.data.events);
            } catch (err) {
                console.error(err);
                setError('Error fetching events. Please try again.');
            }
        };

        fetchEvents();
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