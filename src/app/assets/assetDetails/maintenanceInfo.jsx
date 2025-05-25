/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getCompanyTimezoneDate, getDefaultNoValue, getTimeFromFloat,
  getDateTimeFromFloat, generateErrorMessage,
} from '../../util/appUtils';

const MaintenanceInfo = () => {
  const { equipmentsDetails } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
        <div>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Maintenance Team</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].maintenance_team_id ? equipmentsDetails.data[0].maintenance_team_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Last Breakdown On</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].last_breakdown_on, userInfo, 'date'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">No of Breakdowns</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{equipmentsDetails.data[0].no_of_breakdowns}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Risk Cost</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">
                  {getTimeFromFloat(equipmentsDetails.data[0].risk_cost)}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Working Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">
                  {getDefaultNoValue(equipmentsDetails.data[0].resource_calendar_id ? equipmentsDetails.data[0].resource_calendar_id[1] : '')}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">MTBF</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDateTimeFromFloat(equipmentsDetails.data[0].mtbf_hours)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Scheduled Down Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getTimeFromFloat(equipmentsDetails.data[0].scheduled_down_time)}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Installed On</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].start_date, userInfo, 'date'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Breakdown Reason</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].breakdown_reason)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Total Breakdown</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{equipmentsDetails.data[0].total_breakdown_duration ? `${equipmentsDetails.data[0].total_breakdown_duration}.00` : '0.00'}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Expected MTBF</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getTimeFromFloat(equipmentsDetails.data[0].expected_mtbf)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">MTTR</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getTimeFromFloat(equipmentsDetails.data[0].mttf_hours)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Predictive Maintenance Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getTimeFromFloat(equipmentsDetails.data[0].predictive_maintenance_time)}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
          </Row>
        </div>
      )}
      {equipmentsDetails.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(equipmentsDetails && equipmentsDetails.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default MaintenanceInfo;
