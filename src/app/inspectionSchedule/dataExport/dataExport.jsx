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
  getInspectionCheckListExport,
} from '../inspectionService';
import {
  getWorkOrderPriorityText,
} from '../../workorders/utils/utils';

import {
  getLocalTime, savePdfContent,
  getAllowedCompanies, queryGeneratorV1,
  getCompanyTimezoneDate, getTimeFromDecimal,
  getDefaultNoValue, filterStringGeneratorDynamic,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import { InspectionModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows,
    sortBy, sortField, apiFields
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Inspection_Checklists')
  const [columns, setColumns] = useState(fields);
  const [pdfBody, setPdfBody] = useState([]);
  const [dataFields, setDataFields] = useState([])

  const { userInfo } = useSelector((state) => state.user);
  const {
    inspectionCount,
    inspectionExport,
    inspectionFilters,
  } = useSelector((state) => state.inspection);
  const companies = getAllowedCompanies(userInfo);

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorDynamic(inspectionFilters);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if (fields && fields.length) {
      let array = []
      tableFields.fields && tableFields.fields.length && tableFields.fields.map((field) => {
        let exportField = fields.find((tableField) => tableField === field.property)
        if (exportField) {
          array.push(field)
        }
      })
      setDataFields(array, 'header')
    }
  }, [])

  useEffect(() => {
    if ((userInfo && userInfo.data) && (inspectionCount && inspectionCount.length)) {
      const offsetValue = 0;
      setPdfBody([]);
      const customFiltersQuery = inspectionFilters && inspectionFilters.customFilters ? queryGeneratorV1(inspectionFilters.customFilters) : '';
      dispatch(getInspectionCheckListExport(companies, appModels.INSPECTIONCHECKLIST, inspectionCount.length, offsetValue, InspectionModule.inspectionApiFields, customFiltersQuery, rows, sortBy, sortField));
    }
  }, [userInfo, inspectionCount, inspectionFilters]);

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
    if (fields && fields.length > 0 && inspectionExport && inspectionExport.data && inspectionExport.data.length > 0) {
      const dataFieldArray = dataFields;
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
  }, [fields, inspectionExport]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (inspectionExport && inspectionExport.data && inspectionExport.data.length > 0) {
        inspectionExport.data.map((data) => {
          data.priority = getWorkOrderPriorityText(data.priority);
          data.commences_on = getCompanyTimezoneDate(data.commences_on, userInfo, 'datetime');
          data.starts_at = getTimeFromDecimal(data.starts_at);
          data.duration = getTimeFromDecimal(data.duration);
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
      savePdfContent('Inspection Checklist', pdfHeaders, pdfBody, `${exportFileName}`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_inspection', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = inspectionExport && inspectionExport.loading;

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
            disabled={loading}
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
            disabled={loading}
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
      {inspectionExport && inspectionExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={inspectionExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_inspection">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b> Inspection Checklists Report </b></td></tr>
                <tr>
                  <td>Company</td>
                  <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel' && (
            <DataTable columns={dataFields} data={inspectionExport && inspectionExport.data ? inspectionExport.data : []} propertyAsKey="id" />
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
};

export default DataExport;
