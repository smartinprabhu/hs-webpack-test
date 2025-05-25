/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Box, Typography, LinearProgress, Grid,
} from '@mui/material';

import ChartCard from './chartCard';

const ReplacementForecastAccuracy = () => {
  const accuracy = 85; // Percentage of forecast accuracy

  let statusColor = 'success.main';
  if (accuracy < 70) statusColor = 'error.main';
  else if (accuracy < 85) statusColor = 'warning.main';

  return (
    <ChartCard
      title="Replacement Forecast Accuracy"
      subtitle="Percentage accuracy compared to last year's replacement plan"
    >
      <Box px={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Accuracy
          </Typography>
          <Typography variant="h6" fontWeight="bold" color={statusColor}>
            {accuracy}
            %
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={accuracy}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
          color={
            accuracy < 70 ? 'error' : accuracy < 85 ? 'warning' : 'success'
          }
        />

        <Grid container spacing={2} textAlign="center" mb={4}>
          <Grid item xs={4}>
            <Typography variant="body2" color="error.main" fontWeight="bold">
              Poor
            </Typography>
            <Typography variant="caption">0-70%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="warning.main" fontWeight="bold">
              Good
            </Typography>
            <Typography variant="caption">70-85%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              Excellent
            </Typography>
            <Typography variant="caption">85-100%</Typography>
          </Grid>
        </Grid>

        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Assets accurately forecasted:</Typography>
            <Typography variant="body2" fontWeight="medium">
              42 of 49
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Improvement from previous quarter:</Typography>
            <Typography variant="body2" fontWeight="medium" color="success.main">
              +3%
            </Typography>
          </Box>
        </Box>
      </Box>
    </ChartCard>
  );
};

export default ReplacementForecastAccuracy;
