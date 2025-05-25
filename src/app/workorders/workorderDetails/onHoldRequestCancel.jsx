/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import workorderLogo from '@images/icons/workOrders.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getOrderDetail,
} from '../workorderService';
import { updateProductCategory, resetUpdateProductCategory } from '../../pantryManagement/pantryService';
import {
  getDefaultNoValue,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const OnHoldRequestCancel = React.memo((props) => {
  const {
    details, ppmData, cancelModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(cancelModal);
  const { userInfo } = useSelector((state) => state.user);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    dispatch(resetUpdateProductCategory());
  }, []);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const toggle = () => {
    const viewId = details && details.data ? details.data[0].id : '';
    if (viewId && updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
    dispatch(resetUpdateProductCategory());
    setModal(!model);
    atFinish();
  };

  const sendClose = () => {
    const id = ppmData && ppmData.id ? ppmData.id : false;
    if (id) {
      const postData = {
        is_on_hold_requested: false,
        on_hold_requested_by: '',
        on_hold_requested_email: '',
        on_hold_requested_on: false,
        on_hold_requested_command: '',
        on_hold_reject_reason: '',
        pause_reason_id: false,
        paused_on: false,
      };
      dispatch(updateProductCategory(id, 'ppm.scheduler_week', postData));
    }
  };

  const loading = (updateProductCategoryInfo && updateProductCategoryInfo.loading);

  return (
    <Dialog maxWidth="md" open={model}>
      <DialogHeader title="Cancel On-Hold Request" onClose={toggle} response={updateProductCategoryInfo} imagePath={workorderLogo} />
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
            <Row className="ml-4 mr-4 mb-0">
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                  {detailData && (
                    <CardBody className="bg-lightblue p-3">
                      <Row>
                        <Col md="2" xs="2" sm="2" lg="2">
                          <img src={workorderLogo} alt="asset" className="mt-2" width="35" height="35" />
                        </Col>
                        <Col md="8" xs="8" sm="8" lg="8" className="ml-4">
                          <Row>
                            <h6 className="mb-1">{detailData.name}</h6>
                          </Row>
                          <Row>
                            <p className="mb-0 font-weight-500 font-tiny">
                              {getDefaultNoValue(detailData.sequence)}
                            </p>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  )}
                </Card>
              </Col>
            </Row>
            {loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
              <SuccessAndErrorFormat response={updateProductCategoryInfo} />
            )}
            {updateProductCategoryInfo && updateProductCategoryInfo.data && !loading && (
              <SuccessAndErrorFormat response={updateProductCategoryInfo} successMessage="The Request for On Hold has been cancelled." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={(updateProductCategoryInfo && updateProductCategoryInfo.data) || loading}
            onClick={() => sendClose()}
          >
            Cancel

          </Button>
        )}
        {(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={() => toggle()}
            disabled={loading}
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>

  );
});

OnHoldRequestCancel.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  cancelModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default OnHoldRequestCancel;
