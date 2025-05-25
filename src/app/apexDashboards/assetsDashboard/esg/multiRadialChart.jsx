import React from "react";
import Chart from "react-apexcharts";
import { Box } from "@mui/material";

const ESGMultiRadialChart = () => {
  const options = {
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 5,
          size: "40%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#26A9E0", "#29B473", "#FAAF40", "#EE4036"],
    labels: ["Gender Equity", "Race Equity", "Compensation", "Inclusion"],
    legend: {
      show: true,
      floating: true,
      fontSize: "16px",
      position: "left",
      offsetX: 280,
      //   offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return (
          seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%"
        );
      },
      itemMargin: {
        vertical: 15,
      },
    },
  };

  return (
    <Box
      sx={{
        border: "1px solid #000000",
      }}
    >
      <Chart
        options={options}
        height={350}
        type="radialBar"
        series={[76, 67, 61, 90]}
      />
    </Box>
  );
};

export default ESGMultiRadialChart;
