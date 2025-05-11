import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Grid,
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
}

const IncentiveRuleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<IncentiveRuleFormValues>({
    name: '',
    description: '',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    calculationType: 'Percentage',
    calculationValue: 5,
    targetType: 'Revenue',
    targetValue: 100000,
    targetFrequency: 'Quarterly',
    currencyCode: 'USD',
    appliedRuleType: 'Individual',
  });

  const isEditMode = !!id;

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
      if (response.success) {
        const rule = response.data;
        setInitialValues({
          name: rule.name,
          description: rule.description,
          isActive: rule.isActive,
          startDate: new Date(rule.startDate).toISOString().split('T')[0],
          endDate: new Date(rule.endDate).toISOString().split('T')[0],
          calculationType: rule.calculationType,
          calculationValue: rule.calculationValue,
          targetType: rule.targetType,
          targetValue: rule.targetValue,
          targetFrequency: rule.targetFrequency,
          currencyCode: rule.currencyCode,
          appliedRuleType: rule.appliedRuleType,
        });
      } else {
        setError(response.message || 'Failed to fetch incentive rule details');
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
    description: Yup.string().required('Description is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    calculationType: Yup.string().required('Calculation type is required'),
    calculationValue: Yup.number()
      .required('Calculation value is required')
      .positive('Calculation value must be positive'),
    targetType: Yup.string().required('Target type is required'),
    targetValue: Yup.number()
      .required('Target value is required')
      .positive('Target value must be positive'),
    targetFrequency: Yup.string().required('Target frequency is required'),
    currencyCode: Yup.string().required('Currency code is required'),
    appliedRuleType: Yup.string().required('Applied rule type is required'),
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
          setError(response.message || `Failed to ${isEditMode ? 'update' : 'create'} incentive rule`);
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
              />
            </Grid>

            <Grid item xs={12}>
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate && formik.errors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="calculationType-label">Calculation Type</InputLabel>
                <Select
                  labelId="calculationType-label"
                  id="calculationType"
                  name="calculationType"
                  value={formik.values.calculationType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.calculationType && Boolean(formik.errors.calculationType)}
                  label="Calculation Type"
                >
                  <MenuItem value="Percentage">Percentage</MenuItem>
                  <MenuItem value="FixedAmount">Fixed Amount</MenuItem>
                  <MenuItem value="Tiered">Tiered</MenuItem>
                </Select>
                {formik.touched.calculationType && formik.errors.calculationType && (
                  <FormHelperText error>{formik.errors.calculationType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="calculationValue"
                name="calculationValue"
                label="Calculation Value"
                type="number"
                value={formik.values.calculationValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.calculationValue && Boolean(formik.errors.calculationValue)}
                helperText={formik.touched.calculationValue && formik.errors.calculationValue}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="targetType-label">Target Type</InputLabel>
                <Select
                  labelId="targetType-label"
                  id="targetType"
                  name="targetType"
                  value={formik.values.targetType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.targetType && Boolean(formik.errors.targetType)}
                  label="Target Type"
                >
                  <MenuItem value="Revenue">Revenue</MenuItem>
                  <MenuItem value="Units">Units</MenuItem>
                  <MenuItem value="Margin">Margin</MenuItem>
                </Select>
                {formik.touched.targetType && formik.errors.targetType && (
                  <FormHelperText error>{formik.errors.targetType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="targetValue"
                name="targetValue"
                label="Target Value"
                type="number"
                value={formik.values.targetValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.targetValue && Boolean(formik.errors.targetValue)}
                helperText={formik.touched.targetValue && formik.errors.targetValue}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="targetFrequency-label">Target Frequency</InputLabel>
                <Select
                  labelId="targetFrequency-label"
                  id="targetFrequency"
                  name="targetFrequency"
                  value={formik.values.targetFrequency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.targetFrequency && Boolean(formik.errors.targetFrequency)}
                  label="Target Frequency"
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
                {formik.touched.targetFrequency && formik.errors.targetFrequency && (
                  <FormHelperText error>{formik.errors.targetFrequency}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="currencyCode-label">Currency</InputLabel>
                <Select
                  labelId="currencyCode-label"
                  id="currencyCode"
                  name="currencyCode"
                  value={formik.values.currencyCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.currencyCode && Boolean(formik.errors.currencyCode)}
                  label="Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
                {formik.touched.currencyCode && formik.errors.currencyCode && (
                  <FormHelperText error>{formik.errors.currencyCode}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="appliedRuleType-label">Applied To</InputLabel>
                <Select
                  labelId="appliedRuleType-label"
                  id="appliedRuleType"
                  name="appliedRuleType"
                  value={formik.values.appliedRuleType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.appliedRuleType && Boolean(formik.errors.appliedRuleType)}
                  label="Applied To"
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Team">Team</MenuItem>
                  <MenuItem value="Department">Department</MenuItem>
                </Select>
                {formik.touched.appliedRuleType && formik.errors.appliedRuleType && (
                  <FormHelperText error>{formik.errors.appliedRuleType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/incentive-rules')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  );
};

export default IncentiveRuleForm;
