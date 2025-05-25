/* eslint-disable prefer-destructuring */
import React from 'react';
import { Badge } from 'reactstrap';

import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
  extractTextObject,
  truncate,
} from '../../../util/appUtils';
import { groupByMultiple } from '../../../util/staticFunctions';

import customData from '../data/customData.json';

export function getAssetName(type, space, equipment) {
  let res = '-';
  if (type) {
    if (type === 'e') {
      if (equipment && equipment.name) {
        res = equipment.name;
      }
    } else if (type === 'ah') {
      if (space && space.path_name) {
        res = space.path_name;
      }
    }
  }
  return res;
}

export function calculateRepeatingMonthlyEvents(
  repeatMonthsCount,
  week,
  repeatUntil,
  periodName,
  weekStartDate,
) {
  const repeatUntilDate = new Date(repeatUntil);
  let currentDate = new Date(weekStartDate); // ✅ Start directly from `weekStartDate`
  const eventRanges = [];

  const weekMapping = {
    First: 1, Second: 2, Third: 3, Fourth: 4,
  };

  const repeatMonthsMap = {
    'Monthly Twice': 1,
    'Two Months Once': 2,
    Quarterly: 3,
    'Half Yearly': 6,
    Yearly: 12,
  };

  const repeatMonths = repeatMonthsMap[periodName] || repeatMonthsCount;

  // ✅ Handle Weekly Events
  if (periodName === 'Weekly') {
    while (currentDate <= repeatUntilDate) {
      const eventStart = new Date(currentDate);
      const eventEnd = new Date(eventStart);
      eventEnd.setDate(eventStart.getDate() + 6);
      eventEnd.setHours(23, 59, 59, 999);

      eventRanges.push({ start: eventStart, end: eventEnd });

      // Move to the next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return eventRanges;
  }

  // ✅ Handle Monthly-based Events
  while (currentDate <= repeatUntilDate) {
    const eventStart = new Date(currentDate);
    let mondayCount = 0;

    // ✅ Find the correct week's Monday from the currentDate
    while (eventStart.getMonth() === currentDate.getMonth()) {
      if (eventStart.getDay() === 1) {
        mondayCount++;
        if (mondayCount === weekMapping[week]) break;
      }
      eventStart.setDate(eventStart.getDate() + 1);
    }

    if (mondayCount === weekMapping[week] && eventStart <= repeatUntilDate) {
      eventStart.setHours(0, 0, 0, 0);
      const eventEnd = new Date(eventStart);
      eventEnd.setDate(eventStart.getDate() + 6);
      eventEnd.setHours(23, 59, 59, 999);
      eventRanges.push({ start: eventStart, end: eventEnd });
    }

    // ✅ Handle "Monthly Twice" Events
    if (periodName === 'Monthly Twice' && eventStart) {
      const secondEventStart = new Date(eventStart);
      secondEventStart.setDate(eventStart.getDate() + 14);
      if (secondEventStart <= repeatUntilDate) {
        const secondEventEnd = new Date(secondEventStart);
        secondEventEnd.setDate(secondEventStart.getDate() + 6);
        secondEventEnd.setHours(23, 59, 59, 999);
        eventRanges.push({ start: secondEventStart, end: secondEventEnd });
      }
    }

    // ✅ Move to the next period safely while keeping the correct week alignment
    const nextMonth = currentDate.getMonth() + repeatMonths;
    currentDate = new Date(currentDate.getFullYear(), nextMonth, currentDate.getDate());
  }

  return eventRanges.sort((a, b) => a.start - b.start);
}

export function getAssetId(type, space, equipment) {
  let res = '-';
  if (type) {
    if (type === 'e') {
      if (equipment && equipment.id) {
        res = equipment.id;
      }
    } else if (type === 'ah') {
      if (space && space.id) {
        res = space.id;
      }
    }
  }
  return res;
}

export function getDescName(type, space, equipment) {
  let res = '-';
  if (type) {
    if (type === 'e') {
      if (equipment && equipment.location_id && equipment.location_id.path_name) {
        res = equipment.location_id.path_name;
      }
    } else if (type === 'ah') {
      if (space && space.path_name) {
        res = space.path_name;
      }
    }
  }
  return res;
}

export function getTitleText(asset, schedule, week, isOnHoldRequested) {
  const seperator = '  |  ';
  const res = `${getDefaultNoValue(asset)}${seperator}${getDefaultNoValue(schedule)}${seperator}${getDefaultNoValue(week)}${isOnHoldRequested ? `${seperator}On-Hold Requested` : ''}`;
  return res;
}

export function getTitleText1(team, schedule, week) {
  const seperator = '  |  ';
  const res = `${getDefaultNoValue(team)}${seperator}${getDefaultNoValue(schedule)}${seperator}${getDefaultNoValue(week)}`;
  return res;
}

export function getResources(ppmlist) {
  let resources = [];
  if (ppmlist && ppmlist.length > 0) {
    /** Group By PPM name */
    const rdata = groupByMultiple(ppmlist, (obj) => (obj.asset_id));
    if (rdata && rdata.length > 0) {
      resources = rdata.map((pl) => ({
        id: pl[0].asset_id.toString(),
        name: pl[0].asset_name,
        team: pl[0].maintenance_team_name,
        type: `${truncate(pl[0].asset_path, 20)} - (${pl[0].category_type})`,
        total: 1,
        reference: `${pl[0].asset_code}`,
      }));
    }
  }
  /* if (resources && resources.length > 0) {
    resources = resources.filter((item) => item.total !== 0);
  } */
  return resources;
}

export function getEndTime(startdatetime, duration) {
  let res = new Date();
  if (startdatetime && duration) {
    const dt = new Date(startdatetime);
    const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
    res = new Date(endDateAdd);
  }
  return res;
}

export function getStartTime(startDate, startTime) {
  let res = new Date();
  if (startDate && startTime) {
    res = new Date(startDate);
    if (startTime.toString().includes('.')) {
      const fields = startTime.toString().split('.');
      res.setHours(fields[0]);
      res.setMinutes(fields[1]);
    } else {
      res.setHours(startTime);
      res.setMinutes(0);
    }
  }
  return res;
}

export function checkAllowedDay(obj, currentDate) {
  let res = true;
  if (obj && currentDate) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(currentDate);
    const dayName = days[d.getDay()];

    if (dayName === 'Sunday' && obj.su) {
      res = false;
    }

    if (dayName === 'Monday' && obj.mo) {
      res = false;
    }

    if (dayName === 'Tuesday' && obj.tu) {
      res = false;
    }

    if (dayName === 'Wednesday' && obj.we) {
      res = false;
    }

    if (dayName === 'Thursday' && obj.th) {
      res = false;
    }

    if (dayName === 'Friday' && obj.fr) {
      res = false;
    }

    if (dayName === 'Saturday' && obj.sa) {
      res = false;
    }
  }
  return res;
}

