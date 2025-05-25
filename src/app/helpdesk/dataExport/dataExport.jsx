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

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import uniqBy from 'lodash/lodash';
import tableFields from './tableFields.json';
import {
  getTicketsExport,
} from '../ticketService';
import {
  filterStringGenerator,
  getIssueTypeName,
  getTicketChannelFormLabel,
  convertTicketFields,
} from '../utils/utils';
import {
  getLocalTime, getColumnArray, getColumnArrayById, queryGeneratorV1, saveLargPdfContent,
  getAllCompanies, getDefaultNoValue, truncateHTMLTags, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import { getExportFileName } from '../../util/getDynamicClientData';
import { HelpdeskModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, isIncident, apiFields,
  } = props;

  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isIncident ? 'Incidents' : 'Tickets');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    ticketsCount, helpdeskFilter, ticketsExportInfo, helpdeskRows, ticketsInfo,
  } = useSelector((state) => state.ticket);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (fields && fields.length) {
      const array = [];
      if (!isIncident) {
        tableFields.fields && tableFields.fields.length && tableFields.fields.map((field) => {
          const exportField = fields.find((tableField) => tableField === field.property);
          if (exportField) {
            array.push(field);
          }
        });
      } else {
        tableFields.incidentFields && tableFields.incidentFields.length && tableFields.incidentFields.map((field) => {
          const exportField = fields.find((tableField) => tableField === field.property);
          if (exportField) {
            array.push(field);
          }
        });
      }
      setDataFields(array, 'header');
    }
  }, []);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (ticketsCount && ticketsCount.length)) {
      const offsetValue = 0;
      const statusValues = helpdeskFilter && helpdeskFilter.states ? getColumnArray(helpdeskFilter.states, 'id') : [];
      const categories = helpdeskFilter && helpdeskFilter.categories ? getColumnArrayById(helpdeskFilter.categories, 'id') : [];
      const priorities = helpdeskFilter && helpdeskFilter.priorities ? getColumnArrayById(helpdeskFilter.priorities, 'id') : [];
      const maintenanceTeam = helpdeskFilter && helpdeskFilter.maintenanceTeam ? getColumnArrayById(helpdeskFilter.maintenanceTeam, 'id') : [];
      const region = helpdeskFilter && helpdeskFilter.region ? getColumnArrayById(helpdeskFilter.region, 'id') : [];
      const companyFilters = helpdeskFilter && helpdeskFilter.company ? getColumnArrayById(helpdeskFilter.company, 'id') : [];
      const subCategory = helpdeskFilter && helpdeskFilter.subCategory ? getColumnArrayById(helpdeskFilter.subCategory, 'id') : [];
      const customFilters = helpdeskFilter && helpdeskFilter.customFilters ? queryGeneratorV1(helpdeskFilter.customFilters) : '';
      const rows = helpdeskRows.rows ? helpdeskRows.rows : [];
      dispatch(getTicketsExport(companies, appModels.HELPDESK, ticketsCount.length, offsetValue, HelpdeskModule.helpdeskApiFields, statusValues, categories, priorities, customFilters, rows, isIncident, sortedValue.sortBy, sortedValue.sortField, maintenanceTeam, region, companyFilters, subCategory));
    }
  }, [userInfo, ticketsCount]);

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
  const appliedFilters = filterStringGenerator(helpdeskFilter);

  useEffect(() => {
    if (fields && fields.length > 0 && ticketsExportInfo && ticketsExportInfo.data && ticketsExportInfo.data.length > 0) {
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
      dataFieldArray.map((item) => {
        pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [fields, ticketsExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (ticketsExportInfo && ticketsExportInfo.data && ticketsExportInfo.data.length > 0) {
        convertTicketFields(ticketsExportInfo.data).map((data) => {
          data.asset_id = data.type_category === 'asset' ? data.asset_id : data.equipment_location_id;
          data.issue_type = getIssueTypeName(data.issue_type);
          data.channel = getTicketChannelFormLabel(data.channel);
          data.region_id = data.region_id;
          data.city_name = data.city_name;
          data.state_name = data.state_name;
          data.description = data.description ? truncateHTMLTags(data.description) : '';
          data.log_note = data.log_note ? truncateHTMLTags(data.log_note) : '';
          data.close_time = data.close_time ? getCompanyTimezoneDate(data.close_time, userInfo, 'datetime') : '-';
          data.log_note_date = data.log_note_date ? getCompanyTimezoneDate(data.log_note_date, userInfo, 'datetime') : '-';
          data.create_date = data.create_date ? getCompanyTimezoneDate(data.create_date, userInfo, 'datetime') : '-';
          data.sla_end_date = data.sla_end_date ? getCompanyTimezoneDate(data.sla_end_date, userInfo, 'datetime') : '-';
          const buildBodyObj = pick(data, extractHeaderkeys);
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
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      saveLargPdfContent(isIncident ? 'Incidents' : 'Helpdesk', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
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
            disabled={ticketsExportInfo && ticketsExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(ticketsExportInfo && ticketsExportInfo.loading) ? (
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
            disabled={ticketsExportInfo && ticketsExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(ticketsExportInfo && ticketsExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {ticketsExportInfo && ticketsExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={ticketsExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr>
                  <td><b>{isIncident ? 'Incidents Report' : 'Helpdesk Report'}</b></td>
                </tr>
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
            <DataTable
              columns={ticketsInfo && ticketsInfo.data && ticketsInfo.data.length ? dataFields : []}
              data={ticketsExportInfo && ticketsExportInfo.data ? convertTicketFields(ticketsExportInfo.data) : []}
              propertyAsKey="id"
            />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Ticket_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  isIncident: PropTypes.bool,
};
DataExport.defaultProps = {
  isIncident: false,
};

export default DataExport;
