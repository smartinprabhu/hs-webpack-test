/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ExcelCompanyLogo from '@shared/excelCompanyLogo';

import {
  getLocalTime, getDefaultNoValue, getCompanyTimezoneDateExportTime, checkIsDate,
  isJsonString, getJsonString, exportExcelTableToXlsx,
} from '../../util/appUtils';

import { getNumberValue } from '../utils/utils';

const tabletd = {

  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};
const tabletdhead = {

  border: '1px solid white',
  borderBottom: '1px solid #4ebbfb',
  fontSize: '17px',
  backgroundColor: '#4ebbfb',
  color: 'white',
  borderCollapse: 'collapse',
  textAlign: 'left',
  textTransform: 'uppercase',
  padding: '2px',
};

const tableHead = {

  border: '1px solid white',
  borderBottom: '1px solid #3a4354',
  fontSize: '17px',
  backgroundColor: '#3a4354',
  color: 'white',
  borderCollapse: 'collapse',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '2px',
};

const StaticDataExport = React.memo((props) => {
  const {
    chartData, columnIndex, sortOrder, isLoading, nextLevel, chartItems, noPagination, isDownload, isIOT, setExcelDownload, tableDataExport, showCustomizedLabel,
  } = props;
  // const chartData = chartDataStr && chartDataStr ? JSON.parse(chartDataStr) : false;
  const { userInfo } = useSelector((state) => state.user);
  const chartValues = chartData && chartData.ks_chart_data && chartData.ks_dashboard_item_type !== 'ks_list_view' ? JSON.parse(chartData.ks_chart_data) : false;
  const tableValues = chartData && chartData.ks_list_view_data && chartData.ks_dashboard_item_type === 'ks_list_view' ? JSON.parse(chartData.ks_list_view_data) : false;

  const isTablePie = isIOT ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).pie_show_format)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).pie_show_format);
  const isShowPerc = isIOT ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_table_percentage)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_table_percentage);

  const pieFormat = isTablePie && isTablePie ? isTablePie : false;
  const isPerc = !!(isShowPerc && isShowPerc === 'yes');

  const isNumberFormat = isIOT ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).number_format)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).number_format);
  const useNumberFormatPerc = isIOT ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).use_number_format_on_percentage)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).use_number_format_on_percentage);
  const numberFormat = isNumberFormat && isNumberFormat === 'integer' ? isNumberFormat : false;
  const useNumberFormat = useNumberFormatPerc && useNumberFormatPerc === 'yes' ? useNumberFormatPerc : false;

  const isCustomTable = pieFormat && (pieFormat === 'table' || pieFormat === 'table_chart');

  const [tableData, setTableData] = useState([]);

  const [tableDataExportData, setTableDataExport] = useState(tableDataExport);

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

  const getDetailData = (data) => {
    const newData = data.map((cl, index) => ({
      label: cl,
      value: chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data[index] ? formatCurrency(chartValues.datasets[0].data[index]) : 0,
      percentage: chartValues.datasets && chartValues.datasets.length && chartValues.datasets[0].data[index] && totalSum > 0 ? `${getPerc(totalSum, chartValues.datasets[0].data[index])}` : '0.0',
    }));
    return newData;
  };

  useEffect(() => {
    if (isCustomTable && chartValues && chartValues.labels) {
      const res = getDetailData(chartValues.labels);
      if (columnIndex && columnIndex === 1) {
        res.sort((a, b) => (sortOrder && sortOrder === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)));
      } else if (columnIndex && columnIndex === 2) {
        res.sort((a, b) => (sortOrder && sortOrder === 'asc' ? a.value - b.value : b.value - a.value));
      } else if (columnIndex && columnIndex === 3) {
        res.sort((a, b) => (sortOrder && sortOrder === 'asc' ? a.percentage - b.percentage : b.percentage - a.percentage));
      } else {
        res.sort((a, b) => (sortOrder && sortOrder === 'asc' ? a.value - b.value : b.value - a.value));
      }
      setTableData(res);
    }
  }, [chartData, columnIndex, sortOrder]);

  useEffect(() => {
    if (tableDataExport) {
      setTableDataExport(tableDataExport);
    }
  }, [tableDataExport]);

  function getRow(assetData, cd) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2" key={Math.random()} style={tabletd}>{getDefaultNoValue(assetData[i].label ? assetData[i].label : 'Count')}</td>
          {assetData[i].data && assetData[i].data.length > 0 && assetData[i].data.map((tv) => (
            <td className="p-2" key={Math.random()} style={tabletd}>{typeof tv === 'number' ? getNumberValue(tv) : checkIsDate(tv) ? getCompanyTimezoneDateExportTime(tv, userInfo, 'datetime') : getDefaultNoValue(tv)}</td>
          ))}
        </tr>,
      );
    }
    return tableTr;
  }

  function getTableRow(assetDataOld, cd) {
    const tableTr = [];
    const assetData = [...assetDataOld];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          {assetData[i].data && assetData[i].data.length > 0 && assetData[i].data.map((tv) => (
            <td className="p-2" key={Math.random()} style={tabletd}>{typeof tv === 'number' ? getNumberValue(tv) : checkIsDate(tv) ? getCompanyTimezoneDateExportTime(tv, userInfo, 'datetime') : getDefaultNoValue(tv)}</td>
          ))}
        </tr>,
      );
    }
    return tableTr;
  }

  function exportTableToExcel(tableID, fileTitle = '') {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        if (setExcelDownload) {
          setExcelDownload();
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handleExcelExport = () => {
    const currentDate = getLocalTime(new Date());
    const title = `${chartData && chartData.name ? chartData.name : ''} ${currentDate}`;
    exportExcelTableToXlsx(chartData ? chartData.name : 'print_report', title);
  };

  useEffect(() => {
    if (isDownload) {
      setTimeout(() => {
        handleExcelExport();
      }, 1000);
    }
  }, [isDownload]);

  return (
    <>
      {(chartValues || tableValues) && (!nextLevel) && !isCustomTable && (
        <div className="hidden-div" id={chartData.name}>
          <table align="center" style={{ textAlign: 'center' }}>
            <tbody>
              <ExcelCompanyLogo />
            </tbody>
          </table>
          <br />
          <table align="center">
            <tbody>
              <tr>
                <td>Company</td>
                <td colSpan={13}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
            </tbody>
          </table>
          <br />
          <table
            style={{ border: '1px solid #495057', borderCollapse: 'collapse' }}
            className="export-table1"
            align="center"
            width="100%"
          >
            <thead>
              <tr>
                <th
                  className="p-2 min-width-160"
                  colSpan={
          chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type === 'ks_list_view'
            ? tableValues?.label?.length || 0
            : chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type !== 'ks_list_view'
              ? (chartValues.labels?.length || 0) + 1
              : 10
        }
                  style={tableHead}
                >
                  {chartData.name}
                </th>
              </tr>
            </thead>
          </table>
          <br />
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
            <thead>
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type !== 'ks_list_view' && (
                <tr>
                  <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                    <div className="font-weight-bold font-size-11">
                      {chartData.title_x_axis ? chartData.title_x_axis : '#'}
                    </div>
                  </th>
                  {chartValues.labels && chartValues.labels.map((tl) => (
                    <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                      <div className="font-weight-bold font-size-11">
                        {tl}
                      </div>
                    </th>
                  ))}
                </tr>
              )}
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type === 'ks_list_view' && (
                <tr>
                  {tableValues && tableValues.label && tableValues.label.map((tl) => (
                    <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                      <div className="font-weight-bold font-size-11">
                        {tl}
                      </div>
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type !== 'ks_list_view' && (
                getRow(chartValues.datasets ? chartValues.datasets : [], chartData)
              )}
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type === 'ks_list_view' && !tableDataExportData && noPagination && !isLoading && (
                getTableRow(tableValues && tableValues.data_rows ? tableValues.data_rows : [], chartData)
              )}
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type === 'ks_list_view' && tableDataExportData && !noPagination && (
                <>
                  {tableDataExportData.map((item) => (
                    <tr key={`${item.id}-row`}>
                      {tableValues.label_fields && tableValues.label_fields.map((col, index) => (
                        <td
                          style={tabletd}
                          key={`${item.id}-${col}`}
                        >
                          {showCustomizedLabel(item, col, index)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {(nextLevel && chartItems) && !isCustomTable && (
        <div className="hidden-div" id={chartData.name}>
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
            <thead>
              {chartItems.labels && chartItems.labels.map((tl) => (
                <th className="p-2 min-width-160 table-column" key={Math.random()}>
                  <div className="font-weight-bold font-size-11">
                    {tl}
                  </div>
                </th>
              ))}
            </thead>
            <tbody>
              {getRow(chartItems.datasets ? chartItems.datasets : [])}
            </tbody>
          </table>
        </div>
      )}
      {isCustomTable && chartValues && (
        <div className="hidden-div" id={chartData.name}>
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
            <thead>
              <tr>
                <th className="p-2 min-width-160" colSpan="15" style={tableHead}>
                  {chartData.name}
                </th>
              </tr>
            </thead>
          </table>
          <br />
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
            <thead>
              <th className="p-2 min-width-160 table-column" style={tabletdhead}>
                {chartData && chartData.title_x_axis ? chartData.title_x_axis : 'Name'}
              </th>
              <th className="p-2 min-width-160 table-column" style={tabletdhead}>
                {chartData && chartData.title_y_axis ? chartData.title_y_axis : 'Value'}
              </th>
              {isPerc && (
              <th className="p-2 min-width-160 table-column" style={tabletdhead}>
                %
              </th>
              )}
            </thead>
            <tbody>
              {chartValues && tableData && tableData.map((lab, index) => (
                <tr key={lab}>
                  <td className="p-2" style={tabletd}>{lab.label}</td>
                  <td className="p-2" style={tabletd}>{lab.value}</td>
                  {isPerc && (
                  <td className="p-2" style={tabletd}>{lab.percentage}</td>
                  )}
                </tr>
              ))}
              <tr>
                <td className="p-2" style={tabletd}><b>Total</b></td>
                <td className="p-2" style={tabletd} align="right"><b>{formatCurrency(totalSum)}</b></td>
                {isPerc && (
                <td className="p-2" style={tabletd} align="right"><b>100</b></td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
});

StaticDataExport.propTypes = {
  nextLevel: PropTypes.oneOfType([
    PropTypes.bool,
  ]).isRequired,
  isDownload: PropTypes.oneOfType([
    PropTypes.bool,
  ]).isRequired,
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  chartItems: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};
export default StaticDataExport;
