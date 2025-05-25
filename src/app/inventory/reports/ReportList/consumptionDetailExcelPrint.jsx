/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};

const tabletdhead = {

  border: '1px solid #495057',
  borderBottom: '1px solid #495057',
  fontSize: '17px',
  backgroundColor: '#f3f9fc',
  borderCollapse: 'collapse',
  textAlign: 'left',
  textTransform: 'uppercase',
  padding: '2px',
};

const consumptionExport = (props) => {
  const {
    ppmStatusInfo, typeId, isStock, selectedDate, isdownloadRequest, downloadDetails, dateSelection,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const { consumptionDetailSummary } = useSelector((state) => state.inventory);
  const {
    selectedReportDate,
  } = useSelector((state) => state.ppm);
  const loading = (userInfo && userInfo.loading) || (ppmStatusInfo && ppmStatusInfo.loading);

  function getStockCount(item) {
    let res = 0;
    const opType = typeId && typeId.opType && typeId.opType.name ? typeId.opType.name : '';
    if (opType) {
      if (opType === 'Inward') {
        res = item.inward_stock;
      } else if (opType === 'Outward') {
        res = item.outward_stock;
      } else if (opType === 'Consumption') {
        res = item.consumption;
      }
    }
    return res;
  }

  function getStockCount1(item) {
    let res = 0;
    const opType = typeId && typeId.opType && typeId.opType.name ? typeId.opType.name : '';
    if (opType) {
      if (opType === 'Inward') {
        res = item.outward_stock;
      } else if (opType === 'Outward') {
        res = item.inward_stock;
      } else if (opType === 'Consumption') {
        res = item.inward_stock;
      }
    }
    return res;
  }

  function getStockCount2(item) {
    let res = 0;
    const opType = typeId && typeId.opType && typeId.opType.name ? typeId.opType.name : '';
    if (opType) {
      if (opType === 'Inward') {
        res = item.consumption;
      } else if (opType === 'Outward') {
        res = item.consumption;
      } else if (opType === 'Consumption') {
        res = item.outward_stock;
      }
    }
    return res;
  }

  const selectedReportDate1 = typeId && typeId !== null && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';
  let selectedReportDate2 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';
  selectedReportDate2 = isdownloadRequest ? dateSelection : selectedReportDate2;

  // const isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length ? ppmStatusInfo.data : false;
  let isData = consumptionDetailSummary && consumptionDetailSummary.data && consumptionDetailSummary.data.data ? consumptionDetailSummary.data.data : false;
  isData = isdownloadRequest ? downloadDetails : isData;

  return (
    <>
      <div id="export-consumption-detail-report">
        <table align="center">
          <tbody>
            <tr>
              <td colSpan={15}><b> Transfers Detail Report</b></td>
            </tr>
            <tr>
              <td>Date</td>
              <td colSpan={15}>
                <b>
                  {(selectedReportDate2 && selectedDate && selectedDate === 'Custom')
                    ? (selectedReportDate2) : (
                      <>
                        {' '}
                        {selectedReportDate2}
                      </>
                    )}
                </b>

              </td>
            </tr>
            <tr>
              <td>Filters</td>
              <td colSpan={15}>
                <b>
                  Operation Type :
                  {typeId && typeId.opType && typeId.opType.name
                    ? `${typeId.opType.name}, ` : 'All,'}
                  <br />
                  Product :
                  {typeId && typeId.productId && typeId.productId.length > 0
                    ? (typeId.productId.map((pd) => (
                      <span>
                        {pd.name}
                        ,
                      </span>
                    ))) : 'All,'}
                  <br />
                  Product Category :
                  {typeId && typeId.productCategoryId && typeId.productCategoryId.length > 0
                    ? (typeId.productCategoryId.map((pd) => (
                      <span>
                        {pd.name}
                        ,
                      </span>
                    ))) : 'All,'}
                  <br />
                  Vendor Name :
                  {typeId && typeId.vendorId && typeId.vendorId.length > 0
                    ? (typeId.vendorId.map((pd) => (
                      <span>
                        {pd.name}
                        ,
                      </span>
                    ))) : 'All,'}
                  <br />
                  Department :
                  {' '}
                  {typeId && typeId.departmentValue && typeId.departmentValue.length > 0
                    ? (typeId.departmentValue.map((pd) => (
                      <span>
                        {pd.name}
                        ,
                      </span>
                    ))) : 'All'}
                </b>
              </td>
            </tr>
          </tbody>
        </table>

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
                    {isStock && (<td style={tabletd}>{sd.opening_stock ? parseFloat(sd.opening_stock).toFixed(2) : 0.00}</td>)}
                    <td style={tabletd}>{parseFloat(getStockCount(sd)).toFixed(2)}</td>
                    {sd.product_list.map((item) => <td style={tabletd}>{item}</td>)}
                    {isStock && (
                    <>
                      <td style={tabletd}>{parseFloat(getStockCount1(sd)).toFixed(2)}</td>
                      <td style={tabletd}>{parseFloat(getStockCount2(sd)).toFixed(2)}</td>
                      <td style={tabletd}>{sd.scrap_total ? parseFloat(sd.scrap_total).toFixed(2) : 0.00}</td>
                      <td style={tabletd}>{sd.stock_audit_total ? parseFloat(sd.stock_audit_total).toFixed(2) : 0.00}</td>
                      <td style={tabletd}>{sd.closing_stock ? parseFloat(sd.closing_stock).toFixed(2) : 0.00}</td>
                    </>
                    )}
                    <td style={tabletd}>{parseFloat(sd.unit_rate).toFixed(2)}</td>
                    <td style={tabletd}>{parseFloat(sd.total_cost).toFixed(2)}</td>
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
