/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';
import moment from 'moment';

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import tableFields from './tableFields.json';
import {
  getInspectionViewerGroupsExport,
  getInspectionViewerGroupsCount,
} from '../../inspectionService';
import { setInitialValues } from '../../../purchase/purchaseService';
// import { filterStringGenerator } from '../../utils/utils';
import {
  getLocalTime, saveExtraLargPdfContent,
  getAllowedCompanies, getDefaultNoValue,
  extractNameObject, getCompanyTimezoneDate,
  getColumnArrayById,
} from '../../../util/appUtils';
import { filterStringGenerator } from '../../utils/utils';
import { getExportFileName } from '../../../util/getDynamicClientData';

const appModels = require('../../../util/appModels').default;

const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, exportTrue, exportType,
    selectedFilter, viewModal, selectedField, groupFilters, assetIds,
    customDataGroup, enforceField, inspectionGroup, labelField, showExport, isFilterApply, viewHead
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Inspection_checklists')
  const [columns, setColumns] = useState(fields);

  const { inspectionTeamsDashboard } = useSelector((state) => state.ppm);

  const teamsList = getColumnArrayById(inspectionTeamsDashboard && inspectionTeamsDashboard.data ? inspectionTeamsDashboard.data : [], 'id');

  const { userInfo } = useSelector((state) => state.user);
  const {
    inspectionChecklistCount,
    inspectionChecklistExport,
    inspectionChecklistCountLoading,
    inspectionDashboardFilters
  } = useSelector((state) => state.inspection);

  const companies = getAllowedCompanies(userInfo);

  let viewModalObj = {}
  viewModalObj.startDate = inspectionDashboardFilters && inspectionDashboardFilters.data ? inspectionDashboardFilters.data[0].selectDate[0] : moment(viewModal.startDate).format('YYYY-MM-DD')

  viewModalObj.endDate = inspectionDashboardFilters && inspectionDashboardFilters.data ? inspectionDashboardFilters.data[0].selectDate[1] : moment(viewModal.endDate).format('YYYY-MM-DD')

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useMemo(() => {
    if ((userInfo && userInfo.data) && showExport) {
      const isAll = selectedFilter && selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Abnormal'] : selectedFilter;

      dispatch(getInspectionViewerGroupsCount(companies, appModels.INSPECTIONCHECKLISTLOGS, viewModalObj.startDate, viewModalObj.endDate, isAll, selectedField, groupFilters, teamsList, assetIds, enforceField, inspectionGroup));
    }
  }, [selectedFilter, isFilterApply, viewHead, showExport]);

  useMemo(() => {
    if (inspectionChecklistCount && inspectionChecklistCount.length && !inspectionChecklistCount.loading) {
      const offsetValue = 0;
      const isAll = selectedFilter && selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Abnormal'] : selectedFilter;

      dispatch(getInspectionViewerGroupsExport(companies, appModels.INSPECTIONCHECKLISTLOGS, viewModalObj.startDate, viewModalObj.endDate, isAll, selectedField, groupFilters, offsetValue, inspectionChecklistCount.length, teamsList, assetIds, enforceField, inspectionGroup));
    }
  }, [inspectionChecklistCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (selectedFilter && selectedFilter.length && selectedFilter.some((selectedValue) => selectedValue.includes('Completed'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.actualStartFields);
      dataColumnsList = dataColumnsList.concat(tableFields.actualEndFields);
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


  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  let appliedFilters = filterStringGenerator(selectedFilter, viewModalObj, selectedField, groupFilters, userInfo, customDataGroup, labelField, viewHead);
  if (enforceField === 'enforce_time') {
    appliedFilters = `${appliedFilters} | With Enforce Time`
  } else if (enforceField === 'no_enforce_time') {
    appliedFilters = `${appliedFilters} | Without Enforce Time`
  }
  if (inspectionGroup === 'group_inspection') {
    appliedFilters = `${appliedFilters} | Group Inspection`
  } else if (inspectionGroup === 'individual_inspection') {
    appliedFilters = `${appliedFilters} | Individual Inspection`
  }

  useEffect(() => {
    if (dataFields && dataFields.length > 0 && inspectionChecklistExport && inspectionChecklistExport.data && inspectionChecklistExport.data.length > 0) {
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
  }, [dataFields, inspectionChecklistExport]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      setPdfBody([])
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (inspectionChecklistExport && inspectionChecklistExport.data && inspectionChecklistExport.data.length > 0) {
        inspectionChecklistExport.data.map((data, index) => {
          data.id = (index + 1);
          data.start_datetime = getCompanyTimezoneDate(data.start_datetime, userInfo, 'datetime');
          data.end_datetime = getCompanyTimezoneDate(data.end_datetime, userInfo, 'datetime');
          data.date_start_execution = getCompanyTimezoneDate(data.date_start_execution, userInfo, 'datetime');
          data.date_execution = getCompanyTimezoneDate(data.date_execution, userInfo, 'datetime');
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
      saveExtraLargPdfContent('Inspection Checklists', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);


  return (
    <Row>
      {inspectionChecklistExport && inspectionChecklistExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={inspectionChecklistExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b> Inspection Checklist Report </b></td></tr>
                <tr>
                  <td>Company</td>
                  <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
                <tr>
                  <td>{appliedFilters && (<span>Filters</span>)}</td>
                  <td colSpan="5"><b>{appliedFilters}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel' && (
            <DataTable columns={checkFieldExists(dataFields)} data={inspectionChecklistExport && inspectionChecklistExport.data ? inspectionChecklistExport.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Inspection_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
};

export default DataExport;
