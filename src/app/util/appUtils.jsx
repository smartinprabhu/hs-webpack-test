/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
/* eslint-disable radix */
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import find from 'lodash/find';
import momentrange from 'moment';
import moment from 'moment-timezone';
import React from 'react';
import DOMPurify from 'dompurify';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { groupByMultiple } from './staticFunctions';

import actionCodes from '../helpdesk/data/helpdeskActionCodes.json';
import langData from './languages.json';

const queryString = require('query-string');
const appConfig = require('../config/appConfig').default;

const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

export const apiURL = localStorage.getItem('api-url');

export function getPagesCount(data, limit) {
  let total = 0;
  if (data) {
    // eslint-disable-next-line no-underscore-dangle
    total = data[0].__count;
  }
  return Math.ceil(total / limit);
}

export function splitDocument(document) {
  const documentName = document.datas_fname.split('.');
  if (documentName && documentName.length > 2) {
    let fileName = '';
    for (let i = 0; i < documentName.length - 1; i += 1) {
      if (fileName !== '') {
        fileName = `${fileName}.${documentName[i]}`;
      } else {
        fileName += documentName[i];
      }
    }
    return fileName;
  }
  return documentName[0];
}

export function getExtensionFromMimeType(mimeType) {
  const mimeMap = {
    'application/pdf': 'pdf',
    'application/json': 'json',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'text/csv': 'csv',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/tiff': 'tif',
  };

  return mimeMap[mimeType] || 'txt'; // Default to .bin if MIME type is unknown
}

export function getTypeOfDocument(document) {
  let documentExt = '';
  if (document.datas_fname && document.datas_fname.includes('.')) {
    const dData = document.datas_fname.split('.');
    documentExt = dData[dData.length - 1];
  } else {
    documentExt = getExtensionFromMimeType(document.mimetype);
  }
  return documentExt;
}

export function getPagesCountV2(data, limit) {
  let total = 0;
  if (data) {
    // eslint-disable-next-line no-underscore-dangle
    total = data;
  }
  if (limit === '' || limit === 0) {
    return total;
  }
  return Math.ceil(total / limit);
}

export function getTotalCount(data) {
  let total = 0;
  if (data && data.length && Array.isArray(data) && data[0].__count) {
    // eslint-disable-next-line no-underscore-dangle
    total = data[0].__count;
  }
  return total;
}

export function getFormat(type) {
  let defaultFormat = 'DD MMM YYYY';
  if (type && type === 'datetime') {
    defaultFormat = 'DD MMM YYYY hh:mm A';
  }
  if (type && type === 'time') {
    defaultFormat = 'hh:mm A';
  }
  if (type && type === 'date') {
    defaultFormat = 'DD MMM YYYY';
  }
  if (type && type === 'monthyear') {
    defaultFormat = 'MMM YYYY';
  }
  if (type && type === 'datetimeseconds') {
    defaultFormat = 'YYYY-MM-DDTHH:mm:ss';
  }
  if (type && type === 'datetimesecs') {
    defaultFormat = 'YYYY-MM-DD HH:mm:ss';
  }
  return defaultFormat;
}

function getDateFormatNew(format) {
  const dateArray = {
    a: 'ddd',
    A: 'dddd',
    b: 'MMM',
    B: 'MMMM',
    d: 'DD',
    m: 'MM',
    w: 'Do',
    y: 'YY',
    Y: 'YYYY',
  };
  let str = '';
  for (let i = 0; i < format.length; i += 1) {
    if (format[i].toString() in dateArray) {
      str += dateArray[format[i].toString()];
    } else {
      str += format[i];
    }
  }
  return str;
}

export function truncatePercentageAndDateType(format, type) {
  let result = '';
  if (format && type) {
    if (type === 'date' || type === 'monthyear') {
      result = getDateFormatNew(format.replaceAll('%', ''));
    }
    if (type === 'datetime') {
      const dStr = getDateFormatNew(format.replaceAll('%', ''));
      result = `${dStr} hh:mm A`;
    }
    if (type === 'time') {
      result = 'hh:mm A';
    }
  }
  return result;
}

export function getCompanyTimezoneDate(input, userResponse, type) {
  let local = '-';
  const defaultTf = getFormat(type);
  if (input && input !== '-' && userResponse && userResponse.data) {
    const uData = userResponse.data;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData.timezone ? uData.timezone : defaultTz;
    const dateFormat = uData.lang && uData.lang.date_format
      ? truncatePercentageAndDateType(uData.lang.date_format, type)
      : defaultTf;
    local = moment.utc(input).local().tz(tZone).format(dateFormat);
  }
  return local === 'Invalid date' ? '-' : local;
}

export function getCompanyTimezoneDateLocal(input, userResponse, type) {
  let local = '-';
  const defaultTf = getFormat(type);
  if (input && input !== '-' && userResponse && userResponse.data) {
    const uData = userResponse.data;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData.timezone ? uData.timezone : defaultTz;
    const dateFormat = uData.lang && uData.lang.date_format
      ? truncatePercentageAndDateType(uData.lang.date_format, type)
      : defaultTf;
    local = moment(input).tz(tZone).format(dateFormat);
  }
  return local === 'Invalid date' ? '-' : local;
}

export function getCompanyTimezoneExportDate(input, userResponse, type) {
  let local = '-';
  const defaultTf = getFormat(type);
  if (input && input !== '-' && userResponse && userResponse.data) {
    const uData = userResponse.data;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData.timezone ? uData.timezone : defaultTz;
    const dateFormat = uData.lang && uData.lang.date_format ? truncatePercentageAndDateType(uData.lang.date_format, type) : defaultTf;
    local = moment.utc(input).local().tz(tZone).format('DD-MM-YYYY');
  }
  return local;
}

export function getCompanyTimezoneDateForColumns(input, type) {
  let local = '-';
  const defaultTf = getFormat(type);
  if (input) {
    const defaultTz = 'Asia/Kolkata';
    const uData = window.localStorage.getItem('TimeZone');
    const tZone = uData ? uData.split(' ')[0] : defaultTz;
    const dateFormat = uData ? truncatePercentageAndDateType(uData.split(' ')[1], type) : defaultTf;
    local = moment.utc(input).local().tz(tZone).format(dateFormat);
  }
  return local === 'Invalid date' ? '-' : local;
}

export function truncatePercentageAndDateTypeTime(format, type, timeFormat) {
  let result = '';
  if (format && type && timeFormat) {
    if (type === 'datetime') {
      const dStr = getDateFormatNew(format.replaceAll('%', ''));
      const tStr = timeFormat.replaceAll('%', '').replaceAll('H', 'hh')
        .replaceAll('M', 'mm')
        .replaceAll('S', 'ss');
      result = `${dStr} ${tStr}`;
    }
  }
  return result;
}

export function getLocalTime(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('DD/MM/YYYY hh:mm A');
  }
  return local;
}

export function getLocalTimeStart(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('YYYY-MM-DD 00:00:00');
  }
  return local;
}

export function getLocalTimeEnd(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('YYYY-MM-DD 23:59:00');
  }
  return local;
}

export function getLocalDate(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('DD/MM/YYYY');
  }
  return local;
}

export function getLocalDateFormat(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('MM/DD/YYYY');
  }
  return local;
}

export function getDateFormat(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('DD-MM-YYYY');
  }
  return local;
}

export function getLocalDateDBFormat(input) {
  let local = '';
  if (input) {
    local = moment(input).format('YYYY-MM-DD');
  }
  return local;
}

export function getLocalDateDBTimeFormat(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('YYYY-MM-DD HH:mm:ss');
  }
  return local;
}

export function getLocalDateTimeDBFormat(input) {
  let local = '';
  if (input) {
    local = moment(input).format('YYYY-MM-DDThh:mm');
  }
  return local;
}

export function getLocalTimeOnly(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('hh:mm A');
  }
  return local;
}

export function getLocalDateCustom(input, type) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format(type);
  }
  return local;
}

export function getLocalTimeSeconds(input, toFormat) {
  let local = '';
  let format = 'DD/MM/YYYY hh:mm:ss';
  if (toFormat) {
    format = toFormat;
  }
  if (input) {
    local = moment.utc(input).local().format(format);
  }
  return local;
}

export function getDateTimeSeconds(input) {
  let local = '';
  if (input) {
    local = moment.utc(input).local().format('YYYY-MM-DDTHH:mm:ss');
  }
  return local;
}

export function getDateTimeUtc(input) {
  let local = '';
  if (input) {
    local = moment(input).utc().format('YYYY-MM-DD HH:mm:ss');
  }
  return local;
}

export function getDateTimeUtcMuI(input) {
  let local = false;
  if (input && input.$d) {
    local = moment(input.$d).utc().format('YYYY-MM-DD HH:mm:ss');
  } else if (input && input._d) {
    local = moment(input._d).utc().format('YYYY-MM-DD HH:mm:ss');
  } else if (input) {
    local = moment(input).utc().format('YYYY-MM-DD HH:mm:ss');
  }
  return local;
}

export function getTimeLocalMuI(input) {
  let local = false;
  if (input && input.$d) {
    local = moment(input.$d).local().format('HH:mm:ss');
  } else if (input && input._d) {
    local = moment(input._d).local().format('HH:mm:ss');
  } else if (input) {
    local = moment(input).local().format('HH:mm:ss');
  }
  return local;
}

export function getDateUtcMuI(input) {
  let local = false;
  if (input && input.$d) {
    local = moment(input.$d).utc().format('YYYY-MM-DD');
  } else if (input && input._d) {
    local = moment(input._d).utc().format('YYYY-MM-DD');
  } else if (input) {
    local = moment(input).utc().format('YYYY-MM-DD');
  }
  return local;
}

export function getDateLocalMuI(input) {
  let local = false;
  if (input && input.$d) {
    local = moment(input.$d).format('YYYY-MM-DD');
  } else if (input && input._d) {
    local = moment(input._d).format('YYYY-MM-DD');
  } else if (input) {
    local = moment(input).format('YYYY-MM-DD');
  }
  return local;
}

export function getDateTimeLocalMuI(input) {
  let local = false;
  if (input && input.$d) {
    local = moment(input.$d).format('YYYY-MM-DD HH:mm:ss');
  } else if (input && input._d) {
    local = moment(input._d).format('YYYY-MM-DD HH:mm:ss');
  }
  return local;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayofMonth() {
  const date = new Date();
  const firstDay = new Date(
    date.getFullYear(),
    date.getMonth(),

    1,
  );

  return moment(firstDay).format('YYYY-MM-DD');
}

export function getToday() {
  const date = new Date();
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function getLastDayofMonth() {
  const date = new Date();
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth(),

    daysInMonth(date.getMonth() + 1, date.getFullYear()),
  );

  return moment(lastDay).format('YYYY-MM-DD');
}

export function getDefaultNoValue(input) {
  let value = '-';
  if (input) {
    value = input;
  }
  value = value === 0 || value === '0' ? '-' : value;
  return value;
}

export function extractValueObjects(values) {
  let value = false;
  if (values) {
    if (typeof values === 'object' && values.length) {
      value = values[0];
    } else if (values.id) {
      value = values.id;
    } else if (values.value) {
      value = values.value;
    } else if (!Object.keys(values).length) {
      value = false;
    } else {
      value = values;
    }
  }
  return value;
}

export function extractValueObjectsDisplay(values) {
  let value = '';
  if (values) {
    if (typeof values === 'object' && values.length) {
      value = values[1];
    } else if (values.name) {
      value = values.name;
    } else if (values.display_name) {
      value = values.display_name;
    } else if (typeof values === 'object' && !Object.keys(values).length) {
      value = '';
    } else {
      value = values || '';
    }
  }
  return value;
}

export function extractValueArray(array, col) {
  const newArray = [];
  if (array && array.length && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      const newValue = array[i][col];
      newArray.push(newValue);
    }
  }
  const value = newArray.join(',');
  return value;
}

// export function getColumnArray(array, col) {
//   // eslint-disable-next-line prefer-const
//   let column = [];
//   for (let i = 0; i < array.length; i += 1) {
//     column.push(`"${array[i][col]}"`);
//   }
//   return column; // return column data..
// }

export function getColumnArrayByIdWithArray(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col];
      if (typeof value === 'object') {
        if (array[i][col][0]) {
          column.push(array[i][col][0]);
        }
      } else {
        column.push(array[i][col]);
      }
    }
  }
  return column; // return column data..
}

export function getColumnArrayByIdWithObj(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col] && typeof array[i][col] === 'object' && array[i][col].id) {
      column.push(array[i][col].id);
    }
  }
  return column; // return column data..
}

export function removeRectangularBraces(inputString) {
  const res = inputString.replace(/\[.*?\]/g, '');
  return res.trim();
}

export function getColumnArrayByIdWithArrayName(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col];
      if (typeof value === 'object') {
        if (array[i][col][1]) {
          column.push(removeRectangularBraces(array[i][col][1]));
        }
      } else {
        column.push(array[i][col]);
      }
    }
  }
  return column; // return column data..
}

export function getColumnArrayById(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  if (array && array.length) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][col]) {
        column.push(array[i][col]);
      } else {
        column.push(array[i]);
      }
    }
  }
  return column; // return column data..
}

export function getColumnArrayByNumber(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    column.push(array[i][col]);
  }
  return column; // return column data..
}

export function getColumnArrayByDecimal(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      column.push(parseFloat(array[i][col]).toFixed(2));
    } else {
      column.push(array[i]);
    }
  }
  return column; // return column data..
}

export function diffMinutes(dt2, dt1) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

export function getDiffereceData(filterData, userResponse, period) {
  const data = [];
  for (let i = 0; i < filterData.length; i += 1) {
    const prev = new Date(
      getCompanyTimezoneDate(filterData[i].date, userResponse, 'datetime'),
    );
    for (let j = 1; j < filterData.length; j += 1) {
      const next = new Date(
        getCompanyTimezoneDate(filterData[j].date, userResponse, 'datetime'),
      );
      const differenceInTime = diffMinutes(prev, next);
      if (parseInt(differenceInTime) === parseInt(period)) {
        data.push(filterData[i]);
        data.push(filterData[j]);
      }
    }
  }
  return data;
}

export function getColumnArrayByDate(
  arrays,
  userResponse,
  time,
  period,
  statistic,
) {
  let data = [];
  const lastDay = new Date();
  let firstDay = new Date();
  const defaultTf = getFormat('datetime');
  if (userResponse && userResponse.data && arrays.length > 0) {
    const uData = userResponse.data;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData.timezone ? uData.timezone : defaultTz;
    const dateFormat = uData.lang && uData.lang.date_format
      ? truncatePercentageAndDateType(uData.lang.date_format, 'datetime')
      : defaultTf;
    const array = arrays.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (
      time === 'last 1 week'
      || time === 'last 2 weeks'
      || time === 'last 3 days'
    ) {
      let days = 3;
      if (time === 'last 2 weeks') {
        days = 14;
      }
      if (time === 'last 1 week') {
        days = 7;
      }
      firstDay = firstDay.setTime(firstDay.getTime() - 3600 * 1000 * 24 * days);
      const minDate = moment.utc(firstDay).local().tz(tZone).format(dateFormat);
      const maxDate = moment.utc(lastDay).local().tz(tZone).format(dateFormat);

      const filterData = array.filter(
        (obj) => getCompanyTimezoneDate(obj.date, userResponse, 'datetime')
          >= minDate
          && getCompanyTimezoneDate(obj.date, userResponse, 'datetime') <= maxDate,
      );
      data = getDiffereceData(filterData, userResponse, period);
    } else {
      const minDate = moment
        .utc(firstDay)
        .local()
        .tz(tZone)
        .subtract(time, 'hours')
        .format(dateFormat);
      const maxDate = moment.utc(lastDay).local().tz(tZone).format(dateFormat);
      const filterData = array.filter(
        (obj) => getCompanyTimezoneDate(obj.date, userResponse, 'datetime')
          >= minDate
          && getCompanyTimezoneDate(obj.date, userResponse, 'datetime') <= maxDate,
      );
      data = getDiffereceData(filterData, userResponse, period);
    }
  }

  if (statistic === 'avg') {
    let avg = 0;
    const rdata = groupByMultiple(data, (obj) => obj.id);
    const len = rdata.length;
    for (let i = 0; i < len; i += 1) {
      // avg += rdata[0][i].value;
    }
    rdata.map((item) => {
      // eslint-disable-next-line no-unused-vars
      avg += item[0].value;
    });
    return data;
  }
  if (statistic === 'min') {
    let min = 0;
    const mValue = [];
    const rdata = groupByMultiple(data, (obj) => obj.id);
    rdata.map((item) => {
      mValue.push(item[0].value);
    });
    min = Math.min(...mValue);
    data = data.filter((item) => item.value === min);
    return data;
  }
  if (statistic === 'max') {
    let max = 0;
    const mValue = [];
    const rdata = groupByMultiple(data, (obj) => obj.id);
    rdata.map((item) => {
      mValue.push(item[0].value);
    });
    max = Math.max(...mValue);
    data = data.filter((item) => item.value === max);
    return data;
  }
  return data;
}

export function getColumnArrayByIdType(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    const val = array[i][col];
    if (val && typeof val === 'number') {
      column.push(parseInt(array[i][col]));
    }
    if (val && typeof val === 'string') {
      column.push(`"${array[i][col]}"`);
    }
  }
  return column; // return column data..
}

export function getArrayByInteger(array) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    column.push(parseInt(array[i]));
  }
  return column; // return column data..
}

export function getColumnArrayByField(array, col, field) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    column.push(array[i][col][field]);
  }
  return column; // return column data..
}

export function getColumnArrayByIdCase(array, col) {
  const column = [];
  if (col) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][col]) {
        column.push(array[i][col].toLowerCase());
      }
    }
  }
  return column; // return column data..
}

export function getListOfOperations(array, name) {
  const operationsList = [];
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      for (let j = 0; j < array[i].operations.length; j += 1) {
        if (array[i].operations[j][name]) {
          operationsList.push(array[i].operations[j][name]);
        }
      }
    }
  }
  return operationsList;
}

export function decimalKeyPressDown(e) {
  let result = true;
  const isDecimalKey = e.key === '.';
  const hasDecimalPoint = e.target.value.includes('.');

  // Allow Numpad keys, Backspace, Delete, Tab, and arrow keys
  if (
    (e.code && e.code.includes('Numpad'))
    || e.key === 'Backspace'
    || e.key === 'Delete'
    || e.key === 'Tab'
    || e.key.startsWith('Arrow')
  ) {
    return true;
  }

  // Allow numeric keys and the decimal point if it's not already present
  if ((e.key >= '0' && e.key <= '9') || (isDecimalKey && !hasDecimalPoint)) {
    return true;
  }

  // Prevent all other keys
  e.preventDefault();
  result = false;

  return result;
}

export function integerKeyPressDown(e) {
  const isNumericKey = e.key >= '0' && e.key <= '9';
  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  // Allow Numpad keys, Backspace, Delete, Tab, and arrow keys
  if (
    (e.code && e.code.startsWith('Numpad'))
    || allowedKeys.includes(e.key)
  ) {
    return true;
  }

  // Allow numeric keys only (no decimal point)
  if (isNumericKey) {
    return true;
  }

  // Prevent all other keys
  e.preventDefault();
  return false;
}

export function getAllowedCompanies(userObj) {
  let result = [];
  if (userObj && userObj.data) {
    /* if (userObj.data.allowed_companies && userObj.data.allowed_companies.length) {
      result = getColumnArrayById(userObj.data.allowed_companies, 'id');
    } else */ if (userObj.data.company && userObj.data.company.id) {
      result = userObj.data.company.id;
    }
  }
  return result;
}

export function getAllowedCompaniesCase(userObj) {
  let result = [];
  if (userObj && userObj.data) {
    if (
      userObj.data.allowed_companies
      && userObj.data.allowed_companies.length
    ) {
      result = getColumnArrayById(userObj.data.allowed_companies, 'id');
    } else if (userObj.data.company && userObj.data.company.id) {
      result = userObj.data.company.id;
    }
  }
  return result;
}

export function getAllCompanies(userObj, userRolesObj) {
  let result = [];

  const allowedOperations = getListOfOperations(userRolesObj && userRolesObj.data ? userRolesObj.data.allowed_modules : [], 'code');
  const isShowAll = !!(allowedOperations && allowedOperations.includes(actionCodes['All Commpany']));

  if (userObj && userObj.data) {
    const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');
    if (userObj.data.allowed_companies && userObj.data.allowed_companies.length && (isAll || (userObj.data.company.is_parent && isShowAll))) {
      result = getColumnArrayById(userObj.data.allowed_companies, 'id');
    } else if (userObj.data.company && userObj.data.company.id) {
      result = userObj.data.company.id;
    }
  }
  return result;
}

