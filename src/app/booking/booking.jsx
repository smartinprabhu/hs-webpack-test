/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip, Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from 'antd';

import { faPhoneAlt, faCheckCircle, faPlusCircle } from '@images/icons/fontAwesomeIcons';
import FontAwesomeIconComponent from '@shared/fontAwesomeIconComponent';
import UserImage from '@shared/userImage';
import userImage from '@images/userProfile.jpeg';
import guestLogo from '@images/guestLogo.png';
import TimeZoneDateConvertor from '@shared/dateTimeConvertor';
import Loading from '@shared/loading';
import DisplayTimezone from '@shared/timezoneDisplay';
import desk from '@images/workstationBlue.ico';
import {
  getListOfOperations, apiURL
} from '../util/appUtils';
import { setBookingsLayoutView } from '../myBookings/service';
import BookingCalendar from './createBooking/calendar';
import BookingModalWindow from './createBooking/bookingModalWindow';
import { getBookingsList, clearErr, getCategoriesOfWorkStations } from './bookingService';
import getBookingAction from '../util/getBookingAction';
import BookingActionButton from './bookingActionButton';
import RescheduleOrCancelBooking from './reScheduleOrCancelBooking/reScheduleOrCancelBookingButton';
import actionCodes from './data/bookingAccess.json';

import ErrorContent from '../shared/errorContent';
import './booking.scss';
import BookingLabel from './bookingLabel';
import AuthService from '../util/authService';
import getUserDetails from '../user/userService';

const appConfig = require('@app/config/appConfig').default;

