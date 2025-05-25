/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, Box,
} from '@mui/material';

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  extractTextObject, avoidSpaceOnFirstCharacter,
} from '../../../../util/appUtils';
import { cancelTtransfer, resetCancelTransferInfo, getTransferDetail } from '../../../purchaseService';
import customDataDashboard from '../../../../inventory/overview/data/customData.json';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const CancelTransfer = (props) => {
  const {
    transferDetails, cancelModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(cancelModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [stateType, setStateType] = useState('');
  const { cancelTransferInfo } = useSelector((state) => state.purchase);

  const toggle = () => {
    if (cancelTransferInfo && cancelTransferInfo.data) {
      const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    setModal(!modal);
    atFinish();
    dispatch(resetCancelTransferInfo());
  };

  const onMessageChange = (e) => {
    setMessageTicket(DOMPurify.sanitize(e.target.value));
  };

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetCancelTransferInfo());
  }, []);

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';
  const code = transferData && transferData.picking_type_code ? transferData.picking_type_code : '';

  const customNames = customDataDashboard.types;

  const handleStateChange = (id, state, type) => {
    dispatch(cancelTtransfer(id, messageTicket));
    setStateType(type);
  };

  function getItemData(type) {
    let res = transferData.asset_id;
    if (type === 'Location') {
      res = transferData.space_id;
    } else if (type === 'Employee') {
      res = transferData.employee_id;
    } else if (type === 'Department') {
      res = transferData.department_id;
    }
    return res;
  }

  return (
    <Dialog maxWidth="lg" open={cancelModal}>
      <DialogHeader fontAwesomeIcon={faTimesCircle} title={`Reject ${customNames[code] ? customNames[code].text : 'Transfer'}`} onClose={toggle} response={cancelTransferInfo} />
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
            {cancelTransferInfo && !cancelTransferInfo.data && transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
              <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">

                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="2">
                      <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="10" xs="10" sm="10" lg="10">
                      <Row>
                        <h6 className="mb-1">{transferData.name}</h6>
                      </Row>
                      {transferData.picking_type_code !== 'internal' && (
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                            <span className="font-weight-800 font-side-heading mr-1">
                              Vendor :
                            </span>
                            <span className="font-weight-400">
                              {getDefaultNoValue(transferDetails && transferDetails.data && transferDetails.data[0].partner_id[1] ? transferDetails.data[0].partner_id[1] : '')}
                            </span>
                          </Col>
                        </Row>
                      )}
                      {transferData.picking_type_code === 'internal' && (
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                            <span className="font-weight-800 font-side-heading mr-1">
                              {getDefaultNoValue(transferData.use_in)}
                              {' '}
                              :
                            </span>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractTextObject(getItemData(transferData.use_in)))}
                            </span>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Scheduled Date :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(transferDetails && transferDetails.data && transferDetails.data[0].scheduled_date ? getCompanyTimezoneDate(transferDetails.data[0].scheduled_date, userInfo, 'datetime') : '')}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>

              </Card>
            )}
            {(cancelTransferInfo && !cancelTransferInfo.data) && (
            <div>
              <Input
                type="textarea"
                name="body"
                placeholder="Enter here"
                value={messageTicket}
                onChange={onMessageChange}
                onKeyPress={messageTicket === '' ? avoidSpaceOnFirstCharacter : true}
                className="mt-2 bg-whitered"
                rows="4"
              />
              {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
            </div>
            )}

            <Row className="justify-content-center">
              {cancelTransferInfo && (cancelTransferInfo.data || cancelTransferInfo.status) && (transferDetails && !transferDetails.loading) && (
                <SuccessAndErrorFormat response={cancelTransferInfo} successMessage={`This ${customNames[code] ? customNames[code].text : 'Transfer'} has been rejected successfully..`} />
              )}
              {cancelTransferInfo && cancelTransferInfo.err && (
                <SuccessAndErrorFormat response={cancelTransferInfo} />
              )}
              {((transferDetails && transferDetails.loading) || (cancelTransferInfo && cancelTransferInfo.loading)) && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {cancelTransferInfo && !cancelTransferInfo.data && (
          <Button
            disabled={messageTicket === ''}
            variant="contained"
            className="mr-1 submit-btn"
            onClick={() => handleStateChange(transferData.id, 'action_cancel', 'cancel')}
          >
            Confirm
          </Button>
        )}
        {cancelTransferInfo && cancelTransferInfo.data && (
          <Button
            variant="contained"
            className="mr-1 submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

CancelTransfer.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  cancelModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default CancelTransfer;
