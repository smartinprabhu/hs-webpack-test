/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
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
  getMaintenanceConfigurationData,
  resetHelpdeskReport,
  getReportFilters,
} from '../../ticketService';
import {
  getAllowedCompanies,
} from '../../../util/appUtils';
import ReportsSelect from './reportSelect';
import reports from './reportsList.json';
import FilterSetup from './filterSetup';
import DataView from './dataView';

const appModels = require('../../../util/appModels').default;

const reportList = (props) => {
  const limit = 20;
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedReport, setSelectedReport] = useState('');
  const [currentPage, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [selectedApiReport, setSelectedApiReport] = useState('');
  const [showObservations, setShowObservations] = useState(false);
  const [selectedDate, setSelectedDate] = useState('%(current_week)s');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { locations, locationId, typeId } = useSelector((state) => state.ppm);
  const companies = getAllowedCompanies(userInfo);
  const [filtersIcon, setFilterIcon] = useState(false);

  const {
    maintenanceConfigList,
  } = useSelector((state) => state.ticket);

  const reportData = reports.tabsList;

  const moduleName = 'Inventory';
  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');
  const menuList = ['Tickets Detail Report'];

  //   useEffect(() => {
  //     if (userInfo && userInfo.data && userInfo.data.company) {
  //       dispatch(getLocationsInfo(companies, appModels.TEMPLATEREPORT));
  //     }
  //   }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
      dispatch(resetHelpdeskReport());
      dispatch(getReportFilters([]));
    }
  }, [userInfo]);

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  useEffect(() => {
    if (typeId && typeId.type) {
      setSelectedReport('Tickets Detail Report');
    }
  }, [typeId]);

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
          <CardBody className="pt-1 pl-2 side-filters-list">
            {selectedReport && selectedReport !== '' ? '' : (
              <div className="height-100 side-filters-list">
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
            {selectedReport === 'Tickets Detail Report' && (
            <FilterSetup />
            )}
            <div />
          </CardBody>
        </Card>
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'list filter-margin-left-align pt-2 pr-2 pl-1' : 'list pl-1 pt-2 pr-2'}>
        {selectedReport === '' && (
        <ReportsSelect collapse={collapse} />
        )}
        {selectedReport === 'Tickets Detail Report' && (
        <DataView collapse={collapse} afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }} reportName={selectedReport} />
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
