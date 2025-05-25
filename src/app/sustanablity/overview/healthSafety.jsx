import React from 'react';
import Chart from 'react-apexcharts';

import ChartCard from './chartCard';

const HealthSafetyHeatmap = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const labels = [
    { id: 1, label: 'Elevators' },
    { id: 2, label: 'Main Boiler' },
    { id: 3, label: 'Emergency Exits' },
    { id: 4, label: 'Lighting Systems' },
    { id: 5, label: 'HVAC Systems' },
    { id: 6, label: 'Fire Suppression' },
    { id: 7, label: 'Security Systems' },
    { id: 8, label: 'Water Systems' },
    { id: 9, label: 'Electrical Panels' },
    { id: 10, label: 'Electrical Circuit' },
    { id: 11, label: 'Electrical Generator' },
    { id: 12, label: 'Electrical Board' },
  ];

  // Utility to generate a random Y value for the heatmap
  const getRandomY = () => Math.floor(Math.random() * 100); // or any logic you want

  const series = labels.map((label) => ({
    name: label.label,
    data: months.map((month) => ({
      x: month,
      y: getRandomY(),
    })),
    group: 'apexcharts-axis-0',
  }));

  const options = {
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: -30,
              to: 5,
              name: 'Negligible',
              color: '#00A100', // Green
            },
            {
              from: 6,
              to: 20,
              name: 'Moderate',
              color: '#128FD9', // Blue
            },
            {
              from: 21,
              to: 45,
              name: 'Significant',
              color: '#FFB200', // Orange
            },
            {
              from: 46,
              to: 55,
              name: 'Critical',
              color: '#FF0000', // Red
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
    },
  };

  return (
    <ChartCard
      title="Health & Safety Risk Heatmap"
      subtitle="Asset risk assessment across facility"
    >
      <div style={{ height: '100%', width: '100%' }}>
        <Chart options={options} series={series} type="heatmap" height={300} />
      </div>
    </ChartCard>
  );
};

export default HealthSafetyHeatmap;
