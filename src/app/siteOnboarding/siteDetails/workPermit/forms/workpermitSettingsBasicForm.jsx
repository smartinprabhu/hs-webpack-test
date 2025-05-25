/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  CheckboxFieldGroup,
} from '@shared/formFields';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText, 
  Typography,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { IoCloseOutline } from 'react-icons/io5';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Label, Row, Card, CardBody,
} from 'reactstrap';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import { AddThemeColor } from '../../../../themes/theme';
import {
  getTCList,
} from '../../../siteService';
import {
  getTeamList,
} from '../../../../assets/equipmentService';
import {
  extractOptionsObject, getAllCompanies, generateErrorMessage, decimalKeyPressDown, integerKeyPress,
} from '../../../../util/appUtils';
import customData from '../../helpdesk/data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      workLocation,
      assetType,
      poReference,
      partsRequired,
      preparedRequired,
      ehsRequired,
      reviewRequired,
      nightShiftFrom,
      nightShiftTo,
      nightApproval,
      nightStart,
      nightEnd,
      nightStartMax,
      nightEndMax,
      nightTitle,
      nightWorkType,
      specialShiftFrom,
      specialShiftTo,
      specialApproval,
      specialStart,
      specialEnd,
      specialStartMax,
      specialEndMax,
      specialTitle,
      specialWorkType,
      generalShiftFrom,
      generalShiftTo,
      generalApproval,
      generalStart,
      generalEnd,
      generalStartMax,
      generalEndMax,
      generalTitle,
      generalWorkType,
      createMessage,
      createAuthorize,
      authorizeMessage,
      authorizeApprover,
      authorizeEHS,
      authorizeVendor,
      authorizeRequestor,
      prepareMessage,
      prepareApprover,
      prepareRequestor,
      prepareEHS,
      permitMessage,
      permitApprover,
      permitEHS,
      permitVendor,
      permitRequestor,
      permitSecurity,
      ehsMessage,
      ehsApprover,
      ehsEHS,
      ehsVendor,
      ehsRequestor,
      ehsSecurity,
      orderMessage,
      orderReview,
      orderApprover,
      closeMessage,
      closeApprover,
      closeEHS,
      closeVendor,
      closeRequestor,
      closeSecurity,
      withinDay,
      rButton,
      aButton,
      pButton,
      iButton,
      vButton,
      wButton,
      oButton,
      clButton,
      prButton,
      eButton,
      cButton,
      rStatus,
      aStatus,
      pStatus,
      iStatus,
      vStatus,
      wStatus,
      oStatus,
      clStatus,
      prStatus,
      eStatus,
      cStatus,
      actualStart,
      actualEnd,
      enableType,
      workAccess,
      enableDepartment,
      departmentAccess,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    night_approval_authority_shift_id, special_approval_authority_shift_id, general_approval_authority_shift_id,
    review_required, is_ehs_required, is_prepared_required, type_of_work_access_level, department_access_level,
  } = formValues;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [l1Open, setL1Open] = useState(false);
  const [l2Open, setL2Open] = useState(false);
  const [l3Open, setL3Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [l2Keyword, setL2Keyword] = useState('');
  const [l3Keyword, setL3Keyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const [dAOpen, setDAOpen] = useState(false);
  const [wAOpen, setWAOpen] = useState(false);
  const {
    tcInfo,
  } = useSelector((state) => state.site);
  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companies, appModels.SURVEY, categoryKeyword, 'title'));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l1Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l2Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l2Keyword));
      }
    })();
  }, [userInfo, l2Keyword, l2Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l3Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l3Keyword));
      }
    })();
  }, [userInfo, l3Keyword, l3Open]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL2KeywordChange = (event) => {
    setL2Keyword(event.target.value);
  };

  const onL3KeywordChange = (event) => {
    setL3Keyword(event.target.value);
  };

  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('night_approval_authority_shift_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('night_approval_authority_shift_id');
    setModalName('Approval Team');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL2Clear = () => {
    setL2Keyword(null);
    setFieldValue('special_approval_authority_shift_id', '');
    setL2Open(false);
  };

  const showL2Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('special_approval_authority_shift_id');
    setModalName('Approval Team');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL3Clear = () => {
    setL3Keyword(null);
    setFieldValue('general_approval_authority_shift_id', '');
    setL3Open(false);
  };

  const showL3Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('general_approval_authority_shift_id');
    setModalName('Approval Team');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const l1Options = extractOptionsObject(teamsInfo, night_approval_authority_shift_id);
  const l2Options = extractOptionsObject(teamsInfo, special_approval_authority_shift_id);
  const l3Options = extractOptionsObject(teamsInfo, general_approval_authority_shift_id);

  function typeLable(staten) {
    if (customData && customData.accessTypesLabel[staten]) {
      const s = customData.accessTypesLabel[staten].label;
      return s;
    }
    return '';
  }

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          General Settings
          <Tooltip title="General settings allowed for the Workpermit module" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={workLocation.name} className="m-0">
            {workLocation.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={workLocation.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={workLocation.label1}
          />
          <CheckboxFieldGroup
            name={workLocation.name}
            checkedvalue="Optional"
            id="Optional"
            label={workLocation.label2}
          />
          <CheckboxFieldGroup
            name={workLocation.name}
            checkedvalue="None"
            id="None"
            label={workLocation.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={assetType.name} className="m-0">
            {assetType.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={assetType.name}
            checkedvalue="Both"
            id="Both"
            className="ml-1"
            label={assetType.label1}
          />
          <CheckboxFieldGroup
            name={assetType.name}
            checkedvalue="Space"
            id="Space"
            label={assetType.label2}
          />
          <CheckboxFieldGroup
            name={assetType.name}
            checkedvalue="Equipment"
            id="Equipment"
            label={assetType.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={poReference.name} className="m-0">
            {poReference.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={poReference.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={poReference.label1}
          />
          <CheckboxFieldGroup
            name={poReference.name}
            checkedvalue="Optional"
            id="Optional"
            label={poReference.label2}
          />
          <CheckboxFieldGroup
            name={poReference.name}
            checkedvalue="None"
            id="None"
            label={poReference.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={partsRequired.name}
            label={partsRequired.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={preparedRequired.name}
            label={preparedRequired.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={ehsRequired.name}
            label={ehsRequired.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={reviewRequired.name}
            label={reviewRequired.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Night Request Settings
          {/* <Tooltip title="Through these settings, users can be allowed to create tickets using a public URL. The applicable fields for the  public URL can also be configured below under field settings" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
  </Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={nightShiftFrom.name}
            label={nightShiftFrom.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={nightShiftTo.name}
            label={nightShiftTo.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} md={12} lg={12} sm={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={nightApproval.name}
            label={nightApproval.label}
            formGroupClassName="m-1"
            open={l1Open}
            oldValue={getOldData(night_approval_authority_shift_id)}
            value={night_approval_authority_shift_id && night_approval_authority_shift_id.name ? night_approval_authority_shift_id.name : getOldData(night_approval_authority_shift_id)}
            size="small"
            onOpen={() => {
              setL1Open(true);
              setL1Keyword('');
            }}
            onClose={() => {
              setL1Open(false);
              setL1Keyword('');
            }}
            loading={teamsInfo && teamsInfo.loading && teamsInfo}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            options={l1Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL1KeywordChange}
                variant="standard"
                value={l1Keyword}
                label={nightApproval.label}
                className={((night_approval_authority_shift_id && night_approval_authority_shift_id.id) || (l1Keyword && l1Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((night_approval_authority_shift_id && night_approval_authority_shift_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onL1Clear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showL1Modal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={nightStart.name}
            label={nightStart.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={nightEnd.name}
            label={nightEnd.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={nightStartMax.name}
            label={nightStartMax.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={nightEndMax.name}
            label={nightEndMax.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={nightTitle.name}
            label={nightTitle.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
            onKeyPress={integerKeyPress}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={nightWorkType.name}
            label={nightWorkType.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Special Request Settings
          {/* <Tooltip title="Collecting feedbacks from the ticket requestor can be enabled using these settings. Feedbacks can also be using the automated way of reopening the tickets and notifying the maintenance team" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={specialShiftFrom.name}
            label={specialShiftFrom.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={specialShiftTo.name}
            label={specialShiftTo.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} md={12} lg={12} sm={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={specialApproval.name}
            label={specialApproval.label}
            formGroupClassName="m-1"
            open={l2Open}
            oldValue={getOldData(special_approval_authority_shift_id)}
            value={special_approval_authority_shift_id && special_approval_authority_shift_id.name ? special_approval_authority_shift_id.name : getOldData(special_approval_authority_shift_id)}
            size="small"
            onOpen={() => {
              setL2Open(true);
              setL2Keyword('');
            }}
            onClose={() => {
              setL2Open(false);
              setL2Keyword('');
            }}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l2Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL2KeywordChange}
                variant="standard"
                label={specialApproval.label}
                value={l2Keyword}
                className={((special_approval_authority_shift_id && special_approval_authority_shift_id.id) || (l2Keyword && l2Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l2Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((special_approval_authority_shift_id && special_approval_authority_shift_id.id) || (l2Keyword && l2Keyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onL2Clear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showL2Modal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={specialStart.name}
            label={specialStart.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={specialEnd.name}
            label={specialEnd.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={specialStartMax.name}
            label={specialStartMax.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={specialEndMax.name}
            label={specialEndMax.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={specialTitle.name}
            label={specialTitle.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
            onKeyPress={integerKeyPress}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={specialWorkType.name}
            label={specialWorkType.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          General Request Settings
          {/* <Tooltip title="Collecting feedbacks from the ticket requestor can be enabled using these settings. Feedbacks can also be using the automated way of reopening the tickets and notifying the maintenance team" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={generalShiftFrom.name}
            label={generalShiftFrom.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={generalShiftTo.name}
            label={generalShiftTo.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} md={12} lg={12} sm={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={generalApproval.name}
            label={generalApproval.label}
            formGroupClassName="m-1"
            open={l3Open}
            oldValue={getOldData(general_approval_authority_shift_id)}
            value={general_approval_authority_shift_id && general_approval_authority_shift_id.name ? general_approval_authority_shift_id.name : getOldData(general_approval_authority_shift_id)}
            size="small"
            onOpen={() => {
              setL3Open(true);
              setL3Keyword('');
            }}
            onClose={() => {
              setL3Open(false);
              setL3Keyword('');
            }}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l3Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL3KeywordChange}
                variant="standard"
                label={generalApproval.label}
                value={l3Keyword}
                className={((general_approval_authority_shift_id && general_approval_authority_shift_id.id) || (l3Keyword && l3Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l3Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((general_approval_authority_shift_id && general_approval_authority_shift_id.id) || (l3Keyword && l3Keyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onL3Clear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showL3Modal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={generalStart.name}
            label={generalStart.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={generalEnd.name}
            label={generalEnd.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={generalStartMax.name}
            label={generalStartMax.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={generalEndMax.name}
            label={generalEndMax.label}
            autoComplete="off"
            inputProps={{
              maxLength: 2,
            }}
            type="text"
            onKeyDown={decimalKeyPressDown}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={generalTitle.name}
            label={generalTitle.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
            onKeyPress={integerKeyPress}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={generalWorkType.name}
            label={generalWorkType.label}
          />
        </Col>
      </Col>

      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Status Name
          {/* <Tooltip title="General settings allowed for the Workclose module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={rStatus.name}
            label={rStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={aStatus.name}
            label={aStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={pStatus.name}
            label={pStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={iStatus.name}
            label={iStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={vStatus.name}
            label={vStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={wStatus.name}
            label={wStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={oStatus.name}
            label={oStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={clStatus.name}
            label={clStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={prStatus.name}
            label={prStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={eStatus.name}
            label={eStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={cStatus.name}
            label={cStatus.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
      </Col>

      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Status Button Name
          {/* <Tooltip title="General settings allowed for the Workclose module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={rButton.name}
            label={rButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={aButton.name}
            label={aButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={pButton.name}
            label={pButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={iButton.name}
            label={iButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={vButton.name}
            label={vButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={wButton.name}
            label={wButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={oButton.name}
            label={oButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={clButton.name}
            label={clButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={prButton.name}
            label={prButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={eButton.name}
            label={eButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={cButton.name}
            label={cButton.label}
            autoComplete="off"
            inputProps={{
              maxLength: 20,
            }}
            type="text"
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Edit Actual Start/End DT
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={actualStart.name}
            label={actualStart.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={actualEnd.name}
            label={actualEnd.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          Additional Info
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={enableType.name}
            label={enableType.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={workAccess.name}
            label={workAccess.label}
            labelClassName="mb-1"
            formGroupClassName="mb-1 w-100"
            open={wAOpen}
            oldvalue={typeLable(type_of_work_access_level)}
            value={type_of_work_access_level && type_of_work_access_level.label ? type_of_work_access_level.label : typeLable(type_of_work_access_level)}
            size="small"
            onOpen={() => {
              setWAOpen(true);
            }}
            onClose={() => {
              setWAOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.catTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={workAccess.label}
                InputLabelProps={{ shrink: true }}
                className="input-small-custom without-padding"
                placeholder="Search"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={enableDepartment.name}
            label={enableDepartment.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={departmentAccess.name}
            label={departmentAccess.label}
            labelClassName="mb-1"
            formGroupClassName="mb-1 w-100"
            open={dAOpen}
            oldvalue={typeLable(department_access_level)}
            value={department_access_level && department_access_level.label ? department_access_level.label : typeLable(department_access_level)}
            size="small"
            onOpen={() => {
              setDAOpen(true);
            }}
            onClose={() => {
              setDAOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.catTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={departmentAccess.label}
                InputLabelProps={{ shrink: true }}
                className="input-small-custom without-padding"
                placeholder="Search"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-3 mt-3 pl-2 ml-1">
        <Card className="no-border-radius mb-2">
          <CardBody className="p-0 bg-porcelain">
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 700,
                fontSize: '16px',
                marginBottom: '5px',
                marginTop: '5px',
                paddingBottom: '4px',
                marginLeft: '5px',
              })}
            >
              Communication  Settings
            </Typography>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Request Created
          {/* <Tooltip title="General settings allowed for the Workpermit module" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={createMessage.name} className="m-0">
            {createMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={createMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={createMessage.label1}
          />
          <CheckboxFieldGroup
            name={createMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={createMessage.label2}
          />
          <CheckboxFieldGroup
            name={createMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={createMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={createAuthorize.name}
            label={createAuthorize.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Request Approved
          {/* <Tooltip title="General settings allowed for the Workpermit module" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
        </Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={authorizeMessage.name} className="m-0">
            {authorizeMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={authorizeMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={authorizeMessage.label1}
          />
          <CheckboxFieldGroup
            name={authorizeMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={authorizeMessage.label2}
          />
          <CheckboxFieldGroup
            name={authorizeMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={authorizeMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={authorizeApprover.name}
            label={authorizeApprover.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={authorizeEHS.name}
            label={authorizeEHS.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={authorizeVendor.name}
            label={authorizeVendor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={authorizeRequestor.name}
            label={authorizeRequestor.label}
          />
        </Col>
      </Col>
      {is_prepared_required && (
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Request Prepared
          {/* <Tooltip title="General settings allowed for the Workpermit module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={prepareMessage.name} className="m-0">
            {prepareMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={prepareMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={prepareMessage.label1}
          />
          <CheckboxFieldGroup
            name={prepareMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={prepareMessage.label2}
          />
          <CheckboxFieldGroup
            name={prepareMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={prepareMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={prepareApprover.name}
            label={prepareApprover.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={prepareRequestor.name}
            label={prepareRequestor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={prepareEHS.name}
            label={prepareEHS.label}
          />
        </Col>
      </Col>
      )}
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Permit Issued
          {/* <Tooltip title="General settings allowed for the Workpermit module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={permitMessage.name} className="m-0">
            {permitMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={permitMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={permitMessage.label1}
          />
          <CheckboxFieldGroup
            name={permitMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={permitMessage.label2}
          />
          <CheckboxFieldGroup
            name={permitMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={permitMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={permitApprover.name}
            label={permitApprover.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={permitEHS.name}
            label={permitEHS.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={permitVendor.name}
            label={permitVendor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={permitRequestor.name}
            label={permitRequestor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={permitSecurity.name}
            label={permitSecurity.label}
          />
        </Col>
      </Col>
      {is_ehs_required && (
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When EHS Validated
          {/* <Tooltip title="General settings allowed for the Workehs module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={ehsMessage.name} className="m-0">
            {ehsMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={ehsMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={ehsMessage.label1}
          />
          <CheckboxFieldGroup
            name={ehsMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={ehsMessage.label2}
          />
          <CheckboxFieldGroup
            name={ehsMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={ehsMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={ehsApprover.name}
            label={ehsApprover.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={ehsEHS.name}
            label={ehsEHS.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={ehsVendor.name}
            label={ehsVendor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={ehsRequestor.name}
            label={ehsRequestor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={ehsSecurity.name}
            label={ehsSecurity.label}
          />
        </Col>
      </Col>
      )}
      {review_required && (
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Work Order Finished
          {/* <Tooltip title="General settings allowed for the Workorder module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={orderMessage.name} className="m-0">
            {orderMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={orderMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={orderMessage.label1}
          />
          <CheckboxFieldGroup
            name={orderMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={orderMessage.label2}
          />
          <CheckboxFieldGroup
            name={orderMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={orderMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={orderReview.name}
            label={orderReview.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={orderApprover.name}
            label={orderApprover.label}
          />
        </Col>
      </Col>
      )}
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Permit Closed
          {/* <Tooltip title="General settings allowed for the Workclose module" placement="right">
    <span className="text-info">
      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
    </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-2">
          <Label for={closeMessage.name} className="m-0">
            {closeMessage.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={closeMessage.name}
            checkedvalue="By SMS"
            id="By SMS"
            className="ml-1"
            label={closeMessage.label1}
          />
          <CheckboxFieldGroup
            name={closeMessage.name}
            checkedvalue="By Email"
            id="By Email"
            label={closeMessage.label2}
          />
          <CheckboxFieldGroup
            name={closeMessage.name}
            checkedvalue="By Push Notification"
            id="By Push Notification"
            label={closeMessage.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={closeApprover.name}
            label={closeApprover.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={closeEHS.name}
            label={closeEHS.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={closeVendor.name}
            label={closeVendor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={closeRequestor.name}
            label={closeRequestor.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={closeSecurity.name}
            label={closeSecurity.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-3">
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            marginTop: '10px',
            paddingBottom: '4px',
          })}
        >
          When Extension Approvals
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={withinDay.name}
            label={withinDay.label}
          />
        </Col>
      </Col>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
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
    </Row>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
