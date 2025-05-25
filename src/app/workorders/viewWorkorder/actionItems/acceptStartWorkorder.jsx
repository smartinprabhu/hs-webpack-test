/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Label,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';

import workorderLogo from '@images/icons/workOrders.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDefaultNoValue,
  generateErrorMessage,
  getAllowedCompanies,
  extractValueObjects,
  getDateTimeUtc,
} from '../../../util/appUtils';
import { getWorkOrderStateLabel } from '../../utils/utils';
import {
  resetActionData, getActionData,
  resetCreateOrderDuration, createOrderDuration,
  orderStateChange, resetEscalate, getEmployeeMembers,
} from '../../workorderService';
import {
  getOrdersFullDetails,
} from '../../../helpdesk/ticketService';
import theme from '../../../util/materialTheme';

const appModels = require('../../../util/appModels').default;

const AcceptStartWorkorder = (props) => {
  const {
    details, acceptModal, actionText, actionCode, atFinish, selectedActions,
  } = props;
  const dispatch = useDispatch();
  const [employeeValue, setEmployeeValue] = useState('');
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [modal, setModal] = useState(acceptModal);
  const [dataCall, setDataCall] = useState(false);
  const [dataCall1, setDataCall1] = useState(false);
  const [dataValues, setDataValues] = useState(details);

  const toggle = () => {
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    dispatch(resetEscalate());
    setModal(!modal);
    atFinish();
  };

  const {
    actionResultInfo, orderTimeSheets, createDurationInfo, employeeMembers, stateChangeInfo,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { teamInfo } = useSelector((state) => state.setup);

  const { incidentsOrderInfo } = useSelector((state) => state.ticket);

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = actionResultInfo && actionResultInfo.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  const dataLoading = (loading) || (createDurationInfo && createDurationInfo.loading) || (stateChangeInfo && stateChangeInfo.loading);
  const isData = dataValues && (dataValues.data && dataValues.data.length > 0 && !dataValues.loading && !loading && (createDurationInfo && !createDurationInfo.loading))
  && (stateChangeInfo && !stateChangeInfo.loading);
  const showForm = !isResult && (!loading) && (createDurationInfo && !createDurationInfo.data && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);
  const showButton = !loading && (createDurationInfo && !createDurationInfo.loading);
  const showMsg = isResult && (!loading) && (createDurationInfo && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);

  useEffect(() => {
    dispatch(resetActionData());
  }, []);

  const detailData = dataValues && (dataValues.data && dataValues.data.length > 0) ? dataValues.data[0] : '';

  useEffect(() => {
    const viewId = detailData ? detailData.id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data) && dataCall) {
      dispatch(getActionData(viewId, 'action_start', appModels.ORDER));
      setDataCall1(true);
    }
  }, [stateChangeInfo, dataCall]);

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
    if (details.data) {
      setDataValues(details);
    }
  }, [details]);

  function checkTimesheet() {
    let tid = false;
    const data = orderTimeSheets && orderTimeSheets.data;
    if (data && data.length) {
      const result = data.filter((item) => (!item.end_date));
      tid = result && result.length ? result[result.length - 1].id : false;
    }
    return tid;
  }

  useEffect(() => {
    const viewId = detailData ? detailData.id : '';
    if ((userInfo && userInfo.data) && viewId && (isResult) && dataCall1) {
      setDataCall(false);
      setDataCall1(false);
      let timeData = { mro_timesheet_ids: [[0, 0, { mro_order_id: viewId, start_date: getDateTimeUtc(new Date()), reason: 'Start' }]] };
      if (checkTimesheet()) {
        const tvalue = checkTimesheet();
        timeData = {
          mro_timesheet_ids: [[1, tvalue, {
            start_date: getDateTimeUtc(new Date()),
          }]],
        };
        dispatch(orderStateChange(viewId, timeData, appModels.ORDER));
      }
      dispatch(orderStateChange(viewId, timeData, appModels.ORDER));
      dispatch(getOrdersFullDetails(companies, appModels.ORDER, [viewId]));
    }
  }, [actionResultInfo, dataCall1]);

  // useEffect(() => {
  //   const id = detailData && detailData.maintenance_team_id ? extractValueObjects(detailData.maintenance_team_id) : '';
  //   if ((userInfo && userInfo.data) && id) {
  //     dispatch(getTeamsInfo(companies, appModels.TEAM, 1, 0, undefined, undefined, id));
  //   }
  // }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const id = detailData && detailData.maintenance_team_id ? extractValueObjects(detailData.maintenance_team_id) : '';
      if (id) {
        dispatch(getEmployeeMembers(companies, appModels.EMPLOYEEMEMBERS, employeeKeyword, false, false, false, 'custom', id));
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      dispatch(getActionData(createDurationInfo.data[0], actionCode, appModels.ORDERASSIGN));
    }
  }, [createDurationInfo]);

  const storeReason = () => {
    const postData = {
      maintenance_team_id: detailData && detailData.maintenance_team_id ? extractValueObjects(detailData.maintenance_team_id) : false,
      order_id: detailData ? detailData.id : false,
      employee_id: employeeValue ? employeeValue.id : false,
    };
    const viewId = detailData ? detailData.id : '';
    const payload = { model: appModels.ORDERASSIGN, values: postData, context: { active_id: viewId, active_model: appModels.ORDER } };
    dispatch(createOrderDuration(appModels.ORDERASSIGN, payload));

    const techData = {
      employee_id: employeeValue ? employeeValue.id : false,
      state: 'assigned',
      review_status: false,
      reviewed_by: false,
      reviewed_remark: '',
      reviewed_on: false,
    };
    setDataCall(true);
    setTimeout(() => {
      dispatch(orderStateChange(viewId, techData, appModels.ORDER));
    }, 500);
  };

  const onEmployeeKeyWordChange = (e) => {
    setEmployeeKeyword(e.target.value);
  };

  let employeeOptions = [];

  if (employeeMembers && employeeMembers.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeeMembers && employeeMembers.data) {
    employeeOptions = employeeMembers.data;
    employeeOptions = [...new Map(employeeOptions.map((item) => [item.id, item])).values()];
  }

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={acceptModal}>
      <ModalHeaderComponent imagePath={checkCircleBlack} closeModalWindow={toggle} title={`${actionText} Workorder`} response={actionResultInfo} />
      <ModalBody>
        <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {isData && detailData && detailData.name && (
          <CardBody data-testid="success-case" className="bg-lightblue p-3">
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
          </CardBody>
          )}
        </Card>
        <Row className="ml-2 mr-2">
          {showForm && (
          <ThemeProvider theme={theme}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Label for="product_id">
                Technician
                <span className="text-danger ml-1">*</span>
              </Label>
              <Autocomplete
                name="employee_id"
                size="small"
                onChange={(_event, newValue) => {
                  setEmployeeValue(newValue);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={employeeOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onEmployeeKeyWordChange}
                    variant="outlined"
                    className="without-padding"
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {employeeMembers && employeeMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(employeeMembers && employeeMembers.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeeMembers)}</span></FormHelperText>)}
            </Col>
          </ThemeProvider>
          )}
        </Row>
        <Row className="justify-content-center">
          {showMsg && (
            <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage="This workorder has been assigned successfully.." />
          )}
          {isError && (
          <SuccessAndErrorFormat response={actionResultInfo} />
          )}
          {dataLoading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      {showButton && (
      <ModalFooter className="mr-3 ml-3">
        {(createDurationInfo && !createDurationInfo.data) && (
        <Button
          type="button"
         variant="contained"
          size="sm"
          disabled={!employeeValue}
          className="mr-1"
          onClick={() => storeReason()}
        >
          Assign
        </Button>
        )}
        {!dataLoading && (createDurationInfo && createDurationInfo.data) && (
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
    </Modal>
  );
};

AcceptStartWorkorder.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  acceptModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  selectedActions: PropTypes.string.isRequired,
};
export default AcceptStartWorkorder;
