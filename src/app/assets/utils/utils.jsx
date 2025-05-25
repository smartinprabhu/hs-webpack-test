/* eslint-disable no-restricted-globals */
/* eslint-disable quote-props */
/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React from 'react';
import { Badge } from 'reactstrap';
import moment from 'moment-timezone';
import jsPDF from 'jspdf';
import { uniqBy, union } from 'lodash';
import assetActionData from '../data/assetsActions.json';
import { getActionDueDays } from '../../auditManagement/utils/utils';
import {
  filterDataPdf, customFilterDataArray, extractTextObject, getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';

export function getEquipmentStateLabel(staten, endOfLine) {
  if (assetActionData && assetActionData.stateslabels[staten]) {
    return (
      <Badge color={assetActionData.stateslabels[staten].color} className="badge-text no-border-radius" pill>
        {`${assetActionData.stateslabels[staten].text}${
          getActionDueDays(endOfLine)}`}
      </Badge>
    );
  }
  return '';
}

export function getEquipmentStateText(staten) {
  if (staten && assetActionData && assetActionData.stateslabels[staten]) {
    return assetActionData.stateslabels[staten].text;
  }
  return '';
}

export function getValidationTypesText(staten) {
  if (staten && assetActionData && assetActionData.validationTypesText[staten]) {
    return assetActionData.validationTypesText[staten].label;
  }
  return '';
}

export function getAMCText(staten) {
  if (assetActionData && assetActionData.amcTypeText[staten]) {
    return assetActionData.amcTypeText[staten].text;
  }
  return '';
}

export function getTagText(staten) {
  if (assetActionData && assetActionData.tagText[staten]) {
    return assetActionData.tagText[staten].text;
  }
  return '';
}

export function getAssignText(staten) {
  if (assetActionData && assetActionData.assignText[staten]) {
    return assetActionData.assignText[staten].text;
  }
  return '';
}

export function getEquipmentStateColor(staten) {
  if (assetActionData && assetActionData.stateslabels[staten]) {
    return assetActionData.stateslabels[staten].color;
  }
  return '';
}

export function getStateLabel(staten) {
  if (assetActionData && assetActionData.stateslabels[staten]) {
    return (
      <span className={`text-${assetActionData.stateslabels[staten].color} font-weight-800`}>
        {assetActionData.stateslabels[staten].text}
      </span>
    );
  }
  return '';
}

export function getCriticalLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.priorities[value]) {
    res = assetActionData.priorities[value].text;
  }

  return res;
}

export function getMeasureLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.measureTypes[value]) {
    res = assetActionData.measureTypes[value].text;
  }

  return res;
}

export function getConditionLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.conditionListLabel[value]) {
    res = assetActionData.conditionListLabel[value].label;
  }

  return res;
}

export function getTimePeriodLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.aggregateTimePeriodLabel[value]) {
    res = assetActionData.aggregateTimePeriodLabel[value].label;
  }

  return res;
}

export function getRecurrenceLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.recurrentListLabel[value]) {
    res = assetActionData.recurrentListLabel[value].label;
  }

  return res;
}

export function getTodoLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.todoListLabel[value]) {
    res = assetActionData.todoListLabel[value].label;
  }

  return res;
}

export function getMaintainLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.mTypesLabel[value]) {
    res = assetActionData.mTypesLabel[value].label;
  }

  return res;
}

export function getPriorityTypesLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.priorityTypesLabel[value]) {
    res = assetActionData.priorityTypesLabel[value].label;
  }

  return res;
}

export function getDataTypeLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.dataTypesLabel[value]) {
    res = assetActionData.dataTypesLabel[value].label;
  }

  return res;
}

export function getPercentage(total, given) {
  const totalVal = parseInt(total);
  const givenVal = parseInt(given);
  let perc = 0;
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(totalVal) || isNaN(givenVal) || givenVal === 0) {
    perc = 0;
  } else {
    perc = ((given / total) * 100);
  }

  perc = !isNaN(perc) && isFinite(perc) ? parseFloat(perc).toFixed(2) : 0.00;

  return perc;
}

export function getPercentageNew(total, given) {
  let perc = 0;
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(total) || isNaN(given) || given === 0) {
    perc = 0;
  } else {
    const totalVal = parseFloat(total);
    const givenVal = parseFloat(given);
    perc = ((givenVal / totalVal) * 100);
  }

  perc = parseFloat(perc).toFixed(2);

  return perc;
}

