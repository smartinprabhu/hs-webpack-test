/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import filterIcon from '@images/filter.png';
import collapseIcon from '@images/collapse.png';
import reportsIcon from '@images/icons/reports.svg';

import ErrorContent from '@shared/errorContent';

import {
  getAllowedCompanies, getMenuItems,
} from '../../util/appUtils';
import { resetCteateExport, resetExportLink } from '../attendanceService';
import reports from './reports.json';
import MonthlyAttendance from './sidebar/monthlyAttendance';
import ReportDownload from './reportDownload';
import EmployeeBioMetric from './sidebar/employeeBiometric';

const reportList = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [globalType, setGlobalType] = useState('');
  const [globalVendor, setGlobalVendor] = useState('');

  const [empDates, setEmpdates] = useState([]);
  const [employees, setEmployees] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);
  const [filtersIcon, setFilterIcon] = useState(false);

  const reportData = reports.reportList;

  const onChangeReport = (rs) => {
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
    setSelectedDate('');
    setGlobalVendor('');
    setGlobalType('');
    setCurrentLocation(rs.id);
    setSelectedReport(rs.name);
  };

  const moduleName = 'Attendance Logs';
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');

  return (
    <Row className="pt-0">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse && (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        )}
        <Card className={collapse ? 'd-none filter-margin-right all-reports' : 'all-reports p-1 bg-lightblue h-100'} onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
          <CardTitle className="mt-2 ml-2 mb-1 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h4>
                  {selectedReport && selectedReport !== '' ? selectedReport : <>All Reports</>}
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
            <hr className="m-0 ml-n2 mr-n2 border-color-grey" />
          </CardTitle>
          <CardBody className="pt-1 pl-2">
            {selectedReport && selectedReport !== '' ? '' : (
              <div className="height-100 font-size-13 thin-scrollbar">
                {reportData && reportData.map((rp) => (
                  menuList.includes(rp.name) && (
                    <div className="mb-2 mt-1" key={rp.id}>
                      <Row className="m-0">
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <div
                            onClick={() => onChangeReport(rp)}
                          >
                            <img src={reportsIcon} className="mr-1" height="15" width="15" alt="reports" />
                            <p
                              aria-hidden="true"
                              className="ml-1 d-inline-block mb-0 mt-0 font-weight-800 collapse-heading cursor-pointer"
                            >
                              {rp.name}
                            </p>
                            {rp.id === '1'
                              ? (
                                <FontAwesomeIcon
                                  className="mr-2 mt-1 cursor-pointer float-right"
                                  size="sm"
                                  icon={faChevronRight}
                                />
                              ) : ''}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )))}
              </div>
            )}
            {(selectedReport === 'Monthly Attendance Details' || selectedReport === 'Form XXVI' || selectedReport === 'Daily Attendance Details') && (
            <MonthlyAttendance
              selectedReport={selectedReport}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setGlobalVendor={setGlobalVendor}
              globalVendor={globalVendor}
              setGlobalType={setGlobalType}
              globalType={globalType}
            />
            )}
            {(selectedReport === 'Employee wise biometric report') && (
            <EmployeeBioMetric
              setEmpdates={setEmpdates}
              setEmployees={setEmployees}
              empDates={empDates}
              employees={employees}
            />
            )}
            <div />
          </CardBody>
        </Card>
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'list filter-margin-left-align pt-2 pr-2 pl-1' : 'list pl-1 pt-2 pr-2'}>
        {selectedReport && (
        <ReportDownload
          collapse={collapse}
          afterReset={() => { setSelectedReport(''); }}
          reportName={selectedReport}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          globalVendor={globalVendor}
          setGlobalVendor={setGlobalVendor}
          globalType={globalType}
          setGlobalType={setGlobalType}
          setEmpdates={setEmpdates}
          setEmployees={setEmployees}
          empDates={empDates}
          employees={employees}
        />
        )}
        {!selectedReport && (
          <ErrorContent errorTxt="Select any report" />
        )}
      </Col>
    </Row>
  );
};

reportList.propTypes = {
  collapse: PropTypes.bool,
  isInspection: PropTypes.bool,
};
reportList.defaultProps = {
  collapse: false,
  isInspection: false,
};

export default reportList;
