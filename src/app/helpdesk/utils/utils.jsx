/* eslint-disable no-restricted-globals */
/* eslint-disable no-redeclare */
/* eslint-disable radix */
/* eslint new-cap: ["error", { "newIsCap": false }] */
import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';

import {
  filterDataPdf, customFilterDataArray, isJsonString, getJsonString,
  getDatesOfQueryWitLocal, getCompanyTimezoneDate,
} from '../../util/appUtils';
import ticketActionData from '../data/ticketsActions.json';
import { channelJson } from '../../commonComponents/utils/util';

const getChannelLabels = (value) => {
  const match = channelJson.find((item) => item.channel === value);
  return match?.label || '-';
};

export function convertTicketFields(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((obj) => {
    const newObj = Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
        acc[key] = value;
      } else if (value && typeof value === 'object' && Object.keys(value).length > 0) {
        const { id } = value;

        if (key === 'category_id') {
          acc[key] = [id, value.cat_display_name || value.name];
        } else if (key === 'sub_category_id') {
          acc[key] = [id, value.sub_cat_display_name || value.name];
        } else if (key === 'asset_id' || key === 'equipment_location_id') {
          acc[key] = [id, value.path_name];
        } else {
          acc[key] = [id, value.name];
        }
      } else if (key === 'close_time') {
        acc[key] = value;
      } else if (key === 'channel') {
        acc[key] = getChannelLabels(value);
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});

    // Functional fallback for empty `requestee_id`
    return {
      ...newObj,
      requestee_id:
        newObj.requestee_id
        && typeof newObj.requestee_id === 'object'
        && Object.keys(newObj.requestee_id).length === 0
          ? newObj.person_name
          : newObj.requestee_id,
    };
  });
}

export function getTicketStateLabel(staten) {
  if (ticketActionData && ticketActionData.states[staten]) {
    return <Badge color={ticketActionData.states[staten].color} className="badge-text no-border-radius" pill>{ticketActionData.states[staten].text}</Badge>;
  }
  return '';
}

export function getIncidentStateLabel(staten) {
  if (ticketActionData && ticketActionData.incidentStatesLabel[staten]) {
    return <Badge color={ticketActionData.incidentStatesLabel[staten].color} className="badge-text no-border-radius" pill>{ticketActionData.incidentStatesLabel[staten].text}</Badge>;
  }
  return '';
}

export function getTicketStateFormLabel(staten) {
  if (ticketActionData && ticketActionData.states[staten]) {
    return <Badge color={ticketActionData.states[staten].color} className="badge-text pr-2 pl-2 pb-1 mr-2">{ticketActionData.states[staten].text}</Badge>;
  }
  return '';
}

export function getTicketStatText(staten, isCancelled) {
  if (ticketActionData && ticketActionData.states[staten]) {
    return <span className={`text-${ticketActionData.states[isCancelled ? 'Cancelled' : staten].color} font-weight-700`}>{ticketActionData.states[isCancelled ? 'Cancelled' : staten].text}</span>;
  }
  return '';
}

export function getIncidentStatText(staten) {
  if (ticketActionData && ticketActionData.incidentStatesLabel[staten]) {
    return <span className={`text-${ticketActionData.incidentStatesLabel[staten].color} font-weight-700`}>{ticketActionData.incidentStatesLabel[staten].text}</span>;
  }
  return '';
}

export function getTicketStateFormText(staten) {
  if (ticketActionData && ticketActionData.states[staten]) {
    return ticketActionData.states[staten].text;
  }
  return '';
}

export function getTicketOrderStateText(staten) {
  if (ticketActionData && ticketActionData.mroStatesLabel[staten]) {
    return ticketActionData.mroStatesLabel[staten].text;
  }
  return '';
}

export function getIssueTypeName(staten) {
  if (staten && ticketActionData && ticketActionData.issueTypesLabels[staten]) {
    return ticketActionData.issueTypesLabels[staten].label;
  }
  return '';
}

