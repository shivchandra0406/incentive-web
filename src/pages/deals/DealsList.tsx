import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { dealsService } from '../../services/api';

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
}

interface PaginatedResponse {
  items: Deal[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const DealsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dealsService.getAll(page + 1, rowsPerPage, statusFilter || undefined);
      if (response.success) {
        const data = response.data as PaginatedResponse;
        setDeals(data.items);
        setTotalCount(data.totalCount);
      } else {
        setError(response.message || 'Failed to fetch deals');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching deals');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [page, rowsPerPage, statusFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddDeal = () => {
    navigate('/deals/create');
  };

  const handleEditDeal = (id: string) => {
    navigate(`/deals/edit/${id}`);
  };

  const handleViewDeal = (id: string) => {
    navigate(`/deals/${id}`);
  };

  const handleDeleteDeal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        const response = await dealsService.delete(id);
        if (response.success) {
          fetchDeals();
        } else {
          setError(response.message || 'Failed to delete deal');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while deleting the deal');
        console.error('Error deleting deal:', err);
      }
    }
  };

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

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Deals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddDeal}
        >
          Add New Deal
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Proposal">Proposal</MenuItem>
            <MenuItem value="Negotiation">Negotiation</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Deal</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Sales Rep</TableCell>
                    <TableCell>Closed Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <Typography variant="body1">{deal.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {deal.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{deal.clientName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {deal.clientContact}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(deal.value, deal.currencyCode)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={deal.status}
                          color={getStatusColor(deal.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{deal.salesRepName}</TableCell>
                      <TableCell>{formatDate(deal.closedDate)}</TableCell>
                      <TableCell>
                        <Tooltip title="View">
                          <IconButton onClick={() => handleViewDeal(deal.id)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditDeal(deal.id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteDeal(deal.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Layout>
  );
};

export default DealsList;
