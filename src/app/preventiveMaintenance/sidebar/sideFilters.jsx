/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row, FormGroup, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import collapseIcon from '@images/collapse.png';
import {
  getPreventiveList, getPreventiveCount,
  getPreventiveDetail, getPreventiveFilter, getTeamGroups,
} from '../ppmService';
import {
  getColumnArray, getColumnArrayById, generateErrorMessage,
  getAllowedCompanies, queryGeneratorWithUtc,
} from '../../util/appUtils';
import preventiveActions from '../data/preventiveActions.json';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, scheduleValue, categoryValue, priorityValue, preventiveByValue, typeValue, teamValue, afterReset,
    sortBy, sortField, columns, setCollapse, collapse, isInspection,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkppmByValue, setCheckppmByValue] = useState([]);
  const [checkppmByItems, setCheckppmByItems] = useState([]);
  const [checkCategoryValue, setCheckCategoryValue] = useState([]);
  const [checkCategoryItems, setCheckCategoryItems] = useState([]);
  const [checkPriorityValues, setCheckPriorityValues] = useState([]);
  const [checkPriorityItems, setCheckPriorityItems] = useState([]);
  const [checkTeamValues, setCheckTeamValues] = useState([]);
  const [checkTeamItems, setCheckTeamItems] = useState([]);
  const [viewId, setViewId] = useState('');
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [fields, setFields] = useState(columns);
  const [scrollTop, setScrollTop] = useState(0);
  const [statusCollapse, setStatusCollapse] = useState(!isInspection);
  const [preventiveByCollapse, setPreventiveByCollapse] = useState(false);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [priorityCollapse, setPriorityCollapse] = useState(false);
  const [teamCollapse, setTeamCollapse] = useState(false);
  const [preventive, setPreventive] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [removeScheduleValue, setRemoveScheduleValue] = useState(scheduleValue);
  const [removeCategoryValue, setRemoveCategoryValue] = useState(categoryValue);
  const [removePreventiveByValue, setRemovePreventiveByValue] = useState(preventiveByValue);
  const [removePriorityValue, setRemovePriorityValue] = useState(priorityValue);
  const [removeTeamValue, setRemoveTeamValue] = useState(teamValue);
  const [removeTypeValue, setRemoveTypeValue] = useState(typeValue);
  const [teamGroups, setTeamGroups] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);

  const [checkTypeValues, setCheckTypeValues] = useState([]);
  const [checkTypeItems, setCheckTypeItems] = useState([]);

  const [typeCollapse, setTypeCollapse] = useState(!!isInspection);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    ppmCount, ppmInfo, ppmFilter, teamGroupInfo, updatePpmSchedulerInfo, addPreventiveInfo,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if ((userInfo && userInfo.data) && teamCollapse) {
      dispatch(getTeamGroups(companies, appModels.PPMCALENDAR));
      setPriorityCollapse(false);
      setStatusCollapse(false);
      setCategoryCollapse(false);
      setPreventiveByCollapse(false);
      setTypeCollapse(false);
    }
  }, [userInfo, teamCollapse]);

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
    setRemoveScheduleValue(scheduleValue);
  }, [scheduleValue]);

  useEffect(() => {
    setRemovePreventiveByValue(preventiveByValue);
  }, [preventiveByValue]);

  useEffect(() => {
    setRemoveCategoryValue(categoryValue);
  }, [categoryValue]);

  useEffect(() => {
    setRemovePriorityValue(priorityValue);
  }, [priorityValue]);

  useEffect(() => {
    setRemoveTeamValue(teamValue);
  }, [teamValue]);

  useEffect(() => {
    setRemoveTypeValue(typeValue);
  }, [typeValue]);

  useEffect(() => {
    if (removeScheduleValue && removeScheduleValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== removeScheduleValue));
      if (checkItems.filter((item) => item.id !== removeScheduleValue) && checkItems.filter((item) => item.id !== removeScheduleValue).length === 0) {
        const payload = {
          states: checkItems.filter((item) => item.id !== removeScheduleValue),
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
  }, [removeScheduleValue]);

  useEffect(() => {
    if (removePreventiveByValue && removePreventiveByValue !== 0) {
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== removePreventiveByValue));
      if (checkppmByItems.filter((item) => item.id !== removePreventiveByValue) && checkppmByItems.filter((item) => item.id !== removePreventiveByValue).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems.filter((item) => item.id !== removePreventiveByValue),
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
  }, [removePreventiveByValue]);

  useEffect(() => {
    if (removeCategoryValue && removeCategoryValue !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== removeCategoryValue));
      if (checkCategoryItems.filter((item) => item.id !== removeCategoryValue) && checkCategoryItems.filter((item) => item.id !== removeCategoryValue).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems.filter((item) => item.id !== removeCategoryValue),
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
  }, [removeCategoryValue]);

  useEffect(() => {
    if (removePriorityValue && removePriorityValue !== 0) {
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== removePriorityValue));
      if (checkPriorityItems.filter((item) => item.id !== removePriorityValue) && checkPriorityItems.filter((item) => item.id !== removePriorityValue).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems.filter((item) => item.id !== removePriorityValue),
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
  }, [removePriorityValue]);

  useEffect(() => {
    if (removeTeamValue && removeTeamValue !== 0) {
      setCheckTeamItems(checkTeamItems.filter((item) => item.id !== removeTeamValue));
      if (checkTeamItems.filter((item) => item.id !== removeTeamValue) && checkTeamItems.filter((item) => item.id !== removeTeamValue).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems.filter((item) => item.id !== removeTeamValue),
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
  }, [removeTeamValue]);

  useEffect(() => {
    if (removeTypeValue && removeTypeValue !== 0) {
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== removeTypeValue));
      if (checkTypeItems.filter((item) => item.id !== removeTypeValue) && checkTypeItems.filter((item) => item.id !== removeTypeValue).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems.filter((item) => item.id !== removeTypeValue),
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
  }, [removeTypeValue]);

  useEffect(() => {
    if (ppmFilter && ppmFilter.customFilters) {
      setCustomFilters(ppmFilter.customFilters);
    }
  }, [ppmFilter]);

  useEffect(() => {
    if (scheduleValue && scheduleValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== scheduleValue));
    }
    if (preventiveByValue && preventiveByValue !== 0) {
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== preventiveByValue));
    }
    if (categoryValue && categoryValue !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== categoryValue));
    }
    if (priorityValue && priorityValue !== 0) {
      setCheckPriorityItems(checkPriorityItems.filter((item) => item.id !== priorityValue));
    }
    if (teamValue && teamValue !== 0) {
      setCheckTeamItems(checkTeamItems.filter((item) => item.id !== teamValue));
    }
  }, [scheduleValue, preventiveByValue, categoryValue, priorityValue, teamValue]);

  useEffect(() => {
    const payload = {
      states: checkItems,
      preventiveBy: checkppmByItems,
      categories: checkCategoryItems,
      priorities: checkPriorityItems,
      teams: checkTeamItems,
      types: checkTypeItems,
      customFilters: customFiltersList,
    };
    dispatch(getPreventiveFilter(payload));
  }, [checkItems, checkppmByItems, checkCategoryItems, checkPriorityItems, checkTeamItems, checkTypeItems]);

  useEffect(() => {
    let scheduleValues = [];
    let ppmByValue = [];
    let categoryValues = [];
    let priorityValues = [];
    let teamValues = [];
    let typeValues = [];
    let filterList = [];

    if (checkItems && checkItems.length > 0) {
      scheduleValues = checkItems;
    } else if (ppmFilter && ppmFilter.states) {
      scheduleValues = ppmFilter.states;
    }

    if (checkppmByItems && checkppmByItems.length > 0) {
      ppmByValue = checkppmByItems;
    } else if (ppmFilter && ppmFilter.preventiveBy) {
      ppmByValue = ppmFilter.preventiveBy;
    }

    if (checkCategoryItems && checkCategoryItems.length > 0) {
      categoryValues = checkCategoryItems;
    } else if (ppmFilter && ppmFilter.categories) {
      categoryValues = ppmFilter.categories;
    }

    if (checkPriorityItems && checkPriorityItems.length > 0) {
      priorityValues = checkPriorityItems;
    } else if (ppmFilter && ppmFilter.priorities) {
      priorityValues = ppmFilter.priorities;
    }

    if (checkTeamItems && checkTeamItems.length > 0) {
      teamValues = checkTeamItems;
    } else if (ppmFilter && ppmFilter.teams) {
      teamValues = ppmFilter.teams;
    }

    if (checkTypeItems && checkTypeItems.length > 0) {
      typeValues = checkTypeItems;
    } else if (ppmFilter && ppmFilter.types) {
      typeValues = ppmFilter.types;
      setTypeCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (ppmFilter && ppmFilter.customFilters) {
      filterList = ppmFilter.customFilters;
    }

    const payload = {
      states: scheduleValues, preventiveBy: ppmByValue, categories: categoryValues, priorities: priorityValues, teams: teamValues, types: typeValues, customFilters: filterList,
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
    if (userInfo.data && (ppmFilter && (ppmFilter.states || ppmFilter.categories || ppmFilter.priorities || ppmFilter.customFilters || ppmFilter.types))) {
      const scheduleValues = ppmFilter.states ? getColumnArray(ppmFilter.states, 'id') : [];
      const preventiveBy = ppmFilter.preventiveBy ? getColumnArray(ppmFilter.preventiveBy, 'id') : [];
      const categories = ppmFilter.categories ? getColumnArray(ppmFilter.categories, 'id') : [];
      const priorities = ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];
      const teams = ppmFilter.teams ? getColumnArrayById(ppmFilter.teams, 'id') : [];
      const types = ppmFilter && ppmFilter.types ? getColumnArrayById(ppmFilter.types, 'id') : [];
      const customFilters = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters,false, userInfo.data) : '';
      dispatch(getPreventiveCount(companies, appModels.PPMCALENDAR, scheduleValues, preventiveBy, priorities, categories, teams, customFilters, types, isInspection));
    }
  }, [userInfo, ppmFilter]);

  useEffect(() => {
    if (userInfo.data && (ppmFilter && (ppmFilter.states || ppmFilter.categories || ppmFilter.priorities || ppmFilter.customFilters || ppmFilter.types || (updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) || (addPreventiveInfo && addPreventiveInfo.data)))) {
      const scheduleValues = ppmFilter.states ? getColumnArray(ppmFilter.states, 'id') : [];
      const preventiveBy = ppmFilter.preventiveBy ? getColumnArray(ppmFilter.preventiveBy, 'id') : [];
      const categories = ppmFilter.categories ? getColumnArray(ppmFilter.categories, 'id') : [];
      const priorities = ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];
      const teams = ppmFilter.teams ? getColumnArrayById(ppmFilter.teams, 'id') : [];
      const types = ppmFilter && ppmFilter.types ? getColumnArrayById(ppmFilter.types, 'id') : [];
      const customFilters = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters,false, userInfo.data) : '';
      dispatch(getPreventiveList(companies, appModels.PPMCALENDAR, limit, offsetValue,
        fields, scheduleValues, preventiveBy, priorities, categories, teams, customFilters, sortByValue, sortFieldValue, types, isInspection));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, fields, ppmFilter, scrollTop, updatePpmSchedulerInfo, addPreventiveInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getPreventiveDetail(viewId, appModels.PPMCALENDAR));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if ((updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && id) {
      dispatch(getPreventiveDetail(id, appModels.PPMCALENDAR));
    }
  }, [updatePpmSchedulerInfo, id]);

  useEffect(() => {
    if (teamGroupInfo && teamGroupInfo.data) {
      setTeamGroups(teamGroupInfo.data);
    }
  }, [teamGroupInfo]);

  const onTeamSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = teamGroups.filter((item) => {
        const searchValue = item.maintenance_team_id ? item.maintenance_team_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setTeamGroups(ndata);
    } else {
      setTeamGroups(teamGroupInfo && teamGroupInfo.data ? teamGroupInfo.data : []);
    }
  };

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
          states: checkItems.filter((item) => item.id !== value),
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handlePreventiveByCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckppmByValue((state) => [...state, value]);
      setCheckppmByItems((state) => [...state, values]);
    } else {
      setCheckppmByValue(checkppmByValue.filter((item) => item !== value));
      setCheckppmByItems(checkppmByItems.filter((item) => item.id !== value));
      if (checkppmByItems.filter((item) => item.id !== value) && checkppmByItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems.filter((item) => item.id !== value),
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleTypeByCheckboxChange = (event) => {
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
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems.filter((item) => item.id !== value),
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCategoryValue((state) => [...state, value]);
      setCheckCategoryItems((state) => [...state, values]);
    } else {
      setCheckCategoryValue(checkCategoryValue.filter((item) => item !== value));
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
      if (checkCategoryItems.filter((item) => item.id !== value) && checkCategoryItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems.filter((item) => item.id !== value),
          priorities: checkPriorityItems,
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
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
      if (checkPriorityItems.filter((item) => item.id !== value) && checkPriorityItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems.filter((item) => item.id !== value),
          teams: checkTeamItems,
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
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
          states: checkItems,
          preventiveBy: checkppmByItems,
          categories: checkCategoryItems,
          priorities: checkPriorityItems,
          teams: checkTeamItems.filter((item) => item.id !== value),
          types: checkTypeItems,
          customFilters: customFiltersList,
        };
        dispatch(getPreventiveFilter(payload));
      }
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

  const handleCategoryClose = (value) => {
    setCheckCategoryValue(checkCategoryValue.filter((item) => item !== value));
    setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
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

  const handleTeamClose = (value) => {
    setCheckTeamValues(checkTeamValues.filter((item) => item !== value));
    setCheckTeamItems(checkTeamItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleTypeClose = (value) => {
    setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
    setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    const payload = {
      states: checkItems,
      preventiveBy: checkppmByItems,
      categories: checkCategoryItems,
      priorities: checkPriorityItems,
      teams: checkTeamItems,
      types: checkTypeItems,
      customFilters: customFiltersList.filter((item) => item.key !== value),
    };
    dispatch(getPreventiveFilter(payload));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const handleResetClick = (e) => {
    if (e) e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckppmByValue([]);
    setCheckppmByItems([]);
    setCheckCategoryValue([]);
    setCheckCategoryItems([]);
    setCheckPriorityValues([]);
    setCheckPriorityItems([]);
    setCheckTeamValues([]);
    setCheckTeamItems([]);
    setCheckTypeValues([]);
    setCheckTypeItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
    setPreventive([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const ppmCountValue = ppmCount && ppmCount.data && ppmCount.data.length ? ppmCount.data.length : 0;
    const total = ppmCountValue;
    const scrollListCount = preventive && preventive.length ? preventive.length : 0;
    if ((ppmInfo && !ppmInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const currentId = viewId || id;

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (teamGroupInfo && teamGroupInfo.err) ? generateErrorMessage(teamGroupInfo) : userErrorMsg;

  const scheduleValues = ppmFilter && ppmFilter.states ? getColumnArrayById(ppmFilter.states, 'id') : [];
  const ppmByValue = ppmFilter && ppmFilter.preventiveBy ? getColumnArrayById(ppmFilter.preventiveBy, 'id') : [];
  const categoryValues = ppmFilter && ppmFilter.categories ? getColumnArrayById(ppmFilter.categories, 'id') : [];
  const priorityValues = ppmFilter && ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];
  const teamValues = ppmFilter && ppmFilter.teams ? getColumnArrayById(ppmFilter.teams, 'id') : [];
  const typeValues = ppmFilter && ppmFilter.types ? getColumnArrayById(ppmFilter.types, 'id') : [];

  const scheduleList = ppmFilter && ppmFilter.states ? ppmFilter.states : [];
  const ppmByList = ppmFilter && ppmFilter.preventiveBy ? ppmFilter.preventiveBy : [];
  const categoryList = ppmFilter && ppmFilter.categories ? ppmFilter.categories : [];
  const priorityList = ppmFilter && ppmFilter.priorities ? ppmFilter.priorities : [];
  const teamsList = ppmFilter && ppmFilter.teams ? ppmFilter.teams : [];
  const typesList = ppmFilter && ppmFilter.types ? ppmFilter.types : [];

  return (

    <Card className="p-1 bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          {' '}
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
          {/* {id ? (
            <>
              <div>
                <div className="mr-2 ml-2 mt-2">
                  {ppmByList && ppmByList.map((ppm) => (
                    <h5 key={ppm.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {ppm.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleppmByClose(ppm.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {categoryList && categoryList.map((ppm) => (
                    <h5 key={ppm.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {ppm.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCategoryClose(ppm.id)} size="sm" icon={faTimesCircle} />
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
                  {teamsList && teamsList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTeamClose(item.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {typesList && typesList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTypeClose(item.id)} size="sm" icon={faTimesCircle} />
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
                  {((checkPriorityItems && checkPriorityItems.length > 0) || (checkItems && checkItems.length > 0) || (checkCategoryItems && checkCategoryItems.length > 0)
                || (checkppmByItems && checkppmByItems.length > 0) || (checkTeamItems && checkTeamItems.length > 0)
                || (customFiltersList && customFiltersList.length > 0) || (checkTypeItems && checkTypeItems.length > 0)) && (
                  <div aria-hidden="true" className="cursor-pointer text-info text-right font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                  )}
                </div>
                {((checkPriorityItems && checkPriorityItems.length > 0) || (checkItems && checkItems.length > 0) || (checkCategoryItems && checkCategoryItems.length > 0)
              || (checkppmByItems && checkppmByItems.length > 0) || (checkTeamItems && checkTeamItems.length > 0)
              || (customFiltersList && customFiltersList.length > 0) || (checkTypeItems && checkTypeItems.length > 0)) && (
                <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
                )}
                {(ppmInfo && ppmInfo.data && ppmInfo.data.length === 0) && (
                <Card className="mb-2 border-nepal-1px">
                  <CardBody className="p-2">
                    <ErrorContent errorTxt="No data found." />
                  </CardBody>
                </Card>
                )}
                <div onScroll={onScroll} className={preventive && preventive.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                  {(preventive) && preventive.map((ppm) => (
                    <Card
                      key={ppm.id}
                      onClick={() => setViewId(ppm.id)}
                      className={(ppm.id === currentId) ? 'mb-2 border-nepal-1px cursor-pointer mr-2 ml-2' : 'cursor-pointer mb-2 mr-2 ml-2'}
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
                  <Card className="mb-2 ml-2 mr-2 border-nepal-1px">
                    <CardBody className="p-2">
                      <ErrorContent errorTxt={generateErrorMessage(ppmInfo)} />
                    </CardBody>
                  </Card>
                  )}

                  {(userInfo && userInfo.err) && (
                  <Card className="mb-2 ml-2 mr-2 border-nepal-1px">
                    <CardBody className="p-2">
                      <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                    </CardBody>
                  </Card>
                  )}
                  {((ppmInfo && ppmInfo.loading) || (userInfo && userInfo.loading)) && (
                  <Loader />
                  )}
                </div>
              </div>
            </>
          ) : ( */}
          <CardBody className="ml-2 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
            {isInspection && (
            <>
              <Row className="m-0">
                <Col md="8" className="p-0">
                  <p className="m-0 font-weight-800 collapse-heading">BY TYPE</p>
                </Col>
                <Col md="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTypeCollapse(!typeCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={typeCollapse}>
                <div className="pl-1">
                  {preventiveActions && preventiveActions.types && preventiveActions.types.map((pt) => (
                    <span className="mb-1 d-block font-weight-500" key={pt.value}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcitemaction${pt.value}`}
                          value={pt.value}
                          name={pt.label}
                          checked={typeValues.some((selectedValue) => selectedValue.includes(pt.value))}
                          onChange={handleTypeByCheckboxChange}
                        />
                        <Label htmlFor={`checkboxcitemaction${pt.value}`}>
                          <span>{pt.label}</span>
                        </Label>

                        {' '}
                      </div>
                    </span>
                  ))}
                </div>
              </Collapse>
              <hr className="mt-2" />
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
                        <span>{tp.label}</span>
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
                        <span>{priority.label}</span>
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
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPreventiveByCollapse(!preventiveByCollapse)} size="sm" icon={preventiveByCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={preventiveByCollapse}>
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
                        onChange={handlePreventiveByCheckboxChange}
                      />
                      <Label htmlFor={`checkboxcitemaction${index}`}>
                        <span>{ppmBy.label}</span>
                      </Label>

                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY TEAM</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTeamCollapse(!teamCollapse)} size="sm" icon={teamCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={teamCollapse}>
              {(teamGroupInfo && teamGroupInfo.data && teamGroupInfo.data.length > 10) && (
                <FormGroup className="mt-2 mb-2">
                  <Input type="input" name="vendorSearchValue" placeholder="Please search a team" onChange={onTeamSearchChange} id="vendorSearchValue" className="border-radius-50px" />
                </FormGroup>
              )}
              <div className="pl-1">
                {((teamGroupInfo && teamGroupInfo.loading) || isUserLoading) && (
                  <Loader />
                )}
                {teamGroups && teamGroups.map((teamItem, index) => (
                  teamItem.maintenance_team_id && (
                    <span className="mb-1 d-block font-weight-500" key={teamItem.maintenance_team_id}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxteamitemaction${index}`}
                          value={teamItem.maintenance_team_id[0]}
                          name={teamItem.maintenance_team_id[1]}
                          checked={teamValues.some((selectedValue) => parseInt(selectedValue) === parseInt(teamItem.maintenance_team_id[0]))}
                          onChange={handleTeamCheckboxChange}
                        />
                        <Label htmlFor={`checkboxteamitemaction${index}`}>
                          <span>{teamItem.maintenance_team_id[1]}</span>
                        </Label>
                        {' '}
                      </div>
                    </span>
                  )
                ))}
                {((teamGroupInfo && teamGroupInfo.err) || isUserError) && (
                  <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY CATEGORY</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={categoryCollapse}>
              <div className="pl-1">
                {preventiveActions.ppmFor.map((cv, index) => (
                  <span className="mb-1 d-block font-weight-500" key={cv.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxcategoryitemaction${index}`}
                        value={cv.value}
                        name={cv.label}
                        checked={categoryValues.some((selectedValue) => selectedValue.includes(cv.value))}
                        onChange={handleCategoryCheckboxChange}
                      />
                      <Label htmlFor={`checkboxcategoryitemaction${index}`}>
                        <span>{cv.label}</span>
                      </Label>

                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((scheduleList && scheduleList.length > 0)
              || (ppmByList && ppmByList.length > 0) || (categoryList && categoryList.length > 0) || (priorityList && priorityList.length > 0)
              || (teamsList && teamsList.length > 0) || (typesList && typesList.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
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
  id: PropTypes.number.isRequired,
  scheduleValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  categoryValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  preventiveByValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  priorityValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  typeValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  teamValue: PropTypes.oneOfType([
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
  isInspection: PropTypes.bool,
};
SideFilters.defaultProps = {
  setCollapse: () => { },
  collapse: false,
  isInspection: false,
};

export default SideFilters;
