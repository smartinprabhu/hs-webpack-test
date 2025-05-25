/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText,
  Typography,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';
import { AddThemeColor } from '../../../../themes/theme';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import {
  getWorkingTime,
} from '../../../../adminSetup/setupService';
import {
  extractOptionsObject, getAllCompanies, generateErrorMessage, decimalKeyPress,
} from '../../../../util/appUtils';
import { bytesToSize } from '../../../../util/staticFunctions';
import AdvancedSearchModal from './advancedSearchModal';
import UploadDocuments from '../../../../commonComponents/uploadDocuments';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      atStart,
      atReview,
      atDone,
      isAutomaticConfirm,
      qrScanStart,
      qrScanDone,
      nfcScanStart,
      nfcScanDone,
      resourceCalendarId,
      isPhotoMandatory,
      submitGloballyInApp,
      isSmartloggerScan,
      autoSyncIntervalMobile,
      osAppId,
      osUrl,
      hasAuditModeQr,
      hasAuditModeNfc,
      hasAuditModeRfid,
      hasAuditModeManual,
      isGenerateOneWo,
      osAppKey,
      responseValue,
      hspaceAppKey,
      hsenseAppUrl,
      hsenseSupportEmail,
      hspaceWebsiteUrl,
      companyId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    resource_calendar_id, qr_code_image, hspace_app_key, response,
  } = formValues;
  const dispatch = useDispatch();
  const [workingTimeOpen, setWorkingTimeOpen] = useState(false);
  const [workingTimeKeyword, setWorkingTimeKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    workingTimeInfo,
  } = useSelector((state) => state.setup);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(qr_code_image);
  const [fileType, setFileType] = useState('data:image/png;base64,');

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getWorkingTime(companies, appModels.RESOURCECALENDAR, workingTimeKeyword));
      }
    })();
  }, [workingTimeOpen, workingTimeKeyword]);

  useEffect(() => {
    setFileDataImage(qr_code_image);
  }, [qr_code_image]);

  const onLocationKeyWordChange = (event) => {
    setWorkingTimeKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setWorkingTimeKeyword(null);
    setFieldValue('resource_calendar_id', '');
    setWorkingTimeOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.RESOURCECALENDAR);
    setFieldName('resource_calendar_id');
    setModalName('Working Time');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const WorkingOptions = extractOptionsObject(workingTimeInfo, resource_calendar_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

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
        setFieldValue('qr_code_image', fileData);
        setFieldValue('image_small', fileData);
      }
    }
  };

  return (
    <>
      <Row className="mb-1 requestorForm-input">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Maintenance Order
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={atStart.name}
              label={atStart.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={atReview.name}
              label={atReview.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Maintenance Order
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={atDone.name}
              label={atDone.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={isAutomaticConfirm.name}
              label={isAutomaticConfirm.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            QR Required
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={qrScanStart.name}
              label={qrScanStart.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={qrScanDone.name}
              label={qrScanDone.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            NFC
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={nfcScanStart.name}
              label={nfcScanStart.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={nfcScanDone.name}
              label={nfcScanDone.label}
            />
          </Col>
        </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Equipment
          </Typography>
          <MuiAutoComplete
            name={resourceCalendarId.name}
            label={resourceCalendarId.label}
            oldValue={getOldData(resource_calendar_id)}
            value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : getOldData(resource_calendar_id)}
            apiError={(workingTimeInfo && workingTimeInfo.err && workingTimeOpen) ? generateErrorMessage(workingTimeInfo) : false}
            open={workingTimeOpen}
            size="small"
            onOpen={() => {
              setWorkingTimeOpen(true);
              setWorkingTimeKeyword('');
            }}
            onClose={() => {
              setWorkingTimeOpen(false);
              setWorkingTimeKeyword('');
            }}
            loading={workingTimeInfo && workingTimeInfo.loading && workingTimeOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={WorkingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onLocationKeyWordChange}
                variant="standard"
                label={resourceCalendarId.label}
                value={workingTimeKeyword}
                className={((resource_calendar_id && resource_calendar_id.id) || (workingTimeKeyword && workingTimeKeyword.length > 0) || (resource_calendar_id && resource_calendar_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {workingTimeInfo && workingTimeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((resource_calendar_id && resource_calendar_id.id) || (workingTimeKeyword && workingTimeKeyword.length > 0) || (resource_calendar_id && resource_calendar_id.length)) && (
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
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className="mt-4">
          <MuiCheckboxField
            name={isPhotoMandatory.name}
            label={isPhotoMandatory.label}
            className="mt-4"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Audit Mode
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={hasAuditModeQr.name}
              label={hasAuditModeQr.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={hasAuditModeNfc.name}
              label={hasAuditModeNfc.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={hasAuditModeRfid.name}
              label={hasAuditModeRfid.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={hasAuditModeManual.name}
              label={hasAuditModeManual.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Mobile
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={submitGloballyInApp.name}
              label={submitGloballyInApp.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={isSmartloggerScan.name}
              label={isSmartloggerScan.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={autoSyncIntervalMobile.name}
              label={autoSyncIntervalMobile.label}
              autoComplete="off"
              inputProps={{
                maxLength: 2,
              }}
              type="text"
              onKeyPress={decimalKeyPress}
            />
          </Col>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            One Signal
          </Typography>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={osAppId.name}
            label={osAppId.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} className="mt-3 pt-4">
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={osUrl.name}
            label={osUrl.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={osAppKey.name}
            label={osAppKey.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={responseValue.name}
            label={responseValue.label}
            value={response || ''}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={hspaceAppKey.name}
            label={hspaceAppKey.label}
            value={hspace_app_key || ''}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={hsenseAppUrl.name}
            label={hsenseAppUrl.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={hsenseSupportEmail.name}
            label={hsenseSupportEmail.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={hspaceWebsiteUrl.name}
            label={hspaceWebsiteUrl.label}
            autoComplete="off"
            type="text"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            On-Condition Work Order (Readings)
          </Typography>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiCheckboxField
              name={isGenerateOneWo.name}
              label={isGenerateOneWo.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            QR Code Image
          </Typography>
          <UploadDocuments
              // saveData={updateProductCategoryInfo}
            limit="1"
            setFieldValue={setFieldValue}
            model={appModels.MAINTENANCECONFIG}
            uploadFileType="images"
          />
          {/* <FormGroup>
             {!fileDataImage && !qr_code_image && (
              <ReactFileReader
                multiple
                elementId="fileUpload"
                handleFiles={handleFiles}
                fileTypes=".png,.jpg,.jpeg"
                base64
              >
                <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                  <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                  <p className="font-weight-500">Select a file</p>
                </div>
              </ReactFileReader>
            )}
            {(!fileDataImage && (editId && qr_code_image)) && (
              <div className="position-relative mt-2">
                <img
                  src={`data:image/png;base64,${qr_code_image}`}
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
                      setFileType(false);
                      setFieldValue('qr_code_image', false);
                    }}
                    alt="remove"
                  />
                </div>
              </div>
            )}
            {fileDataImage && (
              <div className="position-relative mt-2">
                <img
                  src={`${fileType || 'data:image/png;base64,'}${fileDataImage}`}
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
                      setFileType(false);
                      setFieldValue('qr_code_image', false);
                      setFieldValue('image_small', false);
                    }}
                    alt="remove"
                  />
                </div>
              </div>
            )}
          </FormGroup>
          {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
          {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)} */}
        </Col>
      </Row>
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

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