const Booking = () => {
  const dispatch = useDispatch();

  const [isOpen, openCloseModal] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState(false);
  const [modalWindowBookingView, changeViews] = useState({
    component: '',
  });
  const [bookingStatus, setBookingStatus] = useState(false);
  const [date, changeDate] = useState(new Date());
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { bookingList, categories } = useSelector((state) => state.bookingInfo);
  const { pinEnableData } = useSelector((state) => state.auth)
  // const { userRoles } = useSelector((state) => state.config);
  const { updateImage } = useSelector((state) => state.userProfile);

  const authService = AuthService();

  const isBookingAction = (bookingItem) => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      return getBookingAction(bookingItem, userRoles.data, userInfo.data.company.timezone);
    } return undefined;
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && !bookingStatus) {
      dispatch(getBookingsList(userInfo.data.company.id, userInfo.data.employee.id));
      setBookingStatus(true);
    }
  }, [userInfo]);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if (date) {
      changeViews({
        ...modalWindowBookingView,
        component: (
          <BookingCalendar />
        ),
      });
    }
  }, [date]);

  // useEffect(() => {
  //   if (updateImage && updateImage.data) {
  //     dispatch(getUserDetails(authService.getAccessToken()));
  //   }
  // }, [updateImage]);

  const onChange = (newDate) => changeDate(newDate);

  const openModalWindow = (bookingItem) => {
    setSelectedBookingItem(bookingItem);
    openCloseModal(!isOpen);
    dispatch(setBookingsLayoutView(null));
  };
  useEffect(() => {
    dispatch(getCategoriesOfWorkStations());
  }, []);
  const bookingActionComplete = () => {
    dispatch(getBookingsList(userInfo.data.company.id, userInfo.data.employee.id));
    dispatch(clearErr());
  };

  let myBookingModal;
  if (isOpen) {
    myBookingModal = (
      <BookingModalWindow
        shiftModalWindowOpen={isOpen}
        openModalWindow={openModalWindow}
        bookingItem={selectedBookingItem}
      />
    );
  }
  const getCategory = (space) => {
    if (categories && categories.data && categories.data.length && space && space.category_id && space.category_id.id) {
      const category = categories.data.find((categ) => categ.id === space.category_id.id);
      if (category) {
        return (
          <>
            <Tooltip title={category.name} placement="right" overlayInnerStyle={{margin: '0rem !important', fontSize: '12px'}}>
              <img src={`${apiURL}${category.file_path}`} height="30" className="mt-1" width="30" alt="category" id="category" />
            </Tooltip>
          </>
        );
      }
    }
    return (
      <img src={desk} height="30" className="mt-1" width="25" alt="space category" id="category" />
    );
  };
  const getTitle = (visitor) => (
    <>
      {visitor && visitor.visitor_id && visitor.visitor_id.length ? visitor.visitor_id.map((guest) => (
        <div key={guest.id}>
          <p className='font-size-12px guestTooltip'>
            Guest Name:
            {' '}
            {guest.name}
          </p>
          <p className='font-size-12px guestTooltip'>
            Email:
            {' '}
            {guest.email && guest.email.email}
          </p>
        </div>
      )) : (
        <p className='font-size-12px guestTooltip'>Guest record has been deleted</p>
      )}
    </>
  );
  const getVisitor = (visitor) => {
    if (visitor && visitor.is_guest) {
      return (
        <>
          <Tooltip title={getTitle(visitor)} target="Guest" placement={visitor && visitor.visitor_id && visitor.visitor_id.length ? "right" : "top"} className='font-weight-100'>
            <img src={guestLogo} className={visitor && visitor.visitor_id && visitor.visitor_id.length ? "ml-1" : "ml-1 guestTooltipm"} height="20" width="25" alt="Guest" id="Guest" />
          </Tooltip>
        </>
      );
    }
    return '';
  };
  const bookMeetingButton = (
    <span>
      <Tooltip placement="top" target="bookMeetingOrDesk" title="Book Meeting Room/Desk/Office">
        <Button  variant="contained" size="sm" onClick={openModalWindow} id="bookMeetingOrDesk" className="mt-n2 font-small">
          <FontAwesomeIconComponent faIcon={faPlusCircle} iconStyles="mr-1" />
          {bookingList && bookingList.data && bookingList.data.length > 0
            ? <span>BOOK</span> : <span>BOOK MEETING ROOM / DESK / OFFICE</span>}
        </Button>
      </Tooltip>
    </span>
  );

  const currentDate = moment().format('LLLL');

  return (
    <div className="bg-azure h-100 rounded p-3 booking dashboardTileHeight">
      {!bookingList.loading && userInfo && userInfo.data && userInfo.data.company && (
        <>
          <Row className="mx-0">
            <Col sm="2" md="2" lg="2" xs="3" className="pl-0">
              {userInfo && (
                <span className="image-border">
                  <UserImage imageStyle="border-radius-50 dashboard-user-image user-circle" imageUrl={userInfo && userInfo.data.image_url ? `${userInfo.data.image_url}?${Date.now()}` : userImage} />
                </span>
              )}
            </Col>
            <Col sm="10" md="10" lg="10" xs="9" className="pl-0 d-flex align-items-center">
              <h1 className="mt-2 greeting-text heading-text">
                {' '}
                Hello
                <span className="ml-2">
                  {userInfo.data.name}
                  !
                </span>
              </h1>
            </Col>
          </Row>
          <Row className="dasboard-bookings mx-0 mt-3">
            <Col xs="12" sm="7" md="8" lg="8" className="h-275 pl-0 mt-2 pr-2">
              <Card className="rounded noBorder h-100">
                <CardBody className="p-2">
                  <Row className="mr-0">
                    <Col xs="2" sm="2" md="2" lg="2" xl="2" className="text-center">
                      { userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent
                        ? ' ' : (
                          <Card className="date-card bg-white border-azure-1px border-radius75 pt-2 br-8px card-height ">
                            <small className="text-light-cloud-burst font-size-xsmall">
                              <TimeZoneDateConvertor date={date} format="dddd" />
                            </small>
                            <span className="text-mandy font-size-16 mb-0">
                              <TimeZoneDateConvertor date={date} format="DD" />
                            </span>
                          </Card>
                        )}
                    </Col>
                    <Col xs="10" sm="10" md="10" lg="10" xl="10" className="px-1">
                      <div className="mt-2">
                        {userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent
                          ? <div className="mt-4" /> : (
                            <>
                              <span className="h3 font-weight-700 myBookings">MY BOOKINGS</span>
                              {allowedOperations.includes(actionCodes.Book)
                          && bookingList
                          && bookingList.data
                          && bookingList.data.length > 0
                          && userRoles && userRoles.data && (
                            <span className="float-right">
                              {bookMeetingButton}
                            </span>
                              )}
                              <hr className=" mt-2" />
                            </>
                          )}
                      </div>
                      {bookingList && bookingList.data && bookingList.data.length === 0
                        && userRoles && userRoles.data && (!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent && userInfo.data.company.is_parent)) && (
                        <>
                          {userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent ? '' : (
                            <span className="light-text mt-1">You have no scheduled booking for today.</span>
                          )}
                        </>
                      )}

                    </Col>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                      {userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent
                        && (
                          <>
                            <span className="text-info text-center parentsite-headertext d-block mt-5 ">Welcome to NTT DATA!</span>
                            <span className="text-info text-center d-block parentsite-headertext mt-1">Please select the NTT DATA Site (in the upper right hand corner) where you wish to reserve Office Space.</span>
                            <span className="text-info text-center parentsite-headertext d-block mt-1">Applicable for Employees and Contractors on-boarded in NTT DATA Navigator.</span>
                          </>
                        )}
                    </Col>
                  </Row>
                  {bookingList && bookingList.data && bookingList.data.length
                    ? (
                      <div className={bookingList.data.length > 5 ? 'd-flex h-220' : 'd-flex bookingScrollbar'}>
                        <table className="table table-striped font-small mr-1 mt-1">
                          <tbody>
                            {bookingList.data.map(((bookingItem) => (
                              <tr key={bookingItem.id} className="bookingListTableBorder spaceUnder">
                                <td>
                                  {getVisitor(bookingItem.visitor)}
                                  {getCategory(bookingItem.space)}
                                </td>
                                <td className=" workspace-details text-uppercase">
                                  <TimeZoneDateConvertor date={bookingItem.planned_in} format="D MMM YYYY LT" />
                                  {' '}
                                  <DisplayTimezone />
                                  {' '}
                                  {' '}
                                  <br />
                                  <TimeZoneDateConvertor date={bookingItem.planned_out} format="D MMM YYYY LT" />
                                  {' '}
                                  <DisplayTimezone />
                                  <br />
                                  {' '}
                                  SHIFT
                                  {' '}
                                  {bookingItem.shift.name}
                                  {' '}
                                  |
                                  {' '}
                                  {bookingItem.space.space_name}
                                </td>
                                <td className="float-right">
                                  {isBookingAction(bookingItem) && isBookingAction(bookingItem).length === 2 && isBookingAction(bookingItem)[1] === undefined ? (
                                    <RescheduleOrCancelBooking
                                      bookingItem={bookingItem}
                                      openRescheduleModalWindow={openModalWindow}
                                      cancelBookingActionComplete={bookingActionComplete}
                                    />
                                  ) : (
                                    <BookingActionButton
                                      bookingItem={bookingItem}
                                      bookingActionComplete={bookingActionComplete}
                                      openRescheduleModalWindow={openModalWindow}
                                    />
                                  )}
                                </td>
                                <td className="float-right">
                                  <BookingLabel bookingItem={bookingItem} />
                                </td>
                              </tr>
                            )
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                    : (
                      <div className="text-center">
                        {allowedOperations.includes(actionCodes.Book)
                          && userRoles
                          && userRoles.data && (!(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent && userInfo.data.company.is_parent)) ? (
                            <div className="text-center mt-6">
                              {bookMeetingButton}
                            </div>
                          ) : (
                            <div className="text-center mt-6">
                              {userRoles && userRoles.err && userRoles.err.error && (
                              <div className="text-danger">
                                Not Configured Check Admin/HR
                              </div>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" sm="5" lg="4" md="4" className="important-contacts rounded p-2 mt-2 pt-3 h-275">
              <h4 className="mb-3">
                <FontAwesomeIconComponent faIcon={faPhoneAlt} />
                <span className="ml-2 font-weight-800">IMPORTANT CONTACTS</span>
              </h4>
              {userRoles && userRoles.data && userRoles.data.important_contacts && userRoles.data.important_contacts.length && userRoles.data.important_contacts.length > 0 ? (userRoles.data.important_contacts.map((contactDet) => (
                <div key={contactDet.id} className="pl-2 mt-2">
                  <div className="font-weight-700 contacts">{contactDet.name}</div>
                  <div className="font-weight-400 contacts">{contactDet.contact_person}</div>
                  <div className="font-weight-400">
                    <span className="light-text contacts">{contactDet.phone}</span>
                  </div>
                  <div className="light-text contacts">{contactDet.mobile}</div>
                  <div className="font-weight-400 contacts">{contactDet.email}</div>
                  <div className="light-text contacts">{contactDet.street ? `${contactDet.street},` : ''}</div>
                  <div className="light-text contacts">{contactDet.street2 ? `${contactDet.street2},` : ''}</div>
                  <div className="light-text contacts">{contactDet.city ? `${contactDet.city},` : ''}{contactDet.state_id ? `${contactDet.state_id},` : ''}</div>
                  <div className="light-text contacts">{contactDet.country_id ? `${contactDet.country_id}.` : ''}</div>
                  <div
                    className="font-weight-400 font-11"
                    dangerouslySetInnerHTML={{ __html: contactDet.comment }}
                  />
                  <hr className="my-2" />
                </div>
              ))) : (userInfo && userInfo.data && !userInfo.data.loading && (
              <div className="mt-6 text-danger text-center">
                <ErrorContent bookingDashboard={pinEnableData ? true : false} errorTxt="No contacts Found." />
              </div>
              ))}
            </Col>
          </Row>
          {myBookingModal}
        </>
      )}
      {
        (!userInfo || bookingList.loading) && (
          <div className="text-center m-5">
            <Loading />
          </div>
        )
      }
    </div>
  );
};

export default Booking;
