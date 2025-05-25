/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import moment from 'moment';

import customData from '../data/customData.json';
import { numberWithCommas, roundNumber, detectMob } from '../../util/appUtils';

export function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getStringData = (data) => data = data.map((id) => id = numberWithCommas(roundNumber(id)));

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

export function getScaleValue(arr, key) {
  let result = false;
  if (arr && arr.length) {
    const arrData = arr.filter((item) => item.value === key);
    if (arrData && arrData.length) {
      result = arrData[0].label;
    }
  }
  return result;
}

export function getCustomTooltipDataValues(labels, data, desc) {
  let result = '';
  const scales = JSON.parse(desc);
  if (getScaleValue(scales.values ? scales.values : [], data)) {
    result += `<b>(${getScaleValue(scales.values, data)})</b>`;
  }
  return result;
}

export function getCustomTooltipData(labels, data, desc) {
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    const strData = getCustomTooltipDataValues(labels[i], data[i], desc);
    result.push(strData);
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
      textinfo: 'percent+value',
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

export function getLabData(values) {
  const result = [];
  if (values && values.length) {
    for (let i = 0; i < values.length; i += 1) {
      const todayTime = moment(values[i]).local().format('YYYY-MM-DD HH:mm');
      result.push(
        new Date(`${todayTime}`).getTime(),
      );
    }
  }
  return result;
}

export function getColorData(colors) {
  const result = [];
  if (colors && colors.length) {
    for (let i = 0; i < colors.length; i += 1) {
      const defColor = colors[i] === '#e5e5e5' ? '#15527c' : colors[i];
      result.push(defColor);
    }
  }
  return result;
}

export function getDatasetsBar(values, labels, colors, subcolors, tooltipData, chartData) {
  let result = [];
  if (values && values.length === 1) {
    result = [{
      x: chartData && chartData.hx_annotations_data_ids
      && chartData.hx_annotations_data_ids.length ? getLabData(labels) : labels,
      y: getStringData(values[0].data),
      name: values[0].label,
      type: values[0].type ? values[0].type : 'bar',
      mode: 'text',
      text: tooltipData && tooltipData.length ? getTooltipData(tooltipData) : getStringData(values[0].data).map(String),
      textangle: '-90',
      textposition: tooltipData && tooltipData.length ? 'none' : 'inside',
    }];
    if (colors && colors.length) {
      result[0].marker = {
        color: subcolors && subcolors.length ? subcolors[0] : getColorData(colors),
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

export function IsJsonString(str) {
  try {
    const json = JSON.parse(str);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

export function getDatasetsLine(values, labels, colors, type, subcolors, isShow, desc) {
  let result = [];
  if (values && values.length === 1) {
    result = [{
      x: labels,
      y: getStringData(values[0].data),
      name: values[0].label,
      type: 'scatter',
      mode: 'markers+lines',
      text: isShow && desc && IsJsonString(desc) ? getCustomTooltipData(labels, values[0].data, desc) : getStringData(values[0].data).map(String),
      textposition: isShow && desc && IsJsonString(desc) ? 'none' : 'inside',
      hoverlabel: {
        namelength: -1,
        font: { size: 12 },
      },
    }];
    if (colors && colors.length) {
      result[0].marker = {
        color: subcolors && subcolors.length ? subcolors[0] : colors,
      };
    }
    if (isShow && desc && IsJsonString(desc)) {
      const scales = JSON.parse(desc);
      if (scales && scales.shape) {
        result[0].line = {
          shape: scales.shape,
        };
      }
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
        hoverlabel: {
          namelength: -1,
          font: { size: 12 },
        },
      });
      if (type && type === 'ks_area_chart') {
        result[i].stackgroup = 'one';
      }
      if (isShow && desc && IsJsonString(desc)) {
        const scales = JSON.parse(desc);
        if (scales && scales.shape) {
          result[i].line = {
            shape: scales.shape,
          };
        }
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

export function getModelFields(model, searchValue) {
  let res = '';
  if (searchValue) {
    // res = `,["name","ilike","${searchValue}"]`;
    if (customData && customData[model]) {
      const data = customData[model];
      /* for (let i = 0; i < data.length; i += 1) {
        res += `,["${data[i].property}","ilike","${searchValue}"]`;
      }
      res = `,"|","|"${res}`; */
      if (data && data.length) {
        res += `,["${data[0].property}","ilike","${searchValue}"]`;
      }
    }
  }
  return res;
}

export function getDomainString(domainString, searchValue, model) {
  let result = domainString;
  if (searchValue && searchValue.length && domainString) {
    const reString = domainString.toString().substring(1, domainString.toString().length - 1);
    result = `[${reString}${getModelFields(model, searchValue)}]`;
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
      if (array1[i] && array1[i].w) {
        newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, { web_sequence: parseInt(`${array1[i].w}${array1[i].x}${array1[i].y}`) }];
        newArray.push(newData);
      }
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

export function strFullTime(str) {
  let timeFull = '0:00';
  if (str && str.toString()) {
    timeFull = str.toString().replace('30', '00');
    timeFull = timeFull.toString().replace('45', '00');
    timeFull = timeFull.toString().replace('15', '00');
  }
  return timeFull;
}

export function getXData(values, points, labels) {
  const result = [];
  const today = moment(labels && labels.length ? new Date(labels[0]) : new Date()).format('DD MMM YYYY');
  if (values && values.length) {
    for (let i = 0; i < values.length; i += 1) {
      const todayTime = moment(`${today} ${values[i].hx_value_1}`).local().format('YYYY-MM-DD HH:mm');
      const todayTime2 = moment(`${today} ${values[i].hx_value_2}`).local().format('YYYY-MM-DD HH:mm');
      result.push({
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: new Date(`${todayTime}`).getTime(),
        y0: 0,
        x1: new Date(`${todayTime2}`).getTime(),
        y1: 1,
        opacity: 0.55,
        editable: false,
        line: {
          width: 0,
        },
        fillcolor: values[i].hx_color,
      });
    }
  }
  return result;
}

export function getAnnData(values, points, labels, datasets) {
  const result = [];
  const today = moment(labels && labels.length ? new Date(labels[0]) : new Date()).format('DD MMM YYYY');
  if (points && points.length) {
    for (let i = 0; i < points.length; i += 1) {
      const todayTime = moment(`${today} ${points[i].hx_value_1}`).local().format('YYYY-MM-DD HH:mm');
      const totalData = datasets && datasets.length && datasets[0].data ? datasets[0].data : [];
      result.push({
        x: new Date(`${todayTime}`).getTime(),
        y: Math.max(...totalData) + 5,
        xref: 'x',
        yref: 'y',
        text: points[i].hx_text,
        showarrow: false,
        arrowhead: 7,
        ax: 0,
        ay: -20,
        bordercolor: points[i].hx_bgcolor,
        borderwidth: 1,
        borderpad: 1,
        bgcolor: points[i].hx_bgcolor,
        font: {
          color: points[i].hx_color,
        },
      });
    }
  }
  return result;
}

export function getDynamicLayout(chartData, chartDetails, oldLayout, xTitle) {
  let result = oldLayout;
  if (chartData && chartData.datasets && chartData.datasets.length && chartData.datasets.length === 1) {
    if (chartData.datasets[0].label) {
      result = {
        ...oldLayout,
        yaxis: {
          title: chartDetails && chartDetails.title_y_axis ? chartDetails.title_y_axis : chartData.datasets[0].label,
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
          title: chartDetails && chartDetails.title_y_axis ? chartDetails.title_y_axis : 'Count', // chartData.datasets[0].label,
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
        title: chartDetails && chartDetails.title_y_axis ? chartDetails.title_y_axis : 'Count',
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
        title: chartDetails && chartDetails.title_y_axis ? chartDetails.title_y_axis : 'Count',
        hoverformat: ',',
        font: customData.globalfont,
      },
      showlegend: true,
    };
  }
  if (chartDetails.ks_dashboard_item_type === 'ks_bar_chart') {
    /* result = {
      ...result,
      barmode: chartData.datasets.length === 2 ? 'group' : 'stack',
    }; */
    if (chartDetails && chartDetails.hx_annotations_data_ids
      && chartDetails.hx_annotations_data_ids.length) {
      const xData = chartDetails.hx_annotations_data_ids.filter((item) => item.hx_parameter === 'xaxis');
      const pData = chartDetails.hx_annotations_data_ids.filter((item) => item.hx_parameter === 'points');
      result = {
        ...result,
        shapes: getXData(xData, pData, chartData && chartData.datasets && chartData.datasets.length ? chartData.datasets[0].labels : []),
        annotations: getAnnData(xData, pData, chartData && chartData.datasets && chartData.datasets.length ? chartData.datasets[0].labels : [], chartData.datasets),
      };
    }
  }
  result = {
    ...result,
    xaxis: {
      automargin: true,
      tickformat: chartDetails && chartDetails.hx_annotations_data_ids
      && chartDetails.hx_annotations_data_ids.length ? '%d/%m/%Y %H:%M' : undefined,
      type: chartDetails && chartDetails.hx_annotations_data_ids
      && chartDetails.hx_annotations_data_ids.length ? 'date' : 'categoty',
      title: chartDetails && chartDetails.title_x_axis ? chartDetails.title_x_axis : getSplitedString(xTitle),
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
          title: chartData && chartData.title_y_axis ? chartData.title_y_axis : chartValues.datasets[0].label,
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
          title: chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count', // chartValues.datasets[0].label,
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
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length === 2 && chartData.ks_dashboard_item_type !== 'ks_bar_chart') {
    result = {
      ...oldLayout,
      yaxis: {
        title: chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
        hoverformat: ',',
        font: customData.globalfont,
      },
      showlegend: true,
    };
  }
  if (chartData.ks_dashboard_item_type === 'ks_bar_chart') {
    /* result = {
      ...result,
      barmode: chartValues.datasets.length === 2 ? 'group' : 'stack',
    }; */
    if (chartData && chartData.hx_annotations_data_ids
      && chartData.hx_annotations_data_ids.length) {
      const xData = chartData.hx_annotations_data_ids.filter((item) => item.hx_parameter === 'xaxis');
      const pData = chartData.hx_annotations_data_ids.filter((item) => item.hx_parameter === 'points');
      result = {
        ...result,
        shapes: getXData(xData, pData, chartValues && chartValues.datasets && chartValues.datasets.length ? chartValues.datasets[0].labels : []),
        annotations: getAnnData(xData, pData, chartValues && chartValues.datasets && chartValues.datasets.length ? chartValues.datasets[0].labels : [], chartValues.datasets),
      };
    }
  }
  if (chartValues && chartValues.datasets && chartValues.datasets.length && chartValues.datasets.length > 2) {
    result = {
      ...result,
      yaxis: {
        title: chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
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
      tickformat: chartData && chartData.hx_annotations_data_ids
      && chartData.hx_annotations_data_ids.length ? '%d/%m/%Y %H:%M' : undefined,
      type: chartData && chartData.hx_annotations_data_ids
      && chartData.hx_annotations_data_ids.length ? 'date' : 'categoty',
      title: chartData && chartData.title_x_axis ? chartData.title_x_axis : getSplitedString(xTitle),
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
  console.log(result);
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
          title: chartData && chartData.title_y_axis ? chartData.title_y_axis : chartValues.datasets[0].label,
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
          title: chartData && chartData.title_y_axis ? chartData.title_y_axis : chartValues.datasets[0].label,
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
        title: chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
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
        title: chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Count',
        hoverformat: ',',
        automargin: true,
        font: customData.globalfont,
      },
    };
  }
  /* if (chartData === 'ks_bar_chart') {
    result = {
      ...result,
      barmode: chartValues.datasets.length === 2 ? 'group' : 'stack',
    };
  } */
  result = {
    ...result,
    xaxis: {
      automargin: true,
      title: chartData && chartData.title_x_axis ? chartData.title_x_axis : getSplitedString(xTitle),
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
  const isMob = detectMob();
  return isMob ? `calc(${deValue ? '15' : '16'}px + ${respMobPx}vw)` : `${vw}vw`;// `calc(${vw}vw + ${vh}vh)`;
}

export function hexToBase64(str) {
  // first we use encodeURIComponent to get percent-encoded Unicode,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return decodeURIComponent(escape(window.atob(str)));
}

export function getTargetDateGroup(dateSeries) {
  let result = 'month';
  if (dateSeries === 'l_day' || dateSeries === 't_week' || dateSeries === 't_month' || dateSeries === 'ls_day' || dateSeries === 'ls_week' || dateSeries === 'ls_month' || dateSeries === 'l_week' || dateSeries === 'l_month') {
    result = 'day';
  }
  return result;
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
