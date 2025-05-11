import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';

// Simple Login Component
function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      // Simple validation
      localStorage.setItem('user', JSON.stringify({ email }));
      onLogin(email);
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Incentive Management
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Login to your account
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

// Dashboard Component
function Dashboard({ email, onLogout }: { email: string, onLogout: () => void }) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const drawerWidth = 240;

  // Sample data for the deals table
  const dealData = [
    { id: 1, name: "Acme Corp Partnership", status: "Active", value: 250000 },
    { id: 2, name: "TechGiant Software License", status: "Active", value: 180000 },
    { id: 3, name: "GlobalRetail POS System", status: "Closed", value: 320000 },
    { id: 4, name: "HealthCare Solutions", status: "Active", value: 450000 },
    { id: 5, name: "EduTech Learning Platform", status: "Closed", value: 275000 },
    { id: 6, name: "FinServe Banking Module", status: "Active", value: 520000 },
    { id: 7, name: "AutoMotive Dealership", status: "Closed", value: 380000 },
    { id: 8, name: "SmartCity Infrastructure", status: "Active", value: 620000 },
    { id: 9, name: "FoodChain Supply Management", status: "Closed", value: 190000 },
    { id: 10, name: "MediaStream Content Delivery", status: "Active", value: 310000 }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            border: 'none'
          },
        }}
      >
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Incentive Management
          </Typography>
        </Box>
        <List sx={{ py: 2 }}>
          {[
            { text: 'Dashboard', icon: '📊' },
            { text: 'Incentive Rules', icon: '📜' },
            { text: 'Deals', icon: '💼' },
            { text: 'Payouts', icon: '💰' },
            { text: 'Workflow', icon: '🔄' }
          ].map((item, index) => (
            <ListItem
              button
              key={item.text}
              sx={{
                borderRadius: '0 20px 20px 0',
                mx: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)'
                },
                ...(index === 0 && {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                  color: 'primary.main',
                  fontWeight: 'medium'
                })
              }}
            >
              <Box component="span" sx={{ mr: 2, fontSize: '1.2rem' }}>{item.icon}</Box>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          overflow: 'auto',
          transition: 'all 0.3s'
        }}
      >
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            bgcolor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Dashboard
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              borderRadius: 20,
              px: 2,
              py: 0.5,
              mr: 2
            }}>
              <Box component="span" sx={{ mr: 1, fontSize: '1.2rem' }}>👤</Box>
              <Typography>{email}</Typography>
            </Box>
            <Button
              color="primary"
              variant="outlined"
              onClick={onLogout}
              sx={{
                borderRadius: 20,
                textTransform: 'none',
                px: 2
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Top Summary Cards */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Overview
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3
              }}>
                <Box sx={{
                  mr: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  color: 'primary.main',
                  fontSize: '1.8rem'
                }}>
                  📊
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                    Total Deals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    87
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3
              }}>
                <Box sx={{
                  mr: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  color: '#4caf50',
                  fontSize: '1.8rem'
                }}>
                  🟢
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                    Active Deals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    45
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3
              }}>
                <Box sx={{
                  mr: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(158, 158, 158, 0.1)',
                  color: '#757575',
                  fontSize: '1.8rem'
                }}>
                  ✅
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                    Closed Deals
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    42
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Section */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Performance
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    mr: 2,
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.5rem'
                  }}>
                    💰
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Incentive Amount
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ₹20,000
                </Typography>
                <Box sx={{
                  mt: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  display: 'inline-block'
                }}>
                  <Typography variant="body2">
                    10% of target achieved
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #3f51b5 0%, #7986cb 100%)',
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    mr: 2,
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.5rem'
                  }}>
                    🏆
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    Target Amount
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ₹2,00,000
                </Typography>
                <Box sx={{
                  mt: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  display: 'inline-block'
                }}>
                  <Typography variant="body2">
                    Quarterly target
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top 10 Deals Table */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Top 10 Deals
        </Typography>
        <Card sx={{
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <Box sx={{
            width: '100%',
            overflowX: 'auto'
          }}>
            <Box component="table" sx={{
              width: '100%',
              borderCollapse: 'collapse',
              whiteSpace: 'nowrap'
            }}>
              <Box component="thead" sx={{
                bgcolor: '#f5f7fa',
                borderBottom: '2px solid rgba(0,0,0,0.08)'
              }}>
                <Box component="tr">
                  <Box component="th" sx={{
                    py: 2,
                    px: 3,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: 'text.secondary'
                  }}>
                    Deal Name
                  </Box>
                  <Box component="th" sx={{
                    py: 2,
                    px: 3,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: 'text.secondary'
                  }}>
                    Status
                  </Box>
                  <Box component="th" sx={{
                    py: 2,
                    px: 3,
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: 'text.secondary'
                  }}>
                    Value (₹)
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {dealData.map((deal, index) => (
                  <Box
                    component="tr"
                    key={deal.id}
                    sx={{
                      bgcolor: index % 2 === 0 ? 'white' : '#f9fafc',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <Box component="td" sx={{ py: 2, px: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      {deal.name}
                    </Box>
                    <Box component="td" sx={{ py: 2, px: 3, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <Box sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 10,
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        ...(deal.status === 'Active' ? {
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50'
                        } : {
                          bgcolor: 'rgba(158, 158, 158, 0.1)',
                          color: '#757575'
                        })
                      }}>
                        {deal.status}
                      </Box>
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        py: 2,
                        px: 3,
                        textAlign: 'right',
                        fontWeight: 'medium',
                        borderBottom: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      {deal.value.toLocaleString('en-IN')}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

// Main App Component
function App() {
  // Check if user is already logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserEmail(userData.email);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Box sx={{ height: '100vh' }}>
      {isLoggedIn ? (
        <Dashboard email={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </Box>
  );
}

export default App;
