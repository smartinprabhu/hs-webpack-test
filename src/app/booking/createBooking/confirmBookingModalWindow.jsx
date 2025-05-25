import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Row, Col, ModalFooter, ModalBody, Button, Spinner,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import bookingComplete from '@images/completedBookingBlue.ico';
import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import ConfirmBookingModalScreen from './confirmBookingModalScreen';

const ConfirmBookingModalWindow = ({
  bookingData, selectWorkStation, saveBooking, openmodalPreview, openPreview, selectedEmployees, treeViewBookingType,
}) => {
  let succeededBooking;
  let confirmWindow;
  let bookingFooter;
  const { multidaysBookingInfo, errorMessage } = useSelector((state) => state.bookingInfo);
  const [updateErrorMessage, setUpdateErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { saveBookingLayoutViews } = useSelector((state) => state.myBookings);

  useEffect(() => {
    if (!errorMessage) {
      setShowErrorMessage(false);
    } else {
      setUpdateErrorMessage(errorMessage);
      setShowErrorMessage(true);
    }
  }, [errorMessage]);

  if (multidaysBookingInfo && multidaysBookingInfo.data) {
    succeededBooking = (
      <Row className="m-0">
        <Col sm="1" xs="2" md="1" lg="1">
          <img src={bookingComplete} width="50" height="50" alt="bookingComplete" />
        </Col>
        <Col sm="10" xs="9" md="10" lg="10" className="ml-2">
          <h2>
            Congratulations!
          </h2>
          <h2>
            Your Booking has been confirmed.
          </h2>
          <div className="light-text">
            Here is a summary of your booking.
          </div>
        </Col>
      </Row>
    );
    bookingFooter = (
      <ModalFooter>
        <Link to={saveBookingLayoutViews ? "/mybookings" : "/"}>
          <Button className="ok-btn">OK</Button>
        </Link>
      </ModalFooter>
    );
  } else {
    confirmWindow = (
      <Row className="m-0">
        <Col sm="12">
          <h2 className="confirm-bookng font-weight-700">Confirm Booking</h2>
        </Col>
      </Row>
    );
    if (multidaysBookingInfo && multidaysBookingInfo.err && multidaysBookingInfo.err.error && multidaysBookingInfo.err.error.message) {
      bookingFooter = (
        <ModalFooter>
          <Button className="ok-btn" onClick={openPreview}>Ok</Button>
        </ModalFooter>
      );
    } else {
      bookingFooter = (
        <ModalFooter>
          <Button className="confirm-btn" onClick={() => { setShowErrorMessage(false); saveBooking(); }}>
            {multidaysBookingInfo && multidaysBookingInfo.loading && (
              <>
                <Spinner size="sm" color="light" data-testid="spinner" />
                <span className="ml-2" />
              </>
            )}
            Confirm
          </Button>
        </ModalFooter>
      );
    }
  }

  return (
    <Modal className="confirm-booking-modal" size="lg" backdrop="static" isOpen={openmodalPreview} toggle={openPreview}>
      <ModalBody>
        {multidaysBookingInfo && !multidaysBookingInfo.data && (
          <CancelButtonGrey openCloseModalWindow={openPreview} />
        )}
        {confirmWindow}
        {succeededBooking}
        <ConfirmBookingModalScreen
          saveBooking={saveBooking}
          bookingData={bookingData}
          selectWorkStation={selectWorkStation}
          openPreview={openPreview}
          selectedEmployees={selectedEmployees}
          treeViewBookingType={treeViewBookingType}
        />
      </ModalBody>
      {showErrorMessage && (
      <h5 className="text-center">
        {updateErrorMessage}
      </h5>
      )}
      {multidaysBookingInfo && multidaysBookingInfo.err && multidaysBookingInfo.err.error && (
        <div className="mb-2">
          <SuccessAndErrorFormat response={multidaysBookingInfo} />
        </div>
      )}
      {bookingFooter}
    </Modal>
  );
};

ConfirmBookingModalWindow.propTypes = {
  bookingData: PropTypes.shape({
    site: PropTypes.shape({
      planned_in: PropTypes.string,
      duration: PropTypes.number,
      id: PropTypes.number,
      planned_out: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    date: PropTypes.array,
  }).isRequired,
  treeViewBookingType: PropTypes.string.isRequired,
  selectWorkStation:
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        space_name: PropTypes.string,
        path_name: PropTypes.string,
        employee: PropTypes.oneOfType([
          PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
            }),
          ),
          PropTypes.shape({
            name: PropTypes.string,
          }),
        ]),
      }),
    ),
  saveBooking: PropTypes.func.isRequired,
  openmodalPreview: PropTypes.bool.isRequired,
  openPreview: PropTypes.func.isRequired,
  selectedEmployees: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ]),
};

ConfirmBookingModalWindow.defaultProps = {
  selectWorkStation: undefined,
  selectedEmployees: undefined,
};

export default ConfirmBookingModalWindow;
