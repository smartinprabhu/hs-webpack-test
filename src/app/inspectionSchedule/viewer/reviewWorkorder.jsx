/* eslint-disable no-nested-ternary */
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
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
  Box,
} from '@mui/material';
import DOMPurify from 'dompurify';

import workOrdersBlue from '@images/icons/workOrders.svg';
import workOrdersBlack from '@images/sideNavImages/workorder_black.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  resetEscalate,
  orderStateChange,
} from '../../workorders/workorderService';
import { getWorkOrderStateLabel } from '../../workorders/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
  getAllowedCompanies,
  extractIdObject,
  extractNameObject,
} from '../../util/appUtils';
import {
  getInspectionDetail,
  getPPMDetail,
} from '../inspectionService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const ReviewWorkorder = (props) => {
  const {
    inspDeata, reviewModal, atFinish, isOrderId, woData, isPPM,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(reviewModal);
  const [messageTicket, setMessageTicket] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo } = useSelector((state) => state.workorder);
  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);
  const ppmConfig = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const isReViewCommentRequired = ppmConfig && ppmConfig.review_commment_is_required;

  const companies = getAllowedCompanies(userInfo);

  const toggle = () => {
    setModal(!model);
    atFinish();
    if (!isPPM && stateChangeInfo && stateChangeInfo.data && inspDeata && inspDeata.id) {
      if (isOrderId) {
        dispatch(getInspectionDetail(companies, appModels.INSPECTIONCHECKLISTLOGS, isOrderId));
      } else {
        dispatch(getInspectionDetail(companies, appModels.INSPECTIONCHECKLISTLOGS, inspDeata.id));
      }
    }
    if (isPPM && stateChangeInfo && stateChangeInfo.data && inspDeata && inspDeata.id) {
      dispatch(getPPMDetail(companies, appModels.PPMWEEK, inspDeata.id));
    }
    dispatch(resetEscalate());
  };

  useEffect(() => {
    dispatch(resetEscalate());
  }, []);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const handleStateChange = () => {
    const oId = !isPPM ? inspDeata && inspDeata.id ? inspDeata.id : false : inspDeata && inspDeata.order_id ? inspDeata.order_id : false;
    const oId1 = woData && woData.id ? woData.id : false;
    const uId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
    if (oId || oId1) {
      const postData = {
        review_status: 'Done',
        reviewed_by: uId,
        reviewed_remark: DOMPurify.sanitize(messageTicket),
        reviewed_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch(orderStateChange(oId || oId1, postData, appModels.ORDER));
    }
  };

  return (

    <Dialog open={model}>
      <DialogHeader imagePath={workOrdersBlack} onClose={toggle} title="Review Work order" response={stateChangeInfo} />
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
            {inspDeata && (
              <>
                {stateChangeInfo && !stateChangeInfo.data && (
                <Row className="ml-4 mr-4 mb-5">
                  <Col sm="12" md="12" lg="12" xs="12">
                    <Card className="bg-thinblue border-0">
                      <CardBody className="p-3">
                        <Row>
                          <Col sm="10" md="10" lg="10" xs="12">
                            <p className="font-weight-800 font-side-heading text-grey mb-1">
                              {!isPPM ? getDefaultNoValue(inspDeata.name) : inspDeata.order_name
                                ? getDefaultNoValue(inspDeata.order_name)
                                : getDefaultNoValue(inspDeata.order_name)}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              {!isPPM ? getDefaultNoValue(getWorkOrderStateLabel(inspDeata.state ? inspDeata.state.toLowerCase() : '')) : getDefaultNoValue(getWorkOrderStateLabel(inspDeata.order_state ? inspDeata.order_state.toLowerCase() : ''))}
                            </p>
                          </Col>
                          <Col sm="2" md="2" lg="2" xs="12">
                            <img src={workOrdersBlue} alt="workorder" width="25" className="mr-2 float-right" />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    {(stateChangeInfo && !stateChangeInfo.data && (!stateChangeInfo.loading)) && (
                    <div>
                      <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-2 bg-whitered" rows="4" />
                      {!messageTicket && isReViewCommentRequired && (<span className="text-danger ml-1">Remarks required</span>)}
                    </div>
                    )}
                  </Col>
                </Row>
                )}
                {stateChangeInfo && stateChangeInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(stateChangeInfo && stateChangeInfo.err) && (
                  <SuccessAndErrorFormat response={stateChangeInfo} />
                )}
                {((stateChangeInfo && stateChangeInfo.data) && (!stateChangeInfo.loading)) && (
                  <SuccessAndErrorFormat response={stateChangeInfo} successMessage="The work order has been reviewed successfully.." />
                )}
              </>
            )}
            {woData && (
              <>
                {stateChangeInfo && !stateChangeInfo.data && (
                <Row className="ml-4 mr-4 mb-5">
                  <Col sm="12" md="12" lg="12" xs="12">
                    <Card className="bg-thinblue border-0">
                      <CardBody className="p-3">
                        <Row>
                          <Col sm="10" md="10" lg="0" xs="12">
                            <p className="font-weight-800 font-side-heading text-grey mb-1">
                              {getDefaultNoValue(woData.name)}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              {getDefaultNoValue(getWorkOrderStateLabel(woData.state))}
                            </p>
                          </Col>
                          <Col sm="2" md="2" lg="2" xs="12">
                            <img src={workOrdersBlue} alt="workorder" width="25" className="mr-2 float-right" />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    {(stateChangeInfo && !stateChangeInfo.data && (!stateChangeInfo.loading)) && (
                    <div>
                      <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-2 bg-whitered" rows="4" />
                      {!messageTicket && (<span className="text-danger ml-1">Remarks required</span>)}
                    </div>
                    )}
                  </Col>
                </Row>
                )}
                {stateChangeInfo && stateChangeInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(stateChangeInfo && stateChangeInfo.err) && (
                  <SuccessAndErrorFormat response={stateChangeInfo} />
                )}
                {((stateChangeInfo && stateChangeInfo.data) && (!stateChangeInfo.loading)) && (
                  <SuccessAndErrorFormat response={stateChangeInfo} successMessage="The work order has been reviewed successfully.." />
                )}
              </>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="border-0 pt-1">
        {(stateChangeInfo && !stateChangeInfo.data && !stateChangeInfo.err) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={(!isPPM && messageTicket === '') || stateChangeInfo.loading || (isPPM && isReViewCommentRequired && messageTicket === '')}
            onClick={() => handleStateChange()}
          >
            Review
          </Button>
        )}
        {(stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.err)) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={() => toggle()}
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ReviewWorkorder.propTypes = {
  inspDeata: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  reviewModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  woData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ReviewWorkorder;
