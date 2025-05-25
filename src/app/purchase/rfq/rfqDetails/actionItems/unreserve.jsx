/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Box } from '@mui/material'

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, getLocalTime,
} from '../../../../util/appUtils';
import { purchaseStateChange, getTransferDetail } from '../../../purchaseService';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const Unreserve = (props) => {
  const {
    transferDetails, unreserveModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(unreserveModal);

  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo } = useSelector((state) => state.purchase);

  /*  useEffect(() => {
      const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
      if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
        dispatch(getTransferDetail(viewId, appModels.STOCK));
      }
    }, [userInfo, stateChangeInfo]); */

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(purchaseStateChange(id, state, appModels.STOCK));
  };

  const toggle = () => {
    setModal(!modal);
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    atFinish();
  };

  return (
    <Dialog maxWidth={'lg'} open={unreserveModal}>
      <DialogHeader title="Unreserve" onClose={toggle} response={stateChangeInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F6F8FA",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10%",
              fontFamily: "Suisse Intl",
            }}
          >
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {stateChangeInfo && (!stateChangeInfo.data || !stateChangeInfo.status) && transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="2">
                      <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                      <Row>
                        <h6 className="mb-1">{transferData.name}</h6>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Partner :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(transferDetails && transferDetails.data && transferDetails.data[0].partner_id[1] ? transferDetails.data[0].partner_id[1] : '')}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Scheduled Date :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(getLocalTime(transferDetails && transferDetails.data && transferDetails.data[0].scheduled_date ? transferDetails.data[0].scheduled_date : ''))}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            <Row className="justify-content-center">
              {stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status) && (transferDetails && !transferDetails.loading) && (
                <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This transfer has been has been unreserved successfully.." />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
                <SuccessAndErrorFormat response={stateChangeInfo} />
              )}
              {((stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading)) && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="border-0 pt-1">
        {(stateChangeInfo.data || stateChangeInfo.status)
          ? ''
          : (
            <Button
              variant='contained'
              className="mr-1 submit-btn"
              disabled={((stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading))}
              onClick={() => handleStateChange(transferData.id, 'do_unreserve')}
            >
              {' '}
              Unreserve
            </Button>
          )}
        {(stateChangeInfo.data || stateChangeInfo.status) && (
          <Button
            variant='contained'
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

Unreserve.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  unreserveModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Unreserve;
