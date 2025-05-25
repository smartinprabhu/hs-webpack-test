/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-var */
/* eslint-disable no-redeclare */
/* eslint-disable radix */
import React from 'react';
import { Badge } from 'reactstrap';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { filterDataPdf, customFilterDataArray, getArrayOfStrings, getLocalTimeSeconds } from '../../util/appUtils';


import workorderActionData from '../data/workorderActions.json';

export function getWorkOrderStateLabel(staten, isRequested) {
  if (workorderActionData && workorderActionData.states[staten]) {
    return <Badge color={workorderActionData.states[staten].color} className="badge-text no-border-radius" pill>{isRequested ? 'On-Hold Requested' : workorderActionData.states[staten].text}</Badge>;
  }
  return '';
}

export function getWorkOrderStateLabelNew(staten) {
  if (workorderActionData && workorderActionData.statesReview[staten]) {
    return <Badge color={workorderActionData.statesReview[staten].color} className="badge-text no-border-radius" pill>{workorderActionData.statesReview[staten].text}</Badge>;
  }
  return '';
}

export function getWorkOrderPriorityLabel(staten) {
  if (workorderActionData && workorderActionData.priorities[staten]) {
    return (
      <span className={`text-${workorderActionData.priorities[staten].color}`}>
        {workorderActionData.priorities[staten].text}
      </span>
    );
  }
  return '';
}

export function getWorkOrderStateText(staten) {
  if (workorderActionData && workorderActionData.states[staten]) {
    return workorderActionData.states[staten].text;
  }
  return '';
}

export function getWorkOrderPriorityText(staten) {
  if (workorderActionData && workorderActionData.priorities[staten]) {
    return workorderActionData.priorities[staten].text;
  }
  return '';
}

export function getWorkOrderPriorityColor(staten) {
  if (workorderActionData && workorderActionData.priorities[staten]) {
    return workorderActionData.priorities[staten].color;
  }
  return '';
}

export function getWorkOrderPriorityFormLabel(staten) {
  if (workorderActionData && workorderActionData.priorities[staten]) {
    return <Badge color={workorderActionData.priorities[staten].color} className="badge-text no-border-radius" pill>{workorderActionData.priorities[staten].text}</Badge>;
  }
  return '';
}

export function getMTName(staten) {
  if (workorderActionData && workorderActionData.maintenanceTypes[staten]) {
    return workorderActionData.maintenanceTypes[staten].label;
  }
  return '';
}

export function getProductTypes(staten) {
  if (workorderActionData && workorderActionData.productTypes[staten]) {
    return workorderActionData.productTypes[staten].label;
  }
  return '';
}

export function getWorkOrderTypeName(staten) {
  if (workorderActionData && workorderActionData.woTypes[staten]) {
    return workorderActionData.woTypes[staten].label;
  }
  return '';
}

export function getIssueTypeName(staten) {
  if (workorderActionData && workorderActionData.issueTypes[staten]) {
    return workorderActionData.issueTypes[staten].label;
  }
  return '';
}

export function getPercentage(total, given) {
  const totalVal = parseInt(total);
  const givenVal = parseInt(given);
  let perc = 0;
  // eslint-disable-next-line no-restricted-globals
  if (!(isNaN(totalVal) && isNaN(givenVal))) {
    perc = ((given / total) * 100);
    perc = parseFloat(perc).toFixed(2);
  }

  return perc;
}

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

function getColor(index) {
  const colors = ['#00be4b', '#fdca5c', '#f77b55', '#ff1e32', '#17a2b8', '#6f42c1', '#8077ee'];
  let cr = '';
  for (let i = 0; i < colors.length; i += 1) {
    if (index === i) {
      cr = colors[i];
    }
  }
  return cr;
}

export function getClassNameBorder(index) {
  const classes = ['border-success border-4 mb-2',
    'border-warning border-4 mb-2', 'border-light-orange border-4 mb-2', 'border-light-purple border-4 mb-2', 'border-danger border-4 mb-2', 'border-info border-4 mb-2', 'border-4 mb-2'];
  let cr = '';
  for (let i = 0; i < classes.length; i += 1) {
    if (index === i) {
      cr = classes[i];
    }
  }
  return cr;
}

export function getClassNameText(index) {
  const classes = ['text-success border-4 mb-2',
    'text-warning font-weight-800', 'text-light-orange font-weight-800', 'text-light-purple font-weight-800', 'text-danger font-weight-800', 'border-info font-weight-800', 'font-weight-800'];
  let cr = '';
  for (let i = 0; i < classes.length; i += 1) {
    if (index === i) {
      cr = classes[i];
    }
  }
  return cr;
}

