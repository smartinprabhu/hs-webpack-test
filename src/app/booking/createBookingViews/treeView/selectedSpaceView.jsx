/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Button,
} from 'reactstrap';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import momentZone from 'moment-timezone';

import {
  utcConverter,
} from '@shared/dateTimeConvertor';
import calendarImage from '@images/calendar.ico';
import bulb from '@images/bulb.svg';
import Loading from '@shared/loading';
import DisplayTimezone from '@shared/timezoneDisplay';
import buildIcon from '@images/buidlingIcon.ico';
import userLogo from '@images/myGuestsBlue.ico';
import guestLogo from '@images/guestLogo.png';
import { getTimeDifference, getMomentDiff, getMomentFormat, getHourMinSec, getMomentAdd, getMomentSub, getHoursMins, getCurrentCompanyTime, apiURL } from '../../../util/appUtils';
import { setremovedNodeWithEmployee } from '../../bookingService';

import BookingCalendarDayGridComponent from './bookingCalendarDayGridView';
import './selectedSapceView.scss';
import { getCompanyTimeZoneDate, getUtcDate } from '../../../shared/dateTimeConvertor';

const appConfig = require('@app/config/appConfig').default;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 700,
    fontFamily: 'Lato',
  },
  body: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 700,
    fontFamily: 'Lato',
  },
  lightFont: {
    fontWeight: 100,
  },
}));

