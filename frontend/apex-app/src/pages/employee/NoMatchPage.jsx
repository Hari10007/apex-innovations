import React from 'react'
import { Box, Button, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const primary = purple[500];


function NoMatchPage() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/login');
  };

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
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" onClick={handleBackHome}>Back Home</Button>
    </Box>
  )
}

export default NoMatchPage
