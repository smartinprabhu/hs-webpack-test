/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useEffect } from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getCompanyTimezoneDate,
  getListOfModuleOperations, exportExcelTableToXlsx,
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../ppmService';
import ChecklistPrint from './checklistPrintEmployee';
import './sidebar/stickyTableEmployee.css';
import actionCodes from '../data/actionCodes.json';

const reportChecklistEmployee = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue, setExportType,
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
    inspectionEmployees,
  } = useSelector((state) => state.ppm);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Inspection Employee Report Export']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetCreateChecklistReport());
    dispatch(resetPurchaseState());
    dispatch(resetDetailChecklistReport());
    dispatch(resetChecklistReport());
    dispatch(resetPrint());
    if (afterReset) afterReset();
  };

  const handleAnswerPrint = (htmlId, fileName) => {
    const div = document.getElementById(htmlId);
    // Create a window object.
    const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    document.title = fileName;
    win.document.write(div.outerHTML); // Write contents in the new window.
    win.document.close();
    dispatch(setInitialValues(false, false, false, false));
  };

  const exportTableToExcel = (tableID, fileTitle = '') => {
    try {
      exportExcelTableToXlsx(tableID, fileTitle);
      /* const dataType = 'application/vnd.ms-excel';
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
      } */
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    dispatch(setInitialValues(false, false, false, false));
  };

  const loading = (userInfo && userInfo.loading) || (inspectionEmployees && inspectionEmployees.loading);

  let errorText = <div />;
  if (!loading
    && ((inspectionEmployees && inspectionEmployees.err) || (inspectionEmployees && inspectionEmployees.data && !inspectionEmployees.data.length))) {
    errorText = '';
  } else if (!loading && typeId && (!typeId.date || typeId.date && typeId.date.length && typeId.date[0] === null && typeId.date[1] === null)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />
    );
  }
  const selectedReportDate = typeId && typeId.date && typeId.date.length && typeId.date[0] !== null && typeId.date[1] !== null
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = inspectionEmployees && inspectionEmployees.data && inspectionEmployees.data.length ? inspectionEmployees.data : false;
  const isError = inspectionEmployees && inspectionEmployees.data ? !inspectionEmployees.data.status : false;

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-employee-report', 'Inspection Employee Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    } else if (exportType === 'excel') {
      exportTableToExcel('export-employee-report', 'Inspection Employee Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    }
  }, [exportType, exportTrue]);

  return (
    <Card className="border-0 p-1 bg-lightblue h-100">
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          {selectedReportDate && (
          <span className="ml-3 pl-1 font-weight-800 font-size-13">
            Report Date :
            {' '}
            {selectedReportDate}
          </span>
          )}
        </Row>
        {(!loading && isData && isData && Object.keys(isData).length > 0) && (
        <div className="p-3 mt-2">
          <div className="mt-3 report-table-list position-relative thin-scrollbar">
            <div className="table-outer-wrapper">
              <div className="scrolling-lock-table-wrapper thin-scrollbar">
                <table className="tbl-search-results tbl-mobile-headers stickey-table" id="tbl_mobile_headers_0">
                  <thead className="bg-gray-light">
                    <tr>
                          {isData && isData.heading && isData.heading.length > 0 && isData.heading.map((hd, index) => (
                            <th className="stickyemp-th stickyemp-head" key={index}>
                                <span>{hd}</span>
                              </th>
                          ))}
                        </tr>
                  </thead>
                  <tbody>
                    {isData && isData.data && isData.data.length > 0 && isData.data.map((q1) => (
                          <tr key={q1}>
                            {q1 && q1.length > 0 && q1.map((ct) => (
                                <td className="stickyemp-td"><span className="font-weight-400">{ct}</span></td>
                              ))}
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}
        <Col md="12" sm="12" lg="12" className="d-none">
          <ChecklistPrint typeId={typeId} inspectionEmployees={inspectionEmployees} />
        </Col>
        {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
        )}
        {(inspectionEmployees && inspectionEmployees.err) && (
        <ErrorContent errorTxt={generateErrorMessage(inspectionEmployees)} />
        )}
        {(isError) && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        {errorText}
      </CardBody>
    </Card>
  );
});

reportChecklistEmployee.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
reportChecklistEmployee.defaultProps = {
  collapse: false,
};

export default reportChecklistEmployee;
