/* eslint-disable no-lone-blocks */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
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
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  getInboundMailExport, getOutboundMailExport,
} from '../mailService';

import {
  getLocalTime, savePdfContent,
  getAllowedCompanies, queryGeneratorV1,
  getDefaultNoValue, filterStringGeneratorDynamic, getCompanyTimezoneDate, extractTextObject,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import { exportingFieldsArray, getNewArray } from '../../purchase/utils/utils';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows,
    sortedValue, isOutbound,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isOutbound?'Outbound':'Inbound')
  const [columns, setColumns] = useState(fields);
  const [pdfBody, setPdfBody] = useState([]);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    mailInboundsCount,
    mailInboundFilters,
    mailInboundsExport,
    mailOutboundsCount,
    mailOutboundFilters,
    mailOutboundsExport,
  } = useSelector((state) => state.mailroom);
  const companies = getAllowedCompanies(userInfo);

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const mailRoomData = isOutbound ? mailOutboundsExport : mailInboundsExport;
  const mailRoomFilter = isOutbound ? mailOutboundFilters : mailInboundFilters;
  const mailRoomCount = isOutbound ? mailOutboundsCount : mailInboundsCount;
  const appliedFilters = filterStringGeneratorDynamic(mailRoomFilter);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if (fields && fields.length) {
      exportingFieldsArray(isOutbound ? tableFields.outboundFields : tableFields.inboundFields, fields, dataFields, setDataFields)
    }    
  }, [fields, isOutbound]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (mailInboundsCount && mailInboundsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = mailInboundFilters && mailInboundFilters.customFilters ? queryGeneratorV1(mailInboundFilters.customFilters) : '';
      dispatch(getInboundMailExport(companies, appModels.MAILINBOUND, mailInboundsCount.length, offsetValue, columns, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, mailInboundsCount, mailInboundFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (mailOutboundsCount && mailOutboundsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = mailOutboundFilters && mailOutboundFilters.customFilters ? queryGeneratorV1(mailOutboundFilters.customFilters) : '';
      dispatch(getOutboundMailExport(companies, appModels.MAILOUTBOUND, mailOutboundsCount.length, offsetValue, columns, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, mailOutboundsCount, mailOutboundFilters]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('courier_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.courierField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('recipient'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.typeField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('department_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.departmentField);
    }
    if (!isOutbound) {
      if (columns.some((selectedValue) => selectedValue.includes('collected_on'))) {
        dataColumnsList = dataColumnsList.concat(tableFields.deliverOnField);
      }
      if (columns.some((selectedValue) => selectedValue.includes('collected_by'))) {
        dataColumnsList = dataColumnsList.concat(tableFields.deliverByField);
      }
    } else {
      if (columns.some((selectedValue) => selectedValue.includes('delivered_on'))) {
        dataColumnsList = dataColumnsList.concat(tableFields.deliveredOnField);
      }
      if (columns.some((selectedValue) => selectedValue.includes('delivered_by'))) {
        dataColumnsList = dataColumnsList.concat(tableFields.deliveredByField);
      }
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

  useEffect(() => {
    if (fields && fields.length > 0 && mailRoomData && mailRoomData.data && mailRoomData.data.length > 0) {
      const dataFieldArray = checkFieldExists(dataFields);
      const uniqFieldarray = [];
      dataFieldArray.map((item) => {
        const pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldarray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldarray, 'header'));
    }
  }, [fields, mailRoomData]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = mailRoomData && mailRoomData.data && mailRoomData.data.length > 0 ? getNewArray(mailRoomData.data) : [];
      if (exportData) {
        exportData.map((data) => {
          data.received_on = getCompanyTimezoneDate(data.received_on, userInfo, 'datetime');
          data.delivered_on = getCompanyTimezoneDate(data.delivered_on, userInfo, 'datetime');
          data.collected_on = getCompanyTimezoneDate(data.collected_on, userInfo, 'datetime');
          data.sent_on = getCompanyTimezoneDate(data.sent_on, userInfo, 'datetime');
          data.employee_id = extractTextObject(data.employee_id);
          data.department_id = extractTextObject(data.department_id);
          data.collected_by = extractTextObject(data.collected_by);
          data.received_by = extractTextObject(data.received_by);
          data.sent_by = extractTextObject(data.sent_by);
          data.delivered_by = extractTextObject(data.delivered_by);
          data.courier_id = extractTextObject(data.courier_id);
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return buildBodyObj;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent(isOutbound ? 'Outbound' : 'Inbound', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      const currentDate = getLocalTime(new Date());
      exportTableToExcel('print_report', `${exportFileName}.pdf`);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = mailRoomData && mailRoomData.loading;

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
            disabled={loading && mailRoomCount && mailRoomCount.length <= 0}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(loading) ? (
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
            disabled={loading && mailRoomCount && mailRoomCount.length <= 0}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {mailRoomData && mailRoomData.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={mailRoomData} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>{isOutbound ? 'Outbound Report' : 'Inbound Report'}</b></td></tr>
              <tr>
                <td>Company</td>
                <td><b>{userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.name ? userInfo.data.company.name : 'Company'}</b></td>
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
            <DataTable
              columns={mailRoomData && mailRoomData.data && mailRoomData.data.length ? checkFieldExists(dataFields) : []}
              data={mailRoomData && mailRoomData.data ? mailRoomData.data : []}
              propertyAsKey="id"
            />
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
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  isOutbound: PropTypes.bool,
};

DataExport.defaultProps = {
  isOutbound: false,
};

export default DataExport;
