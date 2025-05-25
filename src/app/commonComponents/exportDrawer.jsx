import React, { useState } from 'react';
import { TextField, Autocomplete, Button } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';

import DrawerHeader from './drawerHeader';

const ExportDrawer = (props) => {
  const {
    showExport,
    setShowExport,
    setExportTrue,
    isQR,
    setExportType,
    loading,
  } = props;
  let ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }];
  if (isQR) {
    ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }, { label: 'QR', name: 'qr' }];
  }
  const [exportOpen, setExportOpen] = useState(false);
  const [exportOption, setExportOption] = useState(ExportOptions[0]);

  return (
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
        disabled={loading}
        disableClearable={!exportOption.name}
        value={exportOption}
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
      <Button
        onClick={() => {
          if (exportOption.name === 'pdf') {
            setExportType('pdf');
            setExportTrue(Math.random());
            setShowExport(false);
            setExportOption('');
          } else if (exportOption.name === 'excel') {
            setExportType('excel');
            setExportTrue(Math.random());
            setShowExport(false);
            setExportOption('');
          } else if (exportOption.name === 'qr') {
            setExportType('qr');
            setExportTrue(Math.random());
            setShowExport(false);
            setExportOption('');
          }
        }}
        type="button"
        variant="contained"
        disabled={loading || (exportOption && !exportOption.name)}
        className="header-export-btn"
      >
        Download
      </Button>
    </Drawer>
  );
};
export default ExportDrawer;
