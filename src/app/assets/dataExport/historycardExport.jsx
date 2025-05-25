/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import tableFields from './tableFields.json';
import {
  getDefaultNoValue, getCompanyTimezoneDate, savePdfContent,
} from '../../util/appUtils';
import {
  savePdfContentStatic, getWorkOrderMaintenanceText,
} from '../utils/utils';
import { getExportFileName } from '../../util/getDynamicClientData';

const HistorycardExport = (props) => {
  const {
    exportType, setExportType, assetHistoryCard, equipmentData, isITAsset,
  } = props;
  const dataFields = isITAsset ? tableFields.historyCardITFields : tableFields.historyCardFields;
  const { userInfo } = useSelector((state) => state.user);

  const exportFileName =  getExportFileName('Equipment_Historycard')

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
          data.date_new = getCompanyTimezoneDate(data.date, userInfo, 'datetime');
          data.maintenance_type_new = getWorkOrderMaintenanceText(data.maintenance_type);
          data.nature_of_work = data.nature_of_work.trim();
          data.entity_new = getEntity(data.checkout_to, data.employee_id, data.asset_id, data.location_id);
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
      if (isITAsset) {
        savePdfContent('Equipment History Card', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyNames, false);
      } else {
        savePdfContentStatic('Equipment History Card', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyNames, equipmentData, userInfo);
      }
      setExportType(false);
    }
  }, [exportType]);

  return (
    <>

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
