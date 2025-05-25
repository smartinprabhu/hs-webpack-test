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

import workorderActionData from '../data/adminMaintenanceActions.json';

export function getWorkOrderStateLabel(staten) {
  if (workorderActionData && workorderActionData.states[staten]) {
    return <Badge color={workorderActionData.states[staten].color} className="badge-text no-border-radius" pill>{workorderActionData.states[staten].text}</Badge>;
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
  if (isNaN(totalVal) || isNaN(givenVal)) {
    perc = 0;
  } else {
    perc = ((given / total) * 100);
  }

  perc = parseFloat(perc).toFixed(2);

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

export function getDatasets(values, name, total) {
  let result = {};
  if (values) {
    const tage = getPercentage(total, values[0]);
    const remainValue = total - values[0];
    result = {
      datasets: [
        {
          data: [
            values[0],
            remainValue,
          ],
          backgroundColor: [
            '#3a4354',
          ],
          hoverBackgroundColor: [
            '#3a4354',
          ],
        },
      ],
      labels: [name, 'Others'],
      text: `${percentage} %`,
    };
  }

  return result;
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const statusValues = filters.states ? filters.states : [];
  const teams = filters.teams ? filters.teams : [];
  const priorities = filters.priorities ? filters.priorities : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];
  for (let i = 0; i < statusValues.length; i += 1) {
    filterTxt += `Status: ${statusValues[i].label},`;
  }
  for (let i = 0; i < teams.length; i += 1) {
    filterTxt += `Maintenance Team: ${teams[i].label},`;
  }
  for (let i = 0; i < priorities.length; i += 1) {
    filterTxt += `Priority: ${priorities[i].label},`;
  }
  for (let i = 0; i < customFilters.length; i += 1) {
    if (customFilters[i].type === 'date') {
      filterTxt += `${customFilters[i].label},`;
    } else if (customFilters[i].type === 'datearry') {
      filterTxt += `${customFilters[i].label} "${customFilters[i].value[0]} - ${customFilters[i].value[1]}",`;
    } else {
      filterTxt += `${customFilters[i].label} "${customFilters[i].value}",`;
    }
  }
  filterTxt = filterTxt.substring(0, filterTxt.length - 1);
  return filterTxt;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    if (type === 'This week') {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      const last = first + 6; // last day is the first day + 6

      const firstDay = new Date(curr.setDate(first));
      const lastDay = new Date(curr.setDate(last));

      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
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
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'Today') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = new Date();
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'This year') {
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
    let actualDateValue = new Date(actualDate);

    if (!actualDate) {
      actualDateValue = new Date();
    }
    if (actualDateValue < new Date(plannedDate)) {
      return <span className="text-success font-weight-800">Within SLA</span>;
    }
    return <span className="text-danger font-weight-800">SLA Elapsed</span>;
  }
  return <span className="text-danger font-weight-800">No SLA</span>;
}

export function getSLAText(plannedDate, actualDate) {
  if (plannedDate) {
    let actualDateValue = new Date(actualDate);

    if (!actualDate) {
      actualDateValue = new Date();
    }
    if (actualDateValue < new Date(plannedDate)) {
      return 'Within SLA';
    }
    return 'SLA Elapsed';
  }
  return 'No SLA';
}

export function getSLALabelIcon(plannedDate, actualDate) {
  if (plannedDate) {
    let actualDateValue = new Date(actualDate);

    if (!actualDate) {
      actualDateValue = new Date();
    }
    if (actualDateValue < new Date(plannedDate)) {
      return (
        <span className="text-success font-tiny font-weight-800">
          <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
          Within SLA
        </span>
      );
    }
    return (
      <span className="text-danger font-tiny font-weight-800">
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
  // eslint-disable-next-line prefer-const
  let column = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key] !== value) {
      column.push(array[i]);
    }
  }
  return column; // return column data..
}
