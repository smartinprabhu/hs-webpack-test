/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  Label,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import DOMPurify from 'dompurify';

import survey from '@images/icons/surveyAction.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faCheckCircle, faTag, faPencilAlt, faPrint,
  faPauseCircle,
  faPlayCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, extractNameObject,
} from '../../../util/appUtils';
import { visitStateChange } from '../../../visitorManagement/visitorManagementService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { getCustomButtonName } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  approved: faCheckCircle,
  prepared: faTag,
  issued: faCheckCircle,
  validated: faCheckCircle,
  reviewed: faPencilAlt,
  PRINTPDF: faPrint,
  'on holded': faPauseCircle,
  resumed: faPlayCircle,
  cancelled: faTimesCircle,
};

const Actions = (props) => {
  const {
    details, actionModal, actionText, actionValue, actionMessage, actionButton, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [isLoad, setIsLoad] = useState(false);
  const [messageTicket, setMessageTicket] = useState('');

  const {
    userInfo,
  } = useSelector((state) => state.user);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  const { workPermitConfig } = useSelector((state) => state.workpermit);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;
  const editId = details && (details.data && details.data.length > 0) ? details.data[0].id : false;

  /* useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data && editId) {
      dispatch(visitStateChange(editId, 'action_validated', appModels.WORKPERMIT));
    }
  }, [updateProductCategoryInfo]); */

  const handleStateChange = (id, state) => {
    if (actionText === 'Validate') {
      // dispatch(visitStateChange(editId, 'action_validated', appModels.WORKPERMIT));

      const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : '';
      const payload = {
        validated_status: 'Valid',
        validated_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        validated_by: userId,
        state: 'Validated',
      };
      dispatch(visitStateChange(editId, false, appModels.WORKPERMIT, false, 'yes', payload));
    } else if (actionText === 'Cancel') {
      const payload = {
        reason: DOMPurify.sanitize(messageTicket),
        state: 'Cancel',
      };
      dispatch(visitStateChange(editId, false, appModels.WORKPERMIT, false, 'yes', payload));
    } else {
      dispatch(visitStateChange(id, state, appModels.WORKPERMIT));
    }
  };

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);

  const permitData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const loading = isLoad || (details && details.loading) || (stateChangeInfo && stateChangeInfo.loading) || (updateProductCategoryInfo && updateProductCategoryInfo.loading);

  return (
    <Dialog maxWidth="md" open={actionModal}>
      <DialogHeader title={getCustomButtonName(actionText, wpConfig)} onClose={toggleCancel} response={stateChangeInfo} fontAwesomeIcon={faIcons[actionMessage]} sx={{ width: '500px' }} />
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
            <Card className="border-5 mt-2 ml-2 mb-2 mr-2 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {details && (details.data && details.data.length > 0) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col className="col-auto">
                      <img src={survey} alt="asset" className="mt-1" width="50" height="45" />
                    </Col>
                    <Col className="col-auto">
                      <Row>
                        <Col className="col-auto">
                          <h6 className="mb-1">
                            {getDefaultNoValue(permitData.name)}
                          </h6>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Reference :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue((permitData.reference))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Vendor :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(extractNameObject(permitData.vendor_id, 'name'))}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            {stateChangeInfo && !stateChangeInfo.data && !loading && (actionText === 'Cancel') && (
            <Row className="ml-2 mr-2 mt-0">
              <Col xs={12} sm={12} md={12} lg={12}>
                <Label className="mt-0">
                  Reason
                  {' '}
                  <span className="ml-1 text-danger">*</span>
                </Label>
                <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
              </Col>
            </Row>
            )}
            <Row className="justify-content-center">
              {stateChangeInfo && stateChangeInfo.data && !loading && (
                <SuccessAndErrorFormat response={stateChangeInfo} successMessage={`This work permit has been ${getCustomButtonName(actionButton, wpConfig)} successfully..`} />
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
      <DialogActions className="mr-3 ml-3">
        {stateChangeInfo && stateChangeInfo.data
          ? ''
          : (
            <Button
              type="button"
              size="sm"
              disabled={loading || (actionText === 'Cancel' && !messageTicket)}
              variant="contained"
              className="submit-btn w-auto mr-1"
              onClick={() => handleStateChange(permitData.id, actionValue)}
            >
              {getCustomButtonName(actionButton, wpConfig)}
            </Button>
          )}
        {(stateChangeInfo && stateChangeInfo.data
          && (
            <Button
              type="button"
              size="sm"
              disabled={loading}
              variant="contained"
              className="submit-btn mr-1"
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
};
export default Actions;
