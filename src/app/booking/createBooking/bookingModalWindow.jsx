/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, ModalBody, ModalFooter, Row, Col, Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import BookingProcessBlueIcon from '@images/bookingProcessBlue.ico';
// import bulb from '@images/bulb.svg';
import greenBulb from '@images/greenBulb.svg';
import calendarIcon from '@images/calendar.svg';
import blueCalendarIcon from '@images/blueCalendar.svg';
import BookingCalendar from './calendar';
import BookingShifts from './shifts';
import {
  removeSaveDataToSpaceView, setBookingData, addGuestData, saveCalendarDateInfo, getBookingsList, saveMultidaysBookingData, resetBooking,
} from '../bookingService';
import CancelButtonGrey from '../../shared/cancelButtonGreyRounded';
import {
  convertUtcTimetoCompanyTimeZone, getCompanyTimeZoneDate, getUtcDate, utcConverter,
} from '../../shared/dateTimeConvertor';
// eslint-disable-next-line import/no-cycle
import BookingLayout from './bookingLayout';
import './shifts.scss';
import WorkStationTypes from './workStationTypes';
import ConfirmBookingModalScreen from './confirmBookingModalScreen';
import multidayBookingObj from './buildSaveBookingObject';
import { getHourMinSec, getMomentAdd, getMomentDiff, getMomentFormat, getMomentSub, getTimeDifference, getCurrentCompanyTime } from '../../util/appUtils';

const momentRange = extendMoment(moment);

