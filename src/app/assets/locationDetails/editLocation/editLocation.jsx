/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Label,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import ReactFileReader from 'react-file-reader';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Tabs, Tab, Box, RadioGroup } from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';

import validationSchema from './validationSchema';
import {
  getTeamList, getSpaceTypes, getSpaceSubTypes, updateLocationData,
  resetUpdateLocationInfo, getSpaceData, getPartners,
} from '../../equipmentService';
import { getAssetCategoryList } from '../../../preventiveMaintenance/ppmService';
import {
  generateErrorMessage, integerKeyPress,
  trimJsonObject, getAllCompanies, TabPanel
} from '../../../util/appUtils';
import { bytesToSize } from '../../../util/staticFunctions';
import theme from '../../../util/materialTheme';
import { getSpacesList } from '../../../helpdesk/ticketService';
import spaceStatusList from '../../../spaceManagement/data/spaceActions.json';
import tabs from '../tabs.json';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiFormLabel from '../../../commonComponents/formFields/muiFormLabel';

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const appModels = require('../../../util/appModels').default;

const EditLocation = (props) => {
  const {
    afterReset,
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
  const [companyOpen, setCompanyOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [currentTab, setActive] = useState('Basic');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [fileDataType, setFileDataType] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { assetCategoriesInfo } = useSelector((state) => state.ppm);
  const { spacesInfo } = useSelector((state) => state.ticket);
  const {
    teamsInfo, spaceTypesInfo, spaceSubTypesInfo, updateLocationInfo,
    getSpaceInfo, partnersInfo,
  } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  useEffect(() => {
    dispatch(resetUpdateLocationInfo());
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [userInfo, teamKeyword, teamOpen]);

  // useEffect(() => {
  //   if ((userInfo && userInfo.data) && (updateLocationInfo && updateLocationInfo.data)) {
  //     const viewId = getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : '';
  //     dispatch(getSpaceData(appModels.SPACE, viewId));
  //   }
  // }, [updateLocationInfo]);

  useEffect(() => {
    (async () => {
      if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].type_id) {
        setTypeIdValue({ id: getSpaceInfo.data[0].type_id[0], name: getSpaceInfo.data[0].type_id[1] });
      }
    })();
  }, [getSpaceInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, assetkeyword));
      }
    })();
  }, [userInfo, assetkeyword, assetOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceTypeOpen) {
        await dispatch(getSpaceTypes(companies, appModels.SPACETYPE, spaceTypeKeyword));
      }
    })();
  }, [userInfo, spaceTypeKeyword, spaceTypeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && (typeIdValue && typeIdValue.id) && subSpaceTypeOpen) {
        await dispatch(getSpaceSubTypes(companies, appModels.SPACESUBTYPE, typeIdValue.id, subSpaceTypeKeyword));
      }
    })();
  }, [userInfo, typeIdValue, subSpaceTypeKeyword, subSpaceTypeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpacesList(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen]);

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const { allowedCompanies } = useSelector((state) => state.setup);

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const onCancel = () => {
    if (afterReset) afterReset();
    dispatch(resetUpdateLocationInfo());
    if (getSpaceInfo?.data?.[0]) {
      const viewId = getSpaceInfo.data[0].id
      dispatch(getSpaceData(appModels.SPACE, viewId));
    }
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
    const isBookingAllowed = values.is_booking_allowed === 'yes';

    const postDataValues = {
      name: values.name,
      space_name: values.space_name,
      max_occupancy: values.max_occupancy,
      area_sqft: values.area_sqft,
      asset_category_id: values.asset_category_id ? values.asset_category_id.id : '',
      type_id: values.type_id ? values.type_id.id : '',
      sub_type_id: values.sub_type_id ? values.sub_type_id.id : '',
      vendor_id: values.vendor_id && values.vendor_id.id ? values.vendor_id.id : '',
      // company_id: values.company_id && values.company_id.id ? values.company_id.id : '',
      space_status: values.space_status ? values.space_status.value : '',
      maintenance_team_id: values.maintenance_team_id ? values.maintenance_team_id.id : '',
      is_booking_allowed: isBookingAllowed,
    };

    const postData = { ...postDataValues };

    if (fileDataImage) {
      postData.upload_images = fileDataImage;
    }

    if (values.asset_category_id && values.asset_category_id.name && values.asset_category_id.name !== 'Building') {
      postData.parent_id = values.parent_id ? values.parent_id.id : '';
    }

    const id = getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : '';
    dispatch(updateLocationData(id, postData, appModels.SPACE));
    setimgValidation(false);
    setimgSize(false);
    setFileDataImage(false);
    setFileDataType(false);
  }

  function getBookingAllowedInfo(values) {
    let isBookAllowed = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].is_booking_allowed ? 'yes' : 'no';

    if (values && values.is_booking_allowed === 'yes') {
      isBookAllowed = 'yes';
    }

    if (values && values.is_booking_allowed === 'no') {
      isBookAllowed = 'no';
    }

    return isBookAllowed;
  }

  let teamOptions = [];
  let assetCategoryOptions = [];
  let spaceTypeOptions = [];
  let spaceSubTypeOptions = [];
  let vendorOptions = [];
  let spaceOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    vendorOptions = [{ name: 'Loading..' }];
  }

  if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].vendor_id) {
    const oldVendorId = [{ id: getSpaceInfo.data[0].vendor_id[0], name: getSpaceInfo.data[0].vendor_id[1] }];
    const newArr = [...vendorOptions, ...oldVendorId];
    vendorOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...vendorOptions, ...partnersInfo.data];
    vendorOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (spacesInfo && spacesInfo.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].parent_id) {
    const oldParentId = [{ id: getSpaceInfo.data[0].parent_id[0], path_name: getSpaceInfo.data[0].parent_id[1] }];
    const newArr = [...spaceOptions, ...oldParentId];
    spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (spacesInfo && spacesInfo.data) {
    const arr = [...spaceOptions, ...spacesInfo.data];
    spaceOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].maintenance_team_id) {
    const oldMaintenanceTeam = [{ id: getSpaceInfo.data[0].maintenance_team_id[0], name: getSpaceInfo.data[0].maintenance_team_id[1] }];
    const newArr = [...teamOptions, ...oldMaintenanceTeam];
    teamOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (teamsInfo && teamsInfo.data) {
    const arr = [...teamOptions, ...teamsInfo.data];
    teamOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (assetCategoriesInfo && assetCategoriesInfo.loading) {
    assetCategoryOptions = [{ name: 'Loading..' }];
  }
  if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].asset_category_id) {
    const oldSpaceCategory = [{ id: getSpaceInfo.data[0].asset_category_id[0], name: getSpaceInfo.data[0].asset_category_id[1] }];
    // const newArr = [...assetCategoryOptions, ...oldSpaceCategory];
    assetCategoryOptions = oldSpaceCategory;
  }

  if (assetCategoriesInfo && assetCategoriesInfo.data) {
    const arr = [...assetCategoryOptions, ...assetCategoriesInfo.data];
    assetCategoryOptions = [...new Map(arr.map((item) => [item.name, item])).values()];
  }

  if (spaceTypesInfo && spaceTypesInfo.loading) {
    spaceTypeOptions = [{ name: 'Loading..' }];
  }
  if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].type_id) {
    const oldTypeId = [{ id: getSpaceInfo.data[0].type_id[0], name: getSpaceInfo.data[0].type_id[1] }];
    const newArr = [...spaceTypeOptions, ...oldTypeId];
    spaceTypeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (spaceTypesInfo && spaceTypesInfo.data) {
    const arr = [...spaceTypeOptions, ...spaceTypesInfo.data];
    spaceTypeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (spaceSubTypesInfo && spaceSubTypesInfo.loading) {
    spaceSubTypeOptions = [{ name: 'Loading..' }];
  }
  if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].sub_type_id) {
    const oldSubTypeId = [{ id: getSpaceInfo.data[0].sub_type_id[0], name: getSpaceInfo.data[0].sub_type_id[1] }];
    const newArr = [...spaceSubTypeOptions, ...oldSubTypeId];
    spaceSubTypeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (spaceSubTypesInfo && spaceSubTypesInfo.data) {
    const arr = [...spaceSubTypeOptions, ...spaceSubTypesInfo.data];
    spaceSubTypeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={getSpaceInfo && getSpaceInfo.data ? trimJsonObject(getSpaceInfo.data[0]) : {}}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, setFieldValue, values,
          }) => (
            <Form id="update_space">
              {updateLocationInfo && updateLocationInfo.data ? ('') : (
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
                            name="space_name"
                            label="Name"
                            isRequired
                            type="text"
                            inputProps={{
                              maxLength: 30
                            }}
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                          />
                          <Autocomplete
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                            name="asset_category_id"
                            label="Type"
                            isRequired
                            oldValue={getOldData(values.asset_category_id)}
                            className="bg-white"
                            value={values.asset_category_id && values.asset_category_id.name ? values.asset_category_id.name : getOldData(values.asset_category_id)}
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
                                variant="standard"
                                label="Type"
                                required
                                className={values.asset_category_id
                                  && (values.asset_category_id.length || values.asset_category_id.id)
                                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {assetCategoriesInfo && assetCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {values.asset_category_id && (values.asset_category_id.length || values.asset_category_id.id) && (
                                          <IconButton onClick={() => {
                                            setAssetKeyword('');
                                            setFieldValue('asset_category_id', '');
                                          }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton>
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
                                      </InputAdornment>
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(assetCategoriesInfo && assetCategoriesInfo.err && assetOpen)
                            && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetCategoriesInfo)}</span></FormHelperText>)}
                          <Autocomplete
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                            name="maintenance_team_id"
                            label="Maintenance Team"
                            isRequired
                            oldValue={getOldData(values.maintenance_team_id)}
                            open={teamOpen}
                            size="small"
                            value={values.maintenance_team_id && values.maintenance_team_id.name ? values.maintenance_team_id.name : getOldData(values.maintenance_team_id)}
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
                                variant="standard"
                                label="Maintenance Team"
                                required
                                className={values.maintenance_team_id
                                  && (values.maintenance_team_id.length || values.maintenance_team_id.id)
                                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {values.maintenance_team_id && (values.maintenance_team_id.length || values.maintenance_team_id.id) && (
                                          <IconButton onClick={() => {
                                            setTeamKeyword('');
                                            setFieldValue('maintenance_team_id', '');
                                          }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton>
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
                                      </InputAdornment>
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(teamsInfo && teamsInfo.err && teamOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
                        </Box>
                        <Box sx={{ width: '50%' }}>
                          <MuiTextField
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                            name="name"
                            label="Short Code"
                            disabled
                            isRequired
                            type="text"
                          />
                          <MuiAutoComplete
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                            name="parent_id"
                            label="Parent Location"
                            isRequired={!!values.parent_id}
                            oldValue={getOldData(values.parent_id)}
                            open={spaceOpen}
                            size="small"
                            value={values.parent_id && values.parent_id.path_name ? values.parent_id.path_name : getOldData(values.parent_id)}
                            onOpen={() => {
                              setSpaceOpen(true);
                              setSpaceKeyword('');
                            }}
                            onClose={() => {
                              setSpaceOpen(false);
                              setSpaceKeyword('');
                            }}
                            loading={spacesInfo && spacesInfo.loading}
                            getOptionSelected={(option, value) => option.name === value.path_name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                            options={spaceOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={onSpaceKeywordChange}
                                variant="standard"
                                label="Parent Location"
                                required
                                className={values.parent_id && (values.parent_id.length || values.parent_id.id) ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {spacesInfo && spacesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {values.parent_id && (values.parent_id.length || values.parent_id.id) && (
                                          <IconButton onClick={() => {
                                            setSpaceKeyword('');
                                            setFieldValue('parent_id', '');
                                          }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton>
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
                                      </InputAdornment>
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(spacesInfo && spacesInfo.err && spaceOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>)}
                          <Label for="Booking Allowed" className="m-0">
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
                              name="is_booking_allowed"
                              checkedvalue="yes"
                              customvalue={getBookingAllowedInfo(values)}
                              id="yes"
                              label="Yes"
                            />
                            <MuiFormLabel
                              name="is_booking_allowed"
                              checkedvalue="no"
                              customvalue={getBookingAllowedInfo(values)}
                              id="no"
                              label="No"
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
                            name="company_id"
                            label="Company"
                            oldValue={getOldData(values.company_id)}
                            open={companyOpen}
                            disabled
                            size="small"
                            value={values.company_id && values.company_id.name ? values.company_id.name : getOldData(values.company_id)}
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
                                label="Company"
                                className={values.company_id && (values.company_id.length || values.company_id.id) ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
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
                          <FormControl className={classes.margin}>
                            <MuiAutoComplete
                              sx={{
                                marginTop: "auto",
                                marginBottom: "10px",
                              }}
                              label="Space Type"
                              name="type_id"
                              className="bg-white"
                              open={spaceTypeOpen}
                              size="small"
                              disableClearable={!(values.type_id && values.type_id.name)}
                              value={values.type_id && values.type_id.name ? values.type_id.name : getOldData(values.type_id)}
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
                              onChange={(e, data) => { setFieldValue('type_id', data); setFieldValue('sub_type_id', ''); setTypeIdValue(data); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={onSpaceTypeKeywordChange}
                                  variant="standard"
                                  label="Space Type"
                                  className="without-padding custom-icons"
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {spaceTypesInfo && spaceTypesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        <InputAdornment position="end">
                                          {values.type_id && (values.type_id.length || values.type_id.id) && (
                                            <IconButton onClick={() => {
                                              setFieldValue('type_id', '');
                                              setSpaceTypeKeyword('');
                                            }}
                                            >
                                              <IoCloseOutline size={22} fontSize="small" />
                                            </IconButton>
                                          )}
                                          <IconButton>
                                            <SearchIcon fontSize="small" />
                                          </IconButton>
                                        </InputAdornment>
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                          {(spaceTypesInfo && spaceTypesInfo.err && spaceTypeOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceTypesInfo)}</span></FormHelperText>)}
                          <MuiTextField
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                            name="max_occupancy"
                            label="Max Occupancy"
                            isRequired={false}
                            type="text"
                            onKeyPress={integerKeyPress}
                          />
                          <MuiAutoComplete
                            name="vendor_id"
                            label="Vendor"
                            oldValue={getOldData(values.vendor_id)}
                            value={values.vendor_id && values.vendor_id.name ? values.vendor_id.name : getOldData(values.vendor_id)}
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
                                variant="standard"
                                label="Vendor"
                                className={values.vendor_id && (values.vendor_id.length || values.vendor_id.id) ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {values.vendor_id && (values.vendor_id.length || values.vendor_id.id) && (
                                          <IconButton onClick={() => {
                                            setFieldValue('vendor_id', '');
                                            setVendorKeyword('');
                                          }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton>
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
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
                            name="area_sqft"
                            label="Area sqft"
                            isRequired={false}
                            type="text"
                          />
                          <MuiAutoComplete
                            sx={{
                              marginTop: "auto",
                              marginBottom: "10px",
                            }}
                            name="sub_type_id"
                            label="Sub Type"
                            isRequired={false}
                            oldValue={getOldData(values.sub_type_id)}
                            className="bg-white"
                            open={subSpaceTypeOpen}
                            value={values.sub_type_id && values.sub_type_id.name ? values.sub_type_id.name : getOldData(values.sub_type_id)}
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
                                variant="standard"
                                label="Sub Type"
                                className={values.sub_type_id && (values.sub_type_id.length || values.sub_type_id.id) ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {spaceSubTypesInfo && spaceSubTypesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {values.sub_type_id && (values.sub_type_id.length || values.sub_type_id.id) && (
                                          <IconButton onClick={() => {
                                            setFieldValue('sub_type_id', '');
                                            setSubSpaceTypeKeyword('');
                                          }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton>
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
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
                            name="space_status"
                            label="Space Status"
                            isRequired={false}
                            oldValue={values.space_status ? values.space_status : ''}
                            className="bg-white"
                            open={spaceStatusOpen}
                            value={values.space_status && values.space_status.label ? values.space_status.label : values.space_status}
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
                                label="Space Status"
                                className={values.space_status && (values.space_status.length || values.space_status.id) ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      <InputAdornment position="end">
                                        {values.space_status && (values.space_status.length || values.space_status.id) && (
                                          <IconButton onClick={() => {
                                            setFieldValue('space_status', '');
                                          }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton>
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
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
                                elementId="fileUpload"
                                handleFiles={handleFiles}
                                fileTypes=".png"
                                base64
                              >
                                <div className="float-right cursor-pointer">
                                  <img src={uploadIcon} className="mr-1" alt="issuecategory" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                </div>
                              </ReactFileReader>
                            )}
                            {(!fileDataImage && (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data[0].upload_images)) && (
                              <div className="position-relative">
                                <img
                                  src={`data:image/png;base64,${getSpaceInfo.data[0].upload_images}`}
                                  height="150"
                                  width="150"
                                  className="ml-3"
                                  alt="uploaded"
                                />
                              </div>
                            )}
                            {(fileDataImage) && (
                              <div className="position-relative">
                                <img
                                  src={`${fileDataType}${fileDataImage}`}
                                  height="150"
                                  width="150"
                                  className="ml-3"
                                  alt="uploaded"
                                />
                                {fileDataImage && (
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
                                )}
                              </div>
                            )}
                          </FormControl>
                          {imgValidation && (<FormHelperText><span className="text-danger">Choose PNG Image Only...</span></FormHelperText>)}
                          {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                        </Box>
                      </Box>
                    </TabPanel>
                  </Box>
                </ThemeProvider>
              )}
              {updateLocationInfo && updateLocationInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(updateLocationInfo && updateLocationInfo.err) && (
                <SuccessAndErrorFormat response={updateLocationInfo} />
              )}
              {(updateLocationInfo && updateLocationInfo.data) && (
                <SuccessAndErrorFormat response={updateLocationInfo} successMessage="Space updated successfully.." />
              )}
              <hr />
              <div className="float-right mr-4">
                {(updateLocationInfo && updateLocationInfo.data) ? (
                  <Button
                    type="button"
                    size="sm"
                    variant='contained'
                    className="mr-2"
                    onClick={() => onCancel()}
                  >
                    Ok
                  </Button>
                ) : (
                  <>
                    <Button
                      disabled={!(isValid)}
                      type="submit"
                      size="sm"
                      variant='contained'
                    >
                      Update
                    </Button>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

EditLocation.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default EditLocation;
