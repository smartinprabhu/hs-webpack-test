/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
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
import {
  getLocationsInfo, getSelectedReportDate,
} from '../../preventiveMaintenance/ppmService';

import SideFilterAudit from './reportList/sidebar/sideFiltersAuditReport';
import SideFilterChecklist from './reportList/sidebar/sideFilterChecklist';
import SideFilterSmart from '../../preventiveMaintenance/reports/reportList/sidebar/sideFiltersSmartLogger';
import SideFilterEmployeePerformance from './reportList/sidebar/sideFilterEmployeePerformance';

import {
  getAllowedCompanies, getCompanyTimezoneDate, getMenuItems,
} from '../../util/appUtils';
import ReportsListExcelView from './reportList/reportListExcelView';
import ReportsListExcelViewSmart from '../../preventiveMaintenance/reports/reportList/reportListExcelView';
import ReportsSelect from './reportList/reportSelect';
import ReportsChecklistNew from './reportList/reportChecklist';
import ReportChecklistEmployee from './reportList/employeePerformanceReport';
import reports from './reports.json';

const appModels = require('../../util/appModels').default;

const reportList = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedApiReport, setSelectedApiReport] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { locationId } = useSelector((state) => state.ppm);
  const companies = getAllowedCompanies(userInfo);
  const [filtersIcon, setFilterIcon] = useState(false);

  const reportData = reports.reportList;

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'name');

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getLocationsInfo(companies, appModels.TEMPLATEREPORT));
    }
  }, [userInfo]);

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  useEffect(() => {
    if (currentLocation && currentLocation !== 1) {
      const companyTimezoneDate = getCompanyTimezoneDate(new Date(), userInfo, 'monthyear');
      dispatch(getSelectedReportDate(companyTimezoneDate));
    }
  }, [currentLocation]);

  return (
    <Row className="pt-2">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12">
        {collapse && (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        )}
        <Card className={collapse ? 'd-none side-filters-list' : 'side-filters-list p-1 bg-lightblue h-100'} onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
          <CardTitle className="mt-2 ml-2 mb-1 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h4>
                  {selectedReport && selectedReport !== '' ? <>{selectedReport}</> : <>All Reports</>}
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
              <div className="height-100 font-size-13 side-filters-list thin-scrollbar">
                {reportData && reportData.map((rp) => (
                  menuList.includes(rp.name) && (
                  <div className="mb-2 mt-1" key={rp.id}>
                    <Row className="m-0">
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <div
                          onClick={() => {
                            setCurrentLocation(rp.id);
                            setSelectedReport(rp.name);
                            setSelectedApiReport(rp.apiname);
                          }}
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
            {selectedReport === 'SLA Audit Report' && (
              <SideFilterAudit />
            )}
            {selectedReport === 'PPM Checklist Report' && (
              <SideFilterChecklist />
            )}
            {selectedReport === 'Smart Logger Report' && (
            <SideFilterSmart apiReportName={selectedApiReport} />
            )}
            {selectedReport === 'Employee Performance Report' && (
              <SideFilterEmployeePerformance />
            )}
            <div />
          </CardBody>
        </Card>
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left report-view' : 'report-view'}>
        {selectedReport === '' && (
          <ReportsSelect collapse={collapse} />
        )}
        {(selectedReport === 'SLA Audit Report') && (
          <ReportsListExcelView collapse={collapse} afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }} reportName={selectedReport} />
        )}
        {selectedReport === 'Smart Logger Report' && (
        <ReportsListExcelViewSmart moduleName="wo" collapse={collapse} afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }} reportName={selectedReport} />
        )}
        {selectedReport === 'PPM Checklist Report' && (
          <ReportsChecklistNew collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
        {selectedReport === 'Employee Performance Report' && (
          <ReportChecklistEmployee collapse={collapse} afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }} reportName={selectedReport} />
        )}
      </Col>
    </Row>
  );
};

reportList.propTypes = {
  collapse: PropTypes.bool,
};
reportList.defaultProps = {
  collapse: false,
};

export default reportList;
