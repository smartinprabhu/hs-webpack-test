import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, FormControl, Autocomplete, Divider,
  Button, IconButton,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { IoCloseOutline } from 'react-icons/io5';
import {
  CgExport,
} from 'react-icons/cg';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';

import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../util/appUtils';
import { updateHeaderData } from '../core/header/actions';
import DrawerHeader from './drawerHeader';


const ReportsFilterHeader = (props) => {

  const {
    Module, Menu, Link, HeaderData, reportOptions, onReset, showReset, report, setReport, loading, filterOpen, setFilterOpen, customDownload, setExportType, isExport, setExportTrue,
    setCustomDownload, excelOnly, pdfOnly, setShowExport2, showExportButton,
  } = props;
  let ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }];

  const { userRoles } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    Module,
  );

  let activeTab;
  let tabs;

  if (headerTabs && headerTabs.length) {
    tabs = getTabs(headerTabs[0].menu, HeaderData);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      Menu,
    );
  }

  const [open, setOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportOption, setExportOption] = useState(excelOnly ? { label: 'EXCEL', name: 'excel' } : ExportOptions[0]);

  useEffect(() => {
    if (excelOnly) {
      setExportOption({ label: 'EXCEL', name: 'excel' });
    }
  }, [excelOnly]);

  // useEffect(() => {
  //   if (pdfOnly) {
  //     setExportOption({ label: 'PDF', name: 'pdf' });
  //   }
  // }, [pdfOnly]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: Module,
        moduleName: Module,
        menuName: Menu,
        link: Link,
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  // useEffect(() => {
  //     if (reportOptions && reportOptions.length === 1) {
  //         setReport(reportOptions[0])
  //     }
  // }, [reportOptions])

  useEffect(() => {
    if (report && Object.keys(report).length > 0) {
      setFilterOpen(true);
    }
    if (excelOnly) {
      setExportOption({ label: 'EXCEL', name: 'excel' });
    }
  }, []);

  if (excelOnly) {
    ExportOptions = [{ label: 'EXCEL', name: 'excel' }];
  }

  const onDrawClose = () => {
    setShowExport(false);
    if (setShowExport2) {
      setShowExport2(false);
    }
  };

  const onExOpen = () => {
    setShowExport(true);
    if (setShowExport2) {
      setShowExport2(true);
    }
  };

  return (
    <>
      <Divider />
      <header className="header-box2">
        <div className="insights-filter-box">
          <FormControl sx={{ width: '150px' }}>
            <Autocomplete
              name="Reports"
              label="Reports"
              formGroupClassName="m-1"
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
                            // disabled={reportOptions && reportOptions.length === 1}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              disableClearable={!report}
              options={reportOptions}
              value={report}
              onChange={(e, option) => { setReport(option); setExportTrue(''); setExportType(''); if (setCustomDownload) setCustomDownload(''); setFilterOpen(true); }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding reports-autocomplete"
                  placeholder="Please Select The Report"
                  style={{ width: '500px', background: '#fff' }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <>{params.InputProps.endAdornment}</>,
                  }}
                />
              )}
            />
          </FormControl>
        </div>
        {report ? (
          <div className="insights-filter-box">
            {showReset() && (
            <IconButton className="header-filter-btn" onClick={onReset}>
              <IoCloseOutline size={25} style={{ marginRight: '3px' }} />
              Reset
            </IconButton>
            )}
            <IconButton
              className="header-filter-btn"
              onClick={() => setFilterOpen(true)}
              color="primary"
            >
              <FilterAltOutlinedIcon
                size={15}
                style={{ marginRight: '3px' }}
              />
              Filters
            </IconButton>
            {((isExport && isExport.show) || showExportButton()) && (
            <IconButton className="header-filter-btn" color="primary" onClick={() => onExOpen()}>
              <CgExport size={20} className="mb-1" />
              <span className="my-1 ml-1"> Export </span>
            </IconButton>
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
                onClose={() => onDrawClose()}
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
                disabled={loading}
                disableClearable={!(exportOption && exportOption.name)}
                value={exportOption}
                onChange={(e, option) => { setExportOption(option); }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={ExportOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Export"
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
              <div
                style={{
                  textAlign: 'center',
                  padding: loading ? '20px' : '0px',
                }}
              >
                {loading && (
                <CircularProgress color="primary" />
                )}
              </div>
              {customDownload ? (
                <>
                  {customDownload}
                </>
              ) : (
                <Button
                  onClick={() => {
                    if (exportOption.name === 'pdf') {
                      setExportType('pdf');
                      setExportTrue(Math.random());
                      setShowExport(false);
                      if (setShowExport2) {
                        setShowExport2(false);
                      }
                      setExportOption(ExportOptions[0]);
                    } else if (exportOption.name === 'excel') {
                      setExportType('excel');
                      setExportTrue(Math.random());
                      setShowExport(false);
                      if (setShowExport2) {
                        setShowExport2(false);
                      }
                      setExportOption(ExportOptions[0]);
                    }
                  }}
                  type="button"
                  variant="contained"
                  disabled={loading && exportOption && !exportOption.name}
                  className="header-export-btn"
                >
                  Download
                </Button>
              )}
            </Drawer>

          </div>
        ) : ''}
      </header>
    </>
  );
};
export default ReportsFilterHeader;
