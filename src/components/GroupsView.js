import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";

export function GroupsView() {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in.');
            return;
        }
        axiosInstance.get('https://eventmanager-1-l2dr.onrender.com/groups')
            .then((response) => {
                setGroups(response.data.groups || []);
            })
            .catch((err) => {
                setError('Failed to fetch groups: ' + (err.response?.data.message || err.message));
            });
    }, []);

    if (error) {
        return <div><p>{error}</p></div>;
    }

    const handleGroupClick = async (groupId) => {
        navigate(`/groups/details/${groupId}`);
    };

    return (
        <div>
            <h2>Groups</h2>
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li
                            key={group._id}
                            onClick={() => handleGroupClick(group.id)} // Add click handler
                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Optional styles
                        >
                            {group.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No groups found</p>
            )}
        </div>
    );
}