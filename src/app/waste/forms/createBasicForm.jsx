/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import {
  Dialog, DialogContent, DialogContentText,
  FormControl,
} from '@mui/material';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { IoCloseOutline } from 'react-icons/io5';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import SingleSearchModal from '@shared/searchModals/singleSearchModal';
import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  generateErrorMessage,
  getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
  getAllowedCompanies, extractOptionsObject, decimalKeyPressDown, getDateTimeSeconds,
} from '../../util/appUtils';
import {
  getComplianceTemplate,
} from '../complianceService';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '25%',
  },
}));

const BasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      Operation,
      Type,
      Weight,
      loggedOn,
      Tenant,
      Vendor,
      carriedBy,
      accompaniedBy,
      securityBy,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    operation,
    type,
    logged_on,
  } = formValues;
  const [ctOpen, setCtOpen] = useState(false);
  const [ctKeyword, setCtKeyword] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [catKeyword, setCatKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [extraSearchModal, setExtraSearchModal] = useState(false);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [selectedDate, setDateChange] = useState(new Date());
  const [fieldValueClear, setFieldValueClear] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const {
    complianceTemplateInfo, complianceLogs,
  } = useSelector((state) => state.waste);

  const configData = complianceLogs && complianceLogs.data && complianceLogs.data.length ? complianceLogs.data[0] : false;

  useEffect(() => {
    if (configData) {
      setFieldValue('is_has_security', configData.has_security_by);
      setFieldValue('is_has_carried', configData.has_carried_by);
      setFieldValue('is_has_accompanied', configData.has_accompanied_by);
    } else {
      setFieldValue('is_has_security', '');
      setFieldValue('is_has_carried', '');
      setFieldValue('is_has_accompanied', '');
    }
  }, [complianceLogs]);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (!editId) {
      setFieldValue('logged_on', new Date());
    }
  }, [editId]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && catOpen) {
        await dispatch(getComplianceTemplate(companies, appModels.WASTETRACKERTYPE, catKeyword));
      }
    })();
  }, [userInfo, catKeyword, catOpen]);

  const onComplianceCatKeyWordChange = (event) => {
    setCatKeyword(event.target.value);
  };

  const onCatKeywordClear = () => {
    setCatKeyword(null);
    setFieldValue('type', '');
    setCatOpen(false);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.WASTETRACKERTYPE);
    setFieldName('type');
    setModalName('Types');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const operationTypes = [{ id: 'Collection', name: 'Collection' }, { id: 'Disposal', name: 'Disposal' }];

  const categoryOptions = extractOptionsObject(complianceTemplateInfo, type);

  const handleDateChange = (date) => {
    setDateChange(date);
    setFieldValue('logged_on', date);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              width: '100%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={Operation.name}
            label={Operation.label}
            oldValue={operation}
            isRequired
            value={operation && operation.name ? operation.name : operation}
            open={ctOpen}
            size="small"
            onOpen={() => {
              setCtOpen(true);
              setCtKeyword('');
            }}
            onClose={() => {
              setCtOpen(false);
              setCtKeyword('');
            }}
            onChange={(e, data) => { setFieldValue('operation', data); }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={operationTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={Operation.label}
                required
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
          <MuiAutoComplete
            sx={{
              width: '100%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={Type.name}
            isRequired
            label={Type.label}
            oldValue={getOldData(type)}
            value={type && type.name ? type.name : getOldData(type)}
            apiError={(complianceTemplateInfo && complianceTemplateInfo.err) ? generateErrorMessage(complianceTemplateInfo) : false}
            open={catOpen}
            size="small"
            onOpen={() => {
              setCatOpen(true);
              setCatKeyword('');
            }}
            onClose={() => {
              setCatOpen(false);
              setCatKeyword('');
            }}
            loading={complianceTemplateInfo && complianceTemplateInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onComplianceCatKeyWordChange}
                variant="standard"
                label={Type.label}
                required
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {complianceTemplateInfo && complianceTemplateInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(type)) || (type && type.id) || (catKeyword && catKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onCatKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCategoryModal}
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
          {((operation && operation.name === 'Collection') || operation === 'Collection') && (
            <>
              {(configData && configData.has_carried_by !== 'None') && (
              <MuiTextField
                sx={{
                  width: '100%',
                  marginBottom: '20px',
                }}
                isRequired={configData && configData.has_carried_by === 'Required'}
                name={carriedBy.name}
                label={carriedBy.label}
                type="text"
              />
              )}
              {(configData && configData.has_accompanied_by !== 'None') && (
              <MuiTextField
                sx={{
                  width: '100%',
                  marginBottom: '20px',
                }}
                isRequired={configData && configData.has_accompanied_by === 'Required'}
                name={accompaniedBy.name}
                label={accompaniedBy.label}
                type="text"
              />
              )}
            </>
          )}
          {((operation && operation.name === 'Disposal') || operation === 'Disposal') && (
          <MuiTextField
            sx={{
              width: '100%',
              marginBottom: '20px',
            }}
            name={Vendor.name}
            label={Vendor.label}
            type="text"
          />
          )}
          {((operation && operation.name === 'Disposal') || operation === 'Disposal') && (
          <MuiTextField
            sx={{
              width: '100%',
              marginBottom: '20px',
            }}
            name={securityBy.name}
            label={securityBy.label}
            type="text"
          />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              width: '100%',
              marginBottom: '20px',
            }}
            name={Weight.name}
            label={Weight.label}
            isRequired
            onKeyPress={decimalKeyPressDown}
            type="text"
          />
          <FormControl
            sx={{
              width: '100%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={loggedOn.name}
               // label={loggedOn.label}
                label={(
                  <span>
                    {loggedOn.label}
                    <span className="text-danger ml-2px"> *</span>
                  </span>
                )}
                value={selectedDate}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
                onChange={handleDateChange}
                disableFuture
                defaultValue={logged_on ? new Date(getDateTimeSeconds(logged_on)) : ''}
                format="dd/MM/yyyy HH:mm:ss"
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <MuiTextField
            sx={{
              width: '100%',
              marginBottom: '20px',
            }}
            name={Tenant.name}
            label={Tenant.label}
            type="text"
          />
          {((operation && operation.name === 'Collection') || operation === 'Collection') && (configData && configData.has_security_by !== 'None') && (
          <MuiTextField
            sx={{
              width: '100%',
              marginBottom: '20px',
            }}
            isRequired={configData && configData.has_security_by === 'Required'}
            name={securityBy.name}
            label={securityBy.label}
            type="text"
          />
          )}
        </Grid>
      </Grid>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SingleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <MultipleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraSearchModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              headers={headers}
              oldValues={oldValues}
            />
          </DialogContentText>
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
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
