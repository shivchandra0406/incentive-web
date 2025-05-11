import React from 'react';
import { Box, Typography, Paper, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

const TargetBasedRuleForm = () => {
  console.log('TargetBasedRuleForm component rendered');
  const navigate = useNavigate();

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" component="h1" align="center">
            Target-Based Rule
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 2,
            textAlign: 'center',
            background: 'linear-gradient(to right bottom, #8E24AA, #6A1B9A)',
            color: 'white'
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Hello!
          </Typography>

          <Typography variant="h5" sx={{ mb: 4 }}>
            Welcome to the Target-Based Rule Creation Page
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/incentive-rules')}
              sx={{
                mr: 2,
                px: 4,
                py: 1.5,
                borderRadius: 8,
                backgroundColor: 'white',
                color: '#8E24AA',
                '&:hover': {
                  backgroundColor: '#f3e5f5',
                }
              }}
            >
              Back to Rules
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default TargetBasedRuleForm;
