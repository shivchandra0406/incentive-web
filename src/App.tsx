import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './AppRouter';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#8E24AA', // Purple
    },
    secondary: {
      main: '#00BCD4', // Cyan
    },
  },
});

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh' }}>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
