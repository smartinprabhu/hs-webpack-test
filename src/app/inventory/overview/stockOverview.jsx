/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Modal, ModalBody,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  DatePicker, Button, Tooltip,
} from 'antd';
import moment from 'moment-timezone';
import {
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Drawer from '@mui/material/Drawer';

import completedIcon from '@images/inspection/approved.svg';
import upcomingIcon from '@images/inspection/delivered.svg';
import scheduledIcon from '@images/inspection/scheduled.svg';
import missedIcon from '@images/inspection/missed.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import incomingIcon from '@images/icons/incomingStock.svg';
import outcomingIcon from '@images/icons/outgoingStock.svg';
import transferIcon from '@images/transfers.svg';

import ModalNoPadHead from '@shared/modalNoPadHead';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '../../commonComponents/drawerHeader';

import customData from './data/customData.json';
import {
  generateErrorMessage,
  getListOfModuleOperations,
  getAllowedCompanies,
  getDatesOfText,
  getCompanyTimezoneDate,
  prepareDocuments,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import AddReceipt from '../../purchase/rfq/rfqDetails/receiveProducts/addReceipt/addReceiptNew';

import { getInventoryStatusDashboard, setCurrentTab, getOperationType } from '../inventoryService';
import { getPartsData } from '../../preventiveMaintenance/ppmService';
import {
  getTransferFilters,
  resetAddReceiptInfo,
  getStockLocations,
} from '../../purchase/purchaseService';
import customDataNoc from '../../nocDashboards/data/customData.json';
import AsyncFileUpload from '../../commonComponents/asyncFileUpload';

const faIcons = {
  requested_display: scheduledIcon,
  approved_display: completedIcon,
  delivered_display: upcomingIcon,
  rejected_display: missedIcon,
};

const defaultIcon = {
  outgoing: outcomingIcon,
  incoming: incomingIcon,
  internal: transferIcon,
};

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;

const StockOverview = () => {
  const dateFormat = 'DD-MM-y';

  const [addRfqModal, showAddRfqModal] = useState(false);
  const [isMultiLocation, setMultiLocation] = useState(false);
  const [transferCode, setCode] = useState(false);
  const [pickingData, setPickingData] = useState({});
  const [locationId, setLocationId] = useState(false);
  const [locationName, setLocationName] = useState(false);
  const [datesValue, setDatesValue] = useState([moment(new Date(), dateFormat), moment(new Date(), dateFormat)]);
  const [activeDate, setActiveDate] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { stockLocations, addReceiptInfo } = useSelector((state) => state.purchase);
  const companies = getAllowedCompanies(userInfo);
  const dispatch = useDispatch();
  const { inventoryStatusDashboard } = useSelector((state) => state.inventory);

  const [isDataFilter, showDateFilter] = useState(false);

  const [selectedDateTag, setDateTag] = useState('t_month');

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Transfer']);
  const isViewableDefault = allowedOperations.includes(actionCodes['View Transfer']);

  const isInwardCreatable = isCreatable || allowedOperations.includes(actionCodes['Add Inward Transfer']);
  const isOutwardCreatable = isCreatable || allowedOperations.includes(actionCodes['Add Outward Transfer']);
  const isMaterialCreatable = isCreatable || allowedOperations.includes(actionCodes['Add Material Transfer']);

  const isInwardViewable = isViewableDefault || allowedOperations.includes(actionCodes['View Inward Transfer']);
  const isOutwardViewable = isViewableDefault || allowedOperations.includes(actionCodes['View Outward Transfer']);
  const isMaterialViewable = isViewableDefault || allowedOperations.includes(actionCodes['View Material Transfer']);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  AsyncFileUpload(addReceiptInfo, uploadPhoto);

  useEffect(() => {
    if (userInfo && userInfo.data && activeDate && (activeDate && activeDate.length && activeDate.length === 2 && activeDate[0] && activeDate[1])) {
      let start = `${moment(activeDate[0]).utc().format('YYYY-MM-DD')} 18:30:00`;
      let end = `${moment(activeDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
      if (start === end) {
        start = `${moment(activeDate[0]).subtract(1, 'day').utc().format('YYYY-MM-DD')} 18:30:00`;
        end = `${moment(activeDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
      }

      dispatch(getInventoryStatusDashboard(start, end));
    }
  }, [userInfo, activeDate]);

  useEffect(() => {
    if (userInfo && userInfo.data && selectedDateTag) {
      const dates = getDatesOfText(selectedDateTag);
      if (dates && dates.length) {
        const start = `${dates[0]} 18:30:00`;
        const end = `${dates[1]} 18:30:00`;
        dispatch(getInventoryStatusDashboard(start, end));
      }
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && addReceiptInfo && addReceiptInfo.data && activeDate && (activeDate && activeDate.length && activeDate.length === 2 && activeDate[0] && activeDate[1])) {
      let start = `${moment(activeDate[0]).utc().format('YYYY-MM-DD')} 18:30:00`;
      let end = `${moment(activeDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
      if (start === end) {
        start = `${moment(activeDate[0]).subtract(1, 'day').utc().format('YYYY-MM-DD')} 18:30:00`;
        end = `${moment(activeDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
      }
      dispatch(getInventoryStatusDashboard(start, end));
    }
    if (userInfo && userInfo.data && selectedDateTag && addReceiptInfo && addReceiptInfo.data) {
      const dates = getDatesOfText(selectedDateTag);
      if (dates && dates.length) {
        const start = `${dates[0]} 18:30:00`;
        const end = `${dates[1]} 18:30:00`;
        dispatch(getInventoryStatusDashboard(start, end));
      }
    }
  }, [addReceiptInfo]);

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, false, 'scrap'));
    }
  }, [userInfo]); */

  const onChangeDateRange = (values) => {
    setActiveDate(values);
    showDateFilter(false);
  };

  const onChangeDate = (value) => {
    setDateTag(value);
    setActiveDate([]);
    if (value !== 'l_custom') {
      const dates = getDatesOfText(value);
      if (dates && dates.length) {
        const start = `${dates[0]} 18:30:00`;
        const end = `${dates[1]} 18:30:00`;
        dispatch(getInventoryStatusDashboard(start, end));
      }
      showDateFilter(false);
    }
  };

  useEffect(() => {
    if (stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length > 1) {
      setMultiLocation(true);
    } else if (stockLocations && stockLocations.data && stockLocations.data.length) {
      setMultiLocation(false);
      setLocationId(stockLocations.data[0].id);
      setLocationName(stockLocations.data[0].name);
    }
  }, [stockLocations]);

  const loadTransfersTypeFilter = (key, value, title) => {
    dispatch(getStockLocations(companies, appModels.STOCKLOCATION, false, 'scrap'));
    if (key) {
      dispatch(getOperationType(key, appModels.STOCKPICKINGTYPES, 'mini'));
    }
    setCode(value);
    setPickingData({ id: key, name: value });
    const typeFilters = [{
      id: key, label: `${title} (${value})`, name: title,
    }];
    // dispatch(getTransferFilters([], [], typeFilters, []));
    if (document.getElementById('rfqForm')) {
      document.getElementById('rfqForm').reset();
    }
    dispatch(getPartsData([]));
    dispatch(resetAddReceiptInfo());
    showAddRfqModal(true);
  };

  const customNames = customData.types;

  const loadStatusFilter = (count, value, name, code) => {
    if (count && ((code === 'incoming' && isInwardViewable) || (code === 'outgoing' && isOutwardViewable) || (code === 'internal' && isMaterialViewable))) {
      const filters = [{
        key: 'request_state', title: 'Status', value, label: name, type: 'inarray',
      }];
      let dateFilters = [];
      if (selectedDateTag === 'l_custom' && activeDate && activeDate.length) {
        let start = `${moment(activeDate[0]).utc().format('YYYY-MM-DD')} 18:30:00`;
        let end = `${moment(activeDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
        if (start === end) {
          start = `${moment(activeDate[0]).subtract(1, 'day').utc().format('YYYY-MM-DD')} 18:30:00`;
          end = `${moment(activeDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
        }
        dateFilters = [{
          key: 'Custom', value: 'Custom', label: 'Custom', type: 'customdate', start, end, startDateDisplay: activeDate[0], endDateDisplay: activeDate[1],
        }];
      }
      if (selectedDateTag !== 'l_custom') {
        const dates = getDatesOfText(selectedDateTag);
        if (dates && dates.length) {
          const start = `${dates[0]} 18:30:00`;
          const end = `${dates[1]} 18:30:00`;
          dateFilters = [{
            key: 'requested_on', value: '', label: customDataNoc.dateFiltersText[selectedDateTag], type: 'customdate', start, end,
          }];
        }
      }
      const customFiltersList = [...filters, ...dateFilters];
      dispatch(getTransferFilters(customFiltersList));
      dispatch(setCurrentTab(customNames[code] ? customNames[code].text : 'Transfers'));
    }
  };

  const onReset = () => {
    dispatch(resetAddReceiptInfo());
  };

  const colorClasses = customData.states;
  const stateCodes = customData.stateList ? customData.stateList : false;

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (inventoryStatusDashboard && inventoryStatusDashboard.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (inventoryStatusDashboard && inventoryStatusDashboard.err) ? generateErrorMessage(inventoryStatusDashboard) : userErrorMsg;

  return (
    <Row className="p-2 inspection-module">
      <Col sm="12" md="12" lg="12" xs="12">
        <div className="text-right mb-2 custom-antd-date-picker">
          {inventoryStatusDashboard && !inventoryStatusDashboard.loading && (
            <>
              <span className="datefilter-name mr-2">
                {selectedDateTag === 'l_custom' && activeDate && activeDate.length && (
                  <span>
                    (
                    {getCompanyTimezoneDate(activeDate[0], userInfo, 'date')}
                    {' - '}
                    {getCompanyTimezoneDate(activeDate[1], userInfo, 'date')}
                    )
                  </span>
                )}
                {customDataNoc && customDataNoc.dateFiltersText && selectedDateTag && customDataNoc.dateFiltersText[selectedDateTag] ? customDataNoc.dateFiltersText[selectedDateTag] : ''}
              </span>
              <Tooltip title="Date Filters" placement="top">
                <FontAwesomeIcon className="mr-2 cursor-pointer" size="lg" onClick={() => showDateFilter(true)} icon={faCalendarAlt} />
              </Tooltip>
            </>
          )}
        </div>
        <Row>
          {inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations && !loading && inventoryStatusDashboard.data.Operations.map((team) => (
            <Col sm="12" md="4" lg="4" xs="12" className="mb-3" key={team.id}>
              <Card className="bg-lightblue">
                <CardTitle className="mb-0 ml-2 mt-2 ">
                  <img
                    src={team.code && defaultIcon[team.code] ? defaultIcon[team.code] : transferIcon}
                    width="25"
                    height="25"
                    alt="notification"
                    className="mr-2"
                  />
                  <span>{customNames[team.code] ? customNames[team.code].text : team.name}</span>
                  {team && team.code === 'incoming' && isInwardCreatable && (
                    <Tooltip title={customNames[team.code] ? customNames[team.code].label : team.name} placement="top">
                      <span
                        aria-hidden="true"
                        className="font-weight-600 text-lightblue float-right cursor-pointer m-1"
                        onClick={() => { loadTransfersTypeFilter(team.id, team.code, customNames[team.code] ? customNames[team.code].text : team.name); showAddRfqModal(true); }}
                      >
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="13" width="13" />
                      </span>
                    </Tooltip>
                  )}
                  {team && team.code === 'outgoing' && isOutwardCreatable && (
                    <Tooltip title={customNames[team.code] ? customNames[team.code].label : team.name} placement="top">
                      <span
                        aria-hidden="true"
                        className="font-weight-600 text-lightblue float-right cursor-pointer m-1"
                        onClick={() => { loadTransfersTypeFilter(team.id, team.code, customNames[team.code] ? customNames[team.code].text : team.name); showAddRfqModal(true); }}
                      >
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="13" width="13" />
                      </span>
                    </Tooltip>
                  )}
                  {team && team.code === 'internal' && isMaterialCreatable && (
                    <Tooltip title={customNames[team.code] ? customNames[team.code].label : team.name} placement="top">
                      <span
                        aria-hidden="true"
                        className="font-weight-600 text-lightblue float-right cursor-pointer m-1"
                        onClick={() => { loadTransfersTypeFilter(team.id, team.code, customNames[team.code] ? customNames[team.code].text : team.name); showAddRfqModal(true); }}
                      >
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="13" width="13" />
                      </span>
                    </Tooltip>
                  )}
                </CardTitle>
                <CardBody className="pt-2">
                  <Row>
                    {team && stateCodes && stateCodes.map((sc) => (
                      <Col
                        sm="12"
                        md="3"
                        lg="3"
                        xs="12"
                        className="p-1"
                        key={sc.value}
                      >
                        <Card
                          className={`${colorClasses[sc.label].borderClassName} border-left-0 border-right-0 border-top-0 ${team[sc.value] ? 'cursor-pointer' : ''}`}
                          onClick={() => loadStatusFilter(team[sc.value], sc.key, team[sc.label], team.code)}
                        >
                          <CardBody id="Tooltip-Insights" className="p-1 text-center">
                            <img src={faIcons[sc.label]} alt="imae" height="16" width="16" />
                            <h5 className={`${colorClasses[sc.label].textClassName} mt-2 mb-0 font-weight-800`}>{team[sc.value]}</h5>
                            <p className={`${colorClasses[sc.label].textClassName} font-tiny font-weight-700 mt-2 mb-0`}>{team[sc.label]}</p>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
          <Drawer
            PaperProps={{
              sx: { width: '50%' },
            }}
            anchor="right"
            open={addRfqModal}
          >

            <DrawerHeader
              headerName={`Create ${customNames[transferCode] ? customNames[transferCode].text : 'Transfer'}`}
              onClose={() => { showAddRfqModal(false); onReset(); }}
            />
            <AddReceipt
              id={false}
              editId={false}
              afterReset={() => { showAddRfqModal(false); onReset(); }}
              code={transferCode}
              isMultiLocation={isMultiLocation}
              locationId={locationId}
              locationName={locationName}
              isShow={addRfqModal}
              pickingData={pickingData}
            />
          </Drawer>
        </Row>
        {loading && (
          <div className="mb-2 mt-3 p-5 text-center" data-testid="loading-case">
            <Loader />
          </div>
        )}
        {((inventoryStatusDashboard && inventoryStatusDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        <Modal size="md" className="modal-dialog-centered" isOpen={isDataFilter}>
          <h5 className="font-weight-800 mb-0">
            <ModalNoPadHead title="Date Filters" fontAwesomeIcon={faCalendarAlt} closeModalWindow={() => showDateFilter(false)} />
          </h5>
          <ModalBody className="p-3">
            <Row>
              <Col md="4" sm="12" xs="12" lg="4">
                {customDataNoc && customDataNoc.dateFiltersCurrentMini.map((dl) => (
                  <p key={dl.label}>
                    <Button onClick={() => onChangeDate(dl.value)} type={dl.value === selectedDateTag ? 'primary' : 'default'}>{dl.label}</Button>
                  </p>
                ))}
              </Col>
              <Col md="4" sm="12" xs="12" lg="4">
                {customDataNoc && customDataNoc.dateFiltersPastMini.map((dl) => (
                  <p key={dl.label}>
                    <Button onClick={() => onChangeDate(dl.value)} type={dl.value === selectedDateTag ? 'primary' : 'default'}>{dl.label}</Button>
                  </p>
                ))}
              </Col>
              <Col md="4" sm="12" xs="12" lg="4">
                {customDataNoc && customDataNoc.dateFiltersPastDaysMini.map((dl) => (
                  <p key={dl.label}>
                    <Button onClick={() => onChangeDate(dl.value)} type={dl.value === selectedDateTag ? 'primary' : 'default'}>{dl.label}</Button>
                  </p>
                ))}
              </Col>
              <Col md="12" sm="12" xs="12" lg="12">
                {selectedDateTag === 'l_custom' && (
                  <RangePicker
                    onChange={onChangeDateRange}
                    value={activeDate}
                    format="DD-MM-y"
                    size="small"
                    className="w-100 mb-2"
                  />
                )}
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Col>
    </Row>
  );
};
export default StockOverview;
