/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { Badge } from 'reactstrap';

import {
  getCompanyTimezoneDate,
  getArrayFromValuesByIdIn,
  truncate,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

import customData from '../overview/data/customData.json';

export function getAssetName(type, space, equipment) {
  let res = '-';
  if (type) {
    if (type === 'Equipment') {
      if (equipment && equipment.name) {
        res = equipment.name;
      } else if (equipment && equipment.length) {
        res = equipment[1];
      }
    } else if (type === 'Space') {
      if (space && space.space_name) {
        res = space.space_name;
      } else if (space && space.length) {
        res = space[1];
      }
    }
  }
  return res;
}

export function getDescName(type, space, equipment) {
  let res = '-';
  if (type) {
    if (type === 'Equipment') {
      if (equipment && equipment.location_id && equipment.location_id.path_name) {
        res = equipment.location_id.path_name;
      } else if (equipment && space.length) {
        res = space[1];
      }
    } else if (type === 'Space') {
      if (space && space.path_name) {
        res = space.path_name;
      } else if (space && space.length) {
        res = space[1];
      }
    }
  }
  return res;
}

export function getAssetId(type, space, equipment) {
  let res = '-';
  if (type) {
    if (type === 'Equipment') {
      if (equipment && equipment.id) {
        res = equipment.id;
      } else if (equipment && equipment.length) {
        res = equipment[0];
      }
    } else if (type === 'Space') {
      if (space && space.id) {
        res = space.id;
      } else if (space && space.length) {
        res = space[0];
      }
    }
  }
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
        type: `${truncate(pl[0].asset_path)} - (${pl[0].category_type})`,
        total: 1,
        reference: pl[0].asset_number, // pl[0].category_type === 'Equipment' ? pl[0].equipment_id.equipment_seq : pl[0].space_id.sequence_asset_hierarchy,
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

function getStateColor(state, abn) {
  let res = '';
  if (abn) {
    res = 'rgb(255, 237, 237)';
  } else if (state === 'Missed') {
    res = 'rgb(255, 237, 237)';
  } else if (state === 'Completed') {
    res = 'rgb(199, 243, 209)';
  } else if (state === 'Upcoming') {
    res = 'rgb(229, 241, 248)';
  } else if (state === 'Cancelled') {
    res = 'rgb(247, 214, 214)';
  }

  return res;
}

function getStateTextColor(state, abn) {
  let res = '';
  if (abn) {
    res = 'rgb(222, 24, 7)';
  } else if (state === 'Missed') {
    res = 'rgb(222, 24, 7)';
  } else if (state === 'Completed') {
    res = 'rgb(40, 167, 69)';
  } else if (state === 'Upcoming') {
    res = 'rgb(16, 146, 220)';
  } else if (state === 'Cancelled') {
    res = '#de1807';
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
  }  else if (state === 'Cancelled') {
    res = '6';
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

export function getEventData(ppmlist, userInfo) {
  let totalEvents = [];
  const missed = [];
  const completed = [];
  const upcoming = [];
  if (ppmlist && ppmlist.length > 0) {
    totalEvents = ppmlist.map((pl) =>
    // const spaceName = pl.space_id;
    //  const equipmentName = pl.equipment_id;
      ({
        id: `${pl.id.toString()}${'i'}`,
        name: pl.maintenance_team_name,
        resourceId: pl.asset_id.toString(),
        orderId: pl.id.toString(),
        start: getCompanyTimezoneDate(pl.start_datetime, userInfo, 'datetimeseconds'),
        end: getCompanyTimezoneDate(pl.end_datetime, userInfo, 'datetimeseconds'),
        title: pl.maintenance_team_name,
        displayName: pl.maintenance_team_name,
        schedule: pl.group_name,
        dataId: pl.id,
        bgColor: getStateColor(pl.state, pl.is_abnormal),
        color: getStateTextColor(pl.state, pl.is_abnormal),
        isAbnormal: pl.is_abnormal,
        status: getStateStatus(pl.state),
        total: 1,
        inprogress: 0,
        completed: 0,
        showPopover: true,
        space_name: pl.asset_name,
        review_status: pl.review_status,
        equipment_name: pl.asset_name,
        space_number: pl.asset_number,
        equipment_number: pl.asset_number,
        enforce_time: pl.enforce_time,
        type: pl.category_type,
        parent_id: pl.hx_inspection_uuid,
      }));
  }
  // missed = missed.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  // completed = completed.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  // upcoming = upcoming.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  // totalEvents = totalEvents.concat(missed, completed, upcoming);

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

export function filterPdf(filterValues) {
  let filterTxt = '';
  for (let i = 0; i < filterValues.length; i += 1) {
    filterTxt += `${filterValues[i]}`;
    if (i === filterValues.length - 1) {
      filterTxt += ' | ';
    } else {
      filterTxt += ', ';
    }
  }
  return filterTxt;
}

export function filterGroupPdf(filterValues) {
  let filterTxt = '';
  for (let i = 0; i < filterValues.length; i += 1) {
    filterTxt += `${filterValues[i].label}`;
    if (i === filterValues.length - 1) {
      filterTxt += ' | ';
    } else {
      filterTxt += ', ';
    }
  }
  return filterTxt;
}

export function getGroupName(selectedField) {
  let filterTxt = '';

  if (selectedField === 'asset_name') {
    filterTxt = 'Asset';
  } else if (selectedField === 'maintenance_period_id') {
    filterTxt = 'Team';
  } else if (selectedField === 'schedule_period_name') {
    filterTxt = 'Schedule';
  } else if (selectedField === 'vendor_name') {
    filterTxt = 'Vendor';
  }
  return filterTxt;
}

export function getFilterName(selectedField) {
  let filterTxt = '';

  if (selectedField === 'is_on_hold_requested') {
    filterTxt = 'On-Hold Requested';
  } else if (selectedField === 'is_pending_for_approval') {
    filterTxt = 'Prepone/Postpone Requested';
  } else if (selectedField === 'is_rescheduled') {
    filterTxt = 'Is Rescheduled';
  } else if (selectedField === 'is_cancellation_requested') {
    filterTxt = 'Cancellation Requested';
  }
  return filterTxt;
}

export function filterStringGenerator(selectedFilter, viewModal, selectedField, groupFilters, userResponse, customDataGroup, labelField, viewHead, requestOptions) {
  let filterTxt = '';
  const { startDate } = viewModal;
  const { endDate } = viewModal;

  const groupDataFilters = getArrayFromValuesByIdIn(customDataGroup, groupFilters, 'value');

  if (selectedFilter && selectedFilter.length > 0) {
    const start = getCompanyTimezoneDate(startDate, userResponse, 'date');
    const end = getCompanyTimezoneDate(endDate, userResponse, 'date');
    filterTxt += `${viewHead} : ${start} - ${end}  | `;
  }

  if (selectedFilter && selectedFilter.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterPdf(selectedFilter);
  }

  if (groupDataFilters && groupDataFilters.length > 0) {
    filterTxt += `${getGroupName(selectedField)} : `;
    filterTxt += filterGroupPdf(groupDataFilters, selectedField);
  }
  if (requestOptions && requestOptions.length) {
    for (let i = 0; i < requestOptions.length; i += 1) {
      if (requestOptions[i] && requestOptions[i].label) {
        if (requestOptions[i].label === 'Yes') {
          filterTxt += `${getFilterName(requestOptions[i].field)} : `;
          filterTxt += 'Yes, ';
        } else if (requestOptions[i].label === 'No') {
          filterTxt += `${getFilterName(requestOptions[i].field)} : `;
          filterTxt += 'No, ';
        } else if (requestOptions[i].field === 'compliance_type') {
          filterTxt += 'Compliance Type : ';
          filterTxt += `${requestOptions[i].label}, `;
        }
      }
    }
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function getDataArryNot(array, ids, col, value) {
  const column = [];
  for (let i = 0; i < ids.length; i += 1) {
    const id = parseInt(ids[i]);
    if (array[id] && array[id][col] && array[id][col] !== value) {
      column.push(array[id]);
    }
  }
  return column; // return column data..
}

export function getArrayColors(label) {
  let result = '';

  if (label === 'Upcoming') {
    result = '#15719f';
  } else if (label === 'Missed') {
    result = '#f38e6b';
  } else if (label === 'Completed') {
    result = '#00be4b';
  }

  return result;
}

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data,
          label: values[i].label,
          backgroundColor: getArrayColors(values[i].label),
          trendlineLinear: {
            lineStyle: 'dotted',
            width: 1,
          },
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

export function getDatasetsApex(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    const colors = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data,
          name: values[i].label,
        });
        colors.push(getArrayColors(values[i].label));
      }
    }
    result = {
      datasets: datas,
      colorsDynamic: colors,
      labels,
    };
  }

  return result;
}
