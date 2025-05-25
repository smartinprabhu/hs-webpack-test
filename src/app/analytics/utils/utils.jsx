import moment from 'moment-timezone';

export function getDatasets(values, labels) {
  let result = {};
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
        datas.push({
          data: values[i].data, label: values[i].label, backgroundColor: dynamicColors(),
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

export function getDatesOfQuery(type) {
  let daterange = [];
  try {
    if (type === 'This week') {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf('week');
      const weekEnd = currentDate.clone().endOf('week');
      daterange.push(moment(weekStart).utc().format('YYYY-MM-DD'));
      daterange.push(moment(weekEnd).utc().format('YYYY-MM-DD'));
    } else if (type === 'This month') {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(),
        date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(),
        date.getMonth(), daysInMonth(date.getMonth() + 1,
          date.getFullYear()));
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'Today') {
      let firstDay = new Date();
      firstDay = firstDay.setDate(firstDay.getDate() - 1);
      const lastDay = new Date();
      daterange.push(moment(firstDay).utc().format('YYYY-MM-DD'));
      daterange.push(moment(lastDay).utc().format('YYYY-MM-DD'));
    } else if (type === 'This year') {
      const firstDay = `${(new Date()).getFullYear()}-01-01`;
      const lastDay = `${(new Date()).getFullYear()}-12-31`;
      daterange.push(firstDay);
      daterange.push(lastDay);
    }
  } catch (e) {
    daterange = [];
  }
  return daterange;
}
