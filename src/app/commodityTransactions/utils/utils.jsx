/* eslint-disable radix */
import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';
import mailActions from '../data/customData.json';

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data,
          label: values[i].label,
          backgroundColor: ['#8077ee', '#e31ec9', '#17a2b8', '#ff1e32', '#21ebbc', '#fdca5c', '#00be4b', '#808000', '#FFC0CB', '#ADD8E6', '#00BFFF', '#66CDAA'],
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
          data: values[i].data, label: values[i].label, backgroundColor: ['#8077ee', '#e31ec9', '#17a2b8', '#ff1e32', '#21ebbc', '#fdca5c', '#00be4b'],
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
        if (data[i].code !== 'AT') {
          count += data[i].datasets[0];
        }
      }
    }
  }
  return count;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    if (type === 'This week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('week');
      const weekEnd = currentDate.clone().endOf('week');
      daterange.push(moment(weekStart).utc().format('YYYY-MM-DD HH:mm:ss'));
      daterange.push(moment(weekEnd).utc().format('YYYY-MM-DD HH:mm:ss'));
    } else if (type === 'This month') {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(),
        date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(),
        date.getMonth(), daysInMonth(date.getMonth() + 1,
          date.getFullYear()));
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD HH:mm:ss'));
      daterange.push(moment(lastDay).add(1, 'day').utc().format('YYYY-MM-DD HH:mm:ss'));
    } else if (type === 'Today') {
      const firstDay = moment().subtract(1, 'day');
      // firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = moment();
      daterange.push(`${moment(firstDay).utc().format('YYYY-MM-DD')} 18:30:00`);
      daterange.push(`${moment(lastDay).utc().format('YYYY-MM-DD')} 18:30:00`);
    } else if (type === 'This year') {
      const firstDay = `${(new Date()).getFullYear() - 1}-12-31 23:59:59`;
      const lastDay = `${(new Date()).getFullYear()}-12-31 23:59:59`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}

export function filterStringGenerator(filters) {
  let filterTxt = '';
  const customFilters = filters.customFilters ? filters.customFilters : [];
  for (let i = 0; i < customFilters.length; i += 1) {
    if (customFilters[i].type === 'date') {
      filterTxt += `${customFilters[i].label},`;
    } else if (customFilters[i].type === 'datearray') {
      filterTxt += `${customFilters[i].label} "${customFilters[i].value[0]} - ${customFilters[i].value[1]}",`;
    } else {
      filterTxt += `${customFilters[i].label} ,`;
    }
  }
  filterTxt = filterTxt.substring(0, filterTxt.length - 1);
  return filterTxt;
}

export function getNewRequestArray(array) {
  let requestProduts = [];
  if (array && array.length > 0) {
    requestProduts = array.map((pl) => ({
      id: pl.id,
      product_id: pl.product_id_ref,
      ordered_qty: pl.ordered_qty ? parseInt(pl.ordered_qty) : 0,
      confirmed_qty: pl.confirmed_qty ? parseInt(pl.confirmed_qty) : 0,
      delivered_qty: pl.ordered_qty ? parseInt(pl.delivered_qty) : 0,
      reason_from_pantry: pl.reason_from_pantry,
      notes_from_employee: pl.notes_from_employee,
      isRemove: pl.isRemove,
    }));
  }
  return requestProduts;
}

export function groupByQuantity(array, productId, field) {
  let count = 0;
  // eslint-disable-next-line array-callback-return
  array.map((rp) => {
    if (rp.product_id && rp.product_id.id === productId) {
      count += parseInt(rp[field]);
    }
  });
  return count;
}

export function groupByOrderLines(array) {
  const orderLines = [];
  if (array && array.length > 0) {
    // eslint-disable-next-line array-callback-return
    array.map((ol) => {
      let orders = '-1';
      if (ol.product_id && ol.product_id.id) {
        orders = orderLines.findIndex((item) => (item.product_id.id === ol.product_id.id));
      }
      if (orders > -1) {
        orderLines[orders].confirmed_qty = parseInt(orderLines[orders].confirmed_qty) + parseInt(ol.confirmed_qty);
        orderLines[orders].delivered_qty = parseInt(orderLines[orders].delivered_qty) + parseInt(ol.delivered_qty);
        orderLines[orders].ordered_qty = parseInt(orderLines[orders].ordered_qty) + parseInt(ol.ordered_qty);
      } else {
        orderLines.push(ol);
      }
    });
  }
  return orderLines;
}

export function getRecipientForLabel(data) {
  if (mailActions && mailActions.recipientTypesText[data]) {
    return mailActions.recipientTypesText[data].label;
  }
  return '';
}

export function getParcelForLabel(data) {
  if (mailActions && mailActions.parcelDimensionsText[data]) {
    return mailActions.parcelDimensionsText[data].label;
  }
  return '';
}

export function getMailRoomLabel(staten) {
  if (mailActions && mailActions.stateTypesText[staten]) {
    return <Badge className={`${mailActions.stateTypesText[staten].badgeClassName} badge-text no-border-radius`} pill>{mailActions.stateTypesText[staten].label}</Badge>;
  }
  return '';
}
