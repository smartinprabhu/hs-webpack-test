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
import {
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
  Box,
} from '@mui/material';

import workorderLogo from '@images/icons/workOrders.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDefaultNoValue,
  getDateTimeUtc,
  calculateTimeDifference,
} from '../../../util/appUtils';
import { getWorkOrderStateLabel } from '../../utils/utils';
import {
  resetActionData, getActionData,
  orderStateChange, resetEscalate, getOrderTimeSheets,
} from '../../workorderService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Start: checkCircleBlack,
  Accept: checkCircleBlack,
  Reopen: checkCircleBlack,
  Restart: checkCircleBlack,
  Unassign: checkCircleBlack,
};

const ActionWorkorder = (props) => {
  const {
    details, actionModal, actionText, actionCode, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [woId, setId] = useState(false);
  const toggle = () => {
    dispatch(resetActionData());
    dispatch(resetEscalate());
    setModal(!modal);
    atFinish();
  };

  const {
    actionResultInfo, orderTimeSheets, stateChangeInfo, workordersInfo,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = actionResultInfo && actionResultInfo.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  const dataLoading = (stateChangeInfo && stateChangeInfo.loading) || (workordersInfo && workordersInfo.loading) || (details && details.loading) || (orderTimeSheets && orderTimeSheets.loading) || (loading);
  const isData = !dataLoading && details && (details.data && details.data.length > 0 && !details.loading && !loading && (stateChangeInfo && !stateChangeInfo.loading));
  const showButton = !loading && !dataLoading && (stateChangeInfo && !stateChangeInfo.loading);
  const showMsg = isResult && (!dataLoading) && (!loading) && (stateChangeInfo && !stateChangeInfo.loading);

  useEffect(() => {
    dispatch(resetActionData());
  }, []);

  useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    setId(viewId);
  }, []);

  useEffect(() => {
    if (details && details.data && actionCode === 'action_unassign') {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      if (ids && ids.length > 0) {
        dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
      }
    }
  }, [actionCode]);

  /* useEffect(() => {
    if (details && details.data && (stateChangeInfo && stateChangeInfo.data) && actionCode === 'action_unassign') {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, [stateChangeInfo, details]); */

  function checkTimesheet() {
    let tid = false;
    const data = orderTimeSheets && orderTimeSheets.data;
    if (data && data.length) {
      const result = data.filter((item) => (!item.end_date));
      tid = result && result.length ? result[result.length - 1].id : false;
    }
    return tid;
  }

  function checkTimesheetStartDate() {
    let tid = false;
    const data = orderTimeSheets && orderTimeSheets.data;
    if (data && data.length) {
      const result = data.filter((item) => (!item.end_date));
      tid = result && result.length ? result[result.length - 1].start_date : false;
    }
    return tid;
  }

  useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      if (actionCode === 'action_start' || actionCode === 'action_restart') {
        let timeData = {
          mro_timesheet_ids: [[0, 0, { mro_order_id: viewId, start_date: getDateTimeUtc(new Date()), reason: 'Start' }]],
          review_status: false,
          reviewed_by: false,
          reviewed_remark: '',
          reviewed_on: false,
          checklist_json_data: false,
        };
        if (checkTimesheet()) {
          const tvalue = checkTimesheet();
          timeData = {
            review_status: false,
            reviewed_by: false,
            reviewed_remark: '',
            reviewed_on: false,
            checklist_json_data: false,
            mro_timesheet_ids: [[1, tvalue, {
              start_date: getDateTimeUtc(new Date()),
            }]],
          };
          dispatch(orderStateChange(viewId, timeData, appModels.ORDER));
        }
        dispatch(orderStateChange(viewId, timeData, appModels.ORDER));
      }
      if (actionCode === 'action_unassign') {
        let timeData = {};
        if (checkTimesheet()) {
          const tvalue = checkTimesheet();
          timeData = {
            employee_id: false,
            state: 'ready',
            mro_timesheet_ids: [[1, tvalue, {
              reason: 'Unassigned',
              description: 'Unassigned',
              end_date: getDateTimeUtc(new Date()),
              total_hours: parseFloat(calculateTimeDifference(checkTimesheetStartDate(), new Date(), true)),
            }]],
          };
          dispatch(orderStateChange(viewId, timeData, appModels.ORDER));
        } else {
          const techData = { employee_id: false, state: 'ready' };
          dispatch(orderStateChange(viewId, techData, appModels.ORDER));
        }
      }
      // dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
  }, [userInfo, actionResultInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && woId && (stateChangeInfo && stateChangeInfo.data) && (actionCode === 'action_start' || actionCode === 'action_restart' || actionCode === 'action_unassign')) {
      // dispatch(getOrderDetail(woId, appModels.ORDER));
    }
  }, [userInfo, stateChangeInfo, actionCode]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(getActionData(id, state, appModels.ORDER));
    /* if (state === 'action_unassign') {
      const techData = { employee_id: false, state: 'ready' };
      setTimeout(() => {
        dispatch(orderStateChange(id, techData, appModels.ORDER));
      }, 1500);
    } */
    if (actionCode === 'action_reopen') {
      setTimeout(() => {
        const postData = {
          is_cancelled: false,
        };
        dispatch(updateTicket(details && details.data[0].help_desk_id && details.data[0].help_desk_id[0], appModels.HELPDESK, postData));
      }, 1000);
    }
  };

  function getAlertText(actionValue) {
    let text = '';
    if (actionValue) {
      const av = actionValue.toLowerCase();
      text = `${av}ed`;
    }
    return text;
  }

  return (
    <Dialog open={actionModal}>
      <DialogHeader title={`${actionText} Workorder`} onClose={toggle} response={actionResultInfo} imagePath={faIcons[actionText]} />
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
            {actionResultInfo && !actionResultInfo.data && (
              <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                {detailData && (
                  <CardBody data-testid="success-case" className="bg-lightblue p-3">
                    <Row>
                      <Col md="2" xs="2" sm="2" lg="2">
                        <img src={workorderLogo} alt="asset" className="mt-2" width="35" height="35" />
                      </Col>
                      <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                        <Row>
                          <h6 className="mb-1">{detailData.name}</h6>
                        </Row>
                        <Row>
                          <p className="mb-0 font-weight-500 font-tiny">
                            {getDefaultNoValue(detailData.sequence)}
                          </p>
                        </Row>
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                            <span className="font-weight-800 font-side-heading mr-1">
                              Status :
                            </span>
                            <span className="font-weight-400">
                              {getWorkOrderStateLabel(detailData.state)}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                )}
              </Card>
            )}
            <Row className="justify-content-center">
              {actionResultInfo && !actionResultInfo.data && !isResult && (!loading) && (!isError) && !dataLoading && (
                <p className="text-center font-weight-700">Are you sure you want to confirm this operation ?</p>
              )}
              {actionResultInfo && actionResultInfo.data && (
                <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage={`This workorder has been ${getAlertText(actionText)} successfully..`} />
              )}
              {isError && (
                <SuccessAndErrorFormat response={actionResultInfo} />
              )}
              {actionResultInfo && actionResultInfo.loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {actionResultInfo && !actionResultInfo.err && !actionResultInfo.data && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={() => handleStateChange(detailData.id, actionCode)}
            disabled={actionResultInfo?.loading}
          >
            Confirm
          </Button>
        )}
        {actionResultInfo && (actionResultInfo.data || actionResultInfo.err) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>

    </Dialog>
  );
};

ActionWorkorder.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ActionWorkorder;
