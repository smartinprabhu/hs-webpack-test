/* eslint-disable radix */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog,
  DialogContent, Box, FormLabel, DialogContentText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import JoditEditor from 'jodit-react';

import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';
import SingleSearchModal from '@shared/searchModals/singleSearchModal';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import {
  extractOptionsObject,
  generateErrorMessage,
  isAllCompany,
} from '../../util/appUtils';
import {
  getComplianceAct,
  getComplianceCategory,
  getComplianceTemplateDetail,
  getSubmittedTo,
} from '../complianceService';

import customData from '../data/customData.json';
import { getRuleTypeLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const BasicTempForm = React.memo((props) => {
  const {
    setRepeatUntildata,
    setEendsOnData,
    setNextExpiryDateData,
    editId,
    isUpdate,
    setFieldValue,
    setFieldTouched,
    formField: {
      name,
      complianceAct,
      complianceCategory,
      submittedTo,
      hasExpiry,
      expirySchedule,
      expiryScheduleType,
      renewalLeadTime,
      nextExpiryDate,
      Type,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    compliance_id,
    compliance_category_id,
    compliance_act,
    submitted_to,
    url_link,
    renewal_lead_time,
    is_has_expiry,
    expiry_schedule_type,
    type,
  } = formValues;
  const [caOpen, setCaOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [caKeyword, setCaKeyword] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [catKeyword, setCatKeyword] = useState('');
  const [subOpen, setSubOpen] = useState(false);
  const [subKeyword, setSubKeyword] = useState('');
  const [rTypeOpen, setRtypeOpen] = useState(false);
  const [repeatOpen, setRepeatOpen] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [nextExp, setNextExp] = useState('');
  const [endDateFormat, setEndDateFormat] = useState('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [fieldValueClear, setFieldValueClear] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    complianceActInfo, submittedToInfo, templateCompliance, addComplianceInfo, categoryInfo,
  } = useSelector((state) => state.compliance);
  const {
    allowCompanies, tenantUpdateInfo,
  } = useSelector((state) => state.setup);
  const { equipmentInfo } = useSelector((state) => state.ticket);
  // const companies = getAllowedCompanies(userInfo);

  let editor = useRef(null);

  const editorConfig = useMemo(() => ({
    spellcheck: true,
    height: 200,
    minHeight: 200,
    autofocus: true,
    allowResizeY: false,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,add-new-line,upload,image',
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: 'eraser,ul,ol,table,link,undo,redo,fullsize',
    events:
             {
               afterInit: (instance) => { editor = instance; },
             },
  }), []);

  const isAllCompanies = isAllCompany(userInfo, userRoles);

  const userCompanyIdAdd = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  const companies = userCompanyIdAdd;

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.err) || (addComplianceInfo && addComplianceInfo.err)) setDetailShow(false);
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (compliance_id) {
      const complianceId = compliance_id && compliance_id.id ? compliance_id.id : false;
      if (complianceId && detailShow) {
        dispatch(getComplianceTemplateDetail(complianceId, appModels.COMPLIANCETEMPLATE));
      }
    }
  }, [compliance_id]);

  useEffect(() => {
    if (nextExp) {
      setNextExpiryDateData(nextExp);
    }
  }, [nextExp]);

  useEffect(() => {
    setChecked(is_has_expiry);
  }, [is_has_expiry]);

  /* useEffect(() => {
    if (renewal_lead_time && !editId) {
      setFieldValue('next_expiry_date', moment(new Date()).add(renewal_lead_time, 'days'));
    }
  }, [renewal_lead_time, isUpdate]); */

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && caOpen) {
        await dispatch(getComplianceAct(companies, appModels.COMPLIANCEACT, caKeyword));
      }
    })();
  }, [userInfo, caKeyword, caOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && catOpen) {
        await dispatch(getComplianceCategory(companies, appModels.COMPLIANCECATEGORY, false, catKeyword));
      }
    })();
  }, [userInfo, catKeyword, catOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subOpen) {
        await dispatch(getSubmittedTo(companies, appModels.PARTNER, 'is_compliance', subKeyword));
      }
    })();
  }, [userInfo, subKeyword, subOpen]);

  let userCompanies = [];

  if (userInfo && userInfo.loading) {
    userCompanies = [{ name: 'Loading..' }];
  }
  if (userInfo && userInfo.data) {
    userCompanies = userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  }

  const onComplianceActKeyWordChange = (event) => {
    setCaKeyword(event.target.value);
  };

  const onComplianceCatKeyWordChange = (event) => {
    setCatKeyword(event.target.value);
  };

  const onSubKeyWordChange = (event) => {
    setSubKeyword(event.target.value);
  };

  const onCaKeywordClear = () => {
    setCaKeyword(null);
    setFieldValue('compliance_act', '');
    setCaOpen(false);
  };

  const onCatKeywordClear = () => {
    setCatKeyword(null);
    setFieldValue('compliance_category_id', '');
    setCatOpen(false);
  };

  const onSubKeywordClear = () => {
    setSubKeyword(null);
    setFieldValue('submitted_to', '');
    setSubOpen(false);
  };

  const showCaModal = () => {
    setModelValue(appModels.COMPLIANCEACT);
    setFieldName('compliance_act');
    setModalName('Compliance Act');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.COMPLIANCECATEGORY);
    setFieldName('compliance_category_id');
    setModalName('Compliance Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showSubModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('submitted_to');
    setModalName('Submitted To');
    setOtherFieldName('is_compliance');
    setOtherFieldValue(true);
    setCompanyValue('');
    setExtraModal(true);
  };

  const onHtmlChange = (data) => {
    setFieldValue('url_link', data);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setFieldValue('is_has_expiry', event.target.checked);
  };

  const complianceActOptions = extractOptionsObject(complianceActInfo, compliance_act);
  const partnersOptions = extractOptionsObject(submittedToInfo, submitted_to);
  const categoryOptions = extractOptionsObject(categoryInfo, compliance_category_id);

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={name.name}
            label={name.label}
            isRequired
            setFieldValue={setFieldValue}
            type="text"
            inputProps={{ maxLength: 150 }}
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={complianceCategory.name}
            label={complianceCategory.label}
            oldValue={getOldData(compliance_category_id)}
            value={compliance_category_id && compliance_category_id.name ? compliance_category_id.name : getOldData(compliance_category_id)}
            apiError={(categoryInfo && categoryInfo.err) ? generateErrorMessage(categoryInfo) : false}
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
            loading={categoryInfo && categoryInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onComplianceCatKeyWordChange}
                variant="standard"
                required
                className="without-padding"
                label={complianceCategory.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoryInfo && categoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(compliance_category_id)) || (compliance_category_id && compliance_category_id.id) || (catKeyword && catKeyword.length > 0)) && (
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
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={complianceAct.name}
            label={complianceAct.label}
            oldValue={getOldData(compliance_act)}
            value={compliance_act && compliance_act.name ? compliance_act.name : getOldData(compliance_act)}
            apiError={(complianceActInfo && complianceActInfo.err) ? generateErrorMessage(complianceActInfo) : false}
            open={caOpen}
            size="small"
            onOpen={() => {
              setCaOpen(true);
              setCaKeyword('');
            }}
            onClose={() => {
              setCaOpen(false);
              setCaKeyword('');
            }}
            loading={complianceActInfo && complianceActInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={complianceActOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onComplianceActKeyWordChange}
                variant="standard"
                required
                label={complianceAct.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {complianceActInfo && complianceActInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(compliance_act)) || (compliance_act && compliance_act.id) || (caKeyword && caKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCaKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCaModal}
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
            name={submittedTo.name}
            label={submittedTo.label}
            oldValue={getOldData(submitted_to)}
            value={submitted_to && submitted_to.name ? submitted_to.name : getOldData(submitted_to)}
            apiError={(submittedToInfo && submittedToInfo.err) ? generateErrorMessage(submittedToInfo) : false}
            open={subOpen}
            size="small"
            onOpen={() => {
              setSubOpen(true);
              setSubKeyword('');
            }}
            onClose={() => {
              setSubOpen(false);
              setSubKeyword('');
            }}
            loading={submittedToInfo && submittedToInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={partnersOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onSubKeyWordChange}
                variant="standard"
                required
                label={submittedTo.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {submittedToInfo && submittedToInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(submitted_to)) || (submitted_to && submitted_to.id) || (subKeyword && subKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onSubKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSubModal}
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
            name={Type.name}
            label={Type.label}
            open={typeOpen}
            disableClearable
            oldvalue={type}
            defaultValue={type && type.label ? type.label : type}
            size="small"
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.typeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={Type.label}
                className="without-padding"
                placeholder="Search"
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

        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} name={hasExpiry.name} color="success" />}
            label="Has Expiry?"
          />
          {is_has_expiry && (
            <>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <MuiTextField
                    sx={{
                      marginBottom: '20px',
                    }}
                    isRequired
                    setFieldValue={setFieldValue}
                    name={expirySchedule.name}
                    label={expirySchedule.label}
                    type="text"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <MuiAutoComplete
                    sx={{
                      marginBottom: '20px',
                    }}
                    name={expiryScheduleType.name}
                    label={expiryScheduleType.label}
                    labelClassName="font-weight-600"
                    className="bg-white"
                    open={rTypeOpen}
                    disableClearable
                    oldValue={getRuleTypeLabel(expiry_schedule_type)}
                    value={expiry_schedule_type && expiry_schedule_type.label ? expiry_schedule_type.label : getRuleTypeLabel(expiry_schedule_type)}
                    size="small"
                    onOpen={() => {
                      setRtypeOpen(true);
                    }}
                    onClose={() => {
                      setRtypeOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={customData.ruleTypes}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        required
                        label={expiryScheduleType.label}
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
                </Grid>
              </Grid>
              <MuiTextField
                sx={{
                  marginBottom: '20px',
                }}
                isRequired
                name={renewalLeadTime.name}
                setFieldValue={setFieldValue}
                label={renewalLeadTime.label}
                type="text"
              />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box
            sx={{
              marginTop: '10px',
              marginBottom: '20px',
            }}
          >
            <p className="mb-1">
              <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Compliance Info</FormLabel>
            </p>
            <JoditEditor
              ref={editor}
              value={url_link}
              config={editorConfig}
              onBlur={onHtmlChange}
            />
          </Box>
        </Grid>
      </Grid>

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); setDetailShow(true); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SingleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); setDetailShow(true); }}
              fieldName={fieldName}
              fields={columns}
              isAdd
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

BasicTempForm.propTypes = {
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

export default BasicTempForm;
