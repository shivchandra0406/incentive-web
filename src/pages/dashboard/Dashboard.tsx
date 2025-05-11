import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  TrendingUp, 
  BusinessCenter, 
  Payment, 
  Person 
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for dashboard - in a real app, this would come from API
const mockDashboardData = {
  totalDeals: 24,
  pendingDeals: 8,
  closedDeals: 16,
  totalPayouts: 125000,
  pendingPayouts: 45000,
  topPerformers: [
    { id: '1', name: 'John Doe', deals: 8, earnings: 42500 },
    { id: '2', name: 'Jane Smith', deals: 6, earnings: 38000 },
    { id: '3', name: 'Robert Johnson', deals: 5, earnings: 27500 },
  ],
  recentDeals: [
    { id: '1', title: 'Enterprise Software License', client: 'Acme Corp', value: 250000, status: 'Closed' },
    { id: '2', title: 'Cloud Migration Project', client: 'XYZ Industries', value: 175000, status: 'Negotiation' },
    { id: '3', title: 'Security Audit', client: 'ABC Company', value: 85000, status: 'Proposal' },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  // In a real app, you would fetch dashboard data from API
  useEffect(() => {
    // Simulating API call
    setLoading(true);
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.email}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Total Deals
              </Typography>
              <BusinessCenter />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {dashboardData.totalDeals}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {dashboardData.pendingDeals} pending, {dashboardData.closedDeals} closed
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6">
                Total Payouts
              </Typography>
              <Payment />
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {formatCurrency(dashboardData.totalPayouts)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {formatCurrency(dashboardData.pendingPayouts)} pending
            </Typography>
          </Paper>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Top Performers
            </Typography>
            <List>
              {dashboardData.topPerformers.map((performer) => (
                <ListItem key={performer.id} divider>
                  <ListItemText
                    primary={performer.name}
                    secondary={`${performer.deals} deals • ${formatCurrency(performer.earnings)}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Deals */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Deals
            </Typography>
            <List>
              {dashboardData.recentDeals.map((deal) => (
                <ListItem key={deal.id} divider>
                  <ListItemText
                    primary={deal.title}
                    secondary={`Client: ${deal.client} • Value: ${formatCurrency(deal.value)}`}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        deal.status === 'Closed'
                          ? 'success.main'
                          : deal.status === 'Negotiation'
                          ? 'warning.main'
                          : 'info.main',
                    }}
                  >
                    {deal.status}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
