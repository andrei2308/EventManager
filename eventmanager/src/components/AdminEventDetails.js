import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
console.log("hit");
export function AdminEventsDetails() {
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const redirect = useNavigate();
    const { eventId } = useParams();
    const userId = JSON.parse(localStorage.getItem('userID'));
    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`http://localhost:10001/events/details/admin/${eventId}`)
            .then((response) => {
                setEvent(response.data.event || []);
            })
            .catch((err) => {
                setError("Failed to fetch events: " + (err.response?.data.message || err.message));
            });
    }, [eventId]);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    const handleClickEdit = () => {
        alert('Edit event clicked');
    };
    const handleClickSeeParticipants = () => {
        redirect(`/events/${eventId}/participants`);
    };
    const handleDeleteEvent = () => {
        // are you sure?
        axiosInstance.delete(`http://localhost:10001/events/${eventId}`)
            .then(() => {
                alert('Event deleted');
                redirect(`/events/${userId}`);
            })
            .catch((err) => {
                setError('Failed to delete event: ' + (err.response?.data.message || err.message));
            });
    }
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
                    <p>Access code: {event.access_code}</p>
                    <p>Status:{event.status}</p>
                    <button onClick={handleClickEdit}>Edit Event</button>
                    <button onClick={handleClickSeeParticipants}>See Participants</button>
                    <button onClick={handleDeleteEvent}>Delete Event</button>
                </div>
            )}
        </div>
    );
}