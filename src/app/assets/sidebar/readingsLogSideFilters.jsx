/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
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
  getReadingsLog, getReadingsLogCounts, getReadingsLogFilters,
} from '../equipmentService';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getColumnArrayById,
  queryGeneratorWithUtc,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const ReadingsLogSideFilters = (props) => {
  const {
    offset, id, statusValue, afterReset,
    sortBy, sortField, columns, setCollapse, collapse, readingData, filterData,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [fields, setFields] = useState(columns);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [statusRemovedValue, setStatusRemovedValue] = useState(statusValue);
  const [readingCollapse, setReadingCollapse] = useState(true);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [assetsList, setAssets] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);

  const {
    readingsLog, readingsLogFilters, addReadingInfo, updateEquipment,
  } = useSelector((state) => state.equipment);
  const {
    userInfo,
  } = useSelector((state) => state.user);
  const {
    checklistDeleteInfo,
  } = useSelector((state) => state.maintenance);

  useEffect(() => {
    setStatusRemovedValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    if (!id) {
      setAssets([]);
    }
  }, [id]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
    setFields(columns);
  }, [offset, sortBy, sortField, columns]);

  useEffect(() => {
    if (filterData && filterData.id && filterData.label) {
      // setCheckItems((state) => [...state, filterData]);
      // setCheckValues((state) => [...state, filterData.id]);
      setCheckItems([filterData]);
      setCheckValues([filterData.id]);
    }
  }, [filterData]);

  useEffect(() => {
    if ((checkItems && checkItems.length) || (customFiltersList && customFiltersList.length)) {
      dispatch(getReadingsLogFilters(checkItems, customFiltersList));
    }
  }, [checkItems, checkValues, customFiltersList]);

  useEffect(() => {
    if (readingsLogFilters && readingsLogFilters.customFilters) {
      setCustomFilters(readingsLogFilters.customFilters);
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [readingsLogFilters]);

  useEffect(() => {
    if (statusRemovedValue) {
      setCheckItems(checkItems.filter((item) => item.id !== statusRemovedValue));
      if (checkItems.filter((item) => item.id !== statusRemovedValue) && checkItems.filter((item) => item.id !== statusRemovedValue).length === 0) {
        dispatch(getReadingsLogFilters(checkItems.filter((item) => item.id !== statusRemovedValue), customFiltersList));
      }
    }
  }, [statusRemovedValue]);

  useEffect(() => {
    if (readingsLogFilters && (readingsLogFilters.statuses || readingsLogFilters.customFilters)) {
      const statusValues = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGeneratorWithUtc(readingsLogFilters.customFilters, false, userInfo.data) : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLogCounts(id, appModels.READINGSLOG, domain, statusValues, customFilters));
    }
  }, [readingsLogFilters]);

  useEffect(() => {
    if (readingsLogFilters && (readingsLogFilters.statuses || readingsLogFilters.customFilters)) {
      const statusValues = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGeneratorWithUtc(readingsLogFilters.customFilters, false, userInfo.data) : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLog(id, appModels.READINGSLOG, limit, offsetValue, fields, domain, statusValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [readingsLogFilters, offsetValue, sortByValue, sortFieldValue]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((addReadingInfo && addReadingInfo.data) || (checklistDeleteInfo && checklistDeleteInfo.data) || (updateEquipment && updateEquipment.data))) {
      const statusValues = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGeneratorWithUtc(readingsLogFilters.customFilters, false, userInfo.data) : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLogCounts(id, appModels.READINGSLOG, domain, statusValues, customFilters));
      dispatch(getReadingsLog(id, appModels.READINGSLOG, limit, offsetValue, fields, domain, statusValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [addReadingInfo, checklistDeleteInfo, updateEquipment]);

  useEffect(() => {
    if (readingsLog && readingsLog.data && id) {
      const arr = [...assetsList, ...readingsLog.data];
      setAssets([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [readingsLog, id]);

  const handleReadingCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
      if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getReadingsLogFilters(checkItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckItems([]);
    setCustomFilters([]);
    dispatch(getReadingsLogFilters([], []));
    if (afterReset) afterReset();
    setAssets([]);
  };

  const readings = readingsLogFilters && readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];

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
                    className="cursor-pointer collapse-icon-margin-left"
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
          <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY READING</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setReadingCollapse(!readingCollapse)} size="sm" icon={readingCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={readingCollapse}>
              <div>
                {readingData && readingData.length && readingData.map((item, index) => (
                  <span className="mb-1 d-block font-weight-500" key={item.reading_id[0] + index}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxasaction${index}`}
                        name={item.reading_id[1]}
                        value={item.reading_id[0]}
                        onChange={handleReadingCheckboxChange}
                        checked={readings.some((selectedValue) => parseInt(selectedValue) === parseInt(item.reading_id[0]))}
                      />
                      <Label htmlFor={`checkboxasaction${index}`}>
                        <span>{item.reading_id[1]}</span>
                      </Label>
                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((readings && readings.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
              <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
          </CardBody>
        </>
      ) : ''}
    </Card>

  );
};

ReadingsLogSideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
  readingData: PropTypes.array.isRequired,
  filterData: PropTypes.object,
};
ReadingsLogSideFilters.defaultProps = {
  setCollapse: () => { },
  filterData: {},
  collapse: false,
};

export default ReadingsLogSideFilters;
