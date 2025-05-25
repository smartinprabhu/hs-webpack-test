/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Row, Col,
} from 'reactstrap';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};


const consumptionExport = (props) => {
  const {
    ppmStatusInfo, typeId, selectedDate,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const { inwardSummary } = useSelector((state) => state.inventory);
  const {
    selectedReportDate,
  } = useSelector((state) => state.ppm);
  const loading = (userInfo && userInfo.loading) || (ppmStatusInfo && ppmStatusInfo.loading);

  const selectedReportDate1 = typeId && typeId !== null && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';
  const selectedReportDate2 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';

  // const isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length ? ppmStatusInfo.data : false;
  const isData = inwardSummary && inwardSummary.data && inwardSummary.data.data ? inwardSummary.data.data : false;

  return (
    <>
      <div id="export-inward-report">
        <h4 style={{ textAlign: 'center' }}>Inward Summary Report</h4>
        {(selectedReportDate2 && selectedDate && selectedDate === 'Custom')
          ? <p style={{ textAlign: 'center' }}>  Report Date :
            {' '}{selectedReportDate1}</p>
          : (
            <p style={{ textAlign: 'center' }}>
              Report Date :
              {' '}
              {selectedReportDate2[0]}
              {' '}
              -
              {' '}
              {selectedReportDate2[1]}
            </p>
          )}
        <Row>
          <Col md="12" xs="12" sm="12" lg="12" className="mt-2 ml-2">
            <span className="font-weight-800 mr-1">Filters :  </span>
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
                    <td style={tabletd}>{sd.inward_stock}</td>
                    <td style={tabletd}>{(sd.unit_rate).toFixed(2)}</td>
                    <td style={tabletd}>{(sd.total_cost).toFixed(2)}</td>
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
