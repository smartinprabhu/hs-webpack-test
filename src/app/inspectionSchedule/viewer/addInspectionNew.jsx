/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  Col,
  Row,
} from 'reactstrap';

import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getActiveTab, getHeaderTabs, getTabs,
  extractValueObjects, getDateTimeUtcMuI,
  getDateLocalMuI,
  getArrayNewFormat,
} from '../../util/appUtils';
import { updateHeaderData } from '../../core/header/actions';
import AddAssets from './forms/addAssetsNew';
import AddScheduleConfiguration from './addScheduleConfiguration';
import Summary from './summary';
import adminSetupNav from '../../adminSetup/navbar/navlistSite.json';
import {
  createInspection,
  resetCreateInspection,
} from '../inspectionService';
import {
  createUser, resetCreateUser,
} from '../../adminSetup/setupService';
import { getAuditAction } from '../../auditSystem/auditService';
import {
  updatePPMScheduler, resetUpdateScheduler,
} from '../../preventiveMaintenance/ppmService';

const appModels = require('../../util/appModels').default;

const AddInspectionNew = ({ onClose, editId, editData }) => {
  const subMenu = 'PPM Viewer';
  const isAdminSetup = true;
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { addInspectionScheduleInfo } = useSelector((state) => state.inspection);
  const {
    createUserInfo,
  } = useSelector((state) => state.setup);
  const { updatePpmSchedulerInfo } = useSelector((state) => state.ppm);

  const history = useHistory();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, adminSetupNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Maintenance',
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Maintenance',
        link: '/maintenance',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    dispatch(resetCreateInspection());
    dispatch(resetUpdateScheduler());
    dispatch(resetCreateUser());
  }, []);

  const addDueDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  function getNextWeekStartEnd() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    // Calculate the date of the next Monday
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // If Sunday, move to next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    // Calculate the next Sunday (same week as nextMonday)
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6); // Move to Sunday

    // Set time to the start and end of the day
    nextMonday.setHours(0, 0, 0, 0);
    nextSunday.setHours(23, 59, 59, 999);

    return {
      start: nextMonday,
      end: nextSunday,
    };
  }

  const [bulkEvents, setBulkEvents] = React.useState([]);

  const [activeStep, setActiveStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState({
    category_type: 'e',
    ppm_by: 'Space Category',
    category_id: '',
    maintenance_team_id: '',
    commences_on: null,
    task_id: '',
    check_list_id: '',
    equipment_id: '',
    space_id: '',
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
    at_start_mro: false,
    at_done_mro: false,
    at_review_mro: false,
    enforce_time: true,
    nfc_scan_at_start: false,
    nfc_scan_at_done: false,
    qr_scan_at_start: false,
    qr_scan_at_done: false,
    is_exclude_holidays: false,
    is_missed_alert: false,
    starts_at: !editId ? [] : { value: '1:00', label: '1:00' },
    description: '',
    duration: { value: '01:00', label: '01:00' },
    min_duration: '',
    max_duration: '',
    is_enable_time_tracking: false,
    ends_on: null,
  });
  const [equipments, setEquipments] = React.useState([]);
  const [spaces, setSpaces] = React.useState([]);

  const assetValidationNew = formValues && !((formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id));

  const assetValidation = formValues && !(((formValues.category_type === 'e' && equipments.length > 0) || (formValues.category_type === 'ah' && spaces.length > 0)));
  const scheduleValidation = formValues && !(formValues.commences_on && formValues.starts_at && formValues.starts_at.length > 0 && formValues.check_list_id && formValues.maintenance_team_id && formValues.description);

  const assetValidationUpdate = formValues && !((formValues.category_type === 'e' && (formValues.equipment_id && formValues.equipment_id.id)) || (formValues.category_type === 'ah' && (formValues.space_id && formValues.space_id.id)));
  const scheduleValidationUpdate = formValues && !(formValues.commences_on && formValues.starts_at && formValues.starts_at.value && formValues.check_list_id && formValues.maintenance_team_id && formValues.description);

  function isDisabled() {
    let res = false;
    if (!editId) {
      if (assetValidation || scheduleValidation || assetValidationNew) {
        res = true;
      }
    } else if ((updatePpmSchedulerInfo && updatePpmSchedulerInfo.loading) || assetValidationUpdate || scheduleValidationUpdate) {
      res = true;
    }
    return res;
  }

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateLocalMuI(data);
    } else {
      result = moment(data).format('YYYY-MM-DD');
    }
    return result;
  }

  useEffect(() => {
    if (editId && editData) {
      setFormValues({
        category_type: editData.category_type === 'Equipment' ? 'e' : 'ah',
        ppm_by: 'Space Category',
        commences_on: dayjs(moment.utc(editData.commences_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD')),
        maintenance_team_id: editData.maintenance_team_id,
        task_id: editData.task_id,
        equipment_id: editData.equipment_id,
        space_id: editData.space_id,
        check_list_id: editData.check_list_id,
        mo: editData.mo,
        tu: editData.tu,
        we: editData.we,
        th: editData.th,
        fr: editData.fr,
        sa: editData.sa,
        su: editData.su,
        at_start_mro: editData.at_start_mro,
        at_done_mro: editData.at_done_mro,
        at_review_mro: editData.at_review_mro,
        enforce_time: editData.enforce_time,
        nfc_scan_at_start: editData.nfc_scan_at_start,
        nfc_scan_at_done: editData.nfc_scan_at_done,
        qr_scan_at_start: editData.qr_scan_at_start,
        qr_scan_at_done: editData.qr_scan_at_done,
        is_exclude_holidays: editData.is_exclude_holidays,
        is_missed_alert: editData.is_missed_alert,
        starts_at: editData.starts_at > 0 ? { value: `${editData.starts_at}:00`, label: `${editData.starts_at}:00` } : { value: '1:00', label: '1:00' },
        description: editData.description,
        duration: { value: `${editData.duration > 9 ? editData.duration : `0${editData.duration}`}:00`, label: `${editData.duration > 9 ? editData.duration : `0${editData.duration}`}:00` },
        min_duration: editData.min_duration,
        max_duration: editData.max_duration,
        is_enable_time_tracking: editData.is_enable_time_tracking,
        ends_on: editData.ends_on ? dayjs(moment.utc(editData.ends_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null,
      });
    }
  }, [editId, editData]);

  function timeStringToFloat(time) {
    // Split the time string by colon (:) to get hours and minutes
    const [hours, minutes] = time.split(':').map(Number);

    // Convert the time to float (hours + minutes as fraction of 60)
    const totalHours = hours + minutes / 60;

    return totalHours;
  }

  const getArrayToCommaValuesTime = (array, key) => {
    let ids = '';
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        ids += `${timeStringToFloat((array[i][key]).toString())},`;
      }
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  };

  const getArrayModifyBulkLines = (array, team, checklist, duration, startsAt, categoryType) => {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const p = array[i];
        const pObj = {};
        if (categoryType === 'ah') {
          pObj.space_id = p.id;
        }
        if (categoryType === 'e') {
          pObj.equipment_id = p.id;
        }
        pObj.maintenance_team_id = extractValueObjects(team);
        pObj.check_list_id = extractValueObjects(checklist);
        pObj.duration = parseFloat(duration && duration.value);
        pObj.starts_at = getArrayToCommaValuesTime(startsAt, 'value');
        newData.push(pObj);
      }
    }
    return newData;
  };

  function checkExDatehasObjectTime(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  const onSingleUpdate = () => {
    const inspectionData = formValues;
    const values = formValues;

    const postData = {
      mo: inspectionData?.mo,
      tu: inspectionData?.tu,
      we: inspectionData?.we,
      th: inspectionData?.th,
      fr: inspectionData?.fr,
      sa: inspectionData?.sa,
      su: inspectionData?.su,
      at_start_mro: inspectionData?.at_start_mro,
      at_done_mro: inspectionData?.at_done_mro,
      at_review_mro: inspectionData?.at_review_mro,
      enforce_time: inspectionData?.enforce_time,
      is_allow_future: inspectionData?.is_allow_future,
      is_allow_past: inspectionData?.is_allow_past,
      nfc_scan_at_start: inspectionData?.nfc_scan_at_start,
      nfc_scan_at_done: inspectionData?.nfc_scan_at_done,
      qr_scan_at_start: inspectionData?.qr_scan_at_start,
      qr_scan_at_done: inspectionData?.qr_scan_at_done,
      is_exclude_holidays: inspectionData?.is_exclude_holidays,
      is_missed_alert: inspectionData?.is_missed_alert,
      task_id: extractValueObjects(values?.task_id),
      check_list_id: extractValueObjects(values?.check_list_id),
      maintenance_team_id: extractValueObjects(values?.maintenance_team_id),
      space_id: extractValueObjects(values?.space_id),
      equipment_id: extractValueObjects(values?.equipment_id),
      commences_on: checkExDatehasObject(formValues.commences_on),
      ends_on: formValues.ends_on ? checkExDatehasObjectTime(formValues.ends_on) : false,
      description: inspectionData?.description,
      min_duration: inspectionData.min_duration,
      max_duration: inspectionData.max_duration,
      category_type: inspectionData.category_type === 'e' ? 'Equipment' : 'Space',
      is_enable_time_tracking: inspectionData.is_enable_time_tracking,
      duration: parseFloat(extractValueObjects(values?.duration)),
      starts_at: parseFloat(timeStringToFloat(extractValueObjects(values?.starts_at))),
    };

    dispatch(updatePPMScheduler(editId, 'hx.inspection_checklist', postData));
  };

  useEffect(() => {
    if ((addInspectionScheduleInfo && addInspectionScheduleInfo.data && !addInspectionScheduleInfo.err && !addInspectionScheduleInfo.loading)) {
      const bulkInspectionId = addInspectionScheduleInfo.data.length && addInspectionScheduleInfo.data[0];
      dispatch(getAuditAction(bulkInspectionId, 'create_schedules', appModels.INSPECTIONCHECKBULK));
    }
  }, [addInspectionScheduleInfo]);

  useEffect(() => {
    if (createUserInfo && createUserInfo.data && !createUserInfo.err && !createUserInfo.loading) {
      const values = formValues;
      const categoryType = values?.category_type;
      const inspectionData = formValues;
      let bulkLines = [];
      if (categoryType === 'ah') {
        bulkLines = getArrayModifyBulkLines(spaces, values?.maintenance_team_id, values?.check_list_id, inspectionData?.duration, inspectionData?.starts_at, categoryType);
      }
      if (categoryType === 'e') {
        bulkLines = getArrayModifyBulkLines(equipments, values?.maintenance_team_id, values?.check_list_id, inspectionData?.duration, inspectionData?.starts_at, categoryType);
      }
      const postData = {
        active: true,
        mo: inspectionData?.mo,
        tu: inspectionData?.tu,
        we: inspectionData?.we,
        th: inspectionData?.th,
        fr: inspectionData?.fr,
        sa: inspectionData?.sa,
        su: inspectionData?.su,
        at_start_mro: inspectionData?.at_start_mro,
        at_done_mro: inspectionData?.at_done_mro,
        at_review_mro: inspectionData?.at_review_mro,
        enforce_time: inspectionData?.enforce_time,
        is_allow_future: inspectionData?.is_allow_future,
        is_allow_past: inspectionData?.is_allow_past,
        nfc_scan_at_start: inspectionData?.nfc_scan_at_start,
        nfc_scan_at_done: inspectionData?.nfc_scan_at_done,
        qr_scan_at_start: inspectionData?.qr_scan_at_start,
        qr_scan_at_done: inspectionData?.qr_scan_at_done,
        is_exclude_holidays: inspectionData?.is_exclude_holidays,
        is_missed_alert: inspectionData?.is_missed_alert,
        min_duration: inspectionData.min_duration,
        max_duration: inspectionData.max_duration,
        is_enable_time_tracking: inspectionData.is_enable_time_tracking,
        commences_on: values.commences_on ? moment(values.commences_on.$d).utc().format('YYYY-MM-DD') : false,
        ends_on: values.ends_on ? moment(inspectionData?.ends_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        group_id: createUserInfo.data.length && createUserInfo.data[0],
        bulk_lines: getArrayNewFormat(bulkLines),
        category_type: categoryType === 'e' ? 'Equipment' : 'Space',
        description: inspectionData?.description,
        task_id: extractValueObjects(values?.task_id),
        company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
      };
      const payload = { model: appModels.INSPECTIONCHECKBULK, values: postData };
      dispatch(createInspection(payload));
      dispatch(resetCreateUser());
    }
  }, [createUserInfo]);

  const onBulkSubmit = () => {
    if (!editId) {
      const assetLength = formValues?.category_type === 'ah' ? spaces && spaces.length : equipments && equipments.length;
      const categoryName = formValues?.category_type === 'e' ? formValues?.check_list_id && formValues?.check_list_id.name : formValues?.check_list_id && formValues?.check_list_id.name;
      const commenceOn = formValues.commences_on ? moment(formValues.commences_on.$d).utc().format('YYYY-MM-DD') : false;
      const startSAt = getArrayToCommaValuesTime(formValues?.starts_at, 'value');
      const payloadData = {
        name: `${categoryName}-${assetLength}-${commenceOn}-${startSAt}`,
        company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
      };
      const loadData = { model: appModels.INSPECTIONCHECKLISTGROUP, values: payloadData };
      dispatch(createUser(appModels.INSPECTIONCHECKLISTGROUP, loadData));
    } else {
      onSingleUpdate();
    }
  };

  const onReset = () => {
    setBulkEvents([]);
    setSpaces([]);
    setEquipments([]);
    setActiveStep(0);
    dispatch(resetCreateInspection());
    dispatch(resetUpdateScheduler());
    dispatch(resetCreateUser());
    setFormValues({
      category_type: 'e',
      ppm_by: 'Space Category',
      commences_on: null,
      category_id: '',
      maintenance_team_id: '',
      space_id: '',
      equipment_id: '',
      task_id: '',
      check_list_id: '',
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
      at_start_mro: false,
      at_done_mro: false,
      at_review_mro: false,
      enforce_time: true,
      nfc_scan_at_start: false,
      nfc_scan_at_done: false,
      qr_scan_at_start: false,
      qr_scan_at_done: false,
      is_exclude_holidays: false,
      is_missed_alert: false,
      starts_at: !editId ? [] : { value: '1:00', label: '1:00' },
      description: '',
      duration: { value: '01:00', label: '01:00' },
      min_duration: '',
      max_duration: '',
      is_enable_time_tracking: false,
      ends_on: null,
    });

    history.push(window.location.pathname);
    onClose();
  };

  function getNoOfInspections(schedules, assets) {
    let res = 0;
    if (schedules && assets) {
      res = schedules * assets;
    }
    return res;
  }

  return (
    <Box sx={{
      background: 'white',
      height: '100%',
      overflow: 'auto',
    }}
    >

      {addInspectionScheduleInfo && !addInspectionScheduleInfo.data && !addInspectionScheduleInfo.loading && !createUserInfo.loading && (
        <>
          {activeStep !== 2 && (
          <>
            <AddAssets editId={editId} spaces={spaces} setSpaces={setSpaces} formValues={formValues} setFormValues={setFormValues} equipments={equipments} setEquipments={setEquipments} />
            <AddScheduleConfiguration equipments={equipments} spaces={spaces} editId={editId} setBulkEvents={setBulkEvents} bulkEvents={bulkEvents} formValues={formValues} setFormValues={setFormValues} />
          </>
          )}
          {!editId && activeStep === 2 && (
          <Summary formValues={formValues} equipments={equipments} spaces={spaces} bulkEvents={bulkEvents} />
          )}

          <div className="float-right sticky-button-85drawer z-Index-1099">
            {(addInspectionScheduleInfo && addInspectionScheduleInfo.err) && (
            <div className="text-center mt-3">
              <SuccessAndErrorFormat response={addInspectionScheduleInfo} />
            </div>
            )}
            {(updatePpmSchedulerInfo && updatePpmSchedulerInfo.err) && (
              <div className="text-center">
                <SuccessAndErrorFormat response={updatePpmSchedulerInfo} />
              </div>
            )}
            {(updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && (
            <div className="text-center">
              <SuccessAndErrorFormat response={updatePpmSchedulerInfo} successMessage="This Inspection Schedule has been updated successfully..." />
            </div>
            )}
            {updatePpmSchedulerInfo && updatePpmSchedulerInfo.loading && (
            <div className="text-center">
              <Loader />
            </div>
            )}
            {activeStep === 2 && !editId && (
            <Button
              type="button"
              sx={{
                color: 'white',
                marginLeft: '12px',
              }}
              onClick={() => setActiveStep(activeStep - 1)}
              variant="contained"
              className="mr-3 reset-btn"
            >
              Back
            </Button>
            )}
            {!(updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && (
            <Button
              type="button"
              sx={{
                color: 'white',
                float: 'right',
                marginRight: '12px',
              }}
              disabled={isDisabled()}
              onClick={() => (activeStep === 2 || editId ? onBulkSubmit() : setActiveStep(2))}
              variant="contained"
              className="float-right"
            >
              {activeStep === 2 ? 'Confirm & Create Inspections' : `${editId ? 'Update Inspection' : 'Preview & Create Inspections'}`}
            </Button>
            )}
            {editId && (updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && (
            <Button
              type="button"
              onClick={() => onReset()}
              variant="contained"
              className="float-right"
            >
              Ok
            </Button>
            )}
          </div>
        </>
      )}
      {addInspectionScheduleInfo && (addInspectionScheduleInfo.loading || createUserInfo.loading) && (
      <div className="text-center mt-3 p-5 ">
        <Loader />
      </div>
      )}
      {addInspectionScheduleInfo && addInspectionScheduleInfo.data && (
      <div className="text-center mt-3 p-5 ">
        <Box
          sx={{
            width: '100%',
          }}
          className="vertical-horizontal-center"
        >
          <Stack>
            <Alert severity="info">
              <AlertTitle className="font-family-tab font-weight-800">
                The Inspection has been created Successfully.
                <br />
                Please find the details below
              </AlertTitle>
              <div className="p-3">
                <Row className="">
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-2">Number of Assets</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-0">{formValues.category_type === 'e' ? equipments.length : spaces && spaces.length > 0 ? spaces.length : 0}</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-2">Number of Inspections</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-0">{getNoOfInspections(formValues.starts_at && formValues.starts_at.length, formValues.category_type === 'e' ? equipments.length : spaces && spaces.length > 0 ? spaces.length : 0)}</p>
                  </Col>
                </Row>
              </div>
            </Alert>
          </Stack>
        </Box>
        <Button
          type="button"
          sx={{
            color: 'white',
          }}
          className="text-center mt-3"
          onClick={() => onReset()}
          variant="contained"
        >
          View Inspections
        </Button>
      </div>
      )}
    </Box>
  );
};

export default AddInspectionNew;
