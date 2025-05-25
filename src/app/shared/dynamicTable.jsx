import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  GridToolbarExportContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridOverlay,
} from '@mui/x-data-grid-pro';
import MenuItem from '@mui/material/MenuItem';
import uniqBy from 'lodash/unionBy';
import { Row, Col } from 'reactstrap';
import {
  Input, FormControl,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import DataTable from '@shared/dataTable';
import { setSorting } from '../assets/equipmentService';
import { savePdfContent, getLocalTime, exportExcelTableToXlsx } from '../util/appUtils';

const DynamicTable = ({
  columnData,
  columns,
  loading,
  setViewId,
  setViewModal,
  onFilterChanges,
  page,
  rowCount,
  limit,
  handlePageChange,
  exportFileName,
  filters,
  setRows,
  rows,
  setStartExport,
  exportInfo,
  visibleColumns,
  setVisibleColumns,
  isForm,
}) => {
  const dispatch = useDispatch();

  const [excelColumnFields, setExcelColumnFields] = useState([]);

  const [searchValue, setSearchValue] = useState('');

  const { userInfo } = useSelector((state) => state.user);

  const [isButtonHover, setButtonHover] = useState(false);

  const currentDate = getLocalTime(new Date());
  const title = `${exportFileName}_On_${currentDate}`;
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  useEffect(() => {
    if (visibleColumns) {
      const array = [];
      columns.map((column) => {
        if (visibleColumns[column.field]) {
          array.push(column.field);
        }
      });
      setExcelColumnFields(array);
    }
  }, [visibleColumns]);

  const setSortingOrder = (data) => {
    if (data && data.length) {
      const obj = {
        sortBy: data[0].sort.toString().toUpperCase(),
        sortField: data[0].field,
      };
      dispatch(setSorting(obj));
    } else {
      dispatch(setSorting({}));
    }
  };

  const onRowClick = (params) => {
    setViewId(params.id);
    if (excelColumnFields && excelColumnFields.length) {
      setViewModal(true);
    }
  };

  const getTableHeaders = (header, property) => {
    const visibleColumnsField = excelColumnFields;
    const headers = [];
    visibleColumnsField.map((id) => {
      const findRowId = columns.find((column) => column.field === id);
      if (findRowId) {
        const obj = {};
        obj[header] = findRowId.headerName;
        obj[property] = findRowId.field;

        headers.push(obj);
      }
    });
    return headers;
  };

  const getTableData = () => {
    const { data } = exportInfo;
    const array = [];
    data && data.length && data.map((item) => {
      const row = {};
      row.id = item.id;
      excelColumnFields.forEach((field) => {
        const column = columns.find((columnField) => columnField.field === field);
        if (column) {
          row[field] = column && column.func ? column.func(item[field]) : item[field];
        }
        array.push(row);
      });
    });
    return uniqBy(array, 'id');
  };

  const onKeyEnter = (e) => {
    if (e.key === 'Enter') {
      onFilterChanges({ quickFilterValues: [e.target.value] });
    } else {
      setSearchValue(e.target.value);
      if (!e.target.value) {
        onFilterChanges({ quickFilterValues: [] });
      }
    }
  };

  const downloadPdf = () => {
    savePdfContent(`${exportFileName}`, getTableHeaders('header', 'dataKey'), getTableData(), `${title}.pdf`, companyName, filters);
  };

  const PdfExportMenuItem = (props) => {
    const { hideMenu } = props;
    return (
      <MenuItem
        onClick={() => {
          downloadPdf();
          hideMenu?.();
        }}
        disabled={(exportInfo.loading)}
      >
        Export PDF
      </MenuItem>
    );
  };
  const ExcelExportMenuItem = (props) => {
    const { hideMenu } = props;
    return (
      <MenuItem
        onClick={() => {
          exportExcelTableToXlsx('print_report', title);
          hideMenu?.();
        }}
        disabled={(exportInfo.loading)}
      >
        Export Excel
      </MenuItem>
    );
  };
  const CustomToolbar = () => (
    <Row>
      <Col sm="8" md="8" lg="8">

        {((columnData !== null) && (excelColumnFields && excelColumnFields.length)) ? (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExportContainer>
              <PdfExportMenuItem />
              <ExcelExportMenuItem />
            </GridToolbarExportContainer>
          </GridToolbarContainer>
        ) : (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
          </GridToolbarContainer>

        )}
      </Col>
      <Col sm="4" md="4" lg="4">
        <span className="float-right">
          <GridToolbarContainer>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormControl variant="standard">
                <Input
                  id="standard-adornment-password"
                  type="text"
                  name="search"
                  placeholder="Search"
                  autoFocus={isButtonHover}
                  value={searchValue}
                  onMouseLeave={() => setButtonHover(false)}
                  onMouseEnter={() => setButtonHover(true)}
                  onChange={(e) => onKeyEnter(e)}
                  onKeyDown={(e) => onKeyEnter(e)}
                  endAdornment={(
                    <InputAdornment position="end">
                      {searchValue && (
                        <>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => { setSearchValue(''); onFilterChanges({ quickFilterValues: [] }); }}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={() => onFilterChanges({ quickFilterValues: [searchValue] })}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </InputAdornment>
            )}
                />
              </FormControl>
            </div>
          </GridToolbarContainer>
        </span>
      </Col>
    </Row>
  );

  return (
    <>
      <Box sx={{ height: 700, width: '100%' }}>
        <DataGridPro
          rows={columnData && columnData.length ? columnData : []}
          columns={columns}
          onRowClick={(params) => onRowClick(params)}
          filterMode="server"
          onFilterModelChange={(data) => onFilterChanges(data)}
          loading={loading}
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay: () => <GridOverlay>No data found</GridOverlay>,
          }}
          onSortModelChange={(data) => setSortingOrder(data)}
          pageSize={limit}
          pagination
          disableSelectionOnClick
          rowCount={rowCount}
          rowsPerPageOptions={[10]}
          page={page}
          onSelectionModelChange={(data) => { setRows(data); setStartExport(Math.random()); }}
          selectionModel={rows}
          paginationMode="server"
          onPageChange={(newPage) => handlePageChange(newPage)}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
            },
            filterPanel: { linkOperators: ['and'] },
          }}
          checkboxSelection
          onColumnVisibilityModelChange={(data) => setVisibleColumns(data)}
          columnVisibilityModel={visibleColumns}
        />
      </Box>
      <div id="print_report" className="d-none">
        <table align="center">
          <tbody>
            <tr>
              <td>Company</td>
              <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
            </tr>
            <tr>
              <td>{filters && (<span>Filters</span>)}</td>
              <td><b>{filters}</b></td>
            </tr>
          </tbody>
        </table>
        <br />
        <DataTable columns={getTableHeaders('heading', 'property')} data={getTableData()} propertyAsKey="id" />
      </div>
    </>
  );
};
export default DynamicTable;