export function getTenentOptions(userObj, tenantConfig, tenantIdV1) {
  let result = false;

  if (userObj && userObj.data && tenantConfig && tenantConfig.data) {
    const userData = userObj.data;
    const tenantData = tenantConfig.data && tenantConfig.data.length ? tenantConfig.data[0] : false;
    const tenantId = userData.allowed_tenants && userData.allowed_tenants.length ? userData.allowed_tenants[0].id : false;
    if (tenantId && tenantData && tenantData.allowed_tenants && tenantData.allowed_tenants.length) {
      const tid = tenantIdV1 || tenantId
      const currentTenant = tenantData.allowed_tenants.filter((item) => (item.id === tid));
      if (currentTenant && currentTenant.length) {
        result = currentTenant[0];
      }
    }
  }

  return result;
}

export function getAllCompaniesCxo(userObj) {
  let result = [];

  if (userObj && userObj.data) {
    if (userObj.data.allowed_companies && userObj.data.allowed_companies.length && (userObj.data.company.is_parent)) {
      result = getColumnArrayById(userObj.data.allowed_companies, 'id');
    } else if (userObj.data.company && userObj.data.company.id) {
      result = userObj.data.company.id;
    }
  }
  return result;
}

export function isAllCompany(userObj, userRolesObj) {
  let result = false;

  const allowedOperations = getListOfOperations(userRolesObj && userRolesObj.data ? userRolesObj.data.allowed_modules : [], 'code');
  const isShowAll = !!(allowedOperations && allowedOperations.includes(actionCodes['All Commpany']));

  if (userObj && userObj.data) {
    const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');
    if (userObj.data.allowed_companies && userObj.data.allowed_companies.length && (isAll || (userObj.data.company.is_parent && isShowAll))) {
      result = true;
    } else {
      result = false;
    }
  }
  return result;
}

export function getListOfModuleOperations(array, module, name) {
  const operationsList = [];
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === module) {
        for (let j = 0; j < array[i].operations.length; j += 1) {
          if (array[i].operations[j][name]) {
            operationsList.push(array[i].operations[j][name]);
          }
        }
      }
    }
  }
  return operationsList;
}

export function getModuleDisplayName(array, module, name) {
  let displayName = '';
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === module) {
        if (array[i][name]) {
          displayName = array[i][name];
        }
      }
    }
  }
  return displayName;
}

export function getMenuItems(array, module, name) {
  const menuList = [];
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === module) {
        for (let j = 0; j < array[i].menu.length; j += 1) {
          if (array[i].menu[j][name]) {
            menuList.push(array[i].menu[j][name]);
          }
        }
      }
    }
  }
  return menuList;
}

export function getSequencedMenuItems(array, module, name) {
  let menuList = [];
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === module) {
        for (let j = 0; j < array[i].menu.length; j += 1) {
          if (array[i].menu[j][name]) {
            menuList.push(array[i].menu[j]);
          }
        }
      }
    }
  }
  if (menuList && menuList.length) {
    menuList = menuList.sort((a, b) => a.sequence - b.sequence);
  }
  return menuList;
}
export function getMenuItemsForSite(array, module, list, name) {
  const menuList = [];
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === module) {
        for (let j = 0; j < array[i].menu.length; j += 1) {
          if (array[i].menu[j][name] && list.includes(array[i].menu[j][name])) {
            menuList.push(array[i].menu[j][name]);
          }
        }
      }
    }
  }
  return menuList;
}

export function getMenuItemsForCompanyConfig(array, module, parentMenu, name) {
  const menuList = [];
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === module) {
        for (let j = 0; j < array[i].menu.length; j += 1) {
          if (
            array[i].menu[j][name]
            && array[i].menu[j].parent_menu
            && array[i].menu[j].parent_menu.name === parentMenu
          ) {
            menuList.push(array[i].menu[j][name]);
          }
        }
      }
    }
  }
  return menuList;
}

export function isOperationsExists(array, name) {
  let isExists = false;
  if (name) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].name === name) {
        if (array[i].operations.length > 0) isExists = true;
      }
    }
  }
  return isExists;
}

export function checkActionItems(actionAllowed, actionText) {
  let value = true;

  if (actionText) {
    if (actionText.includes(actionAllowed)) value = false;
  }
  return value;
}

export function getArrayFromIdsMenus(array, ids, col) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].id === 1) {
      column.push(array[i]);
    }
    if (array[i][col]) {
      const value = array[i][col].toLowerCase();
      if (ids && (ids.indexOf(value) !== -1 || ids.includes(value))) {
        column.push(array[i]);
      }
    }
  }
  return column; // return column data..
}

export function getArrayFromValues(array, ids, col) {
  const column = [];
  if (array && array.length) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][col]) {
        const value = array[i][col];
        if (ids && (ids.indexOf(value) !== -1 || ids.includes(value))) {
          column.push(array[i]);
        }
      }
    }
  }
  return column; // return column data..
}

export function getArrayFromValuesById(array, ids, col) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col];
      const idToArray = ids && ids.length > 0 ? ids : [ids];
      if (idToArray && idToArray.indexOf(value) === -1) {
        column.push(array[i]);
      }
    }
  }
  return column; // return column data..
}

export function getArrayFromValuesByObject(array, ids, col) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      if (typeof array[i][col] === 'object') {
        if (array[i][col][0]) {
          const value = array[i][col][0];
          const idToArray = ids && ids.length > 0 ? ids : [ids];
          if (idToArray && idToArray.indexOf(value) === -1) {
            column.push(array[i]);
          }
        }
      }
    }
  }
  return column; // return column data..
}

export function getArrayFromValuesByIdIn(array, ids, col) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col];
      if (ids && ids.length && ids.indexOf(value) !== -1) {
        column.push(array[i]);
      }
    }
  }
  return column; // return column data..
}

export function isArrayValueExists(array, key, value) {
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key] === value) {
      result = array[i].value;
      break;
    }
  }
  return result; // return column data..
}

export function generateArrayFromValue(array, key, value) {
  const result = [];
  if (array && array.length && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][key] && array[i][key] === value) {
        result.push(array[i]);
      }
    }
  }
  return result; // return column data..
}

export function generateArrayFromValueNotIn(array, key, value) {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key] && array[i][key] !== value) {
      result.push(array[i]);
    }
  }
  return result; // return column data..
}

export function getTotalFromArray(array, key) {
  let count = 0;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key]) {
      count += array[i][key];
    }
  }
  return count; // return column data..
}

export function calculatePercent(percent, total) {
  if (percent && total && percent < total) {
    return (percent / 100) * total;
  }
  return 0;
}

export function mergeArray(array1, array2, company, model, fileName, category) {
  const result = [];
  for (let i = 0; i < array1.length; i += 1) {
    const remfile = `data:${array2[i].type};base64,`;
    const photoname = array2[i].name;
    const fname = `${getLocalTimeSeconds(new Date())}-${Math.random()}`.replace(
      /\s+/g,
      '',
    );
    const filedata = array1[i].replace(remfile, '');
    const fileSize = array2[i].size;
    const values = {
      datas: filedata,
      database64: array1[i],
      mimetype: array2[i].type,
      datas_fname: photoname,
      name: fname,
      company_id: company,
      res_model: model,
      size: fileSize,
    };
    if (fileName) {
      values.name = `${fileName}-${values.name}`;
      values.fileName = fileName;
    }
    if (category) {
      values.ir_attachment_categ = category;
    }
    result.push(values);
  }
  return result; // return column data..
}

export function prepareDocuments(array, id) {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    const values = {
      datas: array[i].datas,
      database64: array[i].database64,
      datas_fname: array[i].datas_fname,
      name: array[i].name,
      mimetype: array[i].mimetype,
      company_id: array[i].company_id,
      res_model: array[i].res_model,
      res_id: id,
    };
    result.push(values);
  }
  return result; // return column data..
}

export function prepareDocuments1(array) {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    const values = {
      datas: array[i].datas,
      database64: array[i].database64,
      datas_fname: array[i].datas_fname,
      name: array[i].name,
      mimetype: array[i].mimetype,
      company_id: array[i].company_id,
      res_model: array[i].res_model,
    };
    result.push(values);
  }
  return result; // return column data..
}

export function bytesToSizeMultiple(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  // eslint-disable-next-line no-restricted-properties
  const size = Math.round(bytes / 1024 ** i);
  const mes = sizes[i];
  if (parseInt(size) > 20 && mes === 'MB') {
    return false;
  }

  return true;
}

export function bytesToSizeMultipleNew(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  // eslint-disable-next-line no-restricted-properties
  const size = Math.round(bytes / 1024 ** i);
  const mes = sizes[i];
  if (parseInt(size) > 10 && mes === 'MB') {
    return false;
  }

  return true;
}

export function isMemorySizeLarge(array) {
  let result = true;
  for (let i = 0; i < array.length; i += 1) {
    if (!bytesToSizeMultiple(array[i].size)) {
      result = false;
      break;
    }
  }
  return result; // return column data..
}

export function isMemorySizeLargeNew(array) {
  let result = true;
  for (let i = 0; i < array.length; i += 1) {
    if (!bytesToSizeMultipleNew(array[i].size)) {
      result = false;
      break;
    }
  }
  return result; // return column data..
}

export function isArrayValueExistsBool(array, key, value) {
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key]) {
      if (array[i][key] === value || array[i][key].includes(value)) {
        result = true;
        break;
      }
    }
  }
  return result; // return column data..
}

export function isArrayValueExistsData(array, key, value) {
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key]) {
      if (array[i][key] === value || array[i][key].includes(value)) {
        result = array[i].id;
        break;
      }
    }
  }
  return result; // return column data..
}

export function isArrayColumnExists(array, col) {
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      result = true;
      break;
    }
  }
  return result; // return column data..
}

export function trimJsonObject(payload) {
  // eslint-disable-next-line array-callback-return
  Object.keys(payload).map((payloadObj) => {
    if (payload[payloadObj] === false) {
      // eslint-disable-next-line no-param-reassign
      payload[payloadObj] = '';
    }
    return null;
  });
  return payload;
}

export function trimArrayofObjectValue(data, keys) {
  if (data && data.length && data.length > 0) {
    data.forEach((o) => keys.forEach((k) => o[k] = o[k].toString().trim()));
  }
  return data;
}

export function deleteSpecificKeyfromArray(data, keys) {
  if (data && data.length && data.length > 0) {
    data.forEach((o) => keys.forEach((k) => delete o[k]));
  }
  return data;
}

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    /* if (type === 'Last week' || type === 'Last month' || type === 'Last 3 months') {
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
    } */
    if (type === 'Last month') {
      const lastMonthFirstdate = moment()
        .utc()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastMonthLastdate = moment()
        .utc()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(lastMonthFirstdate);
      daterange.push(lastMonthLastdate);
    } else if (type === 'Next Month') {
      const nextMonthFirstdate = moment()
        .utc()
        .add(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const nextMonthLastdate = moment()
        .utc()
        .add(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(nextMonthFirstdate);
      daterange.push(nextMonthLastdate);
    } else if (type === 'Last week') {
      const lastWeekFirstdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .startOf('week')
        .format('YYYY-MM-DD HH:mm:ss');
      const lastWeekLastdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .endOf('week')
        .format('YYYY-MM-DD HH:mm:ss');
      daterange.push(lastWeekFirstdate);
      daterange.push(lastWeekLastdate);
    } else if (type === 'Last 7 days') {
      const firstDate = moment()
        .utc()
        .subtract(7, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
      const lastdate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      daterange.push(firstDate);
      daterange.push(lastdate);
    } else if (type === 'Last 30 days') {
      const firstDate = moment()
        .utc()
        .subtract(30, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
      const lastdate = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      daterange.push(firstDate);
      daterange.push(lastdate);
    } else if (type === 'Last 3 months') {
      const lastThreeMonthFirstdate = moment()
        .utc()
        .subtract(3, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastThreeMonthLastdate = moment()
        .utc()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(lastThreeMonthFirstdate);
      daterange.push(lastThreeMonthLastdate);
    } else if (type === 'Last quarter') {
      const lastQuarterMonthFirstdate = moment()
        .utc()
        .subtract(6, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastQuarterMonthEnddate = moment()
        .utc()
        .subtract(4, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(lastQuarterMonthFirstdate);
      daterange.push(lastQuarterMonthEnddate);
    } else if (type === 'This week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('week');
      const weekEnd = currentDate.clone().endOf('week');
      daterange.push(moment(weekStart).utc().format('YYYY-MM-DD HH:mm:ss'));
      daterange.push(moment(weekEnd).utc().format('YYYY-MM-DD HH:mm:ss'));
    } else if (type === 'This month' || type === 'This Month') {
      const date = new Date();
      const firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        1,
      );
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        daysInMonth(date.getMonth() + 1, date.getFullYear()),
      );
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD HH:mm:ss'));
      daterange.push(
        moment(lastDay).add(1, 'day').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'Today') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = new Date();
      daterange.push(`${moment(firstDay).utc().format('YYYY-MM-DD')} 18:30:00`);
      daterange.push(`${moment(lastDay).utc().format('YYYY-MM-DD')} 18:30:00`);
    } else if (type === 'This year') {
      const firstDay = `${new Date().getFullYear() - 1}-12-31 18:30:00`;
      const lastDay = `${new Date().getFullYear()}-12-31 18:30:00`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export const defaultTimeZone = 'Asia/Kolkata';

export function getDatesOfQueryWithUtc(type, timezone) {
  let daterange = [];
  const timeZoneDate = moment().tz(timezone);

  try {
    if (type === 'Last week') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'weeks')
          .startOf('isoWeek').utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'weeks')
          .endOf('isoWeek').utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'This week') {
      daterange.push(
        moment(timeZoneDate).startOf('isoWeek').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate).endOf('isoWeek').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'Last month') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'months')
          .startOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'months')
          .endOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'This month' || type === 'This Month') {
      daterange.push(
        moment(timeZoneDate)
          .startOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate).endOf('month').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'Last 3 months') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(3, 'months')
          .startOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'months')
          .endOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'Next Month') {
      daterange.push(
        moment(timeZoneDate)
          .add(1, 'months')
          .startOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate)
          .add(1, 'months')
          .endOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'Last 30 days') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(30, 'days')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(moment(timeZoneDate).utc().format('YYYY-MM-DD HH:mm:ss'));
    } else if (type === 'Last quarter') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(6, 'months')
          .startOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate)
          .subtract(4, 'months')
          .endOf('month')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'Today') {
      daterange.push(
        moment(timeZoneDate).startOf('date').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate).endOf('date').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
    } else if (type === 'This year') {
      daterange.push(
        moment(timeZoneDate).startOf('year').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
      daterange.push(
        moment(timeZoneDate).endOf('year').utc().format('YYYY-MM-DD HH:mm:ss'),
      );
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getDatesOfQueryWitLocal(type, timezone) {
  let daterange = [];
  const timeZoneDate = moment().tz(timezone);

  try {
    if (type === 'Last 3 months') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(3, 'months')
          .startOf('month')
          .format('YYYY-MM-DD'),
      );
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD'),
      );
    } else if (type === 'Last month') {
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD'),
      );
      daterange.push(
        moment(timeZoneDate)
          .subtract(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD'),
      );
    } else if (type === 'Last week') {
      daterange.push(moment(timeZoneDate).subtract(1, 'weeks').startOf('week')
        .format('YYYY-MM-DD'));
      daterange.push(moment(timeZoneDate).subtract(1, 'weeks').endOf('week')
        .format('YYYY-MM-DD'));
    } else if (type === 'This week') {
      daterange.push(moment(timeZoneDate).startOf('week').format('YYYY-MM-DD'));
      daterange.push(moment(timeZoneDate).endOf('week').format('YYYY-MM-DD'));
    } else if (type === 'This month' || type === 'This Month') {
      daterange.push(moment(timeZoneDate).startOf('month').format('YYYY-MM-DD'));
      daterange.push(moment(timeZoneDate).endOf('month').format('YYYY-MM-DD'));
    } else if (type === 'Today') {
      daterange.push(moment(timeZoneDate).startOf('date').format('YYYY-MM-DD'));
      daterange.push(moment(timeZoneDate).endOf('date').format('YYYY-MM-DD'));
    } else if (type === 'This year') {
      daterange.push(moment(timeZoneDate).startOf('year').format('YYYY-MM-DD'));
      daterange.push(moment(timeZoneDate).endOf('year').format('YYYY-MM-DD'));
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getQueryInArrays(array) {
  let result = false;
  if (array && array.length) {
    result = array.reduce(
      (h, obj) => Object.assign(h, { [obj.key]: (h[obj.key] || []).concat(obj) }),
      {},
    );
  }
  return result;
}

export function getQueryInKey(array) {
  let result = false;
  if (array && array.length) {
    result = array[0].key;
  }
  return result;
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
      query += `["create_date",">=","${startDate}"],["create_date","<=","${endDate}"],`;
    } else if (array[i].type === 'date') {
      const type = array[i].value;
      const dates = getDatesOfQuery(type);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["create_date",">=","${startDate}"],["create_date","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'datearray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["create_date",">=","${startDate}"],["create_date","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatefield') {
      const type = array[i].value;
      const dates = getDatesOfQuery(type);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'customdatefieldarray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatedynamic') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    }
  }
  query = query.substring(0, query.length - 1);
  return query;
}

export function queryGeneratorWithUtcV1(array, userInfo) {
  let query = '';
  const companyTimeZone = userInfo && userInfo.company && userInfo.company.timezone
    ? userInfo.company.timezone
    : 'Asia/Kolkata';
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
      query += `["create_date",">=","${startDate}"],["create_date","<=","${endDate}"],`;
    } else if (array[i].type === 'date') {
      const type = array[i].value;
      const dates = getDatesOfQueryWithUtc(type, companyTimeZone);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["create_date",">=","${startDate}"],["create_date","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'datearray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["create_date",">=","${startDate}"],["create_date","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatefield') {
      const type = array[i].value;
      const dates = getDatesOfQueryWithUtc(type, companyTimeZone);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'customdatefieldarray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatedynamic') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    }
  }
  query = query.substring(0, query.length - 1);
  return query;
}

export const getPickingFilterData = (array, field) => {
  const pickData = array;
  for (let i = 0; i < pickData.length; i += 1) {
    const pickValue = `${pickData[i].name}`;
    pickData[i][field] = [pickData[i].id, pickValue];
  }
  return pickData;
};

export function queryGeneratorV1(array, dateField) {
  let query = '';
  const field = dateField || 'create_date';
  if (array && array.length) {
    const data = array.filter((item) => item.type === 'inarray');
    const inFields = getQueryInArrays(data);
    if (inFields) {
      const arrData = Object.values(inFields);
      for (let i = 0; i < arrData.length; i += 1) {
        const ids = getColumnArrayByIdType(arrData[i], 'value');
        const key = getQueryInKey(arrData[i]);
        query += `["${key}","in",[${ids}]],`;
      }
    }
  }
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].type === 'text') {
      query += `["${array[i].key}","ilike","${array[i].value}"],`;
    } else if (
      array[i].operatorValue
      && array[i].operatorValue === 'contains'
    ) {
      query += `["${array[i].columnField}","ilike","${array[i].value}"],`;
    } else if (
      array[i].operatorValue
      && array[i].operatorValue !== 'contains'
    ) {
      query += `["${array[i].columnField}","${array[i].operatorValue}",${array[i].value}],`;
    } else if (array[i].type === 'id') {
      query += `["${array[i].key}","=","${array[i].value}"],`;
    } else if (array[i].type === 'boolean') {
      query += `["${array[i].key}","=","${array[i].valueCheck}"],`;
    } else if (array[i].type === 'textunique') {
      query += `["${array[i].key}","=","${array[i].value}"],`;
    } else if (array[i].type === 'multiple') {
      query += `["${array[i].key}","in",[${array[i].value}]],`;
    } else if (array[i].type === 'ids') {
      query += `["${array[i].key}","=",${array[i].value}],`;
    } else if (array[i].type === 'set') {
      query += `["${array[i].key}","!=",false],`;
    } else if (array[i].type === 'dateless') {
      query += `["${array[i].key}","<","${array[i].value}"],`;
    } else if (array[i].type === 'numless') {
      query += `["${array[i].key}",">",${array[i].value}],`;
    } else if (array[i].type === 'numgreat') {
      query += `["${array[i].key}","<",${array[i].value}],`;
    } else if (array[i].type === 'customdate') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${field}",">=","${startDate}"],["${field}","<=","${endDate}"],`;
    } else if (array[i].type === 'date') {
      const type = array[i].value;
      const dates = getDatesOfQuery(type);
      const startDate = dates[0];
      const endDate = dates[1];
      if (startDate !== undefined) {
        query += `["${field}",">=","${startDate}"],["${field}","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'datearray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${field}",">=","${startDate}"],["${field}","<=","${endDate}"],`;
    } else if (array[i].type === 'datecompare') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${array[i].key}",">=","${startDate}"],["${array[i].key}","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatefield') {
      const type = array[i].value;
      const dates = getDatesOfQuery(type);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'customdatefieldarray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatedynamic') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    }
  }
  query = query.substring(0, query.length - 1);
  return query;
}

