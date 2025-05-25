/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Card, CardBody,
  Modal, ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import ReactFileReader from 'react-file-reader';
import { makeStyles } from '@material-ui/core/styles';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import formFields from './formFields.json';
import { getEquipmentList } from '../../../helpdesk/ticketService';
import { getOperatingHours, getEmployeeDataList } from '../../equipmentService';
import { bytesToSize } from '../../../util/staticFunctions';
import { getLocalDateTimeDBFormat, generateErrorMessage, getAllCompanies } from '../../../util/appUtils';
import { getTrimmedArray } from '../../../workorders/utils/utils';
import AdvancedSearchModal from './advancedSearchModal';

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const appModels = require('../../../util/appModels').default;

const AdditionalUpdateForm = (props) => {
  const {
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    refilling_due_date, last_service_done, operating_hours, employee_id,
    parent_id,
  } = formValues;
  const classes = useStyles();
  const [hoursOpen, setHoursOpen] = useState(false);
  const [hoursKeyword, setHoursKeyword] = useState('');
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [parentOpen, setParentOpen] = useState(false);
  const [parentKeyword, setParentKeyword] = useState('');
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    equipmentsDetails, hoursInfo, employeeListInfo, updateEquipment,
  } = useSelector((state) => state.equipment);
  const {
    equipmentInfo,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (updateEquipment && updateEquipment.data) {
      setimgValidation(false);
      setimgSize(false);
      setFileDataImage(false);
      setFileDataType(false);
    }
  }, [updateEquipment]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && hoursOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, hoursKeyword));
      }
    })();
  }, [userInfo, hoursKeyword, hoursOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && parentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, parentKeyword));
      }
    })();
  }, [userInfo, parentKeyword, parentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  const onHourKeywordChange = (event) => {
    setHoursKeyword(event.target.value);
  };

  const onParentKeywordChange = (event) => {
    setParentKeyword(event.target.value);
  };

  const onAtKeywordChange = (event) => {
    setAtKeyword(event.target.value);
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
      }
    }
  };

  let hourOptions = [];
  let employeeListOptions = [];
  let parentOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    parentOptions = [{ name: 'Loading..' }];
  }
  if (parent_id && parent_id.length && parent_id.length > 0) {
    const oldId = [{ id: parent_id[0], name: parent_id[1] }];
    const newArr = [...parentOptions, ...oldId];
    parentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (equipmentInfo && equipmentInfo.data) {
    const pid = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    const arr = [...parentOptions, ...getTrimmedArray(equipmentInfo.data, 'id', pid)];
    parentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (hoursInfo && hoursInfo.loading) {
    hourOptions = [{ name: 'Loading..' }];
  }
  if (operating_hours && operating_hours.length && operating_hours.length > 0) {
    const oldMaintenanceTeam = [{ id: operating_hours[0], name: operating_hours[1] }];
    const newArr = [...hourOptions, ...oldMaintenanceTeam];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (hoursInfo && hoursInfo.data) {
    const arr = [...hourOptions, ...hoursInfo.data];
    hourOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (employeeListInfo && employeeListInfo.loading) {
    employeeListOptions = [{ name: 'Loading..' }];
  }
  if (employee_id && employee_id.length && employee_id.length > 0) {
    const oldEmployeeId = [{ id: employee_id[0], name: employee_id[1] }];
    const newArr = [...employeeListOptions, ...oldEmployeeId];
    employeeListOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (employeeListInfo && employeeListInfo.data) {
    const arr = [...employeeListOptions, ...employeeListInfo.data];
    employeeListOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldRefillingDueDate = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].refilling_due_date : '';
  const oldLastServiceDone = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].last_service_done : '';
  const oldHourId = operating_hours && operating_hours.length && operating_hours.length > 0 ? operating_hours[1] : '';
  const oldParentId = parent_id && parent_id.length && parent_id.length > 0 ? parent_id[1] : '';
  const oldEmpId = employee_id && employee_id.length && employee_id.length > 0 ? employee_id[1] : '';

  return (

    <>
      <Card className="no-border-radius mt-3 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Attachments</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        <Col sm="12" md="12" xs="12" lg="6">
          <InputField
            name="comment"
            label="Comment"
            type="text"
            formGroupClassName="m-1"
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
          {((equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].image_medium) && !fileDataImage) && (
            <img
              src={`data:image/png;base64,${equipmentsDetails.data[0].image_medium}`}
              height="100"
              width="100"
              className="ml-3 mb-2"
              alt="uploaded"
            />
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
      <Row className="p-1">
        {formFields && formFields.additionalFields && formFields.additionalFields.map((fields) => (
          <React.Fragment key={fields.id}>
            {(fields.type !== 'array') && (fields.name !== 'refilling_due_date') && (fields.name !== 'last_service_done') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <InputField
                  name={fields.name}
                  label={fields.label}
                  type={fields.type}
                  formGroupClassName="m-1"
                  readOnly={fields.readonly}
                />
              </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'last_service_done') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <InputField
                  name={fields.name}
                  label={fields.label}
                  type={fields.type}
                  formGroupClassName="m-1"
                  value={getLocalDateTimeDBFormat(last_service_done || oldLastServiceDone)}
                  readOnly={fields.readonly}
                />
              </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'refilling_due_date') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <InputField
                  name={fields.name}
                  label={fields.label}
                  type={fields.type}
                  formGroupClassName="m-1"
                  value={getLocalDateTimeDBFormat(refilling_due_date || oldRefillingDueDate)}
                  readOnly={fields.readonly}
                />
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'parent_id') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  oldValue={oldParentId}
                  value={parent_id && parent_id.name ? parent_id.name : oldParentId}
                  open={parentOpen}
                  size="small"
                  onOpen={() => {
                    setParentOpen(true);
                    setParentKeyword('');
                  }}
                  onClose={() => {
                    setParentOpen(false);
                    setParentKeyword('');
                  }}
                  classes={{
                    option: classes.option,
                  }}
                  loading={equipmentInfo && equipmentInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  renderOption={(option) => (
                    <>
                      <h6 className="mb-1">{option.name}</h6>
                      <p className="font-tiny ml-2 mb-0 mt-0">{option.location_id ? option.location_id[1] : ''}</p>
                    </>
                  )}
                  options={parentOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onParentKeywordChange}
                      variant="outlined"
                      className="without-padding"
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'operating_hours') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  oldValue={oldHourId}
                  value={operating_hours && operating_hours.name ? operating_hours.name : oldHourId}
                  open={hoursOpen}
                  size="small"
                  onOpen={() => {
                    setHoursOpen(true);
                    setHoursKeyword('');
                  }}
                  onClose={() => {
                    setHoursOpen(false);
                    setHoursKeyword('');
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
                {(hoursInfo && hoursInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(hoursInfo)}</span></FormHelperText>)}
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'employee_id') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  oldValue={oldEmpId}
                  value={employee_id && employee_id.name ? employee_id.name : oldEmpId}
                  open={atOpen}
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
                {(employeeListInfo && employeeListInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeeListInfo)}</span></FormHelperText>)}
              </Col>
            )}
          </React.Fragment>
        ))}
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
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
            />
          </ModalBody>
        </Modal>
      </Row>
    </>
  );
};

AdditionalUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalUpdateForm;
