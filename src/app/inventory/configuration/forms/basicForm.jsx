/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Dialog, DialogContent, DialogContentText, Box } from '@mui/material'
import { IoCloseOutline } from 'react-icons/io5';

import { useFormikContext } from 'formik';
import { getPartners } from '../../../assets/equipmentService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractOptionsObject,
} from '../../../util/appUtils';
import SearchModalMultiple from './searchModal';
import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiTextField from "../../../commonComponents/formFields/muiTextField";
import { makeStyles } from '@material-ui/core/styles';
import { AddThemeColor } from '../../../themes/theme';

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
  root: {
    // input label when focused
    "& label.Mui-focused": {
      color: AddThemeColor({}).color
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
      borderBottomColor: AddThemeColor({}).color
    },
    // focused color for input with variant='filled'
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: AddThemeColor({}).color
    },
    // focused color for input with variant='outlined'
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: AddThemeColor({}).color
      }
    }
  }
});

const BasicForm = React.memo((props) => {
  const {
    setFieldValue,
    formField: {
      name,
      shortName,
      partnerId,
      companyId,
    },
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    company_id,
    partner_id,
  } = formValues;

  const [locationOpen, setLocationOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [companyOpen, setCompanyOpen] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);

  const { userInfo } = useSelector((state) => state.user);
  const { allowedCompanies } = useSelector((state) => state.setup);
  const { partnersInfo } = useSelector((state) => state.equipment);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      const companyIds = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? { id: siteDetails.data[0].id, name: siteDetails.data[0].name } : userCompanyId;
      setFieldValue('company_id', companyIds);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && locationOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, false, locKeyword));
    }
  }, [userInfo, locKeyword, locationOpen]);

  const onLocationKeyWordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setLocKeyword(null);
    setFieldValue('partner_id', '');
    setLocationOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('partner_id');
    setModalName('Address');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const locationOptions = extractOptionsObject(partnersInfo, partner_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <>
      <Box
        sx={{
          marginTop: "20px",
          display: 'flex',
          gap: '35px'
        }}
      >
        <Box sx={{ width: '50%' }}>
          <MuiTextField
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={name.name}
            label={name.label}
            autoComplete="off"
            isRequired
            type="text"
            formGroupClassName="m-1"
            inputProps={{ maxLength: 30 }}
          />
          <MuiTextField
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={shortName.name}
            label={shortName.label}
            autoComplete="off"
            isRequired
            type="text"
            formGroupClassName="m-1"
            inputProps={{ maxLength: 30 }}
          />
        </Box>
        <Box sx={{ width: '50%' }}>
          <MuiAutoComplete
            sx={{
              marginTop: "5px",
              marginBottom: "10px",
            }}
            name={companyId.name}
            label={companyId.label}
            formGroupClassName="m-1"
            open={companyOpen}
            size="small"
            disabled
            oldValue={getOldData(company_id)}
            value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
            onOpen={() => {
              setCompanyOpen(true);
            }}
            onClose={() => {
              setCompanyOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={userCompanies}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                className="without-padding"
                placeholder="Search and Select"
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
          <MuiAutoComplete
            sx={{
              marginTop: "13px",
              marginBottom: "10px",
            }}
            name={partnerId.name}
            label={partnerId.label}
            formGroupClassName="m-1"
            oldValue={getOldData(partner_id)}
            value={partner_id && partner_id.name ? partner_id.name : getOldData(partner_id)}
            apiError={(partnersInfo && partnersInfo.err && locationOpen) ? generateErrorMessage(partnersInfo) : false}
            open={locationOpen}
            size="small"
            onOpen={() => {
              setLocationOpen(true);
              setLocKeyword('');
            }}
            onClose={() => {
              setLocationOpen(false);
              setLocKeyword('');
            }}
            classes={{
              root: classes.root,
            }}
            loading={partnersInfo && partnersInfo.loading && locationOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={locationOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onLocationKeyWordChange}
                variant="standard"
                value={locKeyword}
                label={partnerId.label}
                className={((partner_id && partner_id.id) || (locKeyword && locKeyword.length > 0) || (partner_id && partner_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((partner_id && partner_id.id) || (partner_id && partner_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showRequestorModal}
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
        </Box>
      </Box>
      <Dialog size="lg" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
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
    </>
  );
});

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;