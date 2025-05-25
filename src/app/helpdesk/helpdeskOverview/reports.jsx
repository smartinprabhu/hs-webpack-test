/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';

import './helpdeskOverview.scss';
import Loader from '@shared/loading';
import reports from './data/reports.json';
import {
  getStateGroups, getPriorityGroups,
} from '../ticketService';
import {
  getLocalTime,
  exportExcelTableToXlsx,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const tabletd = {

  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};
const tabletdhead = {

  border: '1px solid white',
  borderBottom: '1px solid #4ebbfb',
  fontSize: '17px',
  backgroundColor: '#4ebbfb',
  color: 'white',
  borderCollapse: 'collapse',
  textAlign: 'left',
  textTransform: 'uppercase',
  padding: '2px',
};

const Reports = () => {
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const {
    categoryGroupsInfo, stateGroupsInfo, priorityGroupsInfo,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getStateGroups(userInfo.data.company.id, appModels.HELPDESK));
      dispatch(getPriorityGroups(userInfo.data.company.id, appModels.HELPDESK));
    }
  }, [userInfo]);

  function exportTableToExcel(tableID, fileTitle = '') {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handleExcelExport = (type) => {
    setReportType(type);

    setTimeout(
      () => {
        const currentDate = getLocalTime(new Date());
        const title = `Tickets_${type}_Reports_On_${currentDate}`;
        exportExcelTableToXlsx('data_report', title);
      },
      1000,
    );
  };

  const loading = (categoryGroupsInfo && categoryGroupsInfo.loading) || (stateGroupsInfo && stateGroupsInfo.loading) || (priorityGroupsInfo && priorityGroupsInfo.loading);

  return (
    <Card className="p-2 mt-2 rounded-0 border-0">
      <CardTitle>
        <h5>
          <FontAwesomeIcon className="mr-2" color="deepskyblue" size="lg" icon={faChartLine} />
          REPORTS
        </h5>
      </CardTitle>
      <CardBody className="p-1 ml-4 rounded border">
        {loading ? (
          <Loader />
        )
          : (
            reports && reports.map((report, index) => (
              <Row className="ml-2 mr-2" key={report.id}>
                <Col
                  sm="12"
                  data-add={index.length}
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
                      <FontAwesomeIcon className="float-left mr-2 cursor-pointer" icon={faDownload} onClick={() => handleExcelExport(report.type)} />
                    </span>
                  </div>
                </Col>
              </Row>
            ))
          )}
        <div className="hidden-div" id="data_report">
          <table id="" align="center">
            <tbody>
              <tr>
                <td>Company</td>
                <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td colSpan="2" align="center">
                  <b>
                    {reportType}
                    {' '}
                    Wise Report
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" width="100%" align="left">
            <thead>
              <tr>
                <th style={tabletdhead}>{reportType}</th>
                <th style={tabletdhead}>Count</th>
              </tr>
            </thead>
            <tbody>
              {reportType === 'Status' && (
                (stateGroupsInfo && stateGroupsInfo.data) && stateGroupsInfo.data.map((st) => (

                  <tr key={st.state_id[0]}>
                    <td style={tabletd}>{st.state_id[1]}</td>
                    <td style={tabletd}>{st.state_id_count}</td>
                  </tr>
                ))
              )}
              {reportType === 'Category' && (
                (categoryGroupsInfo && categoryGroupsInfo.data) && categoryGroupsInfo.data.map((category) => (

                  <tr key={category.category_id[0]}>
                    <td style={tabletd}>{category.category_id[1]}</td>
                    <td style={tabletd}>{category.category_id}</td>
                  </tr>
                ))
              )}
              {reportType === 'Priority' && (
                (priorityGroupsInfo && priorityGroupsInfo.data) && priorityGroupsInfo.data.map((pr) => (

                  <tr key={pr.priority_id[0]}>
                    <td style={tabletd}>{pr.priority_id[1]}</td>
                    <td style={tabletd}>{pr.priority_id_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <iframe name="print_frame" className="d-block" title="data_report" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      </CardBody>
    </Card>
  );
};

export default Reports;
