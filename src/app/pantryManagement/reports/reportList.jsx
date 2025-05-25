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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import filterIcon from '@images/filter.png';
import collapseIcon from '@images/collapse.png';
import reportsIcon from '@images/icons/reports.svg';
import InventorySideFilters from './sidebar/inventorySideFilters';
import InventoryReport from './inventoryReport';
import EmployeeReport from './employeeReport';
import reports from './reportList.json';

const reportList = () => {
  const [collapse, setCollapse] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [filtersIcon, setFilterIcon] = useState(false);

  const reportData = reports.tabsList;

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
        <Card className={collapse ? 'd-none all-reports' : 'p-1 bg-lightblue h-100 all-reports'} onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
          <CardTitle className="mt-2 ml-2 mb-1 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h5>
                  {selectedReport && selectedReport !== '' ? <>{selectedReport}</> : <>All Reports</>}
                </h5>
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
                  <div className="mb-2 mt-1" key={rp.id}>
                    <Row className="m-0">
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <div
                          onClick={() => {
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
                ))}
              </div>
            )}
            {selectedReport === 'Inventory Report' && (
              <InventorySideFilters isEmployee={false} />
            )}
            {selectedReport === 'Employee Pantry Orders' && (
              <InventorySideFilters isEmployee />
            )}
            <div />
          </CardBody>
        </Card>
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left inventory-report ' : 'inventory-report '}>
        {selectedReport === 'Inventory Report' && (
          <InventoryReport collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
        {selectedReport === 'Employee Pantry Orders' && (
          <EmployeeReport collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={selectedReport} />
        )}
      </Col>
    </Row>
  );
};

export default reportList;
