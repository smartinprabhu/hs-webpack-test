/* eslint-disable radix */
import React from 'react';
import { Badge } from 'reactstrap';
import moment from 'moment-timezone';

import actions from '../data/customData.json';
import {
  getCompanyTimezoneDate,
  getDifferenceBetweenInDays,
  filterDataPdf, customFilterDataArray,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

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

export function getStateLabel(staten) {
  if (staten && actions && actions.statesLabel[staten]) {
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

export function getStatusLabel(staten) {
  if (staten && actions && actions.statusLabel[staten]) {
    return (
      <Badge
        color={actions.statusLabel[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {actions.statusLabel[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getStateText(staten) {
  if (staten && actions && actions.statesLabel[staten]) {
    return actions.statesLabel[staten].label;
  }
  return '';
}

export function getLangText(staten) {
  if (staten && actions && actions.langLabel[staten]) {
    return actions.langLabel[staten].label;
  }
  return '';
}

export function getResponseTypeText(staten) {
  if (staten && actions && actions.responsibleTypeLabel[staten]) {
    return actions.responsibleTypeLabel[staten].label;
  }
  return '';
}

export function getStageLabel(staten) {
  if (actions && actions.stages[staten]) {
    return <Badge color={actions.stages[staten].color} className="badge-text no-border-radius" pill>{actions.stages[staten].text}</Badge>;
  }
  return '';
}

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data, label: values[i].label, backgroundColor: ['#00be4b', '#fdca5c', '#17a2b8', '#ff1e32', '#6134eb', '#6f42c1', '#8077ee', '#21ebbc'],
        });
      }
    }
    result = {
      datasets: datas,
      labels,
    };
  }
  return result;
}

export function getResponseTypeLabel(staten) {
  if (staten && actions && actions.responseTypeObj[staten]) {
    return actions.responseTypeObj[staten].label;
  }
  return '';
}

export function getColorCode(label) {
  let res = '';
  if (label === 'Max Score') {
    res = '#6699ff';
  } else if (label === 'Actual Score') {
    res = '#cc0000';
  } else if (label === '% Compliance') {
    res = '#00cc99';
  }
  return res;
}

function getStateColor(state) {
  let res = '';
  if (state === 'Missed') {
    res = 'rgb(255, 237, 237)';
  } else if (state === 'Completed') {
    res = 'rgb(199, 243, 209)';
  } else if (state === 'Upcoming') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Started') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Inprogress') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Reviewed') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Signed off') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Canceled') {
    res = 'rgb(229, 241, 248)';
  }

  return res;
}

function getStateTextColor(state) {
  let res = '';
  if (state === 'Missed') {
    res = 'rgb(222, 24, 7)';
  } else if (state === 'Completed') {
    res = 'rgb(40, 167, 69)';
  } else if (state === 'Upcoming') {
    res = 'rgb(16, 146, 220)';
  } else if (state === 'Started') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Inprogress') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Reviewed') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Signed off') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Canceled') {
    res = 'rgb(229, 241, 248)';
  }

  return res;
}

function getStateStatus(state) {
  let res = '';
  if (state === 'Missed') {
    res = '2';
  } else if (state === 'Completed') {
    res = '1';
  } else if (state === 'Upcoming') {
    res = '4';
  }

  return res;
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id ? pl.id : false,
      auditor_id: pl.auditor_id_ref,
      is_spoc: pl.is_spoc,
      role_id: pl.role_id && pl.role_id.length ? pl.role_id[0] : false,
      isRemove: pl.isRemove ? pl.isRemove : false,
    }));
  }
  return requestProduts;
}

export function getDueDays(startDate, endDate) {
  let res = '';
  if (startDate) {
    const date1 = moment.utc(startDate).local().format('YYYY-MM-DD HH:mm:ss');
    const date3 = moment.utc(endDate).local().format('YYYY-MM-DD HH:mm:ss');
    const date2 = new Date();
    if (new Date(date1) > date2) {
      const days = getDifferenceBetweenInDays(date2, date1);
      res = ` (Due in ${days} ${days > 1 ? 'days' : 'day'})`;
    } else if ((date2 >= new Date(date1)) && (date2 <= new Date(date3))) {
      res = ' (Due now)';
    }
  }
  return res;
}

