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
  hexToBase64,
  convertPXToVW,
} from '../utils/utils';
import {
  detectMimeType,
} from '../../util/appUtils';

const SectionImage = React.memo((props) => {
  const { chartData, width, height } = props;

  const customHeight = height - 20;
console.log(chartData,'chartData');
  return (
    <>
      {chartData && (
      <div
        width="100%"
        className="p-0"
        height={height}
        id="rechartContainer"
        style={{ height: `${height}px`, width: '100%' }}
      >
        {chartData.ks_dashboard_item_image_source === 'File' && chartData.ks_dashboard_item_image_file && (
        <img
          style={{
            width: '100%', height:'100%',
          }}
          src={`data:${detectMimeType(chartData.ks_dashboard_item_image_file)};base64,${hexToBase64(chartData.ks_dashboard_item_image_file)}`}
          width={width}
          height={height - 5}
          alt="Helixsense Portal"
        />
        )}
        {chartData.ks_dashboard_item_image_source === 'URL' && chartData.ks_dashboard_item_image_url && (
        <img
          style={{
            width: '100%', height: 'auto', maxWidth: '500px',
          }}
          src={chartData.ks_dashboard_item_image_url}
          width={width}
          height={customHeight}
          alt="Helixsense Portal"
        />
        )}
       
      </div>
      )}
    </>
  );
});

SectionImage.propTypes = {
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
export default SectionImage;