export function getTicketChannelFormLabel(staten) {
  if (staten && ticketActionData && ticketActionData.channel[staten]) {
    return ticketActionData.channel[staten].label;
  }
  return '';
}

export function getMTLabel(staten) {
  if (ticketActionData && ticketActionData.maintenanceType[staten]) {
    return ticketActionData.maintenanceType[staten].label;
  }
  return '';
}

export function getIssueTypeLabel(staten) {
  if (ticketActionData && ticketActionData.issueTypesLabels[staten]) {
    return ticketActionData.issueTypesLabels[staten].label;
  }
  return '';
}

export function getInjuriyTypeLabel(staten) {
  if (ticketActionData && ticketActionData.incidentStatusLabel[staten]) {
    return ticketActionData.incidentStatusLabel[staten].label;
  }
  return '';
}

export function getDamageTypeLabel(staten) {
  if (ticketActionData && ticketActionData.damageStatusLabel[staten]) {
    return ticketActionData.damageStatusLabel[staten].label;
  }
  return '';
}

export function getChannelLabel(staten) {
  if (ticketActionData && ticketActionData.channelLabels[staten]) {
    return ticketActionData.channelLabels[staten].label;
  }
  return '';
}

export function getEscalationLabel(staten) {
  if (ticketActionData && ticketActionData.escalationLabels[staten]) {
    return ticketActionData.escalationLabels[staten].label;
  }
  return '';
}

export function getSLALabel(staten) {
  if (ticketActionData && ticketActionData.slastatuses[staten]) {
    return <span className={`text-${ticketActionData.slastatuses[staten].color} font-weight-800`}>{ticketActionData.slastatuses[staten].text}</span>;
  }
  return <span className="text-warning font-weight-800">No SLA</span>;
}

export function getSLATimeClosedReport(dueDate, closeDate) {
  if (!dueDate || !closeDate) {
    return '';
  }

  const d = moment.utc(dueDate).local().format();
  const dateFuture = new Date(d);

  const dateCurrent = new Date(moment.utc(closeDate).local().format());

  const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

  const totalSeconds = Math.abs(diffTime);

  const days = totalSeconds / 86400;
  const temp1 = totalSeconds % 86400;
  const hours = temp1 / 3600;
  const temp2 = temp1 % 3600;
  const minutes = temp2 / 60;

  if (Math.floor(days) > 0) {
    return `${Math.floor(days)} Days ${Math.floor(hours)} Hours ${Math.floor(minutes)} Minutes`;
  }
  if (Math.floor(hours) > 0) {
    return `${Math.floor(hours)} Hours ${Math.floor(minutes)} Minutes`;
  }

  return Math.floor(minutes) > 0 ? `${Math.floor(minutes)} Minutes` : '';
}

export function getSLALabelIcon(staten) {
  if (ticketActionData && ticketActionData.slastatuses[staten]) {
    return (
      <span className={`text-${ticketActionData.slastatuses[staten].color} font-11px font-10px font-weight-800`}>
        <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
        {ticketActionData.slastatuses[staten].text}
      </span>
    );
  }
  return (
    <span className="text-warning font-11px font-10px font-weight-800">
      {' '}
      <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
      {' '}
      No SLA
    </span>
  );
}

// export function getTimeFromFloat(decimalTimeString) {
//   let isimagine = '';
//   let result;
//   let decimalValue = decimalTimeString;
//   if (decimalValue < 0) {
//     decimalValue = Math.abs(decimalValue);
//     isimagine = '-';
//   }
//   let decimalTime = parseFloat(decimalValue);
//   decimalTime = decimalTime * 60 * 60;
//   let hours = Math.floor((decimalTime / (60 * 60)));
//   decimalTime -= (hours * 60 * 60);
//   let minutes = Math.floor((decimalTime / 60));

//   if (hours < 10) {
//     hours = `0${hours}`;
//   }
//   if (minutes < 10) {
//     minutes = `0${minutes}`;
//   }
//   if (hours === '00' && minutes === '00') {
//     result = '';
//   } else {
//     result = `${isimagine}${hours}H ${minutes}M`;
//   }
//   return result;
// }

