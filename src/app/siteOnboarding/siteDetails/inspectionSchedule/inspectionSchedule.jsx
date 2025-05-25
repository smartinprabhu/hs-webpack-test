/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import Table from '@mui/material/Table';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Badge, Card, CardBody, Col, Row, 
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Drawer,
} from 'antd';

import DynamicCheckboxFilter from '@shared/filters/dynamicCheckboxFilter';
import StaticCheckboxFilter from '@shared/filters/staticCheckboxFilter';
import CustomTable from '@shared/customTable';
import DynamicColumns from '@shared/filters/dynamicColumns';
import uniqBy from 'lodash/unionBy';

import ListDateFilters from '@shared/listViewFilters/dateFiltersDynamic';
import TableListFormat from '@shared/tableListFormat';
import ExportList from '@shared/listViewFilters/export';
import CreateList from '@shared/listViewFilters/create';

import DrawerHeader from '@shared/drawerHeader';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';

import customData from '../../../inspectionSchedule/data/customData.json';
import filtersFields from '../../../inspectionSchedule/data/filtersFields.json';
import {
  getPagesCountV2, 
  getAllowedCompanies, getColumnArrayById, queryGeneratorWithUtc,
  getCompanyTimezoneDate, 
  getArrayFromValuesByItem, 
  getListOfOperations, extractNameObject, getDateAndTimeForDifferentTimeZones,
} from '../../../util/appUtils';
import {
  getInspectionCheckListCount, getInspectionCheckList,
  getInspectionFilters, getInspectionChecklistsGroups,
  getInspectionSchedulertDetail, 
} from '../../../inspectionSchedule/inspectionService';
import {
  setInitialValues, 
} from '../../../purchase/purchaseService';
// import Navbar from '../../../inspectionSchedule/navbar/navbar';
import {
  getWorkOrderPriorityLabel,
} from '../../../workorders/utils/utils';
import DataExport from '../../../inspectionSchedule/dataExport/dataExport';
import { getTeamGroups } from '../../../workorders/workorderService';
import SchedulerDetail from '../../../inspectionSchedule/schedulerDetail/schedulerDetail';
import actionCodes from '../../../inspectionSchedule/data/actionCodes.json';
import AddInspectionChecklist from '../../../inspectionSchedule/addInspectionChecklist';
import fieldsData from '../../../inspectionSchedule/data/customData.json';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const InspectionSchedule = () => {
  const limit = 20;
  const subMenu = 'Scheduler';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [columnsFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const apiFields = fieldsData && fieldsData.listFields ? fieldsData.listFields : [];
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [addLink, setAddLink] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [teamGroups, setTeamGroups] = useState([]);
  const [checklistGroups, setChecklistGroups] = useState([]);
  const [editLink, setEditLink] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [openMTeam, setOpenMTeam] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [typeGroups, setTypeGroups] = useState([]);
  const [priorityGroups, setPriorityGroups] = useState([]);
  const [columnHide, setColumnHide] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { siteDetails } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  // const companies = getAllowedCompanies(userInfo);
  const {
    inspectionCount, inspectionListInfo, inspectionCountLoading,
    inspectionFilters, checklistGroupsInfo, inspectionSchedulerDetail, addInspectionScheduleInfo,
  } = useSelector((state) => state.inspection);
  const { teamGroupsInfo } = useSelector((state) => state.workorder);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const {
    updatePpmSchedulerInfo,
  } = useSelector((state) => state.ppm);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };
  useEffect(() => {
    if (inspectionFilters && inspectionFilters.customFilters) {
      setCustomFilters(inspectionFilters.customFilters);
    }
  }, [inspectionFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInspectionCheckListCount(companies, appModels.INSPECTIONCHECKLIST, customFiltersList));
    }
  }, [userInfo, customFilters, addInspectionScheduleInfo, updatePpmSchedulerInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInspectionCheckList(companies, appModels.INSPECTIONCHECKLIST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, offset, sortedValue, customFilters, updatePpmSchedulerInfo, addInspectionScheduleInfo]);

  useEffect(() => {
    if (openMTeam) {
      dispatch(getTeamGroups(companies, appModels.INSPECTIONCHECKLIST));
    }
  }, [openMTeam]);

  useEffect(() => {
    if (openGroup) {
      dispatch(getInspectionChecklistsGroups(companies, appModels.INSPECTIONCHECKLIST));
    }
  }, [openGroup]);

  useEffect(() => {
    if (teamGroupsInfo && teamGroupsInfo.data) {
      setTeamGroups(teamGroupsInfo.data);
    }
  }, [teamGroupsInfo]);

  useEffect(() => {
    if (checklistGroupsInfo && checklistGroupsInfo.data) {
      setChecklistGroups(checklistGroupsInfo.data);
    }
  }, [checklistGroupsInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getInspectionSchedulertDetail(viewId, appModels.INSPECTIONCHECKLIST));
    }
  }, [viewId]);

  const totalDataCount = inspectionCount && inspectionCount.length ? inspectionCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columnsFields.filter((item) => item !== value));
    }
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = inspectionListInfo && inspectionListInfo.data ? inspectionListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = inspectionListInfo && inspectionListInfo.data ? inspectionListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'category_type', title: 'Type', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-category_type');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handlePriorityCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'priority', title: name, value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-priority');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date', Header: value, id: value,
    }];
    if (checked) {
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters ? inspectionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getInspectionFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const onTeamSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = teamGroups.filter((item) => {
        const searchValue = item.maintenance_team_id ? item.maintenance_team_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setTeamGroups(ndata);
    } else {
      setTeamGroups(teamGroupsInfo && teamGroupsInfo.data ? teamGroupsInfo.data : []);
    }
  };

  const handleTeamChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'maintenance_team_id', title: 'Team', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-maintenance_team_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const onGroupSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = checklistGroups.filter((item) => {
        const searchValue = item.group_id ? item.group_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setChecklistGroups(ndata);
    } else {
      setChecklistGroups(checklistGroupsInfo && checklistGroupsInfo.data ? checklistGroupsInfo.data : []);
    }
  };

  const handleGroupChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'group_id', title: 'Group', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getInspectionFilters(customFiltersList));
      removeData('data-group_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getInspectionFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];

    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, startDate, endDate);

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end, Header: value, id: value,
      }];
    }
    if (start && end) {
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters ? inspectionFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      dispatch(getInspectionFilters(customFilters1));
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (fValue, cf) => {
    setCustomFilters(customFilters.filter((item) => item.value !== fValue));
    const customFiltersList = customFilters.filter((item) => item.value !== fValue);
    dispatch(getInspectionFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(1);
  };

  const handleResetClick = () => {
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setCustomFilters([]);
    dispatch(getInspectionFilters([]));
    setOffset(0);
    setPage(1);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
    setViewModal(true);
  };

  const onViewReset = () => {
    dispatch(resetCreateInspection());
    if (document.getElementById('checkoutinspectionForm')) {
      document.getElementById('checkoutinspectionForm').reset();
    }
    setViewId(false);
    setViewModal(false);
    setAddLink(false);
    setEditLink(false);
  };

  const onEditReset = () => {
    dispatch(resetCreateInspection());
    if (document.getElementById('checkoutinspectionForm')) {
      document.getElementById('checkoutinspectionForm').reset();
    }
    setViewId(false);
    setViewModal(true);
    setAddLink(false);
    setEditLink(false);
  };

  const afterReset = () => {
    dispatch(resetCreateInspection());
    if (document.getElementById('checkoutinspectionForm')) {
      document.getElementById('checkoutinspectionForm').reset();
    }
    setAddLink(false);
    setEditLink(false);
  };

  function getNextPreview(ids, type) {
    const array = inspectionListInfo && inspectionListInfo.data ? inspectionListInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (type === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getInspectionFilters(customFilters1));
    setOffset(0);
    setPage(1);
  };

  const stateValuesList = (inspectionFilters && inspectionFilters.customFilters && inspectionFilters.customFilters.length > 0)
    ? inspectionFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (inspectionFilters && inspectionFilters.customFilters && inspectionFilters.customFilters.length > 0) ? inspectionFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (inspectionListInfo && inspectionListInfo.loading) || (inspectionCountLoading);

  // eslint-disable-next-line no-lone-blocks
  { /* if (addLink) {
    return (
      <Redirect to={{
        pathname: '/inspection/add-inspection',
        state: { referrer: 'inspection-schedule' },
      }}
      />
    );
  }

  if (editLink) {
    return (
      <Redirect to={{
        pathname: `/inspection/edit-inspection/${viewId}`,
        state: { referrer: 'inspection-schedule' },
      }}
      />
    );
  } */ }

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(
    () => (inspectionListInfo.data ? inspectionListInfo.data : [{}]),
    [inspectionListInfo.data],
  );
  const hiddenColumns = ['uuid', 'priority', 'task_id', 'parent_id', 'id'];
  const searchColumns = ['asset_number', 'priority', 'group_id', 'uuid', 'equipment_id', 'category_type', 'maintenance_team_id'];
  const advanceSearchjson = {
    category_type: setOpenType,
    priority: setOpenPriority,
    group_id: setOpenGroup,
    maintenance_team_id: setOpenMTeam,
  };

  useEffect(() => {
    if (openType) {
      setKeyword('');
      setOpenPriority(false);
      setOpenGroup(false);
      setOpenMTeam(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openPriority) {
      setKeyword('');
      setOpenType(false);
      setOpenGroup(false);
      setOpenMTeam(false);
    }
  }, [openPriority]);

  useEffect(() => {
    if (openGroup) {
      setKeyword('');
      setOpenType(false);
      setOpenPriority(false);
      setOpenMTeam(false);
    }
  }, [openGroup]);

  useEffect(() => {
    if (openMTeam) {
      setKeyword('');
      setOpenType(false);
      setOpenPriority(false);
      setOpenGroup(false);
    }
  }, [openMTeam]);

  const advanceSearchColumns = ['category_type', 'priority', 'group_id', 'maintenance_team_id'];
  const initialState = {
    hiddenColumns,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    allColumns,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = valueArray;
    const filterArray = [];
    if (column.value) {
      array.push(column);
      array = uniqBy(array, 'Header');
      array.map((key) => {
        const filters = {
          key: key.key ? key.key : key.id,
          title: key.label ? key.label : key.Header,
          value: encodeURIComponent(key.value),
          label: key.label ? key.label : key.Header,
          type: key.type ? key.type : text,
          arrayLabel: key.label,
        };
        if (key.start && key.end) {
          filters.start = key.start;
          filters.end = key.end;
        }
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(1);
      dispatch(getInspectionFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };
  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 p-2">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row>
          <Col md="12" sm="12" lg="12" xs="12" className="inspection-checklist pl-1 pt-2 pr-2">
            <Card className="p-2 mb-2 h-100 bg-lightblue">
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2">
                  <Col md="8" xs="12" sm="8" lg="8">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Inspection Checklist :
                      {'  '}
                      {columnHide && columnHide.length && totalDataCount}
                    </span>
                    {columnHide && columnHide.length ? (
                      <div className="content-inline">
                        {customFilters && customFilters.map((cf) => (
                          <p key={cf.value} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                              {(cf.type === 'inarray') ? (
                                <>
                                  {cf.title}
                                  <span>
                                    {'  '}
                                    :
                                    {' '}
                                    {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
                                  </span>
                                </>
                              ) : (
                                <>
                                  {cf.label}
                                </>
                              )}
                              {' '}
                              {(cf.type === 'text' || cf.type === 'id') && (
                              <span>
                                {'  '}
                                :
                                {' '}
                                {decodeURIComponent(cf.value)}
                              </span>
                              )}
                              {(cf.type === 'customdate') && (
                              <span>
                                :
                                {'  '}
                                {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                                {' - '}
                                {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                              </span>
                              )}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                            </Badge>
                          </p>
                        ))}
                        {customFilters && customFilters.length ? (
                          <span onClick={() => handleResetClick()} className="cursor-pointer text-info mr-2">
                            Clear
                          </span>
                        ) : ''}
                      </div>
                    ) : ''}
                  </Col>
                  <Col md="4" xs="12" sm="4" lg="4">
                    <div className="float-right">
                      <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} idNameFilter="inspectionDate" classNameFilter="drawerPopover popoverDate" />
                      {allowedOperations.includes(actionCodes['Create Inspection Schedule']) && (
                        <CreateList name="Add Inspection Checklist" showCreateModal={() => setAddLink(true)} />
                      )}
                      <ExportList idNameFilter="inspectionExport" />
                      <DynamicColumns
                        setColumns={setColumns}
                        columnFields={columnsFields}
                        allColumns={allColumns}
                        setColumnHide={setColumnHide}
                        idNameFilter="inspectionColumns"
                        classNameFilter="drawerPopover"
                      />
                    </div>
                    {document.getElementById('inspectionExport') && (
                    <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="inspectionExport">
                      <PopoverHeader>
                        Export
                        <img
                          src={closeCircleIcon}
                          aria-hidden="true"
                          className="cursor-pointer mr-1 mt-1 float-right"
                          onClick={() => dispatch(setInitialValues(false, false, false, false))}
                          alt="close"
                        />
                      </PopoverHeader>
                      <PopoverBody>
                        <DataExport
                          afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                          fields={columnsFields}
                          rows={checkedRows}
                          sortBy={sortedValue.sortBy}
                          sortField={sortedValue.sortField}
                          apiFields={apiFields}
                        />
                      </PopoverBody>
                    </Popover>
                    )}
                  </Col>
                </Row>
                <div className="thin-scrollbar">
                  <div className="table-responsive common-table">
                    <Table responsive {...getTableProps()} className="mt-2">
                      <CustomTable
                        isAllChecked={isAllChecked}
                        handleTableCellAllChange={handleTableCellAllChange}
                        searchColumns={searchColumns}
                        onChangeFilter={onChangeFilter}
                        removeData={removeData}
                        setKeyword={setKeyword}
                        handleTableCellChange={handleTableCellChange}
                        checkedRows={checkedRows}
                        setViewId={setViewId}
                        setViewModal={setViewModal}
                        tableData={inspectionListInfo}
                        priorityLabelFunction={getWorkOrderPriorityLabel}
                        advanceSearchColumns={advanceSearchColumns}
                        advanceSearchFunc={advanceSearchjson}
                        tableProps={{
                          page,
                          prepareRow,
                          getTableBodyProps,
                          headerGroups,
                        }}
                      />
                    </Table>
                  </div>
                </div>
                {openType && (
                  <StaticCheckboxFilter
                    selectedValues={stateValues}
                    dataGroup={typeGroups}
                    onCheckboxChange={handleStatusCheckboxChange}
                    target="data-category_type"
                    title="Type"
                    openPopover={openType}
                    toggleClose={() => setOpenType(false)}
                    setDataGroup={setTypeGroups}
                    keyword={keyword}
                    data={customData && customData.inspectionTypes ? customData.inspectionTypes : []}
                  />
                )}
                {openPriority && (
                  <StaticCheckboxFilter
                    selectedValues={stateValues}
                    dataGroup={priorityGroups}
                    onCheckboxChange={handlePriorityCheckboxChange}
                    target="data-priority"
                    title="Priority"
                    openPopover={openPriority}
                    toggleClose={() => setOpenPriority(false)}
                    setDataGroup={setPriorityGroups}
                    keyword={keyword}
                    data={customData && customData.inspectionPriorities ? customData.inspectionPriorities : []}
                  />
                )}
                {openMTeam && (
                  <DynamicCheckboxFilter
                    data={teamGroupsInfo}
                    selectedValues={stateValues}
                    dataGroup={teamGroups}
                    filtervalue="maintenance_team_id"
                    onCheckboxChange={handleTeamChange}
                    toggleClose={() => setOpenMTeam(false)}
                    openPopover={openMTeam}
                    target="data-maintenance_team_id"
                    title="Maintenance Teams"
                    keyword={keyword}
                    setDataGroup={setTeamGroups}
                  />
                )}
                {openGroup && (
                  <DynamicCheckboxFilter
                    data={checklistGroupsInfo}
                    selectedValues={stateValues}
                    dataGroup={checklistGroups}
                    filtervalue="group_id"
                    onCheckboxChange={handleGroupChange}
                    toggleClose={() => setOpenGroup(false)}
                    openPopover={openGroup}
                    target="data-group_id"
                    title="Groups"
                    keyword={keyword}
                    setDataGroup={setChecklistGroups}
                  />
                )}
                {columnHide && !columnHide.length ? (
                  <div className="text-center mb-4">
                    Please select the Columns
                  </div>
                ) : ''}
                {loading || pages === 0 ? (<span />) : (
                  <div className={`${classes.root} float-right`}>
                    {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
                  </div>
                )}

                <Drawer
                  title=""
                  closable={false}
                  width={1250}
                  className="drawer-bg-lightblue"
                  visible={viewModal}
                >
                  <DrawerHeader
                    title={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0)
                      ? extractNameObject(inspectionSchedulerDetail.data[0].group_id, 'name') : 'Name'}
                    imagePath={false}
                    isEditable={(allowedOperations.includes(actionCodes['Edit Inspection Schedule']) && (inspectionSchedulerDetail && !inspectionSchedulerDetail.loading))}
                    closeDrawer={() => onViewReset()}
                    onEdit={() => { setEditLink(true); }}
                    onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
                    onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
                  />
                  <SchedulerDetail />
                </Drawer>
                <Drawer
                  title=""
                  closable={false}
                  className="drawer-bg-lightblue create-inspection"
                  width={1250}
                  visible={addLink}
                >

                  <DrawerHeader
                    title="Create Inspection Checklist"
                    imagePath={predictiveMaintenance}
                    closeDrawer={onViewReset}
                  />
                  <AddInspectionChecklist setAddLink={setAddLink} />
                </Drawer>
                <Drawer
                  title=""
                  closable={false}
                  className="drawer-bg-lightblue"
                  width={1250}
                  visible={editLink}
                >

                  <DrawerHeader
                    title="Update Inspection Checklist"
                    imagePath={predictiveMaintenance}
                    closeDrawer={onEditReset}
                  />
                  <AddInspectionChecklist setEditLink={setEditLink} editId={viewId} afterReset={afterReset} />
                </Drawer>
                {columnHide && columnHide.length ? (
                  <TableListFormat
                    userResponse={userInfo}
                    listResponse={inspectionListInfo}
                    countLoad={inspectionCountLoading}
                  />
                ) : ''}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default InspectionSchedule;