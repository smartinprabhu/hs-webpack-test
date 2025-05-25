/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Label,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { IoCloseOutline } from 'react-icons/io5';

import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import ReactFileReader from 'react-file-reader';
import { Cascader } from 'antd';
import 'antd/dist/antd.css';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Button, Tabs, Tab, Box, RadioGroup, TextField } from '@mui/material';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getTeamList, getSpaceTypes, getSpaceSubTypes, createSpace,
  resetCreateSpace, getPartners,
} from '../equipmentService';
import { getAssetCategoryList } from '../../preventiveMaintenance/ppmService';
import validationSchema from './formModel/validationSchema';
import locationFormModel from './formModel/locationFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  generateErrorMessage, integerKeyPress, getArrayFromValues,
  getAllCompanies, TabPanel,
} from '../../util/appUtils';
import { bytesToSize } from '../../util/staticFunctions';
import theme from '../../util/materialTheme';
import spaceStatusList from '../../spaceManagement/data/spaceActions.json';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiFormLabel from '../../commonComponents/formFields/muiFormLabel';

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const appModels = require('../../util/appModels').default;

const { formId, formField } = locationFormModel;

const AddLocation = (props) => {
  const {
    spaceCategory,
    afterReset,
    spaceId,
    pathName,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [assetOpen, setAssetOpen] = useState(false);
  const [typeIdValue, setTypeIdValue] = useState(false);
  const [assetkeyword, setAssetKeyword] = useState('');
  const [spaceTypeOpen, setSpaceTypeOpen] = useState(false);
  const [spaceTypeKeyword, setSpaceTypeKeyword] = useState('');
  const [subSpaceTypeOpen, setSubSpaceTypeOpen] = useState(false);
  const [subSpaceTypeKeyword, setSubSpaceTypeKeyword] = useState('');
  const [spaceStatusOpen, setSpaceStatusOpen] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [currentTab, setActive] = useState('Basic');
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { allowedCompanies } = useSelector((state) => state.setup);
  const { assetCategoriesInfo } = useSelector((state) => state.ppm);
  const {
    teamsInfo, spaceTypesInfo, spaceSubTypesInfo, createSpaceInfo, partnersInfo,
  } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  useEffect(() => {
    dispatch(resetCreateSpace());
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      formInitialValues.company_id = userCompanyId;
    }
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, assetkeyword));
      }
    })();
  }, [assetOpen, assetkeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceTypeOpen) {
        await dispatch(getSpaceTypes(companies, appModels.SPACETYPE, spaceTypeKeyword));
      }
    })();
  }, [spaceTypeOpen, spaceTypeKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subSpaceTypeOpen && (typeIdValue && typeIdValue.id)) {
        await dispatch(getSpaceSubTypes(companies, appModels.SPACESUBTYPE, typeIdValue.id, subSpaceTypeKeyword));
      }
    })();
  }, [subSpaceTypeOpen, typeIdValue, subSpaceTypeKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onCancel = () => {
    if (afterReset) afterReset();
    dispatch(resetCreateSpace());
  };

  const onAssetKeywordChange = (event) => {
    setAssetKeyword(event.target.value);
  };

  const onSpaceTypeKeywordChange = (event) => {
    setSpaceTypeKeyword(event.target.value);
  };

  const onSubSpaceTypeKeywordChange = (event) => {
    setSubSpaceTypeKeyword(event.target.value);
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
      }
    }
  };

  function handleSubmit(values) {
    const assetCategory = values.asset_category_id ? values.asset_category_id.id : '';
    const subType = values.sub_type_id ? values.sub_type_id.id : '';
    const spaceStatusValue = values.space_status ? values.space_status.value : '';
    const vendorId = values.vendor_id && values.vendor_id.id
      ? values.vendor_id.id : '';
    const company = values.company_id && values.company_id.id ? values.company_id.id : false;

    const typeValue = values.type_id && values.type_id.id
      ? values.type_id.id : false;
    const maintenanceTeam = values.maintenance_team_id && values.maintenance_team_id.id
      ? values.maintenance_team_id.id : false;

    const isBookingAllowed = values.is_booking_allowed === 'yes';

    const postData = { ...values };

    postData.asset_category_id = assetCategory;
    postData.sub_type_id = subType;
    postData.type_id = typeValue;
    postData.vendor_id = vendorId;
    postData.company_id = company;
    postData.space_status = spaceStatusValue;
    postData.maintenance_team_id = maintenanceTeam;
    postData.parent_id = spaceId;
    postData.upload_images = fileDataImage || false;
    postData.is_booking_allowed = isBookingAllowed;

    /* if (spaceCategory === 'space' || spaceCategory === 'staircase') {
      postData.parent_id = greatParentId;
    }

    const assetCategoryName = values.asset_category_id ? values.asset_category_id.name : '';

    if (assetCategoryName === 'Floor' && spaceCategory === 'floor') {
      postData.parent_id = greatParentId;
    }

    if (assetCategoryName === 'Room' && spaceCategory === 'room') {
      postData.parent_id = greatParentId;
    } */

    const payload = { model: appModels.SPACE, values: postData };
    dispatch(createSpace(appModels.SPACE, payload));
    setimgValidation(false);
    setimgSize(false);
    setFileDataImage(false);
    setFileDataType(false);
  }

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  let teamOptions = [];
  let assetCategoryOptions = [];
  let spaceTypeOptions = [];
  let spaceSubTypeOptions = [];
  let vendorOptions = [];

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (teamsInfo && teamsInfo.data) {
    teamOptions = teamsInfo.data;
  }

  if (assetCategoriesInfo && assetCategoriesInfo.loading) {
    assetCategoryOptions = [{ name: 'Loading..' }];
  }
  if (assetCategoriesInfo && assetCategoriesInfo.data) {
    let ids = ['Building', 'Floor', 'Room', 'Space', 'Staircase', 'Neighbourhood'];
    if (spaceCategory === 'building') {
      ids = ['Floor', 'Room'];
    }
    if (spaceCategory === 'floor') {
      ids = ['Room', 'Space', 'Neighbourhood'];
    }
    if (spaceCategory === 'room') {
      ids = ['Space', 'Neighbourhood'];
    }
    if (spaceCategory === 'space' || spaceCategory === 'staircase' || spaceCategory === 'neighbourhood') {
      ids = ['Space', 'Staircase', 'Neighbourhood'];
    }
    /* const arr = [...assetCategoryOptions, ...getArrayFromValues(assetCategoriesInfo.data, ids, 'name')];
    assetCategoryOptions = [...new Map(arr.map((item) => [item.name, item])).values()]; */
    assetCategoryOptions = getArrayFromValues(assetCategoriesInfo.data, ids, 'name');
  }

  if (spaceTypesInfo && spaceTypesInfo.loading) {
    spaceTypeOptions = [{ name: 'Loading..' }];
  }
  if (spaceTypesInfo && spaceTypesInfo.data) {
    spaceTypeOptions = spaceTypesInfo.data;
  }

  if (spaceSubTypesInfo && spaceSubTypesInfo.loading) {
    spaceSubTypeOptions = [{ name: 'Loading..' }];
  }
  if (spaceSubTypesInfo && spaceSubTypesInfo.data) {
    spaceSubTypeOptions = spaceSubTypesInfo.data;
  }

  if (partnersInfo && partnersInfo.loading) {
    if (vendorOpen) {
      vendorOptions = [{ name: 'Loading..' }];
    }
  }

  if (partnersInfo && partnersInfo.data) {
    vendorOptions = partnersInfo.data;
  }

  return (
    <>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isValid, dirty, setFieldValue, values,
        }) => (
          <Form id={formId}>
            {createSpaceInfo && createSpaceInfo.data ? ('') : (
              <ThemeProvider theme={theme}>
                <Box sx={{ width: '100%' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Basic" />
                    <Tab label="Advanced" />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <Box sx={{ display: 'flex', gap: '5%' }}>
                      <Box sx={{ width: '50%' }}>
                        <MuiTextField
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.spaceName.name}
                          label={formField.spaceName.label}
                          isRequired={formField.spaceName.required}
                          type="text"
                          inputProps={{
                            maxLength: 30
                          }}
                        />
                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.Type.name}
                          label={formField.Type.label}
                          open={assetOpen}
                          size="small"
                          onOpen={() => {
                            setAssetOpen(true);
                            setAssetKeyword('');
                          }}
                          onClose={() => {
                            setAssetOpen(false);
                            setAssetKeyword('');
                          }}
                          loading={assetCategoriesInfo && assetCategoriesInfo.loading}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={assetCategoryOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onAssetKeywordChange}
                              label={`${formField.Type.label}`}
                              variant="standard"
                              required={formField.Type.required}
                              className={values.asset_category_id && values.asset_category_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {assetCategoriesInfo && assetCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {values.asset_category_id.id && (
                                        <IconButton onClick={() => {
                                          setAssetKeyword('');
                                          setFieldValue('asset_category_id', '');
                                        }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(assetCategoriesInfo && assetCategoriesInfo.err && assetOpen)
                          && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetCategoriesInfo)}</span></FormHelperText>)}
                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.maintenanceTeam.name}
                          label={formField.maintenanceTeam.label}
                          open={teamOpen}
                          size="small"
                          onOpen={() => {
                            setTeamOpen(true);
                            setTeamKeyword('');
                          }}
                          onClose={() => {
                            setTeamOpen(false);
                            setTeamKeyword('');
                          }}
                          loading={teamsInfo && teamsInfo.loading}
                          getOptionSelected={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={teamOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onTeamKeywordChange}
                              label={`${formField.maintenanceTeam.label}`}
                              variant="standard"
                              required={formField.maintenanceTeam.required}
                              className={values.maintenance_team_id && values.maintenance_team_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {values.maintenance_team_id.id && (
                                        <IconButton onClick={() => {
                                          setTeamKeyword('');
                                          setFieldValue('maintenance_team_id', '');
                                        }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(teamsInfo && teamsInfo.err && teamOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.company.name}
                          label={formField.company.label}
                          //isRequired={formField.company.required}
                          open={companyOpen}
                          disabled
                          size="small"
                          onOpen={() => {
                            setCompanyOpen(true);
                          }}
                          onClose={() => {
                            setCompanyOpen(false);
                          }}
                          value={values.company_id ? values.company_id.name : ''}
                          getOptionSelected={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={userCompanies}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`${formField.company.label}`}
                              variant="standard"
                              required={formField.company.required}
                              className={values.company_id && values.company_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Search & Select"
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
                      </Box>
                      <Box sx={{ width: '50%' }}>
                        <MuiTextField
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.shortCode.name}
                          label={formField.shortCode.label}
                          isRequired={formField.shortCode.required}
                          inputProps={{ maxLength: 15 }}
                          type="text"
                        />
                        <Label className="m-0">
                          {formField.parentId.label}
                          {pathName ? (<span className="ml-2px text-danger">*</span>) : ''}
                        </Label>
                        <br />
                        <Cascader
                          defaultValue={[pathName || false]}
                          disabled
                          className="thin-scrollbar font-size-13 w-100"
                          changeOnSelect
                        />
                        <Label for={formField.bookingAllowed.name} className="m-0 mt-3">
                          Booking Allowed
                          <span className="ml-2px text-danger">*</span>
                        </Label>
                        <br />
                        <RadioGroup
                          row
                          aria-labelledby="demo-form-control-label-placement"
                          name="position"
                          defaultValue="top"
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                        >
                          <MuiFormLabel
                            name={formField.bookingAllowed.name}
                            checkedvalue="yes"
                            id="yes"
                            label={formField.bookingAllowed.label}
                          />
                          <MuiFormLabel
                            name={formField.bookingAllowed.name}
                            checkedvalue="no"
                            id="no"
                            label={formField.bookingAllowed.label1}
                          />
                        </RadioGroup>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box sx={{ display: 'flex', gap: '5%' }}>
                      <Box sx={{ width: '50%' }}>
                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          label={formField.spaceType.label}
                          name={formField.spaceType.name}
                          open={spaceTypeOpen}
                          size="small"
                          value={values.type_id && values.type_id.name ? values.type_id.name : ''}
                          onOpen={() => {
                            setSpaceTypeOpen(true);
                            setSpaceTypeKeyword('');
                          }}
                          onClose={() => {
                            setSpaceTypeOpen(false);
                            setSpaceTypeKeyword('');
                          }}
                          loading={spaceTypesInfo && spaceTypesInfo.loading}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={spaceTypeOptions}
                          onChange={(e, data) => { setFieldValue(formField.spaceType.name, data); setFieldValue(formField.subType.name, ''); setTypeIdValue(data); }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onSpaceTypeKeywordChange}
                              variant="standard"
                              label={formField.spaceType.label}
                              className="without-padding custom-icons"
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {spaceTypesInfo && spaceTypesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {values.type_id && values.type_id.id && (
                                        <IconButton onClick={() => {
                                          setFieldValue('type_id', '');
                                          setSpaceTypeKeyword('');
                                        }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(spaceTypesInfo && spaceTypesInfo.err && spaceTypeOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceTypesInfo)}</span></FormHelperText>)}
                        <MuiTextField
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.maxOccupancy.name}
                          label={formField.maxOccupancy.label}
                          isRequired={formField.maxOccupancy.required}
                          type="text"
                          onKeyPress={integerKeyPress}
                        />
                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.vendorId.name}
                          label={formField.vendorId.label}
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
                          getOptionSelected={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={vendorOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onVendorKeywordChange}
                              label={formField.vendorId.label}
                              variant="standard"
                              className={values.vendor_id && values.vendor_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {values.vendor_id && values.vendor_id.id && (
                                        <IconButton onClick={() => {
                                          setFieldValue('vendor_id', '');
                                          setVendorKeyword('');
                                        }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(partnersInfo && partnersInfo.err && vendorOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>)}
                      </Box>
                      <Box sx={{ width: '50%' }}>
                        <MuiTextField
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.areaSqft.name}
                          label={formField.areaSqft.label}
                          isRequired={formField.areaSqft.required}
                          type="text"
                        />
                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.subType.name}
                          label={formField.subType.label}
                          isRequired={formField.subType.required}
                          open={subSpaceTypeOpen}
                          size="small"
                          onOpen={() => {
                            setSubSpaceTypeOpen(true);
                            setSubSpaceTypeKeyword('');
                          }}
                          onClose={() => {
                            setSubSpaceTypeOpen(false);
                            setSubSpaceTypeKeyword('');
                          }}
                          loading={spaceSubTypesInfo && spaceSubTypesInfo.loading}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={spaceSubTypeOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onSubSpaceTypeKeywordChange}
                              label={formField.subType.label}
                              variant="standard"
                              className={values.sub_type_id && values.sub_type_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {spaceSubTypesInfo && spaceSubTypesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {values.sub_type_id && values.sub_type_id.id && (
                                        <IconButton onClick={() => {
                                          setFieldValue('sub_type_id', '');
                                          setSubSpaceTypeKeyword('');
                                        }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(spaceSubTypesInfo && spaceSubTypesInfo.err && subSpaceTypeOpen)
                          && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceSubTypesInfo)}</span></FormHelperText>)}

                        <MuiAutoComplete
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={formField.spaceStatus.name}
                          label={formField.spaceStatus.label}
                          isRequired={formField.spaceStatus.required}
                          open={spaceStatusOpen}
                          size="small"
                          onOpen={() => {
                            setSpaceStatusOpen(true);
                          }}
                          onClose={() => {
                            setSpaceStatusOpen(false);
                          }}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                          options={spaceStatusList.space}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label={formField.spaceStatus.label}
                              className={values.space_status && values.space_status.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    <InputAdornment position="end">
                                      {values.space_status && values.space_status.id && (
                                        <IconButton onClick={() => {
                                          setFieldValue('space_status', '');
                                        }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      )}
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        <FormControl className={classes.margin}>
                          <Label for="upload_images">Map</Label>
                          {!fileDataImage && (
                            <ReactFileReader
                              multiple
                              elementId="fileUpload"
                              handleFiles={handleFiles}
                              fileTypes=".png"
                              base64
                            >
                              <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                                <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                                <p className="font-weight-500">Select a file (.png only)</p>
                              </div>
                            </ReactFileReader>
                          )}
                          {fileDataImage && (
                            <div className="position-relative">
                              <img
                                src={`${fileDataType}${fileDataImage}`}
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
                                    setFileDataType(false);
                                  }}
                                  alt="remove"
                                />
                              </div>
                            </div>
                          )}
                        </FormControl>
                        {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
                        {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}

                      </Box>
                    </Box>
                  </TabPanel>
                </Box>
              </ThemeProvider>
            )}
            {createSpaceInfo && createSpaceInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(createSpaceInfo && createSpaceInfo.err) && (
              <SuccessAndErrorFormat response={createSpaceInfo} />
            )}
            {(createSpaceInfo && createSpaceInfo.data) && (
              <SuccessAndErrorFormat response={createSpaceInfo} successMessage="Space added successfully.." />
            )}
            <hr />
            <div className="float-right mr-4">
              {(createSpaceInfo && createSpaceInfo.data) ? (
                ''
              ) : (
                <>
                  <Button
                    disabled={!(isValid && dirty)}
                    type="submit"
                    size="sm"
                    variant='contained'
                  >
                    Create
                  </Button>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
      <div className="float-right mr-4">
        {(createSpaceInfo && createSpaceInfo.data) && (
          <Button
            type="button"
            size="sm"
            variant='contained'
            onClick={() => onCancel()}
          >
            Ok
          </Button>
        )}
      </div>
    </>
  );
};

AddLocation.defaultProps = {
  spaceId: false,
  pathName: false,
};

AddLocation.propTypes = {
  spaceCategory: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  spaceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  pathName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default AddLocation;
