/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
import DateRangePicker from 'react-daterange-picker';
import moment from 'moment';
import 'react-daterange-picker/dist/css/react-calendar.css';
import { extendMoment } from 'moment-range';
import momentZone from 'moment-timezone';
import {getCalendarDate, getMomentRange} from '../../util/appUtils'
import { convertUtcTimetoCompanyTimeZone, getCompanyTimeZoneDate } from '../../shared/dateTimeConvertor';
import './calendar.scss';
import '../booking.scss';

const momentRange = extendMoment(moment);

const BookingCalendar = ({
  bookingItem, bookingData, onDateUpdate, workStationType, forExcludeuser, date, changeDate,
}) => {
  const {
    calendarDate,
  } = useSelector((state) => state.bookingInfo);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const minimumDate = momentZone(new Date()).tz(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone)._i;
  const companyTimeZone=userInfo &&userInfo.data && userInfo.data.company && userInfo.data.company.timezone
  let todayCalendarDate;
  todayCalendarDate = momentZone(new Date()).tz(companyTimeZone).format('YYYY-MM-DD HH:mm:ss');
  todayCalendarDate = todayCalendarDate.split(' ');
  todayCalendarDate = todayCalendarDate && todayCalendarDate[0];

  // const { userRoles } = useSelector((state) => state.config);
  const multiDaysLimit = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.multi_day_booking_limit;
  const onChange = (newDate) => {
    const startDate = newDate.start;
    let endDate = newDate.end;
    const differenceOfDays = endDate.diff(startDate, 'days');
    if (!forExcludeuser && workStationType.multi_day_booking_limit && differenceOfDays >= workStationType.multi_day_booking_limit) {
      const validateDays = differenceOfDays - workStationType.multi_day_booking_limit;
      endDate = endDate.subtract(validateDays, 'days');
      endDate = endDate.subtract(1, 'days');
      const updatedDates = [startDate, endDate];
      newDate.end = endDate;
      changeDate(newDate);
      onDateUpdate(updatedDates);
    } else if (!forExcludeuser && workStationType.multi_day_booking_limit === 0 && differenceOfDays >= multiDaysLimit) {
      const validateDays = differenceOfDays - multiDaysLimit;
      endDate = endDate.subtract(validateDays, 'days');
      endDate = endDate.subtract(1, 'days');
      const updatedDates = [startDate, endDate];
      newDate.end = endDate;
      changeDate(newDate);
      onDateUpdate(updatedDates);
    } else {
      changeDate(newDate);
      const updatedDates = [startDate, endDate];
      onDateUpdate(updatedDates);
    }
  };

  useEffect(() => {
    if (bookingItem && bookingItem.date) {
      changeDate(momentRange.range(moment(bookingItem.date)._d, moment(bookingItem.date)._d));
    } else {
      changeDate(momentRange.range(todayCalendarDate, todayCalendarDate));
    }
  }, []);

  useEffect(() => {
    if (bookingItem && bookingItem.planned_in) {
      const formattedDate =companyTimeZone&& convertUtcTimetoCompanyTimeZone(bookingItem.planned_in, '',companyTimeZone);
      const tDate = (new Date(formattedDate));
      changeDate(tDate);
      onDateUpdate(tDate);
    }
    if (bookingData && bookingData.date) {
      changeDate(calendarDate);
      onDateUpdate(bookingData.date);
    }
  }, [bookingItem, bookingData]);

  const stateDefinitions = {
    available: {
      color: null,
      label: 'Available',
    },
    todayDateBackground: {
      color: '#e1eff7',
      label: 'TodayDateBackground',
    },
  };
  const dateRanges = [
    {
      state: 'todayDateBackground',
      range: getMomentRange(todayCalendarDate, todayCalendarDate),
    }];

  return (
    <div className="mt-3">
      {forExcludeuser
        ? (
          <DateRangePicker
            firstOfWeek={1}
            onSelect={onChange}
            selectionType="range"
            singleDateRange
            stateDefinitions={stateDefinitions}
            defaultState="available"
            dateStates={dateRanges}
            numberOfCalendars={2}
            minimumDate={minimumDate}
            value={date}
          />
        ) : (
          <DateRangePicker
            firstOfWeek={1}
            onSelect={onChange}
            selectionType="range"
            singleDateRange
            stateDefinitions={stateDefinitions}
            defaultState="available"
            numberOfCalendars={2}
            minimumDate={minimumDate}
            dateStates={dateRanges}
            maximumDate={workStationType
              && workStationType.allowed_booking_in_advance
              ? getCalendarDate(getCompanyTimeZoneDate(), workStationType.allowed_booking_in_advance, 'days', 1, 'day')
              : getCalendarDate(getCompanyTimeZoneDate(), userRoles && userRoles.data && userRoles.data.booking
                && userRoles.data.booking.future_limit_days,  'days', 1, 'day')}
            value={date}
          />
        )}
    </div>
  );
};

BookingCalendar.propTypes = {
  onDateUpdate: PropTypes.func,
  forExcludeuser: PropTypes.bool,
  bookingItem: PropTypes.shape({
    planned_in: PropTypes.string,
    id: PropTypes.number,
    date: PropTypes.instanceOf(Date),
  }),
  bookingData: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    date: PropTypes.array,
  }),
  workStationType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      allowed_booking_in_advance: PropTypes.number,
      multi_day_booking_limit: PropTypes.number,
    }),
  ]),
};

BookingCalendar.defaultProps = {
  forExcludeuser: undefined,
  bookingItem: {},
  bookingData: {},
  onDateUpdate: () => { },
  workStationType: undefined,
};

export default BookingCalendar;