export function getActionDueDays(endDate) {
  if (!endDate) return '';

  const now = moment().startOf('day'); // Current date at midnight
  const dueDate = moment.utc(endDate).local().startOf('day'); // Convert endDate to local and set to midnight

  if (!dueDate.isValid()) return ''; // Validate the endDate

  if (dueDate.isSameOrAfter(now, 'day')) {
    const days = dueDate.diff(now, 'days'); // Difference in days (date only)
    return days === 0
      ? '(Due on Today)'
      : `(Due in ${days} ${days > 1 ? 'days' : 'day'})`;
  }
  return '(Expired)';
}

export function calculateRepeatingMonthlyEvents(
  startDate,
  repeatMonths,
  eventStartDay,
  eventEndDay,
  eventEndReferenceDate, // Determines correct month placement
  repeatUntil,
) {
  const repeatUntilDate = new Date(repeatUntil);
  const startDateObj = new Date(startDate);
  const startYear = startDateObj.getFullYear();
  const startMonth = startDateObj.getMonth();

  const referenceEndDateObj = new Date(eventEndReferenceDate);
  const referenceEndMonth = referenceEndDateObj.getMonth();

  const monthDifference = (repeatUntilDate.getFullYear() - startYear) * 12
    + (repeatUntilDate.getMonth() - startMonth);

  return Array.from({ length: Math.floor(monthDifference / repeatMonths) + 1 }).reduce((eventRanges, _, index) => {
    const currentMonth = startMonth + index * repeatMonths;
    const currentYear = startYear + Math.floor(currentMonth / 12);
    const currentMonthAdjusted = currentMonth % 12;

    // Calculate the event start date
    const eventStart = new Date(currentYear, currentMonthAdjusted, eventStartDay);

    // If event start is beyond repeatUntil, stop processing
    if (eventStart > repeatUntilDate) {
      return eventRanges;
    }

    // Determine event end month (same or next month based on reference)
    let eventEnd;
    if (referenceEndMonth === startMonth) {
      eventEnd = new Date(currentYear, currentMonthAdjusted, eventEndDay);
    } else {
      eventEnd = new Date(currentYear, currentMonthAdjusted + 1, eventEndDay);
    }

    // Ensure event end does not exceed repeatUntil
    if (eventEnd > repeatUntilDate) {
      return eventRanges;
    }

    eventRanges.push({
      start: eventStart,
      end: eventEnd,
    });
    return eventRanges;
  }, []);
}

function getDatefromTime(date) {
  const dateTime = new Date(date);
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(dateTime.getDate()).padStart(2, '0');

  const dateOnly = `${year}-${month}-${day}`;
  return dateOnly;
}

function checkDateObject(date, datetime) {
  const dateOnly = new Date(date);
  const dateTimes = new Date(datetime);
  const currentHours = dateTimes.getHours();
  const currentMinutes = dateTimes.getMinutes();
  const currentSeconds = dateTimes.getSeconds();
  dateOnly.setHours(currentHours);
  dateOnly.setMinutes(currentMinutes);
  dateOnly.setSeconds(currentSeconds);
  return dateOnly;
}

export function getPlannedDays(data, plannedStartDate, plannedEndDate) {
  const newData = [...data];
  const newPostData = newData.map((cl) => {
    // Calculate the new start and end dates
    const updatedStartDate = checkDateObject(getDatefromTime(cl.start), plannedStartDate);
    const updatedEndDate = checkDateObject(getDatefromTime(cl.end), plannedEndDate);

    return {
      planned_start_date: updatedStartDate, // Overwrite with new start date
      planned_end_date: updatedEndDate, // Overwrite with new end date
    };
  });
  return newPostData;
}

export function calculateRepeatingMonthlyEventsData(startDate, repeatMonths, eventStartDay, eventEndDay, repeatUntil) {
  const repeatUntilDate = new Date(repeatUntil);
  const startDateObj = new Date(startDate);
  const startYear = startDateObj.getFullYear();
  const startMonth = startDateObj.getMonth();
  const repeatUntilYear = repeatUntilDate.getFullYear();
  const repeatUntilMonth = repeatUntilDate.getMonth();

  const monthDifference = (repeatUntilYear - startYear) * 12 + (repeatUntilMonth - startMonth);

  return Array.from({ length: Math.floor(monthDifference / repeatMonths) + 1 }).reduce((eventRanges, _, index) => {
    const currentMonth = startMonth + index * repeatMonths;
    const currentYear = startYear + Math.floor(currentMonth / 12);
    const currentMonthAdjusted = currentMonth % 12;

    const eventStart = new Date(currentYear, currentMonthAdjusted, eventStartDay);
    const eventEnd = new Date(currentYear, currentMonthAdjusted, eventEndDay);

    if (eventStart <= repeatUntilDate) {
      eventRanges.push({
        start: eventStart,
        end: eventEnd,
      });
    }
    return eventRanges;
  }, []);
}

