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
  getOperationsExport,
} from '../../adminSetup/maintenanceConfiguration/maintenanceService';
import {
  getLocalTime, savePdfContent,
  getAllowedCompanies, getTotalCount,
  getColumnArrayById,
  queryGenerator, getDefaultNoValue,
} from '../../util/appUtils';
import {
  getMTName,
} from '../../workorders/utils/utils';
import {
  filterStringGeneratorAdminSetup,
} from '../../preventiveMaintenance/utils/utils';
import { getExportFileName } from '../../util/getDynamicClientData';

const appModels = require('../../util/appModels').default;

const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, rows,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Work_Permit_Operations')

  const [columns, setColumns] = useState(fields);

  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmCount, operationExportData, ppmFilters,
  } = useSelector((state) => state.maintenance);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (ppmCount)) {
      const offsetValue = 0;
      const statusValues = ppmFilters.statuses ? getColumnArrayById(ppmFilters.statuses, 'id') : [];
      const customFiltersData = ppmFilters.customFilters ? queryGenerator(ppmFilters.customFilters) : '';
      dispatch(getOperationsExport(companies, appModels.TASK, getTotalCount(ppmCount), offsetValue, columns, statusValues, customFiltersData, rows));
    }
  }, [userInfo, ppmCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('type_category'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.typeFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('company_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.companyFields);
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
  const appliedFilters = filterStringGeneratorAdminSetup(ppmFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && operationExportData && operationExportData.data && operationExportData.data.length > 0) {
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
  }, [fields, operationExportData]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (operationExportData && operationExportData.data && operationExportData.data.length > 0) {
        operationExportData.data.map((data) => {
          data.maintenance_type = getMTName(data.maintenance_type);
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
      savePdfContent(' Operation', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      const currentDate = getLocalTime(new Date());
      const title = `PPM_Operations_on_${currentDate}`;
      exportTableToExcel('print_report', title);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = operationExportData && operationExportData.loading;

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
      {operationExportData && operationExportData.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={operationExportData} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr>
                  <td>Company</td>
                  <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel' && (
            <DataTable columns={checkFieldExists(dataFields)} data={operationExportData && operationExportData.data ? operationExportData.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="PPM_Operations_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
};

export default DataExport;
