/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import {
  Typography,
  IconButton,
} from '@mui/material';

import PageLoader from '@shared/pageLoader';
import MuiTooltip from '@shared/muiTooltip';

import BarChartComponent from './barChartComponent';

import { isJsonString, getJsonString } from '../../util/appUtils';

const GetPieChart = (props) => {
  const {
    chartId,
    height,
    showModal,
    isShowModal,
    chartValues,
    onChartItemClickPoint,
    loading,
    chartItemType,
    drillDownCharts,
    divHeight,
    customHeight,
    chartItemValues,
    dType,
    datasets,
    chartData,
    isIot,
    setTableOrder1,
    setTableIndex1,
  } = props;

  const isNumberFormat = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).number_format)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).number_format);
  const useNumberFormatPerc = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).use_number_format_on_percentage)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).use_number_format_on_percentage);
  const numberFormat = isNumberFormat && isNumberFormat === 'integer' ? isNumberFormat : false;
  const useNumberFormat = useNumberFormatPerc && useNumberFormatPerc === 'yes' ? useNumberFormatPerc : false;

  const getToFixedTotal = (w) => {
    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    return numberFormat ? total && parseInt(total) : total && total.toFixed(2);
  };

  const getTooltipValue = (val, opts) => {
    const res = opts.globals && opts.globals.seriesPercent && opts.globals.seriesPercent[opts.dataPointIndex] ? opts.globals.seriesPercent[opts.dataPointIndex][0] : 0;
    return numberFormat ? res && `${parseInt(val)} (${parseInt(res)}%)` : res && `${parseFloat(val).toFixed(2)} (${parseFloat(res).toFixed(2)}%)`;
  };

  const [tableOrder, setTableOrder] = useState('desc');
  const [tableData, setTableData] = useState([]);
  const [tableIndex, setTableIndex] = useState(0);

  const totalSum = chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data ? chartValues.datasets[0].data.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : 0;

  function getPerc(total, given) {
    return numberFormat && useNumberFormat ? parseInt((parseInt(given) / total) * 100) : ((parseInt(given) / total) * 100).toFixed(2);
  }

  const formatCurrency = (number, prefix = '', suffix = '') => {
    // Add thousands separator
    let formattedNumber1 = number ? parseFloat(number).toFixed(2) : 0;

    if (numberFormat) {
      formattedNumber1 = number ? parseInt(number) : 0;
    }

    const formattedNumber = formattedNumber1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  const parseCurrency = (formattedString) => {
    // Remove prefix if it exists
    const formattedNumber1 = formattedString ? formattedString.replace(/,/g, '') : 0;

    let res = formattedNumber1 ? parseFloat(formattedNumber1) : 0.00;

    if (numberFormat) {
      res = formattedNumber1 ? parseInt(formattedNumber1) : 0;
    }

    // Return the number
    return res;
  };

  const getDetailData = (data) => {
    const newData = data.map((cl, index) => ({
      label: cl,
      value: chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data[index] ? chartValues.datasets[0].data[index] : 0,
      percentage: chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data[index] && totalSum > 0 ? `${getPerc(totalSum, chartValues.datasets[0].data[index])}` : '0.0',
    }));
    return newData;
  };

  const isExpand = !!(showModal || isShowModal);

  useEffect(() => {
    if (isExpand && chartValues && chartValues.labels) {
      const res = getDetailData(chartValues.labels);
      setTableData(res.sort((a, b) => (b.value - a.value)));
      if (tableIndex && tableIndex === 1) {
        res.sort((a, b) => (tableOrder === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)));
      } else if (tableIndex && tableIndex === 2) {
        res.sort((a, b) => (tableOrder === 'asc' ? a.value - b.value : b.value - a.value));
      } else if (tableIndex && tableIndex === 3) {
        res.sort((a, b) => (tableOrder === 'asc' ? a.percentage - b.percentage : b.percentage - a.percentage));
      } else {
        res.sort((a, b) => (tableOrder === 'asc' ? a.value - b.value : b.value - a.value));
      }
    }
  }, [showModal, isShowModal, chartValues]);

  const isDataLabel = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_datalabel === 'true')) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_datalabel === 'true');

  const isTablePie = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).pie_show_format)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).pie_show_format);

  const isShowPerc = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_table_percentage)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_table_percentage);

  const isFontSize = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).table_font_size)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).table_font_size);

  const pieFormat = isTablePie && isTablePie ? isTablePie : false;
  const tableFont = isFontSize && isFontSize ? isFontSize : false;
  const isPerc = !!(isShowPerc && isShowPerc === 'yes');

  const pieChartFixedTotal = (val) => (numberFormat ? parseInt(val) : val.toFixed(2));

  const getOriginalValue = (val, opts) => `${numberFormat ? parseInt(opts.w.config.series[opts.seriesIndex]) : opts.w.config.series[opts.seriesIndex].toFixed(2)} (${val.toFixed(
    0,
  )}%)`;

  const sortOrders = {};
  const sortOrders1 = {};

  function sortTable(tableId, columnIndex) {
    if (isExpand) {
      const res = tableData;
      const sortOrder = tableOrder === 'desc' ? 'asc' : 'desc';
      // sortOrders1[columnIndex] = sortOrder;

      setTableOrder(sortOrder);
      setTableOrder1(sortOrder);
      setTableIndex(columnIndex);
      setTableIndex1(columnIndex);
      if (columnIndex === 1) {
        res.sort((a, b) => (sortOrder === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)));
      } else if (columnIndex === 2) {
        res.sort((a, b) => (sortOrder === 'asc' ? a.value - b.value : b.value - a.value));
      } else {
        res.sort((a, b) => (sortOrder === 'asc' ? a.percentage - b.percentage : b.percentage - a.percentage));
      }
      setTableData(res);
    } else {
      const table = document.getElementById(tableId);
      const tbody = !isExpand ? table.querySelector('tbody') : document.getElementById('tbody-expand');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Exclude the last row from sorting
      const rowsToSort = rows.slice(0, -1);

      let sortOrder = sortOrders[columnIndex] === 'desc' ? 'asc' : 'desc';
      sortOrders[columnIndex] = sortOrder;

      if (isExpand) {
        sortOrder = sortOrders1[columnIndex] === 'desc' ? 'asc' : 'desc';
        sortOrders1[columnIndex] = sortOrder;
      }

      setTableOrder(sortOrder);
      setTableOrder1(sortOrder);
      setTableIndex(columnIndex);
      setTableIndex1(columnIndex);

      if (columnIndex === 1) {
        rowsToSort.sort((a, b) => {
          const aValue = a.cells[columnIndex].textContent.trim();
          const bValue = b.cells[columnIndex].textContent.trim();
          return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        });
      } else if (columnIndex === 2) {
        rowsToSort.sort((a, b) => {
          const aValue = parseCurrency(a.cells[columnIndex].textContent.trim());
          const bValue = parseCurrency(b.cells[columnIndex].textContent.trim());
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });
      } else {
        rowsToSort.sort((a, b) => {
          const aValue = a.cells[columnIndex].textContent.trim();
          const bValue = b.cells[columnIndex].textContent.trim();
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });
      }

      tbody.innerHTML = ''; // Clear the table body

      rowsToSort.forEach((row) => {
        tbody.appendChild(row); // Re-add sorted rows to the table body
      });

      // Add the last row back to the end of the table body
      tbody.appendChild(rows[rows.length - 1]);
    }
  }

  useEffect(() => {
    if (!isExpand && chartValues && chartValues.labels && pieFormat && (pieFormat === 'table' || pieFormat === 'table_chart')) {
      setTimeout(() => {
        sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 2);
      }, 1000);
    }
  }, [isExpand, chartData]);

  function getColorIndex(label) {
    const data = chartValues && chartValues.labels;
    const index = data.findIndex((obj) => (obj === label));
    return index;
  }

  const ogHeight = !isIot ? customHeight * 28 : customHeight * 25;
  const adjHeight = isIot ? 3 : 3;

  return (
    <>
      {!chartId && (pieFormat && (pieFormat === 'table' || pieFormat === 'table_chart')) && (
        <div style={pieFormat && pieFormat === 'table_chart' ? { display: 'flex', justifyContent: 'space-evenly' } : {}}>
          {(!pieFormat || (pieFormat === 'table_chart' || pieFormat === 'chart')) && (
          <div style={pieFormat && pieFormat === 'table_chart' ? { width: '50%' } : {}}>
            <Chart
              type={
            chartData.ks_dashboard_item_type === 'ks_doughnut_chart'
              ? 'donut'
              : 'pie'
          }
              height={isExpand ? '100%' : ogHeight}
              series={
            chartValues.datasets && chartValues.datasets.length
              ? chartValues.datasets[0].data
              : []
          }
              options={{
                chart: {
                  events: {
                    dataPointSelection: (event, chartContext, config) => onChartItemClickPoint(config),
                  },
                },
                legend: {
                  show: !!(!pieFormat || (pieFormat && pieFormat === 'chart')),
                  position: 'bottom',
                },
                dataLabels: {
                  enabled: !!isDataLabel,
                  formatter: (val, opts) => getOriginalValue(val, opts),
                  style: {
                    fontSize: `${height + 3}px`,
                  },
                  background: {
                    enabled: true,
                    foreColor: '#000000',
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: '#fff',
                    opacity: 0.9,
                    dropShadow: {
                      enabled: false,
                      top: 1,
                      left: 1,
                      blur: 1,
                      color: '#000',
                      opacity: 0.45,
                    },
                  },
                  dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.45,
                  },
                },
                labels: chartValues.labels,
                colors: chartValues.colors,
                tooltip: {
                  enabled: true,
                  y: {
                    formatter: (val, opts) => getTooltipValue(val, opts),
                  },
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: !!(!pieFormat || (pieFormat && pieFormat === 'chart')),
                        total: {
                          formatter: (w) => getToFixedTotal(w),
                          show: !!(!pieFormat || (pieFormat && pieFormat === 'chart')),
                          showAlways: !!(!pieFormat || (pieFormat && pieFormat === 'chart')),
                          fontWeight: 600,
                          fontSize: `${height + 3}px`,
                          color: '#ffffff',
                        },
                        value: {
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: `${height + 3}px`,
                        },
                      },
                    },
                  },
                },
              }}
            />
          </div>
          )}
          {pieFormat && (pieFormat === 'table_chart' || pieFormat === 'table') && (
          <div className="max-drawer-height thin-scrollbar" style={pieFormat && pieFormat === 'table_chart' ? { width: '50%', overflow: 'auto', height: isExpand ? '450px' : `${ogHeight - adjHeight}px` } : { overflow: 'auto', height: isExpand ? '450px' : `${ogHeight - adjHeight}px` }}>
            <table id={isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`} className="mb-0 font-weight-400 border-0 assets-table font-family-tab" width="100%" style={{ fontSize: tableFont || `${height + 3}px` }}>
              <thead style={{ borderBottom: '3px solid #dee2e6' }}>
                <tr>
                  <th className="p-1" />
                  <th className="p-1">
                    {chartData && chartData.title_x_axis ? chartData.title_x_axis : 'Name'}
                    {tableIndex === 1 && tableOrder === 'asc' ? (
                      <MuiTooltip title={<Typography>Ascending</Typography>}>
                        <IconButton
                          onClick={() => sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 1)}
                          className="ml-1 p-0 cursor-pointer"
                        >
                          <ArrowUpwardIcon
                            fontSize="small"

                          />
                        </IconButton>
                      </MuiTooltip>
                    ) : (
                      <MuiTooltip title={<Typography>Decending</Typography>}>
                        <IconButton
                          onClick={() => sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 1)}
                          className="ml-1 p-0 cursor-pointer"
                        >
                          <ArrowDownwardIcon
                            fontSize="small"

                          />
                        </IconButton>
                      </MuiTooltip>
                    )}
                  </th>
                  <th align="right" className="pl-2 pr-2 text-right">
                    {chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Value'}
                    {tableIndex === 2 && tableOrder === 'asc' ? (
                      <MuiTooltip title={<Typography>Ascending</Typography>}>
                        <IconButton
                          onClick={() => sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 2)}
                          className="ml-1 p-0 cursor-pointer"
                        >
                          <ArrowUpwardIcon
                            fontSize="small"

                          />
                        </IconButton>
                      </MuiTooltip>
                    ) : (
                      <MuiTooltip title={<Typography>Decending</Typography>}>
                        <IconButton
                          onClick={() => sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 2)}
                          className="ml-1 p-0 cursor-pointer"
                        >
                          <ArrowDownwardIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </MuiTooltip>
                    )}
                  </th>
                  {isPerc && (
                  <th align="right" className="p-1 text-right">
                    %
                    {tableIndex === 3 && tableOrder === 'asc' ? (
                      <MuiTooltip title={<Typography>Ascending</Typography>}>
                        <IconButton
                          onClick={() => sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 3)}
                          className="ml-1 p-0 cursor-pointer"
                        >
                          <ArrowUpwardIcon
                            fontSize="small"

                          />
                        </IconButton>
                      </MuiTooltip>

                    ) : (

                      <MuiTooltip title={<Typography>Decending</Typography>}>
                        <IconButton
                          onClick={() => sortTable(isExpand ? `${chartData.id}-table-expand` : `${chartData.id}-table`, 3)}
                          className="ml-1 p-0 cursor-pointer"
                        >
                          <ArrowDownwardIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </MuiTooltip>
                    )}
                  </th>
                  )}
                </tr>
              </thead>
              {isExpand ? (
                <tbody id={isExpand ? 'tbody-expand' : ''}>
                  {chartValues && tableData.map((lab, index) => (
                    <tr>
                      <td>
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{ color: chartValues && chartValues.colors && chartValues.colors[getColorIndex(lab.label)] ? chartValues.colors[getColorIndex(lab.label)] : 'black' }}
                        />
                      </td>
                      <td>{lab.label}</td>
                      <td align="right" className="pl-2 pr-2">
                        {formatCurrency(lab.value)}
                      </td>
                      {isPerc && (
                      <td align="right">
                        {lab.percentage}
                      </td>
                      )}
                    </tr>
                  ))}
                  <tr style={{ borderTop: '3px solid #dee2e6' }} className="no-sort">
                    <td />
                    <td><b>Total</b></td>
                    <td align="right"><b>{formatCurrency(totalSum)}</b></td>
                    {isPerc && (
                    <td align="right"><b>100</b></td>
                    )}
                  </tr>
                </tbody>
              ) : (
                <tbody id={isExpand ? 'tbody-expand' : ''}>
                  {chartValues && chartValues.labels.map((lab, index) => (
                    <tr>
                      <td>
                        <FiberManualRecordIcon
                          fontSize="small"
                          sx={{ color: chartValues && chartValues.colors && chartValues.colors[index] ? chartValues.colors[index] : 'black' }}
                        />
                      </td>
                      <td>{lab}</td>
                      <td align="right" className="pl-2 pr-2">
                        {chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data[index] ? formatCurrency(chartValues.datasets[0].data[index]) : 0}
                      </td>
                      {isPerc && (
                      <td align="right">
                        {chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data[index] && totalSum > 0 ? `${getPerc(totalSum, chartValues.datasets[0].data[index])}` : '0.0'}
                      </td>
                      )}
                    </tr>
                  ))}
                  <tr style={{ borderTop: '3px solid #dee2e6' }} className="no-sort">
                    <td />
                    <td><b>Total</b></td>
                    <td align="right"><b>{formatCurrency(totalSum)}</b></td>
                    {isPerc && (
                    <td align="right"><b>100</b></td>
                    )}
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          )}
        </div>
      )}
      {!chartId && (!pieFormat || (pieFormat && pieFormat === 'chart')) && (
      <Chart
        type={
            chartData.ks_dashboard_item_type === 'ks_doughnut_chart'
              ? 'donut'
              : 'pie'
          }
        height={showModal || isShowModal ? '100%' : ogHeight}
        series={
            chartValues.datasets && chartValues.datasets.length
              ? chartValues.datasets[0].data
              : []
          }
        options={{
          chart: {
            events: {
              dataPointSelection: (event, chartContext, config) => onChartItemClickPoint(config),
            },
          },
          legend: {
            position: 'bottom',
          },
          dataLabels: {
            enabled: !!isDataLabel,
            formatter: (val, opts) => getOriginalValue(val, opts),
            style: {
              fontSize: `${height + 3}px`,
            },
            background: {
              enabled: true,
              foreColor: '#000000',
              padding: 4,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: '#fff',
              opacity: 0.9,
              dropShadow: {
                enabled: false,
                top: 1,
                left: 1,
                blur: 1,
                color: '#000',
                opacity: 0.45,
              },
            },
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: '#000',
              opacity: 0.45,
            },
          },
          labels: chartValues.labels,
          colors: chartValues.colors,
          tooltip: {
            enabled: true,
            y: {
              formatter: (val, opts) => getTooltipValue(val, opts),
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: chartData.ks_dashboard_item_type !== 'ks_doughnut_chart',
                  total: {
                    formatter: (w) => getToFixedTotal(w),
                    show: true,
                    showAlways: true,
                    fontWeight: 600,
                    fontSize: `${height + 3}px`,
                    color: '#ffffff',
                  },
                  value: {
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: `${height + 3}px`,
                  },
                },
              },
            },
          },
        }}
      />
      )}
      {chartId && loading && (
      <PageLoader type="chart" />
      )}
      {chartId && drillDownCharts.includes(chartItemType) && (
        <BarChartComponent
          isHorizontal={chartItemType === 'ks_horizontalBar_chart'}
          expand={false}
          dType={dType}
          height={height}
          divHeight={divHeight}
          boxClass="vertical-bar-chart-box"
          chartData={chartData}
          handleExpand={{}}
          xTitle=""
          yTitle="Count"
          isExpand={!!(showModal || isShowModal)}
          datasets={datasets}
          labels={chartItemValues.labels}
          drillDownFunc={onChartItemClickPoint}
        />
      )}
      {chartId
        && (chartItemType === 'ks_pie_chart'
          || chartItemType === 'ks_doughnut_chart') && (
          <Chart
            type={chartItemType === 'ks_doughnut_chart' ? 'donut' : 'pie'}
            height={showModal || isShowModal ? '100%' : ogHeight}
            series={
              chartItemValues.datasets && chartItemValues.datasets.length
                ? chartItemValues.datasets[0].data
                : []
            }
            options={{
              chart: {
                events: {
                  dataPointSelection: (event, chartContext, config) => onChartItemClickPoint(config),
                },
              },
              legend: {
                position: 'bottom',
              },
              dataLabels: {
                enabled: !!isDataLabel,
                formatter: (val, opts) => getOriginalValue(val, opts),
              },
              labels: chartValues.labels,
              colors: chartValues.colors,
              tooltip: {
                enabled: true,
                y: {
                  formatter: (val, opts) => getTooltipValue(val, opts),
                },
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: chartData.ks_dashboard_item_type !== 'ks_doughnut_chart',
                      total: {
                        formatter: (w) => getToFixedTotal(w),
                        show: true,
                        showAlways: true,
                        fontWeight: 600,
                        fontSize: `${height + 3}px`,
                        color: '#ffffff',
                      },
                      value: {
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: `${height + 3}px`,
                      },
                    },
                  },
                },
              },
            }}
          />
      )}
    </>
  );
};

export default GetPieChart;
