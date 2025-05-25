import React from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { useTheme } from '../ThemeContext';

const PropertyAndValue = ({ data }) => {
  const { themes } = useTheme(); // Get the current theme

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '5px 0px 5px 0px',
        minHeight: '25px',
        gap: '1%',
      }}
    >
      <Typography
        sx={{
          width: '40%',
          font: 'normal normal normal 14px Suisse Intl',
          color: themes === 'light' ? '#FFFFFF' : '#6A6A6A', // White in light mode
        }}
      >
        {data?.property}
      </Typography>
      <Typography
        sx={{
          width: '60%',
          font: 'normal normal normal 14px Suisse Intl',
          color: themes === 'light' ? '#FFFFFF' : '#000000', // White in light mode
          textTransform:
            data &&
            data.property &&
            typeof data.property === 'string' &&
            (data.property.includes('Email') || data.property.includes('Allowed Domains') || data.property.includes('Compliance Info'))
              ? 'lowercase'
              : 'capitalize',
        }}
        className="text-break"
      >
        {data?.value}
      </Typography>
    </Box>
  );
};

export default PropertyAndValue;
