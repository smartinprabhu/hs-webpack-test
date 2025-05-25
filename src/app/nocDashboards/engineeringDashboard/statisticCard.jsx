/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';
// import { Line } from "@reactchartjs/react-chart.js";

const StatisticCard = ({ title, goal, data }) => {
  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  };

  const chartData = {
    labels: data,
    datasets: [
      {
        data,
        fill: true,
        backgroundColor:
          goal >= data[data.length - 1]
            ? 'rgb(19, 201, 100, 0.2)'
            : 'rgb(220, 53, 69, 0.2)',
        pointRadius: 0,
      },
    ],
  };

  return (
    <Card className="mt-4 card-raised">
      <CardBody className="position-relative pl-2 pt-2" style={{ height: 150 }}>
        <CardTitle tag="h5">{title}</CardTitle>
        {goal >= data[data.length - 1] ? (
          <>
            <div className="d-flex align-items-center text-success px-2">
              <span className="font-weight-bold font-size-36">
                {data[data.length - 1]}
              </span>
              <i className="fa fa-check" />
            </div>
            <p className="font-weight-normal px-2">
              Goal:
              {' '}
              {goal}
              {' '}
              (
              {goal - data[data.length - 1] >= 0
                ? `+${goal - data[data.length - 1]}`
                : goal - data[data.length - 1]}
              )
            </p>
          </>
        ) : (
          <>
            <div className="d-flex align-items-center text-danger px-2">
              <span className="font-weight-bold font-size-36">
                {data[data.length - 1]}
              </span>
              <i className="fa fa-exclamation" />
            </div>
            <p className="font-weight-normal px-2">
              Goal:
              {' '}
              {goal}
              {' '}
              (
              {goal - data[data.length - 1] >= 0
                ? `+${goal - data[data.length - 1]}`
                : goal - data[data.length - 1]}
              )
            </p>
          </>
        )}
        <div className="card-chart-containter">
          <Line data={chartData} options={options} height={100} />
        </div>
      </CardBody>
    </Card>
  );
};

export default StatisticCard;
