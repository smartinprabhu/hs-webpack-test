/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import employeeLogo from '@images/icons/attendanceBlue.ico';
import {
  getEmployeeList, getEmployeeCount, getEmployeeFilters,
  getEmployeeDetail,
} from '../employeeService';
import {
  getColumnArrayById, queryGenerator, generateErrorMessage, getTotalCount,
  truncate, queryGeneratorWithUtc,
} from '../../../util/appUtils';
import { getRegStatusLabel } from '../utils/utils';
import employeesData from '../data/employeesData.json';

const appModels = require('../../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, statusValue, afterReset,
    sortBy, sortField,
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
  const [viewId, setViewId] = useState('');
  const [employeeList, setEmployees] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const { userInfo } = useSelector((state) => state.user);
  const {
    employeesCount, employeesInfo, employeeFilters,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (!id) {
      setEmployees([]);
    }
  }, [id]);

  useEffect(() => {
    if (statusValue && statusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusValue));
    }
  }, [statusValue]);

  useEffect(() => {
    if (employeeFilters && employeeFilters.customFilters) {
      setCustomFilters(employeeFilters.customFilters);
    }
  }, [employeeFilters]);

  useEffect(() => {
    dispatch(getEmployeeFilters(checkItems, customFiltersList));
  }, [checkItems]);

  useEffect(() => {
    let statusValues = [];
    let filterList = [];
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (employeeFilters && employeeFilters.statuses) {
      statusValues = employeeFilters.statuses;
      setStatusCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (employeeFilters && employeeFilters.customFilters) {
      filterList = employeeFilters.customFilters;
    }

    dispatch(getEmployeeFilters(statusValues, filterList));
  }, []);

  useEffect(() => {
    if (userInfo.data && (employeeFilters && (employeeFilters.statuses || employeeFilters.customFilters))) {
      const statusValues = employeeFilters.statuses ? getColumnArrayById(employeeFilters.statuses, 'id') : [];
      const customFilters = employeeFilters.customFilters ? queryGeneratorWithUtc(employeeFilters.customFilters,false, userInfo.data) : '';
      dispatch(getEmployeeCount(userInfo.data.company.id, appModels.EMPLOYEE, statusValues, customFilters));
    }
  }, [userInfo, employeeFilters]);

  useEffect(() => {
    if (userInfo.data && (employeeFilters && (employeeFilters.statuses || employeeFilters.customFilters))) {
      const statusValues = employeeFilters.statuses ? getColumnArrayById(employeeFilters.statuses, 'id') : [];
      const customFilters = employeeFilters.customFilters ? queryGeneratorWithUtc(employeeFilters.customFilters,false, userInfo.data) : '';
      dispatch(getEmployeeList(userInfo.data.company.id, appModels.EMPLOYEE, limit, offsetValue, statusValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, employeeFilters, scrollTop]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getEmployeeDetail(viewId, appModels.EMPLOYEE));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (employeesInfo && employeesInfo.data && id) {
      const arr = [...employeeList, ...employeesInfo.data];
      setEmployees([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [employeesInfo, id]);

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
    setEmployees([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    const total = getTotalCount(employeesCount);
    const scrollListCount = employeeList && employeeList.length ? employeeList.length : 0;
    if ((employeesInfo && !employeesInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setEmployees([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    const filtersList = customFiltersList.filter((item) => item.key !== value);
    dispatch(getEmployeeFilters(checkItems, filtersList));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setEmployees([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
    setEmployees([]);
  };

  const currentId = viewId || id;

  const statusValues = employeeFilters && employeeFilters.statuses ? getColumnArrayById(employeeFilters.statuses, 'id') : [];

  const statusList = employeeFilters && employeeFilters.statuses ? employeeFilters.statuses : [];

  return (

    <Card className="p-1 h-100 bg-lightblue side-filters-list">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h4>
          Filters
        </h4>
        <hr className="m-0 border-color-grey" />
      </CardTitle>
      {id ? (
        <>
          <div>
            <div className="p-2">
              {statusList && statusList.map((team) => (
                <h5 key={team.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {team.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(team.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {customFiltersList && customFiltersList.map((cf) => (
                <h5 key={cf.key} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {cf.label}
                    {(cf.type === 'text' || cf.type === 'id') && (
                    <span>
                      {'  '}
                      &quot;
                      {cf.value}
                      &quot;
                    </span>
                    )}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {((statusValues && statusValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
                <div aria-hidden="true" className="cursor-pointer mt-2 mb-4 text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
              )}
              {((statusValues && statusValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
              <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
              )}
            </div>
            <div onScroll={onScroll} className={employeeList && employeeList.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
              {(employeeList) && employeeList.map((emp) => (
                <Card
                  key={emp.id}
                  onClick={() => setViewId(emp.id)}
                  className={(emp.id === currentId) ? 'mr-2 ml-2 mb-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2 mb-2'}
                >
                  <CardBody className="p-2">
                    <Row>
                      <Col md={8}>
                        <img src={employeeLogo} className="mr-1" alt={emp.name} width="15" height="15" />
                        <span className="font-weight-700 mb-1 font-medium">{truncate(emp.name, 14)}</span>
                      </Col>
                      <Col md={4}>
                        {getRegStatusLabel(emp.registration_status)}
                      </Col>
                    </Row>
                    <span className="font-weight-400 mb-1 ml-4 font-tiny">
                      {emp.employee_id_seq}
                    </span>
                    <p className="text-info font-weight-600 mb-0 ml-4">{emp.department_id ? emp.department_id[1] : ''}</p>
                  </CardBody>
                </Card>
              ))}
              {(employeesInfo && employeesInfo.err) && (
              <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(employeesInfo)} />
                </CardBody>
              </Card>
              )}

              {(userInfo && userInfo.err) && (
              <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                </CardBody>
              </Card>
              )}
              {((employeesInfo && employeesInfo.loading) || (userInfo && userInfo.loading)) && (
              <Loader />
              )}
            </div>
          </div>
        </>
      ) : (
        <CardBody className="pl-1 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
          <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">BY  STATUS</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={statusCollapse}>
            <div>
              {employeesData.states.map((item, index) => (
                <span className="mb-1 d-block font-weight-500" key={item.value}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxasaction${index}`}
                      name={item.label}
                      value={item.value}
                      checked={statusValues.some((selectedValue) => selectedValue === item.value)}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor={`checkboxasaction${index}`}>
                      <span>{item.label}</span>
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
      )}
    </Card>

  );
};

SideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default SideFilters;
