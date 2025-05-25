/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import {
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { getLocalTime, getDefaultNoValue, exportPdf } from '../../util/appUtils';
import { getDataArryIn } from '../utils/utils';

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
    data, dataList, dashboardName, onImageExport,
    pdfId,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(false);
  const currentDate = getLocalTime(new Date());
  const title = `${dashboardName} ${currentDate}`;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const arrGrids = dataList ? JSON.parse(dataList) : [];
  const dataIds = Object.keys(arrGrids);
  const dataArray1 = getDataArryIn(data || [], dataIds);
  const dataArray = dataArray1.sort((a, b) => a.sequence - b.sequence);

  const chartValues = (chartData) => (chartData && chartData.ks_chart_data && chartData.ks_dashboard_item_type !== 'ks_list_view' ? JSON.parse(chartData.ks_chart_data) : false);
  const tableValues = (chartData) => (chartData && chartData.ks_list_view_data && chartData.ks_dashboard_item_type === 'ks_list_view' ? JSON.parse(chartData.ks_list_view_data) : false);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2" key={Math.random()} style={tabletd}>{getDefaultNoValue(assetData[i].label ? assetData[i].label : 'Count')}</td>
          {assetData[i].data && assetData[i].data.length > 0 && assetData[i].data.map((tv) => (
            <td className="p-2" key={Math.random()} style={tabletd}>{getDefaultNoValue(tv)}</td>
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
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handleExcelExport = () => {
    exportTableToExcel(pdfId ? 'main-table-drill' : 'main-table', title);
    setAnchorEl(null);
  };

  const handleImageExport = () => {
    onImageExport();
    setAnchorEl(null);
  };

  const handlePdfExport = () => {
    exportPdf(title, pdfId || 'dynamic-dashboard', pdfId ? 'action-buttons-drill' : 'action-buttons');
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Export" placement="top">
        <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={handleClick} icon={faFile} />
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleExcelExport}>Excel</MenuItem>
        <MenuItem onClick={handlePdfExport}>PDF</MenuItem>
        <MenuItem onClick={handleImageExport}>Image</MenuItem>
      </Menu>
      {dataArray && (
        <div className="hidden-div" id={pdfId ? 'main-table-drill' : 'main-table'}>
            {dataArray.length > 0 && dataArray.map((cd) => (
              cd.ks_dashboard_item_type !== 'ks_tile' && cd.ks_dashboard_item_type !== 'ks_kpi' ? (
                <>
                  <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
                    <th className="p-2 min-width-160" style={tabletdhead}>
                      {cd.name}
                    </th>
                  </table>
                  <br />
                  <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
                    <thead>
                      {cd.ks_dashboard_item_type && cd.ks_dashboard_item_type !== 'ks_list_view' && (
                      <tr>
                        <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                          <div className="font-weight-bold font-size-11">
                            {cd.x_axis_label}
                          </div>
                        </th>
                        {chartValues(cd) && chartValues(cd).labels && chartValues(cd).labels.map((tl) => (
                          <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                            <div className="font-weight-bold font-size-11">
                              {tl}
                            </div>
                          </th>
                        ))}
                      </tr>
                      )}
                      {cd.ks_dashboard_item_type && cd.ks_dashboard_item_type === 'ks_list_view' && (
                      <tr>
                        {tableValues(cd) && tableValues(cd).label && tableValues(cd).label.map((tl) => (
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
                      {cd.ks_dashboard_item_type && cd.ks_dashboard_item_type !== 'ks_list_view' && (
                        getRow(chartValues(cd) && chartValues(cd).datasets ? chartValues(cd).datasets : [])
                      )}
                      {cd.ks_dashboard_item_type && cd.ks_dashboard_item_type === 'ks_list_view' && (
                        getRow(tableValues(cd) && tableValues(cd).data_rows ? tableValues(cd).data_rows : [])
                      )}
                    </tbody>
                  </table>
                  <br />
                  <br />
                </>
              ) : (
                <>
                  <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
                    <tr>
                      <th className="p-2 min-width-160" style={tabletdhead}>
                        {cd.name}
                      </th>
                      <th className="p-2 min-width-160" style={tabletdhead}>
                        {cd.ks_record_count}
                      </th>
                    </tr>
                  </table>
                  <br />
                </>
              )
            ))}
        </div>
      )}
    </>
  );
});

StaticDataExport.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  dataList: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  dashboardName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  onImageExport: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
};
export default StaticDataExport;
