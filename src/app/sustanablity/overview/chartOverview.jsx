import React from 'react';
import { Grid, Box } from '@mui/material';

import CarbonTrend from './carbonTrend';
import AssetRatings from './assetRatings';
import EnergyFacilities from './energyFacilities';

const ChartOverview = () => (
  <>
    <Box mb={2} sx={{ animation: 'fade-in 0.5s ease-in-out' }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{
            flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
          }}
          >
            <CarbonTrend />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box sx={{
            flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
          }}
          >
            <AssetRatings />
          </Box>
        </Grid>
      </Grid>
    </Box>
    <Box sx={{ animation: 'fade-in 0.5s ease-in-out' }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={12} lg={12}>
          <Box sx={{
            flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
          }}
          >
            <EnergyFacilities />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>
);

export default ChartOverview;
