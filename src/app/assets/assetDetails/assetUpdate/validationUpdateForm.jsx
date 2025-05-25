/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { CheckboxField, FormikAutocomplete, DateTimeField } from '@shared/formFields';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import formFields from './formFields.json';
import {
  getDateTimeSeconds, generateErrorMessage,
  getAllCompanies,
} from '../../../util/appUtils';
import { getEmployeeList } from '../../equipmentService';
import assetActionData from '../../data/assetsActions.json';
import { getTagText, getValidationTypesText } from '../../utils/utils';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../util/appModels').default;

const ValidationUpdateForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    setFieldTouched,
    isITAsset,
  } = props;
  const [tagOpen, setTagOpen] = useState(false);
  const [vsOpen, setVsOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { values: formValues } = useFormikContext();
  const {
    validated_on, tag_status, validation_status,
    validated_by,
  } = formValues;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { employeesInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen]);

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
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

  let employeeOptions = [];

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (validated_by && validated_by.length && validated_by.length > 0) {
    const oldMaintenanceTeam = [{ id: validated_by[0], name: validated_by[1] }];
    const newArr = [...employeeOptions, ...oldMaintenanceTeam];
    employeeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (employeesInfo && employeesInfo.data) {
    const arr = [...employeeOptions, ...employeesInfo.data];
    employeeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldTagStatus = tag_status || '';
  const oldValidationStatus = validation_status || '';
  const oldValidatedBy = validated_by && validated_by.length && validated_by.length > 0 ? validated_by[1] : '';

  return (

    <>
      <Card className="no-border-radius mt-3 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Validation</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        {formFields && formFields.validationFields && formFields.validationFields.map((fields) => (
          <React.Fragment key={fields.id}>
            {(fields.type !== 'array') && (fields.type !== 'checkbox') && (fields.name === 'validated_on') && (
              <Col sm="12" md="12" xs="12" lg="6">
                {/* <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                value={getLocalDateDBFormat(validated_on || oldValidatedOn)}
                readOnly={fields.readonly}
              /> */}
                <DateTimeField
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  placeholder={fields.label}
                  defaultValue={validated_on ? new Date(getDateTimeSeconds(validated_on)) : ''}
                />
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'tag_status') && !isITAsset && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  oldValue={getTagText(oldTagStatus)}
                  value={tag_status && tag_status.label ? tag_status.label : getTagText(oldTagStatus)}
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
            {(fields.type === 'checkbox') && (fields.name === 'is_qr_tagged') && isITAsset && (
              <Col xs={12} sm={12} lg={3} md={12}>
                <span className="font-weight-600 text-black d-inline-block mt-1 mb-1">Tag Status </span>
                <br />
                <CheckboxField
                  name={fields.name}
                  label={fields.label}
                  className="ml-2"
                />
              </Col>
            )}
            {(fields.type === 'checkbox') && (fields.name === 'is_nfc_tagged') && isITAsset && (
              <Col xs={12} sm={12} lg={3} md={12}>
                <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
                <br />
                <CheckboxField
                  name={fields.name}
                  label={fields.label}
                  className="ml-2"
                />
              </Col>
            )}
            {(fields.type === 'checkbox') && (fields.name === 'is_rfid_tagged') && isITAsset && (
              <Col xs={12} sm={12} lg={3} md={12}>
                <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
                <br />
                <CheckboxField
                  name={fields.name}
                  label={fields.label}
                  className="ml-2"
                />
              </Col>
            )}
            {(fields.type === 'checkbox') && (fields.name === 'is_virtually_tagged') && isITAsset && (
              <Col xs={12} sm={12} lg={3} md={12}>
                <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
                <br />
                <CheckboxField
                  name={fields.name}
                  label={fields.label}
                  className="ml-2"
                />
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'assignment_status') && (
              <Col sm="12" md="12" xs="12" lg="6" />
            )}
            {(fields.type === 'array') && (fields.name === 'validated_by') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  oldValue={oldValidatedBy}
                  value={validated_by && validated_by.name ? validated_by.name : oldValidatedBy}
                  open={employeeOpen}
                  size="small"
                  onOpen={() => {
                    setEmployeeOpen(true);
                  }}
                  onClose={() => {
                    setEmployeeOpen(false);
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
                {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>)}
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'validation_status') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
                  oldValue={getValidationTypesText(oldValidationStatus)}
                  value={validation_status && validation_status.label ? validation_status.label : getValidationTypesText(oldValidationStatus)}
                  open={vsOpen}
                  size="small"
                  onOpen={() => {
                    setVsOpen(true);
                  }}
                  onClose={() => {
                    setVsOpen(false);
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

ValidationUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isITAsset: PropTypes.bool,
};

ValidationUpdateForm.defaultProps = {
  isITAsset: false,
};

export default ValidationUpdateForm;
