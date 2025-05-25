/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate,
} from '../../util/appUtils';

const ExtraInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Sequence
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.sequence)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            System
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.system_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Company
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Created On
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Dead Line Date
          </span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date_deadline, userInfo, 'datetime'))}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

ExtraInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default ExtraInfo;
