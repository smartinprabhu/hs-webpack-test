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

import preventiveMaintenanceBlack from '@images/icons/preventiveMaintenanceBlack.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getPreventiveList, getPreventiveCount,
  getPreventiveDetail, getPreventiveFilter,
} from '../../../../preventiveMaintenance/ppmService';
import {
  getColumnArray, getColumnArrayById, truncate, getTotalCount, generateErrorMessage, queryGeneratorWithUtc,
} from '../../../../util/appUtils';
import preventiveActions from '../../../../preventiveMaintenance/data/preventiveActions.json';
import { getppmForLabel } from '../../../../preventiveMaintenance/utils/utils';

const appModels = require('../../../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, scheduleValue, categoryValue, priorityValue, afterReset,
    sortBy, sortField, columns,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkppmByValue, setCheckppmByValue] = useState([]);
  const [checkppmByItems, setCheckppmByItems] = useState([]);
  const [checkPriorityValues, setCheckPriorityValues] = useState([]);
  const [checkPriorityItems, setCheckPriorityItems] = useState([]);
  const [viewId, setViewId] = useState('');
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [fields, setFields] = useState(columns);
  const [scrollTop, setScrollTop] = useState(0);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [priorityCollapse, setPriorityCollapse] = useState(false);
  const [preventive, setPreventive] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmCount, ppmInfo, ppmFilter,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
    setFields(columns);
  }, [offset, sortBy, sortField, columns]);

  useEffect(() => {
    if (!id) {
      setPreventive([]);
    }
  }, [id]);

  useEffect(() => {
    if (ppmFilter && ppmFilter.customFilters) {
      setCustomFilters(ppmFilter.customFilters);
    }
  }, [ppmFilter]);

  useEffect(() => {
    if (scheduleValue && scheduleValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== scheduleValue));
    }
    if (categoryValue && categoryValue !== 0) {
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== categoryValue));
    }
    if (priorityValue && priorityValue !== 0) {
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== priorityValue));
    }
  }, [scheduleValue, categoryValue, priorityValue]);

  useEffect(() => {
    const payload = {
      states: checkItems, categories: checkppmByItems, priorities: checkPriorityItems, customFilters: customFiltersList,
    };
    dispatch(getPreventiveFilter(payload));
  }, [checkItems, checkppmByItems, checkPriorityItems]);

  useEffect(() => {
    let scheduleValues = [];
    let ppmByValue = [];
    let priorityValues = [];
    let filterList = [];
    if (checkItems && checkItems.length > 0) {
      scheduleValues = checkItems;
    } else if (ppmFilter && ppmFilter.states) {
      scheduleValues = ppmFilter.states;
      setStatusCollapse(true);
    }

    if (checkppmByItems && checkppmByItems.length > 0) {
      ppmByValue = checkppmByItems;
    } else if (ppmFilter && ppmFilter.categories) {
      ppmByValue = ppmFilter.categories;
    }

    if (checkPriorityItems && checkPriorityItems.length > 0) {
      priorityValues = checkPriorityItems;
    } else if (ppmFilter && ppmFilter.priorities) {
      priorityValues = ppmFilter.priorities;
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (ppmFilter && ppmFilter.customFilters) {
      filterList = ppmFilter.customFilters;
    }

    const payload = {
      states: scheduleValues, categories: ppmByValue, priorities: priorityValues, customFilters: filterList,
    };
    dispatch(getPreventiveFilter(payload));
  }, []);

  useEffect(() => {
    if (ppmInfo && ppmInfo.data && id) {
      const arr = [...preventive, ...ppmInfo.data];
      setPreventive([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [ppmInfo, id]);

  useEffect(() => {
    if (userInfo.data && (ppmFilter && (ppmFilter.states || ppmFilter.categories || ppmFilter.priorities || ppmFilter.customFilters))) {
      const scheduleValues = ppmFilter.states ? getColumnArray(ppmFilter.states, 'id') : [];
      const categories = ppmFilter.categories ? getColumnArray(ppmFilter.categories, 'id') : [];
      const priorities = ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];
      const customFilters = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters, false, userInfo.data) : '';
      dispatch(getPreventiveCount(userInfo.data.company.id, appModels.PPMCALENDAR, scheduleValues, categories, priorities, customFilters));
    }
  }, [userInfo, ppmFilter]);

  useEffect(() => {
    if (userInfo.data && (ppmFilter && (ppmFilter.states || ppmFilter.categories || ppmFilter.priorities || ppmFilter.customFilters))) {
      const scheduleValues = ppmFilter.states ? getColumnArray(ppmFilter.states, 'id') : [];
      const categories = ppmFilter.categories ? getColumnArray(ppmFilter.categories, 'id') : [];
      const priorities = ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];
      const customFilters = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters, false, userInfo.data) : '';
      dispatch(getPreventiveList(userInfo.data.company.id, appModels.PPMCALENDAR, limit, offsetValue, fields, scheduleValues, categories, priorities, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, fields, ppmFilter, scrollTop]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getPreventiveDetail(viewId, appModels.PPMCALENDAR));
    }
  }, [userInfo, viewId]);

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
    setPreventive([]);
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckppmByValue((state) => [...state, value]);
      setCheckppmByItems((state) => [...state, values]);
    } else {
      setCheckppmByValue(checkppmByValue.filter((item) => item !== value));
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== value));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handlePriorityCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckPriorityValues((state) => [...state, value]);
      setCheckPriorityItems((state) => [...state, values]);
    } else {
      setCheckPriorityValues(checkPriorityValues.filter((item) => item !== value));
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== value));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleppmByClose = (value) => {
    setCheckppmByValue(checkppmByValue.filter((item) => item !== value));
    setCheckppmByItems(checkppmByItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handlePriorityClose = (value) => {
    setCheckPriorityValues(checkPriorityValues.filter((item) => item !== value));
    setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    const payload = {
      states: checkItems, categories: checkppmByItems, priorities: checkPriorityItems, customFilters: customFiltersList.filter((item) => item.key !== value),
    };
    dispatch(getPreventiveFilter(payload));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckppmByValue([]);
    setCheckppmByItems([]);
    setCheckPriorityValues([]);
    setCheckPriorityItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    const ppmCountValue = ppmCount && ppmCount.data ? ppmCount.data : 0;
    const total = getTotalCount(ppmCountValue);
    const scrollListCount = preventive && preventive.length ? preventive.length : 0;
    if ((ppmInfo && !ppmInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const currentId = viewId || id;

  const scheduleValues = ppmFilter && ppmFilter.states ? getColumnArrayById(ppmFilter.states, 'id') : [];
  const ppmByValue = ppmFilter && ppmFilter.categories ? getColumnArrayById(ppmFilter.categories, 'id') : [];
  const priorityValues = ppmFilter && ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];

  const scheduleList = ppmFilter && ppmFilter.states ? ppmFilter.states : [];
  const ppmByList = ppmFilter && ppmFilter.categories ? ppmFilter.categories : [];
  const priorityList = ppmFilter && ppmFilter.priorities ? ppmFilter.priorities : [];

  return (

    <Card className="p-1 bg-white h-100 border-0">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2">
        <h4>
          Filters
        </h4>
      </CardTitle>
      <hr className="m-0 border-color-grey ml-2px" />
      {id ? (
        <>
          <div onScroll={onScroll} className="pt-0 pl-0 pr-1 height-100 table-scrollable thin-scrollbar">
            <div className="mb-1 mr-2 ml-2 mt-2">
              {ppmByList && ppmByList.map((ppm) => (
                <h5 key={ppm.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {ppm.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleppmByClose(ppm.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {scheduleList && scheduleList.map((schedule) => (
                <h5 key={schedule.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {schedule.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(schedule.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {priorityList && priorityList.map((priority) => (
                <h5 key={priority.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {priority.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handlePriorityClose(priority.id)} size="sm" icon={faTimesCircle} />
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
            </div>
            {((checkPriorityItems && checkPriorityItems.length > 0) || (checkItems && checkItems.length > 0)
              || (checkppmByItems && checkppmByItems.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
                <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
              )}
            {(ppmInfo && ppmInfo.data && ppmInfo.data.length === 0) && (
              <Card className="mb-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt="No data found." />
                </CardBody>
              </Card>
            )}
            {(preventive) && preventive.map((ppm) => (
              <Card
                key={ppm.id}
                onClick={() => setViewId(ppm.id)}
                className={(ppm.id === currentId) ? 'mb-2  border-nepal-1px cursor-pointer mr-2 ml-2' : 'cursor-pointer mb-2 mr-2 ml-2'}
              >
                <CardBody className="p-2">
                  <Row>
                    <Col md={12} className="nowrap-content">
                      <img src={preventiveMaintenanceBlack} className="mr-1" height="16" width="16" alt="ppm" />
                      <span className="font-weight-800" title={ppm.name}>{truncate(ppm.name, 20)}</span>
                    </Col>
                  </Row>
                  <span className="font-weight-400 mb-1 ml-3 font-size-13">
                    {getppmForLabel(ppm.category_type)}
                  </span>
                  <Row>
                    <Col md={12} className="nowrap-content">
                      <span className="text-info font-weight-600 mb-0 ml-3 font-tiny">
                        {ppm.mro_ord_count}
                        {' '}
                        Work Orders
                      </span>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            ))}
            {(ppmInfo && ppmInfo.err) && (
              <Card className="mb-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(ppmInfo)} />
                </CardBody>
              </Card>
            )}

            {(userInfo && userInfo.err) && (
              <Card className="mb-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                </CardBody>
              </Card>
            )}
            {((ppmInfo && ppmInfo.loading) || (userInfo && userInfo.loading)) && (
              <Loader />
            )}
          </div>
          {((checkPriorityItems && checkPriorityItems.length > 0) || (checkItems && checkItems.length > 0)
            || (checkppmByItems && checkppmByItems.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
              <div aria-hidden="true" className="cursor-pointer mt-2 mb-4 text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
        </>
      ) : (
        <CardBody className="ml-2 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
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
              {preventiveActions.timeperiod.map((tp, index) => (
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
                    <Label htmlFor={`checkboxstateaction${index}`}>
                      <span className="ml-2">{tp.label}</span>
                    </Label>
                    {' '}
                  </div>
                </span>
              ))}
            </div>
          </Collapse>
          <hr className="mt-2" />
          <Row className="m-0">
            <Col md="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">BY  PRIORITY</p>
            </Col>
            <Col md="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPriorityCollapse(!priorityCollapse)} size="sm" icon={priorityCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={priorityCollapse}>
            <div className="pl-1">
              {preventiveActions.priority.map((priority, index) => (
                <span className="mb-1 d-block font-weight-500" key={priority.value}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxpriorityaction${index}`}
                      value={priority.value}
                      name={priority.label}
                      checked={priorityValues.some((selectedValue) => selectedValue === priority.value)}
                      onChange={handlePriorityCheckboxChange}
                    />
                    {' '}
                    <Label htmlFor={`checkboxpriorityaction${index}`}>
                      <span className="ml-2">{priority.label}</span>
                    </Label>
                  </div>
                </span>
              ))}
            </div>
          </Collapse>
          <hr className="mt-2" />
          <Row className="m-0">
            <Col md="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">PERFORMED BY</p>
            </Col>
            <Col md="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={categoryCollapse}>
            <div className="pl-1">
              {preventiveActions.ppmBy.map((ppmBy, index) => (
                <span className="mb-1 d-block font-weight-500" key={ppmBy.value}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcitemaction${index}`}
                      value={ppmBy.value}
                      name={ppmBy.label}
                      checked={ppmByValue.some((selectedValue) => selectedValue.includes(ppmBy.value))}
                      onChange={handleCategoryCheckboxChange}
                    />
                    <Label htmlFor={`checkboxcitemaction${index}`}>
                      <span className="ml-2">{ppmBy.label}</span>
                    </Label>

                    {' '}
                  </div>
                </span>
              ))}
            </div>
          </Collapse>
          <hr className="mt-2" />
          {((scheduleList && scheduleList.length > 0) || (ppmByList && ppmByList.length > 0) || (priorityList && priorityList.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
          )}
        </CardBody>
      )}
    </Card>

  );
};

SideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  scheduleValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  categoryValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  priorityValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
};

export default SideFilters;
