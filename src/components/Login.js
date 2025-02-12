import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material";
import api from "../api/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });
      const result = await response.text();
      setMessage(result);
      if (response.ok && result === "login successful") {
        localStorage.setItem("isAuthenticated", true);
        console.log(`Welcome, ${username}!`);
        navigate("/");
      } else {
        setMessage("Invalid username or password !");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred while logging in.");
    }

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh", 
      paddingBottom: "0px", 
      marginTop: "-10px",
      backgroundImage: `url(https://assets.progressoft.com/blogs/user-experience-mistakes-to-avoid-in-digital-banking.png)`,
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
      backgroundRepeat: "no-repeat", // Prevent repeating
      backgroundAttachment: "fixed", // Optional: Fix the background while scrolling
      color: theme.palette.text.primary,
    }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 400,
          padding: 3,
          borderRadius: 3,
          boxShadow: 5,
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white background for better readability
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
        {message && (
          <Alert
            severity={message === "login successful" ? "success" : "error"}
            sx={{ mt: 2, width: "100%" }}
          >
            {message}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Login;