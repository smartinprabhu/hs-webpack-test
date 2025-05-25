/* eslint-disable radix */
import React from 'react';
import { Badge } from 'reactstrap';
import actions from '../data/customData.json';

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
