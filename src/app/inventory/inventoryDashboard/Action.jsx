/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { DatePicker, Tooltip } from 'antd';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import {
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {storeDateFilters} from '../../visitorManagement/visitorManagementService';
import pantryOrderBlue from '@images/icons/inventoryBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { getTotal, getDatesOfQuery } from './utils/utils';
import {
  newpercalculate,
} from '../../util/staticFunctions';
import {
  getTransferFilters,
} from '../../purchase/purchaseService';
import { setCurrentTab, getInventoryDashboard, getScrapFilters } from '../inventoryService';
import {
  truncate, generateErrorMessage,
  generateArrayFromValue, getStartTime, getEndTime, getDateAndTimeForDifferentTimeZones, getDatesOfQueryWithUtc
} from '../../util/appUtils';
import customData from './data/customData.json';
import dateFilter from './datefilter.json';

const { RangePicker } = DatePicker;

const Action = () => {
  const dispatch = useDispatch();
  const [values, setValue] = useState([]);
  const [currentTab, setActive] = useState('This month');
  const [selectedDate, handleDateChange] = React.useState([null, null]);
  const [open, setOpen] = React.useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { inventoryDashboard } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(storeDateFilters([null,null]));
    dispatch(setCurrentTab(''));
    dispatch(getScrapFilters([], [], []));
    dispatch(getTransferFilters([], [], [], []));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && currentTab && currentTab !== 'Custom') {
      const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone

      const dates = getDatesOfQueryWithUtc(currentTab,companyTimeZone);
      if (dates.length > 0) {
        const start = dates[0];
        const end = dates[1];
        dispatch(getInventoryDashboard(start, end));
      } else {
        const monthDates = getDatesOfQueryWithUtc('This month',companyTimeZone);
        const start = monthDates[0];
        const end = monthDates[1];
        dispatch(getInventoryDashboard(start, end));
      }
    }
  }, [userInfo, currentTab]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0], selectedDate[1])
        let start = getDateRangeObj[0]
        let end = getDateRangeObj[1]
        dispatch(getInventoryDashboard(start, end));
      }
    }
  }, [selectedDate]);

  // eslint-disable-next-line no-unused-vars
  const onDateRangeChange = (dates, datesString) => {
    dispatch(storeDateFilters(dates));
    handleDateChange(dates);
  };

  const onLoadTransfer = (tags, code) => {
    if (code !== 'TP' && code !== 'TSO') {
      setValue(tags);
      let stateValues = [];
      let filters = [{
        key: currentTab, value: currentTab, label: currentTab, type: 'date',
      }];
      if (currentTab === 'Custom' && selectedDate && selectedDate[0] !== null) {
        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0], selectedDate[1])
        let dates = [getDateRangeObj[0], getDateRangeObj[1]]
        filters = [{
          key: currentTab,
          value: dates,
          label: `Custom - ${moment(selectedDate[0]).utc().format('DD/MM/YYYY')} - ${moment(selectedDate[1]).utc().format('DD/MM/YYYY')}`,
          type: 'datearray',
        }];
      }
      const customFiltersList = [...tags, ...filters];
      if (code === 'TIT' || code === 'TINT') {
        stateValues = [{ id: 'done', label: 'Done' }];
      }
      dispatch(setCurrentTab('Transfers'));
      dispatch(getTransferFilters(stateValues, [], [], customFiltersList));
    }
    if (code === 'TP') {
      dispatch(setCurrentTab('Products'));
      setValue(tags);
    }
    if (code === 'TSO') {
      const stateScrapValues = [{ id: 'done', label: 'Done' }];
      dispatch(getScrapFilters(stateScrapValues, [], []));
      dispatch(setCurrentTab('Scrap'));
      setValue(tags);
    }
  };

  const total = getTotal(inventoryDashboard && inventoryDashboard.data ? inventoryDashboard.data : []);

  const gridData = generateArrayFromValue(inventoryDashboard && inventoryDashboard.data ? inventoryDashboard.data : [], 'ks_dashboard_item_type', 'ks_tile');
  const gridCards = gridData.sort((a, b) => a.sequence - b.sequence);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (inventoryDashboard && inventoryDashboard.err) ? generateErrorMessage(inventoryDashboard) : userErrorMsg;

  if (values.length > 0) {
    return (<Redirect to="/inventory/operations" />);
  }

  console.log("loadeddddd")

  return (
    <>
      <Row className="m-0 ml-1 pl-4 pt-2">
        <h6 className="mt-2">
          {' '}
          <img src={pantryOrderBlue} alt="workorders" className="mr-2" height="20" width="20" />
          INVENTORIES
        </h6>
      </Row>
      <Row className="m-0 pl-3 pt-0 pb-1">
        <>
          <Col sm={open ? '7' : '12'} md={open ? '7' : '12'} lg={open ? '7' : '12'} xs={open ? '7' : '12'} className="pl-0 pr-0">
            <span className="date-btn-group text-right">
              {dateFilter && dateFilter.buttonList.map((item) => (
                item.name === 'Custom'
                  ? (
                    <Button
                      key={item.id}
                      variant="contained"
                      onClick={() => { setActive(item.name); setOpen(true); handleDateChange(null); }}
                      size="sm"
                      active={currentTab === item.name}
                      className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-grey rounded-pill bg-white mb-1 mobile-btn-full-width"
                    >
                      {item.name}
                    </Button>
                  )
                  : (
                    <Button
                      key={item.id}
                      variant="contained"
                      onClick={() => { setActive(item.name); setOpen(false); }}
                      size="sm"
                      active={currentTab === item.name}
                      className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-grey rounded-pill bg-white mb-1 mobile-btn-full-width"
                    >
                      {item.name}
                    </Button>
                  )
              ))}
            </span>
          </Col>
          {open ? (
            <Col sm="5" md="5" lg="5" xs="5">
              <RangePicker
                onChange={onDateRangeChange}
                value={selectedDate}
                format="DD-MM-y"
                size="small"
                className="mt-n2px"
              />
            </Col>
          ) : ('')}
        </>
      </Row>
      <Row className="m-0 pt-1 pb-3 pr-3 pl-3 inventory-insights-card row">
        {gridCards && gridCards.map((actions) => (
          <Col sm="12" md="12" lg="3" xs="12" className="p-1" key={actions.name}>
            <Card
              className="border-0 bg-med-blue h-100 text-center"
            >
              <CardTitle className="m-0 pt-4">
                <h6 className="pb-3 font-weight-800">
                  {actions.name}
                </h6>
              </CardTitle>
              <Tooltip title={`${actions.name}(${actions.datasets && actions.datasets[0] ? actions.datasets && actions.datasets[0] : 0})`}>
                <CardBody id="Tooltip-Insights" className="pb-1 pl-5 pr-5 pt-0">
                  <CircularProgressbarWithChildren
                    value={actions.datasets && actions.code && actions.code !== 'TP' ? newpercalculate(total, actions.datasets) : '100'}
                    strokeWidth={9}
                    styles={buildStyles({
                      textColor: '#3a4354',
                      backgroundColor: '#c1c1c1',
                      pathColor: '#4d626e',
                    })}
                  >
                    <div className="m-1 font-size-13">
                      <strong>{actions.datasets}</strong>
                    </div>
                    {actions.datasets && actions.code && actions.code !== 'TP'
                      ? (
                        <div className="font-11 text-grayish-blue">
                          <strong>{`${newpercalculate(total, actions.datasets)}%`}</strong>
                        </div>
                      )
                      : ''}
                  </CircularProgressbarWithChildren>
                </CardBody>
              </Tooltip>
              <CardFooter className="bg-med-blue border-0 pt-0">
                {actions.datasets && actions.datasets.length && actions.datasets.length > 0 && actions.datasets[0] !== 0 && actions.code ? (
                  <Button
                     variant="contained"
                    size="sm"
                    onClick={() => onLoadTransfer(customData.dashboardStatus[actions.code].tags, actions.code)}
                    className="bg-white  text-dark rounded-pill  mb-1"
                  >
                    <small className="text-center font-weight-800">
                      Go to
                      {' '}
                      {truncate(actions.name, 10)}
                    </small>
                    <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowRight} />
                  </Button>
                )
                  : (
                    <Button  variant="contained" size="sm" disabled className="bg-white  text-dark rounded-pill  mb-1">
                      <small className="text-center font-weight-800">
                        Go to
                        {' '}
                        {truncate(actions.name, 10)}
                      </small>
                      <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowRight} />
                    </Button>
                  )}
              </CardFooter>
            </Card>
            <br />
          </Col>
        ))}
      </Row>
      {((inventoryDashboard && inventoryDashboard.loading) || (isUserLoading)) && (
        <div className="mb-4 mt-2">
          <Loader />
        </div>
      )}
      {((inventoryDashboard && inventoryDashboard.err) || (isUserError)) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
    </>
  );
};
export default Action;
