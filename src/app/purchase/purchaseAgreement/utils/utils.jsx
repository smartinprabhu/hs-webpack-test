/* eslint-disable array-callback-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import agreeActions from '../data/customData.json';
import {
  getDateTimeUtc,
} from '../../../util/appUtils';

export function getAgreeStatusColor(data) {
  if (agreeActions && agreeActions.agreeStatesLabel[data]) {
    return agreeActions.agreeStatesLabel[data].color;
  }
  return '';
}

export function getAgreeStatusLabel(data) {
  if (agreeActions && agreeActions.agreeStatesLabel[data]) {
    return agreeActions.agreeStatesLabel[data].label;
  }
  return '';
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const customFilters = filters.customFilters ? filters.customFilters : [];
  for (let i = 0; i < customFilters.length; i += 1) {
    if (customFilters[i].type === 'date') {
      filterTxt += `${customFilters[i].label},`;
    } else if (customFilters[i].type === 'datearray') {
      filterTxt += `${customFilters[i].label} "${customFilters[i].value[0]} - ${customFilters[i].value[1]}",`;
    } else {
      filterTxt += `${customFilters[i].label} ,`;
    }
  }
  filterTxt = filterTxt.substring(0, filterTxt.length - 1);
  return filterTxt;
}

export function getRequiredMessage(array) {
  let result = '';
  let quantityCount = 0;
  let scheduleDate = 0;
  let unitPrice = 0;
  let unitofMeasure = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].product_qty && arrayNew[i].product_qty > 0.00) {
      quantityCount += 1;
    }
    if (arrayNew[i].schedule_date && arrayNew[i].schedule_date !== '') {
      scheduleDate += 1;
    }
    if (arrayNew[i].product_qty && arrayNew[i].price_unit > 0.00) {
      unitPrice += 1;
    }
    if (arrayNew[i].product_uom_id && arrayNew[i].product_uom_id.length > 0) {
      unitofMeasure += 1;
    }
  }
  if (quantityCount !== arrayNew.length) {
    result = 'Please enter at least one quantity.';
  } else if (scheduleDate !== arrayNew.length) {
    result = 'Schedule Date is required.';
  } else if (unitPrice !== arrayNew.length) {
    result = 'Unit price should be greater than zero.';
  } else if (unitofMeasure !== arrayNew.length) {
    result = 'Product Unit of measure is required.';
  }
  return result;
}

export function checkRequiredFields(array) {
  let result = false;
  let quantityCount = 0;
  let scheduleDate = 0;
  let unitPrice = 0;
  let unitofMeasure = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].product_qty && arrayNew[i].product_qty > 0.00) {
      quantityCount += 1;
    }
    if (arrayNew[i].schedule_date && arrayNew[i].schedule_date !== '') {
      scheduleDate += 1;
    }
    if (arrayNew[i].product_qty && arrayNew[i].price_unit > 0.00) {
      unitPrice += 1;
    }
    if (arrayNew[i].product_uom_id && arrayNew[i].product_uom_id.length > 0) {
      unitofMeasure += 1;
    }
  }
  result = quantityCount === arrayNew.length && scheduleDate === arrayNew.length && unitPrice === arrayNew.length && unitofMeasure === arrayNew.length;
  return result;
}

export function checkProductId(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if ((arrayNew[i].product_id && arrayNew[i].product_id.length > 0)) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function getProductsLength(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    count += 1;
  }
  result = count === 0;
  return result;
}

export function getOrderLinesRequest(array) {
  const result = [];
  const txVal = false;
  const txDate = new Date();
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].product_id && (typeof array[i].product_id === 'object' || typeof array[i].product_id === 'number')) {
      const val2 = array[i].schedule_date;
      if (val2 && typeof val2 === 'object') {
        array[i].schedule_date_new = getDateTimeUtc(val2);
      } else if (val2) {
        array[i].schedule_date_new = val2;
      } else {
        array[i].schedule_date_new = getDateTimeUtc(txDate);
      }

      const val3 = array[i].product_id;
      if (val3 && typeof val3 === 'object') {
        array[i].product_id_new = val3[0];
      } else if (val3 && typeof val3 === 'number') {
        array[i].product_id_new = val3;
      } else {
        array[i].product_id_new = txVal;
      }

      const val4 = array[i].account_analytic_id;
      if (val4 && typeof val4 === 'object') {
        array[i].account_analytic_id_new = val4[0];
      } else if (val4 && typeof val4 === 'number') {
        array[i].account_analytic_id_new = val4;
      } else {
        array[i].account_analytic_id_new = txVal;
      }
      result.push(array[i]);
    }
  }
  return result; // return column data..
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      schedule_date: pl.schedule_date_new,
      id: pl.id,
      price_unit: pl.price_unit,
      product_id: pl.product_id_new,
      account_analytic_id: pl.account_analytic_id_new,
      product_qty: pl.product_qty,
      qty_ordered: pl.qty_ordered,
      product_uom_id: pl.product_uom_id && pl.product_uom_id.length > 0 ? pl.product_uom_id[0] : 1,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}
