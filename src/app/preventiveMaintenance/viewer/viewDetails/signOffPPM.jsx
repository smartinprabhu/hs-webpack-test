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
import { getWorkOrderStateLabel } from '../../../workorders/utils/utils';
import {
  getDefaultNoValue,
  extractTextObject,
  getAllowedCompanies,
  extractIdObject,
  extractNameObject,
} from '../../../util/appUtils';
import {
  getPPMDetail,
} from '../../../inspectionSchedule/inspectionService';
import {
  updatePPMScheduler,
  resetUpdateScheduler,
} from '../../ppmService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const SignOffPPM = (props) => {
  const {
    inspDeata, signModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(signModal);
  const [messageTicket, setMessageTicket] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const {
    updatePpmSchedulerInfo
  } = useSelector((state) => state.ppm);

  const companies = getAllowedCompanies(userInfo);

  const toggle = () => {
    setModal(!model);
    atFinish();
    if (updatePpmSchedulerInfo && updatePpmSchedulerInfo.data && inspDeata && inspDeata.id) {
      dispatch(getPPMDetail(companies, appModels.PPMWEEK, inspDeata.id));
    }
    dispatch(resetUpdateScheduler());
  };

  useEffect(() => {
    dispatch(resetUpdateScheduler());
  }, []);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const handleStateChange = () => {
    const uId = userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : false;
    if (inspDeata.id) {
      const postData = {
        is_signed_off: true,
        signed_off_by: uId,
        signed_off_comments: DOMPurify.sanitize(messageTicket),
        signed_off_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch(updatePPMScheduler(inspDeata.id, 'ppm.scheduler_week', postData));
    }
  };

  return (

    <Dialog open={model}>
      <DialogHeader imagePath={workOrdersBlack} onClose={toggle} title="Sign off" response={updatePpmSchedulerInfo} />
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
                {updatePpmSchedulerInfo && !updatePpmSchedulerInfo.data && (
                <Row className="ml-4 mr-4 mb-5">
                  <Col sm="12" md="12" lg="12" xs="12">
                    <Card className="bg-thinblue border-0">
                      <CardBody className="p-3">
                        <Row>
                          <Col sm="10" md="10" lg="10" xs="12">
                            <p className="font-weight-800 font-side-heading text-grey mb-1">
                              {getDefaultNoValue(inspDeata.asset_name)}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              {getDefaultNoValue(inspDeata.asset_path)}
                            </p>
                          </Col>
                          <Col sm="2" md="2" lg="2" xs="12">
                            <img src={workOrdersBlue} alt="workorder" width="25" className="mr-2 float-right" />
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12">
                            <span className="font-weight-800 font-side-heading mr-1">
                              Maintenance Team :
                            </span>
                            <span className="font-weight-400 font-side-heading">
                              {getDefaultNoValue(inspDeata.maintenance_team_name)}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12">
                            <span className="font-weight-800 font-side-heading mr-1">
                              Maintenance Operation :
                            </span>
                            <span className="font-weight-400 font-side-heading">
                              {getDefaultNoValue(inspDeata.task_name)}
                            </span>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    {(updatePpmSchedulerInfo && !updatePpmSchedulerInfo.data && (!updatePpmSchedulerInfo.loading)) && (
                    <div>
                      <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-2 bg-whitered" rows="4" />
                      {!messageTicket && (<span className="text-danger ml-1">Remarks required</span>)}
                    </div>
                    )}
                  </Col>
                </Row>
                )}
                {updatePpmSchedulerInfo && updatePpmSchedulerInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(updatePpmSchedulerInfo && updatePpmSchedulerInfo.err) && (
                  <SuccessAndErrorFormat response={updatePpmSchedulerInfo} />
                )}
                {((updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && (!updatePpmSchedulerInfo.loading)) && (
                  <SuccessAndErrorFormat response={updatePpmSchedulerInfo} successMessage="The ppm has been signed off successfully.." />
                )}
              </>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="border-0 pt-1">
        {(updatePpmSchedulerInfo && !updatePpmSchedulerInfo.data && !updatePpmSchedulerInfo.err) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={messageTicket === '' || updatePpmSchedulerInfo.loading}
            onClick={() => handleStateChange()}
          >
            Sign Off
          </Button>
        )}
        {(updatePpmSchedulerInfo && (updatePpmSchedulerInfo.data || updatePpmSchedulerInfo.err)) && (
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

SignOffPPM.propTypes = {
  inspDeata: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  signModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default SignOffPPM;
