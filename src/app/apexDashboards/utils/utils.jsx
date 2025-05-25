/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import moment from 'moment';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

import customData from '../data/customData.json';
import {
  numberWithCommas, roundNumber, detectMob, isJsonString, getJsonString,
} from '../../util/appUtils';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);

export function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getStringData = (data) => data = data.map((id) => id = numberWithCommas(roundNumber(id)));

export function getLabelData(number) {
  if (number < 1000) {
    if (number % 1 != 0) {
      return number.toFixed(2);
    }
    return number;
  } if (number >= 1000 && number < 1_000_000) {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  } if (number >= 1_000_000 && number < 1_000_000_000) {
    return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  } if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  } if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    return `${(number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}T`;
  }
}

export function getArrayColors(total) {
  const result = [];
  const dynamicColors = ['#4d4dff', '#0066ff', '#3399ff', '#0099ff'];
  if (total) {
    for (let i = 0; i < total; i += 1) {
      const index = randomIntFromInterval(0, 3);
      result.push(dynamicColors[index]);
    }
  }
  return result;
}

export function getTooltipDataValues(labels, data) {
  let result = '';
  for (let i = 0; i < data.length; i += 1) {
    result += `<b>${labels[i] ? labels[i] : 'Label'}</b>: ${data[i] ? data[i] : '0'}<br>`;
  }
  return result;
}

export function getTooltipData(data) {
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    const strData = getTooltipDataValues(data[i].labels, data[i].data);
    result.push(strData);
  }
  return result;
}

