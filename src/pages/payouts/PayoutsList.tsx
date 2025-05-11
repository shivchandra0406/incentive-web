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
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { paymentsService } from '../../services/api';

interface Payment {
  id: string;
  amount: number;
  currencyCode: string;
  status: string;
  paymentDate: string;
  paymentReference?: string;
  recipientId: string;
  recipientName: string;
  dealId: string;
  dealTitle: string;
  incentiveRuleId: string;
  incentiveRuleName: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

interface PaginatedResponse {
  items: Payment[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const PayoutsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentsService.getAll(page + 1, rowsPerPage, statusFilter || undefined);
      if (response.success) {
        const data = response.data as PaginatedResponse;
        setPayments(data.items);
        setTotalCount(data.totalCount);
      } else {
        setError(response.message || 'Failed to fetch payments');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, rowsPerPage, statusFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddPayment = () => {
    navigate('/payouts/create');
  };

  const handleEditPayment = (id: string) => {
    navigate(`/payouts/edit/${id}`);
  };

  const handleViewPayment = (id: string) => {
    navigate(`/payouts/${id}`);
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Payouts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPayment}
        >
          Create Payout
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
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processed">Processed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                    <TableCell>Reference</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Deal</TableCell>
                    <TableCell>Incentive Rule</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.paymentReference || 'N/A'}
                      </TableCell>
                      <TableCell>{payment.recipientName}</TableCell>
                      <TableCell>{payment.dealTitle}</TableCell>
                      <TableCell>{payment.incentiveRuleName}</TableCell>
                      <TableCell>
                        {formatCurrency(payment.amount, payment.currencyCode)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>
                        <Tooltip title="View">
                          <IconButton onClick={() => handleViewPayment(payment.id)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {payment.status === 'Pending' && (
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEditPayment(payment.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
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

export default PayoutsList;
