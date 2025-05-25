/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/order */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { DatePicker, Tooltip } from "antd";
import moment from "moment-timezone";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import * as PropTypes from "prop-types";

import ticketIcon from "@images/icons/ticketBlue.svg";
import { getTotal } from "../utils/utils";
import { newpercalculate } from "../../util/staticFunctions";
import "./helpdeskOverview.scss";
import {
  getHelpdeskDashboard, getHelpdeskFilter,
} from '../ticketService';
import {
  truncate, generateErrorMessage,
  generateArrayFromValue, getStartTime, getEndTime, getDatesOfQueryWithUtc, getDateAndTimeForDifferentTimeZones, defaultTimeZone
} from '../../util/appUtils';
import { storeDateFilters } from '../../visitorManagement/visitorManagementService';
import Loader from '@shared/loading';
import ticketActionData from '../data/ticketsActions.json';
import dateFilter from './datefilter.json';
import ErrorContent from '@shared/errorContent';
import IssueCategory from './issueCategory';
import ServiceResponse from './serviceResponse';

const { RangePicker } = DatePicker;

const appModels = require("../../util/appModels").default;

const Insights = (props) => {
  const { isIncident, isFITTracker } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { helpdeskDashboard } = useSelector((state) => state.ticket);
  const [currentTab, setActive] = useState('All');
  const [values, setValue] = useState([]);
  const [selectedDate, handleDateChange] = useState([null, null]);
  const [open, setOpen] = useState(false);

  const [prefix] = useState("Go to ");

  let dashboardName = 'Helpdesk';

  if (isIncident) {
    dashboardName = 'Incident Management';
  } else if (isFITTracker) {
    dashboardName = 'FIT Tracker';
  }

  useEffect(() => {
    dispatch(storeDateFilters([null, null]));
    const filterValues = {
      states: [],
      categories: [],
      priorities: [],
      customFilters: [],
    };
    dispatch(getHelpdeskFilter(null));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && currentTab && currentTab !== 'Custom') {
      const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone

      const dates = getDatesOfQueryWithUtc(currentTab, companyTimeZone);
      if (dates.length > 0) {
        const start = dates[0];
        const end = dates[1];
        dispatch(getHelpdeskDashboard(start, end, dashboardName));
      } else if (currentTab === "All") {
        const start = "";
        const end = "";
        dispatch(getHelpdeskDashboard(start, end, dashboardName));
      } else {
        const monthDates = getDatesOfQueryWithUtc('This month', companyTimeZone);
        const start = monthDates[0];
        const end = monthDates[1];
        dispatch(getHelpdeskDashboard(start, end, dashboardName));
      }
    }
  }, [userInfo, currentTab]);

  // useEffect(() => {
  //   if (selectedDate) {
  //     if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
  //       const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, startDate, endDate)
  //       let start = `${moment(selectedDate[0]).utc().format('YYYY-MM-DD')} 18:30:00`;
  //       let end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
  //       if (start === end) {
  //         start = `${moment(selectedDate[0]).subtract(1, 'day').utc().format('YYYY-MM-DD')} 18:30:00`;
  //         end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
  //       }
  //       dispatch(getHelpdeskDashboard(start, end, dashboardName));
  //     }
  //   }
  // }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
          userInfo,
          selectedDate[0],
          selectedDate[1]
        );
        let start = getDateRangeObj[0];
        let end = getDateRangeObj[1];
        dispatch(getHelpdeskDashboard(start, end, dashboardName));
      }
    }
  }, [selectedDate]);

  // eslint-disable-next-line no-unused-vars
  const onDateRangeChange = (dates, datesString) => {
    dispatch(storeDateFilters(dates));
    handleDateChange(dates);
  };

  const onLoadTickets = (tag) => {
    const stateValues = [tag];
    const value = 'Custom';
    const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone;

    let filters = [
      {
        key: currentTab,
        value: currentTab,
        label: currentTab,
        type: "date",
      },
    ];
    if (currentTab === "All") {
      filters = [
        {
          key: currentTab,
          value: currentTab,
          label: currentTab,
          type: "date",
        },
      ];
    }
    /* if (key === 'On Hold') {
      filters.push({
        key: 'sla_active', value: '', label: 'SLA Active', type: 'set',
      });
    } */
    if (currentTab === "Custom" && selectedDate && selectedDate[0] !== null) {
      const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
        userInfo,
        selectedDate[0],
        selectedDate[1]
      );
      let dates = [getDateRangeObj[0], getDateRangeObj[1]];
      filters = [
        {
          Header: value,
          end: getDateRangeObj[1],
          id: value,
          key: value,
          label: value,
          start: getDateRangeObj[0],
          type: "customdate",
          value: value,
          dates,
        },
      ];
      /* if (key === 'On Hold') {
        filters.push({
          key: 'sla_active', value: '', label: 'SLA Active', type: 'set',
        });
      } */
    }
    const filterValues = {
      states: stateValues,
      categories: [],
      priorities: [],
      customFilters: filters,
    };
    dispatch(getHelpdeskFilter(filterValues));
    setValue(stateValues);
  };

  const onLoadAll = () => {
    let filters = [
      {
        key: currentTab,
        value: currentTab,
        label: currentTab,
        type: "date",
      },
    ];
    if (currentTab === "Custom" && selectedDate && selectedDate[0] !== null) {
      const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
        userInfo,
        selectedDate[0],
        selectedDate[1]
      );
      let dates = [getDateRangeObj[0], getDateRangeObj[1]];
      filters = [
        {
          key: currentTab,
          value: dates,
          label: `Custom - ${moment(selectedDate[0])
            .tz(companyTimeZone)
            .utc()
            .format("DD/MM/YYY")} - ${moment(selectedDate[1])
            .tz(companyTimeZone)
            .utc()
            .format("DD/MM/YYY")}`,
          type: "datearray",
        },
      ];
      /* if (key === 'On Hold') {
        filters.push({
          key: 'sla_active', value: '', label: 'SLA Active', type: 'set',
        });
      } */
    }
    const filterValues = {
      states: [],
      categories: [],
      priorities: [],
      customFilters: filters,
    };
    dispatch(getHelpdeskFilter(filterValues));
    setValue(filters);
  };

  const total = getTotal(
    helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data : []
  );

  if (values.length > 0 && !isIncident) {
    return <Redirect to="/helpdesk/tickets" />;
  }

  if (values.length > 0 && isIncident) {
    return <Redirect to="/incident/incidents" />;
  }

  const isUserError = userInfo && userInfo.err;
  const loading =
    (userInfo && userInfo.loading) ||
    (helpdeskDashboard && helpdeskDashboard.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg =
    helpdeskDashboard && helpdeskDashboard.err
      ? generateErrorMessage(helpdeskDashboard)
      : userErrorMsg;

  const gridData = generateArrayFromValue(
    helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data : [],
    "ks_dashboard_item_type",
    "ks_tile"
  );
  const gridCards = gridData.sort((a, b) => a.sequence - b.sequence);

  const isCodeData =
    helpdeskDashboard && helpdeskDashboard.data
      ? helpdeskDashboard.data.filter((item) => item.code === "ASSR")
      : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  return (
    <>
      <Row className="m-0 ml-1 pl-4 pt-2 ticket-title">
        <h6>
          {" "}
          <img
            src={ticketIcon}
            alt="ticket"
            className="w-auto mr-2"
            height="20"
            width="20"
          />
          {isIncident ? "INCIDENTS" : "TICKETS"}
        </h6>
      </Row>
      <Row className="m-0 pl-3 pt-0 pb-1">
        <>
          <Col
            sm={open ? "7" : "12"}
            md={open ? "7" : "12"}
            lg={open ? "7" : "12"}
            xs={open ? "7" : "12"}
            className="pl-0 pr-0 calenderBtn"
          >
            <span className="date-btn-group text-right">
              {dateFilter &&
                dateFilter.buttonList.map((item) =>
                  item.name === "Custom" ? (
                    <Button
                      key={item.id}
                      onClick={() => {
                        setActive(item.name);
                        setOpen(true);
                        handleDateChange(null);
                      }}
                      size="sm"
                      active={currentTab === item.name}
                      className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-grey rounded-pill bg-white mb-1 mobile-btn-full-width"
                    >
                      {item.name}
                    </Button>
                  ) : (
                    <Button
                      key={item.id}
                      onClick={() => {
                        setActive(item.name);
                        setOpen(false);
                      }}
                      size="sm"
                      active={currentTab === item.name}
                      className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-grey rounded-pill bg-white mb-1 mobile-btn-full-width"
                    >
                      {item.name}
                    </Button>
                  )
                )}
            </span>
          </Col>
          <Col sm="5" md="5" lg="5" xs="12">
            {open ? (
              <RangePicker
                onChange={onDateRangeChange}
                value={selectedDate}
                format="DD-MM-y"
                size="small"
                className="mt-n2px"
              />
            ) : (
              ""
            )}
          </Col>
        </>
      </Row>
      <Row className="m-0 pt-1 pb-3 pr-3 pl-3 row insights-card">
        {gridCards &&
          gridCards.map((actions) => (
            <>
              {isIncident && actions.name === "On Hold Incidents" ? (
                <Col
                  sm="12"
                  md="12"
                  lg="3"
                  xs="12"
                  className="p-1"
                  key={actions.name}
                >
                  <Card className="border-0 bg-med-blue h-100 text-center">
                    <CardTitle className="m-0 pt-4">
                      <h6 className="pb-3 font-weight-800">Total Incidents</h6>
                    </CardTitle>
                    <Tooltip title={`Total Incidents (${total})`}>
                      <CardBody
                        id="Tooltip-Insights"
                        className="pb-1 pl-5 pr-5 pt-0"
                      >
                        <CircularProgressbarWithChildren
                          value={newpercalculate(total, total)}
                          strokeWidth={9}
                          styles={buildStyles({
                            textColor: "#3a4354",
                            backgroundColor: "#c1c1c1",
                            pathColor: "#4d626e",
                          })}
                        >
                          <div className="m-1 font-size-13">
                            <strong>{total}</strong>
                          </div>
                          <div className="font-11 text-grayish-blue">
                            <strong>{`${newpercalculate(
                              total,
                              total
                            )}%`}</strong>
                          </div>
                        </CircularProgressbarWithChildren>
                      </CardBody>
                    </Tooltip>
                    <CardFooter className="bg-med-blue border-0 pt-0">
                      {total ? (
                        <Button
                           variant="contained"
                          size="sm"
                          onClick={() => onLoadAll()}
                          className="bg-white  text-dark rounded-pill  mb-1"
                        >
                          <small className="text-center font-weight-800">
                            {" "}
                            {prefix} {truncate("Total Incidents", 10)}
                          </small>
                          <FontAwesomeIcon
                            className="ml-2"
                            size="sm"
                            icon={faArrowRight}
                          />
                        </Button>
                      ) : (
                        <Button
                           variant="contained"
                          size="sm"
                          disabled
                          className="bg-white  text-dark rounded-pill  mb-1"
                        >
                          <small className="text-center font-weight-800">
                            {prefix} {truncate("Total Incidents", 10)}
                          </small>
                          <FontAwesomeIcon
                            className="ml-2"
                            size="sm"
                            icon={faArrowRight}
                          />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                  <br />
                </Col>
              ) : (
                <Col
                  sm="12"
                  md="12"
                  lg="3"
                  xs="12"
                  className="p-1"
                  key={actions.name}
                >
                  <Card className="border-0 bg-med-blue h-100 text-center">
                    <CardTitle className="m-0 pt-4">
                      <h6 className="pb-3 font-weight-800">{actions.name}</h6>
                    </CardTitle>
                    <Tooltip
                      title={`${actions.name}(${
                        actions.datasets && actions.datasets[0]
                          ? actions.datasets && actions.datasets[0]
                          : 0
                      })`}
                    >
                      <CardBody
                        id="Tooltip-Insights"
                        className="pb-1 pl-5 pr-5 pt-0"
                      >
                        <CircularProgressbarWithChildren
                          value={newpercalculate(total, actions.datasets)}
                          strokeWidth={9}
                          styles={buildStyles({
                            textColor: "#3a4354",
                            backgroundColor: "#c1c1c1",
                            pathColor: "#4d626e",
                          })}
                        >
                          <div className="m-1 font-size-13">
                            <strong>{actions.datasets}</strong>
                          </div>
                          <div className="font-11 text-grayish-blue">
                            <strong>{`${newpercalculate(
                              total,
                              actions.datasets
                            )}%`}</strong>
                          </div>
                        </CircularProgressbarWithChildren>
                      </CardBody>
                    </Tooltip>
                    <CardFooter className="bg-med-blue border-0 pt-0">
                      {actions.datasets &&
                      actions.datasets[0] !== 0 &&
                      actions.code &&
                      ticketActionData.dashboardStatus[actions.code] !==
                        undefined ? (
                        <Button
                           variant="contained"
                          size="sm"
                          onClick={() =>
                            onLoadTickets(
                              ticketActionData.dashboardStatus[actions.code]
                            )
                          }
                          className="bg-white  text-dark rounded-pill  mb-1"
                        >
                          <small className="text-center font-weight-800">
                            {" "}
                            {prefix} {truncate(actions.name, 10)}
                          </small>
                          <FontAwesomeIcon
                            className="ml-2"
                            size="sm"
                            icon={faArrowRight}
                          />
                        </Button>
                      ) : (
                        <Button
                           variant="contained"
                          size="sm"
                          disabled
                          className="bg-white  text-dark rounded-pill  mb-1"
                        >
                          <small className="text-center font-weight-800">
                            {prefix} {truncate(actions.name, 10)}
                          </small>
                          <FontAwesomeIcon
                            className="ml-2"
                            size="sm"
                            icon={faArrowRight}
                          />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                  <br />
                </Col>
              )}
            </>
          ))}
      </Row>
      {loading && (
        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
          <Loader />
        </div>
      )}
      {((helpdeskDashboard && helpdeskDashboard.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
      {!isIncident && (
        <>
          <hr className="ml-3 mr-3 mb-0 mt-2" />
          <Row className="m-0 p-3  issueCategory-card">
            <Col
              sm="12"
              md="12"
              lg={isCodeExists ? "6" : "12"}
              xs="12"
              className="p-0"
            >
              <IssueCategory
                selectedDate={selectedDate}
                currentTab={currentTab}
              />
            </Col>
            <Col sm="12" md="12" lg="6" xs="12" className="p-0">
              <ServiceResponse />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

Insights.propTypes = {
  isIncident: PropTypes.bool,
};
Insights.defaultProps = {
  isIncident: false,
};

export default Insights;
