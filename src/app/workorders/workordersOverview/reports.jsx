import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faDownload,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

import './workordersOverview.scss';
import reports from './data/reports.json';

const Reports = () => (
  <Card className="p-2  mt-2 rounded-0 border-0">
    <CardTitle>
      <h5>
        <FontAwesomeIcon className="mr-2" color="deepskyblue" size="lg" icon={faChartLine} />
        REPORTS
      </h5>
    </CardTitle>
    <CardBody className="p-2 ml-4 rounded border">
      {reports && reports.map((report, index) => (
        <Row className="ml-2 mr-2" key={report.id}>
          <Col
            sm="12"
            xs="12"
            md="12"
            lg="12"
            className={classnames({
              border: (index !== parseFloat((reports.length) - 1)),
              'border-left-0': true,
              'border-right-0': true,
              'border-top-0': true,
              'p-1': true,
            })}
            key={report.id}
          >
            <div>
              <FontAwesomeIcon className="float-left mr-2" icon={faFileExcel} />
              <span className="font-weight-400">{report.name}</span>
              <span className="float-right">
                <FontAwesomeIcon className="float-left mr-2" icon={faDownload} />
              </span>
            </div>
          </Col>
        </Row>
      ))}
    </CardBody>
  </Card>
);
export default Reports;
