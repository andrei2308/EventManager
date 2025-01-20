import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
export function AttendedEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
    axiosInstance
      .get(`https://eventmanager-1-l2dr.onrender.com/events/attended/${userId}`)
      .then((response) => {
        setEvents(response.data.events || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          "Failed to fetch events: " +
          (err.response?.data.message || err.message),
        );
        setIsLoading(false);
      });
  }, [userId]);
  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  const handleViewEvent = (eventId) => {
    navigate(`/events/details/${eventId}`, { state: { state: "attended" } });
  };
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
          borderBottom: "2px solid #1976d2", // Underline effect
          paddingBottom: 1,
          marginBottom: 3,
        }}
      >
        Attended Events
      </Typography>
      {events.length > 0 ? (
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card onClick={() => handleViewEvent(event._id)}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#fffde7", // Alternating light blue and yellow
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
                  "&:hover": {
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)", // Stronger hover effect
                    transform: "translateY(-5px)", // Slight hover lift
                  },
                  borderRadius: 4, // Rounded corners
                  transition: "all 0.3s ease-in-out", // Smooth transition on hover
                  padding: 2, // Internal padding for better spacing
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: "#0d47a1", // Dark blue for event names
                      fontWeight: "bold",
                    }}
                  >
                    {event.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#424242", // Neutral gray for description
                      marginBottom: 1,
                    }}
                  >
                    {event.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1b5e20", // Green for start time
                      fontWeight: "bold",
                      marginTop: 1,
                    }}
                  >
                    <strong>Start:</strong>{" "}
                    {new Date(event.start_time).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#b71c1c", // Red for end time
                      fontWeight: "bold",
                      marginTop: 1,
                    }}
                  >
                    <strong>End:</strong>{" "}
                    {new Date(event.end_time).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#757575", // Neutral gray for "No events" message
            marginTop: 5,
            fontStyle: "italic",
          }}
        >
          No attended events found
        </Typography>
      )}
    </Box>
  );
}
