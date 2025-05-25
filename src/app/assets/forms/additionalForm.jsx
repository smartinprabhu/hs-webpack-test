/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CardBody, Card, Row, Col,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import ReactFileReader from 'react-file-reader';
import { useFormikContext } from 'formik';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import {
  InputField, FormikAutocomplete, DateTimeField, CheckboxField,
} from '@shared/formFields';

import {
  generateErrorMessage, decimalKeyPress, noSpecialChars, getAllCompanies, getDateTimeSeconds,
} from '../../util/appUtils';
import {
  getOperatingHours, getEmployeeList, getEmployeeDataList, getTeamList,
} from '../equipmentService';
import { bytesToSize } from '../../util/staticFunctions';
import assetActionData from '../data/assetsActions.json';
import AdvancedSearchModal from './advancedSearchModal';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;
const AdditionalForm = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [vsOpen, setVSOpen] = useState(false);
  const [wtOpen, setWtOpen] = useState(false);
  const [wtKeyword, setWtKeyword] = useState('');
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);
  const [l1Open, setL1Open] = useState(false);
  const [l2Open, setL2Open] = useState(false);
  const [l3Open, setL3Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [l2Keyword, setL2Keyword] = useState('');
  const [l3Keyword, setL3Keyword] = useState('');
  const [hoursOpen, setHoursOpen] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const {
    isITAsset,
    setFieldValue,
    setFieldTouched,
    formField: {
      validationStatus,
      validatedOn,
      validatedBy,
      comment,
      startDate,
      tagStatus,
      resourceCalendarId,
      employeeId,
      latitude,
      longitude,
      operatingHours,
      xPos,
      yPos,
      make,
      capacity,
      lastServiceDone,
      refillingDueDate,
      serial,
      model,
      criticality,
      monitoredById,
      managedById,
      maintainedById,
      ravValue,
      qrTag,
      nfcTag,
      rfidTag,
      virutualTag,
    },
  } = props;

  const { values: formValues } = useFormikContext();
  const {
    resource_calendar_id,
    employee_id,
    validated_by,
    monitored_by_id,
    managed_by_id,
    maintained_by_id,
    validated_on,
    operating_hours
  } = formValues;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    hoursInfo, employeesInfo, employeeListInfo, teamsInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && wtOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, wtOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && hoursOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, hoursOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

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

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onWtKeywordChange = (event) => {
    setWtKeyword(event.target.value);
  };

  const onAtKeywordChange = (event) => {
    setAtKeyword(event.target.value);
  };

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL2KeywordChange = (event) => {
    setL2Keyword(event.target.value);
  };

  const onL3KeywordChange = (event) => {
    setL3Keyword(event.target.value);
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
        setFieldValue('image_small', fileData);
      }
    }
  };

  const onAtClear = () => {
    setAtKeyword(null);
    setFieldValue('employee_id', '');
    setAtOpen(false);
  };

  const showAtModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name']);
    setFieldName('employee_id');
    setModalName('Employee List');
    setPlaceholder('Employees');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onValidatedByClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('validated_by', '');
    setEmployeeOpen(false);
  };

  const showValidatedByModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('validated_by');
    setModalName('User List');
    setPlaceholder('Users');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onWtClear = () => {
    setWtKeyword(null);
    setFieldValue('resource_calendar_id', '');
    setWtOpen(false);
  };

  const showWtModal = () => {
    setModelValue(appModels.RESOURCECALENDAR);
    setColumns(['id', 'name']);
    setFieldName('resource_calendar_id');
    setModalName('Working Hours List');
    setPlaceholder('Working Hours');
    setCompanyValue(companies);
    setExtraModal(true);
  };
  const onHourKeywordChange = (event) => {
    setWtKeyword(event.target.value);
  };
  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('monitored_by_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('monitored_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL2Clear = () => {
    setL2Keyword(null);
    setFieldValue('managed_by_id', '');
    setL2Open(false);
  };

  const showL2Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('managed_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL3Clear = () => {
    setL3Keyword(null);
    setFieldValue('maintained_by_id', '');
    setL3Open(false);
  };

  const showL3Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintained_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  let hourOptions = [];
  let employeeOptions = [];
  let employeeListOptions = [];
  let l1Options = [];
  let l2Options = [];
  let l3Options = [];

  if (teamsInfo && teamsInfo.loading) {
    if (l1Open) {
      l1Options = [{ name: 'Loading..' }];
    }
    if (l2Open) {
      l2Options = [{ name: 'Loading..' }];
    }
    if (l3Open) {
      l3Options = [{ name: 'Loading..' }];
    }
  }

  if (hoursInfo && hoursInfo.loading) {
    hourOptions = [{ name: 'Loading..' }];
  }
  if (hoursInfo && hoursInfo.data) {
    hourOptions = hoursInfo.data;
  }

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeesInfo && employeesInfo.data) {
    employeeOptions = employeesInfo.data;
  }

  if (employeeListInfo && employeeListInfo.loading) {
    employeeListOptions = [{ name: 'Loading..' }];
  }
  if (employeeListInfo && employeeListInfo.data) {
    employeeListOptions = employeeListInfo.data;
  }

  if (teamsInfo && teamsInfo.data) {
    if (l1Open) {
      l1Options = teamsInfo.data;
    }
    if (l2Open) {
      l2Options = teamsInfo.data;
    }
    if (l3Open) {
      l3Options = teamsInfo.data;
    }
  }
  if (operating_hours && operating_hours.length && operating_hours.length > 0) {
    const oldMaintenanceTeam = [{ id: operating_hours[0], name: operating_hours[1] }];
    const newArr = [...hourOptions, ...oldMaintenanceTeam];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  const oldHourId = operating_hours && operating_hours.length && operating_hours.length > 0 ? operating_hours[1] : '';

  return (
    <>
      <Card className="no-border-radius mt-3 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Maintenance</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        <Col xs={12} md={12} lg={6} sm={12}>
          <InputField
            name={model.name}
            label={model.label}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={noSpecialChars}
          />
        </Col>
        <Col xs={12} md={12} lg={6} sm={12}>
          <InputField
            name={serial.name}
            label={serial.label}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={noSpecialChars}
          />
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <FormikAutocomplete
            name={criticality.name}
            label={criticality.label}
            formGroupClassName="m-1"
            open={open}
            size="small"
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.criticalities}
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
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={startDate.name}
            label={startDate.label}
            formGroupClassName="m-1"
            type="date"
          />
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <FormikAutocomplete
            name={resourceCalendarId.name}
            label={resourceCalendarId.label}
            formGroupClassName="m-1"
            open={wtOpen}
            value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : ''}
            size="small"
            onOpen={() => {
              setWtOpen(true);
              setWtKeyword('');
            }}
            onClose={() => {
              setWtOpen(false);
              setWtKeyword('');
            }}
            loading={hoursInfo && hoursInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={hourOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onWtKeywordChange}
                variant="outlined"
                value={wtKeyword}
                className={((resource_calendar_id && resource_calendar_id.id) || (wtKeyword && wtKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((resource_calendar_id && resource_calendar_id.id) || (wtKeyword && wtKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onWtClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showWtModal}
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
          {(hoursInfo && hoursInfo.err) && (<FormHelperText><span className="text-danger pl-1">{generateErrorMessage(hoursInfo)}</span></FormHelperText>)}
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <FormikAutocomplete
            name={monitoredById.name}
            label={monitoredById.label}
            formGroupClassName="m-1"
            open={l1Open}
            value={monitored_by_id && monitored_by_id.name ? monitored_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL1Open(true);
              setL1Keyword('');
            }}
            onClose={() => {
              setL1Open(false);
              setL1Keyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l1Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL1KeywordChange}
                variant="outlined"
                value={l1Keyword}
                className={((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
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
          {(teamsInfo && teamsInfo.err && l1Open) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <FormikAutocomplete
            name={managedById.name}
            label={managedById.label}
            formGroupClassName="m-1"
            open={l2Open}
            value={managed_by_id && managed_by_id.name ? managed_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL2Open(true);
              setL2Keyword('');
            }}
            onClose={() => {
              setL2Open(false);
              setL2Keyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l2Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL2KeywordChange}
                variant="outlined"
                value={l2Keyword}
                className={((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l2Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onL2Clear}
                          >
                            <BackspaceIcon fontSize="small" />
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
          {(teamsInfo && teamsInfo.err && l2Open) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <FormikAutocomplete
            name={maintainedById.name}
            label={maintainedById.label}
            formGroupClassName="m-1"
            open={l3Open}
            value={maintained_by_id && maintained_by_id.name ? maintained_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL3Open(true);
              setL3Keyword('');
            }}
            onClose={() => {
              setL3Open(false);
              setL3Keyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l3Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL3KeywordChange}
                variant="outlined"
                value={l3Keyword}
                className={((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l3Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onL3Clear}
                          >
                            <BackspaceIcon fontSize="small" />
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
          {(teamsInfo && teamsInfo.err && l3Open) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={ravValue.name}
            label={ravValue.label}
            formGroupClassName="m-1"
            maxLength="10"
            autoComplete="off"
            onKeyPress={decimalKeyPress}
            type="text"
          />
        </Col>
      </Row>
      <Card className="no-border-radius mt-3 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Validation</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        <Col xs={12} sm={6} lg={6} md={6}>
          <FormikAutocomplete
            name={validationStatus.name}
            label={validationStatus.label}
            formGroupClassName="m-1"
            open={vsOpen}
            size="small"
            onOpen={() => {
              setVSOpen(true);
            }}
            onClose={() => {
              setVSOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.validationTypes}
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
        {!isITAsset && (
          <Col sm="12" md="12" xs="12" lg="6">
            <FormikAutocomplete
              name={tagStatus.name}
              label={tagStatus.label}
              formGroupClassName="m-1"
              open={tagOpen}
              size="small"
              onOpen={() => {
                setTagOpen(true);
              }}
              onClose={() => {
                setTagOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={assetActionData.tagStatsus}
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
        )}
        <Col xs={12} sm={6} lg={6} md={6}>
          <FormikAutocomplete
            name={validatedBy.name}
            label={validatedBy.label}
            formGroupClassName="m-1"
            open={employeeShow}
            value={validated_by && validated_by.name ? validated_by.name : ''}
            size="small"
            onOpen={() => {
              setEmployeeOpen(true);
              setEmployeeKeyword('');
            }}
            onClose={() => {
              setEmployeeOpen(false);
              setEmployeeKeyword('');
            }}
            loading={employeesInfo && employeesInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={employeeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onEmployeeKeywordChange}
                variant="outlined"
                value={employeeKeyword}
                className={((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
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
          {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger pl-1">{generateErrorMessage(employeesInfo)}</span></FormHelperText>)}
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          {/* <InputField
            name={validatedOn.name}
            label={validatedOn.label}
            formGroupClassName="m-1"
            max={moment(new Date()).format('YYYY-MM-DD')}
            type="date"
          /> */}
          <DateTimeField
            name={validatedOn.name}
            label={validatedOn.label}
            formGroupClassName="m-1"
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={validatedOn.label}
            defaultValue={validated_on ? new Date(getDateTimeSeconds(validated_on)) : ''}
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} />
        {isITAsset && (
          <>
            <Col xs={12} sm={12} lg={3} md={12}>
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1">Tag Status </span>
              <br />
              <CheckboxField
                name={qrTag.name}
                label={qrTag.label}
                className="ml-2"
              />
            </Col>
            <Col xs={12} sm={12} lg={3} md={12}>
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
              <br />
              <CheckboxField
                name={nfcTag.name}
                label={nfcTag.label}
              />
            </Col>
            <Col xs={12} sm={12} lg={3} md={12}>
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
              <br />
              <CheckboxField
                name={rfidTag.name}
                label={rfidTag.label}
              />
            </Col>
            <Col xs={12} sm={12} lg={3} md={12}>
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
              <br />
              <CheckboxField
                name={virutualTag.name}
                label={virutualTag.label}
              />
            </Col>
          </>
        )}
      </Row>
      <Card className="no-border-radius mt-3 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Attachments</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={comment.name}
            label={comment.label}
            formGroupClassName="m-1"
            onKeyPress={noSpecialChars}
            type="text"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6} className="mt-4">
          {!fileDataImage && (
            <ReactFileReader
              elementId="fileUpload"
              handleFiles={handleFiles}
              fileTypes="image/*"
              base64
            >
              <div className="float-right cursor-pointer">
                <img src={uploadIcon} className="mr-1" alt="issuecategory" height="20" />
                <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
              </div>
            </ReactFileReader>
          )}
          {fileDataImage && (
            <div className="position-relative">
              <img
                src={`${fileDataType}${fileDataImage}`}
                height="150"
                width="150"
                className="ml-3"
                alt="uploaded"
              />
              <div className="position-absolute topright-img-close">
                <img
                  aria-hidden="true"
                  src={closeCircleIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    setimgValidation(false);
                    setimgSize(false);
                    setFileDataImage(false);
                    setFileDataType(false);
                    setFieldValue('image_medium', false);
                    setFieldValue('image_small', false);
                  }}
                  alt="remove"
                />
              </div>
            </div>
          )}
          {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
          {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
        </Col>
      </Row>
      <Card className="no-border-radius mt-3 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Other Info</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={latitude.name}
            label={latitude.label}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={longitude.name}
            label={longitude.label}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          {/* <InputField
            name={operatingHours.name}
            label={operatingHours.label}
            formGroupClassName="m-1"
            type="text"
          /> */}
          <FormikAutocomplete
            name={operatingHours.name}
            label={operatingHours.label}
            formGroupClassName="m-1"
            oldValue={oldHourId}
            value={operating_hours && operating_hours.name ? operating_hours.name : oldHourId}
            open={hoursOpen}
            size="small"
            onOpen={() => {
              setHoursOpen(true);
              setWtKeyword('');
            }}
            onClose={() => {
              setHoursOpen(false);
              setWtKeyword('');
            }}
            loading={hoursInfo && hoursInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={hourOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onHourKeywordChange}
                variant="outlined"
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>

        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={xPos.name}
            label={xPos.label}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={yPos.name}
            label={yPos.label}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={lastServiceDone.name}
            label={lastServiceDone.label}
            formGroupClassName="m-1"
            type="date"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={make.name}
            label={make.label}
            formGroupClassName="m-1"
            type="text"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={refillingDueDate.name}
            label={refillingDueDate.label}
            formGroupClassName="m-1"
            type="date"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={capacity.name}
            label={capacity.label}
            formGroupClassName="m-1"
            type="text"
          />
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <FormikAutocomplete
            name={employeeId.name}
            label={employeeId.label}
            formGroupClassName="m-1"
            open={atOpen}
            value={employee_id && employee_id.name ? employee_id.name : ''}
            size="small"
            onOpen={() => {
              setAtOpen(true);
              setAtKeyword('');
            }}
            onClose={() => {
              setAtOpen(false);
              setAtKeyword('');
            }}
            loading={employeeListInfo && employeeListInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={employeeListOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onAtKeywordChange}
                variant="outlined"
                value={atKeyword}
                className={((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onAtClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showAtModal}
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
          {(employeeListInfo && employeeListInfo.err) && (<FormHelperText><span className="text-danger pl-1">{generateErrorMessage(employeeListInfo)}</span></FormHelperText>)}
        </Col>
      </Row>
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
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
          />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

AdditionalForm.defaultProps = {
  isITAsset: false,
};

AdditionalForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isITAsset: PropTypes.bool,
};

export default AdditionalForm;
