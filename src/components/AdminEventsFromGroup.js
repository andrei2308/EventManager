import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export function AdminEventsFromGroup() {
    const [event, setEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { groupId } = useParams();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`https://eventmanager-1-l2dr.onrender.com/events/admin/groups/${groupId}`)
            .then((response) => {
                setEvents(response.data.events || []);
            })
            .catch((err) => {
                setError("Failed to fetch events: " + (err.response?.data.message || err.message));
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
                        <li
                            key={event._id}
                            onClick={() => navigate(`/events/details/admin/${event._id}`)} // Add click handler
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} // Optional styles
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