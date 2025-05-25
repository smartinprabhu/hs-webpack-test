/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Popover,
  PopoverHeader,
  PopoverBody,
  Table, Tooltip,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faPencilAlt, faSearch, faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import DetailNavigation from '@shared/navigation';
import NewTableComponent from './newTableComponent';
import {
  getPagesCountV2, getDefaultNoValue, getColumnArrayById, generateErrorMessage, getListOfOperations, queryGenerator,
} from '../util/appUtils';
import Filters from './filters/filters';
import Navbar from './navbar/navbar';
import SideFilters from './sidebar/sideFilters';
import EmployeeDetail from './employeeDetails/employeeDetail';
import {
  getEmployeeDetail, getEmployeeFilters, deleteEmployeeData, resetDeleteEmployeeData, loadNeighbourhoods, getAllEmployee,
} from './employeeService';
import '@app/employees/employees.scss';
import SpaceNavbar from '../spaceManagement/navbar/spaceNavbar';

import actionCodes from './data/employeeActionCodes.json';
import DataExport from './DataExport/dataExport';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Employees = () => {
  const dispatch = useDispatch();
  const spaceSubMenu = 'Hr Settings';
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState(0);
  const [statusValue, setStatusValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [openValues, setOpenValues] = useState([]);
  const [deleteEmployee, setDeleteEmployee] = useState(false);
  const [isExportEmployee, showExportEmployee] = useState(false);
  const [isFilter, showFilter] = useState(false);
  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };
  const { userRoles } = useSelector((state) => state.user);


  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const classes = useStyles();

  const { userInfo } = useSelector((state) => state.user);
  const {
    employeesCount, employeesInfo, employeeCountLoading, employeeDetails,
    employeeFilters, deleteEmployeeInfo, employeeNeighbours,
  } = useSelector((state) => state.employee);

  const employeeData = employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) ? employeeDetails.data[0] : '';

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== value));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = employeesInfo && employeesInfo.data ? employeesInfo.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  useEffect(() => {
    if (viewId) {
      dispatch(getEmployeeDetail(viewId, appModels.USERMANAGEMENT));
    }
  }, [viewId]);

  useEffect(() => {
    if (employeeFilters && employeeFilters.statuses) {
      setCheckItems(employeeFilters.statuses);
    }
    if (employeeFilters && employeeFilters.customFilters) {
      setCustomFilters(employeeFilters.customFilters);
    }
  }, [employeeFilters]);

  const totalEmpCount = employeesCount && employeesCount.length ? employeesCount.length : 0;

  const tableHeaders = ['Name', 'Email', 'Role', 'Neighbourhood Groups'];

  useEffect(() => {
    if (isExportEmployee && userInfo && userInfo.data && userInfo.data.company
      && (employeeFilters
        && (employeeFilters.statuses
          || employeeFilters.customFilters)
      )) {
      const statusValues = employeeFilters.statuses ? getColumnArrayById(employeeFilters.statuses, 'id') : [];
      const customFilter = employeeFilters.customFilters ? queryGenerator(employeeFilters.customFilters) : '';
      dispatch(getAllEmployee(
        userInfo.data.company.id,
        appModels.USERMANAGEMENT,
        totalEmpCount,
        0,
        statusValues,
        customFilter,
        sortBy,
        sortField,
      ));
    }
  }, [isExportEmployee, userInfo, sortBy, sortField, employeeFilters, statusValue]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(loadNeighbourhoods(userInfo.data.company.id, appModels.NEIGHBOURHOODGROUP, '', ''));
    }
  }, [sortBy, sortField]);

  const handlePageClick = (e, index, limit) => {
    e.preventDefault();
    setOffset((index - 1) * limit);
    setPage(index);
    setIsAllChecked(false);
    showFilter(false);
  };

  const handleStatusClose = (value) => {
    setOffset(0);
    setPage(1);
    setStatusValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = employeeFilters && employeeFilters.statuses ? employeeFilters.statuses : [];
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getEmployeeFilters(states, customFiltersList));
  };

  const onClose = () => {
    setViewId(0);
    setEdit(false);
    setOffset(offset);
    setPage(page);
    setCustomFilters([]);
    showFilter(false);
    const states = employeeFilters && employeeFilters.statuses ? employeeFilters.statuses : [];
    dispatch(getEmployeeFilters(states, []));
  };
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo
    && userInfo.loading)
    || (employeesInfo
      && employeesInfo.loading)
    || (employeeCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (employeesInfo
    && employeesInfo.err)
    ? generateErrorMessage(employeesInfo) : userErrorMsg;

  const handleEmployeeDelete = () => {
    if (employeeData) {
      dispatch(deleteEmployeeData(employeeData.id, appModels.EMPLOYEE));
    }
  };

  const deleteToggle = () => {
    dispatch(resetDeleteEmployeeData());
    setDeleteEmployee(false);
    setViewId(0);
    setOffset(0);
    setPage(1);
  };

  // syncfusion code:

  const TooltipAnimation = {
    open: { effect: 'ZoomIn', duration: 500 },
    close: { effect: 'ZoomOut', duration: 500 },
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 space-management border">
      <Col sm="12" md="12" lg="12" xs="12">
        <SpaceNavbar id={spaceSubMenu} setCurrentMenuTab={() => { }} />
        <div className="pt-3"></div>
        <Row className=" employeesStyles ml-1 mr-3 mt-2 mb-2 p-2 border">
          <Col sm="12" md="12" lg="12" xs="12">
            <Row>
              <Col md="12" sm="12" lg="3" xs="12" className={viewId ? 'mt-1' : 'mt-1 hidden-div'}>
                <SideFilters
                  offset={offset}
                  isFilter={isFilter}
                  showFilter={showFilter}
                  id={viewId}
                  statusValue={statusValue}
                  setStatusValue={setStatusValue}
                  afterReset={() => { setPage(1); setOffset(0); }}
                  sortBy={sortBy}
                  sortField={sortField}
                />
              </Col>
              <Col>
                {viewId ? (
                  <div className="card h-100 main-card ">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <Card className="bg-lightblue border-0 pr-2 pl-2 h-100">
                          <CardTitle className="mt-2 mb-0">

                            <DetailNavigation
                              overviewName="Home"
                              showFilter={showFilter}
                              overviewPath="/"
                              listName="Employees"
                              detailName={employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) ? employeeDetails.data[0].name : ''}
                              afterList={() => { setViewId(0); setOffset(0); setPage(1); }}
                            />
                            <span className="float-right">
                              {allowedOperations.includes(actionCodes['Edit Employee']) && (
                                <Button
                                  disabled={(employeeNeighbours && employeeNeighbours.loading) || (employeesInfo && employeesInfo.loading) || (employeeDetails && employeeDetails.loading)}
                                   variant="contained"
                                  size="sm"
                                  onClick={() => { setEdit(!isEdit); }}
                                  className="pb-1 pt-1 rounded-pill mb-1 mr-2 greyButton"
                                >
                                  <FontAwesomeIcon className="mr-2" size="sm" icon={faPencilAlt} />
                                  <span className="mr-2">Edit</span>
                                </Button>
                              )}
                              {allowedOperations.includes(actionCodes['Deactivate Employee']) && (
                                <Button  variant="contained" size="sm" onClick={() => { setDeleteEmployee(true); }} className="pb-1 pt-1 bg-white text-dark rounded-pill mb-1 mr-2 greyButton">
                                  <span className="my-2">Delete</span>
                                </Button>
                              )}
                              <Button  variant="contained" size="sm" onClick={onClose} className="pb-1 pt-1 bg-white text-dark rounded-pill mb-1 mr-2 greyButton">
                                <FontAwesomeIcon className="mr-2" size="sm" icon={faTimesCircle} />
                                <span className="mr-2">Close</span>
                              </Button>
                            </span>
                          </CardTitle>
                          <hr className="mt-1 mb-1" />
                        </Card>
                      </Col>
                    </Row>
                    <Modal className="deleteEmployeeInfo" size="sm" isOpen={deleteEmployee}>
                      <ModalHeader tag="h4" toggle={() => { setDeleteEmployee(false); }}>Delete Employee</ModalHeader>
                      <ModalBody>
                        Are you sure, you want to delete the employee
                        {deleteEmployeeInfo && deleteEmployeeInfo.data && (<div className="text-success mt-3 text-center">Employee deleted successfully.</div>)}
                        {deleteEmployeeInfo && deleteEmployeeInfo.err && (<div className="text-danger mt-3 text-center">{generateErrorMessage(deleteEmployeeInfo)}</div>)}
                      </ModalBody>
                      <ModalFooter>
                        {(deleteEmployeeInfo && !deleteEmployeeInfo.data) && (deleteEmployeeInfo && !deleteEmployeeInfo.err) && (
                          <>
                            <Button className="btn-cancel" size="sm" onClick={() => { setDeleteEmployee(false); }}>Cancel</Button>
                            <Button  variant="contained" size="sm" onClick={() => { handleEmployeeDelete(); }}>Confirm</Button>
                          </>
                        )}
                        {deleteEmployeeInfo && (deleteEmployeeInfo.err || deleteEmployeeInfo.data) && (
                          <Button size="sm"  variant="contained" onClick={deleteToggle}>Ok</Button>
                        )}
                      </ModalFooter>
                    </Modal>
                    <EmployeeDetail isEdit={isEdit} showFilter={showFilter} afterUpdate={() => { setEdit(false); }} />
                  </div>
                ) : (
                  <Card className="p-2 mb-2 h-100 bg-lightblue">
                    <CardBody className="bg-color-white main-table-body p-1 m-0">
                      <Row className="p-2">
                        <Col sm="12">
                          <div className="content-inline">
                            <span className="p-0 mr-2 font-weight-800 font-medium">
                              Employees List :
                              {' '}
                              {totalEmpCount}
                            </span>
                            {(checkItems) && checkItems.map((st) => (
                              <p key={st.id} className="mr-2 content-inline">
                                <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                  {st.label}
                                  <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                                </Badge>
                              </p>
                            ))}
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
                                  <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                                </Badge>
                              </p>
                            ))}
                          </div>
                          <span className="float-right">
                            <TooltipComponent
                              position="BottomCenter"
                              animation={TooltipAnimation}
                              content="Search"
                              target="#Filters"
                              isOpen={openValues.some((selectedValue) => selectedValue === 6)}
                              data-testid="toolTipSearch"
                            >
                              <button
                                className=" btn-remove btn-search mr-1"
                                id="Filters"
                                type="button"
                                cssClass="tooltipElement"
                                onClick={() => { showFilter(!isFilter); showExportEmployee(false); }}
                                data-testid="search"
                              >
                                <FontAwesomeIcon
                                  className="cursor-pointer"
                                  // onMouseOver={() => toggle(6)}
                                  // onMouseLeave={() => setOpenValues([])}
                                  icon={faSearch}
                                />
                              </button>
                            </TooltipComponent>
                          </span>
                          <Popover className="custom-style" placement="bottom" isOpen={isFilter} target="Filters">
                            <PopoverHeader>
                              Search
                              <FontAwesomeIcon
                                size="lg"
                                onClick={() => showFilter(false)}
                                className="cursor-pointer float-right"
                                icon={faTimesCircle}
                                data-testid="close"
                              />
                            </PopoverHeader>
                            <PopoverBody><Filters setOffset={setOffset} setPage={setPage} afterReset={() => showFilter(false)} /></PopoverBody>
                          </Popover>
                          <span className="float-right">
                            <TooltipComponent
                              position="BottomCenter"
                              animation={TooltipAnimation}
                              target="#ExportEmployees"
                              content="Export Employee Details"
                              isOpen={openValues.some((selectedValue) => selectedValue === 3)}
                            >
                              <button
                                className="btn-remove mr-1 font-small"
                                id="ExportEmployees"
                                size="sm"
                                onClick={() => { showFilter(false); showExportEmployee(true); }}
                                // onMouseOver={() => toggle(3)}
                                // onMouseLeave={() => setOpenValues([])}
                                onFocus={() => toggle(3)}
                                disabled={!employeesInfo.data}
                                type="button"
                              >
                                <FontAwesomeIcon
                                  disabled={checkedRows && checkedRows.length < 1}
                                  className={checkedRows && checkedRows.length < 1 ? '' : 'cursor-pointer'}
                                  icon={faFileExport}
                                />
                              </button>
                            </TooltipComponent>
                          </span>
                          <Popover className="custom-style" placement="bottom" isOpen={isExportEmployee} target="ExportEmployees">
                            <PopoverHeader>
                              Export
                              <FontAwesomeIcon
                                size="1x"
                                onClick={() => showExportEmployee(false)}
                                className="cursor-pointer float-right"
                                icon={faTimesCircle}
                                data-testid="close"
                              />
                            </PopoverHeader>
                            <PopoverBody id="space">
                              <DataExport
                                afterReset={() => { showExportEmployee(false); setPage(1); setOffset(0); }}
                              />
                            </PopoverBody>
                          </Popover>
                        </Col>
                      </Row>
                      {(employeesInfo && employeesInfo.data) && (
                        <span data-testid="success-case" />
                      )}
                      <NewTableComponent
                        isUserError={isUserError}
                        loading={loading}
                        errorMsg={errorMsg}
                        setViewId={setViewId}
                        employeesInfo={employeesInfo}
                        showFilter={showFilter}
                      />
                    </CardBody>
                  </Card>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Employees;
