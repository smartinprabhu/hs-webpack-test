/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo, useEffect } from 'react';
import {
  Col,
  Row,
  Input,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import FormLabel from '@mui/material/FormLabel';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import workOrdersBlue from '@images/icons/workOrders.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import ViewEvents from './selectDateRanges';
import { createCancelReq } from '../../preventiveMaintenance/ppmService';
import {
  getAllowedCompanies, getListOfOperations,
  getArrayNewFormat,
  getColumnArrayById,
  getDateLocalMuI,
  extractNameObject,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import { getParentSchdules, getHxInspCancelDetails } from '../inspectionService';
import RelatedSchedules from './relatedSchedules';
import SpaceSelection from './spaceSelection';
import EquipmentsSelection from '../../commonComponents/equipmentsSelection';
import actionCodes from '../data/actionCodes.json';
import SchedulesSelection from '../../commonComponents/schedulesSelection';

const appModels = require('../../util/appModels').default;

const InspectionCancelRequestBulk = ({
  afterReset, closeModal, isHoliday, setViewId, setViewModal,
}) => {
  const dispatch = useDispatch();

  const [typeSelected, setType] = React.useState('all');

  const [assetType, setAssetType] = React.useState('Equipment');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const [messageTicket, setMessageTicket] = useState('');

  const [multipleModal, setMultipleModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);

  const [equipments, setEquipments] = useState([]);
  const [spaces, setSpaces] = useState([]);

  const [timeoutLoading, setTimeoutLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const [trigger, setTrigger] = useState(false);
  const [holidayEnd, setHolidayEnd] = useState(null);
  const [holidayStart, setHolidayStart] = useState(null);

  const [events, setEvents] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [parentSchedules, setParentSchedules] = useState([]);
  const [showRelatedSchedules, setShowRelatedSchedules] = useState(false);
  const [hasDateError, setHasDateError] = useState(false);
  const [assetFilterModal, setAssetFilterModal] = useState(false);
  const [spaceFilterModal, setSpaceFilterModal] = useState(false);
  const [isExcludeEnabled, setExcludeEnabled] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { hxCreatePpmCancelRequest } = useSelector((state) => state.ppm);
  const { inspectionParentsInfo, inspectionCommenceInfo, hxInspCancelDetails } = useSelector((state) => state.inspection);

  const configData = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length ? inspectionCommenceInfo.data[0] : false;
  const isPast = configData && configData.is_allow_cancellation_of_past_days;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const canExclude = allowedOperations.includes(actionCodes['Allow Exclude All Assets Request']);

  useEffect(() => {
    setEvents([]);
    setCheckRows([]);
    setParentSchedules([]);
    if (assetType === 'Space' && spaces && spaces.length > 0) {
      dispatch(getParentSchdules(companies, appModels.INSPECTIONCHECKLIST, assetType, getColumnArrayById(spaces, 'id'), false));
    } else if (equipments && equipments.length && assetType === 'Equipment') {
      dispatch(getParentSchdules(companies, appModels.INSPECTIONCHECKLIST, assetType, getColumnArrayById(equipments, 'id'), false));
    }
  }, [assetType, trigger]);

  useEffect(() => {
    if (hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxCreatePpmCancelRequest.data.length) {
      dispatch(getHxInspCancelDetails(hxCreatePpmCancelRequest.data[0], appModels.HXINSPECTIONCANCEL));
      setSuccess(true);
    }
  }, [hxCreatePpmCancelRequest]);

  useEffect(() => {
    if (inspectionParentsInfo && inspectionParentsInfo.data && inspectionParentsInfo.data.length) {
      if (typeSelected !== 'current') {
        setCheckRows(!(isExcludeEnabled && isHoliday === 'yes') ? inspectionParentsInfo.data : []);
        setParentSchedules(inspectionParentsInfo.data);
      } else {
        setCheckRows([]);
        setParentSchedules([]);
      }
    } else {
      setCheckRows([]);
      setParentSchedules([]);
    }
  }, [inspectionParentsInfo]);

  const toggle = () => {
    // atFinish();
  };

  const handleTypeChange = (event) => {
    setAssetType(event.target.value);
    setEquipments([]);
    setSpaces([]);
    setCheckRows([]);
    setParentSchedules([]);
  };

  const toggleCancel = () => {
    // atFinish();
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

  function checkExDatehasObjectCheck(data) {
    if (!data) return ''; // safe fallback

    if (typeof data === 'object' && data !== null) {
      const formatted = getDateLocalMuI(data); // e.g., returns "2025-04-23"
      return formatted || '';
    }

    if (typeof data === 'string' || typeof data === 'number') {
      return data; // assume it's already a date string
    }

    return '';
  }

  function isValidDateInput(date) {
    if (!date) return false; // handles null, undefined, empty
    const parsed = checkExDatehasObjectCheck(date);
    return !!parsed;
  }

  const handleExcludeChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      setExcludeEnabled(true);
    } else {
      setExcludeEnabled(false);
      setAssetType('Equipment');
      setEquipments([]);
      setSpaces([]);
      setCheckRows([]);
      setParentSchedules([]);
    }
  };

  useEffect(() => {
    if (events && events.length) {
      const events1 = [...events];
      const newData = events1.map((cl) => ({
        from_date: checkExDatehasObject(cl.from_date),
        to_date: checkExDatehasObject(cl.to_date),
      }));
      console.log(newData);
      const missingDates = newData.filter((item) => item.from_date === 'Invalid date' || item.to_date === 'Invalid date');

      console.log('missingDates Ranges:', missingDates);
      console.log(events);

      setHasDateError(!!(missingDates && missingDates.length > 0));
    } else {
      setHasDateError(false);
    }
  }, [JSON.stringify(events)]);

  const onAssetModalChange = (data) => {
    if (data && data.length) {
      const newData = data.filter((item) => item.name);
      // const allData = [...newData, ...equipments];
      const newData1 = [...new Map(newData.map((item) => [item.id, item])).values()];
      setEquipments(newData1);
      // setTrigger(Math.random());
    } else {
      setEquipments([]);
    }
  };

  const onAssetModalChangeHoliday = (data) => {
    if (data && data.length) {
      const newData = data.filter((item) => item.id);
      // const allData = [...newData, ...equipments];
      const newData1 = [...new Map(newData.map((item) => [item.id, item])).values()];
      setEquipments(newData1);
      // setTrigger(Math.random());
    } else {
      setEquipments([]);
    }
  };

  const onEquipmentDelete = (id) => {
    setEquipments((prev) => prev.filter((r) => r.id !== id));
    setTrigger(Math.random());
  };

  const onEquipmentDeleteHoliday = (id) => {
    setEquipments((prev) => prev.filter((r) => r.id !== id));
  };

  const onSpaceDelete = (id) => {
    setSpaces((prev) => prev.filter((r) => r.id !== id));
    setTrigger(Math.random());
  };

  const onFetchAssetSchedules = () => {
    setAssetFilterModal(false);
    setTrigger(Math.random());
  };

  const onFetchAssetSchedulesHoliday = () => {
    setAssetFilterModal(false);
  };

  const onSpaceModalChange = (data) => {
    /* const newData = data.filter((item) => item.space_name);
    const allData = [...newData, ...spaces];
    const newData1 = [...new Map(allData.map((item) => [item.id, item])).values()]; */
    setSpaceFilterModal(false);
    setSpaces(data);
    setTrigger(Math.random());
  };

  const addDays = (days, date) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handleStateChange = async () => {
    try {
      setIsOpenSuccessAndErrorModalWindow(true);
      setSuccess(false);
      let postData = {};
      const newData = events.map((cl) => ({
        from_date: checkExDatehasObject(cl.from_date),
        to_date: cl.to_date && !cl.is_all_upcoming ? checkExDatehasObject(cl.to_date) : false,
        is_all_upcoming: cl.is_all_upcoming,
      }));
      if (configData && configData.approval_required_for_cancel) {
        if (isHoliday === 'no') {
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
        } else {
          postData = {
            is_cancel_for_all_assets: true,
            from_date: checkExDatehasObject(holidayStart),
            to_date: checkExDatehasObject(holidayEnd),
            requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            reason: messageTicket,
            requested_by_id: userInfo && userInfo.data && userInfo.data.id,
            state: 'Pending',
            cancel_approval_authority: configData && configData.cancel_approval_authority && configData.cancel_approval_authority.id ? configData.cancel_approval_authority.id : false,
            expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
          };

          if (isExcludeEnabled) {
            postData.hx_inspection_ids = [[6, 0, getColumnArrayById(equipments, 'id')]];
          }
        }
      } else if (isHoliday === 'no') {
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
      } else {
        postData = {
          is_cancel_for_all_assets: true,
          from_date: checkExDatehasObject(holidayStart),
          to_date: checkExDatehasObject(holidayEnd),
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          state: 'Approved',
          approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          approved_by_id: userInfo && userInfo.data && userInfo.data.id,
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
        };
        if (isExcludeEnabled) {
          postData.hx_inspection_ids = [[6, 0, getColumnArrayById(equipments, 'id')]];
        }
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

  const onLoadRequest = (eid, ename) => {
    if (setViewId && setViewModal && hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data) {
      setViewId(hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxCreatePpmCancelRequest.data.length && hxCreatePpmCancelRequest.data[0]);
      setViewModal(true);
      // closeModal();
    }
    if (hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.err) {
      if (afterReset) afterReset();
    }
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const closeAddMaintenance = () => {
    if (hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.err) {
      // closeModal();
      setTimeout(() => {
        if (afterReset) afterReset();
      }, 1000);
    }
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const onPlannedStartChange = (e) => {
    setHolidayStart(e);
    setHolidayEnd(e);
  };

  const onPlannedEndChange = (e) => {
    setHolidayEnd(e);
  };

  const getFiledData = (data) => getColumnArrayById(data, 'id');

  const loading = hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.loading;

  const isDisabled = useMemo(() => {
    if (isHoliday === 'no') {
      return !(typeSelected === 'all' && messageTicket && events.length && checkedRows.length) || hasDateError;
    }
    return !(messageTicket && holidayEnd && holidayStart && new Date(holidayEnd) >= new Date(holidayStart)) || (isExcludeEnabled && !equipments.length);
  }, [isHoliday, isExcludeEnabled, typeSelected, messageTicket, events, checkedRows, hasDateError, equipments, holidayEnd, holidayStart]);

  return (

    <Box
      sx={{
        padding: '0px 0px 0px 20px',
        width: '100%',
        maxHeight: '100vh',
        overflow: 'auto',
        marginBottom: '70px',
      }}
    >

      {isHoliday === 'no' && (
        <Row className="ml-2 mr-2 mt-0">
          <Col xs={12} sm={12} md={12} lg={12} className="mt-3 col-auto">
            <FormControl className="font-family-tab">
              <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={assetType}
                onChange={handleTypeChange}
              >
                <FormControlLabel className="font-family-tab" value="Equipment" control={<Radio />} label="Equipment" />
                <FormControlLabel className="font-family-tab" value="Space" control={<Radio />} label="Space" />
              </RadioGroup>
            </FormControl>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="mt-0 mb-1 col-auto">
            <p className="font-tiny font-family-tab">
              Click the &#39;Select
              {' '}
              {assetType === 'Equipment' ? 'Equipment' : 'Spaces'}
              &#39; button to select
              {' '}
              {assetType === 'Equipment' ? 'equipment' : 'spaces'}
              {' '}
              and view their inspection schedules.
            </p>
          </Col>
        </Row>
      )}
      {isHoliday === 'yes' && (
        <Row className="ml-2 mr-2 mt-0">

          <Col xs={12} sm={12} md={12} lg={12} className="mt-0 mb-1 col-auto">
            <p className="font-tiny font-family-tab">Please select the holiday period</p>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="mt-0 mb-2 col-auto">
            <Stack>
              <Alert severity="warning">
                <p className="font-family-tab mb-0">
                  Attention! All the Inspection schedules would be cancelled for the selected date range.
                </p>
              </Alert>
            </Stack>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3} className="mt-0 col-auto">
            <FormControl className="font-family-tab">
              <FormLabel id="demo-row-radio-buttons-group-label" className="mb-1 font-family-tab font-tiny">
                From Date
                <span className="ml-1 text-danger font-weight-800"> * </span>
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                  <DatePicker
                    minDate={isPast ? undefined : dayjs()}
                    localeText={{ todayButtonLabel: 'Now' }}
                    slotProps={{
                      actionBar: {
                        actions: ['accept'],
                      },
                      popper: {
                        modifiers: [
                          {
                            name: 'flip',
                            options: {
                              fallbackPlacements: ['top'],
                            },
                          },
                          {
                            name: 'preventOverflow',
                            options: {
                              boundary: 'window',
                              altAxis: true,
                            },
                          },
                        ],
                      },
                      textField: {
                        inputRef: (input) => {
                          if (input) {
                            input.setAttribute('readonly', 'true');
                            input.onkeydown = (e) => e.preventDefault();
                          }
                        },
                      },
                    }}
                    disablePast={!isPast}
                    name="Start Date"
                   // label="Start Date"
                    format="DD/MM/YYYY"
                    value={dayjs(holidayStart)}
                    onChange={(e) => onPlannedStartChange(e)}
                    ampm={false}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3} className="mt-0 col-auto">
            <FormControl className="font-family-tab">
              <FormLabel id="demo-row-radio-buttons-group-label" className="mb-1 font-family-tab font-tiny">
                To Date
                <span className="ml-1 text-danger font-weight-800"> * </span>
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                  <DatePicker
                    minDate={dayjs(holidayStart)}
                    localeText={{ todayButtonLabel: 'Now' }}
                    slotProps={{
                      actionBar: {
                        actions: ['accept'],
                      },
                      popper: {
                        modifiers: [
                          {
                            name: 'flip',
                            options: {
                              fallbackPlacements: ['top'],
                            },
                          },
                          {
                            name: 'preventOverflow',
                            options: {
                              boundary: 'window',
                              altAxis: true,
                            },
                          },
                        ],
                      },
                      textField: {
                        inputRef: (input) => {
                          if (input) {
                            input.setAttribute('readonly', 'true');
                            input.onkeydown = (e) => e.preventDefault();
                          }
                        },
                      },
                    }}
                    disablePast={!isPast}
                    name="Start Date"
                  //  label="Start Date"
                    format="DD/MM/YYYY"
                    value={dayjs(holidayEnd)}
                    onChange={(e) => onPlannedEndChange(e)}
                    ampm={false}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="col-auto mt-3">
            <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">
              Reason
              {' '}
              <span className="ml-1 text-danger font-weight-800"> * </span>
            </FormLabel>
            <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
          </Col>
          {canExclude && holidayStart && holidayEnd && (
          <Col xs={12} sm={12} md={12} lg={12} className="col-auto mt-3">
            <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">
              Exclude Schedules
            </FormLabel>
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value="all"
              name="checkall"
              id="checkboxtkhead1"
              checked={isExcludeEnabled}
              onChange={handleExcludeChange}
            />
          </Col>
          )}
          {isExcludeEnabled && (
            <Row className="ml-2 mr-2 mt-0">

              <Col xs={12} sm={12} md={12} lg={12} className="mt-0 mb-1 col-auto">
                <p className="font-tiny font-family-tab">
                  Click the &#39;Select
                  {' '}
                  Schedules
                  &#39; button to select
                  {' '}
                  Schedules to Exclude.
                </p>
              </Col>
              <div className="pl-4 pr-3 mb-2">

                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={() => setAssetFilterModal(true)}
                >
                  Select Schedules
                </Button>

                {assetFilterModal && (
                  <SchedulesSelection
                    onScheduleModalChange={onAssetModalChangeHoliday}
                    filterModal={assetFilterModal}
                    setSchedules={setEquipments}
                    schedules={equipments}
                    finishText="Add Schedules"
                    onClose={onFetchAssetSchedulesHoliday}
                    onCancel={() => setAssetFilterModal(false)}
                    holidayStart={holidayStart}
                    holidayEnd={holidayEnd}
                  />
                )}
                {equipments && equipments.length > 0 && (
                <>
                  <p className="font-family-tab mt-3 ">
                    Selected Schedules to exclude:
                    {' '}
                    {equipments.length}
                  </p>
                  <Stack className="mb-3" direction="row" flexWrap="wrap">
                    {equipments.map((row) => (
                      <Chip
                        key={row.id}
                        label={extractNameObject(row.group_id, 'name')} // or row.equipmentName or whatever field represents it
                        onDelete={() => onEquipmentDeleteHoliday(row.id)}
                        className="mb-3 mr-3"
                      />
                    ))}
                  </Stack>
                </>
                )}

              </div>
            </Row>
          )}
        </Row>
      )}
      {isHoliday === 'no' && (
        <>
          <div className="pl-4 pr-3 mb-2">
            {assetType === 'Equipment' && (
              <>
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  disabled={inspectionParentsInfo && inspectionParentsInfo.loading}
                  onClick={() => setAssetFilterModal(true)}
                >
                  Select Equipment
                </Button>
                {equipments && equipments.length > 0 && (
                  <>
                    <p className="font-family-tab mt-3 ">
                      Selected Equipment:
                      {' '}
                      {equipments.length}
                    </p>
                    <Stack className="mb-3" direction="row" flexWrap="wrap">
                      {equipments.map((row) => (
                        <Chip
                          key={row.id}
                          label={row.name} // or row.equipmentName or whatever field represents it
                          onDelete={() => onEquipmentDelete(row.id)}
                          className="mb-3 mr-3"
                        />
                      ))}
                    </Stack>
                  </>
                )}
                {assetFilterModal && (
                <EquipmentsSelection
                  onAssetModalChange={onAssetModalChange}
                  filterModal={assetFilterModal}
                  setEquipments={setEquipments}
                  equipments={equipments}
                  finishText="Get Schedules"
                  onClose={onFetchAssetSchedules}
                  onCancel={() => setAssetFilterModal(false)}
                />
                )}
              </>
            )}
            {assetType === 'Space' && (

            <>
              <Button
                type="button"
                variant="contained"
                size="small"
                disabled={inspectionParentsInfo && inspectionParentsInfo.loading}
                onClick={() => setSpaceFilterModal(true)}
              >
                Select Spaces
              </Button>
              {spaces && spaces.length > 0 && (
              <>
                <p className="font-family-tab mt-3 ">
                  Selected Spaces:
                  {' '}
                  {spaces.length}
                </p>
                <Stack className="mb-3" direction="row" flexWrap="wrap">
                  {spaces.map((row) => (
                    <Chip
                      key={row.id}
                      label={row.space_name} // or row.equipmentName or whatever field represents it
                      onDelete={() => onSpaceDelete(row.id)}
                      className="mb-3 mr-3"
                    />
                  ))}
                </Stack>
              </>
              )}
              {spaceFilterModal && (
              <SpaceSelection
                filterModal={spaceFilterModal}
                spaces={spaces && spaces.length > 0 ? spaces : []}
                setSpaces={onSpaceModalChange}
                onCancel={() => setSpaceFilterModal(false)}
              />
              )}
            </>

            )}
            {(spaces.length > 0 || equipments.length > 0) && inspectionParentsInfo && !inspectionParentsInfo.loading && inspectionParentsInfo.data && (
            <p
              className={`mb-1 font-family-tab font-14 ${parentSchedules && parentSchedules.length > 0 ? 'text-info cursor-pointer' : ''}`}
              onClick={() => setShowRelatedSchedules(!!(parentSchedules && parentSchedules.length > 0))}
            >
              View All Schedules of the Selected Assets (Selected Schedules:
              {' '}
              {checkedRows.length}
              )
            </p>
            )}
            {inspectionParentsInfo && inspectionParentsInfo.loading && (
            <Loader />
            )}
            <Dialog size="lg" fullWidth open={showRelatedSchedules}>
              <DialogHeader title="View All the Schedules of the Selected Assets" onClose={() => { setShowRelatedSchedules(false); }} />
              <RelatedSchedules
                isInformMsg
                typeSelected={typeSelected}
                setEvents={setCheckRows}
                selectedSchedules={checkedRows && checkedRows.length > 0 ? checkedRows : []}
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
            <p style={{ opacity: '0.5' }} className="font-tiny font-family-tab mt-0 mb-2">(Please select the date ranges for the schedules of the selected assets that need to be cancelled)</p>

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
        {isHoliday === 'no' && configData && configData.approval_required_for_cancel && hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.data && !loading && (
        <SuccessAndErrorFormat response={false} staticInfoMessage="Cancellation of Inspection requires approval." />
        )}
        {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.err && (
        <SuccessAndErrorFormat response={hxCreatePpmCancelRequest} />
        )}
        {isHoliday === 'yes' && !(new Date(holidayEnd) >= new Date(holidayStart)) && (
          <SuccessAndErrorFormat response={false} staticErrorMsg="From Date Should not be greater than To Date." />
        )}
      </Row>

      <div className="float-right sticky-button-90drawer z-Index-1099">
        {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || isDisabled}
              onClick={() => handleStateChange()}
            >
              {configData && configData.approval_required_for_cancel ? 'Request' : 'Create'}
            </Button>
          )}
      </div>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        type="create"
        newId={hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length > 0 ? hxInspCancelDetails.data[0].id : false}
        newName={hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length > 0 ? 'Request' : false}
        successOrErrorData={hxCreatePpmCancelRequest}
        headerImage={workOrdersBlue}
        headerText="Cancellation Request"
        onLoadRequest={onLoadRequest}
        successRedirect={closeAddMaintenance}
        response={hxCreatePpmCancelRequest}
      />
    </Box>
  );
};

export default InspectionCancelRequestBulk;
