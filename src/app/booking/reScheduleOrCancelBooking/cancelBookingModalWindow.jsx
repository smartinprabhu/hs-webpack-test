/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal, ModalBody, ModalFooter, Container, Spinner, Row, Col,
} from 'reactstrap';
import Button from '@mui/material/Button';
import moment from 'moment-timezone';

import calendarIcon from '@images/calendar.ico';
import bookingIcon from '@images/myBookingsBlue.ico';
import workstation from '@images/workstationBlue.ico';
import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import DisplayTimezone from '@shared/timezoneDisplay';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import TimeZoneDateConvertor from '@shared/dateTimeConvertor';
import { apiURL } from '../../util/appUtils';
import { deleteBooking } from '../../adminMaintenance/adminMaintenanceService';

const appConfig = require('@app/config/appConfig').default;

const CancelBookingModalWindow = (
  {
    modalWindowOpen, openModalWindow, bookingItem, reschedule, openBookModalWindow, category,
  },
) => {
  const dispatch = useDispatch();
  const [status, cancelStatus] = useState(false);
  const { bookingDelete } = useSelector((state) => state.bookingWorkorder);
  const { userInfo } = useSelector((state) => state.user);
  const { deleteInfo } = useSelector((state) => state.bookingInfo);
  const [GuestMessage, showGuestMessage] = useState(false);
  const companyTimeZone=userInfo &&userInfo.data &&userInfo.data.company&&userInfo.data.company.timezone

  const deleteBookingItem = () => {
    dispatch(deleteBooking(bookingItem.id));
    cancelStatus(true);
  };

  useEffect(() => {
    if (bookingItem && bookingItem.visitor && bookingItem.visitor.is_guest) {
      showGuestMessage(true);
    } else {
      showGuestMessage(false);
    }
  }, [bookingItem]);

  const openBookingWindow = (rescheduleType) => {
    if (reschedule) {
      bookingItem.rescheduleType = rescheduleType;
      openBookModalWindow(bookingItem);
    }
  };

  return (
    <Modal isOpen={modalWindowOpen} toggle={openModalWindow} className="cancel-booking">
      <ModalBody>
        <CancelButtonGrey openCloseModalWindow={openModalWindow} />
        <Container>
          <h2>Summary of Booking</h2>
          <h4 className="light-text">
            Here is a summary of your booking.
            {' '}
            (
            <DisplayTimezone />
            )
          </h4>
          <Row sm="12" md="12" lg="12" xs="12" className="m-0 py-4">
            <Col sm="4" md="4" lg="4" xs="12" className={`text-center ${reschedule ? 'cursor-pointer' : ''}`} onClick={() => openBookingWindow('date')}>
              <img src={calendarIcon} alt="calender" className="mt-0.5" />
              <div className="p-2 text-center mt-n5rem ml-1">
                {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('D') === moment.utc(bookingItem.planned_out).tz(userInfo.data.company.timezone).format('D')
                  ? (
                    <>
                      <strong className="text-uppercase font-weight-700">
                        {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('ddd')}
                      </strong>
                      <h2>
                        {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('D')}
                      </h2>
                    </>
                  ) : (
                    <>
                      <strong className="text-uppercase font-weight-700">
                        {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('ddd')}
                        {' '}
                        -
                        {' '}
                        {moment.utc(bookingItem.planned_out).tz(userInfo.data.company.timezone).format('ddd')}
                      </strong>
                      <h2>
                        {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('D')}
                        {' '}
                        -
                        {' '}
                        {moment.utc(bookingItem.planned_out).tz(userInfo.data.company.timezone).format('D')}
                      </h2>
                    </>
                  )}
              </div>
              {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('MMM') === moment.utc(bookingItem.planned_out).tz(userInfo.data.company.timezone).format('MMM')
                ? (
                  <div className="font-weight-300 font-smaller">
                    <span className="text-uppercase">
                      {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('MMM')}
                    </span>
                    <span className="ml-2">
                      {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('YYYY')}
                    </span>
                  </div>
                )
                : (
                  <div className="font-weight-300 font-smaller">
                    <span className="text-uppercase">
                      {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('MMM')}
                      {' '}
                      -
                      {' '}
                      {moment.utc(bookingItem.planned_out).tz(userInfo.data.company.timezone).format('MMM')}
                    </span>
                    <span className="ml-2">
                      {moment.utc(bookingItem.planned_in).tz(userInfo.data.company.timezone).format('YYYY')}
                    </span>
                  </div>
                )}
            </Col>
            <Col sm="4" md="4" lg="4" xs="12" className={`pl-0 ${reschedule ? 'cursor-pointer' : ''}`} onClick={() => openBookingWindow('site')}>
              <div className="bg-ghost-white text-center mt-3 pb-1">
                <img src={bookingIcon} width="30" height="30" alt="shifts" />
                <h4 className="font-weight-700">
                  SHIFT
                  {' '}
                  {bookingItem.shift.name}
                </h4>
                <span className="font-weight-500">
                  <TimeZoneDateConvertor date={bookingItem.planned_in} format="LT" />
                  {' '}
                  -
                  {' '}
                  <TimeZoneDateConvertor date={bookingItem.planned_out} format="LT" />
                </span>
              </div>
            </Col>
            <Col sm="4" md="4" lg="4" xs="12" className={`${reschedule ? 'cursor-pointer' : ''}`} onClick={() => openBookingWindow('category')}>
              <div className="bg-ghost-white text-center mt-3 pb-1">
                {category && category.file_path ? (
                  <img src={`${apiURL}${category.file_path}`} width="30" height="30" alt="workstation" />
                ) : (<img src={workstation} width="30" height="30" alt="workstation" />)}
                <h4 className="font-weight-700 mt-1 mb-1">{bookingItem.space && bookingItem.space.category_id && bookingItem.space.category_id.name}</h4>
                <small className="font-weight-500">
                  {bookingItem.space.space_name}
                </small>
              </div>
            </Col>
          </Row>
          {GuestMessage && (
            <div className="text-center">
              Are you sure you want to cancel this Guest booking?
            </div>
          )}
          {!GuestMessage && bookingItem && bookingItem.is_host && bookingItem.space && bookingItem.space.max_occupancy > 0 && bookingItem.members && bookingItem.members.length > 0 && (
            <div className="text-center">
              Note:
              {' '}
              Booking for
              {' '}
              {' '}
              <span className="font-weight-800">
                {bookingItem.space.space_name}
              </span>
              {' '}
              will be cancelled for other participants also
            </div>
          )}
          {bookingDelete && bookingDelete.data && deleteInfo && deleteInfo.data && (
            <SuccessAndErrorFormat response={bookingDelete} successMessage="Booking deleted successfully." />
          )}
          {bookingDelete && bookingDelete.err && bookingDelete.err.error
            && bookingDelete.err.error.message && (
              <SuccessAndErrorFormat response={bookingDelete} />
          )}
        </Container>
      </ModalBody>
      {
        !reschedule && (
          <ModalFooter>
            {(status && bookingDelete && bookingDelete.data) || bookingDelete.err
              ? <Button type="button"  variant="contained" onClick={openModalWindow}>Ok</Button>
              : (
                <Button type="button"  variant="contained" onClick={() => deleteBookingItem()}>
                  {bookingDelete && bookingDelete.loading && (
                    <Spinner size="sm" color="light" />
                  )}
                  <span className="ml-2" />
                  Cancel a Booking
                </Button>
              )}
          </ModalFooter>
        )
      }
    </Modal>
  );
};

CancelBookingModalWindow.propTypes = {
  modalWindowOpen: PropTypes.bool.isRequired,
  openModalWindow: PropTypes.func.isRequired,
  bookingItem: PropTypes.shape({
    id: PropTypes.number,
    access_status: PropTypes.bool,
    rescheduleType: PropTypes.string,
    company: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    members: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    visitor: PropTypes.shape({
      is_guest: PropTypes.bool,
    }),
    planned_in: PropTypes.string,
    planned_out: PropTypes.string,
    space: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      space_name: PropTypes.string,
      max_occupancy: PropTypes.number,
      category_id: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
    shift: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    is_host: PropTypes.bool,
  }).isRequired,
  reschedule: PropTypes.bool.isRequired,
  openBookModalWindow: PropTypes.func.isRequired,
  category: PropTypes.shape({
    file_path: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

CancelBookingModalWindow.defaultProps = {
  category: undefined,
};

export default CancelBookingModalWindow;
