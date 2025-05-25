/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardBody, Col, Row, Popover, PopoverHeader, PopoverBody, Table, UncontrolledTooltip,
  Input, Label, Modal, ModalBody, Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import editIcon from '@images/icons/edit.svg';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import CreateList from '@shared/listViewFilters/create';
import AddColumns from '@shared/listViewFilters/columns';
import ExportList from '@shared/listViewFilters/export';
import Loader from '@shared/loading';
import filterIcon from '@images/filter.png';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import DataExport from './dataExport/dataExport';

import {
  getPagesCountV2,
  generateErrorMessage,
  getListOfOperations,
  getColumnArrayById,
  getColumnArray, getAllowedCompanies,
  getArrayFromValuesByItem,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  queryGeneratorWithUtc,
} from '../util/appUtils';
import {
  getppmLabel,
} from './utils/utils';
import preventiveActions from './data/preventiveActions.json';
import SideFilters from './sidebar/sideFilters';
import {
  getPreventiveFilter,
  getPreventiveDetail,
  getCheckedRows,
  getDeletePreventiveSchedule, resetDeletePreventiveSchedule,
  getPreventiveList, getPreventiveCount,
} from './ppmService';
import { setInitialValues } from '../purchase/purchaseService';
import actionCodes from './data/preventiveActionCodes.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PreventiveSchedulerAdmin = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [statusValue, setStatusValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState(0);
  const [priorityValue, setPriorityValue] = useState(0);
  const [preventiveByValue, setPreventiveByValue] = useState(0);
  const [checkPreventiveBy, setCheckPreventiveBy] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkCategories, setCheckCategories] = useState([]);
  const [checkPriorities, setCheckPriorities] = useState([]);
  const [checkTeamItems, setCheckTeamItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [editId, setEditId] = useState(false);
  const viewId = 0;
  const [teamValue, setTeamValue] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [columns, setColumns] = useState(
    ['name', 'time_period', 'priority', 'scheduler_type', 'ppm_by', 'create_date', 'mro_ord_count', 'category_type', 'recurrent_id', 'duration'],
  );
  const [collapse, setCollapse] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [checkTypeItems, setCheckTypeItems] = useState([]);
  const [typeValue, setTypeValue] = useState(0);

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    ppmCount, ppmInfo, ppmFilter,
    preventiveScheduleDeleteInfo,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = ppmFilter.customFilters ? queryGeneratorWithUtc(ppmFilter.customFilters, false, userInfo.data) : '';
      dispatch(getPreventiveList(
        companies, appModels.PPMCALENDAR, limit, offset,columns, customFiltersList, sortBy, sortField,
        
      ));
      dispatch(getPreventiveCount(companies, appModels.PPMCALENDAR,  customFiltersList));
    }
  }, [userInfo, offset,ppmFilter, customFilters]);


  useEffect(() => {
    if ((userInfo && userInfo.data) && (preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data)) {
      const scheduleValues = ppmFilter && ppmFilter.states ? getColumnArray(ppmFilter.states, 'id') : [];
      const preventiveBy = ppmFilter && ppmFilter.preventiveBy ? getColumnArray(ppmFilter.preventiveBy, 'id') : [];
      const categories = ppmFilter && ppmFilter.categories ? getColumnArray(ppmFilter.categories, 'id') : [];
      const priorities = ppmFilter && ppmFilter.priorities ? getColumnArrayById(ppmFilter.priorities, 'id') : [];
      const teams = ppmFilter && ppmFilter.teams ? getColumnArrayById(ppmFilter.teams, 'id') : [];
      const types = ppmFilter && ppmFilter.types ? getColumnArrayById(ppmFilter.types, 'id') : [];
      dispatch(getPreventiveCount(companies, appModels.PPMCALENDAR, scheduleValues, preventiveBy, priorities, categories, teams, customFilters, types));
      dispatch(getPreventiveList(companies, appModels.PPMCALENDAR, limit, offset,
        columns, scheduleValues, preventiveBy, priorities, categories, teams, customFilters, sortField, sortField, types));
    }
  }, [preventiveScheduleDeleteInfo]);

  useEffect(() => {
    const payload = {
      states: [],
      preventiveBy: [],
      categories: [],
      priorities: [],
      teams: [],
      types: [],
      customFilters: [],
    };
    dispatch(getPreventiveFilter(payload));
  }, []);


  useEffect(() => {
    if (ppmFilter && ppmFilter.states) {
      setCheckItems(ppmFilter.states);
    }
    if (ppmFilter && ppmFilter.categories) {
      setCheckCategories(ppmFilter.categories);
    }
    if (ppmFilter && ppmFilter.priorities) {
      setCheckPriorities(ppmFilter.priorities);
    }
    if (ppmFilter && ppmFilter.teams) {
      setCheckTeamItems(ppmFilter.teams);
    }
    if (ppmFilter && ppmFilter.preventiveBy) {
      setCheckPreventiveBy(ppmFilter.preventiveBy);
    }
    if (ppmFilter && ppmFilter.types) {
      setCheckTypeItems(ppmFilter.types);
    }
    if (ppmFilter && ppmFilter.customFilters) {
      setCustomFilters(ppmFilter.customFilters);
    }
  }, [ppmFilter]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && editId) {
      dispatch(getPreventiveDetail(editId, appModels.PPMCALENDAR));
    }
  }, [userInfo, editId]);

  const ppmCountValue = ppmCount && ppmCount.data && ppmCount.data.length ? ppmCount.data.length : 0;
  const pages = getPagesCountV2(ppmCountValue, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleStatusClose = (value) => {
    setOffset(0); setPage(1);
    setStatusValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };

  const handleCategoryClose = (value) => {
    setOffset(0); setPage(1);
    setCategoryValue(value);
    setCheckCategories(checkCategories.filter((item) => item.id !== value));
  };

  const handlePreventiveByClose = (value) => {
    setOffset(0); setPage(1);
    setPreventiveByValue(value);
    setCheckPreventiveBy(checkPreventiveBy.filter((item) => item.id !== value));
  };

  const handlePriorityClose = (value) => {
    setOffset(0); setPage(1);
    setPriorityValue(value);
    setCheckPriorities(checkPriorities.filter((item) => item.id !== value));
  };

  const handleTeamClose = (value) => {
    setOffset(0); setPage(1);
    setTeamValue(value);
    setCheckTeamItems(checkTeamItems.filter((item) => item.id !== value));
  };

  const handleTypeClose = (value) => {
    setOffset(0); setPage(1);
    setTypeValue(value);
    setCheckTypeItems(checkTeamItems.filter((item) => item.id !== value));
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const handleCustomFilterClose = (value) => {
    setOffset(0); setPage(1);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const payload = {
      states: checkItems, categories: checkCategories, priorities: checkPriorities, types: checkTypeItems, teams: checkTeamItems, customFilters: customFilters.filter((item) => item.key !== value),
    };
    dispatch(getPreventiveFilter(payload));
    setOffset(0); setPage(1);
  };

  if (addLink) {
    return (
      <Redirect to={{
        pathname: '/preventive/add-ppm',
        state: { referrer: 'maintenance-configuration' },
      }}
      />
    );
  }

  if (editLink) {
    return (
      <Redirect to={{
        pathname: `/preventive/edit-ppm/${editId}`,
        state: { referrer: 'maintenance-configuration' },
      }}
      />
    );
  }

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = ppmFilter && ppmFilter.customFilters ? ppmFilter.customFilters : [];
      const filterValues = {
        states: ppmFilter && ppmFilter.states ? ppmFilter.states : [],
        categories: ppmFilter && ppmFilter.categories ? ppmFilter.categories : [],
        priorities: ppmFilter && ppmFilter.priorities ? ppmFilter.priorities : [],
        teams: ppmFilter && ppmFilter.teams ? ppmFilter.teams : [],
        types: ppmFilter && ppmFilter.types ? ppmFilter.types : [],
        customFilters: [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters],
      };
      dispatch(getPreventiveFilter(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = ppmFilter && ppmFilter.customFilters ? ppmFilter.customFilters : [];
      const filterValues = {
        states: ppmFilter && ppmFilter.states ? ppmFilter.states : [],
        categories: ppmFilter && ppmFilter.categories ? ppmFilter.categories : [],
        priorities: ppmFilter && ppmFilter.priorities ? ppmFilter.priorities : [],
        teams: ppmFilter && ppmFilter.teams ? ppmFilter.teams : [],
        types: ppmFilter && ppmFilter.types ? ppmFilter.types : [],
        customFilters: [...oldCustomFilters, ...customFiltersList.filter((item) => item !== value)],
      };
      dispatch(getPreventiveFilter(filterValues));
    }
  };

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = ppmInfo && ppmInfo.data ? ppmInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = ppmInfo && ppmInfo.data ? ppmInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onRemoveSchedule = (id) => {
    dispatch(getDeletePreventiveSchedule(id, appModels.PPMCALENDAR));
  };

  const onRemoveScheduleCancel = () => {
    dispatch(resetDeletePreventiveSchedule());
    showDeleteModal(false);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    if (startDate && endDate) {
      start = `${moment(startDate).utc().format('YYYY-MM-DD')} 18:30:59`;
      end = `${moment(endDate).add(1, 'day').utc().format('YYYY-MM-DD')} 18:30:59`;
    }
    if (startDate && endDate) {
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end,
      }];
    }
    if (start && end) {
      const oldCustomFilters = ppmFilter && ppmFilter.customFilters ? ppmFilter.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getPreventiveFilter(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const dateFilters = (ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.length > 0) ? ppmFilter.customFilters : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (ppmInfo && ppmInfo.loading) || (ppmCount && ppmCount.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (ppmInfo && ppmInfo.err) ? generateErrorMessage(ppmInfo) : userErrorMsg;

  

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const stateValuesList = (ppmFilter && ppmFilter.customFilters && ppmFilter.customFilters.length > 0)
  ? ppmFilter.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');
  return (

    <Row className="pt-2">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12">
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        ) : (
          <SideFilters
            offset={offset}
            id={viewId}
            scheduleValue={statusValue}
            categoryValue={categoryValue}
            priorityValue={priorityValue}
            preventiveByValue={preventiveByValue}
            typeValue={typeValue}
            teamValue={teamValue}
            afterReset={() => { setOffset(0); setPage(1); }}
            sortBy={sortBy}
            sortField={sortField}
            columns={columns}
            setCollapse={setCollapse}
            collapse={collapse}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left scheduleList-table' : 'scheduleList-table'}>
        <Card className={collapse ? 'filter-margin-right p-2 bg-lightblue' : ' list p-2 bg-lightblue'}>
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col md="8" xs="12" sm="8" lg="8">
                <div className="content-inline">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Schedule List :
                    {ppmCountValue}
                  </span>
                  {checkItems && checkItems.map((st) => (
                    <p key={st.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {st.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {checkCategories && checkCategories.map((cat) => (
                    <p key={cat.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {cat.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCategoryClose(cat.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {checkPriorities && checkPriorities.map((prty) => (
                    <p key={prty.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {prty.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handlePriorityClose(prty.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {checkTeamItems && checkTeamItems.map((tm) => (
                    <p key={tm.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {tm.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTeamClose(tm.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {checkTypeItems && checkTypeItems.map((typ) => (
                    <p key={typ.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {typ.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTypeClose(typ.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {checkPreventiveBy && checkPreventiveBy.map((prty) => (
                    <p key={prty.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {prty.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handlePreventiveByClose(prty.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {/* {console.log(customFilters,"::::customFilters::::;")} */}
                  {/* {customFilters && customFilters.customFilters && customFilters.customFilters.map((cf) => (
                    <p key={cf.key} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {cf.label}
                        {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {'  '}
                          &quot;
                            {decodeURIComponent(cf.value)}
                          &quot;
                        </span>
                        )}
                        {(cf.type === 'customdate') && (
                        <span>
                          {' - '}
                          &quot;
                          {getLocalDate(cf.start)}
                          {' - '}
                          {getLocalDate(cf.end)}
                          &quot;
                        </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))} */}
                </div>
              </Col>
              <Col md="4" xs="12" sm="4" lg="4">
                <div className="float-right">
                  <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                  {/* <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} /> */}
                  {allowedOperations.includes(actionCodes['Create Admin Schedule']) && (
                  <CreateList name="Add PPM Schedule" showCreateModal={() => setAddLink(true)} />
                  )}
                  <AddColumns columns={preventiveActions.tableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                  <ExportList response={ppmInfo && ppmInfo.data && ppmInfo.data.length} />
                </div>
                {ppmInfo && ppmInfo.data && ppmInfo.data.length && (
                  <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                    <PopoverHeader>
                      Export
                      <img
                        aria-hidden="true"
                        src={closeCircleIcon}
                        className="cursor-pointer mr-1 mt-1 float-right"
                        onClick={() => dispatch(setInitialValues(false, false, false, false))}
                        alt="close"
                      />
                    </PopoverHeader>
                    <PopoverBody><DataExport afterReset={() => dispatch(setInitialValues(false, false, false, false))} fields={columns} /></PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>

            {(ppmInfo && ppmInfo.data) && (
            <span data-testid="success-case" />
            )}
            {(ppmInfo && ppmInfo.data) && (
            <div>
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          value="all"
                          className="m-0 position-relative"
                          name="checkall"
                          id="checkboxtkhead"
                          checked={isAllChecked}
                          onChange={handleTableCellAllChange}
                        />
                        <Label htmlFor="checkboxtkhead" />
                      </div>
                    </th>
                    <th className="min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Name
                      </span>
                    </th>
                    <th className="min-width-100">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('time_period'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Schedule
                      </span>
                    </th>
                    <th className="min-width-100">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('priority'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Priority
                      </span>
                    </th>
                    <th className="min-width-100">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('scheduler_type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Type
                      </span>
                    </th>
                    <th className="min-width-100">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('duration'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Duration
                      </span>
                    </th>
                    <th className="min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('ppm_by'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Performed by
                      </span>
                    </th>
                    <th className="min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Created On
                      </span>
                    </th>
                    {columns.some((selectedValue) => selectedValue.includes('maintenance_team_id')) && (
                    <th className="min-width-200">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('maintenance_team_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Maintenance Team
                      </span>
                    </th>
                    )}
                    {columns.some((selectedValue) => selectedValue.includes('category_id')) && (
                    <th className="min-width-200">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('category_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Equipment Category
                      </span>
                    </th>
                    )}
                    {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                    <th className="min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Company
                      </span>
                    </th>
                    )}
                    <th className="min-width-100">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ppmInfo.data.map((ppm) => (

                    <tr key={ppm.id}>
                      <td className="w-5">
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            value={ppm.id}
                            id={`checkboxtk${ppm.id}`}
                            className="ml-0"
                            name={ppm.name}
                            checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(ppm.id))}
                            onChange={handleTableCellChange}
                          />
                          <Label htmlFor={`checkboxtk${ppm.id}`} />
                        </div>
                      </td>
                      <td
                        aria-hidden="true"
                        onClick={() => { dispatch(setInitialValues(false, false, false, false)); }}
                      >
                        <span className="font-weight-600">{ppm.name}</span>
                      </td>
                      <td><span className="font-weight-400">{ppm.time_period}</span></td>
                      <td>
                        {ppm.priority && (
                        <span className="font-weight-400">
                          {preventiveActions.priority[ppm.priority] ? preventiveActions.priority[ppm.priority].label : ''}
                        </span>
                        )}
                      </td>
                      <td><span className="font-weight-400">{ppm.scheduler_type}</span></td>
                      <td><span className="font-weight-400">{ppm.duration}</span></td>
                      <td><span className="font-weight-400">{getppmLabel(ppm.ppm_by)}</span></td>
                      <td><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ppm.create_date, userInfo, 'datetime'))}</span></td>
                      {columns.some((selectedValue) => selectedValue.includes('maintenance_team_id')) && (
                      <td><span className="font-weight-400">{ppm.maintenance_team_id ? ppm.maintenance_team_id[1] : ''}</span></td>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('category_id')) && (
                      <td><span className="font-weight-400">{ppm.category_id ? ppm.category_id[1] : ''}</span></td>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                      <td><span className="font-weight-400">{ppm.company_id ? ppm.company_id[1] : ''}</span></td>
                      )}
                      <td className="p-2 w-5">
                        {allowedOperations.includes(actionCodes['Edit Admin Schedule']) && (
                          <>
                            <Tooltip title="Edit">
                              <img
                                aria-hidden="true"
                                src={editIcon}
                                className="cursor-pointer mr-3"
                                height="12"
                                width="12"
                                alt="edit"
                                onClick={() => { setEditId(ppm.id); setEditLink(true); dispatch(setInitialValues(false, false, false, false)); }}
                              />
                            </Tooltip>
                            <Tooltip title="Delete">
                              <span className="font-weight-400 d-inline-block" />
                              <FontAwesomeIcon
                                className="mr-1 ml-1 cursor-pointer"
                                size="sm"
                                icon={faTrashAlt}
                                onClick={() => { setRemoveId(ppm.id); setRemoveName(ppm.name); showDeleteModal(true); }}
                              />
                            </Tooltip>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
            </div>
            )}
            {loading && (
            <div className="mb-2 mt-3 p-5" data-testid="loading-case">
              <Loader />
            </div>
            )}
            {((ppmInfo && ppmInfo.err) || isUserError) && (
            <ErrorContent errorTxt={errorMsg} />
            )}
            <Modal
              size={(preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data) ? 'sm' : 'lg'}
              className="border-radius-50px modal-dialog-centered purchase-modal"
              isOpen={deleteModal}
            >
              <ModalHeaderComponent title="Delete PPM Scheduler" imagePath={false} closeModalWindow={() => onRemoveScheduleCancel()} response={preventiveScheduleDeleteInfo} />
              <ModalBody className="mt-0 pt-0">
                {preventiveScheduleDeleteInfo && (!preventiveScheduleDeleteInfo.data && !preventiveScheduleDeleteInfo.loading && !preventiveScheduleDeleteInfo.err) && (
                <p className="text-center">
                  {`Are you sure, you want to remove ${removeName} ?`}
                </p>
                )}
                {preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.err) && (
                <SuccessAndErrorFormat response={preventiveScheduleDeleteInfo} />
                )}
                {(preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data) && (
                <SuccessAndErrorFormat response={preventiveScheduleDeleteInfo} successMessage="PPM Scheduler removed successfully.." />
                )}
                <div className="pull-right mt-3">
                  {preventiveScheduleDeleteInfo && !preventiveScheduleDeleteInfo.data && (
                  <Button
                    size="sm"
                    disabled={preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.loading}
                     variant="contained"
                    onClick={() => onRemoveSchedule(removeId)}
                  >
                    Confirm
                  </Button>
                  )}
                  {preventiveScheduleDeleteInfo && preventiveScheduleDeleteInfo.data && (
                  <Button size="sm"  variant="contained" onClick={() => onRemoveScheduleCancel()}>Ok</Button>
                  )}
                </div>
              </ModalBody>
            </Modal>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default PreventiveSchedulerAdmin;
