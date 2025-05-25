import React from "react";
import Chart from "react-apexcharts";

const RadialChart = (props) => {
  const { chartData } = props;

  return (
    <div>
      <Chart
        type="radialBar"
        series={[5]}
        options={{
          plotOptions: {
            radialBar: {
              hollow: {
                size:"65%"
              },
            },
          },
          labels: chartData.label,
          colors: chartData.color,
        }}
      />
    
    </div>
  );
};

export default RadialChart;