export function getStartDateofAudit(referenceDate, months) {
  const currentDate = referenceDate; // Use planned_start_date as reference
  currentDate.setMonth(currentDate.getMonth() + months);
  currentDate.setDate(1); // Always set to the 1st of the resulting month
  return currentDate;
}

export function getNewRequestArrayV2(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id ? pl.id : false,
      team_members_id: pl.team_members_id_ref,
      is_spoc: pl.is_spoc,
      role_id: pl.role_id && pl.role_id.length ? pl.role_id[0] : false,
      isRemove: pl.isRemove ? pl.isRemove : false,
    }));
  }
  return requestProduts;
}

export function getResources(ppmlist, groupField) {
  let resources = [];
  if (ppmlist && ppmlist.length > 0) {
    /** Group By PPM name */
    const rdata = groupByMultiple(ppmlist, (obj) => (obj[groupField][0]));
    if (rdata && rdata.length > 0) {
      resources = rdata.map((pl) => ({
        id: pl[0][groupField][0].toString(),
        name: pl[0][groupField][1],
        reference: pl[0].scope, // pl[0].category_type === 'Equipment' ? pl[0].equipment_id.equipment_seq : pl[0].space_id.sequence_asset_hierarchy,
      }));
    }
  }
  return resources;
}

export function getEventData(ppmlist, userInfo, groupField) {
  let totalEvents = [];
  if (ppmlist && ppmlist.length > 0) {
    totalEvents = ppmlist.map((pl) =>
    // const spaceName = pl.space_id;
    //  const equipmentName = pl.equipment_id;
      ({
        id: `${pl.id.toString()}${'i'}`,
        name: `${pl.name} ${pl.state === 'Upcoming' ? getDueDays(pl.planned_start_date, pl.planned_end_date) : ''}`,
        resourceId: pl[groupField][0].toString(),
        orderId: pl.id.toString(),
        start: getCompanyTimezoneDate(pl.planned_start_date, userInfo, 'datetimeseconds'),
        end: getCompanyTimezoneDate(pl.planned_end_date, userInfo, 'datetimeseconds'),
        title: `${pl.name} ${pl.state === 'Upcoming' ? getDueDays(pl.planned_start_date, pl.planned_end_date) : ''}`,
        displayName: `${pl.name} ${pl.state === 'Upcoming' ? getDueDays(pl.planned_start_date, pl.planned_end_date) : ''}`,
        schedule: `${pl.name} ${pl.state === 'Upcoming' ? getDueDays(pl.planned_start_date, pl.planned_end_date) : ''}`,
        dataId: pl.id,
        bgColor: getStateColor(pl.state),
        color: getStateTextColor(pl.state),
        status: pl.state,
        total: 1,
        inprogress: 0,
        completed: 0,
        showPopover: true,
        sequence: pl.sequence,
        type: pl.audit_type,
        scope: pl.scope,
        quarter: pl.quarter,
        company: pl.company_id && pl.company_id.length ? pl.company_id[1] : '-',
        system: pl.audit_system_id && pl.audit_system_id.length ? pl.audit_system_id[1] : '-',
        auditSpoc: pl.audit_spoc_id && pl.audit_spoc_id.length ? pl.audit_spoc_id[1] : '-',
        department: pl.department_id && pl.department_id.length ? pl.department_id[1] : '-',
        category: pl.audit_category_id && pl.audit_category_id.length ? pl.audit_category_id[1] : '-',
      }));
  }

  totalEvents.sort((a, b) => {
    const keyA = new Date(a.start);
    const keyB = new Date(b.start);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  return totalEvents;
}

export function getScoreDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data, label: values[i].label, backgroundColor: getColorCode(values[i].label),
        });
      }
    }
    result = {
      datasets: datas,
      labels,
    };
  }

  return result;
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
