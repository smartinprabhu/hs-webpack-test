/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import React from 'react';
import { Badge } from 'reactstrap';
import moment from 'moment';
import { ViewTypes, CellUnits, DATE_FORMAT } from 'react-big-scheduler';
import preventiveActions from '../data/preventiveActions.json';
import {
  getCompanyTimezoneDate, getTotalFromArray, filterDataPdf, customFilterDataArray, getFormat, truncatePercentageAndDateType,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

// function getcolor(index) {
//   const colors = ['#FFB6C1', '#f7d993', '#FFDAB9', '#90EE90', '#F08080', '#cbaab6', '#8ddfea', '#3a87ad', '#b8c0ec', '#f8ee9a', '#ecbff4'];
//   let cr = '';
//   for (let i = 0; i < colors.length; i += 1) {
//     if (index === i) {
//       cr = colors[i];
//     }
//   }
//   return cr;
// }

export function getEventCount(array) {
  const data = array;
  if (data.length > 0) {
    let count = 0;
    for (let i = 0; i < data.length; i += 1) {
      count = data[i].length;
      data[i].title = `${count} ${'PPMs'}`;
      data[i].backgroundColor = '#29abe2';
      data[i].borderColor = '#29abe2';
      if (data[i][0].start) {
        // eslint-disable-next-line prefer-destructuring
        data[i].date = (data[i][0].start.split(' ')[0]);
      }
      delete data[i][0].name;
      delete data[i][0].stop;
      delete data[i][0].start;
    }
  }
  return data;
}

export function getMaintenance(array, date) {
  const mArray = [];
  const data = array;
  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].start) {
        if (data[i].start.split(' ')[0] === date) {
          mArray.push(data[i]);
        }
      }
    }
  }
  return mArray;
}

export function getSelectedDays(mo, tu, we, th, fr, sa, su) {
  let mArray = [];
  if (mo) {
    mArray.push('Monday');
  }
  if (tu) {
    mArray.push('Tuesday');
  }
  if (we) {
    mArray.push('Wednesday');
  }
  if (th) {
    mArray.push('Thursday');
  }
  if (fr) {
    mArray.push('Friday');
  }
  if (sa) {
    mArray.push('Saturday');
  }
  if (su) {
    mArray.push('Sunday');
  }
  if (mArray.length > 0) {
    mArray = mArray.join(', ');
  }
  return mArray;
}

export function getSelectedPhoto(atStart, atDone, atReview) {
  const mArray = [];
  if (atStart) {
    mArray.push('At Start');
  }
  if (atDone) {
    mArray.push('At Done');
  }
  if (atReview) {
    mArray.push('At Review');
  }
  return mArray.join(', ');
}

/* Using this function instead of Month* */
export function getCustomDate(sdata, num, date = undefined) {
  const { viewType, localeMoment } = sdata; // Extract scheduler data properties
  const today = localeMoment(); // Use the locale moment from scheduler data
  let startDate = null;
  let endDate = null;

  const cellUnit = CellUnits.Day; // Default cell unit

  if (viewType === ViewTypes.Custom) {
    const referenceDate = date ? localeMoment(date) : localeMoment(sdata.startDate); // Use provided date or scheduler's startDate
    const isToday = referenceDate.isSame(today, 'day'); // Check if the date matches today

    if (isToday) {
      startDate = referenceDate.startOf('month').format(DATE_FORMAT);
    } else {
      startDate = referenceDate.add(num, 'months').startOf('month').format(DATE_FORMAT);
    }

    endDate = localeMoment(startDate).endOf('month').format(DATE_FORMAT);
  }

  return {
    startDate,
    endDate,
    cellUnit,
  };
}

export function isNonWorkingTime(sdata, time) {
  const { localeMoment } = sdata;
  if (sdata.cellUnit === CellUnits.Hour) {
    const hour = localeMoment(time).hour();
    if (hour < 9 || hour > 18) return true;
  } else {
    const dayOfWeek = localeMoment(time).weekday();
    if (dayOfWeek === 5 || dayOfWeek === 6) return true;
  }

  return false;
}

export function getDateLabelFunc(sdata, viewType, startDate, endDate) {
  const start = sdata.localeMoment(startDate);
  const end = sdata.localeMoment(endDate);
  let dateLabel = start.format('dddd, MMMM D, YYYY');

  const viewDate = moment(startDate).format('MM-DD-YYYY');
  const weekcount = moment(viewDate, 'MM-DD-YYYY').isoWeek();
  const labelWeek = `Week ${weekcount}`;

  if (viewType === ViewTypes.Week || (start !== end && (
    viewType === ViewTypes.Custom1 || viewType === ViewTypes.Custom2
  ))) {
    dateLabel = `${labelWeek}, ${start.format('MMMM D')}-${end.format('D, YYYY')}`;
    if (start.month() !== end.month()) dateLabel = `${labelWeek}, ${start.format('MMMM D')}-${end.format('MMMM D, YYYY')}`;
    if (start.year() !== end.year()) dateLabel = `${labelWeek}, ${start.format('MMMM D, YYYY')}-${end.format('MMMM D, YYYY')}`;
  } else if (viewType === ViewTypes.Custom) {
    dateLabel = start.format('MMMM YYYY');
  }

  return dateLabel;
}

