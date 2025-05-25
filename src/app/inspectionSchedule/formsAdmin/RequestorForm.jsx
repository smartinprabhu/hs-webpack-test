/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog, DialogContent, DialogContentText, FormControl,
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import DialogHeader from '../../commonComponents/dialogHeader';
import Selection from '../../commonComponents/multipleFormFields/selectionMultiple';
import SearchModalMultiple from '../../survey/forms/searchModalMultiple';


import {
  getAllowedCompanies,
  generateTimeDurations,
  generateTimeDurationsOnlyHours,
} from '../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModal from './searchModal';

const appModels = require('../../util/appModels').default;

dayjs.extend(utc);
dayjs.extend(timezone);

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

  const getArrayToCommaValuesTime = (array, key) => {
    let ids = '';
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        ids += `${parseFloat((array[i][key])).toFixed(2)},`;
      }
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  };

  const onDateChange = (e, indexV, field, name) => {
    const newData = partsData;
    if (field === 'starts_at') {
      newData[indexV].description = `Starts at ${e && e.length && getArrayToCommaValuesTime(e, 'value')} for ${formData.duration && formData.duration.value}`;
    }
    newData[indexV][field] = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDropdownCustom = (e, indexV, field, name) => {
    const newData = partsData;
    if (field === 'duration') {
      newData[indexV].description = `Starts at ${formData.starts_at && formData.starts_at.length && getArrayToCommaValuesTime(formData.starts_at, 'value')} for ${e && e.value ? e.value : ''}`;
    }
    newData[indexV][field] = { value: e && e.value ? e.value : '', label: e && e.label ? e.label : '' };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const timeDurations = generateTimeDurations(1);
  const timeDurationsHours = generateTimeDurationsOnlyHours(24);

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
           <FormControl
             sx={{
               width: '48%',
               marginTop: 'auto',
               marginBottom: '20px',
             }}
             variant="standard"
           >
             <Selection
               isMultipleCustom
               paramsSet={(e) => onDateChange(e, index, 'starts_at')}
               paramsValue={formData.starts_at}
               paramsId={Math.random()}
               dropdownOptions={timeDurationsHours}
               labelName="Starts At(Hours)"
               placeholderText="00:00 (HH:MM)"
               infoText="starts_at"
               sx={{
                 width: '100%',
                 marginTop: '9px',
               }}
               isRequired
             />
             {/* <TextField
               variant="standard"
               size="small"
               type="text"
               name={formField.startsAt.name}
               label={(
              <>
                Starts At(Hours)
                <span className="text-danger ml-1">*</span>
                {infoValue('starts_at')}
              </>
                )}
               className="bg-white"
               placeholder="00:00 (HH:MM)"
               value={formData.starts_at}
               onKeyDown={decimalKeyPressDown}
               InputLabelProps={{ shrink: true }}
               onChange={(e) => onTextFieldChange(e, index, 'starts_at')}
               inputProps={{ maxLength: 5 }}
             /> */}
           </FormControl>

    <FormControl
      sx={{
        width: '48%',
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
        name={formField.durationAt.name}
        label={(
      <>
        Duration(Hours)
        <span className="text-danger ml-1">*</span>
        {infoValue('duration')}
      </>
        )}
        onKeyPress={decimalKeyPressDown}
        className="bg-white"
        placeholder="00:00 (HH:MM)"
        value={formData.duration}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onTextFieldChange(e, index, 'duration')}
        inputProps={{ maxLength: 5 }}
      /> */}
    </FormControl>
    {/* <FormControl
      sx={{
        width: '30%',
        marginTop: 'auto',
        marginBottom: '20px',
      }}
      variant="standard"
    >
      <TextField
        variant="standard"
        size="small"
        type="text"
        name={formField.descriptionValue.name}
        label={(
      <>
        Description
        <span className="text-danger ml-1">*</span>
        {infoValue('description_Ins')}
      </>
        )}
        onKeyPress={decimalKeyPressDown}
        className="bg-white"
        value={formData.description}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onTextFieldChange(e, index, 'description')}
        inputProps={{ maxLength: 5 }}
      />
    </FormControl> */}
    {/* <FormControl
      sx={{
        width: '30%',
        marginTop: 'auto',
        marginBottom: '20px',
      }}
      variant="standard"
    >
       <MuiDatePicker
         label={(
              <>
               {formField.commencesOn.label}
                {infoValue('commences_on')}
              </>
            )}
         value={(formData[formField.commencesOn.name])}
         onChange={(e) => onDateChange(e, index, formField.commencesOn.name)}
         minDate={dayjs(new Date())}
       />
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker
            sx={{ width: '95%' }}
            localeText={{ todayButtonLabel: 'Now' }}
            slotProps={{
              actionBar: {
                actions: ['today', 'clear'],
              },
              textField: { variant: 'standard', InputLabelProps: { shrink: true } },
            }}
            name={formField.commencesOn.name}
            label={(
              <>
               Commences On
                <span className="text-danger ml-1">*</span>
                {infoValue('commences_on')}
              </>
                )}
            value={formData.commences_on}
            onChange={handleCommenseDateChange}
            ampm={false}
            disablePast
          />
        </DemoContainer>
      </LocalizationProvider>
    </FormControl> */}
            {/* <FormControl
              sx={{
                width: '28%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              variant="standard"
            >
               <Selection
                 isMultipleForm
                 paramsSet={(e) => onDropdownChange(e, index, 'maintenance_team_id')}
                 paramsValue={formData.maintenance_team_id && formData.maintenance_team_id.name ? formData.maintenance_team_id.name : ''}
                 paramsId={Math.random()}
                 callData={getTeamList}
                 dropdownsInfo={teamsInfo}
                 dropdownOptions={extractOptionsObject(teamsInfo, formData.maintenance_team_id)}
                 moduleName={appModels.TEAM}
                 labelName="Maintenance Team"
                 callDataFields={{ category: false, fields: ['name'] }}
                 columns={['id', 'name']}
                 indexValue={index}
                 isRequired
                 infoText="maintenance_team_id"
                 advanceSearchHeader="Maintenance Team List"
               />

            </FormControl> */}
            {/* <Box
              sx={{
                marginBottom: '20px',
              }}
            >
            <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="lg" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
            </Box> */}
      </Box>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraSearchModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
              placeholderName="Search .."
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={addCustomerModal}>
        <DialogHeader title="Add Customer" imagePath={false} onClose={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default RequestorForm;
