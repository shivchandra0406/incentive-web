import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Grid,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useForm, Controller } from 'react-hook-form';

interface TargetBasedRuleFormValues {
  name: string;
  description: string;
  targetType: 'Monthly' | 'Quarterly' | 'Yearly' | 'Custom';
  startDate: Date | null;
  endDate: Date | null;
  currencyType: 'Rupee' | 'Dollar' | 'Dirham';
  targetDealType: 'Salary' | 'Item';
  salaryAmount: number | '';
  targetAmount: number | '';
  incentiveType: 'Amount' | 'Percentage';
  rewardAmount: number | '';
  rewardPercentage: number | '';
  itemRewardType: 'Reward' | 'Amount';
  itemNestedChoice: 'Amount' | 'Percentage';
  itemNestedAmount: number | '';
  itemNestedPercentage: number | '';
  status: 'Active' | 'Inactive';
}

interface TargetBasedRuleDialogProps {
  open: boolean;
  onClose: () => void;
}

const TargetBasedRuleDialog: React.FC<TargetBasedRuleDialogProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const defaultValues: TargetBasedRuleFormValues = {
    name: '',
    description: '',
    targetType: 'Monthly',
    startDate: null,
    endDate: null,
    currencyType: 'Rupee',
    targetDealType: 'Salary',
    salaryAmount: '',
    targetAmount: '',
    incentiveType: 'Amount',
    rewardAmount: '',
    rewardPercentage: '',
    itemRewardType: 'Reward',
    itemNestedChoice: 'Amount',
    itemNestedAmount: '',
    itemNestedPercentage: '',
    status: 'Active',
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TargetBasedRuleFormValues>({
    defaultValues
  });

  // Watch values for conditional rendering
  const targetType = watch('targetType');
  const targetDealType = watch('targetDealType');
  const incentiveType = watch('incentiveType');
  const itemRewardType = watch('itemRewardType');
  const itemNestedChoice = watch('itemNestedChoice');

  const onSubmit = async (data: TargetBasedRuleFormValues) => {
    setLoading(true);
    try {
      // In a real app, this would call an API
      console.log('Form submitted with values:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the dialog after successful submission
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currencyType: string) => {
    switch (currencyType) {
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#8E24AA' }}>
          Create Target-Based Rule
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Rule Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* Target Configuration */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                Target Configuration
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="targetType"
                control={control}
                rules={{ required: "Target type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.targetType}>
                    <InputLabel id="targetType-label">Target Type</InputLabel>
                    <Select
                      {...field}
                      labelId="targetType-label"
                      label="Target Type"
                    >
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                      <MenuItem value="Custom">Custom</MenuItem>
                    </Select>
                    {errors.targetType && (
                      <FormHelperText>{errors.targetType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="currencyType"
                control={control}
                rules={{ required: "Currency type is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.currencyType}>
                    <InputLabel id="currencyType-label">Currency Type</InputLabel>
                    <Select
                      {...field}
                      labelId="currencyType-label"
                      label="Currency Type"
                    >
                      <MenuItem value="Rupee">Rupee (₹)</MenuItem>
                      <MenuItem value="Dollar">Dollar ($)</MenuItem>
                      <MenuItem value="Dirham">Dirham (د.إ)</MenuItem>
                    </Select>
                    {errors.currencyType && (
                      <FormHelperText>{errors.currencyType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Custom Date Range */}
            {targetType === 'Custom' && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Start Date"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.startDate,
                            helperText: errors.startDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="End Date"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.endDate,
                            helperText: errors.endDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </LocalizationProvider>
            )}

            {/* Target Deal Type */}
            <Grid item xs={12}>
              <Controller
                name="targetDealType"
                control={control}
                rules={{ required: "Target deal type is required" }}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.targetDealType}>
                    <FormLabel component="legend">Target Deal Type</FormLabel>
                    <RadioGroup {...field} row>
                      <FormControlLabel value="Salary" control={<Radio />} label="Salary" />
                      <FormControlLabel value="Item" control={<Radio />} label="Item" />
                    </RadioGroup>
                    {errors.targetDealType && (
                      <FormHelperText>{errors.targetDealType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Conditional fields for Salary option */}
            {targetDealType === 'Salary' && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="salaryAmount"
                    control={control}
                    rules={{
                      required: "Salary amount is required",
                      min: { value: 0, message: "Must be positive" }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Salary Amount"
                        type="number"
                        error={!!errors.salaryAmount}
                        helperText={errors.salaryAmount?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {getCurrencySymbol(watch('currencyType'))}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="targetAmount"
                    control={control}
                    rules={{
                      required: "Target amount is required",
                      min: { value: 0, message: "Must be positive" }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Target Amount"
                        type="number"
                        error={!!errors.targetAmount}
                        helperText={errors.targetAmount?.message}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="incentiveType"
                    control={control}
                    rules={{ required: "Incentive type is required" }}
                    render={({ field }) => (
                      <FormControl component="fieldset" error={!!errors.incentiveType}>
                        <FormLabel component="legend">Incentive Type</FormLabel>
                        <RadioGroup {...field} row>
                          <FormControlLabel value="Amount" control={<Radio />} label="Amount" />
                          <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                        </RadioGroup>
                        {errors.incentiveType && (
                          <FormHelperText>{errors.incentiveType.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {incentiveType === 'Amount' && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="rewardAmount"
                      control={control}
                      rules={{
                        required: "Reward amount is required",
                        min: { value: 0, message: "Must be positive" }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Reward Amount"
                          type="number"
                          error={!!errors.rewardAmount}
                          helperText={errors.rewardAmount?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {getCurrencySymbol(watch('currencyType'))}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                )}

                {incentiveType === 'Percentage' && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="rewardPercentage"
                      control={control}
                      rules={{
                        required: "Reward percentage is required",
                        min: { value: 0, message: "Must be positive" }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Reward Percentage"
                          type="number"
                          error={!!errors.rewardPercentage}
                          helperText={errors.rewardPercentage?.message}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      )}
                    />
                  </Grid>
                )}
              </>
            )}

            {/* Conditional fields for Item option */}
            {targetDealType === 'Item' && (
              <>
                <Grid item xs={12}>
                  <Controller
                    name="itemRewardType"
                    control={control}
                    rules={{ required: "Item reward type is required" }}
                    render={({ field }) => (
                      <FormControl component="fieldset" error={!!errors.itemRewardType}>
                        <FormLabel component="legend">Item Reward Type</FormLabel>
                        <RadioGroup {...field} row>
                          <FormControlLabel value="Reward" control={<Radio />} label="Reward" />
                          <FormControlLabel value="Amount" control={<Radio />} label="Amount" />
                        </RadioGroup>
                        {errors.itemRewardType && (
                          <FormHelperText>{errors.itemRewardType.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {itemRewardType === 'Reward' && (
                  <Grid item xs={12}>
                    <Box sx={{ pl: 3 }}>
                      <Controller
                        name="itemNestedChoice"
                        control={control}
                        rules={{ required: "Please select amount or percentage" }}
                        render={({ field }) => (
                          <FormControl component="fieldset" error={!!errors.itemNestedChoice}>
                            <FormLabel component="legend">Reward Type</FormLabel>
                            <RadioGroup {...field} row>
                              <FormControlLabel value="Amount" control={<Radio />} label="Amount" />
                              <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                            </RadioGroup>
                            {errors.itemNestedChoice && (
                              <FormHelperText>{errors.itemNestedChoice.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />

                      {itemNestedChoice === 'Amount' && (
                        <Controller
                          name="itemNestedAmount"
                          control={control}
                          rules={{
                            required: "Amount is required",
                            min: { value: 0, message: "Must be positive" }
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Amount"
                              type="number"
                              error={!!errors.itemNestedAmount}
                              helperText={errors.itemNestedAmount?.message}
                              sx={{ mt: 2 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {getCurrencySymbol(watch('currencyType'))}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      )}

                      {itemNestedChoice === 'Percentage' && (
                        <Controller
                          name="itemNestedPercentage"
                          control={control}
                          rules={{
                            required: "Percentage is required",
                            min: { value: 0, message: "Must be positive" }
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Percentage"
                              type="number"
                              error={!!errors.itemNestedPercentage}
                              helperText={errors.itemNestedPercentage?.message}
                              sx={{ mt: 2 }}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                            />
                          )}
                        />
                      )}
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Rule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TargetBasedRuleDialog;
