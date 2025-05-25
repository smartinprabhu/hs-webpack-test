/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Label, Input, FormGroup, Row, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import collapseIcon from '@images/collapse.png';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import CollapseItemCustom from '@shared/sideTools/collapseItemCustom';

import {
  getWorkorders, getWorkorderCount, getTeamGroups, getStateGroups, getPriorityGroups, getMaintenanceTypeGroups, getTypeGroups,
  getOrderDetail, getWorkorderFilter,
} from '../workorderService';
import {
  getWorkOrderStateText, getWorkOrderPriorityText,
  getMTName, getWorkOrderTypeName,
} from '../utils/utils';
import {
  getColumnArray, getColumnArrayById, 
  generateErrorMessage, getAllowedCompanies, queryGeneratorWithUtc,
} from '../../util/appUtils';
import workorderCustomData from '../data/workorderActions.json';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, statusValue, teamValue, priorityValue, mTypeValue, typeValue, afterReset, setCollapse, collapse,
    sortBy, sortField, columns,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkTeamValues, setCheckTeamValues] = useState([]);
  const [checkTeamItems, setCheckTeamItems] = useState([]);
  const [checkPriorityValues, setCheckPriorityValues] = useState([]);
  const [checkPriorityItems, setCheckPriorityItems] = useState([]);
  const [checkMTypeValues, setCheckMTypeValues] = useState([]);
  const [checkMtypeItems, setCheckMtypeItems] = useState([]);
  const [checkTypeValues, setCheckTypeValues] = useState([]);
  const [checkTypeItems, setCheckTypeItems] = useState([]);
  const [viewId, setViewId] = useState(id);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);

  const [statusRemovedValue, setStatusRemovedValue] = useState(statusValue);
  const [teamRemovedValue, setTeamRemovedValue] = useState(teamValue);
  const [priorityRemovedValue, setPriorityRemovedValue] = useState(priorityValue);
  const [mTypeRemovedValue, setMTypeRemovedValue] = useState(mTypeValue);
  const [typeRemovedValue, setTypeRemovedValue] = useState(typeValue);

  const [fields, setFields] = useState(columns);
  const [scrollTop, setScrollTop] = useState(0);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [teamCollapse, setTeamCollapse] = useState(false);
  const [priorityCollapse, setPriorityCollapse] = useState(false);
  const [maintenanceTypeCollapse, setMaintenanceTypeCollapse] = useState(false);
  const [typeCollapse, setTypeCollapse] = useState(false);
  const [workorders, setWorkorders] = useState([]);
  const [teamGroups, setteamGroups] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [stypeCollapse, setStypeCollapse] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    workorderCount, workordersInfo, teamGroupsInfo, stateGroupsInfo, priorityGroupsInfo, workorderFilters, stateChangeInfo, maintenanceTypeGroupsInfo, typeGroupsInfo,
  } = useSelector((state) => state.workorder);

  useEffect(() => {
    setViewId(id);
  }, [id]);

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
    setTeamRemovedValue(teamValue);
  }, [teamValue]);

  useEffect(() => {
    setPriorityRemovedValue(priorityValue);
  }, [priorityValue]);

  useEffect(() => {
    setMTypeRemovedValue(mTypeValue);
  }, [mTypeValue]);

  useEffect(() => {
    setTypeRemovedValue(typeValue);
  }, [typeValue]);

  useEffect(() => {
    if (!id) {
      setWorkorders([]);
    }
  }, [id]);

  useEffect(() => {
    if (workorderFilters && workorderFilters.customFilters) {
      setCustomFilters(workorderFilters.customFilters);
    }
  }, [workorderFilters]);

  useEffect(() => {
    if (statusRemovedValue && statusRemovedValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusRemovedValue));
      if (checkItems.filter((item) => item.id !== statusRemovedValue) && checkItems.filter((item) => item.id !== statusRemovedValue).length === 0) {
        const payload = {
          states: checkItems.filter((item) => item.id !== statusRemovedValue), teams: checkTeamItems, priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
  }, [statusRemovedValue]);

  useEffect(() => {
    if (teamRemovedValue && teamRemovedValue !== 0) {
      setCheckTeamItems(checkTeamItems.filter((item) => item.id !== teamRemovedValue));
      if (checkTeamItems.filter((item) => item.id !== teamRemovedValue) && checkTeamItems.filter((item) => item.id !== teamRemovedValue).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems.filter((item) => item.id !== teamRemovedValue), priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
  }, [teamRemovedValue]);

  useEffect(() => {
    if (priorityRemovedValue && priorityRemovedValue !== 0) {
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== priorityRemovedValue));
      if (checkPriorityItems.filter((item) => item.id !== priorityRemovedValue) && checkPriorityItems.filter((item) => item.id !== priorityRemovedValue).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== priorityRemovedValue), customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
  }, [priorityRemovedValue]);

  useEffect(() => {
    if (mTypeRemovedValue && mTypeRemovedValue !== 0) {
      setCheckMtypeItems(checkMtypeItems.filter((item) => item.id !== mTypeRemovedValue));
      if (checkMtypeItems.filter((item) => item.id !== mTypeRemovedValue) && checkMtypeItems.filter((item) => item.id !== mTypeRemovedValue).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== mTypeRemovedValue), customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
  }, [mTypeRemovedValue]);

  useEffect(() => {
    if (typeRemovedValue && typeRemovedValue !== 0) {
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== typeRemovedValue));
      if (checkTypeItems.filter((item) => item.id !== typeRemovedValue) && checkTypeItems.filter((item) => item.id !== typeRemovedValue).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== typeRemovedValue), customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
  }, [typeRemovedValue]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkTeamItems && checkTeamItems.length > 0) || (checkPriorityItems && checkPriorityItems.length > 0)
    || (checkMtypeItems && checkMtypeItems.length > 0) || (checkTypeItems && checkTypeItems.length > 0)) {
      const payload = {
        states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems, maintenanceTypes: checkMtypeItems, types: checkTypeItems, customFilters: customFiltersList,
      };
      dispatch(getWorkorderFilter(payload));
    }
  }, [checkItems, checkTeamItems, checkPriorityItems, checkMtypeItems, checkTypeItems]);

  useEffect(() => {
    let statusValues = [];
    let teamValues = [];
    let priorityValues = [];
    let mTypeValues = [];
    const typeValues = [];
    let filterList = [];
    let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (workorderFilters && workorderFilters.states && workorderFilters.states.length > 0) {
      statusValues = workorderFilters.states;
      setCheckItems(workorderFilters.states);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (checkTeamItems && checkTeamItems.length > 0) {
      teamValues = checkTeamItems;
    } else if (workorderFilters && workorderFilters.teams && workorderFilters.teams.length > 0) {
      teamValues = workorderFilters.teams;
      setCheckTeamItems(workorderFilters.teams);
      callFilter = false;
    }

    if (checkPriorityItems && checkPriorityItems.length > 0) {
      priorityValues = checkPriorityItems;
    } else if (workorderFilters && workorderFilters.priorities && workorderFilters.priorities.length > 0) {
      priorityValues = workorderFilters.priorities;
      setCheckPriorityItems(workorderFilters.priorities);
      callFilter = false;
    }

    if (checkMtypeItems && checkMtypeItems.length > 0) {
      mTypeValues = checkMtypeItems;
    } else if (workorderFilters && workorderFilters.maintenanceTypes && workorderFilters.maintenanceTypes.length > 0) {
      mTypeValues = workorderFilters.maintenanceTypes;
      setCheckMtypeItems(workorderFilters.maintenanceTypes);
      callFilter = false;
    }

    if (checkTypeItems && checkTypeItems.length > 0) {
      mTypeValues = checkTypeItems;
    } else if (workorderFilters && workorderFilters.types && workorderFilters.types.length > 0) {
      mTypeValues = workorderFilters.types;
      setCheckTypeItems(workorderFilters.types);
      callFilter = false;
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (workorderFilters && workorderFilters.customFilters) {
      filterList = workorderFilters.customFilters;
    }

    if (callFilter) {
      const payload = {
        states: statusValues, teams: teamValues, priorities: priorityValues, maintenanceTypes: mTypeValues, types: typeValues, customFilters: filterList,
      };
      dispatch(getWorkorderFilter(payload));
    }
  }, []);

  useEffect(() => {
    if (workordersInfo && workordersInfo.data && id) {
      const arr = [...workorders, ...workordersInfo.data];
      setWorkorders([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [workordersInfo, id]);

  useEffect(() => {
    if (teamGroupsInfo && teamGroupsInfo.data) {
      setteamGroups(teamGroupsInfo.data);
    }
  }, [teamGroupsInfo]);

  function checkDateField(oData, cData) {
    let res = 'date_start_scheduled';
    if (oData && oData.length) {
      res = 'date_start_scheduled';
    } else if (cData && cData.length) {
      res = 'date_start_scheduled';
    }
    return res;
  }

  useEffect(() => {
    if (userInfo.data && (workorderFilters && (workorderFilters.states || workorderFilters.teams
      || workorderFilters.priorities || workorderFilters.maintenanceTypes || workorderFilters.customFilters))) {
      const openData = workorderFilters && workorderFilters.states ? workorderFilters.states.filter((item) => item.id === 'ready') : false;
      const closeData = workorderFilters && workorderFilters.states ? workorderFilters.states.filter((item) => item.id === 'done') : false;
      if ((openData && openData.length) || (closeData && closeData.length)) {
        if (workorderFilters && workorderFilters.customFilters && workorderFilters.customFilters.filter((item) => item.type === 'customdatedynamic')
          && workorderFilters.customFilters.filter((item) => item.type === 'customdatedynamic').length) {
          workorderFilters.customFilters[0].datefield = checkDateField(openData, closeData);
        }
        if (workorderFilters && workorderFilters.customFilters && workorderFilters.customFilters.filter((item) => item.type === 'customdatefield')
          && workorderFilters.customFilters.filter((item) => item.type === 'customdatefield').length) {
          workorderFilters.customFilters[0].datefield = checkDateField(openData, closeData);
        }
      }
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWorkorderCount(companies, appModels.ORDER, statusValues, teams, priorities, maintenanceTypes, types, customFilters));
    }
  }, [userInfo, workorderFilters]);

  useEffect(() => {
    if (userInfo.data && (workorderFilters && (workorderFilters.states || workorderFilters.teams
      || workorderFilters.priorities || workorderFilters.maintenanceTypes || workorderFilters.customFilters))) {
      const openData = workorderFilters && workorderFilters.states ? workorderFilters.states.filter((item) => item.id === 'ready') : false;
      const closeData = workorderFilters && workorderFilters.states ? workorderFilters.states.filter((item) => item.id === 'done') : false;
      if ((openData && openData.length) || (closeData && closeData.length)) {
        if (workorderFilters && workorderFilters.customFilters && workorderFilters.customFilters.filter((item) => item.type === 'customdatedynamic')
          && workorderFilters.customFilters.filter((item) => item.type === 'customdatedynamic').length) {
          workorderFilters.customFilters[0].datefield = checkDateField(openData, closeData);
        }
        if (workorderFilters && workorderFilters.customFilters && workorderFilters.customFilters.filter((item) => item.type === 'customdatefield')
          && workorderFilters.customFilters.filter((item) => item.type === 'customdatefield').length) {
          workorderFilters.customFilters[0].datefield = checkDateField(openData, closeData);
        }
      }
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWorkorders(companies, appModels.ORDER, limit, offsetValue, fields, statusValues, teams, priorities, maintenanceTypes, types, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, fields, workorderFilters, scrollTop]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (stateChangeInfo && stateChangeInfo.data)) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWorkorderCount(companies, appModels.ORDER, statusValues, teams, priorities, maintenanceTypes, types, customFilters));
      dispatch(getWorkorders(companies, appModels.ORDER, limit, offsetValue, fields, statusValues, teams, priorities, maintenanceTypes, types, customFilters, sortByValue, sortFieldValue));
    }
  }, [stateChangeInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && id === 0) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGeneratorWithUtc(workorderFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWorkorders(companies, appModels.ORDER, limit, offsetValue, fields, statusValues, teams, priorities, maintenanceTypes, types, customFilters, sortByValue, sortFieldValue));
    }
  }, [id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && teamCollapse) {
      dispatch(getTeamGroups(companies, appModels.ORDER));
    }
  }, [userInfo, teamCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && statusCollapse) {
      dispatch(getStateGroups(companies, appModels.ORDER));
    }
  }, [userInfo, statusCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && priorityCollapse) {
      dispatch(getPriorityGroups(companies, appModels.ORDER));
    }
  }, [userInfo, priorityCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && maintenanceTypeCollapse) {
      dispatch(getMaintenanceTypeGroups(companies, appModels.ORDER));
    }
  }, [userInfo, maintenanceTypeCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && typeCollapse) {
      dispatch(getTypeGroups(companies, appModels.ORDER));
    }
  }, [userInfo, typeCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
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
      if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems.filter((item) => item.id !== value), teams: checkTeamItems, priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleTeamCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckTeamValues((state) => [...state, value]);
      setCheckTeamItems((state) => [...state, values]);
    } else {
      setCheckTeamValues(checkTeamValues.filter((item) => item !== value));
      setCheckTeamItems(checkTeamItems.filter((item) => item.id !== value));
      if (checkTeamItems.filter((item) => item.id !== value) && checkTeamItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems.filter((item) => item.id !== value), priorities: checkPriorityItems, customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
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
          states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleMTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckMTypeValues((state) => [...state, value]);
      setCheckMtypeItems((state) => [...state, values]);
    } else {
      setCheckMTypeValues(checkMTypeValues.filter((item) => item !== value));
      setCheckMtypeItems(checkMtypeItems.filter((item) => item.id !== value));
      if (checkMtypeItems.filter((item) => item.id !== value) && checkMtypeItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckTypeValues((state) => [...state, value]);
      setCheckTypeItems((state) => [...state, values]);
    } else {
      setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
      if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleTeamClose = (value) => {
    setCheckTeamValues(checkTeamValues.filter((item) => item !== value));
    setCheckTeamItems(checkTeamItems.filter((item) => item.id !== value));
    if (checkTeamItems.filter((item) => item.id !== value) && checkTeamItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems, teams: checkTeamItems.filter((item) => item.id !== value), priorities: checkPriorityItems, customFilters: customFiltersList,
      };
      dispatch(getWorkorderFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'scheduler_type', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersData = [...customFiltersList, ...filters];
      const payload = {
        states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems, customFilters: customFiltersData,
      };
      dispatch(getWorkorderFilter(payload));
    } else {
      const customFiltersData = customFiltersList.filter((item) => item.value !== value);
      const payload = {
        states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems, customFilters: customFiltersData,
      };
      dispatch(getWorkorderFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems.filter((item) => item.id !== value), teams: checkTeamItems, priorities: checkPriorityItems, customFilters: customFiltersList,
      };
      dispatch(getWorkorderFilter(payload));
    }
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handlePriorityClose = (value) => {
    setCheckPriorityValues(checkPriorityValues.filter((item) => item !== value));
    setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== value));
    if (checkPriorityItems.filter((item) => item.id !== value) && checkPriorityItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
      };
      dispatch(getWorkorderFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleMtypeClose = (value) => {
    setCheckMTypeValues(checkMTypeValues.filter((item) => item !== value));
    setCheckMtypeItems(checkMtypeItems.filter((item) => item.id !== value));
    if (checkMtypeItems.filter((item) => item.id !== value) && checkMtypeItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
      };
      dispatch(getWorkorderFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleTypeClose = (value) => {
    setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
    setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
    if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems, teams: checkTeamItems, priorities: checkPriorityItems.filter((item) => item.id !== value), customFilters: customFiltersList,
      };
      dispatch(getWorkorderFilter(payload));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleCustomFilterClose = (value, arrValue, type) => {
    let filterData = [];
    if (type === 'inarray') {
      setCustomFilters(customFiltersList.filter((item) => item.value !== arrValue));
      filterData = customFiltersList.filter((item) => item.value !== arrValue);
    } else {
      setCustomFilters(customFiltersList.filter((item) => item.key !== value));
      filterData = customFiltersList.filter((item) => item.key !== value);
    }
    const payload = {
      states: checkItems,
      teams: checkTeamItems,
      priorities: checkPriorityItems,
      maintenanceTypes: checkMtypeItems,
      types: checkTypeItems,
      customFilters: filterData,
    };
    dispatch(getWorkorderFilter(payload));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckTeamValues([]);
    setCheckTeamItems([]);
    setCheckPriorityValues([]);
    setCheckMTypeValues([]);
    setCheckTypeValues([]);
    setCheckPriorityItems([]);
    setCheckMtypeItems([]);
    setCheckTypeItems([]);
    setCustomFilters([]);
    const payload = {
      states: [], teams: [], priorities: [], maintenanceTypes: [], types: [], customFilters: [],
    };
    dispatch(getWorkorderFilter(payload));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = workorderCount && workorderCount.length ? workorderCount.length : 0;
    const scrollListCount = workorders && workorders.length ? workorders.length : 0;
    if ((workordersInfo && !workordersInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const onTeamSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = teamGroups.filter((item) => {
        const searchValue = item.maintenance_team_id ? item.maintenance_team_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setteamGroups(ndata);
    } else {
      setteamGroups(teamGroupsInfo && teamGroupsInfo.data ? teamGroupsInfo.data : []);
    }
  };

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const stateErrorMsg = (stateGroupsInfo && stateGroupsInfo.err) ? generateErrorMessage(stateGroupsInfo) : userErrorMsg;
  const priorityErrorMsg = (priorityGroupsInfo && priorityGroupsInfo.err) ? generateErrorMessage(priorityGroupsInfo) : userErrorMsg;
  const teamErrorMsg = (teamGroupsInfo && teamGroupsInfo.err) ? generateErrorMessage(teamGroupsInfo) : userErrorMsg;
  const maintenanceTypeErrorMsg = (maintenanceTypeGroupsInfo && maintenanceTypeGroupsInfo.err) ? generateErrorMessage(maintenanceTypeGroupsInfo) : userErrorMsg;
  const typeErrorMsg = (typeGroupsInfo && typeGroupsInfo.err) ? generateErrorMessage(typeGroupsInfo) : userErrorMsg;

  const states = stateGroupsInfo && stateGroupsInfo.data ? stateGroupsInfo.data : [];
  const priorities = priorityGroupsInfo && priorityGroupsInfo.data ? priorityGroupsInfo.data : [];
  const maintenanceTypes = maintenanceTypeGroupsInfo && maintenanceTypeGroupsInfo.data ? maintenanceTypeGroupsInfo.data : [];
  const types = typeGroupsInfo && typeGroupsInfo.data ? typeGroupsInfo.data : [];
  const currentId = viewId || id;

  const statusValues = workorderFilters && workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
  const teamValues = workorderFilters && workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
  const priorityValues = workorderFilters && workorderFilters.priorities ? getColumnArrayById(workorderFilters.priorities, 'id') : [];
  const maintenanceTypeValues = workorderFilters && workorderFilters.maintenanceTypes ? getColumnArrayById(workorderFilters.maintenanceTypes, 'id') : [];
  const typeValues = workorderFilters && workorderFilters.types ? getColumnArrayById(workorderFilters.types, 'id') : [];

  const statusList = workorderFilters && workorderFilters.states ? workorderFilters.states : [];
  const teamsList = workorderFilters && workorderFilters.teams ? workorderFilters.teams : [];
  const priorityList = workorderFilters && workorderFilters.priorities ? workorderFilters.priorities : [];
  const maintenanceTypeList = workorderFilters && workorderFilters.maintenanceTypes ? workorderFilters.maintenanceTypes : [];
  const typeList = workorderFilters && workorderFilters.types ? workorderFilters.types : [];

  const stateCustomValuesList = (workorderFilters && workorderFilters.customFilters && workorderFilters.customFilters.length > 0)
    ? workorderFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateCustomeValues = getColumnArrayById(stateCustomValuesList, 'value');

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
         
            <CardBody className="pl-1 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="mb-1 ml-1 font-weight-800 collapse-heading">BY  STATUS</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={statusCollapse}>
                <div>
                  {((stateGroupsInfo && stateGroupsInfo.loading) || (isUserLoading)) && (
                  <Loader />
                  )}
                  {states && states.map((st) => (
                    st.state && (
                    <span className="mb-1 ml-1 d-block font-weight-500" key={st.state}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcgroup${st.state}`}
                          value={st.state}
                          name={getWorkOrderStateText(st.state)}
                          checked={statusValues.some((selectedValue) => selectedValue.includes(st.state))}
                          onChange={handleCheckboxChange}
                        />
                        {' '}
                        <Label htmlFor={`checkboxcgroup${st.state}`} className="text-capitalize"><span>{getWorkOrderStateText(st.state)}</span></Label>
                      </div>
                    </span>
                    )
                  ))}
                  {((stateGroupsInfo && stateGroupsInfo.err) || (isUserError)) && (
                  <ErrorContent errorTxt={stateErrorMsg} />
                  )}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="mb-1 ml-1 font-weight-800 collapse-heading">BY PRIORITY</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPriorityCollapse(!priorityCollapse)} size="sm" icon={priorityCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={priorityCollapse}>
                <div>
                  {((priorityGroupsInfo && priorityGroupsInfo.loading) || (isUserLoading)) && (
                  <Loader />
                  )}
                  {priorities && priorities.map((pr) => (
                    pr.priority && getWorkOrderPriorityText(pr.priority) && (
                    <span className="mb-1 ml-1 d-block font-weight-500" key={pr.priority}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcprgroup${pr.priority}`}
                          value={pr.priority}
                          name={getWorkOrderPriorityText(pr.priority)}
                          checked={priorityValues.some((selectedValue) => selectedValue.includes(pr.priority))}
                          onChange={handlePriorityCheckboxChange}
                        />
                        {' '}
                        <Label htmlFor={`checkboxcprgroup${pr.priority}`}><span>{getWorkOrderPriorityText(pr.priority)}</span></Label>
                      </div>
                    </span>
                    )
                  ))}
                  {((priorityGroupsInfo && priorityGroupsInfo.err) || (isUserError)) && (
                  <ErrorContent errorTxt={priorityErrorMsg} />
                  )}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <CollapseItemCustom
                title="SCHEDULER TYPE"
                data={workorderCustomData && workorderCustomData.shedulerTypes ? workorderCustomData.shedulerTypes : []}
                selectedValues={stateCustomeValues}
                onCollapse={() => setStypeCollapse(!stypeCollapse)}
                isOpen={stypeCollapse}
                onCheckboxChange={handleStatusCheckboxChange}
              />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="mb-1 ml-1 font-weight-800 collapse-heading">BY MAINTENANCE TEAM</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTeamCollapse(!teamCollapse)} size="sm" icon={teamCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={teamCollapse}>
                {(teamGroupsInfo && teamGroupsInfo.data && teamGroupsInfo.data.length > 10) && (
                <FormGroup className="mt-2 mb-2">
                  <Input type="input" name="teamSearchValue" placeholder="Please search a team" onChange={onTeamSearchChange} id="categorySearchValue" className="border-radius-50px" />
                </FormGroup>
                )}
                <div>
                  {((teamGroupsInfo && teamGroupsInfo.loading) || (isUserLoading)) && (
                  <Loader />
                  )}
                  {(teamGroupsInfo && teamGroupsInfo.data && teamGroups) && teamGroups.map((teamItem) => (
                    teamItem.maintenance_team_id && (
                    <span className="mb-1 ml-1 d-block font-weight-500" key={teamItem.maintenance_team_id}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcteamgroup${teamItem.maintenance_team_id[0]}`}
                          value={teamItem.maintenance_team_id[0]}
                          name={teamItem.maintenance_team_id[1]}
                          checked={teamValues.some((selectedValue) => parseInt(selectedValue) === parseInt(teamItem.maintenance_team_id[0]))}
                          onChange={handleTeamCheckboxChange}
                        />
                        {' '}
                        <Label htmlFor={`checkboxcteamgroup${teamItem.maintenance_team_id[0]}`}><span>{teamItem.maintenance_team_id[1]}</span></Label>
                      </div>
                    </span>
                    )
                  ))}
                  {((teamGroupsInfo && teamGroupsInfo.err) || (isUserError)) && (
                  <ErrorContent errorTxt={teamErrorMsg} />
                  )}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="mb-1 ml-1 font-weight-800 collapse-heading">BY MAINTENANCE TYPE</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon
                    className="mr-2 cursor-pointer"
                    onClick={() => setMaintenanceTypeCollapse(!maintenanceTypeCollapse)}
                    size="sm"
                    icon={maintenanceTypeCollapse ? faChevronUp : faChevronDown}
                  />
                </Col>
              </Row>
              <Collapse isOpen={maintenanceTypeCollapse}>
                <div>
                  {((maintenanceTypeGroupsInfo && maintenanceTypeGroupsInfo.loading) || (isUserLoading)) && (
                  <Loader />
                  )}
                  {maintenanceTypes && maintenanceTypes.map((mt) => (
                    mt.maintenance_type && getMTName(mt.maintenance_type) && (
                    <span className="mb-1 ml-1 d-block font-weight-500" key={mt.maintenance_type}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcgroup${mt.maintenance_type}`}
                          value={mt.maintenance_type}
                          name={getMTName(mt.maintenance_type)}
                          checked={maintenanceTypeValues.some((selectedValue) => selectedValue.includes(mt.maintenance_type))}
                          onChange={handleMTypeCheckboxChange}
                        />
                        {' '}
                        <Label htmlFor={`checkboxcgroup${mt.maintenance_type}`}><span>{getMTName(mt.maintenance_type)}</span></Label>
                      </div>
                    </span>
                    )
                  ))}
                  {((maintenanceTypeGroupsInfo && maintenanceTypeGroupsInfo.err) || (isUserError)) && (
                  <ErrorContent errorTxt={maintenanceTypeErrorMsg} />
                  )}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="mb-1 ml-1 font-weight-800 collapse-heading">BY TYPE</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon
                    className="mr-2 cursor-pointer"
                    onClick={() => setTypeCollapse(!typeCollapse)}
                    size="sm"
                    icon={typeCollapse ? faChevronUp : faChevronDown}
                  />
                </Col>
              </Row>
              <Collapse isOpen={typeCollapse}>
                <div>
                  {((typeGroupsInfo && typeGroupsInfo.loading) || (isUserLoading)) && (
                  <Loader />
                  )}
                  {types && types.map((tc) => (
                    tc.type_category && getWorkOrderTypeName(tc.type_category) && (
                    <span className="mb-1 ml-1 d-block font-weight-500" key={tc.type_category}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcgroup${tc.type_category}`}
                          value={tc.type_category}
                          name={getWorkOrderTypeName(tc.type_category)}
                          checked={typeValues.some((selectedValue) => selectedValue.includes(tc.type_category))}
                          onChange={handleTypeCheckboxChange}
                        />
                        {' '}
                        <Label htmlFor={`checkboxcgroup${tc.type_category}`}><span>{getWorkOrderTypeName(tc.type_category)}</span></Label>
                      </div>
                    </span>
                    )
                  ))}
                  {((typeGroupsInfo && typeGroupsInfo.err) || (isUserError)) && (
                  <ErrorContent errorTxt={typeErrorMsg} />
                  )}
                </div>
              </Collapse>
              <hr className="mt-2" />
              {((statusList && statusList.length > 0) || (teamsList && teamsList.length > 0) || (priorityList && priorityList.length > 0)
               || (maintenanceTypeList && maintenanceTypeList.length > 0) || (typeList && typeList.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
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
  teamValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  priorityValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  mTypeValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  typeValue: PropTypes.oneOfType([
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
};
SideFilters.defaultProps = {
  setCollapse: () => { },
  collapse: false,
};

export default SideFilters;
