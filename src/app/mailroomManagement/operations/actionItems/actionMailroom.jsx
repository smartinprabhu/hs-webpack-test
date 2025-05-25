/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import {
  FormHelperText,
} from '@material-ui/core';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ReactFileReader from 'react-file-reader';
import {
  Button,
  Typography,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';

import operationBlackActive from '@images/icons/operationsBlack.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';

import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getDefaultNoValue, extractNameObject,
} from '../../../util/appUtils';
import { bytesToSize } from '../../../util/staticFunctions';
import { updateOrder } from '../../../pantryManagement/pantryService';
import { visitStateChange } from '../../../visitorManagement/visitorManagementService';

const appModels = require('../../../util/appModels').default;

const ActionMailroom = (props) => {
  const {
    details, actionModal, actionText, actionCode, actionMessage, actionButton, atFinish, modelName, isOutbound, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const {
    updateOrderInfo,
  } = useSelector((state) => state.pantry);

  const mailroomSignature = details && (details.data && details.data.length > 0) ? details.data[0].signature : '';
  const mailroomTrack = details && (details.data && details.data.length > 0) ? details.data[0].tracking_no : '';
  const mailroomAgent = details && (details.data && details.data.length > 0) ? details.data[0].agent_name : '';

  const [trackingNo, setTrackingNo] = useState(mailroomTrack);
  const [agentName, setAgentName] = useState(mailroomAgent);
  const [imageSignature, setImageSignature] = useState(false);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(mailroomSignature);
  const [fileType, setFileType] = useState('data:image/png;base64,');

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
        setImageSignature(fileData);
      }
    }
  };

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const reasonInputTnChange = (e) => {
    setTrackingNo(e.target.value);
  };

  const reasonInputAnChange = (e) => {
    setAgentName(e.target.value);
  };

  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);

  const mailroomRequestData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const editId = details && (details.data && details.data.length > 0) ? details.data[0].id : '';

  const handleStateChange = (id, state) => {
    if (isOutbound && actionText === 'Deliver') {
      const payload = {
        tracking_no: trackingNo, agent_name: agentName, signature: imageSignature || '',
      };
      dispatch(updateOrder(id, appModels.MAILOUTBOUND, payload));
    }
    dispatch(visitStateChange(id, state, modelName));
  };

  const loading = (details && details.loading) || (updateOrderInfo && updateOrderInfo.loading) || (stateChangeInfo && stateChangeInfo.loading);

  return (

    <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={actionModal}>
      <DialogHeader title={actionText} imagePath={false} onClose={toggleCancel} />
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
              {details && (details.data && details.data.length > 0) && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <img src={operationBlackActive} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }} className="font-family-tab">
                      Sender Name:
                      {' '}
                      {isOutbound ? getDefaultNoValue(extractNameObject(mailroomRequestData.employee_id, 'name')) : getDefaultNoValue(mailroomRequestData.sender)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="font-family-tab">
                      <span className="font-weight-800 font-family-tab font-side-heading mr-1"> Receiver Name: </span>
                      {isOutbound ? getDefaultNoValue(mailroomRequestData.sent_to) : getDefaultNoValue(extractNameObject(mailroomRequestData.employee_id, 'name'))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="font-family-tab">
                      <span className="font-weight-800 font-family-tab font-side-heading mr-1">Type: </span>
                      {getDefaultNoValue(mailroomRequestData.recipient)}
                    </Typography>

                  </Box>
                </Box>

              </CardBody>
              )}
            </Card>
            {isOutbound && actionText === 'Deliver' && (
            <>
              <Row className="ml-2 mr-2">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Label for="tracking number" className="font-family-tab">
                    Tracking Number
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter tracking number"
                    disabled={(stateChangeInfo && stateChangeInfo.data) || loading}
                    value={trackingNo || ''}
                    onChange={reasonInputTnChange}
                  />
                </Col>
              </Row>
              <Row className="ml-2 mr-2 mt-2">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Label for="agent name" className="font-family-tab">
                    Agent Name
                  </Label>
                  <Input type="text" placeholder="Enter agent name" disabled={(stateChangeInfo && stateChangeInfo.data) || loading} value={agentName || ''} onChange={reasonInputAnChange} />
                </Col>
              </Row>
              <Row className="ml-2 mr-2 mt-2">
                <Col xs={12} sm={12} lg={12} md={12}>
                  <FormGroup>
                    <Label for="logo" className="font-family-tab">
                      Signature
                    </Label>
                    {!fileDataImage && !imageSignature && (
                    <ReactFileReader
                      elementId="fileUpload"
                      handleFiles={handleFiles}
                      fileTypes=".png,.jpg,.jpeg"
                      base64
                    >
                      <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1 m-1">
                        <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                        <p className="font-weight-500 font-family-tab">Select a file</p>
                      </div>
                    </ReactFileReader>
                    )}
                    {(!fileDataImage && (editId && imageSignature)) && (
                    <div className="position-relative mt-2">
                      <img
                        src={`data:image/png;base64,${imageSignature}`}
                        height="150"
                        width="150"
                        className="ml-3"
                        alt="uploaded"
                      />
                      { stateChangeInfo && !stateChangeInfo.data && !loading && (
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
                            setImageSignature(false);
                          }}
                          alt="remove"
                        />
                      </div>
                      )}
                    </div>
                    )}
                    {fileDataImage && (
                    <div className="position-relative mt-2">
                      <img
                        src={`${fileType}${fileDataImage}`}
                        height="150"
                        width="150"
                        className="ml-3"
                        alt="uploaded"
                      />
                      {stateChangeInfo && !stateChangeInfo.data && !loading && (
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
                            setImageSignature(false);
                          }}
                          alt="remove"
                        />
                      </div>
                      )}
                    </div>
                    )}
                  </FormGroup>
                  {imgValidation && (<FormHelperText><span className="text-danger font-family-tab">Choose Image Only...</span></FormHelperText>)}
                  {imgSize && (<FormHelperText><span className="text-danger font-family-tab">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                </Col>
              </Row>
            </>
            )}
            <Row className="justify-content-center">
              {stateChangeInfo && stateChangeInfo.data && !loading && (
              <SuccessAndErrorFormat
                response={stateChangeInfo}
                successMessage={isOutbound ? `This outbound mail has been ${actionMessage} successfully..` : `This inbound mail has been ${actionMessage} successfully..`}
              />
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
              className="submit-btn-auto"
              disabled={loading}
              onClick={() => handleStateChange(mailroomRequestData.id, actionCode)}
            >
              {actionButton}
            </Button>
          )}
        {(stateChangeInfo && stateChangeInfo.data
          && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn-auto"
            disabled={loading}
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

ActionMailroom.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  actionMessage: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  modelName: PropTypes.string.isRequired,
  isOutbound: PropTypes.bool.isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default ActionMailroom;
