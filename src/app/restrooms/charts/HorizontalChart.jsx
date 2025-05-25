import Chart from "react-apexcharts";

const HorizontalChart = (props) => {
  const {
    chartData,
    categories,
    xAxisTitle,
    yAxisTitle,
    barHeight,
    clickHandle,
  } = props;

  return (
    <div>
      <Chart
        type="bar"
        height = "445" 

        series={chartData}
        options={{
          chart: {
            stacked: true,
            events: {
              dataPointSelection: (e, chartContext, config) => {
                clickHandle(config.dataPointIndex);
              },
            },
          },
          stroke: {
            width: 2,
          },
          xaxis: {
            title: {
              text: xAxisTitle,
              style: {
                fontFamily: "Suisse Intl",
                fontSize: "14px",
              },
            },
            labels: {
              style: {
                fontSize: "14px",
              },
            },
            categories: categories,
          },
          yaxis: {
            title: {
              text: yAxisTitle,
              style: {
                fontFamily: "Suisse Intl",
                fontSize: "14px",
              },
            },
            labels: {
              style: {
                fontSize: "14px",
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: barHeight,
              borderRadius: 5,
              borderRadiusWhenStacked: "all",
              dataLabels: {
                total: {
                  enabled: true,
                },
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "center",
            offsetX: 40,
          },
        }}
      />
    </div>
  );
};

export default HorizontalChart;