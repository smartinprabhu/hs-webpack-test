/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import collapseIcon from '@images/collapse.png';
import {
  getPPMList, getPPMCount, getPPMFilters,
} from '../../adminSetup/maintenanceConfiguration/maintenanceService';
import {
  getColumnArrayById, queryGeneratorWithUtc,
  getAllowedCompanies,
} from '../../util/appUtils';
import maintenanceData from '../data/maintenanceData.json';

const appModels = require('../../util/appModels').default;

const operationSidebar = (props) => {
  const {
    offset, statusValue, afterReset,
    sortBy, sortField, setCollapse, collapse,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    ppmFilters,
  } = useSelector((state) => state.maintenance);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (statusValue && statusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusValue));
    }
  }, [statusValue]);

  useEffect(() => {
    if (ppmFilters && ppmFilters.customFilters) {
      setCustomFilters(ppmFilters.customFilters);
    }
  }, [ppmFilters]);

  useEffect(() => {
    dispatch(getPPMFilters(checkItems, customFiltersList));
  }, [checkItems]);

  useEffect(() => {
    let statusValues = [];
    let filterList = [];
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (ppmFilters && ppmFilters.statuses) {
      statusValues = ppmFilters.statuses;
      setStatusCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (ppmFilters && ppmFilters.customFilters) {
      filterList = ppmFilters.customFilters;
    }

    dispatch(getPPMFilters(statusValues, filterList));
  }, []);

  useEffect(() => {
    if (userInfo.data && (ppmFilters && (ppmFilters.statuses || ppmFilters.customFilters))) {
      const statusValues = ppmFilters.statuses ? getColumnArrayById(ppmFilters.statuses, 'id') : [];
      const customFilters = ppmFilters.customFilters ? queryGeneratorWithUtc(ppmFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMCount(companies, appModels.TASK, statusValues, customFilters));
    }
  }, [userInfo, ppmFilters]);

  useEffect(() => {
    if (userInfo.data && (ppmFilters && (ppmFilters.statuses || ppmFilters.customFilters))) {
      const statusValues = ppmFilters.statuses ? getColumnArrayById(ppmFilters.statuses, 'id') : [];
      const customFilters = ppmFilters.customFilters ? queryGeneratorWithUtc(ppmFilters.customFilters,false, userInfo.data) : '';
      dispatch(getPPMList(companies, appModels.TASK, limit, offsetValue, statusValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, ppmFilters]);

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
  };

  const statusValues = ppmFilters && ppmFilters.statuses ? getColumnArrayById(ppmFilters.statuses, 'id') : [];

  return (

    <Card className="p-1 bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          <CardTitle className="mt-2 ml-2 mb-1 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h4>
                  Filters
                </h4>
              </Col>
              {filtersIcon && (
              <Col lg="2" sm="2" md="2" className="mt-1">
                <img
                  src={collapseIcon}
                  height="25px"
                  aria-hidden="true"
                  width="25px"
                  alt="Collapse"
                  onClick={() => setCollapse(!collapse)}
                  className="cursor-pointer collapse-margin-left"
                  id="collapse"
                />
                <UncontrolledTooltip target="collapse" placement="right">
                  Collapse
                </UncontrolledTooltip>
              </Col>
              )}
            </Row>
          </CardTitle>
          <hr className="m-0 border-color-grey ml-2px" />
          <CardBody className="ml-2 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY MAINTENANCE TYPE</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={statusCollapse}>
              <div>
                {maintenanceData.maintenanceTypes.map((mt, index) => (
                  <span className="mb-1 d-block font-weight-500" key={mt.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxasaction${index}`}
                        name={mt.label}
                        value={mt.value}
                        checked={statusValues.some((selectedValue) => selectedValue === mt.value)}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor={`checkboxasaction${index}`}>
                        <span>{mt.label}</span>
                      </Label>
                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((statusValues && statusValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
          </CardBody>
        </>
      ) : ''}
    </Card>

  );
};

operationSidebar.propTypes = {
  offset: PropTypes.number.isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
};
operationSidebar.defaultProps = {
  setCollapse: () => { },
  collapse: false,
};
export default operationSidebar;
