/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React from 'react';
import moment from 'moment-timezone';
import { Badge } from 'reactstrap';

import surveyActions from '../data/customData.json';
import {
  getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';

export function getTypeLabel(data) {
  if (surveyActions && surveyActions.typesText[data]) {
    return surveyActions.typesText[data].label;
  }
  return '-';
}

export function getRecurrentLabel(data) {
  if (surveyActions && surveyActions.repeatTypesText[data]) {
    return surveyActions.repeatTypesText[data].label;
  }
  return '-';
}

export function getQuestionTypeLabel(data) {
  if (surveyActions && surveyActions.questionTypesText[data]) {
    return surveyActions.questionTypesText[data].label;
  }
  return '';
}

export function getSurveyState(staten) {
  if (surveyActions && surveyActions.states[staten]) {
    return <span className={surveyActions.states[staten].colorClass}>{surveyActions.states[staten].text}</span>;
  }
  return '';
}

export function getSurveyStateLabel(staten) {
  if (surveyActions && surveyActions.states[staten]) {
    return <Badge color={surveyActions.states[staten].color} className="badge-text no-border-radius" pill>{surveyActions.states[staten].text}</Badge>;
  }
  return '';
}

export function getMatrixTypeLabel(data) {
  if (surveyActions && surveyActions.matrixTypesText[data]) {
    return surveyActions.matrixTypesText[data].label;
  }
  return '';
}

export function getDisplayModeLabel(data) {
  if (surveyActions && surveyActions.displayModesText[data]) {
    return surveyActions.displayModesText[data].label;
  }
  return '';
}

export function getColumnsLabel(data) {
  if (surveyActions && surveyActions.noofColumnsText[data]) {
    return surveyActions.noofColumnsText[data].label;
  }
  return '';
}

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

export function getArrayModify(array) {
  const newData = [];
  if (array.length) {
    for (let i = 0; i < array.length; i += 1) {
      const question = array[i];
      const questionGroup = question.question_ids;
      question.question_ids = getArrayNewFormatUpdateDelete(questionGroup);
      newData.push(question);
    }
  }
  return newData;
}

export function getArrayUpdateModify(array) {
  const newData = [];
  if (array.length) {
    for (let i = 0; i < array.length; i += 1) {
      newData.push({ id: array[i].id, isUpdate: true });
    }
  }
  return newData;
}

export function getArrayColors(total) {
  const result = [];
  const dynamicColors = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    if (r !== 255 && g !== 0 && b !== 0) {
      return `rgb(${r},${g},${b})`;
    }
    return 'rgb(255,160,122)';
  };
  if (total) {
    for (let i = 0; i < total; i += 1) {
      result.push(dynamicColors());
    }
  }

  return result;
}

export function getDatasetsPie(values, colors) {
  let result = {};
  if (values && values.length) {
    const data = [];
    const datas = [];
    const labels = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].text) {
        data.push(values[i].count);
        labels.push(values[i].text);
      }
    }

    const dynamicColors = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      if (r !== 255 && g !== 0 && b !== 0) {
        return `rgb(${r},${g},${b})`;
      }
      return 'rgb(255,160,122)';
    };

    const clrData = [];

    for (let i = 0; i < colors.length; i += 1) {
      if (colors[i]) {
        clrData.push(colors[i]);
      } else {
        clrData.push(dynamicColors());
      }
    }

    datas.push({
      data, label: 'Count', backgroundColor: clrData && clrData.length ? clrData : getArrayColors(values.length),
    });

    result = {
      datasets: datas,
      labels,
    };
  }
  console.log(values);
console.log(result);
  return result;
}

export function getDatasetsPieArray(values, colors) {
  let result = {};
  if (values && values.length) {
    const data = [];
    const datas = [];
    const labels = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i][0]) {
        data.push(values[i][1]);
        labels.push(values[i][0]);
      }
    }

    const dynamicColors = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      if (r !== 255 && g !== 0 && b !== 0) {
        return `rgb(${r},${g},${b})`;
      }
      return 'rgb(255,160,122)';
    };

    const clrData = [];

    for (let i = 0; i < colors.length; i += 1) {
      if (colors[i]) {
        clrData.push(colors[i]);
      } else {
        clrData.push(dynamicColors());
      }
    }

    datas.push({
      data, label: 'Count', backgroundColor: clrData && clrData.length ? clrData : getArrayColors(values.length),
    });

    result = {
      datasets: datas,
      labels,
    };
  }

  return result;
}

export function getAnswerTypeData(type, obj) {
  let res = '';
  if (type && obj) {
    if (type === 'date') {
      res = obj.value_date;
    } else if (type === 'free_text') {
      res = obj.value_free_text;
    } else if (type === 'text') {
      res = obj.value_text;
    }
  }
  return res;
}

export function getAnswerTypeValues(arr) {
  let result = [];
  if (arr) {
    result = [...arr.reduce((mp, o) => {
      if (!mp.has(getAnswerTypeData(o.answer_type, o))) mp.set(getAnswerTypeData(o.answer_type, o), { ...o, count: 0 });
      mp.get(getAnswerTypeData(o.answer_type, o)).count++;
      return mp;
    }, new Map()).values()];
  }
  return result;
}

export function getDatasetsGroupArray(values, colors) {
  let result = {};
  if (values && values.length) {
    const data = [];
    const datas = [];
    const labels = [];
    const groupedData = getAnswerTypeValues(values);
    for (let i = 0; i < groupedData.length; i += 1) {
      if (getAnswerTypeData(groupedData[i].answer_type, groupedData[i])) {
        data.push(groupedData[i].count);
        labels.push(getAnswerTypeData(groupedData[i].answer_type, groupedData[i]));
      }
    }

    const dynamicColors = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      if (r !== 255 && g !== 0 && b !== 0) {
        return `rgb(${r},${g},${b})`;
      }
      return 'rgb(255,160,122)';
    };

    const clrData = [];

    for (let i = 0; i < colors.length; i += 1) {
      if (colors[i]) {
        clrData.push(colors[i]);
      } else {
        clrData.push(dynamicColors());
      }
    }

    datas.push({
      data, label: 'Count', backgroundColor: clrData && clrData.length ? clrData : getArrayColors(values.length),
    });

    result = {
      datasets: datas,
      labels,
    };
  }

  return result;
}

export function getQuestionsCount(array) {
  const result = array.filter((obj) => (!obj.isRemove));
  return result.length;
}

export function getEditArray(array, field) {
  const result = [];
  for (let k = 0; k < array.length; k += 1) {
    const p = array[k];
    if (p.id || p[field]) {
      result.push(p);
    }
  }
  return result;
}
