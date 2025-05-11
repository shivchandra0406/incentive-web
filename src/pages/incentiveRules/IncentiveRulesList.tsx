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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { incentiveRulesService } from '../../services/api';

interface IncentiveRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  calculationType: string;
  calculationValue: number;
  targetType: string;
  targetValue: number;
  targetFrequency: string;
  currencyCode: string;
  appliedRuleType: string;
  createdAt: string;
  createdBy: string;
}

interface PaginatedResponse {
  items: IncentiveRule[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const IncentiveRulesList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<IncentiveRule[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await incentiveRulesService.getAll(page + 1, rowsPerPage);
      if (response.success) {
        const data = response.data as PaginatedResponse;
        setRules(data.items);
        setTotalCount(data.totalCount);
      } else {
        setError(response.message || 'Failed to fetch incentive rules');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching incentive rules');
      console.error('Error fetching incentive rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRule = () => {
    navigate('/incentive-rules/create');
  };

  const handleEditRule = (id: string) => {
    navigate(`/incentive-rules/edit/${id}`);
  };

  const handleViewRule = (id: string) => {
    navigate(`/incentive-rules/${id}`);
  };

  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this incentive rule?')) {
      try {
        const response = await incentiveRulesService.delete(id);
        if (response.success) {
          fetchRules();
        } else {
          setError(response.message || 'Failed to delete incentive rule');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while deleting the incentive rule');
        console.error('Error deleting incentive rule:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Incentive Rules
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddRule}
        >
          Add New Rule
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Calculation</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Date Range</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Typography variant="body1">{rule.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {rule.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rule.isActive ? 'Active' : 'Inactive'}
                          color={rule.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {rule.calculationType} ({rule.calculationValue}
                        {rule.calculationType === 'Percentage' ? '%' : ` ${rule.currencyCode}`})
                      </TableCell>
                      <TableCell>
                        {rule.targetType}: {rule.targetValue} {rule.currencyCode}
                        <br />
                        <Typography variant="body2" color="textSecondary">
                          {rule.targetFrequency} • {rule.appliedRuleType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(rule.startDate)} - {formatDate(rule.endDate)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View">
                          <IconButton onClick={() => handleViewRule(rule.id)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditRule(rule.id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteRule(rule.id)}>
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

export default IncentiveRulesList;
