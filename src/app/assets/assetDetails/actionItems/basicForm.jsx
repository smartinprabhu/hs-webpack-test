/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { InputField, DateTimeField, FormikAutocomplete } from '@shared/formFields';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { Radio } from 'antd';
import moment from 'moment';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getDateTimeSeconds, getAllCompanies, extractOptionsObject, generateErrorMessage, extractOptionsObjectWithName,
} from '../../../util/appUtils';
import { getEquipmentList, getSpaceAllSearchList } from '../../../helpdesk/ticketService';
import { getEmployeeDataList } from '../../equipmentService';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../util/appModels').default;

const BasicForm = (props) => {
  const {
    setFieldValue, setFieldTouched, entityType, setEntityType, actionText, isITAsset, categoryType,
    formField: {
      dateValue,
      dateReturnValue,
      remark,
      location,
      employeeId,
      assetIds,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    asset_id, date, location_id, employee_id,
  } = formValues;
  const dispatch = useDispatch();
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetKeyword, setAssetKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');

  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { updateEquipment } = useSelector((state) => state.equipment);
  const { equipmentInfo, spaceInfoList } = useSelector((state) => state.ticket);
  const { employeeListInfo } = useSelector((state) => state.equipment);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const companies = getAllCompanies(userInfo, userRoles);

  const handleEntityTypeChange = (e) => {
    setFieldValue('asset_id', '');
    setFieldValue('location_id', '');
    setFieldValue('employee_id', '');
    setEntityType(e.target.value);
  };

  useEffect(() => {
    if (actionText) {
      setFieldValue('date', moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [actionText]);

  useEffect(() => {
    if (entityType) {
      setFieldValue('checkout_to', entityType);
    }
  }, [entityType]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, assetKeyword, isITAsset));
      }
    })();
  }, [userInfo, assetOpen, assetKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && employeeOpen) {
      dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, employeeKeyword));
    }
  }, [userInfo, employeeKeyword, employeeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword));
      }
    })();
  }, [spaceOpen, spacekeyword]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onEquipmentClear = () => {
    setAssetKeyword(null);
    setAssetOpen(false);
    setFieldValue('asset_id', '');
  };

  const onEquipemntSearch = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('asset_id');
    setModalName('Equipment');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name', 'location_id']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceSearch = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_id');
    setModalName('Space');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'space_name', 'path_name']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setSpaceOpen(false);
    setFieldValue('location_id', '');
  };

  const onEmployeeKeyWordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onEmployeeClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('employee_id', '');
    setEmployeeOpen(false);
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name', 'work_phone', 'work_email']);
    setFieldName('employee_id');
    setModalName('Employee List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const categoryOptions = extractOptionsObject(equipmentInfo, asset_id);
  const employeeOptions = extractOptionsObject(employeeListInfo, employee_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, location_id, 'path_name');

  return (
    <>

      <Row className="p-1">
        {(updateEquipment && updateEquipment.data) ? '' : (
          <>
            <Col md="6" sm="6" lg="6" xs="12">
              <Col xs={12} sm={12} lg={12} md={12}>
                <span className="font-weight-600 text-black">Entity Type </span>
                <br />
                <Radio.Group value={entityType} disabled={actionText === 'Return Asset'} className="mt-2" onChange={handleEntityTypeChange}>
                  <Radio.Button value="Employee">Employee</Radio.Button>
                  <Radio.Button value="Equipment">Equipment</Radio.Button>
                  <Radio.Button value="Location">Location</Radio.Button>
                </Radio.Group>
              </Col>
            </Col>
            <Col md="6" sm="6" lg="6" xs="12">
              <Col xs={12} sm={12} lg={12} md={12}>
                <DateTimeField
                  name={actionText === 'Assign Asset' ? dateValue.name : dateReturnValue.name}
                  label={actionText === 'Assign Asset' ? dateValue.label : dateReturnValue.label}
                  isRequired
                  formGroupClassName="m-1"
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  placeholder={actionText === 'Assign Asset' ? dateValue.label : dateReturnValue.label}
                  defaultValue={date ? new Date(getDateTimeSeconds(date)) : ''}
                />
              </Col>
            </Col>
            <Col md="6" sm="6" lg="6" xs="12">
              <Col xs={12} sm={12} lg={12} md={12}>
                {entityType === 'Equipment'
                  ? (
                    <FormikAutocomplete
                      name={assetIds.name}
                      label={actionText === 'Assign Asset' ? assetIds.label : 'From Entity'}
                      formGroupClassName="m-1"
                      isRequired
                      disabled={actionText === 'Return Asset'}
                      oldValue={getOldData(asset_id)}
                      value={asset_id && asset_id.name ? asset_id.name : getOldData(asset_id)}
                      apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
                      open={assetOpen}
                      size="small"
                      onOpen={() => {
                        setAssetOpen(true);
                        setAssetKeyword('');
                      }}
                      onClose={() => {
                        setAssetOpen(false);
                        setAssetKeyword('');
                      }}
                      loading={equipmentInfo && equipmentInfo.loading}
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={categoryOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          //= {onComplianceCatKeyWordChange}
                          variant="outlined"
                          className={((getOldData(asset_id)) || (asset_id && asset_id.id) || (assetKeyword && assetKeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {actionText !== 'Return Asset' && (
                                  <InputAdornment position="end">
                                    {((getOldData(asset_id)) || (asset_id && asset_id.id) || (assetKeyword && assetKeyword.length > 0)) && (
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onEquipmentClear}
                                      >
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={onEquipemntSearch}
                                    >
                                      <SearchIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                )}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : ''}
                {entityType === 'Location'
                  ? (
                    <FormikAutocomplete
                      name={location.name}
                      label={actionText === 'Assign Asset' ? location.label : 'From Entity'}
                      className="bg-white"
                      open={spaceOpen}
                      isRequired
                      size="small"
                      disabled={actionText === 'Return Asset'}
                      onOpen={() => {
                        setSpaceOpen(true);
                        setSpaceKeyword('');
                      }}
                      onClose={() => {
                        setSpaceOpen(false);
                        setSpaceKeyword('');
                      }}
                      oldValue={getOldData(location_id)}
                      value={location_id && location_id.path_name ? location_id.path_name : getOldData(location_id)}
                      loading={spaceInfoList && spaceInfoList.loading}
                      getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                      apiError={(spaceInfoList && spaceInfoList.err) ? generateErrorMessage(spaceInfoList) : false}
                      options={spaceOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={onSpaceKeywordChange}
                          variant="outlined"
                          className={((getOldData(location_id)) || (location_id && location_id.id) || (spacekeyword && spacekeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {actionText !== 'Return Asset' && (
                                  <InputAdornment position="end">
                                    {((getOldData(location_id)) || (location_id && location_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
                                      <IconButton onClick={onSpaceClear}>
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton onClick={onSpaceSearch}>
                                      <SearchIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                )}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : ''}
                {entityType === 'Employee'
                  ? (
                    <FormikAutocomplete
                      name={employeeId.name}
                      label={actionText === 'Assign Asset' ? employeeId.label : 'From Entity'}
                      isRequired
                      formGroupClassName="m-1"
                      oldValue={getOldData(employee_id)}
                      value={employee_id && employee_id.name ? employee_id.name : getOldData(employee_id)}
                      apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
                      open={employeeOpen}
                      size="small"
                      disabled={actionText === 'Return Asset'}
                      onOpen={() => {
                        setEmployeeOpen(true);
                        setEmployeeKeyword('');
                      }}
                      onClose={() => {
                        setEmployeeOpen(false);
                        setEmployeeKeyword('');
                      }}
                      loading={employeeListInfo && employeeListInfo.loading}
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={employeeOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={onEmployeeKeyWordChange}
                          variant="outlined"
                          value={employeeKeyword}
                          className={((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {actionText !== 'Return Asset' && (
                                  <InputAdornment position="end">
                                    {((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onEmployeeClear}
                                      >
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={showEmployeeModal}
                                    >
                                      <SearchIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                )}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : ''}
              </Col>
            </Col>
            <Col md="6" sm="6" lg="6" xs="12">
              <Col xs={12} sm={12} lg={12} md={12}>
                <InputField
                  name={remark.name}
                  label={remark.label}
                  formGroupClassName="m-1"
                  type="textarea"
                  rows="4"
                  isRequired
                />
              </Col>
            </Col>
          </>
        )}
        <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
          <ModalBody className="mt-0 pt-0">
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
              categoryType={categoryType}
            />
          </ModalBody>
        </Modal>
      </Row>
    </>
  );
};

BasicForm.defaultProps = {
  isITAsset: false,
  categoryType: false,
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  entityType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setEntityType: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isITAsset: PropTypes.bool,
  categoryType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};
export default BasicForm;
