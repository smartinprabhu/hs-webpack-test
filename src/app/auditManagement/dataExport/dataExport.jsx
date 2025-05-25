/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';
import moment from 'moment';

import DataTable from '@shared/dataTable';
import tableFields from './tableFields.json';

import { setInitialValues } from '../../purchase/purchaseService';
// import { filterStringGenerator } from '../../utils/utils';
import {
  saveExtraLargPdfContent,
  getAllCompanies, getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate, getStartTime, getEndTime,
  getColumnArrayByIdWithArray,
} from '../../util/appUtils';
import { getAuditExportViewer } from '../auditService';
import { filterStringGenerator } from '../../inspectionSchedule/utils/utils';
import { getExportFileName } from '../../util/getDynamicClientData';
import customDatas from '../data/customData.json';

const appModels = require('../../util/appModels').default;

const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, exportTrue, exportType,
    selectedFilter, viewModal, assetIds, selectedField, groupFilters,
    customDataGroup, groupField, totalLen, customSelectedOptions, viewHead, showExport,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Audit_Schedule_Report');

  const [columns, setColumns] = useState(fields);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    auditViewerExportInfo,
  } = useSelector((state) => state.hxAudits);

  const companies = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useMemo(() => {
    if (totalLen && showExport === true) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const customData = getColumnArrayByIdWithArray(customSelectedOptions, selectedField);

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Started', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'] : selectedFilter;

      dispatch(getAuditExportViewer(companies, appModels.HXAUDIT, groupField, start, end, isAll, selectedField, customData, assetIds, totalLen));
    }
  }, [showExport]);

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

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  function getFilterName(val) {
    let res = '';
    const data = customDatas && customDatas.groupFilters ? customDatas.groupFilters : [];
    const newData = data.filter((item) => item.value === val);
    if (newData && newData.length) {
      res = newData[0].label;
    }
    if (val === 'company_id') {
      res = 'Site';
    }
    return res;
  }

  const appliedFilters = filterStringGenerator(selectedFilter, viewModal, selectedField, groupFilters, userInfo, customDataGroup, getFilterName(selectedField), viewHead);

  useEffect(() => {
    if (dataFields && dataFields.length > 0 && auditViewerExportInfo && auditViewerExportInfo.data && auditViewerExportInfo.data.length > 0) {
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
  }, [dataFields, auditViewerExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      setPdfBody([]);
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (auditViewerExportInfo && auditViewerExportInfo.data && auditViewerExportInfo.data.length > 0) {
        auditViewerExportInfo.data.map((data, index) => {
          data.audit_system_id = extractTextObject(data.audit_system_id);
          data.audit_category_id = extractTextObject(data.audit_category_id);
          data.audit_spoc_id = extractTextObject(data.audit_spoc_id);
          data.company_id = extractTextObject(data.company_id);
          data.department_id = extractTextObject(data.department_id);
          data.planned_start_date = getCompanyTimezoneDate(data.planned_start_date, userInfo, 'datetime');
          data.planned_start_date = getCompanyTimezoneDate(data.planned_start_date, userInfo, 'datetime');
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
      saveExtraLargPdfContent('Audits Schedule', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
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
          {exportType === 'excel' && (
            <DataTable columns={dataFields} data={auditViewerExportInfo && auditViewerExportInfo.data ? auditViewerExportInfo.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Audit_Schedule_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
};

export default DataExport;
