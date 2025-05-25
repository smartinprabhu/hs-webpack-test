/* eslint-disable import/no-unresolved */
import React from 'react';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';

import { NoInternetImage } from '../themes/theme'

const internalServerError = () => {
  const history = useHistory();
  const redirectToHome = () => {
    history.push({ pathname: '/' });
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '40%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>

          <p className="page-not-text">Internal server problem.. </p>
          <Button
            sx={{
              textTransform: 'none',
              height: '50px',
              width: '150px',
              marginTop: '15px',
            }}
            variant='contained'
            onClick={redirectToHome}
          >
            Retry
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: '60%',
          height: '100%',
        }}
      >
        <img alt="" src={NoInternetImage()} className="no-internet-page" />
      </Box>
    </Box>
  );
};

export default internalServerError;