export function queryGeneratorWithUtc(array, dateField, userInfo) {
  let query = '';

  const companyTimeZone = userInfo && userInfo.company && userInfo.company.timezone
    ? userInfo.company.timezone
    : 'Asia/Kolkata';

  const field = dateField || 'create_date';
  if (array && array.length) {
    const data = array.filter((item) => item.type === 'inarray');
    const inFields = getQueryInArrays(data);
    if (inFields) {
      const arrData = Object.values(inFields);
      for (let i = 0; i < arrData.length; i += 1) {
        const ids = getColumnArrayByIdType(arrData[i], 'value');
        const key = getQueryInKey(arrData[i]);
        query += `["${key}","in",[${ids}]],`;
      }
    }
  }
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].type === 'text') {
      query += `["${array[i].key}","ilike","${array[i].value}"],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === 'is')
      || (array[i].operator && array[i].operator === 'is')
    ) {
      query += `["${array[i].columnField || array[i].field}","=","${array[i].value
      }"],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === 'boolean')
      || (array[i].operator && array[i].operator === 'boolean' || array[i].operator === 'isNotEmpty' || array[i].operator === 'isNotEmpty')
    ) {
      query += `["${array[i].columnField || array[i].field}","=",${array[i].value
      }],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === 'not')
      || (array[i].operator && array[i].operator === 'not')
    ) {
      query += `["${array[i].columnField || array[i].field}","!=","${array[i].value
      }"],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === '=')
      || (array[i].operator && array[i].operator === '=')
    ) {
      query += `["${array[i].columnField || array[i].field}","=",${array[i].value
      }],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === '<')
      || (array[i].operator && array[i].operator === '<')
    ) {
      query += `["${array[i].columnField || array[i].field}","<",${array[i].value
      }],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === '>')
      || (array[i].operator && array[i].operator === '>')
    ) {
      query += `["${array[i].columnField || array[i].field}",">",${array[i].value
      }],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue === 'contains')
      || (array[i].operator && array[i].operator === 'contains')
    ) {
      query += `["${array[i].columnField || array[i].field}","ilike","${encodeURIComponent(array[i].value)
      }"],`;
    } else if (
      (array[i].operatorValue && array[i].operatorValue !== 'contains')
      || (array[i].operator && array[i].operator !== 'contains')
    ) {
      query += `["${array[i].columnField || array[i].field}","${array[i].operatorValue
      }",${array[i].value}],`;
    } else if (array[i].type === 'id') {
      query += `["${array[i].key}","=","${array[i].value}"],`;
    } else if (array[i].type === 'boolean') {
      query += `["${array[i].key}","=","${array[i].valueCheck}"],`;
    } else if (array[i].type === 'textunique') {
      query += `["${array[i].key}","=","${array[i].value}"],`;
    } else if (array[i].type === 'multiple') {
      query += `["${array[i].key}","in",[${array[i].value}]],`;
    } else if (array[i].type === 'ids') {
      query += `["${array[i].key}","=",${array[i].value}],`;
    } else if (array[i].type === 'set') {
      query += `["${array[i].key}","!=",false],`;
    } else if (array[i].type === 'dateless') {
      query += `["${array[i].key}","<","${array[i].value}"],`;
    } else if (array[i].type === 'numless') {
      query += `["${array[i].key}",">",${array[i].value}],`;
    } else if (array[i].type === 'numgreat') {
      query += `["${array[i].key}","<",${array[i].value}],`;
    } else if (array[i].type === 'customdate') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${field}",">=","${startDate}"],["${field}","<=","${endDate}"],`;
    } else if (array[i].type === 'date') {
      const type = array[i].value;
      const dates = getDatesOfQueryWithUtc(type, companyTimeZone);
      const startDate = dates[0];
      const endDate = dates[1];
      if (startDate !== undefined) {
        query += `["${field}",">=","${startDate}"],["${field}","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'datearray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${field}",">=","${startDate}"],["${field}","<=","${endDate}"],`;
    } else if (array[i].type === 'datecompare') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${array[i].key}",">=","${startDate}"],["${array[i].key}","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatefield') {
      const type = array[i].value;
      const dates = getDatesOfQueryWithUtc(type, companyTimeZone);
      const startDate = dates[0];
      const endDate = dates[1];
      if (type !== 'Custom') {
        query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
      }
    } else if (array[i].type === 'customdatefieldarray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    } else if (array[i].type === 'customdatedynamic') {
      const startDate = array[i].start;
      const endDate = array[i].end;
      query += `["${array[i].datefield}",">=","${startDate}"],["${array[i].datefield}","<=","${endDate}"],`;
    }
  }
  query = query.substring(0, query.length - 1);
  return query;
}

export function lettersOnly(e) {
  const inputValue = e.which;
  let result = false;
  // allow letters and whitespaces only.
  if (
    e.which !== 8
    && !(inputValue >= 65 && inputValue <= 122)
    && inputValue !== 32
    && inputValue !== 0
  ) {
    e.preventDefault();
  }
  result = true;
  return result;
}
export function lettersAndEnterOnly(e) {
  const inputValue = e.which;
  let result = false;
  // allow letters and whitespaces only.
  if (
    e.which !== 8
    && !(inputValue >= 65 && inputValue <= 122)
    && inputValue !== 32
    && inputValue !== 0 && e.code !== 'Enter'
  ) {
    e.preventDefault();
  }
  result = true;
  return result;
}
export function lettersNumbersOnly(e) {
  const inputValue = e.which;
  const result = false;
  // allow letters and numbers only.
  if (
    e.which !== 8
    && !(inputValue >= 65 && inputValue <= 122)
    && inputValue !== 32
    && inputValue !== 0
    && (e.which < 48 || e.which > 57)
  ) {
    e.preventDefault();
  }
  return result;
}

export function indianMobile(e) {
  const len = e.target.value.length;
  let result = true;
  if (len >= 10) {
    e.preventDefault();
    result = false;
  }

  if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    result = false;
  }
  return result;
}

export function usMobile(e) {
  const len = e.target.value.length;
  let result = true;
  if (len >= 12) {
    e.preventDefault();
    result = false;
  }

  if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    result = false;
  }
  return result;
}

export function integerKeyPress(e) {
  let result = true;
  if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    result = false;
  }
  return result;
}

export function avoidSpaceOnFirstCharacter(e) {
  let result = true;
  if (e.which === 32) {
    e.preventDefault();
    result = false;
  }
  return result;
}

export function integerKeyPressFlex(e) {
  let result = true;
  // let charCode = '';
  const evt = e || window.event;

  const charCode = evt.which || evt.target.value.substr(-1).charCodeAt(0);

  if (
    !(charCode > 47 && charCode < 58)
    && charCode !== 9
    && charCode !== 8
    && charCode !== 46
    && charCode !== 37
    && charCode !== 39
  ) {
    evt.preventDefault();
    result = false;
  }

  return result;
}

export function decimalKeyPress(e) {
  let result = true;
  if (e.code && e.code.includes('Numpad')) {
    if (e.keyCode !== 8 && e.keyCode !== 46 && (e.keyCode < 96 || e.keyCode > 105)) {
      // showAdvice(this, "Decimal numbers only");
      e.preventDefault();
      result = false;
    }
  } else if (e.code && !e.code.includes('Numpad')) {
    if (e.which !== 8 && e.which !== 46 && (e.which < 48 || e.which > 57)) {
      // showAdvice(this, "Decimal numbers only");
      e.preventDefault();
      result = false;
    }
    if (e.which === 46 && e.target.value.indexOf('.') !== -1) {
      // showAdvice(this, "Only one period allowed in decimal numbers");
      e.preventDefault();
      result = false; // only one decimal allowed
    }
  }
  return result;
}

export function noSpecialChars(e) {
  let result = true;
  if (
    e.which !== 32
    && (e.which < 48
      || (e.which > 57 && e.which < 65)
      || (e.which > 90 && e.which < 97)
      || e.which > 122)
  ) {
    e.preventDefault();
    result = false;
  }
  return result;
}

export function truncate(str, count) {
  if (str && str.length > 0) {
    let truncateTxt = str;
    if (str.length > count) {
      truncateTxt = truncateTxt.substring(0, count);
      truncateTxt = `${truncateTxt}...`;
    }
    return truncateTxt;
  }
  return '';
}

export function truncateWord(str, count) {
  if (str && str.length > 0) {
    let truncateTxt = str;
    if (str.length > count) {
      truncateTxt = truncateTxt.substring(0, count);
    }
    return truncateTxt;
  }
  return '';
}

export function generateTag(str, count) {
  if (str && str.length > 0) {
    let truncateTxt = str;
    if (str.length > count) {
      truncateTxt = truncateTxt.substring(0, count).toUpperCase();
    }
    return truncateTxt;
  }
  return '';
}

export function getTimeFromFloat(decimalTimeString) {
  let decimalTime = parseFloat(decimalTimeString);
  decimalTime = decimalTime * 60 * 60;
  let hours = Math.floor(decimalTime / (60 * 60));
  decimalTime -= hours * 60 * 60;
  let minutes = Math.floor(decimalTime / 60);
  decimalTime -= minutes * 60;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const result = `${hours}:${minutes} hours`;

  return result;
}

export function getDateTimeFromFloat(decimalTimeString) {
  let decimalTime = parseFloat(decimalTimeString);
  decimalTime = decimalTime * 60 * 60 * 60;
  let days = Math.floor(decimalTime / (60 * 60 * 60));
  decimalTime -= days * 60 * 60 * 60;
  let hours = Math.floor(decimalTime / (60 * 60));
  decimalTime -= hours * 60 * 60;
  let minutes = Math.floor(decimalTime / 60);
  decimalTime -= minutes * 60;
  if (days < 10) {
    days = `0${days}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (Math.floor(days) > 0) {
    return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)}M`;
  }
  if (Math.floor(hours) > 0) {
    return `${Math.floor(hours)}H ${Math.floor(minutes)}M`;
  }

  return '0';
}

