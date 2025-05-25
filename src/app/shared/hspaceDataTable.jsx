/* eslint-disable react/require-default-props */
/* eslint-disable no-plusplus */
import React from 'react';
import * as PropTypes from 'prop-types';

import { TimeZoneDateConvertor } from '@shared/dateTimeConvertor';
import { useSelector } from 'react-redux';
import { getDefaultNoValue } from '../util/appUtils';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'left',
  padding: '2px',
};

const tabletdhead = {
  border: '1px solid black',
  borderBottom: '1px solid black',
  fontSize: '17px',
  backgroundColor: '#3a4354',
  color: 'white',
  borderCollapse: 'collapse',
  textAlign: 'left',
  padding: '2px',
};

const DataTable = (props) => {
  const { columns, data, isExportToPDF } = props;
  const { neighbourSpacesInfo } = useSelector((state) => state.employee);
  function showCustomizedLabel(item, col) {
    let value = '';
    let array;
    if (col && col.subChildOf) {
      array = item[col.childOf] && item[col.childOf][col.subChildOf] && item[col.childOf][col.subChildOf][col.property];
      value = array;
    } else if (col && col.childOf) {
      array = item[col.childOf] && item[col.childOf][col.property];
      if (item[col.childOf] && item[col.childOf][col.property] && (col.property === 'planned_in' || col.property === 'planned_out' || col.property === 'actual_in' || col.property === 'actual_out')) {
        array = <TimeZoneDateConvertor date={getDefaultNoValue(item[col.childOf][col.property])} format="D MMM YYYY LT" />;
      }
      if (col.property === 'employee_number') {
        if (!isExportToPDF && array && array.startsWith('0')) {
          array = item[col.childOf][col.property].toString() + String.fromCharCode(8203);
        } else {
          array = item[col.childOf][col.property];
        }
      }
      value = array;
    } else if (col.property === 'neighbour_groups_ids') {
      item[col.property].forEach((element) => {
        neighbourSpacesInfo.data.forEach((neighbourHoodGroups) => {
          if (element === neighbourHoodGroups.id) {
            value = `${value}, ${neighbourHoodGroups.name}`;
          }
        });
      });
      if (value[0] === ',') {
        value = value.substring(1);
      }
    } else if (col.property === 'employee_id_seq') {
      value = item[col.property] ? item[col.property].toString() + String.fromCharCode(8203) : '';
    } else if (typeof item[col.property] === 'object') {
      array = item[col.property];
      if (item[col.property] && (col.property === 'planned_in' || col.property === 'planned_out' || col.property === 'actual_in' || col.property === 'actual_out')) {
        array = <TimeZoneDateConvertor date={getDefaultNoValue(item[col.property])} format="D MMM YYYY LT" />;
      }
      // eslint-disable-next-line no-unused-vars
      const [id, name] = array;
      value = name;
    } else if (col.labels) {
      value = col.labels[item[col.property]] && col.labels[item[col.property]].text ? col.labels[item[col.property]].text : '';
      // } else if (item[col.property] && (col.property === 'planned_in' || col.property === 'planned_out' || col.property === 'actual_in' || col.property === 'actual_out')) {
      //   value = <TimeZoneDateConvertor date={getDefaultNoValue(item[col.property])} format="D MMM YYYY LT" />;
      // } else if (item[col.property] && (col.property === 'planned_in' || col.property === 'planned_out' || col.property === 'actual_in' || col.property === 'actual_out')) {
      //   value = <TimeZoneDateConvertor date={getDefaultNoValue(item[col.property])} format="D MMM YYYY LT" />;
    } else if (item[col.property] && (col.property === 'planned_in' || col.property === 'planned_out' || col.property === 'actual_in' || col.property === 'actual_out' || col.property === 'date_start_scheduled')) {
      value = <TimeZoneDateConvertor date={getDefaultNoValue(item[col.property])} format="D MMM YYYY LT" />;
    }
    else if (col.property === 'is_guest') {
      value = item.visitor && item.visitor.is_guest ? 'Yes' : 'No'
    } else if (col.heading === 'Guest Name') {
      value = item.visitor && item.visitor.visitor_id && item.visitor.visitor_id.length && item.visitor.visitor_id[0] ? item.visitor.visitor_id[0].name : ''
    } else if (col.property === 'email') {
      value = item.visitor && item.visitor.visitor_id && item.visitor.visitor_id.length && item.visitor.visitor_id[0] ? item.visitor.visitor_id[0].email.email : ''
    } else {
      value = item[col.property];
    }
    return value;
  }
  let index = 1;
  return (

    <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" width="100%" align="left" id="table-to-xls_report">
      <thead>
        <tr>{columns.map((col) => <th style={tabletdhead} key={`header-${col.heading}`}>{col.heading}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={index++}>
            {columns.map((col) => <td style={tabletd} key={index++}>{showCustomizedLabel(item, col)}</td>)}
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
  isExportToPDF: PropTypes.bool,
};

export default DataTable;
