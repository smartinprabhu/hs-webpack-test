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
import {
  getTicketChannelFormLabel,
} from '../utils/utils';

const Warranty = () => {
  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);

  return (
    <>
      {ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
        <div>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0">Channel</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 mt-2 font-weight-400 font-tiny text-capital">{getDefaultNoValue(getTicketChannelFormLabel(ticketDetail.data[0].channel))}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0">Category</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 mt-2 font-weight-400 font-tiny">{getDefaultNoValue(ticketDetail.data[0].category_id ? ticketDetail.data[0].category_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0">Sub Category</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 mt-2 font-weight-400 font-tiny">{getDefaultNoValue(ticketDetail.data[0].sub_category_id ? ticketDetail.data[0].sub_category_id[1] : '')}</span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0">Priority</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 mt-2 font-weight-400 font-tiny">{getDefaultNoValue(ticketDetail.data[0].priority_id ? ticketDetail.data[0].priority_id[1] : '')}</span>
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
export default Warranty;
