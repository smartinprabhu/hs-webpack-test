/* eslint-disable react/prop-types */
import React from 'react';
import Chart from 'react-apexcharts';
import { Box, Typography } from '@mui/material';

import ChartCard from './chartCard';

const data = [
  { name: 'HVAC System', hours: 48, impact: 'high' },
  { name: 'Elevator #2', hours: 36, impact: 'high' },
  { name: 'Main Generator', hours: 24, impact: 'medium' },
  { name: 'Security System', hours: 18, impact: 'medium' },
  { name: 'Water Pump #1', hours: 12, impact: 'low' },
];

const impactColors = {
  high: '#E53E3E',
  medium: '#FFD43B',
  low: '#63B363',
};

// Step 1: Aggregate hours by impact
const impactGroups = data.reduce((acc, item) => {
  if (!acc[item.impact]) {
    acc[item.impact] = { hours: 0, color: impactColors[item.impact] };
  }
  acc[item.impact].hours += item.hours;
  return acc;
}, {});

// Step 2: Convert to percentage
const totalHours = data.reduce((sum, item) => sum + item.hours, 0);
const legendData = Object.entries(impactGroups).map(([rating, { hours, color }]) => ({
  rating,
  color,
  percentage: Math.round((hours / totalHours) * 100),
}));

// Chart series
const series = [
  {
    name: 'Downtime (hours)',
    data: data.map((item) => ({
      x: item.name,
      y: item.hours,
      fillColor: impactColors[item.impact] || '#8E9196',
    })),
  },
];

// Chart options
const options = {
  chart: {
    type: 'bar',
    width: 300,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      distributed: true,
      columnWidth: '50%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    type: 'category',
    labels: { rotate: -45, style: { fontSize: '11px' } },
  },
  yaxis: {
    title: {
      text: 'Hours',
      style: { fontSize: '12px' },
    },
    labels: { style: { fontSize: '11px' } },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} hours`,
      title: { formatter: () => 'Downtime' },
    },
    x: { formatter: (val) => `Asset: ${val}` },
  },
  colors: data.map((item) => impactColors[item.impact]),
};

// SeriesLegend component
const SeriesLegend = ({ rating, color, percentage }) => (
  <Box display="flex" alignItems="center" key={rating}>
    <Box
      sx={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderRadius: '50%',
        marginRight: 1,
      }}
    />
    <Typography variant="caption">{`${rating.charAt(0).toUpperCase() + rating.slice(1)}: ${percentage}%`}</Typography>
  </Box>
);

// Main component
const AssetDowntime = () => (
  <ChartCard title="Asset Downtime Report" subtitle="Top 5 assets causing most downtime this quarter">
    <Box sx={{ height: '300px', width: '300px' }}>
      <Chart options={options} series={series} type="bar" width={400} height="100%" />
    </Box>
    <Box display="flex" justifyContent="space-between" mt={2} fontSize="0.75rem" color="text.secondary">
      {legendData.map(({ rating, color, percentage }) => (
        <SeriesLegend key={rating} rating={rating} color={color} percentage={percentage} />
      ))}
    </Box>
  </ChartCard>
);

export default AssetDowntime;
