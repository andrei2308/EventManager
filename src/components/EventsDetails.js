import React from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosConfiguration";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
export function EventsDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const redirect = useNavigate();
  const location = useLocation();
  const userID = JSON.parse(localStorage.getItem("userID"));
  const { role } = location.state || {};
  const { state } = location.state || {};
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      setIsLoading(false);
      return;
    }

    axiosInstance
      .get(`https://eventmanager-1-l2dr.onrender.com/events/${eventId}`)
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

  const [enteredCode, setEnteredCode] = useState("");

  const handleJoinEvent = async () => {
    if (enteredCode === event.access_code) {
      if (event.status === "OPEN") {
        setError("Event is already open.");
        return;
      }
      if (event.participants.includes(userID)) {
        setError("You are already a participant.");
        return;
      }
      try {
        // Logic to join event (e.g., API call)
        await axiosInstance.post(
          `https://eventmanager-1-l2dr.onrender.com/events/${eventId}/join`,
        );
        redirect("/user");
      } catch (err) {
        console.error("Error joining event:", err);
        setError("Failed to join the event.");
      }
    } else {
      setError("Invalid access code.");
    }
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
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      {error && (
        <Typography
          variant="body1"
          color="error"
          sx={{
            marginBottom: 3,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </Typography>
      )}
      {event && (
        <Card
          sx={{
            maxWidth: 600,
            margin: "0 auto",
            padding: 3,
            boxShadow: 6,
            backgroundColor: "#ffffff",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: "center",
                color: "#0d47a1",
                fontWeight: "bold",
              }}
            >
              Event Details
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: "1rem", marginBottom: 2 }}>
              <strong>Name:</strong> {event.name}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: "1rem", marginBottom: 2 }}>
              <strong>Description:</strong> {event.description}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: "1rem", marginBottom: 2 }}>
              <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: "1rem", marginBottom: 2 }}>
              <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontSize: "1rem", marginBottom: 2 }}>
              <strong>Access Code:</strong> <span style={{ color: "#757575" }}>Hidden</span>
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: event.status === "OPEN" ? "#d32f2f" : "#388e3c",
              }}
            >
              <strong>Status:</strong> {event.status === "CLOSED" ? "Not started" : "In progress"}
            </Typography>

            {/* If the user is guest we display event joined sucessfully */}
            {role === "guest" || state === "attended" ? (

              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  color: "#388e3c",
                  fontWeight: "bold",
                  marginTop: 3,
                }}
              >
                Event joined at {role === "guest" ? new Date().toLocaleString() : new Date(event.participants.find((p) => p.userId === userID).joinedAt).toLocaleString()}
              </Typography>
            ) : (
              event.status === "CLOSED" && (
                <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: "#0d47a1",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Join Event
                  </Typography>
                  <TextField
                    label="Enter Access Code"
                    variant="outlined"
                    fullWidth
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    error={!!error && error.includes("Invalid access code")}
                    helperText={error.includes("Invalid access code") ? error : ""}
                    sx={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: 1,
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleJoinEvent}
                    sx={{
                      padding: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      backgroundColor: "#0d47a1",
                      "&:hover": {
                        backgroundColor: "#0b3c8b",
                      },
                    }}
                  >
                    Join Event
                  </Button>
                </Box>
              )
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
