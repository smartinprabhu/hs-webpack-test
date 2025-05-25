/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  Row, Col,
} from 'reactstrap';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};

// eslint-disable-next-line no-unused-vars

const consumptionExport = (props) => {
  const {
    ppmStatusInfo, typeId, selectedDate, isdownloadRequest, downloadDetails, dateSelection,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const { consumptionSummary } = useSelector((state) => state.inventory);
  const {
    selectedReportDate,
  } = useSelector((state) => state.ppm);
  const loading = (userInfo && userInfo.loading) || (ppmStatusInfo && ppmStatusInfo.loading);

  let selectedReportDate1 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';
  selectedReportDate1 = isdownloadRequest ? dateSelection : selectedReportDate1;

  // const isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length ? ppmStatusInfo.data : false;
  let isData = consumptionSummary && consumptionSummary.data && consumptionSummary.data.data ? consumptionSummary.data.data : false;
  isData = isdownloadRequest ? downloadDetails : isData;

  return (
    <>
      <div id="export-consumption-report">
        <table align="center">
          <tbody>
            <tr>
              <td colSpan={15}><b> Transfers Summary Report</b></td>
            </tr>
            <tr>
              <td>Date</td>
              <td colSpan={15} align="left">
                <b>
                  {(selectedReportDate1 && selectedDate && selectedDate !== 'Custom')
                    ? (
                      <>
                        {' '}
                        {selectedReportDate1[0]}
                        {' '}
                        -
                        {' '}
                        {selectedReportDate1[1]}
                      </>
                    ) : ((selectedReportDate1 && isData && (
                    <>
                      {' '}
                      {selectedReportDate1}
                    </>
                    ))
                    )}
                </b>

              </td>
            </tr>
            <tr>
              <td>Filters</td>
              <td colSpan={15} align="left">
                <b>
                  Operation Type :
                  {`${typeId?.opType?.name} , ` || 'All , '}
                  <br />
                  Product :
                  {typeId?.productId?.length > 0
                    ? `${typeId.productId.map((pd) => pd.name).join(', ')} , `
                    : 'All , '}
                  <br />
                  Product Category :
                  {typeId?.productCategoryId?.length > 0
                    ? `${typeId.productCategoryId.map((pd) => pd.name).join(', ')} , `
                    : 'All , '}
                  <br />
                  Vendor Name :
                  {typeId?.vendorId?.length > 0
                    ? `${typeId.vendorId.map((pd) => pd.name).join(', ')} , `
                    : 'All , '}
                  <br />
                  Department :
                  {' '}
                  {typeId?.departmentValue?.length > 0
                    ? `${typeId.departmentValue.map((pd) => pd.name).join(', ')} , `
                    : 'All , '}
                </b>
              </td>
            </tr>
          </tbody>
        </table>

        { /* <h4 style={{ textAlign: 'center' }}>Transfers Summary Report</h4>
        {(selectedReportDate1 && selectedDate && selectedDate !== 'Custom')
          ? (
            <span className="font-weight-800">
              Report Date :
              {' '}
              {selectedReportDate1[0]}
              {' '}
              -
              {' '}
              {selectedReportDate1[1]}
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
          {!isdownloadRequest && (
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
          )}
        </Row> */ }
        <div className="page-header-space" style={{ height: '30px' }} />
        {!loading && isData
          ? (
            <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
              <thead>
                <tr style={tabletd}>
                  {isData && isData.headers && isData.headers.length > 0 && isData.headers.map((hd, index) => (
                    <th className="sticky-th sticky-head" key={index}>
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
          ) : ''}
        <br />
        {' '}
        <br />
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

consumptionExport.propTypes = {
  ppmStatusInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default consumptionExport;