const BookingModalWindow = ({
  shiftModalWindowOpen, openModalWindow, bookingItem, bookingData, viewType, filter,
}) => {
  let todayDate;
  if (bookingItem && bookingItem.date) {
    todayDate = bookingItem.date;
  } else {
    todayDate = getCompanyTimeZoneDate();
  }
  const history = useHistory();
  const dispatch = useDispatch();
  const [calendarDate, dateUpdate] = useState([todayDate, todayDate]);
  const [dateRage, changeDateRange] = useState(momentRange.range(moment().startOf('day')._d, moment().startOf('day')._d));
  const [validateDateAndSite, setdateSiteErrMsg] = useState('');
  const [selectedViewType, setViewType] = useState();
  const [enableSpaceBooking, setEnableSpaceBooking] = useState(false);
  const [selectedQuickSpace, setSelectedQuickSpace] = useState([]);
  const [quickSpaceSwitch, setQuickSpaceSwitch] = useState(false);
  const [siteData, getSite] = useState({
    siteInfo: '',
  });
  const [workStationType, setWorkStationTypeForShift] = useState('');
  const [bookingCalendarView, setBookingCalendarView] = useState(false);
  const [excludeUser, setExcludeUser] = useState(false);
  const [noLimit, setNoLimit] = useState(false);
  const [dateReset, setDateReset] = useState(false);
  const [limit, setLimit] = useState(0);
  const [shiftType, setShiftType] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    bookingInfo, multidaysShiftsInfo, multidaysBookingInfo, categories,
  } = useSelector((state) => state.bookingInfo);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingSpaceDetails, setBookingSpaceDetails] = useState(false);
  // const {
    // userRoles,
  // } = useSelector((state) => state.config);

  const companyTzDate = moment(getCompanyTimeZoneDate()).format('YYYY-MM-DD HH:mm:ss');
  const companyTimeZoneDate = getUtcDate(companyTzDate, 'YYYY-MM-DD HH:mm:ss');
  const currentDate = getUtcDate(companyTzDate, 'YYYY-MM-DD');
  const currentCompanyTime = getCurrentCompanyTime(userInfo.data && userInfo.data.company.timezone, 'YYYY-MM-DD HH:mm:ss');
  const companyTimeZone=userInfo &&userInfo.data && userInfo.data.company&&userInfo.data && userInfo.data.company.timezone

  useEffect(() => {
    if (dateReset) {
      dateUpdate([todayDate, todayDate]);
    }
  }, [dateReset]);
  useEffect(() => {
    if (userRoles && userRoles.data) {
      dispatch(removeSaveDataToSpaceView());
      if (userRoles.data.isExcludedUser === true) {
        setExcludeUser(true);
        setNoLimit(true);
      } else {
        setExcludeUser(false);
        setNoLimit(false);
      }
    }
  }, [userRoles]);

  const onDateUpdate = (date) => {
    if (bookingItem && bookingItem.shift) {
      getSite({
        ...siteData,
        siteInfo: {
          id: bookingItem && bookingItem.shift
            ? bookingItem && bookingItem.shift.id : undefined,
          name: bookingItem && bookingItem.shift
            ? bookingItem && bookingItem.shift.name : undefined,
          planned_in: bookingItem.planned_in ? bookingItem.planned_in : undefined,
          planned_out: bookingItem.planned_out ? bookingItem.planned_out : undefined,
        },
      });
    } else if (bookingData && filter) {
      getSite({
        ...siteData,
        siteInfo: bookingData.site,
      });
    } else {
      getSite({
        ...siteData,
        siteInfo: '',
      });
    }
    dateUpdate(date);
  };

  const onSiteUpdate = (site) => {
    getSite({
      ...siteData,
      siteInfo: site,
    });
  };

  const setWorkStationType = (workstation) => {
    setWorkStationTypeForShift(workstation);
    setQuickSpaceSwitch(false);
  };

  useEffect(() => {
    if (quickSpaceSwitch) {
      setWorkStationTypeForShift('');
    }
  }, [quickSpaceSwitch]);

  useEffect(() => {
    if (bookingInfo && (bookingInfo.site && bookingInfo.date)) {
      setBookingCalendarView(true);
      setWorkStationType(
        bookingInfo.workStationType,
      );
      const formattedDate = convertUtcTimetoCompanyTimeZone(bookingInfo.site.planned_in, undefined, companyTimeZone);
      dateUpdate(new Date(formattedDate));
      getSite({
        ...siteData,
        siteInfo: bookingInfo.site,
      });
    }
  }, [bookingInfo]);

  useEffect(() => {
    if (bookingItem && (bookingItem.rescheduleType === 'date' || bookingItem.rescheduleType === 'site')) {
      setBookingCalendarView(true);
      setWorkStationType(bookingItem.space.category_id);
    } else if (bookingItem && bookingItem.rescheduleType === 'category') {
      setWorkStationTypeForShift(bookingItem.space.category_id);
      getSite({
        ...siteData,
        siteInfo: {
          id: bookingItem.shift.id,
          name: bookingItem.shift.name,
          planned_in: bookingItem.planned_in,
          planned_out: bookingItem.planned_out,
        },
      });
    }
  }, [bookingItem]);

  useEffect(() => {
    if (bookingItem && bookingItem.planned_in) {
      const formattedDate = convertUtcTimetoCompanyTimeZone(bookingItem.planned_in, undefined, companyTimeZone);
      dateUpdate(new Date(formattedDate));
    }
    if (bookingData && filter) dateUpdate(bookingData.date);
  }, [bookingItem]);

  useEffect(() => {
    if (viewType) setViewType(viewType);
  }, [viewType]);

  const nextView = () => {
    setDateReset(false);
    if (siteData.siteInfo && siteData.siteInfo.planned_out && siteData.siteInfo.planned_in) {
      let plannedIn;
      let plannedOut;
      const newPlannedIn = siteData.siteInfo.planned_in.split(' ')[1];
      const newPlannedOut = siteData.siteInfo.planned_out.split(' ')[1];
      if (newPlannedIn && newPlannedOut) {
        siteData.siteInfo.planned_in = siteData.siteInfo.planned_in.split(' ')[1];
        siteData.siteInfo.planned_out = siteData.siteInfo.planned_out.split(' ')[1];
      }
      const plannedInTime = getHourMinSec(siteData.siteInfo.planned_in);
      const plannedOutTime = getHourMinSec(siteData.siteInfo.planned_out);
      const timeDiffInMins = getTimeDifference(plannedInTime, plannedOutTime);
      if (getMomentFormat(calendarDate[0], 'YYYY-MM-DD') === getMomentFormat(calendarDate[1], 'YYYY-MM-DD')) {
        plannedIn = `${getMomentFormat(calendarDate[0], 'YYYY-MM-DD')} ${siteData.siteInfo.planned_in}`;
        plannedOut = getMomentAdd(plannedIn, timeDiffInMins, 'minutes', 'YYYY-MM-DD HH:mm:ss');
      } else {
        plannedIn = `${getMomentFormat(calendarDate[0], 'YYYY-MM-DD')} ${siteData.siteInfo.planned_in}`;
        const plannedoutIn = `${getMomentFormat(calendarDate[1], 'YYYY-MM-DD')} ${siteData.siteInfo.planned_in}`;
        plannedOut = getMomentAdd(plannedoutIn, timeDiffInMins, 'minutes', 'YYYY-MM-DD HH:mm:ss');
      }

      siteData.siteInfo.planned_in = plannedIn;
      siteData.siteInfo.planned_out = plannedOut;

      if (siteData && siteData.siteInfo && siteData.siteInfo.custom_planned_in && siteData.siteInfo.custom_planned_out) {
        let customPlannedIn;
        let customPlannedOut;

        const newCustomPlannedIn = siteData.siteInfo.custom_planned_in.split(' ')[1];
        const newCustomPlannedOut = siteData.siteInfo.custom_planned_out.split(' ')[1];

        if (newCustomPlannedIn && newCustomPlannedOut) {
          siteData.siteInfo.custom_planned_in = siteData.siteInfo.custom_planned_in.split(' ')[1];
          siteData.siteInfo.custom_planned_out = siteData.siteInfo.custom_planned_out.split(' ')[1];
        }
        if (getMomentFormat(calendarDate[0], 'YYYY-MM-DD') === getMomentFormat(calendarDate[1], 'YYYY-MM-DD')) {
          const customPlannedInTime = getHourMinSec(siteData.siteInfo.custom_planned_in);
          const customPlannedOutTime = getHourMinSec(siteData.siteInfo.custom_planned_out);
          const hrs = moment.utc(customPlannedOutTime.diff(customPlannedInTime)).format('HH');
          const min = moment.utc(customPlannedOutTime.diff(customPlannedInTime)).format('mm');
          const sec = moment.utc(customPlannedOutTime.diff(customPlannedInTime)).format('ss');
          const timeDiffInMins = Number(hrs * 60) + Number(min) + Number(sec / 60);

          customPlannedIn = `${getMomentFormat(calendarDate[0], 'YYYY-MM-DD')} ${siteData.siteInfo.custom_planned_in}`;
          customPlannedOut = getMomentAdd(customPlannedIn, timeDiffInMins, 'minutes', 'YYYY-MM-DD HH:mm:ss');
        } else {
          customPlannedIn = `${getMomentFormat(calendarDate[0], 'YYYY-MM-DD')} ${siteData.siteInfo.custom_planned_in}`;
          customPlannedOut = `${getMomentFormat(calendarDate[1], 'YYYY-MM-DD')} ${siteData.siteInfo.custom_planned_out}`;
        }
        const siteCustomPlannedIn = siteData.siteInfo.custom_planned_in.split(':')[0];
        const siteCustomPlannedOut = siteData.siteInfo.custom_planned_out.split(':')[0];
        if (siteCustomPlannedIn && siteCustomPlannedOut && parseInt(siteCustomPlannedIn) > parseInt(siteCustomPlannedOut)) {
          customPlannedOut = getMomentAdd(customPlannedOut, 1, 'days', 'YYYY-MM-DD HH:mm:ss');
        }

        siteData.siteInfo.custom_planned_in = customPlannedIn;
        siteData.siteInfo.custom_planned_out = customPlannedOut;

        const days = moment(siteData.siteInfo.planned_out).diff(moment(siteData.siteInfo.end_date), 'days');

        if (siteData.siteInfo.planned_in !== siteData.siteInfo.start_date && !siteData.siteInfo.fullshift) {
          siteData.siteInfo.planned_in = `${siteData.siteInfo.start_date} ${moment(siteData.siteInfo.planned_in).format('HH:mm:ss')}`;
          siteData.siteInfo.planned_out = `${moment(siteData.siteInfo.end_date).add(days, 'days').format('YYYY-MM-DD')} ${moment(siteData.siteInfo.planned_out).format('HH:mm:ss')}`;
        }
      }
    }

    let bookingInfoObj;
    if (history.location.pathname === '/booking-layout') {
      bookingInfoObj = {
        date: calendarDate, site: siteData.siteInfo, bookingId: bookingItem.id, workStationType, shiftType,
      };
      dispatch(saveCalendarDateInfo(dateRage));
      dispatch(setBookingData(bookingInfoObj));
      openModalWindow();
    } else if (bookingItem && bookingItem.rescheduleType) {
      history.push({
        pathname: '/booking-layout',
      });
      bookingInfoObj = {
        date: calendarDate, site: siteData.siteInfo, bookingId: bookingItem.id, workStationType, shiftType,
      };
      dispatch(setBookingData(bookingInfoObj));
    } else if ((workStationType || enableSpaceBooking) && !bookingCalendarView) {
      setBookingCalendarView(true);
    } else if ((workStationType || enableSpaceBooking) && calendarDate && siteData.siteInfo && !filter && !enableSpaceBooking) {
      history.push({
        pathname: '/booking-layout',
      });
      dispatch(addGuestData(false));
      if (bookingItem && bookingItem.id) {
        bookingInfoObj = {
          date: calendarDate, site: siteData.siteInfo, bookingId: bookingItem.id, workStationType, shiftType,
        };
      } else {
        bookingInfoObj = {
          date: calendarDate, site: siteData.siteInfo, workStationType, shiftType,
        };
      }
      dispatch(saveCalendarDateInfo(dateRage));
      dispatch(setBookingData(bookingInfoObj));
    } else if ((workStationType || enableSpaceBooking) && calendarDate && siteData.siteInfo && !filter && enableSpaceBooking) {
      const spaceObject = selectedQuickSpace;
      let workStation = {};
      if (spaceObject && spaceObject.space_category && spaceObject.space_category.id && categories && categories.data && categories.data.length) {
        workStation = categories.data.find((categ) => categ.id === spaceObject.space_category.id);
      }
      bookingInfoObj = {
        date: calendarDate, site: siteData.siteInfo, workStationType: workStation, shiftType,
      };
      const dates = [];
      const days = getMomentDiff(calendarDate[1],calendarDate[0], 'days');
      const bookingDate = getMomentFormat(calendarDate[0], 'YYYY-MM-DD');
      for (let i = 0; i <= days; i += 1) {
        let obj = {
        };
        const plannedIn = `${getMomentAdd(calendarDate[0], i, 'days', 'YYYY-MM-DD')} ${siteData.siteInfo.planned_in.split(' ')[1]}`;
        let plannedOut = `${getMomentAdd(calendarDate[0], i, 'days', 'YYYY-MM-DD')} ${siteData.siteInfo.planned_out.split(' ')[1]}`;
        if (userRoles.data.booking.buffer_period_mins) {
          plannedOut = getMomentSub(plannedOut, userRoles.data.booking.buffer_period_mins, 'minutes','YYYY-MM-DD HH:mm:ss');
          Object.assign(obj, { plannedOut });
        }
        obj = {
          planned_in: utcConverter(plannedIn, 'YYYY-MM-DD HH:mm:ss', companyTimeZone),
          planned_out: utcConverter(plannedOut, 'YYYY-MM-DD HH:mm:ss', companyTimeZone),
        };
        if (i === 0 && currentDate === bookingDate && companyTimeZoneDate >= plannedIn) {
          const newPlannedIn = utcConverter(currentCompanyTime, 'YYYY-MM-DD HH:mm:ss', companyTimeZone);
          Object.assign(obj, { planned_in: newPlannedIn });
          dates.push(obj);
        } else {
          dates.push(obj);
        }
      }
      spaceObject.multidaysBookings = dates;
      spaceObject.employee = userInfo.data.employee;
      setBookingSpaceDetails([spaceObject]);
      dispatch(saveCalendarDateInfo(dateRage));
      dispatch(setBookingData(bookingInfoObj));
      setShowConfirmModal(true);
    } else if (!siteData.siteInfo) {
      const dateAndSiteErrmessage = (
        <div className="text-center text-danger">
          Please Select a Shift
        </div>
      );
      setdateSiteErrMsg(dateAndSiteErrmessage);
    } else if (filter) {
      bookingInfoObj = {
        date: calendarDate, site: siteData.siteInfo, viewType: selectedViewType, shiftType,
      };
      dispatch(saveCalendarDateInfo(dateRage));
      dispatch(setBookingData(bookingInfoObj));
      openModalWindow();
      return <BookingLayout />;
    }
    return undefined;
  };

  const setSelectedSpaceList = (space) => {
    setSelectedQuickSpace(space);
  }

  useEffect(() => {
    if (!quickSpaceSwitch) {
      setSelectedQuickSpace('');
    }
  }, [quickSpaceSwitch]);

  const backToPrevious = () => {
    if (!showConfirmModal) {
      setDateReset(true);
      setBookingCalendarView(false);
      getSite({
        ...siteData,
        siteInfo: '',
      });
      setWorkStationTypeForShift('');
      setShowConfirmModal(false);
    } else {
      setShowConfirmModal(false);
      getSite({
        ...siteData,
        siteInfo: '',
      });
      setBookingSpaceDetails(false);
      dispatch(setBookingData({}));
    }
  };
  useEffect(() => {
    if (enableSpaceBooking) {
      setWorkStationTypeForShift('');
    }
  }, [enableSpaceBooking]);
  useEffect(() => {
    if (workStationType && workStationType.name && !bookingCalendarView) {
      setEnableSpaceBooking(false);
    }
  }, [workStationType]);
  const saveBooking = () => {
    const bookSpaceData = multidayBookingObj(bookingSpaceDetails, bookingInfo, userInfo, null, 'individual', null, userInfo.data.employee);
    if (bookSpaceData && bookSpaceData.length) dispatch(saveMultidaysBookingData(bookSpaceData));
  };
  const closeModalWindow = () => {
    openModalWindow();
    if (!filter) {
      dispatch(setBookingData({}));
      dispatch(resetBooking());
    }
  };

  useEffect(() => {
    if (workStationType && workStationType.multi_day_booking_limit === 0) {
      if (userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.multi_day_booking_limit) {
        setLimit(userRoles.data.booking.multi_day_booking_limit);
      }
    } else if (workStationType && workStationType.multi_day_booking_limit > 0) {
      setLimit(workStationType.multi_day_booking_limit);
    } else {
      setLimit(0);
    }
  }, [workStationType]);

  return (
    <Modal size="lg" centered backdrop="false" className={!showConfirmModal ? 'bookingModalWindowHeight booking-modal-window' : 'booking-modal-window'} isOpen={shiftModalWindowOpen} toggle={openModalWindow}>
      <ModalBody>
        <Row>
          <Col sm="12" xs="12" md="12" lg="12" className="">
            <div className="d-flex justify-content-between">
              {!showConfirmModal && (
                <div className="d-flex">
                  <img src={BookingProcessBlueIcon} alt="BookingProcessBlueIcon" width="40" height="40" className="mr-2" />
                  <div>
                    <div className="mb-0 font-weight-900 title">
                      Book Meeting Room / Desk / Office
                    </div>
                    {workStationType && bookingCalendarView && (
                      <div className="light-text">
                        Please select a date of a booking and available shift.
                      </div>
                    )}
                    {!bookingCalendarView && (
                      <div className="light-text">
                        Please choose your workspace
                      </div>
                    )}
                  </div>
                </div>
              )}
              {showConfirmModal && (multidaysBookingInfo && multidaysBookingInfo.data ? (
                <Row className="m-0">
                  <Col sm="12" xs="12" md="12" lg="12" className="ml-2">
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
              ) : (
                <Row className="m-0">
                  <Col sm="12">
                    <h2 className="font-weight-700">Confirm Booking</h2>
                  </Col>
                </Row>
              ))}
              {(multidaysBookingInfo && !(multidaysBookingInfo.data || multidaysBookingInfo.err)) && (
                <div>
                  <CancelButtonGrey className="float-right" openCloseModalWindow={closeModalWindow} />
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          {(!(workStationType || enableSpaceBooking) || !bookingCalendarView || bookingItem.rescheduleType === 'category') && (bookingInfo && !bookingInfo.workStationType) && (
            <Col sm={{ size: 10, offset: 1 }} className="pl-0 py-5">
              <WorkStationTypes
                workStationType={workStationType}
                setWorkStationType={setWorkStationType}
                bookingItem={bookingItem}
                changeDate={changeDateRange}
              />
              {workStationType && workStationType.display_text && (
                <div className="mt-3 workStation-alert ml-3 mb-0">
                <Grid item>
                  <br />
                  <h6 className="font-weight-800">
                  {workStationType.name}
                  {' '}
                   Alert :
                  {' '}
                  </h6>
                  <span className='ml-2'>
                    {' '}
                    {workStationType.display_text ? workStationType.display_text : ""}
                  </span>
                </Grid>
              </div>
              )}
              {!filter && userInfo && userInfo.data && userInfo.data.spaces && userInfo.data.spaces.length ? (
                <><div className="mt-2 ml-3 mb-0">
                  <p>
                    select to book your reserved/allotted space
                  </p>
                </div><Row className='m-0'>
                    <Switch color="primary" checked={quickSpaceSwitch} onClick={() => { setQuickSpaceSwitch(!quickSpaceSwitch); }} id="spaceEdit" className="float-left" />
                  </Row><div className='m-1 ml-3'>Enable to book your reserved/allotted space</div><>
                    {quickSpaceSwitch ? (
                      <div className={userInfo && userInfo.data && userInfo.data.spaces && userInfo.data.spaces.length > 2 ? "mt-2 col-6 ml-2 thin-spacelist" : "mt-2 col-6"}>
                        {userInfo && userInfo.data && userInfo.data.spaces && userInfo.data.spaces.length && userInfo.data.spaces.map((space) => (
                          <Row
                            className={`mt-2 mr-1 bg-azure cursor-pointer ${selectedQuickSpace.space_name === space.space_name ? 'border-color-manatee-1px border-radius-2px b-r-sm' : ''}`}
                            onClick={() => { setSelectedSpaceList(space); setEnableSpaceBooking(true); }}
                          >
                            <Typography component="div" className="mt-2 ml-4 ml-md-0">
                              <Grid className="ml-2 fs-6" component="label" container alignItems="center">
                                <Grid item>
                                  Space Name :
                                  {' '}
                                  <span className="font-weight-800">
                                    {' '}
                                    {space.space_name}
                                  </span>
                                  <br />
                                  Location :
                                  {' '}
                                  <span className="font-weight-800">
                                    {' '}
                                    {space.path_name}
                                  </span>
                                </Grid>
                              </Grid>
                            </Typography>
                          </Row>
                        ))}
                      </div>
                    ) : ('')}
                  </></>
              ) : ''}
            </Col>
          )}
          {(((workStationType || enableSpaceBooking) && bookingCalendarView && !showConfirmModal) || ((bookingItem.rescheduleType === 'date' || bookingItem.rescheduleType === 'site') && !showConfirmModal) || (bookingInfo && bookingInfo.site && bookingInfo.date && !showConfirmModal)) && (
            <>
              <Col lg={{ size: 6 }} sm={{ size: 12 }} className="" md="12" xs="12">
                <div className="height-270">
                  <BookingCalendar
                    bookingItem={bookingItem}
                    bookingData={bookingData}
                    onDateUpdate={onDateUpdate}
                    workStationType={workStationType}
                    forExcludeuser={noLimit}
                    limit={limit}
                    siteData={siteData}
                    date={dateRage}
                    changeDate={changeDateRange}
                  />
                </div>
                <Row className="mt-1 mx-2">
                  <Row>
                    <Col sm="12" className="mb-2 d-flex text-black">
                      <img src={calendarIcon} height="20" width="20" alt="bulb" className="mr-2" />

                      To book for a single day, double click on the date.
                    </Col>
                    <Col sm="12" className="text-blue d-flex">
                      <img src={blueCalendarIcon} className="mt-1 mr-2" height="20" width="20" alt="bulb" />
                      To book for multiple days, click on the start date, drag over the dates and click on end date.
                    </Col>
                  </Row>
                  {!excludeUser && limit !== 0 && (
                    <Row>
                      <Col sm="1" className="pl-0">
                        <img src={greenBulb} className="mb-1 ml-3" height="20" width="20" alt="bulb" />
                      </Col>
                      <Col sm="11" className="text-success">
                        You are allowed to book only for
                        <b className="mx-1">
                          {limit}
                        </b>
                        days.
                      </Col>
                    </Row>
                  )}
                </Row>
              </Col>
              <Col lg="6" sm="12" md="12" xs="12" className="margin-left-15px">
                <BookingShifts
                  workStationType={workStationType}
                  calendarDate={calendarDate}
                  onSiteUpdate={onSiteUpdate}
                  bookingItem={bookingItem}
                  bookingData={bookingData}
                  siteData={siteData}
                  setShiftType={setShiftType}
                  setWorkStationTypeForShift={setWorkStationTypeForShift}
                  dateUpdate={dateUpdate}
                />
              </Col>
            </>
          )}
        </Row>
        {validateDateAndSite}
        {enableSpaceBooking && showConfirmModal && (
          <>
            <ConfirmBookingModalScreen
              bookingData={bookingInfo}
              selectWorkStation={bookingSpaceDetails}
            />
            {multidaysBookingInfo && multidaysBookingInfo.err && multidaysBookingInfo.err.error && (
              <div className="light-text mt-2 text-center text-danger">
                {multidaysBookingInfo.err.error.message}
              </div>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {(workStationType || enableSpaceBooking) && !filter && bookingCalendarView && (bookingItem && !bookingItem.rescheduleType) && (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {multidaysBookingInfo && !(multidaysBookingInfo.data || multidaysBookingInfo.err) && (
              <Button
                onClick={backToPrevious}
                className="mr-2 back-btn"
                variant="contained" 
              >
                Back
              </Button>
            )}
          </>
        )}
        {showConfirmModal && (multidaysBookingInfo && (multidaysBookingInfo.data || multidaysBookingInfo.err) ? (
          <Button  variant="contained" onClick={() => { closeModalWindow(); dispatch(getBookingsList(userInfo.data && userInfo.data.company.id, userInfo.data && userInfo.data.employee && userInfo.data.employee.id)); }}>OK</Button>
        ) : (
          <Button  variant="contained" onClick={() => saveBooking()}>
            {multidaysBookingInfo && multidaysBookingInfo.loading && (
              <>
                <Spinner size="sm" color="light" data-testid="spinner" />
                <span className="ml-2" />
              </>
            )}
            Confirm
          </Button>
        ))}
        {!showConfirmModal && (
          // <Button
          //   onClick={backToPrevious}
          //   className="mr-2 btnWhisper back-button"
          // >
          //   Back
          // </Button>

          <Button
             variant="contained"
            onClick={nextView}
            disabled={!(workStationType || selectedQuickSpace && selectedQuickSpace.length !== 0) || (multidaysShiftsInfo && multidaysShiftsInfo.loading) || (!siteData.siteInfo && bookingCalendarView)}
            className={siteData.siteInfo ? ' mr-2 next-btn' : 'cursor-disabled mr-2 next-btn'}
          >
            Next
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

BookingModalWindow.propTypes = {
  shiftModalWindowOpen: PropTypes.bool.isRequired,
  openModalWindow: PropTypes.func.isRequired,
  bookingItem: PropTypes.shape({
    planned_in: PropTypes.string,
    planned_out: PropTypes.string,
    id: PropTypes.number,
    shift: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    }),
    date: PropTypes.instanceOf(Date),
    rescheduleType: PropTypes.string,
    space: PropTypes.shape({
      category_id: PropTypes.number,
    }),
  }),
  filter: PropTypes.bool,
  viewType: PropTypes.string,
  bookingData: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    date: PropTypes.array,
    site: PropTypes.shape({}),
  }),
};

BookingModalWindow.defaultProps = {
  bookingItem: {},
  filter: false,
  bookingData: undefined,
  viewType: undefined,
};

export default BookingModalWindow;
