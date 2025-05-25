/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col,
  Modal,
  ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import { InputField, FormikAutocomplete } from '@shared/formFields';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getPartners,
} from '../../../../../../assets/equipmentService';
import {
  getStockPickingTypes,
  getStockLocations,
} from '../../../../../purchaseService';
import { getTrimmedArray } from '../../../../../../workorders/utils/utils';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractValueObjects,
  noSpecialChars,
} from '../../../../../../util/appUtils';
import SearchModal from './searchModal';

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

const appModels = require('../../../../../../util/appModels').default;

const BasicForm = (props) => {
  const {
    editId,
    id,
    typeDisabled,
    setFieldValue,
    reload,
    formField: {
      partnerId,
      pickingTypeId,
      locationDestId,
      locationId,
      scheduledDate,
      origin,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    partner_id,
    picking_type_id,
    location_dest_id,
    location_id,
    scheduled_date,
  } = formValues;
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');
  const [destLocOpen, setDestLocOpen] = useState(false);
  const [destLocKeyword, setDestLocKeyword] = useState('');
  const [locOpen, setLocOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [refresh, setRefresh] = useState(reload);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    transferDetails, quotationDetails, pickingTypes, stockLocations,
    transferFilters,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    setRefresh(refresh);
  }, [reload]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      if (picking_type_id) {
        if (picking_type_id.default_location_src_id) {
          setFieldValue('location_id', { id: picking_type_id.default_location_src_id[0], name: picking_type_id.default_location_src_id[1] });
        } else {
          setFieldValue('location_id', '');
        }
        if (picking_type_id.default_location_dest_id) {
          setFieldValue('location_dest_id', { id: picking_type_id.default_location_dest_id[0], name: picking_type_id.default_location_dest_id[1] });
        } else {
          setFieldValue('location_dest_id', '');
        }
      } else {
        setFieldValue('location_id', '');
        setFieldValue('location_dest_id', '');
      }
    }
  }, [refresh, picking_type_id, editId]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      if (!location_id) {
        setFieldValue('location_dest_id', '');
      }
      if (location_id && location_id.location_id) {
        setFieldValue('location_dest_id', '');
      }
    }
  }, [refresh, location_id]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      setFieldValue('scheduled_date', moment(new Date()).format('YYYY-MM-DD'));
    }
  }, [refresh, location_id]);

  useEffect(() => {
    if (refresh === '1' && editId) {
      if (picking_type_id) {
        if (picking_type_id.default_location_src_id) {
          setFieldValue('location_id', { id: picking_type_id.default_location_src_id[0], name: picking_type_id.default_location_src_id[1] });
        }
        if (picking_type_id.default_location_dest_id) {
          setFieldValue('location_dest_id', { id: picking_type_id.default_location_dest_id[0], name: picking_type_id.default_location_dest_id[1] });
        }
      } else {
        setFieldValue('location_id', '');
        setFieldValue('location_dest_id', '');
      }
    }
  }, [refresh, picking_type_id, editId]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      if (transferFilters && transferFilters.types) {
        const data = transferFilters.types.filter((item) => (item.id));
        if (data && data.length) {
          setFieldValue('picking_type_id', {
            id: data[0].id, name: data[0].name, default_location_src_id: data[0].source_id, default_location_dest_id: data[0].destination_id,
          });
        }
      }
    }
  }, [refresh, transferFilters, editId]);

  useEffect(() => {
    if (!editId && quotationDetails && quotationDetails.data) {
      if (quotationDetails.data[0].name) {
        setFieldValue('origin', quotationDetails.data[0].name);
      }
    }
  }, [editId, quotationDetails]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, false, customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeOpen) {
      dispatch(getStockPickingTypes(companies, appModels.STOCKPICKINGTYPES, typeKeyword, id ? '' : 'all'));
    }
  }, [userInfo, typeKeyword, typeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && destLocOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, destLocKeyword));
    }
  }, [userInfo, destLocKeyword, destLocOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && locOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword));
    }
  }, [userInfo, locKeyword, locOpen]);

  const onDestLocKeywordChange = (event) => {
    setDestLocKeyword(event.target.value);
  };

  const onSourceLocKeywordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const showDestLocModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('location_dest_id');
    setModalName('Stock Locations');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onDestLocKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('location_dest_id', '');
    setCustomerOpen(false);
  };

  const showLocModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('location_id');
    setModalName('Stock Locations');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onLocKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('location_id', '');
    setCustomerOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('partner_id');
    setModalName('Partners');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name', 'email', 'mobile']);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('partner_id', '');
    setCustomerOpen(false);
  };

  const showTypeModal = () => {
    setModelValue(appModels.STOCKPICKINGTYPES);
    setFieldName('picking_type_id');
    setModalName('Operation Types');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(false);
    setExtraModal(true);
    setColumns(['id', 'name', 'warehouse_id', 'default_location_src_id', 'default_location_dest_id']);
  };

  const onTypeKeywordChange = (event) => {
    setTypeKeyword(event.target.value);
  };

  const onTypeKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('picking_type_id', '');
    setCustomerOpen(false);
  };

  let customerOptions = [];
  let typeOptions = [];
  let destLocOptions = [];
  let locOptions = [];

  if (stockLocations && stockLocations.loading) {
    if (destLocOpen) {
      destLocOptions = [{ name: 'Loading..' }];
    }
    if (locOpen) {
      locOptions = [{ name: 'Loading..' }];
    }
  }

  if (stockLocations && stockLocations.err) {
    if (destLocOpen) {
      destLocOptions = [];
    }
    if (locOpen) {
      locOptions = [];
    }
  }

  if (location_dest_id && location_dest_id.length && location_dest_id.length > 0) {
    const oldId = [{ id: location_dest_id[0], name: location_dest_id[1] }];
    const newArr = [...destLocOptions, ...oldId];
    destLocOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (location_id && location_id.length && location_id.length > 0) {
    const oldId = [{ id: location_id[0], name: location_id[1] }];
    const newArr = [...locOptions, ...oldId];
    locOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (stockLocations && stockLocations.data) {
    if (destLocOpen) {
      const sid = extractValueObjects(location_id);
      const data = getTrimmedArray(stockLocations.data, 'id', sid);
      const arr = [...destLocOptions, ...data];
      destLocOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (locOpen) {
      const sid = extractValueObjects(location_dest_id);
      const data = getTrimmedArray(stockLocations.data, 'id', sid);
      const arr = [...locOptions, ...data];
      locOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }

  if (partner_id && partner_id.length && partner_id.length > 0) {
    const oldPartId = [{ id: partner_id[0], name: partner_id[1] }];
    const newArr = [...customerOptions, ...oldPartId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  if (pickingTypes && pickingTypes.loading) {
    typeOptions = [{ name: 'Loading..' }];
  }

  if (picking_type_id && picking_type_id.length && picking_type_id.length > 0) {
    const oldPartId = [{ id: picking_type_id[0], name: picking_type_id[1] }];
    const newArr = [...typeOptions, ...oldPartId];
    typeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (pickingTypes && pickingTypes.data) {
    const arr = [...typeOptions, ...pickingTypes.data];
    typeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (pickingTypes && pickingTypes.err) {
    typeOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const states = editId && transferDetails && transferDetails.data && transferDetails.data.length > 0 ? transferDetails.data[0].state : false;
  const tranferData = editId && transferDetails && transferDetails.data && transferDetails.data.length ? transferDetails.data[0] : '';
  const isEditable = ((tranferData && tranferData.picking_type_code !== 'incoming' && tranferData.state === 'draft')
  || (tranferData && tranferData.picking_type_code === 'incoming' && (tranferData.state === 'draft' || tranferData.state === 'confirmed'))) || !editId;

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={partnerId.name}
              label={partnerId.label}
              formGroupClassName="m-1"
              disabled={states === 'done' || states === 'cancel'}
              oldValue={getOldData(partner_id)}
              value={partner_id && partner_id.name ? partner_id.name : getOldData(partner_id)}
              open={customerOpen}
              size="small"
              onOpen={() => {
                setCustomerOpen(true);
                setCustomerKeyword('');
              }}
              onClose={() => {
                setCustomerOpen(false);
                setCustomerKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              loading={partnersInfo && partnersInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(option) => (
                <>
                  <h6>{option.name}</h6>
                  <p className="float-left">
                    {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                    )}
                  </p>
                  <p className="float-right">
                    {option.mobile && (
                    <>
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      {option.mobile}
                    </>
                    )}
                  </p>
                </>
              )}
              options={customerOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCustomerKeywordChange}
                  variant="outlined"
                  value={customerKeyword}
                  className={((partner_id && partner_id.id) || (customerKeyword && customerKeyword.length > 0) || (partner_id && partner_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((states !== 'done' && states !== 'cancel') && ((partner_id && partner_id.id) || (customerKeyword && customerKeyword.length > 0) || (partner_id && partner_id.length))) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          {(states !== 'done' && states !== 'cancel') && (
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showRequestorModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {(partnersInfo && partnersInfo.err) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
            )}
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormikAutocomplete
              name={pickingTypeId.name}
              label={pickingTypeId.label}
              isRequired
              disabled={editId || typeDisabled}
              formGroupClassName="m-1"
              oldValue={getOldData(picking_type_id)}
              value={picking_type_id && picking_type_id.name ? picking_type_id.name : getOldData(picking_type_id)}
              open={typeOpen}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
                setTypeKeyword('');
              }}
              onClose={() => {
                setTypeOpen(false);
                setTypeKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              loading={pickingTypes && pickingTypes.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(option) => (
                <>
                  <h6>{option.name}</h6>
                  <p className="float-left text-capital">
                    {option.code}
                  </p>
                  <p className="float-right">
                    {option.warehouse_id && (
                    <>
                      {option.warehouse_id[1]}
                    </>
                    )}
                  </p>
                </>
              )}
              options={typeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTypeKeywordChange}
                  variant="outlined"
                  value={typeKeyword}
                  className={((picking_type_id && picking_type_id.id) || (typeKeyword && typeKeyword.length > 0) || (picking_type_id && picking_type_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {pickingTypes && pickingTypes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((!editId) && ((picking_type_id && picking_type_id.id)
                          || (typeKeyword && typeKeyword.length > 0) || (picking_type_id && picking_type_id.length)) && (!typeDisabled)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTypeKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          {((!editId) && (!typeDisabled)) && (
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTypeModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {(pickingTypes && pickingTypes.err) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(pickingTypes)}</span></FormHelperText>
            )}
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormikAutocomplete
              name={locationId.name}
              label={locationId.label}
              isRequired
              disabled={!isEditable}
              formGroupClassName="m-1"
              oldValue={getOldData(location_id)}
              value={location_id && location_id.name ? location_id.name : getOldData(location_id)}
              open={locOpen}
              size="small"
              onOpen={() => {
                setLocOpen(true);
                setLocKeyword('');
              }}
              onClose={() => {
                setLocOpen(false);
                setLocKeyword('');
              }}
              loading={stockLocations && stockLocations.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={locOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSourceLocKeywordChange}
                  variant="outlined"
                  value={locKeyword}
                  className={((location_id && location_id.id) || (locKeyword && locKeyword.length > 0) || (location_id && location_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stockLocations && stockLocations.loading && locOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((isEditable) && ((location_id && location_id.id) || (locKeyword && locKeyword.length > 0) || (location_id && location_id.length))) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onLocKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          {(isEditable) && (
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showLocModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {(stockLocations && stockLocations.err && locOpen) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>
            )}
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormikAutocomplete
              name={locationDestId.name}
              label={locationDestId.label}
              isRequired
              disabled={!isEditable}
              formGroupClassName="m-1"
              oldValue={getOldData(location_dest_id)}
              value={location_dest_id && location_dest_id.name ? location_dest_id.name : getOldData(location_dest_id)}
              open={destLocOpen}
              size="small"
              onOpen={() => {
                setDestLocOpen(true);
                setDestLocKeyword('');
              }}
              onClose={() => {
                setDestLocOpen(false);
                setDestLocKeyword('');
              }}
              loading={stockLocations && stockLocations.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={destLocOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onDestLocKeywordChange}
                  variant="outlined"
                  value={destLocKeyword}
                  className={((location_dest_id && location_dest_id.id) || (destLocKeyword && destLocKeyword.length > 0) || (location_dest_id && location_dest_id.length))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stockLocations && stockLocations.loading && destLocOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((isEditable) && ((location_dest_id && location_dest_id.id)
                          || (destLocKeyword && destLocKeyword.length > 0) || (location_dest_id && location_dest_id.length))) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onDestLocKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          {(isEditable) && (
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showDestLocModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {(stockLocations && stockLocations.err && destLocOpen) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>
            )}
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={scheduledDate.name}
              label={scheduledDate.label}
              formGroupClassName="m-1"
              readOnly={states === 'done' || states === 'cancel'}
              type="date"
              value={scheduled_date ? moment(scheduled_date).format('YYYY-MM-DD') : ''}
              min={moment(new Date()).format('YYYY-MM-DD')}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={origin.name}
              label={origin.label}
              formGroupClassName="m-1"
              onKeyPress={noSpecialChars}
              readOnly={!!id}
              type="text"
              maxLength="50"
            />
          </Col>
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            srcLocation={location_id}
            destLocation={location_dest_id}
            setFieldValue={setFieldValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  typeDisabled: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reload: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};
BasicForm.defaultProps = {
  typeDisabled: false,
};

export default BasicForm;
