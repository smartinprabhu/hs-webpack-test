/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faEnvelope,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
  Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import survey from '@images/icons/workPermitBlue.svg';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  copyMultiToClipboard,
  extractNameObject,
  getDefaultNoValue,
} from '../../../util/appUtils';
import { getAuditAction, getAuditDetails, resetAuditAction } from '../../auditService';

const appModels = require('../../../util/appModels').default;

const Actions = (props) => {
  const {
    details, actionModal, atFinish, atCancel, actionMethod, displayName, message,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [copySuccess, setCopySuccess] = useState(false);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(getAuditAction(id, state, appModels.SYSTEMAUDIT));
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(getAuditDetails(detailData.id, appModels.SYSTEMAUDIT));
    dispatch(resetAuditAction());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetAuditAction());
    atCancel();
  };

  const { auditAction } = useSelector((state) => state.audit);

  const loading = (details && details.loading) || (auditAction && auditAction.loading);

  return (

    <Dialog maxWidth="md" open={actionModal}>
      <DialogHeader fontAwesomeIcon={displayName === 'Send Email' ? faEnvelope : faTimesCircle} title={displayName} onClose={toggleCancel} response={auditAction} />
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
                  <Row>
                    <Col className="col-auto">
                      <img src={survey} alt="asset" className="mt-1" width="50" height="45" />
                    </Col>
                    <Col className="col-auto">
                      <Row>
                        <h6 className="mb-1">
                          {getDefaultNoValue(detailData.name)}
                        </h6>
                      </Row>
                      <Row>
                        <Col className="p-0 col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Reference :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue((detailData.reference))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="p-0 col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            System :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(extractNameObject(detailData.audit_system_id, 'display_name'))}
                          </span>
                        </Col>
                      </Row>
                      {displayName === 'Send Email' && (
                      <>
                        <Row>
                          <Col className="p-0 col-auto">
                            <span className="font-weight-800 font-side-heading mr-1">
                              Auditor Email :
                            </span>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.auditor_email)}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="p-0 col-auto">
                            <Tooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
                              <Button
                                variant="contained"
                                size="sm"
                                onMouseLeave={() => setCopySuccess(false)}
                                onClick={() => {
                                  copyMultiToClipboard(detailData.uuid, detailData.audit_system_id && detailData.audit_system_id.uuid ? detailData.audit_system_id.uuid : '', 'audit');
                                  setCopySuccess(true);
                                }}
                                className="pb-05 pt-05 font-11 mt-2 mb-1 mr-2"
                              >
                                Copy URL
                              </Button>
                            </Tooltip>
                          </Col>
                        </Row>
                      </>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            <Row className="justify-content-center">
              {auditAction && auditAction.data && auditAction.data.status && !loading && (
                <SuccessAndErrorFormat response={auditAction} successMessage={message === 'Send Email' ? 'Email Sent' : message} />
              )}
              {auditAction && auditAction.err && (
                <SuccessAndErrorFormat response={auditAction} />
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
        {auditAction && auditAction.data && auditAction.data.status
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              size="sm"
              disabled={loading}
              className="mr-1"
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {displayName}
            </Button>
          )}
        {(auditAction && auditAction.data && auditAction.data.status
              && (
                <Button
                  type="button"
                  variant="contained"
                  size="sm"
                  disabled={loading}
                  className="mr-1"
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

Actions.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionMethod: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  displayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  message: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default Actions;
