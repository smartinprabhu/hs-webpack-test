/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardBody, CardTitle, Col, Label, Input, Row, Popover, PopoverHeader, PopoverBody, Table, Tooltip,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import filterMiniIcon from '@images/icons/searchBlack.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import DetailNavigation from '@shared/navigation';
import {
  getPagesCount, getColumnArrayById, getTotalCount, generateErrorMessage, getListOfOperations,
} from '../../util/appUtils';
import Filters from './filters/filters';
import Navbar from './navbar/navbar';
import SideFilters from './sidebar/sideFilters';
import EmployeeDetail from './employeeDetails/employeeDetail';
import { getRegStatusLabel } from './utils/utils';
import { getEmployeeDetail, getEmployeeFilters } from './employeeService';
import actionCodes from './data/employeeActionCodes.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Employees = () => {
  const limit = 10;
  const subMenu = 1;
  const dispatch = useDispatch();
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
  const [isFilter, showFilter] = useState(false);

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const classes = useStyles();

  const { userInfo } = useSelector((state) => state.user);
  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const {
    employeesCount, employeesInfo, employeeCountLoading, employeeDetails,
    employeeFilters,
  } = useSelector((state) => state.setup);

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
      dispatch(getEmployeeDetail(viewId, appModels.EMPLOYEE));
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

  const pages = getPagesCount(employeesCount, limit);

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

  const handleCustomFilterClose = (value) => {
    setOffset(0); setPage(1);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = employeeFilters && employeeFilters.statuses ? employeeFilters.statuses : [];
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getEmployeeFilters(states, customFiltersList));
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (employeesInfo && employeesInfo.loading) || (employeeCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : userErrorMsg;

  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="pt-4">
          <Col md="3" sm="3" lg="3" xs="12">
            <SideFilters
              offset={offset}
              id={viewId}
              statusValue={statusValue}
              afterReset={() => { setPage(1); setOffset(0); }}
              sortBy={sortBy}
              sortField={sortField}
            />
          </Col>
          <Col md="9" sm="9" lg="9" xs="12">
            {viewId ? (
              <div className="card h-100">
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <Card className="bg-lightblue border-0 pr-2 pl-2 h-100">
                      <CardTitle className="mt-2 mb-0">

                        <DetailNavigation
                          overviewName="Home"
                          overviewPath="/"
                          listName="Employees"
                          detailName={employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) ? employeeDetails.data[0].name : ''}
                          afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                        />

                        <span className="float-right">
                          {allowedOperations.includes(actionCodes['Edit Employee']) && (
                            <Button  variant="contained" size="sm" onClick={() => { setEdit(!isEdit); }} className="pb-1 pt-1 bg-white text-dark rounded-pill mb-1 mr-2">
                              <FontAwesomeIcon className="mr-2" size="sm" icon={isEdit ? faTimesCircle : faPencilAlt} />
                              <span className="mr-2">{isEdit ? 'Cancel' : 'Edit'}</span>
                            </Button>
                          )}
                          <Button  variant="contained" size="sm" onClick={() => { setOffset(offset); setPage(page); setViewId(0); }} className="pb-1 pt-1 bg-white text-dark rounded-pill mb-1 mr-2">
                            <FontAwesomeIcon className="mr-2" size="sm" icon={faTimesCircle} />
                            <span className="mr-2">Close</span>
                          </Button>
                        </span>
                      </CardTitle>
                      <hr className="mt-1 mb-1" />
                    </Card>
                  </Col>
                </Row>
                <EmployeeDetail isEdit={isEdit} afterUpdate={() => { setEdit(false); }} />
              </div>
            ) : (
              <Card className="p-2 mb-2 h-100 bg-lightblue">
                <CardBody className="bg-color-white p-1 m-0">
                  <Row className="p-2">
                    <Col md="8" xs="12" sm="8" lg="8">
                      <div className="content-inline">
                        <span className="p-0 mr-2 font-weight-800 font-medium">
                          Employees List :
                          {getTotalCount(employeesCount)}
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
                                {cf.value}
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
                        <img
                          aria-hidden="true"
                          alt="Filters"
                          src={filterMiniIcon}
                          id="Filters"
                          className="cursor-pointer mr-2"
                          onClick={() => { showFilter(!isFilter); }}
                          onMouseOver={() => toggle(6)}
                          onMouseLeave={() => setOpenValues([])}
                          onFocus={() => toggle(6)}
                        />
                        <Tooltip
                          placement="top"
                          isOpen={openValues.some((selectedValue) => selectedValue === 6)}
                          target="Filters"
                        >
                          Search
                        </Tooltip>
                      </div>
                      <Popover placement="bottom" isOpen={isFilter} target="Filters">
                        <PopoverHeader>
                          Search
                          <img
                            aria-hidden="true"
                            alt="close"
                            src={closeCircleIcon}
                            onClick={() => showFilter(false)}
                            className="cursor-pointer float-right"
                          />
                        </PopoverHeader>
                        <PopoverBody><Filters afterReset={() => showFilter(false)} /></PopoverBody>
                      </Popover>
                    </Col>
                  </Row>

                  {(employeesInfo && employeesInfo.data) && (
                  <span data-testid="success-case" />
                  )}
                  <div className="thin-scrollbar">
                    {(employeesInfo && employeesInfo.data) && (

                    <Table responsive>
                      <thead className="bg-gray-light">
                        <tr>
                          <th className="w-5">
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
                          <th className="p-2 min-width-100">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Name
                            </span>
                          </th>
                          <th className="p-2 min-width-100">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('work_email'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Work Email
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('work_phone'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Work Phone
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('registration_status'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Status
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('department_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Department
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>

                        {employeesInfo.data.map((emp, index) => (

                          <tr key={emp.id}>
                            <td className="w-5">
                              <div className="checkbox">
                                <Input
                                  type="checkbox"
                                  value={emp.id}
                                  id={`checkboxtk${index}`}
                                  className="ml-0"
                                  name={emp.name}
                                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(emp.id))}
                                  onChange={handleTableCellChange}
                                />
                                <Label htmlFor={`checkboxtk${index}`} />
                              </div>
                            </td>
                            <td aria-hidden="true" className="cursor-pointer w-20" onClick={() => { setViewId(emp.id); showFilter(false); }}>
                              <span className="font-weight-600">{emp.name}</span>
                              <br />
                              <span className="font-weight-300 font-small">
                                {emp.employee_id_seq}
                              </span>
                            </td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{emp.work_email}</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{emp.work_phone}</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{getRegStatusLabel(emp.registration_status)}</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{emp.department_id ? emp.department_id[1] : ''}</span></td>
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

                    {((employeesInfo && employeesInfo.err) || isUserError) && (

                    <ErrorContent errorTxt={errorMsg} />

                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Col>
    </Row>

  );
};

export default Employees;
