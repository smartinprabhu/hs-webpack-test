/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
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
import uniqBy from 'lodash/lodash';

import {
  getLocalTime,
  savePdfContent, getDefaultNoValue,
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import { getExportFileName } from '../../../util/getDynamicClientData';

// const dataFields

const DataExport = (props) => {
  const {
    afterReset, dateFilter, headers, exportData, report,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const reportHeading = report === 'MaterialIssued' ? 'Material Issued Report' : 'Material Received Report';
  const exportFileName = getExportFileName(report === 'MaterialIssued' ? 'Material_Issued_Report' : 'Material_Received_Report')

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
  function filterStringGenerator() {
    let filterTxt = '';

    if (dateFilter && dateFilter !== '') {
      filterTxt += 'Custom : ';
      filterTxt += dateFilter;
      filterTxt += ' | ';
    }
    return filterTxt;
  }
  const appliedFilters = filterStringGenerator();

  const [exportType, setExportType] = useState();

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  useEffect(() => {
    if (exportData && exportData.length > 0) {
      const dataFieldArray = headers;
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
  }, [exportData]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (exportData && exportData.length > 0) {
        exportData.map((data) => {
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
          });
          setPdfBody((state) => [...state, buildBodyObj]);
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent(reportHeading, pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  return (
    <Row>
      <Col md="6" sm="6" lg="6" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-2x" size="sm" icon={faFilePdf} />
          <p className="mb-0">PDF</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="6" sm="6" lg="6" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-2x" size="lg" icon={faFileExcel} />
          <p className="mb-0">Excel</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            onClick={() => {
              setExportType('excel');
            }}
          >
            Download
          </Button>
        </div>
      </Col>
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr>
                  <td>Company</td>
                  <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
                <tr>
                  <td>{appliedFilters && (<span>Filters</span>)}</td>
                  <td colSpan={7}><b>{appliedFilters}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel'
            ? (
              <DataTable
                columns={exportData && exportData.length ? headers : []}
                data={exportData && exportData.length ? exportData : []}
                propertyAsKey="id"
              />
            )
            : ''}
        </div>
      </Col>
      <iframe name="print_frame" title="Equipments_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  dateFilter: PropTypes.string.isRequired,
};

export default DataExport;