export function getTicketStateValue(data, type, key) {
  let total = 0;
  let count = 0;
  let percentage = 0;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].state_id[1] === (assetActionData && assetActionData.customTicketStateTypes[type].value)
        || (assetActionData && assetActionData.customTicketStateTypes[type] && assetActionData.customTicketStateTypes[type].states.includes(data[i].state_id[1]))) {
        count += data[i].__count;
      }
      total += data[i].__count;
    }
    percentage = getPercentage(total, count);
  }
  if (key === 'percentage') {
    return percentage;
  }
  if (key === 'count') {
    return count;
  }

  return total;
}

export function getMNValue(data, type, key) {
  let total = 0;
  let count = 0;
  let percentage = 0;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].maintenance_type === type
        || (assetActionData && assetActionData.customMaintenanceTypes[type] && assetActionData.customMaintenanceTypes[type].childMaintenanceTypes.includes(data[i].maintenance_type))) {
        count += data[i].__count;
      }
      total += data[i].__count;
    }
    percentage = getPercentage(total, count);
  }
  if (key === 'percentage') {
    return percentage;
  }
  if (key === 'count') {
    return count;
  }

  return total;
}

export function getMTValueByState(data, type, state) {
  let count = 0;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (assetActionData && assetActionData.customStateTypes[state]) {
        if ((data[i].maintenance_type === type || (assetActionData.customMaintenanceTypes[type]
          && assetActionData.customMaintenanceTypes[type].childMaintenanceTypes.includes(data[i].maintenance_type)))
          && (assetActionData.customStateTypes[state].states.includes(data[i].state))) {
          count += data[i].__count;
        }
      }
    }
  }
  return count;
}

export function getTotal(data, isITAsset) {
  let count = 0;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].ks_dashboard_item_type === 'ks_tile' && !isITAsset) {
        count += data[i].datasets[0];
      }
      if (data[i].ks_dashboard_item_type === 'ks_tile' && isITAsset && data[i].code !== 'TA') {
        count += data[i].datasets[0];
      }
    }
  }
  return count;
}

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    let datas = [];
    let names = [];
    if (values && values.length && values[0] && values[0].label !== 'False') {
      datas = values[0].data;
      names = values[0].label;
    }
    result = {
      labels,
      datasets: [
        {
          data: datas,
          label: names,
          backgroundColor: ['#1f4965', '#00acc1', '#1abc9c', '#e64a19', '#f9a825'],
        },
      ],
    };
  }
  return result;
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const statusValues = filters.statuses ? filters.statuses : [];
  const categories = filters.categories ? filters.categories : [];
  const vendors = filters.vendors ? filters.vendors : [];
  const tagStatus = filters.tagStatus ? filters.tagStatus : [];
  const partners = filters.partners ? filters.partners : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (statusValues && statusValues.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(statusValues);
  }

  if (categories && categories.length > 0) {
    filterTxt += 'Category : ';
    filterTxt += filterDataPdf(categories);
  }

  if (vendors && vendors.length > 0) {
    filterTxt += 'Vendors : ';
    filterTxt += filterDataPdf(vendors);
  }

  if (tagStatus && tagStatus.length > 0) {
    filterTxt += 'Tag Status : ';
    filterTxt += filterDataPdf(tagStatus);
  }

  if (partners && partners.length > 0) {
    filterTxt += 'Manufacturer : ';
    filterTxt += filterDataPdf(partners);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    if (type === 'This Week') {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstDay = new Date(curr.setDate(first));
      const lastDay = new Date(curr.setDate(last));

      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'This Month') {
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
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'Today') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = new Date();
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'This Year') {
      const firstDay = `${(new Date()).getFullYear()}-01-01`;
      const lastDay = `${(new Date()).getFullYear()}-12-31`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function addParents(data) {
  let children = [];
  const filterData = data && data.length ? data : [];
  if (filterData.length) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.space_name,
        children: [],
        space_name: space.space_name,
        childs: space.child_ids,
        parent_id: space.parent_id,
        type: space.asset_category_id ? space.asset_category_id[1] : '',
        err: space.error ? space.error : '',
      }));
  }
  return children;
}

