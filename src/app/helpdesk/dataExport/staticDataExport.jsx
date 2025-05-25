/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';

import DataTable from '@shared/dataTable';
import uniqBy from 'lodash/lodash';
import uniq from 'lodash/uniqBy';
import tableFields from './tableFields.json';
import {
  filterStringGeneratorReport,
  getIssueTypeName,
  getTicketChannelFormLabel,
  filterStringGeneratorDateReport,
  filterStringGeneratorDateTempReport,
} from '../utils/utils';
import {
  saveExtraLargPdfContent,
  getDefaultNoValue, truncateHTMLTags, extractValueObjectsDisplay, getCompanyTimezoneDate,
  isJsonString,
  getTenentOptions,
  exportExcelTableToXlsx,
  getJsonString,
  getModuleDisplayName,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import { getExportFileName } from '../../util/getDynamicClientData';

const tabletdfont = {
  fontFamily: 'Roboto Condensed',
};

const StaticDataExport = (props) => {
  const {
    afterResets, fields, isIncident, ticketData, exportType, activeDateFilter, setExportType, exportTrue,
    activeFilter, activeTemplate,
  } = props;

  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isIncident ? 'Incidents' : 'Tickets');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    helpdeskReportFilters, helpdeskDetailReportInfo, moduleFilters,
    maintenanceConfigurationData, tenantConfig,
  } = useSelector((state) => state.ticket);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  let isTenant = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].tenant_visible && maintenanceConfigurationData.data[0].tenant_visible !== 'None';

  const isTicketTypem = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].ticket_type_visible;

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  let isChannel = configData && configData.channel_visible !== 'None';
  let isTeam = configData && configData.maintenance_team_visible !== 'None';
  let isTicketType = isTicketTypem && isTicketTypem !== 'None';

  if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig)) {
    const tConfig = getTenentOptions(userInfo, tenantConfig);
    isTenant = tConfig.tenant_visible !== 'None';
    isChannel = tConfig.channel_visible !== 'None';
    isTicketType = tConfig.ticket_type_visible !== 'None';
    isTeam = tConfig.maintenance_team_visible !== 'None';
  }

  function getActiveDataFields() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    let fData = data.filter(
      (item) => item.domain === activeFilter,
    );
    if (activeTemplate) {
      fData = data.filter(
        (item) => item.name === activeTemplate,
      );
    }
    return fData && fData.length && fData[0].custom_fields && isJsonString(fData[0].custom_fields) && getJsonString(fData[0].custom_fields).field_mappings ? getJsonString(fData[0].custom_fields).field_mappings : false;
  }

  function getActiveFilterName() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    const fData = data.filter(
      (item) => item.domain === activeFilter,
    );
    return fData && fData.length && fData[0].name ? fData[0].name : '';
  }

  function getActiveFilterFields() {
    const data = moduleFilters && moduleFilters.data ? moduleFilters.data : [];
    const fData = data.filter(
      (item) => item.domain === activeFilter,
    );
    return fData && fData.length && fData[0].custom_fields && isJsonString(fData[0].custom_fields) && getJsonString(fData[0].custom_fields).fields ? getJsonString(fData[0].custom_fields).fields : false;
  }

  useEffect(() => {
    if (fields && fields.length) {
      let array = [];
      if (activeFilter && getActiveDataFields()) {
        const fData = getActiveDataFields();
        fData.forEach((element) => {
          array.push({ heading: element.headerName, property: element.field });
        });
      } else if (activeTemplate && getActiveDataFields()) {
        const fData = getActiveDataFields();
        fData.forEach((element) => {
          array.push({ heading: element.headerName, property: element.field });
        });
      } else if (!isIncident) {
        tableFields.fieldsStatic && tableFields.fieldsStatic.length && tableFields.fieldsStatic.map((field) => {
          const exportField = fields.find((tableField) => tableField === field.property);
          if (exportField) {
            array.push(field);
          }
        });
      } else {
        tableFields.incidentFieldsStatic && tableFields.incidentFieldsStatic.length && tableFields.incidentFieldsStatic.map((field) => {
          const exportField = fields.find((tableField) => tableField === field.property);
          if (exportField) {
            array.push(field);
          }
        });
      }
      const fieldsToRemove = [];

      if (!isVendorShow) fieldsToRemove.push('vendor_id');
      if (!isTenant) fieldsToRemove.push('tenant_name');
      if (!isTicketType) fieldsToRemove.push('ticket_type');
      if (!isChannel) fieldsToRemove.push('channel');
      if (!isTeam) fieldsToRemove.push('maintenance_team_id');

      if (fieldsToRemove.length > 0) {
        array = array.filter((col) => !fieldsToRemove.includes(col.property));
      }
      setDataFields(array, 'header');
    }
  }, [fields]);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

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
  const repData = helpdeskDetailReportInfo && helpdeskDetailReportInfo.data && helpdeskDetailReportInfo.data.length ? helpdeskDetailReportInfo.data : false;

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorReport(helpdeskReportFilters);

  useEffect(() => {
    if (fields && fields.length > 0) {
      const dataFieldArray = dataFields;
      const uniqFieldsArray = [];
      let pdfHeaderObj = '';
      if (columns.some((selectedValue) => selectedValue === 'id')) {
        pdfHeaderObj = {
          header: 'ID',
          dataKey: 'id',
        };
        uniqFieldsArray.push(pdfHeaderObj);
      }
      if (activeFilter && getActiveDataFields()) {
        const fData = getActiveDataFields();
        fData.map((item) => {
          pdfHeaderObj = {
            header: item.headerName,
            dataKey: item.field,
          };
          uniqFieldsArray.push(pdfHeaderObj);
        });
      } else if (activeTemplate && getActiveDataFields()) {
        const fData = getActiveDataFields();
        fData.map((item) => {
          pdfHeaderObj = {
            header: item.headerName,
            dataKey: item.field,
          };
          uniqFieldsArray.push(pdfHeaderObj);
        });
      } else {
        dataFieldArray.map((item) => {
          pdfHeaderObj = {
            header: item.heading,
            dataKey: item.property,
          };
          uniqFieldsArray.push(pdfHeaderObj);
        });
      }
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [dataFields]);

  useEffect(() => {
    if (helpdeskDetailReportInfo && helpdeskDetailReportInfo.loading) {
      setPdfBody([]);
    }
  }, [helpdeskDetailReportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (ticketData && ticketData.length > 0) {
        const exportData = JSON.parse(JSON.stringify(repData));
        exportData.map((data) => {
          data.asset_id = data.type_category === 'asset' ? data.asset_id : data?.equipment_location_id?.[1];
          data.issue_type = getIssueTypeName(data.issue_type);
          data.channel = getTicketChannelFormLabel(data.channel);
          data.description = data.description ? truncateHTMLTags(data.description) : '';
          data.requestee_id = extractValueObjectsDisplay(data.requestee_id) ? extractValueObjectsDisplay(data.requestee_id) : getDefaultNoValue(data.person_name);
          data.log_note = data.log_note ? truncateHTMLTags(data.log_note) : '';
          data.close_time = getCompanyTimezoneDate(data.close_time, userInfo, 'datetime');
          data.log_note_date = getCompanyTimezoneDate(data.log_note_date, userInfo, 'datetime');
          data.create_date = getCompanyTimezoneDate(data.create_date, userInfo, 'datetime');
          data.sla_end_date = getCompanyTimezoneDate(data.sla_end_date, userInfo, 'datetime');
          const buildBodyObj = pick(data, extractHeaderkeys);
          buildBodyObj.id = data.id;
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return null;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
        });
      }
    }
  }, [pdfHeader, ticketData, helpdeskReportFilters]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      saveExtraLargPdfContent(isIncident ? 'Incidents' : getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Helpdesk', 'display'), pdfHeaders, uniq(pdfBody, 'id'), `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
      if (afterResets) afterResets();
    } else if (exportType === 'excel') {
      exportExcelTableToXlsx('print_report', exportFileName);
      if (afterResets) afterResets();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  const defaultTimeZone = 'Asia/Kolkata';

  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone;

  return (
    <Row className="d-none">
      <Col md="12" sm="12" lg="12">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr>
                <td style={tabletdfont}>
                  <h3>
                    {userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}
                    {'    '}
                    {isIncident ? 'Incidents' : getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Helpdesk', 'display')}
                  </h3>
                </td>
              </tr>
              <tr />
              {activeFilter && (
              <tr>
                <td style={tabletdfont} colSpan={15}>
                  {getActiveFilterName()}
                </td>
              </tr>
              )}
              <tr>
                <td style={tabletdfont} colSpan={15}>
                  <span>Generated by : </span>
                  {'     '}
                  <span style={{ marginLeft: '5px' }}>{userInfo && userInfo.data ? userInfo.data.name : 'User'}</span>
                  {'     '}
                  <span style={{ marginLeft: '5px' }}>Created on : </span>
                  {'     '}
                  <span style={{ marginLeft: '5px' }}>{getCompanyTimezoneDate(new Date(), userInfo, 'datetime')}</span>
                </td>
              </tr>
              <tr>
                <td style={tabletdfont} colSpan={15}>
                  {activeDateFilter ? filterStringGeneratorDateTempReport(activeDateFilter, companyTimeZone, userInfo) : filterStringGeneratorDateReport(helpdeskReportFilters, companyTimeZone, userInfo)}
                </td>
              </tr>
              {appliedFilters && (
              <tr>
                <td style={tabletdfont} colSpan={15}>
                  {(appliedFilters) && (<span>Filters : </span>)}
                  {'     '}
                  {appliedFilters}
                </td>
              </tr>
              )}
              <tr>
                <td style={tabletdfont} colSpan={15}>
                  <span>Total Records : </span>
                  {'     '}
                  {ticketData && ticketData.length ? ticketData.length : 0}

                </td>
              </tr>
            </tbody>
          </table>
          )}
          <br />
          {exportType === 'excel' && (
          <DataTable
            columns={ticketData && ticketData.length ? dataFields : []}
            data={ticketData && ticketData.length ? uniq(pdfBody, 'id') : []}
            propertyAsKey="id"
          />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Ticket_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

StaticDataExport.propTypes = {
  afterResets: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  isIncident: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  ticketData: PropTypes.array,
};
StaticDataExport.defaultProps = {
  isIncident: false,
  ticketData: [],
};

export default StaticDataExport;
