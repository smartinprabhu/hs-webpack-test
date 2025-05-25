/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */

import React, {
  useState, useEffect, forwardRef, useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import FullCalendar from '@fullcalendar/react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import difference from 'lodash/difference';
import includes from 'lodash/includes';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';

import booked from '@images/booked.png';
import './bookingCalendarDayGridView.scss';
import {
  convertUtcTimetoCompanyTimeZone, getDateWithAddedMins, getDateWithSubtractedMins, utcConverter, getUtcTimefromZone, getTimeWithSubtractedMins,
} from '@shared/dateTimeConvertor';
import { setBookingData } from '../../bookingService';
import { getCurrentCompanyTime } from '../../../util/appUtils';

const { CustomCheckbox } = require('../../../util/formClasses');

const BookingCalendarDayGridComponent = forwardRef(({
  bookingSpace, workStationAvailability, setCalendarEventsForTimeline, selectedWorkSpace, setSelectedWorkSpace, index, indexForReset, reset, setReset, removeNode, setRemoveNode, removeNodeIndex,
}, ref) => {
  const dispatch = useDispatch();
  const { bookingInfo, availabilityResponse, workSpaceId } = useSelector((state) => state.bookingInfo);
  // const { userRoles } = useSelector((state) => state.config);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [hiddenDays, sethiddenDays] = useState(false);
  const [dateRange, setDateRange] = useState('');
  const [multidaysBookings, setMultidaysBooking] = useState([]);
  // const [timelineDates, setTimelineDates] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const spaceAvailability = availabilityResponse[bookingSpace.id];
    const filteredData = filter(spaceAvailability, (data) => data.id === bookingSpace.id);
    setAvailability(filteredData);
  }, [workSpaceId]);

  // const CustomCheckbox = withStyles({
  //   root: {
  //     color: '#00001d',
  //     '&$checked': {
  //       color: '#3a4354',
  //     },
  //   },
  //   checked: {},
  //   // eslint-disable-next-line react/jsx-props-no-spreading
  // })((props) => <Checkbox color="default" size="small" {...props} />);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarError, setCalendarError] = useState('');
  const fullShiftVar = false;
  const [isFullShift, setFullShift] = useState(fullShiftVar);
  const [eventIndex, setEventIndex] = useState();
  let minSlotTime;
  let maxSlotTime;

  useEffect(() => {
    if (calendarEvents && calendarEvents.length) {
      calendarEvents.map((event) => {
        if (event.index === removeNodeIndex || event.index > removeNodeIndex) {
          event.index -= 1;
        }
      });
    }
    if (multidaysBookings && multidaysBookings.length) {
      multidaysBookings.map((booking) => {
        if (booking.index === removeNodeIndex || booking.index > removeNodeIndex) {
          booking.index -= 1;
        }
      });
    }
  }, [removeNodeIndex]);

  useEffect(() => {
    if (calendarEvents && calendarEvents.length > 0) setCalendarEventsForTimeline(calendarEvents);
  }, [calendarEvents]);

  if (bookingInfo && bookingInfo.site && bookingInfo.site.planned_in && bookingInfo.site.planned_out) {
    let plan_in = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_in, 'YYYY-MM-DD HH:mm', userInfo.data.company.timezone);
    plan_in = plan_in.toString().slice(0, 10);

    let plan_out = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_out, 'YYYY-MM-DD HH:mm', userInfo.data.company.timezone);
    plan_out = plan_out.toString().slice(0, 10);

    minSlotTime = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_in, 'HH:mm', userInfo.data.company.timezone);
    maxSlotTime = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_out, 'HH:mm', userInfo.data.company.timezone);

    if (plan_in !== plan_out) {
      minSlotTime = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_in, 'HH:mm', userInfo.data.company.timezone);
      maxSlotTime = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_out, 'HH:mm', userInfo.data.company.timezone);
      const split = maxSlotTime.split(':');
      maxSlotTime = parseInt(split[0], 10) + 24;
      maxSlotTime = `${maxSlotTime.toString()}:${split[1]}`;
    }
  }

  useEffect(() => {
    if (indexForReset >= 0) {
      const resetReservedEvent = filter(calendarEvents, (reservedCalEvent) => reservedCalEvent.index !== indexForReset || reservedCalEvent.backgroundColor === '#d84e59' || reservedCalEvent.id === 'pastTime' || reservedCalEvent.backgroundColor === '#cad0d5');
      setCalendarEvents(resetReservedEvent);
      const space = find(selectedWorkSpace, { index: indexForReset });
      if (space) {
        space.multidaysBookings = [];
      }
      const bookings = filter(multidaysBookings, (booking) => booking.index !== indexForReset);
      setMultidaysBooking(bookings);
      setReset(false);
    }
  }, [reset]);

  const resetReservation = (eventsIndex) => {
    setMultidaysBooking([]);
    const newSelectedWorkSpace = [];
    selectedWorkSpace.forEach((workSpace) => {
      if (workSpace.id === bookingSpace.id) {
        if (bookingSpace.employee.hasOwnProperty('new_planned_in')) delete bookingSpace.employee.new_planned_in;
        if (bookingSpace.employee.hasOwnProperty('new_planned_out')) delete bookingSpace.employee.new_planned_out;

        newSelectedWorkSpace.push(bookingSpace);
      } else newSelectedWorkSpace.push(workSpace);
    });
    setSelectedWorkSpace(newSelectedWorkSpace);
    setCalendarError('');
  };

  const startTime = moment(bookingInfo.site.planned_in).format('YYYY-MM-DD HH:mm:ss');
  const nowTime = getCurrentCompanyTime(userInfo.data.company.timezone, 'YYYY-MM-DD HH:mm:ss');

  useEffect(() => {
    if (multidaysBookings && multidaysBookings.length) {
      bookingSpace.multidaysBookings = multidaysBookings;
      bookingSpace.index = index;
      bookingInfo.multidaysBookings = multidaysBookings;
      bookingInfo.index = index;
    } else {
      bookingSpace.multidaysBookings = [];
      bookingInfo.multidaysBookings = [];
    }
  }, [multidaysBookings]);

  useEffect(() => {
    setRemoveNode(false);
    const bookedEvents = [];
    if (moment(startTime).format('YYYY-MM-DD') === moment(nowTime).format('YYYY-MM-DD') && nowTime > startTime) {
      bookedEvents.push(
        {
          id: 'pastTime',
          start: startTime,
          end: nowTime,
          backgroundColor: 'grey',
          display: 'background',
          event: `${moment(startTime).format('YYYYMMDD')}`,
          droppable: false,
          editable: false,
          index,
        },
      );
    } else if (moment(startTime).format('YYYY-MM-DD') !== moment(nowTime).format('YYYY-MM-DD') && nowTime < startTime) {
      const newStartDate = moment(startTime).subtract(1, 'days').format('YYYY-MM-DD');
      if (nowTime > newStartDate) {
        bookedEvents.push(
          {
            id: 'pastTime',
            start: newStartDate,
            end: nowTime,
            backgroundColor: 'grey',
            display: 'background',
            event: `${moment(newStartDate).format('YYYYMMDD')}`,
            droppable: false,
            editable: false,
            index,
          },
        );
      }
    }

    if (availability && availability.length > 0
      && availability[0].shifts && availability[0].shifts.length > 0) {
      let reservedStartTime;
      let reservedEndTime;
      let bufferStartTime;
      let bufferEndTime;
      // eslint-disable-next-line array-callback-return
      availability[0].shifts.map((shift, shiftIndex) => {
        if (shift.bookings && shift.bookings.length) {
          shift.bookings.map((bookedItem, bookingIndex) => {
            if (bookedItem.is_host) {
              reservedStartTime = convertUtcTimetoCompanyTimeZone(bookedItem.planned_in, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
              reservedEndTime = convertUtcTimetoCompanyTimeZone(bookedItem.planned_out, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
              bufferStartTime = reservedEndTime;
              bufferEndTime = getDateWithAddedMins(bookedItem.planned_out, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone, userRoles.data.booking.buffer_period_mins);
              const eventEndTime = convertUtcTimetoCompanyTimeZone(bookedItem.planned_out, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
              if (eventEndTime > nowTime) {
                bookedEvents.push(
                  {
                    id: `booked ${shiftIndex}${bookingIndex}`,
                    title: `Booked ${moment(reservedStartTime).format('hh:mm A')} - ${moment(reservedEndTime).format('hh:mm A')}`,
                    start: reservedStartTime,
                    end: reservedEndTime,
                    backgroundColor: '#d84e59',
                    droppable: false,
                    editable: false,
                    index,
                  },
                  {
                    id: `buffer ${shiftIndex}${bookingIndex}`,
                    title: `Buffer ${moment(bufferStartTime).format('hh:mm A')} - ${moment(bufferEndTime).format('hh:mm A')}`,
                    start: bufferStartTime,
                    end: bufferEndTime,
                    backgroundColor: '#cad0d5',
                    textColor: '#374152',
                    editable: false,
                    droppable: false,
                    index,
                  },
                );
              }
            }
          });
        }
      });
    }
    if (bookedEvents && bookedEvents.length > 0) {
      setCalendarEvents((prevState) => uniqBy([...prevState, bookedEvents].flat(), 'id'));
    }
  }, [availability, removeNode]);

  const setBookingTime = (data) => {
    setCalendarError('');
    let eventDate = data.startStr.toString().slice(0, 19);
    eventDate = moment.tz(eventDate, userInfo.data.company.timezone).format('YYYY-MM-DD HH:mm:ss');
    const nowDate = getCurrentCompanyTime(userInfo.data.company.timezone, 'YYYY-MM-DD HH:mm:ss');

    const timeDiffForStartAndEnd = moment(data.end).diff(moment(data.start), 'minutes');
    const timeDiffForNowDate = moment(data.end).diff(moment(nowDate), 'minutes');
    const maxTimeDiff = moment(bookingInfo.site.planned_out).diff(moment(bookingInfo.site.planned_in), 'minutes');

    if (timeDiffForNowDate === timeDiffForStartAndEnd) {
      bookingSpace.isFullShiftBook = true;
    } else {
      bookingSpace.isFullShiftBook = false;
    }

    if (eventDate > nowDate) {
      if (timeDiffForStartAndEnd < userRoles.data.booking.minimum_duration_mins) {
        setCalendarError(`Booking duration should be atleast ${userRoles.data.booking.minimum_duration_mins} minutes.`);
        return false;
      }
      if (timeDiffForStartAndEnd > maxTimeDiff) {
        resetReservation();
        setCalendarError('Booking duration should be within shift time');
        return false;
      }
      const reservedStartTime = data.start;
      const reservedEndTime = moment(data.end).subtract(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      const bufferStartTime = reservedEndTime;
      const bufferEndTime = data.end;

      const calEvent = {
        id: `reserved${moment(data.start).format('YYYYMMDD')}`,
        title: `Reserve from ${moment(reservedStartTime).format('hh:mm A')} - ${moment(reservedEndTime).format('hh:mm A')}`,
        event: `${moment(data.start).format('YYYYMMDD')}`,
        start: data.start,
        end: reservedEndTime,
        backgroundColor: '#616976',
        checked: `${moment(data.start).format('YYYY-MM-DD')}`,
        editable: true,
        index,
      };

      const bufferEvent = {
        id: `reservedBuffer${moment(data.start).format('YYYYMMDD')}`,
        title: `Buffer from ${moment(bufferStartTime).format('hh:mm A')} - ${moment(bufferEndTime).format('hh:mm A')}`,
        start: bufferStartTime,
        end: bufferEndTime,
        eventName: `${moment(data.start).format('YYYYMMDD')}`,
        backgroundColor: '#d9dde0',
        textColor: '#374152',
        editable: false,
        index,
      };

      let sliced_startDate = data.startStr.toString().slice(0, 19);
      sliced_startDate = moment.tz(sliced_startDate, userInfo.data.company.timezone);
      let sliced_endDate = moment(data.end).subtract(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      sliced_endDate = sliced_endDate.toString().slice(0, 19);
      sliced_endDate = moment.tz(sliced_endDate, userInfo.data.company.timezone);
      bookingSpace.employee.new_planned_in = utcConverter(sliced_startDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
      bookingSpace.employee.new_planned_out = utcConverter(sliced_endDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
      if (bookingSpace.max_occupancy && bookingSpace.max_occupancy > 0) {
        bookingInfo.maxOccupancyPlannedTime = {
          plannedIn: utcConverter(sliced_startDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
          plannedOut: utcConverter(sliced_endDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
        };
      }
      const obj = {
        index,
        id: calEvent.id,
        planned_in: utcConverter(sliced_startDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
        planned_out: utcConverter(sliced_endDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
      };

      if (moment(sliced_startDate).format('YYYY-MM-DD HH:mm:ss').split(' ')[1] === bookingInfo.site.planned_in.split(' ')[1] && moment(sliced_endDate).add(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss').split(' ')[1] === bookingInfo.site.planned_out.split(' ')[1]) {
        obj.isFullShiftBook = true;
      }

      const dataInfo = filter(multidaysBookings, (days) => moment(days.planned_in).format('YYYY-MM-DD') === moment(data.start).format('YYYY-MM-DD'));
      if (data._def && data._def.title && dataInfo.length) {
        dataInfo[0].planned_out = reservedEndTime;
      }
      if (multidaysBookings && multidaysBookings.length) {
        if (!dataInfo.length) {
          const checkExistingReservation = find(multidaysBookings, { id: calEvent.id });
          if (checkExistingReservation) {
            const checkExistingReservationIndex = findIndex(multidaysBookings, (event) => event.event === calEvent.event);
            const replaceExistingReservation = multidaysBookings;
            replaceExistingReservation[checkExistingReservationIndex] = obj;
            setMultidaysBooking((previousState) => uniqBy([...previousState, replaceExistingReservation].flat(), 'id'));
          } else {
            setMultidaysBooking((prevState) => [...prevState, obj]);
          }
        } else if (dataInfo.length === 1) {
          const prevBooking = calendarEvents.filter((booking) => booking.event === calEvent.event);
          if (prevBooking.length) {
            const prevBuffer = calendarEvents.filter((booking) => booking.eventName === prevBooking[0].event);
            const prevMultidaysBooking = multidaysBookings.filter((booking) => booking.id === prevBooking[0].id);
            prevBooking[0].start = calEvent.start;
            prevBooking[0].end = calEvent.end;
            prevBooking[0].title = calEvent.title;
            if (prevBuffer.length) {
              prevBuffer[0].start = bufferEvent.start;
              prevBuffer[0].end = bufferEvent.end;
              prevBuffer[0].title = bufferEvent.title;
            }
            if (prevMultidaysBooking.length) {
              prevMultidaysBooking[0].planned_in = utcConverter(sliced_startDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
              prevMultidaysBooking[0].planned_out = utcConverter(sliced_endDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
            }
          }
        }
      } else {
        setMultidaysBooking((prevState) => [...prevState, obj]);
      }
      if (calendarEvents && calendarEvents.length && data._def && data._def.publicId) {
        const resizeEvent = filter(calendarEvents, (events) => events.id === calEvent.id);

        if (resizeEvent.length) {
          const prevBooking = multidaysBookings.filter((booking) => booking.id === resizeEvent[0].id);
          if (prevBooking.length) {
            prevBooking[0].planned_in = utcConverter(sliced_startDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
            prevBooking[0].planned_out = utcConverter(sliced_endDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
          }
          resizeEvent[0].end = reservedEndTime;
          resizeEvent[0].title = `Reserve from ${moment(reservedStartTime).format('hh:mm A')} - ${moment(reservedEndTime).format('hh:mm A')}`;
          const buffer = filter(calendarEvents, (events) => events.eventName === resizeEvent[0].event);
          if (buffer.length) {
            buffer[0].start = bufferStartTime;
            buffer[0].end = bufferEndTime;
            buffer[0].title = `Buffer from ${moment(bufferStartTime).format('hh:mm A')} - ${moment(bufferEndTime).format('hh:mm A')}`;
          }
        }
      }
      dispatch(setBookingData(bookingInfo));
      const reservedCalendarEvents = calendarEvents;
      const reservedCalEventsIndex = findIndex(reservedCalendarEvents, (event) => event.id === calEvent.id);
      const reservedCalEventsBufferIndex = findIndex(reservedCalendarEvents, (event) => event.id === bufferEvent.id);
      if (reservedCalEventsIndex >= 0) {
        const updateCalEvent = calendarEvents;
        updateCalEvent[reservedCalEventsIndex] = calEvent;
        updateCalEvent[reservedCalEventsBufferIndex] = bufferEvent;
        setCalendarEvents((previousState) => uniqBy([...previousState, updateCalEvent].flat(), 'id'));
      } else {
        reservedCalendarEvents.push(calEvent);
        reservedCalendarEvents.push(bufferEvent);
        setCalendarEvents((previousState) => uniqBy([...previousState, reservedCalendarEvents].flat(), 'id'));
      }
    } else {
      return false;
    }
  };

  const eventResizeInfo = (eventResize) => {
    if (isFullShift) return false;
    setBookingTime(eventResize.event);
  };

  const eventDrop = (data) => {
    const eventData = {
      start: data.event.start,
      end: moment(data.event.end).add(userRoles.data.booking.buffer_period_mins, 'minutes')._d,
      id: data.event.id,
    };
    eventData.startStr = data.event.startStr;
    eventData.endStr = moment(eventData.end).format('YYYY-MM-DD HH:mm:ss');
    let EventUtcEndTime = eventData.endStr.toString().slice(0, 19);
    EventUtcEndTime = utcConverter(EventUtcEndTime, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone);
    const shiftEndTime = utcConverter(bookingInfo.site.planned_out, 'YYYY-MM-DD HH:mm:ss');
    if (isFullShift) return false;
    if (EventUtcEndTime > shiftEndTime) {
      resetReservation();
      setCalendarError('Booking duration should be within shift time');
      return false;
    }
    setBookingTime(eventData);
  };

  useImperativeHandle(ref, () => ({
    getResetRes(eventsIndex) {
      setEventIndex(`${eventsIndex}`);
      if (bookingSpace && bookingSpace.max_occupancy > 0) {
        bookingInfo.maxOccupancyPlannedTime = false;
      }
    },
  }));

  const makeFullShift = (bookingdata, event) => {
    setSelectedWorkSpace([...selectedWorkSpace]);
    if (event.target.checked) {
      let fullShiftStartTime;
      let fullShiftEndTime;
      let reservedEndTime;
      if (bookingInfo && bookingInfo.site && bookingInfo.site.planned_in.split(' ')[1] && bookingInfo.site.planned_out.split(' ')[1]) {
        if (parseInt(bookingInfo.site.planned_out.split(' ')[1].split(':')[0]) < parseInt(bookingInfo.site.planned_in.split(' ')[1].split(':')[0])) {
          fullShiftStartTime = `${moment(bookingdata.date).format('YYYY-MM-DD')} ${bookingInfo.site.planned_in.split(' ')[1]}`;
          fullShiftEndTime = `${moment(bookingdata.date).add(1, 'days').format('YYYY-MM-DD')} ${bookingInfo.site.planned_out.split(' ')[1]}`;
          reservedEndTime = moment(fullShiftEndTime).subtract(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        } else {
          fullShiftStartTime = `${moment(bookingdata.date).format('YYYY-MM-DD')} ${bookingInfo.site.planned_in.split(' ')[1]}`;
          fullShiftEndTime = `${moment(bookingdata.date).format('YYYY-MM-DD')} ${bookingInfo.site.planned_out.split(' ')[1]}`;
          reservedEndTime = moment(fullShiftEndTime).subtract(userRoles.data.booking.buffer_period_mins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        }
      }
      const calEvent = {
        id: `reserved${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        title: `Reserve from ${moment(fullShiftStartTime).format('hh:mm A')} -  ${moment(reservedEndTime).format('hh:mm A')}`,
        start: fullShiftStartTime,
        end: reservedEndTime,
        backgroundColor: '#616976',
        event: `${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        checked: `${moment(fullShiftStartTime).format('YYYY-MM-DD')}`,
        isFullShift: true,
        index,
      };

      const reserveBuffer = {
        id: `reservedBuffer${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        title: `Buffer ${moment(reservedEndTime).format('hh:mm A')} - ${moment(fullShiftEndTime).format('hh:mm A')}`,
        start: reservedEndTime,
        end: fullShiftEndTime,
        backgroundColor: '#d9dde0',
        eventName: `${moment(fullShiftStartTime).format('YYYYMMDD')}`,
        textColor: '#374152',
        index,
      };
      const checkForPastTime = find(calendarEvents, { event: calEvent.event, id: 'pastTime' });
      if (checkForPastTime) {
        calEvent.start = checkForPastTime.end;
        calEvent.title = `Reserve from ${moment(checkForPastTime.end).format('hh:mm A')} -${moment(reservedEndTime).format('hh:mm A')}`;
      }
      let sliced_startDate = moment(calEvent.start).format().toString().slice(0, 19);
      sliced_startDate = moment.tz(sliced_startDate, userInfo.data.company.timezone);
      let sliced_endDate = moment(calEvent.end).format().toString().slice(0, 19);
      sliced_endDate = moment.tz(sliced_endDate, userInfo.data.company.timezone);
      const obj = {
        id: calEvent.id,
        planned_in: utcConverter(sliced_startDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
        planned_out: utcConverter(sliced_endDate, 'YYYY-MM-DD HH:mm:ss', userInfo.data.company.timezone),
        isFullShiftBook: true,
        index,
      };
      const checkExistingMultibookingIndex = findIndex(multidaysBookings, (booking) => booking.id === obj.id);
      if (checkExistingMultibookingIndex >= 0) {
        const multiBook = multidaysBookings;
        multiBook[checkExistingMultibookingIndex] = obj;
        setMultidaysBooking(multiBook);
      } else {
        setMultidaysBooking((prevState) => [...prevState, obj]);
      }
      const reservedCalendarEvents = calendarEvents;
      const reservedCalEventsIndex = findIndex(reservedCalendarEvents, (event) => event.id === calEvent.id);
      const reservedCalEventsBufferIndex = findIndex(reservedCalendarEvents, (event) => event.eventName === reserveBuffer.eventName);
      if (reservedCalEventsIndex >= 0) {
        const updateCalEvent = calendarEvents;
        updateCalEvent[reservedCalEventsIndex] = calEvent;
        updateCalEvent[reservedCalEventsBufferIndex] = reserveBuffer;
        setCalendarEvents((previousState) => uniqBy([...previousState, reservedCalendarEvents].flat(), 'id'));
      } else {
        reservedCalendarEvents.push(calEvent);
        reservedCalendarEvents.push(reserveBuffer);
        setCalendarEvents((previousState) => uniqBy([...previousState, reservedCalendarEvents].flat(), 'id'));
      }
    } else if (!event.target.checked) {
      let reservedCalendarEvents = calendarEvents;
      reservedCalendarEvents = reservedCalendarEvents.filter((event) => event.id !== `reserved${moment(bookingdata.date).format('YYYYMMDD')}`);
      reservedCalendarEvents = reservedCalendarEvents.filter((event) => event.id !== `reservedBuffer${moment(bookingdata.date).format('YYYYMMDD')}` && event.id !== `reserved${moment(bookingdata.date).format('D')}`);
      setCalendarEvents(reservedCalendarEvents);
      let multiBook = multidaysBookings;
      multiBook = multiBook.filter((book) => book.id !== `reserved${moment(bookingdata.date).format('YYYYMMDD')}`);
      setMultidaysBooking(multiBook);
    }
  };
  let headerIndex = 1;
  const displayHeader = (args) => {
    args.isFullShift = false;
    const filterDate = multidaysBookings.filter((booking) => moment(booking.planned_in).format('YYYY-MM-D') === moment(args.date).format('YYYY-MM-D'));
    return (
      <>
        <Row className="font-size-10px">
          &nbsp;
          {moment(args.date).format('MMM D, ddd')}
        </Row>
        <div>
          {find(calendarEvents, { checked: `${moment(args.date).format('YYYY-MM-DD')}` }) && (
            <img src={booked} alt="slot selected" height="15" width="15" />
          )}
        </div>
        <div className="light-text">
          {availability && availability.length > 0 && availability[0].shifts && availability[0].shifts.length > 0
            && availability[0].shifts.map((shift) => (
              // eslint-disable-next-line no-plusplus
              <div key={headerIndex++}>
                {convertUtcTimetoCompanyTimeZone(shift.planned_in, 'YYYY-MM-DD', userInfo.data.company.timezone) === moment(args.date).format('YYYY-MM-DD') && shift.bookings.length === 0 && (
                  <Row>
                    <CustomCheckbox
                      className="pt-1 mt-1 PrivateSwitchBase-root-3"
                      checked={calendarEvents.some((calendarEvnt) => calendarEvnt.event === moment(args.date).format('YYYYMMDD') && calendarEvnt.isFullShift)}
                      onClick={(event) => makeFullShift(args, event)}
                      name="fullShift"
                      data-testid="fullShiftId"
                    />
                    <span className="mt-1 font-size-10px">Full Shift</span>
                  </Row>
                )}
              </div>
            ))}
        </div>
      </>
    );
  };

  const eventOverLap = (stillEvent) => {
    const array = ['#616976', 'grey', '#d84e59', '#cad0d5'];
    if (includes(array, stillEvent.backgroundColor)) {
      return false;
    }
    return true;
  };
  const weekViewerObj = {
    Sunday: '0',
    Monday: '1',
    Tuesday: '2',
    Wednesday: '3',
    Thursday: '4',
    Friday: '5',
    Saturday: '6',
  };
  const initialDay = bookingInfo.date.length ? bookingInfo.date[0] : bookingInfo.date;
  const fetchDays = () => {
    if (bookingInfo.date.length) {
      const dayArray = [];
      setDateRange(moment(bookingInfo.date[1]).diff(moment(bookingInfo.date[0]), 'days') + 1);
      const daysRange = moment(bookingInfo.date[1]).diff(moment(bookingInfo.date[0]), 'days') + 1;
      let date = bookingInfo.date[0];
      dayArray.push(moment(date).format('dddd'));

      for (let i = 0; i < daysRange - 1; i += 1) {
        dayArray.push(moment(date).add(1, 'days').format('dddd'));
        date = moment(date).add(1, 'days');
      }

      const weekViewerArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const differenceArray = difference(weekViewerArray, dayArray);
      const hiddenDaysData = [];

      if (differenceArray.length) {
        differenceArray.map((day) => {
          hiddenDaysData.push(parseInt(weekViewerObj[day]));
        });
      }

      if (hiddenDaysData.length) {
        sethiddenDays(hiddenDaysData);
      } else {
        sethiddenDays(false);
      }
    }
  };

  useEffect(() => {
    fetchDays();
  }, [bookingInfo]);

  let minTime;
  let maxTime;
  if (bookingInfo && bookingInfo.site && bookingInfo.site.planned_in && bookingInfo.site.planned_out) {
    minTime = moment(bookingInfo.site.planned_in).format('HH:mm:ss');
    maxTime = moment(bookingInfo.site.planned_out).format('HH:mm:ss');
    const maxTimeSplit = maxTime.split(':');
    const minTimeSplit = minTime.split(':');
    if (parseInt(minTimeSplit[0]) > parseInt(maxTimeSplit[0])) {
      maxTime = parseInt(maxTimeSplit[0]) + 24;
      maxTime = `${maxTime.toString()}:${maxTimeSplit[1]}`;
    }
  }

  const renderInnerContent = (innerProps) => (
    <div className="fc-event-main-frame">
      <div className="fc-event-title-container">
        <div className="fc-event-title fc-sticky">
          {innerProps.event.title}
        </div>
      </div>
    </div>
  );

  const setTooltip = (arg) => (
    <Tooltip PopperProps={{ disablePortal: true }} title={<Typography color="inherit">{arg.event._def.title}</Typography>} arrow>
      {renderInnerContent(arg)}
    </Tooltip>
  );
  let validrange;
  useEffect(() => {
    if (bookingInfo && bookingInfo.date) {
      validrange = {
        start: bookingInfo.date[0],
        end: bookingInfo.date[1],
      };
    }
  }, [bookingInfo]);

  return (
    <div className="partialBookingCalendar" key="timeGridDay">
      {availability && availability.length > 0 && calendarEvents && bookingInfo && bookingInfo.date && (
        <FullCalendar
          initialView="timeGridWeek"
          plugins={[timeGridPlugin, interactionPlugin]}
          events={filter(calendarEvents, (event) => event.index === index)}
          headerToolbar={{
            left: dateRange && dateRange < 8 ? '' : 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          dayHeaderFormat={{ month: 'short', day: 'numeric', weekday: 'long' }}
          select={setBookingTime}
          hiddenDays={hiddenDays}
          initialDate={initialDay}
          dayHeaderContent={(args, index) => displayHeader(args, index)}
          editable={fullShiftVar}
          firstDay={weekViewerObj[moment(initialDay).format('dddd')]}
          eventResize={eventResizeInfo}
          eventDrop={eventDrop}
          eventOverlap={eventOverLap}
          validRange={validrange}
          selectable
          slotDuration="00:15:00"
          slotMinTime={minTime}
          slotMaxTime={maxTime}
          selectOverlap={false}
          scrollTime={false}
          eventContent={setTooltip}
        />
      )}
      {workStationAvailability && workStationAvailability.error && workStationAvailability.error.message && (
        <div className="text-center text-danger mt-3">
          {workStationAvailability.error.message}
        </div>
      )}
      {calendarError && (
        <div className="text-center text-danger mt-3">
          {calendarError}
        </div>
      )}
    </div>
  );
});

BookingCalendarDayGridComponent.propTypes = {
  workStationAvailability: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape(
        {
          bookings: PropTypes.arrayOf(
            PropTypes.shape({
              planned_in: PropTypes.string,
              id: PropTypes.number,
              planned_out: PropTypes.string,
              shift_id: PropTypes.number,
              shift_name: PropTypes.string,
              employee_name: PropTypes.string,
              employee_id: PropTypes.number,
              actual_in: PropTypes.bool,
              actual_out: PropTypes.bool,
            }),
          ),
        },
      ),
    ),
    PropTypes.shape({
      error: PropTypes.shape({
        message: PropTypes.string,
      }),
    }),
  ])
    .isRequired,
  bookingSpace: PropTypes.shape({
    employee: PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        is_onboarded: PropTypes.bool,
        label: PropTypes.string,
        registration_status: PropTypes.string,
        value: PropTypes.string,
        new_planned_in: PropTypes.string,
        new_planned_out: PropTypes.string,
        planned_in: PropTypes.string,
        planned_out: PropTypes.string,
      }),
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      ),
    ]),
    id: PropTypes.number,
    max_occupancy: PropTypes.number,
    isFullShiftBook: PropTypes.bool,
    index: PropTypes.number,
    multidaysBookings: PropTypes.arrayOf(
      PropTypes.shape({
      }),
    ),
  }).isRequired,
  indexForReset: PropTypes.number,
  removeNodeIndex: PropTypes.number,
  setCalendarEventsForTimeline: PropTypes.func,
  setSelectedWorkSpace: PropTypes.func,
  reset: PropTypes.bool,
  setRemoveNode: PropTypes.func,
  setReset: PropTypes.func,
  removeNode: PropTypes.bool,
  index: PropTypes.number,
  selectedWorkSpace: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      path_name: PropTypes.string,
    }),
  ),
};

BookingCalendarDayGridComponent.defaultProps = {
  setCalendarEventsForTimeline: () => { },
  setSelectedWorkSpace: () => { },
  setRemoveNode: () => { },
  setReset: () => { },
  selectedWorkSpace: [],
  indexForReset: undefined,
  reset: undefined,
  removeNodeIndex: undefined,
  removeNode: undefined,
  index: undefined,
};

export default BookingCalendarDayGridComponent;
