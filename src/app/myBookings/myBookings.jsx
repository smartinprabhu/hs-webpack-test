/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Row, Col, Card, CardBody, UncontrolledTooltip,
} from 'reactstrap';
import Button from '@mui/material/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment-timezone';
import { Tooltip } from 'antd';

import building from '@images/buidlingIcon.ico';
import clock from '@images/myBookingsBlue.ico';
import desk from '@images/workstationBlue.ico';
import closeIcon from '@images/icons/circleClose.svg';
import guestLogo from '@images/guestLogo.png';
import bookingProcess from '@images/bookingProcessBlue.ico';
import screening from '@images/screening.ico';
import { TimeZoneDateConvertor, convertUtcTimetoCompanyTimeZone, getCompanyTimeZoneDate } from '@shared/dateTimeConvertor';
import DisplayTimezone from '@shared/timezoneDisplay';
import unavailable from '@images/unavailable.png';

import getBookingAction from '../util/getBookingAction';
import BookingModalWindow from '../booking/createBooking/bookingModalWindow';
import BookingActionButton from '../booking/bookingActionButton';
import BookingLabel from '../booking/bookingLabel';

import RescheduleOrCancelBooking from '../booking/reScheduleOrCancelBooking/reScheduleOrCancelBookingButton';
import { clearErr, clearBookingInfo, getCategoriesOfWorkStations } from '../booking/bookingService';
import getBookingsList, { getScheduledBookingsList, setBookingsLayoutView } from './service';
import './myBookings.scss';
import actionCodes from './data/myBookingsAccess.json';
import {
  getListOfOperations, apiURL,
} from '../util/appUtils';
import SpaceNavbar from '../spaceManagement/navbar/spaceNavbar';
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const appConfig = require('@app/config/appConfig').default;