export function addChildrensNew(parents, data, ids) {
  const reDefinedData = parents;

  if (ids && ids.length === 1) {
    const index = reDefinedData.findIndex((obj) => (obj.id === ids[0]));
    if ((reDefinedData[index]) && (!reDefinedData[index].children.length)) {
      reDefinedData[index].children = addParents(data);
    }
  }
  if (ids && ids.length === 2) {
    const index = reDefinedData.findIndex((obj) => (obj.id === ids[0]));
    const index1 = reDefinedData[index] && reDefinedData[index].children ? reDefinedData[index].children.findIndex((obj) => (obj.id === ids[1])) : false;
    if ((reDefinedData[index] && reDefinedData[index].children[index1]) && (!reDefinedData[index].children[index1].children.length)) {
      reDefinedData[index].children[index1].children = addParents(data);
    }
  }
  if (ids && ids.length === 3) {
    const index = reDefinedData.findIndex((obj) => (obj.id === ids[0]));
    const index1 = reDefinedData[index] && reDefinedData[index].children ? reDefinedData[index].children.findIndex((obj) => (obj.id === ids[1])) : false;
    const index2 = reDefinedData[index] && reDefinedData[index].children && reDefinedData[index].children[index1] && reDefinedData[index].children[index1].children
      ? reDefinedData[index].children[index1].children.findIndex((obj) => (obj.id === ids[2])) : false;
    if ((reDefinedData[index] && reDefinedData[index].children[index1] && reDefinedData[index].children[index1].children[index2])
      && (!reDefinedData[index].children[index1].children[index2].children.length)) {
      reDefinedData[index].children[index1].children[index2].children = addParents(data);
    }
  }
  if (ids && ids.length === 4) {
    const index = reDefinedData.findIndex((obj) => (obj.id === ids[0]));
    const index1 = reDefinedData[index] && reDefinedData[index].children ? reDefinedData[index].children.findIndex((obj) => (obj.id === ids[1])) : false;
    const index2 = reDefinedData[index] && reDefinedData[index].children && reDefinedData[index].children[index1] && reDefinedData[index].children[index1].children
      ? reDefinedData[index].children[index1].children.findIndex((obj) => (obj.id === ids[2])) : false;
    const index3 = reDefinedData[index] && reDefinedData[index].children && reDefinedData[index].children[index1] && reDefinedData[index].children[index1].children
      && reDefinedData[index].children[index1].children[index2] && reDefinedData[index].children[index1].children[index2].children
      ? reDefinedData[index].children[index1].children[index2].children.findIndex((obj) => (obj.id === ids[3])) : false;
    if ((reDefinedData[index] && reDefinedData[index].children[index1] && reDefinedData[index].children[index1].children[index2]
      && reDefinedData[index].children[index1].children[index2].children[index3])
      && (!reDefinedData[index].children[index1].children[index2].children[index3].children.length)) {
      reDefinedData[index].children[index1].children[index2].children = addParents(data);
    }
  }
  return reDefinedData;
}

export function addChildParents(data) {
  let children = [];
  const filterData = data && data.length ? data : [];
  if (filterData) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.name,
        children: addChildParents(space.child),
        space_name: space.name,
        childs: space.child,
        parent_id: space.parent && space.parent.id ? space.parent.id : '',
        type: space.space_category && space.space_category.name ? space.space_category.name : '',
        err: space.error ? space.error : '',
      }));
  }
  return children;
}

export function addChildrens(parents, data, parentId) {
  const reDefinedData = parents;

  if (parentId) {
    const index = reDefinedData.findIndex((obj) => (obj.id === parentId));
    if ((reDefinedData[index]) && (!reDefinedData[index].children.length)) {
      reDefinedData[index].children = addChildParents(data);
    }
  }

  return reDefinedData;
}

export function getDatesOfQueryNew(type) {
  let daterange = [];
  try {
    if (type === 'Last week' || type === 'Last month' || type === 'Last 3 months') {
      const lastDay = new Date();
      let firstDay = new Date();

      let days = 7;
      if (type === 'Last month') {
        days = 30;
      } else if (type === 'Last 3 months') {
        days = 90;
      }
      firstDay = firstDay.setTime(firstDay.getTime() - 3600 * 1000 * 24 * days);
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'This week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('week');
      const weekEnd = currentDate.clone().endOf('week');
      daterange.push(moment(weekStart).utc().format('YYYY-MM-DD 23:59:59'));
      daterange.push(moment(weekEnd).utc().format('YYYY-MM-DD 23:59:59'));
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
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD 23:59:59'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD 23:59:59'));
    } else if (type === 'Today') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = new Date();
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD 23:59:59'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD 23:59:59'));
    } else if (type === 'This year') {
      const firstDay = `${(new Date()).getFullYear()}-01-01`;
      const lastDay = `${(new Date()).getFullYear()}-12-31`;
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD 23:59:59'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD 23:59:59'));
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function queryGenerator(array) {
  let query = '';
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].type === 'text') {
      query += `["${array[i].key}","ilike","${array[i].value}"],`;
    } else if (array[i].type === 'id') {
      query += `["${array[i].key}","=","${array[i].value}"],`;
    } else if (array[i].type === 'multiple') {
      query += `["${array[i].key}","in",[${array[i].value}]],`;
    } else if (array[i].type === 'ids') {
      query += `["${array[i].key}","=",${array[i].value}],`;
    } else if (array[i].type === 'set') {
      query += `["${array[i].key}","!=",false],`;
    } else if (array[i].type === 'dateless') {
      query += `["${array[i].key}","<","${array[i].value}"],`;
    } else if (array[i].type === 'customdate') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["date",">=","${startDate}"],["date","<=","${endDate}"],`;
    } else if (array[i].type === 'date') {
      const type = array[i].value;
      const dates = getDatesOfQueryNew(type);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["date",">=","${startDate}"],["date","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'datearray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["date",">=","${startDate}"],["date","<=","${endDate}"],`;
    }
  }
  query = query.substring(0, query.length - 1);
  return query;
}

