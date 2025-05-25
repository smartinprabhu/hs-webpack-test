/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Label,
  Input,
  Card,
  CardBody,
  Col,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import workorderLogo from '@images/icons/workOrders.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDefaultNoValue,
  decimalKeyPress,
  getDateTimeUtc,
  numToFloat,
  getDateDiffereceBetweenTwoDays,
  getColumnArrayById,
  calculateTimeDifference,
  getAllowedCompanies,
} from '../../../util/appUtils';
import { getWorkOrderStateLabel } from '../../utils/utils';
import {
  getOrderDetail, resetActionData, getActionData,
  resetCreateOrderDuration, createOrderDuration,
  getOrderCheckLists, orderStateNoChange, resetEscalate,
  getOrderTimeSheets,
} from '../../workorderService';
import {
  getOrdersFullDetails,
} from '../../../helpdesk/ticketService';

const appModels = require('../../../util/appModels').default;

const CloseWoNoModal = (props) => {
  const {
    details, closeActionModal, actionText, actionCode, atFinish, selectedActions,
  } = props;
  const dispatch = useDispatch();
  const [quantityValue, setQuantityValue] = useState(numToFloat(0));
  const [modal, setModal] = useState(closeActionModal);
  const [dataValues, setDataValues] = useState(details);

  const toggle = () => {
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    dispatch(resetEscalate());
    setModal(!modal);
    atFinish();
  };

  useEffect(() => {
    dispatch(resetActionData());
  }, []);

  useEffect(() => {
    if (details.data) {
      setDataValues(details);
    }
  }, [details]);

  const {
    actionResultInfo, createDurationInfo, orderCheckLists, orderTimeSheets,
    stateChangeInfo,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const { incidentsOrderInfo } = useSelector((state) => state.ticket);

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = actionResultInfo && actionResultInfo.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  const dataLoading = (loading) || (createDurationInfo && createDurationInfo.loading) || (orderCheckLists && orderCheckLists.loading) || (stateChangeInfo && stateChangeInfo.loading);
  const isData = dataValues && (dataValues.data && dataValues.data.length > 0 && !dataValues.loading && !loading && (createDurationInfo && !createDurationInfo.loading))
  && (stateChangeInfo && !stateChangeInfo.loading);
  const showForm = !isResult && (!loading) && (createDurationInfo && !createDurationInfo.data && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);
  const showButton = !loading && (createDurationInfo && !createDurationInfo.loading) && (orderCheckLists && !orderCheckLists.loading);
  const showMsg = isResult && (!loading) && (createDurationInfo && !createDurationInfo.loading) && (orderCheckLists && !orderCheckLists.loading) && (stateChangeInfo && !stateChangeInfo.loading);

  function validateTime(data) {
    let res = data;
    if (data) {
      const strArray = data.toString().split('.');
      if (strArray && strArray.length && strArray.length === 2) {
        const min = parseInt(strArray[1]);
        if (min > 59) {
          res = parseInt(strArray[0]) + 1;
        }
      }
    }
    return res;
  }

  useEffect(() => {
    if (dataValues && dataValues.data) {
      const ids = dataValues.data.length > 0 ? getColumnArrayById(dataValues.data[0].mro_timesheet_ids, 'id') : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, []);

  useEffect(() => {
    if (incidentsOrderInfo && incidentsOrderInfo.data) {
      const inspDeata1 = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
      && incidentsOrderInfo.data.data.length ? { data: [incidentsOrderInfo.data.data[0]] } : false;

      const inspDeata2 = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
      && incidentsOrderInfo.data.data.length && incidentsOrderInfo.data.data.length > 1 ? { data: [incidentsOrderInfo.data.data[1]] } : false;

      const woData = selectedActions && selectedActions.includes('Assessment') ? inspDeata1 : inspDeata2;
      setDataValues(woData);
    }
  }, [incidentsOrderInfo]);

  useEffect(() => {
    if (details && details.data) {
      const startDate = details.data[0].date_start_execution;
      const endDate = details.data[0].date_execution;
      const diffValue = getDateDiffereceBetweenTwoDays(startDate, endDate);
      // eslint-disable-next-line no-restricted-globals
      const totalValue = isNaN(diffValue) ? numToFloat(0) : validateTime(getDateDiffereceBetweenTwoDays(startDate || details.data[0].date_start_scheduled, endDate || new Date(), !endDate));
      setQuantityValue(totalValue);
    }
  }, [details]);

  useEffect(() => {
    if (details && details.data && (stateChangeInfo && stateChangeInfo.data)) {
      const ids = details.data.length > 0 ? getColumnArrayById(details.data[0].mro_timesheet_ids, 'id') : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, []);

  useEffect(() => {
    const ids = dataValues && dataValues.data ? getColumnArrayById(dataValues.data[0].check_list_ids, 'id') : [];
    if ((userInfo && userInfo.data) && ids) {
      dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
    }
  }, [userInfo]);

  useEffect(() => {
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      dispatch(getActionData(createDurationInfo.data[0], actionCode, appModels.ORDERDURATION));
    }
  }, [createDurationInfo]);

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
    const viewId = dataValues && (dataValues.data && dataValues.data.length > 0) && dataValues.data[0].id ? dataValues.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
      dispatch(getOrdersFullDetails(companies, appModels.ORDER, [viewId]));
    }
  }, [userInfo, actionResultInfo]);

  const detailData = dataValues && (dataValues.data && dataValues.data.length > 0) ? dataValues.data[0] : '';

  function checkAnsweredQuestion() {
    let result = true;
    const checklist = orderCheckLists && orderCheckLists.data ? orderCheckLists.data : [];
    if (checklist && checklist.length > 0) {
      const filter = checklist.filter((obj) => ((obj.answer_type !== 'suggestion' && obj.answer_common !== false) || (obj.answer_type === 'suggestion' && obj.value_suggested_ids.length > 0)));
      if (filter.length !== checklist.length) {
        result = false;
      }
    }
    return result;
  }

  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id;
  const userEmployeeName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name;
  const assignEmployeeId = detailData && detailData.employee_id.length && detailData.employee_id[0];

  const isNewEmployee = userEmployeeId && assignEmployeeId && (userEmployeeId !== assignEmployeeId);

  const storeDuration = () => {
    const postData = {
      actual_duration: quantityValue ? parseFloat(quantityValue) : '0.00',
    };
    const viewId = dataValues && (dataValues.data && dataValues.data.length > 0) && dataValues.data[0].id ? dataValues.data[0].id : '';
    const payload = { model: appModels.ORDERDURATION, values: postData, context: { active_id: viewId, active_model: appModels.ORDER } };
    let timeData = {};
    if (checkTimesheet()) {
      const tvalue = checkTimesheet();
      timeData = {
        mro_timesheet_ids: [[1, tvalue, {
          reason: 'Closed',
          description: 'Done',
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(checkTimesheetStartDate(), new Date(), true)),
        }]],
        actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
      };
      if (isNewEmployee) {
        timeData.employee_id = userEmployeeId;
      }
      dispatch(orderStateNoChange(viewId, timeData, appModels.ORDER));
    } else {
      const timeDataAdd = {
        mro_timesheet_ids: [[0, 0, {
          mro_order_id: viewId,
          start_date: getDateTimeUtc(new Date()),
          reason: 'Closed',
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(new Date(), new Date(), true)),
        }]],
        actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
      };
      if (isNewEmployee) {
        timeDataAdd.employee_id = userEmployeeId;
      }
      dispatch(orderStateNoChange(viewId, timeDataAdd, appModels.ORDER));
    }
    setTimeout(() => {
      dispatch(createOrderDuration(appModels.ORDERDURATION, payload));
    }, 1000);
  };

  const onInputChange = (e) => {
    setQuantityValue(e.target.value);
  };

  return (
    <>
      {closeActionModal && (
        <>
          <ModalHeaderComponent imagePath={closeCircle} closeModalWindow={toggle} title={`${actionText} Workorder`} response={actionResultInfo} />
          <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
            {isData && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              {detailData && detailData.name && (
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={workorderLogo} alt="asset" className="mt-2" width="45" height="45" />
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
              )}
            </CardBody>
            )}
          </Card>
          <Row className="ml-2 mr-2">
            {showForm && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <Label for="actual_duration">
                Actual Duration (Hours)
                <span className="text-danger ml-1">*</span>
              </Label>
              <Input type="text" id="quantity" onKeyPress={decimalKeyPress} value={quantityValue} onChange={onInputChange} maxLength="7" className="" />
            </Col>
            )}
          </Row>
          <Row className="justify-content-center">
            {showMsg && (
            <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage="This workorder has been closed successfully.." />
            )}
            {isError && (
            <SuccessAndErrorFormat response={actionResultInfo} />
            )}
            {!(checkAnsweredQuestion()) && (
            <div className="text-danger text-center mt-3">
              <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
              Checklists are not answered...
            </div>
            )}
            {!(showMsg) && isNewEmployee && (
            <p className="text-center text-info">
              Note: This work order will be assigned to and updated by
                {' '}
              {userEmployeeName}
            </p>
            )}
            {dataLoading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
            )}
          </Row>

          {showButton && (
          <ModalFooter className="mr-3 ml-3">
            {(createDurationInfo && !createDurationInfo.data) && (
            <Button
              type="button"
             variant="contained"
              size="sm"
              disabled={!quantityValue || quantityValue < 0 || !(checkAnsweredQuestion())}
              className="mr-1"
              onClick={() => storeDuration()}
            >
              Close
            </Button>
            )}
            {(createDurationInfo && createDurationInfo.data) && (
            <Button
              type="button"
              size="sm"
             variant="contained"
              className="mr-1"
              onClick={toggle}
            >
              Ok
            </Button>
            )}
          </ModalFooter>
          )}
        </>
      )}
    </>
  );
};

CloseWoNoModal.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  closeActionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  selectedActions: PropTypes.string.isRequired,
};
export default CloseWoNoModal;
