import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import moment from 'moment';
import dayjs from 'dayjs';
import InspectionIcon from '@images/sideNavImages/inspection_black.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import FormWizard from '../../../commonComponents/ReactFormWizard/appForm';
import selectAssets from './selectAssetsForm';
import planTheSchedule from './planTheScheduleMulti';
import Preview from './preview';
import { getArrayNewFormatUpdateDelete, extractValueObjects } from '../../../util/appUtils';
import {
  createInspection,
} from '../../../inspectionSchedule/inspectionService';
import {
  updatePPMScheduler,
} from '../../../preventiveMaintenance/ppmService';
import {
  createUser, storeModifiedData,
} from '../../setupService';
import { getAuditAction } from '../../../auditSystem/auditService';

const appModels = require('../../../util/appModels').default;

const maintenanceForm = ({ afterReset, editId, editData }) => {
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [values, setAllValues] = React.useState(false);
  const [mode, setMode] = React.useState(false);
  const {
    addInspectionScheduleInfo,
  } = useSelector((state) => state.inspection);
  const { auditAction } = useSelector((state) => state.audit);
  const { userInfo } = useSelector((state) => state.user);

  const {
    createUserInfo,
  } = useSelector((state) => state.setup);
  const {
    updatePpmSchedulerInfo,
  } = useSelector((state) => state.ppm);

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

  const getBulkId = (categoryType, bData, assetId) => {
    let bulkId = bData.filter((item2) => item2.space_id?.id === assetId);
    if (categoryType === 'e') {
      bulkId = bData.filter((item2) => item2.equipment_id?.id === assetId);
    }
    let bId = false;
    if (bulkId && bulkId.length) {
      bId = bulkId[0].id;
    }
    return bId;
  };

  const getArrayModifyBulkLines = (array, team, checklist, duration, startsAt, categoryType, bulkData) => {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const p = array[i];
        const pObj = {};
        if (categoryType === 'ah') {
          pObj.space_id = p.id;
          if (editId) {
            pObj.id = getBulkId(categoryType, bulkData, p.id);
          }
        }
        if (categoryType === 'e') {
          pObj.equipment_id = p.id;
          if (editId) {
            pObj.id = getBulkId(categoryType, bulkData, p.id);
          }
        }
        pObj.team = extractValueObjects(team);
        pObj.maintenance_team_id = extractValueObjects(team);
        pObj.check_list_id = extractValueObjects(checklist);
        pObj.duration = parseFloat(duration && duration.value);
        pObj.starts_at = getArrayToCommaValuesTime(startsAt, 'value');
        newData.push(pObj);
      }
    }
    return newData;
  };

  useEffect(() => {
    if (mode === 'finish' && (userInfo && userInfo.data) && (addInspectionScheduleInfo && addInspectionScheduleInfo.data && !addInspectionScheduleInfo.err && !addInspectionScheduleInfo.loading)) {
      const bulkInspectionId = addInspectionScheduleInfo.data.length && addInspectionScheduleInfo.data[0];
      dispatch(getAuditAction(bulkInspectionId, 'create_schedules', appModels.INSPECTIONCHECKBULK));
    }
    if (mode === 'finish' && (userInfo && userInfo.data) && (updatePpmSchedulerInfo && updatePpmSchedulerInfo.data && !updatePpmSchedulerInfo.err && !updatePpmSchedulerInfo.loading)) {
      const bulkInspectionId = updatePpmSchedulerInfo.data.length && updatePpmSchedulerInfo.data[0];
      dispatch(getAuditAction(bulkInspectionId, 'create_schedules', appModels.INSPECTIONCHECKBULK));
    }
  }, [addInspectionScheduleInfo, updatePpmSchedulerInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (isOpenSuccessAndErrorModalWindow && editId)) {
      if (values.typeValue && values.typeValue.id === 'Inspection') {
        const categoryType = values?.type;
        const inspectionData = values?.inspectionData && values?.inspectionData.length ? values?.inspectionData[0] : false;
        const equipment = values?.equipmentValue;
        const space = values?.spaceValue;
        let bulkLines = [];
        if (categoryType === 'ah') {
          bulkLines = getArrayModifyBulkLines(space, values?.teamData, values?.checklistData, inspectionData?.duration, inspectionData?.starts_at, categoryType, values?.bulkData);
        }
        if (categoryType === 'e') {
          bulkLines = getArrayModifyBulkLines(equipment, values?.teamData, values?.checklistData, inspectionData?.duration, inspectionData?.starts_at, categoryType, values?.bulkData);
        }
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
          commences_on: values.commenceOn ? moment(values.commenceOn.$d).utc().format('YYYY-MM-DD') : false,
          ends_on: values.ends_on ? moment(inspectionData?.ends_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false,
          bulk_lines: getArrayNewFormatUpdateDelete(bulkLines),
          category_type: categoryType === 'e' ? 'Equipment' : 'Space',
          description: inspectionData?.description,
          bulk_inspection_json: values?.bulkJson,
          task_id: extractValueObjects(values?.operation),
        };
        dispatch(updatePPMScheduler(editId, appModels.INSPECTIONCHECKBULK, postData));
      }
    }
  }, [isOpenSuccessAndErrorModalWindow]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (createUserInfo && createUserInfo.data && !createUserInfo.err && !createUserInfo.loading)) {
      if (values.typeValue && values.typeValue.id === 'Inspection') {
        const categoryType = values?.type;
        const inspectionData = values?.inspectionData && values?.inspectionData.length ? values?.inspectionData[0] : false;
        const equipment = values?.equipmentValue;
        const space = values?.spaceValue;
        let bulkLines = [];
        if (categoryType === 'ah') {
          bulkLines = getArrayModifyBulkLines(space, values?.teamData, values?.checklistData, inspectionData?.duration, inspectionData?.starts_at, categoryType);
        }
        if (categoryType === 'e') {
          bulkLines = getArrayModifyBulkLines(equipment, values?.teamData, values?.checklistData, inspectionData?.duration, inspectionData?.starts_at, categoryType);
        }
        const postData = {
          // duration: parseFloat(inspectionData?.duration),
          // starts_at: parseFloat(inspectionData?.starts_at),
          // remind_before: parseFloat(values.remind_before),
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
          commences_on: values.commenceOn ? moment(values.commenceOn.$d).utc().format('YYYY-MM-DD') : false,
          ends_on: values.ends_on ? moment(inspectionData?.ends_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false,
          group_id: createUserInfo.data.length && createUserInfo.data[0],
          bulk_lines: getArrayNewFormatUpdateDelete(bulkLines),
          category_type: categoryType === 'e' ? 'Equipment' : 'Space',
          // priority: '1',
          description: inspectionData?.description,
          bulk_inspection_json: values?.bulkJson,
          task_id: extractValueObjects(values?.operation),
          company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
        };
        const payload = { model: appModels.INSPECTIONCHECKBULK, values: postData };
        dispatch(createInspection(payload));
      }
    }
  }, [createUserInfo]);

  useEffect(() => {
    if (values && Object.keys(values).length > 0 && !editId) {
      const assetLength = values?.type === 'ah' ? values?.spaceValue && values?.spaceValue.length : values?.equipmentValue && values?.equipmentValue.length;
      const categoryName = values?.type === 'e' ? values?.category && values?.category.path_name : values?.category && values?.category.name;
      const commenceOn = values.commenceOn ? moment(values.commenceOn.$d).utc().format('YYYY-MM-DD') : false;
      const startSAt = getArrayToCommaValuesTime(values?.inspectionData && values?.inspectionData.length && values?.inspectionData[0].starts_at, 'value');
      const payloadData = {
        name: `${categoryName}-${assetLength}-${commenceOn}-${startSAt}`,
        company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
      };
      const loadData = { model: appModels.INSPECTIONCHECKLISTGROUP, values: payloadData };
      dispatch(createUser(appModels.INSPECTIONCHECKLISTGROUP, loadData));
      setIsOpenSuccessAndErrorModalWindow(true);
    } else if (values && Object.keys(values).length > 0 && editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
    }
  }, [values]);

  const handleReset = () => {
    setIsOpenSuccessAndErrorModalWindow(false);
    afterReset();
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const getObjectCombine = (array) => {
    const newArray = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        if (Object.keys(array[i].equipment_id).length) {
          newArray.push(array[i].equipment_id);
        }
        if (Object.keys(array[i].space_id).length) {
          newArray.push(array[i].space_id);
        }
      }
    }
    return newArray;
  };

  function generateTimeDurationsOnlyHours(hours) {
    const times = [];

    const myArr = hours && hours.split(',');
    for (let i = 0; i < myArr.length; i += 1) {
      const time = `${myArr[i]}:00`;
      times.push({ value: time, label: time });
    }
    return times;
  }

  function generateTimeDurationsModify(hours) {
    const time = `${hours < 10 ? `0${hours}` : hours}:00`;
    return { value: time, label: time };
  }

  useEffect(() => {
    // This is just an example; you can use this to set the selectionModel dynamically
    if (editId) {
      const commonData = editData;
      const bulkData = commonData?.bulk_lines;
      const bulkJson = commonData?.bulk_inspection_json && (commonData?.bulk_inspection_json).replace(/'/g, '"');
      const bulkjsondata = JSON.parse(bulkJson);
      dispatch(storeModifiedData({
        equipmentValue: getObjectCombine(bulkData),
        spaceValue: getObjectCombine(bulkData),
        bulkData,
        state: commonData?.state,
        bulkJson: bulkjsondata,
        teamData: commonData?.category_type === 'Equipment'
          ? (bulkData.length && bulkData[0]?.maintenance_team_id)
          : (bulkData.length && bulkData[0]?.maintenance_team_id),
        checklistData: commonData?.category_type === 'Equipment'
          ? (bulkData.length && bulkData[0]?.check_list_id)
          : (bulkData.length && bulkData[0]?.check_list_id),
        type: commonData?.category_type === 'Equipment' ? 'e' : 'ah',
        commenceOn: dayjs(commonData?.commences_on) || null,
        operation: commonData?.task_id?.id ? commonData?.task_id : '',
        category: commonData?.category_type === 'Equipment'
          ? (bulkData.length && bulkData[0].equipment_id?.category_id)
          : (bulkData.length && bulkData[0].space_id?.asset_category_id),
        typeValue: { id: 'Inspection', name: 'Daily Inspection', subName: 'These are daily Preventive Maintenance activities' },
        inspectionData: [{
          duration: generateTimeDurationsModify(bulkData.length && bulkData[0].duration),
          min_duration: commonData?.min_duration || '',
          max_duration: commonData?.max_duration || '',
          is_enable_time_tracking: commonData?.is_enable_time_tracking || 0,
          starts_at: generateTimeDurationsOnlyHours(bulkData.length && bulkData[0].starts_at),
          mo: commonData?.mo || 0,
          tu: commonData?.tu || 0,
          we: commonData?.we || 0,
          th: commonData?.th || 0,
          fr: commonData?.fr || 0,
          sa: commonData?.sa || 0,
          su: commonData?.su || 0,
          at_start_mro: commonData?.at_start_mro || 0,
          at_done_mro: commonData?.at_done_mro || 0,
          at_review_mro: commonData?.at_review_mro || 0,
          enforce_time: commonData?.enforce_time || true,
          is_allow_future: commonData?.is_allow_future || 0,
          is_allow_past: commonData?.is_allow_past || 0,
          nfc_scan_at_start: commonData?.nfc_scan_at_start || 0,
          nfc_scan_at_done: commonData?.nfc_scan_at_done || 0,
          qr_scan_at_start: commonData?.qr_scan_at_start || 0,
          qr_scan_at_done: commonData?.qr_scan_at_done || 0,
          is_exclude_holidays: commonData?.is_exclude_holidays || 0,
          is_missed_alert: commonData?.is_missed_alert || 0,
          ends_on: commonData?.ends_on || null,
          description: commonData?.description || '',
        }],
      }));
    }
  }, [editId]);

  return (
    <>
      <FormWizard
        setAllValues={setAllValues}
        setMode={setMode}
        onComplete={(data) => { setMode('finish'); setAllValues(data); }}
        onDraft={(data) => { setMode('draft'); setAllValues(data); }}
        editValue={[{ editId, editData }]}
        steps={[
          { id: 'Step 1', component: selectAssets, name: 'Select Assets' },
          { id: 'Step 2', component: planTheSchedule, name: 'Plan the Schedule' },
          { id: 'Step 3', component: Preview, name: 'Preview and Submit/Publish' },
        ]}
      />
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        type={editId ? 'update' : 'create'}
        successOrErrorData={editId ? updatePpmSchedulerInfo : addInspectionScheduleInfo}
        headerImage={InspectionIcon}
        headerText="Inspection Schedule"
        successRedirect={handleReset}
      />
    </>
  );
};
export default maintenanceForm;