function getReadingMax(readingLineData, readingId) {
  let maxValue = 0;
  const arrayNew = readingLineData.filter((item) => item.reading_id && item.reading_id[0] === readingId);
  if (arrayNew && arrayNew.length > 0) {
    maxValue = arrayNew[0].validation_max_float_value;
  }
  return maxValue;
}

function getReadingMin(readingLineData, readingId) {
  let minValue = 0;
  const arrayNew = readingLineData.filter((item) => item.reading_id && item.reading_id[0] === readingId);
  if (arrayNew && arrayNew.length > 0) {
    minValue = arrayNew[0].validation_min_float_value;
  }
  return minValue;
}
function getValidationRequired(readingLineData, readingId) {
  let validation = false;
  const arrayNew = readingLineData.filter((item) => item.reading_id && item.reading_id[0] === readingId);
  if (arrayNew && arrayNew.length > 0) {
    validation = arrayNew[0].validation_required;
  }
  return validation;
}

function getValidationErrorMessage(readingLineData, readingId) {
  let validation = false;
  const arrayNew = readingLineData.filter((item) => item.reading_id && item.reading_id[0] === readingId);
  if (arrayNew && arrayNew.length > 0) {
    validation = arrayNew[0].validation_error_msg;
  }
  return validation;
}

export function getRequiredMessage(readingLineData, postdata) {
  let result = false;
  for (let i = 0; i < postdata.length; i += 1) {
    if (postdata[i].logType === 'space') {
      if (!postdata[i].space_id || postdata[i].space_id === '') {
        result = 'Space is required';
        break;
      }
    } else if (postdata[i].logType === 'equipment') {
      if (!postdata[i].equipment_id || postdata[i].equipment_id === '') {
        result = 'Equipment is required';
        break;
      }
    }
    if (!postdata[i].reading_id || postdata[i].reading_id === '') {
      result = 'Reading is required';
      break;
    }
    if (!postdata[i].date || postdata[i].date === '') {
      result = 'Date is required';
      break;
    }
    if (getValidationRequired(readingLineData, postdata[i].reading_id)) {
      if (getReadingMin(readingLineData, postdata[i].reading_id) !== 0 || getReadingMax(readingLineData, postdata[i].reading_id) !== 0) {
        if ((postdata[i].value >= getReadingMin(readingLineData, postdata[i].reading_id)) && (postdata[i].value <= getReadingMax(readingLineData, postdata[i].reading_id))) {
          result = false;
        } else if (getValidationErrorMessage(readingLineData, postdata[i].reading_id) && getValidationErrorMessage(readingLineData, postdata[i].reading_id) !== '') {
          result = getValidationErrorMessage(readingLineData, postdata[i].reading_id);
        } else {
          result = `Measure value for 
      ${postdata[i].readingValue[1]}(Reading) should be greater than or equal to ${getReadingMin(readingLineData, postdata[i].reading_id)} and less than or equal to ${getReadingMax(readingLineData, postdata[i].reading_id)}`;
          break;
        }
      }
    }
  }
  return result;
}

export function getNewArrayReading(checkListData) {
  let result = [];
  if (checkListData && checkListData.length > 0) {
    result = checkListData.map((pl) => ({
      company_id: pl.company_id,
      date: pl.date_utc,
      equipmentValue: pl.equipmentValue,
      equipment_id: pl.equipment_id,
      readingValue: pl.readingValue,
      reading_id: pl.reading_id,
      space_id: pl.space_id,
      value: pl.value,
    }));
  }
  return result;
}

export function getNewArrayUpdateReading(checkListData) {
  let result = [];
  if (checkListData && checkListData.length > 0) {
    result = checkListData.map((pl) => ({
      company_id: pl.company_id,
      date: pl.date_utc,
      equipmentValue: pl.equipmentValue[0],
      equipment_id: pl.equipment_id,
      readingValue: pl.readingValue[0],
      reading_id: pl.reading_id[0],
      space_id: pl.space_id,
      spaceValue: pl.spaceValue[0],
      value: pl.value,
    }));
  }
  return result;
}

