/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Row, Col, Modal, ModalBody, Input, FormGroup, Label,
} from 'reactstrap';
import JoditEditor from 'jodit-react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';

import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  InputField, FormikAutocomplete,
} from '@shared/formFields';
import theme from '../../../util/materialTheme';
import { getEquipmentList } from '../../../helpdesk/ticketService';
import {
  getExpensesTypes,
  getExpensesItemTypes,
} from '../maintenanceService';
import {
  generateErrorMessage, getAllowedCompanies,
} from '../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModal from './searchModal';
import SearchModalMultiple from '../../../survey/forms/searchModalMultiple';

const appModels = require('../../../util/appModels').default;

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

const BasicForm = (props) => {
  const {
    editId,
    setFieldValue,
    formField: {
      title,
      typeId,
      equipmentId,
      subType,
      descriptionValue,
    },
  } = props;
  const editor = useRef(null);
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    type_id, equipment_id, item_id, description,
  } = formValues;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = useState(false);
  const [subTypeOpen, setSubTypeOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [typeKeyword, setTypeKeyword] = useState('');
  const [subTypeKeyword, setSubTypeKeyword] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');

  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [isEditor, showEditor] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { equipmentInfo } = useSelector((state) => state.ticket);
  const { expensesTypeInfo, expensesSubTypeInfo } = useSelector((state) => state.maintenance);

  useEffect(() => {
    (async () => {
      if (userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [equipmentOpen, equipmentKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && typeOpen) {
        await dispatch(getExpensesTypes(companies, appModels.OPERATIONALEXPANSESTYPE, typeKeyword));
      }
    })();
  }, [typeOpen, typeKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && subTypeOpen) {
        await dispatch(getExpensesItemTypes(companies, appModels.OPERATIONALEXPANSESSUBTYPE, subTypeKeyword));
      }
    })();
  }, [subTypeOpen, subTypeKeyword]);

  const showTypeModal = () => {
    setModelValue(appModels.OPERATIONALEXPANSESTYPE);
    setFieldName('type_id');
    setModalName('Type');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const showSubTypeModal = () => {
    setModelValue(appModels.OPERATIONALEXPANSESSUBTYPE);
    setFieldName('item_id');
    setModalName('SubType');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onEquipmentSearch = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipment');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name', 'location_id']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onTypeKeywordChange = (event) => {
    setTypeKeyword(event.target.value);
  };

  const subTypeKeywordChange = (event) => {
    setSubTypeKeyword(event.target.value);
  };

  const onTypeClear = () => {
    setTypeKeyword(null);
    setFieldValue('type_id', '');
    setTypeOpen(false);
  };

  const subTypeClear = () => {
    setTypeKeyword(null);
    setFieldValue('item_id', '');
    setSubTypeOpen(false);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onEquipmentClear = () => {
    setEquipmentKeyword(null);
    setEquipmentOpen(false);
    setFieldValue('equipment_id', '');
  };

  let equipmentOptions = [];
  let expensesTypeInfoOption = [];
  let expensesSubTypeInfoOption = [];

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    equipmentOptions = equipmentInfo.data;
  }
  if (equipment_id && equipment_id.length && equipment_id.length > 0) {
    const oldEquipId = [{ id: equipment_id[0], name: equipment_id[1] }];
    const newArr = [...equipmentOptions, ...oldEquipId];
    equipmentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (equipmentInfo && equipmentInfo.err) {
    equipmentOptions = [];
  }

  if (expensesTypeInfo && expensesTypeInfo.loading) {
    expensesTypeInfoOption = [{ name: 'Loading..' }];
  }

  if (type_id && type_id.length && type_id.length > 0) {
    const oldId = [{ id: type_id[0], name: type_id[1] }];
    const newArr = [...expensesTypeInfoOption, ...oldId];
    expensesTypeInfoOption = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (expensesTypeInfo && expensesTypeInfo.err) {
    expensesTypeInfoOption = [];
  }

  if (expensesTypeInfo && expensesTypeInfo.data) {
    const arr = [...expensesTypeInfoOption, ...expensesTypeInfo.data];
    expensesTypeInfoOption = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (expensesSubTypeInfo && expensesSubTypeInfo.loading) {
    expensesSubTypeInfoOption = [{ name: 'Loading..' }];
  }

  if (item_id && item_id.length && item_id.length > 0) {
    const oldId = [{ id: item_id[0], name: item_id[1] }];
    const newArr = [...expensesSubTypeInfoOption, ...oldId];
    expensesSubTypeInfoOption = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (expensesSubTypeInfo && expensesSubTypeInfo.err) {
    expensesSubTypeInfoOption = [];
  }

  if (expensesSubTypeInfo && expensesSubTypeInfo.data) {
    const arr = [...expensesSubTypeInfoOption, ...expensesSubTypeInfo.data];
    expensesSubTypeInfoOption = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onChange = (data) => {
    setFieldValue('description', data);
  };

  
  return (
    <>
    <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800">General Information</span>
      <ThemeProvider theme={theme}>
      <Row className="mb-3 mr-2">
          <Col xs={12} sm={6} md={6} lg={6}>
                <InputField
                  name={title.name}
                  label={title.label}
                  isRequired
                  customClassName="bg-input-blue-small"
                  labelClassName="mb-1"
                  formGroupClassName="mb-1"
                  type="text"
                />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
          <FormikAutocomplete
            name={typeId.name}
            label={typeId.label}
            labelClassName="mb-1"
            formGroupClassName="mb-1 w-100"
            open={typeOpen}
            size="small"
            isRequired
            oldValue={getOldData(type_id)}
            value={type_id && type_id.name ? type_id.name : getOldData(type_id)}
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            classes={{
              option: classes.option,
            }}
            loading={expensesTypeInfo && expensesTypeInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            renderOption={(option) => (
              <>
                <h6 className="mb-1">{option.name}</h6>
                <p className="font-tiny ml-2 mb-0 mt-0">{option.type_id ? option.type_id[1] : ''}</p>
              </>
            )}
            options={expensesTypeInfoOption}
            renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTypeKeywordChange}
                  variant="outlined"
                  value={typeKeyword}
                  className={(getOldData(type_id) || (type_id && type_id.id) || (typeKeyword && typeKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {expensesTypeInfo && expensesTypeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {(getOldData(type_id) || (type_id && type_id.id) || (typeKeyword && typeKeyword.length > 0)) && (
                          <IconButton onClick={onTypeClear}>
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton onClick={showTypeModal}>
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
            )}
          />
            {(expensesTypeInfo && expensesTypeInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(expensesTypeInfo)}</span></FormHelperText>)}
          </Col>
         <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={subType.name}
              label={subType.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={subTypeOpen}
              size="small"
              oldValue={getOldData(item_id)}
              value={item_id && item_id.name ? item_id.name : getOldData(item_id)}
              onOpen={() => {
                setSubTypeOpen(true);
              }}
              onClose={() => {
                setSubTypeOpen(false);
              }}
              classes={{
                option: classes.option,
              }}
              loading={expensesSubTypeInfo && expensesSubTypeInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(option) => (
                <>
                  <h6 className="mb-1">{option.name}</h6>
                  <p className="font-tiny ml-2 mb-0 mt-0">{option.item_id ? option.item_id[1] : ''}</p>
                </>
              )}
              options={expensesSubTypeInfoOption}
              renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={subTypeKeywordChange}
                    variant="outlined"
                    value={subTypeKeyword}
                    className={(getOldData(item_id) || (item_id && item_id.id) || (subTypeKeyword && subTypeKeyword.length > 0))
                      ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {expensesSubTypeInfo && expensesSubTypeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {(getOldData(item_id) || (item_id && item_id.id) || (subTypeKeyword && subTypeKeyword.length > 0)) && (
                            <IconButton onClick={subTypeClear}>
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton onClick={showSubTypeModal}>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
              )}
            />
            {(expensesSubTypeInfo && expensesSubTypeInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(expensesSubTypeInfo)}</span></FormHelperText>)}
         </Col>
          {/* <Col xs={12} sm={6} md={6} lg={6}>
                <InputField
                  name={subType.name}
                  label={subType.label}
                  customClassName="bg-input-blue-small"
                  labelClassName="mb-1"
                  formGroupClassName="mb-1"
                  type="text"
                />
                  </Col> */}
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={equipmentId.name}
              label={equipmentId.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={equipmentOpen}
              size="small"
              oldValue={getOldData(equipment_id)}
              value={equipment_id && equipment_id.name ? equipment_id.name : getOldData(equipment_id)}
              onOpen={() => {
                setEquipmentOpen(true);
              }}
              onClose={() => {
                setEquipmentOpen(false);
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
                  <p className="font-tiny ml-2 mb-0 mt-0">{option.equipment_id ? option.equipment_id[1] : ''}</p>
                </>
              )}
              options={equipmentOptions}
              renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onEquipmentKeywordChange}
                    variant="outlined"
                    value={equipmentKeyword}
                    className={(getOldData(equipment_id) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0))
                      ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {(getOldData(equipment_id) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                            <IconButton onClick={onEquipmentClear}>
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton onClick={onEquipmentSearch}>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
              )}
            />
              {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
          </Col>

          <Col xs={12} sm={12} md={12} lg={12}>
          <FormGroup>
              <Label for={descriptionValue.name} className="mb-0 mt-2">
                {descriptionValue.label}
              </Label>
              {!isEditor && description.length === 0 && (
                <Input
                  type="input"
                  name={descriptionValue.name}
                  // defaultValue={descriptionValue.name}
                  customClassName="bg-input-blue-small"
                  className="subjectticket bw-2 mt-2"
                  placeholder="Please provide description"
                  onClick={() => showEditor(true)}
                  onMouseLeave={() => showEditor(false)}
                />
              )}
              {((isEditor) || (description && description.length > 0)) && (
                <div>
                  <JoditEditor
                    ref={editor}
                    value={description}
                    onChange={onChange}
                    onBlur={onChange}
                  />
                </div>
              )}
          </FormGroup>
          </Col>
      </Row>
        {/* <Row>
        <Col xs={12} sm={6} md={6} lg={6} />
        <Col xs={12} sm={6} md={6} lg={6}>
            <InputField name={startsAt.name} isRequired label={startsAt.label} type="text" onKeyPress={decimalKeyPress} maxLength="5" placeHolder="0.00" />
        </Col>
        </Row>
        <Row>
        <Col xs={12} sm={6} md={6} lg={6} />
        <Col xs={12} sm={6} md={6} lg={6}>
            <InputField name={durationAt.name} isRequired label={durationAt.label} type="text" onKeyPress={decimalKeyPress} maxLength="5" placeHolder="0.00" />
        </Col>
        </Row>

        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <InputField
              name={descriptionValue.name}
              label={descriptionValue.label}
              isRequired
              formGroupClassName="m-1"
              type="textarea"
              rows="4"
            />
          </Col>
                </Row> */}
        <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
          <ModalBody className="mt-0 pt-0">
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
          </ModalBody>
        </Modal>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraSearchModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraSearchModal(false); }} />
          <ModalBody className="mt-0 pt-0">
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
            />
          </ModalBody>
        </Modal>
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
            />
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
};

BasicForm.defaultProps = {
  editId: undefined,
};

BasicForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
