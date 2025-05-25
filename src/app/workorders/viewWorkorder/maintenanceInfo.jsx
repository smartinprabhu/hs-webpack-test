/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue, extractTextObject,
} from '../../util/appUtils';
import {
  
  getMTName, getIssueTypeName,
} from '../utils/utils';

const MaintenanceInfo = (props) => {
  const {
    detailData,
  } = props;

  return (detailData && (
  <Row className="m-0">
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Maintenance Team</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.maintenance_team_id ? detailData.maintenance_team_id[1] : '')}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Maintenance Type</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getMTName(detailData.maintenance_type))}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
      {detailData.state === 'cancel' && (
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Reject Reason</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.reject_reason)}
            </span>
          </Row>
          <p className="mt-2" />
        </Col>
      )}
      {detailData.state === 'pause' && (
        <>
          <Col sm="12" md="6" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">On-Hold Reason</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(extractTextObject(detailData.pause_reason_id))}
              </span>
            </Row>
            <p className="mt-2" />
          </Col>
          <Col sm="12" md="6" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Remarks</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(detailData.reason)}
              </span>
            </Row>
            <p className="mt-2" />
          </Col>
        </>
      )}
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Maintenance Operations</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.task_id ? detailData.task_id[1] : '')}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Source Document</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.origin)}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Technician</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.employee_id ? detailData.employee_id[1] : '')}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Issue Type</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(getIssueTypeName(detailData.issue_type))}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">PPM Calendar</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.ppm_calendar_id ? detailData.ppm_calendar_id[1] : '')}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">SLA Score Type</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.sla_score_type)}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Is Reopened</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.is_reopened ? 'Yes' : 'No'}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Team Category</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.sla_score_type)}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
  </Row>
  )
  );
};

MaintenanceInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default MaintenanceInfo;