export function getRequiredMessageReading(postdata) {
  let result = false;
  const valueReadings = postdata && postdata.length > 0 ? postdata[0] : [];
  if (valueReadings && Object.keys(valueReadings).length > 0) {
    if (parseInt(valueReadings.validation_min_float_value) > parseInt(valueReadings.validation_max_float_value)) {
      result = 'Maximum value should be greater than minimum value';
    } else if (valueReadings.to_do === 'Reading Logs') {
      if (valueReadings.value >= parseInt(valueReadings.validation_min_float_value) && valueReadings.value <= parseInt(valueReadings.validation_max_float_value)) {
        result = false;
      } else if (valueReadings.validation_error_msg && valueReadings.validation_error_msg !== '') {
        result = valueReadings.validation_error_msg;
      } else {
        result = `Measure value should be greater than or equal to ${parseInt(valueReadings.validation_min_float_value)} and less than or equal to ${parseInt(valueReadings.validation_max_float_value)}`;
      }
    }
  }
  return result;
}

export function zoomin(initialWidth, setInitialWidth) {
  const myImg = document.getElementById('svg-drag');
  if (myImg.clientWidth !== null) {
    const currWidth = myImg.clientWidth;
    if (!initialWidth) setInitialWidth(myImg.clientWidth);
    myImg.style.width = `${currWidth + 300}px`;
  }
}

export function zoomout(initialWidth, setInitialWidth) {
  const myImg = document.getElementById('svg-drag');
  if (myImg.clientWidth !== null) {
    const currWidth = myImg.clientWidth;
    if (!initialWidth) setInitialWidth(myImg.clientWidth);
    myImg.style.width = `${currWidth - 300}px`;
  }
}

export function getGroupByLabel(value) {
  let res = '';

  if (assetActionData && assetActionData.groupByListText[value]) {
    res = assetActionData.groupByListText[value].label;
  }

  return res;
}

export function getGroupByCountName(value) {
  let res = '';

  if (assetActionData && assetActionData.groupByListText[value]) {
    res = assetActionData.groupByListText[value].count_value;
  }

  return res;
}

export function getDefinitonByLabel(value) {
  let res = '';
  if (assetActionData && assetActionData.definitionList[value]) {
    if (assetActionData.definitionList[value].label && assetActionData.definitionList[value].label !== '') {
      res += assetActionData.definitionList[value].label;
      res += ' - ';
    }
    res += assetActionData.definitionList[value].definition;
  }

  return res;
}

export function getWorkOrderMaintenanceType(staten) {
  if (assetActionData && assetActionData.maintenanceTypesHistoryCard[staten]) {
    return (
      <span className={`text-${assetActionData.maintenanceTypesHistoryCard[staten].color}`}>
        {assetActionData.maintenanceTypesHistoryCard[staten].label}
      </span>
    );
  }
  return '';
}

export function getWorkOrderMaintenanceText(value) {
  let res = '';

  if (assetActionData && assetActionData.maintenanceTypesHistoryCard[value]) {
    res = assetActionData.maintenanceTypesHistoryCard[value].label;
  }

  return res;
}