export function getDatasets(values) {
  let result = {};
  if (values) {
    const datas = [];
    const names = [];
    const color = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push(values[i].data[1]);
        names.push(values[i].data[0]);
        color.push(getColor(i));
      }
    }
    result = {
      datasets: [
        {
          data: datas,
          backgroundColor: color,
          hoverBackgroundColor: color,
        },
      ],
      labels: names,
      text: '',
    };
  }

  return result;
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const statusValues = filters.states ? filters.states : [];
  const teams = filters.teams ? filters.teams : [];
  const priorities = filters.priorities ? filters.priorities : [];
  const maintenanceTypes = filters.maintenanceTypes ? filters.maintenanceTypes : [];
  const types = filters.types ? filters.types : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (statusValues && statusValues.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(statusValues);
  }

  if (teams && teams.length > 0) {
    filterTxt += 'Maintenance Team : ';
    filterTxt += filterDataPdf(teams);
  }

  if (priorities && priorities.length > 0) {
    filterTxt += 'Priority : ';
    filterTxt += filterDataPdf(priorities);
  }

  if (maintenanceTypes && maintenanceTypes.length > 0) {
    filterTxt += 'Maintenance Type : ';
    filterTxt += filterDataPdf(maintenanceTypes);
  }

  if (types && types.length > 0) {
    filterTxt += 'Type : ';
    filterTxt += filterDataPdf(types);
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



export function getSLATime(plannedDate, actualDate) {
  if (!plannedDate) {
    return '';
  }

  let dateFuture = new Date();

  if (actualDate) {
    const d = moment.utc(actualDate).local().format();
    dateFuture = new Date(d);
  }

  const d1 = moment.utc(plannedDate).local().format();
  const dateCurrent = new Date(d1);

  if (dateFuture > dateCurrent) {
    const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

    const totalSeconds = Math.abs(diffTime);

    const days = totalSeconds / 86400;
    const temp1 = totalSeconds % 86400;
    const hours = temp1 / 3600;
    const temp2 = temp1 % 3600;
    const minutes = temp2 / 60;

    if (Math.floor(days) > 0) {
      return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)}M`;
    }
    if (Math.floor(hours) > 0) {
      return `${Math.floor(hours)}H ${Math.floor(minutes)}M`;
    }

    return `${Math.floor(minutes)}M`;
  }
  return '';
}

export function getSLALabel(plannedDate, actualDate) {
  if (plannedDate) {
    let actualDateValue = new Date(getLocalTimeSeconds(actualDate, 'YYYY-MM-DD HH:mm:ss'))

    if (!actualDate) {
      actualDateValue = new Date();
    }
    const plannedUtc = getLocalTimeSeconds(plannedDate, 'YYYY-MM-DD HH:mm:ss')
    if (actualDateValue < new Date(plannedUtc)) {
      return <span className="text-success font-weight-800">Within SLA</span>;
    }
    return <span className="text-danger font-weight-800">SLA Elapsed</span>;
  }
  return <span className="text-danger font-weight-800">No SLA</span>;
}

export function getSLAText(plannedDate, actualDate) {
  if (plannedDate) {
    let actualDateValue = new Date(getLocalTimeSeconds(actualDate, 'YYYY-MM-DD HH:mm:ss'))

    if (!actualDate) {
      actualDateValue = new Date();
    }
    const plannedUtc = getLocalTimeSeconds(plannedDate, 'YYYY-MM-DD HH:mm:ss')
    if (actualDateValue < new Date(plannedUtc)) {
      return 'Within SLA';
    }
    return 'SLA Elapsed';
  }
  return 'No SLA';
}

export function getSLALabelIcon(plannedDate, actualDate) {
  if (plannedDate) {
    let actualDateValue = new Date(getLocalTimeSeconds(actualDate, 'YYYY-MM-DD HH:mm:ss'))

    if (!actualDate) {
      actualDateValue = new Date();
    }
    const plannedUtc = getLocalTimeSeconds(plannedDate, 'YYYY-MM-DD HH:mm:ss')
    if (actualDateValue < new Date(plannedUtc)) {
      return (
        <span className="text-success font-11px font-10px font-weight-800">
          <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
          Within SLA
        </span>
      );
    }
    return (
      <span className="text-danger font-11px font-10px font-weight-800">
        <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
        SLA Elapsed
      </span>
    );
  }
  return (
    <span className="text-danger font-tiny font-weight-800">
      <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
      No SLA
    </span>
  );
}

export function getTrimmedArray(array, key, value) {
  const column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key] !== value) {
      column.push(array[i]);
    }
  }
  return column;
}

export function getNewArrayParts(array, workorderId, pickingId) {
  return array.map((obj) => ({
    ...obj,
    parts_id: obj.id,
    parts_qty: obj.qty_on_hand,
    maintenance_id: workorderId,
    picking_id: pickingId,
    parts_uom: obj.parts_uom && obj.parts_uom.id ? obj.parts_uom.id : 1,
    used_qty: 0
  }));
}

export function getTrimmedArrayByArray(array, key, removeArray) {
  const columnArray = array.filter((ar) => !removeArray.find((rm) => (rm[key] === ar[key])));
  return columnArray;
}

export function getTrimmedArrayByWorkOrder(array, removeArray) {
  const columnArray = array.filter((ar) => !removeArray.find((rm) => (rm.parts_id && rm.parts_id.length && rm.parts_id[0] === ar.id)));
  return columnArray;
}

export function getTrimmedSame(array, key, secondArray) {
  const columnArray = array.filter((ar) => secondArray.find((rm) => (rm[key] === ar.part_id[0])));
  return columnArray;
}

export function getNonzeroParts(array, field, workorderPartsArray) {
  let columnArray = array.filter((ar) => ar[field] !== 0);
  if (workorderPartsArray && workorderPartsArray.length > 0) {
    columnArray = getTrimmedArrayByWorkOrder(array, workorderPartsArray);
  }
  return columnArray;
}

export function getOrderWithInventory(id, inventoryArray) {
  let quantityOnHand = '';
  if (id && (inventoryArray && inventoryArray.length > 0)) {
    for (let i = 0; i < inventoryArray.length; i += 1) {
      if (id === inventoryArray[i].id) {
        quantityOnHand = inventoryArray[i].qty_on_hand;
      }
    }
  }
  return quantityOnHand;
}

export function getNewArrayEditParts(arr1, pickingId) {
  const array1 = [];
  for (let i = 0; i < arr1.length; i += 1) {
    const obj = arr1[i];
    const { id } = obj;
    const values = {
      id, parts_id: obj.parts_id && obj.parts_id.length && obj.parts_id[0], parts_qty: obj.parts_qty, maintenance_id: obj.maintenance_id[0], picking_id: pickingId, parts_uom: obj.parts_uom[0],
    };
    array1.push(values);
  }

  return array1;
}

export function getNewArrayUsedQuantity(arr1, pickingId) {
  const array1 = [];
  for (let i = 0; i < arr1.length; i += 1) {
    const obj = arr1[i];
    const { id } = obj;
    const values = {
      id, parts_id: obj.parts_id && obj.parts_id.length && obj.parts_id[0], parts_qty: obj.parts_qty, used_qty: obj.used_qty, used_qty_initial: obj.used_qty_initial, maintenance_id: obj.maintenance_id[0], picking_id: pickingId, parts_uom: obj.parts_uom[0],
    };
    array1.push(values);
  }

  return array1;
}

export function calculatePercent(percent, total) {
  if ((percent && total) && (percent < total)) {
    return (percent / 100) * total;
  }
  return 0;
}

export function getLocalAnswers(id, localAnswers) {
  let mArr = [];
  if (localAnswers && localAnswers.length > 0) {
    const mAr = localAnswers.filter((item) => (item.id === id));
    mArr = getArrayOfStrings(mAr, 'value_text');
  }
  return mArr;
}

export function getMergedAnswers(dbAnswers, localAnswers) {
  const mArr = [];
  if (dbAnswers && dbAnswers.length > 0) {
    for (let i = 0; i < dbAnswers.length; i += 1) {
      if (dbAnswers[i].answer_type === 'multiple_choice') {
        dbAnswers[i].value_text = getLocalAnswers(dbAnswers[i].id, localAnswers);
      }
      mArr.push(dbAnswers[i]);
    }
  }
  return mArr;
}

export function getCommaArray(manswers) {
  const mArr = [];
  if (manswers && manswers.length > 0) {
    for (let i = 0; i < manswers.length; i += 1) {
      const arrayStr = manswers[i].value_text;
      if (arrayStr) {
        const commaArray = arrayStr.split(',');
        for (let j = 0; j < commaArray.length; j += 1) {
          const arrObj = { id: manswers[i].id, value_text: commaArray[j], answer_type: 'multiple_choice' };
          mArr.push(arrObj);
        }
      }
    }
  }
  console.log(mArr);
  return mArr;
}
