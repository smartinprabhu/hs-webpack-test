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
  getMenuItems, getDynamicTabs,
  getActiveTab, getHeaderTabs, getTabs,
  extractValueObjects, getColumnArrayById,
  getDateLocalMuI, generateErrorMessage,
} from '../../util/appUtils';
import { updateHeaderData } from '../../core/header/actions';
import PPMSideNav from '../navbar/navlist.json';
import { AddThemeColor } from '../../themes/theme';
import AddAssets from './forms/addAssetsNew';
import AddScheduleConfiguration from './addScheduleConfiguration';
import Summary from './summary';
import adminSetupNav from '../../adminSetup/navbar/navlistSite.json';
import { setCurrentTab } from '../../inventory/inventoryService';
import {
  createBulkPreventive, resetBulkPreventive, updatePPMScheduler, resetUpdateScheduler,
} from '../ppmService';

const AddPPMsNew = ({
  isAdminSetup = false, onClose, editId, editData,
}) => {
  const subMenu = 'PPM Viewer';
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { bulkPPMCreate, updatePpmSchedulerInfo } = useSelector((state) => state.ppm);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], '52 Week PPM', 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);
  const history = useHistory();

  const headerTabs = isAdminSetup ? getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  ) : getHeaderTabs(
    userRoles?.data?.allowed_modules,
    '52 Week PPM',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    if (isAdminSetup) {
      tabs = getTabs(headerTabs[0].menu, adminSetupNav.data);
      activeTab = getActiveTab(
        tabs.filter((e) => e),
        'Maintenance',
      );
    } else {
      const tabsDef = getTabs(headerTabs[0].menu, PPMSideNav.data);
      let dynamicList = headerTabs[0].menu.filter((item) => !(PPMSideNav && PPMSideNav.data && PPMSideNav.data[item.name]) && item.name !== 'Help');
      dynamicList = getDynamicTabs(dynamicList, '/preventive-overview/dynamic-report');
      const tabsList = [...tabsDef, ...dynamicList];
      tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
      activeTab = getActiveTab(
        tabs.filter((e) => e),
        'Viewer',
      );
    }
  }
  useEffect(() => {
    dispatch(
      updateHeaderData(isAdminSetup ? {
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Maintenance',
        link: '/maintenance',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      } : {
        module: '52 Week PPM',
        moduleName: '52 Week PPM',
        menuName: 'Viewer',
        link: '/preventive-overview/preventive-viewer',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    dispatch(resetBulkPreventive());
    dispatch(resetUpdateScheduler());
  }, []);


  const getLastDateOfCurrentYear = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 11, 31); // Month is 0-indexed: 11 = December
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
    name: '',
    year: new Date().getFullYear().toString(),
    category_type: 'e',
    performed_by: 'Internal',
    ppm_by: 'Space Category',
    category_id: '',
    maintenance_team_id: '',
    task_id: '',
    schedule_period_id: '',
    at_start_mro: false,
    at_done_mro: false,
    qr_scan_at_start: false,
    qr_scan_at_done: false,
    is_service_report_required: false,
    recurrency: true,
    interval: 1,
    rrule_type: 'monthly',
    weekno: 'First',
    vendor_id: '',
    deadline: dayjs(getLastDateOfCurrentYear()),
    starts_on: dayjs(getNextWeekStartEnd().start),
    ends_on: dayjs(getNextWeekStartEnd().end),
  });
  const [equipments, setEquipments] = React.useState([]);
  const [spaces, setSpaces] = React.useState([]);

  useEffect(() => {
    if (editId && editData) {
      setFormValues({
        name: '',
        year: new Date().getFullYear().toString(),
        category_type: editData.category_type,
        performed_by: editData.performed_by,
        ppm_by: 'Checklist',
        category_id: '',
        maintenance_team_id: editData.maintenance_team_id,
        equipment_id: editData.equipment_id,
        space_id: editData.space_id,
        task_id: editData.task_id,
        schedule_period_id: editData.schedule_period_id,
        at_start_mro: editData.at_start_mro,
        at_done_mro: editData.at_done_mro,
        qr_scan_at_start: editData.qr_scan_at_start,
        qr_scan_at_done: editData.qr_scan_at_done,
        is_service_report_required: editData.is_service_report_required,
        recurrency: false,
        interval: 1,
        rrule_type: 'monthly',
        weekno: 'First',
        vendor_id: editData.vendor_id,
        deadline: dayjs(getLastDateOfCurrentYear()),
        starts_on: dayjs(moment.utc(editData.starts_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD')),
        ends_on: dayjs(moment.utc(editData.ends_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD')),
      });
    }
  }, [editId, editData]);

  const assetValidationNew = formValues && !((formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id) || (formValues.ppm_by === 'Checklist' && formValues.task_id && formValues.task_id.id));

  const assetValidation = formValues && !(formValues.year && ((formValues.category_type === 'e' && equipments.length > 0) || (formValues.category_type === 'ah' && spaces.length > 0)));
  const scheduleValidation = formValues && !(formValues.performed_by && formValues.maintenance_team_id && formValues.schedule_period_id);

  const assetValidationUpdate = formValues && !(formValues.task_id && formValues.task_id.id && ((formValues.category_type === 'e' && (formValues.equipment_id && formValues.equipment_id.id)) || (formValues.category_type === 'ah' && (formValues.space_id && formValues.space_id.id))));

  function isDisabled() {
    let res = false;
    if (!editId) {
      if (assetValidation || scheduleValidation || assetValidationNew) {
        res = true;
      }
    } else {
      res = (updatePpmSchedulerInfo && updatePpmSchedulerInfo.loading) || scheduleValidation || assetValidationUpdate;
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

  const onSingleUpdate = () => {
    const postData = {
      category_type: formValues.category_type,
      performed_by: formValues.performed_by,
      maintenance_team_id: extractValueObjects(formValues.maintenance_team_id),
      equipment_id: extractValueObjects(formValues.equipment_id),
      space_id: extractValueObjects(formValues.space_id),
      task_id: extractValueObjects(formValues.task_id),
      schedule_period_id: extractValueObjects(formValues.schedule_period_id),
      at_start_mro: formValues.at_start_mro,
      at_done_mro: formValues.at_done_mro,
      qr_scan_at_start: formValues.qr_scan_at_start,
      qr_scan_at_done: formValues.qr_scan_at_done,
      is_service_report_required: formValues.is_service_report_required,
      vendor_id: extractValueObjects(formValues.vendor_id),
      starts_on: checkExDatehasObject(formValues.starts_on),
      ends_on: checkExDatehasObject(formValues.ends_on),
    };

    dispatch(updatePPMScheduler(editId, 'ppm.scheduler_week', postData));
  };

  const onBulkSubmit = () => {
    if (!editId) {
      let payload = [];
      if (formValues.performed_by && formValues.performed_by === 'Internal') {
        if (formValues.recurrency) {
          const newPostData = bulkEvents.map((cl) => {
            // Calculate the new start and end dates
            const updatedStartDate = checkExDatehasObject(cl.start);
            const updatedEndDate = checkExDatehasObject(cl.end);

            return {
              year: formValues.year,
              company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id,
              category_type: formValues.category_type,
              performed_by: formValues.performed_by,
              maintenance_team_id: extractValueObjects(formValues.maintenance_team_id),
              task_id: extractValueObjects(formValues.task_id),
              schedule_period_id: extractValueObjects(formValues.schedule_period_id),
              at_start_mro: formValues.at_start_mro,
              at_done_mro: formValues.at_done_mro,
              qr_scan_at_start: formValues.qr_scan_at_start,
              qr_scan_at_done: formValues.qr_scan_at_done,
              is_service_report_required: formValues.is_service_report_required,
              equipment_ids: formValues.category_type === 'e' ? [6, 0, getColumnArrayById(equipments, 'id')] : [6, 0, []],
              location_ids: formValues.category_type === 'ah' ? [6, 0, getColumnArrayById(spaces, 'id')] : [6, 0, []],
              schedules: [{ starts_on: updatedStartDate, ends_on: updatedEndDate }], // Overwrite with new start date
            };
          });
          payload = newPostData;
        } else {
          payload = [
            {
              year: formValues.year,
              company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id,
              category_type: formValues.category_type,
              performed_by: formValues.performed_by,
              maintenance_team_id: extractValueObjects(formValues.maintenance_team_id),
              task_id: extractValueObjects(formValues.task_id),
              schedule_period_id: extractValueObjects(formValues.schedule_period_id),
              at_start_mro: formValues.at_start_mro,
              at_done_mro: formValues.at_done_mro,
              qr_scan_at_start: formValues.qr_scan_at_start,
              qr_scan_at_done: formValues.qr_scan_at_done,
              is_service_report_required: formValues.is_service_report_required,
              equipment_ids: formValues.category_type === 'e' ? [6, 0, getColumnArrayById(equipments, 'id')] : [6, 0, []],
              location_ids: formValues.category_type === 'ah' ? [6, 0, getColumnArrayById(spaces, 'id')] : [6, 0, []],
              schedules: [{ starts_on: checkExDatehasObject(formValues.starts_on), ends_on: checkExDatehasObject(formValues.ends_on) }], // Overwrite with new start date
            },
          ];
        }
      } else if (formValues.performed_by && formValues.performed_by === 'External') {
        if (formValues.recurrency) {
          const newPostData = bulkEvents.map((cl) => {
            // Calculate the new start and end dates
            const updatedStartDate = checkExDatehasObject(cl.start);
            const updatedEndDate = checkExDatehasObject(cl.end);

            return {
              year: formValues.year,
              company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id,
              category_type: formValues.category_type,
              performed_by: formValues.performed_by,
              maintenance_team_id: extractValueObjects(formValues.maintenance_team_id),
              task_id: extractValueObjects(formValues.task_id),
              vendor_id: extractValueObjects(formValues.vendor_id),
              schedule_period_id: extractValueObjects(formValues.schedule_period_id),
              at_start_mro: formValues.at_start_mro,
              at_done_mro: formValues.at_done_mro,
              qr_scan_at_start: formValues.qr_scan_at_start,
              qr_scan_at_done: formValues.qr_scan_at_done,
              is_service_report_required: formValues.is_service_report_required,
              equipment_ids: formValues.category_type === 'e' ? [6, 0, getColumnArrayById(equipments, 'id')] : [6, 0, []],
              location_ids: formValues.category_type === 'ah' ? [6, 0, getColumnArrayById(spaces, 'id')] : [6, 0, []],
              schedules: [{ starts_on: updatedStartDate, ends_on: updatedEndDate }], // Overwrite with new start date
            };
          });
          payload = newPostData;
        } else {
          payload = [
            {
              year: formValues.year,
              company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id,
              category_type: formValues.category_type,
              performed_by: formValues.performed_by,
              maintenance_team_id: extractValueObjects(formValues.maintenance_team_id),
              task_id: extractValueObjects(formValues.task_id),
              vendor_id: extractValueObjects(formValues.vendor_id),
              schedule_period_id: extractValueObjects(formValues.schedule_period_id),
              at_start_mro: formValues.at_start_mro,
              at_done_mro: formValues.at_done_mro,
              qr_scan_at_start: formValues.qr_scan_at_start,
              qr_scan_at_done: formValues.qr_scan_at_done,
              is_service_report_required: formValues.is_service_report_required,
              equipment_ids: formValues.category_type === 'e' ? [6, 0, getColumnArrayById(equipments, 'id')] : [6, 0, []],
              location_ids: formValues.category_type === 'ah' ? [6, 0, getColumnArrayById(spaces, 'id')] : [6, 0, []],
              schedules: [{ starts_on: checkExDatehasObject(formValues.starts_on), ends_on: checkExDatehasObject(formValues.ends_on) }], // Overwrite with new start date
            },
          ];
        }
      }
      const result = { values: payload };
      dispatch(createBulkPreventive(result));
    } else {
      onSingleUpdate();
    }
  };

  const onReset = () => {
    setBulkEvents([]);
    setSpaces([]);
    setEquipments([]);
    setActiveStep(0);
    dispatch(resetBulkPreventive());
    dispatch(resetUpdateScheduler());
    setFormValues({
      name: '',
      year: new Date().getFullYear().toString(),
      category_type: 'e',
      performed_by: 'Internal',
      maintenance_team_id: '',
      task_id: '',
      schedule_period_id: '',
      at_start_mro: false,
      at_done_mro: false,
      qr_scan_at_start: false,
      qr_scan_at_done: false,
      is_service_report_required: false,
      recurrency: false,
      interval: 1,
      rrule_type: 'monthly',
      weekno: 'First',
      vendor_id: '',
      deadline: dayjs(getLastDateOfCurrentYear()),
      starts_on: dayjs(getNextWeekStartEnd().start),
      ends_on: dayjs(getNextWeekStartEnd().end),
    });

    if (onClose) onClose();
  };

  return (
    <Box sx={{
      background: 'white',
      height: '100%',
      overflow: 'auto',
    }}
    >

      {bulkPPMCreate && !bulkPPMCreate.data && !bulkPPMCreate.loading && (
        <>
          {activeStep !== 2 && (
          <>
            <AddAssets editId={editId} spaces={spaces} setSpaces={setSpaces} formValues={formValues} setFormValues={setFormValues} equipments={equipments} setEquipments={setEquipments} />
            <AddScheduleConfiguration equipments={equipments} spaces={spaces} editId={editId} setBulkEvents={setBulkEvents} bulkEvents={bulkEvents} formValues={formValues} setFormValues={setFormValues} />
          </>
          )}
          {activeStep === 2 && (
          <Summary formValues={formValues} equipments={equipments} spaces={spaces} bulkEvents={bulkEvents} />
          )}

          <div className="float-right sticky-button-85drawer z-Index-1099">
            {(bulkPPMCreate && bulkPPMCreate.err) && (
            <div className="text-center">
              <SuccessAndErrorFormat response={bulkPPMCreate} />
            </div>
            )}
            {(updatePpmSchedulerInfo && updatePpmSchedulerInfo.err) && (
            <div className="text-center">
              <SuccessAndErrorFormat response={updatePpmSchedulerInfo} />
            </div>
            )}
            {(updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && (
            <div className="text-center">
              <SuccessAndErrorFormat response={updatePpmSchedulerInfo} successMessage="This PPM Schedule has been updated successfully..." />
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
              disabled={isDisabled()}
              onClick={() => (activeStep === 2 || editId ? onBulkSubmit() : setActiveStep(2))}
              variant="contained"
              className="float-right"
            >
              {activeStep === 2 ? 'Confirm & Create PPMs' : `${editId ? 'Update PPM' : 'Preview & Create PPMs'}`}
            </Button>
            )}
            {editId && onClose && (updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) && (
            <Button
              type="button"
              onClick={() => onClose()}
              variant="contained"
              className="float-right"
            >
              Ok
            </Button>
            )}
          </div>
        </>
      )}
      {bulkPPMCreate && bulkPPMCreate.loading && (
      <div className="text-center mt-3 p-5 ">
        <Loader />
      </div>
      )}
      {bulkPPMCreate && bulkPPMCreate.data && (
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
                The PPMs has been created Successfully.
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
                    <p className="font-family-tab mb-2">Number of PPMs</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-0">{formValues.recurrency && bulkEvents && bulkEvents.length > 0 ? bulkEvents.length : 1}</p>
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
          View PPMs
        </Button>
      </div>
      )}
    </Box>
  );
};

export default AddPPMsNew;
