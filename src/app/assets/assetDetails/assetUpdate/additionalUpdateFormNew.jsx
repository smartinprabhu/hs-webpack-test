/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  TextField, Typography, ListItemText,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import dayjs from 'dayjs';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import UploadDocuments from '../../../commonComponents/uploadDocuments';
import { getEquipmentList } from '../../../helpdesk/ticketService';
import { AddThemeColor } from '../../../themes/theme';
import { generateErrorMessage, getAllCompanies, getLocalDateTimeDBFormat } from '../../../util/appUtils';
import { bytesToSize } from '../../../util/staticFunctions';
import { getTrimmedArray } from '../../../workorders/utils/utils';
import { getEmployeeDataList, getOperatingHours } from '../../equipmentService';
import AdvancedSearchModal from './advancedSearchModal';
import formFields from './formFields.json';
import MuiDatePicker from '../../../commonComponents/formFields/muiDatePicker';

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

const appModels = require('../../../util/appModels').default;

const AdditionalUpdateForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    isITAsset,
    validateField,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    refilling_due_date, last_service_done, operating_hours, employee_id,
    parent_id,
  } = formValues;
  const classes = useStyles();
  const [hoursOpen, setHoursOpen] = useState(false);
  const [hoursKeyword, setHoursKeyword] = useState('');
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [parentOpen, setParentOpen] = useState(false);
  const [parentKeyword, setParentKeyword] = useState('');
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    equipmentsDetails, hoursInfo, employeeListInfo, updateEquipment,
  } = useSelector((state) => state.equipment);
  const {
    equipmentInfo,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (updateEquipment && updateEquipment.data) {
      setimgValidation(false);
      setimgSize(false);
      setFileDataImage(false);
      setFileDataType(false);
    }
  }, [updateEquipment]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && hoursOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, hoursKeyword));
      }
    })();
  }, [userInfo, hoursKeyword, hoursOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && parentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, parentKeyword, !!isITAsset, false, false, false, false, false, 'parent'));
      }
    })();
  }, [userInfo, parentKeyword, parentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  const onHourKeywordChange = (event) => {
    setHoursKeyword(event.target.value);
  };

  const onParentKeywordChange = (event) => {
    setParentKeyword(event.target.value);
  };

  const onAtKeywordChange = (event) => {
    setAtKeyword(event.target.value);
  };

  const onAtClear = () => {
    setAtKeyword(null);
    setFieldValue('employee_id', '');
    setAtOpen(false);
  };

  const showAtModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name']);
    setFieldName('employee_id');
    setModalName('Employee List');
    setPlaceholder('Employees');
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
        setFileDataType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
      }
    }
  };

  let hourOptions = [];
  let employeeListOptions = [];
  let parentOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    parentOptions = [{ name: 'Loading..' }];
  }
  if (parent_id && parent_id.length && parent_id.length > 0) {
    const oldId = [{ id: parent_id[0], name: parent_id[1] }];
    const newArr = [...parentOptions, ...oldId];
    parentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (equipmentInfo && equipmentInfo.data) {
    const pid = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    const arr = [...parentOptions, ...getTrimmedArray(equipmentInfo.data, 'id', pid)];
    parentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (hoursInfo && hoursInfo.loading) {
    hourOptions = [{ name: 'Loading..' }];
  }
  if (operating_hours && operating_hours.length && operating_hours.length > 0) {
    const oldMaintenanceTeam = [{ id: operating_hours[0], name: operating_hours[1] }];
    const newArr = [...hourOptions, ...oldMaintenanceTeam];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (hoursInfo && hoursInfo.data) {
    const arr = [...hourOptions, ...hoursInfo.data];
    hourOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (employeeListInfo && employeeListInfo.loading) {
    employeeListOptions = [{ name: 'Loading..' }];
  }
  if (employee_id && employee_id.length && employee_id.length > 0) {
    const oldEmployeeId = [{ id: employee_id[0], name: employee_id[1] }];
    const newArr = [...employeeListOptions, ...oldEmployeeId];
    employeeListOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (employeeListInfo && employeeListInfo.data) {
    const arr = [...employeeListOptions, ...employeeListInfo.data];
    employeeListOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldRefillingDueDate = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].refilling_due_date : '';
  const oldLastServiceDone = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].last_service_done : '';
  const oldHourId = operating_hours && operating_hours.length && operating_hours.length > 0 ? operating_hours[1] : '';
  const oldParentId = parent_id && parent_id.length && parent_id.length > 0 ? parent_id[1] : '';
  const oldEmpId = employee_id && employee_id.length && employee_id.length > 0 ? employee_id[1] : '';

  return (

    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        {/* <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Attachments
        </Typography> */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              width: '60%',
            }}
          >
            <UploadDocuments
              saveData={updateEquipment}
              limit={1}
              model={appModels.EQUIPMENT}
              setFieldValue={setFieldValue}
              fileImage={(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].image_medium)}
              uploadFileType="images"
            />

          </Box>
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name="comment"
            label="Comment"
            type="text"
          />
        </Box>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
            marginTop: '20px',
          })}
        >
          Other Info
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          {formFields && formFields.additionalFields && formFields.additionalFields.map((fields) => (
            <React.Fragment key={fields.id}>
              {(fields.type !== 'array') && (fields.name !== 'refilling_due_date') && (fields.name !== 'last_service_done') && (
                <MuiTextField
                  sx={{
                    width: '30%',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  type={fields.type}
                  readOnly={fields.readonly}
                />
              )}
              {(fields.type !== 'array') && (fields.name === 'last_service_done') && (
                <MuiDatePicker
                  sx={{
                    width: '30%',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  setFieldValue={setFieldValue}
                 // value={getLocalDateTimeDBFormat(last_service_done || oldLastServiceDone)}
                  value={last_service_done ? dayjs(moment.utc(last_service_done).local().format('YYYY-MM-DD')) : null}
                  readOnly={fields.readonly}
                  setFieldTouched={setFieldTouched}
                  validateField={validateField}
                />
              )}
              {(fields.type !== 'array') && (fields.name === 'refilling_due_date') && (
                <MuiDatePicker
                  sx={{
                    width: '30%',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  setFieldValue={setFieldValue}
                  value={refilling_due_date ? dayjs(moment.utc(refilling_due_date).local().format('YYYY-MM-DD')) : null}
                  // value={getLocalDateTimeDBFormat(refilling_due_date || oldRefillingDueDate)}
                  readOnly={fields.readonly}
                  setFieldTouched={setFieldTouched}
                  validateField={validateField}
                />
              )}
              {(fields.type === 'array') && (fields.name === 'parent_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldParentId}
                  value={parent_id && parent_id.name ? parent_id.name : oldParentId}
                  open={parentOpen}
                  size="small"
                  onOpen={() => {
                    setParentOpen(true);
                    setParentKeyword('');
                  }}
                  onClose={() => {
                    setParentOpen(false);
                    setParentKeyword('');
                  }}
                  classes={{
                    option: classes.option,
                  }}
                  loading={equipmentInfo && equipmentInfo.loading}
                  apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
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
                              {option.name}
                            </Typography>
                          </Box>
                          {option.location_id && (
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontSize: '12px',
                              }}
                            >
                              {option.location_id[1]}
                            </Typography>
                          </Box>
                          )}

                        </>
                                        )}
                    />
                  )}
                  options={parentOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onParentKeywordChange}
                      label={fields.label}
                      variant="standard"
                      className="without-padding"
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
              {(fields.type === 'array') && (fields.name === 'operating_hours') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldHourId}
                  value={operating_hours && operating_hours.name ? operating_hours.name : oldHourId}
                  open={hoursOpen}
                  size="small"
                  onOpen={() => {
                    setHoursOpen(true);
                    setHoursKeyword('');
                  }}
                  onClose={() => {
                    setHoursOpen(false);
                    setHoursKeyword('');
                  }}
                  loading={hoursInfo && hoursInfo.loading}
                  apiError={(hoursInfo && hoursInfo.err) ? generateErrorMessage(hoursInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={hourOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onHourKeywordChange}
                      variant="standard"
                      label={fields.label}
                      className="without-padding"
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
              {(fields.type === 'array') && (fields.name === 'employee_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldEmpId}
                  value={employee_id && employee_id.name ? employee_id.name : oldEmpId}
                  open={atOpen}
                  size="small"
                  onOpen={() => {
                    setAtOpen(true);
                    setAtKeyword('');
                  }}
                  onClose={() => {
                    setAtOpen(false);
                    setAtKeyword('');
                  }}
                  loading={employeeListInfo && employeeListInfo.loading}
                  apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={employeeListOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onAtKeywordChange}
                      variant="standard"
                      label={fields.label}
                      className={((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onAtClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showAtModal}
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
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Dialog maxWidth="md" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

AdditionalUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalUpdateForm;
