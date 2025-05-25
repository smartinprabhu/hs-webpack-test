/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker, ConfigProvider } from 'antd';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
import {
  Drawer,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormGroup,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import SearchModalMultiple from '@shared/searchModals/multiSearchModelStatic';

import {
  getTypeId,
  getPPMVendorReport, resetPPMVendor,
} from '../../../ppmService';
import { setInitialValues } from '../../../../purchase/purchaseService';
import { getCustomGroup } from '../../../../inspectionSchedule/inspectionService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  getColumnArrayById,
  isAssociativeArray,
  getArrayToCommaValues,
  getDateAndTimeForPPMChecklistReports,
} from '../../../../util/appUtils';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterVendorReport = ({
  apiReportName,
  filterOpen,
  setFilterOpen,
  resetFilters,
  setResetFilters,
  setShowResetOption,
}) => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [date, changeDate] = useState(false);
  const [customFilters, setCustomFilters] = useState({
    vendorValue: [], date: [null, null],
  });

  const [vendorValue, setVendorValue] = useState([]);
  const [scheduleCollapse, setScheduleCollapse] = useState(true);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorOptions1, setVendorOptions1] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const {
    customDataGroup,
  } = useSelector((state) => state.inspection);

  const companies = getAllowedCompanies(userInfo);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
    dispatch(getTypeId({
      vendorValue, date,
    }));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getCustomGroup(companies, appModels.PPMWEEK, 'vendor_name', userInfo.data.id, userInfo.data.is_parent, false, false));
    }
  }, [userInfo]);

  useEffect(() => {
    if (customDataGroup && customDataGroup.data && customDataGroup.data.length && vendorOpen) {
      const newArrData = customDataGroup.data.map((cl) => ({
        ...cl,
        id: cl.vendor_name ? cl.vendor_name : '',
        name: cl.vendor_name ? cl.vendor_name : '',
      }));
      setVendorOptions(getArrayFromValuesById(newArrData, isAssociativeArray(vendorValue || []), 'id'));
    } else if (customDataGroup && customDataGroup.loading) {
      setVendorOptions([{ name: 'Loading...' }]);
    } else {
      setVendorOptions([]);
    }
  }, [customDataGroup, vendorOpen]);

  useEffect(() => {
    if (customDataGroup && customDataGroup.data && customDataGroup.data.length) {
      const newArrData = customDataGroup.data.map((cl) => ({
        ...cl,
        id: cl.vendor_name ? cl.vendor_name : '',
        name: cl.vendor_name ? cl.vendor_name : '',
      }));
      setVendorOptions1(getArrayFromValuesById(newArrData, isAssociativeArray([]), 'id'));
    } else if (customDataGroup && customDataGroup.loading) {
      setVendorOptions1([]);
    } else {
      setVendorOptions1([]);
    }
  }, [customDataGroup]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null) {
      dispatch(setInitialValues(false, false, false, false));
      let start = '';
      let end = '';
      const vendors = getColumnArrayById(customFilters.vendorValue, 'id');
      const weekObj = getDateAndTimeForPPMChecklistReports(userInfo, customFilters.date[0], customFilters.date[1]);
      if (date !== null) {
        start = weekObj[0];
        end = weekObj[1];
      }

      dispatch(getPPMVendorReport(start, end, vendors));
    }
  }, [userInfo, customFilters]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    dispatch(resetPPMVendor());
    dispatch(getTypeId({
      vendorValue, date: dates,
    }));
    dispatch(setInitialValues(false, false, false, false));
  };

  const onVendorChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(resetPPMVendor());
    setVendorValue(data);
    dispatch(getTypeId({
      vendorValue: data, date,
    }));
    dispatch(setInitialValues(false, false, false, false));
  };

  const onVendorChangeModal = (data) => {
    setVendorValue(data);
    dispatch(resetPPMVendor());
    dispatch(getTypeId({
      vendorValue: data, date,
    }));
    dispatch(setInitialValues(false, false, false, false));
  };

  const onScheduleClear = () => {
    setVendorValue([]);
    dispatch(resetPPMVendor());
    dispatch(getTypeId({
      vendorValue: [], date,
    }));
    setVendorOpen(false);
  };

  const showScheduleModal = () => {
    setFieldName('vendor_id');
    setExtraModal(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Vendors');
    setOldValues(vendorValue);
  };

  const handleResetClick = () => {
    setVendorValue([]);
    changeDate(false);
    dispatch(setInitialValues(false, false, false, false));
    dispatch(resetPPMVendor());
    dispatch(getTypeId({
      vendorValue: [], date: false,
    }));
  };

  moment.locale('en-gb', {
    week: {
      dow: 1, /// Date offset
    },
  });

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      setCustomFilters({
        vendorValue: [], date: [null, null],
      });
      handleResetClick();
      dispatch(resetPPMVendor());
    }
  }, [resetFilters]);

  const onApplyFilters = () => {
    setCustomFilters({
      vendorValue, date,
    });
    setFilterOpen(false);
    dispatch(resetPPMVendor());
  };

  const onCloseFilters = () => {
    dispatch(getTypeId({
      vendorValue, date: customFilters.date,
    }));
    // dispatch(resetPPMStatus());
    changeDate(customFilters.date);
    setVendorValue(customFilters.vendorValue);
    setFilterOpen(false);
  };

  useEffect(() => {
    if ((customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null)
      || (customFilters.vendorValue && customFilters.vendorValue > 0)) {
      setShowResetOption(true);
    }
  }, [customFilters]);

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY WEEK FILTER
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <ConfigProvider locale={locale}>
    <RangePicker
      onChange={onDateRangeChange}
            // format="YYYY-MM-DD"
      value={date}
      picker="week"
      size="small"
      className="mt-1 w-100"
    />
  </ConfigProvider>,
    },
    {
      title: 'BY VENDOR',
      component:
  <FormGroup>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledschedule"
      size="small"
      name="schedule"
      open={vendorOpen}
      value={vendorValue}
      onOpen={() => {
        setVendorOpen(true);
      }}
      onClose={() => {
        setVendorOpen(false);
      }}
      disableClearable={!(vendorValue.length)}
      onChange={(e, options, action, value) => onVendorChange(options, action, value)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={vendorOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          className={((vendorValue && vendorValue.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {customDataGroup && customDataGroup.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((vendorValue && vendorValue.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onScheduleClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showScheduleModal}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  </FormGroup>,
    },
  ];

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={!(date && date.length && date[0] !== null && date[1] !== null)}
        />
      </Drawer>
      <Dialog maxWidth="xl" open={extraModal}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              headers={headers}
              data={vendorOptions1}
              modalName={modalName}
              dataChange={onVendorChangeModal}
              oldValues={oldValues}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideFilterVendorReport;
