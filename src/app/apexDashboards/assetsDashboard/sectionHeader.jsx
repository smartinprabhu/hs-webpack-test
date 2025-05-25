/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-lonely-if */
import React from 'react';
import * as PropTypes from 'prop-types';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getColorCode,
  convertPXToVW,
} from '../utils/utils';
import {
  isJsonString, getJsonString,
} from '../../util/appUtils';
import { useTheme } from '../../ThemeContext';

const SectionHeader = React.memo((props) => {
  const { themes } = useTheme();
  const { chartData, height, width } = props;

  function isJsonValue(opt, field1, field2) {
    let res = false;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2]) {
      res = getJsonString(opt)[field1][field2];
    }
    return res;
  }
  const border = themes === 'light'
    ? '1px solid black' // Black border in light mode
    : isJsonValue(
      chartData.ks_info ? chartData.ks_info : chartData.ks_description,
      'header',
      'border',
    )
      ? isJsonValue(
        chartData.ks_info ? chartData.ks_info : chartData.ks_description,
        'header',
        'border',
      )
      : 'unset'; // Default or custom border for other modes
  return (
    <>
      {chartData && (
      <div
        className="p-1 bg-med-blue-dashboard"
        style={{
          display: 'flex',
          verticalAlign: 'middle',
          justifyContent: 'space-evenly',
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: themes === 'light' ? '#2D2E2D' : getColorCode(chartData.ks_background_color),
          position: 'absolute',
          alignItems: 'center',
          border,
        }}
      >
        <h3
          className="mb-0 p-2"
          style={{
            fontFamily: 'Suisse Intl',
            fontSize: isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'text', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'text', 'size') : convertPXToVW(width, height, 2),
            color: getColorCode(chartData.ks_font_color),
            marginLeft: isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'text', 'align') && isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'text', 'align') === 'Left'
              ? '5px' : 'auto',
            marginRight: isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'text', 'align') && isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'text', 'align') === 'Right'
              ? '5px' : 'auto',
          }}
        >
          {chartData && chartData.name ? chartData.name : ''}
        </h3>
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
