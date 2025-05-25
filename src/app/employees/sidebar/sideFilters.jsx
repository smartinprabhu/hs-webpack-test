/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row, Popover, PopoverBody, Tooltip, PopoverHeader,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import employeeLogo from '@images/attendanceBlue.ico';
import {
  getEmployeeList, getEmployeeCount, getEmployeeFilters,
  getEmployeeDetail,
} from '../employeeService';
import {
  getColumnArrayById, queryGenerator, generateErrorMessage, getTotalCount,

} from '../../util/appUtils';
import { getRegStatusLabel } from '../utils/utils';
import employeesData from '../data/employeesData.json';
import Filters from '../filters/filters';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, statusValue, setStatusValue, afterReset, isFilter, showFilter,
    sortBy, sortField,
  } = props;
  const dispatch = useDispatch();
  const limit = 500;
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
  const [openValues, setOpenValues] = useState([]);
  const toggle = (ID) => {
    setOpenValues((state) => [...state, ID]);
  };
  const { userInfo } = useSelector((state) => state.user);
  const {
    employeesCount, employeesInfo, employeeFilters,
  } = useSelector((state) => state.employee);

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
      setStatusValue(0);
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
    const statusValues = [];
    const filterList = [];
    dispatch(getEmployeeFilters(statusValues, filterList));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data.company
      && (employeeFilters
        && (employeeFilters.statuses
          || employeeFilters.customFilters
        ))) {
      const statusValues = employeeFilters.statuses ? getColumnArrayById(employeeFilters.statuses, 'id') : [];
      const customFilters = employeeFilters.customFilters ? queryGenerator(employeeFilters.customFilters) : '';
      dispatch(getEmployeeCount(
        userInfo.data.company.id,
        appModels.USERMANAGEMENT,
        statusValues,
        customFilters,
      ));
    }
  }, [userInfo, employeeFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data.company
      && (employeeFilters
        && (employeeFilters.statuses
          || employeeFilters.customFilters)
      )) {
      const statusValues = employeeFilters.statuses ? getColumnArrayById(employeeFilters.statuses, 'id') : [];
      const customFilters = employeeFilters.customFilters ? queryGenerator(employeeFilters.customFilters) : '';
      dispatch(getEmployeeList(
        userInfo.data.company.id,
        appModels.USERMANAGEMENT,
        limit,
        offsetValue,
        statusValues,
        customFilters,
        sortByValue,
        sortFieldValue,
      ));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, employeeFilters, scrollTop]);

  useEffect(() => {
    if ((userInfo && userInfo) && viewId) {
      dispatch(getEmployeeDetail(viewId, appModels.USERMANAGEMENT));
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
    const scrollListCount = employeesInfo && employeesInfo.data && employeesInfo.data.length ? employeesInfo.data.length : 0;
    if ((employeesInfo
      && !employeesInfo.loading)
      && bottom && (total !== scrollListCount)
      && (total >= offsetValue)) {
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

  const statusValues = employeeFilters
    && employeeFilters.statuses
    ? getColumnArrayById(employeeFilters.statuses, 'id') : [];

  const statusList = employeeFilters
    && employeeFilters.statuses
    ? employeeFilters.statuses : [];

  return (

    <Card className="p-1 h-100">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h3>
          Employee Filter
        </h3>
        <hr className="m-0 " />
      </CardTitle>
      {id ? (
        <div onScroll={onScroll} className="height-100 table-scrollable thin-scrollbar">
          <div className="mb-1 p-2">
            <button
              className="  btn-remove btn-search mr-2 font-small float-right"
              id="Filters"
              type="button"
              cssClass="tooltipElement"
              onClick={() => showFilter(true)}
              // size="sm"
              data-testid="search"
            >
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faSearch}
                onMouseOver={() => toggle(6)}
                onMouseLeave={() => setOpenValues([])}
              />
            </button>
            <Tooltip
              placement="auto"
              isOpen={openValues.some((selectedValue) => selectedValue === 6)}
              target="Filters"
              data-testid="toolTipSearch"
            >
              Search
            </Tooltip>
            <br />
            <Popover trigger="legacy" placement="top" isOpen={isFilter} target="Filters" className="employeesPopoverCustom custom-style">
              <PopoverHeader className="custom-search">
                Search
                <FontAwesomeIcon
                  size="lg"
                  onClick={() => showFilter(false)}
                  className="cursor-pointer float-right"
                  icon={faTimesCircle}
                  data-testid="close"
                  type="button"
                />
              </PopoverHeader>
              <PopoverBody><Filters setOffset={setOffsetValue} afterReset={() => showFilter(false)} /></PopoverBody>
            </Popover>
            {statusList && statusList.map((team) => (
              <h5 key={team.id} className="mr-2 content-inline">
                <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                  {team.label}
                  <FontAwesomeIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => handleStatusClose(team.id)}
                    size="sm"
                    icon={faTimesCircle}
                  />
                </Badge>
              </h5>
            ))}
            {customFiltersList && customFiltersList.map((cf) => (
              <h5 key={cf.key} className="mr-2 content-inline">
                <Badge color="dark" className="p-2 mb-2 mt-2">
                  {cf.label}
                  {(cf.type === 'text' || cf.type === 'id') && (
                  <span>
                    {'  '}
                    &quot;
                    {cf.value}
                    &quot;
                  </span>
                  )}
                  <FontAwesomeIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => handleCustomFilterClose(cf.key)}
                    size="sm"
                    icon={faTimesCircle}
                  />
                </Badge>
              </h5>
            ))}
          </div>
          {((statusValues
            && statusValues.length > 0)
            || (
              customFiltersList
              && customFiltersList.length > 0))
            && (
              <div
                aria-hidden="true"
                className="cursor-pointer reset-filter mt-2 mb-2 text-info text-right mr-2 font-weight-800"
                onClick={handleResetClick}
                onKeyDown={handleResetClick}
              >
                Reset Filters
              </div>
            )}
          <hr className="mt-2" />
          <div>
            {employeesInfo && employeesInfo.data && employeesInfo.data.map((emp) => (
              <Card
                key={emp.id}
                onClick={() => setViewId(emp.id)}
                className={(emp.id === currentId) ? 'mb-2 ml-2 mr-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mb-2 ml-2 mr-2'}
              >
                <CardBody className="p-2 sideFilters border-nepal-1px">
                  <Row>
                    <Col md={12}>
                      <img src={employeeLogo} className="mr-1 img-icon" alt={emp.name} width="15" height="15" />
                      <span className="font-weight-700 mb-1 font-medium">{emp.name}</span>
                      <span className="float-right">
                        {getRegStatusLabel(emp.registration_status)}
                      </span>
                    </Col>
                  </Row>
                  <span className="font-weight-400 mb-1 ml-4 font-tiny">
                    {emp.employee_id_seq}
                  </span>
                  <p className="text-info font-weight-600 mb-0 ml-4">{emp.department_id ? emp.department_id[1] : ''}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {(employeesInfo && employeesInfo.err) && (
          <Card className="mb-2 border-nepal-1px ml-2 mr-2">
            <CardBody className="p-2">
              <ErrorContent errorTxt={generateErrorMessage(employeesInfo)} />
            </CardBody>
          </Card>
          )}

          {(userInfo && userInfo.data.err) && (
          <Card className="mb-2 border-nepal-1px ml-2 mr-2">
            <CardBody className="p-2">
              <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
            </CardBody>
          </Card>
          )}
          {((employeesInfo && employeesInfo.loading) || (userInfo && userInfo.data.loading)) && (
          <Loader />
          )}
          <br />
          <br />
        </div>
      ) : (
        <CardBody className="pl-1 p-0 mt-2 ml-1 h-100 position-relative scrollable-list thin-scrollbar">
          <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 mb-2 font-weight-800 collapse-heading">By Status</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon
                className="mr-2 cursor-pointer"
                onClick={() => setStatusCollapse(!statusCollapse)}
                size="sm"
                icon={statusCollapse ? faChevronUp : faChevronDown}
              />
            </Col>
          </Row>
          <Collapse isOpen={statusCollapse}>
            <div className="ml-n1">
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
                      <span className="margin-left-15px">{item.label}</span>
                    </Label>
                    {' '}
                  </div>
                </span>
              ))}
            </div>
          </Collapse>
          <hr className="mt-2" />
          {((statusValues
              && statusValues.length > 0)
              || (customFiltersList
                && customFiltersList.length > 0)) && (
                <div
                  aria-hidden="true"
                  className="float-right reset-filter cursor-pointer mb-4 mr-2 text-info font-weight-800"
                  onClick={handleResetClick}
                  onKeyDown={handleResetClick}
                >
                  Reset Filters
                </div>
          )}
        </CardBody>
      )}
    </Card>

  );
};

SideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  showFilter: PropTypes.func.isRequired,
  isFilter: PropTypes.bool.isRequired,
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
  setStatusValue: PropTypes.func,
};

SideFilters.defaultProps = {
  setStatusValue: undefined,
};
export default SideFilters;