export function convertFloatToTime(floatValue) {
  // Extract hours and fractional minutes
  const totalHours = Math.floor(floatValue); // Integer part is the hours
  const fractionalMinutes = floatValue - totalHours; // Decimal part for minutes

  // Convert fractional minutes to total minutes
  const totalMinutes = Math.round(fractionalMinutes * 60);

  // Total minutes to days, hours, and minutes
  let days = Math.floor(totalHours / 24); // Convert hours to days
  let remainingHours = totalHours % 24; // Remaining hours after days
  let minutes = totalMinutes; // Remaining minutes

  if (days < 10) {
    days = `0${days}`;
  }
  if (remainingHours < 10) {
    remainingHours = `0${remainingHours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (Math.floor(days) > 0) {
    return `${Math.floor(days)}D ${Math.floor(remainingHours)}H ${Math.floor(minutes)}M`;
  }
  if (Math.floor(remainingHours) > 0) {
    return `${Math.floor(remainingHours)}H ${Math.floor(minutes)}M`;
  }
  return '';
}

export function getDifferenceInDays(date) {
  // round to the nearest whole number
  if (date !== '' && date != null && date !== false) {
    const date1 = new Date(date);

    const date3 = new Date();
    const year = date3.getFullYear();
    const month = date3.getMonth() + 1;
    const day = date3.getDate();
    const strTime = `${year}-${month}-${day}`;

    const date2 = new Date(strTime);
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return '';
}

export function getArrayNewFormat(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const newData = [0, 0, array[i]];
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatManyOne(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const newData = [0, 0, array[i].id];
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatUpdate(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const newData = [array[i].id ? 1 : 0, array[i].id, array[i]];
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatUpdateDelete(array) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].isRemove) {
      newData = [array[i].id ? 2 : '', array[i].id, false];
    } else {
      newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, array[i]];
    }
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatUpdateDeleteNew(array) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].isRemove) {
      newData = [array[i].id ? 2 : '', array[i].id, false];
    } else {
      const obj = array[i];
      newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, obj.id && delete obj.id ? obj : obj];
    }
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatUpdateDeleteNewV1(array) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].isRemove) {
      newData = [array[i].id ? 2 : '', array[i].id, false];
    } else {
      const obj = { ...array[i] };
      if (obj.id) delete obj.id;
      delete obj.isRemove;
      newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, obj];
    }
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatCreateNewV1(array) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    if (!array[i].isRemove && typeof array[i] !== 'number') {
      const obj = { ...array[i] };
      if (obj.id) delete obj.id;
      delete obj.isRemove;
      newData = [0, 0, obj];
    }
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayFormatDeleteOnlyIds(array) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    newData = [2, array[i], false];
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayNewFormatCrud(array, ids) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    const { id } = array[i];
    if (ids && ids.indexOf(id) === -1) {
      newData = [0, 0, array[i]];
      newArray.push(newData);
    }
  }

  const newArrIds = getColumnArrayById(array, 'id');
  for (let j = 0; j < ids.length; j += 1) {
    const id = ids[j];
    if (newArrIds && newArrIds.indexOf(id) === -1) {
      newData = [2, id, false];
      newArray.push(newData);
    }
  }
  return newArray;
}

export function getFloatValue(input) {
  let local = '0.00';
  if (input) {
    local = parseFloat(input).toFixed(2);
  }
  return local;
}

export function truncateStars(str) {
  let result = '';
  if (str) {
    result = str.replaceAll('**', '');
  }
  return result;
}

export function truncateFrontSlashs(str) {
  let result = '';
  if (str) {
    result = str.replaceAll('\\', '');
  }
  return result;
}

export function truncateSpecialChars(str) {
  let result = '';
  if (str) {
    result = str.replace(/[^a-zA-Z ]/g, '');
  }
  return result;
}

export function truncateHTMLTags(str) {
  let result;
  if (str) {
    result = str.replace(/<[^>]*>/g, '');
  } else {
    result = '';
  }
  return result;
}

export function truncateHTMLTagsNew(str) {
  let result;
  console.log(str);
  if (str) {
    result = str.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
  } else {
    result = '';
  }
  console.log(result);
  return result;
}

export function htmlToReact(str) {
  let result = '';
  if (str) {
    result = str.replace('class', 'className');
  }
  return result;
}

export function savePdfContent(
  title,
  header,
  body,
  fileName,
  companyName,
  filters,
  filterValue,
) {
  const ipcLogo = window.localStorage.getItem('company_logo')
    && window.localStorage.getItem('company_logo') !== 'false'
    && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}`
    : false;

  const pdf = new jsPDF('l', 'pt', [1200, 1600]);
  const totalPagesExp = '{total_pages_count_string}';

  let headingsData = [{ name: companyName }];

  if (filters && filters !== '') {
    headingsData = [{ name: companyName }, { name: `Filters - ${filters}` }];
  }

  if (filterValue === 'location') {
    headingsData = [{ name: companyName }, { name: `Location - ${filters}` }];
  }

  // Report Name
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center',
        fillColor: null,
        fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 10,
      overflow: 'linebreak',
    },
    body: [{ name: `${title} Report` }],
  });

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center',
        fillColor: null,
      },
      1: {
        halign: 'center',
        fillColor: null,
      },
      2: {
        halign: 'center',
        fillColor: null,
      },
    },
    styles: {
      fontSize: 7,
      overflow: 'linebreak',
      cellPadding: 2,
    },
    startY: pdf.lastAutoTable.finalY + 1,
    body: headingsData,
  });

  pdf.autoTable({
    body,
    didDrawPage(data) {
      // Header
      if (ipcLogo) {
        pdf.addImage(ipcLogo, 'JPEG', 780, 5, 50, 30);
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(10);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const pageSize = pdf.internal.pageSize;
      const pageHeight = pageSize.height
        ? pageSize.height
        : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
    columns: header,
    styles: {
      fontSize: 5,
      cellWidth: 50,
      columnWidth: 50,
    },
    columnStyles: {
      cellWidth: 50,
      columnWidth: 50,
    },
    startY: pdf.lastAutoTable.finalY + 2,
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  pdf.save(fileName);
}
export const savePdfContentData = async (reportName, title, targetEle2, targetEle3, actionEle, surveyAnswerReport, companyName) => {
  const actionDiv = document.getElementById(actionEle);
  if (actionDiv) {
    actionDiv.style.display = 'none';
  }
  const header = reportName;
  const pdf = new jsPDF('l', 'mm', [1200, 1800]);

  let questionsLength = '';
  surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
    && surveyAnswerReport.data.survey_dict.page_ids.length && surveyAnswerReport.data.survey_dict.page_ids.map(async (sur, index) => {
    questionsLength = surveyAnswerReport.data.survey_dict.page_ids[index].question_ids.length;

    surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
        && surveyAnswerReport.data.survey_dict.page_ids && surveyAnswerReport.data.survey_dict.page_ids[index] && surveyAnswerReport.data.survey_dict.page_ids[index].question_ids.map(async (ans, index1) => {
      pdf.setFontSize(50);
      const element2 = `${targetEle2}-${index}${index1}`;
      const targetDiv2 = document.getElementById(element2);
      if (targetDiv2) {
        const canvas = await html2canvas(targetDiv2);
        const image = canvas.toDataURL('image/jpeg', 1);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const widthRatio = pageWidth / canvas.width;
        const heightRatio = pageHeight / canvas.height;
        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
        await pdf.addImage(image, 'png', index1 === 0 ? 10 : 0, index1 === 0 ? 70 : 0, canvas.width * ratio, canvas.height * ratio);
      }
      const element3 = `${targetEle3}-${index}${index1}`;
      const targetDiv3 = document.getElementById(element3);

      if (targetDiv3) {
        pdf.autoTable(targetDiv3);
      }
      if (index1 === 0) {
        pdf.text(`${companyName}  - ${header}`, 850, 35, { align: 'center' });
        if (sur.page && sur.page.name) {
          pdf.text(`Page - ${sur.page.name}`, 850, 65, { align: 'center' });
        }
      }
      if (index1 < questionsLength - 1) pdf.addPage();
    });
  });
  setTimeout(async () => {
    await pdf.save(`${title}.pdf`);
  }, questionsLength * 2000);
};

export function saveLargPdfContent(title, header, body, fileName, companyName, filters, filterValue) {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}` : false;

  const pdf = new jsPDF('l', 'pt', [900, 800]);
  const totalPagesExp = '{total_pages_count_string}';

  let headingsData = [
    { name: companyName },
  ];

  if (filters && filters !== '') {
    headingsData = [
      { name: companyName },
      { name: `Filters - ${filters}` },
    ];
  }

  if (filterValue === 'location') {
    headingsData = [
      { name: companyName },
      { name: `Location - ${filters}` },
    ];
  }

  // Report Name
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 7,
      overflow: 'linebreak',
    },
    body: [
      { name: `${title} Report` },
    ],
  });

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null,
      },
      1: {
        halign: 'center', fillColor: null,
      },
      2: {
        halign: 'center', fillColor: null,
      },
    },
    styles: {
      fontSize: 5,
      overflow: 'linebreak',
      cellPadding: 3,
    },
    startY: pdf.lastAutoTable.finalY + 1,
    body: headingsData,
  });

  pdf.autoTable({
    body,
    didDrawPage(data) {
      // Header
      if (ipcLogo) {
        pdf.addImage(ipcLogo, 'JPEG', 425, 5, 50, 30);
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(10);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const pageSize = pdf.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
    columns: header,
    styles: {
      fontSize: 3,
      overflow: 'linebreak',
      cellWidth: 'nowrap',
    },
    columnStyles: {
      cellWidth: 'nowrap',
    },
    startY: pdf.lastAutoTable.finalY + 2,
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  pdf.save(fileName);
}

export function saveMediumPdfContent(title, header, body, fileName, companyName, filters, filterValue) {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}` : false;

  const pdf = new jsPDF('l', 'pt', [800, 700]);
  const totalPagesExp = '{total_pages_count_string}';

  let headingsData = [
    { name: companyName },
  ];

  if (filters && filters !== '') {
    headingsData = [
      { name: companyName },
      { name: `Filters - ${filters}` },
    ];
  }

  if (filterValue === 'location') {
    headingsData = [
      { name: companyName },
      { name: `Location - ${filters}` },
    ];
  }

  // Report Name
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 7,
      overflow: 'linebreak',
    },
    body: [
      { name: `${title} Report` },
    ],
  });

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null,
      },
      1: {
        halign: 'center', fillColor: null,
      },
      2: {
        halign: 'center', fillColor: null,
      },
    },
    styles: {
      fontSize: 7,
      overflow: 'linebreak',
      cellPadding: 1,
    },
    startY: pdf.lastAutoTable.finalY + 1,
    body: headingsData,
  });

  pdf.autoTable({
    body,
    didDrawPage(data) {
      // Header
      if (ipcLogo) {
        pdf.addImage(ipcLogo, 'JPEG', 425, 5, 50, 30);
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(10);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const pageSize = pdf.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
    columns: header,
    styles: {
      fontSize: 6,
      overflow: 'linebreak',
      cellWidth: 'nowrap',
    },
    columnStyles: {
      cellWidth: 'nowrap',
    },
    startY: pdf.lastAutoTable.finalY + 2,
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  pdf.save(fileName);
}

export function saveExtraLargPdfContent(title, header, body, fileName, companyName, filters, filterValue, customColumnWidth) {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}` : false;
  let pdf = new jsPDF('l', 'pt', [1300, 1600]);
  if (header && header.length > 30) {
    pdf = new jsPDF('l', 'pt', [1900, 2200]);
  }
  const totalPagesExp = '{total_pages_count_string}';

  let headingsData = [
    { name: companyName },
  ];

  if (filters && filters !== '') {
    headingsData = [
      { name: companyName },
      { name: `Filters - ${filters}` },
    ];
  }

  if (filterValue === 'location') {
    headingsData = [
      { name: companyName },
      { name: `Location - ${filters}` },
    ];
  }

  // Report Name
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 6,
      overflow: 'linebreak',
    },
    body: [
      { name: `${title} Report` },
    ],
  });

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null,
      },
      1: {
        halign: 'center', fillColor: null,
      },
      2: {
        halign: 'center', fillColor: null,
      },
    },
    styles: {
      fontSize: 4,
      overflow: 'linebreak',
      cellPadding: 1,
    },
    startY: pdf.lastAutoTable.finalY + 1,
    body: headingsData,
  });

  pdf.autoTable({
    body,
    didDrawPage(data) {
      // Header
      if (ipcLogo) {
        if (header && header.length > 30) {
          pdf.addImage(ipcLogo, 'JPEG', 1075, 5, 50, 30);
        } else {
          pdf.addImage(ipcLogo, 'JPEG', 775, 5, 50, 30);
        }
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(7);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const pageSize = pdf.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
    columns: header,
    styles: {
      fontSize: 5,
      overflow: 'linebreak',
      cellWidth: 'nowrap',
    },
    columnStyles: customColumnWidth || {},
    startY: pdf.lastAutoTable.finalY + 2,
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  pdf.save(fileName);
}

export function extractTextObject(values) {
  let value = '';
  if (values && typeof values === 'object' && values.length) {
    value = values[1];
  } else if (values && typeof values === 'object' && values.name) {
    value = values.name;
  } else if (values && typeof values === 'object' && values.path_name) {
    value = values.path_name;
  } else if (values && typeof values === 'string') {
    value = values;
  }
  return value;
}

export function extractNameObject(values, field) {
  let value = '';
  if (values && typeof values === 'object' && values[field]) {
    value = values[field];
  }
  return value;
}

export function extractIdObject(values) {
  let value = '';
  if (values && typeof values === 'object' && values.length) {
    value = values[0];
  }
  return value;
}

export function extractOptionsObject(response, values) {
  let options = [];
  if (values && values.length && values.length > 0) {
    const oldId = [{ id: values[0], name: values[1] }];
    const newArr = [...options, ...oldId];
    options = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (response) {
    if (response.loading) {
      options = [{ name: 'Loading..' }];
    } else if (response.data && response.data.length > 1 && !response.loading) {
      const arr = [...options, ...response.data];
      options = [...new Map(arr.map((item) => [item.id, item])).values()];
    } else if (
      response.data
      && response.data.length === 1
      && !response.loading
    ) {
      // const arr = [response.data];
      options = response.data;
    } else if (response.err && !response.loading) {
      options = [];
    }
  }
  return options;
}

export function extractOptionsObjectWithName(response, values, field) {
  let options = [];
  if (response && response.loading) {
    options = [{ [field]: 'Loading..' }];
  }
  if (values && values.length && values.length > 0) {
    const oldId = [{ id: values[0], [field]: values[1] }];
    const newArr = [...options, ...oldId];
    options = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (response && response.data) {
    const arr = [...options, ...response.data];
    options = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (response && response.err) {
    options = [];
  }
  return options;
}

export function getDashboardDataStructure(array, value) {
  const column = [];
  if (array && array.data && value) {
    const dashboardData = find(array.data, { code: value });
    if (dashboardData) {
      const type = dashboardData.ks_dashboard_item_type;
      const innerData = dashboardData.datasets;
      if (type === 'ks_list_view') {
        if (innerData && innerData.length) {
          for (let i = 0; i < innerData.length; i += 1) {
            if (innerData[i].data && innerData[i].data.length) {
              const newArr = {
                id: innerData[i].data[2],
                label: innerData[i].data[1],
                value: innerData[i].data[0],
              };
              column.push(newArr);
            }
          }
        }
      } else if (type === 'ks_bar_chart') {
        const innerLabels = dashboardData.labels;
        if (innerData && innerData.length && innerData[0].data) {
          const itemData = innerData[0].data;
          if (
            itemData
            && itemData.length
            && innerLabels
            && innerLabels.length
          ) {
            for (let i = 0; i < itemData.length; i += 1) {
              if (itemData[i] && innerLabels[i] && innerLabels[i] !== 'False') {
                const newArr = { value: itemData[i], label: innerLabels[i] };
                column.push(newArr);
              }
            }
          }
        }
      }
    }
  }
  return column; // return column data..
}

export function getDashboardDataStructureTicket(array, value) {
  const column = [];
  if (array && array.data && value) {
    const dashboardData = find(array.data, { code: value });
    if (dashboardData) {
      const type = dashboardData.ks_dashboard_item_type;
      const innerData = dashboardData.datasets;
      if (type === 'ks_list_view') {
        if (innerData && innerData.length) {
          for (let i = 0; i < innerData.length; i += 1) {
            if (innerData[i].data && innerData[i].data.length) {
              const newArr = {
                id: innerData[i].data[1],
                label: innerData[i].data[0],
                value: innerData[i].data[4],
              };
              column.push(newArr);
            }
          }
        }
      }
    }
  }
  return column; // return column data..
}

export function numToFloat(num) {
  let result = 0.0;
  if (num) {
    result = num;
  }
  return parseFloat(parseFloat(result)).toFixed(2);
}

export function getBoolean(bool) {
  let result;
  if (bool) {
    result = 'Yes';
  } else {
    result = 'No';
  }
  return result;
}

export function numToFloatView(num) {
  let result = 0.0;
  if (num) {
    result = num;
  }
  return parseFloat(result).toFixed(2);
}

export function getYearList() {
  const year = [];
  for (
    let i = new Date().getFullYear();
    i >= new Date().getFullYear() - 30;
    i -= 1
  ) {
    year.push(i);
  }
  return year;
}

export function addZeroMonth(month) {
  let temp = `${month}`;
  if (temp.length === 1) {
    temp = `0${temp}`;
    return temp;
  }
  return temp;
}

export function checkDatehasObject(data) {
  let result = false;
  if (typeof data === 'object' && data !== null) {
    result = getDateTimeUtc(data);
  }
  return result;
}

export function getArrayToCommaValues(array, key) {
  let ids = '';
  if (array && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].id !== '') {
        if (array[i][key] && array[i][key].length) {
          ids += `${array[i][key][1]},`;
        } else {
          ids += `${array[i][key]},`;
        }
      }
    }
    ids = ids.substring(0, ids.length - 1);
  }
  return ids;
}

export function getPathName(array, key) {
  let ids = '';
  if (array && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].id !== '') {
        if (array[i][key]) {
          ids += `${array[i][key]}${i === array.length - 1 ? '' : ','} `;
        }
      }
    }
    ids = ids.substring(0, ids.length - 1);
  }
  return ids;
}

export function getArrayToValues(array, key) {
  let ids = '';
  if (array && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i].id !== '') {
        if (array[i][key] && array[i][key].length) {
          ids += ` ${array[i][key]},`;
        } else {
          ids += ` ${array[i][key]},`;
        }
      }
    }
    ids = ids.substring(0, ids.length - 1);
  }
  return ids;
}

export function generatePassword(count) {
  const length = count || 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function getRandomChar(charSet) {
  const randomIndex = Math.floor(Math.random() * charSet.length);
  return charSet[randomIndex];
}

export function autoGeneratePassword(count) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|\\;:\'",.<>/?';

  let password = '';
  const passwordLength = count || 8; // Set desired password length here

  // Generate at least one character from each character set
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  // Generate remaining characters randomly
  while (password.length < passwordLength) {
    const charSets = [lowercaseChars, uppercaseChars, numberChars, specialChars];
    const randomCharSet = charSets[Math.floor(Math.random() * charSets.length)];
    password += getRandomChar(randomCharSet);
  }

  return password;
}

export function getStartTime(startDate) {
  let res = new Date();
  if (startDate) {
    res = new Date(startDate);
    res.setHours(0);
    res.setMinutes(0);
    res.setSeconds(0);
  }
  return res;
}
export function getEndTime(endDate) {
  let res = new Date();
  if (endDate) {
    res = new Date(endDate);
    res.setHours(24);
    res.setMinutes(0);
    res.setSeconds(0);
  }
  return res;
}
export function getEndTimeForInspection(endDate) {
  let res = new Date();
  if (endDate) {
    res = new Date(endDate);
    res.setHours(23);
    res.setMinutes(59);
    res.setSeconds(59);
  }
  return res;
}

export function getDateAndTimeForReports(
  type,
  calendarFirstDay,
  calendarLastDay,
) {
  let daterange = [];
  const firstDay = moment().subtract(1, 'day');
  const lastDay = moment();

  try {
    if (type === '%(today)s' || type === 'Today') {
      daterange.push(
        `${moment(getStartTime(lastDay)).utc().format('YYYY-MM-DD HH:mm:ss')}`,
      );
      daterange.push(
        `${moment(getEndTimeForInspection(lastDay))
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')}`,
      );
    } else if (type === '%(yesterday)s' || type === 'Yesterday') {
      const getYesterdayFirstDay = firstDay.subtract(1, 'day');
      const getYesterdayLastDay = lastDay.subtract(1, 'day');
      daterange.push(
        `${moment(getStartTime(lastDay)).utc().format('YYYY-MM-DD HH:mm:ss')}`,
      );
      daterange.push(
        `${moment(getEndTimeForInspection(getYesterdayLastDay))
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')}`,
      );
    } else if (type === '%(custom)s' || type === 'Custom') {
      daterange.push(
        `${moment(getStartTime(calendarFirstDay))
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')}`,
      );
      daterange.push(
        `${moment(getEndTimeForInspection(calendarLastDay))
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')}`,
      );
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getDateAndTimeForReportsLocalDate(type, calendarFirstDay, calendarLastDay) {
  let daterange = [];
  const firstDay = moment().subtract(1, 'day');
  const lastDay = moment();

  try {
    if (type === '%(today)s' || type === 'Today') {
      daterange.push(`${moment(getStartTime(lastDay)).format('YYYY-MM-DD')}`);
      daterange.push(`${moment(getEndTimeForInspection(lastDay)).format('YYYY-MM-DD')}`);
    } else if (type === '%(yesterday)s' || type === 'Yesterday') {
      const getYesterdayFirstDay = firstDay.subtract(1, 'day');
      const getYesterdayLastDay = lastDay.subtract(1, 'day');
      daterange.push(`${moment(getStartTime(lastDay)).format('YYYY-MM-DD')}`);
      daterange.push(`${moment(getEndTimeForInspection(getYesterdayLastDay)).format('YYYY-MM-DD')}`);
    } else if (type === '%(custom)s' || type === 'Custom') {
      daterange.push(`${moment(getStartTime(calendarFirstDay)).format('YYYY-MM-DD')}`);
      daterange.push(`${moment(getEndTimeForInspection(calendarLastDay)).format('YYYY-MM-DD')}`);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getDateAndTimeForPPMChecklistReports(
  userInfo,
  startDate,
  endDate,
) {
  let daterange = [];
  const companyTimeZone = userInfo
    && userInfo.data
    && userInfo.data.company
    && userInfo.data.company.timezone
    ? userInfo.data.company.timezone
    : 'Asia/Kolkata';
  try {
    if (startDate && endDate) {
      daterange.push(
        `${moment(startDate)
          .tz(companyTimeZone)
          .startOf('isoWeek')
          .format('YYYY-MM-DD')}`,
      );
      daterange.push(
        `${moment(endDate)
          .tz(companyTimeZone)
          .endOf('isoWeek')
          .format('YYYY-MM-DD')}`,
      );
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getDateAndTimeForDifferentTimeZones(
  userInfo,
  startDate,
  endDate,
) {
  const companyTimeZone = userInfo
    && userInfo.data
    && userInfo.data.company
    && userInfo.data.company.timezone
    ? userInfo.data.company.timezone
    : 'Asia/Kolkata';
  const dateRangeObj = [];
  if (startDate && endDate) {
    dateRangeObj.push(
      `${moment(startDate)
        .tz(companyTimeZone)
        .startOf('day')
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')}`,
    );
    dateRangeObj.push(
      `${moment(endDate)
        .tz(companyTimeZone)
        .endOf('day')
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')}`,
    );
  }
  return dateRangeObj;
}

export function getDateAndTimeForDifferentTimeZonesLocal(userInfo, startDate, endDate) {
  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : 'Asia/Kolkata';
  const dateRangeObj = [];
  if (startDate && endDate) {
    dateRangeObj.push(`${moment(startDate).tz(companyTimeZone).startOf('date')
      .format('YYYY-MM-DD')}`);
    dateRangeObj.push(`${moment(endDate).tz(companyTimeZone).endOf('date')
      .format('YYYY-MM-DD')}`);
  }
  return dateRangeObj;
}

export function getArrayFromValuesByItem(array, ids) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i]) {
      const value = parseInt(array[i]);
      if (ids && ids.indexOf(value) === -1) {
        column.push(array[i]);
      }
    }
  }
  return column; // return column data..
}

export function getDatesOfQueryReport(type, userInfo, start, end) {
  let daterange = '';
  try {
    if (type === '%(previous_month)s' || type === 'Previous Month') {
      const lastMonthFirstdate = moment()
        .utc()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastMonthLastdate = moment()
        .utc()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange = `${getCompanyTimezoneDate(
        lastMonthFirstdate,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(lastMonthLastdate, userInfo, 'date')}`;
    } else if (type === '%(next_month)s' || type === 'Next Month') {
      const lastMonthFirstdate = moment()
        .utc()
        .add(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastMonthLastdate = moment()
        .utc()
        .add(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange = `${getCompanyTimezoneDate(
        lastMonthFirstdate,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(lastMonthLastdate, userInfo, 'date')}`;
    } else if (type === '%(last_week)s' || type === 'Last Week') {
      const lastWeekFirstdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
      const lastWeekLastdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .endOf('isoWeek')
        .format('YYYY-MM-DD');
      daterange = `${getCompanyTimezoneDate(
        lastWeekFirstdate,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(lastWeekLastdate, userInfo, 'date')}`;
    } else if (type === '%(next_week)s' || type === 'Next Week') {
      const nextWeekFirstdate = moment()
        .utc()
        .add(1, 'weeks')
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
      const nextWeekLastdate = moment()
        .utc()
        .add(1, 'weeks')
        .endOf('isoWeek')
        .format('YYYY-MM-DD');
      daterange = `${getCompanyTimezoneDate(
        nextWeekFirstdate,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(nextWeekLastdate, userInfo, 'date')}`;
    } else if (type === '%(current_week)s' || type === 'Current Week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('isoWeek');
      const weekEnd = currentDate.clone().endOf('isoWeek');
      daterange = `${getCompanyTimezoneDate(
        weekStart,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(weekEnd, userInfo, 'date')}`;
    } else if (type === '%(this_month)s' || type === 'This Month') {
      const date = new Date();
      const firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        1,
      );
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        daysInMonth(date.getMonth() + 1, date.getFullYear()),
      );
      daterange = `${getCompanyTimezoneDate(
        firstDay,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(lastDay, userInfo, 'date')}`;
    } else if (type === '%(today)s' || type === 'Today') {
      const firstDay = new Date();
      daterange = getCompanyTimezoneDate(firstDay, userInfo, 'date');
    } else if (type === '%(yesterday)s' || type === 'Yesterday') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      daterange = getCompanyTimezoneDate(firstDay, userInfo, 'date');
    } else if (type === '%(custom)s' || type === 'Custom') {
      if (start && end) {
        daterange = `${getCompanyTimezoneDate(
          start,
          userInfo,
          'date',
        )} - ${getCompanyTimezoneDate(end, userInfo, 'date')}`;
      } else {
        daterange = getCompanyTimezoneDate(start, userInfo, 'date');
      }
    }
  } catch (e) {
    daterange = '';
  }
  return daterange;
}

export function getDatesOfQueryInventoryReport(type, userInfo, start, end) {
  let daterange1 = '';
  try {
    if (type === '%(last_week)s' || type === 'Last Week') {
      const lastWeekFirstdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
      const lastWeekLastdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .endOf('isoWeek')
        .format('YYYY-MM-DD');
      daterange1 = [
        `${getCompanyTimezoneDate(lastWeekFirstdate, userInfo, 'date')}`,
        `${getCompanyTimezoneDate(lastWeekLastdate, userInfo, 'date')}`,
      ];
    } else if (type === '%(current_week)s' || type === 'This Week') {
      const currentDate = moment();
      const weekStart = currentDate
        .clone()
        .utc()
        .startOf('isoWeek')
        .format('YYYY-MM-DD');
      const weekEnd = currentDate
        .clone()
        .utc()
        .endOf('isoWeek')
        .format('YYYY-MM-DD');
      daterange1 = [
        `${getCompanyTimezoneDate(weekStart, userInfo, 'date')}`,
        `${getCompanyTimezoneDate(weekEnd, userInfo, 'date')}`,
      ];
    } else if (type === '%(custom)s' || type === 'Custom') {
      if (start && end) {
        //   daterange1 = (`${getCompanyTimezoneDate(start, userInfo, 'date')} - ${getCompanyTimezoneDate(end, userInfo, 'date')}`);
        daterange1 = [
          `${getCompanyTimezoneDate(start, userInfo, 'date')}`,
          `${getCompanyTimezoneDate(end, userInfo, 'date')}`,
        ];
      } else {
        daterange1 = [getCompanyTimezoneDate(start, userInfo, 'date')];
      }
    }
  } catch (e) {
    daterange1 = '';
  }
  return daterange1;
}

export function getDatesOfQueryInventoryReportV1(type, userInfo, start, end) {
  let daterange1 = '';
  try {
    if (type === '%(last_week)s' || type === 'Last Week') {
      const lastWeekFirstdate = moment().utc().subtract(1, 'weeks').startOf('isoWeek')
        .format('YYYY-MM-DD');
      const lastWeekLastdate = moment().utc().subtract(1, 'weeks').endOf('isoWeek')
        .format('YYYY-MM-DD');
      daterange1 = [lastWeekFirstdate, lastWeekLastdate];
    } else if (type === '%(current_week)s' || type === 'This Week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().utc().startOf('isoWeek').format('YYYY-MM-DD');
      const weekEnd = currentDate.clone().utc().endOf('isoWeek').format('YYYY-MM-DD');
      daterange1 = [weekStart, weekEnd];
    } else if (type === '%(custom)s' || type === 'Custom') {
      if (start && end) {
        //   daterange1 = (`${getCompanyTimezoneDate(start, userInfo, 'date')} - ${getCompanyTimezoneDate(end, userInfo, 'date')}`);
        daterange1 = [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')];
      } else {
        daterange1 = [moment(end).format('YYYY-MM-DD')];
      }
    }
  } catch (e) {
    daterange1 = '';
  }
  return daterange1;
}

export async function getAccountId() {
  try {
    const response = await fetch(`${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/getAccount`, {
      method: 'GET',
      credentials: 'include', // ✅ Ensures cookies are sent
    });

    if (!response.ok) throw new Error('Failed to fetch accountId');

    return await response.text();
  } catch (error) {
    console.error('Error fetching account ID:', error);
    return ''; // Return empty string if there's an error
  }
}

export async function getTokenId() {
  try {
    const response = await fetch(`${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/getToken`, {
      method: 'GET',
      credentials: 'include', // ✅ Ensures cookies are sent
    });

    if (!response.ok) throw new Error('Failed to fetch accountId');

    return await response.text();
  } catch (error) {
    console.error('Error fetching account ID:', error);
    return ''; // Return empty string if there's an error
  }
}

export async function copyToClipboard(uuid, name) {
  // const isBasePath = !!window.location.pathname.includes('/v3');
  const accountId = await getAccountId(); // Fetch the account ID separately
  const val = `${WEBAPPAPIURL}${name}/${uuid}?accid=${encodeURIComponent(accountId)}`;
  const el = document.createElement('input');
  el.value = val;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export async function copyUrlToClipboard(uuid, name, sid, cid, hcid) {
  // const isBasePath = !!window.location.pathname.includes('/v3');
  const accountId = await getAccountId(); // Fetch the account ID separately
  let val = `${WEBAPPAPIURL}${name}/${uuid}`;
  if (sid) {
    val = `${val}?sid=${sid}?accid=${encodeURIComponent(accountId)}`;
  }
  if (cid) {
    val = `${val}${cid}?accid=${encodeURIComponent(accountId)}`;
  }
  if (hcid) {
    val = `${val}?hcid=${hcid}?accid=${encodeURIComponent(accountId)}`;
  }
  if (!sid && !cid && !hcid) {
    val = `${val}?accid=${encodeURIComponent(accountId)}`;
  }
  const el = document.createElement('input');
  el.value = val;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export async function copyMultiToClipboard(uuid1, uuid2, name) {
  // const isBasePath = !!window.location.pathname.includes('/v3');
  const accountId = await getAccountId(); // Fetch the account ID separately
  const val = `${WEBAPPAPIURL}${name}/${uuid1}/${uuid2}?accid=${encodeURIComponent(accountId)}`;
  navigator.clipboard.writeText(val)
    .then(() => {
      console.log('Text copied to clipboard:', val);
    })
    .catch((error) => {
      console.error('Failed to copy text to clipboard:', error);
    });
}

export function generateArrayFromInner(array, key) {
  let result = [];
  for (let i = 0; i < array.length; i += 1) {
    if (key && array[i][key]) {
      result = [...result, ...array[i][key]];
    }
  }
  return result; // return column data..
}

export function generateArrayFromInnerExtra(array, key, key1) {
  return array.flatMap((item) => item[key].map((question) => ({
    ...question,
    title: item[key1],
  })));
}

export function convertTimeToDecimal(time) {
  try {
    // Check if the time includes a colon
    if (!time.includes(':')) {
      throw new Error('Invalid time format. Time must be in HH:MM format.');
    }

    const [hours, minutes] = time.split(':').map(Number);

    // Check if the time format is correct (e.g., hours and minutes are numbers)
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format. Hours and minutes must be valid numbers.');
    }

    return hours + minutes / 60; // Convert minutes to decimal and add to hours
  } catch (error) {
    console.error(error.message); // Handle error by logging it
    return time; // Return null or some default value if error occurs
  }
}

export function convertDecimalToTime(decimal) {
  let res = '00:00';
  if (decimal && decimal !== '-') {
    const hours = Math.floor(decimal); // Extract the whole number part (hours)
    const minutes = Math.round((decimal - hours) * 60); // Convert the fractional part to minutes
    res = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  return res;
}

export function convertDecimalToTimeReadable(decimal) {
  let res = '-';
  if (decimal) {
    const hours = Math.floor(decimal); // Extract the whole number part (hours)
    const minutes = Math.round((decimal - hours) * 60); // Convert the fractional part to minutes
    res = `${hours > 0 ? `${hours} hours` : ''} ${minutes} minutes`;
  }
  return res;
}

export function detectMob() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return (window.innerWidth <= 800 && window.innerHeight <= 600) || isMobile;
}

export function filterDataPdf(filterValues, field = false) {
  let filterTxt = '';
  for (let i = 0; i < filterValues.length; i += 1) {
    filterTxt += field ? `${filterValues[i][field]}` : `${filterValues[i].label}`;
    if (i === filterValues.length - 1) {
      filterTxt += ' | ';
    } else {
      filterTxt += ', ';
    }
  }
  return filterTxt;
}

export function customFilterDataPdf(filterValues) {
  let filterTxt = '';
  for (let i = 0; i < filterValues.length; i += 1) {
    if (filterValues[i].type === 'date' || filterValues[i].type === 'datearray' || filterValues[i].type === 'customdatefield') {
      filterTxt += `${filterValues[i].label}`;
    } else if (filterValues[i].type === 'text') {
      filterTxt += `${filterValues[i].label} : ${decodeURIComponent(filterValues[i].value)}`;
    } else if (filterValues[i].type === 'customdate' || filterValues[i].type === 'customdatedynamic') {
      filterTxt += `${filterValues[i].label} - ${getLocalDate(filterValues[i].start)} - ${getLocalDate(filterValues[i].end)}`;
    } else if (filterValues[i].title && filterValues[i].key === 'qty_available') {
      filterTxt += `${filterValues[i].title}`;
    } else if (filterValues[i].title && filterValues[i].key !== 'qty_available') {
      filterTxt += `${filterValues[i].title} : ${filterValues[i].value}`;
    } else {
      filterTxt += `${filterValues[i].value}`;
    }
    if (i === filterValues.length - 1) {
      filterTxt += ' | ';
    } else {
      filterTxt += ', ';
    }
  }
  return filterTxt;
}

function filterDataPdfCustom(filterValues) {
  let filterTxt = '';
  for (let i = 0; i < filterValues.length; i += 1) {
    if (filterValues[i][0].type === 'inarray') {
      filterTxt += `${filterValues[i][0].title} : `;
      filterTxt += filterDataPdf(filterValues[i]);
    } else {
      filterTxt += customFilterDataPdf(filterValues[i]);
    }
  }
  return filterTxt;
}

export function customFilterDataArray(filterValues) {
  let filterTxt = '';
  const groupByKey = groupByMultiple(filterValues, (obj) => obj.key);
  if (groupByKey && groupByKey.length && groupByKey.length > 0) {
    filterTxt += filterDataPdfCustom(groupByKey);
  }
  return filterTxt;
}

export function filterStringGeneratorDynamic(filters, globalValue) {
  let filterTxt = '';
  const customFilters = filters.customFilters ? filters.customFilters : [];
  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }
  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return globalValue ? `${filterTxt} Custom Filter: ${globalValue} ` : filterTxt;
}

export function getDatePickerFormat(userResponse, type) {
  let local = '';
  const defaultTf = getFormat(type);
  if (userResponse && userResponse.data) {
    const uData = userResponse.data;
    const dateFormat = uData.lang && uData.lang.date_format && uData.lang.time_format
      ? truncatePercentageAndDateType(uData.lang.date_format, type, uData.lang.time_format)
      : defaultTf;
    local = `${dateFormat} `;
  }
  return local;
}

export function getDateTimePickerFormat(userResponse, type) {
  let local = '';
  const defaultTf = getFormat(type);
  if (userResponse && userResponse.data) {
    const uData = userResponse.data;
    const dateFormat = uData.lang && uData.lang.date_format && uData.lang.time_format
      ? truncatePercentageAndDateTypeTime(uData.lang.date_format, type, uData.lang.time_format)
      : defaultTf;
    local = `${dateFormat} `;
  }
  return local;
}

export function getTimeFromDecimal(decimalTimeString) {
  let res = '-';
  if (decimalTimeString) {
    let decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    let hours = Math.floor(decimalTime / (60 * 60));
    decimalTime -= hours * 60 * 60;
    let minutes = Math.floor(decimalTime / 60);
    decimalTime -= minutes * 60;
    if (hours < 10) {
      hours = `0${hours} `;
    }
    if (minutes < 10) {
      minutes = `0${minutes} `;
    }
    const result = `${hours}:${minutes} `;

    res = result.toString();
  }
  return res;
}

export function getGroupWithCountForObj(arr, field) {
  let result = [];
  if (arr) {
    result = [
      ...arr
        .reduce((mp, o) => {
          if (!mp.has(o[field] && o[field].id ? o[field].id : '')) mp.set(o[field].id, { ...o, count: 0 });
          mp.get(o[field].id).count++;
          return mp;
        }, new Map())
        .values(),
    ];
  }
  return result;
}

export function arraySortByString(arr, field) {
  let result = [];
  if (arr) {
    result = arr.sort((a, b) => {
      const textA = a[field] ? a[field].toUpperCase() : '';
      const textB = b[field] ? b[field].toUpperCase() : '';
      // eslint-disable-next-line no-nested-ternary
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }
  return result;
}

export function getDateDifferece(date2) {
  const date1 = new Date();
  const differenceInTime = date2.getTime() - date1.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays;
}

export function isAssociativeArray(arr) {
  let result = arr;
  if (isArrayColumnExists(arr, 'id')) {
    result = getColumnArrayById(arr, 'id');
  }
  return result;
}

export function getDateDiffereceBetweenTwoDays(date1, date2, isDate2) {
  const defaultTz = 'Asia/Kolkata';
  const date3 = new Date(moment.utc(date1).local().tz(defaultTz).format('YYYY-MM-DD HH:mm:ss'));
  let date4 = new Date();
  if (!isDate2) {
    date4 = date2 ? new Date(moment.utc(date2).local().tz(defaultTz).format('YYYY-MM-DD HH:mm:ss')) : new Date();
  } else {
    date4 = date2 ? new Date(moment(date2).local().tz(defaultTz).format('YYYY-MM-DD HH:mm:ss')) : new Date();
  }
  let diff = (date4.getTime() - date3.getTime()) / 1000;
  diff /= (60 * 60);
  return diff && typeof diff === 'number' ? Math.abs(diff).toFixed(2) : 0.00;
}

export function calculateTimeDifference(date1, date2, isDate2) {
  const defaultTz = 'Asia/Kolkata';
  const startDateTime = new Date(moment.utc(date1).local().tz(defaultTz).format('YYYY-MM-DD HH:mm:ss'));
  let endDateTime = new Date();
  if (!isDate2) {
    endDateTime = date2 ? new Date(moment.utc(date2).local().tz(defaultTz).format('YYYY-MM-DD HH:mm:ss')) : new Date();
  } else {
    endDateTime = date2 ? new Date(moment(date2).local().tz(defaultTz).format('YYYY-MM-DD HH:mm:ss')) : new Date();
  }
  // Parse the input date-time strings into Date objects
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  // Calculate the difference in milliseconds
  const diffInMs = end - start;

  // Convert the difference to hours
  const diffInHours = diffInMs / (1000 * 60 * 60);

  // Round to two decimal places
  return diffInHours.toFixed(2);
}

export function getDateDiffereceBetweenTwoDaysLocal(date1, date2) {
  const defaultTz = 'Asia/Kolkata';
  const date3 = new Date(date1);
  const date4 = date2 ? new Date(date2) : new Date();

  let diff = (date4.getTime() - date3.getTime()) / 1000;
  diff /= (60 * 60);
  return diff && typeof diff === 'number' ? Math.abs(diff).toFixed(2) : 0.00;
}

export function getColumnArrayValueByField(array, col, field, subField) {
  // eslint-disable-next-line prefer-const
  let column = '';
  if (array && array.length > 0) {
    column = array[col][field][subField];
  }
  return column; // return column data..
}

export function getDifferenceBetweenInDays(date1, date2) {
  // round to the nearest whole number
  if (
    date1 !== ''
    && date1 != null
    && date1 !== false
    && date2 !== ''
    && date2 != null
    && date2 !== false
  ) {
    const date3 = new Date(date1);
    const date4 = new Date(date2);
    const diffTime = Math.abs(date4.getTime() - date3.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return '';
}

export function getGroupWithCountForString(arr, field) {
  let result = [];
  if (arr) {
    result = [
      ...arr
        .reduce((mp, o) => {
          if (!mp.has(o[field] ? o[field] : '')) mp.set(o[field], { ...o, count: 0 });
          mp.get(o[field]).count++;
          return mp;
        }, new Map())
        .values(),
    ];
  }
  return result;
}

export function getGroupWithCountFilter(arr, filterField, field) {
  let result = [];
  if (arr) {
    const arr1 = arr.filter((item) => item.create_date === filterField);
    result = [
      ...arr1
        .reduce((mp, o) => {
          if (!mp.has(o[field] ? o[field] : '')) mp.set(o[field], { ...o, count: 0 });
          mp.get(o[field]).count++;
          return mp;
        }, new Map())
        .values(),
    ];
  }
  return result;
}

export function getGroupWithMulti(arr, field1, field2) {
  let result = [];
  if (arr) {
    result = [
      ...arr
        .reduce((r, o) => {
          const key = `${o[field1]} -${o[field2]} `;

          const item = r.get(key) || {
            ...o,
            used: 0,
            instances: 0,
          };

          item.used += o.used;
          item.instances += o.instances;

          return r.set(key, item);
        }, new Map())
        .values(),
    ];
  }
  return result;
}

export function getMultiArrayData(array, array1) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].date) {
      const data = getGroupWithCountForString(
        array1.filter((item) => item.date === array[i].date),
        'state',
      );
      for (let j = 0; j < data.length; j += 1) {
        column.push(data[j]);
      }
    }
  }
  return column; // return column data..
}

export function getNextPreview(ids, type, arrayData) {
  const array = arrayData && arrayData.data ? arrayData.data : [];
  let listId = 0;
  if (array && array.length > 0) {
    const index = array.findIndex((element) => element.id === ids);

    if (index > -1) {
      if (type === 'Next' && array[index + 1]) {
        listId = array[index + 1].id;
      } else if (type === 'Prev' && array[index - 1]) {
        listId = array[index - 1].id;
      }
    }
  }
  return listId;
}

export function getFirstWeekFirstDate(year, month) {
  // Calculate the first day of the current month
  const firstDayOfMonth = new Date(year, month + 1, 1);

  // Calculate the day of the week for the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Calculate the first week's first date by subtracting the day of the week from the first day of the month
  const firstWeekFirstDate = 1 - firstDayOfWeek;

  // Return the full date of the first week's first date
  return new Date(year, month + 1, firstWeekFirstDate);
}

export function getFirstWeekFirstDateOfNextMonth(today) {
  // Calculate the next month, considering the year change if the current month is December
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Calculate the day of the week for the first day of the next month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = nextMonth.getDay();

  // If the first day is not Monday (1), find the next Monday
  const daysUntilNextMonday = (firstDayOfWeek === 0) ? 1 : (firstDayOfWeek === 1 ? 0 : 8 - firstDayOfWeek);
  const firstWeekFirstDate = nextMonth.getDate() + daysUntilNextMonday;

  // Return the full date of the first week's first date of the next month
  return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), firstWeekFirstDate);
}

export function addOneWeek(gDate) {
  let res = new Date();
  if (gDate) {
    const res1 = new Date(gDate);
    const year = res1.getFullYear();
    const month = res1.getMonth();
    res = getFirstWeekFirstDateOfNextMonth(res1);
  }
  return res;
}

export function getLastWeekLastDateOfPreviousMonth(today) {
  // Create a new date object based on the current date
  const currentDate = new Date(today);

  // Set the date to the first day of the current month to navigate to the previous month
  currentDate.setDate(1);
  currentDate.setMonth(currentDate.getMonth() - 1);

  // Get the last day of the previous month
  const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Calculate the day of the week for the last day of the previous month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const lastDayOfWeek = lastDayOfPreviousMonth.getDay();

  // Find the last Sunday
  let lastWeekLastDate;
  if (lastDayOfWeek === 0) {
    // If the last day is Sunday, it's already the last Sunday
    lastWeekLastDate = lastDayOfPreviousMonth.getDate();
  } else {
    // Otherwise, find the last Sunday
    lastWeekLastDate = lastDayOfPreviousMonth.getDate() - lastDayOfWeek + 1;

    // If lastWeekLastDate exceeds the number of days in the previous month, adjust to the last day of the previous month
    if (lastWeekLastDate > lastDayOfPreviousMonth.getDate()) {
      lastWeekLastDate = lastDayOfPreviousMonth.getDate();
    }
  }

  // Return the full date of the last week's last date of the previous month
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), lastWeekLastDate);
}

export function substractOneWeek(gDate) {
  let res = new Date();
  if (gDate) {
    const res1 = new Date(gDate);
    const year = res1.getFullYear();
    const month = res1.getMonth();
    res = getLastWeekLastDateOfPreviousMonth(res1);
    // res.setDate(res.getDate() - 7);
  }
  return res;
}

export function ctofconvertion(d) {
  let res = 0;
  if (d) {
    res = d * 1.8 + 32;
    // res = parseFloat(val).toFixed(2);
  }
  return res;
}

export function convertToUppercase(str) {
  let res = '';
  if (str) {
    res = str.toString().toUpperCase();
  }
  return res;
}

// program to get the file extension

export function getFileExtension(filename) {
  let extension = '';
  if (filename) {
    // get file extension
    extension = filename.toString().split('.').pop();
    extension = extension.toLowerCase();
  }
  return extension;
}

export function convertNumToTime(number, type) {
  // Check sign of given number
  let sign = number >= 0 ? 1 : -1;

  // Set positive value of number of sign negative
  number *= sign;

  // Separate the int from the decimal part
  let hour = Math.floor(number);
  let decpart = number - hour;

  const min = 1 / 60;
  // Round to nearest minute
  decpart = min * Math.round(decpart / min);

  let minute = `${Math.floor(decpart * 60)} `;

  // Add padding if need
  if (minute < 9) {
    minute = `0${minute} `;
  }

  if (hour < 9) {
    hour = `0${hour}`;
  }

  // Add Sign in final result
  sign = sign === 1 ? '' : '-';

  // Concate hours and minutes
  let time = `${sign + hour}:${minute} `;

  if (type === 'minutes') {
    time = parseInt(minute);
  }

  return time;
}

export function getHoursAndMinutes(time) {
  let hours = false;
  if (time) {
    const strData = time.toString();
    const isTime = strData.includes('.');
    if (isTime) {
      const timeArr = strData.split('.');
      if (timeArr && timeArr.length) {
        hours = {
          hour: parseInt(timeArr[0]),
          minutes: convertNumToTime(time, 'minutes'),
        };
      } else {
        hours = { hour: parseInt(time), minutes: 0 };
      }
    } else {
      hours = { hour: parseInt(time), minutes: 0 };
    }
  }
  return hours;
}

export function getHoursAndMinutes1(time) {
  let hours = false;
  if (time) {
    const strData = time.toString();
    const isTime = strData.includes('.');
    if (isTime) {
      const timeArr = strData.split('.');
      if (timeArr && timeArr.length) {
        hours = {
          hour: parseInt(timeArr[0]),
          minutes: parseInt(timeArr[1]) && parseInt(timeArr[1]).length > 1 ? parseInt(timeArr[1]) : `${parseInt(timeArr[1])}0`,
        };
      } else {
        hours = { hour: parseInt(time), minutes: '00' };
      }
    } else {
      hours = { hour: parseInt(time), minutes: '00' };
    }
  }
  return hours;
}

export function storeHoursAndMinutes(time) {
  let hours = 0.00;
  if (time) {
    const strData = time.toString();
    const isTime = strData.includes(':');
    if (isTime) {
      const timeArr = strData.split(':');
      if (timeArr && timeArr.length) {
        hours = parseFloat(`${timeArr[0]}.${timeArr[1]}`);
      } else {
        hours = parseFloat(parseInt(time));
      }
    } else {
      hours = parseFloat(parseInt(time));
    }
  }
  return hours;
}

export function getArrayOfStrings(array, col) {
  // eslint-disable-next-line prefer-const
  let column = '';
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      if (i !== array.length - 1) {
        column += `${array[i][col]}, `;
      } else {
        column += `${array[i][col]} `;
      }
    } else if (!col) {
      if (i !== array.length - 1) {
        column += `${array[i][col]}, `;
      } else {
        column += `${array[i][col]} `;
      }
    }
  }
  return column; // return column data..
}

