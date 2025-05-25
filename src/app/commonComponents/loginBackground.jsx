/* eslint-disable react/prop-types */

import React from 'react';
import { Box, Typography } from '@mui/material';

import manGreenIcon from '@images/login/ESGOne2.svg';

import { LoginImages } from '../themes/theme';
import { detectMob } from '../util/appUtils';

const isMobileView = detectMob();

const appConfig = require('../config/appConfig').default;

const LoginBackground = ({ headerText = false }) => {
  const isEsg = !!(appConfig.IS_ESG && appConfig.IS_ESG.toLowerCase() === 'true');
  const LoginHeader = isEsg ? 'Future-Proofing Facilities for Compliance, Value, and Sustainability' : 'Digital transformation of facilities and property management';
  const LoginSubHeader = isEsg ? 'Al powered, IOT-enabled, Smart platform' : '';

  return (
    <Box
      sx={{
        width: '50%',
        bottom: '30px',
        position: 'relative',
      }}
      className={isMobileView ? 'd-none' : ''}
    >
      <Typography
        sx={{
          position: 'relative', top: '80px', left: '80px', fontFamily: 'Suisse Intl', fontSize: '35px',
        }}
      >
        {headerText || LoginHeader}
      </Typography>
      {isEsg && (
      <Typography
        sx={{
          position: 'relative', top: '90px', left: '82px', fontFamily: 'Suisse Intl', fontSize: '18px',
        }}
      >
        {LoginSubHeader}
      </Typography>
      )}
      {!isEsg && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: '50%', md: '100%' },
          }}
        >
          <Box
            component="img"
            src={LoginImages().Man}
            alt="Man"
            sx={{
              width: '100%',
              maxWidth: '580px',
              height: 'auto',
            }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: '50%', md: '100%' },
          }}
        >
          <Box
            component="img"
            src={LoginImages().Block}
            alt="Block"
            sx={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
            }}
          />
        </Box>
      </Box>
      )}
      {isEsg && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '100%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: '100%', md: '100%' },
          }}
        >
          <Box
            component="img"
            src={manGreenIcon}
            alt="Man"
            sx={{
              width: '100%',
              maxWidth: '670px',
              height: 'auto',
            }}
          />
        </Box>

      </Box>
      )}

    </Box>
  );
};
export default LoginBackground;
