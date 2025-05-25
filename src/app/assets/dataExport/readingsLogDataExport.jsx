/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
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
import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate
} from '../../util/appUtils';


import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import uniqBy from 'lodash/lodash';
import tableFields from './tableFields.json';
import {
  getReadingsLogExport,
} from '../equipmentService';
import {
  filterStringGenerator,
} from '../utils/utils';
import {
  getLocalTime, queryGenerator,
  savePdfContent, getColumnArrayById,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import { getExportFileName } from '../../util/getDynamicClientData';

const appModels = require('../../util/appModels').default;

const ReadingsLogDataExport = (props) => {
  const {
    afterReset, fields, editId, type, sortBy, sortField
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('ReadingsLog')

  const [columns, setColumns] = useState(fields);
  const dataFields = type === 'space' ? tableFields.readingsLogFieldsSpace : tableFields.readingsLogFields;
  const { userInfo } = useSelector((state) => state.user);
  const {
    readingsLogCount, readingsLogFilters, readingsLogExportInfo, readingsLog,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (readingsLogCount && readingsLogCount.length)) {
      const offsetValue = 0;
      const readings = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGenerator(readingsLogFilters.customFilters) : '';
      const rows = [];
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLogExport(editId, appModels.READINGSLOG, readingsLogCount.length, offsetValue, fields, domain, readings, customFilters, rows, sortBy, sortField));
    }
  }, [userInfo, readingsLogCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('planning_run_result'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.runFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('order_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.orderFields);
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

  const [exportType, setExportType] = useState();

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGenerator(readingsLogFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && readingsLogExportInfo && readingsLogExportInfo.data && readingsLogExportInfo.data.length > 0) {
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
  }, [fields, readingsLogExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (readingsLogExportInfo && readingsLogExportInfo.data && readingsLogExportInfo.data.length > 0) {
        readingsLogExportInfo.data.map((data) => {
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else if (bodyData === 'date') {
              buildBodyObj[bodyData] = getCompanyTimezoneDate(buildBodyObj[bodyData], userInfo, 'datetime')
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
      savePdfContent('Readings Log', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_excel_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const getExcelData = (data) => {
    data.map((item) => {
      item.date = getCompanyTimezoneDate(item.date, userInfo, 'datetime')
    })
    return data
  }
  return (
    <Row>
      <Col md="6" sm="6" lg="6" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="sm" icon={faFilePdf} />
          <h6>PDF</h6>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            disabled={readingsLogExportInfo && readingsLogExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(readingsLogExportInfo && readingsLogExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="6" sm="6" lg="6" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <h6>Excel</h6>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            disabled={readingsLogExportInfo && readingsLogExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(readingsLogExportInfo && readingsLogExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {readingsLogExportInfo && readingsLogExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={readingsLogExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_excel_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr>
                  <td>Company</td>
                  <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
                <tr>
                  <td>{appliedFilters && (<span>Filters</span>)}</td>
                  <td><b>{appliedFilters}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel'
            ? (
              <DataTable
                columns={readingsLog && readingsLog.data && readingsLog.data.length ? checkFieldExists(dataFields) : []}
                data={readingsLogExportInfo && readingsLogExportInfo.data ? getExcelData(readingsLogExportInfo.data) : []}
                propertyAsKey="id"
              />
            )
            : ''}
        </div>
      </Col>
      <iframe name="print_frame" title="Readings_Log_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

ReadingsLogDataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  editId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReadingsLogDataExport;