export function intToString(value) {
  let res = value;
  if (value && value > 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't'];
    const suffixNum = Math.floor(`${value} `.length / 3);
    let shortValue = parseFloat(
      (suffixNum !== 0 ? value / 1000 ** suffixNum : value).toPrecision(2),
    );
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    res = shortValue + suffixes[suffixNum];
  }
  return res;
}

export function getAQIValue(pm10, pm25) {
  let res = 0;
  try {
    let pm25SubValue = 0;
    let pm10SubValue = 0;
    if (pm10) {
      if (pm10 <= 50) {
        pm10SubValue = pm10;
      } else if (pm10 > 50 && pm10 <= 100) {
        pm10SubValue = pm10;
      } else if (pm10 > 100 && pm10 <= 250) {
        pm10SubValue = 100 + (pm10 - 100) * (100 / 150);
      } else if (pm10 > 250 && pm10 <= 350) {
        pm10SubValue = 200 + (pm10 - 250);
      } else if (pm10 > 350 && pm10 <= 430) {
        pm10SubValue = 300 + (pm10 - 350) * (100 / 80);
      } else if (pm10 > 430) {
        pm10SubValue = 400 + (pm10 - 430) * (100 / 80);
      }
    }
    if (pm25) {
      if (pm25 <= 30) {
        pm25SubValue = (pm25 * 50) / 30;
      } else if (pm25 > 30 && pm25 <= 60) {
        pm25SubValue = 50 + (pm25 - 30) * (50 / 30);
      } else if (pm25 > 60 && pm25 <= 90) {
        pm25SubValue = 100 + (pm25 - 60) * (100 / 30);
      } else if (pm25 > 90 && pm25 <= 120) {
        pm25SubValue = 200 + (pm25 - 90) * (100 / 30);
      } else if (pm25 > 120 && pm25 <= 250) {
        pm25SubValue = 300 + (pm25 - 120) * (100 / 130);
      } else if (pm25 > 250) {
        pm25SubValue = 400 + (pm25 - 250) * (100 / 130);
      }
    }
    if (pm25SubValue > pm10SubValue) {
      res = parseInt(pm25SubValue);
    } else if (pm10SubValue > pm25SubValue) {
      res = parseInt(pm10SubValue);
    } else {
      res = parseInt(pm10SubValue);
    }
  } catch (e) {
    console.log(e);
  }
  return res;
}

