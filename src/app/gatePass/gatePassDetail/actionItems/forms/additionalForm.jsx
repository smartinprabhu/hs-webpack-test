/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
  Modal,
  ModalBody, Label,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  DateTimeField, CheckboxFieldGroup, FormikAutocomplete,
} from '@shared/formFields';
import {
  getDateTimeSeconds, getAllowedCompanies, generateErrorMessage, extractOptionsObject,
  getHoursAndMinutes,
} from '../../../../util/appUtils';
import {
  getTeamList,
} from '../../../../assets/equipmentService';
import {
  getEmployeeMembers,
} from '../../../../workorders/workorderService';
import {
  getWpConfig,
} from '../../../workPermitService';
import AdvancedSearchModal from '../../../forms/advancedSearchModal';
import customData from '../../../data/customData.json';

const appModels = require('../../../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    details,
    formField: {
      extendType,
      typeofRequest,
      plannedStartTime,
      plannedEndTime,
      approvalAuthority,
      userId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    approval_authority_id,
    extension_type,
    type_of_request,
    planned_start_time,
    planned_end_time,
    user_id,
  } = formValues;
  const dispatch = useDispatch();

  const [requestForOpen, setRequestForOpen] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState(false);
  const [l1Open, setL1Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [isTypeDisabled, setIsTypeDisabled] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { employeeMembers } = useSelector((state) => state.workorder);
  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const companies = getAllowedCompanies(userInfo);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;
  const configStartTime = wpConfig && wpConfig.shift_from ? wpConfig.shift_from : false;
  const configEndTime = wpConfig && wpConfig.shift_to ? wpConfig.shift_to : false;
  const configApprovalTeam = wpConfig && wpConfig.approval_authority_shift_id && wpConfig.approval_authority_shift_id.id ? wpConfig.approval_authority_shift_id : false;

  const plannedEnd = details && (details.data && details.data.length > 0) ? details.data[0].planned_end_time : false;
  const plannedToday = moment(new Date()).format('YYYY-MM-DD').valueOf() === moment(plannedEnd).format('YYYY-MM-DD').valueOf();

  function getStartDate() {
    let configStartDateSet = false;
    if (configStartTime && configEndTime) {
      const dateNow = new Date();
      const hm1 = getHoursAndMinutes(configStartTime);
      const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
      const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
      const dateAct1 = moment(dateNow).format('YYYY-MM-DD');
      const configStartDateString = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}:00`;
      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  function getDefaultStartDate() {
    let configStartDateSet = false;
    if (getStartDate() < new Date() && configStartTime && configEndTime) {
      const dateNow = new Date();
      const dateAct1 = moment(dateNow).format('YYYY-MM-DD');
      const configStartDateString = `${dateAct1} 08:00:00`;
      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  function getDefaultEndDate() {
    let configStartDateSet = false;
    if (getStartDate() < new Date() && configStartTime && configEndTime) {
      const dateNow = new Date();
      const dateAct1 = moment(dateNow).format('YYYY-MM-DD');
      const configStartDateString = `${dateAct1} 12:00:00`;
      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  function getEndDate() {
    let configStartDateSet = false;
    if (configStartTime && configEndTime) {
      const hm2 = getHoursAndMinutes(configStartTime);
      const hours2 = hm2 && hm2.hour ? hm2.hour : 0;
      const minutes2 = hm2 && hm2.minutes ? hm2.minutes : 0;
      const dateAct2 = hours2 > 19 ? moment(planned_start_time).format('YYYY-MM-DD') : moment(planned_start_time).add(1, 'day').format('YYYY-MM-DD');
      const configStartDateString = `${dateAct2} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}:00`;
      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  const range = (min, max) => [...Array(max - min + 1).keys()].map((i) => i + min);

  function getDisabledHours() {
    let result = [];
    if (configStartTime && configEndTime) {
      const hm1 = getHoursAndMinutes(configStartTime);
      const start = hm1 && hm1.hour ? hm1.hour : 0;

      const hm2 = getHoursAndMinutes(configEndTime);
      const end = hm2 && hm2.hour ? hm2.hour : 0;
      if (start && end) {
        result = range(start, end);
      }
    }
    return result;
  }

  function disabledRangeTime() {
    return {
      disabledHours: () => getDisabledHours(),
    };
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l1Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getWpConfig(companies, appModels.WPCONFIGURATION));
    }
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        const teamId = (approval_authority_id && approval_authority_id.member_ids);
        await dispatch(getEmployeeMembers(companies, appModels.EMPLOYEEMEMBERS, employeeKeyword, teamId, false, 'user'));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen, approval_authority_id]);

  /* useEffect(() => {
    if (planned_start_time && type_of_request && type_of_request.value && type_of_request.value !== 'Night Work') {
      setFieldValue('planned_end_time', moment(planned_start_time).add(1, 'hours'));
    }
  }, [planned_start_time]); */

  useEffect(() => {
    if (configStartTime && configEndTime) {
      const dateNow = new Date();
      const hm1 = getHoursAndMinutes(configStartTime);
      const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
      const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
      const dateAct1 = moment(dateNow).format('YYYY-MM-DD');

      const hm2 = getHoursAndMinutes(configEndTime);
      const hours2 = hm2 && hm2.hour ? hm2.hour : 0;
      const minutes2 = hm2 && hm2.minutes ? hm2.minutes : 0;
      const dateAct2 = hours2 > 20 ? moment(dateNow).format('YYYY-MM-DD') : moment(dateNow).add(1, 'day').format('YYYY-MM-DD');

      const configStartDate = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}:00`;

      const configEndDate = `${dateAct2} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}:00`;

      if (type_of_request && type_of_request.value && type_of_request.value === 'Night Work') {
        setFieldValue('planned_start_time', moment(configStartDate));
        setFieldValue('planned_end_time', moment(configEndDate));
        setFieldValue('user_id', '');
        if (configApprovalTeam) {
          setFieldValue('approval_authority_id', configApprovalTeam);
        }
        setIsTypeDisabled('yes');
      } else if (type_of_request && type_of_request.value && type_of_request.value !== 'Night Work') {
        setIsTypeDisabled(Math.random());
        setFieldValue('planned_start_time', '');
        setFieldValue('planned_end_time', '');
        setFieldValue('user_id', '');
        setFieldValue('approval_authority_id', '');
      }
    }
  }, [type_of_request]);

  useEffect(() => {
    if (planned_start_time && planned_end_time && type_of_request && type_of_request.value && type_of_request.value !== 'Night Work') {
      const startDate = moment(planned_start_time).add(4, 'hours').format('YYYY-MM-DD HH:mm:ss');
      if (configStartTime && configEndTime) {
        const hm1 = getHoursAndMinutes(configStartTime);
        const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
        const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
        const dateAct1 = moment(planned_start_time).format('YYYY-MM-DD');

        const hm2 = getHoursAndMinutes(configEndTime);
        const hours2 = hm2 && hm2.hour ? hm2.hour : 0;
        const minutes2 = hm2 && hm2.minutes ? hm2.minutes : 0;
        const dateAct2 = hours2 > 20 ? moment(planned_start_time).format('YYYY-MM-DD') : moment(planned_start_time).add(1, 'day').format('YYYY-MM-DD');

        const configStartDate = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}`;

        const configEndDate = `${dateAct2} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}`;

        if ((new Date(configStartDate) <= new Date(planned_start_time)) && (new Date(configEndDate) >= new Date(planned_end_time))) {
          setFieldValue('planned_end_time', moment(planned_start_time).add(10, 'minutes'));
        } else if (new Date(planned_end_time) > new Date(startDate) || new Date(planned_start_time) > new Date(planned_end_time)) {
          setFieldValue('planned_end_time', moment(planned_start_time).add(10, 'minutes'));
        }
      } else if (new Date(planned_end_time) > new Date(startDate) || new Date(planned_start_time) > new Date(planned_end_time)) {
        setFieldValue('planned_end_time', moment(startDate));
      }
    }
  }, [planned_end_time]);

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('approval_authority_id', '');
    setFieldValue('user_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name', 'member_ids']);
    setFieldName('approval_authority_id');
    setModalName('Approval Authority');
    setPlaceholder('Approval Authority');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onValidatedByClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('user_id', '');
    setEmployeeOpen(false);
  };

  const showValidatedByModal = () => {
    setModelValue(appModels.EMPLOYEEMEMBERS);
    setColumns(['id', 'user_id']);
    setFieldName('user_id');
    setModalName('Approval User');
    setPlaceholder('Approval User');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const l1Options = extractOptionsObject(teamsInfo, approval_authority_id);
  let employeeOptions = [];

  if (employeeMembers && employeeMembers.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeeMembers && employeeMembers.data) {
    // const mid = detailData && detailData.employee_id ? detailData.employee_id[0] : '';
    const employeeOptionsData = employeeMembers.data.map((cl) => ({
      ...cl, id: cl.user_id ? cl.user_id[0] : false, name: cl.user_id ? cl.user_id[1] : false,
    })); // getTrimmedArray(employeeMembers.data, 'id', mid);
    employeeOptions = [...new Map(employeeOptionsData.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const getRequestForLabel = (data) => {
    if (customData && customData.requestTypeText[data]) {
      return customData.requestTypeText[data].label;
    }
    return '';
  };

  const typeRequest = type_of_request && type_of_request.label ? type_of_request.label : getRequestForLabel(type_of_request);

  return (
    <>
      <Row className="p-1">
        <>
          <Col md="6" sm="6" lg="6" xs="12">
            <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
              <Label for={extendType.name} className="font-weight-600 m-0">
                Type
              </Label>
              <br />
              <CheckboxFieldGroup
                name={extendType.name}
                checkedvalue="Current Date"
                id="Current Date"
                isDisabled={!plannedToday}
                className="ml-2"
                label={extendType.label1}
              />
              <CheckboxFieldGroup
                name={extendType.name}
                checkedvalue="Future Date"
                id="Future Date"
                className="ml-2"
                label={extendType.label}
              />
            </Col>
          </Col>
          <Col md="6" sm="6" lg="6" xs="12">
            <Col xs={12} sm={12} lg={12} md={12}>
              <DateTimeField
                name={plannedStartTime.name}
                label={plannedStartTime.label}
                isRequired
                readOnly={extension_type === 'Current Date' || isTypeDisabled === 'yes'}
                disablePastDate
                disabledTime={disabledRangeTime}
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={plannedStartTime.label}
                // endDate={type_of_request && type_of_request.value !== 'Night Work' ? getStartDate() : false}
                showNow={false}
                defaultValue={planned_start_time ? new Date(getDateTimeSeconds(planned_start_time)) : getDefaultStartDate()}
              />
            </Col>
          </Col>
          <Col md="6" sm="6" lg="6" xs="12">
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name={typeofRequest.name}
                label={typeofRequest.label}
                className="bg-white"
                formGroupClassName="m-1"
                open={requestForOpen}
                disableClearable
                oldValue={getRequestForLabel(type_of_request)}
                value={type_of_request && type_of_request.label ? type_of_request.label : getRequestForLabel(type_of_request)}
                size="small"
                onOpen={() => {
                  setRequestForOpen(true);
                }}
                onClose={() => {
                  setRequestForOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.requestType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    className="without-padding"
                    placeholder="Select"
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
          <Col md="6" sm="6" lg="6" xs="12">
            <Col xs={12} sm={12} lg={12} md={12}>
              <DateTimeField
                name={plannedEndTime.name}
                label={plannedEndTime.label}
                isRequired
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={plannedEndTime.label}
                disablePastDate
                readOnly={isTypeDisabled === 'yes'}
                disabledTime={disabledRangeTime}
                startDate={type_of_request && type_of_request.value !== 'Night Work' ? new Date(planned_start_time) : false}
                endDate={type_of_request && type_of_request.value !== 'Night Work' ? getEndDate() : false}
                showNow={false}
                defaultValue={planned_end_time ? new Date(getDateTimeSeconds(planned_end_time)) : getDefaultEndDate()}
              />
            </Col>
          </Col>
          {typeRequest !== 'Normal' && (
            <>
              <Col md="6" sm="6" lg="6" xs="12">
                <Col xs={12} sm={12} lg={12} md={12}>
                  <FormikAutocomplete
                    name={approvalAuthority.name}
                    label={approvalAuthority.label}
                    formGroupClassName="m-1"
                    open={l1Open}
                    isRequired
                    oldValue={getOldData(approval_authority_id)}
                    value={approval_authority_id && approval_authority_id.name ? approval_authority_id.name : getOldData(approval_authority_id)}
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
                        variant="outlined"
                        value={l1Keyword}
                        className={((approval_authority_id && approval_authority_id.id) || (l1Keyword && l1Keyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((approval_authority_id && approval_authority_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onL1Clear}
                                >
                                  <BackspaceIcon fontSize="small" />
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
              </Col>
              <Col md="6" sm="6" lg="6" xs="12" />
              <Col md="6" sm="6" lg="6" xs="12">
                <Col xs={12} sm={12} lg={12} md={12}>
                  <FormikAutocomplete
                    name={userId.name}
                    label={userId.label}
                    formGroupClassName="m-1"
                    oldValue={getOldData(user_id)}
                    isRequired
                    disabled={!((approval_authority_id && approval_authority_id.id) || (getOldData(approval_authority_id)))}
                    value={user_id && user_id.name ? user_id.name : getOldData(user_id)}
                    apiError={(employeeMembers && employeeMembers.err) ? generateErrorMessage(employeeMembers) : false}
                    open={employeeOpen}
                    size="small"
                    onOpen={() => {
                      setEmployeeOpen(true);
                      setEmployeeKeyword('');
                    }}
                    onClose={() => {
                      setEmployeeOpen(false);
                      setEmployeeKeyword('');
                    }}
                    loading={employeeMembers && employeeMembers.loading}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={employeeOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onEmployeeKeywordChange}
                        variant="outlined"
                        className={((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0))
                          ? 'without-padding custom-icons bg-white' : 'without-padding custom-icons2 bg-white'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {employeeMembers && employeeMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onValidatedByClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showValidatedByModal}
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
              </Col>
            </>
          )}
        </>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
            approvalTeam={approval_authority_id && approval_authority_id.member_ids}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

AdditionalForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default AdditionalForm;
