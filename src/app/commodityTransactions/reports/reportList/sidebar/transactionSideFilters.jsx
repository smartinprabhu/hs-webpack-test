/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  FormFeedback, FormGroup
  ,
} from 'reactstrap';
import {
  CircularProgress,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,

  Autocomplete,
  Box,
  Drawer,
  IconButton,
  TextField,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  getTypeId,
} from '../../../../preventiveMaintenance/ppmService';
import { getPartners } from '../../../../assets/equipmentService';
import { getTransactionRoomData, resetTransactionRoomReport, getCommodity } from '../../../tankerService';
import { resetExtraMultipleList } from '../../../../helpdesk/ticketService';
import {
  getAllowedCompanies, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById, generateErrorMessage, getDateAndTimeForDifferentTimeZones, defaultTimeZone,
} from '../../../../util/appUtils';
import SearchModalSingle from './searchModalSingle';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const TransactionSideFilters = ({
  filterOpen, setFilterOpen, resetFilters, setResetFilters, setShowResetOption,
}) => {
  const dispatch = useDispatch();
  const [date, changeDate] = useState([null, null]);
  const [datesValue, setDatesValue] = useState([]);
  const [commodityOpen, setCommodityOpen] = useState(false);
  const [commodityKeyword, setCommodityKeyword] = useState('');
  const [commodityOptions, setCommodityOptions] = useState([]);
  const [commodityValue, setCommodityValue] = useState([]);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorValue, setVendorValue] = useState([]);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [date1, changeDate1] = useState([null, null]);
  const [customFilters, setCustomFilters] = useState({
    vendorValue: [],
    date: [null, null],
    date1: [null, null],
    commodityValue: [],
  });

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    commodityInfo,
  } = useSelector((state) => state.tanker);

  const { partnersInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(getTypeId({
      date, date1, commodityValue, vendorValue,
    }));
    dispatch(resetTransactionRoomReport());
  }, []);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && commodityOpen) {
        await dispatch(getCommodity(companies, appModels.TANKERCOMMODITY, commodityKeyword));
      }
    })();
  }, [userInfo, commodityKeyword, commodityOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  useEffect(() => {
    if (commodityInfo && commodityInfo.data && commodityInfo.data.length && commodityOpen) {
      setCommodityOptions(getArrayFromValuesById(commodityInfo.data, isAssociativeArray(commodityValue || []), 'id'));
    } else if (commodityInfo && commodityInfo.loading) {
      setCommodityOptions([{ name: 'Loading...' }]);
    } else {
      setCommodityOptions([]);
    }
  }, [commodityInfo, commodityOpen]);

  useEffect(() => {
    if (partnersInfo && partnersInfo.data && partnersInfo.data.length && vendorOpen) {
      setVendorOptions(getArrayFromValuesById(partnersInfo.data, isAssociativeArray(vendorValue || []), 'id'));
    } else if (partnersInfo && partnersInfo.loading) {
      setVendorOptions([{ name: 'Loading...' }]);
    } else {
      setVendorOptions([]);
    }
  }, [partnersInfo, vendorOpen]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && (date && date[0] && date[0] !== null)) {
      const appModel = 'tanker.transactions';
      let start = '';
      let end = '';
      let start1 = '';
      let end1 = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      const commodityValues = getColumnArrayById(commodityValue, 'id');
      const vendorValues = getColumnArrayById(vendorValue, 'id');

      const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0].$d, date[1].$d);
      start = dateRangeObj[0];
      end = dateRangeObj[1];

      if (date1 && date1.length && date1[0] && date1[0] !== null) {
        const dateRangeObj1 = getDateAndTimeForDifferentTimeZones(userInfo, date1[0].$d, date1[1].$d);
        start1 = dateRangeObj1[0];
        end1 = dateRangeObj1[1];
      }
      dispatch(getTransactionRoomData(companies, appModel, start, end, start1, end1, commodityValues, vendorValues));
    }
  }, [userInfo, customFilters]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
  };

  const onDateRangeChange1 = (dates) => {
    changeDate1(dates);
  };

  const disabledDate = (current) => {
    const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 365;
    const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 365;
    const overall = tooLate || (tooEarly || (current && current > moment().endOf('day')));
    return datesValue && datesValue.length ? overall : (current && current > moment().endOf('day'));
  };

  const showCommodityModal = () => {
    setModelValue(appModels.TANKERCOMMODITY);
    setFieldName('commodity');
    setModalName('Commodity');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name']);
  };

  const onCommodityChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setCommodityValue(data);
  };

  const onCommodityClear = () => {
    setCommodityKeyword('');
    setCommodityValue([]);
    setCommodityOpen(false);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'email', 'mobile']);
  };

  const onVendorChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setVendorValue(data);
  };

  const onVendorClear = () => {
    setVendorKeyword('');
    setVendorValue([]);
    setVendorOpen(false);
  };

  const handleResetClick = () => {
    changeDate([null, null]);
    setDatesValue(null);
    setCommodityValue([]);
    setVendorValue([]);
    dispatch(resetTransactionRoomReport());
    dispatch(resetExtraMultipleList());
    dispatch(getTypeId({
      date: null, date1: null, commodityValue: [], vendorValue: [],
    }));
  };

  const onCommodityChangeModal = (data) => {
    setCommodityValue(data);
  };

  const onVendorChangeModal = (data) => {
    setVendorValue(data);
  };

  const onApplyFilters = () => {
    dispatch(getTypeId({
      date, date1, commodityValue, vendorValue,
    }));
    setCustomFilters({
      date, date1, commodityValue, vendorValue,
    });
    setFilterOpen(false);
  };
  const onCloseFilters = () => {
    changeDate(customFilters.date);
    setCommodityValue(customFilters.commodityValue);
    setVendorValue(customFilters.vendorValue);
    setFilterOpen(false);
  };

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY IN DATE
          <span className="text-danger ml-2px">*</span>
        </span>
),
      component: <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateRangePicker']}>
            <DateRangePicker
              localeText={{ start: 'Start Date', end: 'End Date' }}
              onChange={onDateRangeChange}
              value={date}
              disableFuture
              // format={getDatePickerFormat(userInfo, 'date')}
              slotProps={{
                actionBar: {
                  actions: ['clear'],
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        {!date || date && date.length && date[0] === null && date[1] === null && (
          <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 365 days</FormFeedback>
        )}
      </div>,
    },
    {
      title: 'BY OUT DATE',
      component: <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateRangePicker']}>
            <DateRangePicker
              localeText={{ start: 'Start Date', end: 'End Date' }}
              onChange={onDateRangeChange1}
              value={date1}
              // format={getDatePickerFormat(userInfo, 'date')}
              slotProps={{
                actionBar: {
                  actions: ['clear'],
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        {!date1 || date1 && date1.length && date1[0] === null && date1[1] === null && (
          <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 365 days</FormFeedback>
        )}
      </div>,
    },
    {
      title: 'BY VENDOR',
      component: <FormGroup>
        <Autocomplete
          multiple
          filterSelectedOptions
          limitTags={3}
          id="tags-filleddepartment"
          name="department"
          open={vendorOpen}
          size="small"
          onOpen={() => {
            setVendorOpen(true);
            setVendorKeyword('');
          }}
          onClose={() => {
            setVendorOpen(false);
            setVendorKeyword('');
          }}
          value={vendorValue}
          disableClearable={!(vendorValue.length > 0)}
          onChange={(e, options) => onVendorChange(options)}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={vendorOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              value={vendorKeyword}
              className={((vendorValue && vendorValue.length > 0) || (vendorKeyword && vendorKeyword.length > 0))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              onChange={(e) => setVendorKeyword(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((vendorValue && vendorValue.length > 0) || (vendorKeyword && vendorKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onVendorClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showVendorModal}
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
        {(date && date.length > 0) && (partnersInfo && partnersInfo.err) && (
          <FormFeedback className="display-block">{generateErrorMessage(partnersInfo)}</FormFeedback>
        )}
      </FormGroup>,
    },
    {
      title: 'BY COMMODITY',
      component:
  <FormGroup>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledcommodity"
      name="commodity"
      open={commodityOpen}
      size="small"
      onOpen={() => {
        setCommodityOpen(true);
        setCommodityKeyword('');
      }}
      onClose={() => {
        setCommodityOpen(false);
        setCommodityKeyword('');
      }}
      value={commodityValue}
      disableClearable={!(commodityValue.length > 0)}
      onChange={(e, options) => onCommodityChange(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={commodityOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={commodityKeyword}
          className={((commodityValue && commodityValue.length > 0) || (commodityKeyword && commodityKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setCommodityKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {commodityInfo && commodityInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((commodityValue && commodityValue.length > 0) || (commodityKeyword && commodityKeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onCommodityClear}
                  >
                    <IoCloseOutline size={22} fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showCommodityModal}
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
    {(date && date.length > 0) && (commodityInfo && commodityInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(commodityInfo)}</FormFeedback>
    )}
  </FormGroup>,
    },
  ];
  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      handleResetClick();
      setCustomFilters({
        vendorValue: [],
        date: [],
        date1: [],
        commodityValue: [],
      });
    }
  }, [resetFilters]);

  useEffect(() => {
    if (customFilters && ((customFilters.date && customFilters.date.length > 1 && customFilters.date[0] !== null && customFilters.date[1] !== null)
      || (customFilters.commodityValue && customFilters.commodityValue.length > 0)
      || (customFilters.vendorValue && customFilters.vendorValue.length > 0)
    )) {
      setShowResetOption(true);
    }
  }, [customFilters]);

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
      <Dialog size='xl' maxWidth="xl" open={extraMultipleModal}     
      fullWidth
      sx={{
            '& .MuiDialog-paper': {
              width: '1300px', // Adjusts width to content size
              maxWidth: '90vw', // Limits the width to 80% of the viewport width
            },
          }}>

        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }}  />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            >
              <SearchModalSingle
                modelName={modelValue}
                modalName={modalName}
                afterReset={() => { setExtraMultipleModal(false); }}
                onCommodityChange={onCommodityChangeModal}
                onVendorChange={onVendorChangeModal}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldValue={otherFieldValue}
                oldCommodityValues={commodityValue}
                oldVendorValues={vendorValue}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionSideFilters;
