import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("https://bankersync-deployment.onrender.com/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: new URLSearchParams({ username, password }),
  //     });

  //     const result = await response.text();
  //     setMessage(result);

  //     if (response.ok && result === "login successful") {
  //       localStorage.setItem("isAuthenticated", true);
  //       console.log(`Welcome, ${username}!`)
  //       navigate("/");
  //     } else {
  //       setMessage("Invalid username or password !");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setMessage("An error occurred while logging in.");
  //   }
    
  //    setTimeout(() => {
  //     setMessage("");
  //   }, 3000);
    
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send data in query string format as required by @RequestParam
      const params = new URLSearchParams({ username, password });
  
      const response = await api.post(`/auth/login?${params.toString()}`);
  
      const result = response.data; // Axios parses the response automatically
      setMessage(result);
  
      if (response.status === 200 && result === "login successful") {
        localStorage.setItem("isAuthenticated", true);
        console.log(`Welcome, ${username}!`);
        navigate("/");
      } else {
        setMessage("Invalid username or password!");
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
        padding: 2,
        backgroundColor: theme.palette.background.default, 
        color: theme.palette.text.primary, 
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
          maxWidth: 400,
          gap: 2,
          padding: 3,
          borderRadius: 3,
          boxShadow: 5,
          backgroundColor: theme.palette.background.paper,
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

        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>

      </Box>

      {message && (
        <Alert severity={message === "login successful" ? "success" : "error"} sx={{ mt: 2, width: "100%", maxWidth: 400,}}>{message}</Alert>
      )}

    </Box>
  );
};

export default Login;
