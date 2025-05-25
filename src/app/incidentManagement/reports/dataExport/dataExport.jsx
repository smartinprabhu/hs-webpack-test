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
import tableFields from './tableFields.json';

import {
  savePdfContent, getDefaultNoValue,
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import { groupByMultiple } from '../../../util/staticFunctions';
import { getExportFileName } from '../../../util/getDynamicClientData';

const DataExport = (props) => {
  const {
    afterReset, assetsList, dateFilter, groupBy, isWarrantyAge,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isWarrantyAge ? 'WarrantyAgeReport' : 'AuditReport')
  const dataFields = isWarrantyAge ? tableFields.fieldsWarrentyAge : tableFields.fields;

  const { userInfo } = useSelector((state) => state.user);
  const {
    typeId,
  } = useSelector((state) => state.ppm);

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
  const groupField = typeId && typeId.groupBy ? typeId.groupBy : '';
  const groupValues = groupByMultiple(assetsList, (obj) => obj[groupField]);

  function filterStringGenerator() {
    let filterTxt = '';

    if (dateFilter && dateFilter !== '') {
      filterTxt += 'Custom : ';
      filterTxt += dateFilter;
      filterTxt += ' | ';
    }

    if (groupBy && groupBy !== '') {
      filterTxt += `${groupBy} ${' : '}`;
      for (let i = 0; i < groupValues.length; i += 1) {
        filterTxt += `${groupValues[i][0][groupField][1]} ${'('} ${(groupValues[i].length)} ${')'}`;
        if (i === groupValues.length - 1) {
          filterTxt += ' ';
        } else {
          filterTxt += ', ';
        }
      }
    }
    return filterTxt;
  }
  const appliedFilters = filterStringGenerator();

  useEffect(() => {
    if (assetsList && assetsList.length > 0) {
      const dataFieldArray = dataFields;
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
  }, [assetsList]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (assetsList && assetsList.length > 0) {
        assetsList.map((data) => {
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
      savePdfContent(isWarrantyAge ? 'Warrenty Age' : 'Audit', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
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
          <FontAwesomeIcon className="fa-3x" size="sm" icon={faFilePdf} />
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
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
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
                columns={assetsList && assetsList.length ? dataFields : []}
                data={assetsList && assetsList.length ? assetsList : []}
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

DataExport.defaultProps = {
  isWarrantyAge: false,
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assetsList: PropTypes.array.isRequired,
  groupBy: PropTypes.string.isRequired,
  dateFilter: PropTypes.string.isRequired,
  isWarrantyAge: PropTypes.bool,
};

export default DataExport;
