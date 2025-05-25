/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CardBody,
  Row,
} from 'reactstrap';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { AddThemeColor } from '../themes/theme';
import {
  updateTenantNo, incrementNotificationCount,
} from '../adminSetup/setupService';

const appModels = require('../util/appModels').default;

const DownloadRequestAlert = (props) => {
  const {
    details, webFilters, actionModal, atReset,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const { updateVisitor } = useSelector((state) => state.setup);
  const { notificationCountDR } = useSelector((state) => state.setup);

  const toggle = () => {
    setModal(!modal);
    atReset();
  };

  useEffect(() => {
    if (updateVisitor && updateVisitor.data && updateVisitor.data) {
      if (Number(notificationCountDR) > 0) {
        dispatch(incrementNotificationCount(notificationCountDR + 1));
      } else {
        dispatch(incrementNotificationCount(1));
      }
    }
  }, [updateVisitor]);

  const handleStateChange = async (id) => {
    let payload = {};
    payload = {
      state: 'Pending',
      web_parms: webFilters && Object.keys(webFilters).length > 0 ? JSON.stringify(webFilters) : '',
    };
    dispatch(updateTenantNo(id, payload, appModels.DOWNLOADREQUEST));
  };

  const loading = (updateVisitor && updateVisitor.loading);
  const updated = (updateVisitor && updateVisitor.data);

  return (
    <Dialog maxWidth="md" open={actionModal}>
      {/* <DialogHeader fontAwesomeIcon={faIcons[actionText]} title={actionText} onClose={toggle} response={updateVisitor} /> */}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            {updated ? ''
              : (
                <span className="text-center mt-3">
                  {details.state === 'Draft'
                    ? 'The requested report exceeds the permissible limit. Would you like to proceed and check back later?'
                    : details.state === 'Ready'
                      ? (
                        <>
                          Your report is ready for download! Please click on the notifications icon
                          {' '}
                          (
                          <CircleNotificationsIcon
                            sx={{
                              color: AddThemeColor({}).color,
                              fontSize: 16,
                            }}
                          />
                          )
                          {' '}
                          in the header to download it.
                        </>
                      )
                      : 'Your report request is already in progress. We will let you know once it\'s ready!.'}
                </span>
              )}
            <Row className="justify-content-center">
              {updateVisitor && updateVisitor.data && !loading && (
              <SuccessAndErrorFormat response={updateVisitor} successMessage="The requested report is being processed and will be ready soon." />
              )}
              {updateVisitor && updateVisitor.err && (
              <SuccessAndErrorFormat response={updateVisitor} />
              )}
              {loading && (
              <CardBody className="mt-4" data-testid="loading-case">
                <Loader />
              </CardBody>
              )}
            </Row>
            {details.state !== 'Ready' && (
            <span className="text-info font-weight-bold font-11 mb-1 mt-1">
              Note : Please check back on the notifications icon (
              <CircleNotificationsIcon
                sx={{
                  color: AddThemeColor({}).color,
                  fontSize: 16,
                }}
              />
              ) to view/download report
            </span>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {updated || details.state !== 'Draft' ? (
          <Button
            type="button"
            disabled={loading}
            variant="contained"
            onClick={toggle}
          >
            Ok
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="contained"
              size="sm"
              onClick={() => { handleStateChange(details.id); }}
            >
              Yes
            </Button>
            <Button
              type="button"
              disabled={loading}
              variant="contained"
              onClick={toggle}
            >
              No
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

DownloadRequestAlert.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atReset: PropTypes.func.isRequired,
};
export default DownloadRequestAlert;
