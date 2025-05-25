/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {
  TextField, Typography, Button, Dialog, DialogContent, DialogContentText, ListItemText, Grid,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SingleSearchModal from '@shared/searchModals/singleSearchModal';
import { CallOutlined, MailOutline } from '@mui/icons-material';

import { getEmployee } from '../../spaceManagement/spaceService';
import {
  extractOptionsObject,
  getAllowedCompanies,
  integerKeyPress,
  detectMimeType,
} from '../../util/appUtils';
import { bytesToSize } from '../../util/staticFunctions';
import customData from '../data/customData.json';
import {
  getHostCompany,
  getIdProof,
  getVisitorLogData,
  getVisitorTypes,
} from '../visitorManagementService';
import SearchModalMultiple from './searchModalMultiple';

import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import UploadDocuments from '../../commonComponents/uploadDocuments';
import UploadImagesForm from '../../commonComponents/uploadImagesForm';
import checkoutFormModel from '../formModel/checkoutFormModel';

import Webcam from '../../visitorRequest/webCam';

import { AddThemeColor } from '../../themes/theme';

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
const { formField } = checkoutFormModel;
const BasicForm = React.memo((props) => {
  const {
    editId,
    reload,
    setFieldValue,
    change,
    setChange,
    nameKeyword,
    isShow,
    setNameKeyword,
    refresh,
    values,
    formField: {
      visitorType,
      nameValue,
      mobile,
      email,
      organization,
      idProof,
      idDetails,
      hostName,
      hostEmail,
      hostCompany,
      tenantId,
    },
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    image_medium, attachment, id_proof, employee_id, allowed_sites_id, attachments, visitor_name, type_of_visitor,
    tenant_id, Visitor_id_details,
  } = formValues;

  const [typeOpen, setTypeOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const [visitorTypeOpen, setVisitorTypeOpen] = useState(false);
  const [proofKeyword] = useState(false);
  const [visitorTypeKeyword] = useState('');
  const empKeyword = '';
  const [hostComOpen, setHostComOpen] = useState(false);
  const [hostComKeyword] = useState('');
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetKeyword] = useState('');
  // const [refresh, setRefresh] = useState(reload);
  const [nameOpen, setNameOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [onClickYes, setOnClickYes] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(image_medium);
  const [fileType, setFileType] = useState('data:image/png;base64,');
  const [imgValidation1, setimgValidation1] = useState(false);
  const [imgSize1, setimgSize1] = useState(false);
  const [fileDataImage1, setFileDataImage1] = useState(attachment);
  const [fileDataType1, setFileDataType1] = useState('data:image/png;base64,');
  const [partsAdd, setPartsAdd] = useState(false);
  const [partsData, setPartsData] = useState([]);

  const [camModal, showCamModal] = useState(false);

  const [fileDataType, setFileDataType] = useState(false);

  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [extraModal1, setExtraModal1] = useState(false);

  const [tenantOpen, setTenantOpen] = useState(false);
  const [tenantKeyword, setTenantKeyword] = useState('');

  // const [setFileDataImage2] = useState(employee_image);
  // const [setFileDataType2] = useState('data:image/png;base64,');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    visitIdProof, visitTypes, assetTypes, visitHostCompany, visitorConfiguration, vmsConfigList, visitorLog, addVisitRequestInfo, newVisitor,
  } = useSelector((state) => state.visitorManagement);

  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);

  const apiFields = ['name', 'email', 'phone', 'organization'];

  useEffect(() => {
    if (employee_id && Object.keys(employee_id).length > 0) {
      if (employee_id.work_phone) {
        setFieldValue('employee_phone', employee_id.work_phone);
      }
      if (employee_id.work_email) {
        setFieldValue('employee_email', employee_id.work_email);
      }
    }
  }, [employee_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getEmployee(companies, appModels.EMPLOYEE, empKeyword));
      }
    })();
  }, [userInfo, empKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && isShow) {
      setFieldValue('host_name', userInfo.data.name);
      setFieldValue('host_email', userInfo.data.email.email);
    }
  }, [userInfo, isShow]);

  /* useEffect(() => {
    if (userInfo && userInfo.data && tenantOpen) {
      const partnerType = 'is_tenant';
      dispatch(getPartners(companies, appModels.PARTNER, partnerType, tenantKeyword));
    }
  }, [userInfo, tenantKeyword, tenantOpen]); */

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && proofOpen) {
        await dispatch(getIdProof(companies, appModels.VISITIDPROOF, proofKeyword));
      }
    })();
  }, [userInfo, proofKeyword, proofOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && nameOpen) {
        await dispatch(getVisitorLogData(companies, appModels.PARTNER, apiFields, nameKeyword, onClickYes));
      }
    })();
  }, [userInfo, nameKeyword, nameOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && hostComOpen) {
        const ids = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].allowed_sites_ids && visitorConfiguration.data[0].allowed_sites_ids;
        await dispatch(getHostCompany(companies, appModels.HOSTCOMPANY, hostComKeyword, ids));
      }
    })();
  }, [userInfo, hostComKeyword, hostComOpen, visitorConfiguration]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && visitorTypeOpen) {
        const ids = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].visitor_types && visitorConfiguration.data[0].visitor_types;
        await dispatch(getVisitorTypes(companies, appModels.VISITORTYPES, visitorTypeKeyword, ids));
      }
    })();
  }, [userInfo, visitorTypeKeyword, visitorTypeOpen, visitorConfiguration]);

  useEffect(() => {
    setimgValidation(false);
    setimgSize(false);
    setFileDataImage(false);
    setFileType('');
    setimgValidation1(false);
    setimgSize1(false);
    setFileDataImage1(false);
    setFileDataType1('');
    // setFileDataImage2(false);
    // setFileDataType2('');
  }, [refresh]);

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
        setFieldValue('image_medium', fileData);
        setFieldValue('image_small', fileData);
      }
    }
  };

  const handleFiles1 = (files) => {
    setimgValidation1(false);
    setimgSize1(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation1(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize1(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType1(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage1(fileData);
        setFieldValue('attachment', fileData);
      }
    }
  };

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getVmsConfigInfo(userInfo.data.company.id, appModels.VMSCONFIGURATION));
    }
  }, [userInfo]);

  useEffect(() => {
    if (vmsConfigList && vmsConfigList.data && vmsConfigList.data.length) {
      dispatch(getVmsConfigurationData(vmsConfigList.data[0].id, appModels.VMSCONFIGURATION));
    }
  }, [vmsConfigList]); */

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const idProofOptions = extractOptionsObject(visitIdProof, id_proof);
  const tenantOptions = userInfo && userInfo.data ? userInfo.data.allowed_tenants : [];// extractOptionsObject(partnersInfo, tenant_id);

  let hostCompanyOptions = [];

  if (visitHostCompany && visitHostCompany.data && visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].allowed_sites_ids && visitorConfiguration.data[0].allowed_sites_ids.length) {
    hostCompanyOptions = visitHostCompany.data;
  }
  if (visitHostCompany && visitHostCompany.loading) {
    hostCompanyOptions = [{ name: 'Loading' }];
  }
  if (visitHostCompany && visitHostCompany.err) {
    hostCompanyOptions = [];
  }

  let assetOptions = [];

  if (assetTypes && assetTypes.data && visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].visitor_allowed_asset_ids && visitorConfiguration.data[0].visitor_allowed_asset_ids.length) {
    assetOptions = assetTypes.data;
  }
  if (assetTypes && assetTypes.loading) {
    assetOptions = [{ name: 'Loading' }];
  }
  if (assetTypes && assetTypes.err) {
    assetOptions = [];
  }

  let visitorTypeOptions = [];
  const visitorTypeDefaultOptions = customData.visitorTypes;

  if (visitTypes && visitTypes.data && visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].visitor_types && visitorConfiguration.data[0].visitor_types.length) {
    visitorTypeOptions = visitTypes.data;
  }
  if (visitTypes && visitTypes.loading) {
    visitorTypeOptions = [{ name: 'Loading' }];
  }
  if (visitTypes && visitTypes.err) {
    visitorTypeOptions = [];
  }

  let nameOptions = [];
  if (visitorLog && visitorLog.data) {
    nameOptions = visitorLog.data;
  }
  if (visitorLog && visitorLog.err) {
    nameOptions = [];
  }
  if (visitorLog && visitorLog.loading) {
    nameOptions = [{ visitor_name: 'Loading', name: 'Loading' }];
  }

  useEffect(() => {
    if (visitor_name && typeof visitor_name === 'object' && visitor_name.id && !visitor_name.newVisitor) {
      // setFieldValue('organization', visitor_name.organization ? visitor_name.organization : '');
      setFieldValue('phone', visitor_name.phone ? visitor_name.phone : '');
      setFieldValue('email', visitor_name.email ? visitor_name.email : '');
      // setFieldValue('host_name', visitor_name.host_name ? visitor_name.host_name : '');
      // setFieldValue('host_email', visitor_name.host_email ? visitor_name.host_email : '');
      setFieldValue('allowed_sites_id', visitor_name.allowed_sites_id ? visitor_name.allowed_sites_id : '');
    }
  }, [visitor_name]);

  useEffect(() => {
    if (onClickYes) {
      // setFieldValue('organization', '');
      setFieldValue('phone', '');
      setFieldValue('email', '');
      // setFieldValue('host_name', '');
      // setFieldValue('host_email', '');
      setFieldValue('allowed_sites_id', '');
    }
  }, [onClickYes]);

  const onClearVisitorName = () => {
    // setFieldValue('organization', '');
    setFieldValue('phone', '');
    setFieldValue('email', '');
    // setFieldValue('host_name', '');
    // setFieldValue('host_email', '');
    setFieldValue('allowed_sites_id', '');
  };

  const onNameKeywordClear = () => {
    setNameKeyword(null);
    setFieldValue('visitor_name', '');
    setNameOpen(false);
    onClearVisitorName();
  };

  const handleFileCamChange = (data) => {
    if (data) {
      const remfile = data.split(',')[0];
      const base64Data = data.split(',')[1];
      setFileDataType(`${remfile},`);
      setFileDataImage(base64Data);
      setFieldValue('image_medium', base64Data);
      showCamModal(false);
    }
  };

  const onshowNameModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('visitor_name');
    setModalName('Visitors');
    setOtherFieldName('is_visitor');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onTenantKeywordChange = (event) => {
    setTenantKeyword(event.target.value);
  };

  const onTenantKeywordClear = () => {
    setTenantKeyword(null);
    setFieldValue('tenant_id', '');
    setTenantOpen(false);
  };

  const showTenantModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('tenant_id');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setModalName('Visiting Companies');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal1(true);
  };

  useEffect(() => {
    if (visitorLog && visitorLog.err && nameKeyword && nameKeyword.length > 0) {
      setFieldValue('visitor_name', { id: false, newVisitor: true, name: nameKeyword });
      setNameOpen(false);
    }
  }, [onClickYes, visitorLog]);

  useEffect(() => {
    if (onClickYes) {
      setFieldValue('visitor_name', { id: true, newVisitor: true, name: nameKeyword });
    }
  }, [onClickYes]);

  const filterOptions = createFilterOptions({
    stringify: ({ name, email, phone }) => `${name} ${email} ${phone}`,
  });

  const requiredCondition = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length ? visitorConfiguration.data[0] : false;

  useEffect(() => {
    if (requiredCondition) {
      setFieldValue('has_host_email', requiredCondition.has_host_email);
      setFieldValue('has_host_name', requiredCondition.has_host_name);
      setFieldValue('has_host_company', requiredCondition.has_host_company);
      setFieldValue('has_visitor_type', requiredCondition.has_visitor_type);
      setFieldValue('has_visitor_mobile', requiredCondition.has_visitor_mobile);
      setFieldValue('has_visitor_company', requiredCondition.has_visitor_company);
      setFieldValue('has_visitor_email', requiredCondition.has_visitor_email);
      setFieldValue('has_identity_proof', requiredCondition.has_identity_proof);
      setFieldValue('has_vistor_id_details', requiredCondition.has_vistor_id_details);
      setFieldValue('has_photo', requiredCondition.has_photo);
    }
  }, [requiredCondition]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '0px',
        }}
      >

        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Visitor Info
        </Typography>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 5 }}>
          <Grid item xs={12} sm={4} md={4}>
            {requiredCondition && requiredCondition.has_visitor_type !== 'None' && (
            <MuiAutoComplete
              sx={{
                // width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              options={visitorTypeOptions}
              
              name={visitorType.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              open={visitorTypeOpen}
              onOpen={() => {
                setVisitorTypeOpen(true);
              }}
              onClose={() => {
                setVisitorTypeOpen(false);
              }}
              value={type_of_visitor}
              getOptionSelected={(option, value) => option.name === value.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={requiredCondition && requiredCondition.has_visitor_type === 'Required'}
                  label={visitorType.label}
                  variant="standard"
                />
              )}
            />
            )}

            <MuiAutoComplete
              sx={{
                // width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              options={nameOptions}
              required={nameValue.required}
              name={nameValue.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              open={nameOpen}
              onOpen={() => {
                setNameOpen(true);
              }}
              onClose={() => {
                setNameOpen(false);
              }}
              getOptionSelected={(option, value) => option.name === value.name}
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
                      {option?.email && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          <MailOutline
                            style={{ height: '15px' }}
                            cursor="pointer"
                          />
                          {option?.email}
                        </Typography>
                      </Box>
                      )}
                      {option?.mobile && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          <CallOutlined
                            style={{ height: '15px' }}
                            cursor="pointer"
                          />
                          <span>{option.phone}</span>
                        </Typography>
                      </Box>
                      )}
                    </>
              )}
                />
              )}
              customError={change && !onClickYes && visitorLog && visitorLog.err && nameKeyword && nameKeyword.length > 0 && (
              <FormHelperText>
                <span className="ml-1">
                  {`New Visitor "${nameKeyword}" will be created. Do you want to create..? Click`}
                </span>
                <span
                  aria-hidden="true"
                  onClick={() => { setOnClickYes(true); setFieldValue(nameKeyword); }}
                  className="text-info ml-2 cursor-pointer"
                >
                  YES
                </span>
              </FormHelperText>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={nameValue.label}
                  variant="standard"
                  required={nameValue.required}
                  onChange={(e) => { setNameKeyword(e.target.value); setOnClickYes(false); setChange(true); }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {visitorLog && visitorLog.loading && nameOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(visitor_name)) || (visitor_name) || (nameKeyword && nameKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onNameKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={() => onshowNameModal()}
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
            {requiredCondition && requiredCondition.has_visitor_company !== 'None' && (
            <MuiTextField
              sx={{
                // width: '30%',
                marginBottom: '20px',
              }}
              name={organization.name}
              label={organization.label}
              type="text"
              value={values[formField.organization.name]}
              required={requiredCondition && requiredCondition.has_visitor_company === 'Required'}
              maxLength="70"
            />
            )}

            <Dialog maxWidth="xl" open={extraModal}>
              <DialogHeader title={modalName} onClose={() => { setExtraModal(false); }} imagePath={false} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">

                  <SingleSearchModal
                    modelName={modelValue}
                    afterReset={() => { setExtraModal(false); }}
                    fieldName={fieldName}
                    fields={apiFields}
                    headers={['Name', 'Email', 'Mobile']}
                    columns={['name', 'email', 'phone']}
                    company={companyValue}
                    setFieldValue={setFieldValue}
                    otherFieldName={otherFieldName}
                    otherFieldValue={otherFieldValue}
                    value="visitor_name"
                  />

                </DialogContentText>
              </DialogContent>

            </Dialog>

            <Dialog maxWidth="xl" open={extraModal1}>
              <DialogHeader title={modalName} onClose={() => { setExtraModal1(false); }} imagePath={false} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">

                  <SearchModalMultiple
                    modelName={modelValue}
                    afterReset={() => { setExtraModal1(false); }}
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

          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            {requiredCondition && requiredCondition.has_visitor_mobile !== 'None' && (
            <MuiTextField
              sx={{
                // width: '30%',
                marginBottom: '20px',
              }}
              name={mobile.name}
              label={mobile.label}
              type="text"
              value={values[formField.mobile.name]}
              required={requiredCondition && requiredCondition.has_visitor_mobile === 'Required'}
              onKeyPress={integerKeyPress}
            />
            )}
            {requiredCondition && requiredCondition.has_visitor_email !== 'None' && (
            <MuiTextField
              sx={{
                // width: '30%',
                marginBottom: '20px',
              }}
              name={email.name}
              label={email.label}
              type="email"
              value={values[formField.email.name]}
              required={requiredCondition && requiredCondition.has_visitor_email === 'Required'}
              maxLength="50"
            />
            )}
            {requiredCondition && requiredCondition.has_photo !== 'None' && (
              <Box
                sx={{
                  // width: '30%',
                }}
              >
                {requiredCondition.allow_gallery_images && (
                <UploadDocuments
                  saveData={addVisitRequestInfo}
                  limit={1}
                  labelName="Photo"
                  setFieldValue={setFieldValue}
                  model={appModels.VISITREQUEST}
                  fileImage={image_medium}
                  uploadFileType="images"
                  isRequired={requiredCondition.has_photo === 'Required'}
                  isCapture
                  onCapture={() => showCamModal(true)}
                />
                )}
                {!requiredCondition.allow_gallery_images && (
                <>
                  <Typography
                    sx={{
                      font: 'normal normal normal 16px Suisse Intl',
                      letterSpacing: '0.63px',
                      color: '#000000',
                      marginBottom: '10px',
                      // alignSelf: "flex-start",
                    }}
                  >
                    Photo
                    {requiredCondition.has_photo === 'Required' ? ' *' : ''}
                  </Typography>
                  <Box
                    sx={{
                      padding: '20px',
                      border: '1px dashed #868686',
                      width: '100%',
                      display: 'block',
                      alignItems: 'center',
                      borderRadius: '4px',
                    }}
                  >
                    <Box sx={{
                      display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center',
                    }}
                    >
                      {image_medium && (
                      <div className="position-relative mt-2 mb-2">
                        <img
                          src={fileDataImage ? `${fileDataType}${fileDataImage}` : `data:${detectMimeType(image_medium)};base64,${image_medium}`}
                          height="100"
                          width="100"
                          alt="uploaded"
                          aria-hidden="true"
                        />

                      </div>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        component="label"
                        onClick={() => showCamModal(true)}
                      >
                        Capture

                      </Button>
                    </Box>
                  </Box>
                </>
                )}
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            {requiredCondition && requiredCondition.has_identity_proof !== 'None' && (
            <>
              <MuiAutoComplete
                sx={{
                  // width: '30%',
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                options={idProofOptions}
                required={requiredCondition && requiredCondition.has_identity_proof === 'Required'}
                name={idProof.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                open={proofOpen}
                oldValue={getOldData(id_proof)}
                value={id_proof && id_proof.name ? id_proof.name : getOldData(id_proof)}
                onOpen={() => {
                  setProofOpen(true);
                }}
                onClose={() => {
                  setProofOpen(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={idProof.label}
                    variant="standard"
                    required={requiredCondition && requiredCondition.has_identity_proof === 'Required'}
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {visitIdProof && visitIdProof.loading && proofOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {/*  <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={idProof.name}
              label={idProof.label}
              isRequired={requiredCondition && requiredCondition.has_identity_proof === 'Required'}
              formGroupClassName="m-1"
              open={proofOpen}
              size="small"
              onOpen={() => {
                setProofOpen(true);
              }}
              onClose={() => {
                setProofOpen(false);
              }}
              oldValue={getOldData(id_proof)}
              value={id_proof && id_proof.name ? id_proof.name : getOldData(id_proof)}
              apiError={(visitIdProof && visitIdProof.err) ? generateErrorMessage(visitIdProof) : false}
              loading={visitIdProof && visitIdProof.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={idProofOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={id_proof && id_proof.id ? 'without-padding' : 'without-padding'}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {visitIdProof && visitIdProof.loading && proofOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col> */}
            </>
            )}

            {((id_proof && id_proof.id) || (id_proof && id_proof.length > 0)) && (
            <>
              <Box
                sx={{
                  // width: '30%',
                }}
              >
                <UploadImagesForm
                  saveData={addVisitRequestInfo}
                  limit={1}
                  model={appModels.VISITREQUEST}
                  setFieldValue={setFieldValue}
                  uploadFileType="images"
                  fileImage={attachment}
                  imageFieldName="attachment"
                />
              </Box>

              {/* <FormGroup>
                <Label for="logo">
                  Attachment
                  {' '}
                  {requiredCondition && requiredCondition.has_identity_proof === 'Required' && (<span className="text-danger">*</span>)}
                </Label>
                {!fileDataImage1 && !attachment && (
                  <ReactFileReader
                    elementId="fileUpload1"
                    handleFiles={handleFiles1}
                    fileTypes=".png,.jpg,.jpeg"
                    base64
                  >
                    <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                      <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                      <p className="font-weight-500">Select a file</p>
                    </div>
                  </ReactFileReader>
                )}
                {(!fileDataImage1 && (editId && attachment)) && (
                  <div className="position-relative mt-2">
                    <img
                      src={`data:image/png;base64,${attachment}`}
                      height="150"
                      width="150"
                      className="ml-3"
                      alt="idproofattachment"
                    />
                    <div className="position-absolute topright-img-close">
                      <img
                        aria-hidden="true"
                        src={closeCircleIcon}
                        className="cursor-pointer"
                        onClick={() => {
                          setimgValidation1(false);
                          setimgSize1(false);
                          setFileDataImage1(false);
                          setFileDataType1(false);
                          setFieldValue('attachment', '');
                        }}
                        alt="remove"
                      />
                    </div>
                  </div>
                )}
                {fileDataImage1 && (
                  <div className="position-relative mt-2">
                    <img
                      src={`${fileDataType1}${fileDataImage1}`}
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
                          setimgValidation1(false);
                          setimgSize1(false);
                          setFileDataImage1(false);
                          setFileDataType1(false);
                          setFieldValue('attachment', '');
                        }}
                        alt="remove"
                      />
                    </div>
                  </div>
                )}
              </FormGroup>
              {imgValidation1 && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
              {imgSize1 && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)} */}
            </>
            )}

            {requiredCondition && requiredCondition.has_vistor_id_details !== 'None' && (
            <>
              <MuiTextField
                sx={{
                  // width: '30%',
                  marginBottom: '20px',
                  marginTop: '10px',
                }}
                name={idDetails.name}
                label={idDetails.label}
                type="text"
                inputProps={{ maxLength: 4, minLength: 4 }}
                placeholder={idDetails.placeholder}
                value={Visitor_id_details || ''}
                required={requiredCondition && requiredCondition.has_vistor_id_details === 'Required'}
              />
              {/* <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={idDetails.name}
              label={idDetails.label}
              isRequired={requiredCondition && requiredCondition.has_vistor_id_details === 'Required'}
              formGroupClassName="m-1"
              type="text"
              maxLength="4"
              minLength="4"
              placeholder={idDetails.placeholder}
              autoComplete="off"
              value={Visitor_id_details || ''}
            />
          </Col> */}
            </>
            )}

          </Grid>

        </Grid>
      </Box>
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
          })}
        >
          Host Info
        </Typography>
        {/* <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        > */}
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 5 }}>
          {requiredCondition && requiredCondition.has_host_company !== 'None' && (
          <Grid item xs={12} sm={4} md={4}>
            <MuiAutoComplete
              sx={{
                // width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              options={tenantOptions}
              required={requiredCondition && requiredCondition.has_host_company === 'Required'}
              name={tenantId.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              open={tenantOpen}
              onOpen={() => {
                setTenantOpen(true);
                setTenantKeyword('');
              }}
              onClose={() => {
                setTenantOpen(false);
                setTenantKeyword('');
              }}
              oldValue={getOldData(tenant_id)}
              value={tenant_id && tenant_id.name ? tenant_id.name : getOldData(tenant_id)}
              getOptionSelected={(option, value) => option.name === value.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={tenantId.label}
                  required={requiredCondition && requiredCondition.has_host_company === 'Required'}
                  onChange={onTenantKeywordChange}
                  className={((getOldData(tenant_id)) || (tenant_id && tenant_id.id) || (tenantKeyword && tenantKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading && tenantOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(tenant_id)) || (tenant_id && tenant_id.id) || (tenantKeyword && tenantKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTenantKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {/* <Col md="12" sm="12" lg="12" xs="12">
          <FormikAutocomplete
            name={tenantId.name}
            label={tenantId.label}
            formGroupClassName="m-1"
            open={tenantOpen}
            size="small"
            isRequired={requiredCondition && requiredCondition.has_host_company === 'Required'}
            onOpen={() => {
              setTenantOpen(true);
              setTenantKeyword('');
            }}
            onClose={() => {
              setTenantOpen(false);
              setTenantKeyword('');
            }}
            classes={{
              option: classes.option,
            }}
            oldValue={getOldData(tenant_id)}
            value={tenant_id && tenant_id.name ? tenant_id.name : getOldData(tenant_id)}
            apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
            getOptionDisabled={() => partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={tenantOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                onChange={onTenantKeywordChange}
                className={((getOldData(tenant_id)) || (tenant_id && tenant_id.id) || (tenantKeyword && tenantKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading && tenantOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(tenant_id)) || (tenant_id && tenant_id.id) || (tenantKeyword && tenantKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onTenantKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col> */}
          </Grid>
          )}
          {requiredCondition && requiredCondition.has_host_name !== 'None' && (
          <Grid item xs={12} sm={4} md={4}>
            <MuiTextField
              sx={{
                // width: '30%',
                marginBottom: '20px',
              }}
              name={hostName.name}
              label={hostName.label}
              type="text"
              maxLength="30"
              placeholder={hostName.placeholder}
              value={values[formField.hostName.name]}
              required={requiredCondition && requiredCondition.has_host_name === 'Required'}
            />
          </Grid>
          )}
          {requiredCondition && requiredCondition.has_host_email !== 'None' && (
          <Grid item xs={12} sm={4} md={4}>
            <MuiTextField
              sx={{
                // width: '30%',
                marginBottom: '20px',
              }}
              name={hostEmail.name}
              label={hostEmail.label}
              type="email"
              maxLength="50"
              placeholder={hostEmail.placeholder}
              value={values[formField.hostEmail.name]}
              required={requiredCondition && requiredCondition.has_host_email === 'Required'}
            />
          </Grid>
          )}
        </Grid>
        <Dialog maxWidth="md" open={camModal}>
          <DialogHeader title="Capture Visitor Photo" onClose={() => showCamModal(false)} response={false} imagePath={false} />
          <Webcam onCapture={handleFileCamChange} />
        </Dialog>
        { /* requiredCondition && requiredCondition.has_host_company !== 'None' && (

          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={hostCompany.name}
              label={hostCompany.label}
              isRequired={requiredCondition && requiredCondition.has_host_company === 'Required'}
              formGroupClassName="m-1"
              open={hostComOpen}
              size="small"
              onOpen={() => {
                setHostComOpen(true);
              }}
              onClose={() => {
                setHostComOpen(false);
              }}
              oldValue={getOldData(allowed_sites_id)}
              value={allowed_sites_id && allowed_sites_id.name ? allowed_sites_id.name : getOldData(allowed_sites_id)}
              apiError={(visitHostCompany && visitHostCompany.err) ? generateErrorMessage(visitHostCompany) : false}
              loading={visitHostCompany && visitHostCompany.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={hostCompanyOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={allowed_sites_id && allowed_sites_id.id ? 'without-padding' : 'without-padding'}
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {visitHostCompany && visitHostCompany.loading && hostComOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
                ) */ }
        {/* </Box> */}
      </Box>
    </>
  );
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  refresh: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
