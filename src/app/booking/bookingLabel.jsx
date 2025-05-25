import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import booked from '@images/booked.png';
import prescreen from '@images/prescreen.png';
import occupy from '@images/occupy.png';
import release from '@images/release.png';
import access from '@images/access.png';
import released from '@images/released.png';
import unavailable from '@images/unavailable.png';

import TimeZoneDateConvertor, { convertUtcTimetoCompanyTimeZone, getCurrentTimeZoneTime } from '@shared/dateTimeConvertor';
import DisplayTimezone from '@shared/timezoneDisplay';
import { StringsMeta } from '../util/appUtils';
import getBookingAction from '../util/getBookingAction';

const BookingLabel = ({ bookingItem }) => {
  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.config);
  const isBookingAction = (bookingData) => {
    if (userInfo &&userInfo.data && userInfo.data.company) {
      return getBookingAction(bookingData, userRoles.data, userInfo.data.company.timezone);
    } return undefined;
  };

  return (
    <div>
      {userInfo &&userInfo.data && userInfo.data.company&&isBookingAction(bookingItem) && (isBookingAction(bookingItem)[0] === StringsMeta.OCCUPY || isBookingAction(bookingItem)[1] === StringsMeta.OCCUPY) && (
        <span className="label label-info label-outlined">
          <img src={occupy} alt="occupy" className="mr-1" />
          <span className="mt-1">
            Ready to occupy
            {convertUtcTimetoCompanyTimeZone(bookingItem.planned_in_before, 'D MMM YYYY HH:mm:ss', userInfo.data.company.timezone) > getCurrentTimeZoneTime('D MMM YYYY HH:mm:ss', userInfo.data.company.timezone) && (
              <>
                {' '}
                from
                {' '}
                <TimeZoneDateConvertor date={bookingItem.planned_in_before} format="D MMM LT" />
                {' '}
                <DisplayTimezone />
              </>
            )}
          </span>
        </span>
      )}
      {isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 2 && isBookingAction(bookingItem)[0] === StringsMeta.CANCEL && bookingItem.space.status === StringsMeta.MAINTAINANCE_IN_PROGRESS && (
        <span className="label label-danger label-outlined">
          <img src={unavailable} height="13" width="13" alt="cancel" className="mr-1" />
          Space is under maintenance
        </span>
      )}
      {isBookingAction(bookingItem) && (isBookingAction(bookingItem)[0] === StringsMeta.PRE_SCREEN || isBookingAction(bookingItem)[1] === StringsMeta.PRE_SCREEN) && (
        <span className="label label-primary label-outlined">
          <img src={prescreen} height="13" width="13" alt="prescreen" className="mr-1" />
          Awaiting Pre-screen
        </span>
      )}
      {isBookingAction(bookingItem) && (isBookingAction(bookingItem)[0] === StringsMeta.ACCESS || isBookingAction(bookingItem)[1] === StringsMeta.ACCESS) && (
        <span className="label label-secondary label-outlined">
          <img src={access} height="13" width="13" alt="access" className="mr-1" />
          Ready to access the building
        </span>
      )}
      {isBookingAction(bookingItem) && (isBookingAction(bookingItem)[0] === StringsMeta.RELEASE || isBookingAction(bookingItem)[1] === StringsMeta.RELEASE) && (
        <span className="label label-warning label-outlined">
          <img src={release} height="13" width="13" alt="release" className="mr-1" />
          Space is occupied
        </span>
      )}
      {isBookingAction(bookingItem) && (isBookingAction(bookingItem)[0] === StringsMeta.RELEASED || isBookingAction(bookingItem)[1] === StringsMeta.RELEASED) && (
        <span className="label label-default label-outlined">
          <img src={released} height="13" width="13" alt="released" className="mr-1" />
          Space is released
        </span>
      )}
      {isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 2 && isBookingAction(bookingItem)[0] === StringsMeta.CANCEL
      && isBookingAction(bookingItem)[1] === undefined && bookingItem.space.status !== StringsMeta.MAINTAINANCE_IN_PROGRESS && (
        <span className="label label-success label-outlined">
          <img src={booked} height="13" width="13" alt="cancel" className="mr-1" />
          Space is booked
        </span>
      )}
    </div>
  );
};

BookingLabel.propTypes = {
  bookingItem: PropTypes.shape({
    space: PropTypes.shape({
      status: PropTypes.string,
    }),
    planned_in: PropTypes.string,
    planned_in_before: PropTypes.string,
    duration: PropTypes.number,
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    planned_out: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default BookingLabel;