export function savePdfContentStatic(title, header, body, fileName, companyName, equipmentData, userInfo) {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}` : false;

  const pdf = new jsPDF('p', 'pt', [612, 792]);
  const totalPagesExp = '{total_pages_count_string}';

  const headingsData = [
    { name: companyName },
    { name: title },
  ];

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
      1: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 10,
      overflow: 'linebreak',
      cellPadding: 2,
    },
    body: headingsData,
  });

  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 10,
    tableWidth: '100%',
    columnStyles: {
      0: { cellWidth: '25%', fontStyle: 'bold' },
      1: { cellWidth: '25%' },
      2: { cellWidth: '25%', fontStyle: 'bold' },
      3: { cellWidth: '25%' },
      // etc
    },
    styles: {
      fontSize: 9,
      overflow: 'linebreak',
    },
    head: [
      [
        {
          content: 'EQUIPMENT HISTORY CARD',
          colSpan: 4,
          styles: { halign: 'center' },
        },
      ],
    ],
    body: [
      ['Equipment Name', getDefaultNoValue(equipmentData.name), 'Property Name', extractTextObject(equipmentData.company_id)],
      ['Manufactured By', extractTextObject(equipmentData.manufacturer_id), 'Location', extractTextObject(equipmentData.location_id)],
      ['Model No / Type', getDefaultNoValue(equipmentData.model), 'Date of Installation', getDefaultNoValue(getCompanyTimezoneDate(equipmentData.start_date, userInfo, 'date'))],
      ['', '', 'Asset Code', equipmentData.equipment_seq],
    ],
    theme: 'striped',
  });

  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 0,
    tableWidth: '100%',
    columnStyles: {
      0: { cellWidth: '25%', fontStyle: 'bold' },
      1: { cellWidth: '25%' },
      2: { cellWidth: '25%', fontStyle: 'bold' },
      3: { cellWidth: '25%' },
      // etc
    },
    styles: {
      fontSize: 9,
      overflow: 'linebreak',
    },
    head: [
      [
        {
          content: 'WARRANTY DETAILS',
          colSpan: 4,
          styles: { halign: 'center' },
        },
      ],
    ],
    body: [
      ['Warranty Start date', getDefaultNoValue(getCompanyTimezoneDate(equipmentData.warranty_start_date, userInfo, 'date')), 'Warranty End date', getDefaultNoValue(getCompanyTimezoneDate(equipmentData.warranty_end_date, userInfo, 'date'))],
      ['AMC Start date', getDefaultNoValue(getCompanyTimezoneDate(equipmentData.amc_start_date, userInfo, 'date')), 'AMC End date', getDefaultNoValue(getCompanyTimezoneDate(equipmentData.amc_end_date, userInfo, 'date'))],
    ],
    theme: 'striped',
  });

  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 0,
    columnStyles: {
      0: { cellWidth: '15%' },
      1: { cellWidth: '35%' },
      2: { cellWidth: '15%' },
      3: { cellWidth: '15%' },
      4: { cellWidth: '20%' },
      // etc
    },
    styles: {
      fontSize: 9,
      overflow: 'linebreak',
    },
    columns: header,
    body,
    theme: 'striped',
  });

  pdf.autoTable({
    didDrawPage(data) {
      // Header
      if (ipcLogo) {
        pdf.addImage(ipcLogo, 'JPEG', 280, 5, 50, 30);
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(10);
      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const { pageSize } = pdf.internal;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  pdf.save(fileName);
}


export function savePdfContentStaticCost(title, header, body, fileName, companyName, equipmentData, userInfo) {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}` : false;

  const pdf = new jsPDF('p', 'pt', [612, 792]);
  const totalPagesExp = '{total_pages_count_string}';

  const headingsData = [
    { name: companyName },
    { name: title },
  ];

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
      1: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 10,
      overflow: 'linebreak',
      cellPadding: 2,
    },
    body: headingsData,
  });

  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 10,
    tableWidth: '100%',
    columnStyles: {
      0: { cellWidth: '25%', fontStyle: 'bold' },
      1: { cellWidth: '25%' },
      2: { cellWidth: '25%', fontStyle: 'bold' },
      3: { cellWidth: '25%' },
      // etc
    },
    styles: {
      fontSize: 9,
      overflow: 'linebreak',
    },
    head: [
    ],
    body: [
      ['Equipment Name', getDefaultNoValue(equipmentData.name), 'Company Name', extractTextObject(equipmentData.company_id)],
      ['Asset Code',equipmentData.equipment_seq, 'Location', extractTextObject(equipmentData.location_id)],
        ],
    theme: 'striped',
  });

  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 0,
    columnStyles: {
      serialno: { cellWidth: 30 },
      name: { cellWidth: 150 },
      category_id: { cellWidth: 100 },
      amount: { cellWidth: 50 },
      date_new: { cellWidth: 70 },
      description: { cellWidth: 180 },
      // etc
    },
    // head: [
    //   [
    //     {
    //       content: 'Cost',
    //       colSpan: 4,
    //       styles: { halign: 'center' },
    //     },
    //   ],
    // ],
    styles: {
      fontSize: 9,
      overflow: 'linebreak',
    },
    columns: header,
    body,
    theme: 'striped',
  });

  pdf.autoTable({
    didDrawPage(data) {
      // Header
      if (ipcLogo) {
        pdf.addImage(ipcLogo, 'JPEG', 280, 5, 50, 30);
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(10);
      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const { pageSize } = pdf.internal;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  pdf.save(fileName);
}

export function getGroupByExpiryDate(vendor, groupdata, field) {
  let res = '0';
  const startdate = moment().format('YYYY-MM-DD');
  const endDate30 = moment().add(30, 'days').format('YYYY-MM-DD');
  const endDate60 = moment().add(60, 'days').format('YYYY-MM-DD');
  const endDate90 = moment().add(90, 'days').format('YYYY-MM-DD');
  const endDate120 = moment().add(120, 'days').format('YYYY-MM-DD');
  const inTable = groupdata.filter((item) => item && item.length > 0 && item[0].vendor_id[0] === vendor);
  const array30 = inTable && inTable.length && inTable[0].filter((item) => moment(item.warranty_end_date).isBetween(startdate, endDate30, null, '[)'));
  const array60 = inTable && inTable.length && inTable[0].filter((item) => moment(item.warranty_end_date).isBetween(endDate30, endDate60, null, '[)'));
  const array90 = inTable && inTable.length && inTable[0].filter((item) => moment(item.warranty_end_date).isBetween(endDate60, endDate90, '[)'));
  const array120 = inTable && inTable.length && inTable[0].filter((item) => moment(item.warranty_end_date).isBetween(endDate90, endDate120, '[]'));
  const array120Above = inTable && inTable.length && inTable[0].filter((item) => moment(item.warranty_end_date).isAfter(endDate120));
  if (array30.length > 0 && field === '30') {
    res = array30.length;
  } else if (array60.length > 0 && field === '60') {
    res = array60.length;
  } else if (array90.length > 0 && field === '90') {
    res = array90.length;
  } else if (array120.length > 0 && field === '120') {
    res = array120.length;
  } else if (array120Above.length > 0 && field === '120<') {
    res = array120Above.length;
  }
  return res;
}

export function getGroupByExpiredCount(vendor, groupdata, field) {
  let res = '0';
  const current = moment().format('YYYY-MM-DD');
  const inTableVendor = groupdata.filter((item) => item && item.length > 0 && item[0].vendor_id[0] === vendor);
  const inTableNotVendor = groupdata.filter((item) => item && item.length > 0 && item[0].vendor_id && item[0].vendor_id === false);
  const inTable = inTableVendor.concat(inTableNotVendor);
  const arrayExpired = inTable && inTable.length && inTable[0].filter((item) => moment(item.warranty_end_date).isBefore(current));
  if (arrayExpired.length > 0 && field === 'expire') {
    res = arrayExpired.length;
  }
  return res;
}

export function getExpiryAge(date) {
  let res = '-';
  const startdate = moment().format('YYYY-MM-DD');
  const endDate30 = moment().add(30, 'days').format('YYYY-MM-DD');
  const endDate60 = moment().add(60, 'days').format('YYYY-MM-DD');
  const endDate90 = moment().add(90, 'days').format('YYYY-MM-DD');
  const endDate120 = moment().add(120, 'days').format('YYYY-MM-DD');
  if (moment(date).isBetween(startdate, endDate30, null, '[)')) {
    res = '1 - 30 days';
  } else if (moment(date).isBetween(endDate30, endDate60, null, '[)')) {
    res = '31 - 60 days';
  } else if (moment(date).isBetween(endDate60, endDate90, '[)')) {
    res = '61 - 90 days';
  } else if (moment(date).isBetween(endDate90, endDate120, '[]')) {
    res = '91 - 120 days';
  } else if (moment(date).isAfter(endDate120)) {
    res = '120< days';
  }
  return res;
}

export function getExpiredSince(date) {
  let res = '-';
  const current = moment().format('YYYY-MM-DD');
  const given = moment(date, 'YYYY-MM-DD');
  if (given.isBefore(current)) {
    if (Math.abs(moment.duration(given.diff(current)).asDays()) === '1') {
      res = `Expires Since ${Math.abs(moment.duration(given.diff(current)).asDays())} day`;
    } else {
      // Difference in number of days
      res = `Expired Since ${Math.abs(moment.duration(given.diff(current)).asDays())} days`;
    }
  }
  if (given.isAfter(current)) {
    if (Math.abs(moment.duration(given.diff(current)).asDays()) === 1) {
      res = `Expires In ${Math.abs(moment.duration(given.diff(current)).asDays())} day`;
    } else {
      res = `Expires In ${Math.abs(moment.duration(given.diff(current)).asDays())} days`;
    }
  }
  if (given.isSame(current)) {
    res = 'Expires Today';
  }

  return res;
}

export function getGroupByExpiryTotal(groupdata, field) {
  let res = '0';
  const startdate = moment().format('YYYY-MM-DD');
  const endDate30 = moment().add(30, 'days').format('YYYY-MM-DD');
  const endDate60 = moment().add(60, 'days').format('YYYY-MM-DD');
  const endDate90 = moment().add(90, 'days').format('YYYY-MM-DD');
  const endDate120 = moment().add(120, 'days').format('YYYY-MM-DD');
  const inTable = groupdata;
  const array30 = inTable && inTable.length && inTable.filter((item) => moment(item.warranty_end_date).isBetween(startdate, endDate30, null, '[)'));
  const array60 = inTable && inTable.length && inTable.filter((item) => moment(item.warranty_end_date).isBetween(endDate30, endDate60, null, '[)'));
  const array90 = inTable && inTable.length && inTable.filter((item) => moment(item.warranty_end_date).isBetween(endDate60, endDate90, null, '[)'));
  const array120 = inTable && inTable.length && inTable.filter((item) => moment(item.warranty_end_date).isBetween(endDate90, endDate120, null, '[]'));
  const array120Above = inTable && inTable.length && inTable.filter((item) => moment(item.warranty_end_date).isAfter(endDate120));
  const arrayExpired = inTable && inTable.length && inTable.filter((item) => moment(item.warranty_end_date).isBefore(startdate));
  if (array30.length > 0 && field === '30') {
    res = array30.length;
  } else if (array60.length > 0 && field === '60') {
    res = array60.length;
  } else if (array90.length > 0 && field === '90') {
    res = array90.length;
  } else if (array120.length > 0 && field === '120') {
    res = array120.length;
  } else if (array120Above.length > 0 && field === '120<') {
    res = array120Above.length;
  } else if (arrayExpired.length > 0 && field === 'expire') {
    res = arrayExpired.length;
  }
  return res;
}
function addChildrensToTree(data, parentId) {
  let children = [];
  const filterData = data.filter((space) => space && space.parent_id && space.parent_id.id === parentId);

  if (filterData) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.space_name,
        type: space.asset_category_id.name,
        sort_sequence: space.asset_categ_type === 'floor' ? space.sort_sequence : '',
        children: space.parent_id.id && addChildrensToTree(data, space.id),
        childs: space.child_ids,
        space_name: space.space_name,
        path_name: space.path_name,
        space_number: space.space_number,
        err: space.error ? space.error : '',
      }));
  }
  return children;
}

