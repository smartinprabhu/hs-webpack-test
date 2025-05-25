/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Input, FormGroup, Label, Row, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'antd';

import collapseIcon from '@images/collapse.png';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import CollapseItemCustom from '@shared/sideTools/collapseItemCustom';
import CollapseItemDynamic from '@shared/sideTools/collapseItemDynamic';

import {
  getTicketList, getTicketCount, getCategoryGroups, getStateGroups, getPriorityGroups, getHelpdeskFilter, getIncidentTypeGroups,
} from '../ticketService';
import {
  getColumnArray, getColumnArrayById, truncate, generateErrorMessage,
  getAllCompanies, queryGeneratorWithUtc,
} from '../../util/appUtils';
import ticketsActions from '../data/ticketsActions.json';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, statusValue, categoryValue, priorityValue, afterReset,
    sortBy, sortField, columns, setCollapse, collapse, isIncident,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkCategoryValues, setCheckCategoryValues] = useState([]);
  const [checkCategoryItems, setCheckCategoryItems] = useState([]);
  const [checkPriorityValues, setCheckPriorityValues] = useState([]);
  const [checkPriorityItems, setCheckPriorityItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [statusRemovedValue, setStatusRemovedValue] = useState(statusValue);
  const [categoryRemovedValue, setCategoryRemovedValue] = useState(categoryValue);
  const [priorityRemovedValue, setPriorityRemovedValue] = useState(priorityValue);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [fields, setFields] = useState(columns);
  const [statusCollapse, setStatusCollapse] = useState(!isIncident);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [priorityCollapse, setPriorityCollapse] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [categoriesGroups, setCategories] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);

  const [incStatusCollapse, setIncStatusCollapse] = useState(!!isIncident);
  const [incTypeCollapse, setIncTypeCollapse] = useState(false);
  const [typeGroups, setTypeGroups] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    ticketsInfo, categoryGroupsInfo, stateGroupsInfo, priorityGroupsInfo, helpdeskFilter, stateChangeInfo,
    incidentTypeGroups, updateTicketInfo, addTicketInfo,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
    setFields(columns);
  }, [offset, sortBy, sortField, columns]);

  useEffect(() => {
    setStatusRemovedValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setCategoryRemovedValue(categoryValue);
  }, [categoryValue]);

  useEffect(() => {
    setPriorityRemovedValue(priorityValue);
  }, [priorityValue]);

  useEffect(() => {
    if (!id) {
      setTickets([]);
    }
  }, [id]);

  useEffect(() => {
    if (helpdeskFilter && helpdeskFilter.customFilters) {
      setCustomFilters(helpdeskFilter.customFilters);
    }
  }, [helpdeskFilter]);

  useEffect(() => {
    if (incTypeCollapse) {
      dispatch(getIncidentTypeGroups(companies, appModels.HELPDESK));
    }
  }, [incTypeCollapse]);

  useEffect(() => {
    if (incidentTypeGroups && incidentTypeGroups.data) {
      setTypeGroups(incidentTypeGroups.data);
    }
  }, [incidentTypeGroups]);

  useEffect(() => {
    if (statusRemovedValue && statusRemovedValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusRemovedValue));
      if (checkItems.filter((item) => item.id !== statusRemovedValue) && checkItems.filter((item) => item.id !== statusRemovedValue).length === 0) {
        const payload = {
          states: checkItems.filter((item) => item.id !== statusRemovedValue), categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getHelpdeskFilter(payload));
      }
    }
  }, [statusRemovedValue]);

  useEffect(() => {
    if (categoryRemovedValue && categoryRemovedValue !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== categoryRemovedValue));
      if (checkCategoryItems.filter((item) => item.id !== categoryRemovedValue) && checkCategoryItems.filter((item) => item.id !== categoryRemovedValue).length === 0) {
        const payload = {
          states: checkItems, categories: checkCategoryItems.filter((item) => item.id !== categoryRemovedValue), priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getHelpdeskFilter(payload));
      }
    }
  }, [categoryRemovedValue]);

  useEffect(() => {
    if (priorityRemovedValue && priorityRemovedValue !== 0) {
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== priorityRemovedValue));
      if (checkPriorityItems.filter((item) => item.id !== priorityRemovedValue) && checkPriorityItems.filter((item) => item.id !== priorityRemovedValue).length === 0) {
        const payload = {
          states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems.filter((item) => item.id !== priorityRemovedValue), customFilters: customFiltersList,
        };
        dispatch(getHelpdeskFilter(payload));
      }
    }
  }, [priorityRemovedValue]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkCategoryItems && checkCategoryItems.length > 0) || (checkPriorityItems && checkPriorityItems.length > 0)) {
      const payload = {
        states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersList,
      };
      dispatch(getHelpdeskFilter(payload));
    }
  }, [checkItems, checkCategoryItems, checkPriorityItems]);

  useEffect(() => {
    let statusValues = [];
    let categoryValues = [];
    let priorityValues = [];
    let filterList = [];
    let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (helpdeskFilter && helpdeskFilter.states && helpdeskFilter.states.length > 0) {
      statusValues = helpdeskFilter.states;
      setCheckItems(helpdeskFilter.states);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (checkCategoryItems && checkCategoryItems.length > 0) {
      categoryValues = checkCategoryItems;
    } else if (helpdeskFilter && helpdeskFilter.categories && helpdeskFilter.categories.length > 0) {
      categoryValues = helpdeskFilter.categories;
      setCheckCategoryItems(helpdeskFilter.categories);
      callFilter = false;
      setCategoryCollapse(true);
    }

    if (checkPriorityItems && checkPriorityItems.length > 0) {
      priorityValues = checkPriorityItems;
    } else if (helpdeskFilter && helpdeskFilter.priorities && helpdeskFilter.priorities.length > 0) {
      priorityValues = helpdeskFilter.priorities;
      setCheckPriorityItems(helpdeskFilter.priorities);
      callFilter = false;
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (helpdeskFilter && helpdeskFilter.customFilters) {
      filterList = helpdeskFilter.customFilters;
    }
    if (callFilter) {
      const payload = {
        states: statusValues, categories: categoryValues, priorities: priorityValues, customFilters: filterList,
      };
      dispatch(getHelpdeskFilter(payload));
    }
  }, []);

  useEffect(() => {
    if (ticketsInfo && ticketsInfo.data && id) {
      const arr = [...tickets, ...ticketsInfo.data];
      setTickets([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [ticketsInfo, id]);

  useEffect(() => {
    if (categoryGroupsInfo && categoryGroupsInfo.data) {
      setCategories(categoryGroupsInfo.data.filter((item) => item.category_id_count));
    }
  }, [categoryGroupsInfo]);

  useEffect(() => {
    if (userInfo.data && (helpdeskFilter && (helpdeskFilter.states || helpdeskFilter.categories || helpdeskFilter.priorities || helpdeskFilter.customFilters))) {
      const statusValues = helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const categories = helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const customFilters = helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      dispatch(getTicketCount(companies, appModels.HELPDESK, statusValues, categories, priorities, customFilters, isIncident));
    }
  }, [userInfo, helpdeskFilter]);

  useEffect(() => {
    if ((addTicketInfo && addTicketInfo.data) || (updateTicketInfo && updateTicketInfo.data) || (stateChangeInfo && stateChangeInfo.data)) {
      const statusValues = helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const categories = helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const customFilters = helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      dispatch(getTicketCount(companies, appModels.HELPDESK, statusValues, categories, priorities, customFilters, isIncident));
      dispatch(getTicketList(companies, appModels.HELPDESK, limit, offsetValue, fields, statusValues, categories, priorities, customFilters, sortByValue, sortFieldValue, isIncident));
    }
  }, [addTicketInfo, updateTicketInfo, stateChangeInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && (helpdeskFilter && (helpdeskFilter.states || helpdeskFilter.categories || helpdeskFilter.priorities || helpdeskFilter.customFilters))) {
      const statusValues = helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const categories = helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const customFilters = helpdeskFilter.customFilters ? queryGeneratorWithUtc(helpdeskFilter.customFilters, false, userInfo.data) : '';
      dispatch(getTicketList(companies, appModels.HELPDESK, limit, offsetValue, fields, statusValues, categories, priorities, customFilters, sortByValue, sortFieldValue, isIncident));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, fields, helpdeskFilter]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && categoryCollapse) {
      dispatch(getCategoryGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, categoryCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && statusCollapse) {
      dispatch(getStateGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, statusCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && priorityCollapse) {
      dispatch(getPriorityGroups(companies, appModels.HELPDESK, isIncident));
    }
  }, [userInfo, priorityCollapse]);

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
      if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems.filter((item) => item.id !== value), categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getHelpdeskFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTickets([]);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'incident_state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersData = [...customFiltersList, ...filters];
      const payload = {
        states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersData,
      };
      dispatch(getHelpdeskFilter(payload));
    } else {
      const customFiltersData = customFiltersList.filter((item) => item.value !== value);
      const payload = {
        states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersData,
      };
      dispatch(getHelpdeskFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTickets([]);
  };

  const handleTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'incident_type_id', title: 'Type', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersData = [...customFiltersList, ...filters];
      const payload = {
        states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersData,
      };
      dispatch(getHelpdeskFilter(payload));
    } else {
      const customFiltersData = customFiltersList.filter((item) => item.value !== parseInt(value));
      const payload = {
        states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems, customFilters: customFiltersData,
      };
      dispatch(getHelpdeskFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTickets([]);
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCategoryValues((state) => [...state, value]);
      setCheckCategoryItems((state) => [...state, values]);
    } else {
      setCheckCategoryValues(checkCategoryValues.filter((item) => item !== value));
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
      if (checkCategoryItems.filter((item) => item.id !== value) && checkCategoryItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems, categories: checkCategoryItems.filter((item) => item.id !== value), priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getHelpdeskFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTickets([]);
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
      if (checkPriorityItems.filter((item) => item.id !== value) && checkPriorityItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems, categories: checkCategoryItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
        };
        dispatch(getHelpdeskFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTickets([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckCategoryValues([]);
    setCheckCategoryItems([]);
    setCheckPriorityValues([]);
    setCheckPriorityItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    const payload = {
      states: [], categories: [], priorities: [], customFilters: [],
    };
    dispatch(getHelpdeskFilter(payload));
    if (afterReset) afterReset();
    setTickets([]);
  };

  const onSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = typeGroups.filter((item) => {
        const searchValue = item.incident_type_id ? item.incident_type_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setTypeGroups(ndata);
    } else {
      setTypeGroups(incidentTypeGroups && incidentTypeGroups.data ? incidentTypeGroups.data : []);
    }
  };

  const onCategorySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = categoriesGroups.filter((item) => {
        const searchValue = item.category_id ? item.category_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setCategories(ndata);
    } else {
      setCategories(categoryGroupsInfo && categoryGroupsInfo.data ? categoryGroupsInfo.data.filter((item) => item.category_id_count) : []);
    }
  };

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (categoryGroupsInfo && categoryGroupsInfo.err) ? generateErrorMessage(categoryGroupsInfo) : userErrorMsg;
  const errorMsgPriority = (priorityGroupsInfo && priorityGroupsInfo.err) ? generateErrorMessage(priorityGroupsInfo) : userErrorMsg;
  const errorMsgStatus = (stateGroupsInfo && stateGroupsInfo.err) ? generateErrorMessage(stateGroupsInfo) : userErrorMsg;

  const states = stateGroupsInfo && stateGroupsInfo.data ? stateGroupsInfo.data.filter((item) => item.state_id_count) : [];
  const priorities = priorityGroupsInfo && priorityGroupsInfo.data ? priorityGroupsInfo.data.filter((item) => item.priority_id_count) : [];

  const statusValues = helpdeskFilter && helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
  const categoryValues = helpdeskFilter && helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
  const priorityValues = helpdeskFilter && helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];

  const statusList = helpdeskFilter && helpdeskFilter.states ? helpdeskFilter.states : [];
  const categoryList = helpdeskFilter && helpdeskFilter.categories ? helpdeskFilter.categories : [];
  const priorityList = helpdeskFilter && helpdeskFilter.priorities ? helpdeskFilter.priorities : [];

  const stateValuesList = (helpdeskFilter && helpdeskFilter.customFilters && helpdeskFilter.customFilters.length > 0) ? helpdeskFilter.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  return (
    <Card className="p-1 bg-lightblue area-height-100" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
          <CardBody className="ml-2 pl-2px p-0 mt-2 position-relative side-filters-list thin-scrollbar">
            {isIncident && (
              <>
                <CollapseItemCustom
                  title="STATUS"
                  data={ticketsActions && ticketsActions.incidentStates ? ticketsActions.incidentStates : []}
                  selectedValues={stateValues}
                  onCollapse={() => setIncStatusCollapse(!incStatusCollapse)}
                  isOpen={incStatusCollapse}
                  onCheckboxChange={handleStatusCheckboxChange}
                />
                <CollapseItemDynamic
                  title="TYPE"
                  data={incidentTypeGroups}
                  selectedValues={stateValues}
                  dataGroup={typeGroups}
                  placeholder="Type"
                  filtervalue="incident_type_id"
                  onCollapse={() => setIncTypeCollapse(!incTypeCollapse)}
                  isOpen={incTypeCollapse}
                  onCheckboxChange={handleTypeCheckboxChange}
                  onSearchChange={onSearchChange}
                />
              </>
            )}
            {!isIncident && (
              <>
                <Row className="m-0 checkBoxFilter-title">
                  <Col md="8" className="p-0">
                    <p className="m-0 font-weight-800 collapse-heading">BY  STATUS</p>
                  </Col>
                  <Col md="4" className="text-right p-0">
                    <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
                  </Col>
                </Row>
                <Collapse className="filter-checkbox" isOpen={statusCollapse}>
                  <div>
                    {((stateGroupsInfo && stateGroupsInfo.loading) || isUserLoading) && (
                      <Loader />
                    )}
                    {states && states.map((state, index) => (
                      state.state_id && (
                        <span className="mb-1 d-block font-weight-500" key={state.state_id}>
                          <div className="checkbox">
                            <Input
                              type="checkbox"
                              id={`checkboxstateaction${index}`}
                              value={state.state_id[1]}
                              name={state.state_id[1]}
                              checked={statusValues.some((selectedValue) => selectedValue.includes(state.state_id[1]))}
                              onChange={handleCheckboxChange}
                            />
                            <Label htmlFor={`checkboxstateaction${index}`}>
                              <span>{state.state_id[1]}</span>
                            </Label>
                            {' '}
                          </div>
                        </span>
                      )
                    ))}
                    {((stateGroupsInfo && stateGroupsInfo.err) || isUserError || (states.length === 0 && !stateGroupsInfo.loading)) && (
                      <ErrorContent errorTxt={errorMsgStatus} />
                    )}
                  </div>
                </Collapse>
                <hr className="mt-2" />
              </>
            )}
            <Row className="m-0 checkBoxFilter-title">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY  PRIORITY</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPriorityCollapse(!priorityCollapse)} size="sm" icon={priorityCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse className="filter-checkbox" isOpen={priorityCollapse}>
              <div className="pl-1">
                {((priorityGroupsInfo && priorityGroupsInfo.loading) || isUserLoading) && (
                  <Loader />
                )}
                {priorities && priorities.map((priority, index) => (
                  priority.priority_id && (
                    <span className="mb-1 d-block font-weight-500" key={priority.priority_id}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxpriorityaction${index}`}
                          value={priority.priority_id[0]}
                          name={priority.priority_id[1]}
                          checked={priorityValues.some((selectedValue) => parseInt(selectedValue) === parseInt(priority.priority_id[0]))}
                          onChange={handlePriorityCheckboxChange}
                        />
                        {' '}
                        <Label htmlFor={`checkboxpriorityaction${index}`}>
                          <span>{priority.priority_id[1]}</span>
                        </Label>
                      </div>
                    </span>
                  )
                ))}
                {((priorityGroupsInfo && priorityGroupsInfo.err) || isUserError || (priorities.length === 0 && !priorityGroupsInfo.loading)) && (
                  <ErrorContent errorTxt={errorMsgPriority} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0 checkBoxFilter-title">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY CATEGORY</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse className="filter-checkbox" isOpen={categoryCollapse}>
              {(categoryGroupsInfo && categoryGroupsInfo.data && categoryGroupsInfo.data.length > 10) && (
                <FormGroup className="mt-2 mb-0">
                  <Input type="input" name="categorySearchValue" placeholder="Search.." onChange={onCategorySearchChange} id="categorySearchValue" className="border-radius-50px" />
                </FormGroup>
              )}
              <div className="pl-1">
                {((categoryGroupsInfo && categoryGroupsInfo.loading) || isUserLoading) && (
                  <Loader />
                )}
                {categoriesGroups && categoriesGroups.map((categoryItem, index) => (
                  categoryItem.category_id && categoryItem.category_id_count && (
                    <span className="mb-1 d-block font-weight-500" key={categoryItem.category_id}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxscitemaction${index}`}
                          value={categoryItem.category_id[0]}
                          name={categoryItem.category_id[1]}
                          checked={categoryValues.some((selectedValue) => parseInt(selectedValue) === parseInt(categoryItem.category_id[0]))}
                          onChange={handleCategoryCheckboxChange}
                        />
                        <Label htmlFor={`checkboxscitemaction${index}`}>
                          <Tooltip title={categoryItem.category_id[1]} placement="top">
                            <span>{truncate(categoryItem.category_id[1], 27)}</span>
                          </Tooltip>
                        </Label>

                        {' '}
                      </div>
                    </span>
                  )
                ))}
                {((categoryGroupsInfo && categoryGroupsInfo.err) || isUserError || (categoriesGroups.length === 0 && !categoryGroupsInfo.loading)) && (
                  <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((statusList && statusList.length > 0) || (categoryList && categoryList.length > 0) || (priorityList && priorityList.length > 0) || (customFiltersList && customFiltersList.length > 0))
              && (
                <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
              )}
          </CardBody>
        </>
      ) : ''}
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
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
  isIncident: PropTypes.bool,
};
SideFilters.defaultProps = {
  setCollapse: () => { },
  collapse: false,
  isIncident: false,
};

export default SideFilters;
