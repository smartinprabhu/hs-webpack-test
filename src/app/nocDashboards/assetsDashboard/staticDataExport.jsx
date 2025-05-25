/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';

import fileMiniIcon from '@images/icons/fileMini.svg';
import {
  getLocalTime, getDefaultNoValue, getCompanyTimezoneDate,
  checkIsDate,
} from '../../util/appUtils';

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

const StaticDataExport = React.memo((props) => {
  const {
    chartData, nextLevel, chartItems, tableDataExport, isLoading, showCustomizedLabel,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const chartValues = chartData && chartData.ks_chart_data && chartData.ks_dashboard_item_type !== 'ks_list_view' ? JSON.parse(chartData.ks_chart_data) : false;
  const tableValues = chartData && chartData.ks_list_view_data && chartData.ks_dashboard_item_type === 'ks_list_view' ? JSON.parse(chartData.ks_list_view_data) : false;

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          {assetData[i].data && assetData[i].data.length > 0 && assetData[i].data.map((tv) => (
            <td className="p-2" key={Math.random()} style={tabletd}>{checkIsDate(tv) ? getCompanyTimezoneDate(tv, userInfo, 'datetime') : getDefaultNoValue(tv)}</td>
          ))}
        </tr>,
      );
    }
    return tableTr;
  }

  function getTableRow(tableDataExport) {
    if (tableDataExport && tableDataExport.data) {
      const tableTr = [];
      tableDataExport && tableDataExport.data && tableDataExport.data.map((item) => {
        tableTr.push(
          <tr key={`${item.id}-row`}>
            {tableValues.label_fields && tableValues.label_fields.map((col) => (
              <td
                key={`${item.id}-${col}`}
                style={tabletd}
              >
                {showCustomizedLabel(item, col)}
              </td>
            ))}
          </tr>,
        );
      });
      return tableTr;
    }
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
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handleExcelExport = () => {
    const currentDate = getLocalTime(new Date());
    const title = `${chartData && chartData.name ? chartData.name : ''} ${currentDate}`;
    exportTableToExcel(chartData ? chartData.name : 'print_report', title);
  };

  return (
    <>
      <div className="float-right mb-0">
        <Tooltip title="Export" placement="top">
          <img
            disabled={isLoading}
            aria-hidden="true"
            id="Export"
            alt="Export"
            className={`cursor-pointer mr-2 ${isLoading ? 'opacity-50 pointer-events-none' : 'pointer-events-auto'}`}
            onClick={() => { handleExcelExport(); }}
            src={fileMiniIcon}
          />
        </Tooltip>
      </div>
      {(chartValues || tableValues) && (!nextLevel) && (
        <div className="hidden-div" id={chartData.name}>
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
            <thead>
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type !== 'ks_list_view' && (
                <tr>
                  {chartValues.labels && chartValues.labels.map((tl) => (
                    <th className="p-2 min-width-160 table-column" key={Math.random()}>
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
                getRow(chartValues.datasets ? chartValues.datasets : [])
              )}
              {chartData.ks_dashboard_item_type && chartData.ks_dashboard_item_type === 'ks_list_view' && (
                <>
                  {tableDataExport && tableDataExport.data === null ? (
                    getRow(tableValues && tableValues.data_rows ? tableValues.data_rows : [])
                  ) : (
                    getTableRow(tableDataExport)
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
      {(nextLevel && chartItems) && (
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
    </>
  );
});

StaticDataExport.propTypes = {
  nextLevel: PropTypes.oneOfType([
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
