/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FormControl from '@mui/material/FormControl';
import Drawer from '@mui/material/Drawer';
import {
  TextField, Autocomplete,
  Button, IconButton,
} from '@mui/material';
import moment from 'moment';
import {
  CgExport,
} from 'react-icons/cg';

import ExcelCompanyLogo from '@shared/excelCompanyLogo';

import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  getLocalTime, getDefaultNoValue, exportPdf, isJsonString, getJsonString,
  getCompanyTimezoneDateExportTime, checkIsDate, exportExcelTableToXlsx,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import { getDataArryIn, getNumberValue } from '../utils/utils';
import { AddThemeColor } from '../../themes/theme';
import { useTheme } from '../../ThemeContext';

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
  const { themes } = useTheme();
  const {
    data, dataList, dashboardName, onImageExport, selectedDateTag, customDateValue, isDrill,
  } = props;
  const ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }, { label: 'Image', name: 'image' }];

  const [anchorEl, setAnchorEl] = React.useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportOption, setExportOption] = useState(ExportOptions[0]);
  const { userInfo } = useSelector((state) => state.user);

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
  const dataArray2 = dataArray1.sort((a, b) => a.sequence - b.sequence);
  const dataArray = dataArray2.filter((item) => item.ks_dashboard_item_type !== 'ks_tile' && item.ks_dashboard_item_type !== 'ks_kpi' && item.ks_dashboard_item_type !== 'ks_header');
  const dataArrayTiles = dataArray2.filter((item) => item.ks_dashboard_item_type === 'ks_tile' || item.ks_dashboard_item_type === 'ks_kpi');

  const chartValues = (chartData) => (chartData && chartData.ks_chart_data && chartData.ks_dashboard_item_type !== 'ks_list_view' && isJsonString(chartData.ks_chart_data) ? getJsonString(chartData.ks_chart_data) : false);
  const tableValues = (chartData) => (chartData && chartData.ks_list_view_data && chartData.ks_dashboard_item_type === 'ks_list_view' && isJsonString(chartData.ks_list_view_data) ? getJsonString(chartData.ks_list_view_data) : false);

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
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handleExcelExport = () => {
    exportExcelTableToXlsx(isDrill ? 'main-drill-table' : 'main-table', title);
    setAnchorEl(null);
  };

  const handleImageExport = () => {
    onImageExport();
    setAnchorEl(null);
  };

  const customDate1 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[0] && customDateValue[0] !== null ? moment(customDateValue[0]._d).format('DD-MMM-YYYY') : false;
  const customDate2 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[1] && customDateValue[1] !== null ? moment(customDateValue[1]._d).format('DD-MMM-YYYY') : false;

  const dateFilters = customData && customData.dateFiltersText && selectedDateTag && customData.dateFiltersText[selectedDateTag] ? customData.dateFiltersText[selectedDateTag] : 'All Time';

  const handlePdfExport = () => {
    exportPdf(title, isDrill ? 'dynamic-drill-dashboard' : 'dynamic-dashboard', isDrill ? 'action-drill-buttons' : 'action-buttons', 'flex', userInfo && userInfo.data ? userInfo.data.company.name : 'Company', dateFilters, selectedDateTag, customDate1, customDate2);
    setAnchorEl(null);
  };

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <IconButton className="header-filter-btn" onClick={() => setShowExport(true)}>
          <CgExport
            size={20}
            style={{ color: themes === 'light' ? 'black' : AddThemeColor({}).color }}
            className="mb-1"
          />
          <span className="mt-1 ml-1 pl-1 mb-1" style={{ color: themes === 'light' ? 'black' : AddThemeColor({}).color }}> Export </span>
        </IconButton>
      </FormControl>
      {dataArray && (
        <div className="hidden-div" id={isDrill ? 'main-drill-table' : 'main-table'}>
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
                <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>Date Filters</td>
                <td colSpan={15}>
                  <b>
                    {selectedDateTag && selectedDateTag === 'l_custom'
                      ? `Custom Date (${customDate1} to ${customDate2})`
                      : dateFilters}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
            <thead>
              <tr>
                <th className="p-2 min-width-160" colSpan="7" style={tableHead}>
                  {dashboardName}
                </th>
              </tr>
            </thead>
          </table>
          <br />
          <br />
          <br />
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
            <thead>
              <tr>
                {dataArrayTiles.length > 0 && dataArrayTiles.map((ct) => (
                  <th className="p-2 min-width-160 table-column" style={tabletdhead}>
                    {ct.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {dataArrayTiles.length > 0 && dataArrayTiles.map((ctd) => (
                  <td className="p-2" style={tabletd}>
                    {' '}
                    {ctd.ks_record_count}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <br />
          {dataArray.length > 0 && dataArray.map((cd) => (
            cd.ks_dashboard_item_type !== 'ks_tile' && cd.ks_dashboard_item_type !== 'ks_kpi' ? (
              <>
                <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
                  <thead>
                    <tr>
                      <th
                        className="p-2 min-width-160"
                        colSpan={cd.ks_dashboard_item_type && cd.ks_dashboard_item_type !== 'ks_list_view' ? chartValues(cd) && chartValues(cd).labels && chartValues(cd).labels.length + 1 : tableValues(cd) && tableValues(cd).label && tableValues(cd).label.length}
                        style={tableHead}
                      >
                        {cd.name}
                      </th>
                    </tr>
                  </thead>
                </table>
                <br />
                <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
                  <thead>
                    {cd.ks_dashboard_item_type && cd.ks_dashboard_item_type !== 'ks_list_view' && (
                      <tr>
                        <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                          <div className="font-weight-bold font-size-11">
                            {cd.title_x_axis ? cd.title_x_axis : '#'}
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
                      getRow(chartValues(cd) && chartValues(cd).datasets ? chartValues(cd).datasets : [], cd)
                    )}
                    {cd.ks_dashboard_item_type && cd.ks_dashboard_item_type === 'ks_list_view' && (
                      getTableRow(tableValues(cd) && tableValues(cd).data_rows ? tableValues(cd).data_rows : [], cd)
                    )}
                  </tbody>
                </table>
                <br />
                <br />
              </>
            ) : (
              <>
                <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="center" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 min-width-160" style={tabletdhead}>
                        {cd.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">
                        {' '}
                        {cd.ks_record_count}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
              </>
            )
          ))}
        </div>
      )}
      <Drawer
        PaperProps={{
          sx: { width: '25%' },
        }}
        anchor="right"
        open={showExport}
      >
        <DrawerHeader
          headerName="Export"
          onClose={() => setShowExport(false)}
        />
        <Autocomplete
          sx={{ padding: '0px 30px 0px 30px' }}
          name="Export"
          label="Export"
          formGroupClassName="m-1"
          open={exportOpen}
          size="small"
          onOpen={() => {
            setExportOpen(true);
          }}
          onClose={() => {
            setExportOpen(false);
          }}
          value={exportOption}
          disableClearable={!exportOption?.name}
          onChange={(e, option) => { setExportOption(option); }}
          getOptionSelected={(option, value) => option.label === value.label}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
          options={ExportOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select Format"
              className="without-padding"
              placeholder="Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Button
          onClick={() => {
            if (exportOption.name === 'pdf') {
              handlePdfExport();
              setShowExport(false);
              setExportOption('');
            } else if (exportOption.name === 'excel') {
              handleExcelExport();
              setShowExport(false);
              setExportOption('');
            } else if (exportOption.name === 'image') {
              handleImageExport();
              setShowExport(false);
              setExportOption('');
            }
          }}
          type="button"
          disabled={exportOption && !exportOption.name}
          className="header-export-btn"
          variant="contained"
        >
          Download
        </Button>
      </Drawer>
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
