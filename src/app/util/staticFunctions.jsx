/* eslint-disable no-restricted-globals */
/* eslint-disable no-var */
/* eslint-disable no-redeclare */
/* eslint-disable no-restricted-properties */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable radix */
import React from 'react';

export function getTotalArrayValue(array, field) {
  let result = 0;
  let res = '';
  if (array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][field]) {
        result += array[i][field];
      }
    }
    if (result !== 0) {
      res = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return res;
  }
  return '';
}
export function getDifferenceInDays(date) {
  // round to the nearest whole number
  if (date !== '' && date != null && date !== false) {
    const date1 = new Date(date);

    const date3 = new Date();
    const year = date3.getFullYear();
    const month = (date3.getMonth() + 1);
    const day = date3.getDate();
    const strTime = `${year}-${month}-${day}`;

    const date2 = new Date(strTime);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return '';
}

export function getCompanyIds(companyarray) {
  let ids = '';
  if (companyarray.length > 0) {
    for (let i = 0; i < companyarray.length; i += 1) {
      if (companyarray[i].id !== '') {
        ids += `${companyarray[i].id},`;
      }
    }
    ids = ids.substring(0, ids.length - 1);
  }
  return ids;
}

export function addzero(day) {
  let temp = `${day}`;
  if (temp.length === 1) {
    temp = `0${temp}`;
    return temp;
  }

  return temp;
}

export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  const size = Math.round(bytes / 1024 ** i);
  const mes = sizes[i];
  if (parseInt(size) > 20 && mes === 'MB') {
    return false;
  }

  return true;
}

export function bytesToSizeLow(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  const size = Math.round(bytes / 1024 ** i);
  const mes = sizes[i];
  if (parseInt(size) > 5 && mes === 'MB') {
    return false;
  }

  return true;
}

export function bytesToSizeTooLow(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  const size = Math.round(bytes / 1024 ** i);
  const mes = sizes[i];
  if (parseInt(size) > 2 && mes === 'MB') {
    return false;
  }

  return true;
}

export function newpercalculate(total, given) {
  total = parseInt(total);
  given = parseInt(given);
  var perc = '';

  if (isNaN(total) || isNaN(given)) {
    perc = 0;
  } else {
    perc = ((given / total) * 100);
  }

  if (isNaN(perc)) {
    perc = 0.00;
  } else {
    perc = parseFloat(perc).toFixed(2);
  }

  return perc;
}

export function newpercalculateGoal(total, given) {
  total = parseInt(total);
  given = parseInt(given);
  var perc = '';

  if (!total || isNaN(total) || isNaN(given)) {
    perc = 0;
  } else {
    const diffValue = (total - given);
    perc = ((diffValue / total) * 100);
  }

  if (isNaN(perc)) {
    perc = 0.00;
  } else {
    perc = parseFloat(Math.abs(perc)).toFixed(2);
  }

  return perc;
}

export function newpercalculateGoalReports(total, given) {
  total = parseInt(total);
  given = parseInt(given);
  var perc = '';

  if (!total || isNaN(total) || isNaN(given)) {
    perc = 0;
  } else {
    const diffValue = (total - given);
    perc = ((diffValue / total) * 100);
  }

  if (isNaN(perc)) {
    perc = 0.00;
  } else {
    perc = !total ? 100.00 : parseFloat(Math.abs(perc)).toFixed(2);
  }

  return perc;
}

export function newpercalculatePrev(startValue, endValue) {
  startValue = parseInt(startValue);
  endValue = parseInt(endValue);
  let perc = '';

  if (isNaN(startValue) || isNaN(endValue)) {
    perc = 0;
  } else if (!startValue) {
    perc = 100;
  } else {
    const diffValue = (endValue - startValue);
    perc = ((diffValue / startValue) * 100);
  }

  if (isNaN(perc) || !isFinite(perc)) {
    perc = 0.00;
  } else {
    perc = parseFloat(Math.abs(perc)).toFixed(2);
  }

  return perc;
}
export function groupByMultiple(array, f) {
  var groups = {};
  array.forEach((o) => {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map((group) => groups[group]);
}

export function validityCheck(date) {
  if (date !== '' && date != null && date !== false) {
    const date1 = new Date(date);

    const date3 = new Date();
    const year = date3.getFullYear();
    const month = (date3.getMonth() + 1);
    const day = date3.getDate();
    const strTime = `${year}-${month}-${day}`;

    const date2 = new Date(strTime);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (parseInt(diffDays) > 0) {
      if (parseInt(diffDays) < 10) {
        return (
          <span className="font-weight-400">
            Warranty Going to Expire  in
            <span className="mr-1 ml-1">
              {' '}
              {diffDays}
            </span>
            Days
          </span>
        );
      }

      return (

        <span className="font-weight-400">
          Warranty Going to Expire  in
          <span className="mr-1 ml-1">
            {' '}
            {diffDays}
          </span>
          {' '}
          Days
        </span>
      );
    }

    return (
      <span className="font-weight-400">Warranty Expired</span>
    );
  }

  return (
    <span className="font-weight-400">No Warranty Information Available</span>
  );
}

export function getNumberToCommas(number) {
  let result = '';
  if (number !== 0 && number !== null && number !== undefined) {
    result = number.toLocaleString();
  }
  return result;
}

export function last(array) {
  let value = array && array.length ? array[array.length - 1] : '';
  if (array && array.id) {
    value = array.id;
  }
  return value;
}