export function getTimeFromFloat(decimalTimeString) {
  let isimagine = '';
  let result;
  let decimalValue = decimalTimeString;
  if (decimalValue < 0) {
    decimalValue = Math.abs(decimalValue);
    isimagine = '-';
  }
  let decimalTime = parseFloat(decimalValue);
  decimalTime = decimalTime * 60 * 60;
  let hours = Math.floor((decimalTime / (60 * 60)));
  decimalTime -= (hours * 60 * 60);
  let minutes = Math.round((decimalTime / 60));
  if (isNaN(hours) && isNaN(minutes)) {
    return '-';
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours === '00' && minutes === '00') {
    result = '';
  } else {
    result = `${isimagine}${hours}H`;
    if (minutes !== '00') {
      result += ` ${minutes} Mins`;
    }
    if (hours === '00') {
      result = `${isimagine}${minutes} Mins`;
    } else {
      result = `${isimagine}${hours}H`;
      if (minutes !== '00') {
        result += ` ${minutes} Mins`;
      }
    }
  }
  return result;
}

export function getSLATime(status, date) {
  if (status === 'Closed') {
    return '';
  }

  if (!date) {
    return '';
  }

  const d = moment.utc(date).local().format();
  const dateFuture = new Date(d);

  const dateCurrent = new Date();

  const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

  const totalSeconds = Math.abs(diffTime);

  const days = totalSeconds / 86400;
  const temp1 = totalSeconds % 86400;
  const hours = temp1 / 3600;
  const temp2 = temp1 % 3600;
  const minutes = temp2 / 60;

  if (Math.floor(days) > 0) {
    return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
  }
  if (Math.floor(hours) > 0) {
    return `${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
  }

  return `${Math.floor(minutes)} Mins`;
}

export function getSLAStatusCheck(date) {
  let res = '';
  if (date) {
    const d = moment.utc(date).local().format();
    const dateFuture = new Date(d);

    const dateCurrent = new Date();

    if (dateCurrent > dateFuture) {
      res = 'Elapsed since';
    } else if (dateFuture > dateCurrent) {
      res = 'Time remains';
    }
  }

  return res;
}

export function getSLATimeClosed(dueDate, closeDate) {
  if (!dueDate || !closeDate) {
    return '';
  }

  const d = moment.utc(dueDate).local().format();
  const dateFuture = new Date(d);

  const dateCurrent = new Date(moment.utc(closeDate).local().format());

  const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

  const totalSeconds = Math.abs(diffTime);

  const days = totalSeconds / 86400;
  const temp1 = totalSeconds % 86400;
  const hours = temp1 / 3600;
  const temp2 = temp1 % 3600;
  const minutes = temp2 / 60;

  if (Math.floor(days) > 0) {
    return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
  }
  if (Math.floor(hours) > 0) {
    return `${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
  }

  return `${Math.floor(minutes)} Mins`;
}

export function getSLAStatusCheckClose(dueDate, closeDate) {
  let res = '';
  if (dueDate && closeDate) {
    const d = moment.utc(dueDate).local().format();
    const dateFuture = new Date(d);

    const dateCurrent = new Date(moment.utc(closeDate).local().format());

    if (dateCurrent > dateFuture) {
      res = 'Elapsed';
    } else if (dateFuture > dateCurrent) {
      res = 'Closed before';
    }
  }

  return res;
}

export function getTicketPriorityLabel(staten) {
  if (ticketActionData && ticketActionData.priorities[staten]) {
    return (
      <span className={`text-${ticketActionData.priorities[staten].color}`}>
        {ticketActionData.priorities[staten].text}
      </span>
    );
  }
  return '';
}

export function getTicketPriorityColor(staten) {
  if (ticketActionData && ticketActionData.priorities[staten]) {
    return ticketActionData.priorities[staten].color;
  }
  return '';
}

export function getTicketPriorityText(staten) {
  if (ticketActionData && ticketActionData.priorityTypes[staten]) {
    return ticketActionData.priorityTypes[staten].label;
  }
  return '';
}

export function getTicketPriorityFormLabel(staten) {
  if (ticketActionData && ticketActionData.priorities[staten]) {
    return <Badge className={ticketActionData.priorities[staten].classPriority}>{ticketActionData.priorities[staten].text}</Badge>;
  }
  return '';
}

export function getPercentage(total, given) {
  const totalVal = parseInt(total);
  const givenVal = parseInt(given);
  let perc = 0;
  // eslint-disable-next-line no-restricted-globals
  if (!(isNaN(totalVal) || isNaN(givenVal))) {
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

export function getDocuments(data) {
  const array = [];
  const mimeTypesAllowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (!mimeTypesAllowed.includes(data[i].mimetype)) {
        array.push(data[i]);
      }
    }
  }
  return array;
}

export function getImages(data) {
  const array = [];
  const mimeTypesAllowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (mimeTypesAllowed.includes(data[i].mimetype)) {
        array.push(data[i]);
      }
    }
  }
  return array;
}

