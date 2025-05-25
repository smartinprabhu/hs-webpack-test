import React from 'react';
import Chart from 'react-apexcharts';

import ChartCard from './chartCard';

const data = [
  { category: 'HVAC Systems', rav: 15, actual: 13.5 },
  { category: 'Electrical', rav: 18, actual: 16 },
  { category: 'Plumbing', rav: 12, actual: 11.2 },
  { category: 'Building Envelope', rav: 10, actual: 8.5 },
  { category: 'Safety Systems', rav: 9, actual: 8.8 },
  { category: 'Elevators', rav: 7, actual: 7.2 },
  { category: 'Interior Fixtures', rav: 14, actual: 12 },
];

// Extract categories for the x-axis
const categories = data.map((d) => d.category);

// Format series data
const series = [
  {
    name: 'Replacement Asset Value',
    data: data.map((d) => d.rav),
  },
  {
    name: 'Actual Current Value',
    data: data.map((d) => d.actual),
  },
];

const options = {
  chart: {
    type: 'bar',
    width: 400,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories,
    labels: { style: { fontSize: '11px' } },
  },
  yaxis: {
    title: {
      text: 'Value ($M)',
      style: {
        fontSize: '12px',
      },
    },
    labels: {
      style: { fontSize: '11px' },
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `$${val}M`,
    },
  },
  legend: {
    show: true,
    fontSize: '12px',
    labels: {
      colors: '#333',
    },
  },
  colors: ['#4285F4', '#63B363'],
};

const RAVActualValueChart = () => (
  <ChartCard title="RAV vs Actual Asset Value" subtitle="Replacement Asset Value compared to current value ($M)">
    <div className="h-64" style={{ height: '300px', width: '400px' }}>
      <Chart
        options={options}
        series={series}
        type="bar"
        height="100%"
        width={400}
      />
    </div>
  </ChartCard>
);

export default RAVActualValueChart;