function getStateColor(state, abn) {
  let res = '';
  if (state === 'Missed') {
    res = 'rgb(255, 237, 237)';
  } else if (state === 'Completed') {
    res = 'rgb(199, 243, 209)';
  } else if (state === 'Upcoming') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'In Progress') {
    res = '#ffeccf';
  } else if (state === 'Pause') {
    res = '#FFFFC2';
  } else if (state === 'Cancelled') {
    res = 'rgb(247, 214, 214)';
  }
  return res;
}

function getStateTextColor(state, abn) {
  let res = '';
  if (state === 'Missed') {
    res = 'rgb(222, 24, 7)';
  } else if (state === 'Completed') {
    res = 'rgb(40, 167, 69)';
  } else if (state === 'Upcoming') {
    res = 'rgb(16, 146, 220)';
  } else if (state === 'In Progress') {
    res = 'rgb(255, 160, 0)';
  } else if (state === 'Pause') {
    res = '#ffa000';
  } else if (state === 'Cancelled') {
    res = '#de1807';
  }

  return res;
}

function getStateStatus(state, postponePending, cancelPending) {
  let res = '';
  if (state === 'Missed') {
    res = '2';
  } else if (state === 'Completed') {
    res = '1';
  } else if (state === 'Upcoming') {
    res = '4';
  } else if (state === 'In Progress') {
    res = '3';
  } else if (state === 'Pause') {
    res = '5';
  } else if (state === 'Cancelled') {
    res = '6';
  }

  if (state !== 'Completed' && state !== 'Cancelled' && (postponePending || cancelPending)) {
    res = '7';
  }

  return res;
}

export function getEventData(ppmlist, userInfo) {
  let totalEvents = [];
  const missed = [];
  const completed = [];
  const upcoming = [];
  const inprogress = [];

  if (ppmlist && ppmlist.length > 0) {
    totalEvents = ppmlist.map((pl) =>
      // const getEquipment = pl.space_id;
      // const getLocation = getEquipment.space_name;
      // const getReference = pl.equipment_id;
      ({
        id: `${pl.id.toString()}${'i'}`,
        name: getTitleText(pl.asset_name, pl.schedule_period_name, pl.week, pl.is_on_hold_requested),
        resourceId: pl.asset_id.toString(),
        orderId: pl.id.toString(),
        type: pl.category_type,
        start: getCompanyTimezoneDate(pl.starts_on, userInfo, 'datetimeseconds'),
        end: getCompanyTimezoneDate(pl.ends_on, userInfo, 'datetimeseconds'),
        title: getTitleText(pl.asset_name, pl.schedule_period_name, pl.week, pl.is_on_hold_requested),
        displayName: getTitleText(pl.asset_name, pl.schedule_period_name, pl.week, pl.is_on_hold_requested),
        schedule: pl.schedule_period_name,
        slotName: getTitleText(pl.asset_name, pl.schedule_period_name, pl.week, pl.is_on_hold_requested),
        location: pl.asset_code,
        asset_code: pl.asset_code,
        maintenance_team: pl.maintenance_team_name,
        space_name: pl.asset_name,
        dataId: pl.id,
        review_status: pl.review_status,
        is_signed_off: pl.is_signed_off,
        performed_by: pl.performed_by,
        vendor_name: pl.vendor_name,
        is_on_hold_requested: pl.is_on_hold_requested,
        is_service_report_required: pl.is_service_report_required,
        is_pending_for_approval: pl.is_pending_for_approval,
        is_rescheduled: pl.is_rescheduled,
        is_cancellation_requested: pl.is_cancellation_requested,
        compliance_type: pl.compliance_type,
        bgColor: getStateColor(pl.state),
        color: getStateTextColor(pl.state),
        status: getStateStatus(pl.state, pl.is_pending_for_approval, pl.is_cancellation_requested),
        total: 1,
        inprogress: 0,
        completed: 0,
        showPopover: true,
      }));
  }

  /* missed = missed.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  completed = completed.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  upcoming = upcoming.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  inprogress = inprogress.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  totalEvents = totalEvents.concat(missed, completed, upcoming, inprogress); */

  // ascending by start date must
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

export function getInspectionLabel(staten) {
  if (customData && customData.states[staten]) {
    return <Badge className={`${customData.states[staten].badgeClassName} badge-text no-border-radius`} pill>{customData.states[staten].text}</Badge>;
  }
  return '';
}
