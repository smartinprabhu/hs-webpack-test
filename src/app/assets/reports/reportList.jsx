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

import SideFilterAudit from './reportList/sidebar/sideFilterAudit';
import SideFilterAgeReport from './reportList/sidebar/sideFilterAgeReport';
import SideFilterAvailability from './reportList/sidebar/sideFilterAvailability';
import SideFilterMisplaced from './reportList/sidebar/sideFilterMisplaced';

import {
  getAllCompanies, getCompanyTimezoneDate, getMenuItems,
} from '../../util/appUtils';
import {
  resetAssetMisplaced, resetAssetAvailability,
} from '../equipmentService';
import ReportsAudit from './reportList/reportAudit';
import ReportWarrentyAge from './reportList/reportWarrentyAge';
import ReportAvailability from './reportList/reportAvailability';
import ReportMisplaced from './reportList/reportMisplaced';
import ReportsSelect from './reportList/reportSelect';
import reports from './reports.json';
import SideFilterShiftHandover from '../../incidentManagement/reports/reportList/sidebar/sideFilterShiftReport';
import ReportShiftHandover from '../../incidentManagement/reports/reportList/reportShiftHandover';

const appModels = require('../../util/appModels').default;

const reportList = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedReport, setSelectedReport] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { locationId } = useSelector((state) => state.ppm);
  const companies = getAllCompanies(userInfo, userRoles);
  const [filtersIcon, setFilterIcon] = useState(false);

  const reportData = reports.reportList;

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'name');

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getLocationsInfo(companies, appModels.TEMPLATEREPORT));
    }
  }, [userInfo]);

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  useEffect(() => {
    dispatch(resetAssetMisplaced());
    dispatch(resetAssetAvailability());
  }, []);

  useEffect(() => {
    if (currentLocation && currentLocation !== 1) {
      const companyTimezoneDate = getCompanyTimezoneDate(new Date(), userInfo, 'monthyear');
      dispatch(getSelectedReportDate(companyTimezoneDate));
    }
  }, [currentLocation]);

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
          <CardBody className="pt-1 side-filters-list pl-2">
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
            {selectedReport === 'Audit Report' && (
              <SideFilterAudit />
            )}
            {selectedReport === 'Warranty Age Report' && (
              <SideFilterAgeReport />
            )}
            {selectedReport === 'Asset Audit - Availability Report' && (
              <SideFilterAvailability />
            )}
            {selectedReport === 'Asset Audit - Misplaced Assets' && (
              <SideFilterMisplaced />
            )}
            {selectedReport === 'Shift Handover Report' && (
              <SideFilterShiftHandover />
            )}
            <div />
          </CardBody>
        </Card>
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'list filter-margin-left-align pt-2 pr-2 pl-1' : 'list pl-1 pt-2 pr-2'}>
        {selectedReport === '' && (
          <ReportsSelect collapse={collapse} />
        )}
        {(selectedReport === 'Audit Report') && (
          <ReportsAudit collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
        {(selectedReport === 'Warranty Age Report') && (
          <ReportWarrentyAge collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
        {(selectedReport === 'Asset Audit - Availability Report') && (
          <ReportAvailability collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
        {(selectedReport === 'Asset Audit - Misplaced Assets') && (
          <ReportMisplaced collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
        {(selectedReport === 'Shift Handover Report') && (
          <ReportShiftHandover collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
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