function searchSpaces(data, selectedSpaceNameValue) {
  const searchFilterData = [];
  if (selectedSpaceNameValue && selectedSpaceNameValue.length) {
    data.map((key) => {
      if (key.space_name.toLowerCase() && key.space_name.toLowerCase().includes(selectedSpaceNameValue.toLowerCase())) {
        searchFilterData.push(key);
      }
    });
  }
  return searchFilterData;
}

export function buildTreeViewObject(workSpaces, selectedSpaceNameValue) {
  const treeViewBookingData = [];
  let rootObjects = workSpaces.filter((data) => data.asset_category_id && data.asset_category_id.name === 'Building');
  if (selectedSpaceNameValue && selectedSpaceNameValue.length) {
    rootObjects = searchSpaces(workSpaces, selectedSpaceNameValue);
  }
  if (rootObjects && rootObjects.length) {
    rootObjects.map((rootObject) => {
      const treeViewData = {
        treeNodeId: `root${rootObject.id}`,
        key: rootObject && rootObject.id,
        name: rootObject && rootObject.space_name,
        is_parent: true,
        id: rootObject && rootObject.id,
        type: rootObject.asset_category_id.name,
        childs: rootObject.child_ids,
        children: addChildrensToTree(workSpaces, rootObject.id),
      };
      treeViewBookingData.push(treeViewData);
    });
  }
  return treeViewBookingData;
}

