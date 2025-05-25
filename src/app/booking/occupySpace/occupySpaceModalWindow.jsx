/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Modal, ModalBody, ModalFooter, Row, Col, Spinner,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import locationIcon from '@images/locationCircle.svg';
import calendarIcon from '@images/calendar.ico';
import TimeZoneDateConvertor from '@shared/dateTimeConvertor';
import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DisplayTimezone from '@shared/timezoneDisplay';

import spaceOccupy from './occupyService';
import '../booking.scss';

const OccupySpaceModalWindow = ({ modalWindowOpen, openModalWindow, bookingData }) => {
  const dispatch = useDispatch();
  const [status, occupyStatus] = useState(false);

  const occupySpace = () => {
    dispatch(spaceOccupy(bookingData.id));
    occupyStatus(true);
  };

  const { occupyResponse } = useSelector((state) => state.occupy);
  return (
    <Modal className="occupy-space-modal" size="lg" isOpen={modalWindowOpen} toggle={openModalWindow}>
      <ModalBody>
        {(occupyResponse && occupyResponse.data && !occupyResponse.data.length) || !occupyResponse.err && (
          <CancelButtonGrey openCloseModalWindow={openModalWindow} />
        )}
        <Row>
          <Col xs="2" sm="1" md="1" lg="1" className="pl-0">
            <img src={locationIcon} width="70" height="70" alt="location" />
          </Col>
          <Col xs="10" sm="10" md="10" lg="10" className="pl-3 mt-3">
            <h2>Occupy a space</h2>
            <h4 className="light-text"> Please confirm your occupation of your space.</h4>
            <h3 className="font-weight-bold mt-5">I, confirm that now I am occupying this space:</h3>
            <Row className="m-0">
              <Col sm="12" md="12" lg="12" xs="12" className="rounded bg-ghost-white">
                <Row className="p-2">
                  <Col sm="2 text-center" xs="3" md="2" lg="2">
                    <img src={calendarIcon} alt="calendar" width="60" height="60" />
                    <div className="text-center mt-n5">
                      <div>
                        <small className="text-uppercase font-weight-700 font-size-xsmall">
                          <TimeZoneDateConvertor date={bookingData.planned_in} format="dddd" />
                        </small>
                      </div>
                      <h3>
                        <TimeZoneDateConvertor date={bookingData.planned_in} format="D" />
                      </h3>
                    </div>
                  </Col>
                  <Col sm="9" md="9" lg="9" xs="8" className="pt-1">
                    {bookingData.planned_in && (
                      <h3 className="font-weight-700">
                        <TimeZoneDateConvertor date={bookingData.planned_in} format="dddd D MMMM YYYY" />
                      </h3>
                    )}
                    {bookingData.shift && (
                      <div className="text-cloud-burst font-weight-300">
                        {`Shift ${bookingData.shift.name}`}
                        ,
                        {' '}
                        <TimeZoneDateConvertor date={bookingData.planned_in} format="LT" />
                        {' '}
                        <DisplayTimezone />
                        {' '}
                        -
                        <TimeZoneDateConvertor date={bookingData.planned_out} format="LT" />
                        {' '}
                        <DisplayTimezone />
                      </div>
                    )}
                  </Col>
                </Row>
                <Row className="mt-3 pl-2">
                  <Col sm="2" md="2" lg="2" xs="3" className="text-center">
                    <img src={locationIcon} width="45" height="45" alt="location" />
                  </Col>
                  {bookingData.space && (
                    <Col sm="9" md="9" lg="9" xs="8">
                      <h3 className="font-weight-700">{bookingData.company.name}</h3>
                      <div className="text-cloud-burst font-weight-300 mb-2">
                        {bookingData.space.space_name}
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        {occupyResponse && occupyResponse.data && Array.isArray(occupyResponse.data) && typeof occupyResponse.data[0] === 'number' && (
        <SuccessAndErrorFormat response={occupyResponse} successMessage="Your booking space has been occupied" />
        )}
        {!occupyResponse && !occupyResponse.err && (
          <div className="text-center text-danger mt-4">
            <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
            Unable to occupy the space
          </div>
        )}
        {occupyResponse && occupyResponse.err && occupyResponse.err.error
          && occupyResponse.err.error.message && (
          <SuccessAndErrorFormat response={occupyResponse} />
        )}
      </ModalBody>
      <ModalFooter>
        {(status && occupyResponse.data && Array.isArray(occupyResponse.data) && typeof occupyResponse.data[0] === 'number') || occupyResponse.err
          ? <Button type="button" className="ok-btn" onClick={openModalWindow}>Ok</Button>
          : (
            <Button type="button" className="confirm-btn" onClick={() => occupySpace()}>
              {occupyResponse && occupyResponse.loading && (
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

OccupySpaceModalWindow.propTypes = {
  modalWindowOpen: PropTypes.bool.isRequired,
  openModalWindow: PropTypes.func.isRequired,
  bookingData: PropTypes.shape({
    id: PropTypes.number,
    planned_in: PropTypes.string,
    planned_out: PropTypes.string,
    shift: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    space: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
    company: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default OccupySpaceModalWindow;
