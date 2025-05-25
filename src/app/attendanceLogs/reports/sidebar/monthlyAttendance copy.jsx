/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  Row, Col, FormGroup,
  FormFeedback,
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import ModalHeaderComponent from '@shared/modalHeaderComponent';

import customData from '../data/customData.json';

import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
  getDateTimeSeconds,
} from '../../../util/appUtils';
import {
  getPartners,
} from '../../../assets/equipmentService';
import {
  createExport, resetCteateExport, getExportLink, resetExportLink,
} from '../../attendanceService';
import {
  getDepartments,
} from '../../../adminSetup/setupService';

import SearchModal from './searchSingle';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const MonthlyAttendance = (props) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedReport,
    setGlobalVendor, globalType, globalVendor, setGlobalType,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [date, changeDate] = useState(new Date());
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeData, setTypeData] = useState(false);

  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [vendorId, setVendorId] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);

  const [extraModal1, setExtraModal1] = useState(false);

  const [depOpen, setDepOpen] = useState(false);
  const [depKeyword, setDepKeyword] = useState('');
  const [depId, setDepId] = useState([]);
  const [depOptions, setDepOptions] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const { partnersInfo } = useSelector((state) => state.equipment);
  const {
    createExportInfo,
  } = useSelector((state) => state.attendance);
  const {
    departmentsInfo,
  } = useSelector((state) => state.setup);

  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  function getTypes(rep) {
    let res = [];
    if (rep === 'Monthly Attendance Details') {
      res = customData.types;
    } else if (rep === 'Form XXVI') {
      res = customData.formtypes;
    } else {
      res = customData.atttypes;
    }
    return res;
  }

  function getRepModel(rep) {
    let res = '';
    if (rep === 'Monthly Attendance Details') {
      res = 'monthly.attendance.details';
    } else if (rep === 'Form XXVI') {
      res = 'hr.formsixteen.report';
    } else {
      res = 'daily.attendance.details';
    }
    return res;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword, false, true));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && depOpen) {
        const keywordTrim = depKeyword ? encodeURIComponent(depKeyword.trim()) : '';
        await dispatch(getDepartments(companies, appModels.DEPARTMENT, keywordTrim));
      }
    })();
  }, [userInfo, depKeyword, depOpen]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    if (date && typeData && typeData.value && vendorId && vendorId.id && selectedReport === 'Monthly Attendance Details') {
      const rDate = new Date(date);
      const postData = {
        report_type: typeData.value,
        month: rDate.getMonth() + 1,
        year: rDate.getFullYear().toString(),
        partner_id: vendorId.id,
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(createExport('monthly.attendance.details', postData, conetxt));
    }
  }, [date, typeData, vendorId]);

  useEffect(() => {
    if (date && typeData && typeData.value && vendorId && vendorId.id && selectedReport === 'Daily Attendance Details') {
      const postData = {
        type: typeData.value,
        date: moment(date).format('YYYY-MM-DD'),
        is_all: false,
        partner_id: vendorId.id,
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      const payload = { model: 'daily.attendance.details', values: postData, conetxt };
      dispatch(createExport('daily.attendance.details', postData, conetxt));
    }
  }, [date, typeData, vendorId]);

  useEffect(() => {
    if (date && typeData && typeData.value && vendorId && vendorId.id && selectedReport === 'Form XXVI') {
      const rDate = new Date(date);
      const postData = {
        type: typeData.value,
        month: rDate.getMonth() + 1,
        year: rDate.getFullYear().toString(),
        partner_id: vendorId.id,
        department_ids: [[6, false, getColumnArrayById(depId, 'id')]],
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(createExport('hr.formsixteen.report', postData, conetxt));
    }
  }, [date, typeData, vendorId, depId]);

  useEffect(() => {
    if (createExportInfo && createExportInfo.data && createExportInfo.data.length) {
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      if (selectedReport === 'Daily Attendance Details') {
        dispatch(getExportLink(createExportInfo.data[0], 'update_go', getRepModel(selectedReport), false, conetxt));
        setTimeout(() => {
          dispatch(getExportLink(createExportInfo.data[0], 'export_in_excel', getRepModel(selectedReport), false, conetxt));
        }, 1000);
      } else {
        dispatch(getExportLink(createExportInfo.data[0], 'export_in_excel', getRepModel(selectedReport), false, conetxt));
      }
    }
  }, [createExportInfo]);

  useEffect(() => {
    if (partnersInfo && partnersInfo.data && partnersInfo.data.length && vendorOpen) {
      setVendorOptions(partnersInfo.data);
    } else if (partnersInfo && partnersInfo.loading) {
      setVendorOptions([{ name: 'Loading...' }]);
    } else {
      setVendorOptions([]);
    }
  }, [partnersInfo, vendorOpen]);

  useEffect(() => {
    if (departmentsInfo && departmentsInfo.data && departmentsInfo.data.length && depOpen) {
      setDepOptions(getArrayFromValuesById(departmentsInfo.data, isAssociativeArray(depId || []), 'id'));
    } else if (departmentsInfo && departmentsInfo.loading) {
      setDepOptions([{ name: 'Loading...' }]);
    } else {
      setDepOptions([]);
    }
  }, [departmentsInfo, depOpen]);

  const disabledDate = (current) => {
    if (!current) {
      return false;
    }
    const disable = current && current > moment().endOf('day');
    return disable;
  };

  const onTypeClear = () => {
    setTypeData(false);
    setTypeOpen(false);
    setGlobalType(false);
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onDateChange = (dates) => {
    console.log(dates);
    changeDate(dates);
    setSelectedDate(dates);
  };

  const onTypeChange = (data) => {
    setTypeData(data);
    setGlobalType(data);
  };

  const onVendorChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setVendorId(data);
    setGlobalVendor(data);
  };

  const onVendorClear = () => {
    setVendorId(false);
    setVendorOpen(false);
    setGlobalVendor(false);
    setVendorKeyword('');
  };

  const onVendorChangeModal = (data) => {
    setVendorId(data);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
    setSelectedDate(false);
    setGlobalType('');
    setGlobalVendor('');
    changeDate(new Date());
    setVendorId(false);
    setVendorOpen(false);
    setTypeData(false);
    setTypeOpen(false);
    setDepId([]);
    setDepOpen(false);
  };

  const onDepChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setDepId(data);
  };

  const onDepChangeModal = (data) => {
    setDepId(data);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setOtherFieldName('supplier');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile', 'name']);
    setExtraModal(true);
  };

  const onDepClear = () => {
    setDepId([]);
    setDepOpen(false);
  };

  const showDepModal = () => {
    setModelValue(appModels.DEPARTMENT);
    setFieldName('department_id');
    setModalName('Departments');
    setColumns(['id', 'name']);
    setOtherFieldValue(false);
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal1(true);
  };

  return (
    <>
      {((typeData && typeData.value) || (depId && depId.length > 0) || (vendorId && vendorId.name)) && (
        <>
          <Row className="m-0">
            <Col md="12" lg="12" sm="12" xs="12" className="p-0">
              <div aria-hidden="true" className="float-right cursor-pointer mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            </Col>
          </Row>
          <hr className="mt-1" />
        </>
      )}
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">
            BY
            {' '}
            {selectedReport === 'Daily Attendance Details' ? 'DATE' : 'MONTH'}
            {' '}
            <span className="ml-1 text-danger">*</span>
          </p>
        </Col>
      </Row>
      <div>
        <DatePicker
          onChange={onDateChange}
          disabledDate={disabledDate}
          value={date ? moment(new Date(getDateTimeSeconds(date)), selectedReport === 'Daily Attendance Details' ? 'DD/MM/YYYY' : 'MMM-YY') : ''}
          dateFormat={selectedReport === 'Daily Attendance Details' ? 'DD/MM/YYYY' : 'MMM-YY'}
          picker={selectedReport === 'Daily Attendance Details' ? 'date' : 'month'}
          size="small"
          allowClear={false}
          className="w-100"
        />
      </div>

      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" lg="8" sm="12" xs="12" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">
            BY TYPE
            {' '}
            <span className="ml-1 text-danger">*</span>
          </p>
        </Col>
      </Row>
      <div>
        <FormGroup className="mb-1">
          <Autocomplete
            name="category_id"
            className="bg-white"
            open={typeOpen}
            size="small"
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            value={typeData && typeData.label ? typeData.label : ''}
            getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={getTypes(selectedReport)}
            onChange={(e, data) => onTypeChange(data)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding custom-icons"
                placeholder="Select Type"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        {typeData && typeData.value && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onTypeClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </FormGroup>
      </div>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" lg="8" sm="12" xs="12" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">
            BY VENDOR
            {' '}
            <span className="ml-1 text-danger">*</span>
          </p>
        </Col>
      </Row>
      <div>
        <FormGroup>
          <Autocomplete
            name="Vendor"
            label="Vendor"
            formGroupClassName="m-1"
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
            classes={{
              option: classes.option,
            }}
            value={vendorId && vendorId.name ? vendorId.name : ''}
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            onChange={(e, data) => onVendorChange(data)}
            options={vendorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onVendorKeywordChange}
                variant="outlined"
                value={vendorKeyword}
                className={((vendorKeyword && vendorKeyword.length > 0) || (vendorId && vendorId.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((vendorKeyword && vendorKeyword.length > 0) || (vendorId && vendorId.id)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onVendorClear}
                        >
                          <BackspaceIcon fontSize="small" />
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
          {(partnersInfo && partnersInfo.err) && (
          <FormFeedback className="display-block">{generateErrorMessage(partnersInfo)}</FormFeedback>
          )}
        </FormGroup>
      </div>
      {selectedReport === 'Form XXVI' && (
        <>
          <hr className="mt-2" />
          <Row className="m-0">
            <Col md="8" lg="8" sm="12" xs="12" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">
                BY DEPARTMENT
              </p>
            </Col>
          </Row>
          <div>
            <FormGroup>
              <Autocomplete
                multiple
                filterSelectedOptions
                limitTags={3}
                id="tags-filled"
                size="small"
                name="block"
                open={depOpen}
                onOpen={() => {
                  setDepOpen(true);
                  setDepKeyword('');
                }}
                onClose={() => {
                  setDepOpen(false);
                  setDepKeyword('');
                }}
                value={depId}
                disableClearable={!(depId.length)}
                onChange={(e, options) => onDepChange(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={depOptions}
                renderOption={(option) => (
                  <div>
                    <h6>{option.name}</h6>
                    <p className="float-left font-tiny">
                      {option.name && (
                      <>
                        {option.name}
                      </>
                      )}
                    </p>
                  </div>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    className={(((depId && depId.length > 0)) || (depKeyword && depKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setDepKeyword(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(departmentsInfo && departmentsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((depKeyword && depKeyword.length > 0) || (depId && depId.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onDepClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showDepModal}
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
            </FormGroup>
          </div>
        </>
      )}
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName="Vendor"
            onCategoryChange={onVendorChangeModal}
          />
        </ModalBody>
      </Modal>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal1}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal1(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraModal1(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            onDepChange={onDepChangeModal}
            oldDepValues={depId}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default MonthlyAttendance;
