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
import moment from 'moment';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { AddThemeColor } from '../themes/theme';
import {
  createTenant, incrementNotificationCount,
} from '../adminSetup/setupService';

const appModels = require('../util/appModels').default;

const DownloadRequestAlert = (props) => {
  const {
    details, webFilters, actionModal, atReset,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const { createTenantinfo } = useSelector((state) => state.setup);
  const { notificationCountDR } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);

  const toggle = () => {
    setModal(!modal);
    atReset();
  };

  useEffect(() => {
    if (createTenantinfo && createTenantinfo.data && createTenantinfo.data) {
      if (Number(notificationCountDR) > 0) {
        dispatch(incrementNotificationCount(notificationCountDR + 1));
      } else {
        dispatch(incrementNotificationCount(1));
      }
    }
  }, [createTenantinfo]);

  const handleStateChange = async (id) => {
    let postData = {};
    postData = {
      state: 'Pending',
      total_record: details.totalRecords,
      search_type: details.searchType ? details.searchType : 'isearch_read',
      model_fields: details.modelFields,
      download_type: details.downloadType,
      model: details.modelName,
      res_user_id: userInfo && userInfo.data.id,
      params: details.domain,
      created_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
      expire_on: moment(new Date()).utc().add(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
      web_parms: webFilters && Object.keys(webFilters).length > 0 ? JSON.stringify(webFilters) : '',
    };
    const payload = { model: appModels.DOWNLOADREQUEST, values: postData };
    dispatch(createTenant(appModels.DOWNLOADREQUEST, payload));
  };

  const loading = (createTenantinfo && createTenantinfo.loading);
  const updated = (createTenantinfo && createTenantinfo.data);

  return (
    <Dialog maxWidth="md" open={actionModal}>
      {/* <DialogHeader fontAwesomeIcon={faIcons[actionText]} title={actionText} onClose={toggle} response={createTenantinfo} /> */}
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
                  {details?.totalRecords > 2000
                    ? 'The requested report exceeds the permissible limit. Would you like to proceed and check back later?'
                    : details?.state === 'Ready'
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
              {createTenantinfo && createTenantinfo.data && !loading && (
              <SuccessAndErrorFormat response={createTenantinfo} successMessage="The requested report is being processed and will be ready soon." />
              )}
              {createTenantinfo && createTenantinfo.err && (
              <SuccessAndErrorFormat response={createTenantinfo} />
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
        {updated || !details?.totalRecords > 2000 ? (
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