export function getDatasets(values, labels) {
  let result = {};
  if (values) {
    const datas = [];
    for (let i = 0; i < values.length; i += 1) {
      if (values[i].data.length > 0) {
        datas.push({
          data: values[i].data, label: values[i].label, backgroundColor: getArrayColors(values[i].data.length),
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

export function getDatasetsPie(values, labels, colors, type) {
  let result = [];
  if (values && values.length) {
    result = [{
      values: values[0].data,
      labels,
      type: 'pie',
      textposition: 'inside',
      textfont: { color: '#ffffff' },
      hoverlabel: {
        font: { color: '#ffffff' },
      },
      // textinfo: values[0].data.length > 10 ? 'none' : 'percent',
    }];
    if (colors && colors.length) {
      result[0].marker = {
        colors,
      };
    }
    if (type && type === 'ks_doughnut_chart') {
      result[0].hole = 0.5;
    }
  }

  return result;
}

export function getDatasetsBar(values, labels, colors, subcolors, tooltipData) {
  let result = [];
  if (values && values.length === 1) {
    result = [{
      x: labels,
      y: getStringData(values[0].data),
      type: values[0].type ? values[0].type : 'bar',
      hoverinfo: 'y',
      text: getStringData(values[0].data).map(String),
      textangle: '-90',
    }];
    if (colors && colors.length) {
      result[0].marker = {
        color: colors,
      };
    }
  }
  if (values && values.length > 1) {
    for (let i = 0; i < values.length; i += 1) {
      result.push({
        x: labels,
        y: getStringData(values[i].data),
        name: values[i].label,
        type: values[i].type ? values[i].type : 'bar',
        marker: {
          color: subcolors && subcolors.length ? subcolors[i] : colors,
        },
        text: tooltipData && tooltipData.length ? getTooltipData(tooltipData) : getStringData(values[i].data).map(String),
        // hovertemplate: tooltipData && tooltipData.length ? getTooltipData(tooltipData) : null,
        textangle: '-90',
        textposition: tooltipData && tooltipData.length ? 'none' : 'inside',
      });
      /* if (i === 0 && values.length === 2) {
        result[i].offsetgroup = i + 1;
      }
      if (i > 0 && values.length === 2) {
        result[i].yaxis = `y${i + 1}`;
        result[i].offsetgroup = i + 1;
      } */
    }
  }
  return result;
}

export function getDatasetsHBar(values, labels, colors, subcolors) {
  let result = [];
  if (values && values.length === 1) {
    result = [{
      x: values[0].data,
      y: labels,
      type: 'bar',
      orientation: 'h',
      hoverinfo: 'x',
      text: values[0].data.map(String),
    }];
    if (colors && colors.length) {
      result[0].marker = {
        color: colors,
      };
    }
  }
  if (values && values.length > 1) {
    for (let i = 0; i < values.length; i += 1) {
      result.push({
        x: values[i].data,
        y: labels,
        name: values[i].label,
        type: values[i].type ? values[i].type : 'bar',
        orientation: 'h',
        hoverinfo: 'x',
        text: values[i].data.map(String),
        marker: {
          color: subcolors && subcolors.length ? subcolors[i] : colors,
        },
      });
    }
  }

  return result;
}

export function getDatasetsLine(values, labels, colors, type, subcolors) {
  let result = [];
  if (values && values.length === 1) {
    result = [{
      x: labels,
      y: getStringData(values[0].data),
      type: 'scatter',
      mode: 'markers+lines',
    }];
    if (colors && colors.length) {
      result[0].marker = {
        color: colors,
      };
    }
    if (type && type === 'ks_area_chart') {
      result[0].stackgroup = 'one';
    }
  }

  if (values && values.length > 1) {
    for (let i = 0; i < values.length; i += 1) {
      result.push({
        x: labels,
        y: getStringData(values[i].data),
        name: values[i].label,
        type: values[i].type ? values[i].type : 'scatter',
        mode: 'markers+lines',
        marker: {
          color: subcolors && subcolors.length ? subcolors[i] : colors,
        },
      });
      if (type && type === 'ks_area_chart') {
        result[i].stackgroup = 'one';
      }
      /* if (i > 0 && values.length === 2) {
        result[i].yaxis = `y${i + 1}`;
      } */
    }
  }
  return result;
}

export function getDataArry(array, ids, col, value) {
  const column = [];
  for (let i = 0; i < ids.length; i += 1) {
    const id = parseInt(ids[i]);
    if (array[id] && array[id][col] && array[id][col] === value) {
      column.push(array[id]);
    }
  }
  return column; // return column data..
}

export function getDataArryNot(array, ids, col, value) {
  const column = [];
  for (let i = 0; i < ids.length; i += 1) {
    const id = parseInt(ids[i]);
    if (array[id] && array[id][col] && array[id][col] !== value) {
      column.push(array[id]);
    }
  }
  return column; // return column data..
}

export function getDataArryIn(array, ids) {
  const column = [];
  for (let i = 0; i < ids.length; i += 1) {
    const id = parseInt(ids[i]);
    if (array[id]) {
      column.push(array[id]);
    }
  }
  return column; // return column data..
}

export function getDataArryCount(array, ids, col, value) {
  let count = 0;
  for (let i = 0; i < ids.length; i += 1) {
    const id = parseInt(ids[i]);
    if (array[id] && array[id][col] && array[id][col] === value) {
      count += array[id].ks_record_count;
    }
  }
  return count; // return column data..
}

export function getColorCode(clr, layout) {
  let clrCode = 'blue';
  if (clr) {
    const clrArr = clr.split(',');
    if (clrArr && clrArr.length && (!layout || (layout && layout === 'no'))) {
      clrCode = clrArr[0];
    } else if (layout && layout === 'yes') {
      clrCode = 'white';
    }
  }
  return clrCode;
}

export function getOROperator(dataCount) {
  const ar = [];
  const dataCountLength = dataCount - 1;
  for (let i = 0; i < dataCountLength; i += 1) {
    ar.push('"|"');
  }
  return ar.toString();
}

export function getModelFields(model, searchValue) {
  let res = '';
  if (searchValue) {
    // res = `,["name","ilike","${searchValue}"]`;
    if (customData && customData[model]) {
      const data = customData[model];
      for (let i = 0; i < data.length; i += 1) {
        res += `,["${data[i].property}","ilike","${searchValue}"]`;
      }
      res = `${getOROperator(data.length)}${res}`;
      /* if (data && data.length) {
        res += `,["${data[0].property}","ilike","${searchValue}"]`;
      } */
    }
  }
  return res;
}

export function getDomainString(domainString, searchValue, model, filters) {
  let result = domainString;
  if (searchValue && searchValue.length && domainString) {
    const reString = domainString.toString().substring(1, domainString.toString().length - 1);
    const mString = getModelFields(model, searchValue);
    result = reString ? `[${reString},${mString}]` : `[${mString}]`;
  } else if (filters && domainString) {
    const reString = domainString.toString().substring(1, domainString.toString().length - 1);
    result = reString ? `[${reString},${filters}]` : `${filters}`;
  }
  return result;
}

export function getDiifTime(startDate) {
  let res = '';
  if (startDate) {
    const datePast = new Date(startDate);

    const dateCurrent = new Date();

    const diffTime = Math.round(dateCurrent - datePast) / 1000;

    const totalSeconds = Math.abs(diffTime);

    // const days = totalSeconds / 86400;
    const temp1 = totalSeconds % 86400;
    // const hours = temp1 / 3600;
    const temp2 = temp1 % 3600;
    const minutes = temp2 / 60;

    if (Math.floor(minutes) > 0) {
      res = `Last refreshed ${Math.floor(minutes)}m ago`;
    } else if (totalSeconds > 0) {
      res = `Last refreshed ${Math.round(totalSeconds)}s ago`;
    }
  }

  return res;
}

export function getArrayNewUpdateFormat(data, dataList, array1) {
  const newArray = [];
  let newData = [];
  if (data && dataList && array1 && array1.length) {
    const arrGrids = dataList ? JSON.parse(dataList) : [];
    const dataIds = Object.keys(arrGrids);
    const array = getDataArryIn(data || [], dataIds);
    // const array = dataArray1.sort((a, b) => a.sequence - b.sequence);
    for (let i = 0; i < array.length; i += 1) {
      newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, { web_sequence: parseInt(`${array1[i] && array1[i].w}${array1[i] && array1[i].x}${array1[i] && array1[i].y}`) }];
      newArray.push(newData);
    }
  }
  return newArray;
}

export function getSplitedString(str) {
  let xaxisTitle = '';
  if (str) {
    const clrArr = str.toString().split(',');
    if (clrArr && clrArr.length && clrArr.length > 1) {
      xaxisTitle = `${clrArr[0]} , ${clrArr[1]}`;
    } else {
      xaxisTitle = str;
    }
  }
  return xaxisTitle;
}

export function getDynamicLayout(chartData, chartDetails, oldLayout, xTitle) {
  let result = oldLayout;
  if (chartData && chartData.datasets && chartData.datasets.length && chartData.datasets.length === 1) {
    if (chartData.datasets[0].label) {
      result = {
        ...oldLayout,
        yaxis: {
          title: chartData.datasets[0].label,
          hoverformat: ',',
          font: customData.globalfont,
        },
      };
    }
  }
  if (chartData && chartData.datasets && chartData.datasets.length && chartData.datasets.length > 1) {
    result = { ...oldLayout, showlegend: true };
    if ((chartDetails.ks_chart_data_count_type === 'sum' || (chartData.datasets.length === 2 && chartDetails.ks_dashboard_item_type === 'ks_bar_chart')) && chartData.datasets[0] && chartData.datasets[1] && chartData.datasets[0].label && chartData.datasets[1].label) {
      result = {
        ...oldLayout,
        yaxis: {
          title: 'Count', // chartData.datasets[0].label,
          hoverformat: ',',
          font: customData.globalfont,
        },
        /* yaxis2: {
          title: chartData.datasets[1].label,
          overlaying: 'y',
          side: 'right',
          font: customData.globalfont,
        }, */
        showlegend: true,
      };
    }
  }
  if (chartData && chartData.datasets && chartData.datasets.length && chartData.datasets.length === 2 && chartDetails.ks_dashboard_item_type !== 'ks_bar_chart') {
    result = {
      ...oldLayout,
      yaxis: {
        title: 'Count',
        hoverformat: ',',
        font: customData.globalfont,
      },
      showlegend: true,
    };
  }
  if (chartData && chartData.datasets && chartData.datasets.length && chartData.datasets.length > 2) {
    result = {
      ...oldLayout,
      yaxis: {
        title: 'Count',
        hoverformat: ',',
        font: customData.globalfont,
      },
      showlegend: true,
    };
  }
  if (chartDetails.ks_dashboard_item_type === 'ks_bar_chart') {
    result = {
      ...result,
      barmode: chartData && chartData.datasets && chartData.datasets.length === 2 ? 'group' : 'stack',
    };
  }
  result = {
    ...result,
    xaxis: {
      automargin: true,
      title: getSplitedString(xTitle),
      font: customData.globalfont,
      tickfont: {
        size: 11,
      },
    },
  };
  return result;
}

export function getDynamicLayoutTitle(chartData, chartValues, customHeight, oldLayout, xTitle) {
  let result = {
    ...oldLayout,
    hovermode: 'closest',
    height: customHeight,
    title: {
      text: `<b>${chartData.name}</b>`,
      x: 0,
      font: customData.globalfont,
    },
  };
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length === 1) {
    if (chartValues.datasets[0].label) {
      result = {
        ...result,
        yaxis: {
          title: chartValues.datasets[0].label,
          automargin: true,
          hoverformat: ',',
          font: customData.globalfont,
        },
      };
    }
  }
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length > 1) {
    if ((chartData.ks_chart_data_count_type === 'sum' || (chartValues.datasets.length === 2 && chartData.ks_dashboard_item_type === 'ks_bar_chart')) && chartValues.datasets[0] && chartValues.datasets[1] && chartValues.datasets[0].label && chartValues.datasets[1].label) {
      result = {
        ...result,
        yaxis: {
          title: 'Count', // chartValues.datasets[0].label,
          automargin: true,
          hoverformat: ',',
          font: customData.globalfont,
        },
        /* yaxis2: {
          title: chartValues.datasets[1].label,
          automargin: true,
          overlaying: 'y',
          side: 'right',
          font: customData.globalfont,
        }, */
      };
    }
  }
  if (chartData && chartData.datasets && chartData.datasets.length && chartData.datasets.length === 2 && chartData.ks_dashboard_item_type !== 'ks_bar_chart') {
    result = {
      ...oldLayout,
      yaxis: {
        title: 'Count',
        hoverformat: ',',
        font: customData.globalfont,
      },
      showlegend: true,
    };
  }
  if (chartData.ks_dashboard_item_type === 'ks_bar_chart') {
    result = {
      ...result,
      barmode: chartValues.datasets.length === 2 ? 'group' : 'stack',
    };
  }
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length > 2) {
    result = {
      ...result,
      yaxis: {
        title: 'Count',
        hoverformat: ',',
        automargin: true,
        font: customData.globalfont,
      },
    };
  }
  result = {
    ...result,
    xaxis: {
      automargin: true,
      title: getSplitedString(xTitle),
      font: customData.globalfont,
      tickfont: {
        size: 10,
      },
    },
    /* shapes: [
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: 12.0,
        x1: 1,
        y1: 12.0,
        line: {
          color: 'rgb(255, 0, 0)',
          width: 4,
          dash: 'dot',
        },
      },
    ],
    annotations: [
      {
        xref: 'paper',
        x: 0,
        y: 13.5,
        ax: 1,
        ay: 13.5,
        text: 'trendline',
        align: 'center',
        showarrow: false,
        font: {
          color: 'rgb(255, 0, 0)',
        },
      },
    ], */
  };
  return result;
}

export function getDynamicLayoutWithoutTitle(chartData, chartValues, customHeight, oldLayout, xTitle) {
  let result = {
    ...oldLayout,
    height: customHeight,
  };
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length === 1) {
    if (chartValues.datasets[0].label) {
      result = {
        ...result,
        yaxis: {
          title: chartValues.datasets[0].label,
          automargin: true,
          hoverformat: ',',
          font: customData.globalfont,
        },
      };
    }
  }
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length > 1) {
    if ((chartValues.datasets.length === 2 && chartData === 'ks_bar_chart') && chartValues.datasets[0] && chartValues.datasets[1] && chartValues.datasets[0].label && chartValues.datasets[1].label) {
      result = {
        ...result,
        yaxis: {
          title: chartValues.datasets[0].label,
          automargin: true,
          hoverformat: ',',
          font: customData.globalfont,
        },
        yaxis2: {
          title: chartValues.datasets[1].label,
          automargin: true,
          overlaying: 'y',
          hoverformat: ',',
          side: 'right',
          font: customData.globalfont,
        },
      };
    }
  }
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length === 2 && chartData !== 'ks_bar_chart') {
    result = {
      ...oldLayout,
      yaxis: {
        title: 'Count',
        hoverformat: ',',
        font: customData.globalfont,
      },
      showlegend: true,
    };
  }
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length > 2) {
    result = {
      ...result,
      yaxis: {
        title: 'Count',
        hoverformat: ',',
        automargin: true,
        font: customData.globalfont,
      },
    };
  }
  if (chartData === 'ks_bar_chart') {
    result = {
      ...result,
      barmode: chartValues.datasets.length === 2 ? 'group' : 'stack',
    };
  }
  result = {
    ...result,
    xaxis: {
      automargin: true,
      title: getSplitedString(xTitle),
      font: customData.globalfont,
      tickfont: {
        size: 10,
      },
    },
  };
  return result;
}

