/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Collapse, Col, Input, Label, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, DatePicker } from 'antd';
import 'react-calendar/dist/Calendar.css';

import {
  getPreventiveFilter, getAllReports, getLocationId, getSelectedReportDate,
} from '../../../ppmService';
import {
  getColumnArrayById, getAllowedCompanies, truncate, getCompanyTimezoneDate,
} from '../../../../util/appUtils';
import preventiveActions from '../../../data/preventiveActions.json';

const appModels = require('../../../../util/appModels').default;

const sideFiltersDmr = () => {
  const dispatch = useDispatch();

  const [checkItems, setCheckItems] = useState([{ id: 'Today', label: 'Today' }]);
  const [locationValues, setLocationValues] = useState([]);
  const [locationItems, setLocationItems] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [locationCollapse, setLocationCollapse] = useState(true);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [date, changeDate] = useState(undefined);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    ppmFilter, locations, locationId,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (locationId) {
      setLocationItems([locationId]);
      setLocationValues([locationId]);
    }
  }, [locationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      const todayDate = getCompanyTimezoneDate(new Date(), userInfo, 'datetimesecs');
      changeDate(todayDate);
    }
  }, [userInfo, date]);

  const onChange = (newDate) => {
    changeDate(newDate);
  };

  useEffect(() => {
    const payload = {
      dates: checkItems, locations: locationItems,
    };
    dispatch(getPreventiveFilter(payload));
  }, [checkItems, locationItems]);

  useEffect(() => {
    let scheduleValues = [];
    let locationsValues = [];
    if (checkItems && checkItems.length > 0) {
      scheduleValues = checkItems;
    } else if (ppmFilter && ppmFilter.dates) {
      scheduleValues = ppmFilter.dates;
      setStatusCollapse(true);
    }

    if (locationItems && locationItems.length > 0) {
      locationsValues = locationItems;
    } else if (ppmFilter && ppmFilter.locations) {
      scheduleValues = ppmFilter.locations;
      setLocationCollapse(true);
    }

    const payload = {
      dates: scheduleValues, locations: locationsValues,
    };
    dispatch(getPreventiveFilter(payload));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.timezone) {
      if (userInfo && userInfo.data && userInfo.data.company && selectedDate && selectedDate !== 'Custom' && locationId) {
        let companyTimezoneDate;
        let today = new Date();
        if (selectedDate === 'Yesterday') {
          today = today.setDate(today.getDate() - 1);
          companyTimezoneDate = getCompanyTimezoneDate(today, userInfo, 'date');
        } else {
          companyTimezoneDate = getCompanyTimezoneDate(new Date(), userInfo, 'date');
        }
        dispatch(getSelectedReportDate(companyTimezoneDate));
        dispatch(getAllReports(companies, companyTimezoneDate, appModels.REPORTS, locationId.id));
      }
    }
  }, [userInfo, selectedDate, locationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && selectedDate && selectedDate === 'Custom' && date && locationId) {
      const companyTimezoneDate = getCompanyTimezoneDate(date, userInfo, 'date');
      dispatch(getSelectedReportDate(companyTimezoneDate));
      dispatch(getAllReports(companies, companyTimezoneDate, appModels.REPORTS, locationId.id));
    }
  }, [date, locationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && selectedDate === undefined && date && locationId) {
      const companyTimezoneDate = getCompanyTimezoneDate(date, userInfo, 'date');
      dispatch(getSelectedReportDate(companyTimezoneDate));
      dispatch(getAllReports(companies, companyTimezoneDate, appModels.REPORTS, locationId.id));
    }
  }, [date, locationId]);

  const handleCheckboxChange = (event) => {
    setSelectedDate(event.target.value);
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckItems([values]);
    } else {
      setCheckItems([]);
    }
  };

  const handleLocationCheckboxChange = (event, locationData) => {
    dispatch(getLocationId(locationData));
    const { checked, id, name } = event.target;
    const values = { id, label: name };
    if (checked) {
      setLocationValues([values]);
      setLocationItems([values]);
    } else {
      setLocationValues([]);
      setLocationItems([]);
    }
  };

  const handleResetClick = (e) => {
    changeDate(undefined);
    setSelectedDate('Today');
    e.preventDefault();
    setCheckItems([{ id: 'Today', label: 'Today' }]);
    if (locations && locations.data) {
      setLocationValues([locations.data[0]]);
      setLocationItems([locations.data[0]]);
      dispatch(getLocationId(locations.data[0]));
    }
  };
  const scheduleValues = ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.dates ? getColumnArrayById(ppmFilter.customFilters.dates, 'id') : [];
  const scheduleList = ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.dates ? ppmFilter.customFilters.dates : [];
  const locationsList = ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.locations ? ppmFilter.customFilters.locations : [];

  const getLocationData = () => {
    const selectedLocation = locationsList && locationsList.length && locationsList[0].name;
    const locationsData = locations  && locations.data && locations.data.length && locations.data[0] && locations.data[0].name;
    if(selectedLocation === locationsData) {
      return false;
    } else {
      return true;
    }
  }

  return (
    <>
      {((scheduleList && scheduleList.length > 0 && scheduleList[0].id !== 'Today') || (getLocationData())) && (
        <>
          <Row className="m-0">
            <Col md="12" lg="12" sm="12" xs="12" className="p-0">
              <div aria-hidden="true" className="float-right cursor-pointer mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            </Col>
          </Row>
          <hr className="mt-1" />
        </>
        )}
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY SCHEDULE</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={statusCollapse}>
        <div>
          {preventiveActions.reportFilters.map((tp, index) => (
            <span className="mb-1 d-block font-weight-500" key={tp.value}>
              <div className="checkbox">
                <Input
                  type="checkbox"
                  id={`checkboxstateaction${index}`}
                  value={tp.value}
                  name={tp.label}
                  checked={scheduleValues.some((selectedValue) => selectedValue === tp.value)}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor={`checkboxstateaction${index}`} id={`custom${index}`}>
                  <span className="ml-2">{tp.label}</span>
                </Label>
                {' '}
              </div>
            </span>
          ))}
          {selectedDate === 'Custom' ? (
            <>
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                onChange={onChange}
              />
            </>
          ) : ''}
        </div>
      </Collapse>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY LOCATION</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setLocationCollapse(!locationCollapse); }} size="sm" icon={locationCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={locationCollapse}>
        <div>
          {locations && locations.data && locations.data.map((tp) => (
            <span className="mb-1 d-block font-weight-500" key={tp.name}>
              <div className="checkbox">
                <Input
                  type="checkbox"
                  id={tp.id}
                  value={tp.name}
                  name={tp.name}
                  checked={locationValues.some((selectedValue) => Number(selectedValue.id) === tp.id)}
                  onChange={(e) => handleLocationCheckboxChange(e, tp)}
                />
                <Label htmlFor={tp.id}>
                  <Tooltip title={tp.name} placement="top">
                    <span className="ml-2">{truncate(tp.name, 8)}</span>
                  </Tooltip>
                </Label>
                {' '}
              </div>
            </span>
          ))}
        </div>
      </Collapse>
    </>
  );
};

export default sideFiltersDmr;
