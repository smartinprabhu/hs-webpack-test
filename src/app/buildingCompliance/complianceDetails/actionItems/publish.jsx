/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Label,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';

import fileMiniIcon from '@images/icons/fileMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  Button,
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
  FormControl, FormHelperText,
} from '@mui/material';
import Loader from '@shared/loading';
import {
  faCheckCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getDefaultNoValue, getCompanyTimezoneDate, extractNameObject,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import actionCodes from '../../data/complianceActionCodes.json';
import { complianceStateChange } from '../../complianceService';
import { bytesToSize } from '../../../util/staticFunctions';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const Publish = (props) => {
  const {
    complianceDetails, publishModal, atFinish,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(publishModal);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { stateChangeInfo, templateConfig } = useSelector((state) => state.compliance);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileExtension, setFileExtension] = useState(false);
  const [documentName, setDocumentName] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);

  const tempSettingData = templateConfig && templateConfig.data && templateConfig.data.length ? templateConfig.data[0] : false;

  const isDocumentRequired = tempSettingData && tempSettingData.attachment && tempSettingData.attachment === 'Required';
  const isDocumentOptional = tempSettingData && tempSettingData.attachment && tempSettingData.attachment === 'Optional';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isAddAllowed = allowedOperations.includes(actionCodes['Add Evidence Document']);

  const complianceData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(complianceStateChange(id, state, appModels.BULIDINGCOMPLIANCE, false, fileDataImage));
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

  const loading = (complianceDetails && complianceDetails.loading) || (stateChangeInfo && stateChangeInfo.loading);

  return (
    <Dialog maxWidth="md" open={publishModal}>
      <DialogHeader title="Publish" onClose={toggle} fontAwesomeIcon={faCheckCircle} response={stateChangeInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >

            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Row>
                  <Col md="2" xs="2" sm="2" lg="3">
                    <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                  </Col>
                  <Col md="10" xs="8" sm="8" lg="9" className="">
                    <Row>
                      <h6 className="mb-1">
                        {getDefaultNoValue(extractNameObject(complianceData.compliance_id, 'name'))}
                      </h6>
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Compliance Act :
                        </span>
                        <span className="font-weight-400">
                          {getDefaultNoValue(extractNameObject(complianceData.compliance_act, 'name'))}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Next Expiry Date :
                        </span>
                        <span className="font-weight-400">
                          {getCompanyTimezoneDate(complianceData.next_expiry_date, userInfo, 'datetime')}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
              )}
            </Card>
            <Row>
              {stateChangeInfo && !stateChangeInfo.data && !loading && isAddAllowed && (isDocumentRequired || isDocumentOptional) && (
              <Col xs={12} sm={11} md={12} lg={12}>
                <FormControl className={classes.margin}>
                  <Label for="File">
                    Document
                    {isDocumentRequired && (<span className="ml-2 text-danger">*</span>)}
                  </Label>
                  {!fileDataImage && (
                  <>
                    <ReactFileReader
                      multiple
                      elementId="fileUploadRE3"
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
                    {fileExtension && fileExtension.match(/.(jpg|jpeg|svg|png)$/i)
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
                          <p className="m-0 text-break">{documentName}</p>
                        </>
                      )}
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
                {imgValidation && (<FormHelperText><span className="text-danger">Choose .pdf, .xlsx, .ppt, .docx, .jpg, .jpeg, .png, .svg Only...</span></FormHelperText>)}
                {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
              </Col>
              )}
            </Row>
            <Row className="justify-content-center">
              {stateChangeInfo && stateChangeInfo.data && !loading && (
              <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This Compliance has been publish successfully.." />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
              <SuccessAndErrorFormat response={stateChangeInfo} />
              )}
              {loading && (
              <CardBody className="mt-4" data-testid="loading-case">
                <Loader />
              </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {stateChangeInfo && stateChangeInfo.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              disabled={loading || (isDocumentRequired && !fileDataImage)}
              className="submit-btn"
              onClick={() => handleStateChange(complianceData.id, 'action_set_to_publish')}
            >
              Move
            </Button>
          )}
        {(stateChangeInfo && stateChangeInfo.data
          && (
          <Button
            type="button"
            variant="contained"
            disabled={loading}
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

Publish.propTypes = {
  complianceDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  publishModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Publish;
