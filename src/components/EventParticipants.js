import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
export function EventParticipants() {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();
  const userId = JSON.parse(localStorage.getItem("userID"));
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      setIsLoading(false);
      return;
    }
    axiosInstance
      .get(`/events/${eventId}/participants`)
      .then((response) => {
        setParticipants(response.data.participants || []);
        setGuests(response.data.guests || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          "Failed to fetch participants: " +
            (err.response?.data.message || err.message),
        );
        setIsLoading(false);
      });
  }, []);
  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  const handleExportParticipants = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    axiosInstance
      .get(
        `https://eventmanager-1-l2dr.onrender.com/groups/admin/export/participants/${userId}`,
      )
      .then((response) => {
        // Extract usernames from the response data
        const usernames = response.data.users.map((user) => user.username);

        // Generate CSV content
        const csvContent =
          "data:text/csv;charset=utf-8," + usernames.join("\n");

        // Create a downloadable link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.setAttribute("download", "participants.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setError(
          "Failed to fetch participants: " +
            (err.response?.data.message || err.message),
        );
      });
  };
  const handleExportParticipantsXlsx = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    axiosInstance
      .get(
        `https://eventmanager-1-l2dr.onrender.com/groups/admin/export/participants/${userId}`,
      )
      .then((response) => {
        // Extract usernames from the response data
        const usernames = response.data.users.map((user) => user.username);

        // Generate XLSX content
        const xlsx = require("xlsx");
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet([
          ["Usernames"], // Add a header row
          ...usernames.map((username) => [username]), // Add rows for each username
        ]);
        xlsx.utils.book_append_sheet(wb, ws, "Participants");
        const wbout = xlsx.write(wb, { type: "binary", bookType: "xlsx" });

        // Helper function to convert binary data to an ArrayBuffer
        const s2ab = (s) => {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        };

        // Create a downloadable link
        const blob = new Blob([s2ab(wbout)], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "participants.xlsx");
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
      })
      .catch((err) => {
        setError(
          "Failed to fetch participants: " +
            (err.response?.data.message || err.message),
        );
      });
  };
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f7faff", // Light blue background
        minHeight: "100vh", // Full viewport height
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#1976d2", // Deep blue for the title
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Event Participants
      </Typography>

      {participants.length > 0 || guests.length > 0 ? (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#1976d2", // Deep blue for "Registered Participants"
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Registered Participants
          </Typography>
          <Grid container spacing={3} sx={{ marginBottom: 4 }}>
            {participants.map((participant, index) => (
              <Grid item xs={12} sm={6} md={4} key={participant._id}>
                <Card
                  sx={{
                    backgroundColor: "#ffffff", // White background for consistency
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 6, // Subtle hover effect
                    },
                    transition: "all 0.3s ease-in-out",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#0d47a1", // Dark blue for participant name
                        fontWeight: "bold",
                      }}
                    >
                      {participant.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161", // Neutral gray for timestamp
                        marginTop: 1,
                      }}
                    >
                      Joined at:{" "}
                      {new Date(participant.joinedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#1976d2", // Deep blue for "Guest Participants"
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Guest Participants
          </Typography>
          <Grid container spacing={3}>
            {guests.map((guest, index) => (
              <Grid item xs={12} sm={6} md={4} key={guest.name}>
                <Card
                  sx={{
                    backgroundColor: "#ffffff", // White background for consistency
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 6, // Subtle hover effect
                    },
                    transition: "all 0.3s ease-in-out",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#0d47a1", // Dark blue for guest name
                        fontWeight: "bold",
                      }}
                    >
                      Guest: {guest.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#616161", // Neutral gray for timestamp
                        marginTop: 1,
                      }}
                    >
                      Joined at: {new Date(guest.joinedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              justifyContent: "center",
              gap: 2, // Add spacing between buttons
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                color: "#ffffff", // White text
                "&:hover": {
                  backgroundColor: "#115293", // Darker blue on hover
                },
                padding: 1,
                fontWeight: "bold",
              }}
              onClick={handleExportParticipants}
            >
              Export Participants (CSV)
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                color: "#ffffff", // White text
                "&:hover": {
                  backgroundColor: "#115293", // Darker blue on hover
                },
                padding: 1,
                fontWeight: "bold",
              }}
              onClick={handleExportParticipantsXlsx}
            >
              Export Participants (XLSX)
            </Button>
          </Box>
        </>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#757575", // Neutral gray for "No participants" message
            marginTop: 5,
          }}
        >
          No participants or guests found
        </Typography>
      )}
    </Box>
  );
}
