/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React from 'react';
import { Badge } from 'reactstrap';

import employeeActionData from '../data/employeesData.json';

export function getRegStatusLabel(staten) {
  if (employeeActionData && employeeActionData.stateslabels[staten]) {
    return <Badge color={employeeActionData.stateslabels[staten].color} className="badge-text no-border-radius" pill>{employeeActionData.stateslabels[staten].text}</Badge>;
  }
  return '';
}

export function getRegStatusText(staten) {
  if (employeeActionData && employeeActionData.stateslabels[staten]) {
    return employeeActionData.stateslabels[staten].text;
  }
  return '';
}

export function getActiveText(staten) {
  if (employeeActionData && employeeActionData.activeText[staten]) {
    return employeeActionData.activeText[staten].text;
  }
  return '';
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const statusValues = filters.statuses ? filters.statuses : [];
  const categories = filters.categories ? filters.categories : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];
  for (let i = 0; i < statusValues.length; i += 1) {
    filterTxt += `Status: ${statusValues[i].label},`;
  }
  for (let i = 0; i < categories.length; i += 1) {
    filterTxt += `Category: ${categories[i].label},`;
  }
  for (let i = 0; i < customFilters.length; i += 1) {
    if (customFilters[i].type === 'date') {
      filterTxt += `${customFilters[i].label},`;
    } else {
      filterTxt += `${customFilters[i].label} "${customFilters[i].value}",`;
    }
  }
  filterTxt = filterTxt.substring(0, filterTxt.length - 1);
  return filterTxt;
}

export function getArrayFromIds(array, ids) {
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (ids && ids.indexOf(array[i].id) !== -1) {
      column.push(array[i]);
    }
  }
  return column; // return column data..
}
