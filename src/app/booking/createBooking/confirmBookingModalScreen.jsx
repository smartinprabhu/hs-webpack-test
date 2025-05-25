/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Timeline } from 'antd';

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeZoneDateConvertor from '../../shared/dateTimeConvertor';
import userLogo from '@images//myGuestsWhite.ico';
import guestLogo from '@images/guestLogo.png';
import calendarImage from '@images/calendar.ico';
import workstationBlue from '@images/workstationBlue.ico';
import DisplayTimezone from '../../shared/timezoneDisplay';
import { getMomentFormat, getHoursMins, apiURL } from '../../util/appUtils';

const appConfig = require('@app/config/appConfig').default;

const ConfirmBookingModalScreen = ({
  bookingData, selectWorkStation, selectedEmployees, treeViewBookingType,
}) => {
  const {
    saveHostInfo,
  } = useSelector((state) => state.bookingInfo);

  const [singledateCheck, setSingledateCheck] = useState(false);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);

  useEffect(() => {
    if (bookingData && bookingData.date && bookingData.date.length === 2) {
      if (bookingData && bookingData.date && bookingData.date[0]) {
        const dateStart = bookingData.date[0].toString();
        setStartDate(dateStart.split(' '));
      }
      if (bookingData && bookingData.date && bookingData.date[1]) {
        const dateEnd = bookingData.date[1].toString();
        setEndDate(dateEnd.split(' '));
      }
    }
  }, [bookingData]);

  useEffect(() => {
    if (startDate && endDate) {
      if (startDate[1] === endDate[1] && startDate[2] === endDate[2] && startDate[3] === endDate[3]) {
        setSingledateCheck(true);
      } else {
        setSingledateCheck(false);
      }
    }
  }, [startDate, endDate]);
  const getName = (workstation) => {
    if ((workstation && workstation.employee && workstation.employee.is_guest) || (workstation && workstation.name)) {
      return `(Guest) booked by ${saveHostInfo.name}`;
    }
    return '';
  };
  return (
    <Row className="m-0 mt-4 confirmWindowHeight thin-scrollbar scrollable-list">
      <Col sm="12" className="rounded confirm-bg">
        <Row className="p-2">
          <Col sm="2" md="2" lg="2" xs="3">
            <img src={calendarImage} alt="calendar" width="50" height="50" />
            {bookingData.site && (
              <div className="mt-n5">
                <div className="mt-1">
                  {getMomentFormat(bookingData.site.planned_in, 'DD-ddd-YYYY') === getMomentFormat(bookingData.site.planned_out, 'DD-ddd-YYYY') ? (
                    <div style={{ width: '50px', textAlign: "center" }}>
                      <small className="text-uppercase textAlign-center font-weight-800 font-size-xsmall margin-left-14px" data-testid="date">
                        {getMomentFormat(bookingData.site.planned_in, 'ddd')}
                      </small>
                    </div>
                  ) : (
                    <small className="text-uppercase font-weight-800 multiple-days">
                      {getMomentFormat(bookingData.site.planned_in, 'ddd')}
                      {' '}
                      -
                      {' '}
                      {getMomentFormat(bookingData.site.planned_out, 'ddd')}
                    </small>
                  )}
                </div>
                {(getMomentFormat(bookingData.site.planned_in, 'DD-ddd-YYYY') === getMomentFormat(bookingData.site.planned_out, 'DD-ddd-YYYY')) ? (
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <h3 className="single-date textAlign-center">
                      {getMomentFormat(bookingData.site.planned_in, 'D')}
                    </h3>
                  </div>
                ) : (
                  <div className="col-lg-12 col-md-12 col-sm-12 ml-1 multiple-dates">
                    <h3 className="font-size-10px">
                      {getMomentFormat(bookingData.site.planned_in, 'D')}
                      {' '}
                      -
                      {' '}
                      {getMomentFormat(bookingData.site.planned_out, 'D')}
                    </h3>
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col sm="10" md="10" lg="10" xs="9" className="mt-2 pl-0 margin-negative-left-50px">
            {bookingData.site && (
              <h3 className="font-weight-700">
                {getMomentFormat(bookingData.site.planned_in, 'dddd D  MMMM YYYY')}
                {' '}
                -
                {' '}
                {getMomentFormat(bookingData.site.planned_out, 'dddd D  MMMM YYYY')}
              </h3>
            )}
            {bookingData.site && (
              <div className="light-text">
                Shift
                {' '}
                {bookingData.site.name}
                ,
                {getHoursMins(bookingData.site.planned_in.split(' ')[1])}
                {' '}
                <DisplayTimezone />
                {' '}
                -
                {' '}
                {getHoursMins(bookingData.site.planned_out.split(' ')[1])}
                {' '}
                <DisplayTimezone />
              </div>
            )}
          </Col>
        </Row>
        <div className="mt-3">
          {Array.isArray(selectWorkStation)
            ? (
              <>
                {selectWorkStation.map((workStation) => (
                  <React.Fragment key={`${workStation.id}`}>
                    <Row>
                      <Col sm="1" xs="1" md="1" lg="1">
                        <img
                          src={`${apiURL}${bookingData.workStationType.file_path}`}
                          height="50"
                          width="50"
                          className=""
                          alt="location"
                        />
                      </Col>
                      <Col sm="11" xs="11" md="11" lg="11">
                        <h3 className="font-weight-700">
                          {workStation.space_name}
                          {workStation.employee && workStation.employee.name && workStation.employee.type !== 'guest' && (
                            <span className="chip ml-3 mt-1">
                              <img src={userLogo} height="20" width="20" className="mr-1 ml-n1" alt="selectedUser" />
                              {workStation.employee.name}
                              {bookingData && bookingData.workStationType && bookingData.workStationType.type === 'room' && (
                                <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                              )}
                            </span>
                          )}
                          {selectedEmployees && selectedEmployees.length > 0 && bookingData && bookingData.workStationType && bookingData.workStationType.type === 'room' && (
                            <>
                              {selectedEmployees.map((emp) => (
                                <span key={emp.name}>
                                  {emp && emp.name && emp.type !== 'guest' && emp.type !== 'host' && (
                                    <span className="chip ml-3 mt-1">
                                      <img src={userLogo} height="20" width="20" className="mr-1 ml-n1" alt="selectedUser" />
                                      {emp.name}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </>
                          )}
                        </h3>
                        <div className="light-text mb-2">
                          {workStation.path_name}
                        </div>
                      </Col>
                    </Row>
                    {selectedEmployees && selectedEmployees.length > 0 && bookingData && bookingData.workStationType && bookingData.workStationType.type === 'room' && treeViewBookingType === 'group' && (
                      <Row>
                        {selectedEmployees.map((emp) => (
                          <React.Fragment key={emp.name}>
                            {emp && emp.is_guest && (
                              <>
                                <Col sm="1" xs="1" md="1" lg="1">
                                  <img
                                    src={guestLogo}
                                    height="25"
                                    width="35"
                                    className="ml-1"
                                    alt="location"
                                  />
                                </Col>
                                <Col sm="11" xs="11" md="11" lg="11" className="mt-2">
                                  <h3 className="font-weight-700">
                                    {emp.name}
                                    {' '}
                                    <span className="light-text">
                                      {getName(emp)}
                                    </span>
                                  </h3>
                                </Col>
                              </>
                            )}
                          </React.Fragment>
                        ))}
                      </Row>
                    )}
                    {workStation && workStation.employee && workStation.employee.is_guest && (
                      <Row>
                        <Col sm="1" xs="1" md="1" lg="1">
                          <img
                            src={guestLogo}
                            height="25"
                            width="35"
                            className="ml-1"
                            alt="location"
                          />
                        </Col>
                        <Col sm="11" xs="11" md="11" lg="11" className="mt-2">
                          <h3 className="font-weight-700">
                            {workStation.employee.guestName || workStation.employee.name}
                            {' '}
                            <span className="light-text">
                              {getName(workStation)}
                            </span>
                          </h3>
                        </Col>
                      </Row>
                    )}
                    <Row className="ml-3 mt-3">
                      <Timeline>
                        {workStation && workStation.multidaysBookings && workStation.multidaysBookings.length > 0 && workStation.multidaysBookings.map((bookings, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Timeline.Item color="gray" key={index}>
                            <h3 className="font-weight-700 ml-4">
                              <TimeZoneDateConvertor date={bookings.planned_in} format="dddd" />
                              {' '}
                              {' '}
                              <TimeZoneDateConvertor date={bookings.planned_in} format="D MMMM YYYY" />
                              {' '}
                              -
                              {' '}
                              <TimeZoneDateConvertor date={bookings.planned_out} format="dddd" />
                              {' '}
                              {' '}
                              <TimeZoneDateConvertor date={bookings.planned_out} format="D MMMM YYYY" />
                            </h3>
                            <div className="light-text ml-4">
                              Shift
                              {' '}
                              {bookingData.site.name}
                              ,
                              <TimeZoneDateConvertor date={bookings.planned_in} format="LT" />
                              {' '}
                              <DisplayTimezone />
                              {' '}
                              -
                              {' '}
                              <TimeZoneDateConvertor date={bookings.planned_out} format="LT" />
                              {' '}
                              <DisplayTimezone />
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </Row>
                  </React.Fragment>
                ))}
              </>
            )
            : (
              <>
                <Col sm="2 text-center" xs="3" md="2" lg="2">
                  <img src={workstationBlue} height="50" width="50" className="mt-2" alt="location" />
                </Col>
                <Col sm="10" xs="9" md="10" lg="10" className="pl-0">
                  <h3 className="ml-2">
                    {selectWorkStation.space_name}
                  </h3>
                  <div className="light-text mb-2 ml-2">
                    {selectWorkStation.path_name}
                  </div>
                </Col>
              </>
            )}
        </div>
      </Col>
    </Row>
  );
};
ConfirmBookingModalScreen.propTypes = {
  bookingData: PropTypes.shape({
    site: PropTypes.shape({
      planned_in: PropTypes.string,
      new_planned_in: PropTypes.string,
      new_planned_out: PropTypes.string,
      duration: PropTypes.number,
      id: PropTypes.number,
      planned_out: PropTypes.string,
      name: PropTypes.string,
    }),
    multidaysBookings: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          planned_in: PropTypes.string,
          planned_out: PropTypes.string,
        }),
      ),
      PropTypes.shape({
        planned_in: PropTypes.string,
        planned_out: PropTypes.string,
      }),
    ]),
    workStationType: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      file_path: PropTypes.string,
    }),
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

ConfirmBookingModalScreen.defaultProps = {
  selectWorkStation: undefined,
  selectedEmployees: undefined,
};

export default ConfirmBookingModalScreen;