export function convertPXToVW(px, ph, deValue) {
  const w = (px / document.documentElement.clientWidth) * 100;
  const h = (ph / document.documentElement.clientHeight) * 100;
  let vw = w * (100 / document.documentElement.clientWidth);
  const vh = h * (100 / document.documentElement.clientHeight);
  let respMobPx = 3.3;
  if (deValue) {
    respMobPx -= (deValue + 1.5);
    if (vw > deValue) {
      vw -= deValue;
    }
  }
  // clamp(2rem, 10vw, 5rem)
  const isMob = detectMob();
  return isMob ? `calc(${deValue ? '15' : '16'}px + ${respMobPx}vw)` : `clamp(0.5vw, ${vw}vw, 2vw)`;// `calc(${vw}vw + ${vh}vh)`;
}

export function getTargetDateGroup(dateSeries) {
  let result = 'month';
  if (dateSeries === 'l_day' || dateSeries === 't_week' || dateSeries === 't_month' || dateSeries === 'ls_day' || dateSeries === 'ls_week' || dateSeries === 'ls_month' || dateSeries === 'l_week' || dateSeries === 'l_month') {
    result = 'day';
  }
  return result;
}
export function hexToBase64(str) {
  // first we use encodeURIComponent to get percent-encoded Unicode,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return decodeURIComponent(escape(window.atob(str)));
}
export function getGroupDateArray(array, dateValue) {
  const newArray = [];
  let newData = [];
  for (let i = 0; i < array.length; i += 1) {
    newData = [1, array[i].id, { ks_chart_date_groupby: dateValue }];
    newArray.push(newData);
  }
  return newArray;
}

