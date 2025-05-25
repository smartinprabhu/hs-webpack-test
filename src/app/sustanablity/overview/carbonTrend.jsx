import React from 'react';
import Chart from 'react-apexcharts';
import {
  Typography,
  Box,
} from '@mui/material';

import ChartCard from './chartCard';

const data = [
  { month: 'Jan', emissions: 110 },
  { month: 'Feb', emissions: 105 },
  { month: 'Mar', emissions: 115 },
  { month: 'Apr', emissions: 112 },
  { month: 'May', emissions: 108 },
  { month: 'Jun', emissions: 103 },
  { month: 'Jul', emissions: 100 },
  { month: 'Aug', emissions: 95 },
  { month: 'Sep', emissions: 90, forecasted: true },
  { month: 'Oct', emissions: 85, forecasted: true },
  { month: 'Nov', emissions: 80, forecasted: true },
  { month: 'Dec', emissions: 75, forecasted: true },
];

const CarbonFootprintChart = () => {
  const actualData = data.map((d) => (d.forecasted ? 0 : d.emissions));
  const forecastedData = data.map((d) => (d.forecasted ? d.emissions : 0));
  const categories = data.map((d) => d.month);

  const baseColor = '#4285F4';
  const forecastOpacity = 0.4;

  const series = [
    {
      name: 'Actual',
      data: actualData,
    },
    {
      name: 'Forecasted',
      data: forecastedData,
    },
  ];

  console.log(series);

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      width: [3, 3], // Both lines have the same width
      dashArray: [0, 5], // Solid for Actual, dashed for Forecasted
      curve: 'smooth',
    },
    colors: [baseColor, '#9bbbf0'], // Both lines use the same color
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: { sizeOffset: 2 },
      colors: [baseColor, '#9bbbf0'],
      discrete: data.map((d, i) => ({
        seriesIndex: d.forecasted ? 1 : 0,
        dataPointIndex: i,
        fillColor: d.forecasted ? '#9bbbf0' : baseColor,
        strokeColor: d.forecasted ? '#9bbbf0' : baseColor,
        size: 5,
        opacity: d.forecasted ? forecastOpacity : 1, // Set opacity for forecasted
      })),
    },
    xaxis: {
      categories, // Replace with actual categories (e.g., months)
      labels: { style: { fontSize: '12px' } },
    },
    yaxis: {
      title: { text: 'Tons CO₂' },
      labels: { style: { fontSize: '12px' } },
      min: Math.min(...data.map((d) => d.emissions)) - 10,
      max: Math.max(...data.map((d) => d.emissions)) + 5,
    },
    grid: {
      strokeDashArray: 4,
    },
    tooltip: {
      shared: false,
      y: {
        formatter(value, {
          series, seriesIndex, dataPointIndex, w,
        }) {
          const seriesName = w.globals.seriesNames[seriesIndex];
          return `${seriesName}: ${value} Tons`;
        },
      },
    },
    legend: { show: false }, // Disable the default ApexCharts legend
  };

  const SeriesLegend = ({ label, color, opacity = 1 }) => (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          width: 12,
          height: 12,
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: 1,
          opacity,
        }}
      />
      <Typography variant="caption">{label}</Typography>
    </Box>
  );

  return (
    <ChartCard title="Carbon Footprint Trend" subtitle="Tons CO₂/year with forecasted reductions">
      <div className="h-64">
        <Chart options={options} series={series} type="line" height="100%" width="100%" />
      </div>
      <Box display="flex" justifyContent="space-between" mt={2} fontSize="0.75rem" color="text.secondary">
        <SeriesLegend label="Actual" color={baseColor} />
        <SeriesLegend label="Forecasted" color={baseColor} opacity={forecastOpacity} />
      </Box>
    </ChartCard>
  );
};

export default CarbonFootprintChart;
