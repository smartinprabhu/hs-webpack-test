/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useMemo, useEffect } from 'react';
import moment from 'moment-timezone';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@mui/material/Alert';

import ErrorContent from '@shared/errorContent';
import ErrorContentStatic from '@shared/errorContentStatic';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue, getCompanyTimezoneDate,
  getColumnArrayById, exportExcelTableToXlsx,
} from '../../../util/appUtils';
import {
  getReportId, getTypeId, resetPPMVendor,
} from '../../ppmService';
import { setInitialValues } from '../../../purchase/purchaseService';
import './sidebar/stickyTable.css';
import ChecklistVendorExport from './checklistVendorExport';
import actionCodes from '../data/actionCodes.json';

const ReportsVendorPPM = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue, setExportType,
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
    ppmVendorInfo,
  } = useSelector((state) => state.ppm);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetPPMVendor());
    if (afterReset) afterReset();
  };

  const exportTableToExcel = (tableID, fileTitle = '') => {
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
  };

  useEffect(() => {
    if (exportType === 'excel') {
      exportExcelTableToXlsx('export-vendor-report', 'Scheduler Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    }
  }, [exportType, exportTrue]);

  const loading = (userInfo && userInfo.loading) || (ppmVendorInfo && ppmVendorInfo.loading);

  let errorText = <div />;
  if ((!loading)
    && ((ppmVendorInfo && ppmVendorInfo.err) || (ppmVendorInfo && ppmVendorInfo.data && !ppmVendorInfo.data.length))) {
    errorText = '';
  } else if ((!loading) && typeId && typeId !== null && ((typeId && !typeId.date) || typeId.date === null)) {
    errorText = (
      <ErrorContentStatic errorTxt="PLEASE SELECT START WEEK AND END WEEK" />
    );
  }
  let start = '';
  let end = '';

  if (typeId && typeId !== null && typeId.date && typeId.date.length) {
    start = moment(typeId.date[0]).startOf('isoWeek').format('YYYY-MM-DD');
    end = moment(typeId.date[1]).endOf('isoWeek').format('YYYY-MM-DD');
  }
  const selectedReportDate = `${getCompanyTimezoneDate(start, userInfo, 'date')} - ${getCompanyTimezoneDate(end, userInfo, 'date')}`;

  const isData = ppmVendorInfo && ppmVendorInfo.data && ppmVendorInfo.data.length && ppmVendorInfo.data.length > 0 ? ppmVendorInfo.data : false;
  const dataList = useMemo(() => (isData && isData.length > 10 ? isData.slice(0, 10) : isData), [ppmVendorInfo]);
  const isError = ppmVendorInfo && ppmVendorInfo.data ? !ppmVendorInfo.data.status : false;

  return (
    <Card className={collapse ? 'filter-margin-right p-1 bg-lightblue h-100' : 'p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <div className="content-inline">
              <span className="p-0 mr-2 font-medium">
                <span onClick={() => redirectToAllReports()} aria-hidden="true" className="cursor-pointer font-weight-800">
                  All Reports
                  {' '}
                  /
                  {' '}
                </span>
                <span className="font-weight-500">
                  {reportName}
                  {' '}
                </span>
                {selectedReportDate && (
                  <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {selectedReportDate}
                  </span>
                )}
              </span>
            </div>
          </Col>
        </Row>
        <Row className="p-2">
          <Col md="12" xs="12" sm="12" lg="12">
            {(typeId && typeId.vendorValue && typeId.vendorValue.length > 0) && (
            <span className="font-tiny">
              Vendors:
              {' '}
              {getColumnArrayById(typeId.vendorValue, 'name').toString()}
            </span>
            )}
          </Col>
        </Row>
        <div className="p-0 mt-2">
          {!loading && isData && isData.length > 10 && (
          <Alert severity="info">You are viewing the preview of the report. Please download the report to view the complete ppm scheduler report.</Alert>
          )}
        </div>
        {!loading && dataList && (
          <>
            <div className="p-0 mt-0">
              <div className="mt-3 report-table-list position-relative thin-scrollbar">
                <div className="table-outer-wrapper">
                  <div className="scrolling-lock-table-wrapper thin-scrollbar">
                    <table className="tbl-search-results tbl-mobile-headers stickey-table" id="tbl_mobile_headers_0">
                      <thead className="bg-gray-light">
                        <tr>
                          <th className="p-2 min-width-160">Asset</th>
                          <th className="p-2 min-width-160">Asset ID</th>
                          <th className="p-2 min-width-160">Schedule</th>
                          <th className="p-2 min-width-100">Week No</th>
                          <th className="p-2 min-width-100">Status</th>
                          <th className="p-2 min-width-160">Checklist Name</th>
                          <th className="p-2 min-width-160">Maintenance Team</th>
                          <th className="p-2 min-width-160">Site Name</th>
                          <th className="p-2 min-width-160">Vendor Name</th>
                          <th className="p-2 min-width-160">Starts On</th>
                          <th className="p-2 min-width-160">Ends On</th>
                          <th className="p-2 min-width-160">Actual Completion On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataList.map((ql, index) => (
                          <tr key={ql}>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(ql.asset_name)}</span></td>
                            <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(ql.asset_code)}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(ql.schedule)}</span></td>
                            <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(ql.week)}</span></td>
                            <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(ql.state)}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(ql.checklist)}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(ql.maintenance_team_id)}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(ql.site)}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(ql.vendor)}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ql.starts_on, userInfo, 'date'))}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ql.ends_on, userInfo, 'date'))}</span></td>
                            <td className="p-2 min-width-160"><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ql.actual_completion_on, userInfo, 'date'))}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <hr className="m-0 border-color-grey" />
          </>
        )}
        <Col md="12" sm="12" lg="12" className="d-none">
          <ChecklistVendorExport typeId={typeId} ppmVendorInfo={ppmVendorInfo} />
        </Col>
        {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
        )}
        {(ppmVendorInfo && ppmVendorInfo.err) && (
        <ErrorContent errorTxt={generateErrorMessage(ppmVendorInfo)} />
        )}
        {(ppmVendorInfo && ppmVendorInfo.data && !isData) && (
        <ErrorContentStatic errorTxt="No Data Found" />
        )}
        {errorText}
      </CardBody>
    </Card>
  );
});

ReportsVendorPPM.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
ReportsVendorPPM.defaultProps = {
  collapse: false,
};

export default ReportsVendorPPM;
