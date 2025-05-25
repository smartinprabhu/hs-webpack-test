import React from 'react';
import { Grid, Box } from '@mui/material';

import HealthSafety from './healthSafety';
import AccessibilityCompliance from './accessibilityCompliance';
import AssetDownTime from './assetDownTime';

const SocialChartOverview = () => (
  <Box sx={{ animation: 'fade-in 0.5s ease-in-out' }}>
    <Grid container spacing={2} alignItems="stretch">
      <Grid item xs={12} md={6} lg={4}>
        <Box sx={{
          flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
        }}
        >
          <HealthSafety />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Box sx={{
          flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
        }}
        >
          <AccessibilityCompliance />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Box sx={{
          flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
        }}
        >
          <AssetDownTime />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default SocialChartOverview;
