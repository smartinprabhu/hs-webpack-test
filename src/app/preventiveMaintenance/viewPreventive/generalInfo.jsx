/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDefinitonByLabel } from '../../assets/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../util/appUtils';

const GeneralInfo = (props) => {
  const {
    detailData,
  } = props;

  const [currentTooltip, setCurrentTip] = useState('');

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('location')}
            onFocus={() => setCurrentTip('location')}
          >
            Location
          </span>
          {currentTooltip === 'location' && (
          <Tooltip title={getDefinitonByLabel('location')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.data[0].location))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('tags')}
            onFocus={() => setCurrentTip('tags')}
          >
            Tags
          </span>
          {currentTooltip === 'tags' && (
            <Tooltip title={getDefinitonByLabel('tags')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
          )}
        </Row>
        <Row className="m-0">

          {getDefaultNoValue(detailData.data[0].categ_ids
                  && detailData.data[0].categ_ids[1]
            ? detailData.data[0].categ_ids[1] : '')}

        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('remainders')}
            onFocus={() => setCurrentTip('remainders')}
          >
            Remainders
          </span>
          {currentTooltip === 'remainders' && (
            <Tooltip title={getDefinitonByLabel('remainders')} placement="right">
              <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
              </span>
            </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          {getDefaultNoValue(
            detailData.data[0].alarm_ids && detailData.data[0].alarm_ids[1]
              ? detailData.data[0].alarm_ids[1]
              : '',
          )}

        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default GeneralInfo;
