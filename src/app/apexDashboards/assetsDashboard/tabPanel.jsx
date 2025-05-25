/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box as MuiBox, Typography } from '@mui/material';

const TabPanel = React.memo((props) => {
  const {
    children, dataValue, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={dataValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {dataValue === index && (
      <MuiBox sx={{ p: 0 }}>
        <Typography component="div">{children}</Typography>
      </MuiBox>
      )}
    </div>
  );
});

export default TabPanel;
