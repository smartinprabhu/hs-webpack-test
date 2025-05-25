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
  getDefaultNoValue,
} from '../../util/appUtils';

const SlaInfo = () => {
  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);

  return (
    <>
      {ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
        <div className="max-height-550 thin-scrollbar overflow-auto pr-2">
          <Row className="mb-4 ml-1 mr-1 mt-0">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">SLA Status</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(ticketDetail.data[0].sla_status ? ticketDetail.data[0].sla_status : '')}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Duration</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].sla_time)}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">SLA Level</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].sla_id ? ticketDetail.data[0].sla_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Responsible</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(ticketDetail.data[0].emloyee_id ? ticketDetail.data[0].emloyee_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
          </Row>
        </div>
      )}
      {ticketDetail.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(ticketDetail && ticketDetail.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={ticketDetail.err.statusText ? ticketDetail.err.statusText : 'Something went wrong'} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default SlaInfo;
