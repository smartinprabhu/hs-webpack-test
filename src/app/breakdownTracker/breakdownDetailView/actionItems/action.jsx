/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Box,
  FormControl,
  Typography,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import DOMPurify from 'dompurify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  Card,
  CardBody,
  Col, Input,
  Label,
  Row,
} from 'reactstrap';
// import survey from '@images/icons/surveyAction.svg';
import { faCheckCircle, faStoreAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import trackerIcon from '@images/icons/breakTrackerBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  updatePartsOrder,
} from '../../../workorders/workorderService';
import { onDocumentCreatesAttach, resetImage } from '../../../helpdesk/ticketService';
import {
  getAttachmentCategoryList, resetImageService, resetImageRAC,
  setComplianceReinitiate,
} from '../../breakdownService';
import {
  getCompanyTimezoneDate, getDateTimeUtcMuI, getDefaultNoValue, extractNameObject, getDateTimeUtc,
  isValidValue, getAllowedCompanies,
  getColumnArrayById,
  getDateLocalMuI,
} from '../../../util/appUtils';
import Images from './images';
import RcaImages from './rcaimages';
import ServiceImages from './serviceImages';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { getAssetPPMSchdules, getParentSchdules } from '../../../inspectionSchedule/inspectionService';
import RelatedPPMSchedules from '../../../inspectionSchedule/viewer/relatedPPMSchedules';
import InspectionCancelAllocation from './inspectionCancelAllocation';

dayjs.extend(isoWeek);

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const faIcons = {
  Draft: faStoreAlt,
  Published: faCheckCircle,
  Close: faTimesCircle,
};