export function savePdfContentBlob(title, header, body, fileName, companyName, filters, filterValue, clogo) {
  const ipcLogo = window.localStorage.getItem('company_logo') && window.localStorage.getItem('company_logo') !== 'false' && window.localStorage.getItem('company_logo') !== ''
    ? `data:image/jpeg;base64,${window.localStorage.getItem('company_logo')}` : false;

  const logo = window.localStorage.getItem('vendor_logo') && window.localStorage.getItem('vendor_logo') !== 'false' && window.localStorage.getItem('vendor_logo') !== ''
    ? window.localStorage.getItem('vendor_logo') : false;

  const pdf = new jsPDF('l', 'pt', [900, 800]);
  const totalPagesExp = '{total_pages_count_string}';

  let headingsData = [
    { name: companyName },
  ];

  if (filters && filters !== '') {
    headingsData = [
      { name: companyName },
      { name: `Filters - ${filters}` },
    ];
  }

  if (filterValue === 'location') {
    headingsData = [
      { name: companyName },
      { name: `Location - ${filters}` },
    ];
  }

  // Report Name
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null, fontStyle: 'bold',
      },
    },
    styles: {
      fontSize: 10,
      overflow: 'linebreak',
    },
    body: [
      { name: `${title} Report` },
    ],
  });

  // Company Name & Filter Values
  pdf.autoTable({
    columnStyles: {
      0: {
        halign: 'center', fillColor: null,
      },
      1: {
        halign: 'center', fillColor: null,
      },
      2: {
        halign: 'center', fillColor: null,
      },
    },
    styles: {
      fontSize: 7,
      overflow: 'linebreak',
      cellPadding: 2,
    },
    startY: pdf.lastAutoTable.finalY + 1,
    body: headingsData,
  });

  pdf.autoTable({
    body,
    didDrawPage(data) {
      // Header
      if (logo) {
        pdf.addImage(logo, 'JPEG', 425, 5, 50, 30);
      } else if (ipcLogo) {
        pdf.addImage(ipcLogo, 'JPEG', 425, 5, 50, 30);
      }

      // Footer
      let str = `Page ${pdf.internal.getNumberOfPages()}`;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof pdf.putTotalPages === 'function') {
        str = `${str} of ${totalPagesExp}`;
      }
      pdf.setFontSize(10);

      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      const pageSize = pdf.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      pdf.text(str, data.settings.margin.left, pageHeight - 10);
    },
    columns: header,
    styles: {
      fontSize: 5,
      overflow: 'linebreak',
      cellWidth: 'nowrap',
    },
    columnStyles: {
      cellWidth: 'nowrap',
    },
    startY: pdf.lastAutoTable.finalY + 2,
  });
  if (typeof pdf.putTotalPages === 'function') {
    pdf.putTotalPages(totalPagesExp);
  }
  return pdf.output('bloburi');
}

export function getDatesOfText(type) {
  let daterange = [];
  try {
    if (type === 'ls_month') {
      const lastMonthFirstdate = moment()
        .utc()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastMonthLastdate = moment()
        .utc()
        .subtract(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(lastMonthFirstdate);
      daterange.push(lastMonthLastdate);
    } else if (type === 'ls_week') {
      const lastWeekFirstdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .startOf('week')
        .format('YYYY-MM-DD');
      const lastWeekLastdate = moment()
        .utc()
        .subtract(1, 'weeks')
        .endOf('week')
        .format('YYYY-MM-DD');
      daterange.push(lastWeekFirstdate);
      daterange.push(lastWeekLastdate);
    } else if (type === 'ls_day') {
      const firstDay = moment();
      const getYesterdayFirstDay = moment(firstDay)
        .utc()
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
      const getYesterdayLastDay = moment(firstDay)
        .utc()
        .subtract(2, 'days')
        .format('YYYY-MM-DD');
      daterange.push(getYesterdayLastDay);
      daterange.push(getYesterdayFirstDay);
    } else if (type === 'l_month') {
      const firstDate = moment()
        .utc()
        .subtract(30, 'days')
        .format('YYYY-MM-DD');
      const lastdate = moment().utc().format('YYYY-MM-DD');
      daterange.push(firstDate);
      daterange.push(lastdate);
    } else if (type === 'l_week') {
      const firstDate = moment().utc().subtract(7, 'days').format('YYYY-MM-DD');
      const lastdate = moment().utc().format('YYYY-MM-DD');
      daterange.push(firstDate);
      daterange.push(lastdate);
    } else if (type === 'l_quarter') {
      /* const lastThreeMonthFirstdate = moment().utc().subtract(3, 'months').startOf('month')
        .format('YYYY-MM-DD');
      const lastThreeMonthLastdate = moment().utc().subtract(1, 'months').endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(lastThreeMonthFirstdate);
      daterange.push(lastThreeMonthLastdate); */

      const firstDate = moment()
        .utc()
        .subtract(90, 'days')
        .format('YYYY-MM-DD');
      const lastdate = moment().utc().format('YYYY-MM-DD');
      daterange.push(firstDate);
      daterange.push(lastdate);
    } else if (type === 'ls_quarter') {
      const lastQuarterMonthFirstdate = moment()
        .utc()
        .subtract(6, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const lastQuarterMonthEnddate = moment()
        .utc()
        .subtract(4, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
      daterange.push(lastQuarterMonthFirstdate);
      daterange.push(lastQuarterMonthEnddate);
    } else if (type === 't_week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('week');
      const weekEnd = currentDate.clone().endOf('week');
      daterange.push(moment(weekStart).utc().format('YYYY-MM-DD'));
      daterange.push(moment(weekEnd).utc().format('YYYY-MM-DD'));
    } else if (type === 't_month') {
      const date = new Date();
      const firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        1,
      );
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),

        daysInMonth(date.getMonth() + 1, date.getFullYear()),
      );
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).add(1, 'day').utc().format('YYYY-MM-DD'));
    } else if (type === 'l_day') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = new Date();
      daterange.push(`${moment(firstDay).utc().format('YYYY-MM-DD')} `);
      daterange.push(`${moment(lastDay).utc().format('YYYY-MM-DD')} `);
    } else if (type === 't_year') {
      const firstDay = `${new Date().getFullYear() - 1} -12 - 31`;
      const lastDay = `${new Date().getFullYear()} -12 - 31`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    } else if (type === 'ls_year') {
      const firstDay = `${new Date().getFullYear() - 2} -12 - 31`;
      const lastDay = `${new Date().getFullYear() - 1} -12 - 31`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getColumnArrayString(array, col) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (col) {
      column.push(`"${array[i][col]}"`);
    }
  }
  return column; // return column data..
}

export const getMaxLenghtForFields = () => {
  const maxLengthObj = {
    username: 50,
    password: 50,
    accountId: 10,
  };
  return maxLengthObj;
};

export const roundNumber = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const reorderingRuleApiErrorMsg = 'duplicate key value violates unique constraint "stock_warehouse_orderpoint_uniq_warehouse_location_product_id"\nDETAIL';

export const reorderingRuleStaticErrorMsg = 'Reordering Rule is already exists with the same Product and Location.';

export const StringsMeta = {
  PARTICIPANTS_NOT_SELECTED_MESSAGE:
    'You don’t have any participants, do you still want to go-ahead with group booking ?',
  EMPLOYEE_OR_GUEST: 'Select Employee/Guest',
  SELECT_GUEST: 'Select Guest',
  SELECT_EMPLOYEE: 'Select Employee',
  SELECT_HOST: 'Select Host',
  MAP_OVERVIEW: 'map-overview',
  SIZE_450PX: '450px',
  SIZE_1100PX: '1100px',
  CAPLIMIT_ERROR_MESSAGE:
    'Sorry you cannot exceed limits in place, please remove the participants listed above or book based on their limits.',
  PRE_SCREEN: 'PRE-SCREEN',
  PRESCREENED: 'Prescreened',
  ACCESS: 'ACCESS',
  ACCESSED: 'Accessed',
  OCCUPY: 'OCCUPY',
  OCCUPIED: 'Occupied',
  RELEASE: 'RELEASE',
  RELEASED: 'RELEASED',
  CANCEL: 'Cancel',
  MAINTAINANCE_IN_PROGRESS: 'Maintenance in Progress',
  BOOKED: 'Booked',
};

export const bookingTypeVariables = [
  {
    name: 'Employee',
    value: '"Employee"',
  },
  {
    name: 'Guest',
    value: '"Guest"',
  },
];

export function compareAsec(firstSpace, secondSpace) {
  if (firstSpace.space_name < secondSpace.space_name) {
    return -1;
  }
  if (firstSpace.space_name > secondSpace.space_name) {
    return 1;
  }
  return 0;
}

export function compareDesc(firstSpace, secondSpace) {
  if (firstSpace.space_name > secondSpace.space_name) {
    return -1;
  }
  if (firstSpace.space_name < secondSpace.space_name) {
    return 1;
  }
  return 0;
}

export function noNumbersAllowed(e) {
  if (e.which >= 48 && e.which <= 57) {
    return e.preventDefault();
  }
  return false;
}

export function generateErrorMessage(errData) {
  if (errData && errData.err) {
    if (
      errData.err.data
      && errData.err.data.error
      && Object.keys(errData.err.data.error)
      && Object.keys(errData.err.data.error).length > 0
    ) {
      return errData.err.data.error.message.includes('\nNone') ? errData.err.data.error.message.replace('\nNone', '') : errData.err.data.error.message;
    }
    if (
      errData.err.data
      && errData.err.data
      && errData.err.data.error
      && Object.keys(errData.err.data.error)
      && Object.keys(errData.err.data.error).length === 0
      && errData.err.data.status_code === 404
    ) {
      return 'No records found';
    }
    if (errData.err.statusText) {
      return errData.err.statusText;
    }
    return 'Something went Wrong..';
  }
  return '';
}

export function generateErrorMessageDetail(errData) {
  console.log(errData);
  if (errData && errData.err) {
    if (
      errData.err.data
        && errData.err.data.error
        && Object.keys(errData.err.data.error)
        && Object.keys(errData.err.data.error).length > 0
    ) {
      return errData.err.data.error.message.includes('\nNone') ? errData.err.data.error.message.replace('\nNone', '') : errData.err.data.error.message;
    }
    if (
      errData.err.data
        && errData.err.data
        && errData.err.data.message
        && Object.keys(errData.err.data.message)
        && Object.keys(errData.err.data.message).length > 0
    ) {
      return errData.err.data.message.includes('\nNone') ? errData.err.data.message.replace('\nNone', '') : errData.err.data.message;
    }
    if (
      errData.err.data
        && errData.err.data
        && errData.err.data.error
        && Object.keys(errData.err.data.error)
        && Object.keys(errData.err.data.error).length === 0
        && errData.err.data.status_code === 404
    ) {
      return 'No records found';
    }
    if (errData.err.statusText) {
      return errData.err.statusText;
    }
    return 'Something went Wrong..';
  } if (errData && errData.data) {
    if (
      errData.data.message
        && Object.keys(errData.data.message)
        && Object.keys(errData.data.message).length > 0
    ) {
      return errData.data.message.includes('None') ? errData.data.message.replaceAll('None', '') : errData.data.message;
    }
    return 'Something went Wrong..';
  }
  return '';
}

export function getErrorMessage(errData) {
  if (errData && errData.err && errData.err.error) {
    if (errData.err.error.message) {
      return errData.err.error.message;
    }
    return errData.err.error;
  }
  return '';
}

export function getColumnArrayByIdAndKey(array, col, value, KeyCheck, state) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (KeyCheck && array[i][value] === state) {
      column.push(array[i][KeyCheck][col]);
    } else if (array[i][value] === state) column.push(array[i][col]);
  }
  return column; // return column data..
}

// export function getDatesOfQuery(type) {
//   let daterange = [];
//   try {
//     if (type === 'Last week' || type === 'Last month' || type === 'Last 3 months') {
//       const lastDay = new Date();
//       let firstDay = new Date();

//       let days = 7;
//       if (type === 'Last month') {
//         days = 30;
//       } else if (type === 'Last 3 months') {
//         days = 90;
//       }
//       firstDay = firstDay.setTime(firstDay.getTime() - 3600 * 1000 * 24 * days);
//       daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
//       daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
//     } else if (type === 'This week') {
//       const curr = new Date(); // get current date
//       // First day is the day of the month - the day of the week
//       const first = curr.getDate() - curr.getDay();
//       const last = first + 6; // last day is the first day + 6

//       const firstDay = new Date(curr.setDate(first));
//       const lastDay = new Date(curr.setDate(last));

//       daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
//       daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
//     } else if (type === 'This month') {
//       const date = new Date();
//       const firstDay = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         1,
//       );
//       const lastDay = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         daysInMonth(
//           date.getMonth() + 1,
//           date.getFullYear(),
//         ),
//       );
//       daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
//       daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
//     } else if (type === 'Today') {
//       let firstDay = new Date();
//       firstDay = firstDay.setDate(firstDay.getDate() - 1);
//       const lastDay = new Date();
//       daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
//       daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
//     } else if (type === 'Tomorrow') {
//       const firstDay = new Date();
//       const lastDay = firstDay.setDate(firstDay.getDate() + 1);
//       daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
//       daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
//     } else if (type === 'This year') {
//       const firstDay = `${ (new Date()).getFullYear() }-01-01`;
//       const lastDay = `${ (new Date()).getFullYear() } -12 - 31`;
//       daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
//       daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
//     }
//   } catch (e) {
//     daterange = [];
//   }
//   return daterange;
// }

// export function queryGenerator(array) {
//   let query = '';
//   for (let i = 0; i < array.length; i += 1) {
//     if (array[i].type === 'text') {
//       query += `["${array[i].key}", "ilike", "${array[i].value}"], `;
//     } else if (array[i].type === 'id') {
//       query += `["${array[i].key}", "=", ${ array[i].value }], `;
//     } else if (array[i].type === 'date') {
//       const type = array[i].value;
//       const dates = getDatesOfQuery(type);
//       const startDate = dates[0];
//       const endDate = dates[1];
//       query += `["create_date", ">=", "${startDate}"], ["create_date", "<=", "${endDate}"], `;
//     } else if (array[i].type === 'datearray') {
//       const dates = array[i].value;
//       const startDate = dates[0];
//       const endDate = dates[1];
//       query += `["create_date", ">=", "${startDate}"], ["create_date", "<=", "${endDate}"], `;
//     }
//   }
//   query = query.substring(0, query.length - 1);
//   return query;
// }

export function getDatesOfQueryByUtc(type, format, timezone) {
  let daterange = [];
  const timeZoneDate = moment().tz(timezone);
  try {
    if (
      type === 'Last week'
      || type === 'Last month'
      || type === 'Last 3 months'
    ) {
      const lastDay = new Date();
      let firstDay = new Date();

      let days = 7;
      if (type === 'Last month') {
        days = 30;
      } else if (type === 'Last 3 months') {
        days = 90;
      }
      firstDay = firstDay.setTime(firstDay.getTime() - 3600 * 1000 * 24 * days);
      daterange.push(moment(firstDay).utc().format(format));
      daterange.push(moment(lastDay).utc().format(format));
    } else if (type === 'This week') {
      daterange.push(moment(timeZoneDate).startOf('week').utc().format(format));
      daterange.push(moment(timeZoneDate).endOf('week').utc().format(format));
    } else if (type === 'This month') {
      daterange.push(
        moment(timeZoneDate).startOf('month').utc().format(format),
      );
      daterange.push(moment(timeZoneDate).endOf('month').utc().format(format));
    } else if (type === 'Today') {
      daterange.push(moment(timeZoneDate).startOf('date').utc().format(format));
      daterange.push(moment(timeZoneDate).endOf('date').utc().format(format));
    } else if (type === 'Tomorrow') {
      const tomorrow = timeZoneDate.add(1, 'days');
      daterange.push(moment(tomorrow).startOf('date').utc().format(format));
      daterange.push(moment(tomorrow).endOf('date').utc().format(format));
    } else if (type === 'This year') {
      daterange.push(moment(timeZoneDate).startOf('year').utc().format(format));
      daterange.push(moment(timeZoneDate).endOf('year').utc().format(format));
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function queryGeneratorByDateAndTimeByKey(array, key, timezone) {
  let query = '';
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].type === 'text') {
      query += `["${array[i].key}", "ilike", "${array[i].value}"], `;
    } else if (array[i].type === 'id') {
      query += `["${array[i].key}", "=", ${array[i].value}], `;
    } else if (array[i].type === 'date') {
      const type = array[i].value;
      const dates = getDatesOfQueryByUtc(type, 'YYYY-MM-DD HH:mm:ss', timezone);
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${key}", ">=", "${startDate}"], ["${key}", "<=", "${endDate}"], `;
    } else if (array[i].type === 'array') {
      array[i].key.map((url, index) => {
        query += `["${array[i].key[index]}", "ilike", "${array[i].value}"], `;
      });
    } else if (array[i].type === 'datearray') {
      const dates = array[i].value;
      const startDate = dates[0];
      const endDate = dates[1];
      query += `["${key}", ">=", "${startDate}"], ["${key}", "<=", "${endDate}"], `;
    }
  }
  query = query.substring(0, query.length - 1);
  return query;
}

// export function getTimeFromFloat(decimalTimeString) {
//   let decimalTime = parseFloat(decimalTimeString);
//   decimalTime = decimalTime * 60 * 60;
//   let hours = Math.floor((decimalTime / (60 * 60)));
//   decimalTime -= (hours * 60 * 60);
//   let minutes = Math.floor((decimalTime / 60));
//   decimalTime -= (minutes * 60);
//   let seconds = Math.round(decimalTime);
//   if (hours < 10) {
//     hours = `0${ hours } `;
//   }
//   if (minutes < 10) {
//     minutes = `0${ minutes } `;
//   }
//   if (seconds < 10) {
//     seconds = `0${ seconds } `;
//   }
//   const result = `${ hours }:${ minutes } hours`;

//   return result;
// }

