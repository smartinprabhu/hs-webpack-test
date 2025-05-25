/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Label,
  Input,
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Box,
  Dialog, DialogActions, Typography, DialogContent, DialogContentText,
} from '@mui/material';
import { ThemeProvider } from '@material-ui/core/styles';
import ReactFileReader from 'react-file-reader';

import fileMiniIcon from '@images/icons/fileMini.svg';
import workorderLogo from '@images/icons/workOrders.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDefaultNoValue,
  decimalKeyPress,
  getDateTimeUtc,
  numToFloat,
  getDateDiffereceBetweenTwoDays,
  calculateTimeDifference,
  getLocalTimeSeconds,
} from '../../../util/appUtils';
import { getWorkOrderStateLabel } from '../../utils/utils';
import {
  resetActionData, getActionData,
  resetCreateOrderDuration, createOrderDuration,
  getOrderCheckLists, orderStateNoChange, resetEscalate,
  getOrderTimeSheets, getOperationCheckListData,
} from '../../workorderService';
import {
  resetDocumentCreate, onDocumentCreatesAttach,
} from '../../../helpdesk/ticketService';
import { bytesToSizeLow } from '../../../util/staticFunctions';
import DialogHeader from '../../../commonComponents/dialogHeader';
import theme from '../../../util/materialTheme';

const appModels = require('../../../util/appModels').default;