export function getbarName(type) {
  let res = 'line';
  if (type === 'bar') {
    res = 'bar';
  }
  return res;
}

export function getChartName(type) {
  let res = 'bar';
  if (type === 'ks_horizontalBar_chart') {
    res = 'bar';
  } else if (type === 'ks_bar_chart') {
    res = 'bar';
  } else if (type === 'ks_bar_advance_chart') {
    res = 'line';
  } else if (type === 'ks_bar_multi_chart') {
    res = 'bar';
  } else if (type === 'ks_area_chart') {
    res = 'area';
  } else if (type === 'ks_line_chart') {
    res = 'line';
  }
  return res;
}

export function getFillColor(data, color, chartData, options) {
  const areaFillColorData = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).fill_color_data) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).fill_color_data)));
  const isPallete = options && options.theme && options.theme.palette && options.theme.palette !== 'palette1';
  let res = color || undefined;
  if (areaFillColorData || isPallete) {
    res = undefined;
  }
  return res;
}

export function getTrimmedData(data) {
  const res = data.filter((item) => !isNaN(item));
  return res;
}

export function getTrimmedTargetData(data) {
  const res = data.filter((item) => item.label !== 'Target');
  return res;
}

export function getDatasetsApexBar(values, colors, subcolors, dType, chartData, options) {
  let result = [];
  values = getTrimmedTargetData(values);
  if (values && values.length === 1) {
    if (subcolors && subcolors.length) {
      result = [{
        name: values[0].label ? values[0].label : chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
        type: values[0].type ? values[0].type : getChartName(dType),
        data: getTrimmedData(values[0].data),
        color: subcolors && subcolors.length ? getFillColor(values[0], subcolors[0], chartData, options) : getFillColor(values[0], '', chartData, options),
      // colors: subcolors && !subcolors.length ? colors : [],
      }];
    } else {
      result = [{
        name: values[0].label ? values[0].label : chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
        // type: values[0].type ? values[0].type : getChartName(dType),
        data: getTrimmedData(values[0].data),
        color: getFillColor(values[0], '', chartData, options),
        // colors: subcolors && !subcolors.length ? colors : [],
      }];
    }
  }
  if (values && values.length > 1 && dType !== 'ks_bar_advance_chart') {
    for (let i = 0; i < values.length; i += 1) {
      const resultObj = {
        name: values[i].label,
        type: values[i].type ? values[i].type : getChartName(dType),
        data: getTrimmedData(values[i].data),
      };
      if (dType === 'ks_bar_multi_chart') {
        resultObj.colors = colors;
      } else {
        resultObj.color = subcolors && subcolors.length ? getFillColor(values[i], subcolors[i], chartData, options) : getFillColor(values[i], '', chartData, options);
      }
      result.push(resultObj);
    }
  }
  if (values && values.length > 1 && dType === 'ks_bar_advance_chart') {
    for (let i = 0; i < values.length; i += 1) {
      const resultObj = {
        name: values[i].label,
        type: values[i].type ? values[i].type : 'bar',
        data: getTrimmedData(values[i].data),
      };
      if (dType === 'ks_bar_multi_chart') {
        resultObj.colors = colors;
      } else {
        resultObj.color = subcolors && subcolors.length ? subcolors[i] : '';
      }
      result.push(resultObj);
    }
  }
  return result;
}

