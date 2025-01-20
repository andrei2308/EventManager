import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

export function JoinByQR() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const redirect = useNavigate();

  useEffect(() => {
    // Fetch event details
    axiosInstance
      .get(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join`)
      .then((response) => {
        setEvent(response.data.event);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          "Failed to fetch event details: " +
          (err.response?.data.message || err.message),
        );
        setIsLoading(false);
      });
  }, [eventId]);

  // Handles logging in and redirecting back to the event
  const handleLogin = () => {
    redirect(`/EventManager?eventId=${eventId}&action=login`);
  };

  // Handles registering and redirecting back to the event
  const handleRegister = () => {
    redirect(`/EventManager?eventId=${eventId}&action=register`);
  };

  // Handles joining as a guest
  const handleGuestJoin = () => {
    if (!guestName) {
      setError("Please enter your name to join as a guest.");
      return;
    }
    axiosInstance
      .post(
        `https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join-guest`,
        { name: guestName },
      )
      .then(() => {
        alert("Successfully joined the event as a guest!");
        redirect(`/events/details/${eventId}`, { state: { role: "guest" } });
      })
      .catch((err) => {
        setError(
          "Failed to join as guest: " +
          (err.response?.data.message || err.message),
        );
      });
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
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#ffffff", // Pure white background
        minHeight: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#0d47a1", // Deep blue header
          fontWeight: "bold",
        }}
      >
        Join Event
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      {event && (
        <Card
          sx={{
            marginTop: 3,
            padding: 3,
            borderRadius: 2, // Rounded corners
            boxShadow: 4, // Subtle shadow
            backgroundColor: "#f7faff", // Light blue card background
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#0d47a1", // Deep blue for event name
              }}
            >
              {event.name}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ marginBottom: 2, color: "#424242" }} // Neutral gray for description
            >
              {event.description}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                marginBottom: 1,
                color: "#757575", // Subtle gray for meta information
              }}
            >
              <strong>Start time:</strong>{" "}
              {new Date(event.start_time).toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#757575", // Subtle gray for meta information
              }}
            >
              <strong>End time:</strong>{" "}
              {new Date(event.end_time).toLocaleString()}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 3,
                gap: 2, // Space between buttons
                flexWrap: "wrap", // Ensure responsive behavior
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0d47a1", // Deep blue button
                  "&:hover": {
                    backgroundColor: "#083b91", // Darker shade on hover
                  },
                  flex: 1,
                  minWidth: "30%",
                  textTransform: "none", // No uppercase
                  fontWeight: "bold",
                }}
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2", // Light blue button
                  "&:hover": {
                    backgroundColor: "#135ba1", // Darker shade on hover
                  },
                  flex: 1,
                  minWidth: "30%",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={handleRegister}
              >
                Register
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#2e7d32", // Green border
                  color: "#2e7d32", // Green text
                  "&:hover": {
                    backgroundColor: "#e8f5e9", // Light green hover effect
                    borderColor: "#1b5e20", // Darker green border
                  },
                  flex: 1,
                  minWidth: "30%",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={() => setShowGuestInput(true)}
              >
                Join as Guest
              </Button>
            </Box>

            {showGuestInput && (
              <Box sx={{ marginTop: 3 }}>
                <TextField
                  label="Enter your name"
                  variant="outlined"
                  fullWidth
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  sx={{
                    marginBottom: 2,
                    backgroundColor: "#f9f9f9", // Light gray for input field
                    borderRadius: 1,
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#2e7d32", // Green button
                    "&:hover": {
                      backgroundColor: "#1b5e20", // Darker green on hover
                    },
                    fullWidth: true,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={handleGuestJoin}
                >
                  Confirm
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
