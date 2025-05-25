/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import reportsIcon from '@images/icons/reports.svg';
import {
  getReportId,
} from '../../../preventiveMaintenance/ppmService';
import reportList from '../../../preventiveMaintenance/data/reports.json';

const SideFilters = () => {
  const reports = reportList && reportList.data ? reportList.data : [];
  const dispatch = useDispatch();
  const [currentId, setCurrentId] = useState('1');

  useEffect(() => {
    const data = reports.filter((item) => item.id === currentId);
    dispatch(getReportId(data));
  }, [currentId]);

  return (
    <Card className="p-1 bg-lightblue h-100 side-filters-list">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h5>
          All Reports
        </h5>
        <hr className="m-0 border-color-grey" />
      </CardTitle>
      <CardBody className="pt-1">
        <div className="height-100 font-size-13 thin-scrollbar">
          {reports && reports.map((report) => (
            <div key={report.id} className="mb-2 mt-1">
              <Row>
                <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                  <div aria-hidden="true" onClick={() => setCurrentId(report.id)} className={currentId === report.id ? 'border border-colorthin-grey bg-white p-1 rounded' : 'p-1'}>
                    <img src={reportsIcon} className="mr-1" height="15" width="15" alt="reports" />
                    <p
                      aria-hidden="true"
                      className="ml-1 d-inline-block mb-0 mt-0 font-weight-800 collapse-heading cursor-pointer"
                    >
                      {report.name}
                    </p>
                    {currentId === report.id
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
      </CardBody>
    </Card>
  );
};

export default SideFilters;
