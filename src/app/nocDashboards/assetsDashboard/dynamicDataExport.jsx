/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  Input, FormControl,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import fileMiniIcon from '@images/icons/fileMini.svg';
import { getLocalTime, getDefaultNoValue, getColumnArrayById } from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getExtraSelectionMultiple,
} from '../../helpdesk/ticketService';

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

const DynamicDataExport = React.memo((props) => {
  const {
    listName, modelName, domainData,
    onSearchChange, searchValue, onClear,
    onSearch,
  } = props;
  const dispatch = useDispatch();

  const [isShow, setIsShow] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const propertyAsKey = 'id';
  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;
  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
  const columns = customData && customData[modelName] ? customData[modelName] : [];

  useEffect(() => {
    setIsShow(false);
  }, []);

  useEffect(() => {
    if (modelName && totalDataCount && isShow) {
      dispatch(getExtraSelectionMultiple(false, modelName, totalDataCount, 0, fields, JSON.stringify(domainData)));
    }
  }, [isShow]);

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

  function showCustomizedLabel(item, col) {
    let value = '';
    if (typeof item[col.property] === 'object') {
      const array = item[col.property];
      // eslint-disable-next-line no-unused-vars
      const [id, name] = array;
      value = name;
    } else {
      value = getDefaultNoValue(item[col.property]);
    }
    return value;
  }

  useEffect(() => {
    if (listDataMultipleInfo && listDataMultipleInfo.data && isShow) {
      const currentDate = getLocalTime(new Date());
      const title = `${listName || ''} ${currentDate}`;
      exportTableToExcel(listName || 'print_report', title);
      setIsShow(false);
    }
  }, [listDataMultipleInfo]);

  const handleExcelExport = () => {
    setIsShow(true);
  };

  return (
    <>
      <div className="float-right mb-2">
        <FormControl variant="standard">
          <Input
            id="standard-adornment-password"
            type="text"
            name="search"
            placeholder="Search"
            value={searchValue}
            onChange={onSearchChange}
            onKeyDown={onSearchChange}
            endAdornment={(
              <InputAdornment position="end">
                {searchValue && (
                <>
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => onClear()}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={() => onSearch()}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </>
                )}
              </InputAdornment>
            )}
          />
        </FormControl>
        <Tooltip title="Export" placement="top">
          <img
            aria-hidden="true"
            id="Export"
            alt="Export"
            className="cursor-pointer mr-2 pointer-events-auto"
            disabled={loading}
            onClick={() => { handleExcelExport(); }}
            src={fileMiniIcon}
          />
        </Tooltip>
      </div>
      {(modelName) && (
        <div className="hidden-div" id={listName || 'print_report'}>
          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" align="left" width="100%">
            <thead>
              <tr>
                {columns && columns.map((col) => (
                  <th className="p-2 min-width-160 table-column" style={tabletdhead} key={Math.random()}>
                    <div className="font-weight-bold font-size-11">
                      {col.heading}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.map((item) => (
                <tr key={`${item[propertyAsKey]}-row`}>
                  {columns.map((col) => <td style={tabletd} key={`${item[propertyAsKey]}-${col.property}`}>{showCustomizedLabel(item, col)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
});

DynamicDataExport.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  listName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  domainData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  onSearchChange: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
  searchValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  onClear: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
  onSearch: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
};
export default DynamicDataExport;
