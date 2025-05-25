/* eslint-disable radix */
import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';
import actions from '../data/customData.json';

export function getTotal(data) {
  let count = 0;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].ks_dashboard_item_type === 'ks_tile') {
        count += data[i].datasets[0];
      }
    }
  }
  return count;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    if (type === 'This week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('week');
      const weekEnd = currentDate.clone().endOf('week');
      daterange.push(moment(weekStart).utc().format('YYYY-MM-DD HH:mm:ss'));
      daterange.push(moment(weekEnd).utc().format('YYYY-MM-DD HH:mm:ss'));
    } else if (type === 'This month') {
      const date = new Date();
      const firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        1,
      );
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        daysInMonth(
          date.getMonth() + 1,
          date.getFullYear(),
        ),
      );
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD HH:mm:ss'));
      daterange.push(moment(lastDay).add(1, 'day').utc().format('YYYY-MM-DD HH:mm:ss'));
    } else if (type === 'Today') {
      const firstDay = moment().subtract(1, 'day');
      // firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = moment();
      daterange.push(`${moment(firstDay).utc().format('YYYY-MM-DD')} 18:30:00`);
      daterange.push(`${moment(lastDay).utc().format('YYYY-MM-DD')} 18:30:00`);
    } else if (type === 'This year') {
      const firstDay = `${(new Date()).getFullYear() - 1}-12-31 23:59:59`;
      const lastDay = `${(new Date()).getFullYear()}-12-31 23:59:59`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getCustomStatusName(text, data) {
  if (actions && actions.customStatusMap[text] && data && data[actions.customStatusMap[text]]) {
    return data[actions.customStatusMap[text]];
  }
  return text;
}

export function getCustomButtonName(text, data) {
  if (actions && actions.customButtonMap[text] && data && data[actions.customButtonMap[text]]) {
    return data[actions.customButtonMap[text]];
  }
  return text;
}

export function getStateLabel(staten, config) {
  if (actions && actions.statesLabel[staten]) {
    return (
      <Badge
        color={actions.statesLabel[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {getCustomStatusName(actions.statesLabel[staten].label, config)}
      </Badge>
    );
  }
  return '';
}


export function getStateLabelText(staten, config) {
  if (actions && actions.statesLabel[staten]) {
    return getCustomStatusName(actions.statesLabel[staten].label, config);
  }
  return '';
}

export function getInspectionForLabel(data) {
  if (actions && actions.inspectionTypeText[data]) {
    return actions.inspectionTypeText[data].label;
  }
  return '';
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id,
      parts_id: pl.product_id_ref,
      parts_uom: pl.parts_uom,
      name: pl.name,
      parts_qty: pl.parts_qty ? parseInt(pl.parts_qty) : 0,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}

export function getNewRequestArraySpare(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id,
      used_qty: pl.used_qty ? parseInt(pl.used_qty) : 0,
    }));
  }
  return requestProduts;
}

export function checkProductId(array) {
  let result = false;
  let count = 0;
  let removeArray = [];
  let arrayNew = [];
  if (array && array.length) {
    arrayNew = array.filter((item) => !item.isRemove);
    removeArray = array.filter((item) => item.isRemove);
    for (let i = 0; i < arrayNew.length; i += 1) {
      if (arrayNew[i].parts_id && arrayNew[i].parts_id.length > 0 && parseInt(arrayNew[i].parts_qty) > 0) {
        count += 1;
      }
    }
    result = count === arrayNew.length;
  }
  if (removeArray && removeArray.length && arrayNew && arrayNew.length === 0) {
    result = false;
  }
  return result;
}

