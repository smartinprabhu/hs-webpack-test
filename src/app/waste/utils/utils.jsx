/* eslint-disable array-callback-return */
/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Badge } from 'reactstrap';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import complianceActions from '../data/customData.json';
import { filterDataPdf, customFilterDataArray } from '../../util/appUtils';

export function getComplianceStateColor(data) {
  if (complianceActions && complianceActions.status[data]) {
    return complianceActions.status[data].color;
  }
  return '';
}

export function getVersionStateColor(data) {
  if (complianceActions && complianceActions.versionStatus[data]) {
    return complianceActions.versionStatus[data].color;
  }
  return '';
}

export function getComplianceStateLabel(staten) {
  if (complianceActions && complianceActions.status[staten]) {
    return (
      <Badge
        color={complianceActions.status[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {complianceActions.status[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getComplianceStateText(staten) {
  if (complianceActions && complianceActions.status[staten]) {
    return complianceActions.status[staten].label;
  }
  return '';
}

export function getStatusLabel(data) {
  if (complianceActions && complianceActions.status[data]) {
    return complianceActions.status[data].label;
  }
  return '';
}

export function getVersionStatusLabel(data) {
  if (complianceActions && complianceActions.versionStatus[data]) {
    return complianceActions.versionStatus[data].label;
  }
  return '';
}

export function getAppliesToFormLabel(staten) {
  if (complianceActions && complianceActions.appliesToTypes[staten]) {
    return complianceActions.appliesToTypes[staten].label;
  }
  return '';
}

export function getRuleTypeLabel(staten) {
  if (complianceActions && complianceActions.ruleTypesList[staten]) {
    return complianceActions.ruleTypesList[staten].label;
  }
  return '';
}

export function getRepeatLabel(staten) {
  if (complianceActions && complianceActions.repeatTypes[staten]) {
    return complianceActions.repeatTypes[staten].label;
  }
  return '';
}

export function getVersionLabel(staten) {
  if (complianceActions && complianceActions.versionStatus[staten]) {
    return complianceActions.versionStatus[staten].label;
  }
  return '';
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

const checkExpiryDatewithRenewalDays = (val, nex) => {
  let expiryDate = false;
  if (val !== '' && nex !== '') {
    const renewalDate = moment(new Date()).add(val, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    if (new Date(renewalDate) < new Date(nex)) {
      expiryDate = true;
    }
  }
  return expiryDate;
};

export function getRequiredMessage(postdata) {
  let result = false;
  if (!checkExpiryDatewithRenewalDays(postdata.renewal_lead_time, postdata.next_expiry_date) && postdata.is_has_expiry) {
    result = `Next expiry date should be after ${postdata.renewal_lead_time} (Renewal Lead Time) days.`;
  }
  if (postdata.applies_to === 'Site' && !postdata.company_ids) {
    result = 'Company is required.';
  }
  if (postdata.applies_to === 'Asset' && !postdata.asset_ids) {
    result = 'Asset is required.';
  }
  if (postdata.applies_to === 'Location' && !postdata.location_ids) {
    result = 'Location is required.';
  }
  if (postdata.repeat_until === 'Ends On' && !postdata.end_date) {
    result = 'End Date is required.';
  }
  return result;
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

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data, label: values[i].label, backgroundColor: ['#00be4b', '#fdca5c', '#17a2b8', '#ff1e32', '#17a2b8', '#6f42c1', '#8077ee'],
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