export function getColumnArray(array, col, type) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (type && type === 'int') {
      column.push(array[i][col]);
    } else {
      column.push(`"${array[i][col]}"`);
    }
  }
  return column; // return column data..
}

export function getTimeDifference(plannedInTime, plannedOutTime) {
  const hrs = momentrange.utc(plannedOutTime.diff(plannedInTime)).format('HH');
  const min = momentrange.utc(plannedOutTime.diff(plannedInTime)).format('mm');
  const sec = momentrange.utc(plannedOutTime.diff(plannedInTime)).format('ss');
  const timeDiffInMins = Number(hrs * 60) + Number(min) + Number(sec / 60);
  return timeDiffInMins;
}

export function getMomentDiff(inTime, outTime, days) {
  return momentrange(inTime).diff(outTime, days);
}

export function getMomentFormat(data, format) {
  return momentrange(data).format(format);
}

export function getMomentAdd(data, count, duration, format) {
  return momentrange(data).add(count, duration).format(format);
}

export function getMomentSub(data, count, duration, format) {
  return momentrange(data).subtract(count, duration).format(format);
}

export function getHourMinSec(data) {
  return momentrange(data, 'HH:mm:ss');
}

export function getHoursMins(data) {
  return momentrange(data, ['HH:mm']).format('hh:mm A');
}

export function getMomentRange(todayCalendarDate1, todayCalendarDate2) {
  return momentrange.range(todayCalendarDate1, todayCalendarDate2);
}
export function getCalendarDate(getCompanyTimeZoneDate, noOfDays) {
  return momentrange(getCompanyTimeZoneDate).add(noOfDays, 'days').subtract(1, 'day')._d;
}

export function getCurrentCompanyTime(data, format) {
  return moment().tz(data).format(format);
}

export const maskEmail = (email = '') => {
  const [name, domain] = email.split('@');
  const { length: len } = name;
  const maskedName = `${name[0]}******* ${name[len - 1]} `;
  const maskedEmail = `${maskedName} @${domain} `;
  return maskedEmail;
};

export function exportTableToExcel(tableID, fileTitle = '') {
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

export const exportPdf = async (title, targetEle, actionEle, display, company, filters, selectedDateTag, customDate1, customDate2) => {
  const actionDiv = document.getElementById(actionEle);
  if (actionDiv) {
    actionDiv.style.display = 'none';
  }

  const targetDiv = document.getElementById(targetEle);
  const logo = window.localStorage.getItem('vendor_logo') && window.localStorage.getItem('vendor_logo') !== 'false' && window.localStorage.getItem('vendor_logo') !== ''
    ? window.localStorage.getItem('vendor_logo')
    : false;

  if (targetDiv) {
    const canvas = await html2canvas(targetDiv);
    const image = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'px', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    // Calculate the height for the header
    const headerHeight = 50; // Adjust as needed

    if (logo) {
      // Add logo to the header
      const logoImage = new Image();
      logoImage.src = logo;

      logoImage.onload = function () {
        // Wait until the image is fully loaded before proceeding
        // Calculate dimensions to fit within header
        const maxLogoWidth = headerHeight * 0.4; // Max width as 20% of page width
        const maxLogoHeight = headerHeight * 0.4; // Max height as 80% of header height

        let logoWidth = logoImage.width;
        let logoHeight = logoImage.height;

        // Adjust dimensions if necessary to fit within max dimensions
        if (logoWidth > maxLogoWidth) {
          logoHeight *= maxLogoWidth / logoWidth;
          logoWidth = maxLogoWidth;
        }
        if (logoHeight > maxLogoHeight) {
          logoWidth *= maxLogoHeight / logoHeight;
          logoHeight = maxLogoHeight;
        }
        // Define the quality (value between 0 and 1)
        const quality = 1;

        // Add the image to the PDF at coordinates (10, 10) with calculated dimensions and quality
        const logoX = (pageWidth - logoWidth) / 2;
        pdf.addImage(logo, 'JPEG', logoX, 10, logoWidth, logoHeight, undefined, 'NONE', 0, quality);

        // Add title to the header if no logo
        pdf.setFontSize(12);
        pdf.text(company, pageWidth / 2, logoHeight + 20, { align: 'center' });

        const dateFilters2 = `Date Filters: ${selectedDateTag && selectedDateTag === 'l_custom'
          ? `Custom Date (${customDate1} to ${customDate2})`
          : filters}`;

        // Add description below the title
        pdf.setFontSize(8);
        pdf.text(dateFilters2, pageWidth / 2, logoHeight + 30, { align: 'center' });

        // Add the main content below the header
        pdf.addImage(image, 'JPEG', 0, headerHeight, canvas.width * ratio, canvas.height * ratio);

        pdf.save(`${title}.pdf`);
      };
    } else {
      // Add title to the header if no logo
      pdf.setFontSize(12);
      pdf.text(company, pageWidth / 2, 15, { align: 'center' });

      const dateFilters2 = `Date Filters: ${selectedDateTag && selectedDateTag === 'l_custom'
        ? `Custom Date (${customDate1} to ${customDate2})`
        : filters}`;

      // Add description below the title
      pdf.setFontSize(8);
      pdf.text(dateFilters2, pageWidth / 2, 30, { align: 'center' });

      // Add the main content below the header
      pdf.addImage(image, 'JPEG', 0, headerHeight, canvas.width * ratio, canvas.height * ratio);

      pdf.save(`${title}.pdf`);
    }
  }

  if (actionDiv) {
    actionDiv.style.display = display || 'initial';
  }
};

export const numberWithCommas = (x) => (x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x);

export function translateText(targetText, userData) {
  let lang = 'en_US';
  let res = '';
  if (userData && userData.data && userData.data.locale) {
    lang = userData.data.locale;
  }

  if (langData && langData[lang] && langData[lang][targetText]) {
    res = langData[lang][targetText];
  } else {
    res = targetText;
  }

  return res;
}

export function getNewArrayFromValues(array, ids, col, field) {
  const column1 = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col];
      if (ids && ids.indexOf(value) !== -1) {
        const cl = array[i][field];
        column1.push(cl);
      }
    }
  }
  return column1; // return column data..
}

export function getColumnArrayByIdMulti(array, col, col1) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col][col1]) {
      column.push(array[i][col][col1]);
    }
  }
  return column; // return column data..
}

export function translateTextNo(targetText, userData) {
  const lang = 'en_US';
  let res = '';

  if (langData && langData[lang] && langData[lang][targetText]) {
    res = langData[lang][targetText];
  } else {
    res = targetText;
  }

  return res;
}

export function titleCase(str) {
  const splitStr = str && str.length && str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr && splitStr.length && splitStr.join(' ');
}

export function a11yProps(index) {
  return {
    id: `simple - tab - ${index} `,
    'aria-controls': `simple - tabpanel - ${index} `,
  };
}

export const TabPanel = (props) => {
  const {
    tabValue, children, value, index, sx, ...other
  } = props;
  return (
    <div
      role="tabpanel"
      hidden={value ? value !== index : false}
      id={`simple - tabpanel - ${index} `}
      aria-labelledby={`simple - tab - ${index} `}
      {...other}
    >
      {(value === index || tabValue) && (
        <Box
          sx={{
            ...sx,
            padding: '15px',
          }}
          className="tabpanel"
        >
          <Typography component="div" className="detailViewScrollbar">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const TabPanelNoScroll = (props) => {
  const {
    tabValue, children, value, index, sx, ...other
  } = props;
  return (
    <div
      role="tabpanel"
      hidden={value ? value !== index : false}
      id={`simple - tabpanel - ${index} `}
      aria-labelledby={`simple - tab - ${index} `}
      {...other}
    >
      {(value === index || tabValue) && (
        <Box
          sx={{
            ...sx,
            padding: '15px',
          }}
        >
          <Typography component="div" className="detailViewScrollbar">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const getHeaderTabs = (data, item = '') => data.filter((each) => each.name === item);

export const getActiveTab = (data, item = '') => data.findIndex((each) => each.name === item);

export const getTabs = (data, json) => {
  let tabs = data.map((each) => {
    const option = json?.[each.name];
    if (option) {
      return {
        ...each,
        link: option?.pathName,
        displayName: option?.displayname,
      };
    }
  });
  tabs = tabs.filter((each) => each && each.link);
  return tabs;
};

export const getDynamicTabs = (data, prefix) => {
  const data1 = data.filter((each) => !Object.keys(each.parent_menu).length);
  const tabs = data1.map((cl) => ({
    ...cl, link: `${prefix}/${cl.name}`,
  }));
  return tabs;
};

export const downloadQr = (id, filename) => {
  const s = new XMLSerializer().serializeToString(document.getElementById(id));
  const encodedData = window.btoa(s);
  const element = document.createElement('a');
  element.setAttribute('href', `data:image/svg+xml;base64,${encodedData}`);
  element.setAttribute('download', filename);
  element.setAttribute('id', 'file');

  element.style.display = 'none';
  element.style.backgroundColor = 'red';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
};

function maskData(s, n, char) {
  return Array.from(s, (ch, i) => (Math.floor(i / n) % 2 ? char : ch)).join('');
}

export const getMaskedEmail = (string, char) => {
  let maskedString = '';
  if (string === false || string === undefined) {
    maskedString = '-';
  } else {
    string = string.toString();
    const data = string && string.length && string.split('@');
    if (data && data.length) {
      const data2 = data.length > 1 && data[1].split('.');
      if (data && data.length > 0) {
        maskedString = `${maskedString}${maskData(data[0], 1, char)}`;
      }
      maskedString = `${maskedString}@`;
      if (data2 && data2.length > 0) {
        maskedString = `${maskedString}${maskData(data2[0], 1, char)}`;
      }
      maskedString = `${maskedString}.`;
      if (data2 && data2.length > 1) {
        maskedString = `${maskedString}${maskData(data2[1], 1, char)}`;
      }
    }
  }
  return maskedString;
};
export const getMaskedPhoneNo = (string) => {
  let maskedPhoneNumber = '';
  if (string === false || string === undefined) {
    maskedPhoneNumber = '-';
    return maskedPhoneNumber;
  } else {
    string = string.toString();
    const splitData = string.match(/.{1,6}/g);
    let maskedPhoneNumber = '';
    if (splitData && splitData.length) {
      maskedPhoneNumber = 'XXXXXX';
      splitData.map((data, index) => {
        if (index !== 0) { maskedPhoneNumber = `${maskedPhoneNumber}${data}`; }
      });
    }
    return maskedPhoneNumber;
  }
};

const isSameObject = (a, b) => a.id === b.id;

export const differenceArray = (array1, array2) => array1.filter((array1Value) => !array2.some((array2Value) => isSameObject(array1Value, array2Value)));

export const getDiiffNoOfDays = (date1, date2) => {
  let res = 0;
  if (date1 && date2) {
    const date3 = new Date(date1);
    const date4 = new Date(date2);

    // To calculate the time difference of two dates
    const Difference_In_Time = date4.getTime() - date3.getTime();

    // To calculate the no. of days between two dates
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    res = Difference_In_Days || 0;
  }
  return res;
};

export function getArrayFromValuesMultByIdIn(array, ids, col, field) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col][field];
      if (ids && (ids.indexOf(value) !== -1)) {
        column.push(array[i]);
      }
    }
  }
  return column; // return column data..
}

export function parse(str) {
  try {
    const func = new Function('str', `'use strict'; return (${str})`);
    return func(str);
  } catch (e) {
    return false;
  }
}

export function getFloatTotalFromArray(array, key, exp) {
  let newStr = exp;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].mro_activity_id.code) {
      newStr = newStr.replaceAll(`qn.${[array[i].mro_activity_id.code]}`, array[i][key] && !isNaN(array[i][key]) && array[i].mro_activity_id.code && exp.includes(array[i].mro_activity_id.code) && !array[i].is_not_applicable ? parseFloat(array[i][key]) : 0);
    }
  }
  const formula = parse(newStr);
  return !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : 0; // return column data..
}

export function getFloatTotalFromArrayConsumption(array, key, exp) {
  let newStr = exp;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].mro_activity_id.code) {
      newStr = newStr.replaceAll(`qn.${[array[i].mro_activity_id.code]}`, array[i][key] && !isNaN(array[i][key]) && array[i].mro_activity_id.code && exp.includes(array[i].mro_activity_id.code) && !array[i].is_not_applicable ? parseFloat(array[i][key]) : 0);
    }
  }
  const formula = parse(newStr);
  return !isNaN(formula) && isFinite(formula) ? parseFloat(formula) : 0; // return column data..
}

export function getFormulaResult(array, key, exp) {
  let newStr = exp;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].mro_activity_id.code) {
      newStr = newStr.replaceAll(`qn.${[array[i].mro_activity_id.code]}`, array[i][key] && array[i].mro_activity_id.code && exp.includes(array[i].mro_activity_id.code) && !array[i].is_not_applicable ? (array[i].mro_activity_id.type === 'textbox' || array[i].mro_activity_id.type === 'simple_choice') ? `'${array[i][key]}'` : parseFloat(!isNaN(array[i][key]) ? array[i][key] : 0) : 0);
    }
  }
  const formula = parse(newStr);
  return !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : ''; // return column data..
}

export function getFormulaResultV2(array, key, exp) {
  let newStr = exp;
  console.log(exp);
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].mro_activity_id.code) {
      const newStr1 = newStr.replaceAll(`qn.${[array[i].mro_activity_id.code]}.target`, array[i].target && array[i].mro_activity_id.code && exp.includes(array[i].mro_activity_id.code) && !array[i].is_not_applicable ? (array[i].mro_activity_id.type === 'textbox' || array[i].mro_activity_id.type === 'simple_choice') ? `'${array[i].target}'` : parseFloat(!isNaN(array[i].target) ? array[i].target : 0) : 0);
      const newStr2 = newStr1.replaceAll(`qn.${[array[i].mro_activity_id.code]}.measured`, array[i][key] && array[i].mro_activity_id.code && exp.includes(array[i].mro_activity_id.code) && !array[i].is_not_applicable ? (array[i].mro_activity_id.type === 'textbox' || array[i].mro_activity_id.type === 'simple_choice') ? `'${array[i][key]}'` : parseFloat(!isNaN(array[i][key]) ? array[i][key] : 0) : 0);
      newStr = newStr2.replaceAll(`qn.${[array[i].mro_activity_id.code]}`, array[i][key] && array[i].mro_activity_id.code && exp.includes(array[i].mro_activity_id.code) && !array[i].is_not_applicable ? (array[i].mro_activity_id.type === 'textbox' || array[i].mro_activity_id.type === 'simple_choice') ? `'${array[i][key]}'` : parseFloat(!isNaN(array[i][key]) ? array[i][key] : 0) : 0);
    }
  }
  console.log(newStr);
  const formula = parse(newStr);
  console.log(formula);
  return !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : ''; // return column data..
}

export function checkIsCompany(key) {
  let res = '';
  if (key) {
    if (key === 'company_id') {
      res = 'company_id.name';
    } else {
      res = key;
    }
  }
  return res;
}

export function numToValidFloatView(num) {
  let result = '-';
  if (!isNaN(num)) {
    result = parseFloat(num === '' ? 0 : num).toFixed(2);
  }
  return result;
}

export function numToValidFloat(num) {
  let result = '';
  if (typeof num === 'number') {
    result = parseFloat(num).toFixed(2);
  }
  return result;
}

export function compareArraystoGetUnique(a, b) {
  const res = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i].id === b[j].id) {
      }
      if (!a[i].is_not_applicable && a[i].id === b[j].id && a[i].answer !== b[j].answer) {
        res.push(b[i]);
      }
    }
  }
  return res;
}

export function getComputedValidAnswer(num) {
  let result = 0.00;
  if (num && num !== 'Infinity') {
    result = parseFloat(num);
  }
  return result;
}

export function SplitTime(numberOfHours) {
  const Days = Math.floor(numberOfHours / 24);
  const Remainder = numberOfHours % 24;
  const Hours = Math.floor(Remainder);
  const Minutes = Math.floor(60 * (Remainder - Hours));
  return ({ Days, Hours, Minutes });
}

export function getTimeFromNumber(targetDate, severityRt, priorityRt) {
  let decimalTime = '';
  let tDate = new Date();
  const days = 0;
  let hours = 0;
  let minutes = 0;
  if (severityRt) {
    decimalTime = parseFloat(severityRt);
    decimalTime = decimalTime * 60 * 60;
    hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime -= (hours * 60 * 60);
    minutes = Math.floor((decimalTime / 60));
    decimalTime -= (minutes * 60);
  } else if (priorityRt) {
    decimalTime = parseFloat(priorityRt);
    decimalTime = decimalTime * 60 * 60;
    hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime -= (hours * 60 * 60);
    minutes = Math.floor((decimalTime / 60));
    decimalTime -= (minutes * 60);
  }

  if (targetDate) {
    tDate = new Date(targetDate);
  }

  if (days > 0) {
    // tDate = tDate.setDate(tDate.getDate() + days);
  }

  if (hours > 0 && hours < 24) {
    tDate = new Date(tDate);
    tDate = tDate.setHours(tDate.getHours() + hours);
  }

  if (hours > 0 && hours < 24 && minutes > 0) {
    tDate = new Date(tDate);
    tDate = tDate.setMinutes(tDate.getMinutes() + minutes);
  }

  if (hours === 0 && minutes > 0) {
    tDate = new Date(tDate);
    tDate = tDate.setMinutes(tDate.getMinutes() + minutes);
  }

  if (hours > 24) {
    const sTime = SplitTime(hours);
    tDate = new Date(tDate);
    tDate = tDate.setDate(tDate.getDate() + sTime.Days);
    tDate = new Date(tDate);
    tDate = tDate.setHours(tDate.getHours() + sTime.Hours);
    tDate = new Date(tDate);
    tDate = tDate.setMinutes(tDate.getMinutes() + sTime.Minutes);
  }

  return tDate;
}

export function detectMimeType(b64) {
  let res = 'image/png';
  const signatures = {
    JVBERi0: 'application/pdf',
    R0lGODdh: 'image/gif',
    R0lGODlh: 'image/gif',
    iVBORw0KGgo: 'image/png',
    '/9j/': 'image/jpg',
  };
  for (const s in signatures) {
    if (b64.indexOf(s) === 0) {
      res = signatures[s];
    }
  }
  return res;
}

export function generateFieldName(str) {
  let result = '';
  if (str) {
    const smallStr = str.toLowerCase();
    result = smallStr.replaceAll(' ', '_');
  }
  return result;
}

export function getMutliFieldsAddArray(array) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    newData = [0, 0, array[i]];
    newArray.push(newData);
  }
  return newArray;
}

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function getJsonString(str) {
  return JSON.parse(str);
}

export const downloadPNGImage = (blob, fileName, id) => {
  const fakeLink = window.document.createElement('a');
  fakeLink.style = 'display:none;';
  const actionDiv = document.getElementById(id);
  fakeLink.download = fileName;

  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  if (actionDiv) {
    actionDiv.style.display = 'initial';
  }
  fakeLink.remove();
};
export function checkBase64Length(base64String, limit) {
  let res = true;
  const html = new DOMParser().parseFromString(base64String, 'text/html');

  const result = [...html.images].map((e) => e.src);
  if (result && (parseInt(result.length) > parseInt(limit))) {
    res = false;
  }
  return res;
}

export function checkIsDate(input) {
  let res = false;
  if (input) {
    const dateObject = new Date(input);

    // Adjust moment formats to match possible inputs
    res = (
      moment(input, 'YYYY-MM-DD HH:mm:ss.SSSSSS', true).isValid() // Handles microseconds
      || moment(input, 'YYYY-MM-DD HH:mm:ss', true).isValid() // Handles seconds only
      || moment(input, 'YYYY-MM-DD', true).isValid() // Handles date only
      || moment(input, 'MM/DD/YY HH:mm:ss', true).isValid() // Handles short year
      || moment(input, 'MM/DD/YYYY HH:mm:ss', true).isValid() // Handles full year
      || moment(input, 'MM/DD/YY', true).isValid() // Handles short year date
      || moment(input, 'MM/DD/YYYY', true).isValid() // Handles full year date
    ) && typeof input !== 'number' && !isNaN(dateObject.getTime()) && dateObject instanceof Date;
  }
  return res;
}

export function checkIsDateOrTime(input) {
  let res = 'datetime'; // Default to 'datetime'
  if (input) {
    if (moment(input, 'YYYY-MM-DD', true).isValid()) {
      res = 'date';
    }
  }
  return res;
}

