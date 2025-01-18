import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfiguration";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
export function GroupsView() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found, please log in.");
      setIsLoading(false);
      return;
    }
    axiosInstance
      .get("https://eventmanager-1-l2dr.onrender.com/groups")
      .then((response) => {
        setGroups(response.data.groups || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          "Failed to fetch groups: " +
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

  const handleGroupClick = async (groupId) => {
    navigate(`/groups/details/${groupId}`);
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
        backgroundColor: "#ffffff", // Pure white background for a clean look
        minHeight: "100vh", // Full viewport height
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#0d47a1", // Deep blue for the title
          fontWeight: "bold",
        }}
      >
        Groups
      </Typography>
      {groups.length > 0 ? (
        <Grid container spacing={3}>
          {groups.map((group, index) => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card
                onClick={() => handleGroupClick(group.id)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#ffffff", // Alternating light blue and white
                  "&:hover": {
                    boxShadow: 6, // Subtle shadow on hover
                    transform: "scale(1.03)", // Slight zoom effect
                  },
                  borderRadius: 2, // Rounded corners for a modern look
                  transition: "all 0.3s ease-in-out", // Smooth hover effect
                  padding: 2, // Padding for internal spacing
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "#0d47a1", // Deep blue for the title
                    }}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#757575", // Muted gray for the description
                      fontSize: "0.9rem",
                    }}
                  >
                    {group.description || "No description available"}
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
            color: "#9e9e9e", // Muted gray for the fallback message
            marginTop: 4,
          }}
        >
          No groups found
        </Typography>
      )}
    </Box>
  );
}
