import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  BusinessCenter,
  Person,
  Email,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/layout/Layout';
import { dealsService } from '../../services/api';

interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  value: number;
  currencyCode: string;
  status: string;
  closedDate?: string;
  salesRepId: string;
  salesRepName: string;
  activities: Activity[];
  earnings?: {
    id: string;
    amount: number;
    currencyCode: string;
    incentiveRuleId: string;
    incentiveRuleName: string;
  }[];
}

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  const fetchDealDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dealsService.getById(id!);
      if (response.success) {
        setDeal(response.data);
      } else {
        setError(response.message || 'Failed to fetch deal details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching deal details');
      console.error('Error fetching deal details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealDetails();
  }, [id]);

  const handleEditDeal = () => {
    navigate(`/deals/edit/${id}`);
  };

  const handleOpenActivityDialog = () => {
    setActivityDialogOpen(true);
  };

  const handleCloseActivityDialog = () => {
    setActivityDialogOpen(false);
  };

  const activityFormik = useFormik({
    initialValues: {
      type: 'Call',
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
    validationSchema: Yup.object({
      type: Yup.string().required('Activity type is required'),
      description: Yup.string().required('Description is required'),
      date: Yup.date().required('Date is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await dealsService.addActivity(id!, values);
        if (response.success) {
          handleCloseActivityDialog();
          resetForm();
          fetchDealDetails();
        } else {
          setError(response.message || 'Failed to add activity');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while adding activity');
        console.error('Error adding activity:', err);
      }
    },
  });

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed':
        return 'success';
      case 'Negotiation':
        return 'warning';
      case 'Proposal':
        return 'info';
      case 'Lost':
        return 'error';
      default:
        return 'default';
    }
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

  if (error || !deal) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Deal not found'}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/deals')}
          sx={{ mt: 2 }}
        >
          Back to Deals
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Deal Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleEditDeal}
        >
          Edit Deal
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                {deal.title}
              </Typography>
              <Chip
                label={deal.status}
                color={getStatusColor(deal.status)}
              />
            </Box>
            
            <Typography variant="body1" paragraph>
              {deal.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BusinessCenter sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1">Client Information</Typography>
                </Box>
                <Typography variant="body1">{deal.clientName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {deal.clientContact}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {deal.clientEmail}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1">Deal Value</Typography>
                </Box>
                <Typography variant="h6">
                  {formatCurrency(deal.value, deal.currencyCode)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1">Closed Date</Typography>
                </Box>
                <Typography variant="body1">
                  {formatDate(deal.closedDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3">
                Activities
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenActivityDialog}
              >
                Add Activity
              </Button>
            </Box>
            
            {deal.activities && deal.activities.length > 0 ? (
              <List>
                {deal.activities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">{activity.type}</Typography>
                          <Typography variant="body2">
                            {formatDate(activity.date)}
                          </Typography>
                        </Box>
                      }
                      secondary={activity.description}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No activities recorded for this deal.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardHeader title="Sales Representative" />
            <CardContent>
              <Typography variant="h6">{deal.salesRepName}</Typography>
              <Typography variant="body2" color="textSecondary">
                ID: {deal.salesRepId}
              </Typography>
            </CardContent>
          </Card>

          {deal.earnings && deal.earnings.length > 0 && (
            <Card elevation={2}>
              <CardHeader title="Earnings Breakdown" />
              <CardContent>
                <List>
                  {deal.earnings.map((earning) => (
                    <ListItem key={earning.id} divider>
                      <ListItemText
                        primary={earning.incentiveRuleName}
                        secondary={formatCurrency(earning.amount, earning.currencyCode)}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant="subtitle1">
                    Total Earnings:
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(
                      deal.earnings.reduce((sum, earning) => sum + earning.amount, 0),
                      deal.currencyCode
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onClose={handleCloseActivityDialog}>
        <form onSubmit={activityFormik.handleSubmit}>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="activity-type-label">Activity Type</InputLabel>
              <Select
                labelId="activity-type-label"
                id="type"
                name="type"
                value={activityFormik.values.type}
                onChange={activityFormik.handleChange}
                label="Activity Type"
                error={activityFormik.touched.type && Boolean(activityFormik.errors.type)}
              >
                <MenuItem value="Call">Call</MenuItem>
                <MenuItem value="Meeting">Meeting</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Proposal">Proposal</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={activityFormik.values.description}
              onChange={activityFormik.handleChange}
              error={activityFormik.touched.description && Boolean(activityFormik.errors.description)}
              helperText={activityFormik.touched.description && activityFormik.errors.description}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="date"
              name="date"
              label="Date"
              type="date"
              value={activityFormik.values.date}
              onChange={activityFormik.handleChange}
              error={activityFormik.touched.date && Boolean(activityFormik.errors.date)}
              helperText={activityFormik.touched.date && activityFormik.errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseActivityDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default DealDetail;
