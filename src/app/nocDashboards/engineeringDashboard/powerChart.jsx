/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Spin } from 'antd';
// import { Line } from "@reactchartjs/react-chart.js";
import customData from '../data/customData.json';

const PowerChart = () => {
  const [powerData, setPowerData] = useState({});
  const [loading, setLoading] = useState(false);

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      xAxis: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const consumtionData = customData.powers.map((d) => d.consumption);
    const threshold = new Array(consumtionData.length).fill(400);
    setPowerData({
      labels: customData.powers.map((d) => d.month),
      datasets: [
        {
          label: 'Power',
          data: consumtionData,
          fill: false,
          backgroundColor: 'rgb(0, 170, 255)',
          borderColor: 'rgba(0, 170, 255, 0.8)',
        },
        {
          label: 'threshold',
          data: threshold,
          fill: false,
          borderColor: '#3a4354',
          pointRadius: 0,
          borderDash: [5, 5],
        },
      ],
    });
  }, []);

  return (
    <div className="mt-3 px-2">
      {loading ? <Spin /> : <Line data={powerData} options={options} height={60} />}
    </div>
  );
};

export default PowerChart;
