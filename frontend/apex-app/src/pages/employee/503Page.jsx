import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { blueGrey  } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const primary = blueGrey[900];

function ErrorPage() {
  const navigate = useNavigate();


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        503
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        Service Unavailable. Please try again later.
      </Typography>
    </Box>
  );
}

export default ErrorPage;