const ActionSurvey = (props) => {
  const {
    details, actionModal, actionId, actionValue, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [remarksTicket, setRemarksTicket] = useState('');
  const [closedOnDate, setClosedOnDate] = useState(null);
  const [viewData, setViewData] = useState(false);
  const [error, setError] = React.useState(false);

  const [checkedPPMRows, setCheckPPMRows] = useState([]);
  const [ppmSchedules, setPPMSchedules] = useState([]);

  const [showRelatedSchedules, setShowRelatedSchedules] = useState(false);
  const [showRelatedPPMSchedules, setShowRelatedPPMSchedules] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [typeSelected, setType] = React.useState('all');

  const [targetEndDate, setTargetEndDate] = useState(false);
  const [targetStartDate, setTargetStartDate] = useState(false);

  const { ppmAssetsSchedules, inspectionParentsInfo } = useSelector((state) => state.inspection);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'maxDate': {
        return 'Please select a date and time earlier than the current date and time.';
      }
      case 'minDate': {
        return 'Please select a date and time later than the incident date and time.';
      }
      case 'minTime': {
        return 'Please select a date and time later than the incident date and time.';
      }
      case 'maxTime': {
        return 'Please select a date and time earlier than the current date and time.';
      }

      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error]);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);
  const {
    uploadPhotoService, uploadPhotoRca, btConfigInfo,
    btReinitiateInfo,
  } = useSelector((state) => state.breakdowntracker);
  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);
  // const viewData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;

  const isCancelPPM = configData && ((configData.is_cancel_ppm && extractNameObject(viewData.equipment_id, 'name')) || (configData.is_cancel_ppm_space && extractNameObject(viewData.space_id, 'id')));
  const isCancelInsp = configData && ((configData.is_cancel_inspection && extractNameObject(viewData.equipment_id, 'name')) || (configData.is_cancel_inspection_space && extractNameObject(viewData.space_id, 'id')));

  const isReinititae = actionValue === 'Closed' && new Date() <= new Date(viewData.expexted_closure_date) && configData && ((isCancelPPM && checkedPPMRows && checkedPPMRows.length > 0) || (isCancelInsp && endDate && targetEndDate && targetStartDate));

  const onRemarksChange = (e) => {
    setRemarksTicket(e.target?.value?.trimStart() || '');
  };

  useEffect(() => {
    setViewData(details && (details.data && details.data.length > 0) ? details.data[0] : '');
  }, []);

  useEffect(() => {
    if (viewData) {
      setClosedOnDate(dayjs(moment(new Date()).tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')));
    }
  }, [viewData]);

  useEffect(() => {
    if (isReinititae && updatePartsOrderInfo && updatePartsOrderInfo.data && viewData && viewData.id) {
      const args = configData && isCancelPPM && checkedPPMRows && checkedPPMRows.length > 0 ? [JSON.stringify(getColumnArrayById(checkedPPMRows, 'id'))] : '[]';
      const newToDate = configData && isCancelInsp && targetEndDate && targetStartDate && endDate ? getDateLocalMuI(dayjs(endDate).subtract(1, 'day')) : '';
      dispatch(setComplianceReinitiate(viewData.id, 'reinstate_hx_inspection_and_ppm', appModels.BREAKDOWNTRACKER, args, newToDate));
    }
  }, [updatePartsOrderInfo]);

  useEffect(() => {
    if (actionValue === 'Closed') {
      dispatch(resetImage());
      dispatch(resetImageService());
      dispatch(resetImageRAC());
      dispatch(getAttachmentCategoryList(false, appModels.ATTTACHMENTCATEG));
    }
  }, [actionValue]);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (actionValue === 'Closed' && viewData && viewData.id && configData && isCancelPPM) {
      dispatch(getAssetPPMSchdules(companies, 'ppm.scheduler_cancel', false, false, false, false, false, viewData.id, appModels.BREAKDOWNTRACKER));
    }
    if (actionValue === 'Closed' && viewData && viewData.id && configData && isCancelInsp) {
      dispatch(getParentSchdules(companies, 'hx.inspection_cancel', false, false, false, viewData.id, appModels.BREAKDOWNTRACKER));
    }
  }, [viewData]);

  useEffect(() => {
    if (actionValue === 'Closed' && ppmAssetsSchedules && ppmAssetsSchedules.data && ppmAssetsSchedules.data.length) {
      // setCheckPPMRows(ppmAssetsSchedules.data);
      const scheduleData = ppmAssetsSchedules.data[0].ppm_scheduler_ids && ppmAssetsSchedules.data[0].ppm_scheduler_ids.length > 0 ? ppmAssetsSchedules.data[0].ppm_scheduler_ids : [];
      let futureSchedules = [];
      if (scheduleData && scheduleData.length) {
        const startWeek = dayjs().startOf('isoWeek').format('YYYY-MM-DD');
        console.log(startWeek);
        futureSchedules = scheduleData.filter((item) => dayjs(item.starts_on).isSame(startWeek) || dayjs(item.starts_on).isAfter(startWeek));
      }
      setPPMSchedules(futureSchedules);
    } else {
      // setCheckPPMRows([]);
      setPPMSchedules([]);
    }
  }, [ppmAssetsSchedules]);

  useEffect(() => {
    if (actionValue === 'Closed' && inspectionParentsInfo && inspectionParentsInfo.data && inspectionParentsInfo.data.length) {
      const dates = inspectionParentsInfo.data[0].date_range_ids && inspectionParentsInfo.data[0].date_range_ids.length > 0 ? inspectionParentsInfo.data[0].date_range_ids : [];
      if (dates && dates.length > 0) {
        setTargetStartDate(dates[0].from_date);
        setTargetEndDate(dates[0].to_date);
      }
    } else {
      setTargetStartDate(false);
      setTargetEndDate(false);
    }
  }, [inspectionParentsInfo]);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const onDateChange = (e) => {
    setError(false);
    setClosedOnDate(e);
  };

  function prepareDocuments(array, id) {
    const result = [];
    for (let i = 0; i < array.length; i += 1) {
      const values = {
        datas: array[i].datas,
        database64: array[i].database64,
        datas_fname: array[i].datas_fname,
        name: array[i].name,
        company_id: array[i].company_id,
        res_model: array[i].res_model,
        res_id: id,
        mimetype: array[i].type,
      };
      if (array[i].ir_attachment_categ) {
        values.ir_attachment_categ = array[i].ir_attachment_categ;
      }
      result.push(values);
    }
    return result; // return column data..
  }

  const handleDocuments = async (documents) => {
    if (documents && documents.length) {
      // Dispatch documents sequentially
      documents.reduce(async (promise, doc) => {
        await promise;
        return dispatch(onDocumentCreatesAttach(doc));
      }, Promise.resolve());
      dispatch(resetImage());
    }
  };

  function updateDocuments(id) {
    if (((uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0)
      || (uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0) || (uploadPhotoRca && uploadPhotoRca.length && uploadPhotoRca.length > 0)) && id) {
      const uploadPhoto1 = uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 ? uploadPhoto : [];
      const uploadPhoto2 = uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0 ? uploadPhotoService : [];
      const uploadPhoto3 = uploadPhotoRca && uploadPhotoRca.length && uploadPhotoRca.length > 0 ? uploadPhotoRca : [];
      const newArr = [...uploadPhoto1, ...uploadPhoto2];
      const newArrFinal = [...uploadPhoto3, ...newArr];
      const dcreate = prepareDocuments(newArrFinal, id);
      handleDocuments(dcreate);
    }
  }

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtc(data);
    }
    return result;
  }

  const handleStateChange = (id, status) => {
    if ((uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0)
      || (uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0) || (uploadPhotoRca && uploadPhotoRca.length && uploadPhotoRca.length > 0)) {
      updateDocuments(id);
      dispatch(resetImage());
      dispatch(resetImageService());
      dispatch(resetImageRAC());
    }
    let values = { state_id: status };
    if (messageTicket && messageTicket !== '') {
      let closedDate = closedOnDate || false;
      if (checkDatehasObject(closedDate)) {
        closedDate = getDateTimeUtcMuI(closedDate);
      }
      values = {
        action_taken: DOMPurify.sanitize(messageTicket),
        closed_on: closedDate,
        state_id: status,
      };
    }
    if (remarksTicket && remarksTicket !== '') {
      values = {
        remarks: DOMPurify.sanitize(remarksTicket),
        state_id: status,
      };
    }
    dispatch(updatePartsOrder(id, values, appModels.BREAKDOWNTRACKER));
  };

  let loading = (details && details.loading) || (updatePartsOrderInfo && updatePartsOrderInfo.loading);
  let isSuccess = updatePartsOrderInfo && updatePartsOrderInfo.data;
  let isErr = updatePartsOrderInfo && updatePartsOrderInfo.err;

  if (isReinititae) {
    loading = (details && details.loading) || (updatePartsOrderInfo && updatePartsOrderInfo.loading) || (btReinitiateInfo && btReinitiateInfo.loading);
    isSuccess = !loading && (updatePartsOrderInfo && updatePartsOrderInfo.data && btReinitiateInfo && btReinitiateInfo.data);
    isErr = (updatePartsOrderInfo && updatePartsOrderInfo.err) || (btReinitiateInfo && btReinitiateInfo.err);
  }

  const closedStateCondition = (!closedOnDate || !isValidValue(messageTicket) || (uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length <= 0) || (Object.keys(uploadPhotoService).length === 0));

  return (
    <Dialog maxWidth={actionValue === 'Closed' ? 'lg' : 'md'} open={actionModal}>
      <DialogHeader title={actionValue === 'Closed' ? 'Close' : actionValue} onClose={toggle} response={updatePartsOrderInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              <CardBody data-testid="success-case" className="bg-lightblue p-3" style={{ backgroundColor: '#F6F8FA' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <img src={trackerIcon} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                      {getDefaultNoValue(viewData.name)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="font-family-tab">
                      <span className="font-weight-800 font-family-tab font-side-heading mr-1">Type: </span>
                      {getDefaultNoValue(viewData.type)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="font-family-tab">
                      <span className="font-weight-800 font-family-tab font-side-heading mr-1">Priority: </span>
                      {getDefaultNoValue(viewData.priority)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="font-family-tab">
                      <span className="font-weight-800 font-family-tab font-side-heading mr-1">Incident On: </span>
                      {getDefaultNoValue(getCompanyTimezoneDate(viewData.incident_date, userInfo, 'datetime'))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="font-family-tab">
                      <span className="font-weight-800 font-family-tab font-side-heading mr-1">
                        {viewData.type === 'Space' ? 'Space' : 'Equipment'}
                        :
                        {' '}
                      </span>
                      {getDefaultNoValue(viewData.type === 'Space'
                        ? extractNameObject(viewData.space_id, 'path_name') : extractNameObject(viewData.equipment_id, 'name'))}
                    </Typography>
                  </Box>
                </Box>
              </CardBody>
            </Card>
            {actionValue === 'On Hold' && (
            <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
              <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                Remarks
                {' '}
                <span className="ml-1 text-danger font-weight-800"> * </span>
              </Label>
              <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={remarksTicket} onChange={onRemarksChange} className="bg-whitered" rows="2" />
            </Col>
            )}
            {(!isSuccess) && (
              actionValue === 'Closed' && (
                <Row className="m-2">
                  <Col xs={12} sm={10} md={6} lg={6}>
                    <FormControl
                      sx={{
                        marginTop: 'auto',
                        marginBottom: '20px',
                      }}
                      variant="standard"
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                          <DateTimePicker
                            minDateTime={viewData.incident_date ? dayjs(moment.utc(viewData.incident_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment(new Date()).tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'))}
                            maxDateTime={dayjs(moment(new Date()).tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'))}
                            sx={{ width: '95%' }}
                            localeText={{ todayButtonLabel: 'Now' }}
                            onError={(newError) => setError(newError)}
                            slotProps={{
                              textField: {
                                helperText: errorMessage,
                              },
                            }}
                            slotProps={{
                              actionBar: {
                                actions: ['today', 'clear', 'accept'],
                              },
                              textField: { variant: 'standard' },
                            }}
                            name="closed_on"
                            label="Closed On *"
                            value={closedOnDate}
                            onChange={onDateChange}
                            ampm={false}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <span className="ml-1 text-danger">{errorMessage}</span>
                    </FormControl>
                    <Label className="mt-3">
                      Action Taken
                      {' '}
                      <span className="ml-1 text-danger">*</span>
                    </Label>
                    <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                    {!isValidValue(messageTicket) && (<span className="text-danger ml-1">Action taken required</span>)}
                  </Col>

                  <Col xs={12} sm={12} md={6} lg={6}>
                    <ServiceImages editId={viewData.id} />
                    <RcaImages editId={viewData.id} />
                    <Images editId={viewData.id} />
                  </Col>
                </Row>
              )
            )}
            <Row className="justify-content-center">
              {isSuccess && (
                <SuccessAndErrorFormat response={updatePartsOrderInfo} successMessage={`This breakdown tracker has been ${actionValue} successfully..`} />
              )}
              {isErr && (
              <SuccessAndErrorFormat response={updatePartsOrderInfo.err || btReinitiateInfo.err} />
              )}
              {loading && (
              <CardBody className="mt-4" data-testid="loading-case">
                <Loader />
              </CardBody>
              )}
            </Row>
          </Box>
          <Dialog size="lg" fullWidth open={showRelatedPPMSchedules}>
            <DialogHeader title="View Related PPM Schedules of the Asset" onClose={() => { setShowRelatedPPMSchedules(false); }} />
            <RelatedPPMSchedules
              selectedSchedules={checkedPPMRows && checkedPPMRows.length > 0 ? checkedPPMRows : []}
              typeSelected={typeSelected}
              setEvents={setCheckPPMRows}
              events={ppmSchedules && ppmSchedules.length > 0 ? ppmSchedules : []}
              onClose={() => { setShowRelatedPPMSchedules(false); }}
              isCustomMsg
              isTopMsg
              topMsg="You may select the schedules to resume."
              bottomMsg="selected to be resume."
            />
          </Dialog>
          {showRelatedSchedules && (
            <InspectionCancelAllocation
              actionModal={showRelatedSchedules}
              atCancel={() => setShowRelatedSchedules(false)}
              startDate={targetStartDate}
              endDate={endDate || targetEndDate}
              setEndDate={setEndDate}
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {actionValue === 'Closed' && !isSuccess && !loading && new Date() <= new Date(viewData.expexted_closure_date) && (viewData.expexted_closure_date || extractNameObject(viewData.equipment_id, 'name')) && configData && ((configData.change_status_on_assets && extractNameObject(viewData.equipment_id, 'name')) || ((extractNameObject(viewData.equipment_id, 'name') || extractNameObject(viewData.space_id, 'id')) && viewData.expexted_closure_date && (isCancelPPM || isCancelInsp))) && (
        <div className="alert-container">
          <Alert severity="error">

            <p className="font-family-tab mb-0">
              {configData.change_status_on_assets && extractNameObject(viewData.equipment_id, 'name') && (
              <>
                {extractNameObject(viewData.equipment_id, 'name')}
                {' '}
                will be moved to Operative state
              </>
              )}
              {viewData.expexted_closure_date && ((isCancelPPM && ppmSchedules && ppmSchedules.length) || (isCancelInsp && targetEndDate && targetStartDate)) && (
              <>
                {configData.change_status_on_assets && extractNameObject(viewData.equipment_id, 'name') ? ',' : ''}
                {' '}
                To resume the
                {' '}
                {isCancelPPM && ppmSchedules && ppmSchedules.length ? (
                  <span
                    onClick={() => setShowRelatedPPMSchedules(!!(ppmSchedules && ppmSchedules.length > 0))}
                    className={ppmSchedules && ppmSchedules.length > 0 ? 'cursor-pointer text-decoration-underline font-weight-800' : ''}
                  >
                    PPMs
                  </span>
                )
                  : ''}
                {' '}
                {isCancelPPM && ppmSchedules && ppmSchedules.length && isCancelInsp && targetEndDate && targetStartDate ? 'and' : ''}
                {' '}
                {isCancelInsp && targetEndDate && targetStartDate ? (
                  <span
                    onClick={() => setShowRelatedSchedules(true)}
                    className="cursor-pointer text-decoration-underline font-weight-800"
                  >
                    Inspections
                  </span>
                )
                  : ''}
                {' '}
                Click here
                .
              </>
              )}
            </p>

          </Alert>
        </div>
        )}
        {isSuccess
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              disabled={error || ((actionValue === 'On Hold') ? !isValidValue(remarksTicket) : '') || ((actionValue === 'Closed') ? closedStateCondition : loading)}
              className="submit-btn"
              onClick={() => handleStateChange(viewData.id, actionId)}
            >
              {actionValue === 'Closed' ? 'Close' : actionValue}
            </Button>
          )}
        {(isSuccess
          && (
            <Button
              type="button"
              variant="contained"
              disabled={loading}
              className="submit-btn"
              onClick={toggle}
            >
              Ok
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

ActionSurvey.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionId: PropTypes.string.isRequired,
  actionValue: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};

export default ActionSurvey;
