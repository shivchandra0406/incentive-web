import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Layout from '../components/layout/Layout';

const TestPage = () => {
  console.log('TestPage component rendered');
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Test Page
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1">
          This is a test page to verify that routing is working correctly.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default TestPage;
