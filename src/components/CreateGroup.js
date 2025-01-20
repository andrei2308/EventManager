import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
} from "@mui/material";
export function CreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please log in.");
        return;
      }
      const groupData = {
        name,
        description,
        group,
      };
      const response = await axiosInstance.post(
        "https://eventmanager-1-l2dr.onrender.com/group",
        groupData,
      );

      setMessage(`Event created successfully: ${response.data.message}`);
    } catch (err) {
      setMessage(
        `Error creating event: ${err.response?.data.message || err.message}`,
      );
    }
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
          color: "#1976d2", // Deep blue for the heading
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "2px solid #1976d2", // Underline for emphasis
          paddingBottom: 1,
          marginBottom: 3,
        }}
      >
        Create Group
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          margin: "0 auto",
          maxWidth: 600, // Center and constrain the width
          backgroundColor: "#ffffff", // White card background
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          borderRadius: 4, // Rounded corners
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Group Name */}
            <Grid item xs={12}>
              <TextField
                label="Group Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2", // Blue border on hover
                    },
                  },
                }}
              />
            </Grid>

            {/* Group Description */}
            <Grid item xs={12}>
              <TextField
                label="Group Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2", // Blue border on hover
                    },
                  },
                }}
              />
            </Grid>

            {/* Group ID */}
            <Grid item xs={12}>
              <TextField
                label="Group ID (optional)"
                variant="outlined"
                fullWidth
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#1976d2", // Blue border on hover
                    },
                  },
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#1976d2", // Deep blue background
                  "&:hover": {
                    backgroundColor: "#115293", // Darker blue on hover
                  },
                  padding: 1,
                  fontWeight: "bold",
                  textTransform: "none", // Keep the button text case consistent
                }}
              >
                Create Group
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Message Section */}
      {message && (
        <Box
          sx={{
            marginTop: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: message.startsWith("Error") ? "#d32f2f" : "#388e3c", // Red for error, green for success
              fontWeight: "bold",
            }}
          >
            {message}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
