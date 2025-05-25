/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
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
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import tableFields from './tableFields.json';
import {
  getPreventiveExport,
} from '../ppmService';
import {
  filterStringGenerator,
  getPriorityLabel,
  getPpmCategoryLabel,
  getppmLabel,
} from '../utils/utils';
import {
  getLocalTime, getColumnArrayById, queryGenerator, getColumnArray, savePdfContent,
  getAllowedCompanies, getDefaultNoValue, queryGeneratorV1,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import { getExportFileName } from '../../util/getDynamicClientData';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, isInspection, apiFields, sortedValue, rows,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isInspection?'Inspection_Schedules':'PPM_Schedules')
  const [columns, setColumns] = useState(fields);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    ppmCount, ppmFilter, ppmExportInfo, ppmRows,
  } = useSelector((state) => state.ppm);

  const dataFields = isInspection ? tableFields.inspFields : tableFields.fields;

  useEffect(() => {
    setColumns(columns);
  }, [fields]);
  
  useEffect(() => {
    if ((userInfo && userInfo.data) && (ppmCount && ppmCount.data && ppmCount.data.length)) {
      const offsetValue = 0;
      // const rows = ppmRows.rows ? ppmRows.rows : [];
      const customFiltersQuery = ppmFilter && ppmFilter.customFilters ? queryGeneratorV1(ppmFilter.customFilters) : '';
      const ppmCountValue = ppmCount && ppmCount.data && ppmCount.data.length ? ppmCount.data.length : 0;
      dispatch(getPreventiveExport(companies, appModels.PPMCALENDAR, ppmCountValue, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, isInspection));
    }
  }, [userInfo, ppmCount, ppmFilter]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('maintenance_team_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.teamFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('company_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.companyFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('category_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.categoryFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('ppm_by'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.performedFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('create_date'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.createFields);
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
  const appliedFilters = filterStringGenerator(ppmFilter);

  useEffect(() => {
    if (fields && fields.length > 0 && ppmExportInfo && ppmExportInfo.data && ppmExportInfo.data.length > 0) {
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
  }, [fields, ppmExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (ppmExportInfo && ppmExportInfo.data && ppmExportInfo.data.length > 0) {
        ppmExportInfo.data.map((data) => {
          data.priority = getPriorityLabel(data.priority);
          data.category_type = getPpmCategoryLabel(data.category_type);
          data.ppm_by = getppmLabel(data.ppm_by);
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
          return buildBodyObj;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent(isInspection ? 'Inspection Schedule' : 'PPM Schedule', pdfHeaders, pdfBody,`${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  return (
    <Row>
      <Col md="12" sm="12" lg="6" xs="12">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
          <h5>PDF</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={ppmExportInfo && ppmExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(ppmExportInfo && ppmExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="12" sm="12" lg="6" xs="12">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <h5>Excel</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={ppmExportInfo && ppmExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(ppmExportInfo && ppmExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {ppmExportInfo && ppmExportInfo.err && (
      <Col md="12" sm="12" lg="12" xs="12">
        <SuccessAndErrorFormat response={ppmExportInfo} />
      </Col>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
            <tr><td style={{ textAlign: 'center' }} colSpan={5}><b> PPM Schedule Report </b></td></tr>
              <tr>
                <td>Company</td>
                <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
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
            <DataTable columns={checkFieldExists(dataFields)} data={ppmExportInfo && ppmExportInfo.data ? ppmExportInfo.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Preventive_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  isInspection: PropTypes.bool,
};

DataExport.defaultProps = {
  isInspection: false,
};

export default DataExport;