const SelectedSpaceView = ({
  workSpace, updateWorkSpace, removeAll, colSize, expand, viewType,
  treeViewData, removeNodeWithEmployee, setExpand, setCollapse,
}) => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [selectedWorkSpace, setSelectedWorkSpace] = useState([]);
  const [calendarEvents, setCalendarEventsForTimeline] = useState([]);
  const [collapse, setCollapsed] = useState(false);
  const [removeNode, setRemoveNode] = useState(false);
  const [removeNodeIndex, setRemoveNodeIndex] = useState();
  const {
    bookingInfo, availabilityResponse, multidaysAvailabilityInfo, saveHostInfo, refreshInfo,
  } = useSelector((state) => state.bookingInfo);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.userRoles);

  useEffect(() => {
    if (refreshInfo) {
      setSelectedWorkSpace([]);
    }
  }, [refreshInfo]);

  useEffect(() => {
    if (treeViewData) setSelectedWorkSpace(treeViewData);
  }, [treeViewData]);
  useEffect(() => {
    if (workSpace) setSelectedWorkSpace(workSpace);
  }, [workSpace]);

  useEffect(() => {
    if (selectedWorkSpace && selectedWorkSpace.length > 0) {
      updateWorkSpace(selectedWorkSpace, undefined);
    } else {
      updateWorkSpace([]);
    }
  }, [selectedWorkSpace]);

  const childRef = useRef();

  const removeWorkSpace = (space) => {
    const updatedWorkSpace = [...selectedWorkSpace];
    updatedWorkSpace.map((node, index) => {
      if (space && space.id) {
        if (node.id === space.id) {
          setRemoveNodeIndex(index);
          updatedWorkSpace.splice(index, 1);
        }
      } else if (node.id === workSpace.id) {
        updatedWorkSpace.splice(index, 1);
      }
      return updatedWorkSpace;
    });
    setRemoveNode(true);
    removeNodeWithEmployee(space);
    dispatch(setremovedNodeWithEmployee(space));
    setSelectedWorkSpace(updatedWorkSpace);
    updateWorkSpace(updatedWorkSpace, undefined);
  };

  useEffect(() => {
    if (removeAll) {
      setSelectedWorkSpace([]);
      updateWorkSpace([], undefined);
    }
  }, [removeAll]);

  const [indexForReset, setIndexForReset] = useState();
  const [reset, setReset] = useState();

  const reservationReset = (event, index) => {
    event.stopPropagation();
    setIndexForReset(index);
    setReset(true);
    setSelectedWorkSpace([...selectedWorkSpace]);
    childRef.current.getResetRes(index);
  };

  const expandDetails = (event) => {
    event.stopPropagation();
    setCollapsed(true);
    setExpand(event);
  };

  const collapseDetails = (event) => {
    event.stopPropagation();
    setCollapsed(false);
    setCollapse(event);
  };
  const currentCompanyTime = getCurrentCompanyTime(userInfo.data && userInfo.data.company.timezone, 'YYYY-MM-DD HH:mm:ss');
  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone

  const companyTzDate = moment(getCompanyTimeZoneDate()).format('YYYY-MM-DD HH:mm:ss');
  const companyTimeZoneDate = getUtcDate(companyTzDate, 'YYYY-MM-DD HH:mm:ss');
  const currentDate = getUtcDate(companyTzDate, 'YYYY-MM-DD');

  useEffect(() => {
    if (selectedWorkSpace && selectedWorkSpace.length) {
      const dates = [];
      const days = getMomentDiff(bookingInfo.date[1], bookingInfo.date[0], 'days');
      const bookingDate = getMomentFormat(bookingInfo.date[0], 'YYYY-MM-DD');
      let bookingStartDate = bookingInfo.date[0]
      let bookingEndDate = bookingInfo.date[1]

      if (moment(bookingStartDate) !== moment(bookingInfo.site.planned_in)) {
        bookingStartDate = moment(bookingInfo.site.planned_in)
        bookingEndDate = moment(bookingInfo.site.planned_out)
      }
      for (let i = 0; i <= days; i += 1) {
        let obj = {
        };
        const plannedInTime = getHourMinSec(bookingInfo.site.planned_in.split(' ')[1]);
        const plannedOutTime = getHourMinSec(bookingInfo.site.planned_out.split(' ')[1]);
        const timeDiffInMins = getTimeDifference(plannedInTime, plannedOutTime);
        const plannedIn = `${moment(bookingStartDate).add(i, 'days').format('YYYY-MM-DD')} ${bookingInfo.site.planned_in.split(' ')[1]}`;
        let plannedOut = moment(plannedIn).add(timeDiffInMins, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        if (userRoles.data.booking.buffer_period_mins) {
          plannedOut = getMomentSub(plannedOut, userRoles.data.booking.buffer_period_mins, 'minutes', 'YYYY-MM-DD HH:mm:ss');
          Object.assign(obj, { plannedOut });
        }
        obj = {
          planned_in: utcConverter(plannedIn, 'YYYY-MM-DD HH:mm:ss', companyTimeZone),
          planned_out: utcConverter(plannedOut, 'YYYY-MM-DD HH:mm:ss', companyTimeZone),
        };
        if (i === 0 && currentDate === bookingDate && companyTimeZoneDate >= plannedIn) {
          const planned_in = utcConverter(currentCompanyTime, 'YYYY-MM-DD HH:mm:ss', companyTimeZone);
          Object.assign(obj, { planned_in });
          dates.push(obj);
        } else {
          dates.push(obj);
        }
      }
      if (selectedWorkSpace && selectedWorkSpace.length) {
        const array = [];
        // eslint-disable-next-line array-callback-return
        selectedWorkSpace.map((space) => {
          const spaceObj = space;
          spaceObj.multidaysBookings = dates;
        });
      }
    }
  }, [selectedWorkSpace]);

  const getName = (workstation) => {
    if (workstation && workstation.employee && workstation.employee.is_guest && bookingInfo && bookingInfo.workStationType) {
      return `(Guest) booked by ${saveHostInfo.name}`;
    }
    return '';
  };
  const selectedSpaceForTreeView = (space, index) => (
    <div className={`${classes.root}`}>
      <Row className="m-0 pt-2 selected-space">
        <Col sm="12" className="pb-3 pl-2 scroll thin-scrollbar">
          <Accordion
            defaultExpanded
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography component="div" className={`${classes.heading} ml-2 w-100`}>
                <Row className="mx-1">
                  <Col sm="1" xs="1" md="1" lg="1" className="pl-0 mr-1">
                    <img width="32" src={space.employee && space.employee.type && space.employee.type === 'guest' ? guestLogo : userLogo} alt="User" />
                  </Col>
                  <Col sm="9" xs="8" md="9" lg="9">
                    <span>
                      {space && space.employee && space.employee.name}
                      {' '}
                      <span className="light-text">
                        {getName(space)}
                      </span>
                    </span>
                    <span className={`float-right ${expand ? 'mr-n11rem' : 'mr-n6rem'}`}>
                      <Button color="danger" className="margin-right-15px font-weight-600 px-2 py-1" size="sm" onClick={() => removeWorkSpace(space)}>
                        Remove
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div" className={`${classes.body} pb-3 ml-2 width-98`}>
                <Row className="py-2 ml-1 border-top-1px-azure">
                  <Col sm="1" xs="2" md="1" lg="1" className="pl-0 mr-1 mt-2">
                    <img width="32" src={buildIcon} alt="Building" />
                  </Col>
                  <Col sm="10" xs="9" md="10" lg="10" className="pl-2">
                    <div className="selected-location-text">Selected Location</div>
                    <span className="font-weight-400 font11 text-grey-chateau">
                      {space.path_name}
                    </span>
                  </Col>
                </Row>
                <Row className="py-2 ml-1 border-top-1px-azure">
                  <Col sm="1" xs="2" md="1" lg="1" className="pl-1 mr-1 mt-2">
                    <img
                      width="32"
                      src={`${apiURL}${bookingInfo.workStationType.file_path}`}
                      alt="Work Station Blue"
                    />
                  </Col>
                  <Col sm="10" xs="9" md="10" lg="10" className="pl-2">
                    <div className="selected">
                      Selected
                      {' '}
                      {bookingInfo.workStationType.name}
                    </div>
                    <span className="font-weight-400 font11 text-grey-chateau">
                      {space.space_name || space.name}
                    </span>
                  </Col>
                </Row>
                <>
                  {multidaysAvailabilityInfo && (
                    <Row className="py-2 pl-2 border-top-1px-azure">
                      {treeViewData && treeViewData.length === 0
                        ? (
                          <>
                            <Col sm="2" md="2" lg="2" xs="3" className={expand ? 'text-center p-0 ml-n6px' : 'text-center p-0 ml-n3px'}>
                              <img width="42" src={calendarImage} alt="calendar" />
                              {bookingInfo.site && (
                                <div className="mt-n2-4rem">
                                  {(getMomentFormat(bookingInfo.site.planned_in, 'DD-ddd-YYYY') !== getMomentFormat(bookingInfo.site.planned_out, 'DD-ddd-YYYY')) ? (
                                    <>
                                      <div className="col-lg-12 col-md-12 col-sm-12">
                                        <small className="text-uppercase font-size-7px font-weight-800">
                                          {getMomentFormat(bookingInfo.site.planned_in, 'ddd')}
                                          {' '}
                                          -
                                          {' '}
                                          {getMomentFormat(bookingInfo.site.planned_out, 'ddd')}
                                        </small>
                                      </div>
                                      <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h5>
                                          {getMomentFormat(bookingInfo.site.planned_in, 'D')}
                                          {' '}
                                          -
                                          {' '}
                                          {getMomentFormat(bookingInfo.site.planned_out, 'D')}
                                        </h5>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                      <small className="text-uppercase font-size-8px font-weight-800">
                                        {getMomentFormat(bookingInfo.site.planned_in, 'ddd')}
                                      </small>
                                      <div className="col-lg-12 col-md-12 col-sm-12">
                                        <h5>
                                          {getMomentFormat(bookingInfo.site.planned_out, 'D')}
                                        </h5>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Col>
                            <Col xs="9" sm="10" md="10" lg="10" className="pl-1 ml-n10px font11">
                              <span className="font-weight-400 text-grey-chateau">
                                Availability at
                              </span>
                              <span className="font-weight-700 font-size-xsmall mx-2">
                                {space.space_name || space.name}
                              </span>
                              <span className="font-weight-400 text-grey-chateau">
                                on
                              </span>
                              <br />
                              <span className="font-weight-700 font-size-xsmall">
                                {getMomentFormat(bookingInfo.site.planned_in, 'dddd D  MMMM YYYY')}
                              </span>
                              {' '}
                              -
                              {' '}
                              <span className="font-weight-700 font-size-xsmall">
                                {getMomentFormat(bookingInfo.site.planned_out, 'dddd D  MMMM YYYY')}
                              </span>
                              {' '}
                              <span className="font-weight-700 font-size-xsmall">
                                {bookingInfo.site && bookingInfo.site.customShift ? '' : (
                                  <>
                                    Shift
                                    {' '}
                                    {bookingInfo.site.name}
                                  </>
                                )}
                                ,
                                <span className="ml-2">
                                  {getHoursMins(bookingInfo.site.planned_in.split(' ')[1])}
                                  {' '}
                                  <DisplayTimezone />
                                  {' '}
                                  -
                                  {' '}
                                  {getHoursMins(bookingInfo.site.planned_out.split(' ')[1])}
                                  {' '}
                                  <DisplayTimezone />
                                </span>
                              </span>
                            </Col>
                          </>
                        )
                        : (
                          <>
                            <Col sm="2" md="2" lg="2" xs="2" className={expand ? 'text-center p-0 ml-n6px' : 'text-center p-0 ml-n4px'}>
                              <img width="40" height="47" src={calendarImage} alt="calendar" />
                              {bookingInfo.date && (
                                <div className="mt-n2-4rem">
                                  <div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                      <small className="text-uppercase font-size-7px font-weight-800">
                                        {getMomentFormat(bookingInfo.site.planned_in, 'ddd')}
                                      </small>
                                      {getMomentFormat(bookingInfo.site.planned_in, 'ddd') !== getMomentFormat(bookingInfo.site.planned_out, 'ddd') && (
                                        <small className="text-uppercase font-size-7px font-weight-800">
                                          -
                                          {' '}
                                          {getMomentFormat(bookingInfo.site.planned_out, 'ddd')}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12">
                                    <h6>
                                      {getMomentFormat(bookingInfo.site.planned_in, 'D')}
                                      {getMomentFormat(bookingInfo.site.planned_in, 'D') !== getMomentFormat(bookingInfo.site.planned_out, 'D') && (
                                        <>
                                          -
                                          {' '}
                                          {getMomentFormat(bookingInfo.site.planned_out, 'D')}
                                        </>
                                      )}
                                    </h6>
                                  </div>
                                </div>
                              )}
                            </Col>
                            <Col xs="9" sm="10" md="10" lg="10" className="pl-1 ml-n10px font11">
                              <span className="font-weight-400 text-grey-chateau">
                                Available at
                              </span>
                              <br />
                              <span className="font-weight-700 font-size-xsmall">
                                {getMomentFormat(bookingInfo.site.planned_in, 'dddd D  MMMM YYYY')}
                              </span>
                              {' '}
                              -
                              {' '}
                              <span className="font-weight-700 font-size-xsmall">
                                {getMomentFormat(bookingInfo.site.planned_out, 'dddd D  MMMM YYYY')}
                              </span>
                              {' '}
                              <span className="font-weight-700 font-size-xsmall">
                                {bookingInfo.site && bookingInfo.site.customShift ? '' : (
                                  <>
                                    Shift
                                    {' '}
                                    {bookingInfo.site.name}
                                  </>
                                )}
                                ,
                                <span className="ml-2">
                                  {getHoursMins(bookingInfo.site.planned_in.split(' ')[1])}
                                  {' '}
                                  <DisplayTimezone />
                                  {' '}
                                  -
                                  {' '}
                                  {getHoursMins(bookingInfo.site.planned_out.split(' ')[1])}
                                  {' '}
                                  <DisplayTimezone />
                                </span>
                              </span>
                            </Col>
                          </>
                        )}
                    </Row>
                  )}
                </>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Col>
      </Row>
    </div>
  );

  return (
    <div>
      <div>
        {selectedWorkSpace
          && selectedWorkSpace.length > 0
          && selectedWorkSpace.map((space, index) => (
            <div key={`${space.id}`}>
              {selectedSpaceForTreeView(space, index)}
            </div>
          ))}
      </div>
      {viewType === 'tree' && selectedWorkSpace && selectedWorkSpace.length === 0 && multidaysAvailabilityInfo && !multidaysAvailabilityInfo.err && (
        <div className="text-center my-5 no-selected-space-text">No selected space found</div>
      )}
      {multidaysAvailabilityInfo.err && (
        ''
      )}
    </div>
  );
};

SelectedSpaceView.propTypes = {
  expand: PropTypes.bool,
  viewType: PropTypes.string.isRequired,
  workSpace: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        space_name: PropTypes.string,
        path_name: PropTypes.string,
        space_sub_type: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
        }),
      }),
    ),
    PropTypes.shape({
      space_name: PropTypes.string,
      path_name: PropTypes.string,
      space_sub_type: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
  ]),
  updateWorkSpace: PropTypes.func.isRequired,
  colSize: PropTypes.bool,
  removeNodeWithEmployee: PropTypes.func,
  removeAll: PropTypes.bool,
  setExpand: PropTypes.func,
  setCollapse: PropTypes.func,
  treeViewData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      is_booking_allowed: PropTypes.bool,
      is_parent: PropTypes.bool,
      path_name: PropTypes.string,
      employee: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
  ),
};

SelectedSpaceView.defaultProps = {
  colSize: false,
  removeNodeWithEmployee: () => { },
  setExpand: () => { },
  setCollapse: () => { },
  removeAll: false,
  workSpace: [],
  treeViewData: [],
  expand: false,
};

export default SelectedSpaceView;
