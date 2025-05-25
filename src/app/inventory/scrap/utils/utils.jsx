import React from 'react';
import { Badge } from 'reactstrap';
import moment from 'moment-timezone';

import customData from '../data/customData.json';
import { filterDataPdf, customFilterDataArray } from '../../../util/appUtils';

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const states = filters.statuses ? filters.statuses : [];
  const dates = filters.dates ? filters.dates : [];

  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (states && states.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(states);
  }
  if (dates && dates.length > 0) {
    filterTxt += 'Expected Date : ';
    filterTxt += filterDataPdf(dates);
  }
  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function getStateLabel(staten) {
  if (customData && customData.states && customData.states[staten]) {
    return <Badge color={customData.states[staten].color} className="badge-text no-border-radius" pill>{customData.states[staten].text}</Badge>;
  }
  return '';
}

export function getStateText(staten) {
  if (customData && customData.states && customData.states[staten]) {
    return customData.states[staten].text;
  }
  return '';
}

export function getStateColor(staten) {
  if (customData && customData.states && customData.states[staten]) {
    return customData.states[staten].color;
  }
  return '';
}

export function getInventText(staten) {
  if (customData && customData.inventoryTypesText && customData.inventoryTypesText[staten]) {
    return customData.inventoryTypesText[staten].text;
  }
  return '';
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    if (type.length > 0) {
      if (type.includes('This year')) {
        const firstDay = `${(new Date()).getFullYear()}-01-01`;
        const lastDay = `${(new Date()).getFullYear()}-12-31`;
        daterange.push(firstDay);
        daterange.push(lastDay);
      } else if (type.includes('This month')) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(),
          date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(),
          date.getMonth(), daysInMonth(date.getMonth() + 1,
            date.getFullYear()));
        daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
        daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
      } else if (type.includes('This week')) {
        const curr = new Date(); // get current date
        const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        const last = first + 6; // last day is the first day + 6

        const firstDay = new Date(curr.setDate(first));
        const lastDay = new Date(curr.setDate(last));

        daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
        daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
      } else if (type.includes('Today')) {
        let firstDay = new Date();
        firstDay = firstDay.setDate(firstDay.getDate() - 1);
        const lastDay = new Date();
        daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
        daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
      }
    } else {
      daterange = [];
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id,
      product_id: pl.product_id_ref,
      product_uom_id: pl.product_uom_id_if,
      location_id: pl.location_id_ref,
      theoretical_qty: pl.theoretical_qty,
      product_qty: pl.product_qty,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}