export function getDatasetsApexBarPreview(values, colors, subcolors, dType, chartData, options) {
  let result = [];
  values = getTrimmedTargetData(values);
  if (values && values.length === 1) {
    if (subcolors && subcolors.length) {
      result = [{
        name: values[0].label ? values[0].label : chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
        type: values[0].type ? values[0].type : getChartName(dType),
        data: getTrimmedData(values[0].data),
        color: undefined,
      // colors: subcolors && !subcolors.length ? colors : [],
      }];
    } else {
      result = [{
        name: values[0].label ? values[0].label : chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
        // type: values[0].type ? values[0].type : getChartName(dType),
        data: getTrimmedData(values[0].data),
        color: undefined,
        // colors: subcolors && !subcolors.length ? colors : [],
      }];
    }
  }
  if (values && values.length > 1 && dType !== 'ks_bar_advance_chart') {
    for (let i = 0; i < values.length; i += 1) {
      const resultObj = {
        name: values[i].label,
        type: values[i].type ? values[i].type : getChartName(dType),
        data: getTrimmedData(values[i].data),
      };
      if (dType === 'ks_bar_multi_chart') {
        resultObj.colors = colors;
      } else {
        resultObj.color = undefined;
      }
      result.push(resultObj);
    }
  }
  if (values && values.length > 1 && dType === 'ks_bar_advance_chart') {
    for (let i = 0; i < values.length; i += 1) {
      const resultObj = {
        name: values[i].label,
        type: values[i].type ? values[i].type : 'bar',
        data: getTrimmedData(values[i].data),
      };
      if (dType === 'ks_bar_multi_chart') {
        resultObj.colors = colors;
      } else {
        resultObj.color = subcolors && subcolors.length ? subcolors[i] : '';
      }
      result.push(resultObj);
    }
  }
  return result;
}


