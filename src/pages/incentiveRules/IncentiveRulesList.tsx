import { useState, useEffect, useRef } from 'react';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout.jsx';
import { incentiveRulesService } from '../../services/api';
import TargetBasedRuleDialog from '../../components/TargetBasedRuleDialog';

interface IncentiveRule {
  id: string;
  name: string;
  type: 'Target' | 'Tier' | 'Project' | 'Location' | 'Team';
  description?: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

interface PaginatedResponse {
  items: IncentiveRule[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const IncentiveRulesList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<IncentiveRule[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [targetRuleDialogOpen, setTargetRuleDialogOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the GET /api/incentives/rules endpoint
      const response = await incentiveRulesService.getAll(page + 1, rowsPerPage);
      if (response.success) {
        const data = response.data as PaginatedResponse;
        setRules(data.items);
        setTotalCount(data.totalCount);
      } else {
        setError('Failed to fetch incentive rules');
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateRule = (type: string) => {
    handleMenuClose();
    // Special case for Target-based Rule
    if (type.toLowerCase() === 'target') {
      console.log('Opening Target-based Rule dialog');
      setTargetRuleDialogOpen(true);
    } else {
      console.log(`Navigating to ${type}-based Rule form`);
      navigate(`/incentive-rules/create/${type.toLowerCase()}`);
    }
  };

  const handleCloseTargetRuleDialog = () => {
    setTargetRuleDialogOpen(false);
  };

  const handleEditRule = (id: string) => {
    navigate(`/incentive-rules/edit/${id}`);
  };

  const handleViewRule = (id: string) => {
    navigate(`/incentive-rules/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setRuleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setRuleToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (ruleToDelete) {
      try {
        // Using the DELETE /api/incentives/rules/{id} endpoint
        const response = await incentiveRulesService.delete(ruleToDelete);
        if (response.success) {
          fetchRules();
          setDeleteDialogOpen(false);
          setRuleToDelete(null);
        } else {
          setError('Failed to delete incentive rule');
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/test')}
          >
            Test Page
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setTargetRuleDialogOpen(true)}
          >
            Direct to Target Rule
          </Button>
          <Button
            ref={buttonRef}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => handleMenuOpen(e)}
            aria-controls={menuOpen ? 'create-rule-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            Create Rule
          </Button>
          <Menu
            id="create-rule-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'create-rule-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleCreateRule('Target')}>
              <ListItemIcon>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>🎯</Box>
              </ListItemIcon>
              <ListItemText>Target-based Rule</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleCreateRule('Tier')}>
              <ListItemIcon>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>📊</Box>
              </ListItemIcon>
              <ListItemText>Tier-based Rule</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleCreateRule('Project')}>
              <ListItemIcon>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>💼</Box>
              </ListItemIcon>
              <ListItemText>Project-based Rule</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleCreateRule('Location')}>
              <ListItemIcon>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>📍</Box>
              </ListItemIcon>
              <ListItemText>Location-based Rule</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleCreateRule('Team')}>
              <ListItemIcon>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>👥</Box>
              </ListItemIcon>
              <ListItemText>Team-based Rule</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
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
        ) : rules.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No incentive rules found. Create your first rule by clicking the "Create Rule" button.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rule Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id} hover>
                      <TableCell>
                        <Typography variant="body1">{rule.name}</Typography>
                        {rule.description && (
                          <Typography variant="body2" color="textSecondary">
                            {rule.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{rule.type}</TableCell>
                      <TableCell>{rule.createdBy}</TableCell>
                      <TableCell>{formatDate(rule.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={rule.status}
                          color={rule.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
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
                          <IconButton onClick={() => handleDeleteClick(rule.id)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this incentive rule? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Target-Based Rule Dialog */}
      <TargetBasedRuleDialog
        open={targetRuleDialogOpen}
        onClose={handleCloseTargetRuleDialog}
      />
    </Layout>
  );
}

export default IncentiveRulesList;
