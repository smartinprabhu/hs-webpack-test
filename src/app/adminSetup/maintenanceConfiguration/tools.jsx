/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardTitle, Collapse, CardBody, Col, Input, Label, Row, Table, UncontrolledTooltip,
  Modal,
  ModalBody,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import editIcon from '@images/icons/edit.svg';
import filterIcon from '@images/filter.png';
import collapseIcon from '@images/collapse.png';
import closeCircleIcon from '@images/icons/closeCircle.svg';

import ListDateFilters from '@shared/listViewFilters/dateFilters';
import ExportList from '@shared/listViewFilters/export';
import CreateList from '@shared/listViewFilters/create';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import Refresh from '@shared/listViewFilters/refresh';

import maintenanceData from './data/maintenanceData.json';
import {
  getPagesCount, getTotalCount, generateErrorMessage,
  getLocalDate, queryGenerator, getAllowedCompanies,
  getListOfModuleOperations, getArrayFromValuesByItem,
  getColumnArrayById, queryGeneratorWithUtc,
} from '../../util/appUtils';
import {
  getTools, getToolsCount,
  getToolsFilters, resetUpdateTool,
  resetDeleteChecklist,
  getDeleteChecklist,
} from './maintenanceService';
import EditTool from './editTool';
import { setInitialValues } from '../../purchase/purchaseService';
import actionCodes from '../data/actionCodes.json';
import DataExport from './toolsExport/dataExport';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Tools = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState('');
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [columns, setColumns] = useState(maintenanceData && maintenanceData.toolsTableColumnsShow ? maintenanceData.toolsTableColumnsShow : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [editData, setEditData] = useState([]);
  const [editModal, setEditModal] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [reload, setReload] = useState(false);

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const {
    toolsCount, toolsListInfo, toolsCountLoading,
    toolsFilters, updateToolInfo, checklistDeleteInfo,
  } = useSelector((state) => state.maintenance);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(resetDeleteChecklist());
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = toolsFilters.customFilters ? queryGeneratorWithUtc(toolsFilters.customFilters,false, userInfo.data) : '';
      dispatch(getToolsCount(companies, appModels.TOOL, statusValue, customFiltersList));
    }
  }, [userInfo, statusValue, toolsFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = toolsFilters.customFilters ? queryGeneratorWithUtc(toolsFilters.customFilters,false, userInfo.data) : '';
      dispatch(getTools(companies, appModels.TOOL, limit, offset, statusValue, customFiltersList, sortBy, sortField));
    }
  }, [userInfo, offset, sortField, sortBy, statusValue,reload, toolsFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (checklistDeleteInfo && checklistDeleteInfo.data)) {
      const customFiltersList = toolsFilters.customFilters ? queryGeneratorWithUtc(toolsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getToolsCount(companies, appModels.TOOL, statusValue, customFiltersList));
      dispatch(getTools(companies, appModels.TOOL, limit, offset, statusValue, customFiltersList, sortBy, sortField));
    }
  }, [checklistDeleteInfo]);

  useEffect(() => {
    if (toolsFilters && toolsFilters.customFilters) {
      setCustomFilters(toolsFilters.customFilters);
    }
  }, [toolsFilters]);

  const pages = getPagesCount(toolsCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
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
    const { checked } = event.target;
    dispatch(setInitialValues(false, false, false, false));
    if (checked) {
      const data = toolsListInfo && toolsListInfo.data ? toolsListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = toolsListInfo && toolsListInfo.data ? toolsListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getToolsFilters(customFiltersList));
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const closeEditModalWindow = () => {
    if (userInfo && userInfo.data && updateToolInfo && updateToolInfo.data) {
      const customFiltersList = toolsFilters.customFilters ? queryGeneratorWithUtc(toolsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTools(companies, appModels.TOOL, limit, offset, statusValue, customFiltersList, sortBy, sortField));
    }
    dispatch(resetUpdateTool());
    setEditData([]);
    setEditModal(false);
  };

  const openEditModalWindow = (data) => {
    dispatch(resetUpdateTool());
    setEditData(data);
    setEditModal(true);
  };

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setStatusValue(value);
    } else {
      setStatusValue('');
    }
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = toolsFilters && toolsFilters.customFilters ? toolsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getToolsFilters(customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = toolsFilters && toolsFilters.customFilters ? toolsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getToolsFilters(customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = toolsFilters && toolsFilters.customFilters ? toolsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getToolsFilters(customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = toolsFilters && toolsFilters.customFilters ? toolsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getToolsFilters(customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  function searchHandleSubmit(values, { resetForm }) {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = toolsFilters && toolsFilters.customFilters ? toolsFilters.customFilters : [];
    const customFiltersData = [...oldCustomFilters, ...filters];
    dispatch(getToolsFilters(customFiltersData));
    resetForm({ values: '' });
    setOffset(0); setPage(1);
  }

  const onRemove = (id) => {
    dispatch(getDeleteChecklist(id, appModels.TOOL));
  };

  const onRemoveCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  const dateFilters = (toolsFilters && toolsFilters.customFilters && toolsFilters.customFilters.length > 0) ? toolsFilters.customFilters : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (toolsListInfo && toolsListInfo.loading) || (toolsCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (toolsListInfo && toolsListInfo.err) ? generateErrorMessage(toolsListInfo) : userErrorMsg;

  if (addLink) {
    return (<Redirect to="/maintenance-configuration/add-tools" />);
  }

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
          <Card className="p-1 bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
                  <p className="m-0 font-weight-800 collapse-heading">BY STATUS</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={statusCollapse}>
                <div>
                  <span className="mb-1 d-block font-weight-500">
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id="checkboxfilter3"
                        name="active"
                        value="all"
                        checked={statusValue === 'all'}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="checkboxfilter3">
                        <span>All</span>
                      </Label>
                      {' '}
                    </div>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id="checkboxfilter1"
                        name="active"
                        value="yes"
                        checked={statusValue === 'yes'}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="checkboxfilter1">
                        <span>Active</span>
                      </Label>
                      {' '}
                    </div>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id="checkboxfilter2"
                        name="active"
                        value="no"
                        checked={statusValue === 'no'}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor="checkboxfilter2">
                        <span>Inactive</span>
                      </Label>
                      {' '}
                    </div>
                  </span>
                </div>
              </Collapse>
              <hr className="mt-2" />
              {statusValue && statusValue.length > 0 && (
                <div
                  aria-hidden="true"
                  className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800"
                  onClick={() => setStatusValue('')}
                  onKeyDown={() => setStatusValue('')}
                >
                  Reset Filters
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </Col>
      <Col className="tools-table" md="12" sm="12" lg={collapse ? 11 : 9} xs="12">
        <Card className={collapse ? 'filter-margin-left p-2 mb-2 h-100 bg-lightblue list ' : ' list p-2 mb-2 h-100 bg-lightblue'}>
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col md="8" xs="12" sm="8" lg="8">
                <div className="content-inline">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    Tools :
                    {getTotalCount(toolsCount)}
                  </span>
                  {statusValue && statusValue === 'yes' && (
                    <p className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        Active
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('all')} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  )}
                  {statusValue && statusValue === 'no' && (
                    <p className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        Inactive
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('all')} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  )}
                  {customFilters && customFilters.map((cf) => (
                    <p key={cf.key} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {cf.label}
                        {cf.type === 'text' && (
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
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                </div>
              </Col>
              <Col md="4" xs="12" sm="4" lg="4">
                <div className="float-right">
                  <Refresh
                    loadingTrue={loading}
                    setReload={setReload}
                  />
                  <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                  <SearchList formFields={maintenanceData.fields} searchHandleSubmit={searchHandleSubmit} />
                  {allowedOperations.includes(actionCodes['Add Tool']) && (
                  <CreateList name="Add Tools" showCreateModal={() => setAddLink(true)} />
                  )}
                  <AddColumns columns={maintenanceData.toolsTableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                  <ExportList response={toolsListInfo && toolsListInfo.data && toolsListInfo.data.length}/>
                </div>
                {toolsListInfo && toolsListInfo.data && toolsListInfo.data.length && (
                  <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
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
                        fields={columns}
                        rows={checkedRows}
                        statusValue={statusValue}
                      />
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>

            {(toolsListInfo && toolsListInfo.data) && (
              <span data-testid="success-case" />
            )}
            <div className="thin-scrollbar">
              {(toolsListInfo && toolsListInfo.data) && (

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
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Name
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('tool_cost_unit'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Hourly Tool Cost
                        </span>
                      </th>
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('active'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Status
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Created On
                        </span>
                      </th>
                      {columns.some((selectedValue) => selectedValue.includes('order_id')) && (
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('order_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Maintenance Order
                        </span>
                      </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Company
                          </span>
                        </th>
                      )}
                      <th className="p-2 min-width-100 text-center">
                        <span>
                          Action
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    {toolsListInfo.data.length && toolsListInfo.data.map((tl) => (

                      <tr key={tl.id}>
                        <td className="w-5">
                          <div className="checkbox">
                            <Input
                              type="checkbox"
                              value={tl.id}
                              id={`checkboxtk${tl.id}`}
                              className="ml-0"
                              name={tl.name}
                              checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(tl.id))}
                              onChange={handleTableCellChange}
                            />
                            <Label htmlFor={`checkboxtk${tl.id}`} />
                          </div>
                        </td>
                        <td className="w-20">
                          <span className="font-weight-600">{tl.name}</span>
                        </td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{tl.tool_cost_unit ? `${tl.tool_cost_unit}.00` : '0.00'}</span></td>
                        <td className="w-15">
                          <span className="font-weight-400 d-inline-block">
                            {tl.active
                              ? <span className="text-success font-weight-700">Active</span>
                              : <span className="text-danger font-weight-700">Inactive</span>}
                          </span>
                        </td>
                        <td className="w-20"><span className="font-weight-400 d-inline-block">{getLocalDate(tl.create_date)}</span></td>
                        {columns.some((selectedValue) => selectedValue.includes('order_id')) && (
                          <td><span className="font-weight-400">{tl.order_id ? tl.order_id[1] : ''}</span></td>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                          <td><span className="font-weight-400">{tl.company_id ? tl.company_id[1] : ''}</span></td>
                        )}
                        <td className="p-2 w-10 text-center">
                          {allowedOperations.includes(actionCodes['Edit Tool']) && (
                            <>
                              <Tooltip title="Edit">
                                <img
                                  aria-hidden="true"
                                  src={editIcon}
                                  className="cursor-pointer mr-3"
                                  height="12"
                                  width="12"
                                  alt="edit"
                                  onClick={() => { openEditModalWindow(tl); dispatch(setInitialValues(false, false, false, false)); }}
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <span className="font-weight-400 d-inline-block" />
                                <FontAwesomeIcon
                                  className="mr-1 ml-1 cursor-pointer"
                                  size="sm"
                                  icon={faTrashAlt}
                                  onClick={() => { setRemoveId(tl.id); setRemoveName(tl.name); showDeleteModal(true); }}
                                />
                              </Tooltip>
                            </>
                          )}
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </Table>

              )}
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
              {loading && (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
              )}

              {((toolsListInfo && toolsListInfo.err) || isUserError) && (

                <ErrorContent errorTxt={errorMsg} />

              )}
              <Modal size={(updateToolInfo && updateToolInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editModal}>
                <ModalHeaderComponent title="Edit Tool" imagePath={false} closeModalWindow={closeEditModalWindow} response={updateToolInfo} />
                <ModalBody className="pt-0 mt-0">
                  <EditTool editData={editData} afterReset={() => closeEditModalWindow()} />
                </ModalBody>
              </Modal>
              <Modal size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={deleteModal}>
                <ModalHeaderComponent title="Delete Tool" imagePath={false} closeModalWindow={() => onRemoveCancel()} response={checklistDeleteInfo} />
                <ModalBody className="mt-0 pt-0">
                  {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
                  <p className="text-center">
                    {`Are you sure, you want to remove ${removeName} tool ?`}
                  </p>
                  )}
                  {checklistDeleteInfo && checklistDeleteInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                  )}
                  {(checklistDeleteInfo && checklistDeleteInfo.err) && (
                  <SuccessAndErrorFormat response={checklistDeleteInfo} />
                  )}
                  {(checklistDeleteInfo && checklistDeleteInfo.data) && (
                  <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage="Tool removed successfully.." />
                  )}
                  <div className="pull-right mt-3">
                    {checklistDeleteInfo && !checklistDeleteInfo.data && (
                    <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading}  variant="contained" onClick={() => onRemove(removeId)}>Confirm</Button>
                    )}
                    {checklistDeleteInfo && checklistDeleteInfo.data && (
                    <Button size="sm"  variant="contained" onClick={() => onRemoveCancel()}>Ok</Button>
                    )}
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Tools;
