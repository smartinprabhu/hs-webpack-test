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

import { setInitialValues } from '../../../purchase/purchaseService';
// import { filterStringGenerator } from '../../utils/utils';
import {
  saveExtraLargPdfContent,
  getAllowedCompanies, getDefaultNoValue,
  extractNameObject, getCompanyTimezoneDate, getStartTime, getEndTime,
  addOneWeek,
  substractOneWeek,
  exportExcelTableToXlsx,
} from '../../../util/appUtils';
import { getPPMChecklistsExportData, resetPPMhecklistExport } from '../../ppmService';
import { filterStringGenerator } from '../../../inspectionSchedule/utils/utils';
import { getExportFileName } from '../../../util/getDynamicClientData';

const appModels = require('../../../util/appModels').default;

let dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, exportTrue, exportType,
    selectedFilter, viewModal, selectedField, groupFilters,
    customDataGroup, isFilterApply, requestOptions, viewHead, showExport,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('PPM_Schedule_Report');

  const [columns, setColumns] = useState(fields);
  const [excelData, setExcelData] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmChecklistCount,
    ppmChecklistLoading,
  } = useSelector((state) => state.inspection);

  const {
    ppmChecklistExportInfo,
  } = useSelector((state) => state.ppm);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useMemo(() => {
    if (ppmChecklistCount && !ppmChecklistCount.loading && showExport === true) {
      dispatch(resetPPMhecklistExport([]));
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      let start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      let end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD HH:mm:ss');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD HH:mm:ss');
      }

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD HH:mm:ss');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD HH:mm:ss');
      }
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'In Progress'] : selectedFilter;
      dispatch(getPPMChecklistsExportData(companies, appModels.PPMWEEK, start, end, isAll, selectedField, groupFilters, viewType === 5 ? 'yes' : false, requestOptions));
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
  const appliedFilters = filterStringGenerator(selectedFilter, viewModal, selectedField, groupFilters, userInfo, customDataGroup, selectedField === 'schedule_period_id' ? 'Schedule' : selectedField === 'maintenance_team_id' ? 'Maintenance Team' : selectedField === 'vendor_name' ? 'Vendor' : 'Asset', viewHead, requestOptions);

  useEffect(() => {
    if (dataFields && dataFields.length > 0 && ppmChecklistExportInfo && ppmChecklistExportInfo.data && ppmChecklistExportInfo.data.length > 0) {
      const hasValidVendor = ppmChecklistExportInfo.data.some((item) => item.vendor_name);

      dataFields = hasValidVendor
        ? tableFields.fields
        : tableFields.fields.filter((field) => field.property !== 'vendor_name');
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
      setExcelData(JSON.stringify(ppmChecklistExportInfo.data));
    }
  }, [dataFields, ppmChecklistExportInfo]);

  useEffect(() => {
    if (pdfHeader?.__wrapped__?.length > 0) {
      setPdfBody([]); // Reset state
  
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
  
      if (ppmChecklistExportInfo?.data?.length > 0) {
        const tempPdfBody = ppmChecklistExportInfo.data.map((data, index) => {
          // ✅ Safely extract values to avoid undefined errors
          const formattedData = {
            ...data,
            id: index + 1,
            maintenance_team_id: extractNameObject(data.maintenance_team_id, 'name'),
            asset_code: data.asset_code ?? data.equipment_id?.equipment_seq, // ✅ Using `?.` to prevent errors
            schedule_period_id: extractNameObject(data.schedule_period_id, 'name'),
            starts_on: getCompanyTimezoneDate(data.starts_on, userInfo, 'date'),
            ends_on: getCompanyTimezoneDate(data.ends_on, userInfo, 'date'),
            company_id: data.order_id?.date_execution
              ? getCompanyTimezoneDate(data.order_id.date_execution, userInfo, 'datetime')
              : '',
          };
  
          // ✅ Use `pick` to get specific keys
          const buildBodyObj = pick(formattedData, extractHeaderkeys);
  
          // ✅ Use `forEach` instead of `map` since we're modifying an object
          Object.keys(buildBodyObj).forEach((key) => {
            buildBodyObj[key] = Array.isArray(buildBodyObj[key])
              ? buildBodyObj[key][1]
              : getDefaultNoValue(buildBodyObj[key]);
          });
  
          return buildBodyObj;
        });
  
        // ✅ Update state **once** after processing all data
        setPdfBody(tempPdfBody);
      }
    }
  }, [pdfHeader]);
  

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      saveExtraLargPdfContent('PPM Schedule', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportExcelTableToXlsx('print_report', exportFileName);
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
                  <td colSpan="15"><b>{appliedFilters}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel' && (
            <DataTable columns={dataFields} data={ppmChecklistExportInfo && ppmChecklistExportInfo.data ? JSON.parse(excelData) : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="PPM_Schedule_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
};

export default DataExport;