export function getppmLabel(data) {
  if (preventiveActions && preventiveActions.ppmByText[data]) {
    return preventiveActions.ppmByText[data].label;
  }
  return '';
}

export function getPpmCategoryLabel(data) {
  if (preventiveActions && preventiveActions.ppmByCategoryLabels[data]) {
    return preventiveActions.ppmByCategoryLabels[data].label;
  }
  return '';
}

export function getPriorityLabel(data) {
  if (preventiveActions && preventiveActions.priority[data]) {
    return preventiveActions.priority[data].label;
  }
  return '';
}

export function getPriorityFormLabel(data) {
  if (preventiveActions && preventiveActions.priority[data]) {
    return <Badge className={preventiveActions.priority[data].classPriority}>{preventiveActions.priority[data].text}</Badge>;
  }
  return '';
}

export function getppmForLabel(data) {
  if (preventiveActions && preventiveActions.ppmForText[data]) {
    return preventiveActions.ppmForText[data].label;
  }
  return '';
}
export function getInspectionForLabel(data) {
  if (preventiveActions && preventiveActions.inspectionTypeText[data]) {
    return preventiveActions.inspectionTypeText[data].label;
  }
  return '';
}

export function getppmScoreLabel(data) {
  if (preventiveActions && preventiveActions.scoreTypeText[data]) {
    return preventiveActions.scoreTypeText[data].label;
  }
  return '';
}

export function getProductTypeLabel(data) {
  if (preventiveActions && preventiveActions.productType[data]) {
    return preventiveActions.productType[data].label;
  }
  return '';
}

export function getQuestionTypeLabel(data) {
  if (preventiveActions && preventiveActions.questionTypesText[data]) {
    return preventiveActions.questionTypesText[data].label;
  }
  return '';
}

export function getRuleTypeLabel(data) {
  if (preventiveActions && preventiveActions.ruleTypesText[data]) {
    return preventiveActions.ruleTypesText[data].label;
  }
  return '';
}

export function getDayRuleTextLabel(data) {
  if (preventiveActions && preventiveActions.dayRuleText[data]) {
    return preventiveActions.dayRuleText[data].label;
  }
  return '';
}

export function getMonthRuleTextLabel(data) {
  if (preventiveActions && preventiveActions.monthRuleText[data]) {
    return preventiveActions.monthRuleText[data].label;
  }
  return '';
}

export function getWeekListsTextLabel(data) {
  if (preventiveActions && preventiveActions.weekListsText[data]) {
    return preventiveActions.weekListsText[data].label;
  }
  return '';
}

export function getDefaultState(options, value) {
  let data = [];
  if (options && options.length > 0) {
    data = options.filter((item) => item.value === value);
  }
  return data;
}

export function getResources(ppmlist) {
  let resources = [];
  if (ppmlist && ppmlist.ppm_orders && ppmlist.ppm_orders.length > 0) {
    /** Group By PPM name */
    const rdata = groupByMultiple(ppmlist.ppm_orders, (obj) => obj.name);
    if (rdata && rdata.length > 0) {
      resources = rdata.map((pl) => ({
        id: pl[0].name.toString(),
        name: pl[0].name,
        team: pl[0].team_id && pl[0].team_id.name ? pl[0].team_id.name : '',
        schedule: pl[0].by_schedule,
        total: getTotalFromArray(pl, 'total'),
      }));
    }
  }
  /* if (resources && resources.length > 0) {
    resources = resources.filter((item) => item.total !== 0);
  } */
  return resources;
}

