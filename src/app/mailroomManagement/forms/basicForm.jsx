/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Typography,
  TextField,
  createFilterOptions,
  ListItemText,
  Dialog, DialogContent,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Col,
 FormGroup, Label,
} from 'reactstrap';
import { Box } from '@mui/system';
import envelopeIcon from '@images/icons/envelope.svg';
import { useFormikContext } from 'formik';
import ReactFileReader from 'react-file-reader';
import { makeStyles } from '@material-ui/core/styles';

import { DateTimeField } from '@shared/formFields';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';

import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../commonComponents/formFields/muiTextarea';

import {
  getEmployeeDataList, getEmployeeList,
} from '../../assets/equipmentService';
import {
  getDepartments,
} from '../../adminSetup/setupService';
import { getCourier } from '../mailService';
import { AddThemeColor } from '../../themes/theme';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractOptionsObject, getDateTimeSeconds, extractOptionsObjectWithName,
} from '../../util/appUtils';
import {
  getRecipientForLabel, getParcelForLabel,
} from '../utils/utils';
import mailActions from '../data/customData.json';
import { bytesToSize } from '../../util/staticFunctions';
import DialogHeader from '../../commonComponents/dialogHeader';

import SearchModal from './SearchModalSingle';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

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

const BasicForm = React.memo((props) => {
  const {
    editId,
    setFieldTouched,
    setFieldValue,
    values,
    isOutbound,
    formField: {
      recipientValue,
      employeeIds,
      departmentId,
      courierId,
      collectedOn,
      collectedBy,
      sentOn,
      sentBy,
      notesValue,
      trackingNo,
      parcelDimensions,
      senderValue,
      sentTo,
      addressValue,
      shelfValue,
      receivedOn,
      deliveredOn,
      deliveredBy,
      receivedBy,
      agentName,
      employeeIdSequence,
      employeeWorkEmail,
    },
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    recipient, employee_id, department_id, courier_id, collected_on, collected_by, sent_on, sent_by, parcel_dimensions, received_on, delivered_on, received_by, delivered_by, signature, employee_work_email,
    employee_id_seq,
  } = formValues;
  const [typeValue, setTypeValue] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeEmailOpen, setEmployeeEmailOpen] = useState(false);
  const [employeeEmailKeyword, setEmployeeEmailKeyword] = useState('');
  const [employeeSeqOpen, setEmployeeSeqOpen] = useState(false);
  const [employeeSeqKeyword, setEmployeeSeqKeyword] = useState('');
  const [collectedOpen, setCollectedOpen] = useState(false);
  const [collectedKeyword, setCollectedKeyword] = useState('');
  const [receivedOpen, setReceivedOpen] = useState(false);
  const [receivedKeyword, setReceivedKeyword] = useState('');
  const [sentOpen, setSentOpen] = useState(false);
  const [sentKeyword, setSentKeyword] = useState('');
  const [deliveredOpen, setDeliveredOpen] = useState(false);
  const [deliveredKeyword, setDeliveredKeyword] = useState('');
  const [courierOpen, setCourierOpen] = useState(false);
  const [courierKeyword, setCourierKeyword] = useState('');
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');

  const [recipientForOpen, setRecipientForOpen] = useState(false);
  const [parcelForOpen, setParcelForOpen] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(signature);
  const [fileType, setFileType] = useState('data:image/png;base64,');

  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const { employeeListInfo, employeesInfo } = useSelector((state) => state.equipment);
  const {
    courierInfo, mailInboundDetail,
  } = useSelector((state) => state.mailroom);
  const {
    departmentsInfo,
  } = useSelector((state) => state.setup);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (employeeListInfo && employeeListInfo.data && employeeListInfo.data.length) {
      setEmployeeOptions(extractOptionsObject(employeeListInfo, employee_id));
    } else if (employeeListInfo && employeeListInfo.loading) {
      setEmployeeOptions([{ name: 'Loading...' }]);
    } else {
      setEmployeeOptions([]);
    }
  }, [employeeListInfo, employeeOpen, employeeEmailOpen, employeeSeqOpen]);

  useEffect(() => {
    if (employee_id) {
      setFieldValue('employee_id', employee_id);
      setFieldValue('employee_id_seq', employee_id);
      setFieldValue('employee_work_email', employee_id);
      setEmployeeSeqKeyword(employee_id.employee_id_seq);
      setEmployeeEmailKeyword(employee_id.work_email);
      setEmployeeKeyword(employee_id.name);
    }
  }, [employee_id]);

  useEffect(() => {
    if (employee_id_seq) {
      setFieldValue('employee_id', employee_id_seq);
      setFieldValue('employee_id_seq', employee_id_seq);
      setFieldValue('employee_work_email', employee_id_seq);
      setEmployeeSeqKeyword(employee_id_seq.employee_id_seq);
      setEmployeeEmailKeyword(employee_id_seq.work_email);
      setEmployeeKeyword(employee_id_seq.name);
    }
  }, [employee_id_seq]);

  useEffect(() => {
    if (employee_work_email) {
      setFieldValue('employee_id', employee_work_email);
      setFieldValue('employee_id_seq', employee_work_email);
      setFieldValue('employee_work_email', employee_work_email);
      setEmployeeSeqKeyword(employee_work_email.employee_id_seq);
      setEmployeeEmailKeyword(employee_work_email.work_email);
      setEmployeeKeyword(employee_work_email.name);
    }
  }, [employee_work_email]);

  useEffect(() => {
    if (recipient && recipient.value) {
      setTypeValue(recipient.value);
    } else if (recipient) {
      setTypeValue(recipient);
    }
  }, [recipient]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      let KeywordData;
      if (employeeOpen) {
        KeywordData = employeeKeyword;
      } else if (employeeSeqOpen) {
        KeywordData = employeeSeqKeyword;
      } else if (employeeEmailOpen) {
        KeywordData = employeeEmailKeyword;
      }
      dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, KeywordData, false, department_id && department_id.id ? department_id.id : false, true));
    }
  }, [userInfo, department_id, employeeEmailKeyword, employeeKeyword, employeeSeqKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && collectedOpen) {
      dispatch(getEmployeeList(companies, appModels.USER, collectedKeyword));
    }
  }, [userInfo, collectedKeyword, collectedOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && receivedOpen) {
      dispatch(getEmployeeList(companies, appModels.USER, receivedKeyword));
    }
  }, [userInfo, receivedKeyword, receivedOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && sentOpen) {
      dispatch(getEmployeeList(companies, appModels.USER, sentKeyword));
    }
  }, [userInfo, sentKeyword, sentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && deliveredOpen) {
      dispatch(getEmployeeList(companies, appModels.USER, deliveredKeyword));
    }
  }, [userInfo, deliveredKeyword, deliveredOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && courierOpen) {
        await dispatch(getCourier(companies, appModels.MAILCOURIER, courierKeyword));
      }
    })();
  }, [userInfo, courierKeyword, courierOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && departmentOpen) {
      dispatch(getDepartments(companies, appModels.DEPARTMENT, departmentKeyword));
    }
  }, [userInfo, departmentKeyword, departmentOpen]);

  const onEmployeeClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('employee_id', '');
    setEmployeeOpen(false);
    setEmployeeEmailKeyword(null);
    setFieldValue('employee_work_email', '');
    setEmployeeEmailOpen(false);
    setEmployeeSeqKeyword(null);
    setFieldValue('employee_id_seq', '');
    setEmployeeSeqOpen(false);
  };

  const onEmployeeEmailClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('employee_id', '');
    setEmployeeOpen(false);
    setEmployeeEmailKeyword(null);
    setFieldValue('employee_work_email', '');
    setEmployeeEmailOpen(false);
    setEmployeeSeqKeyword(null);
    setFieldValue('employee_id_seq', '');
    setEmployeeSeqOpen(false);
  };

  const onEmployeeSeqClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('employee_id', '');
    setEmployeeOpen(false);
    setEmployeeEmailKeyword(null);
    setFieldValue('employee_work_email', '');
    setEmployeeEmailOpen(false);
    setEmployeeSeqKeyword(null);
    setFieldValue('employee_id_seq', '');
    setEmployeeSeqOpen(false);
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name', 'work_phone', 'work_email', 'employee_id_seq']);
    setFieldName('employee_id_seq');
    setModalName('Employee List');
    setPlaceholder('Employees');
    setCompanyValue(companies);
    setExtraMultipleModal(true);
  };

  const onCollectedKeyWordChange = (event) => {
    setCollectedKeyword(event.target.value);
  };

  const onCollectedClear = () => {
    setCollectedKeyword(null);
    setFieldValue('collected_by', '');
    setCollectedOpen(false);
  };

  const showCollectedModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('collected_by');
    setModalName('Delivered List');
    setPlaceholder('Delivered');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onReceivedKeyWordChange = (event) => {
    setReceivedKeyword(event.target.value);
  };

  const onReceivedClear = () => {
    setReceivedKeyword(null);
    setFieldValue('received_by', '');
    setReceivedOpen(false);
  };

  const showReceivedModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('received_by');
    setModalName('Received List');
    setPlaceholder('Received');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onSentKeyWordChange = (event) => {
    setSentKeyword(event.target.value);
  };

  const onSentClear = () => {
    setSentKeyword(null);
    setFieldValue('sent_by', '');
    setSentOpen(false);
  };

  const showSentModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('sent_by');
    setModalName('Sent List');
    setPlaceholder('Sent');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onDeliveredKeyWordChange = (event) => {
    setDeliveredKeyword(event.target.value);
  };

  const onDeliveredClear = () => {
    setDeliveredKeyword(null);
    setFieldValue('delivered_by', '');
    setDeliveredOpen(false);
  };

  const showDeliveredModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('delivered_by');
    setModalName('Delivered List');
    setPlaceholder('Delivered');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCourierKeyWordChange = (event) => {
    setCourierKeyword(event.target.value);
  };

  const onCourierClear = () => {
    setCourierKeyword(null);
    setFieldValue('courier_id', '');
    setCourierOpen(false);
  };

  const showCourierModal = () => {
    setModelValue(appModels.MAILCOURIER);
    setColumns(['id', 'name']);
    setFieldName('courier_id');
    setModalName('Courier List');
    setPlaceholder('Courier');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onDepartmentKeyWordChange = (event) => {
    setDepartmentKeyword(event.target.value);
  };

  const onDepartmentClear = () => {
    setDepartmentKeyword(null);
    setFieldValue('department_id', '');
    setDepartmentOpen(false);
  };

  const showDepartmentModal = () => {
    setModelValue(appModels.DEPARTMENT);
    setColumns(['id', 'display_name']);
    setFieldName('department_id');
    setModalName('Department List');
    setPlaceholder('Department');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('signature', fileData);
      }
    }
  };

  useEffect(() => {
    if ((employee_id === '' && employeeOpen) || (employee_id_seq === '' && employeeSeqOpen) || (employee_work_email === '' && employeeEmailOpen)) {
      setEmployeeKeyword(null);
      setFieldValue('employee_id', '');
      setEmployeeOpen(false);
      setEmployeeEmailKeyword(null);
      setFieldValue('employee_work_email', '');
      setEmployeeEmailOpen(false);
      setEmployeeSeqKeyword(null);
      setFieldValue('employee_id_seq', '');
      setEmployeeSeqOpen(false);
    }
  }, [employee_id, employee_id_seq, employee_work_email]);

  useEffect(() => {
    if (employeeKeyword) {
      employeeListInfo && employeeListInfo.data && employeeListInfo.data.map((employee) => {
        if (employeeKeyword.work_email === employee.work_email) {
          setFieldValue('employee_work_email', employeeKeyword);
        }
      });
    }
    if (employeeEmailKeyword) {
      employeeListInfo && employeeListInfo.data && employeeListInfo.data.map((employee) => {
        if (employeeEmailKeyword.work_email === employee.work_email) {
          setFieldValue('employee_work_email', employeeEmailKeyword);
        }
      });
    }
    if (employeeSeqKeyword) {
      employeeListInfo && employeeListInfo.data && employeeListInfo.data.map((employee) => {
        if (employeeSeqKeyword.employee_id_seq === employee.employee_id_seq) {
          setFieldValue('employee_id_seq', employeeSeqKeyword);
        }
      });
    }
  }, [employeeSeqKeyword, employeeEmailKeyword]);

  const currentState = mailInboundDetail && mailInboundDetail.data && mailInboundDetail.data.length > 0 && mailInboundDetail.data[0].state ? mailInboundDetail.data[0].state : '';

  const collectedByOptions = extractOptionsObject(employeesInfo, collected_by);
  const receivedByOptions = extractOptionsObject(employeesInfo, received_by);
  const sentByOptions = extractOptionsObject(employeesInfo, sent_by);
  const deliveredByOptions = extractOptionsObject(employeesInfo, delivered_by);
  const courierOptions = extractOptionsObject(courierInfo, courier_id);
  const departmentOptions = extractOptionsObjectWithName(departmentsInfo, department_id, 'display_name');

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  const filterOptions = createFilterOptions({
    stringify: ({ name, employee_id_seq, work_email }) => `${name} ${employee_id_seq} ${work_email}`,
  });

  const senderInfo = (
    <>

      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={recipientValue.name}
        isRequired
        label={recipientValue.label}
        className="bg-white"
        formGroupClassName="m-1"
        open={recipientForOpen}
        disableClearable
        oldValue={getRecipientForLabel(recipient)}
        value={recipient && recipient.label ? recipient.label : getRecipientForLabel(recipient)}
        size="small"
        onOpen={() => {
          setRecipientForOpen(true);
        }}
        onClose={() => {
          setRecipientForOpen(false);
        }}
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={mailActions.recipientTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={recipientValue.label}
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

      {typeValue === 'Department'
        ? (
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={departmentId.name}
            label={departmentId.label}
            formGroupClassName="m-1"
            oldValue={getOldData(department_id)}
            value={department_id && department_id.display_name ? department_id.display_name : getOldData(department_id)}
            apiError={(departmentsInfo && departmentsInfo.err) ? generateErrorMessage(departmentsInfo) : false}
            open={departmentOpen}
            size="small"
            onOpen={() => {
              setDepartmentOpen(true);
              setDepartmentKeyword('');
            }}
            onClose={() => {
              setDepartmentOpen(false);
              setDepartmentKeyword('');
            }}
            loading={departmentsInfo && departmentsInfo.loading}
            getOptionSelected={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            options={departmentOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onDepartmentKeyWordChange}
                variant="standard"
                label={departmentId.label}
                value={departmentKeyword}
                className={((getOldData(department_id)) || (department_id && department_id.id) || (departmentKeyword && departmentKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {departmentsInfo && departmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(department_id)) || (department_id && department_id.id) || (departmentKeyword && departmentKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onDepartmentClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showDepartmentModal}
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

        )
        : ''}

      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={employeeIdSequence.name}
        label={employeeIdSequence.label}
        formGroupClassName="m-1"
        oldValue={getOldData(employee_id_seq)}
        filterOptions={filterOptions}
        value={employee_id_seq && employee_id_seq.employee_id_seq ? employee_id_seq.employee_id_seq : getOldData(employee_id_seq)}
        apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
        open={employeeSeqOpen}
        size="small"
        onOpen={() => {
          setEmployeeSeqOpen(true);
          setEmployeeSeqKeyword('');
        }}
        onClose={() => {
          setEmployeeSeqOpen(false);
          setEmployeeSeqKeyword('');
        }}
        classes={{
          option: classes.option,
        }}
        loading={employeeListInfo && employeeListInfo.loading}
        getOptionSelected={(option, value) => option.employee_id_seq === value.employee_id_seq}
        getOptionLabel={(option) => (typeof option === 'string'
          ? option
          : `${option.employee_id_seq} ${option.name || ''} ${option.work_email || ''}`)}
        options={employeeOptions}
        renderOption={(props, option) => (
          <ListItemText
            {...props}
            primary={(
              <>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontWeight: 500,
                      fontSize: '15px',
                    }}
                  >
                    {option.employee_id_seq}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontSize: '12px',
                    }}
                  >
                    {option.name ? option.name : ''}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontSize: '10px',
                    }}
                  >
                    <img src={envelopeIcon} alt="telephone" height="13" width="13" className="mr-2" />
                    {option.work_email ? option.work_email : ''}
                  </Typography>
                </Box>
              </>
                                        )}
          />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setEmployeeSeqKeyword(e.target.value)}
            variant="standard"
            label={employeeIdSequence.label}
            value={employeeSeqKeyword}
           // filterOptions={filterOptions}
            className={((getOldData(employee_id_seq)) || (employee_id_seq && employee_id_seq.id) || (employeeSeqKeyword && employeeSeqKeyword.length > 0))
              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
            placeholder="Search & Select"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((getOldData(employee_id_seq)) || (employee_id_seq && employee_id_seq.id) || (employeeSeqKeyword && employeeSeqKeyword.length > 0)) && (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onEmployeeSeqClear}
                      >
                        <BackspaceIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showEmployeeModal}
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
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={employeeIds.name}
        label={employeeIds.label}
        formGroupClassName="m-1"
        oldValue={getOldData(employee_id)}
        filterOptions={filterOptions}
        value={employee_id && employee_id.name ? employee_id.name : getOldData(employee_id)}
        apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
        open={employeeOpen}
        size="small"
        onOpen={() => {
          setEmployeeOpen(true);
          setEmployeeKeyword('');
        }}
        onClose={() => {
          setEmployeeOpen(false);
          setEmployeeKeyword('');
        }}
        classes={{
          option: classes.option,
        }}
        loading={employeeListInfo && employeeListInfo.loading}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        options={employeeOptions}
        renderOption={(props, option) => (
          <ListItemText
            {...props}
            primary={(
              <>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontWeight: 500,
                      fontSize: '15px',
                    }}
                  >
                    {option.employee_id_seq}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontSize: '12px',
                    }}
                  >
                    {option.name ? option.name : ''}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontSize: '10px',
                    }}
                  >
                    <img src={envelopeIcon} alt="telephone" height="13" width="13" className="mr-2" />
                    {option.work_email ? option.work_email : ''}
                  </Typography>
                </Box>
              </>
                                        )}
          />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setEmployeeKeyword(e.target.value)}
            variant="standard"
            label={employeeIds.label}
            value={employeeKeyword}
            className={((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0))
              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
            placeholder="Search & Select"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onEmployeeClear}
                    >
                      <BackspaceIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={employeeWorkEmail.name}
        label={employeeWorkEmail.label}
        formGroupClassName="m-1"
        oldValue={getOldData(employee_work_email)}
        filterOptions={filterOptions}
        value={employee_work_email && employee_work_email.work_email ? employee_work_email.work_email : getOldData(employee_work_email)}
        apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
        open={employeeEmailOpen}
        size="small"
        onOpen={() => {
          setEmployeeEmailOpen(true);
          setEmployeeEmailKeyword('');
        }}
        onClose={() => {
          setEmployeeEmailOpen(false);
          setEmployeeEmailKeyword('');
        }}
        loading={employeeListInfo && employeeListInfo.loading}
        getOptionSelected={(option, value) => option.work_email === value.work_email}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.work_email)}
        options={employeeOptions}
        renderOption={(option) => (
          <p>
            <h6>{option.work_email}</h6>
            <p className="float-left">
              {option.name && (
                <>
                  {option.name}
                </>
              )}
            </p>
            <p className="float-right">
              {option.employee_id_seq && (
                <span>{option.employee_id_seq}</span>
              )}
            </p>
          </p>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setEmployeeEmailKeyword(e.target.value)}
            variant="standard"
            label={employeeWorkEmail.label}
            value={employeeKeyword}
            className={((getOldData(employee_work_email)) || (employee_work_email && employee_work_email.id) || (employeeEmailKeyword && employeeEmailKeyword.length > 0))
              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
            placeholder="Search & Select"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {((getOldData(employee_work_email)) || (employee_work_email && employee_work_email.id) || (employeeEmailKeyword && employeeEmailKeyword.length > 0)) && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onEmployeeEmailClear}
                    >
                      <BackspaceIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      {editId && (
        <>
          {!isOutbound
            ? (
              <>

                <DateTimeField
                  name={collectedOn.name}
                  label={collectedOn.label}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  placeholder={collectedOn.label}
                  disablePastDate
                  disableCustom
                  disabled={currentState === 'Registered'}
                  formGroupClassName="m-1"
                  subnoofdays={received_on ? getDifferece(new Date(received_on)) : 0}
                  defaultValue={collected_on ? new Date(getDateTimeSeconds(collected_on)) : ''}
                />

                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={collectedBy.name}
                  label={collectedBy.label}
                  formGroupClassName="m-1"
                  oldValue={getOldData(collected_by)}
                  value={collected_by && collected_by.name ? collected_by.name : getOldData(collected_by)}
                  disabled={currentState === 'Registered'}
                  apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
                  open={collectedOpen}
                  size="small"
                  onOpen={() => {
                    setCollectedOpen(true);
                    setCollectedKeyword('');
                  }}
                  onClose={() => {
                    setCollectedOpen(false);
                    setCollectedKeyword('');
                  }}
                  loading={employeesInfo && employeesInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={collectedByOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onCollectedKeyWordChange}
                      variant="standard"
                      label={collectedBy.label}
                      value={collectedKeyword}
                      className={((getOldData(collected_by)) || (collected_by && collected_by.id) || (collectedKeyword && collectedKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {currentState !== 'Registered'
                              ? (
                                <InputAdornment position="end">
                                  {((getOldData(collected_by)) || (collected_by && collected_by.id) || (collectedKeyword && collectedKeyword.length > 0)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={onCollectedClear}
                                    >
                                      <BackspaceIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    aria-label="toggle search visibility"
                                    onClick={showCollectedModal}
                                  >
                                    <SearchIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              )
                              : ''}
                          </>
                        ),
                      }}
                    />
                  )}
                />

              </>
            )
            : (
              <>

                <DateTimeField
                  name={sentOn.name}
                  label={sentOn.label}
                  formGroupClassName="m-1"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  placeholder={sentOn.label}
                  defaultValue={sent_on ? new Date(getDateTimeSeconds(sent_on)) : ''}
                />

                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={sentBy.name}
                  label={sentBy.label}
                  formGroupClassName="m-1"
                  oldValue={getOldData(sent_by)}
                  value={sent_by && sent_by.name ? sent_by.name : getOldData(sent_by)}
                  apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
                  open={sentOpen}
                  size="small"
                  onOpen={() => {
                    setSentOpen(true);
                    setSentKeyword('');
                  }}
                  onClose={() => {
                    setSentOpen(false);
                    setSentKeyword('');
                  }}
                  loading={sentOpen && employeesInfo && employeesInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={sentByOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={sentBy.label}
                      onChange={onSentKeyWordChange}
                      variant="standard"
                      value={sentKeyword}
                      className={((getOldData(sent_by)) || (sent_by && sent_by.id) || (sentKeyword && sentKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(sent_by)) || (sent_by && sent_by.id) || (sentKeyword && sentKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onSentClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showSentModal}
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

              </>
            )}
        </>
      )}
      {isOutbound && (
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={parcelDimensions.name}
        isRequired
        label={parcelDimensions.label}
        formGroupClassName="m-1"
        className="bg-white"
        open={parcelForOpen}
        disableClearable
        oldValue={getParcelForLabel(parcel_dimensions)}
        value={parcel_dimensions && parcel_dimensions.label ? parcel_dimensions.label : getParcelForLabel(parcel_dimensions)}
        size="small"
        onOpen={() => {
          setParcelForOpen(true);
        }}
        onClose={() => {
          setParcelForOpen(false);
        }}
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={mailActions.parcelDimensionsType}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={parcelDimensions.label}
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

      )}
      {isOutbound && (
      <MuiTextField
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={shelfValue.name}
        label={shelfValue.label}
        inputProps={{ maxLength: 150 }}
        setFieldValue={setFieldValue}
        variant="standard"
        value={values[shelfValue.name]}
      />

      )}
      {isOutbound && (
        <MuiTextarea
          sx={{
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          name={notesValue.name}
          label={notesValue.label}
          setFieldValue={setFieldValue}
          variant="standard"
          inputProps={{ maxLength: 250 }}
          value={values[notesValue.name]}
          multiline
          maxRows={4}
        />

      )}
    </>
  );

  const receiverInfo = (
    <>
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={courierId.name}
        label={courierId.label}
        formGroupClassName="m-1"
        oldValue={getOldData(courier_id)}
        value={courier_id && courier_id.name ? courier_id.name : getOldData(courier_id)}
        apiError={(courierInfo && courierInfo.err) ? generateErrorMessage(courierInfo) : false}
        open={courierOpen}
        size="small"
        onOpen={() => {
          setCourierOpen(true);
          setCourierKeyword('');
        }}
        onClose={() => {
          setCourierOpen(false);
          setCourierKeyword('');
        }}
        loading={courierInfo && courierInfo.loading}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        options={courierOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={onCourierKeyWordChange}
            label={courierId.label}
            variant="standard"
            value={courierKeyword}
            className={((getOldData(courier_id)) || (courier_id && courier_id.id) || (courierKeyword && courierKeyword.length > 0))
              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
            placeholder="Search & Select"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {courierInfo && courierInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((getOldData(courier_id)) || (courier_id && courier_id.id) || (courierKeyword && courierKeyword.length > 0)) && (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onCourierClear}
                      >
                        <BackspaceIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showCourierModal}
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

      {!isOutbound
        ? (

          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={senderValue.name}
            label={senderValue.label}
            inputProps={{ maxLength: 150 }}
            setFieldValue={setFieldValue}
            variant="standard"
            value={values[senderValue.name]}
            isRequired
          />

        )
        : (
          <>

            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={sentTo.name}
              label={sentTo.label}
              inputProps={{ maxLength: 150 }}
              setFieldValue={setFieldValue}
              variant="standard"
              value={values[sentTo.name]}
              isRequired
            />
            <MuiTextarea
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={addressValue.name}
              label={addressValue.label}
              setFieldValue={setFieldValue}
              variant="standard"
              inputProps={{ maxLength: 250 }}
              value={values[addressValue.name]}
              multiline
              maxRows={4}
            />

          </>
        )}
      {!isOutbound && (
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={parcelDimensions.name}
        isRequired
        label={parcelDimensions.label}
        formGroupClassName="m-1"
        className="bg-white"
        open={parcelForOpen}
        disableClearable
        oldValue={getParcelForLabel(parcel_dimensions)}
        value={parcel_dimensions && parcel_dimensions.label ? parcel_dimensions.label : getParcelForLabel(parcel_dimensions)}
        size="small"
        onOpen={() => {
          setParcelForOpen(true);
        }}
        onClose={() => {
          setParcelForOpen(false);
        }}
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={mailActions.parcelDimensionsType}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            className="without-padding"
            label={parcelDimensions.label}
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

      )}
      <MuiTextField
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={trackingNo.name}
        label={trackingNo.label}
        inputProps={{ maxLength: 150 }}
        setFieldValue={setFieldValue}
        variant="standard"
        value={values[trackingNo.name]}
      />

      {!isOutbound && (

      <MuiTextField
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={shelfValue.name}
        label={shelfValue.label}
        inputProps={{ maxLength: 150 }}
        setFieldValue={setFieldValue}
        variant="standard"
        value={values[shelfValue.name]}
      />

      )}
      {!isOutbound && (
      <MuiTextarea
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={notesValue.name}
        label={notesValue.label}
        setFieldValue={setFieldValue}
        variant="standard"
        inputProps={{ maxLength: 250 }}
        value={values[notesValue.name]}
        multiline
        maxRows={4}
      />

      )}
      {editId && (
        <>
          {!isOutbound
            ? (
              <>

                <DateTimeField
                  name={receivedOn.name}
                  label={receivedOn.label}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  placeholder={receivedOn.label}
                  formGroupClassName="m-1"
                  defaultValue={received_on ? new Date(getDateTimeSeconds(received_on)) : ''}
                />

                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={receivedBy.name}
                  label={receivedBy.label}
                  formGroupClassName="m-1"
                  oldValue={getOldData(received_by)}
                  value={received_by && received_by.name ? received_by.name : getOldData(received_by)}
                  apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
                  open={receivedOpen}
                  size="small"
                  onOpen={() => {
                    setReceivedOpen(true);
                    setReceivedKeyword('');
                  }}
                  onClose={() => {
                    setReceivedOpen(false);
                    setReceivedKeyword('');
                  }}
                  loading={employeesInfo && employeesInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={receivedByOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onReceivedKeyWordChange}
                      variant="standard"
                      label={receivedBy.label}
                      value={receivedKeyword}
                      className={((getOldData(received_by)) || (received_by && received_by.id) || (receivedKeyword && receivedKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(received_by)) || (received_by && received_by.id) || (receivedKeyword && receivedKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onReceivedClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showReceivedModal}
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

              </>
            )
            : (
              <>

                <DateTimeField
                  name={deliveredOn.name}
                  label={deliveredOn.label}
                  formGroupClassName="m-1"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  placeholder={deliveredOn.label}
                  disablePastDate
                  disableCustom
                  disabled={currentState === 'Registered'}
                  subnoofdays={sent_on ? getDifferece(new Date(sent_on)) : 0}
                  defaultValue={delivered_on ? new Date(getDateTimeSeconds(delivered_on)) : ''}
                />

                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={deliveredBy.name}
                  label={deliveredBy.label}
                  formGroupClassName="m-1"
                  oldValue={getOldData(delivered_by)}
                  value={delivered_by && delivered_by.name ? delivered_by.name : getOldData(delivered_by)}
                  disabled={currentState === 'Registered'}
                  apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
                  open={deliveredOpen}
                  size="small"
                  onOpen={() => {
                    setDeliveredOpen(true);
                    setDeliveredKeyword('');
                  }}
                  onClose={() => {
                    setDeliveredOpen(false);
                    setDeliveredKeyword('');
                  }}
                  loading={deliveredOpen && employeesInfo && employeesInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={deliveredByOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={deliveredBy.label}
                      onChange={onDeliveredKeyWordChange}
                      variant="standard"
                      value={deliveredKeyword}
                      className={((getOldData(delivered_by)) || (delivered_by && delivered_by.id) || (deliveredKeyword && deliveredKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {currentState !== 'Registered'
                              ? (
                                <InputAdornment position="end">
                                  {((getOldData(delivered_by)) || (delivered_by && delivered_by.id) || (deliveredKeyword && deliveredKeyword.length > 0)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={onDeliveredClear}
                                    >
                                      <BackspaceIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    aria-label="toggle search visibility"
                                    onClick={showDeliveredModal}
                                  >
                                    <SearchIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ) : ''}
                          </>
                        ),
                      }}
                    />
                  )}
                />

              </>
            )}
        </>
      )}
      {!isOutbound ? '' : (
        <>

          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={agentName.name}
            label={agentName.label}
            inputProps={{ maxLength: 150 }}
            setFieldValue={setFieldValue}
            variant="standard"
            value={values[agentName.name]}
          />

          <Col xs={12} sm={12} lg={12} md={12}>
            <FormGroup>
              <Label for="logo">Signature</Label>
              {!fileDataImage && !signature && (
                <ReactFileReader
                  elementId="fileUpload"
                  handleFiles={handleFiles}
                  fileTypes=".png,.jpg,.jpeg"
                  base64
                >
                  <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1 m-1">
                    <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                    <p className="font-weight-500">Select a file</p>
                  </div>
                </ReactFileReader>
              )}
              {(!fileDataImage && (editId && signature)) && (
                <div className="position-relative mt-2">
                  <img
                    src={`data:image/png;base64,${signature}`}
                    height="150"
                    width="150"
                    className="ml-3"
                    alt="uploaded"
                  />
                  <div className="position-absolute topright-img-close">
                    <img
                      aria-hidden="true"
                      src={closeCircleIcon}
                      className="cursor-pointer"
                      onClick={() => {
                        setimgValidation(false);
                        setimgSize(false);
                        setFileDataImage(false);
                        setFileType(false);
                        setFieldValue('signature', false);
                      }}
                      alt="remove"
                    />
                  </div>
                </div>
              )}
              {fileDataImage && (
                <div className="position-relative mt-2">
                  <img
                    src={`${fileType}${fileDataImage}`}
                    height="150"
                    width="150"
                    className="ml-3"
                    alt="uploaded"
                  />
                  <div className="position-absolute topright-img-close">
                    <img
                      aria-hidden="true"
                      src={closeCircleIcon}
                      className="cursor-pointer"
                      onClick={() => {
                        setimgValidation(false);
                        setimgSize(false);
                        setFileDataImage(false);
                        setFileType(false);
                        setFieldValue('signature', false);
                      }}
                      alt="remove"
                    />
                  </div>
                </div>
              )}
            </FormGroup>
            {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
            {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
          </Col>
        </>
      )}
    </>
  );

  return (
    <>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            width: '48%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Sender Information
          </Typography>

          {isOutbound ? senderInfo : receiverInfo}
        </Box>
        <Box
          sx={{
            width: '48%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Receiver Information
          </Typography>

          {isOutbound ? receiverInfo : senderInfo}
        </Box>
      </Box>

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
          />
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            setFieldValue={setFieldValue}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  isOutbound: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
