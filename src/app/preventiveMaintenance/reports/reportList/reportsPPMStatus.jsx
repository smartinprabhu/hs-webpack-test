/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment-timezone';
import {
  Card, CardBody, Col, Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import Alert from '@mui/material/Alert';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue, getCompanyTimezoneDate,
  getListOfModuleOperations, exportExcelTableToXlsx,
  getColumnArrayById,
} from '../../../util/appUtils';
import {
  getReportId, getTypeId, resetPPMStatus,
} from '../../ppmService';
import { getPPMSettingsDetails } from '../../../siteOnboarding/siteService';
import { setInitialValues } from '../../../purchase/purchaseService';
import ChecklistPrint from './checklistPPMStatusPrint';
import './sidebar/stickyTable.css';
import actionCodes from '../data/actionCodes.json';
import DownloadRequestAlert from '../../../commonComponents/downloadRequestAlert';
import {
  resetUpdateVisitor,
} from '../../../adminSetup/setupService';

const appModels = require('../../../util/appModels').default;

const ReportsPPMStatus = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue, setExportType, setExportTrue, setResetFilters,
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
    ppmStatusInfo,
  } = useSelector((state) => state.ppm);
  const [actionModal, showActionModal] = useState(false);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], '52 Week PPM', 'code');

  const isExportable = allowedOperations.includes(actionCodes['PPM Status Report Export']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetPPMStatus());
    if (afterReset) afterReset();
  };

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const ppmConfig = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const isReViewRequired = ppmConfig && ppmConfig.is_review_required;
  const isSignOffRequired = ppmConfig && ppmConfig.is_sign_off_required;

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getPPMSettingsDetails(userInfo.data.company.id, appModels.PPMWEEKCONFIG));
    }
  }, [userInfo]);

  // const handleAnswerPrint = (htmlId, fileName) => {
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

  /* const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
  }; */
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
  };

  const isDownloadRequest = !!(ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length && ppmStatusInfo.data.length > 0 && ppmStatusInfo.data[0].hashlib);

  useEffect(() => {
    if (isDownloadRequest) {
      showActionModal(true);
    }
  }, [ppmStatusInfo]);

  const loading = (userInfo && userInfo.loading) || (ppmStatusInfo && ppmStatusInfo.loading);

  let errorText = <div />;
  if ((!loading) && typeId && typeId !== null && ((typeId && !typeId.date) || typeId.date === null)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT START WEEK AND END WEEK" />
    );
  } else if ((!loading) && typeId && typeId?.selectedField === 'asset_name' && typeId !== null && (typeId && (!typeId.locationId || !typeId.locationId.length))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT BLOCK" />
    );
  } else if ((!loading) && typeId && typeId?.selectedField === 'asset_name' && typeId !== null && ((typeId && (!typeId.spaceValue || !typeId.spaceValue.length)) && (!typeId.equipValue || !typeId.equipValue.length))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT SPACE OR EQUIPMENT" />
    );
  } else if ((!loading)
    && ((ppmStatusInfo && ppmStatusInfo.err) || (ppmStatusInfo && ppmStatusInfo.data && !ppmStatusInfo.data.length))) {
    errorText = '';
  }
  let start = '';
  let end = '';

  if (typeId && typeId !== null && typeId.date && typeId.date.length) {
    start = moment(typeId.date[0]).startOf('isoWeek').format('YYYY-MM-DD');
    end = moment(typeId.date[1]).endOf('isoWeek').format('YYYY-MM-DD');
  }
  const selectedReportDate = start && end && `${getCompanyTimezoneDate(start, userInfo, 'date')} - ${getCompanyTimezoneDate(end, userInfo, 'date')}`;

  const isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length && ppmStatusInfo.data.length > 0 && !ppmStatusInfo.data[0].hashlib ? ppmStatusInfo.data : false;
  const dataList = useMemo(() => (isData && isData.length > 1 ? isData.slice(0, 1) : isData), [ppmStatusInfo]);
  const isError = ppmStatusInfo && ppmStatusInfo.data ? !ppmStatusInfo.data.status : false;

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-checklist-report', 'Checklist Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    } else if (exportType === 'excel') {
      exportExcelTableToXlsx('export-checklist-report', 'Checklist Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    }
  }, [exportType, exportTrue]);

  const keyExistsInArray = (key, jsonArray) => jsonArray.some((obj) => key in obj);

  return (
    <Card className="border-0 p-1 bg-lightblue h-100">
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          {selectedReportDate && selectedReportDate.length > 6 && (
            <span className="ml-3 pl-1 font-weight-800 font-size-13 font-family-tab">
              Report Date :
              {' '}
              {selectedReportDate}
            </span>
          )}
        </Row>
        <div className="mt-2 font-family-tab">
          {(typeId && ((typeId.spaceValue && typeId.spaceValue.length > 0) || (typeId.equipValue && typeId.equipValue.length > 0))) && !loading && isData && isData.length > 0 && (
            <Alert severity="info">You are viewing the preview of the report. Please download the report to view the complete ppm checklist report.</Alert>
          )}
        </div>
        {(typeId && ((typeId.spaceValue && typeId.spaceValue.length > 0) || (typeId.equipValue && typeId.equipValue.length > 0))) && !loading && (isData) && dataList.map((md) => (
          <>
            <div className="p-3 mt-2">
              <Row className="mb-2">
                <Col md={{ size: 9, offset: 2 }} sm="12" lg={{ size: 9, offset: 2 }} xs="12">
                  <Table bordered className="no-bottom">
                    <thead className="">
                      <tr>
                        <th className="p-1 min-width-100 font-weight-800 mr-1 font-family-tab">Asset Name</th>
                        <th className="p-1 min-width-160 font-weight-500 font-family-tab">{md[0].asset_name}</th>

                        <th className="p-1 min-width-100 font-weight-800 mr-1 font-family-tab">Asset ID</th>
                        <th className="p-1 min-width-100 font-weight-500 font-family-tab">{md[0].asset_id}</th>
                      </tr>
                      <tr>
                        <th className="p-1 min-width-100 font-weight-800 mr-1 font-family-tab">Location</th>
                        <th className="p-1 min-width-180 font-weight-500 font-family-tab">{md[0].asset_category}</th>

                        <th className="p-1 min-width-100 font-weight-800 mr-1 font-family-tab">Scheduler</th>
                        <th className="p-1 min-width-250 font-weight-500 font-family-tab">{md[0].group_name ? md[0].group_name : '-'}</th>
                      </tr>
                      {md[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (

                        <tr>
                          <th className="p-1 min-width-100 font-weight-800 mr-1 font-family-tab">Maintenance Team</th>
                          <th className="p-1 min-width-180 font-weight-500 font-family-tab">{md[0].team_name ? md[0].team_name : '-'}</th>
                        </tr>

                      )}

                    </thead>
                    {md[0].sub_assets && md[0].sub_assets.length > 0 && (
                      <tbody>
                        <tr>
                          <td className="p-1 min-width-100 font-weight-800 mr-1 font-family-tab">Sub Assets</td>
                          <td colSpan="4" className="p-1 min-width-250 font-weight-500 font-family-tab" style={{ maxWidth: '250px' }}>
                            {getColumnArrayById(md[0].sub_assets, 'sub_asset_name').toString()}
                          </td>
                        </tr>
                      </tbody>

                    )}

                  </Table>
                </Col>
              </Row>
              <div className="mt-3 report-table-list position-relative thin-scrollbar">
                <div className="table-outer-wrapper">
                  <div className="scrolling-lock-table-wrapper thin-scrollbar">
                    <table className="tbl-search-results tbl-mobile-headers stickey-table" id="tbl_mobile_headers_0">
                      <thead className="bg-gray-light">
                        <tr>
                          {md[0].headers && md[0].headers.slice(0, 8).map((hd, index) => (
                            <th className="sticky-th sticky-head" key={index}>
                              {index <= 3 ? (
                                <span>{hd}</span>
                              )
                                : (
                                  <span>{getCompanyTimezoneDate(hd, userInfo, 'date')}</span>
                                )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {md[0].question_lists && md[0].question_lists.map((ql, index) => (
                          <tr key={ql}>
                            <td className="sticky-td"><span className="font-weight-400">{index + 1}</span></td>
                            <Tooltip title={getDefaultNoValue(ql.qestion_group)} placement="top">
                              <td className="sticky-td"><span className="font-weight-400">{getDefaultNoValue(ql.qestion_group)}</span></td>
                            </Tooltip>
                            <Tooltip title={getDefaultNoValue(ql.qestion)} placement="top">
                              <td className="sticky-td"><span className="font-weight-400">{getDefaultNoValue(ql.qestion)}</span></td>
                            </Tooltip>
                            <td className="sticky-td"><span className="font-weight-400">{getDefaultNoValue(ql.expected)}</span></td>
                            {ql.day_list && ql.day_list.slice(0, 5).map((dl) => (
                              <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
                            ))}
                          </tr>
                        ))}
                        {md[0].status_by_dis && (
                          <tr>
                            <td className="sticky-td" />
                            <td className="sticky-td" />
                            <td className="sticky-td" />
                            <td className="sticky-td">Status</td>
                            {md[0].status_by_dis && md[0].status_by_dis.map((sta) => (
                              <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(sta.status)}</span></td>
                            ))}
                          </tr>
                        )}
                        {md[0].done_by_list && keyExistsInArray('work_permit_reference', md[0].done_by_list) && (
                          <tr>
                            <td className="sticky-td" />
                            <td className="sticky-td" />
                            <td className="sticky-td" />
                            <td className="sticky-td">Work Permit Reference</td>
                            {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                              <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.work_permit_reference)}</span></td>
                            ))}
                          </tr>
                        )}
                        {md[0].done_by_list && keyExistsInArray('gate_pass_reference', md[0].done_by_list) && (
                        <tr>
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td">Gate Pass Reference</td>
                          {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                            <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.gate_pass_reference)}</span></td>
                          ))}
                        </tr>
                        )}
                        {md[0].done_by_list && keyExistsInArray('compliance_type', md[0].done_by_list) && (
                        <tr>
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td">Compliance Type</td>
                          {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                            <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.compliance_type)}</span></td>
                          ))}
                        </tr>
                        )}
                        <tr>
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td">Done By</td>
                          {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                            <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.done_by)}</span></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td" />
                          <td className="sticky-td">Done At</td>
                          {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                            <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getCompanyTimezoneDate(dby.done_at, userInfo, 'datetime')}</span></td>
                          ))}
                        </tr>
                        {isReViewRequired && (
                          <>
                            <tr>
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td">Reviewed By</td>
                              {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.reviewed_by)}</span></td>
                              ))}
                            </tr>
                            <tr>
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td">Reviewed on</td>
                              {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{dby.reviewed_on ? getCompanyTimezoneDate(dby.reviewed_on, userInfo, 'datetime') : '-'}</span></td>
                              ))}
                            </tr>
                          </>
                        )}
                        {isSignOffRequired && (
                          <>
                            <tr>
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td">Signed off by</td>
                              {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.signed_off_by)}</span></td>
                              ))}
                            </tr>
                            <tr>
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td" />
                              <td className="sticky-td">Signed off on</td>
                              {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getCompanyTimezoneDate(dby.signed_off_on, userInfo, 'datetime')}</span></td>
                              ))}
                            </tr>
                          </>
                        )}
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
          <ChecklistPrint isReViewRequired={isReViewRequired} isSignOffRequired={isSignOffRequired} typeId={typeId} ppmStatusInfo={ppmStatusInfo} isdownloadRequest={false} />
        </Col>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(ppmStatusInfo && ppmStatusInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(ppmStatusInfo)} />
        )}
        {(isError && !isData) && (
          <ErrorContent errorTxt="No Data Found" />
        )}

        {errorText}
      </CardBody>
      {actionModal && (
      <DownloadRequestAlert
        atReset={() => {
          setExportTrue(false);
          setResetFilters(true);
          dispatch(resetPPMStatus());
          dispatch(resetUpdateVisitor());
          showActionModal(false);
        }}
        webFilters={{
          isReViewRequired,
          isSignOffRequired,
          typeId,
        }}
        details={ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length && ppmStatusInfo.data[0]}
        actionModal
      />
      )}
    </Card>
  );
});

ReportsPPMStatus.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
ReportsPPMStatus.defaultProps = {
  collapse: false,
};

export default ReportsPPMStatus;
