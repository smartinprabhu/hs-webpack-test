/* eslint-disable import/no-unresolved */
import React from 'react';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

import { PageNotFoundImage } from '../app/themes/theme';

const NotFound = () => {
  const onHomeClick = () => {
    window.location.href = '/';
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
          width: '50%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <p className="oops-text">Oops ...</p>
          <p className="page-not-text">Page Not Found</p>
          <Button
            sx={{
              textTransform: 'none',
              height: '50px',
              width: '150px',
              marginTop: '15px',
            }}
            variant="contained"
            onClick={() => onHomeClick()}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
      <Box
      >
        <img alt="" src={PageNotFoundImage()} height="100%" width="100%"/>
      </Box>
    </Box>
  );
};

export default NotFound;
