import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, IconButton, CssBaseline } from '@mui/material';
import './App.css';
import ClientPage from './components/ClientPage';
import Loan from './components/Loan';
import Reports from './components/Reports';
import Home from './components/Home';
import SideNav from './SideNav';
import ManageClient from './ManageClient';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from "@mui/icons-material/LightMode";
import ManageLoans from './ManageLoans';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography:{
      fontFamily: 'Poppins',
      fontWeightBold: 700,
      fontWeightLight: 300,
      fontWeightRegular:500,
      fontWeightMedium: 500
    }
  });
  
  const handleToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div>
          <div
            style={{
              position: "fixed",
              top: "9px",
              right: "20px",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <IconButton
              onClick={handleToggle}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              size="large"
              style={{
                color: darkMode ? "#FFD700" : "#000000", 
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </div>

          <div style={{ paddingTop: '10px' }}>  
            <Routes>
            <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><SideNav /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="client" element={<ClientPage />} />
                <Route path="client/getClients" element={<ManageClient />} />
                <Route path="loan" element={<Loan />} />
                <Route path="loan/getLoans" element={<ManageLoans />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
