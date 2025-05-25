/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import PageLoader from '@shared/pageLoader';

// import noResult from '@images/noResult.png';

import './noDataStyle.css';

import AuthService from '../util/authService';
import { NoResultImage } from '../themes/theme';
import { useTheme } from '../ThemeContext';

const authService = AuthService();

const ErrorContent = (props) => {
  const { themes } = useTheme();
  const {
    errorTxt,
    bookingDashboard,
    showRetry,
    showCreate,
    isCreate,
    onCreate,
    createName,
    isDashboard,
    calHeight,
  } = props;

  const [reload, setReload] = useState(false);

  return (
    <Box
      sx={isDashboard ? { display: 'flex' } : {
        padding: '20px',
        display: 'flex',
        backgroundColor: themes === 'light' ? '#2D2E2D' : '#ffffff',
      }}
    >
      <Box sx={{ width: '20%' }} />
      <Box sx={{
        backgroundColor: themes === 'light' ? '#2D2E2D' : '#ffffff',
        width: '60%',
        height: calHeight ? `${calHeight - 10}px` : '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      >
        <img src={NoResultImage()} alt="no result" width="100%" style={showCreate ? { height: '300px' } : {}} />
        { /* <h1 className="no-results-heading">No results found</h1> */}
        {/* <Typography
          sx={{ position: 'relative', bottom: '30px', fontSize: '20px'}}
        >
          {errorTxt}
    </Typography> */}
        {showRetry && (
          <Button variant="contained" type="button" sx={{ position: 'relative', bottom: '20px' }} onClick={() => { setReload(true); window.location.reload(); }}>
            Retry
          </Button>
        )}
        {showCreate && isCreate && (
          <Button variant="contained" type="button" sx={{ position: 'relative', bottom: '20px' }} onClick={onCreate}>
            {createName}
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
