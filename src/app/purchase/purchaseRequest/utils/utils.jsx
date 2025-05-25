/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Badge } from 'reactstrap';
import {
  getDateTimeSeconds,
} from '../../../util/appUtils';
import requestActions from '../data/customData.json';

export function getStatusLabel(data) {
  if (requestActions && requestActions.status[data]) {
    return requestActions.status[data].label;
  }
  return '';
}

export function getRequestStateColor(data) {
  if (requestActions && requestActions.status[data]) {
    return requestActions.status[data].color;
  }
  return '';
}

export function getStatusTransferLabel(data) {
  if (requestActions && requestActions.statusTransfer[data]) {
    return requestActions.statusTransfer[data].label;
  }
  return '';
}

export function getRequestStateLabel(staten) {
  if (requestActions && requestActions.status[staten]) {
    return (
      <Badge
        color={requestActions.status[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {requestActions.status[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getRpStateLabel(staten) {
  if (requestActions && requestActions.statusTransfer[staten]) {
    return (
      <Badge
        color={requestActions.statusTransfer[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {requestActions.statusTransfer[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getPurchaseLinesRequest(array) {
  const result = [];
  const txVal = false;
  const txDate = new Date();
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].product_id && (typeof array[i].product_id === 'object' || typeof array[i].product_id === 'number')) {
      const val = array[i].taxes_id;
      if (val && val.length > 0) {
        const taxesData = [];
        val.map((taxId) => {
          taxesData.push(taxId.id);
        });
        array[i].taxes_id_new = [[6, 0, taxesData]];
      } else {
        array[i].taxes_id_new = txVal;
      }
      const val2 = array[i].date_planned;
      if (val2) {
        array[i].date_planned_new = getDateTimeSeconds(val2);
      } else {
        array[i].date_planned_new = getDateTimeSeconds(txDate);
      }
      const val3 = array[i].product_id;
      if (val3 && typeof val3 === 'object') {
        array[i].product_id_new = val3[0];
      } else if (val3 && typeof val3 === 'number') {
        array[i].product_id_new = val3;
      } else {
        array[i].product_id_new = txVal;
      }
      result.push(array[i]);
    }
  }
  return result; // return column data..
}

export function getNewPurchaseRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      date_planned: pl.date_planned_new,
      id: pl.id,
      name: pl.name,
      price_subtotal: pl.price_subtotal,
      price_unit: pl.price_unit,
      product_id: pl.product_id_new,
      product_qty: pl.product_qty,
      product_uom: pl.product_uom,
      product_uom_qty: pl.product_uom_qty,
      taxes_id: pl.taxes_id_new,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
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

export function checkRequiredFields(array) {
  let result = false;
  let quantityCount = 0;
  let scheduleDate = 0;
  let unitPrice = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].product_qty && arrayNew[i].product_qty > 0.00) {
      quantityCount += 1;
    }
    if (arrayNew[i].date_planned && arrayNew[i].date_planned !== '') {
      scheduleDate += 1;
    }
    if (arrayNew[i].product_qty && arrayNew[i].price_unit > 0.00) {
      unitPrice += 1;
    }
  }
  result = quantityCount === arrayNew.length && scheduleDate === arrayNew.length && unitPrice === arrayNew.length;
  return result;
}

export function getRequiredMessage(array) {
  let result = '';
  let quantityCount = 0;
  let scheduleDate = 0;
  let unitPrice = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].product_qty && arrayNew[i].product_qty > 0.00) {
      quantityCount += 1;
    }
    if (arrayNew[i].date_planned && arrayNew[i].date_planned !== '') {
      scheduleDate += 1;
    }
    if (arrayNew[i].product_qty && arrayNew[i].price_unit > 0.00) {
      unitPrice += 1;
    }
  }
  if (quantityCount !== arrayNew.length) {
    result = 'Please enter at least one quantity.';
  } else if (scheduleDate !== arrayNew.length) {
    result = 'Schedule Date is required.';
  } else if (unitPrice !== arrayNew.length) {
    result = 'Indicative price should be greater than zero.';
  }
  return result;
}
