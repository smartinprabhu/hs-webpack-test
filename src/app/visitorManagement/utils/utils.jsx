import React from 'react';
import { Badge } from 'reactstrap';
import visitorActions from '../data/customData.json';

export function getVisitTypeLabel(data) {
  if (visitorActions && visitorActions.visitorTypesText[data]) {
    return visitorActions.visitorTypesText[data].label;
  }
  return '';
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
      id: pl.id,
      visitor_asset_name: pl.visitor_asset_name[1],
      asset_quantity: pl.asset_quantity ? parseInt(pl.asset_quantity) : 0,
      remarks: pl.remarks ? pl.remarks : "",
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}

export function getApproveStatusColor(data) {
  if (visitorActions && visitorActions.approveStatesLabel[data]) {
    return visitorActions.approveStatesLabel[data].color;
  }
  return '';
}

export function getApproveStatusLabel(data) {
  if (visitorActions && visitorActions.approveStatesLabel[data]) {
    return visitorActions.approveStatesLabel[data].label;
  }
  return '';
}

export function getEntryStatusLabel(data) {
  if (visitorActions && visitorActions.entryStatesLabel[data]) {
    return visitorActions.entryStatesLabel[data].label;
  }
  return '';
}

export function getOriginStatusLabel(data) {
  if (visitorActions && visitorActions.originStatesLabel[data]) {
    return visitorActions.originStatesLabel[data].label;
  }
  return '';
}

export function getVisitorStateLabel(staten) {
  if (visitorActions && visitorActions.entryStatesLabel[staten]) {
    return (
      <Badge
        color={visitorActions.entryStatesLabel[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {visitorActions.entryStatesLabel[staten].label}
      </Badge>
    );
  }
  return '';
}

export function getApproveStateLabel(staten) {
  if (visitorActions && visitorActions.approveStatesLabel[staten]) {
    return (
      <Badge
        color={visitorActions.approveStatesLabel[staten].color}
        className="badge-text no-border-radius"
        pill
      >
        {visitorActions.approveStatesLabel[staten].label}
      </Badge>
    );
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

export function getChartDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data,
          label: values[i].label,
          backgroundColor: ['#8077ee', '#e31ec9', '#17a2b8', '#ff1e32', '#21ebbc', '#fdca5c', '#00be4b', '#808000', '#FFC0CB', '#ADD8E6', '#FF00FF'],
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

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

