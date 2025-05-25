/* eslint-disable arrow-body-style */
/* eslint-disable react/forbid-prop-types */
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
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileExcel, faQrcode,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import uniqBy from 'lodash/lodash';
import tableFields from './tableFields.json';
import {
  getEquipmentsExport,
  getQRCodeImage,
} from '../equipmentService';
import {
  filterStringGenerator,
  getEquipmentStateText, getValidationTypesText,
} from '../utils/utils';
import {
  getLocalTime, queryGeneratorV1,
  savePdfContent, getAllCompanies, getDefaultNoValue, getLocalDate, getCompanyTimezoneDate,
} from '../../util/appUtils';
import QrExport from './qrExport';
import { setInitialValues } from '../../purchase/purchaseService';
import assetsActions from '../data/assetsActions.json';
import { getExportFileName } from '../../util/getDynamicClientData'
import { AssetModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, sortedValue, isITAsset, categoryType, rows, apiFields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isITAsset ? 'IT_Assets' : 'Assets')
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    equipmentsCount, equipmentFilters, equipmentsExportInfo, equipmentsInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (fields && fields.length) {
      let array = []
      tableFields.fields && tableFields.fields.length && tableFields.fields.map((field) => {
        let exportField = fields.find((tableField) => tableField === field.property)
        if (exportField) {
          array.push(field)
        }
      })
      setDataFields(array, 'header')
    }
  }, []);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    dispatch(getQRCodeImage(companies, appModels.MAINTENANCECONFIG));
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (equipmentsCount && equipmentsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorV1(equipmentFilters.customFilters) : '';
      dispatch(getEquipmentsExport(companies, appModels.EQUIPMENT, equipmentsCount.length, offsetValue, AssetModule.assetApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, isITAsset, categoryType));
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
      console.log(e);
    }
  }

  const [exportType, setExportType] = useState();

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGenerator(equipmentFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && equipmentsExportInfo && equipmentsExportInfo.data && equipmentsExportInfo.data.length > 0) {
      const dataFieldArray = dataFields;
      const uniqFieldsArray = [];
      let pdfHeaderObj = '';
      /* if (columns.some((selectedValue) => selectedValue === 'id')) {
        pdfHeaderObj = {
          header: 'ID',
          dataKey: 'id',
        };
        uniqFieldsArray.push(pdfHeaderObj);
      } */
      dataFieldArray.map((item) => {
        pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [fields, equipmentsExportInfo]);

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
      if (equipmentsExportInfo && equipmentsExportInfo.data && equipmentsExportInfo.data.length > 0) {
        equipmentsExportInfo.data.map((data) => {
          data.tag_status = getTagStatus(data.tag_status);
          data.validation_status = getValidationTypesText(data.validation_status);
          data.state = getEquipmentStateText(data.state);
          data.purchase_date = getLocalDate(data.purchase_date);
          data.warranty_start_date = getLocalDate(data.warranty_start_date);
          data.warranty_end_date = getLocalDate(data.warranty_end_date);
          data.validated_on = getCompanyTimezoneDate(data.validated_on, userInfo, 'datetime');
          data.is_qr_tagged = data.is_qr_tagged ? 'Yes' : 'No';
          data.is_nfc_tagged = data.is_nfc_tagged ? 'Yes' : 'No';
          data.is_rfid_tagged = data.is_rfid_tagged ? 'Yes' : 'No';
          data.is_virtually_tagged = data.is_virtually_tagged ? 'Yes' : 'No';
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
      savePdfContent(isITAsset ? 'IT Assets' : 'Assets', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const handleQRExport = () => {
    setExportType('QR');
    setTimeout(() => {
      const content = document.getElementById('print_report');
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      if (afterReset) afterReset();
    }, 3000);
  };

  return (
    <Row>
      <Col md="4" sm="4" lg="4" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
          <p className="mb-0">PDF</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            disabled={equipmentsExportInfo && equipmentsExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(equipmentsExportInfo && equipmentsExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="4" sm="4" lg="4" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <p className="mb-0">Excel</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            disabled={equipmentsExportInfo && equipmentsExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(equipmentsExportInfo && equipmentsExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="4" sm="4" lg="4" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faQrcode} />
          <p className="mb-0">QR</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            size="sm"
            disabled={equipmentsExportInfo && equipmentsExportInfo.loading}
            onClick={() => handleQRExport()}
          >
            {(equipmentsExportInfo && equipmentsExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {equipmentsExportInfo && equipmentsExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={equipmentsExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr>
                  <td><b>{isITAsset ? 'IT Assets Report' : 'Assets Report'}</b></td>
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
          {exportType === 'excel'
            ? (
              <DataTable
                title={isITAsset ? 'IT Assets' : 'Assets'}
                columns={equipmentsInfo && equipmentsInfo.data && equipmentsInfo.data.length ? dataFields : []}
                data={equipmentsExportInfo && equipmentsExportInfo.data ? equipmentsExportInfo.data : []}
                propertyAsKey="id"
              />
            )
            : ''}
          {exportType === 'QR'
            ? <QrExport data={equipmentsExportInfo && equipmentsExportInfo.data ? equipmentsExportInfo.data : []} /> : ''}
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
  isITAsset: PropTypes.bool,
  categoryType: PropTypes.string,
};

DataExport.defaultProps = {
  isITAsset: false,
  categoryType: false,
};

export default DataExport;