export function getFormat(type) {
  let defaultFormat = 'DD MMM YYYY';
  if (type && type === 'datetime') {
    defaultFormat = 'DD MMM YYYY hh:mm A';
  }
  if (type && type === 'time') {
    defaultFormat = 'hh:mm A';
  }
  if (type && type === 'date') {
    defaultFormat = 'DD MMM YYYY';
  }
  if (type && type === 'monthyear') {
    defaultFormat = 'MMM YYYY';
  }
  if (type && type === 'datetimeseconds') {
    defaultFormat = 'YYYY-MM-DDTHH:mm:ss';
  }
  if (type && type === 'datetimesecs') {
    defaultFormat = 'YYYY-MM-DD HH:mm:ss';
  }
  return defaultFormat;
}


function getDateFormatNew(format) {
  const dateArray = {
    a: 'ddd',
    A: 'dddd',
    b: 'MMM',
    B: 'MMMM',
    d: 'DD',
    m: 'MM',
    w: 'Do',
    y: 'YY',
    Y: 'YYYY',
  };
  let str = '';
  for (let i = 0; i < format.length; i += 1) {
    if (format[i].toString() in dateArray) {
      str += dateArray[format[i].toString()];
    } else {
      str += format[i];
    }
  }
  return str;
}

export function truncatePercentageAndDateType(format, type) {
  let result = '';
  if (format && type) {
    if (type === 'date' || type === 'monthyear') {
      result = getDateFormatNew(format.replaceAll('%', ''));
    }
    if (type === 'datetime') {
      const dStr = getDateFormatNew(format.replaceAll('%', ''));
      result = `${dStr} hh:mm A`;
    }
    if (type === 'time') {
      result = 'hh:mm A';
    }
  }
  return result;
}

export function getCompanyTimezoneDayjsLocal(input, userResponse, type) {
  let local = '-';
  const defaultTf = getFormat(type);
  if (input && input !== '-' && userResponse?.data) {
    const uData = userResponse.data;
    const defaultTz = 'Asia/Kolkata';
    const tZone = uData.timezone || defaultTz;
    const dateFormat = uData.lang?.date_format
      ? truncatePercentageAndDateType(uData.lang.date_format, type)
      : defaultTf;
    local = dayjs(input).format(dateFormat);
  }
  return local === 'Invalid Date' ? '-' : local;
}

