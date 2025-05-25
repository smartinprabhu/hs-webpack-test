/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Box, Button,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDateDiffereceBetweenTwoDays, extractValueObjects,
} from '../../../util/appUtils';
import {
  getActionData, resetActionData,
} from '../../../workorders/workorderService';
import {
  getWorkPermitFilters,
} from '../../workPermitService';
import { createOrder } from '../../../pantryManagement/pantryService';
import validationSchema from './formModel/extendValidationSchema';
import scheduleFormModel from './formModel/extendFormModel';
import formInitialValues from './formModel/extendFormInitialValues';
import AdditionalForm from './forms/additionalForm';
import theme from '../../../util/materialTheme';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = scheduleFormModel;

const faIcons = {
  EXTEND: faTag,
};

const Action = (props) => {
  const {
    details, extendModal, actionText, actionButton, atFinish, atCancel, setViewModal,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(extendModal);
  const [extendRequest, setExtendRequest] = useState(false);

  const {
    addOrderInfo,
  } = useSelector((state) => state.pantry);
  const { actionResultInfo } = useSelector((state) => state.workorder);

  const editId = details && (details.data && details.data.length > 0) ? details.data[0].id : false;
  const plannedEnd = details && (details.data && details.data.length > 0) ? details.data[0].planned_end_time : false;
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const toggleCancel = () => {
    if (document.getElementById('extendForm')) {
      document.getElementById('extendForm').reset();
    }
    dispatch(resetActionData());
    setModal(!modal);
    atCancel();
  };

  useEffect(() => {
    dispatch(resetActionData());
    if (moment(new Date()).format('YYYY-MM-DD').valueOf() === moment(plannedEnd).format('YYYY-MM-DD').valueOf()) {
      formInitialValues.extension_type = 'Current Date';
      formInitialValues.planned_start_time = plannedEnd;
    } else if (moment(new Date()).format('YYYY-MM-DD').valueOf() < moment(plannedEnd).format('YYYY-MM-DD').valueOf()) {
      formInitialValues.extension_type = 'Future Date';
      formInitialValues.planned_start_time = '';
    } else if (moment(new Date()).format('YYYY-MM-DD').valueOf() > moment(plannedEnd).format('YYYY-MM-DD').valueOf()) {
      formInitialValues.extension_type = 'Future Date';
      formInitialValues.planned_start_time = '';
    }
  }, []);

  useEffect(() => {
    if (addOrderInfo && addOrderInfo.data && editId) {
      dispatch(getActionData(addOrderInfo.data[0], 'action_exten_copy', appModels.EXTENDPERMIT));
    }
  }, [addOrderInfo]);

  const handleSubmit = (values) => {
    const postData = { ...values };
    if (postData.date_valid) delete postData.date_valid;
    const typeValue = values.extension_type ? values.extension_type : false;

    postData.extension_type = typeValue;
    postData.type_of_request = extractValueObjects(values.type_of_request);
    postData.approval_authority_id = extractValueObjects(values.approval_authority_id);
    postData.user_id = extractValueObjects(values.user_id);
    postData.planned_start_time = values.planned_start_time ? moment.utc(values.planned_start_time).format('YYYY-MM-DD HH:mm:ss') : false;
    postData.planned_end_time = values.planned_end_time ? moment.utc(values.planned_end_time).format('YYYY-MM-DD HH:mm:ss') : false;
    postData.work_permit_id = editId;
    postData.duration = getDateDiffereceBetweenTwoDays(values.planned_start_time, values.planned_end_time);

    const payloads = { model: appModels.EXTENDPERMIT, values: postData };
    dispatch(createOrder(appModels.EXTENDPERMIT, payloads));
  };

  const loading = (addOrderInfo && addOrderInfo.loading);

  const onLoadRequest = (eid, ename) => {
    dispatch(resetActionData());
    atCancel();
    atFinish();
    setExtendRequest(eid);
    setModal(!modal);
    setViewModal(false);
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getWorkPermitFilters(customFilters));
    }
  };

  if (extendRequest) {
    return (<Redirect to="/workpermits" />);
  }

  return (


    <Dialog maxWidth="lg" open={extendModal}>
      <DialogHeader title={actionText} onClose={toggleCancel} response={actionResultInfo} fontAwesomeIcon={faIcons[actionText]} />
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
            <Row className="p-1">
              <Col md="12" sm="12" lg="12" xs="12">
                <Formik
                  initialValues={formInitialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    isValid, dirty, setFieldValue, setFieldTouched,
                  }) => (
                    <Form id={formId}>
                      <ThemeProvider theme={theme}>
                        {(addOrderInfo && !addOrderInfo.data) ? (
                          <AdditionalForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} details={details} />
                        ) : ''}
                        <Row className="justify-content-center">
                          {(addOrderInfo && addOrderInfo.err) && (
                            <SuccessAndErrorFormat response={addOrderInfo} />
                          )}
                          {loading && (
                            <div className="text-center mt-3">
                              <Loader />
                            </div>
                          )}
                          {(actionResultInfo && actionResultInfo.err) && (
                            <SuccessAndErrorFormat response={actionResultInfo} />
                          )}
                          {addOrderInfo && addOrderInfo.data && (
                            <div>
                              <SuccessAndErrorFormat
                                response={addOrderInfo}
                                successMessage="This work permit has been extended successfully"
                              />
                              {actionResultInfo?.data?.data && actionResultInfo?.data?.data?.length > 0 && actionResultInfo?.data?.data[0] && actionResultInfo?.data?.data[0]?.length > 0 && (
                                <p className="text-center mt-2 mb-0 tab_nav_link">
                                  Click here to view
                                  {' '}
                                  :
                                  <span
                                    aria-hidden="true"
                                    className="ml-2 cursor-pointer text-info"
                                    onClick={() => onLoadRequest(actionResultInfo.data.data[0][0], actionResultInfo.data.data[0][1])}
                                  >
                                    {actionResultInfo.data.data[0][1]}
                                  </span>
                                  {' '}
                                  details
                                </p>
                              )}
                            </div>
                          )}
                        </Row>

                        <hr />
                        {
                          (actionResultInfo && actionResultInfo.data) ? ''
                            : (
                              <div className="float-right">
                                <Button
                                  disabled={!(isValid && dirty)}
                                  type="submit"
                                  size="sm"
                                  variant='contained'
                                >
                                  {actionButton}
                                </Button>
                              </div>
                            )
                        }
                        {(actionResultInfo && actionResultInfo.data) && (
                          <div className="float-right">
                            <Button
                              type="button"
                              variant='contained'
                              size="sm"
                              onClick={toggle}
                            >
                              Ok
                            </Button>
                          </div>
                        )}
                      </ThemeProvider>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

Action.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  extendModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
  setViewModal: PropTypes.func.isRequired,
};

export default Action;
