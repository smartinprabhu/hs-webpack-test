/* eslint-disable no-promise-executor-return */
/* eslint-disable implicit-arrow-linebreak */
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
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Box, Dialog, DialogContent, DialogContentText, Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment-timezone';

import operationBlackActive from '@images/icons/operationsBlack.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import {
  getDefaultNoValue, extractNameObject, getDateTimeUtcMuI, trimJsonObject, decimalKeyPressDown,
} from '../../../util/appUtils';
import { updateProductCategory } from '../../../pantryManagement/pantryService';
import validationSchema from './formModel/validationSchema';
import scheduleFormModel from './formModel/formModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import PropertyAndValue from '../../../commonComponents/propertyAndValue';
import {
  tankerStateChange,
  resetTankerState,
} from '../../tankerService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = scheduleFormModel;

const faIcons = {
  'Tanker Out': faArrowCircleRight,
};

const Action = (props) => {
  const {
    details, actionModal, actionText, actionButton, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const { userInfo } = useSelector((state) => state.user);

  const [error, setError] = React.useState(false);

  const editId = details && (details.data && details.data.length > 0) ? details.data[0].id : false;
  const toggle = () => {
    setModal(!modal);
    atFinish();
    dispatch(resetTankerState());
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
    dispatch(resetTankerState());
  };

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'minDate': {
        return 'Please select a date and time later than the tanker in date and time.';
      }
      case 'minTime': {
        return 'Please select a date and time later than the tanker in date and time.';
      }

      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error]);

  const requestData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function handleSubmit(values) {
    const payload = {
      delivery_challan: values.delivery_challan,
      initial_reading: parseFloat(values.initial_reading),
      final_reading: parseFloat(values.final_reading),
      out_datetime: checkExDatehasObject(values.out_datetime),
      amount: parseFloat(values.amount),
      remark: values.remark,
    };

    try {
      // Set loading state to true
      // setLoading(true);

      const documents = ['reason', 'status'];

      documents.reduce((promise, doc) => promise.then(async () => {
        if (doc === 'reason') {
          await dispatch(updateProductCategory(editId, appModels.TANKERTRANSACTIONS, payload));
        } else if (doc === 'status') {
          await dispatch(tankerStateChange(editId, 'action_tanker_out', appModels.TANKERTRANSACTIONS, false));
        }
        // Add delay between dispatches
        await delay(2000); // 1000ms = 1 second
      }), Promise.resolve());
    } catch (err) {
      console.error('Error updating reason or changing state:', err);
    } finally {
      // Reset loading state
      // setLoading(false);
    }
  }

  const loading = (details && details.loading) || (updateProductCategoryInfo && updateProductCategoryInfo.loading);

  const onChangeOutTime = (date, setFieldValue) => {
    setFieldValue('out_datetime', date);
  };

  return (
    <Dialog maxWidth="md" open={modal}>
      <DialogHeader title={actionText} fontAwesomeIcon={faArrowCircleRight} onClose={toggleCancel} response={updateProductCategoryInfo} />
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
            <Card className="rounded-0 border-0">
              {details && (details.data && details.data.length > 0) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="1" className="mr-4">
                      <img src={operationBlackActive} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="9" className="ml-2">

                      <PropertyAndValue
                        data={{
                          property: 'Vendor',
                          value: getDefaultNoValue(extractNameObject(requestData.vendor_id, 'name')),
                        }}
                      />
                      <PropertyAndValue
                        data={{
                          property: 'Commodity',
                          value: getDefaultNoValue(extractNameObject(requestData.commodity, 'name')),
                        }}
                      />
                      <PropertyAndValue
                        data={{
                          property: 'Block',
                          value: getDefaultNoValue(extractNameObject(requestData.location_id, 'path_name')),
                        }}
                      />
                      <PropertyAndValue
                        data={{
                          property: 'Tanker Number',
                          value: getDefaultNoValue(extractNameObject(requestData.tanker_id, 'name')),
                        }}
                      />
                      <PropertyAndValue
                        data={{
                          property: 'Capacity',
                          value: getDefaultNoValue(requestData.capacity),
                        }}
                      />
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            <>
              <Row className="p-1">
                <Col md="12" sm="12" lg="12" xs="12">
                  {loading && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                  )}
                  {(updateProductCategoryInfo && !loading) && (
                    <Formik
                      initialValues={requestData ? trimJsonObject(requestData) : formInitialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        isValid, dirty, values, setFieldValue, setFieldTouched,
                      }) => (
                        <Form id={formId}>
                          <ThemeProvider theme={theme}>
                            <Row className="p-1">
                              {(updateProductCategoryInfo && updateProductCategoryInfo.data) ? '' : (
                                <>
                                  <Col md="6" sm="6" lg="6" xs="12">
                                    <Col xs={12} sm={12} lg={12} md={12}>
                                      <MuiTextField
                                        sx={{
                                          marginBottom: '20px',
                                        }}
                                        inputProps={{
                                          maxLength: 10,
                                        }}
                                        type="text"
                                        name={formField.initialReading.name}
                                        label={formField.initialReading.label}
                                        isRequired
                                        setFieldValue={setFieldValue}
                                        maxLength="6"
                                        onKeyDown={decimalKeyPressDown}
                                        disabled
                                      />
                                    </Col>
                                  </Col>
                                  <Col md="6" sm="6" lg="6" xs="12">
                                    <Col xs={12} sm={12} lg={12} md={12}>

                                      <MuiTextField
                                        sx={{
                                          marginBottom: '20px',
                                        }}
                                        inputProps={{
                                          maxLength: 10,
                                        }}
                                        type="text"
                                        name={formField.finalReading.name}
                                        label={formField.finalReading.label}
                                        isRequired
                                        setFieldValue={setFieldValue}
                                        onKeyDown={decimalKeyPressDown}
                                        maxLength="15"
                                      />

                                    </Col>
                                  </Col>
                                  <Col md="6" sm="6" lg="6" xs="12">
                                    <Col xs={12} sm={12} lg={12} md={12}>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                          <DateTimePicker
                                            sx={{ width: '95%', marginBottom: '20px' }}
                                            slotProps={{ textField: { variant: 'standard',required:true } }}
                                            name={formField.inDate.name}
                                            label={`${formField.inDate.label}`}
                                            value={dayjs(moment.utc(values.in_datetime).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'))}
                                            ampm={false}
                                            disabled
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </Col>
                                  </Col>
                                  <Col md="6" sm="6" lg="6" xs="12">
                                    <Col xs={12} sm={12} lg={12} md={12}>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                          <DateTimePicker
                                            sx={{ width: '95%', marginBottom: '20px' }}
                                            name={formField.outDate.name}
                                            label={`${formField.outDate.label}`}
                                            localeText={{ todayButtonLabel: 'Now', required: true }}
                                            onError={(newError) => setError(newError)}
                                            slotProps={{
                                              actionBar: {
                                                actions: ['today', 'clear'],
                                              },
                                              textField: { variant: 'standard', helperText: errorMessage },
                                            }}
                                            minDateTime={dayjs(moment.utc(values.in_datetime).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'))}
                                            ampm={false}
                                            onChange={(e) => onChangeOutTime(e, setFieldValue)}
                                            defaultValue={moment(values.out_datetime)}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </Col>
                                  </Col>
                                  <Col md="6" sm="6" lg="6" xs="12">
                                    <Col xs={12} sm={12} lg={12} md={12}>
                                      <MuiTextField
                                        sx={{
                                          marginBottom: '20px',
                                        }}
                                        inputProps={{
                                          maxLength: 10,
                                        }}
                                        name={formField.deliveryChallan.name}
                                        label={formField.deliveryChallan.label}
                                        autoComplete="off"
                                        type="text"
                                        formGroupClassName="m-1"
                                        maxLength="15"
                                      />
                                    </Col>
                                  </Col>
                                  {requestData.is_enable_amount && (
                                    <Col md="6" sm="6" lg="6" xs="12">
                                      <Col xs={12} sm={12} lg={12} md={12}>
                                        <MuiTextField
                                          sx={{
                                            marginBottom: '20px',
                                          }}
                                          inputProps={{
                                            maxLength: 7,
                                          }}
                                          name={formField.amountVal.name}
                                          label={formField.amountVal.label}
                                          autoComplete="off"
                                          type="text"
                                          formGroupClassName="m-1"
                                          maxLength="10"
                                          onKeyDown={decimalKeyPressDown}
                                        />
                                      </Col>
                                    </Col>
                                  )}
                                  <Col md="6" sm="6" lg="6" xs="12">
                                    <Col xs={12} sm={12} lg={12} md={12}>
                                      <MuiTextField
                                        sx={{
                                          marginBottom: '20px',
                                        }}
                                        name={formField.remark.name}
                                        label={formField.remark.label}
                                        formGroupClassName="m-1"
                                        multiline
                                        rows="1"
                                      />
                                    </Col>
                                  </Col>
                                </>
                              )}

                            </Row>
                            <Row className="justify-content-center">
                              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                              <SuccessAndErrorFormat response={updateProductCategoryInfo} />
                              )}
                              {updateProductCategoryInfo && updateProductCategoryInfo.data && !loading && (
                                <SuccessAndErrorFormat
                                  response={updateProductCategoryInfo}
                                  successMessage={` ${extractNameObject(requestData.tanker_id, 'name')}  ${extractNameObject(requestData.commodity, 'name')} tanker went out.`}
                                />
                              )}
                            </Row>
                            <hr />
                            {(updateProductCategoryInfo && updateProductCategoryInfo.data) ? ''
                              : (
                                <div className="float-right mr-4">
                                  <Button
                                    disabled={error || !(isValid && dirty)}
                                    type="submit"
                                    variant="contained"
                                    className="submit-btn"
                                  >
                                    {actionButton}
                                  </Button>
                                </div>
                              )}
                            {(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
                              <div className="float-right mr-4">
                                <Button
                                  type="button"
                                  variant="contained"
                                  className="submit-btn"
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
                  )}
                </Col>
              </Row>
            </>
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
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default Action;
