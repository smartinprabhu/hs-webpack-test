/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getDefinitonByLabel } from '../../../assets/utils/utils';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const GeneralInfo = (props) => {
  const {
    detailData,
  } = props;
  const [reOrderingRule, setReOrderingRule] = useState(false);
  const [currentTooltip, setCurrentTip] = useState('');
  const { userInfo } = useSelector((state) => state.user);

  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const loading = detailData && detailData.loading;

  useEffect(() => {
    if (userInfo && userInfo.data && detailData && detailData.data && detailData.data.length) {
      setReOrderingRule(detailData.data[0]);
    }
  }, [detailData, userInfo]);

  return (
    <>
      {!loading && detail && (
      <>
        <Row className="m-0">
          <span
            className="m-0 p-0 light-text"
            aria-hidden
            onMouseEnter={() => setCurrentTip('product_id')}
            onFocus={() => setCurrentTip('product_id')}
          >
            Product
          </span>
          {currentTooltip === 'product_id' && (
          <Tooltip title={getDefinitonByLabel('product_id')} placement="right">
            <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
          )}
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.product_id ? reOrderingRule.product_id : getDefaultNoValue(reOrderingRule.product_id)}</span>
        </Row>
        <p className="mt-2" />
        <Row>
          <Col sm="6" md="6" xs="6" lg="6">
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('product_min_qty')}
                onFocus={() => setCurrentTip('product_min_qty')}
              >
                Reorder Level
              </span>
              {currentTooltip === 'product_min_qty' && (
              <Tooltip title={getDefinitonByLabel('product_min_qty')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.product_min_qty ? reOrderingRule.product_min_qty : getDefaultNoValue(reOrderingRule.product_min_qty)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('product_max_qty')}
                onFocus={() => setCurrentTip('product_max_qty')}
              >
                Reorder Quantity
              </span>
              {currentTooltip === 'product_max_qty' && (
              <Tooltip title={getDefinitonByLabel('product_max_qty')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.product_max_qty ? reOrderingRule.product_max_qty : getDefaultNoValue(reOrderingRule.product_max_qty)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('product_alert_level_qty')}
                onFocus={() => setCurrentTip('product_alert_level_qty')}
              >
                Alert Level
              </span>
              {currentTooltip === 'product_alert_level_qty' && (
              <Tooltip title={getDefinitonByLabel('product_alert_level_qty')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.product_alert_level_qty ? reOrderingRule.product_alert_level_qty : getDefaultNoValue(reOrderingRule.product_alert_level_qty)}</span>
            </Row>
            <p className="mt-2" />
            {/* <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('qty_multiple')}
                onFocus={() => setCurrentTip('qty_multiple')}
              >
                Quantity Multiple
              </span>
              {currentTooltip === 'qty_multiple' && (
              <Tooltip title={getDefinitonByLabel('qty_multiple')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.qty_multiple ? reOrderingRule.qty_multiple : getDefaultNoValue(reOrderingRule.qty_multiple)}</span>
            </Row> */}
          </Col>
          <Col sm="6" md="6" xs="6" lg="6">
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('lead_days')}
                onFocus={() => setCurrentTip('lead_days')}
              >
                Lead Time
              </span>
              {currentTooltip === 'lead_days' && (
              <Tooltip title={getDefinitonByLabel('lead_days')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.lead_days ? reOrderingRule.lead_days : getDefaultNoValue(reOrderingRule.lead_days)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('lead_type')}
                onFocus={() => setCurrentTip('lead_type')}
              >
                Lead Type
              </span>
              {currentTooltip === 'lead_type' && (
              <Tooltip title={getDefinitonByLabel('lead_type')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.lead_type ? reOrderingRule.lead_type : getDefaultNoValue(reOrderingRule.lead_type)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span
                className="m-0 p-0 light-text"
                aria-hidden
                onMouseEnter={() => setCurrentTip('product_uom')}
                onFocus={() => setCurrentTip('product_uom')}
              >
                Product Unit Of Measure
              </span>
              {currentTooltip === 'product_uom' && (
              <Tooltip title={getDefinitonByLabel('product_uom')} placement="right">
                <span className="text-info" onMouseLeave={() => setCurrentTip('')}>
                  <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              )}
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{reOrderingRule.product_uom && reOrderingRule.product_uom.length ? reOrderingRule.product_uom[1] : getDefaultNoValue(reOrderingRule.product_uom)}</span>
            </Row>
          </Col>
        </Row>
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
