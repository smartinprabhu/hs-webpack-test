/* eslint-disable radix */
import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';

import actions from '../data/customData.json';
import {
  filterDataPdf, customFilterDataArray,
  isJsonString,
  getJsonString,
} from '../../util/appUtils';

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

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const states = filters.statuses ? filters.statuses : [];
  const category = filters.category ? filters.category : [];
  const act = filters.act ? filters.act : [];
  const applies = filters.applies ? filters.applies : [];

  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (states && states.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(states);
  }

  if (category && category.length > 0) {
    filterTxt += 'Category : ';
    filterTxt += filterDataPdf(category);
  }

  if (act && act.length > 0) {
    filterTxt += 'Act : ';
    filterTxt += filterDataPdf(act);
  }

  if (applies && applies.length > 0) {
    filterTxt += 'Applies To : ';
    filterTxt += filterDataPdf(applies);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
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

export function getStateLabel(staten) {
  if (actions && actions.statesLabel[staten]) {
    return (
      <Badge
        color={actions.statesLabel[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {actions.statesLabel[staten].label}
      </Badge>
    );
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
      id: pl.id ? pl.id : false,
      asset_id: pl.asset_id_ref,
      parts_qty: pl.parts_qty ? parseInt(pl.parts_qty) : 0,
      description: pl.description,
      isRemove: pl.isRemove ? pl.isRemove : false,
    }));
  }
  return requestProduts;
}

export function checkAssetId(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if ((arrayNew[i].asset_id && arrayNew[i].asset_id.length > 0)) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function checkEquipmentId(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].asset_id_ref) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function checkEquipmentArray(array) {
  const arrayNew = array.filter((item) => !item.isRemove && item.asset_id);
  return arrayNew;
}

export function checkEquipmentArrayUpdate(array) {
  const arrayNew = array.filter((item) => !(item.isRemove && !item.id) && item.asset_id);
  return arrayNew;
}

export function getCustomGatePassStatusName(text, data) {
  const datas = data && data.config_json_data ? data.config_json_data : false;
  const jsonConfig = datas && isJsonString(datas) && getJsonString(datas) ? getJsonString(datas) : false;
  if (jsonConfig && actions && actions.customStatusMap[text] && jsonConfig[actions.customStatusMap[text]]) {
    return jsonConfig[actions.customStatusMap[text]];
  }
  return text;
}

export function getCustomButtonName(text, data) {
  const datas = data && data.config_json_data ? data.config_json_data : false;
  const jsonConfig = datas && isJsonString(datas) && getJsonString(datas) ? getJsonString(datas) : false;
  if (jsonConfig && actions && actions.customButtonMap[text] && jsonConfig[actions.customButtonMap[text]]) {
    return jsonConfig[actions.customButtonMap[text]];
  }
  return text;
}
