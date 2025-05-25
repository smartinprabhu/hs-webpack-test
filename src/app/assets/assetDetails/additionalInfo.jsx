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
  getCompanyTimezoneDate, getDefaultNoValue,
  generateErrorMessage,
} from '../../util/appUtils';
import SpaceLines from './spaceLines';

const AdditionalInfo = () => {
  const { equipmentsDetails } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
        <div>
          <Row className="mb-3 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Latitude</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].latitude)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Working Hours</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].operating_hours ? equipmentsDetails.data[0].operating_hours[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Capacity</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].capacity)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">yPos</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].ypos)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Refilling Due Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].refilling_due_date, userInfo, 'datetime'))}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Longitude</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(equipmentsDetails.data[0].longitude)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Make</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].make)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">xPos</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">
                  {getDefaultNoValue(equipmentsDetails.data[0].xpos)}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Last Service Done</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].last_service_done, userInfo, 'datetime'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Assigned To</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].employee_id ? equipmentsDetails.data[0].employee_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
          </Row>
          <Row className="mb-3 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="12">
              <h6>Space Labels</h6>
              <SpaceLines ids={equipmentsDetails.data[0].space_label_ids} />
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
export default AdditionalInfo;