export function getDateRange(key) {
  const today = dayjs().startOf('day');

  switch (key) {
    case 'l_day': return [today, today];
    case 't_week': return [today.startOf('week'), today.endOf('week')];
    case 't_month': return [today.startOf('month'), today.endOf('month')];
    case 't_quarter': return [today.startOf('quarter'), today.endOf('quarter')];
    case 't_year': return [today.startOf('year'), today.endOf('year')];

    case 'n_week': return [today.add(1, 'week').startOf('week'), today.add(1, 'week').endOf('week')];
    case 'n_month': return [today.add(1, 'month').startOf('month'), today.add(1, 'month').endOf('month')];
    case 'n_quarter': return [today.add(1, 'quarter').startOf('quarter'), today.add(1, 'quarter').endOf('quarter')];
    case 'n_year': return [today.add(1, 'year').startOf('year'), today.add(1, 'year').endOf('year')];

    case 'ls_day': return [today.subtract(1, 'day'), today.subtract(1, 'day')];
    case 'ls_week': return [today.subtract(1, 'week').startOf('week'), today.subtract(1, 'week').endOf('week')];
    case 'ls_month': return [today.subtract(1, 'month').startOf('month'), today.subtract(1, 'month').endOf('month')];
    case 'ls_quarter': return [today.subtract(1, 'quarter').startOf('quarter'), today.subtract(1, 'quarter').endOf('quarter')];
    case 'ls_year': return [today.subtract(1, 'year').startOf('year'), today.subtract(1, 'year').endOf('year')];

    case 'l_week': return [today.subtract(6, 'day'), today];
    case 'l_month': return [today.subtract(29, 'day'), today];
    case 'l_quarter': return [today.subtract(89, 'day'), today];
    case 'l_year': return [today.subtract(364, 'day'), today];

    case 'l_none': return [null, null]; // All time
    case 'l_custom': return [null, null]; // User-defined

    default: return [null, null];
  }
}

export function isModelExists(modelName, custom) {
  let res = false;
  if (custom) {
    res = true;
  } else if (modelName && customData && customData[modelName]) {
    res = true;
  }
  return res;
}

export function getActionLines(dashboardColors, id) {
  let res = [];
  if (dashboardColors && dashboardColors.length && id) {
    const resu = dashboardColors.filter((item) => item.id === id);
    if (resu && resu.length && resu[0].ks_action_lines && resu[0].ks_action_lines.length) {
      res = resu[0].ks_action_lines;
    }
  }
  return res;
}

export function getXData(values, labels) {
  const result = [];
  const today = moment(labels && labels.length ? new Date(labels[0]) : new Date()).format('YYYY-MM-DD');
  if (values && values.length) {
    for (let i = 0; i < values.length; i += 1) {
      const todayTime = moment(`${today} ${values[i].hx_value_1}`).local().format('YYYY-MM-DD HH:mm');
      const todayTime2 = moment(`${today} ${values[i].hx_value_2}`).local().format('YYYY-MM-DD HH:mm');
      result.push({
        x: new Date(`${todayTime}`).getTime(),
        x2: new Date(`${todayTime2}`).getTime(),
        fillColor: values[i].hx_color,
      });
    }
  }
  return result;
}

export function getYData(values) {
  const result = [];
  if (values && values.length) {
    for (let i = 0; i < values.length; i += 1) {
      result.push({
        y: values[i].hx_value_1,
        y2: values[i].hx_value_2,
        fillColor: values[i].hx_color,
        label: {
          orientation: 'horizontal',
        },
      });
    }
  }
  return result;
}

export function getPointsData(values, datasets, labels) {
  const result = [];
  const today = moment(labels && labels.length ? new Date(labels[0]) : new Date()).format('YYYY-MM-DD');
  if (values && values.length) {
    for (let i = 0; i < values.length; i += 1) {
      const todayTime = moment(`${today} ${values[i].hx_value_1}`).local().format('YYYY-MM-DD HH:mm');
      result.push({
        x: new Date(`${todayTime}`).getTime(),
        y: Math.max(...datasets[0].data),
        marker: {
          size: 6,
          fillColor: '#ffffff00',
          strokeColor: '#ffffFF00',
          radius: 2,
        },
        label: {
          borderColor: values[i].hx_bgcolor,
          offsetY: 0,
          style: {
            color: values[i].hx_color,
            background: values[i].hx_bgcolor,
          },
          text: values[i].hx_text,
        },
      });
    }
  }
  return result;
}

export function getYPointsData(values, datasets, labels, groupby) {
  const result = [];
  if (values && values.length) {
    const todayTime = groupby === 'hour' ? moment(labels[0]).format('YYYY-MM-DD HH:mm') : labels[0];
    for (let i = 0; i < values.length; i += 1) {
      result.push({
        x: groupby === 'hour' ? new Date(`${todayTime}`).getTime() : todayTime,
        y: values[i].hx_value_1,
        marker: {
          size: 6,
          fillColor: '#ffffff00',
          strokeColor: '#ffffFF00',
          radius: 2,
        },
        label: {
          borderColor: values[i].hx_bgcolor,
          offsetY: 0,
          textAnchor: 'start',
          position: 'left',
          orientation: 'horizontal',
          style: {
            color: values[i].hx_color,
            background: values[i].hx_bgcolor,
          },
          text: values[i].hx_text,
        },
      });
    }
  }
  return result;
}

