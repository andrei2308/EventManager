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
export function EventsByGroup() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { groupId } = useParams();
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `https://eventmanager-1-l2dr.onrender.com/groups/details/${groupId}`,
        );
        setEvents(response.data.events);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error fetching events. Please try again.");
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  const handleEventClick = async (eventId) => {
    navigate(`/events/details/${eventId}`);
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
        backgroundColor: "#f7faff", // Subtle light blue background
        minHeight: "100vh", // Full viewport height
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#0d47a1", // Deep blue for the header
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Events
      </Typography>

      {events.length > 0 ? (
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card
                onClick={() => handleEventClick(event._id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#fffde7", // Alternate colors: light blue and light yellow
                  boxShadow: 2,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)", // Subtle scale-up effect on hover
                    boxShadow: 6, // Elevated shadow on hover
                  },
                  borderRadius: 2,
                  padding: 2, // Add padding for a more spacious look
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: "#0d47a1", // Dark blue for event name
                      fontWeight: "bold",
                    }}
                  >
                    {event.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#616161", // Neutral gray for metadata
                      marginBottom: 1,
                    }}
                  >
                    <strong>Start:</strong>{" "}
                    {new Date(event.start_time).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#616161", // Neutral gray for metadata
                      marginBottom: 1,
                    }}
                  >
                    <strong>End:</strong>{" "}
                    {new Date(event.end_time).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: event.status === "CLOSED" ? "#2e7d32" : "#c62828", // Green for closed, red for in-progress
                      fontWeight: "bold",
                    }}
                  >
                    Status:{" "}
                    {event.status === "CLOSED" ? "Not started" : "In progress"}
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
            color: "#757575", // Neutral gray for "No events found" message
            marginTop: 5,
          }}
        >
          No events found
        </Typography>
      )}
    </Box>
  );
}
