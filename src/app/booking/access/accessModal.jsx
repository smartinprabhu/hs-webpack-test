/* eslint-disable import/no-unresolved */
/* eslint-disable no-mixed-operators */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalBody, ModalFooter, Row, Col, Container, Spinner,
} from 'reactstrap';
import QRCode from 'react-qr-code';

import selectedCalendarImage from '@images/calendar.ico';
import scanIcon from '@images/scanIcon.png';
import location from '@images/locationCircle.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { TimeZoneDateConvertor } from '@shared/dateTimeConvertor';
import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import DisplayTimezone from '@shared/timezoneDisplay';

import saveAccessData from './accessService';

const AccessModalWindow = ({ modalWindowOpen, openModalWindow, bookingItem }) => {
  const dispatch = useDispatch();
  const [status, accessStatus] = useState(false);

  const saveAccess = (siteId, shiftId, employeeId) => {
    dispatch(saveAccessData(siteId, shiftId, employeeId));
    accessStatus(true);
  };

  const { userInfo } = useSelector((state) => state.user);
  const { accessInfo } = useSelector((state) => state.access);

  return (
    <Modal className="access-space-modal" size="lg" isOpen={modalWindowOpen} toggle={openModalWindow}>
      <ModalBody>
        {(accessInfo && accessInfo.data && !accessInfo.data.message) || !accessInfo.err && (
          <CancelButtonGrey openCloseModalWindow={openModalWindow} />
        )}
        <Container>
          <Row sm="12" md="12" lg="12" xs="12" className="mb-3">
            <Col sm="2" md="2" lg="2" xs="3">
              <img src={scanIcon} height="60" width="60" alt="scan icon" />
            </Col>
            <Col sm="10" md="10" lg="10" xs="9">
              <h2>Scan QR code to access the building</h2>
              <p className="font-weight-300">Have a nice day!</p>
            </Col>
          </Row>
          <Container>
            <Col sm="12" md="12" lg="12" xs="12" className="rounded bg-ghost-white">
              <Row className="p-3">
                <Col sm="2" md="2" lg="2" xs="3" className="text-center">
                  <img src={selectedCalendarImage} alt="calendar" width="60" height="60" />
                  <div className="text-center mt-n5">
                    <div>
                      <small className="text-uppercase font-weight-700 font-size-xsmall">
                        <TimeZoneDateConvertor date={bookingItem.planned_in} format="dddd" />
                      </small>
                    </div>
                    <h3>
                      <TimeZoneDateConvertor date={bookingItem.planned_in} format="D" />
                    </h3>
                  </div>
                </Col>
                <Col sm="10" md="10" lg="10" xs="9">
                  <h3 className="font-weight-700">
                    <TimeZoneDateConvertor date={bookingItem.planned_in} format="dddd D MMMM YYYY" />
                  </h3>
                  <div className="light-text">
                    Shift
                    {' '}
                    {bookingItem.shift.space_name}
                    ,
                    {' '}
                    <TimeZoneDateConvertor date={bookingItem.planned_in} format="LT" />
                    {' '}
                    <DisplayTimezone />
                    {' '}
                    -
                    {' '}
                    <TimeZoneDateConvertor date={bookingItem.planned_out} format="LT" />
                    {' '}
                    <DisplayTimezone />
                  </div>
                </Col>
              </Row>
              <Row className="p-3">
                <Col sm="2" md="2" lg="2" xs="3" className="text-center">
                  <img src={location} alt="location" height="50" width="50" />
                </Col>
                <Col sm="10" md="10" lg="10" xs="9">
                  <h3 className="font-weight-700">
                    {bookingItem.company.name}
                  </h3>
                  <div className="light-text">{bookingItem.space.name}</div>
                </Col>
              </Row>
            </Col>
          </Container>
          <Row className="qr-code-align">
            <div className="mt-4">
              <QRCode value={bookingItem.uuid} size={100} />
            </div>
          </Row>
        </Container>

        {accessInfo && accessInfo.data && accessInfo.data.message && (
        <SuccessAndErrorFormat response={accessInfo} successMessage={accessInfo.data.message} />
        )}
        {accessInfo && accessInfo.err && accessInfo.err.error && (
        <SuccessAndErrorFormat response={accessInfo} />
        )}
      </ModalBody>
      <ModalFooter>
        {(status && accessInfo && accessInfo.data && accessInfo.data.message) || accessInfo.err
          ? <Button type="button" className="ok-btn" onClick={openModalWindow}>Ok</Button>
          : (
            <Button type="button" className="confirm-btn" onClick={() => saveAccess(bookingItem.company.id, bookingItem.id, userInfo.data && userInfo.data.employee.id)}>
              {accessInfo && accessInfo.loading && (
                <Spinner size="sm" color="light" />
              )}
              <span className="ml-2" />
              Confirm
            </Button>
          )}
      </ModalFooter>
    </Modal>
  );
};

AccessModalWindow.propTypes = {
  modalWindowOpen: PropTypes.bool.isRequired,
  openModalWindow: PropTypes.func.isRequired,
  bookingItem: PropTypes.shape({
    planned_in: PropTypes.string,
    planned_out: PropTypes.string,
    id: PropTypes.number,
    prescreen_status: PropTypes.bool,
    company: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    space: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    shift: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    uuid: PropTypes.string,
  }).isRequired,
};

export default AccessModalWindow;
