/* eslint-disable arrow-body-style */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
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
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import uniqBy from 'lodash/lodash';
import tableFields from './exportFields.json';
import {
  saveExtraLargPdfContent, getDefaultNoValue,
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import { exportParentLocationData } from '../../utils/utils';
import { getExportFileName } from '../../../util/getDynamicClientData';
import QrExport from './qrExport';

const appModels = require('../../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, exportType, exportTrue,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Locations');
  const [columns, setColumns] = useState(fields);
  const [exportData, setExportData] = useState([]);
  const { userInfo } = useSelector((state) => state.user);
  const {
    allLocationsInfo,
  } = useSelector((state) => state.equipment);

  const dataFields = tableFields.fields;

  useEffect(() => {
    if (allLocationsInfo && allLocationsInfo.data) {
      setExportData(exportParentLocationData(allLocationsInfo.data));
    }
  }, [allLocationsInfo]);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  function checkExcelFieldExists(dataColumns) {
    let dataColumnsList = [];
    if (columns.some((selectedValue) => selectedValue === 'id')) {
      dataColumnsList = dataColumnsList.concat(tableFields.idFields);
      dataColumnsList = dataColumnsList.concat(tableFields.fields);
    } else {
      dataColumnsList = dataColumns;
    }

    return dataColumnsList;
  }

  function checkFieldExists(dataColumns) {
    const dataColumnsList = dataColumns;
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

  useEffect(() => {
    if (fields && fields.length > 0 && exportData && exportData.length > 0) {
      const dataFieldArray = checkFieldExists(dataFields);
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
  }, [fields, exportData]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (exportData && exportData.length > 0) {
        exportData.map((data) => {
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else if (typeof buildBodyObj[bodyData] === 'object') {
              buildBodyObj[bodyData] = buildBodyObj[bodyData] && buildBodyObj[bodyData].name;
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

  const handleQRExport = () => {
    setTimeout(() => {
      const content = document.getElementById('print_report');
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      if (afterReset) afterReset();
    }, 2000);
  };

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      saveExtraLargPdfContent('Locations', pdfHeaders, pdfBody, `${exportFileName}`, companyName);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'qr') {
      handleQRExport();
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  return (
    <Row>
      {allLocationsInfo && allLocationsInfo.err && (
        <span className="text-center">
          <SuccessAndErrorFormat response={allLocationsInfo} />
        </span>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b> Assets Report </b></td></tr>
                <tr>
                  <td>Company</td>
                  <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
              </tbody>
            </table>
          )}

          <br />
          {exportType === 'excel'
            ? (
              <DataTable
                columns={allLocationsInfo && allLocationsInfo.data && allLocationsInfo.data.length ? checkExcelFieldExists(dataFields) : []}
                data={allLocationsInfo && allLocationsInfo.data ? exportData : []}
                propertyAsKey="id"
              />
            )
            : ''}
          {exportType === 'qr'
            ? <QrExport data={allLocationsInfo && allLocationsInfo.data ? exportData : []} /> : ''}
        </div>
      </Col>
      <iframe name="print_frame" title="Equipments_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  categoryType: PropTypes.string,
};

DataExport.defaultProps = {
  categoryType: false,
};

export default DataExport;