export function getLabData(values) {
  const result = [];
  if (values && values.length) {
    for (let i = 0; i < values.length; i += 1) {
      const todayTime = moment(values[i]).format('YYYY-MM-DD HH:mm');
      result.push(
        new Date(`${todayTime}`).getTime(),
      );
    }
  }
  return result;
}

export function sanitizeLabels(labels) {
  return labels.map((label) => {
    if (typeof label !== 'string') {
      label = String(label ?? '');
    }
    // Remove newlines and trim spaces
    return label.replace(/\s+/g, ' ').trim();
  });
}

export function sanitizeSeriesArray(seriesArray) {
  if (!Array.isArray(seriesArray)) return [];

  return seriesArray.map((series) => ({
    ...series,
    name: typeof series.name === 'string'
      ? series.name.replace(/\s+/g, ' ').trim()
      : '',
    data: Array.isArray(series.data)
      ? series.data.map((d) => (typeof d === 'number' && !isNaN(d) ? d : 0))
      : [],
  }));
}

export function getNumberValue(input) {
  let res = 0;
  if (typeof input === 'number') {
    if (Number(input) === input && input % 1 !== 0) {
      res = parseFloat(input).toFixed(2);
    } else {
      res = parseInt(input);
    }
  } else {
    res = input;
  }
  return res;
}

export const getHeatPoints = (data, labels) => {
  const newPoints = labels.map((cl, index) => ({
    x: cl,
    y: data[index],
  }));
  return newPoints;
};

export const getHeatData = (data, labels) => {
  const newData = data.map((cl) => ({
    name: cl.label,
    data: getHeatPoints(cl.data, labels),
  }));
  return newData;
};

export const getColorOptions = (data) => {
  const newData = data && data.length ? data.map((cl) => ({
    from: cl.ks_from,
    to: cl.ks_to,
    color: cl.ks_colors,
    name: cl.ks_legend,
  })) : [];
  return newData;
};

export function getIOTFields(modelName, v16Fields) {
  let res = false;
  const obj = {
    'dmr_stats.eb_consumption': '["id","mdate","equipment_space","first_reading", "last_reading", "first_reading_at", "last_reading_at", "eb_consumption","block",("equipment_id", ["id", "alias_name","asset_name"]),("company_id", ["id", "name"])]',
    'dmr_stats.water_consumption': '["id","mdate","first_reading", "last_reading", "first_reading_at", "last_reading_at", "water_consumption","block",("equipment_id", ["id", "alias_name","asset_name"]),("company_id", ["id", "name"])]',
    'dmr_stats.eb_consumption_view': '["id","mdate","equipment_space","first_reading", "last_reading", "first_reading_at", "last_reading_at", "eb_consumption","block",("asset_name", ["id", "alias_name","asset_name"]),("company_id", ["id", "name"])]',
    'dw.reading_history': '["id","asset_number","device_id","alias_name", "answer_value", "measured_ts",("asset_id", ["id", "asset_name"])]',
  };
  if (v16Fields) {
    res = v16Fields;
  } else if (obj && obj[modelName]) {
    res = obj[modelName];
  }
  return res;
}

export function get12Fields(modelName, v12Fields) {
  let res = false;
  const obj = {
    'mro.equipment': '["id", "name", "equipment_seq", ("category_id",["id","name"]), "state", ("block_id",["id","space_name"]),("floor_id",["id","space_name"]),("location_id",["id","path_name"]),("maintenance_team_id",["id","name"]), "equipment_number", "model", "purchase_date", "serial",("vendor_id",["id","name"]),("manufacturer_id",["id","name"]), "warranty_start_date", "end_of_life","warranty_end_date",("monitored_by_id",["id","name"]), ("managed_by_id",["id","name"]), ("maintained_by_id",["id","name"]), "tag_status", "validation_status",("company_id",["id","name"]),("validated_by",["id","name"]), "validated_on", "is_qr_tagged", "is_nfc_tagged", "is_rfid_tagged", "is_virtually_tagged", "amc_start_date", "amc_end_date", "amc_type", "brand"]',
  };
  if (v12Fields) {
    res = v12Fields;
  } else if (obj && obj[modelName]) {
    res = obj[modelName];
  }
  return res;
}
