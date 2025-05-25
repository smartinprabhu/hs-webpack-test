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
  getListOfModuleOperations, extractTextObject,
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId,
} from '../../../preventiveMaintenance/ppmService';
import {
  resetIncidentReport, shiftHandoverReportFilters
} from '../../../assets/equipmentService';
import ChecklistPrint from './checklistPrintShiftHandover';
import './sidebar/stickyTableEmployee.css';
// import actionCodes from '../data/actionCodes.json';

const reportChecklistEmployee = React.memo((props) => {
  const {
    afterReset, reportName, collapse,
    exportType, exportTrue
  } = props;
  const dispatch = useDispatch();
  const { shiftHandoverFilters
  } = useSelector((state) => state.equipment);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    incidentReportInfo,
  } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  // const isExportable = allowedOperations.includes(actionCodes['Asset Audit Availability Download Excel/PDF']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(resetIncidentReport());
    dispatch(resetPurchaseState());
    dispatch(resetPrint());
    dispatch(shiftHandoverReportFilters([]))
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

  const loading = (userInfo && userInfo.loading) || (incidentReportInfo && incidentReportInfo.loading);
  const isData = incidentReportInfo && incidentReportInfo.data && incidentReportInfo.data.length ? incidentReportInfo.data : false;
  let errorText = <div />;
  if (!loading
    && ((incidentReportInfo && incidentReportInfo.err) || (incidentReportInfo && incidentReportInfo.data && !incidentReportInfo.data.length))) {
    errorText = '';
  } else if (isData && isData.length && isData.length > 0 && isData[0].toatal_assets === 0) {
    errorText = '';
  }

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-employee-report', 'Shift Handover Report')
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('export-employee-report', 'Shift handover Report')
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  console.log(shiftHandoverFilters.customFilters);

  return (
    <Card className={collapse ? 'filter-margin-right side-filters-list p-1 bg-lightblue h-100' : 'side-filters-list p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <div className="content-inline">
              <div className="pt-2 pl-0 pb-0">
                <p className="m-0">
                  Total Records :
                  {' '}
                  {incidentReportInfo && !loading && incidentReportInfo.data && incidentReportInfo.data.length > 0 ? incidentReportInfo.data.length : 0}
                  {' '}
                </p>
                {shiftHandoverFilters && shiftHandoverFilters.customFilters && shiftHandoverFilters.customFilters.length > 0 && (

                  <span className="mr-2">Filters : </span>
                )}
                {shiftHandoverFilters && shiftHandoverFilters.customFilters && shiftHandoverFilters.customFilters.length > 0 ? shiftHandoverFilters.customFilters.map((cf) => (
                  <span key={cf.value} className="mr-2 content-inline font-tiny">

                    {(cf.type === 'text') ? (
                      <>
                        {cf.title}
                        <span>
                          {'  '}
                          :
                          {' '}
                          {decodeURIComponent(cf.value)}
                        </span>
                      </>
                    ) : ''}
                    {' '}

                    {(cf.type === 'customdate' && cf.value[0] !== null && cf.value[1] !== null) && (
                      <span>
                        {cf.title}
                        {'  '}
                        :
                        {' '}
                        {cf.value[0] !== null && getCompanyTimezoneDate(cf.value[0].$d, userInfo, 'date')}
                        {' - '}
                        {cf.value[1] !== null && getCompanyTimezoneDate(cf.value[1].$d, userInfo, 'date')}
                      </span>
                    )}

                  </span>
                )) : ''}
              </div>
            </div>
          </Col>
        </Row>
        {(!loading && isData && isData.length > 0) && (
          <div className="px-1">
            {/* <Row>
              <Col md="1" xs="12" sm="12" lg="1" />
              <Col md="5" xs="12" sm="12" lg="5">
                <span className="font-weight-800 mr-1">Report Date :</span>
                <span className="font-weight-500">{getCompanyTimezoneDate(isData[0].reported_on, userInfo, 'date')}</span>
              </Col>
              <Col md="5" xs="12" sm="12" lg="5">
                <span className="font-weight-800 mr-1">Display Name :</span>
                <span className="font-weight-500">
                  {isData[0].display_name}
                  {' '}
                </span>
              </Col>
              <Col md="1" xs="12" sm="12" lg="1" />
            </Row> */}
            <div className="report-table-list position-relative thin-scrollbar">
              <div className="table-outer-wrapper">
                <div className="scrolling-lock-table-wrapper thin-scrollbar">
                  <table className="w-100 border-0">
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="stickymp-th stickymp-head">
                          <span>Description</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>Maintenance Team</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>Reported By</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>Reported On</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>Accepted By</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>Accepted On</span>
                        </th>
                        <th className="stickymp-th stickymp-head">
                          <span>Status</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!loading) && (isData) && isData.length && isData.map((data) => (
                        <tr>
                          <td className="stickymp-td foldText"><span className="font-weight-400 foldText">{data.name}</span></td>
                          <td className="stickymp-td"><span className="font-weight-400">{extractTextObject(data.maintenance_team_id)}</span></td>
                          <td className="stickymp-td"><span className="font-weight-400">{extractTextObject(data.reported_by)}</span></td>
                          <td className="stickymp-td"><span className="font-weight-400">{getCompanyTimezoneDate(data.reported_on, userInfo, 'datetime')}</span></td>
                          <td className="stickymp-td"><span className="font-weight-400">{extractTextObject(data.accepted_by)}</span></td>
                          <td className="stickymp-td"><span className="font-weight-400">{getCompanyTimezoneDate(data.accepted_on, userInfo, 'datetime')}</span></td>
                          <td className="stickymp-td"><span className="font-weight-400">{data.state}</span></td>
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
          <ChecklistPrint incidentReportInfo={incidentReportInfo} />
        </Col>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(incidentReportInfo && incidentReportInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(incidentReportInfo)} />
        )}
        {(isData && isData.length && isData.length > 0 && isData[0].toatal_assets === 0 && errorText === '') && (
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
