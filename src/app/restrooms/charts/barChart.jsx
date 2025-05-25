import React from "react";
import Chart from "react-apexcharts";

const VerticalChart = (props) => {
  const { chartData, categories, chartHeight } = props;

  return (
    <div>
      <Chart
        className=""
        height={chartHeight}
        type="bar"
        series={chartData}
        options={{
          chart: {
            height: "100%",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "40%",
            },
          },
          xaxis: {
            categories: categories,
          },
          stroke: {
            width: 3,
            colors: ["transparent"],
          },
        }}
      />
    </div>
  );
};

export default VerticalChart;
