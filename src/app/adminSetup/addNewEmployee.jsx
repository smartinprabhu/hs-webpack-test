/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable radix */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Input, Row, Col, Card, CardTitle, CardBody, Collapse,
} from 'reactstrap';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faUser,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '@shared/loading';
import Navbar from './navbar/navbar';

import {
  getEmployees, getEmployeesCount, getEmployeeDetails, getRegStatusForEmp,
} from '../dashboard/dashboardService';
import {
  getPagesCount, getColumnArrayById,
} from '../util/appUtils';
import { getEmployeeCount } from '../dashboard/actions';
import EmployeeDetails from './employeeDetails';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AddNewEmployee = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { employees, employeeCount, statusRes } = useSelector((state) => state.config);
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(false);
  const subMenu = 2;

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [currentId, setCurrentId] = useState();
  const classes = useStyles();

  const fetchEmployees = () => {
    dispatch(getEmployees(userInfo.data.company.id, appModels.EMPLOYEE, limit, offset, checkValues));
    dispatch(getEmployeeCount(userInfo.data.company.id, appModels.EMPLOYEE, checkValues));
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
    fetchEmployees();
  };

  const pages = getPagesCount(employeeCount, limit);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getEmployees(userInfo.data.company.id, appModels.EMPLOYEE, limit, offset));
      dispatch(getRegStatusForEmp(userInfo.data.company.id, appModels.EMPLOYEE));
      dispatch(getEmployeesCount(userInfo.data.company.id, appModels.EMPLOYEE));
      setEmployeeDetails(false);
    }
  }, [offset, userInfo]);

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = employees && employees.data ? employees.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
      fetchEmployees();
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
      fetchEmployees();
    }
    setOffset(0);
    setPage(1);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company.id) fetchEmployees();
  }, [checkItems]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== value));
    }
  };

  const showEmployeeDetails = (employeeId) => {
    dispatch(getEmployeeDetails(employeeId));
    setEmployeeDetails(true);
  };

  const resetFilters = () => {
    setCheckItems([]);
    setCheckValues([]);
  };

  const setViewId = (empId) => {
    setCurrentId(empId);
    dispatch(getEmployeeDetails(empId));
  };

  return (
    <Row className="mx-1 my-2 p-3 border">
      <Col sm="12" className="mt-4">
        <Row>
          <Col sm="3">
            <Card className="p-1 bg-lightblue">
              <CardTitle className="mt-2 ml-2 mb-1 mr-2">
                <h4>
                  Filters
                </h4>
              </CardTitle>
              <hr className="m-0 border-secondary-color-1px ml-2px" />
              <CardBody className="pt-0 mt-2 ml-2 h-100 position-relative scrollable-list thin-scrollbar">
                {!employeeDetails && (
                  <>
                    <Row>
                      <Col md="8" className="p-0">
                        <p className="m-0 font-weight-800 collapse-heading">BY STATUS</p>
                      </Col>
                      <Col md="4" className="text-right p-0">
                        <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
                      </Col>
                    </Row>
                    <Collapse isOpen={statusCollapse}>
                      <div className="p-2">
                        {statusRes && statusRes.data && statusRes.data.map((status) => (
                          <React.Fragment key={status.registration_status}>
                            {status && status.registration_status && (
                              <p className="text-capitalize mb-2 font-weight-500" key={status.registration_status}>
                                {' '}
                                <Input
                                  type="checkbox"
                                  value={status.registration_status}
                                  name={status.registration_status[1]}
                                  checked={checkValues.some((selectedValue) => selectedValue.includes(status.registration_status))}
                                  onChange={handleCheckboxChange}
                                />
                                {' '}
                                {status.registration_status}
                              </p>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </Collapse>
                    <hr className="mt-2" />
                    {checkValues && checkValues.length > 0 && (
                      <div
                        aria-hidden="true"
                        className="cursor-pointer mt-2 mb-2 text-info text-right"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </div>
                    )}
                  </>
                )}
                {employeeDetails && employees && employees.data && employees.data.length > 0 && employees.data.map((employee) => (
                  <Card
                    key={employee.id}
                    onClick={() => setViewId(employee.id)}
                    className={(employee.id === currentId) ? 'mb-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mb-2'}
                  >
                    <CardBody className="p-2">
                      <Row>
                        <Col md={6} className="nowrap-content">
                          <FontAwesomeIcon className="mr-1" size="sm" icon={faUser} />
                          <span className="font-weight-700 mb-1">{employee.name}</span>
                        </Col>
                        <Col md={6} className="text-right">
                          {employee.registration_status}
                          {/* {getSLALabelIcon(employee.sla_status)} */}
                        </Col>
                      </Row>
                      <span className="ml-3">
                        Work  Email:
                      </span>
                      <span className="font-weight-400 mb-1 ml-3">
                        {employee.work_email}
                      </span>
                      <p className="font-weight-600 mb-0 ml-3">
                        <span>
                          Work  Phone:
                        </span>
                        <span className="text-info">
                          {employee.work_phone}
                        </span>
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </CardBody>
            </Card>
          </Col>
          <Col sm="9">
            {!employeeDetails && (
              <Col sm="12" md="12" lg="12" className="p-2 h-100 table-scrollable thin-scrollbar bg-lightblue border">
                <Card className="mb-2 border-0">
                  <CardBody className="p-2">
                    <div className="p-2 font-weight-800 font-medium mr-2">Employee List</div>
                    <Table size="lg" className="w-100">
                      <thead className="bg-gray-light">
                        <tr>
                          <th>
                            <Input
                              type="checkbox"
                              value="all"
                              className="m-0 position-relative"
                              name="checkall"
                              checked={isAllChecked}
                              onChange={handleTableCellAllChange}
                            />
                          </th>
                          <th>Name</th>
                          <th>Work Phone</th>
                          <th>Work Email</th>
                          <th>Job Position</th>
                          <th>Department</th>
                          {/* <th>Manager</th> */}
                          <th>Status</th>
                          <th>Company</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees && employees.data && employees.data.map((emp) => (
                          <tr key={`${emp.id}`}>
                            <th scope="row">
                              <Input
                                type="checkbox"
                                value={emp.id}
                                className="ml-0"
                                name={emp.name}
                                checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(emp.id))}
                                onChange={handleTableCellChange}
                              />
                            </th>
                            <td className="cursor-pointer text-capitalize" onClick={() => showEmployeeDetails(emp.id)}>
                              {emp.name}
                            </td>
                            <td>{emp.work_phone}</td>
                            <td>{emp.work_email}</td>
                            <td>{(emp.job_id && emp.job_id[1]) || '---'}</td>
                            <td>{(emp.department_id && emp.department_id[1]) || '---'}</td>
                            <td>{emp.registration_status}</td>
                            <td>{emp.company_id && emp.company_id[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {employees && employees.loading && (
                      <Loader />
                    )}
                  </CardBody>
                </Card>
                {(employees && employees.loading) || pages === 0 ? (<span />) : (
                  <div className={`${classes.root} float-right`}>
                    <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                  </div>
                )}
              </Col>
            )}
            {employeeDetails && (
              <EmployeeDetails setEmployeeDetails={setEmployeeDetails} />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default AddNewEmployee;
