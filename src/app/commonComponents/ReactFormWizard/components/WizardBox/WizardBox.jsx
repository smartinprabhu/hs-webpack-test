import { Box } from '@mui/system';
import React from 'react';

const WizardBox = ({ children }) => (
  <div className="insights-box">
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        marginBottom: '10px',
        padding: '0px 7px',
        fontFamily: 'Suisse Intl',
      }}
    >
      {children}
    </Box>
  </div>
);


export default WizardBox;
