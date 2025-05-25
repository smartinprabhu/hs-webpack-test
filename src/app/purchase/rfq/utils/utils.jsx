/* eslint-disable radix */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';
import quotationActions from '../data/customData.json';

export function getStatusLabel(data) {
  if (quotationActions && quotationActions.status[data]) {
    return quotationActions.status[data].label;
  }
  return '';
}

export function getRfqStateColor(data) {
  if (quotationActions && quotationActions.status[data]) {
    return quotationActions.status[data].color;
  }
  return '';
}

// export function getStatusTransferLabel(data) {
//   if (quotationActions && quotationActions.statusTransfer[data]) {
//     return (
//       <Badge
//         color={quotationActions.statusTransfer[data].color}
//         className="badge-text no-border-radius"
//         pill
//       >
//         {quotationActions.statusTransfer[data].label}
//       </Badge>
//     );
//   }
//   return '';
// }

export function getStatusTransferLabel(staten) {
  if (staten && quotationActions && quotationActions.statusTransfer[staten]) {
    return (
      <Badge
        color={quotationActions.statusTransfer[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {quotationActions.statusTransfer[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getStatusTransferDynamicLabel(staten, labelName) {
  if (staten && quotationActions && quotationActions.statusTransfer[staten]) {
    return (
      <Badge
        color={quotationActions.statusTransfer[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {labelName || quotationActions.statusTransfer[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getTransferStateLabel(staten) {
  if (quotationActions && quotationActions.statusTransfer[staten]) {
    return (
      <Badge
        color={quotationActions.statusTransfer[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {quotationActions.statusTransfer[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getRFqStateLabel(staten) {
  if (quotationActions && quotationActions.statusTransfer[staten]) {
    return (
      <Badge
        color={quotationActions.statusTransfer[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {quotationActions.statusTransfer[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getRpStateLabel(staten) {
  if (quotationActions && quotationActions.statusTransfer[staten]) {
    return (
      <Badge
        color={quotationActions.statusTransfer[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {quotationActions.statusTransfer[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getInvoiceStatusLabel(data) {
  if (quotationActions && quotationActions.invoiceStatusLabels[data]) {
    return quotationActions.invoiceStatusLabels[data].label;
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
      const thisYear = type.filter((obj) => (obj.id === 'This year'));
      const thisMonth = type.filter((obj) => (obj.id === 'This month'));
      const today = type.filter((obj) => (obj.id === 'Today'));
      const thisWeek = type.filter((obj) => (obj.id === 'This week'));
      const custom = type.filter((obj) => (obj.id === 'Custom'));
      if (thisYear.length > 0) {
        const firstDay = `${(new Date()).getFullYear()}-01-01`;
        const lastDay = `${(new Date()).getFullYear()}-12-31`;
        daterange.push(firstDay);
        daterange.push(lastDay);
      } else if (thisMonth.length > 0) {
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
      // } else if (type.includes('This week')) {
      } else if (thisWeek.length > 0) {
        const curr = new Date(); // get current date
        const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        const last = first + 6; // last day is the first day + 6
        const firstDay = new Date(curr.setDate(first));
        const lastDay = new Date(curr.setDate(last));

        daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
        daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
      } else if (today.length > 0) {
        let firstDay = new Date();
        firstDay = firstDay.setDate(firstDay.getDate() - 1);
        const lastDay = new Date();
        daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
        daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
      } else if (custom.length > 0) {
        daterange.push(moment(custom[0].start).format('YYYY-MM-DD'));
        daterange.push(moment(custom[0].end).format('YYYY-MM-DD'));
      }
    } else {
      daterange = [];
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function getNewReturnArray(array, field) {
  const resources = [];
  const allowed = [field];
  const value = array;
  let returnMoves = {};
  if (value) {
    Object.keys(value)
      .filter((key) => !allowed.includes(key))
      .forEach((key) => delete value[key]);
  }
  if (value.product_return_moves && value.product_return_moves.length > 0) {
    returnMoves = value.product_return_moves[0][2];
  } else {
    returnMoves = {};
  }
  resources.push(returnMoves);
  return resources;
}

export function getNewReturnArrayV1(array) {
  const result = [];
  if (array && array.length) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] && array[i].length && array[i].length === 3) {
        result.push(array[i][2]);
      }
    }
  }
  return result; // ret
}

export function getNewProductArray(array) {
  let resources = [];
  if (array && array.length > 0) {
    resources = array.map((pl) => ({
      product_id: pl.product_id[0],
      quantity: pl.quantity,
      to_refund: false,
      move_id: pl.move_id,
    }));
  }
  return resources;
}

export function getNewProductReturnArray(array) {
  let resources = [];
  if (array && array.length > 0) {
    resources = array.map((pl) => ({
      product_id: pl.product_id,
      quantity: pl.quantity ? parseInt(pl.quantity) : 0,
      to_refund: pl.to_refund ? pl.to_refund : false,
      move_id: pl.move_id,
    }));
  }
  return resources;
}

export function getNewTransferArray(array) {
  let transferProduts = [];
  if (array && array.length > 0) {
    transferProduts = array.map((pl) => ({
      id: pl.id,
      product_id: pl.product_id_new,
      name: pl.name,
      product_uom_qty: pl.product_uom_qty,
      product_uom: pl.product_uom ? pl.product_uom[0] : 1,
      quantity_done: pl.quantity_done,
      reserved_availability: pl.reserved_availability,
    }));
  }
  return transferProduts;
}

export function getNewTransferArrayNew(array) {
  let transferProduts = [];
  if (array && array.length > 0) {
    transferProduts = array.map((pl) => ({
      id: pl.id,
      product_id: pl.product_id_new,
      name: pl.name,
      product_uom_qty: pl.product_uom_qty,
      product_uom: pl.product_uom_ref,
      quantity_done: pl.quantity_done,
      reserved_availability: pl.reserved_availability,
    }));
  }
  return transferProduts;
}

export function getNewRequestArrayUpdate(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id,
      product_id: pl.product_id_ref,
      product_uom: pl.product_uom_ref,
      product_uom_qty: parseFloat(pl.product_uom_qty),
      quantity_done: parseFloat(pl.quantity_done),
      name: pl.name,
      location_id: pl.location_id,
      location_dest_id: pl.location_dest_id,
      reserved_availability: parseFloat(pl.reserved_availability),
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}

export function getNameData(array, value) {
  let result = false;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].id === value) {
      result = [array[i].id, array[i].name];
      break;
    }
  }
  return result; // return column data..
}

export function getDataWithName(array, array1, key) {
  const result = [];
  let fVal = 0;
  const data = array;
  for (let i = 0; i < data.length; i += 1) {
    const value = data[i][key];
    if (typeof value === 'object') {
      fVal = value[0];
    } else {
      fVal = value;
    }
    data[i][key] = getNameData(array1, fVal);
    result.push(array[i]);
  }
  return result;
}

export function checkArrayhasData(array) {
  const result = [];
  const txVal = false;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].product_id && (typeof array[i].product_id === 'object' || typeof array[i].product_id === 'number')) {
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

export function checkProductIdTransfer(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if ((arrayNew[i].product_id && arrayNew[i].product_id.length > 0) && (arrayNew[i].quantity > 0)) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function checkRemovedTransfers(array) {
  let result = false;
  if (array && array.length && array.length > 0) {
    const arrayNew = array.filter((item) => !item.isRemove);
    if (arrayNew && arrayNew.length === 0) {
      result = true;
    }
  }
  return result;
}

export function checkRequiredFields(array) {
  let result = false;
  let quantityCount = 0;
  let descriptionCount = 0;
  let scheduleDate = 0;
  let unitPrice = 0;
  let unitofMeasure = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].product_qty && arrayNew[i].product_qty > 0.00) {
      quantityCount += 1;
    }
    if (arrayNew[i].name && arrayNew[i].name !== '') {
      descriptionCount += 1;
    }
    if (arrayNew[i].date_planned && arrayNew[i].date_planned !== '') {
      scheduleDate += 1;
    }
    if (arrayNew[i].product_qty && arrayNew[i].price_unit > 0.00) {
      unitPrice += 1;
    }
    if (arrayNew[i].product_uom && arrayNew[i].product_uom.length > 0) {
      unitofMeasure += 1;
    }
  }
  result = quantityCount === arrayNew.length && descriptionCount === arrayNew.length && scheduleDate === arrayNew.length && unitPrice === arrayNew.length && unitofMeasure === arrayNew.length;
  return result;
}

export function checkSheduleDate(orderDate, scheduleDate) {
  let result = false;
  const oD = orderDate;
  const sD = scheduleDate;
  if (sD > oD) {
    result = true;
  }
  if (!sD) {
    result = true;
  }
  return result;
}

export function checkProductsScheduleDate(orderDate, productsData) {
  let result = false;
  const oD = orderDate;
  const arrayNew = productsData.filter((item) => item.date_planned_new > oD);
  if (productsData.length === arrayNew.length) {
    result = true;
  }
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

export function getSPLabel(data) {
  if (quotationActions && quotationActions.moveTypesName[data]) {
    return quotationActions.moveTypesName[data].label;
  }
  return '';
}

export function getPriorityLabel(data) {
  if (quotationActions && quotationActions.prioritiesLabel[data]) {
    return quotationActions.prioritiesLabel[data].label;
  }
  return '';
}

export function getBackOrder(array) {
  let result = false;
  const arrayNew = array.filter((item) => item.quantity_done !== 0);
  const initialDemand = arrayNew && arrayNew.length > 0 ? arrayNew[0].product_uom_qty : '0';
  const doneValue = arrayNew && arrayNew.length > 0 ? arrayNew[0].quantity_done : '0';
  result = doneValue > 0 ? doneValue < initialDemand : false;
  return result;
}

export function getNotReservedOrder(array) {
  let arrayNew = [];
  if (array && array.length && array.length > 0) {
    arrayNew = array.filter((item) => !(item.reserved_availability));
  }
  return arrayNew;
}

export function getLowQuantityProducts(array) {
  let arrayNew = [];
  if (array && array.length && array.length > 0) {
    arrayNew = array.filter((item) => item.product_uom_qty > item.reserved_availability);
  }
  return arrayNew;
}

export function getRequiredMessage(array) {
  let result = '';
  let quantityCount = 0;
  let descriptionCount = 0;
  let scheduleDate = 0;
  let unitPrice = 0;
  let unitofMeasure = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if (arrayNew[i].product_qty && arrayNew[i].product_qty > 0.00) {
      quantityCount += 1;
    }
    if (arrayNew[i].name && arrayNew[i].name !== '') {
      descriptionCount += 1;
    }
    if (arrayNew[i].date_planned && arrayNew[i].date_planned !== '') {
      scheduleDate += 1;
    }
    if (arrayNew[i].product_qty && arrayNew[i].price_unit > 0.00) {
      unitPrice += 1;
    }
    if (arrayNew[i].product_uom && arrayNew[i].product_uom.length > 0) {
      unitofMeasure += 1;
    }
  }
  if (quantityCount !== arrayNew.length) {
    result = 'Please enter at least one quantity.';
  } else if (descriptionCount !== arrayNew.length) {
    result = 'Description is required.';
  } else if (scheduleDate !== arrayNew.length) {
    result = 'Schedule Date is required.';
  } else if (unitPrice !== arrayNew.length) {
    result = 'Unit price should be greater than zero.';
  } else if (unitofMeasure !== arrayNew.length) {
    result = 'Product Unit of measure is required.';
  }
  return result;
}

export function getNewTransferArrayCustom(array) {
  let transferProduts = [];
  if (array && array.length > 0) {
    transferProduts = array.map((pl) => ({
      product_id: pl.product_id && pl.product_id.length ? pl.product_id[0] : false,
      quantity: parseInt(pl.quantity),
    }));
  }
  return transferProduts;
}

export function getNewRequestArrayOpt(array, sId, dId) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id,
      product_id: pl.product_id && pl.product_id.length ? pl.product_id[0] : false,
      product_uom: pl.product_uom && pl.product_uom.length ? pl.product_uom[0] : false,
      product_uom_qty: parseInt(pl.quantity),
      name: pl.product_id && pl.product_id.length ? pl.product_id[1] : false,
      location_id: sId,
      location_dest_id: dId,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}