const getTicketCount = (dataset) => {
  const tCount = dataset.reduce((a, b) => a + b, 0);
  return tCount;
};

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

export function getDatasets(values, type) {
  let result = {};
  if (values) {
    const datas = [];
    const names = [];
    const color = [];
    if (type === 'ks_bar_chart') {
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].label !== 'False') {
          datas.push(getTicketCount(values[i].data));
          names.push(values[i].label);
          color.push(getColor(i));
        }
      }
    } else if (type === 'ks_list_view') {
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].data && values[i].data.length) {
          datas.push(values[i].data[1] ? values[i].data[1] : 0);
          names.push(values[i].data[0] ? values[i].data[0] : '');
          color.push(getColor(i));
        }
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
  const statusValues = filters && filters.states ? filters.states : [];
  const categories = filters && filters.categories ? filters.categories : [];
  const subCategory = filters && filters.subCategory ? filters.subCategory : [];
  const priorities = filters && filters.priorities ? filters.priorities : [];
  const customFilters = filters && filters.customFilters ? filters.customFilters : [];
  const maintenanceTeam = filters && filters.maintenanceTeam ? filters.maintenanceTeam : [];
  const company = filters && filters.company ? filters.company : [];
  const region = filters && filters.region ? filters.region : [];

  if (statusValues && statusValues.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(statusValues);
  }

  if (categories && categories.length > 0) {
    filterTxt += 'Category : ';
    filterTxt += filterDataPdf(categories);
  }
  if (subCategory && subCategory.length > 0) {
    filterTxt += 'Sub Category : ';
    filterTxt += filterDataPdf(subCategory);
  }

  if (priorities && priorities.length > 0) {
    filterTxt += 'Priority : ';
    filterTxt += filterDataPdf(priorities);
  }
  if (maintenanceTeam && maintenanceTeam.length > 0) {
    filterTxt += 'Maintenance Team : ';
    filterTxt += filterDataPdf(maintenanceTeam);
  }
  if (region && region.length > 0) {
    filterTxt += 'Region : ';
    filterTxt += filterDataPdf(region);
  }
  if (company && company.length > 0) {
    filterTxt += 'Company : ';
    filterTxt += filterDataPdf(company);
  }
  if (customFilters && customFilters.length > 0) {
    filterTxt += customFilterDataArray(customFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorReport(filters) {
  let filterTxt = '';
  const statusValues = filters && filters.states ? filters.states : [];
  const categories = filters && filters.categories ? filters.categories : [];
  const subCategory = filters && filters.subCategory ? filters.subCategory : [];
  const priorities = filters && filters.priorities ? filters.priorities : [];
  const customFilters = filters && filters.customFilters ? filters.customFilters : [];
  const maintenanceTeam = filters && filters.maintenanceTeam ? filters.maintenanceTeam : [];
  const company = filters && filters.company ? filters.company : [];
  const region = filters && filters.region ? filters.region : [];

  if (statusValues && statusValues.length > 0) {
    filterTxt += 'Status : ';
    filterTxt += filterDataPdf(statusValues);
  }

  if (categories && categories.length > 0) {
    filterTxt += 'Category : ';
    filterTxt += filterDataPdf(categories);
  }
  if (subCategory && subCategory.length > 0) {
    filterTxt += 'Sub Category : ';
    filterTxt += filterDataPdf(subCategory);
  }

  if (priorities && priorities.length > 0) {
    filterTxt += 'Priority : ';
    filterTxt += filterDataPdf(priorities);
  }
  if (maintenanceTeam && maintenanceTeam.length > 0) {
    filterTxt += 'Maintenance Team : ';
    filterTxt += filterDataPdf(maintenanceTeam);
  }
  if (region && region.length > 0) {
    filterTxt += 'Region : ';
    filterTxt += filterDataPdf(region);
  }
  if (company && company.length > 0) {
    filterTxt += 'Company : ';
    filterTxt += filterDataPdf(company);
  }
  if (customFilters && customFilters.length > 0) {
    const cFilters = customFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate');
    filterTxt += customFilterDataArray(cFilters);
  }

  filterTxt = filterTxt.substring(0, filterTxt.length - 2);
  return filterTxt;
}

export function filterStringGeneratorDateReport(filters, companyTimeZone, userInfo) {
  let filterTxt = '';
  const customFilters = filters && filters.customFilters ? filters.customFilters : [];
  if (customFilters && customFilters.length > 0) {
    const cFiltersDate = customFilters.filter((item) => item.type === 'date' || item.type === 'customdate');
    if (cFiltersDate && cFiltersDate.length > 0) {
      if (cFiltersDate[0].type === 'date') {
        const dates = getDatesOfQueryWitLocal(cFiltersDate[0].value, companyTimeZone);
        if (dates && dates.length) {
          filterTxt = `From: ${getCompanyTimezoneDate(dates[0], userInfo, 'date')}  To: ${getCompanyTimezoneDate(dates[1], userInfo, 'date')}`;
        }
      } else if (cFiltersDate[0].type === 'customdate' && cFiltersDate[0].start && cFiltersDate[0].end) {
        filterTxt = `From: ${getCompanyTimezoneDate(cFiltersDate[0].start, userInfo, 'date')}  To: ${getCompanyTimezoneDate(cFiltersDate[0].end, userInfo, 'date')}`;
      }
    } else {
      filterTxt = 'All Time';
    }
  } else {
    filterTxt = 'All Time';
  }
  return filterTxt;
}

export function filterStringGeneratorDateTempReport(filters, companyTimeZone, userInfo) {
  let filterTxt = '';
  const customFilters = filters && filters.length ? filters : [];
  console.log(customFilters);
  if (customFilters && customFilters.length > 0) {
    const cFiltersDate = customFilters.filter((item) => item.type === 'date' || item.type === 'customdate');
    if (cFiltersDate && cFiltersDate.length > 0) {
      if (cFiltersDate[0].type === 'date') {
        const dates = getDatesOfQueryWitLocal(cFiltersDate[0].value, companyTimeZone);
        if (dates && dates.length) {
          filterTxt = `From: ${getCompanyTimezoneDate(dates[0], userInfo, 'date')}  To: ${getCompanyTimezoneDate(dates[1], userInfo, 'date')}`;
        }
      } else if (cFiltersDate[0].type === 'customdate' && cFiltersDate[0].start && cFiltersDate[0].end) {
        filterTxt = `From: ${getCompanyTimezoneDate(cFiltersDate[0].start, userInfo, 'date')}  To: ${getCompanyTimezoneDate(cFiltersDate[0].end, userInfo, 'date')}`;
      }
    } else {
      filterTxt = 'All Time';
    }
  } else {
    filterTxt = 'All Time';
  }
  return filterTxt;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getfilterObj(raw) {
  const allowed = ['id', 'name'];
  const data = [];
  for (let i = 0; i < raw.length; i += 1) {
    const filtered = Object.keys(raw[i])
      .filter((key) => allowed.includes(key))
      .reduce((obj, key) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = raw[i][key];
        return obj;
      }, {});
    data.push(filtered);
  }
  return data;
}

function addChildrenSpace(data, parentId) {
  let children = [];
  const filterData = data.filter((space) => space.parent_id && space.parent_id[0] === parentId && space.asset_category_id[1] !== 'Building');
  if (filterData && filterData.length > 0) {
    children = filterData.map((space) => ({
      id: space.id,
      name: space.space_name,
      type: space.asset_category_id[1],
      children: space.parent_id[0] && addChildrenSpace(data, space.id),
    }));
  }
  return children;
}

export function getSpaceChildLocations(spaces) {
  let cascaderViewData = [];
  if (spaces.length > 0) {
    const spacefilterData = spaces.filter((space) => space.asset_category_id[1] === 'Building');
    if (spacefilterData && spacefilterData.length > 0) {
      cascaderViewData = spacefilterData.map((space) => ({
        id: space.id,
        name: space.space_name,
        type: space.asset_category_id[1],
        children: addChildrenSpace(spaces, space.id),
      }));
    }
  }
  return cascaderViewData;
}

export function addParents(data) {
  let children = [];
  const filterData = data && data.length ? data : [];
  if (filterData.length) {
    children = filterData.map((space) => (
      {
        id: space.id,
        name: space.space_name,
        space_name: space.space_name,
        childs: space.child_ids,
        parent_id: space.parent_id,
        type: space.asset_category_id ? space.asset_category_id[1] : '',
        typeId: space.asset_category_id ? space.asset_category_id[0] : '',
        path_name: space.path_name,
        err: space.error ? space.error : '',
        isLeaf: false,
      }));
  }
  return children;
}

export function addChildParents(data) {
  let children = [];
  const filterData = data && data.length ? data : [];
  if (filterData.length) {
    children = filterData.map((space) => (
      {
        id: space.id,
        treeNodeId: `${space.id}`,
        name: space.name,
        children: space.child?.length ? addChildParents(space.child) : undefined,
        space_name: space.name,
        childs: space.child,
        parent_id: space.parent && space.parent.id ? space.parent.id : '',
        isLeaf: false,
        type: space.space_category && space.space_category.name ? space.space_category.name : '',
        typeId: space.space_category && space.space_category.id ? space.space_category.id : '',
        path_name: space.path_name,
        err: space.error ? space.error : '',
      }));
  }
  return children;
}

export function addChildrens(parents, data, parentId) {
  const reDefinedData = parents;
  if (parentId) {
    const index = reDefinedData.findIndex((obj) => (obj.id === parentId));
    if ((reDefinedData[index]) && (!reDefinedData[index].parentId)) {
      reDefinedData[index].children = data?.length ? addChildParents(data) : undefined;
    }
  }

  return reDefinedData;
}

function addChildrenSpacePublic(data, parentId) {
  let children = [];
  const filterData = data.filter((space) => space.parent_id && space.parent_id.id === parentId && space.category_id && space.category_id.name !== 'Building');
  if (filterData && filterData.length > 0) {
    children = filterData.map((space) => ({
      id: space.id,
      name: space.name,
      type: space.category_id.name,
      category_id: space.category_id.id,
      children: space.parent_id && space.parent_id.id && addChildrenSpacePublic(data, space.id),
    }));
  }
  return children;
}

export function getSpaceChildLocationsPublic(spaces) {
  let cascaderViewData = [];
  if (spaces.length > 0) {
    const spacefilterData = spaces.filter((space) => space && space.category_id && space.category_id.name === 'Building');
    if (spacefilterData && spacefilterData.length > 0) {
      cascaderViewData = spacefilterData.map((space) => ({
        id: space.id,
        name: space.name,
        type: space.category_id.name,
        category_id: space.category_id.id,
        children: addChildrenSpacePublic(spaces, space.id),
      }));
    }
  }
  return cascaderViewData;
}

export function getTypeLabel(data) {
  if (ticketActionData && ticketActionData.type[data]) {
    return ticketActionData.type[data].label;
  }
  return '';
}

export function getSpaceValue(data, spaceCascader) {
  let name = '';
  for (let i = 0; i < data.length; i += 1) {
    const assetid = data[i];
    for (let j = 0; j < spaceCascader.length; j += 1) {
      if (assetid === spaceCascader[j].id) {
        name += spaceCascader[j].name;
      }
      if (spaceCascader[j] && spaceCascader[j].children && spaceCascader[j].children.length > 0) {
        for (let k = 0; k < spaceCascader[j].children.length; k += 1) {
          if (assetid === spaceCascader[j].children[k].id) {
            name += ` / ${spaceCascader[j].children[k].name}`;
          }
          if (spaceCascader[j] && spaceCascader[j].children && spaceCascader[j].children[k].children && spaceCascader[j].children[k].children.length > 0) {
            for (let m = 0; m < spaceCascader[j].children[k].children.length; m += 1) {
              if (assetid === spaceCascader[j].children[k].children[m].id) {
                name += ` / ${spaceCascader[j].children[k].children[m].name}`;
              }
              if (spaceCascader[j].children[k].children[m].children.length > 0) {
                for (let n = 0; n < spaceCascader[j].children[k].children[m].children.length; n += 1) {
                  if (assetid === spaceCascader[j].children[k].children[m].children[n].id) {
                    name += ` / ${spaceCascader[j].children[k].children[m].children[n].name}`;
                  }
                  if (spaceCascader[j].children[k].children[m].children[n].children.length > 0) {
                    for (let p = 0; p < spaceCascader[j].children[k].children[m].children[n].children.length; p += 1) {
                      if (assetid === spaceCascader[j].children[k].children[m].children[n].children[p].id) {
                        name += ` / ${spaceCascader[j].children[k].children[m].children[n].children[p].name}`;
                      }
                      if (spaceCascader[j].children[k].children[m].children[n].children[p].children.length > 0) {
                        for (let q = 0; q < spaceCascader[j].children[k].children[m].children[n].children[p].children.length; q += 1) {
                          if (assetid === spaceCascader[j].children[k].children[m].children[n].children[p].children[q].id) {
                            name += ` / ${spaceCascader[j].children[k].children[m].children[n].children[p].children[q].name}`;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return name;
}

export function checkInjuries(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if ((arrayNew[i].name) && (arrayNew[i].organization) && (arrayNew[i].nature_of_injury)) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function checkDamages(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if ((arrayNew[i].name) && (arrayNew[i].owned_by) && (arrayNew[i].nature_extent_damage)) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function checkActionAllowed(actionName, ticketDetail, isIncident) {
  let allowed = true;
  const whState = getTicketStateFormText(ticketDetail.data[0].state_id ? ticketDetail.data[0].state_id[1] : '');
  const inState = ticketDetail.data[0].incident_state ? ticketDetail.data[0].incident_state : '';
  const woState = ticketDetail.data[0].mro_state ? ticketDetail.data[0].mro_state : '';
  const isCancelled = ticketDetail.data[0].is_cancelled;
  if (!isIncident) {
    if (actionName === 'Escalate Ticket' && (whState === 'Closed')) {
      allowed = false;
    }
    if (actionName === 'Reassign Ticket' && (whState === 'Closed')) {
      allowed = false;
    }
    if (actionName === 'Send Message' && (whState === 'Closed')) {
      allowed = false;
    }
    if (actionName === 'Close Ticket' && (whState === 'Closed')) {
      allowed = false;
    }
    if (actionName === 'Cancel Ticket' && (whState === 'Closed' || isCancelled)) {
      allowed = false;
    }
    if (actionName === 'Put On-Hold' && (whState === 'Closed' || whState === 'On Hold')) {
      allowed = false;
    }
    if (actionName === 'Move to In Progress' && ((whState === 'Open' && woState) || whState === 'Closed' || whState === 'In Progress')) {
      allowed = false;
    }
  } else {
    if (actionName === 'Escalate Ticket' && (whState === 'Closed' || inState === 'Resolved')) {
      allowed = false;
    }
    if (actionName === 'Reassign Ticket' && (whState === 'Closed' || inState === 'Resolved')) {
      allowed = false;
    }
    if (actionName === 'Send Message' && (whState === 'Closed' || inState === 'Resolved')) {
      allowed = false;
    }
    if (actionName === 'Start Assessment' && (inState === 'Assess In Progress' || inState === 'Resolved' || inState === 'Remediate' || inState === 'Remediate In Progress' || inState === 'Assess')) {
      allowed = false;
    }
    if (actionName === 'Finish Assessment' && (inState === 'Resolved' || inState === 'Remediate'
      || inState === 'Report' || inState === 'Remediate In Progress' || inState === 'Assess')) {
      allowed = false;
    }
    if (actionName === 'Start Remediation' && (inState === 'Report' || inState === 'Resolved'
      || inState === 'Assess In Progress' || inState === 'Remediate' || inState === 'Remediate In Progress')) {
      allowed = false;
    }
    if (actionName === 'Finish Remediation' && (inState === 'Resolved' || inState === 'Assess In Progress' || inState === 'Report' || inState === 'Assess' || inState === 'Remediate')) {
      allowed = false;
    }
    if (actionName === 'Report Part A' && (inState === 'Assess In Progress' || inState === 'Resolved' || inState === 'Remediate In Progress' || inState === 'Report' || inState === 'Remediate')) {
      allowed = false;
    }
    if (actionName === 'Report Part B' && (inState === 'Assess In Progress' || inState === 'Remediate In Progress' || inState === 'Assess')) {
      allowed = false;
    }
  }
  return allowed;
}
export function getAge(dueDate, closeDate) {
  const d = moment.utc(dueDate).local().format();
  const dateFuture = new Date(d);

  const dateCurrent = closeDate && closeDate !== '' ? new Date(moment.utc(closeDate).local().format()) : new Date();

  const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

  const totalSeconds = Math.abs(diffTime);

  const days = totalSeconds / 86400;
  const temp1 = totalSeconds % 86400;
  const hours = temp1 / 3600;
  const temp2 = temp1 % 3600;
  const minutes = temp2 / 60;

  if (Math.floor(days) > 0) {
    return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
  }
  if (Math.floor(hours) > 0) {
    return `${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
  }

  return `${Math.floor(minutes)} Mins`;
}

export function getTemplateData(data) {
  let res = [];
  if (data && data.length > 0) {
    res = data.map((item) => ({
      id: item.id,
      data_name: item.name,
      name: isJsonString(item.custom_fields) && getJsonString(item.custom_fields).template_name ? getJsonString(item.custom_fields).template_name : item.name,
    }));
  }
  return res;
}

export function getTemplateSelectedFields(data, tempName) {
  const isFieldFilters = tempName && data && data.length ? data.filter((cFilter) => cFilter.custom_fields && isJsonString(cFilter.custom_fields) && getJsonString(cFilter.custom_fields).template_name && getJsonString(cFilter.custom_fields).template_name === tempName) : [];
  let res = '';
  if (isFieldFilters && isFieldFilters.length > 0) {
    const tempFields = isFieldFilters[0].custom_fields && isJsonString(isFieldFilters[0].custom_fields) && getJsonString(isFieldFilters[0].custom_fields) && getJsonString(isFieldFilters[0].custom_fields).field_mappings ? getJsonString(isFieldFilters[0].custom_fields).field_mappings : [];
    for (let i = 0; i < tempFields.length; i += 1) {
      if (tempFields[i].headerName !== '') {
        res += `${tempFields[i].headerName},`;
      }
    }
    res = res.substring(0, res.length - 1);
  }
  return res;
}
