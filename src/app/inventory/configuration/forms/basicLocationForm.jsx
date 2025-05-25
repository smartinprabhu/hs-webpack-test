/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { Dialog, DialogContent, TextField, Box, } from "@mui/material";
import { IoCloseOutline } from 'react-icons/io5';

import {
  getStockLocations,
} from '../../../purchase/purchaseService';
import { getPartners } from '../../../assets/equipmentService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractOptionsObject,
} from '../../../util/appUtils';
import SearchModalMultiple from './searchModal';
import { getUsage } from '../../adjustments/utils/utils';
import filtersFields from '../data/filtersFields.json';

import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiCheckboxField from '../../../commonComponents/formFields/muiCheckbox';

const appModels = require('../../../util/appModels').default;

const BasicLocationForm = React.memo((props) => {
  const {
    setFieldValue,
    formField: {
      name,
      locationId,
      locationType,
      partnerId,
      companyId,
      scrapLocation,
      returnLocation,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    company_id,
    partner_id,
    location_id,
    usage,
  } = formValues;

  const [locationOpen, setLocationOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerKeyword, setOwnerKeyword] = useState('');
  const [openUsage, setOpenUsage] = useState(false);
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
  const { stockLocations } = useSelector((state) => state.purchase);
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
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword, 'inventory'));
    }
  }, [userInfo, locKeyword, locationOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && ownerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, false, ownerKeyword));
    }
  }, [userInfo, ownerKeyword, ownerOpen]);

  const onLocationKeyWordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onOwnerKeyWordChange = (event) => {
    setOwnerKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setLocKeyword(null);
    setFieldValue('location_id', '');
    setLocationOpen(false);
  };

  const onOwnerKeywordClear = () => {
    setOwnerKeyword(null);
    setFieldValue('partner_id', '');
    setOwnerOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('location_id');
    setModalName('Parent Location');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['name', 'location_id', 'display_name']);
    setExtraMultipleModal(true);
  };

  const showOwnerRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('partner_id');
    setModalName('Owner');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const locationOptions = extractOptionsObject(stockLocations, location_id);
  const ownerOptions = extractOptionsObject(partnersInfo, partner_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const usageOptions = filtersFields.locationTypeList;

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <>
      <Box sx={{ width: '50%' }}>
        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={name.name}
          label={name.label}
          autoComplete="off"
          isRequired
          type="text"
          formGroupClassName="m-1"
          maxLength="30"
        />

        <MuiAutoComplete
          sx={{
            marginBottom: "10px",
          }}
          name={locationId.name}
          label={locationId.label}
          formGroupClassName="m-1"
          oldValue={getOldData(location_id)}
          value={location_id && location_id.name ? location_id.name : getOldData(location_id)}
          apiError={(stockLocations && stockLocations.err && locationOpen) ? generateErrorMessage(stockLocations) : false}
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
          loading={stockLocations && stockLocations.loading && locationOpen}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={locationOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onLocationKeyWordChange}
              variant="standard"
              label={locationId.label}
              value={locKeyword}
              className={((location_id && location_id.id) || (locKeyword && locKeyword.length > 0) || (location_id && location_id.length))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {stockLocations && stockLocations.loading && locationOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((location_id && location_id.id) || (locKeyword && locKeyword.length > 0) || (location_id && location_id.length)) && (
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

        <MuiAutoComplete
          sx={{
            marginBottom: "10px",
          }}
          name={locationType.name}
          label={locationType.label}
          formGroupClassName="mb-2"
          labelClassName="mb-2"
          size="small"
          open={openUsage}
          onOpen={() => {
            setOpenUsage(true);
          }}
          onClose={() => {
            setOpenUsage(false);
          }}
          value={usage && usage.name ? usage.name : getUsage(usageOptions, usage)}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={usageOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={locationType.label}
              className="without-padding"
              placeholder="Type"
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
            marginBottom: "10px",
          }}
          name={partnerId.name}
          label={partnerId.label}
          formGroupClassName="m-1"
          oldValue={getOldData(partner_id)}
          value={partner_id && partner_id.name ? partner_id.name : getOldData(partner_id)}
          apiError={(partnersInfo && partnersInfo.err && ownerOpen) ? generateErrorMessage(partnersInfo) : false}
          open={ownerOpen}
          size="small"
          onOpen={() => {
            setOwnerOpen(true);
            setOwnerKeyword('');
          }}
          onClose={() => {
            setOwnerOpen(false);
            setOwnerKeyword('');
          }}
          loading={partnersInfo && partnersInfo.loading && ownerOpen}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={ownerOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onOwnerKeyWordChange}
              variant="standard"
              label={partnerId.label}
              value={ownerKeyword}
              className={((partner_id && partner_id.id) || (ownerKeyword && ownerKeyword.length > 0) || (partner_id && partner_id.length))
                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {partnersInfo && partnersInfo.loading && ownerOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((partner_id && partner_id.id) || (locKeyword && locKeyword.length > 0) || (partner_id && partner_id.length)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onOwnerKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showOwnerRequestorModal}
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
              label={companyId.label}
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

        <MuiCheckboxField
          className="ml-1 mt-2"
          name={scrapLocation.name}
          label={scrapLocation.label}
        />

        <MuiCheckboxField
          className="ml-1 mt-2"
          name={returnLocation.name}
          label={returnLocation.label}
        />
      </Box>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </>
  );
});

BasicLocationForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicLocationForm;