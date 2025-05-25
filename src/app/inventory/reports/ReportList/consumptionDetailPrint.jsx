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
import ChecklistExport from './consumptionDetailExcelPrint';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};


const ConsumptionDetailPrint = (props) => {
  const {
    ppmStatusInfo, typeId, isStock, showObservations, tableHeaders, selectedDate, isdownloadRequest, downloadDetails,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const { consumptionDetailSummary } = useSelector((state) => state.inventory);



  let isData = consumptionDetailSummary && consumptionDetailSummary.data && consumptionDetailSummary.data.data ? consumptionDetailSummary.data.data : false;
  isData = isdownloadRequest ? downloadDetails : isData;

  const columnSize = 5;
  const splitData = (d) => {
    const splittedArrays = [];
    for (let i = 0; i < d.length;) {
      splittedArrays.push(d.slice(i, i += columnSize));
    }
    return splittedArrays;
  };

  const modifyQuestionData = (array) => {
    const d = array;
    const splittedDayList = [];
    for (let i = 0; i < d.length; i += 1) {
      const dL = splitData(d[i].day_list);
      d[i].day_list_new = dL;
      splittedDayList.push(d[i]);
    }
    return splittedDayList;
  };






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

  return (
    <>
      <div id="print-consumption-detail-report">
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
                <h4 style={{ textAlign: 'center' }}>Consumption Detail Summary Report</h4>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="mt-2 ml-2">
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
                    {/* <tr>
                      <td style={tabletd}>
                        <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>Asset Name : </span>
                        {pd[0].asset_name}
                      </td>
                      <td style={tabletd}>
                        <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>Asset ID : </span>
                        {pd[0].asset_id}
                      </td>
                      <td style={tabletd}>
                        <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>Location : </span>
                        {pd[0].asset_category}
                      </td>
                      <td style={tabletd}>
                        <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Scheduler : </span>
                        {pd[0].group_name ? pd[0].group_name : '-'}
                      </td>
                    </tr> */}
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport  isStock={isStock} isdownloadRequest={isdownloadRequest} typeId={typeId} inspectionOrders={consumptionDetailSummary} showObservations={showObservations} tableHeaders={tableHeaders} selectedDate={selectedDate} />
    </>
  );
};

ConsumptionDetailPrint.propTypes = {
  ppmStatusInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default ConsumptionDetailPrint;
