/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody,
  Row, Col, Button,
} from 'reactstrap';
import { find, filter, uniqBy } from 'lodash';
import { faChevronCircleRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import '../booking.scss';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import shiftIcon from '@images/shifts.svg';
import customTimeIcon from '@images/customTime.svg';
import includes from 'lodash/includes';
import selectedCalendarImage from '@images/calendar.ico';
import { getCurrentTimeZoneTime } from '@shared/dateTimeConvertor';
import { getMultidaysShiftData } from '../bookingService';
import {
  getCompanyTimeZoneDate, getUtcTimefromZone,
} from '../../shared/dateTimeConvertor';
import Loading from '../../shared/loading';
import './shifts.scss';
import DisplayTimezone from '../../shared/timezoneDisplay';
import { getMomentDiff, getMomentFormat, getHoursMins, getMomentAdd, getMomentSub, getHourMinSec, getCurrentCompanyTime } from '../../util/appUtils';

const CustomCheckbox = withStyles({
  root: {
    color: '#00001d',
    '&$checked': {
      color: '#3a4354',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Checkbox color="default" size="small" {...props} />);

const BookingShifts = ({
  calendarDate, onSiteUpdate, bookingItem, setWorkStationTypeForShift, bookingData, siteData, setShiftType, workStationType,
}) => {
  const currentDay = getCompanyTimeZoneDate();
  const dispatch = useDispatch();
  const { multidaysShiftsInfo } = useSelector((state) => state.bookingInfo);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone
  // const { userRoles } = useSelector((state) => state.config);
  const disablePartialBooking = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.disable_partial_booking;
  const partialBookingSpace = userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.disabled_space_categories;
  const validateShift = getMomentDiff(currentDay, calendarDate[0], 'days');
  let shiftDate;
  if (validateShift <= 0) shiftDate = getUtcTimefromZone(calendarDate[0] ? calendarDate[0] : calendarDate, 'YYYY-MM-DD HH:mm', companyTimeZone);
  const [shiftIndex, shiftCheck] = useState(-1);
  const [selectType, setSelectType] = useState('');
  const [customEvents, setCustomEvents] = useState([]);
  const [bookingTime, setBookingTime] = useState(false);
  const [customShift, setCustomShift] = useState(false);
  const [fullDayDisabled, setFullDayDisabled] = useState(false);
  const [shiftError, setShiftError] = useState(false);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [endedShifts, setEndedShifts] = useState([]);
  const [slotMaxTime, setSlotMaxTime] = useState(false);
  const [slotMinTime, setSlotMinTime] = useState(false);
  const selectedDateInitial = getMomentFormat(calendarDate[0], 'YYYY-MM-DD');
  const selectedDate = getMomentFormat(calendarDate[0], 'D-MMM-YYYY');
  const currentTime = getCurrentTimeZoneTime('D-MMM-YYYY HH:mm:ss', companyTimeZone);
  const currentDate = getCurrentTimeZoneTime('D-MMM-YYYY', companyTimeZone);
  // const timeNow = new Date().toLocaleString();
  // const userTime = moment(timeNow).format('hh:mm A');

  const [error, setError] = useState(false);
  const [filteredShift, setFilteredShift] = useState([]);
  const nowTime = getCurrentCompanyTime(userInfo.data && userInfo.data.company.timezone, 'YYYY-MM-DD HH:mm:ss');

  const [fullCheckOnReset, setFullCheckOnReset] = useState(true)
  const [shiftGInfo, setShiftGInfo] = useState({})

  useEffect(() => {
    setShiftGInfo(availableShifts.filter((as) => as.name === 'G'))
  }, [availableShifts])

  useEffect(() => {
    if (customShift && customShift.planned_in && customShift.planned_out) {
      const plannedIn = `${getMomentFormat(calendarDate[0], 'YYYY-MM-DD')} ${customShift.planned_in}`;
      const startTime = getMomentFormat(plannedIn, 'YYYY-MM-DD HH:mm:ss');
      const pastEvents = [];
      if (getMomentFormat(startTime, 'YYYY-MM-DD') === getMomentFormat(nowTime, 'YYYY-MM-DD') && nowTime > startTime) {
        pastEvents.push(
          {
            id: 'pastTime',
            start: startTime,
            end: nowTime,
            backgroundColor: 'grey',
            display: 'background',
            event: `${getMomentFormat(startTime, 'YYYYMMDD')}`,
            droppable: false,
            editable: false,
          },
        );
        // eslint-disable-next-line max-len
        setError(`The time from ${getHoursMins(startTime, 'hh:mm A')} to ${getHoursMins(nowTime, 'hh:mm A')} is elapsed for Today (${getMomentFormat(startTime, 'DD MMM yyyy')}). If you want to book that time for other days, please try to unselect Today (${getMomentFormat(startTime, 'DD MMM yyyy')}).`);
      }
      setCustomEvents((prevState) => uniqBy([...prevState, pastEvents].flat(), 'id'));
    }
  }, [customShift, selectType]);
  useEffect(() => {
    if (workStationType && workStationType.shifts_custom_times) {
      if (workStationType.shifts_custom_times === 'only_shifts' || workStationType.shifts_custom_times === 'both_shifts_custom_time') {
        setSelectType('shift');
      }
    }else{
      setWorkStationTypeForShift({...workStationType, shifts_custom_times:'both_shifts_custom_time'});
    }
    if (filteredShift && filteredShift.length && userRoles && userRoles.data && userRoles.data.booking) {
      const lastDate = getMomentFormat(calendarDate[1], 'D-MMM-YYYY');
      if ((selectedDate === currentDate) && (selectedDate === lastDate)) {
        if (filteredShift && filteredShift.length) {
          setEndedShifts([]);
          setAvailableShifts(
            filteredShift.map((multidayShift) => {
              const shiftEnd = multidayShift.planned_out;
              let today;
              today = `${selectedDate} ${shiftEnd}`;
              if (shiftEnd < multidayShift.planned_in) {
                const nightShiftDate = getMomentAdd(selectedDate, 1, 'days', 'D-MMM-YYYY');
                today = `${nightShiftDate} ${shiftEnd}`;
              }
              const timeDifferences = getMomentDiff(today, currentTime, 'minutes');
              const minBookingTime = userRoles.data.booking.minimum_duration_mins;
              if (timeDifferences > minBookingTime) {
                return multidayShift;
              }
              return null;
            }).filter((item) => item),
          );
        }
      } else {
        if (filteredShift && filteredShift.length) {
          setEndedShifts(
            filteredShift.map((multidayShift) => {
              const shiftEndEndedShift = multidayShift.planned_out;
              let todayDateTime;
              todayDateTime = `${selectedDate} ${shiftEndEndedShift}`;
              if (shiftEndEndedShift < multidayShift.planned_in) {
                const nightShiftDate = getMomentAdd(selectedDate, 1, 'days', 'D-MMM-YYYY');
                todayDateTime = `${nightShiftDate} ${shiftEndEndedShift}`;
              }
              const timeDifferences = getMomentDiff(todayDateTime, currentTime, 'minutes');
              const minBookingTime = userRoles.data.booking.minimum_duration_mins;
              if (timeDifferences < minBookingTime) {
                return multidayShift;
              }
              return null;
            }).filter((item) => item),
          );
        }
        setAvailableShifts([]);
        if (filteredShift && filteredShift.length) {
          setAvailableShifts([...filteredShift]);
        }
      }
    }
  }, [calendarDate, filteredShift]);
  const checkSpaceCategory = () => {
    if (partialBookingSpace && partialBookingSpace.length !== 0) {
      return partialBookingSpace.map((item) => item).includes(workStationType && workStationType.name);
    }
    return false;
  };

  useEffect(() => {
      if (multidaysShiftsInfo && multidaysShiftsInfo.data && userRoles && userRoles.data && userRoles.data.booking) {
        if (multidaysShiftsInfo && multidaysShiftsInfo.data && Array.isArray(multidaysShiftsInfo.data)) {
          setFilteredShift(
            multidaysShiftsInfo.data.map((multidayShift) => {
              const shiftStart = multidayShift.planned_in;
              const shiftEnd = multidayShift.planned_out;
              // eslint-disable-next-line no-shadow
              let endTime = `${selectedDateInitial} ${shiftEnd}`;
              const startTime = `${selectedDateInitial} ${shiftStart}`;
              if (currentTime > shiftEnd) {
                endTime = getMomentAdd(selectedDateInitial, 1, 'days', 'D-MMM-YYYY');
                endTime = `${endTime} ${shiftEnd}`;
              }
              const timeDifferences = getMomentDiff(endTime, startTime, 'minutes');
              const minBookingTime = userRoles.data.booking.minimum_duration_mins;
              if (multidayShift.display === true && timeDifferences >= minBookingTime) {
                return multidayShift;
              }
              else if(multidayShift.display === undefined && timeDifferences >= minBookingTime){
                return multidayShift;
              }
              return null;
            }).filter((item) => item),
          );
        }
      }
  }, [calendarDate, multidaysShiftsInfo]);

  const checkShift = (index) => {
    shiftCheck(index);
    onSiteUpdate(availableShifts[index]);
  };

  const passedShifts = (loopedShifts, passedshifts) => {
    if (passedshifts.length === 0) {
      return false;
    }
    return passedshifts.map((item) => item.id).includes(loopedShifts.id);
  };

  useEffect(() => {
    if (siteData && siteData.siteInfo && siteData.siteInfo.planned_in) {
      onSiteUpdate('');
      shiftCheck(-1);
      setCustomEvents(filter(customEvents, (events) => events.id === 'pastTime'));
      setBookingTime(false);
    }
  }, [selectType, calendarDate]);

  useEffect(() => {
    setCustomEvents([]);
    setError('');
  }, [calendarDate]);

  useEffect(() => {
    if (selectType) {
      setShiftType(selectType);
    }
  }, [selectType]);

  useEffect(() => {
    if (bookingData && bookingData.shiftType) {
      setSelectType(bookingData.shiftType);
    }
  }, [bookingData]);

  useEffect(() => {
    if (customShift) {

      let minSlotTime = customShift.planned_in.split(' ').length > 1 ? customShift.planned_in.split(' ')[1] : customShift.planned_in.split(' ')[0]
      let maxSlotTime = customShift.planned_out.split(' ').length > 1 ? customShift.planned_out.split(' ')[1] : customShift.planned_out.split(' ')[0]

      const selectedDate = moment(calendarDate[0]).format('D-MMM-YYYY');

      if (maxSlotTime.split(':')[0] < minSlotTime.split(':')[0]) {
        maxSlotTime = `${parseInt(maxSlotTime.split(':')[0]) + 24}:00:00`
      }

      setSlotMinTime(minSlotTime);
      setSlotMaxTime(maxSlotTime);
    }
  }, [customShift]);

  // useEffect(() => {
  //   if (availableShifts && availableShifts.length === 1) {
  //     checkShift(0);
  //   } else {
  //     shiftCheck(-1);
  //   }
  // }, [calendarDate]);
  useEffect(() => {
    if (selectType === 'custom' && customEvents && (customEvents.length === 0 || (customEvents.length > 0 && customEvents[0].id === 'pastTime'))) {
      onSiteUpdate('');
      shiftCheck(-1);
      setBookingTime(false);
    }
  }, [customEvents, selectType, calendarDate]);

  useEffect(() => {
    if (availableShifts && availableShifts.length) {
      setFullDayDisabled(false);
      const shiftInfo = availableShifts.find((shift) => shift.name === 'G');
      setCustomShift(shiftInfo);
    }
    if (endedShifts && endedShifts.length) {
      const shiftInfo = endedShifts.find((shift) => shift.name === 'G');
      setFullDayDisabled(shiftInfo);
    }
  }, [availableShifts, endedShifts]);

  useEffect(() => {
    if (availableShifts && availableShifts.length) {
      const shiftInfo = availableShifts.find((shift) => shift.name === 'G');
      setCustomShift(shiftInfo);
    }
  })

  const isSelected = (shift, index) => {
    if (shiftIndex < 0 && bookingItem && bookingItem.shift) {
      if (shift.name === bookingItem.shift.name) {
        return true;
      }
    } else if (shiftIndex < 0 && bookingData && bookingData.site) {
      if (shift.name === bookingData.site.name) {
        return false;
      }
    } else if (shiftIndex === index) return true;
    return undefined;
  };

  useEffect(() => {
    if (selectType && selectType === 'shift') {
      if (shiftIndex < 0 && multidaysShiftsInfo.data && bookingItem && bookingItem.shift) {
        multidaysShiftsInfo.data.forEach((shift, index) => {
          if (bookingItem.shift.name === shift.name) {
            checkShift(index);
          }
        });
      }
      if (shiftIndex < 0 && availableShifts && availableShifts.length === 1 && endedShifts && endedShifts.length === 1) {
        checkShift(-1);
      }
      if (shiftIndex < 0 && availableShifts && availableShifts.length === 1 && endedShifts && endedShifts.length === 0) {
        checkShift(0);
      }
    }
  }, [multidaysShiftsInfo, availableShifts, selectType]);

  useEffect(() => {
    if (shiftDate) {
      shiftDate += ':00';
      shiftCheck(-1);
      dispatch(getMultidaysShiftData(shiftDate));
    }
  }, [shiftDate, calendarDate]);

  let shiftsDataLoading;
  if (multidaysShiftsInfo && multidaysShiftsInfo.loading) {
    shiftsDataLoading = (
      <div className="text-center p-5" data-testid="loader">
        <Loading />
      </div>
    );
  }
  useEffect(() => {
    if (bookingTime) {
      onSiteUpdate(bookingTime);
    }
  }, [bookingTime]);
  useEffect(() => {
    if (customEvents && customEvents.length && customEvents[0].id !== 'pastTime') {
      setShiftError('');
    }
  }, [customEvents, shiftError]);

  const getShiftTime = (shiftTime) => getHoursMins(shiftTime);

  useEffect(() => {
    if (workStationType.default_full_shift_selection&&selectType === 'custom' ) {
      setShiftError('');
      let fullShiftStartTime = `${moment(calendarDate[0]).format('YYYY-MM-DD')} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_in}`;
      let fullShiftEndTime = `${moment(calendarDate[0]).format('YYYY-MM-DD')} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_out}`;

      if (moment(fullShiftStartTime) > moment(fullShiftEndTime)) {
        fullShiftEndTime = moment(fullShiftEndTime).add(1, 'days').format('YYYY-MM-DD');
        fullShiftEndTime = `${fullShiftEndTime} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_out}`;
      }

      let reservedEndTime = fullShiftEndTime;
      if (userRoles.data.booking.buffer_period_mins) {
        reservedEndTime = moment(fullShiftEndTime).subtract(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      }
      const calEvent = {
        id: 'reserved',
        title: `Reserve from ${moment(fullShiftStartTime).format('hh:mm A')} -  ${moment(reservedEndTime).format('hh:mm A')}`,
        start: fullShiftStartTime,
        end: reservedEndTime,
        backgroundColor: '#616976',
        event: `${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        checked: `${moment(fullShiftStartTime).format('YYYY-MM-DD')}`,
        droppable: false,
        editable: false,
        isFullShift: true,
      };
      const reserveBuffer = {
        id: 'reservedBuffer',
        title: `Buffer ${moment(reservedEndTime).format('hh:mm A')} - ${moment(fullShiftEndTime).format('hh:mm A')}`,
        start: reservedEndTime,
        end: fullShiftEndTime,
        backgroundColor: '#d9dde0',
        eventName: `${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        textColor: '#374152',
        droppable: false,
        editable: false,
      };
      let customTimeObject = customShift;
      if (customTimeObject) {
        customTimeObject.customShift = true;
      }
      const checkForPastTime = find(customEvents, { event: calEvent.event, id: 'pastTime' });
      if (checkForPastTime) {
        calEvent.start = checkForPastTime.end;
        calEvent.title = `Reserve from ${moment(checkForPastTime.end).format('hh:mm A')} -${moment(reservedEndTime).format('hh:mm A')}`;
        customTimeObject = {
          planned_in: moment(nowTime).format('HH:mm:ss'),
          planned_out: customShift.planned_out,
          custom_planned_in: customShift.planned_in,
          custom_planned_out: customShift.planned_out,
          id: customShift.id,
          duration: customShift.duration,
          name: customShift.name,
          start_time: customShift.start_time,
          customShift: true,
          fullshift: true
        };
      }
      const eventsArray = [];
      eventsArray.push(calEvent);
      if (userRoles.data.booking.buffer_period_mins !== 0) {
        eventsArray.push(reserveBuffer);
      }
      if (checkForPastTime && (moment(new Date()).format('YYYY-MM-DD') === moment(calendarDate[0]).format('YYYY-MM-DD'))) {
        eventsArray.push(checkForPastTime);
      }
      setCustomEvents(eventsArray);
      setBookingTime(customTimeObject);
    }
  }, [selectType, calendarDate])


  useEffect(() => {
    if (workStationType.default_full_shift_selection) {
      setShiftError('');
      let fullShiftStartTime = `${moment(calendarDate[0]).format('YYYY-MM-DD')} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_in}`;
      let fullShiftEndTime = `${moment(calendarDate[0]).format('YYYY-MM-DD')} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_out}`;

      if (moment(fullShiftStartTime) > moment(fullShiftEndTime)) {
        fullShiftEndTime = moment(selectedDateInitial).add(1, 'days').format('YYYY-MM-DD');
        fullShiftEndTime = `${fullShiftEndTime} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_out}`;
      }

      let reservedEndTime = fullShiftEndTime;
      if (userRoles.data.booking.buffer_period_mins) {
        reservedEndTime = moment(fullShiftEndTime).subtract(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      }
      const calEvent = {
        id: 'reserved',
        title: `Reserve from ${moment(fullShiftStartTime).format('hh:mm A')} -  ${moment(reservedEndTime).format('hh:mm A')}`,
        start: fullShiftStartTime,
        end: reservedEndTime,
        backgroundColor: '#616976',
        event: `${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        checked: `${moment(fullShiftStartTime).format('YYYY-MM-DD')}`,
        droppable: false,
        editable: false,
        isFullShift: true,
      };
      const reserveBuffer = {
        id: 'reservedBuffer',
        title: `Buffer ${moment(reservedEndTime).format('hh:mm A')} - ${moment(fullShiftEndTime).format('hh:mm A')}`,
        start: reservedEndTime,
        end: fullShiftEndTime,
        backgroundColor: '#d9dde0',
        eventName: `${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        textColor: '#374152',
        droppable: false,
        editable: false,
      };
      let customTimeObject = customShift;
      if (customTimeObject) {
        customTimeObject.customShift = true;
      }
      const checkForPastTime = find(customEvents, { event: calEvent.event, id: 'pastTime' });
      if (checkForPastTime) {
        calEvent.start = checkForPastTime.end;
        calEvent.title = `Reserve from ${moment(checkForPastTime.end).format('hh:mm A')} -${moment(reservedEndTime).format('hh:mm A')}`;
        customTimeObject = {
          planned_in: moment(nowTime).format('HH:mm:ss'),
          planned_out: customShift.planned_out,
          custom_planned_in: customShift.planned_in,
          custom_planned_out: customShift.planned_out,
          id: customShift.id,
          duration: customShift.duration,
          name: customShift.name,
          start_time: customShift.start_time,
          customShift: true,
          fullshift: true
        };
      }
      const eventsArray = [];
      eventsArray.push(calEvent);
      if (userRoles.data.booking.buffer_period_mins !== 0) {
        eventsArray.push(reserveBuffer);
      }
      if (checkForPastTime && (moment(new Date()).format('YYYY-MM-DD') === moment(calendarDate[0]).format('YYYY-MM-DD'))) {
        eventsArray.push(checkForPastTime);
      }
      setCustomEvents(eventsArray);
      setBookingTime(customTimeObject);
    }
  }, [selectType, calendarDate])
  
  const makeFullshift = (event, args) => {
    setFullCheckOnReset(false)
    setShiftError('');  
    if (event.target.checked) {
      let fullShiftStartTime = `${moment(new Date()).format('YYYY-MM-DD')} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_in}`;
      let fullShiftEndTime = `${moment(new Date()).format('YYYY-MM-DD')} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_out}`;

      if (moment(fullShiftStartTime) > moment(fullShiftEndTime)) {
        fullShiftEndTime = moment(selectedDateInitial).add(1, 'days').format('YYYY-MM-DD');
        fullShiftEndTime = `${fullShiftEndTime} ${shiftGInfo && shiftGInfo[0] && shiftGInfo[0].planned_out}`;
      }

      let reservedEndTime = fullShiftEndTime;

      if (userRoles.data.booking.buffer_period_mins) {
        reservedEndTime = getMomentSub(fullShiftEndTime, userRoles.data.booking.buffer_period_mins, 'minutes', 'YYYY-MM-DD HH:mm:ss');
      }

      const calEvent = {
        id: 'reserved',
        title: `Reserve from ${getMomentFormat(fullShiftStartTime, 'hh:mm A')} -  ${getMomentFormat(reservedEndTime, 'hh:mm A')}`,
        start: fullShiftStartTime,
        end: reservedEndTime,
        backgroundColor: '#616976',
        event: `${getMomentFormat(fullShiftStartTime, 'YYYYMMDD')}`,
        checked: `${getMomentFormat(fullShiftStartTime, 'YYYY-MM-DD')}`,
        droppable: false,
        editable: false,
        isFullShift: true,
      };

      const reserveBuffer = {
        id: 'reservedBuffer',
        title: `Buffer ${getMomentFormat(reservedEndTime, 'hh:mm A')} - ${getMomentFormat(fullShiftEndTime, 'hh:mm A')}`,
        start: reservedEndTime,
        end: fullShiftEndTime,
        backgroundColor: '#d9dde0',
        eventName: `${getMomentFormat(fullShiftStartTime, 'YYYYMMDD')}`,
        textColor: '#374152',
        droppable: false,
        editable: false,
      };
      let customTimeObject = customShift;
      customTimeObject.customShift = true;

      const checkForPastTime = find(customEvents, { event: calEvent.event, id: 'pastTime' });
      if (checkForPastTime) {
        calEvent.start = checkForPastTime.end;
        calEvent.title = `Reserve from ${getMomentFormat(checkForPastTime.end, 'hh:mm A')} -${getMomentFormat(reservedEndTime, 'hh:mm A')}`;

        customTimeObject = {
          planned_in: getMomentFormat(nowTime, 'HH:mm:ss'),
          planned_out: customShift.planned_out,
          custom_planned_in: customShift.planned_in,
          custom_planned_out: customShift.planned_out,
          id: customShift.id,
          duration: customShift.duration,
          name: customShift.name,
          start_time: customShift.start_time,
          customShift: true,
          fullshift: true
        };
      }
      const eventsArray = [];
      eventsArray.push(calEvent);

      if (userRoles.data.booking.buffer_period_mins !== 0) {
        eventsArray.push(reserveBuffer);
      }

      if (checkForPastTime) {
        eventsArray.push(checkForPastTime);
      }
      setCustomEvents(eventsArray);

      setBookingTime(customTimeObject);
    } else {
      setCustomEvents(filter(customEvents, (events) => events.id === 'pastTime'));
      // setCustomEvents([]);
      setBookingTime(false);
    }
  };
  const displayHeader = (args) => (
    <>
      <div className="font-size-10px text-black">
        &nbsp;
        {getMomentFormat(calendarDate[0], 'dddd D MMMM YYYY')}
        {' '}
        -
        {' '}
        {getMomentFormat(calendarDate[1], 'dddd D MMMM YYYY')}
      </div>
      <div className="text-center">
        <CustomCheckbox
          className="mt-1 pt-1 PrivateSwitchBase-root-3"
          name="fullShift"
          checked={workStationType && workStationType.default_full_shift_selection && fullCheckOnReset ? true : customEvents.some((calendarEvnt) => calendarEvnt.isFullShift)}
          onClick={fullDayDisabled ? () => '' : (event) => { makeFullshift(event, args); }}
        />
        <span className="pt-1 font-size-10px text-black" style={{ marginLeft: '-8px' }}>Full Day</span>
        {customEvents && customEvents.length && customEvents[0].id !== 'pastTime' ? (
          <Button className="p-1 ml-2 font-size-10px text-black" onClick={() => {
            setCustomEvents(filter(customEvents, (events) => events.id === 'pastTime')); setBookingTime(false); setFullCheckOnReset(false);
          }}>Reset</Button>
        ) : ''}
      </div>
    </>
  );
  // eslint-disable-next-line consistent-return
  const setCustomTime = (data) => {
    setShiftError('');

    const timeDiffForStartAndEnd = getMomentDiff(data.end, data.start, 'minutes');
    const startDate = moment(data.start).format('YYYY-MM-DD')
    const endDate = moment(data.end).format('YYYY-MM-DD')

    const plannedIn = `${moment(data.start).format('YYYY-MM-DD')} ${customShift.planned_in}`;
    const plannedOut = `${moment(data.end).format('YYYY-MM-DD')} ${customShift.planned_out}`;


    const fullcalendar_planned_out = moment(data.end).format('YYYY-MM-DD HH:mm:ss');
    if (moment(fullcalendar_planned_out) > moment(plannedOut)) {
      data.end = moment(fullcalendar_planned_out)._d;
    }

    if (timeDiffForStartAndEnd < userRoles.data.booking.minimum_duration_mins) {
      setShiftError(`Booking duration should be atleast ${userRoles.data.booking.minimum_duration_mins} minutes.`);
      return false;
    }

    const reservedStartTime = data.start;
    let reservedEndTime = data.end;

    if (userRoles.data.booking.buffer_period_mins) {
      reservedEndTime = getMomentSub(data.end, userRoles.data.booking.buffer_period_mins, 'minutes', 'YYYY-MM-DD HH:mm:ss');
    }
    const bufferStartTime = reservedEndTime;
    const bufferEndTime = data.end;
    const calEvent = {
      id: 'reservedEvent',
      title: `Reserve from ${getMomentFormat(reservedStartTime, 'hh:mm A')} - ${getMomentFormat(reservedEndTime, 'hh:mm A')}`,
      start: data.start,
      end: reservedEndTime,
      backgroundColor: '#616976',
      checked: `${getMomentFormat(data.start, 'YYYY-MM-DD')}`,
      droppable: false,
      editable: false,
    };

    const bufferEvent = {
      id: 'reservedBufferEvent',
      title: `Buffer from ${getMomentFormat(bufferStartTime, 'hh:mm A')} - ${getMomentFormat(bufferEndTime, 'hh:mm A')}`,
      start: bufferStartTime,
      end: bufferEndTime,
      backgroundColor: '#d9dde0',
      textColor: '#374152',
      droppable: false,
      editable: false,
    };

    const customPlannedInTime = getMomentFormat(plannedIn);
    const customPlannedOutTime = getMomentFormat(plannedOut);
    const timeDiffInMins = getMomentDiff(customPlannedOutTime, customPlannedInTime, 'minutes');
    if (timeDiffForStartAndEnd >= timeDiffInMins) {
      calEvent.event = getMomentFormat(customPlannedInTime, 'YYYYMMDD');
    }
    if(timeDiffForStartAndEnd === timeDiffInMins) {
      calEvent.isFullShift = true;
    }
    const eventsArray = [];
    eventsArray.push(calEvent);

    if (userRoles.data.booking.buffer_period_mins) {
      eventsArray.push(bufferEvent);
    }
    const checkForPastTime = find(customEvents, { id: 'pastTime' });
    if (checkForPastTime) {
      eventsArray.push(checkForPastTime);
    }
    setCustomEvents(eventsArray);

    const customTimeObject = {
      planned_in: getMomentFormat(data.start, 'HH:mm:ss'),
      planned_out: getMomentFormat(data.end, 'HH:mm:ss'),
      custom_planned_in: customShift.planned_in,
      custom_planned_out: customShift.planned_out,
      id: customShift.id,
      start_date: moment(calendarDate[0]).format('YYYY-MM-DD'),
      end_date: moment(calendarDate[1]).format('YYYY-MM-DD'),
      duration: customShift.duration,
      name: customShift.name,
      start_time: customShift.start_time,
      customShift: true,
      dragType: true,
    };
    setBookingTime(customTimeObject);
  };
  const eventOverLap = (stillEvent) => {
    const array = ['#616976', 'grey', '#d84e59', '#cad0d5'];
    if (includes(array, stillEvent.backgroundColor)) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (slotMaxTime) {
      const timeArray = slotMaxTime.split(':');
      let minutes = timeArray[1];
      while (minutes % 5 !== 0) {
        minutes -= 1;
      }
      setSlotMaxTime(timeArray[0].concat(':').concat(minutes).concat(':').concat(timeArray[2]));
    }
  }, [slotMaxTime]);
  return (
    <Row id="shifts">
      <Col sm="12">
        <Row>
          <Col sm="3 text-center">
            <img src={selectedCalendarImage} alt="calendar" />
            <div className="text-center centered date-color">
              <div>
                <strong className="font-weight-700">
                  {getMomentFormat(calendarDate[0], 'ddd')}
                </strong>

                {(getMomentFormat(calendarDate[0], 'ddd') !== getMomentFormat(calendarDate[1], 'ddd')) ? (
                  <>
                    -
                    <strong className="font-weight-700">
                      {getMomentFormat(calendarDate[1], 'ddd')}
                    </strong>
                  </>
                ) : ''}
              </div>
              <div>
                <strong className="font-weight-900 pb-1">
                  {getMomentFormat(calendarDate[0], 'D')}
                  {' '}
                  {' '}
                  {getMomentFormat(calendarDate[0], 'MMM')}
                </strong>
                {(getMomentFormat(calendarDate[0], 'D') !== getMomentFormat(calendarDate[1], 'D')) && (getMomentFormat(calendarDate[0], 'MMMM') !== getMomentFormat(calendarDate[1], 'MMMM')) && (calendarDate[0] !== calendarDate[1]) ? (
                  <>
                    -
                    <strong className="font-weight-900">
                      {getMomentFormat(calendarDate[1], 'D')}
                      {' '}
                      {' '}
                      {getMomentFormat(calendarDate[1], 'MMM')}
                    </strong>
                  </>
                ) : ''}
                {(getMomentFormat(calendarDate[0], 'D') !== getMomentFormat(calendarDate[1], 'D')) && (getMomentFormat(calendarDate[0], 'MMMM') === getMomentFormat(calendarDate[1], 'MMMM')) ? (
                  <>
                    -
                    <strong className="font-weight-900">
                      {getMomentFormat(calendarDate[1], 'D')}
                      {' '}
                      {' '}
                      {getMomentFormat(calendarDate[1], 'MMM')}
                    </strong>
                  </>
                ) : ''}
              </div>
            </div>
            <div className="font-weight-300 centered-2 font-tiny">
              {getMomentFormat(calendarDate[0], 'YYYY')}
              {getMomentFormat(calendarDate[0], 'YYYY') !== getMomentFormat(calendarDate[1], 'YYYY') ? (
                <>
                  -
                  {' '}
                  {getMomentFormat(calendarDate[1], 'YYYY')}
                </>
              ) : ''}
            </div>
          </Col>
          {(workStationType && workStationType.shifts_custom_times === 'only_shifts' || workStationType && workStationType.shifts_custom_times === 'both_shifts_custom_time') && (
            <Col sm="4" className="mt-3 cursor-pointer" onClick={() => setSelectType('shift')}>
              <div className={`d-flex align-items-center shift-custom-box bg-azure px-2 ${selectType === 'shift' ? 'border-color-manatee-1px border-radius-2px b-r-sm' : ''}`}>
                <img src={shiftIcon} alt="shift" height="25" width="25" className="mr-2" />
                <div>
                  <h4 className="ws-name">Select Shift</h4>
                  <span className="text-success font-size-11px">
                    {availableShifts && availableShifts.length}
                    {' '}
                    Available Shifts
                  </span>
                </div>
              </div>
            </Col>
          )}
          {customShift && availableShifts && availableShifts.length !== 0 && (!(disablePartialBooking && checkSpaceCategory()) && (workStationType && workStationType.shifts_custom_times === 'only_custom_time' || workStationType && workStationType.shifts_custom_times === 'both_shifts_custom_time')) && (
            <Col
              sm="4"
              className="mt-2 cursor-pointer"
              onClick={() => setSelectType('custom')}
            >
              <div className={`d-flex align-items-center shift-custom-box bg-azure px-2 ${selectType === 'custom' ? 'border-color-manatee-1px border-radius-2px b-r-sm' : ''}`}>
                <img src={customTimeIcon} alt="custom" height="25" width="25" className="mr-2" />
                <h4 className="ws-name">Custom Time</h4>
              </div>
            </Col>
          )}
        </Row>
        {selectType === 'shift' ? (
          <Row className="mt-3">
            {validateShift <= 0 && (
              <div className="ml-3">
                <strong className="available-shift-text">
                  Available Shifts:
                </strong>
              </div>
            )}
            <div className="shifts-height pr-2 ml-3">
              {validateShift <= 0
                && multidaysShiftsInfo
                && !multidaysShiftsInfo.loading
                && availableShifts
                && availableShifts.length > 0
                && availableShifts.map((shift, index) => (
                  <Card
                    key={`${index}`}
                    className={`noBorder mt-2 ${isSelected(shift, index) ? 'card-props' : 'available-shift-card cursor-pointer'} ${passedShifts(shift, endedShifts) ? 'card-disabled cursor-pointer' : 'bg-ghost-white cursor-pointer'} `}
                    onClick={() => checkShift(index)}
                    data-testid={shift.id}
                  >
                    <CardBody className="p-2">
                      <Row className="text-center m-0">
                        <Col sm="4" xs="3" md="4" lg="4" data-testid="shift">
                          <strong>
                            Shift
                            {' '}
                            {shift.name}
                          </strong>
                          <span className="float-right">
                            |
                          </span>
                        </Col>
                        <Col sm="6" xs="7" md="6" lg="6" className="font-weight-400 p-0">
                          {getShiftTime(shift.planned_in)}
                          {' '}
                          <DisplayTimezone />
                          {' '}
                          -
                          {' '}
                          {getShiftTime(shift.planned_out)}
                          {' '}
                          <DisplayTimezone />
                        </Col>
                        <Col sm="2" xs="2" md="2" lg="2">
                          <FontAwesomeIcon className={`${isSelected(shift, index) ? 'card-props' : 'text-amethyst-smoke'} `} icon={faChevronCircleRight} />
                        </Col>
                      </Row>
                    </CardBody>
                    {/* )}  */}
                  </Card>
                ))}
              {validateShift <= 0
                && multidaysShiftsInfo && !multidaysShiftsInfo.loading && availableShifts && !availableShifts.length
                && (
                  <div className="text-center">
                    No Shifts are available.
                  </div>
                )}

              {shiftsDataLoading}
              {!(validateShift <= 0) && multidaysShiftsInfo && !multidaysShiftsInfo.loading && (
                <div className="text-center text-danger">
                  Please Select a Valid Date
                </div>
              )}
            </div>
          </Row>
        ) : (
          <>
            {(!(disablePartialBooking && checkSpaceCategory())) && (
              <>
                <Row className="mt-3">
              <Col className="customTimeFullcalendar" key="timeGridDay">
                {shiftsDataLoading}
                {(customShift && slotMinTime && slotMaxTime && multidaysShiftsInfo && !multidaysShiftsInfo.loading) && (
                  <>
                    <FullCalendar
                      initialView="timeGridDay"
                      plugins={[timeGridPlugin, interactionPlugin]}
                      selectable
                      slotDuration="00:15:00"
                      dayHeaderContent={(args) => displayHeader(args)}
                      select={(date) => setCustomTime(date)}
                      slotMinTime={slotMinTime}
                      slotMaxTime={slotMaxTime}
                      events={customEvents}
                      eventOverlap={eventOverLap}
                      selectOverlap={false}
                      scrollTime={false}
                    />
                  </>
                )}
                {shiftError ? (
                  <div className="text-danger text-center mt-1">{shiftError}</div>
                ) : ''}
                {error ? (
                  <div className="text-center mt-2 font-size-12px">
                    <FontAwesomeIcon className="mr-1" icon={faInfoCircle} />
                    {error}
                  </div>
                ) : ''}
              </Col>
            </Row>
              </>
            )}
          </>
        )}
        {multidaysShiftsInfo && !multidaysShiftsInfo.loading && customShift !== false && workStationType && workStationType.shifts_custom_times === 'only_custom_time' && (
          <div className='text-center mt-5'>Shifts and Custom time are not available for the selected date/date’s.
          </div>
        )}
        {multidaysShiftsInfo && !multidaysShiftsInfo.loading && endedShifts && endedShifts.length > 0 && selectType && selectType === 'shift' && (
          <div className="text-center pt-5">
            <h1 className="text-danger passed-shifts-info-color  font-size-12px  content-inline">
              {endedShifts.map((endedTimings) => `Shift ${endedTimings.name}`).join(', ')}
              {' '}
            </h1>
            <h1 className="text-danger passed-shifts-info-color font-size-12px  content-inline">
              are already over/passed for the today (
              {selectedDate}
              {' '}
              ).
              If you still want to continue go with upcoming Shift's.
            </h1>
          </div>
        )}
        {/* {multidaysShiftsInfo && !multidaysShiftsInfo.loading && endedShifts && endedShifts.length > 0 && selectType && selectType === 'custom' && (
          <div className="text-center pt-5">
            <h1 className="text-danger  font-size-12px  content-inline">
              Timings before
              {' '}
              {userTime}
              {' '}
            </h1>
            <h1 className="text-danger  font-size-12px  content-inline">
              are already over/passed for the today (
              {selectedDate}
              {' '}
              ).
              If you still want to continue go with upcoming timings.
            </h1>
          </div>
        )} */}
      </Col>
    </Row>
  );
};
BookingShifts.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  calendarDate: PropTypes.array.isRequired,
  workStationType: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  onSiteUpdate: PropTypes.func.isRequired,
  siteData: PropTypes.shape({
    siteInfo: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }),
  bookingItem: PropTypes.shape({
    planned_in: PropTypes.string,
    id: PropTypes.number,
    shift: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  bookingData: PropTypes.shape({
    site: PropTypes.shape({
      name: PropTypes.string,
    }),
    shiftType: PropTypes.string,
  }),
  setShiftType: PropTypes.func,
};

BookingShifts.defaultProps = {
  siteData: {},
  bookingItem: {},
  bookingData: undefined,
  workStationType: {},
  setShiftType: () => { },
};

export default BookingShifts;
