/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import {
  CircularProgress, FormControl
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  TextField, Typography
} from '@mui/material';
import { Box } from "@mui/system";
import { CheckboxField } from '@shared/formFields';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiDateTimeField from '../../../commonComponents/formFields/muiDateTimeField';
import { AddThemeColor } from '../../../themes/theme';
import {
  generateErrorMessage,
  getAllCompanies} from '../../../util/appUtils';
import assetActionData from '../../data/assetsActions.json';
import { getEmployeeList } from '../../equipmentService';
import { getTagText, getValidationTypesText } from '../../utils/utils';
import AdvancedSearchModal from './advancedSearchModal';
import formFields from './formFields.json';

const appModels = require('../../../util/appModels').default;

const ValidationUpdateForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    setFieldTouched,
    isITAsset,
  } = props;
  const [tagOpen, setTagOpen] = useState(false);
  const [vsOpen, setVsOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [value, setValue] = useState(new Date());

  const { values: formValues } = useFormikContext();
  const {
    validated_on, tag_status, validation_status,
    validated_by,
  } = formValues;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { employeesInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen]);

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onValidatedByClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('validated_by', '');
    setEmployeeOpen(false);
  };

  const showValidatedByModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('validated_by');
    setModalName('User List');
    setPlaceholder('Users');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  let employeeOptions = [];

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (validated_by && validated_by.length && validated_by.length > 0) {
    const oldMaintenanceTeam = [{ id: validated_by[0], name: validated_by[1] }];
    const newArr = [...employeeOptions, ...oldMaintenanceTeam];
    employeeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (employeesInfo && employeesInfo.data) {
    const arr = [...employeeOptions, ...employeesInfo.data];
    employeeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldTagStatus = tag_status || '';
  const oldValidationStatus = validation_status || '';
  const oldValidatedBy = validated_by && validated_by.length && validated_by.length > 0 ? validated_by[1] : '';

  return (

    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Validation
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
          {formFields && formFields.validationFields && formFields.validationFields.map((fields) => (
            <React.Fragment key={fields.id}>
              {(fields.type !== 'array') && (fields.type !== 'checkbox') && (fields.name === 'validated_on') && (
                <>
                  {/* <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                value={getLocalDateDBFormat(validated_on || oldValidatedOn)}
                readOnly={fields.readonly}
              /> */}
                  {/*<FormControl
                    sx={{
                      width: '30%',
                      marginTop: 'auto',
                      marginBottom: '20px',
                    }}
                    variant="standard"
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DateTimePicker
                        name={fields.name}
                        label={fields.label}
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        defaultValue={validated_on ? validated_on : ''}
                        ampm={false}
                        className='w-100'
                        format="dd/MM/yyyy HH:mm:ss"
                        setFieldTouched={setFieldTouched}
                        placeholder={fields.label}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>*/}
                  <MuiDateTimeField
                    sx={{
                      width: '30%',
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    slotProps={{
                      actionBar: {
                        actions: ['clear', 'accept'],
                      },
                      textField: { variant: 'standard', error: false }
                    }}
                    name={fields.name}
                    label={fields.label}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    placeholder={fields.label}
                    className="ml-1 w-100"
                    value={dayjs(validated_on)}
                  />
                </>
              )}
              {(fields.type === 'array') && (fields.name === 'tag_status') && !isITAsset && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getTagText(oldTagStatus)}
                  value={tag_status && tag_status.label ? tag_status.label : getTagText(oldTagStatus)}
                  open={tagOpen}
                  size="small"
                  onOpen={() => {
                    setTagOpen(true);
                  }}
                  onClose={() => {
                    setTagOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={assetActionData.tagStatsus}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="without-padding"
                      label={fields.label}
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
              {(fields.type === 'checkbox') && (fields.name === 'is_qr_tagged') && isITAsset && (
                <FormControl
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  variant="standard"
                >Tag Status
                  <CheckboxField
                    name={fields.name}
                    label={fields.label}
                    className="ml-2"
                  />
                </FormControl>
              )}
              {(fields.type === 'checkbox') && (fields.name === 'is_nfc_tagged') && isITAsset && (<>
                <FormControl
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  variant="standard"
                >
                  <CheckboxField
                    name={fields.name}
                    label={fields.label}
                    className="ml-2"
                  />
                </FormControl>
              </>
              )}
              {(fields.type === 'checkbox') && (fields.name === 'is_rfid_tagged') && isITAsset && (
                <>
                  <FormControl
                    sx={{
                      width: '30%',
                      marginTop: 'auto',
                      marginBottom: '20px',
                    }}
                    variant="standard"
                  >
                    <CheckboxField
                      name={fields.name}
                      label={fields.label}
                      className="ml-2"
                    />
                  </FormControl>
                </>
              )}
              {(fields.type === 'checkbox') && (fields.name === 'is_virtually_tagged') && isITAsset && (
                <>
                  <FormControl
                    sx={{
                      width: '30%',
                      marginTop: 'auto',
                      marginBottom: '20px',
                    }}
                    variant="standard"
                  >
                    <CheckboxField
                      name={fields.name}
                      label={fields.label}
                      className="ml-2"
                    />
                  </FormControl>
                </>
              )}
              {(fields.type === 'array') && (fields.name === 'validated_by') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={oldValidatedBy}
                  value={validated_by && validated_by.name ? validated_by.name : oldValidatedBy}
                  open={employeeOpen}
                  size="small"
                  onOpen={() => {
                    setEmployeeOpen(true);
                  }}
                  onClose={() => {
                    setEmployeeOpen(false);
                  }}
                  loading={employeesInfo && employeesInfo.loading}
                  apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={employeeOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onEmployeeKeywordChange}
                      variant="standard"
                      label={fields.label}
                      className={((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onValidatedByClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showValidatedByModal}
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
              {(fields.type === 'array') && (fields.name === 'validation_status') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getValidationTypesText(oldValidationStatus)}
                  value={validation_status && validation_status.label ? validation_status.label : getValidationTypesText(oldValidationStatus)}
                  open={vsOpen}
                  size="small"
                  onOpen={() => {
                    setVsOpen(true);
                  }}
                  onClose={() => {
                    setVsOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={assetActionData.validationTypes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={fields.label}
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
            </React.Fragment>
          ))}
        </Box>
      </Box >
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

ValidationUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isITAsset: PropTypes.bool,
};

ValidationUpdateForm.defaultProps = {
  isITAsset: false,
};

export default ValidationUpdateForm;
