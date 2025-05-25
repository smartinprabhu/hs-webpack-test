import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
} from '../util/appUtils';
import {
  getCustomGatePassStatusName,
} from '../gatePass/utils/utils';

const tabletd = {
  border: '1px solid rgba(224, 224, 224, 1)', fontFamily: 'Roboto Condensed', borderCollapse: 'collapse', textAlign: 'center', textTransform: 'capitalize', padding: '35px',
};

const tabletdhead = {

  border: '1px solid rgba(224, 224, 224, 1)',
  borderBottom: '1px solid rgba(224, 224, 224, 1)',
  // fontSize: '17px',
  // backgroundColor: '#4ebbfb',
  // color: 'white',
  fontFamily: 'Roboto Condensed',
  borderCollapse: 'collapse',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '35px',
};

const DataTable = (props) => {
  const {
    columns, data, propertyAsKey, modelName,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const {
    gatePassConfig,
  } = useSelector((state) => state.gatepass);

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  function showCustomizedLabel(item, col) {
    let value = '';
    if (typeof item[col.property] === 'object') {
      value = getDefaultNoValue(extractTextObject(item[col.property]));
    } else if (col.labels) {
      value = col.labels[item[col.property]] && col.labels[item[col.property]].text ? col.labels[item[col.property]].text : '';
    } else if (col.alternativeProperty && !item[col.property]) {
      if (typeof item[col.alternativeProperty] === 'object') {
        value = getDefaultNoValue(extractTextObject(item[col.alternativeProperty]));
      } else {
        value = getDefaultNoValue(item[col.alternativeProperty]);
      }
    } else if (col.type && col.type === 'datetime') {
      value = item[col.property] ? `${getCompanyTimezoneDate(item[col.property], userInfo, 'datetime').toLocaleString()}` : '-';
    } else if (col.isDate && col.isDate === 'yes') {
      value = item[col.property] && item[col.property] !== '-' ? `${getDefaultNoValue(item[col.property]).toLocaleString()}` : '-';
    } else if (col.property === 'state' && modelName === 'mro.gatepass') {
      value = getCustomGatePassStatusName(item[col.property], gpConfig);
    } else if (col.property === 'initial_reading' || col.property === 'final_reading' || col.property === 'difference' || col.property === 'capacity' || col.property === 'amount') {
      value = item[col.property] || '0';
    } else {
      value = getDefaultNoValue(item[col.property]);
    }
    return value;
  }

  return (

    <table style={{ border: '1px solid rgba(224, 224, 224, 1)', borderCollapse: 'collapse', padding: '20px' }} className="export-table1" width="100%" align="left" id="table-to-xls_report">
      <thead>
        <tr>{columns.map((col) => <th style={tabletdhead} key={`header-${col.heading}`}>{col.heading}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={`${item[propertyAsKey]}-row`}>
            {columns.map((col) => <td style={tabletd} key={`${item[propertyAsKey]}-${col.property}`}>{showCustomizedLabel(item, col)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

DataTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  propertyAsKey: PropTypes.string.isRequired,
};

export default DataTable;
