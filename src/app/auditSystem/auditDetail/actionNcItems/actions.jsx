/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import {
  faCheckCircle,
  faEnvelope, faTimes,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import survey from '@images/icons/surveyAction.svg';
import {
  Button, Typography,
  Dialog, DialogActions, DialogContent, DialogContentText, Tooltip,
} from '@mui/material';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getDefaultNoValue, truncate,
} from '../../../util/appUtils';
import { getAuditAction, getAuditActions, resetAuditAction } from '../../auditService';
import { getResponseTypeLabel, getStateLabel } from '../../utils/utils';
import {
  auditActionStatusJson,
} from '../../../commonComponents/utils/util';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Start: faCheckCircle,
  Cancel: faTimesCircle,
  Close: faTimes,
  'Create Ticket': faEnvelope,
};

const Actions = (props) => {
  const {
    details, actionModal, actionText, actionValue, actionMessage, actionButton, atFinish, atCancel,
    auditId,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const handleStateChange = (id, state) => {
    dispatch(getAuditAction(id, state, appModels.AUDITACTION));
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(getAuditActions(auditId, appModels.AUDITACTION, 'improvement'));
    dispatch(resetAuditAction());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetAuditAction());
    atCancel();
  };

  const checkTicketsStatus = (val) => (
    <Box>
      {auditActionStatusJson.map(
        (status) => val === status.status && (
        <Box
          sx={{
            backgroundColor: status.backgroundColor,
            padding: '4px 8px',
            borderRadius: '4px',
            color: status.color,
            fontFamily: 'Suisse Intl',
          }}
        >
          {status.text}
        </Box>
        ),
      )}
    </Box>
  );

  const { auditAction } = useSelector((state) => state.audit);

  const loading = auditAction && auditAction.loading;

  return (
    <Dialog maxWidth="md" open={actionModal}>
      <DialogHeader fontAwesomeIcon={faIcons[actionText]} title={actionText} onClose={toggleCancel} response={auditAction} />
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
              {details && details.id && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <img src={survey} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                      <Tooltip title={details.name} placement="bottom">
                        <span>{truncate(getDefaultNoValue(details.name), '300')}</span>
                      </Tooltip>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span className="font-weight-800 font-side-heading mr-1"> Response Type : </span>
                      {getDefaultNoValue(getResponseTypeLabel(details.type_action))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <span className="font-weight-800 font-side-heading mr-1">State : </span>
                      {getDefaultNoValue(checkTicketsStatus(details.state))}
                    </Typography>
                  </Box>
                </Box>
              </CardBody>
              )}
            </Card>
            <Row className="justify-content-center">
              {auditAction && auditAction.data && auditAction.data.status && !loading && (
              <SuccessAndErrorFormat response={auditAction} successMessage={`This action has been ${actionMessage} successfully..`} />
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
              onClick={() => handleStateChange(details.id, actionValue)}
            >
              {actionButton}
            </Button>
          )}
        {(auditAction && auditAction.data && auditAction.data.status
              && (
                <Button
                  type="button"
                  size="sm"
                  disabled={loading}
                  variant="contained"
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
  actionText: PropTypes.string.isRequired,
  actionValue: PropTypes.string.isRequired,
  actionMessage: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
  auditId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};
export default Actions;
