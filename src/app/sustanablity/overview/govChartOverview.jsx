import React from 'react';
import { Grid, Box } from '@mui/material';

import RavChart from './ravChart';
import ReplacementForecast from './replacementForecast';
import InvestmentEfficiency from './investmentEfficiency';

const GovChartOverview = () => (
  <Box sx={{ animation: 'fade-in 0.5s ease-in-out' }}>
    <Grid container spacing={2} alignItems="stretch">
      <Grid item xs={12} md={6} lg={4}>
        <Box sx={{
          flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
        }}
        >
          <RavChart />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Box sx={{
          flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
        }}
        >
          <ReplacementForecast />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Box sx={{
          flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%',
        }}
        >
          <InvestmentEfficiency />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default GovChartOverview;
