/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Label,
  Col,
  Row,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import ReactFileReader from 'react-file-reader';

import workorderLogo from '@images/icons/workOrders.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getOrderDetail,
  getOrderTimeSheets,
  resetCreateOrderDuration, createOrderDuration,
  resetActionData, getActionData,
  orderStateNoChange,
} from '../workorderService';
import {
  getDefaultNoValue,
  calculateTimeDifference,
  getLocalTimeSeconds,
  getDateTimeUtc,
  getDateDiffereceBetweenTwoDays,
} from '../../util/appUtils';
import {
  resetDocumentCreate, onDocumentCreatesAttach,
} from '../../helpdesk/ticketService';
import { bytesToSizeLow } from '../../util/staticFunctions';
import theme from '../../util/materialTheme';

const appModels = require('../../util/appModels').default;

const UploadServiceReport = React.memo((props) => {
  const {
    details, ppmData, ppmConfig, serviceModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(serviceModal);
  const [rerportFile, setReportFile] = useState(false);
  const [reportFileName, setReportFileName] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [quantityValue, setQuantityValue] = useState(0);
  const [imgSize, setimgSize] = useState(false);
  const [fileValue, setFileValue] = useState(false);
  const [timeLoading, setTimeLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    documentCreateAttach,
  } = useSelector((state) => state.ticket);

  const {
    actionResultInfo, createDurationInfo, orderTimeSheets,
    stateChangeInfo, woUpdateLoading,
  } = useSelector((state) => state.workorder);

  useEffect(() => {
    dispatch(resetDocumentCreate());
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
  }, []);

  useEffect(() => {
    if (details && details.data) {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, []);

  useEffect(() => {
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      dispatch(getActionData(createDurationInfo.data[0], 'do_record', appModels.ORDERDURATION));
    }
  }, [createDurationInfo]);

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

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const toggle = () => {
    const viewId = details && details.data ? details.data[0].id : '';
    if (viewId && documentCreateAttach && documentCreateAttach.data) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
    dispatch(resetDocumentCreate());
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    setModal(!model);
    atFinish();
  };

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

  const storeDuration = () => {
    dispatch(resetActionData());
    dispatch(resetCreateOrderDuration());
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
          description: 'Done',
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(checkTimesheetStartDate(), new Date())),
        }]],
        actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
      };
      dispatch(orderStateNoChange(viewId, timeData, appModels.ORDER));
    } else {
      const timeDataAdd = {
        mro_timesheet_ids: [[0, 0, {
          mro_order_id: viewId,
          start_date: getDateTimeUtc(new Date()),
          reason: 'Closed',
          description: 'Done',
          end_date: getDateTimeUtc(new Date()),
          total_hours: parseFloat(calculateTimeDifference(new Date(), new Date())),
        }]],
        actual_duration: quantityValue ? parseFloat(quantityValue) : 0.00,
      };
      dispatch(orderStateNoChange(viewId, timeDataAdd, appModels.ORDER));
    }
    setTimeLoading(true);
    setTimeout(() => {
      setTimeLoading(false);
      dispatch(createOrderDuration(appModels.ORDERDURATION, payload));
    }, 1500);
  };

  useEffect(() => {
    if (documentCreateAttach && documentCreateAttach.data && documentCreateAttach.data.length) {
      storeDuration();
    }
  }, [documentCreateAttach]);

  const sendClose = () => {
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

  const loading = timeLoading || woUpdateLoading || (documentCreateAttach && documentCreateAttach.loading) || (createDurationInfo && createDurationInfo.loading) || (actionResultInfo && actionResultInfo.loading);

  const isData = (actionResultInfo && !actionResultInfo.data) && (createDurationInfo && !createDurationInfo.data) && (documentCreateAttach && !documentCreateAttach.data);

  return (
    <Dialog maxWidth="md" open={model}>
      <DialogHeader title="Upload Service Report" onClose={toggle} response={actionResultInfo} imagePath={workorderLogo} />
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
                {isData && (
                <Row className="mt-2">
                  <ThemeProvider theme={theme}>
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
                  </ThemeProvider>
                </Row>
                )}
              </Col>
            </Row>
            {loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(documentCreateAttach && documentCreateAttach.err) && (
            <SuccessAndErrorFormat response={documentCreateAttach} />
            )}
            {(actionResultInfo && actionResultInfo.err) && (
            <SuccessAndErrorFormat response={actionResultInfo} />
            )}
            {actionResultInfo && actionResultInfo.data && !loading && (
            <SuccessAndErrorFormat response={actionResultInfo} successMessage="The Service Report is uploaded and the PPM is Completed successfully." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isData && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          disabled={(actionResultInfo && actionResultInfo.data) || loading || !rerportFile}
          onClick={() => sendClose()}
        >
          Complete

        </Button>
        )}
        {(actionResultInfo && actionResultInfo.data) && (
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

UploadServiceReport.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  serviceModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default UploadServiceReport;
