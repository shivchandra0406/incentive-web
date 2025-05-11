import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Username is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      setLoading(true);

      try {
        console.log('Calling login function with username:', values.username);
        // Call the login function from AuthContext which uses the real API
        const success = await login(values.username, values.password);
        console.log('Login function returned:', success);

        if (success) {
          // Show success toast message
          showSuccessToast('Login successful! Redirecting to dashboard...');
          // Navigation is handled by the login function in AuthContext
        } else {
          // Show error toast message
          showErrorToast('Login failed. Please check your credentials.');
        }
      } catch (err: any) {
        console.error('Login error caught in form submit:', err);

        // Handle specific API error messages
        if (err.response && err.response.data) {
          // If the API returns a specific error message
          console.error('API error response:', err.response.data);
          showErrorToast(err.response.data.message || err.response.data.error || 'Invalid username or password');
        } else {
          // Generic error message
          console.error('Generic error:', err.message);
          showErrorToast(err.message || 'An error occurred during login');
        }
      } finally {
        console.log('Login process completed, setting loading to false');
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      {/* Toast container for notifications */}
      <ToastContainer />

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Mr. Munim
          </Typography>

          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            Sign In
          </Typography>

          {/* Toast messages will be shown instead of alerts */}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>



            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
