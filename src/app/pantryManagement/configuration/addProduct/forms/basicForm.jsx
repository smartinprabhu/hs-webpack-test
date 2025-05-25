/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import {
  Row, Col, FormGroup, Label, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useFormikContext } from 'formik';
import ReactFileReader from 'react-file-reader';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import { InputField, FormikAutocomplete, DateTimeField } from '@shared/formFields';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import SearchModalMultiple from './searchModalMultiple';
import { getProductCategoryInfo, getMeasures } from '../../../../purchase/purchaseService';
import { getPantryName } from '../../../pantryService';
import {
  generateErrorMessage, getAllowedCompanies, decimalKeyPress, getDateTimeSeconds, isArrayColumnExists, getColumnArrayById, getArrayFromValuesById, avoidSpaceOnFirstCharacter,
} from '../../../../util/appUtils';
import formikInitialValues from '../formModel/formInitialValues';
import { bytesToSize } from '../../../../util/staticFunctions';
import customData from '../../../../adminSetup/maintenanceConfiguration/data/maintenanceData.json';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const BasicForm = React.memo((props) => {
  const {
    setFieldValue,
    editId,
    editData,
    setFieldTouched,
    reload,
    formField: {
      productName,
      categoryId,
      unitOfMeasure,
      purchaseUnitOfMeasure,
      minimumOrderQty,
      maximumOrderQty,
      newUntil,
      pantryname,
      status,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const classes = useStyles();
  const {
    name, categ_id, uom_id, uom_po_id, minimum_order_qty, maximum_order_qty, new_until, active, pantry_ids, image_medium,
  } = formValues;
  const [openCategoryId, setOpenCategoryId] = useState(false);
  const [uomOpen, setUomOpen] = useState(false);
  const [pomOpen, setPomOpen] = useState(false);
  const [refresh, setRefresh] = useState(reload);
  const [pantryOpen, setPantryOpen] = useState(false);
  const [pantryOptions, setPantryOptions] = useState([]);
  const [pantryKeyword, setPantryKeyword] = useState('');
  const [pantryLocationId, setPantryLocationId] = useState([]);
  const [uomKeyword, setUomKeyword] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [companyValue, setCompanyValue] = useState(false);

  const { productCategoryInfo, measuresInfo } = useSelector((state) => state.purchase);
  const { siteDetails } = useSelector((state) => state.site);

  const { pantryInfoList } = useSelector((state) => state.pantry);

  const { userInfo } = useSelector((state) => state.user);
  // const companies = getAllowedCompanies(userInfo);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  const dispatch = useDispatch();

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(image_medium);
  const [fileType, setFileType] = useState('data:image/png;base64,');

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductCategoryInfo(companies, appModels.PRODUCTCATEGORY));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getPantryName(companies, appModels.PANTRY));
    }
  }, [userInfo, pantryOpen]);
  
  useEffect(() => {
    if (editId && editData) {
      //setFileDataImage(editData.image_medium);
      setPantryLocationId(editData.pantry_ids);
      setStatusValue(editData.active ? { value: 'Active', label: 'Active' } : { value: 'Inactive', label: 'Inactive' });
    }
  }, [editId]);

  useEffect(() => {
    if (pantryLocationId) {
      setFieldValue('pantry_ids', pantryLocationId);
    }
  }, [pantryLocationId]);

  useEffect(() => {
    if (uom_id) {
      setFieldValue('uom_po_id', uom_id);
    }
  }, [uom_id]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [userInfo, uomKeyword]);

  useEffect(() => {
    if (refresh === '1') {
      setimgValidation(false);
      setimgSize(false);
      setFileDataImage(false);
      setFileType('');
    }
  }, [refresh]);

  useEffect(() => {
    setRefresh(reload);
  }, [reload]);

  let productCategoryOptions = [];
  let measureOptions = [];

  if (productCategoryInfo && productCategoryInfo.loading) {
    productCategoryOptions = [{ name: 'loading' }];
  }
  if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length) {
    const arr = [...productCategoryOptions, ...productCategoryInfo.data];
    productCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (productCategoryInfo && productCategoryInfo.err) {
    productCategoryOptions = [];
  }

  if (measuresInfo && measuresInfo.loading) {
    measureOptions = [{ name: 'loading' }];
  }
  if (measuresInfo && measuresInfo.data) {
    measureOptions = measuresInfo.data;
  }
  if (measuresInfo && measuresInfo.err) {
    measureOptions = [];
  }

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const onPantryKeywordClear = () => {
    setPantryKeyword(null);
    setPantryLocationId([]);
    setCheckRows([]);
    setPantryOpen(false);
  };
  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showPantryModal = () => {
    setModelValue(appModels.PANTRY);
    setFieldName('pantry_ids');
    setModalName('Pantry List');
    setColumns(['id', 'pantry_name', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (pantryInfoList && pantryInfoList.data && pantryInfoList.data.length && pantryOpen) {
      setPantryOptions(getArrayFromValuesById(pantryInfoList.data, isAssociativeArray(pantryLocationId || []), 'id'));
    } else if (pantryInfoList && pantryInfoList.loading) {
      setPantryOptions([{ name: 'Loading...' }]);
    } else {
      setPantryOptions([]);
    }
  }, [pantryInfoList, pantryOpen]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  // eslint-disable-next-line consistent-return
  const handleParticipants = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setPantryLocationId(options);
    setCheckRows(options);
  };

  // useEffect(() => {
  //   if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length) {
  //     const categData = productCategoryInfo.data.find((data) => data.display_name === 'All');
  //     if (categData) {
  //       formikInitialValues.categ_id = categData;
  //     }
  //   }
  // }, [productCategoryInfo]);

  // useEffect(() => {
  //   if (measuresInfo && measuresInfo.data && measuresInfo.data.length) {
  //     const unitData = measuresInfo.data.find((data) => data.name === 'Unit(s)');
  //     if (unitData && !uom_id) {
  //       formikInitialValues.uom_id = unitData;
  //     }
  //     if (unitData && !uom_po_id) {
  //       formikInitialValues.uom_po_id = unitData;
  //     }
  //   }
  // }, [measuresInfo]);

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
        setFileType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
        setFieldValue('image_small', fileData);
      }
    }
  };

  const setFileDataImageReset = () => {
    setFieldValue('image_medium', false);
    setFileDataImage(false);
    setimgValidation(false);
    setimgSize(false);
    setFileType(false);
  };
  
  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField name={productName.name} autoFocus={!name} label={productName.label} isRequired type="text" formGroupClassName="m-1" maxLength="30" onKeyPress={formValues && formValues.name === '' ? avoidSpaceOnFirstCharacter : true} />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={categoryId.name}
              label={categoryId.label}
              formGroupClassName="m-1"
              labelClassName="mb-2"
              size="small"
              isRequired={categoryId.isRequired}
              open={openCategoryId}
              onOpen={() => {
                setOpenCategoryId(true);
              }}
              onClose={() => {
                setOpenCategoryId(false);
              }}
              value={categ_id && categ_id.display_name ? categ_id.display_name : getOldData(categ_id)}
              loading={productCategoryInfo && productCategoryInfo.loading}
              getOptionSelected={(option, value) => option.display_name === value.display_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
              options={productCategoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Category"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {productCategoryInfo && productCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={newUntil.name}
              label={newUntil.label}
              formGroupClassName="m-1"
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={newUntil.label}
              disablePastDate
              defaultValue={new_until ? new Date(getDateTimeSeconds(new_until)) : ''}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <div className="m-1">
              <FormControl className={classes.margin}>
                <Label for={pantryname.name}>
                  {pantryname.label}
                </Label>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  name="pantry"
                  open={pantryOpen}
                  size="small"
                  className="bg-white"
                  onOpen={() => {
                    setPantryOpen(true);
                    setPantryKeyword('');
                  }}
                  onClose={() => {
                    setPantryOpen(false);
                    setPantryKeyword('');
                  }}
                  value={pantry_ids && pantry_ids.length > 0 ? pantry_ids : []}
                  defaultValue={pantryLocationId}
                  onChange={(e, options) => handleParticipants(options)}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={pantryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className={((getOldData(pantryLocationId)) || (pantryKeyword && pantryKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      onChange={(e) => setPantryKeyword(e.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(pantryInfoList && pantryInfoList.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((pantryKeyword && pantryKeyword.length > 0) || (pantry_ids && pantry_ids.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onPantryKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showPantryModal}
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
              </FormControl>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup>
              <Label for="logo">Product Image</Label>
              {((!image_medium || image_medium === '')) && (
              <ReactFileReader
                multiple
                elementId="fileUpload"
                handleFiles={handleFiles}
                fileTypes=".png"
                base64
              >
                <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                  <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                  <p className="font-weight-500">Select a file</p>
                </div>
              </ReactFileReader>
              )}
              {((editId && image_medium)) && (
              <div className="position-relative mt-2">
                <img
                  src={`data:image/png;base64,${image_medium}`}
                  height="150"
                  width="150"
                  className="ml-3"
                  id="pantryImageEdit"
                  alt="uploaded"
                />
                <div className="position-absolute topright-img-close">
                  <img
                    aria-hidden="true"
                    src={closeCircleIcon}
                    className="cursor-pointer"
                    onClick={() => {
                      setFileDataImageReset();
                    }}
                    alt="remove"
                  />
                </div>
              </div>
              )}
              {image_medium && !editId && (
              <div className="position-relative mt-2">
                <img
                  src={`${fileType}${fileDataImage}`}
                  height="150"
                  width="150"
                  className="ml-3"
                  id="pantryProductImageAdd"
                  alt="uploaded"
                />
                <div className="position-absolute topright-img-close">
                  <img
                    aria-hidden="true"
                    src={closeCircleIcon}
                    className="cursor-pointer"
                    onClick={() => {
                      setFileDataImageReset();
                    }}
                    alt="remove"
                  />
                </div>
              </div>
              )}
            </FormGroup>
            {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
            {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={minimumOrderQty.name}
              label={minimumOrderQty.label}
              value={minimum_order_qty}
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
              onKeyPress={decimalKeyPress}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={maximumOrderQty.name}
              label={maximumOrderQty.label}
              value={maximum_order_qty}
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
              onKeyPress={decimalKeyPress}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={unitOfMeasure.name}
              label={unitOfMeasure.label}
              isRequired={unitOfMeasure.isRequired}
              formGroupClassName="m-1"
              labelClassName="mb-2"
              size="small"
              open={uomOpen}
              onOpen={() => {
                setUomOpen(true);
                setUomKeyword('');
              }}
              onClose={() => {
                setUomOpen(false);
                setUomKeyword('');
              }}
              value={uom_id && uom_id.name ? uom_id.name : getOldData(uom_id)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={measureOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onUomKeyWordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {measuresInfo && measuresInfo.loading && uomOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(measuresInfo && measuresInfo.err && measuresInfo) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={purchaseUnitOfMeasure.name}
              label={purchaseUnitOfMeasure.label}
              isRequired={purchaseUnitOfMeasure.isRequired}
              formGroupClassName="m-1"
              labelClassName="mb-2"
              size="small"
              open={pomOpen}
              onOpen={() => {
                setPomOpen(true);
              }}
              onClose={() => {
                setPomOpen(false);
              }}
            // disabled={!uom_id}
              disabled
              value={uom_po_id && uom_po_id.name ? uom_po_id.name : getOldData(uom_po_id)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={measureOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {measuresInfo && measuresInfo.loading && pomOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(measuresInfo && measuresInfo.err && measuresInfo) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={status.name}
              label={status.label}
              formGroupClassName="m-1"
              open={typeOpen}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
              }}
              onClose={() => {
                setTypeOpen(false);
              }}
              disableClearable
              value={statusValue && statusValue.label ? statusValue.label : active}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.statusTypes}
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
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setCheckedRows={setCheckRows}
            olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            oldLocationData={pantryLocationId && pantryLocationId.length ? pantryLocationId : []}
          />
        </ModalBody>
        <ModalFooter>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { setExtraMultipleModal(false); if (fieldName === 'pantry_ids') { setPantryLocationId(checkedRows); } }}
                 variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal>
    </>
  );
});
BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  editData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  pantryIds: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isEdit: PropTypes.bool,
};
BasicForm.defaultProps = {
  isEdit: false,
};
export default BasicForm;
