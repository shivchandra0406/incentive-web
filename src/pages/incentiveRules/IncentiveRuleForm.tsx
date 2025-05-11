import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/layout/Layout';
import { incentiveRulesService } from '../../services/api';

interface IncentiveRuleFormValues {
  name: string;
  type: 'Target' | 'Tier' | 'Project' | 'Location' | 'Team';
  description: string;
  status: 'Active' | 'Inactive';
}

const IncentiveRuleForm = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<IncentiveRuleFormValues>({
    name: '',
    type: type as 'Target' | 'Tier' | 'Project' | 'Location' | 'Team' || 'Target',
    description: '',
    status: 'Active',
  });

  const isEditMode = !!id && !window.location.pathname.includes('/view/');
  const isViewMode = !!id && window.location.pathname.includes('/view/');

  useEffect(() => {
    if (isEditMode) {
      fetchRuleDetails();
    }
  }, [id]);

  const fetchRuleDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await incentiveRulesService.getById(id!);
      if (response.success && response.data) {
        const rule = response.data;
        setInitialValues({
          name: rule.name,
          type: rule.type as 'Target' | 'Tier' | 'Project' | 'Location' | 'Team',
          description: rule.description || '',
          status: rule.status as 'Active' | 'Inactive',
        });
      } else {
        setError('Failed to fetch incentive rule details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching incentive rule details');
      console.error('Error fetching incentive rule details:', err);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    type: Yup.string().required('Rule type is required'),
    description: Yup.string(),
    status: Yup.string().required('Status is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (isEditMode) {
          response = await incentiveRulesService.update(id!, values);
        } else {
          response = await incentiveRulesService.create(values);
        }

        if (response.success) {
          navigate('/incentive-rules');
        } else {
          setError(`Failed to ${isEditMode ? 'update' : 'create'} incentive rule`);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the incentive rule`
        );
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} incentive rule:`, err);
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading && isEditMode) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Incentive Rule' : 'Create Incentive Rule'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Rule Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={isViewMode}
            />

            <FormControl fullWidth disabled={isViewMode}>
              <InputLabel id="type-label">Rule Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
                label="Rule Type"
              >
                <MenuItem value="Target">Target-based Rule</MenuItem>
                <MenuItem value="Tier">Tier-based Rule</MenuItem>
                <MenuItem value="Project">Project-based Rule</MenuItem>
                <MenuItem value="Location">Location-based Rule</MenuItem>
                <MenuItem value="Team">Team-based Rule</MenuItem>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <FormHelperText error>{formik.errors.type}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              disabled={isViewMode}
            />

            <FormControl component="fieldset" disabled={isViewMode}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.status === 'Active'}
                    onChange={(e) => {
                      formik.setFieldValue('status', e.target.checked ? 'Active' : 'Inactive');
                    }}
                    name="status"
                    color="primary"
                  />
                }
                label={formik.values.status === 'Active' ? 'Active' : 'Inactive'}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/incentive-rules')}
                disabled={loading}
              >
                {isViewMode ? 'Back' : 'Cancel'}
              </Button>
              {!isViewMode && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Create'}
                </Button>
              )}
            </Box>
          </Stack>
        </form>
      </Paper>
    </Layout>
  );
};

export default IncentiveRuleForm;
