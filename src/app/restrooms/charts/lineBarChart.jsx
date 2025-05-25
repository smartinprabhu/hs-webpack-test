

import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineBarChart = () => {

  const [series, setSeries] = React.useState([{
    name: 'Usages',
    type: 'column',
    data: [230, 110, 220, 270, 130, 220, 370, 210, 440, 220, 300]
    
  }, {
    name: 'Work orders',
    type: 'line',
    data: [90, 125, 136, 130, 85, 95, 84, 152, 159, 136, 99]

  }]);

  const [options, setOptions] = React.useState({
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: false,
    },
    
    stroke: {
      width: [0, 2, 5],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '20%',
        
      }
    },
    // fill: {
    //   opacity: [0.85, 0.25, 1],
    //   gradient: {
    //     inverseColors: false,
    //     shade: 'light',
    //     type: "vertical",
    //     opacityFrom: 0.85,
    //     opacityTo: 0.55,
    //     stops: [0, 100, 100, 100]
    //   }
    // },
    labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
      '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
    ],
    markers: {
      size: 5 ,
      color:"#ffffff"
    },
    xaxis: {
      type: 'datetime', 
      
    },
    yaxis: {
      title: {
        text: 'Measure value',
      },
      min: 0
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " Measure value";
          }
          return y;

        }
      }
    }
  });

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="line" height={350}  />
    </div>
  );
};

export default LineBarChart;
