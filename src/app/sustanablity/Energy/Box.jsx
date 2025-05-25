import Box from '@mui/material/Box';
import React from 'react';

const Item = ({ sx, ...other }) => (
  <Box
    sx={[
      () => ({
      }),
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...other}
  />
);

export default Item;
