/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Label,
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Button,
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';

import workorderLogo from '@images/icons/workOrders.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDefaultNoValue,
  generateErrorMessage,
  getAllowedCompanies,
  extractValueObjects,
} from '../../../util/appUtils';
import { getWorkOrderStateLabel } from '../../utils/utils';
import {
  resetActionData, getActionData,
  resetCreateOrderDuration, createOrderDuration,
  orderStateChange, resetEscalate, getEmployeeMembers,
} from '../../workorderService';
import theme from '../../../util/materialTheme';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const AcceptWorkorder = (props) => {
  const {
    details, acceptModal, actionText, actionCode, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [employeeValue, setEmployeeValue] = useState('');
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [modal, setModal] = useState(acceptModal);
  const toggle = () => {
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    dispatch(resetEscalate());
    setModal(!modal);
    atFinish();
  };

  const {
    actionResultInfo, createDurationInfo, employeeMembers, stateChangeInfo,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { teamInfo } = useSelector((state) => state.setup);

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = (actionResultInfo && actionResultInfo.loading);
  const isError = actionResultInfo && actionResultInfo.err;

  const dataLoading = (stateChangeInfo && stateChangeInfo.loading) || (createDurationInfo && createDurationInfo.loading) || (details && details.loading) || (loading);
  const isData = details && (details.data && details.data.length > 0 && !details.loading && !loading && (createDurationInfo && !createDurationInfo.loading))
    && (stateChangeInfo && !stateChangeInfo.loading);
  const showForm = !isResult && (!dataLoading) && (!loading) && (createDurationInfo && !createDurationInfo.data && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);
  const showButton = !loading && (!dataLoading) && (createDurationInfo && !createDurationInfo.loading);
  const showMsg = isResult && (!dataLoading) && (!loading) && (createDurationInfo && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);

  useEffect(() => {
    dispatch(resetActionData());
  }, []);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  useEffect(() => {
    const viewId = detailData ? detailData.id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      // dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
  }, [userInfo, actionResultInfo]);

  // useEffect(() => {
  //   const id = detailData && detailData.maintenance_team_id ? extractValueObjects(detailData.maintenance_team_id) : '';
  //   const companyId = detailData && detailData.company_id ? extractValueObjects(detailData.company_id) : '';
  //   if (id && companyId) {
  //     dispatch(getTeamsInfo(companyId, appModels.TEAM, 1, 0, false, false, false, id, false));
  //   }
  // }, []);

  useEffect(() => {
    // const ids = teamInfo && teamInfo.data && teamInfo.data.length ? teamInfo.data[0].member_ids : [];
    const id = detailData && detailData.maintenance_team_id ? extractValueObjects(detailData.maintenance_team_id) : '';
    if (userInfo && userInfo.data && acceptModal && id) {
      const companyId = detailData && detailData.company_id ? extractValueObjects(detailData.company_id) : '';
      if (companyId) {
        dispatch(getEmployeeMembers(companyId, appModels.EMPLOYEEMEMBERS, employeeKeyword, false, false, false, 'custom', id));
      }
    }
  }, []);

  useEffect(() => {
    if (stateChangeInfo && stateChangeInfo.data) {
      if (createDurationInfo && createDurationInfo.data && createDurationInfo.length) {
        dispatch(getActionData(createDurationInfo.data[0], actionCode, appModels.ORDERASSIGN));
      }
    }
  }, [stateChangeInfo]);

  useEffect(() => {
    const viewId = detailData ? detailData.id : '';
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      const techData = {
        employee_id: employeeValue ? employeeValue.id : false,
        state: 'assigned',
        review_status: false,
        reviewed_by: false,
        reviewed_remark: '',
        reviewed_on: false,
      };
      dispatch(orderStateChange(viewId, techData, appModels.ORDER));
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
  };

  const onEmployeeKeyWordChange = (e) => {
    setEmployeeKeyword(e.target.value);
  };
  let employeeOptions = [];

  if (employeeMembers && employeeMembers.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeeMembers && employeeMembers.data) {
    // const mid = detailData && detailData.employee_id ? detailData.employee_id[0] : '';
    employeeOptions = employeeMembers.data;
    employeeOptions = [...new Map(employeeOptions.map((item) => [item.id, item])).values()];
  }

  return (
    <Dialog open={acceptModal}>
      <DialogHeader imagePath={checkCircleBlack} onClose={toggle} title={`${actionText} Workorder`} response={createDurationInfo} />
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
            {createDurationInfo && !createDurationInfo.data && (
            <>
              <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
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
            </>
            )}
            <Row className="justify-content-center">
              {createDurationInfo && createDurationInfo.data && (
                <SuccessAndErrorFormat response={createDurationInfo} successMessage="This workorder has been assigned successfully.." />
              )}
              {createDurationInfo && createDurationInfo.err && (
                <SuccessAndErrorFormat response={createDurationInfo} />
              )}
              {createDurationInfo && createDurationInfo.loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {(createDurationInfo && !createDurationInfo.data && !createDurationInfo.err) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={!employeeValue || createDurationInfo?.loading}
            onClick={() => storeReason()}
          >
            Assign
          </Button>
        )}
        {(createDurationInfo && (createDurationInfo.data || createDurationInfo.err)) && (
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

AcceptWorkorder.propTypes = {
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
};
export default AcceptWorkorder;