function exportChildLocationsData(workSpaces, locationArray, parentId) {
  const filterData = workSpaces.filter((space) => space && space.parent_id && space.parent_id.id === parentId);

  if (filterData && filterData.length) {
    filterData.map(async (space) => {
      locationArray.push(space);
      await exportChildLocationsData(workSpaces, locationArray, space.id);
    });
  }
}

export function exportParentLocationData(workSpaces) {
  const locationArray = [];
  const rootObjects = workSpaces.filter((data) => data.asset_category_id && data.asset_category_id.name === 'Building');
  if (rootObjects && rootObjects.length) {
    rootObjects.map(async (rootObject) => {
      locationArray.push(rootObject);
      await exportChildLocationsData(workSpaces, locationArray, rootObject.id);
    });
  }
  return locationArray;
}

const getTagStatus = (type) => {
  const filteredType = assetsActions.tagStatsus.filter((data) => (data.value === type));
  if (filteredType && filteredType.length) {
    return filteredType[0].label;
  }
  return '-';
};

export function updateValueInArray(array) {
  let res = [];
  if (array && array.length) {
    res = array.map((item) => {
      if (item.field === 'block_id' || item.field === 'floor_id') {
      // Overwriting the value of the specified property
        return { ...item, 'field': `${item.field}.space_name` };
      }
      return item;
    });
  }
  return res;
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
      if (arrayNew[i].category_id && arrayNew[i].category_id.length > 0 && parseInt(arrayNew[i].amount) > 0) {
        count += 1;
      }
    }
    result = count === arrayNew.length;
  }else{
    result=true;
  }
  if (removeArray && removeArray.length && arrayNew && arrayNew.length === 0) {
    result = true;
  }
  return result;
}
