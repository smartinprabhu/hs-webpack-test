/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Row, Col,
} from 'reactstrap';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import ChecklistExport from './consumptionSummaryExport';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};


const ConsumptionPrint = (props) => {
  const {
    typeId, showObservations, tableHeaders, selectedDate, isdownloadRequest, downloadDetails, dateSelection
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const { consumptionSummary } = useSelector((state) => state.inventory);
  const {
    selectedReportDate,
  } = useSelector((state) => state.ppm);


  let selectedReportDate1 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';
  selectedReportDate1 = isdownloadRequest ? dateSelection : selectedReportDate1;

  // const isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length ? ppmStatusInfo.data : false;
  let isData = consumptionSummary && consumptionSummary.data && consumptionSummary.data.data ? consumptionSummary.data.data : false;
  isData = isdownloadRequest ? downloadDetails : isData;

  const columnSize = 5;
  const splitData = (d) => {
    const splittedArrays = [];
    for (let i = 0; i < d.length;) {
      splittedArrays.push(d.slice(i, i += columnSize));
    }
    return splittedArrays;
  };

  return (
    <>
      <div id="print-consumption-report">
        <div
          className="page-header"
          style={{
            position: 'fixed',
            top: '0mm',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <PdfCompanyInfo />
        </div>
        <table style={{ width: '100%', marginTop: '35px' }}>
          <thead>
            <tr>
              <td>
                <div className="page-header-space" style={{ height: '40px' }} />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h4 style={{ textAlign: 'center' }}>Transfers Summary Report</h4>
                {(selectedReportDate1 && selectedDate && selectedDate !== 'Custom')
                  ? (
                    <span className="font-weight-800">
                      Report Date :
                      {' '}
                      {selectedReportDate1}
                    </span>
                  )
                  : ((selectedReportDate1 && isData && (
                    <span className="font-weight-800">
                      Report Date :
                      {' '}
                      {selectedReportDate1}
                    </span>
                  ))
                  )}
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="mt-2 ml-2">
                    <span className="font-weight-800 mr-1">Filters :  </span>
                    <span className="font-weight-600 mr-1">Operation Type :</span>
                    <span className="font-weight-500">
                      {typeId && typeId.opType && typeId.opType.name
                        ? `${typeId.opType.name}, ` : 'All,'}
                    </span>
                    <span className="font-weight-600 mr-1">Product :</span>
                    <span className="font-weight-500">
                      {typeId && typeId.productId && typeId.productId.length > 0
                        ? (typeId.productId.map((pd) => (
                          <span>
                            {pd.name}
                            ,
                          </span>
                        ))) : 'All,'}
                    </span>
                    <span className="font-weight-600 mr-1">Product Category :</span>
                    <span className="font-weight-500">
                      {typeId && typeId.productCategoryId && typeId.productCategoryId.length > 0
                        ? (typeId.productCategoryId.map((pd) => (
                          <span>
                            {pd.name}
                            ,
                          </span>
                        ))) : 'All,'}
                    </span>

                    <span className="font-weight-600 mr-1">Vendor Name :</span>
                    <span className="font-weight-500">
                      {typeId && typeId.vendorId && typeId.vendorId.length > 0
                        ? (typeId.vendorId.map((pd) => (
                          <span>
                            {pd.name}
                            ,
                          </span>
                        ))) : 'All,'}
                    </span>
                    <span className="font-weight-600 mr-1">Department :</span>
                    <span className="font-weight-500">
                      {' '}
                      {typeId && typeId.departmentValue && typeId.departmentValue.length > 0
                        ? (typeId.departmentValue.map((pd) => (
                          <span>
                            {pd.name}
                            ,
                          </span>
                        ))) : 'All'}
                    </span>
                  </Col>
                </Row>
                <div className="page-header-space" style={{ height: '10px' }} />
                <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                  <thead className="bg-gray-light">
                    <tr style={tabletd}>
                      {isData && isData.headers && isData.headers.length > 0 && isData.headers.map((hd, index) => (
                        <th style={tabletd} key={index}>
                          <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>{hd}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isData && isData.stock_details && isData.stock_details.length > 0 && isData.stock_details.map((sd) => (
                      <tr>
                        <td style={tabletd}>{sd.sl_no}</td>
                        <td style={tabletd}>{sd.product_name}</td>
                        <td style={tabletd}>{sd.unique_code}</td>
                        <td style={tabletd}>{sd.specification}</td>
                        <td style={tabletd}>{sd.brand}</td>
                        <td style={tabletd}>{sd.department}</td>
                        <td style={tabletd}>{sd.category}</td>
                        <td style={tabletd}>{sd.uom}</td>
                        <td style={tabletd}>{sd.vendor_name}</td>
                        <td style={tabletd}>{parseFloat(sd.opening_stock).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.inward_stock).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.consumption).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.outward_stock).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.scrap_total).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.stock_audit_total).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.closing_stock).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.unit_rate).toFixed(2)}</td>
                        <td style={tabletd}>{parseFloat(sd.total_consumption_cost).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport typeId={typeId} isdownloadRequest={isdownloadRequest} inspectionOrders={consumptionSummary} showObservations={showObservations} tableHeaders={tableHeaders} downloadDetails={downloadDetails} selectedDate={selectedDate} />
    </>
  );
};

ConsumptionPrint.propTypes = {
  ppmStatusInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default ConsumptionPrint;
