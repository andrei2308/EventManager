import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";

export function CreateGroup() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [group, setGroup] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            }
            const groupData = {
                name,
                description,
                group
            };
            const response = await axiosInstance.post('https://eventmanager-1-l2dr.onrender.com/group', groupData);

            setMessage(`Event created successfully: ${response.data.message}`);
        } catch (err) {
            setMessage(`Error creating event: ${err.response?.data.message || err.message}`);
        }
    };
    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Group ID"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                />
                <button type="submit">Create group</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
