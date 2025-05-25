/* eslint-disable radix */
import moment from 'moment-timezone';

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

export function getChartDatasets(values) {
  let result = {};
  const newLabels = [];
  const dColors = [];
  const dynamicColors = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
  };
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push(values[i].data[0]);
        newLabels.push(values[i].label);
        dColors.push(dynamicColors());
      }
    }
    const dSet = [{ data: datas, label: 'Count', backgroundColor: dColors }];
    result = {
      datasets: dSet,
      labels: newLabels,
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
        if (data[i].code !== 'TP') {
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
