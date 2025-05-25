/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import { Tooltip } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DownloadRequestAlert from '../../../commonComponents/downloadRequestAlert';
import {
  generateErrorMessage, getDefaultNoValue, getCompanyTimezoneDate,
  getListOfModuleOperations, checkIsDate,
  getColumnArrayById,
  exportExcelTableToXlsx,
} from '../../../util/appUtils';
import {
  resetUpdateVisitor,
} from '../../../adminSetup/setupService';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport, clearInspectionOrdersdata, resetInspectionOrders,
} from '../../ppmService';
import ChecklistPrint from './checklistPrint';
import './sidebar/stickyTable.css';
import actionCodes from '../data/actionCodes.json';

const reportChecklistNew = React.memo((props) => {
  const {
    afterReset, reportName, collapse, showObservations, setShowObservations, tableHeaders, selectedDate, exportType, exportTrue, setExportType, setResetFilters, setExportTrue,

  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    typeId,
    inspectionOrders,
    selectedReportDate,
  } = useSelector((state) => state.ppm);
  const [actionModal, showActionModal] = useState(false);

  const [downloadType, setType] = useState('');

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Inspection Checklist Report Export']);

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

  useEffect(() => {
    dispatch(clearInspectionOrdersdata());
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const isDownloadRequest = !!(inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length && inspectionOrders.data.data[0].hashlib);

  useEffect(() => {
    if (isDownloadRequest) {
      showActionModal(true);
    }
  }, [inspectionOrders]);

  const handleAnswerPrint = (htmlId, fileName) => {
    // const div = document.getElementById(htmlId);
    // Create a window object.
    // const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    // document.title = fileName;
    // win.document.write(div.outerHTML); // Write contents in the new window.
    // win.document.close();
    /* setTimeout(() => {
      const r = win.confirm('Do you want to print this document ?');
      if (r === true) {
        win.print();
      }
    }, 1500); */
    // win.print(); // Finally, print the contents.
    setType('pdf');
    setTimeout(() => {
      const content = document.getElementById(htmlId);
      document.title = fileName;
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      setTimeout(() => {
        pri.focus();
        pri.print();
        setType('');
      }, 1000);
    }, 1000);
  };

  const exportTableToExcel = (tableID, fileTitle = '') => {
    try {
      setType('excel');
      setTimeout(() => {
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
          setType('');
        } */
      }, 1000);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const loading = (userInfo && userInfo.loading) || (inspectionOrders && inspectionOrders.loading);
  let errorText = <div />;
  if (selectedDate === '%(custom)s'  && (!loading) && typeId && typeId !== null && !(typeId.date && typeof typeId.date === 'object' && typeId.date.length > 1) && (typeId && (!typeId.locationId || !typeId.locationId.length)) && (typeId && (!typeId.spaceValue || !typeId.spaceValue.length) && (!typeId.equipValue || !typeId.equipValue.length))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT START AND END DATE" />
    );
  } else if ((!loading) && typeId && typeId?.selectedField === 'asset_name' && typeId !== null && (typeId && (!typeId.locationId || !typeId.locationId.length))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT BLOCK" />
    );
  } else if ((!loading) && typeId && typeId?.selectedField === 'asset_name' && typeId !== null && ((typeId && (!typeId.spaceValue || !typeId.spaceValue.length)) && (!typeId.equipValue || !typeId.equipValue.length))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT SPACE OR EQUIPMENT" />
    );
  }

  // const selectedReportDate = typeId && typeId !== null && typeId.date && typeId.date.length
  //   ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length && !inspectionOrders.data.data[0].hashlib ? inspectionOrders.data.data : false;
  const dataList = useMemo(() => (isData && isData.length > 1 ? isData.slice(0, 1) : isData), [inspectionOrders]);
  const isError = inspectionOrders && inspectionOrders.data && inspectionOrders.data.status;
  let qlIndex = 1;

  const selectedReportDate1 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, [typeId]);

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-checklist-report', 'Checklist Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    } else if (exportType === 'excel') {
      exportTableToExcel('export-checklist-report', 'Checklist Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    }
  }, [exportType, exportTrue]);

  function getQuestionValues(id, data) {
    const res = [];
    if (id && data && data.length) {
      data.forEach((item) => {
        const ansData = item.answers.filter((s) => s.question_id.toString() === id.toString());
        if (ansData && ansData.length) {
          res.push(ansData[0]);
        }
      });
    }
    return res;
  }

  function getQuestionName(name) {
    let res = true;
    if (name === 'Status' || name === 'Done By' || name === 'Done At' || name === 'Reviewed By') {
      res = false;
    }
    return res;
  }

  function getQuestionArr(qdata) {
    let res = qdata;
    if (qdata && qdata.length > 5) {
      res = qdata.slice(0, 5);
    }
    return res;
  }

  function getTypeAns(val) {
    let res = val;
    if (typeof val !== 'number') {
      res = getDefaultNoValue(val);
      if (checkIsDate(val)) {
        res = getCompanyTimezoneDate(val, userInfo, 'datetime');
      }
    } else {
      res = val;
    }
    return res;
  }

  function getTypeAns(val) {
    let res = val;
    if (typeof val !== 'number') {
      res = getDefaultNoValue(val);
      if (checkIsDate(val)) {
        res = getCompanyTimezoneDate(val, userInfo, 'datetime');
      }
    } else {
      res = val;
    }
    return res;
  }

  return (
    <Card className={collapse ? 'filter-margin-right reports p-1 bg-lightblue h-100' : 'reports p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          {selectedReportDate1 && (
            <span className="ml-3 pl-1 font-weight-800 font-size-13">
              Report Date :
              {' '}
              {selectedReportDate1}
            </span>
          )}
        </Row>
        <div className="mt-2">
          {(typeId && ((typeId.spaceValue && typeId.spaceValue.length > 0) || (typeId.equipValue && typeId.equipValue.length > 0))) && !loading && isData && isData.length > 0 && (
            <Alert severity="info">You are viewing the preview of the report. Please download the report to view the complete inspection checklist report.</Alert>
          )}
        </div>
        {(typeId && ((typeId.spaceValue && typeId.spaceValue.length > 0) || (typeId.equipValue && typeId.equipValue.length > 0))) && !loading && (isData) && dataList.map((md) => (
          <>
            <div className="mt-2">
              <Row>
                <Col md="1" xs="12" sm="12" lg="1" />
                <Col md="5" xs="12" sm="12" lg="5">
                  <span className="font-weight-800 mr-1">Asset Name :</span>
                  <span className="font-weight-500">{md[0].asset_name}</span>
                </Col>
                <Col md="5" xs="12" sm="12" lg="5">
                  <span className="font-weight-800 mr-1">Asset ID :</span>
                  <span className="font-weight-500">{md[0].asset_id}</span>
                </Col>
                <Col md="1" xs="12" sm="12" lg="1" />
                <Col md="1" xs="12" sm="12" lg="1" />
                <Col md="5" xs="12" sm="12" lg="5">
                  <span className="font-weight-800 mr-1">Location :</span>
                  <span className="font-weight-500">{md[0].asset_category}</span>
                </Col>
                <Col md="5" xs="12" sm="12" lg="5">
                  <span className="font-weight-800 mr-1">Scheduled Period :</span>
                  <span className="font-weight-500">{md[0].time_period}</span>
                </Col>
                <Col md="1" xs="12" sm="12" lg="1" />
                <Col md="1" xs="12" sm="12" lg="1" />
                <Col md="5" xs="12" sm="12" lg="5">
                  <span className="font-weight-800 mr-1">Scheduler :</span>
                  <span className="font-weight-500">{md[0].group_name ? md[0].group_name : '-'}</span>
                </Col>
                {md[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (
                <>
                  <Col md="5" xs="12" sm="12" lg="5">
                    <span className="font-weight-800 mr-1">Maintenance Team :</span>
                    <span className="font-weight-500">{md[0].team_name ? md[0].team_name : '-'}</span>
                  </Col>
                </>
                )}
              </Row>
              <div className="mt-3 report-table-list position-relative thin-scrollbar">
                <div className="table-outer-wrapper">
                  <div className="scrolling-lock-table-wrapper thin-scrollbar">
                    <table className="tbl-search-results tbl-mobile-headers stickey-table" id="tbl_mobile_headers_0">
                      <thead className="bg-gray-light">
                        <tr>
                          <th className="sticky-th sticky-head">
                            <span>#</span>
                          </th>
                          <th className="sticky-th sticky-head">
                            <span>Checklist</span>
                          </th>
                          {tableHeaders.filter((x) => x.isChecked).map((hd, index) => (
                            <th key={hd.valueKey} className="sticky-th sticky-head">
                              <span>{hd.headerName}</span>
                            </th>
                          ))}
                          {md[0].checklist_daily && md[0].checklist_daily.length > 0 && getQuestionArr(getColumnArrayById(md[0].checklist_daily, 'date')).map((hd, index) => (
                            <th key={index++}>
                              <span>
                                {getCompanyTimezoneDate(hd, userInfo, 'datetime')}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {md[0].question && md[0].question.map((ql, index) => (
                          <tr key={qlIndex++}>
                            <td className="sticky-td"><span className="font-weight-400">{getQuestionName(ql.name) ? (index + 1) : ''}</span></td>
                            <Tooltip title={getDefaultNoValue(ql.name)} placement="top">
                              <td className="sticky-td"><span className={getQuestionName(ql.name) ? 'font-weight-400' : 'font-weight-700'}>{getDefaultNoValue(ql.name)}</span></td>
                            </Tooltip>
                            {tableHeaders.filter((x) => x.isChecked).map((hd, subindex) => {
                              if (hd.valueKey) {
                                return (
                                  <Tooltip key={`${subindex}-${hd.valueKey}`} title={getDefaultNoValue(getQuestionName(ql.name) && md[0][hd.valueKey] && md[0][hd.valueKey][index] ? md[0][hd.valueKey][index] : '')} placement="top">
                                    <td className="sticky-td"><span className="font-weight-400">{getDefaultNoValue(getQuestionName(ql.name) && md[0][hd.valueKey] && md[0][hd.valueKey][index] ? md[0][hd.valueKey][index] : '')}</span></td>
                                  </Tooltip>
                                );
                              }
                            })}
                            {getQuestionArr(getQuestionValues(ql.id, md[0].checklist_daily)).map((dl) => (
                              <td style={dl.hasOwnProperty('is_abnormal') && dl.is_abnormal && dl.is_abnormal === 'Yes' ? { backgroundColor: 'red', color: 'white' } : {}} className="min-width-160 text-center" key={Math.random()}><span className="font-weight-400">{getTypeAns(dl.value)}</span></td>
                            ))}
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
        ))}
        <Col md="12" sm="12" lg="12" className="d-none">
          <ChecklistPrint isdownloadRequest={false} downloadType={downloadType} typeId={typeId} selectedReportDateForReports={selectedReportDate1} inspectionOrders={inspectionOrders} showObservations={showObservations} tableHeaders={tableHeaders} />
        </Col>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(inspectionOrders && inspectionOrders.err) && (
          <ErrorContent errorTxt={generateErrorMessage(inspectionOrders)} />
        )}
        {(!isError || isDownloadRequest) && (
          <ErrorContent errorTxt="No Data Found" />
        )}
        {errorText}
      </CardBody>
      {actionModal && (
      <DownloadRequestAlert
        atReset={() => {
          setExportTrue(false);
          dispatch(resetInspectionOrders());
          dispatch(clearInspectionOrdersdata());
          dispatch(resetUpdateVisitor());
          setResetFilters(true);
          showActionModal(false);
        }}
        webFilters={{
          selectedReportDateForReports: selectedReportDate1,
          showObservations,
          tableHeaders,
        }}
        details={inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length && inspectionOrders.data.data[0]}
        actionModal
      />
      )}
    </Card>
  );
});

reportChecklistNew.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
reportChecklistNew.defaultProps = {
  collapse: false,
};

export default reportChecklistNew;
