/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
  FormControl,
} from '@material-ui/core';
import ReactFileReader from 'react-file-reader';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { InputField, FormikAutocomplete, DateTimeField } from '@shared/formFields';
import fileMiniIcon from '@images/icons/fileMini.svg';

import {
  updateTenant, resetUpdateTenant,
} from '../../../../adminSetup/setupService';
import validationSchema from './formModel/validationSchema';
import scheduleFormModel from './formModel/scheduleFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  generateErrorMessage, getDateTimeSeconds, getDateTimeUtc, trimJsonObject, getArrayNewFormatUpdate,
  getListOfModuleOperations,
} from '../../../../util/appUtils';

import { bytesToSize } from '../../../../util/staticFunctions';
import actionCodes from '../../../data/complianceActionCodes.json';
import {
  getVersionLabel,
} from '../../../utils/utils';
import customData from '../../../data/customData.json';
import { getEmployeeList } from '../../../../assets/equipmentService';

import theme from '../../../../util/materialTheme';

const appModels = require('../../../../util/appModels').default;

const { formId, formField } = scheduleFormModel;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const RenewalEdit = (props) => {
  const {
    editData,
    selectedId,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [vTypeOpen, setVtypeOpen] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileExtension, setFileExtension] = useState(false);
  const fileDocument = editData && editData.length > 0 ? editData[0].file : '';
  const filePath = editData && editData.length > 0 ? editData[0].file_path : '';
  const fileName = editData && editData.length > 0 ? editData[0].file_name : '';
  const [documentName, setDocumentName] = useState((fileName || '') || (filePath ? filePath.replace(/^.*[\\\\/]/, '') : ''));
  const [fileDataImage, setFileDataImage] = useState(fileDocument);
  const [fileDataType, setFileDataType] = useState('data:image/png;base64,');
  const imageExt = ['jpg', 'jpeg', 'svg', 'png'];

  const [initialValues, setInitialValues] = useState(formInitialValues);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const {
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const { employeesInfo } = useSelector((state) => state.equipment);
  const {
    complianceDetails,
    templateConfig,
  } = useSelector((state) => state.compliance);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isAddAllowed = allowedOperations.includes(actionCodes['Add Evidence Document']);
  const isDeleteAllowed = allowedOperations.includes(actionCodes['Delete Evidence Document']);

  const tempSettingData = templateConfig && templateConfig.data && templateConfig.data.length ? templateConfig.data[0] : false;

  const isDocumentRequired = tempSettingData && tempSettingData.attachment && tempSettingData.attachment === 'Required';
  const isDocumentOptional = tempSettingData && tempSettingData.attachment && tempSettingData.attachment === 'Optional';

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(userInfo.data.company.id, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    if (editData && editData.length) {
      setFileDataImage(fileDocument);
      setDocumentName((fileName || '') || (filePath ? filePath.replace(/^.*[\\\\/]/, '') : ''));
      setInitialValues(trimJsonObject(editData[0]));
    }
  }, [editData]);

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    setFileExtension(false);
    setDocumentName(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];
      const { name } = files.fileList[0];
      if (name && !name.match(/.(pdf|xlsx|ppt|docx|jpg|jpeg|svg|png)$/i)) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFileExtension(type);
        setDocumentName(name);
      }
    }
  };

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtc(data);
    }
    return result;
  }

  function getOldDataId(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[0] : false;
  }

  useEffect(() => {
    if ((userInfo && userInfo.data) && (tenantUpdateInfo && tenantUpdateInfo.data)) {
      dispatch(resetUpdateTenant());
    }
  }, [userInfo, tenantUpdateInfo]);

  function handleSubmit(values) {
    if (selectedId) {
      let userId = false;
      if (values.user_id && values.user_id.length > 0) {
        userId = getOldDataId(values.user_id);
      } else {
        userId = values.user_id && values.user_id.id
          ? values.user_id.id : false;
      }
      const versionStatus = values.version_status ? values.version_status.value : '';
      let evidenceDate = values.evidences_date ? values.evidences_date : false;
      if (checkDatehasObject(evidenceDate)) {
        evidenceDate = getDateTimeUtc(evidenceDate);
      }
      const postData = { ...values };

      postData.user_id = userId;
      postData.evidences_date = evidenceDate;
      postData.version_status = versionStatus;
      postData.file = fileDataImage || false;
      postData.file_name = documentName || false;
      let newValues = [];

      if (fileDataImage) {
        newValues = [
          {
            user_id: postData.user_id,
            evidences_date: postData.evidences_date,
            version_status: postData.version_status,
            file: postData.file,
            description: postData.description,
            id: postData.id,
            file_name: postData.file_name,
          },
        ];
      } else {
        newValues = [
          {
            user_id: postData.user_id,
            evidences_date: postData.evidences_date,
            version_status: postData.version_status,
            description: postData.description,
            id: postData.id,
            file: postData.file,
            file_name: postData.file_name,
          },
        ];
      }
      const postValue = { compliance_evidences_ids: getArrayNewFormatUpdate(newValues) };
      const complianceId = complianceDetails && complianceDetails.data ? complianceDetails.data[0].id : '';
      dispatch(updateTenant(complianceId, postValue, appModels.BULIDINGCOMPLIANCE));
    }
  }

  let employeeOptions = [];

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeesInfo && employeesInfo.data) {
    employeeOptions = employeesInfo.data;
  }

  const loading = (createActivityInfo && createActivityInfo.loading) || (tenantUpdateInfo && tenantUpdateInfo.loading);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  function getUrlextension(url) {
    let urlSplit = false;
    if (url) {
      urlSplit = url.split(/[#?]/)[0].split('.').pop().trim();
    }
    return urlSplit;
  }


  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        {loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
        )}
        {((tenantUpdateInfo && tenantUpdateInfo.data) || loading) ? '' : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({
              isValid, values, setFieldValue, setFieldTouched,
            }) => (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <Row className="">
                    <Col md="6" sm="6" lg="6" xs="12">
                      <Col md="12" sm="11" lg="11" xs="11">
                        <FormikAutocomplete
                          name={formField.userId.name}
                          label={formField.userId.label}
                          isRequired={formField.userId.required}
                          formGroupClassName="mb-1"
                          className="bg-white"
                          oldValue={getOldData(values.user_id)}
                          value={values.user_id && values.user_id.name ? values.user_id.name : getOldData(values.user_id)}
                          open={employeeShow}
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
                              onChange={onEmployeeKeywordChange}
                              variant="outlined"
                              className="without-padding"
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>) }
                      </Col>
                      <Col md="12" sm="11" lg="11" xs="11">
                        <DateTimeField
                          isRequired
                          name={formField.dateTime.name}
                          label={formField.dateTime.label}
                          disablePastDate
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          placeholder={formField.dateTime.label}
                          defaultValue={values.evidences_date ? new Date(getDateTimeSeconds(values.evidences_date)) : ''}
                        />
                      </Col>
                      <Col md="12" sm="11" lg="11" xs="11">
                        <FormikAutocomplete
                          name={formField.versionStatus.name}
                          label={formField.versionStatus.label}
                          isRequired
                          disabled
                          labelClassName="font-weight-600"
                          className="bg-white"
                          open={vTypeOpen}
                          disableClearable
                          oldValue={getVersionLabel(values.version_status)}
                          value={values.version_status && values.version_status.label ? values.version_status.label : getVersionLabel(values.version_status)}
                          size="small"
                          onOpen={() => {
                            setVtypeOpen(true);
                          }}
                          onClose={() => {
                            setVtypeOpen(false);
                          }}
                          getOptionSelected={(option, value) => option.label === value.label}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                          options={customData.versionStatusTypes}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
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
                      </Col>
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <Col md="12" sm="11" lg="11" xs="11">
                        <InputField
                          name={formField.description.name}
                          label={formField.description.label}
                          isRequired={formField.description.required}
                          value={values.description ? values.description : ''}
                          formGroupClassName="mb-1"
                          type="textarea"
                          maxLength="50"
                        />
                      </Col>
                      {(isDocumentRequired || isDocumentOptional) && isAddAllowed && (
                      <Col xs={11} sm={11} md={12} lg={11}>
                        <FormControl className={classes.margin}>
                          <Label for="upload_images">Document
                          {isDocumentRequired && (<span className="ml-2 text-danger">*</span>)}
                          </Label>
                          {!fileDataImage && (
                            <>
                              <ReactFileReader
                                multiple
                                elementId="fileUploadRE1"
                                handleFiles={handleFiles}
                                fileTypes="*"
                                base64
                              >
                                <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                                  <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                                  <p className="font-weight-500">Select a file</p>
                                </div>
                              </ReactFileReader>
                              <div className="text-left text-info font-11  ml-2">
                                <FontAwesomeIcon size="sm" icon={faInfoCircle} />
                                {' '}
                                Allowed file types: .pdf, .xlsx, .ppt, .docx, .jpg, .jpeg, .png, .svg
                              </div>
                            </>
                          )}
                          {fileDataImage && (
                          <div className="position-relative">
                            { ((fileExtension && fileExtension.match(/.(jpg|jpeg|svg|png)$/i)) || imageExt.includes(getUrlextension(values.file_path)))
                              ? (
                                <img
                                  src={`${fileDataType}${fileDataImage}`}
                                  height="150"
                                  width="150"
                                  className="ml-3"
                                  alt="uploaded"
                                />
                              )
                              : (
                                <>
                                  <img
                                    src={fileMiniIcon}
                                    alt="file"
                                    aria-hidden="true"
                                    height="150"
                                    width="150"
                                    className="cursor-pointer ml-3"
                                  />
                                  <p className="m-0 text-break">
                                    {documentName}
                                    {' '}
                                  </p>
                                </>
                              )}
                              {isDeleteAllowed && (
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
                        {imgValidation && (<FormHelperText><span className="text-danger">Choose .pdf, .xlsx, .ppt, .docx, .jpg, .jpeg, .png, .svg Only...</span></FormHelperText>)}
                        {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                      </Col>
                      )}
                    </Col>
                    {(tenantUpdateInfo && tenantUpdateInfo.err) && (
                    <SuccessAndErrorFormat response={tenantUpdateInfo} />
                    )}
                    {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                      <SuccessAndErrorFormat response={tenantUpdateInfo} successMessage="Compliance Evidences updated successfully.." />
                    )}
                  </Row>
                  <div className="float-right mr-4">
                    <Button
                      disabled={!(isValid) || (isDocumentRequired && !fileDataImage)}
                      type="submit"
                      variant="contained"
                      size="sm"
                    >
                      Update
                    </Button>
                  </div>
                </ThemeProvider>
              </Form>
            )}
          </Formik>
        )}
      </Col>
    </Row>
  );
};

RenewalEdit.defaultProps = {
  editData: false,
  selectedId: false,
};

RenewalEdit.propTypes = {
  selectedId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default RenewalEdit;
