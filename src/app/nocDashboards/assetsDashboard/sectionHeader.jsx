/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-lonely-if */
import React from 'react';
import * as PropTypes from 'prop-types';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
    getColorCode
  } from '../utils/utils';

const SectionHeader = React.memo((props) => {
  const { chartData, height } = props;

  return (
    <>
      {chartData && (
      <div className="text-center p-0 bg-med-blue-dashboard" style={{ backgroundColor: getColorCode(chartData.ks_background_color), height: `${height}px` }}>
        <h3 className="" style={{ color: getColorCode(chartData.ks_font_color) }}>{chartData && chartData.name ? chartData.name : ''}</h3>
      </div>
      )}
    </>
  );
});

SectionHeader.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  height: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};
export default SectionHeader;