const CloseWorkorder = (props) => {
  const {
    details, closeActionModal, ppmData, ppmConfig, actionText, actionCode, atFinish, refresh,
  } = props;
  const dispatch = useDispatch();
  const [quantityValue, setQuantityValue] = useState(numToFloat(0));
  const [modal, setModal] = useState(closeActionModal);
  const toggle = () => {
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    dispatch(resetEscalate());
    setModal(!modal);
    atFinish();
  };

  const [rerportFile, setReportFile] = useState(false);
  const [reportFileName, setReportFileName] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileValue, setFileValue] = useState(false);
  const [timeLoading, setTimeLoading] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [remarkValue, setRemarkValue] = useState('');

  const {
    documentCreateAttach,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    dispatch(resetActionData());
    dispatch(resetDocumentCreate());
    dispatch(resetCreateOrderDuration());
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const {
    actionResultInfo, createDurationInfo, orderCheckLists, orderTimeSheets, checklistOpInfo,
    stateChangeInfo, workorderDetails, woUpdateLoading,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = actionResultInfo && actionResultInfo.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  const dataLoading = timeLoading || (loading) || (createDurationInfo && createDurationInfo.loading) || (orderCheckLists && orderCheckLists.loading) || (checklistOpInfo && checklistOpInfo.loading) || (stateChangeInfo && stateChangeInfo.loading) || woUpdateLoading || (documentCreateAttach && documentCreateAttach.loading);
  const isData = details && (details.data && details.data.length > 0 && !details.loading && !loading && (createDurationInfo && !createDurationInfo.loading))
    && (stateChangeInfo && !stateChangeInfo.loading);
  const showForm = !isResult && (!dataLoading) && (createDurationInfo && !createDurationInfo.data && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading) && (documentCreateAttach && !documentCreateAttach.data);
  const showButton = !loading && (createDurationInfo && !createDurationInfo.loading) && (orderCheckLists && !orderCheckLists.loading) && (checklistOpInfo && !checklistOpInfo.loading);
  const showMsg = isResult && (!loading) && (createDurationInfo && !createDurationInfo.loading) && (orderCheckLists && !orderCheckLists.loading) && (checklistOpInfo && !checklistOpInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);
  const workorder = workorderDetails && workorderDetails.data && workorderDetails.data[0];
  const isChecklist = workorder && workorder.check_list_ids && workorder.check_list_ids.length > 0;
  const isChecklistJson = (workorder && workorder.checklist_json_data !== '[]' && workorder.checklist_json_data !== '' && workorder.checklist_json_data !== false && workorder.checklist_json_data !== null);

  useEffect(() => {
    if (details && details.data) {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, []);

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
    if (details && details.data) {
      const startDate = details.data[0].date_start_execution;
      const endDate = details.data[0].date_execution;
      setQuantityValue(validateTime(getDateDiffereceBetweenTwoDays(startDate || details.data[0].date_start_scheduled, endDate || new Date())));
    }
  }, [details]);

  /* useEffect(() => {
    if (details && details.data && (stateChangeInfo && stateChangeInfo.data)) {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, [stateChangeInfo, details]); */

  useEffect(() => {
    const ids = details && details.data ? details.data[0].check_list_ids : [];
    if ((userInfo && userInfo.data) && ids) {
      dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
    }
  }, [userInfo]);

  useEffect(() => {
    if (!isChecklist && !isChecklistJson && workorder && workorder.task_id && workorder.task_id[0]) {
      const ids = workorder.task_id[0];
      dispatch(getOperationCheckListData(ids));
    }
  }, [details]);

  useEffect(() => {
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      dispatch(getActionData(createDurationInfo.data[0], actionCode, isOnHold ? appModels.PAUSEREASON : appModels.ORDERDURATION));
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
      tid = result && result.length ? result[result.length - 1].start_date : new Date();
    }
    return tid;
  }

  // useEffect(() => {
  //   const viewId = details && details.data ? details.data[0].id : '';
  //   if ((userInfo && userInfo.data) && viewId && isResult) {
  //     dispatch(getOrderDetail(viewId, appModels.ORDER));
  //   }
  // }, [userInfo, actionResultInfo]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const cheklistJsonObj = detailData && detailData.checklist_json_data ? JSON.parse(detailData.checklist_json_data) : [];

  const checklist = useMemo(() => {
    if (Array.isArray(cheklistJsonObj) && cheklistJsonObj.length > 0) {
      return cheklistJsonObj; // Priority given to checklistJsonObj
    }
    if (isChecklist && orderCheckLists?.data?.length > 0) {
      return orderCheckLists.data;
    }
    if (checklistOpInfo?.data?.length > 0) {
      return checklistOpInfo.data;
    }
    return [];
  }, [cheklistJsonObj, orderCheckLists, checklistOpInfo]);

  const isAllAnswered = useMemo(() => {
    // If no checklist data is available in any source, return true (no data expected)
    if (!checklist.length) {
      return !checklistOpInfo?.data?.length && !cheklistJsonObj?.length;
    }

    // If checklistJsonObj exists, prioritize it and check its content
    if (Array.isArray(cheklistJsonObj) && cheklistJsonObj.length > 0) {
      return cheklistJsonObj.every((obj) => (obj.answer_type !== 'suggestion' && obj.answer_common !== false)
        || (obj.answer_type === 'suggestion' && obj.value_suggested_ids?.length > 0));
    }

    // If checklistOpInfo exists but its length doesn't match cheklistJsonObj, return false
    if (checklistOpInfo?.data?.length > 0 && checklistOpInfo.data.length !== (cheklistJsonObj?.length || 0)) {
      return false;
    }

    // Default filter logic for checklist
    return checklist.every((obj) => (obj.answer_type !== 'suggestion' && obj.answer_common !== false)
      || (obj.answer_type === 'suggestion' && obj.value_suggested_ids?.length > 0));
  }, [checklist, checklistOpInfo, cheklistJsonObj]);

  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id;
  const userEmployeeName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name;
  const assignEmployeeId = detailData && detailData.employee_id.length && detailData.employee_id[0];

  const isNewEmployee = userEmployeeId && assignEmployeeId && (userEmployeeId !== assignEmployeeId);

  const storeDuration = () => {
    setIsOnHold(false);
    const postData = {
      actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
    };
    const viewId = details && details.data ? details.data[0].id : '';
    const payload = { model: appModels.ORDERDURATION, values: postData, context: { active_id: viewId, active_model: appModels.ORDER } };
    let timeData = {};
    if (checkTimesheet()) {
      const tvalue = checkTimesheet();
      timeData = {
        mro_timesheet_ids: [[1, tvalue, {
          reason: 'Closed',
          description: remarkValue.trim(),
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(checkTimesheetStartDate(), new Date())),
        }]],
        actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
        reason: remarkValue.trim(),
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
          description: remarkValue,
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(new Date(), new Date())),
        }]],
        actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
        reason: remarkValue,
      };
      if (isNewEmployee) {
        timeDataAdd.employee_id = userEmployeeId;
      }
      dispatch(orderStateNoChange(viewId, timeDataAdd, appModels.ORDER));
    }
    setTimeLoading(true);
    setTimeout(() => {
      setTimeLoading(false);
      dispatch(createOrderDuration(appModels.ORDERDURATION, payload));
    }, 1500);
  };

  useEffect(() => {
    if (documentCreateAttach && documentCreateAttach.data && documentCreateAttach.data.length && ppmData && ppmData.is_service_report_required) {
      storeDuration();
    }
  }, [documentCreateAttach]);

  const sendClose = () => {
    setIsOnHold(false);
    dispatch(onDocumentCreatesAttach(fileValue));
    document.getElementById('fileUpload').value = null;
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    const viewId = details && details.data ? details.data[0].id : '';
    const companyId = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id;
    setimgSize(false);
    setReportFile('');
    setReportFileName('');
    if (files !== undefined) {
      const { name } = files.fileList[0];
      const { size } = files.fileList[0];
      const formatsArray = ppmConfig && ppmConfig.service_report_file_formats && ppmConfig.service_report_file_formats.split(',').map((format) => format.trim());
      const regex = new RegExp(`\\.(${formatsArray.join('|')})$`, 'i');
      if (name && !name.match(regex)) {
        setimgValidation(true);
        setimgSize(false);
        setReportFile('');
        setReportFileName('');
        document.getElementById('fileUpload').value = null;
      } else if (size && !(bytesToSizeLow(size))) {
        setimgValidation(false);
        setimgSize(true);
        setReportFile('');
        setReportFileName('');
        document.getElementById('fileUpload').value = null;
      } else {
        setReportFile(files.base64);
        const remfile = `data:${files.fileList[0].type};base64,`;
        const photoname = files.fileList[0].name;
        setReportFileName(photoname);
        const fname = `${getLocalTimeSeconds(new Date())}-${ppmData && ppmData.name ? ppmData.name : ''}`.replace(/\s+/g, '');
        const filedata = files.base64.replace(remfile, '');

        const values = {
          datas: filedata, datas_fname: photoname, name: fname, company_id: companyId, res_model: appModels.ORDER, res_id: viewId,
        };
        setFileValue(values);
      }
    }
  };

  const putOnHold = () => {
    setIsOnHold(true);
    const postData = {
      reason: ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.name : '',
      pause_reason_id: ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.id : false,
    };
    const viewId = details && details.data ? details.data[0].id : '';
    const payload = { model: appModels.PAUSEREASON, values: postData, context: { active_id: viewId, active_model: appModels.ORDER } };
    let timeData = {};
    if (checkTimesheet()) {
      const tvalue = checkTimesheet();
      timeData = {
        mro_timesheet_ids: [[1, tvalue, {
          description: ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.name : '',
          reason: 'On-Hold',
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(checkTimesheetStartDate(), new Date())),
        }]],
        reason: ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.name : '',
      };
      dispatch(orderStateNoChange(viewId, timeData, appModels.ORDER));
    } else {
      const timeDataAdd = {
        mro_timesheet_ids: [[0, 0, {
          mro_order_id: viewId,
          start_date: getDateTimeUtc(new Date()),
          description: ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.name : '',
          reason: 'On-Hold',
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(new Date(), new Date())),
        }]],
        reason: ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.name : '',
      };
      dispatch(orderStateNoChange(viewId, timeDataAdd, appModels.ORDER));
    }
    setTimeLoading(true);
    setTimeout(() => {
      setTimeLoading(false);
      dispatch(createOrderDuration(appModels.PAUSEREASON, payload));
    }, 1500);
  };

  function getMsg() {
    let res = 'This workorder has been completed successfully.';
    if (isOnHold) {
      res = 'This workorder has been put into On-Hold successfully..';
    } else if (ppmData && ppmData.is_service_report_required) {
      res = 'TThe Service Report is uploaded and the PPM is Completed successfully';
    }
    return res;
  }

  const onInputChange = (e) => {
    setQuantityValue(e.target.value);
  };

  const onRemarksChange = (e) => {
    setRemarkValue(e.target.value);
  };

  const isDatas = (actionResultInfo && !actionResultInfo.data) && (createDurationInfo && !createDurationInfo.data) && (documentCreateAttach && !documentCreateAttach.data);

  return (
    <Dialog open={closeActionModal}>
      <DialogHeader isNoCloseButton={ppmData && ppmData.is_service_report_required} imagePath={closeCircle} onClose={toggle} title={`${actionText} Workorder`} response={actionResultInfo} />
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
              <>
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
                <Row className="ml-2 mr-2">
                  {showForm && (
                    <ThemeProvider theme={theme}>
                      {ppmData && ppmData.is_service_report_required && (
                        <>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <p className="text-center text-info">Please attach the service report to Complete this PPM</p>
                            {ppmConfig && ppmConfig.service_report_file_formats && (
                              <>
                                <p className="font-tiny text-center mb-0">
                                  (Allowed File formats are
                                  {' '}
                                  {' '}
                                  {ppmConfig && ppmConfig.service_report_file_formats ? ppmConfig.service_report_file_formats : ''}
                                  )
                                </p>
                                <p className="font-tiny text-center mb-0">(Upload file size less than 5 MB)</p>
                              </>
                            )}
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Label for="product_id">
                              Attachment
                              <span className="text-danger ml-1">*</span>
                            </Label>
                            <Box
                              sx={{
                                padding: '20px',
                                border: '1px dashed #868686',
                                width: '100%',
                                display: 'block',
                                alignItems: 'center',
                                borderRadius: '4px',
                              }}
                            >
                              <Box>
                                {ppmConfig && ppmConfig.service_report_file_formats && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <ReactFileReader
                                    elementId="fileUpload"
                                    handleFiles={handleFiles}
                                    fileTypes={ppmConfig && ppmConfig.service_report_file_formats && ppmConfig.service_report_file_formats.split(',').map((format) => `.${format.trim()}`)}
                                    base64
                                  >
                                    {rerportFile ? (
                                      <div className="text-center">
                                        <img
                                          src={fileMiniIcon}
                                          alt="file"
                                          aria-hidden="true"
                                          height="80"
                                          width="100"
                                          className="cursor-pointer"
                                        />
                                        <p className="mt-2">{reportFileName}</p>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="contained"
                                        component="label"
                                      >
                                        Upload
                                      </Button>
                                    )}
                                  </ReactFileReader>
                                </Box>
                                )}
                                <Box>
                                  <Typography
                                    sx={{
                                      font: 'normal normal normal 14px Suisse Intl',
                                      letterSpacing: '0.63px',
                                      color: '#000000',
                                      marginBottom: '10px',
                                      marginTop: '10px',
                                      marginLeft: '5px',
                                      justifyContent: 'center',
                                      display: 'flex',
                                    }}
                                  >
                                    {!rerportFile && (<span className="text-danger ml-1">Service Report required</span>)}
                                  </Typography>
                                  {!(ppmConfig && ppmConfig.service_report_file_formats) && (
                                  <Typography
                                    sx={{
                                      font: 'normal normal normal 14px Suisse Intl',
                                      letterSpacing: '0.63px',
                                      color: '#000000',
                                      marginBottom: '10px',
                                      marginTop: '10px',
                                      marginLeft: '5px',
                                      justifyContent: 'center',
                                      textAlign: 'center',
                                      display: 'flex',
                                    }}
                                  >
                                    <span className="mt-2 text-info">This requires additional configuration.Please contact your support</span>
                                  </Typography>
                                  )}
                                  {imgValidation && (
                                  <Typography
                                    sx={{
                                      font: 'normal normal normal 14px Suisse Intl',
                                      letterSpacing: '0.63px',
                                      color: '#000000',
                                      marginBottom: '10px',
                                      marginTop: '10px',
                                      marginLeft: '5px',
                                      justifyContent: 'center',
                                      display: 'flex',
                                    }}
                                  >
                                    <span className="text-danger ml-1">Upload Valid file.</span>
                                  </Typography>
                                  )}
                                  {imgSize && (
                                  <Typography
                                    sx={{
                                      font: 'normal normal normal 14px Suisse Intl',
                                      letterSpacing: '0.63px',
                                      color: '#000000',
                                      marginBottom: '10px',
                                      marginTop: '10px',
                                      marginLeft: '5px',
                                      justifyContent: 'center',
                                      display: 'flex',
                                    }}
                                  >
                                    <span className="text-danger ml-1">Upload file size less than 5 MB.</span>
                                  </Typography>
                                  )}
                                </Box>
                              </Box>
                            </Box>

                          </Col>
                        </>
                      )}
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Label for="actual_duration">
                          Actual Duration (Hours)
                          <span className="text-danger ml-1">*</span>
                        </Label>
                        <Input type="text" id="quantity" onKeyPress={decimalKeyPress} value={quantityValue} onChange={onInputChange} maxLength="7" className="" />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Label for="remarks">
                          Remarks
                          <span className="text-danger ml-1">*</span>
                        </Label>
                        <Input type="textarea" value={remarkValue} onChange={onRemarksChange} className="" />
                      </Col>
                    </ThemeProvider>
                  )}
                </Row>
              </>
            )}
            <Row className="justify-content-center">
              {isResult && (!dataLoading) && actionResultInfo && actionResultInfo.data && (
                <SuccessAndErrorFormat response={actionResultInfo} successMessage={getMsg()} />
              )}
              {isError && (
                <SuccessAndErrorFormat response={actionResultInfo} />
              )}
              {!isAllAnswered && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                  Checklists are not answered...
                </div>
              )}
              {!(isResult && actionResultInfo && actionResultInfo.data) && isNewEmployee && (
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
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {isDatas && ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.id && ppmData && ppmData.is_service_report_required && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn mr-2"
          disabled={dataLoading}
          onClick={() => putOnHold()}
        >
          Put On-Hold
        </Button>
        )}
        {isDatas && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={!quantityValue || quantityValue < 0 || !isAllAnswered || dataLoading || remarkValue.trim() === '' || (ppmData && ppmData.is_service_report_required && !rerportFile)}
            onClick={() => (ppmData && ppmData.is_service_report_required ? sendClose() : storeDuration())}
          >
            Complete
          </Button>
        )}
        {!dataLoading && (isResult || (isError || (createDurationInfo && createDurationInfo.err))) && (
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

CloseWorkorder.propTypes = {
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
  refresh: PropTypes.func.isRequired,
};
export default CloseWorkorder;
