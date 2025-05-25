/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Typography,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import * as PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';

import workOrdersBlue from '@images/icons/workOrders.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import ViewEvents from './selectDateRanges';
import { createCancelReq } from '../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies, convertDecimalToTime,
  getArrayNewFormat,
  getColumnArrayById,
  getDateLocalMuI,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import { getParentSchdules } from '../inspectionService';
import RelatedSchedules from './relatedSchedules';

const appModels = require('../../util/appModels').default;

const InspectionCancelRequest = (props) => {
  const {
    detailData, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [typeSelected, setType] = React.useState('current');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [parentSchedules, setParentSchedules] = useState([]);
  const [showRelatedSchedules, setShowRelatedSchedules] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { hxCreatePpmCancelRequest } = useSelector((state) => state.ppm);
  const { inspectionParentsInfo, inspectionCommenceInfo } = useSelector((state) => state.inspection);

  const configData = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length ? inspectionCommenceInfo.data[0] : false;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setEvents([]);
    setCheckRows([]);
    setParentSchedules([]);
    setMessageTicket('');
    if (typeSelected === 'current') {
      dispatch(getParentSchdules(companies, appModels.INSPECTIONCHECKLIST, false, false, detailData.hx_inspection_uuid));
    } else {
      dispatch(getParentSchdules(companies, appModels.INSPECTIONCHECKLIST, detailData.category_type, detailData.asset_id, false));
    }
  }, [typeSelected]);

  useEffect(() => {
    if (inspectionParentsInfo && inspectionParentsInfo.data && inspectionParentsInfo.data.length) {
      setCheckRows(inspectionParentsInfo.data);
      setParentSchedules(inspectionParentsInfo.data);
    } else {
      setCheckRows([]);
      setParentSchedules([]);
    }
  }, [inspectionParentsInfo]);

  const toggle = () => {
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const isDateNotFilled = () => {
    let res = false;
    if (events && events.length) {
      const data = events.filter((item) => !item.to_date || !item.from_date);
      if (data && data.length) {
        res = true;
      }
    }
    return res;
  };

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateLocalMuI(data);
    } else {
      result = moment(data).format('YYYY-MM-DD');
    }
    return result;
  }

  const addDays = (days, date) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleStateChange = async () => {
    try {
      let postData = {};
      const newData = events.map((cl) => ({
        from_date: checkExDatehasObject(cl.from_date),
        to_date: cl.to_date && !cl.is_all_upcoming ? checkExDatehasObject(cl.to_date) : false,
        is_all_upcoming: cl.is_all_upcoming,
      }));
      if (configData && configData.approval_required_for_cancel) {
        if (typeSelected === 'current') {
          const ids = inspectionParentsInfo && inspectionParentsInfo.data && inspectionParentsInfo.data.length ? inspectionParentsInfo.data[0].id : false;
          postData = {
            requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            reason: messageTicket,
            requested_by_id: userInfo && userInfo.data && userInfo.data.id,
            state: 'Pending',
            cancel_approval_authority: configData && configData.cancel_approval_authority && configData.cancel_approval_authority.id ? configData.cancel_approval_authority.id : false,
            hx_inspection_ids: [[6, 0, [ids]]],
            expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
            date_range_ids: getArrayNewFormat(newData),
          };
        } else {
          postData = {
            requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            reason: messageTicket,
            requested_by_id: userInfo && userInfo.data && userInfo.data.id,
            state: 'Pending',
            cancel_approval_authority: configData && configData.cancel_approval_authority && configData.cancel_approval_authority.id ? configData.cancel_approval_authority.id : false,
            hx_inspection_ids: [[6, 0, getColumnArrayById(checkedRows, 'id')]],
            expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
            date_range_ids: getArrayNewFormat(newData),
          };
        }
      } else if (typeSelected === 'current') {
        const ids = inspectionParentsInfo && inspectionParentsInfo.data && inspectionParentsInfo.data.length ? inspectionParentsInfo.data[0].id : false;
        postData = {
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          state: 'Approved',
          approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          approved_by_id: userInfo && userInfo.data && userInfo.data.id,
          hx_inspection_ids: [[6, 0, [ids]]],
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
          date_range_ids: getArrayNewFormat(newData),
        };
      } else {
        postData = {
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          state: 'Approved',
          approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          approved_by_id: userInfo && userInfo.data && userInfo.data.id,
          hx_inspection_ids: [[6, 0, getColumnArrayById(checkedRows, 'id')]],
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
          date_range_ids: getArrayNewFormat(newData),
        };
      }

      const payload = { model: 'hx.inspection_cancel', values: postData };
      dispatch(createCancelReq('hx.inspection_cancel', payload));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
      // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const loading = hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.loading;

  const isDisabled = !(messageTicket && events.length && checkedRows.length);

  return (

    <Dialog PaperProps={{ style: { width: '900px', maxWidth: '900px' } }} open={actionModal}>
      <DialogHeader title="Cancel Inspection Schedule" onClose={toggleCancel} response={hxCreatePpmCancelRequest} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-0 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3" style={{ backgroundColor: '#F6F8FA' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={workOrdersBlue} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.group_name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Type: </span>
                        {getDefaultNoValue(detailData.category_type)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Asset: </span>
                        {getDefaultNoValue(detailData.asset_name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Maintenance Team: </span>
                        {getDefaultNoValue(detailData.maintenance_team_name)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.data && !loading && (
            <>
              <Row className="ml-2 mr-2 mt-0">

                <Col xs={12} sm={12} md={12} lg={12} className="mt-3 col-auto">
                  <FormControl className="font-family-tab">
                    <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">Type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={typeSelected}
                      onChange={handleTypeChange}
                    >
                      <FormControlLabel className="font-family-tab" value="current" control={<Radio />} label="Current Schedule" />
                      <FormControlLabel className="font-family-tab" value="all" control={<Radio />} label="All the related Schedules of the asset" />
                    </RadioGroup>
                  </FormControl>
                </Col>
              </Row>

              <div className="pl-4 pr-3 mb-2">
                {inspectionParentsInfo && !inspectionParentsInfo.loading && inspectionParentsInfo.data && (
                  <>
                    {typeSelected === 'current' && (
                    <Stack className="mb-2">
                      <Alert severity="info">
                        <p className="font-family-tab mb-1">
                          <span className="font-weight-800 mr-1">Scheduler:</span>
                          {' '}
                          {getDefaultNoValue(extractNameObject(inspectionParentsInfo.data[0].group_id, 'name'))}
                        </p>
                        <p className="font-family-tab mb-1">
                          <span className="font-weight-800 mr-1">Checklist:</span>
                          {' '}
                          {getDefaultNoValue(extractNameObject(inspectionParentsInfo.data[0].check_list_id, 'name'))}
                        </p>
                        <p className="font-family-tab mb-1">
                          <span className="font-weight-800 mr-1">Starts On (HH:MM):</span>
                          {' '}
                          {convertDecimalToTime(inspectionParentsInfo.data[0].starts_at)}
                        </p>
                        <p className="font-family-tab mb-1">
                          <span className="font-weight-800 mr-1">Ends On (HH:MM):</span>
                          {' '}
                          {convertDecimalToTime(parseFloat(inspectionParentsInfo.data[0].starts_at) + parseFloat(inspectionParentsInfo.data[0].duration))}
                        </p>
                      </Alert>
                    </Stack>
                    )}
                    {typeSelected !== 'current' && (
                    <p
                      className={`mb-1 font-family-tab font-14 ${parentSchedules && parentSchedules.length > 0 ? 'text-info cursor-pointer' : ''}`}
                      onClick={() => setShowRelatedSchedules(!!(parentSchedules && parentSchedules.length > 0))}
                    >
                      {typeSelected === 'all' && (
                      <>
                        View related schedules of the asset
                        (
                        Selected:
                        {' '}
                        {checkedRows.length}
                        )
                      </>
                      )}
                    </p>
                    )}
                  </>
                )}
                {inspectionParentsInfo && inspectionParentsInfo.loading && (
                <Loader />
                )}
                <Dialog size="lg" fullWidth open={showRelatedSchedules}>
                  <DialogHeader title={typeSelected === 'all' ? 'View Related Schedules of the Asset' : 'View Current Schedule'} onClose={() => { setShowRelatedSchedules(false); }} />
                  <RelatedSchedules
                    isInformMsg
                    selectedSchedules={checkedRows && checkedRows.length > 0 ? checkedRows : []}
                    typeSelected={typeSelected}
                    setEvents={setCheckRows}
                    events={parentSchedules && parentSchedules.length > 0 ? parentSchedules : []}
                    onClose={() => { setShowRelatedSchedules(false); }}
                  />
                </Dialog>

              </div>
              {checkedRows && checkedRows.length > 0 && (
              <div className="pl-4 pr-3">
                <p className="mb-0 font-family-tab font-14">
                  Select Date Ranges
                  <span className="ml-1 text-danger font-weight-800"> * </span>
                </p>
                <p style={{ opacity: '0.5' }} className="font-tiny font-family-tab mt-0 mb-2">
                  (
                  {typeSelected === 'all' ? 'Please select the date ranges for the related schedules of the asset that need to be cancelled' : 'Please select the date ranges for the current schedule that need to be cancelled'}
                  )
                </p>

                <Row className="mt-0">

                  <ViewEvents events={events} setEvents={setEvents} />
                  <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                    <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">
                      Reason
                      {' '}
                      <span className="ml-1 text-danger font-weight-800"> * </span>
                    </FormLabel>
                    <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                  </Col>
                </Row>
              </div>
              )}

            </>
            )}
            <Row className="justify-content-center font-family-tab w-100">
              {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && !loading && (
                <SuccessAndErrorFormat response={hxCreatePpmCancelRequest} successMessage={configData && configData.approval_required_for_cancel ? 'The cancellation request for the Inspection has been created.' : 'The Inspection Schedule has been cancelled successfully..'} />
              )}
              {configData && configData.approval_required_for_cancel && hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.data && !loading && (
              <SuccessAndErrorFormat response={false} staticInfoMessage="Cancellation of Inspection requires approval." />
              )}
              {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.err && (
                <SuccessAndErrorFormat response={hxCreatePpmCancelRequest} />
              )}

              {loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || isDisabled || isDateNotFilled()}
              onClick={() => handleStateChange()}
            >
              {configData && configData.approval_required_for_cancel ? 'Request' : 'Cancel'}
            </Button>
          )}
        {(hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
          && (
            <Button
              type="button"
              size="sm"
              disabled={loading}
              variant="contained"
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

InspectionCancelRequest.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default InspectionCancelRequest;
