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
import { workflowsService } from '../../services/api';

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  stages: {
    id: string;
    name: string;
    order: number;
    isRequired: boolean;
  }[];
  createdAt: string;
  createdBy: string;
}

const WorkflowsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workflowsService.getAll();
      if (response.success) {
        setWorkflows(response.data);
      } else {
        setError(response.message || 'Failed to fetch workflows');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching workflows');
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleAddWorkflow = () => {
    navigate('/workflows/create');
  };

  const handleEditWorkflow = (id: string) => {
    navigate(`/workflows/edit/${id}`);
  };

  const handleViewWorkflow = (id: string) => {
    navigate(`/workflows/${id}`);
  };

  const handleDeleteWorkflow = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        const response = await workflowsService.delete(id);
        if (response.success) {
          fetchWorkflows();
        } else {
          setError(response.message || 'Failed to delete workflow');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while deleting the workflow');
        console.error('Error deleting workflow:', err);
      }
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Workflows
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddWorkflow}
        >
          Add New Workflow
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Stages</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <Typography variant="body1">{workflow.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{workflow.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={workflow.isActive ? 'Active' : 'Inactive'}
                        color={workflow.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {workflow.stages.map((stage) => (
                          <Chip
                            key={stage.id}
                            label={stage.name}
                            size="small"
                            variant={stage.isRequired ? 'filled' : 'outlined'}
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{workflow.createdBy}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleViewWorkflow(workflow.id)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditWorkflow(workflow.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteWorkflow(workflow.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Layout>
  );
};

export default WorkflowsList;