const MyBookings = () => {
  const spaceSubMenu = 'My Bookings';
  const { bookingsList } = useSelector((state) => state.myBookings);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.config);
  const { categories } = useSelector((state) => state.bookingInfo);
  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company.timezone

  const dispatch = useDispatch();
  let todayCalendarDate;
  todayCalendarDate = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? moment(new Date()).tz(companyTimeZone).format('YYYY-MM-DD HH:mm:ss') : '';
  todayCalendarDate = todayCalendarDate.split(' ');
  todayCalendarDate = todayCalendarDate && todayCalendarDate[0];
  const todayCalendarBackground = {
    start: todayCalendarDate,
    end: todayCalendarDate,
    overlap: true,
    display: 'background',
    color: '#ff9f89',
  };
  let eventArray = [];
  eventArray.push(bookingsList);
  eventArray.push(todayCalendarBackground);
  eventArray = eventArray.flat();
  useEffect(() => {
    const monthStart = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getBookingsList(userInfo.data && userInfo.data.company.id, userInfo.data.employee.id, monthStart));
      dispatch(clearBookingInfo());
    }
  }, [userInfo]);
  const [showPanel, setShowPanel] = useState(false);
  const [bookButtonInfinite, setBookButtonInfinite] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState();
  const [previousData, setpreviousData] = useState([]);

  const [panelBookingData, setPanelData] = useState({
    planned_in: '',
    planned_out: '',
    space: {
      name: '',
    },
    shift: {
      name: '',
    },
    company: {
      name: '',
      id: '',
    },
    id: '',
  });
  const [openAlert, setOpenAlert] = useState(false);

  const [shiftModalOpen, shiftModalWindowSet] = useState(false);
  const endDate = moment(new Date(moment().add(userRoles && userRoles.data && userRoles.data.booking && userRoles.data.booking.future_limit_days, 'days')));
  const bookingValidRange = {
    start: getCompanyTimeZoneDate(),
    end: endDate.subtract(1, 'day'),
  };

  const shiftModalSet = (bookingItem) => {
    setSelectedBookingItem(bookingItem);
    shiftModalWindowSet(!shiftModalOpen);
    dispatch(setBookingsLayoutView(true));
  };

  const allowedOperations = getListOfOperations(userRoles && userRoles.data && userRoles.data.allowed_modules ? userRoles.data.allowed_modules : [], 'code');

  const handleEventClick = (panelData) => {
    setShowPanel(true);
    if (panelData && panelData.event && panelData.event._def
      && panelData.event._def.extendedProps) {
      const data = panelData.event._def.extendedProps;

      setPanelData({ ...data, id: parseInt(panelData.event._def.publicId, 10) });
      if (moment(bookingValidRange.start).isBefore(convertUtcTimetoCompanyTimeZone(data.planned_in, 'YYYY-MM-DD HH:mm:ss', companyTimeZone)));
    }

    setpreviousData([...previousData, panelData]);
    if (previousData.length) {
      const index = previousData.length - 1;
      const data = previousData[index];
      data.el.style.backgroundColor = '';
    }
    // eslint-disable-next-line no-param-reassign
    panelData.el.style.backgroundColor = '#3a4354';
  };

  const hidePanelData = () => {
    setShowPanel(false);
  };

  let shiftModalWindowSecreen;
  if (shiftModalOpen) {
    shiftModalWindowSecreen = (
      <BookingModalWindow
        shiftModalWindowOpen={shiftModalOpen}
        openModalWindow={shiftModalSet}
        bookingItem={selectedBookingItem}
      />
    );
  }

  const bookingActionComplete = () => {
    const monthStart = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
    dispatch(getBookingsList(userInfo.data && userInfo.data.company.id, userInfo.data.employee.id, monthStart));
    dispatch(clearErr());
    setShowPanel(false);
  };

  const isBookingAction = (bookingItem) => (
    getBookingAction(bookingItem, userRoles.data, companyTimeZone));

  const isReleased = (bookingActions) => {
    if (bookingActions && bookingActions.length === 1 && bookingActions[0] === 'RELEASED') {
      return true;
    } if (bookingActions && bookingActions.length === 2 && bookingActions[1] === 'RELEASED') {
      return true;
    } return false;
  };

  if (bookingsList && bookingsList.length) {
    bookingsList.forEach((booking) => {
      // eslint-disable-next-line no-param-reassign
      booking.title = booking.shift && booking.shift.name ? `${booking.space.space_name}-${booking.shift.name}` : `${booking.space.space_name}`;
      booking.is_guest = booking && booking.visitor && booking.visitor && booking.visitor.is_guest;
      // booking.date = booking.planned_in;
      // eslint-disable-next-line no-param-reassign
      // booking.className = ["event", "greenEvent"]
      booking.className = booking && booking.visitor && booking.visitor && booking.visitor.is_guest ? ['event', 'guestEvent'] : ['event', 'employeeEvent'];
      booking.date = convertUtcTimetoCompanyTimeZone(booking.planned_in, 'YYYY-MM-DD HH:mm:ss', companyTimeZone);
    });
  }

  let plannedInTime;
  let plannedOutTime;

  if (panelBookingData && panelBookingData.planned_in) {
    plannedInTime = convertUtcTimetoCompanyTimeZone(panelBookingData.planned_in, 'dddd, D MMMM  YYYY', companyTimeZone);
  }
  if (panelBookingData && panelBookingData.planned_in) {
    plannedOutTime = convertUtcTimetoCompanyTimeZone(panelBookingData.planned_out, 'dddd, D MMMM  YYYY', companyTimeZone);
  }
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const setBooking = (data) => {
    dispatch(setBookingsLayoutView(true));
    const checkDateexistence = moment(moment(data.dateStr).format('YYYY-MM-DD')).isBetween(moment(bookingValidRange.start).format('YYYY-MM-DD'), moment(bookingValidRange.end).format('YYYY-MM-DD'));
    const checkDateIsSameForStart = moment(moment(data.dateStr).format('YYYY-MM-DD')).isSame(moment(bookingValidRange.start).format('YYYY-MM-DD'));
    const checkDateIsSameForEnd = moment(moment(data.dateStr).format('YYYY-MM-DD')).isSame(moment(bookingValidRange.end).format('YYYY-MM-DD'));
    if (checkDateIsSameForStart || checkDateIsSameForEnd || checkDateexistence) {
      shiftModalSet(data);
    } else {
      setOpenAlert(true);
    }
  };

  const getPreviousData = (data) => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      const startTime = moment(data.startStr).format('YYYY-MM-DD HH:mm');
      const endTime = moment(data.endStr).format('YYYY-MM-DD HH:mm');
      dispatch(getScheduledBookingsList(userInfo.data && userInfo.data.company.id, userInfo.data.employee.id, startTime, endTime));
    }
  };
  console.log(allowedOperations.includes(actionCodes.Book), 'allowedOperations.includes(actionCodes.Book)')
  useEffect(() => {
    if (userRoles && userRoles.data && userRoles.data.isExcludedUser === true) {
      setBookButtonInfinite(true);
    } else {
      setBookButtonInfinite(false);
    }
  }, [userRoles]);
  (allowedOperations, 'allowedOperations');
  // eslint-disable-next-line react/no-unstable-nested-components
  const EventDetail = (args) => {
    args.dateStr = moment(args.date).format('YYYY-MM-DD');
    return (bookButtonInfinite ? (
      <>
        <div className="float-right">{moment(args.date).format('DD')}</div>
        {moment(args.date).format('YYYY-MM-DD') === moment(bookingValidRange.start).format('YYYY-MM-DD') || args.date > bookingValidRange.start
          ? (
            <div>
              {allowedOperations.includes(actionCodes.Book) && (!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent && userInfo.data && userInfo.data.company.is_parent)) && (
                <Button  variant="contained" className="mt-2" size="sm" onClick={() => shiftModalSet(args)} id="bookMeetingOrDesk">
                  <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                  BOOK
                </Button>
              )}
            </div>
          )
          : undefined}
      </>
    )
      : (
        <>
          <div className="float-right">{moment(args.date).format('DD')}</div>
          {moment(args.date).format('YYYY-MM-DD') === moment(bookingValidRange.start).format('YYYY-MM-DD') || args.date > bookingValidRange.start && args.date < bookingValidRange.end
            ? (
              <div>
                {allowedOperations.includes(actionCodes.Book) && (!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent && userInfo.data && userInfo.data.company.is_parent)) && (
                  <Button  variant="contained" className="mt-2" size="sm" onClick={() => setBooking(args)} id="bookMeetingOrDesk">
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                    BOOK
                  </Button>
                )}
              </div>
            )
            : undefined}
        </>
      )
    );
  };
  const getCategory = (space) => {
    if (categories && categories.data && categories.data.length && space && space.category_id && space.category_id.id) {
      const category = categories.data.find((categ) => categ.id === space.category_id.id);
      if (category) {
        return (
          <Tooltip title={category.name} placement="top">
            <img src={`${apiURL}${category.file_path}`} className="margin-negative-left-10px" height="43" width="43" alt="category" id="category" />
          </Tooltip>
        );
      }
      return (
        <img src={desk} className="mr-1 h-29" alt="desk" />
      );
    }
    return (
      <img src={desk} className="mr-1 h-29" alt="desk" />
    );
  };
  useEffect(() => {
    dispatch(getCategoriesOfWorkStations());
  }, []);

  const getTitle = (visitor) => (
    <>
      {visitor && visitor.visitor_id && visitor.visitor_id.length && visitor.visitor_id.map((guest) => (
        <Row className="mx-3" key={guest.id}>
          <Row sm="12" className="mr-2 panelBookingAlign">
            Guest Name:
            {' '}
            {guest.name}
          </Row>
          <Row sm="12" className="mb-2 panelBookingAlign">
            Email:
            {' '}
            {guest.email && guest.email.email}
          </Row>
        </Row>
      ))}
    </>
  );
  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 space-management border">
      <Col sm="12" md="12" lg="12" xs="12">
        <SpaceNavbar id={spaceSubMenu} setCurrentMenuTab={() => { }} />
        <div className="pt-3"></div>
        <Row className="my-bookings m-0">
          <Col sm={showPanel ? '9' : '12'} md={showPanel ? '8' : '12'} lg={showPanel ? '9' : '12'} xl={showPanel ? '9' : '12'}>
            <Row className="">
              <Col className="float-right" sm="12" md="12" lg="12" xs="12">
                <div className="d-flex my-md-3 align-items-center justify-content-end">
                  {(!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent && userInfo.data && userInfo.data.company.is_parent)) && (
                    <div className="booking-detail-color mr-5">
                      <div className="mt-1">
                        <p className="employeeEventIndicator mt-1" />
                      </div>
                      <div className="ml-3">
                        <span>Employee booking</span>
                      </div>
                      <div className="mt-1">
                        <p className="guestEventIndicator mt-1" />
                      </div>
                      <div className="ml-3">
                        <span> Guest booking</span>
                      </div>
                    </div>
                  )}
                  {allowedOperations.includes(actionCodes.Book) && (!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent && userInfo.data && userInfo.data.company.is_parent)) && (
                    <div>
                      <Tooltip placement="top" title="Book Meeting Room/Desk/Office" target="bookMeetingOrDesk">
                        <Button  variant="contained" className="float-right" size="sm" onClick={shiftModalSet} id="bookMeetingOrDesk" data-testid="book">
                          <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                          BOOK
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <FullCalendar
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              dayCellContent={EventDetail}
              eventClick={handleEventClick}
              eventOverlap={false}
              dayHeaderFormat={{ weekday: 'long' }}
              buttonText={{ month: 'Month', week: 'Week', day: 'Day' }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              events={eventArray}
              nextDayThreshold="00:00:00"
              firstDay={1}
              contentHeight={500}
              rerenderDelay={5000}
              selectable
              editable={false}
              initialDate={getCompanyTimeZoneDate()}
              datesSet={getPreviousData}
            />
            <Snackbar open={openAlert} autoHideDuration={2000} onClose={closeAlert} data-testid="closeAlert">
              <Alert onClose={closeAlert} severity="error">
                Please select a vaild date!
              </Alert>
            </Snackbar>
          </Col>
          {showPanel ? (
            <Col sm="3" md="4" lg="3" className="pr-0 mt-1">
              <Card className="h-100">
                <CardBody className="bg-panelColor p-3">
                  <div className="text-hawkes-blue">
                    <span onClick={hidePanelData} className="cursor-pointer" aria-hidden="true" data-testid="close">
                      <img src={closeIcon} height="25" className="ml-n3 mt-n2 image-transform" alt="arrow" aria-hidden="true" />
                      <span className="font-size20 text-grey-30 pl-2 font-weight-700">Close</span>
                    </span>
                  </div>
                  {panelBookingData && panelBookingData.space && panelBookingData.space.space_name
                    && (
                      <Col lg="12">
                        <div className="booking-panel-white p-3 fontSize-15">
                          <span className="font-weight-500">You have booked</span>
                          <br />
                          <h3 className="mb-0">{panelBookingData.space.space_name}</h3>
                        </div>
                        <span className="arrow-down" />
                      </Col>
                    )}
                  <div className="panel-position">
                    <div className="mt-3">
                      <Row>
                        <Col sm="2">
                          {panelBookingData && panelBookingData.planned_in && (plannedInTime !== plannedOutTime)
                            ? (<img src={bookingProcess} className="h-24 bookingProcessAlign" alt="bookingProcess" />) : <img src={bookingProcess} className="h-24 mt-1" alt="bookingProcess" />}
                        </Col>
                        <Col sm="10" className={(plannedInTime !== plannedOutTime) ? '' : 'mt-1 pl-3 panelBookingAlign'}>
                          {panelBookingData && panelBookingData.planned_in
                            && <small className="icon-font" id="planned_in">{plannedInTime}</small>}
                          <br />
                          {panelBookingData && panelBookingData.planned_in && (plannedInTime !== plannedOutTime)
                            ? (<small className="icon-font" id="planned_out">{plannedOutTime}</small>) : ''}
                        </Col>
                        {panelBookingData && panelBookingData.planned_in && (
                          <UncontrolledTooltip placement="top" target="planned_in">
                            planned_in
                          </UncontrolledTooltip>
                        )}
                        {panelBookingData && panelBookingData.planned_in && (plannedInTime !== plannedOutTime)
                          ? (
                            <UncontrolledTooltip placement="top" target="planned_out">
                              planned_out
                            </UncontrolledTooltip>
                          ) : ''}
                      </Row>
                      <hr />
                    </div>
                    <img src={building} className="mr-1 h-28" alt="building" />
                    {panelBookingData && panelBookingData.company && panelBookingData.company.name
                      && <small className={panelBookingData.company.name.length >= 28 ? "icon-font ml-2 pl-3 panelBookingAlign" : "icon-font ml-2 pl-3 panelBookingAlign"}>{panelBookingData.company.name}</small>}
                    <hr />
                    {getCategory(panelBookingData.space)}
                    {panelBookingData && panelBookingData.space && panelBookingData.space.space_name
                      && <small className={panelBookingData.space.space_name.length >= 28 ? "icon-font ml-1 pl-5 panelBookingAlign" : "icon-font ml-1 pl-3 panelBookingAlign"}>{panelBookingData.space.space_name}</small>}
                    <hr />
                    <img src={clock} className="mr-1 h-31 panelBookingAlign" alt="clock" />
                    {panelBookingData && panelBookingData.planned_in && panelBookingData.planned_out
                      && (
                        <small className="icon-font ml-2 panelBookingDataAlign">
                          <TimeZoneDateConvertor date={panelBookingData.planned_in} format="LT" />
                          {' '}
                          <DisplayTimezone />
                          {' '}
                          -
                          {' '}
                          <TimeZoneDateConvertor date={panelBookingData.planned_out} format="LT" />
                          {' '}
                          <DisplayTimezone />
                        </small>
                      )}
                    <hr />
                    {panelBookingData && panelBookingData.visitor && panelBookingData.visitor.is_guest && (
                      <>
                        {panelBookingData.visitor.visitor_id && panelBookingData.visitor.visitor_id.length ? (
                          <Tooltip title={getTitle(panelBookingData.visitor)} target="Guest" placement="top">
                            <img src={guestLogo} className="mr-1 h-24" alt="clock" />
                          </Tooltip>
                        ) : (
                          <img src={guestLogo} className="mr-1 h-24" alt="clock" />
                        )}
                        <small className="icon-font ml-1 pl-3">
                          Guest Booking
                        </small>
                        {!(panelBookingData.visitor.visitor_id && panelBookingData.visitor.visitor_id.length) ? (
                          <div className='font-size-10px'>Guest record has been deleted</div>
                        ) : ''}
                        <hr />
                      </>
                    )}
                    {isBookingAction(panelBookingData) && isBookingAction(panelBookingData).length > 0 && (
                      <>
                        {isBookingAction(panelBookingData) && isBookingAction(panelBookingData).length === 2 && isBookingAction(panelBookingData)[1] === undefined ? (
                          <>
                            {panelBookingData.space.status === 'Maintenance in Progress' && (
                              <span className="label label-danger label-outlined mr-1">
                                <img src={unavailable} height="13" width="13" alt="cancel" className="mr-1" />
                                Space is under maintenance
                              </span>
                            )}
                            <RescheduleOrCancelBooking
                              bookingItem={panelBookingData}
                              openRescheduleModalWindow={shiftModalSet}
                              cancelBookingActionComplete={bookingActionComplete}
                            />
                          </>
                        ) : (
                          <>
                            <Row>
                              <Col lg="2">
                                {!isReleased(isBookingAction(panelBookingData)) && (
                                  <img src={screening} className="h-24" alt="screening" />
                                )}
                              </Col>
                              <Col lg="10" className="pl-3">
                                {!isReleased(isBookingAction(panelBookingData)) && (
                                  <>
                                    {/* <small className="icon-font">
                                You can start with
                                <span className="text-capitalize">
                                  {' '}
                                  {isBookingAction(panelBookingData).length === 1 ? (
                                    <>
                                      {isBookingAction(panelBookingData)[0]}
                                    </>
                                  ) : (
                                    <>
                                      {isBookingAction(panelBookingData)[1]}
                                    </>
                                  )}
                                </span>
                                {' '}
                                {' '}
                                now.
                              </small> */}
                                    <div className="mb-2">
                                      <BookingLabel bookingItem={panelBookingData} />
                                    </div>
                                    <BookingActionButton
                                      bookingItem={panelBookingData}
                                      bookingActionComplete={bookingActionComplete}
                                      openRescheduleModalWindow={shiftModalSet}
                                    />
                                  </>
                                )}
                              </Col>
                            </Row>
                            <Row className="m-0">
                              {isReleased(isBookingAction(panelBookingData)) && (
                                <span>
                                  Released on
                                  {' '}
                                  <TimeZoneDateConvertor date={panelBookingData.actual_out} format="D MMM YYYY LT" />
                                  {' '}
                                  <DisplayTimezone />
                                </span>
                              )}
                            </Row>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : undefined}
          {shiftModalWindowSecreen}
        </Row>
      </Col>
    </Row>
  );
};

export default MyBookings;
