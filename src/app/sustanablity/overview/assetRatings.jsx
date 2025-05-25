import React from 'react';
import Chart from 'react-apexcharts';
import {
  Typography,
  Box,
} from '@mui/material';

import ChartCard from './chartCard';

const data = [
  { rating: 'Good', percentage: 55, color: '#63B363' },
  { rating: 'Average', percentage: 30, color: '#FFD43B' },
  { rating: 'Poor', percentage: 15, color: '#E53E3E' },
];

const series = [{
  data: data.map((item) => ({
    x: item.rating,
    y: item.percentage,
    fillColor: item.color,
  })),
}];

const options = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      distributed: true,
      dataLabels: {
        position: 'right',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val}%`,
    style: {
      fontSize: '12px',
      colors: ['#333'],
    },
  },
  xaxis: {
    categories: data.map((d) => d.rating),
    labels: {
      formatter: (val) => `${val}%`,
    },
    title: {
      text: 'Percentage',
    },
    max: 100,
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  colors: data.map((d) => d.color),
  tooltip: {
    y: {
      formatter: (val) => `${val}%`,
    },
  },
  grid: {
    strokeDashArray: 4,
    xaxis: {
      lines: { show: true },
    },
    yaxis: {
      lines: { show: false },
    },
  },
  legend: { show: false },
};

const SeriesLegend = ({ rating, color, percentage }) => (
  <Box display="flex" alignItems="center">
    <Box
      sx={{
        width: 12,
        height: 12,
        backgroundColor: color,
        borderRadius: '50%',
        marginRight: 1,
      }}
    />
    <Typography variant="caption">{`${rating}: ${percentage}%`}</Typography>
  </Box>
);

const AssetEnergyRatings = () => (
  <ChartCard title="Asset Energy Ratings" subtitle="Percentage of assets by efficiency rating">
    <div className="h-64">
      <Chart options={options} series={series} type="bar" height="100%" width="100%" />
    </div>
    <Box display="flex" justifyContent="space-between" mt={2} fontSize="0.75rem" color="text.secondary">
      {data.map((item, index) => (
        <SeriesLegend rating={item.rating} color={item.color} percentage={item.percentage} />
      ))}
    </Box>
  </ChartCard>
);

export default AssetEnergyRatings;
