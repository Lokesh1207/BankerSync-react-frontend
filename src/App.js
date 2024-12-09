import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Switch, FormControlLabel } from '@mui/material';
import './App.css';
import ClientPage from './components/ClientPage';
import Loan from './components/Loan';
import Reports from './components/Reports';
import Home from './components/Home';
import SideNav from './SideNav';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
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
              position: 'fixed',      
              top: '20px',            
              right: '20px',         
              zIndex: 9999,          
              backgroundColor: 'transparent',
            }}
          >
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={handleToggle} />}
              label="Dark Mode"
            />
          </div>

          <div style={{ paddingTop: '10px' }}>  
            <Routes>
              <Route path="/" element={<SideNav />}>
                <Route index element={<Home />} />
                <Route path="client" element={<ClientPage />} />
                <Route path="loan" element={<Loan />} />
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
