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
  getListOfModuleOperations,
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId,
} from '../../../preventiveMaintenance/ppmService';
import {
  resetAssetAvailability,
} from '../../equipmentService';
import ChecklistPrint from './checklistPrintAvailability';
import './sidebar/stickyTableEmployee.css';
import actionCodes from '../data/actionCodes.json';

const reportChecklistEmployee = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    assetAvailabilityInfo,
  } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    availabilityReportFiltersInfo
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Asset Audit Availability Download Excel/PDF']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(resetAssetAvailability());
    dispatch(resetPurchaseState());
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
    dispatch(setInitialValues(false, false, false, false));
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

  const loading = (userInfo && userInfo.loading) || (assetAvailabilityInfo && assetAvailabilityInfo.loading);
  const isData = assetAvailabilityInfo && assetAvailabilityInfo.data && assetAvailabilityInfo.data.length ? assetAvailabilityInfo.data : false;
  let errorText = <div />;
  if (!loading
    && ((assetAvailabilityInfo && assetAvailabilityInfo.err) || (assetAvailabilityInfo && assetAvailabilityInfo.data && !assetAvailabilityInfo.data.length))) {
    errorText = '';
  } else if (isData && isData.length && isData.length > 0 && isData[0].total_assets === 0) {
    errorText = '';
  } else if (!loading && ((availabilityReportFiltersInfo && !availabilityReportFiltersInfo.customFilters) || (availabilityReportFiltersInfo && availabilityReportFiltersInfo.customFilters && availabilityReportFiltersInfo.customFilters.length === 0))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT LOCATION" />
    );
  }

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-employee-report', 'Asset Audit - Availability Report')
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('export-employee-report', 'Asset Audit - Availability Report')
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  return (
    <Card className={'border-0 side-filters-list p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        {(!loading && isData && isData.length > 0 && isData[0].total_assets > 0) && (
          <div className="p-3 mt-2">
            <Row>
              <Col md="1" xs="12" sm="12" lg="1" />
              <Col md="5" xs="12" sm="12" lg="5">
                <span className="font-weight-800 mr-1">Report Date :</span>
                <span className="font-weight-500">{getCompanyTimezoneDate(isData[0].report_date, userInfo, 'date')}</span>
              </Col>
              <Col md="5" xs="12" sm="12" lg="5">
                <span className="font-weight-800 mr-1">Location :</span>
                <span className="font-weight-500">
                  {isData[0].location.space_name}
                  {`( ${isData[0].location.path_name} )`}
                  {' '}
                </span>
              </Col>
              <Col md="1" xs="12" sm="12" lg="1" />
            </Row>
            <div className="mt-3 report-table-list position-relative thin-scrollbar">
              <div className="table-outer-wrapper">
                <div className="scrolling-lock-table-wrapper thin-scrollbar">
                  <table className="w-100 border-0">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="stickymp-th stickymp-head">
                          <span>TOTAL ASSETS</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>AVAILABLE</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>MISSED</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>MISPLACED</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="stickymp-td"><span className="font-weight-400">{isData[0].total_assets}</span></td>
                        <td className="stickymp-td"><span className="font-weight-400">{isData[0].available_count}</span></td>
                        <td className="stickymp-td"><span className="font-weight-400">{isData[0].missed_count}</span></td>
                        <td className="stickymp-td"><span className="font-weight-400">{isData[0].misplaced_count}</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  {isData[0] && isData[0].missed_assets && isData[0].missed_assets.length > 0 && (
                    <>
                      <Row className="mb-2">
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 mr-1">MISSED ASSETS</span>
                        </Col>
                      </Row>
                      <table className="w-100 border-0">
                        <thead className="bg-gray-light">
                          <tr>
                            <th className="stickymp-th stickymp-head">
                              <span>Asset Name</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Location Name</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Audited By</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Audited On</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isData[0].missed_assets.map((mp) => (
                            <tr key={mp}>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {mp.equipment}
                                  <br />
                                  {mp.equipment_seq}
                                </span>

                              </td>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {mp.location_id.space_name}
                                  {' '}
                                  <br />
                                  {mp.location_id.path_name}
                                </span>

                              </td>
                              <td className="stickymp-td"><span className="font-weight-400">{mp.audited_by}</span></td>
                              <td className="stickymp-td"><span className="font-weight-400">{getCompanyTimezoneDate(mp.audited_on, userInfo, 'datetime')}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                  <br />
                  {isData[0] && isData[0].available_assets && isData[0].available_assets.length > 0 && (
                    <>
                      <Row className="mb-2">
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 mr-1">AVAILABLE ASSETS</span>
                        </Col>
                      </Row>
                      <table className="w-100 border-0">
                        <thead className="bg-gray-light">
                          <tr>
                            <th className="stickymp-th stickymp-head">
                              <span>Asset Name</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Location Name</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Audited By</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Audited On</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isData[0].available_assets.map((as) => (
                            <tr key={as}>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {as.equipment}
                                  <br />
                                  {as.equipment_seq}
                                </span>

                              </td>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {as.location_id.space_name}
                                  {' '}
                                  <br />
                                  {as.location_id.path_name}
                                </span>

                              </td>
                              <td className="stickymp-td"><span className="font-weight-400">{as.audited_by}</span></td>
                              <td className="stickymp-td"><span className="font-weight-400">{getCompanyTimezoneDate(as.audited_on, userInfo, 'datetime')}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                  <br />
                  {isData[0] && isData[0].misplaced_assets && isData[0].misplaced_assets.length > 0 && (
                    <>
                      <Row className="mb-2">
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 mr-1">MISPLACED ASSETS</span>
                        </Col>
                      </Row>
                      <table className="w-100 border-0">
                        <thead className="bg-gray-light">
                          <tr>
                            <th className="stickymp-th stickymp-head">
                              <span>Asset Name</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Actual Location</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Scanned Location</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Audited By</span>
                            </th>
                            <th className="stickymp-th stickymp-head">
                              <span>Audited On</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isData[0].misplaced_assets.map((mp) => (
                            <tr key={mp}>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {mp.equipment}
                                  <br />
                                  {mp.equipment_seq}
                                </span>

                              </td>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {mp.actual_location.space_name}
                                  {' '}
                                  <br />
                                  {mp.actual_location.path_name}
                                </span>

                              </td>
                              <td className="stickymp-td">
                                <span className="font-weight-400">
                                  {mp.scanned_location_id.space_name}
                                  {' '}
                                  <br />
                                  {mp.scanned_location_id.path_name}
                                </span>
                              </td>
                              <td className="stickymp-td"><span className="font-weight-400">{mp.audited_by}</span></td>
                              <td className="stickymp-td"><span className="font-weight-400">{getCompanyTimezoneDate(mp.audited_on, userInfo, 'datetime')}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <Col md="12" sm="12" lg="12" className="d-none">
          <ChecklistPrint assetAvailabilityInfo={assetAvailabilityInfo} />
        </Col>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(assetAvailabilityInfo && assetAvailabilityInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetAvailabilityInfo)} />
        )}
        {(isData && isData.length && isData.length > 0 && isData[0].total_assets === 0 && errorText === '') && (
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
