/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import DataTable from '@shared/dataTable';
import tableFields from './tableFields.json';
import {
  getDefaultNoValue, extractTextObject, savePdfContent,
  numToFloat, getCompanyTimezoneDateForColumns,
} from '../../util/appUtils';
import {
  savePdfContentStaticCost, getWorkOrderMaintenanceText,
} from '../utils/utils';
import { getExportFileName } from '../../util/getDynamicClientData';

const HistorycardExport = (props) => {
  const {
    exportType, setExportType, assetHistoryCard, equipmentData, isITAsset,
  } = props;
  const dataFields = isITAsset ? tableFields.equipmentCost : tableFields.equipmentCost;
  const { userInfo } = useSelector((state) => state.user);

  const exportFileName = getExportFileName('Equipment_Cost');

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyNames = userInfo && userInfo.data ? userInfo.data.company.name : '';

  useEffect(() => {
    if (assetHistoryCard && assetHistoryCard.length > 0) {
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
  }, [assetHistoryCard]);

  const getEntity = (entityType, employee, equipment, location) => {
    let entityData = '';
    if (entityType === 'Employee') {
      entityData = employee;
    } else if (entityType === 'Location') {
      entityData = location;
    } else if (entityType === 'Equipment') {
      entityData = equipment;
    }
    return entityData;
  };

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (assetHistoryCard && assetHistoryCard.length > 0) {
        assetHistoryCard.map((data, i) => {
          const index = i + 1;
          data.serialno = index;
          data.amount = numToFloat(data.amount);
          data.date_new = getCompanyTimezoneDateForColumns(data.date, 'date');
          // data.maintenance_type_new = getWorkOrderMaintenanceText(data.maintenance_type);
          // data.nature_of_work = data.nature_of_work.trim();
          // data.entity_new = getEntity(data.checkout_to, data.employee_id, data.asset_id, data.location_id);
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

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      if (isITAsset) {
        savePdfContent('Asset Cost Report', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyNames, false);
      } else {
        savePdfContentStaticCost('Asset Cost Report', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyNames, equipmentData, userInfo);
      }
      setExportType(false);
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_operation', exportFileName);
    }
  }, [exportType]);

  return (
    <>
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_operation">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Asset Cost Report</b></td></tr>
              <tr>
                <td>Equipment Name</td>
                <td><b>{getDefaultNoValue(equipmentData.name)}</b></td>
                <td>Company Name</td>
                <td><b>{extractTextObject(equipmentData.company_id)}</b></td>
              </tr>
              <tr>
                <td>Asset Code</td>
                <td><b>{(equipmentData.equipment_seq)}</b></td>
                <td>Location</td>
                <td><b>{extractTextObject(equipmentData.location_id)}</b></td>
              </tr>
            </tbody>
          </table>
          )}
          <br />
          {exportType === 'excel' && (
          <DataTable columns={(dataFields)} data={assetHistoryCard && assetHistoryCard.data ? assetHistoryCard.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="PPM_Operations_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

HistorycardExport.propTypes = {
  setExportType: PropTypes.func.isRequired,
  assetHistoryCard: PropTypes.array.isRequired,
  exportType: PropTypes.bool.isRequired,
  equipmentData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  isITAsset: PropTypes.bool,
};

HistorycardExport.defaultProps = {
  isITAsset: false,
};

export default HistorycardExport;
