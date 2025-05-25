/* eslint-disable consistent-return */
/* eslint-disable no-unreachable-loop */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useEffect } from 'react';
import {
  Alert, Button, Card, CardBody, Col, Row, Popover, PopoverHeader, PopoverBody, Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faFilePdf,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

import ErrorContent from '@shared/errorContent';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ExportList from '@shared/listViewFilters/export';
import {
  generateErrorMessage, 
  getListOfModuleOperations, getDefaultNoValue,
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../ppmService';
import ChecklistPrint from './checklistPrintSmartLogger';
import './sidebar/stickyTableEmployee.css';
import actionCodes from '../data/actionCodes.json';
import actionCodes2 from '../../../workorders/reports/data/actionCodes.json';

const reportChecklistNew = React.memo((props) => {
  const {
    afterReset, reportName, collapse, moduleName, exportType, exportTrue, setExportType
  } = props;
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
    ppmReports,
    selectedReportDate,
  } = useSelector((state) => state.ppm);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'code');

  const isInspecExportable = allowedOperations.includes(actionCodes['Smart Logger Report Export']);

  const isWoExportable = allowedOperations1.includes(actionCodes2['Smart Logger Report Export']);

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
    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
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
    dispatch(setInitialValues(false, false, false, false));
  };

  const loading = (userInfo && userInfo.loading) || (ppmReports && ppmReports.loading);

  let errorText = <div />;
  if ((!loading)
    && (ppmReports && ppmReports.err)) {
    if (generateErrorMessage(ppmReports) === 'start_date is required.') {
      errorText = <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />;
    } else {
      errorText = '';
    }
  } else if ((!loading)
    && ((ppmReports && ppmReports.err) || (ppmReports && ppmReports.data && !ppmReports.data.length))) {
    errorText = (
      <ErrorContent errorTxt="NO DATA FOUND" />
    );
  } else if ((!loading) && (typeId && typeId !== null) && (typeId && typeId.locationId && typeId.locationId.length <= 0)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT SPACE" />
    );
  } else if ((!loading) && (typeId && typeId !== null) && (typeId && typeId.categoryId && typeId.categoryId.length <= 0)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT CATEGORY" />
    );
  }

  const selectedReportDate1 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';

  const isData = ppmReports && ppmReports.data && ppmReports.data.length && ppmReports.data.length > 0 ? ppmReports.data[0] : false;

  const getIsProcessedData = () => {
    if (isData) {
      const isProcessedData = [];
      for (let i = 0; i < isData.datas.length; i++) {
        const temp = [];
        for (let j = 0; j < isData.datas[i].length; j++) {
          temp.push(isData.datas[i][j]);
        }
        for (let k = temp.length; k < isData.heading.length; k++) {
          temp.push('-');
        }
        isProcessedData.push(temp);
      }
      return isProcessedData && isProcessedData.length > 50 ? isProcessedData.splice(0, 10) : isProcessedData;
    }
    return [];
  };

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-smart-report', 'Smart Logger Report')
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false)
    } else if (exportType === 'excel') {
      exportTableToExcel('export-smart-report', 'Smart Logger Report')
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false)
    }
  }, [exportType, exportTrue]);

  return (
    <Card className={'border-0 p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          {selectedReportDate1 && (
            <span className={'ml-3 pl-1 font-weight-800 font-size-13'}>
              Report Date :
              {' '}
              {selectedReportDate1}
            </span>
          )}
        </Row>
        <Row>
          {(isWoExportable && moduleName === 'wo') && (typeId) && !loading && (isData) && (
            <>
              <div className="float-right">
                <ExportList response={(isWoExportable && moduleName === 'wo') && (typeId) && !loading && (isData)} />
              </div>
              <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                <PopoverHeader>
                  Export
                  <img
                    aria-hidden="true"
                    src={closeCircleIcon}
                    className="cursor-
                          pointer mr-1 mt-1 float-right"
                    onClick={() => dispatch(setInitialValues(false, false, false, false))}
                    alt="close"
                  />
                </PopoverHeader>
                <PopoverBody>
                  <Row>
                    <Col md="12" sm="12" lg="6">
                      <div className="p-3 text-center">
                        <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
                        <h5>PDF</h5>
                        <Button
                          type="button"
                          color="dark"
                          className="bg-zodiac"
                          disabled={loading && (ppmReports && !ppmReports.data)}
                          onClick={() => handleAnswerPrint('print-smart-report', 'Smart Logger Report')}
                        >
                          {(loading) ? (
                            <Spinner size="sm" color="light" className="mr-2" />
                          ) : (<span />)}
                          {' '}
                          Download
                        </Button>
                      </div>
                    </Col>
                    <Col md="12" sm="12" lg="6">
                      <div className="p-3 text-center">
                        <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
                        <h5>Excel</h5>
                        <Button
                          type="button"
                          color="dark"
                          className="bg-zodiac"
                          disabled={loading && (ppmReports && !ppmReports.data)}
                          onClick={() => exportTableToExcel('export-smart-report', 'Smart Logger Report')}
                        >
                          {(loading) ? (
                            <Spinner size="sm" color="light" className="mr-2" />
                          ) : (<span />)}
                          {' '}
                          Download
                        </Button>
                      </div>
                    </Col>
                    {ppmReports && ppmReports.err && (
                      <Col md="12" sm="12" lg="12" xs="12">
                        <SuccessAndErrorFormat response={ppmReports} />
                      </Col>
                    )}
                  </Row>
                </PopoverBody>
              </Popover>
            </>
          )}
        </Row>
        <div className="p-3 mt-2">
          {(!loading && isData && isData && Object.keys(isData).length > 0 && isData.datas && isData.datas.length > 50) && (
            <Alert color="warning" className="mt-2">
              <Tooltip title="Info">
                <span className="text-info cursor-pointer">
                  <FontAwesomeIcon className="mr-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
                </span>
              </Tooltip>
              You are viewing the preview of the report. Please download the report to view the complete smart logger report.
            </Alert>
          )}
        </div>
        {(!loading && isData && isData && Object.keys(isData).length > 0) && (
          <div className="p-3 mt-2">
            <div className="mt-3 report-table-list position-relative thin-scrollbar">
              <div className="table-outer-wrapper">
                <div className="scrolling-lock-table-wrapper thin-scrollbar">
                  <table className="tbl-search-results tbl-mobile-headers stickey-table  w-100" id="tbl_mobile_headers_0">
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
                      {isData && isData.datas && isData.datas.length > 0 && getIsProcessedData().map((q1) => (
                        <tr key={q1}>
                          {q1 && q1.length > 0 && q1.map((ct) => (
                            <td className="stickyemp-td"><span className="font-weight-400">{getDefaultNoValue(ct)}</span></td>
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
          <ChecklistPrint typeId={typeId} ppmReports={ppmReports} />
        </Col>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(ppmReports && ppmReports.err && errorText === '') && (
          <ErrorContent errorTxt={generateErrorMessage(ppmReports)} />
        )}
        {errorText}
      </CardBody>
    </Card >
  );
});

reportChecklistNew.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
  moduleName: PropTypes.string.isRequired,
};
reportChecklistNew.defaultProps = {
  collapse: false,
};

export default reportChecklistNew;
