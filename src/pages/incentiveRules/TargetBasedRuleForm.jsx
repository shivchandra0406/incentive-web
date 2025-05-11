import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TargetBasedRuleForm = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    ruleName: '',
    description: '',
    targetType: 'Monthly',
    startDate: null,
    endDate: null,
    currencyType: 'Rupee',
    targetDealType: 'Item',
    salaryAmount: '',
    targetAmount: '',
    incentiveType: 'Percentage',
    rewardAmount: '',
    rewardPercentage: '',
    selectionType: 'Reward',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
    // After successful submission, navigate back to the rules list
    // navigate('/incentive-rules');
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate('/incentive-rules');
  };

  // Currency symbol based on selected currency
  const getCurrencySymbol = () => {
    switch (formData.currencyType) {
      case 'Rupee':
        return '₹';
      case 'Dollar':
        return '$';
      case 'Dirham':
        return 'د.إ';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create Target-Based Rule
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rule Name"
                  name="ruleName"
                  value={formData.ruleName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={1}
                />
              </Grid>

              {/* Target Configuration */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Target Configuration
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Type</InputLabel>
                  <Select
                    name="targetType"
                    value={formData.targetType}
                    onChange={handleChange}
                    label="Target Type"
                  >
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.targetType === 'Custom' && (
                <>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(date) => handleDateChange('startDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(date) => handleDateChange('endDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                        minDate={formData.startDate}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency Type</InputLabel>
                  <Select
                    name="currencyType"
                    value={formData.currencyType}
                    onChange={handleChange}
                    label="Currency Type"
                  >
                    <MenuItem value="Rupee">Rupee (₹)</MenuItem>
                    <MenuItem value="Dollar">Dollar ($)</MenuItem>
                    <MenuItem value="Dirham">Dirham (د.إ)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Target Deal Type</FormLabel>
                  <RadioGroup
                    row
                    name="targetDealType"
                    value={formData.targetDealType}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="Item" control={<Radio />} label="Item" />
                    <FormControlLabel value="Salary" control={<Radio />} label="Salary" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Conditional fields based on Target Deal Type */}
              {formData.targetDealType === 'Salary' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Salary Amount"
                      name="salaryAmount"
                      value={formData.salaryAmount}
                      onChange={handleChange}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Target Amount"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Incentive Type</FormLabel>
                      <RadioGroup
                        row
                        name="incentiveType"
                        value={formData.incentiveType}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                        <FormControlLabel value="Amount" control={<Radio />} label="Amount" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {formData.incentiveType === 'Amount' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Reward Amount"
                        name="rewardAmount"
                        value={formData.rewardAmount}
                        onChange={handleChange}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                        }}
                      />
                    </Grid>
                  )}

                  {formData.incentiveType === 'Percentage' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Reward Percentage"
                        name="rewardPercentage"
                        value={formData.rewardPercentage}
                        onChange={handleChange}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                  )}
                </>
              )}

              {formData.targetDealType === 'Item' && (
                <>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Selection Type</FormLabel>
                      <RadioGroup
                        row
                        name="selectionType"
                        value={formData.selectionType}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="Reward" control={<Radio />} label="Reward" />
                        <FormControlLabel value="Amount" control={<Radio />} label="Amount" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {formData.selectionType === 'Reward' && (
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Reward Type</FormLabel>
                        <RadioGroup
                          row
                          name="incentiveType"
                          value={formData.incentiveType}
                          onChange={handleChange}
                        >
                          <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                          <FormControlLabel value="Amount" control={<Radio />} label="Amount" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  )}

                  {formData.selectionType === 'Reward' && formData.incentiveType === 'Amount' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Reward Amount"
                        name="rewardAmount"
                        value={formData.rewardAmount}
                        onChange={handleChange}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                        }}
                      />
                    </Grid>
                  )}

                  {formData.selectionType === 'Reward' && formData.incentiveType === 'Percentage' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Reward Percentage"
                        name="rewardPercentage"
                        value={formData.rewardPercentage}
                        onChange={handleChange}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                  )}

                  {formData.selectionType === 'Amount' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Amount"
                        name="rewardAmount"
                        value={formData.rewardAmount}
                        onChange={handleChange}
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                        }}
                      />
                    </Grid>
                  )}
                </>
              )}

              {/* Form Actions */}
              <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Create Rule
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TargetBasedRuleForm;
