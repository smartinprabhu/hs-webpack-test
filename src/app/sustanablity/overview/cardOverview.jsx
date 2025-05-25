import React from 'react';
import { Grid, Box } from '@mui/material';

// MUI Icons
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudIcon from '@mui/icons-material/Cloud';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import KPICard from './kpiCard';

const cardData = [
  {
    title: 'Total Facility RAV',
    value: '$85M',
    description: 'Replacement Asset Value',
    trend: 'up',
    trendValue: '2.3% from last quarter',
    icon: <MonetizationOnIcon />,
  },
  {
    title: 'Assets Near End-of-Life',
    value: '18%',
    description: 'Requiring attention within 12 months',
    trend: 'down',
    trendValue: '3.5% from last quarter',
    icon: <AccessTimeIcon />,
  },
  {
    title: 'Facility Carbon Footprint',
    value: '1,200',
    description: 'Tons CO₂/year',
    trend: 'down',
    trendValue: '5.8% from last quarter',
    icon: <CloudIcon />,
  },
  {
    title: 'Asset Recycling Rate',
    value: '72%',
    description: 'Materials recycled after decommission',
    trend: 'up',
    trendValue: '4.2% from last quarter',
    icon: <AutorenewIcon />,
  },
  {
    title: 'Energy Efficiency Compliance',
    value: '88%',
    description: 'Assets meeting efficiency standards',
    trend: 'up',
    trendValue: '1.5% from last quarter',
    icon: <TrendingUpIcon />,
  },
];

const ExecutiveOverview = () => (
  <Box mb={2} sx={{ animation: 'fade-in 0.5s ease-in-out' }}>
    <Grid container spacing={2} alignItems="stretch">
      {cardData.map((item, index) => (
        <Grid item xs={12} md={6} lg={2.4} key={index}>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <KPICard {...item} />
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ExecutiveOverview;
