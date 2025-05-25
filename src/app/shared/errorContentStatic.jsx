/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import PageLoader from "@shared/pageLoader";

// import noResult from '@images/noResult.png';

import './noDataStyle.css';

import AuthService from '../util/authService';

const authService = AuthService();

const ErrorContent = (props) => {
  const {
    errorTxt,
    bookingDashboard,
    showRetry
  } = props;

  const [reload, setReload] = useState(false)

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        backgroundColor: '#ffffff',
        marginTop: '12em',
      }}
    >
      <Box sx={{ width: '20%' }} />
      <Box sx={{
        backgroundColor: '#ffffff',
        width: '60%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      >
        { /* <h1 className="no-results-heading">No results found</h1> */}
        <Typography
          sx={{ position: 'relative', bottom: '30px', fontSize: '17px' }}
        >
          {errorTxt}
        </Typography>
        {showRetry && (
          <Button variant='contained' type='button' sx={{ position: 'relative', bottom: '20px' }} onClick={() => { setReload(true); window.location.reload() }}>
            Retry
          </Button>
        )}
        {reload && (
          <PageLoader />
        )}
      </Box>
      <Box sx={{ width: '20%' }} />
    </Box>
  );
};

ErrorContent.defaultProps = {
  errorTxt: 'Something went wrong..',
};

ErrorContent.propTypes = {
  errorTxt: PropTypes.string,
};

export default ErrorContent;
