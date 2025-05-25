/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
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
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  extractTextObject,
} from '../../../../util/appUtils';
import { updateTransferStatus, resetTransferStatusInfo, getTransferDetail } from '../../../purchaseService';
import customDataDashboard from '../../../../inventory/overview/data/customData.json';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const DeliverTransfer = (props) => {
  const {
    transferDetails, todoModal, atFinish,
    submitText, actionMsg, title,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(todoModal);
  const [stateType, setStateType] = useState('');
  const { statusUpdateInfo, moveProductsV1 } = useSelector((state) => state.purchase);
  const { operationTypeDetails } = useSelector((state) => state.inventory);

  const toggle = () => {
    if (statusUpdateInfo && statusUpdateInfo.data) {
      const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    setModal(!modal);
    atFinish();
    dispatch(resetTransferStatusInfo());
  };

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetTransferStatusInfo());
  }, []);

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';
  const code = transferData && transferData.picking_type_code ? transferData.picking_type_code : '';

  const customNames = customDataDashboard.types;

  const isApprovalRequired = operationTypeDetails && operationTypeDetails.data && operationTypeDetails.data.length && operationTypeDetails.data[0].is_confirmed;

  const handleStateChange = (id, type) => {
    const data = moveProductsV1 && moveProductsV1.data ? moveProductsV1.data : [];
    const newData = data.map((cl) => ({
      product_id: cl.product_id && cl.product_id.id ? cl.product_id.id : false, quantity: parseInt(cl.product_uom_qty),
    }));
    const postDataValues = {
      dc_no: transferData.dc_no,
      po_no: transferData.po_no,
      move_lines: newData,
    };

    const stockType = isApprovalRequired ? 'done' : false;

    dispatch(updateTransferStatus(id, [postDataValues], stockType));
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

    <Dialog maxWidth={'lg'} open={todoModal}>
      <DialogHeader fontAwesomeIcon={faEnvelope} title={title} onClose={toggle} response={statusUpdateInfo} />
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
            {statusUpdateInfo && !statusUpdateInfo.data && !statusUpdateInfo.loading && transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
              <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">

                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="2">
                      <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
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
            <Row className="justify-content-center">
              {statusUpdateInfo && (statusUpdateInfo.data || statusUpdateInfo.status) && (transferDetails && !transferDetails.loading) && (
                <SuccessAndErrorFormat response={statusUpdateInfo} successMessage={`This ${customNames[code] ? customNames[code].text : 'Transfer'} has been ${actionMsg} successfully..`} />
              )}
              {statusUpdateInfo && statusUpdateInfo.err && (
                <SuccessAndErrorFormat response={statusUpdateInfo} />
              )}
              {((transferDetails && transferDetails.loading) || (statusUpdateInfo && statusUpdateInfo.loading)) && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {statusUpdateInfo && !statusUpdateInfo.data && (
          <Button
            variant='contained'
            className="mr-1 submit-btn"
            onClick={() => handleStateChange(transferData.id, 'approve')}
          >
            {submitText}
          </Button>
        )}
        {statusUpdateInfo && statusUpdateInfo.data && (
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

DeliverTransfer.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  todoModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  submitText: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default DeliverTransfer;
