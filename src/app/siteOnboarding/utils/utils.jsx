/* eslint-disable array-callback-return */
/* eslint-disable new-cap */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Badge } from 'reactstrap';
import 'jspdf-autotable';
import complianceActions from '../data/customData.json';
import actionsPPM from '../siteDetails/preventiveMaintenance/data/customData.json';
import helpdeskAction from '../siteDetails/helpdesk/data/customData.json';
import customData from '../siteDetails/inventory/data/customData.json';

export function getSiteStateLabel(staten) {
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

export function getStatusOfModules(array) {
  let result = false;
  const value = array && array.data && array.data.length ? array.data : false;
  if (value) {
    const arrayNew = value.filter((item) => item.state !== 'Done');
    if (arrayNew && arrayNew.length > 0) {
      result = true;
    }
  }
  return result;
}

export function getStatusLabel(data) {
  if (complianceActions && complianceActions.status[data]) {
    return complianceActions.status[data].label;
  }
  return '';
}

export function getAccessLabel(data) {
  if (actionsPPM && actionsPPM.randomText[data]) {
    return actionsPPM.randomText[data].label;
  }
  return '';
}

export function getNewOnBoardArray(array) {
  let onBoard = [];
  if (array && array.length > 0) {
    onBoard = array.map((pl) => ({
      id: pl.hx_onboard_module_id && pl.hx_onboard_module_id.id ? pl.hx_onboard_module_id.id : '',
      name: pl.hx_onboard_module_id && pl.hx_onboard_module_id.name ? pl.hx_onboard_module_id.name : '',
    }));
  }
  return onBoard;
}

export function getDefinitonByLabel(value) {
  let res = '';
  if (complianceActions && complianceActions.definitionList[value]) {
    if (complianceActions.definitionList[value].label && complianceActions.definitionList[value].label !== '') {
      res += complianceActions.definitionList[value].label;
      res += ' - ';
    }
    res += complianceActions.definitionList[value].definition;
  }

  return res;
}

export function checkPrirority(array) {
  let result = false;
  let count = 0;
  const arrayNew = array.filter((item) => !item.isRemove);
  for (let i = 0; i < arrayNew.length; i += 1) {
    if ((arrayNew[i].priority && arrayNew[i].priority !== '' && arrayNew[i].name && arrayNew[i].name !== '')) {
      count += 1;
    }
  }
  result = count === arrayNew.length;
  return result;
}

export function typeCtegoryLabelFunction(staten) {
  if (helpdeskAction && helpdeskAction.typePCGs[staten]) {
    return helpdeskAction.typePCGs[staten].label;
  }
  return '';
}

export function getEscalationTypeName(staten) {
  if (helpdeskAction && helpdeskAction.categoryTypeText[staten]) {
    return helpdeskAction.categoryTypeText[staten].label;
  }
  return '';
}

export function getRequestLabel(value) {
  let res = '';
  if (customData && customData.stateText[value]) {
    res = customData.stateText[value].label;
  }

  return res;
}

export function getTypeLabel(value) {
  let res = '';
  if (customData && customData.typeText[value]) {
    res = customData.typeText[value].label;
  }

  return res;
}
