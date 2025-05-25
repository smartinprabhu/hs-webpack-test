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
  getListOfModuleOperations, getFindData
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId,
} from '../../../preventiveMaintenance/ppmService';
import ChecklistPrint from './checklistPrintMisplaced';
import './sidebar/stickyTableEmployee.css';
import {
  resetAssetMisplaced,
} from '../../equipmentService';
import actionCodes from '../data/actionCodes.json';

const reportChecklistEmployee = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    assetMisplacedInfo,
  } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { misplacedFiltersInfo } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Asset Audit Misplaced Download Excel/PDF']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(resetPurchaseState());
    dispatch(resetAssetMisplaced());
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

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-employee-report', 'Asset Audit - Misplaced Assets')
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('export-employee-report', 'Asset Audit - Misplaced Assets')
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  const loading = (userInfo && userInfo.loading) || (assetMisplacedInfo && assetMisplacedInfo.loading);

  const isData = assetMisplacedInfo && assetMisplacedInfo.data && assetMisplacedInfo.data.length ? assetMisplacedInfo.data : false;

  let errorText = <div />;
  if (!loading
    && ((assetMisplacedInfo && assetMisplacedInfo.err) || (assetMisplacedInfo && assetMisplacedInfo.data && !assetMisplacedInfo.data.length))) {
    errorText = '';
  } else if (isData && isData.length && isData.length > 0 && isData[0].misplaced_assets <= 0) {
    errorText = '';
  } else if (!loading && misplacedFiltersInfo && (!misplacedFiltersInfo.customFilters || misplacedFiltersInfo.customFilters.length <= 0 || (misplacedFiltersInfo.customFilters && misplacedFiltersInfo.customFilters.length && getFindData(misplacedFiltersInfo.customFilters, 'By Date') && getFindData(misplacedFiltersInfo.customFilters, 'By Date').value === null))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT DATE" />
    );
  }

  const selectedReportDate = misplacedFiltersInfo.customFilters && misplacedFiltersInfo.customFilters.length && getFindData(misplacedFiltersInfo.customFilters, 'By Date')
    ? getCompanyTimezoneDate(getFindData(misplacedFiltersInfo.customFilters, 'By Date').value, userInfo, 'date') : '';

  return (
    <Card className={collapse ? 'filter-margin-right side-filters-list p-1 bg-lightblue h-100' : 'side-filters-list p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <div className="content-inline">
              {selectedReportDate && isData && isData.length > 0 && (
                <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                  Report Date :
                  {' '}
                  {selectedReportDate}
                </span>
              )}
            </div>
          </Col>
        </Row>
        {(!loading && isData && isData.length > 0 && isData[0] && isData[0].misplaced_assets && isData[0].misplaced_assets.length > 0) && (
          <div className="mt-3 report-table-list position-relative thin-scrollbar">
            <div className="table-outer-wrapper">
              <div className="scrolling-lock-table-wrapper thin-scrollbar">
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
                        <span>Audited On</span>
                      </th>
                      <th className="stickymp-th stickymp-head">
                        <span>Audited By</span>
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
                            <br />
                            {mp.actual_location.path_name}
                          </span>
                        </td>
                        <td className="stickymp-td">
                          <span className="font-weight-400">
                            {mp.scanned_location_id.space_name}
                            <br />
                            {mp.scanned_location_id.path_name}
                          </span>
                        </td>
                        <td className="stickymp-td"><span className="font-weight-400">{getCompanyTimezoneDate(mp.audited_on, userInfo, 'datetime')}</span></td>
                        <td className="stickymp-td"><span className="font-weight-400">{mp.audited_by}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <Col md="12" sm="12" lg="12" className="d-none">
          <ChecklistPrint selectedReportDate={selectedReportDate} assetMisplacedInfo={assetMisplacedInfo} />
        </Col>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(assetMisplacedInfo && assetMisplacedInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetMisplacedInfo)} />
        )}
        {(isData && isData.length && isData.length > 0 && isData[0].misplaced_assets.length <= 0 && errorText === '') && (
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
