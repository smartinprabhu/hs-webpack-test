import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

const ChartPreview = (props) => {
  const {
    options,
    type,
    datasets,
  } = props;

  return (
    <Chart
      type={type}
      id="bar-chartzz"
      height="80%"
      series={datasets}
      options={options}
    />
  );
};

ChartPreview.propTypes = {
  options: PropTypes.objectOf.isRequired,
};

export default ChartPreview;
