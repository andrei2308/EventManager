import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export function AdminGroups() {
    const [group, setGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { userId } = useParams();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`http://localhost:10001/groups/admin/${userId}`)
            .then((response) => {
                setGroups(response.data.groups || []);
            })
            .catch((err) => {
                setError("Failed to fetch groups: " + (err.response?.data.message || err.message));
            });
    }, []);
    if (error) {
        return <div><p>{error}</p></div>;
    }
    const handleExportParticipants = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`http://localhost:10001/groups/admin/export/participants/${userId}`)
            .then((response) => {
                console.log(response.data);

                // Extract usernames from the response data
                const usernames = response.data.users.map(user => user.username);

                // Generate CSV content
                const csvContent = "data:text/csv;charset=utf-8," + usernames.join("\n");

                // Create a downloadable link
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.href = encodedUri;
                link.setAttribute('download', 'participants.csv');
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                setError("Failed to fetch participants: " + (err.response?.data.message || err.message));
            });
    };
    const handleExportParticipantsXlsx = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found, please log in.");
            return;
        }
        axiosInstance.get(`http://localhost:10001/groups/admin/export/participants/${userId}`)
            .then((response) => {
                console.log(response.data);

                // Extract usernames from the response data
                const usernames = response.data.users.map(user => user.username);

                // Generate XLSX content
                const xlsx = require('xlsx');
                const wb = xlsx.utils.book_new();
                const ws = xlsx.utils.aoa_to_sheet([
                    ["Usernames"], // Add a header row
                    ...usernames.map(username => [username]) // Add rows for each username
                ]);
                xlsx.utils.book_append_sheet(wb, ws, "Participants");
                const wbout = xlsx.write(wb, { type: 'binary', bookType: 'xlsx' });

                // Helper function to convert binary data to an ArrayBuffer
                const s2ab = (s) => {
                    const buf = new ArrayBuffer(s.length);
                    const view = new Uint8Array(buf);
                    for (let i = 0; i < s.length; i++) {
                        view[i] = s.charCodeAt(i) & 0xFF;
                    }
                    return buf;
                };

                // Create a downloadable link
                const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'participants.xlsx');
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
            })
            .catch((err) => {
                setError("Failed to fetch participants: " + (err.response?.data.message || err.message));
            });
    };


    return (
        <div>
            <h2>Groups</h2>
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li
                            key={group._id}
                            onClick={() => navigate(`/groups/details/admin/${group.id}`)} // Add click handler
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} // Optional styles
                        >
                            {group.name}
                        </li>
                    ))}
                </ul>

            ) : (
                <p>No groups found</p>
            )}
            <button onClick={handleExportParticipants}>Export participants</button>
            <button onClick={handleExportParticipantsXlsx}>Export participants xlsx</button>
        </div>
    );
}