export function getCompanyTimezoneDateExportTime(input, userResponse, type) {
  let local = '-';
  const defaultTf = getFormat(type);
  if (input && input !== 'No' && input !== '-' && userResponse && userResponse.data) {
    const uData = userResponse.data;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData.timezone ? uData.timezone : defaultTz;
    const dateFormat = uData.lang && uData.lang.date_format ? truncatePercentageAndDateType(uData.lang.date_format, type) : defaultTf;
    local = moment.utc(input).local().tz(tZone).format('YYYY-MM-DD HH:mm:ss');
  }
  return local;
}

export function checkBase64Size(base64String, size, test) {
  let res = true;
  const html = new DOMParser().parseFromString(base64String, 'text/html');

  const result = [...html.images].map((e) => e.src);

  let tSize = 0;

  if (!test) {
    result.forEach((item) => {
      const stringLength = item.length - `data:${detectMimeType(item)};base64,`.length;

      const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
      const sizeInKb = sizeInBytes / 1000;
      tSize += parseInt(sizeInKb);
    });
  }

  if (tSize > size) {
    res = false;
  }
  console.log(result && result.length ? result.length : 0);
  return { isMax: res, isImage: result && result.length ? result.length : 0 };
}

export const getFindData = (filters, field) => {
  const result = filters && filters.length && filters.find((cFilter) => cFilter.title === field);
  return result || '';
};

export const getFilterData = (filters, field) => {
  const result = filters && filters.length && filters.filter((cFilter) => cFilter.title === field);
  return result && result.length ? result : [];
};

export const getFindDateRange = (filters, field) => {
  const result = filters && filters.length && filters.find((cFilter) => cFilter.key === field);
  return result ? result.value : [null, null];
};

export const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

export const debounceCancel = (callback, wait) => {
  let timeoutId = null;

  const debounced = (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };

  debounced.cancel = () => {
    window.clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
};

export const getHeaderName = (columns, field) => {
  let headerName = '';
  const filterData = columns.filter((val) => val.field === field);
  if (filterData && filterData.length > 0) {
    headerName = filterData && filterData.length && filterData[0].headerName;
  }
  return headerName;
};

export const getNewDataGridFilterArray = (columns, uniqueCustomFilter) => {
  let uniqueCustomFilterData = [];
  if (uniqueCustomFilter && uniqueCustomFilter.length > 0) {
    uniqueCustomFilterData = uniqueCustomFilter.map((data) => ({
      field: data.field,
      operator: data.operator,
      id: data.id,
      value: data.value,
      key: data.field,
      type: data.type,
      title: getHeaderName(columns, data.field),
    }));
  }
  return uniqueCustomFilterData;
};

export const getNewDataGridFilterArrayNew = (columns, uniqueCustomFilter) => {
  let uniqueCustomFilterData = [];
  if (uniqueCustomFilter && uniqueCustomFilter.length > 0) {
    uniqueCustomFilterData = uniqueCustomFilter.map((data) => ({
      field: data.field,
      operator: data.operator,
      id: data.id,
      value: encodeURIComponent(data.value),
      key: data.field,
      type: data.type,
      title: getHeaderName(columns, data.field),
    }));
  }
  return uniqueCustomFilterData;
};

export async function commonCopyUrlToClipboard(uuid, name, paramName, paramValue) {
  // const isBasePath = !!window.location.pathname.includes('/v3');
  const accountId = await getAccountId();
  let val = `${WEBAPPAPIURL}${name}/${uuid}`;
  if (paramName && paramValue) {
    val = `${val}?${paramName}=${paramValue}?accid=${encodeURIComponent(accountId)}`;
  } else {
    val = `${val}?accid=${encodeURIComponent(accountId)}`;
  }
  const el = document.createElement('input');
  el.value = val;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
export async function copyTextToClipboard(uuid, name, paramName, paramValue) {
  // const isBasePath = !!window.location.pathname.includes('/v3');
  const accountId = await getAccountId();
  let val = `${WEBAPPAPIURL}${name}/${uuid}`;
  if (paramName && paramValue) {
    val = `${val}?${paramName}=${paramValue}?accid=${encodeURIComponent(accountId)}`;
  } else {
    val = `${val}?accid=${encodeURIComponent(accountId)}`;
  }
  navigator.clipboard.writeText(val)
    .then(() => {
      console.log('Text copied to clipboard:', val);
    })
    .catch((err) => {
      console.log('Unable to copy text to clipboard:', val);
    });
}
export function convertDateObjects(data) {
  const res = data;
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (checkIsDate(value)) {
      res[key] = moment(value).local().format('YYYY-MM-DD');
    }
  });
  return res;
}

export function getArrayFormatUpdate16(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const dataObj = { ...array[i] };
    delete dataObj.id;
    const newData = [array[i].id ? [array[i].id] : [0], convertDateObjects(dataObj)];
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayFormatCreate16(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const dataObj = { ...convertDateObjects(array[i]) };
    delete dataObj.id;
    delete dataObj._action;
    newArray.push(dataObj);
  }
  return newArray;
}
export function getArrayFormatUpdate12(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const dataObj = { ...array[i] };
    Object.keys(dataObj).map((bodyData) => {
      const values = dataObj[bodyData];
      if (typeof values === 'object' && values.length) {
        dataObj[bodyData] = extractValueObjects(dataObj[bodyData]);
      } else if (values.id) {
        dataObj[bodyData] = extractValueObjects(dataObj[bodyData]);
      } else {
        dataObj[bodyData] = dataObj[bodyData];
      }
      return array[bodyData];
    });
    delete dataObj.id;
    const newData = [array[i].id ? [array[i].id] : [0], convertDateObjects(dataObj)];
    newArray.push(newData);
  }
  return newArray;
}

export function getArrayFormatCreateSingle(array) {
  const newArray = [];
  array && array.length && array.map((bodyData) => {
    Object.keys(bodyData).forEach((key) => {
      bodyData[key] = bodyData[key] && (bodyData[key].id || bodyData[key].length) ? extractValueObjects(bodyData[key]) : bodyData[key];
    });
  });
  for (let i = 0; i < array.length; i += 1) {
    if (!array[i].isRemove) {
      const dataObj = array[i];
      delete dataObj.id;
      newArray.push(dataObj);
    }
  }
  return newArray;
}

export function getArrayFormatCreate12(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 1) {
    const dataObj = { ...convertDateObjects(array[i]) };
    delete dataObj.id;
    delete dataObj._action;
    newArray.push(dataObj);
  }
  return newArray;
}

export function strCustomize(head, str) {
  let newArray = str;

  if (head && head === 'Type' && str && str === 'e') {
    newArray = 'Equipment';
  } else if (head && head === 'Type' && str && str === 'ah') {
    newArray = 'Space';
  } else {
    newArray = str;
  }
  return newArray;
}

export function formatFilterData(data, globalValue) {
  const filters = data && data.customFilters ? data.customFilters : data;
  const filter = filters && filters.length > 0 ? filters.map((item) => `${item.header}: ${strCustomize(item.header, item.value)}`).join(', ') : '';
  return globalValue ? `${filter} Search Keyword: ${globalValue}` : filter;
}

export function getTicketStatus(status, isRequested, isCancelled) {
  let res = status || '';
  if (isCancelled) {
    res = 'Cancelled';
  } else if (isRequested) {
    res = Array.isArray(status) && status[1] !== 'Closed' && status[1] !== 'On Hold' ? 'On-Hold Requested' : (Array.isArray(status) ? status[1] : '-');
  } else if (Array.isArray(status)) {
    res = status[1];
  }

  return res;
}

export function getOldData(oldData) {
  return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
}

export function removeDuplicatesBetweenStrings(str1, str2) {
  // Convert strings to arrays for easier manipulation
  const arr1 = str1.split('');
  const arr2 = str2.split('');

  // Create a set of unique characters in str1
  const uniqueCharsInStr1 = new Set(arr1);

  // Filter characters in str2 that are not in the set of unique characters in str1
  const filteredArr2 = arr2.filter((char) => !uniqueCharsInStr1.has(char));

  // Join the filtered array back into a string
  const result = filteredArr2.join('');

  return result;
}

export function getModuleGroups(array) {
  let menuList = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].groups && array[i].groups.length) {
      for (let j = 0; j < array[i].groups.length; j += 1) {
        if (array[i].groups[j]) {
          menuList.push(array[i].groups[j]);
        }
      }
    }
  }
  if (menuList && menuList.length) {
    menuList = menuList.sort((a, b) => a.sequence - b.sequence);
  }
  return menuList;
}

export function getArrayFromValuesByIdInLength(array, ids, col) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][col]) {
      const value = array[i][col];
      if (ids && (ids.indexOf(value) !== -1)) {
        column.push(value);
      }
    }
  }
  return column; // return column data..
}

export function valueCheck(dataArray) {
  let returnValue = true;
  dataArray.map((item) => {
    if (!item.value) {
      returnValue = false;
    }
  });
  return returnValue;
}

export function getBaseDomain(url) {
  const parsedUrl = new URL(url);
  const ogUrl = parsedUrl.origin;
  const webUrl = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}`;
  const res = url.replace(ogUrl, webUrl);
  return res;
}

export function getGlobalEmailRegex() {
  const regex = window.localStorage.getItem('email_regex') && window.localStorage.getItem('email_regex') !== 'false' && window.localStorage.getItem('email_regex') !== '' ? new RegExp(window.localStorage.getItem('email_regex')) : /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?!.*[&%#$]).*$/;
  return regex;
}

export function getWeeks() {
  const weeks = [];
  for (let i = 1; i <= 52; i++) {
    // weeks.push(i);
    weeks.push({ value: `WK${i}`, label: `Wk${i}` });
  }
  return weeks;
}

export function generateTimeDurations(interval = 15) {
  const times = [];
  const totalMinutesInDay = 24 * 60; // Total minutes in a day (1440)

  for (let i = 0; i < totalMinutesInDay; i += interval) {
    const hours = Math.floor(i / 60);
    const minutes = i % 60;
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    times.push({ value: time, label: time });
  }

  return times;
}

export function generateTimeDurationsOnlyHours(hours) {
  const times = [];
  for (let i = 1; i <= hours; i++) {
    const time = `${i}:00`;
    times.push({ value: time, label: time });
  }
  return times;
}

export const preprocessData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.map((item) => ({
    ...item,
    children: Array.isArray(item.children) && item.children.length > 0 ? item.children : undefined,
  }));
};

export function htmlSanitizeInput(input) {
  let res = '';
  if (input) {
    const purifyText = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
    res = purifyText.replaceAll(/<\/?[^>]+(>|$)/g, '');
  }
  return res;
}

export const convertToBase64 = async (url, headers) => {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(`Fetch error: Status ${response.status}`);
      return false;
    }
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(false);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return false;
  }
};

export async function getProfileImage(userInfo) {
  let res = false;
  if (userInfo && userInfo.data && userInfo.data.image_url) {
    const headers = {
      portalDomain: window.location.origin === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : window.location.origin,
    };
    res = await convertToBase64(getBaseDomain(userInfo.data.image_url), headers);
  }
  return res;
}

export function getCompanyAccessLevel(tempLevel, userObj) {
  const userCompanyId = userObj && userObj.data && userObj.data.company ? userObj.data.company.id : '';
  const userParentId = userObj && userObj.data && userObj.data.company.parent_id ? userObj.data.company.parent_id.id : '';
  let domain = '';
  if (tempLevel === 'Site') {
    domain = `["company_id","=",${userCompanyId}]`;
  } else if (tempLevel === 'Company') {
    domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
  } else if (tempLevel === 'Instance') {
    domain = '"|",["company_id","=",1],["company_id","=",false]';
  }
  return domain;
}

export function getTableScrollHeight(rowHeight, reduceHeight, rowCount) {
  const maxHeight = window.innerHeight - reduceHeight; // Max height based on viewport
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);
  return tableHeight;
}

export function getAccountIdFromUrl(props) {
  const propValues = props;
  const values1 = queryString.parse(propValues?.location?.search);
  return values1 && values1.accid ? values1.accid : '';
}

export function exportStyledTableToXlsx(tableID, fileTitle = 'Styled_Report') {
  const table = document.getElementById(tableID);
  const worksheet = XLSX.utils.table_to_sheet(table);

  // Ensure the worksheet has a valid range
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cell_address]) continue;

      // HEADER STYLES (Row 0)
      if (R === 0) {
        worksheet[cell_address].s = {
          font: {
            bold: true, name: 'Roboto Condensed', sz: 14, color: { rgb: 'FFFFFF' },
          }, // White text
          fill: { fgColor: { rgb: '4EBBFB' } }, // Blue background
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'E0E0E0' } },
            left: { style: 'thin', color: { rgb: 'E0E0E0' } },
            right: { style: 'thin', color: { rgb: 'E0E0E0' } },
            bottom: { style: 'thin', color: { rgb: 'E0E0E0' } },
          },
        };
      } else {
        // ALTERNATING ROW COLORS
        const isEvenRow = R % 2 === 0;
        worksheet[cell_address].s = {
          font: { name: 'Roboto Condensed', sz: 12, color: { rgb: '000000' } }, // Black text
          fill: { fgColor: { rgb: isEvenRow ? 'F5F5F5' : 'FFFFFF' } }, // Gray for even rows
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'E0E0E0' } },
            left: { style: 'thin', color: { rgb: 'E0E0E0' } },
            right: { style: 'thin', color: { rgb: 'E0E0E0' } },
            bottom: { style: 'thin', color: { rgb: 'E0E0E0' } },
          },
        };

        // CONDITIONAL FORMATTING: Highlight negative numbers in red
        const cellValue = worksheet[cell_address].v;
        if (typeof cellValue === 'number' && cellValue < 0) {
          worksheet[cell_address].s.font.color = { rgb: 'FF0000' }; // Red text for negative numbers
        }
      }
    }
  }

  // Auto-adjust column widths based on content length
  worksheet['!cols'] = Object.keys(worksheet)
    .filter((key) => key[0] !== '!')
    .map((cell) => ({
      wch: Math.max(10, String(worksheet[cell].v).length + 5),
    }));

  // Create a new workbook and add the styled worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Styled Data');

  // Save the file as .xlsx
  XLSX.writeFile(workbook, `${fileTitle}.xlsx`);
}

function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match) return 'FFFFFFFF'; // Default white
  const [r, g, b] = match.map(Number);
  return `FF${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

function capitalizeWords(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

// ** Main Function to Export HTML Table to XLSX **
export async function exportExcelTableToXlsx(tableID, fileName = 'Styled_Report.xlsx') {
  const container = document.getElementById(tableID);
  if (!container) return console.error('Table not found!');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const tables = container.getElementsByTagName('table');
  let rowIndex = 1;

  Array.from(tables).forEach((table) => {
    let startRow; let endRow; let startCol; let
      endCol;

    Array.from(table.rows).forEach((row) => {
      const excelRow = worksheet.getRow(rowIndex);
      let colIndex = 1;
      let hasColspan = false; // Track if the row has colspan

      // Remove empty rows (but keep headers)
      const isHeader = row.parentElement.tagName.toLowerCase() === 'thead' || rowIndex === 1;
      if (!isHeader && [...row.cells].every((cell) => !cell.innerText.trim())) return;

      Array.from(row.cells).forEach((cell) => {
        const textValue = cell.innerText.trim();
        const excelCell = excelRow.getCell(colIndex);

        // Apply text value (uppercase for headers)
        excelCell.value = isHeader ? textValue.toUpperCase() : textValue;

        // Apply font styles
        excelCell.font = {
          name: 'Roboto Condensed',
          size: 9,
          bold: isHeader,
        };

        // Apply alignment (left align if colspan exists)
        excelCell.alignment = {
          horizontal: cell.colSpan > 1 && !isHeader ? 'left' : 'center',
          vertical: 'middle',
          wrapText: true,
        };

        // Track if colspan exists
        if (cell.colSpan > 1) hasColspan = true;

        // Ensure column width is reasonable
        const textLength = textValue.length;
        const minColWidth = 14;
        const maxColWidth = 35;
        worksheet.getColumn(colIndex).width = Math.min(maxColWidth, Math.max(minColWidth, textLength + 5));

        // **Header Height Adjustment (Only if Wrapped)**
        if (isHeader) {
          const estimatedLines = Math.ceil(textLength / 20);
          worksheet.getRow(rowIndex).height = estimatedLines > 1 ? 30 + estimatedLines * 5 : 25;
        }

        // **Handle Merged Cells (ColSpan & RowSpan)**
        if (cell.colSpan > 1 || cell.rowSpan > 1) {
          worksheet.mergeCells(rowIndex, colIndex, rowIndex + cell.rowSpan - 1, colIndex + cell.colSpan - 1);
        }

        // Track start/end positions for borders
        if (!startRow) startRow = rowIndex;
        endRow = rowIndex;
        startCol = startCol ? Math.min(startCol, colIndex) : colIndex;
        endCol = Math.max(endCol || colIndex, colIndex);

        colIndex += cell.colSpan || 1;
      });

      // **Reduce row height if colspan exists**
      if (hasColspan) {
        worksheet.getRow(rowIndex).height = 18; // Reduced height
      }

      rowIndex++;
    });

    // Apply borders
    if (startRow && endRow && startCol && endCol) {
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          worksheet.getCell(r, c).border = {
            top: r === startRow ? { style: 'thin' } : undefined,
            bottom: r === endRow ? { style: 'thin' } : undefined,
            left: c === startCol ? { style: 'thin' } : undefined,
            right: c === endCol ? { style: 'thin' } : undefined,
          };
        }
      }
    }
  });

  // **Auto-adjust row heights for wrapped text (except colspan)**
  worksheet.eachRow((row, rIndex) => {
    if (rIndex === 1) return; // Skip title row

    let maxLines = 1;
    let hasColspan = false;

    row.eachCell((cell, colIndex) => {
      if (worksheet.getCell(rIndex, colIndex).isMerged) {
        hasColspan = true;
        return; // Skip row height update for merged cells
      }

      const textLength = cell.value ? cell.value.toString().length : 0;
      const columnWidth = worksheet.getColumn(colIndex).width || 10;
      const estimatedLines = Math.ceil(textLength / (columnWidth * 0.7));
      maxLines = Math.max(maxLines, estimatedLines);
    });

    if (!hasColspan) {
      row.height = Math.max(maxLines * 13.8, 18);
    }
  });

  // **Save Excel File**
  setTimeout(async () => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  }, 100);
}

export function decodeJWT(token) {
  let name = '';
  if (token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    // const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    console.log(payload);
    name = `${payload && payload.given_name ? payload.given_name : ''} ${payload && payload.family_name ? payload.family_name : ''}`;
  }

  return name;
}

export const isValidValue = (value) => value && value.trim().length > 0 && !value.startsWith(' ');

export function decodeJWTNameValidate(token) {
  let error = '';
  if (token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    // const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const name = `${payload && payload.given_name ? payload.given_name : ''} ${payload && payload.family_name ? payload.family_name : ''}`;
    const lettersRegEx = /^[a-zA-Z\s]*$/;
    if (!lettersRegEx.test(name)) {
      error = 'Special Characters are not allowed';
    }
  }

  return error;
}

export function decodeJWTToken(token) {
  let name = '';
  if (token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    // const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    name = payload;
  }

  return name;
}

export function copyToClipboardText(val) {
  navigator.clipboard.writeText(val)
    .then(() => console.log('Copied to clipboard!'))
    .catch((err) => console.error('Failed to copy:', err));
}

export function convertUrlsToLinks(htmlString) {
  let res = '';
  try {
    if (htmlString) {
      // 1. Wrap raw URLs (not in <a>) with anchor tags
      const urlRegex = /(?<!["'=])\b(https?:\/\/[^\s<>"']+)/g;

      const withLinks = htmlString.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);

      // 2. Then enhance any existing <a> tags to include target and rel
      const wrapper = document.createElement('div');
      wrapper.innerHTML = withLinks;

      wrapper.querySelectorAll('a[href]').forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });

      res = wrapper.innerHTML;
    }
  } catch (e) {
    console.log(e);
    res = '';
  }
  return res;
}

export function containsHtmlTags(str) {
  let res = false;
  if (str) {
    const regex = /<\/?[a-z][\s\S]*>/i;
    res = regex.test(str);
  }
  return res;
}

export function stripHtmlTags(str) {
  let res = str;
  if (str) {
    const noHtml = str.replace(/<\/?[^>]+(>|$)/g, '');
    const txt = document.createElement('textarea');
    txt.innerHTML = noHtml;
    res = txt.value;
  }
  return res;
}
