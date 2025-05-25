/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  Grid,
} from '@mui/material';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import DialogHeader from '../../../commonComponents/dialogHeader';

import { getEmployeeList } from '../../../assets/equipmentService';
import AdvancedSearchModal from '../../../assets/forms/advancedSearchModal';
import {
  extractOptionsObject,
  generateErrorMessage, getAllowedCompanies,
} from '../../../util/appUtils';

import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiDateTimeField from '../../../commonComponents/formFields/muiDateTimeField';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';

const appModels = require('../../../util/appModels').default;

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    setFieldTouched,
    formField: {
      title,
      dateDeadline,
      userId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    date_deadline, user_id,
  } = formValues;

  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState(false);
  const [placeholderName, setPlaceholder] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

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
    setFieldValue('user_id', '');
    setEmployeeOpen(false);
  };

  const showValidatedByModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('user_id');
    setModalName('User List');
    setPlaceholder('Users');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const employeeOptions = extractOptionsObject(employeesInfo, user_id);

  const oldUserId = user_id && user_id.length && user_id.id ? user_id.id : '';

  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
              marginTop: '8px',
            }}
            name={title.name}
            label={title.label}
            isRequired
            formGroupClassName="m-1"
            type="text"
            maxLength="150"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiDateTimeField
            sx={{
              marginBottom: '20px',
            }}
            className="w-100"
            name={dateDeadline.name}
            localeText={{ todayButtonLabel: 'Now' }}
            slotProps={{
              actionBar: {
                actions: ['today', 'clear', 'accept'],
              },
              textField: { variant: 'standard', error: false },
            }}
            label={dateDeadline.label}
            value={date_deadline ? dayjs(moment.utc(date_deadline).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null}
            ampm={false}
            placeholder={dateDeadline.label}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            isErrorHandle
            disablePastDate
          />
          {/* <DateTimeField
            name={dateDeadline.name}
            label={dateDeadline.label}
            formGroupClassName="m-1"
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={dateDeadline.label}
            disablePastDate
            defaultValue={date_deadline ? new Date(getDateTimeSeconds(date_deadline)) : ''}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            name={userId.name}
            label={userId.label}
            formGroupClassName="m-1"
            oldValue={oldUserId}
            value={user_id && user_id.name ? user_id.name : oldUserId}
            apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
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
            loading={employeesInfo && employeesInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={employeeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={userId.label}
                onChange={onEmployeeKeywordChange}
                variant="standard"
                className={((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0))
                  ? 'without-padding custom-icons bg-white' : 'without-padding custom-icons2 bg-white'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onValidatedByClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
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
        </Grid>
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
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

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
