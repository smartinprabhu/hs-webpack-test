import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import { Row, Col, Card } from 'reactstrap';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import propTypes from 'prop-types';

import scanIcon from '@images/scanIcon.png';
import { getBookingListFromUuid, GetUtcDate } from './service';
import '../booking.scss';

const queryString = require('query-string');

const GetAccess = (props) => {
  const propValues = props;
  const values = queryString.parse(propValues.location.search);
  const { bookingListInfo } = useSelector((state) => state.access);
  const dispatch = useDispatch();
  useEffect(() => {
    if (values.uuid) dispatch(getBookingListFromUuid(values.uuid));
  }, []);
  return (
    <div>
      <Row className="m-0">
        <Col className="p-4 mt-7 qr-screen" sm={{ size: 5, offset: 4 }}>
          <Row className="m-0">
            <Col sm="2" className="mt-1 float-left">
              <img src={scanIcon} className="float-left" height="50" width="50" alt="scan icon" />
            </Col>
            <Col sm="10" md="10" lg="10">
              <h2>Scan QR code to access the building</h2>
              <p className="font-weight-300">Have a nice day!</p>
            </Col>
          </Row>
          <Row className="bg-azure mt-2 py-2">
            {bookingListInfo && bookingListInfo.data && bookingListInfo.data.map((data) => (
              <Col sm="12" key={data.id}>
                <Row>
                  <Col sm="3">
                    <Card className="pl-3 bg-azure">
                      <div>
                        <GetUtcDate date={data.planned_in} format="dddd" />
                      </div>
                      <div className="pl-3">
                        <GetUtcDate date={data.planned_in} format="D" />
                      </div>
                    </Card>
                  </Col>
                  <Col sm="9">
                    <GetUtcDate date={data.planned_in} format="dddd D MMMM YYYY" />
                    <div className="light-text">
                      Shift
                      {' '}
                      {data.shift.name}
                      ,
                      <GetUtcDate date={data.planned_in} format="LT" />
                      -
                      <GetUtcDate date={data.planned_out} format="LT" />
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col sm="3">
                    <div className="text-center mt-1">
                      <FontAwesomeIcon className="fa-2x" icon={faMapMarkerAlt} />
                    </div>
                  </Col>
                  <Col sm="9">
                    <h4>{data.company.name}</h4>
                    <span>{data.space.name}</span>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
          <Row className="qr-code-align mt-2 p-3">
            {values && values.uuid && (
              <QRCode value={values.uuid} size={128} />
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

GetAccess.propTypes = {
  propValues: propTypes.shape({
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }),
};

GetAccess.defaultProps = {
  propValues: {},
};

export default GetAccess;
