import React from 'react';
import Chart from 'react-apexcharts';

import ChartCard from './chartCard';

const AccessibilityCompliance = () => {
  const data = [
    { name: 'Fully Compliant', value: 65, color: '#63B363' },
    { name: 'Partially Compliant', value: 25, color: '#FFD43B' },
    { name: 'Non-Compliant', value: 10, color: '#E53E3E' },
  ];

  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.name);
  const colors = data.map((item) => item.color);

  const options = {
    chart: {
      type: 'pie',
      width: 300,
    },
    labels,
    colors,
    legend: {
      position: 'bottom',
      fontSize: '12px',
    },
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val.toFixed(0)}%`;
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff'],
      },
    },
    tooltip: {
      y: {
        formatter(value) {
          return `${value}%`;
        },
      },
    },
    stroke: {
      show: false,
    },
  };

  return (
    <ChartCard
      title="Accessibility Compliance"
      subtitle="Percentage of assets meeting ADA requirements"
    >
      <div style={{ height: '300px', width: '300px' }}>
        <Chart options={options} series={series} type="pie" width={400} height="100%" />
      </div>
    </ChartCard>
  );
};

export default AccessibilityCompliance;