export function getEventData(ppmlist, userInfo) {
  let totalEvents = [];
  let inprogress = [];
  let completed = [];
  let upcoming = [];
  if (ppmlist && ppmlist.ppm_orders && ppmlist.ppm_orders.length > 0) {
    inprogress = ppmlist.ppm_orders.map((pl) => {
      if (pl.inprogress > 0) {
        return ({
          id: `${pl.id.toString()}${'i'}`,
          name: pl.name,
          resourceId: pl.name.toString(),
          orderId: pl.id.toString(),
          start: getCompanyTimezoneDate(pl.start_date, userInfo, 'datetimeseconds'),
          end: getCompanyTimezoneDate(pl.end_date, userInfo, 'datetimeseconds'),
          title: `${pl.inprogress} / ${pl.total} ${'PPM'}`,
          displayName: `${pl.completed} / ${pl.total} ${'PPM'}`,
          bgColor: new Date(getCompanyTimezoneDate(pl.start_date, userInfo, 'date')) > new Date() ? '#15719f' : '#ffa000',
          status: new Date(getCompanyTimezoneDate(pl.start_date, userInfo, 'date')) > new Date() ? '4' : '2',
          total: pl.total,
          inprogress: pl.inprogress,
          completed: pl.completed,
          showPopover: true,
        });
      }
      return {};
    });
    completed = ppmlist.ppm_orders.map((pl) => {
      if (pl.completed > 0 && pl.inprogress === 0) {
        return ({
          id: `${pl.id.toString()}${'c'}`,
          name: pl.name,
          resourceId: pl.name.toString(),
          orderId: pl.id.toString(),
          start: getCompanyTimezoneDate(pl.start_date, userInfo, 'datetimeseconds'),
          end: getCompanyTimezoneDate(pl.end_date, userInfo, 'datetimeseconds'),
          title: `${pl.completed} / ${pl.total} ${'PPM'}`,
          displayName: `${pl.completed} / ${pl.total} ${'PPM'}`,
          bgColor: new Date(getCompanyTimezoneDate(pl.start_date, userInfo, 'date')) > new Date() ? '#15719f' : '#00be4b',
          status: new Date(getCompanyTimezoneDate(pl.start_date, userInfo, 'date')) > new Date() ? '4' : '1',
          total: pl.total,
          completed: pl.completed,
          showPopover: true,
        });
      }
      return {};
    });
    upcoming = ppmlist.ppm_orders.map((pl) => {
      if (pl.completed === 0 && pl.inprogress === 0) {
        return ({
          id: `${pl.id.toString()}${'c'}`,
          name: pl.name,
          resourceId: pl.name.toString(),
          orderId: pl.id.toString(),
          start: getCompanyTimezoneDate(pl.start_date, userInfo, 'datetimeseconds'),
          end: getCompanyTimezoneDate(pl.end_date, userInfo, 'datetimeseconds'),
          title: `0 / ${pl.total} ${'PPM'}`,
          displayName: `0 / ${pl.total} ${'PPM'}`,
          bgColor: new Date(getCompanyTimezoneDate(pl.start_date, userInfo, 'date')) > new Date() ? '#15719f' : '#707070',
          status: new Date(getCompanyTimezoneDate(pl.start_date, userInfo, 'date')) > new Date() ? '4' : '3',
          total: pl.total,
          completed: pl.completed,
          showPopover: true,
        });
      }
      return {};
    });
  }
  inprogress = inprogress.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  completed = completed.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  upcoming = upcoming.filter((value) => JSON.stringify(value) !== '{}' && JSON.stringify(value) !== undefined);
  totalEvents = totalEvents.concat(inprogress, completed, upcoming);
  // ascending by start date must
  totalEvents.sort(function (a, b) {
    const keyA = new Date(a.start);
    const keyB = new Date(b.start);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  return totalEvents;
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const scheduleValues = filters.states ? filters.states : [];
  const preventiveBy = filters.preventiveBy ? filters.preventiveBy : [];
  const categories = filters.categories ? filters.categories : [];
  const priorities = filters.priorities ? filters.priorities : [];
  const teams = filters.teams ? filters.teams : [];
  const types = filters.types ? filters.types : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (scheduleValues && scheduleValues.length > 0) {
    filterTxt += 'Schedule : ';
    filterTxt += filterDataPdf(scheduleValues);
  }

  if (preventiveBy && preventiveBy.length > 0) {
    filterTxt += 'Performed By : ';
    filterTxt += filterDataPdf(preventiveBy);
  }

  if (categories && categories.length > 0) {
    filterTxt += 'Category : ';
    filterTxt += filterDataPdf(categories);
  }

  if (priorities && priorities.length > 0) {
    filterTxt += 'Priority : ';
    filterTxt += filterDataPdf(priorities);
  }

  if (teams && teams.length > 0) {
    filterTxt += 'Team : ';
    filterTxt += filterDataPdf(teams);
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

export function filterStringGeneratorAdminSetup(filters) {
  let filterTxt = '';
  const mainTypes = filters.statuses ? filters.statuses : [];
  const customFilters = filters.customFilters ? filters.customFilters : [];

  if (mainTypes && mainTypes.length > 0) {
    filterTxt += 'Maintenance Type : ';
    filterTxt += filterDataPdf(mainTypes);
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorTool(filters, custom) {
  const customFilters = custom.customFilters ? custom.customFilters : [];
  let filterTxt = '';
  if (filters && filters === 'yes') {
    filterTxt += 'Status : ';
    filterTxt += 'Active';
  }
  if (filters && filters === 'no') {
    filterTxt += 'Status : ';
    filterTxt += 'Inactive';
  }

  if (filters && filters !== '' && filters !== 'all' && customFilters && customFilters.length > 0) {
    filterTxt += ' | ';
  }

  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
    filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  }

  return filterTxt;
}

export function getNewTransferArray(array) {
  let transferProduts = [];
  if (array && array.length > 0) {
    transferProduts = array.map((pl) => ({
      id_new: pl.id,
    }));
  }
  return transferProduts;
}

export function getHeaderDateFormat(userResponse, type) {
  let local = '';
  const defaultTf = getFormat(type);
  if (userResponse && userResponse.data) {
    const uData = userResponse.data;
    const dateFormat = uData.lang && uData.lang.date_format ? truncatePercentageAndDateType(uData.lang.date_format, type) : defaultTf;
    local = `dddd ${dateFormat}`;
  }
  return local;
}
