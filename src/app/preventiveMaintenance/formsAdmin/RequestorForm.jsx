/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  FormControl,
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getTeamList } from '../../assets/equipmentService';
import MuiDatePicker from '../../commonComponents/multipleFormFields/muiDatePicker';
import Selection from '../../commonComponents/multipleFormFields/selectionMultiple';
import preventiveActions from '../data/preventiveActions.json';
import { infoValue } from '../../adminSetup/utils/utils';

import {
  extractOptionsObject,
  getAllowedCompanies,
  getWeeks,
  generateTimeDurations,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

dayjs.extend(utc);
dayjs.extend(timezone);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const RequestorForm = (props) => {
  const {
    index,
    formData,
    setPartsData,
    partsData,
    setPartsAdd,
    setFieldValue,
    formField,
  } = props;
  const dispatch = useDispatch();
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');

  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [customerKeyword, setCustomerKeyword] = useState('');

  const [teamOptions, setTeamOptions] = useState([]);
  const { userInfo } = useSelector((state) => state.user);
  // const companies = getAllowedCompanies(userInfo);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  const {
    taskInfo, checkList, checklistGroup, parentScheduleInfo,
  } = useSelector((state) => state.ppm);
  const { teamsInfo, employeesInfo } = useSelector((state) => state.equipment);
  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    createTenantinfo, allowedCompanies,
  } = useSelector((state) => state.setup);

  // const defaultCommenceOn = commences_on ? dayjs(moment.utc(commences_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;
  // const defaultEndsOn = ends_on ? dayjs(moment.utc(ends_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;

  // const [selectedEndsOnDate, setEndsOnDateChange] = useState(defaultEndsOn);
  // const [selectedCommenseDate, setCommenseDateChange] = useState(defaultCommenceOn);

  const handleCommenseDateChange = (e) => {
    const newData = partsData;
    newData[index].commences_on = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onTextFieldChange = (e, indexV, field) => {
    const newData = partsData;
    if (field === 'start_at' || field === 'duration') {
      newData[indexV].description = `Starts at ${formData.starts_at} for ${formData.duration}`;
    }
    newData[indexV][field] = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  };

  const onDropdownChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { id: e.id, name: name ? e[name] : e.name };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDateChange = (e, indexV, field, name) => {
    const newData = partsData;
    if (field === 'starts_on') {
      const weekNo = dayjs(e).week(); // Calculate the week number
      newData[indexV].week = `Wk${weekNo}`;
    }
    newData[indexV][field] = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDropdownCustom = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { value: e && e.value ? e.value : '', label: e && e.label ? e.label : '' };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const timeDurations = generateTimeDurations(15);

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <MuiDatePicker
          sx={{
            width: '30%',
            marginBottom: '20px',
          }}
          label={(
              <>
                {formField.startingDate.label}
                {infoValue('starts_on')}
              </>
            )}
          value={(formData[formField.startingDate.name])}
          onChange={(e) => onDateChange(e, index, formField.startingDate.name)}
         // minDate={dayjs(new Date())}
        />
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {formField.endDate.label}
                {infoValue('ends_on')}
              </>
            )}
            value={(formData[formField.endDate.name])}
            onChange={(e) => onDateChange(e, index, formField.endDate.name)}
          // minDate={dayjs(new Date())}
          />
           <FormControl
             sx={{
               width: '30%',
               marginTop: 'auto',
               marginBottom: '20px',
             }}
             variant="standard"
           >
            <Selection
              paramsSet={(e) => onDropdownCustom(e, index, 'duration')}
              paramsValue={formData.duration}
              paramsId={Math.random()}
              dropdownOptions={timeDurations}
              labelName="Duration(Hours)"
              placeholderText="00:00 (HH:MM)"
              infoText="duration"
              sx={{
                width: '100%',
                marginTop: '9px',
              }}
              isCustomData
              isRequired
            />
             {/* <TextField
               variant="standard"
               size="small"
               type="text"
               name={formField.Duration.name}
               label={(
              <>
                Duration(Hours)
                <span className="text-danger ml-1">*</span>
                {infoValue('duration')}
              </>
                )}
               className="bg-white"
               placeholder="00:00 (HH:MM)"
               value={formData.duration}
               onKeyDown={decimalKeyPressDown}
               InputLabelProps={{ shrink: true }}
               onChange={(e) => onTextFieldChange(e, index, 'duration')}
               inputProps={{ maxLength: 5 }}
             /> */}
           </FormControl>
           <FormControl
             sx={{
               width: '30%',
               marginTop: 'auto',
               marginBottom: '20px',
             }}
             variant="standard"
           >
             <Selection
               paramsSet={(e) => onDropdownCustom(e, index, 'week')}
               paramsValue={formData.week}
               paramsId={Math.random()}
               dropdownOptions={getWeeks()}
               labelName="Week"
               placeholderText="00:00 (HH:MM)"
               infoText="week"
               sx={{
                 width: '100%',
                 marginTop: '9px',
               }}
               isCustomData
               isRequired
             />
             {/* <TextField
               variant="standard"
               size="small"
               type="text"
               name={formField.Week.name}
               label={(
              <>
                Week
                <span className="text-danger ml-1">*</span>
                {infoValue('week')}
              </>
                )}
               className="bg-white"
               value={formData.week}
               // onKeyDown={decimalKeyPressDown}
               InputLabelProps={{ shrink: true }}
               onChange={(e) => onTextFieldChange(e, index, 'week')}
               inputProps={{ maxLength: 5 }}
             /> */}
           </FormControl>
            <FormControl
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
               <Selection
                 paramsSet={(e) => onDropdownChange(e, index, 'maintenance_team_id')}
                 paramsValue={formData.maintenance_team_id && formData.maintenance_team_id.name ? formData.maintenance_team_id.name : ''}
                 paramsId={Math.random()}
                 callData={getTeamList}
                 dropdownsInfo={teamsInfo}
                 dropdownOptions={extractOptionsObject(teamsInfo, formData.maintenance_team_id)}
                 moduleName={appModels.TEAM}
                 labelName="Maintenance Team"
                 columns={['id', 'name']}
                 indexValue={index}
                 isRequired
                 infoText="maintenance_team_id"
                 advanceSearchHeader="Maintenance Team List"
               />

            </FormControl>
            <FormControl
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
               <Selection
                 paramsSet={(e) => onDropdownChange(e, index, 'maintenance_year_id')}
                 paramsValue={formData.maintenance_year_id && formData.maintenance_year_id.name ? formData.maintenance_year_id.name : ''}
                 paramsId={Math.random()}
                 callData={getTeamList}
                 dropdownsInfo={teamsInfo}
                 dropdownOptions={extractOptionsObject(teamsInfo, formData.maintenance_year_id)}
                 moduleName={appModels.PPMYEAR}
                 labelName="Maintenance Year"
                 columns={['id', 'name']}
                 indexValue={index}
                 isRequired
                 infoText="maintenance_year_id"
                 advanceSearchHeader="Maintenance Year List"
               />
            </FormControl>
            <FormControl
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
               <Selection
                 paramsSet={(e) => onDropdownCustom(e, index, 'schedule_period_id')}
                 paramsValue={formData.schedule_period_id}
                 paramsId={Math.random()}
                 dropdownOptions={preventiveActions.timeperiod}
                 labelName="Schedule period"
                 infoText="schedulePeriod"
                 sx={{
                   width: '100%',
                   marginTop: '9px',
                 }}
                 isCustomData
                 isRequired
               />
            </FormControl>
            <FormControl
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
               <Selection
                 paramsSet={(e) => onDropdownCustom(e, index, 'performed_by')}
                 paramsValue={formData.performed_by}
                 paramsId={Math.random()}
                 dropdownOptions={preventiveActions.performedBy}
                 labelName="Performed By"
                 infoText="performedBy"
                 sx={{
                   width: '100%',
                   marginTop: '9px',
                 }}
                 isCustomData
                 isRequired
               />
            </FormControl>
            {formData.performed_by?.value === 'External' && (
            <FormControl
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
               <Selection
                 paramsSet={(e) => onDropdownChange(e, index, 'vendor_id')}
                 paramsValue={formData.vendor_id && formData.vendor_id.name ? formData.vendor_id.name : ''}
                 paramsId={Math.random()}
                 callData={getTeamList}
                 dropdownsInfo={teamsInfo}
                 dropdownOptions={extractOptionsObject(teamsInfo, formData.vendor_id)}
                 moduleName={appModels.PARTNER}
                 labelName="Vendor"
                 columns={['id', 'name']}
                 indexValue={index}
                 isRequired
                 infoText="vendor_id"
                 advanceSearchHeader="Vendor List"
               />
            </FormControl>
            )}
      </Box>
    </Box>
  );
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default RequestorForm;
