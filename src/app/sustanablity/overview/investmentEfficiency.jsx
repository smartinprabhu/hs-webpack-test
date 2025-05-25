import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Typography } from '@mui/material';

import ChartCard from './chartCard';

const data = [
  { quarter: 'Q1 2023', roi: 8.2 },
  { quarter: 'Q2 2023', roi: 9.1 },
  { quarter: 'Q3 2023', roi: 10.5 },
  { quarter: 'Q4 2023', roi: 11.2 },
  { quarter: 'Q1 2024', roi: 12.8 },
  { quarter: 'Q2 2024', roi: 14.3 },
  { quarter: 'Q3 2024', roi: 13.7 },
  { quarter: 'Q4 2024', roi: 15.4 },
  { quarter: 'Q1 2025', roi: 16.8 },
];

const categories = data.map((d) => d.quarter);
const series = [
  {
    name: 'ROI',
    data: data.map((d) => d.roi),
    color: '#63B363', // Match with line stroke
  },
];

const averageROI = (
  data.reduce((sum, item) => sum + item.roi, 0) / data.length
).toFixed(1);

const options = {
  chart: {
    type: 'line',
    width: 400,
    toolbar: { show: false },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  markers: {
    size: 4,
  },
  xaxis: {
    categories,
    labels: {
      style: { fontSize: '11px' },
    },
  },
  yaxis: {
    max: 20,
    labels: {
      formatter: (val) => `${val}%`,
      style: { fontSize: '11px' },
    },
    title: {
      text: 'ROI %',
      style: { fontSize: '12px' },
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val}%`,
    },
  },
  grid: {
    strokeDashArray: 3,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  colors: ['#63B363'],
};

const InvestmentEfficiency = () => (
  <ChartCard title="Green ROI" subtitle="Return on investment for green asset initiatives">
    <Box style={{ height: '300px', width: '400px' }}>
      <Chart options={options} series={series} type="line" width={400} height="100%" />
    </Box>
    <Box mt={2} display="flex" justifyContent="space-between" px={2}>
      <Typography variant="body2" color="text.secondary">
        Average ROI:
        {' '}
        <span style={{ fontWeight: 500, color: '#63B363' }}>
          {averageROI}
          %
        </span>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Target:
        {' '}
        <span style={{ fontWeight: 500 }}>10%</span>
      </Typography>
    </Box>
  </ChartCard>
);

export default InvestmentEfficiency;
