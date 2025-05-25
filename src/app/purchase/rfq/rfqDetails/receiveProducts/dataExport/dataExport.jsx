/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import tableFields from './tableFields.json';
import {
  getTransferExport, setInitialValues,
} from '../../../../purchaseService';
import {
  filterStringGeneratorTransfers, getNewArray,
} from '../../../../utils/utils';
import {
  queryGeneratorV1, savePdfContent,
  getDefaultNoValue,
} from '../../../../../util/appUtils';
import { getExportFileName } from '../../../../../util/getDynamicClientData';
import customDataDashboard from '../../../../../inventory/overview/data/customData.json';
import { InventoryModule } from '../../../../../util/field';

const appModels = require('../../../../../util/appModels').default;

// const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, apiFields, sortedValue, rows, code,
  } = props;
  const dispatch = useDispatch();
  const customNames = customDataDashboard.types;
  const exportFileName = getExportFileName(customNames[code] ? customNames[code].text : 'Transfer');

  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    transferFilters, transfersExportInfo, transfersRows, transfersCount,
    quotationDetails, transfersInfo,
  } = useSelector((state) => state.purchase);
  const { inventoryStatusDashboard } = useSelector((state) => state.inventory);

  const transferCount = transfersCount && transfersCount.length ? transfersCount.length : 0;

  function getStatusFieldName(strName) {
    let res = '';
    if (strName === 'Requested') {
      res = 'requested_display';
    } else if (strName === 'Approved') {
      res = 'approved_display';
    } else if (strName === 'Delivered') {
      res = 'delivered_display';
    } else if (strName === 'Rejected') {
      res = 'rejected_display';
    }
    return res;
  }

  function getStatusDynamicStaus(label) {
    let newStr = label;
    const dName = getStatusFieldName(label);
    const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const ogData = pickingData.filter((item) => (item.code === code));
    if (ogData && ogData.length && dName) {
      newStr = ogData[0][dName];
    }
    return newStr;
  }

  useEffect(() => {
    setColumns(columns);
  }, [fields]);
  // useEffect(() => {
  //   if (fields && fields.length) {
  //     const array = [];
  //     fields.map((field) => {
  //       const exportField = tableFields.fields.find((tableField) => tableField.property === field);
  //       // if (exportField && exportField.property === 'id') {
  //       //   array.unshift(exportField);
  //       // }
  //       if (exportField) {
  //         array.push(exportField);
  //       }
  //       // array = [...new Set(array)];
  //     });
  //     console.log(array);
  //     setDataFields(code === 'internal' ? tableFields.intFields : tableFields.fields);
  //   }
  // }, []);

  useEffect(() => {
    if (fields && fields.length && code !== 'internal') {
      let array = []
      tableFields.fields && tableFields.fields.length && tableFields.fields.map((field) => {
        let exportField = fields.find((tableField) => tableField === field.property)
        if (exportField) {
          array.push(field)
        }
      })
      setDataFields(array, 'headers')
    } else if (fields && fields.length && code === 'internal') {
      let array = [];
      fields.map((field) => {
        const exportField = tableFields.intFields.find((tableField) => tableField.property === field);
        if (exportField && exportField.property === 'id') {
          array.unshift(exportField);
        }
        if (exportField) {
          array.push(field)
        }
        array = [...new Set(array)];
      });
      setDataFields(array);
    }
  }, [])

  useEffect(() => {
    if ((userInfo && userInfo.data) && (transferCount)) {
      const offsetValue = 0;
      // const states = transferFilters.statuses ? getColumnArray(transferFilters.statuses, 'id') : [];
      // const orderes = transferFilters.orderes ? getColumnArrayById(transferFilters.orderes, 'id') : [];
      // const types = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorV1(transferFilters.customFilters) : '';
       const rows = transfersRows.rows ? transfersRows.rows : [];
      // const ids = quotationDetails && quotationDetails.data ? quotationDetails.data[0].picking_ids : false;
      dispatch(getTransferExport(userInfo.data.company.id, appModels.STOCK, transferCount, offsetValue, InventoryModule.inventoryApiFields, encodeURIComponent(customFilters), rows, sortedValue.sortBy, sortedValue.sortField, code));
    }
  }, [userInfo, transferCount, transferFilters]);

  useEffect(() => {
    if(!(transfersInfo && transfersInfo.data)){
      dispatch(getTransferExport([]));
    }
  }, [transfersInfo]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('dc_no')) && (code === 'incoming' || code === 'outgoing')) {
      dataColumnsList = dataColumnsList.concat(tableFields.dcFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('po_no')) && (code === 'incoming' || code === 'outgoing')) {
      dataColumnsList = dataColumnsList.concat(tableFields.poFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('expires_on')) && code !== 'outgoing') {
      dataColumnsList = dataColumnsList.concat(tableFields.exFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('location_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.sourceLocationFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('location_dest_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.destinationLocationFields);
    }
   
    return dataColumnsList;
  }

  function exportTableToExcel(tableID, fileTitle = '') {
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
  }

  const [exportType, setExportType] = useState('');

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorTransfers(transferFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && transfersExportInfo && transfersExportInfo.data && transfersExportInfo.data.length > 0) {
      const dataFieldArray = checkFieldExists(dataFields);
      const uniqFieldsArray = [];
      dataFieldArray.map((item) => {
        const pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [fields, transfersExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = transfersExportInfo && transfersExportInfo.data && transfersExportInfo.data.length > 0 ? getNewArray(transfersExportInfo.data) : [];
      if (exportData) {
        exportData.map((data) => {
          data.request_state = getStatusDynamicStaus(data.request_state);
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            }
            buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            return buildBodyObj;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
          return buildBodyObj;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent(customNames[code] ? customNames[code].text : 'Transfer', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  return (
    <Row>
      <Col md="12" sm="12" lg="6">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
          <h5>PDF</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={transfersExportInfo && transfersExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(transfersExportInfo && transfersExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="12" sm="12" lg="6">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <h5>Excel</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={transfersExportInfo && transfersExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(transfersExportInfo && transfersExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {transfersExportInfo && transfersExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={transfersExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>{exportFileName}</b></td></tr>
              <tr>
                <td>Company</td>
                <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>{appliedFilters && (<span>Filters</span>)}</td>
                <td colSpan={15}><b>{appliedFilters}</b></td>
              </tr>
            </tbody>
          </table>
          )}
          <br />
          {exportType === 'excel' && (
            // <DataTable
            //   columns={transfersInfo && transfersInfo.data && transfersInfo.data.length ? dataFields : []}
            //   data={transfersExportInfo && transfersExportInfo.data ? transfersExportInfo.data : []}
            //   propertyAsKey="id"
            // />
            <DataTable columns={checkFieldExists(dataFields)} data={transfersExportInfo && transfersExportInfo.data ? transfersExportInfo.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Vendor_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default DataExport;
