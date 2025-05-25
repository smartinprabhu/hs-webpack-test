import { Box } from "@mui/material";
import React from "react";
import Chart from "react-apexcharts";

const ESGRadialChart = () => {
  const options = {
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -55,
        endAngle: 90,
        track: {
          background: "#DEDEDE",
          startAngle: -90,
          endAngle: 90,
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: -20,
          },
          value: {
            fontSize: "20px",
            show: true,
            offsetY: -60,
          },
        },
      },
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 160,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          vertical: 3,
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#00A4DC"],
    },
    stroke: {
      lineCap: "butt",
    },
    labels: ["Progress"],
  };

  return (
    <Box
      sx={{
        height: "500px",
        width: "500px",
        border: "1px solid #000000",
        backgroundColor: "#ffffff",
      }}
    >
      <Chart series={[67]} options={options} height={400} type="radialBar" />
    </Box>
  );
};

export default ESGRadialChart;
