/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog, DialogContent, DialogContentText, FormControl, TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiCheckboxField from '../../commonComponents/multipleFormFields/muiCheckbox';
import SearchModalMultiple from '../../survey/forms/searchModalMultiple';

import { infoValue } from '../../adminSetup/utils/utils';

import {
  decimalKeyPressDown,
  getAllowedCompanies,
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
    newData[index].ends_on = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onTextFieldChange = (e, indexV, field) => {
    const newData = partsData;
    newData[indexV][field] = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

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
        width: '30%',
        marginTop: 'auto',
        marginBottom: '20px',
      }}
      variant="standard"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            name={formField.endsOn.name}
            label={(
              <>
               Ends On
                {infoValue('ends_on')}
              </>
                )}
                value={formData.ends_on}
            onChange={handleCommenseDateChange}
            ampm={false}
            disablePast
          />
        </DemoContainer>
      </LocalizationProvider>
    </FormControl>
    <FormControl
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
        className="bg-white"
        value={formData.description}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onTextFieldChange(e, index, 'description')}
        inputProps={{ maxLength: 150 }}
      />
    </FormControl>
    <MuiCheckboxField
      setPartsData={setPartsData}
      partsData={partsData}
      setPartsAdd={setPartsAdd}
      index={index}
      formData={formData}
      name={formField.enableTimeTracking.name}
      label={formField.enableTimeTracking.label}
    />
    {formData.is_enable_time_tracking ? (
      <>
    <FormControl
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
               name={formField.minDuration.name}
               label={(
              <>
                Min Duration
                <span className="text-danger ml-1">*</span>
                {infoValue('min_duration')}
              </>
                )}
               className="bg-white"
               value={formData.min_duration}
               onKeyPress={decimalKeyPressDown}
               InputLabelProps={{ shrink: true }}
               onChange={(e) => onTextFieldChange(e, index, 'min_duration')}
               inputProps={{ maxLength: 5 }}
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
      <TextField
        variant="standard"
        size="small"
        type="text"
        name={formField.maxDuration.name}
        label={(
      <>
        Max Duration
        <span className="text-danger ml-1">*</span>
        {infoValue('max_duration')}
      </>
        )}
        onKeyPress={decimalKeyPressDown}
        className="bg-white"
        value={formData.max_duration}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => onTextFieldChange(e, index, 'max_duration')}
        inputProps={{ maxLength: 5 }}
      />
    </FormControl>
      </>
    ) : ''}
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
