/* eslint-disable arrow-body-style */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';

import DataTable from '@shared/dataTable';
import uniqBy from 'lodash/lodash';
import tableFields from '../../dataExport/tableFields.json';
import {
  getEquipmentsExport,
  getQRCodeImage,
} from '../../equipmentService';
import {
  filterStringGenerator,
  getEquipmentStateText,
} from '../../utils/utils';
import {
  queryGeneratorV1,
  getAllCompanies, getDefaultNoValue, saveExtraLargPdfContent,
} from '../../../util/appUtils';
// import QrExport from './qrExport';
import { setInitialValues } from '../../../purchase/purchaseService';
import assetsActions from '../../data/assetsActions.json';
import { getExportFileName } from '../../../util/getDynamicClientData';

const appModels = require('../../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, sortBy, sortField, isITAsset, categoryType, rows, exportType, exportTrue,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isITAsset ? 'IT_Assets' : 'Assets');

  const [columns, setColumns] = useState(fields);
  const [exportData, setExportData] = useState([]);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    equipmentsCount, equipmentFilters, assetsCategoryGroups, spaceEquipments, spaceExportEquipments,
  } = useSelector((state) => state.equipment);
  const dataFields = tableFields.locationsFields;
  useEffect(() => {
    setColumns(columns);
  }, [fields]);
  let equipArray = [];

  useEffect(() => {
    if (spaceExportEquipments && spaceExportEquipments.data && spaceExportEquipments.data.length) {
      assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length && assetsCategoryGroups.data.map((categ) => {
        const equipments = spaceExportEquipments.data.filter((equip) => equip.category_id[0] === categ.category_id[0]);
        equipArray = [...equipArray, ...equipments];
      });
      setExportData(equipArray);
    } else {
      setExportData([]);
    }
  }, [spaceExportEquipments]);

  useEffect(() => {
    dispatch(getQRCodeImage(companies, appModels.MAINTENANCECONFIG));
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (equipmentsCount && equipmentsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorV1(equipmentFilters.customFilters) : '';
      dispatch(getEquipmentsExport(companies, appModels.EQUIPMENT, equipmentsCount.length, offsetValue, columns, customFiltersQuery, rows, sortBy, sortField, isITAsset, categoryType));
    }
  }, [userInfo, equipmentsCount]);

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
    }
  }

  // const [exportType, setExportType] = useState();

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const locationSpaceName = spaceEquipments && spaceEquipments.data && spaceEquipments.data[0].location_id[1] ? spaceEquipments.data[0].location_id[1] : '';
  const appliedFilters = filterStringGenerator(equipmentFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && exportData && exportData.length > 0) {
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
  }, [fields, exportData]);

  const getTagStatus = (type) => {
    const filteredType = assetsActions.tagStatsus.filter((data) => {
      return (data.value === type);
    });
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (exportData && exportData.length > 0) {
        exportData.map((data) => {
          data.tag_status = getTagStatus(data.tag_status);
          data.state = getEquipmentStateText(data.state);
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
      // savePdfContent(isITAsset ? 'IT Assets' : 'Assets', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, locationSpaceName, 'location');
      saveExtraLargPdfContent(isITAsset ? 'IT Assets' : 'Assets', pdfHeaders, pdfBody, `${exportFileName}`, companyName, locationSpaceName, 'location');
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  return (
    <Row>

      <div className="hidden-div" id="print_report">
        {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b> Assets Report </b></td></tr>
              <tr>
                <td>Company</td>
                <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>Location</td>
                <td colSpan={15}><b>{spaceEquipments && spaceEquipments.data && spaceEquipments.data[0].location_id[1] ? spaceEquipments.data[0].location_id[1] : 'Space Name'}</b></td>
              </tr>
              <tr>
                <td>{appliedFilters && (<span>Filters</span>)}</td>
                <td colSpan={15}><b>{appliedFilters}</b></td>
              </tr>
            </tbody>
          </table>
        )}

        <br />
        {exportType === 'excel'
          ? (
            <DataTable
              columns={spaceExportEquipments && spaceExportEquipments.data && spaceExportEquipments.data.length ? dataFields : []}
              data={spaceExportEquipments && spaceExportEquipments.data ? exportData : []}
              propertyAsKey="id"
            />
          )
          : ''}
      </div>
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
  isITAsset: PropTypes.bool,
  categoryType: PropTypes.string,
};

DataExport.defaultProps = {
  isITAsset: false,
  categoryType: false,
};

export default DataExport;
