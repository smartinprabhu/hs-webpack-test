/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  DialogContent, DialogContentText,
  TextField, Autocomplete,
} from '@mui/material';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import moment from 'moment';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Input,
  Label,
  Row,
  FormGroup,
} from 'reactstrap';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  getEquipmentCost,
} from '../../assets/equipmentService';

import {
  updateHxAudit,
} from '../../auditManagement/auditService';
import {
  detectMob,
  decimalKeyPressDown,
  getAllowedCompanies,
  generateErrorMessage,
  numToFloat,
  getDatePickerFormat,
  getDateLocalMuI,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const AddEvent = React.memo(({
  auditId, lineId, breakdownId, editData, onClose, deleteId,
}) => {
  const [formValues, setFormValues] = useState({
    name: '',
    category_id: '',
    amount: '',
    description: '',
  });

  const dispatch = useDispatch();
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [validationMsg, setValidationMsg] = useState(false);
  const [showNoOptions, setShowNoOptions] = useState(false);

  const { hxAuditUpdate } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);
  const { equipmentCostInfo } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && openId) {
      dispatch(getEquipmentCost(companies, appModels.EQUIPMENTCOSTCATEGORY, productKeyword));
    }
  }, [productKeyword, openId]);

  useEffect(() => {
    if (lineId && editData.id) {
      const editValues = { ...editData };
      setFormValues(editValues);
    }
  }, [lineId, editData]);

  const onDataChange = (e, field) => {
    if (field === 'amount') {
      if (e.target.value && e.target.value > 0) {
        setFormValues((prevValues) => ({
          ...prevValues,
          [field]: e.target.value,
        }));
        setValidationMsg(false);
      } else {
        setFormValues((prevValues) => ({
          ...prevValues,
          [field]: '',
        }));
        setValidationMsg('Should be greater than zero');
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: e.target.value,
      }));
    }
  };

  const onDateFieldChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      date: value,
    }));
  };

  const onProductChange = (e, field) => {
    if (e && e.id) {
      setFormValues((prevValues) => ({
        ...prevValues,
        category_id: [e.id, e.name],
      }));
    }
  };

  const onProductKeywordClear = (e) => {
    setProductKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      category_id: '',
    }));
    setProductKeyword(false);
  };

  const createNC = () => {
    if (auditId) {
      const postData = { ...formValues };
      postData.category_id = formValues.category_id && formValues.category_id.length ? formValues.category_id[0] : false;
      postData.related_model = appModels.BREAKDOWNTRACKER;
      postData.related_model_id = breakdownId;
      postData.date = getDateLocalMuI(formValues.date);
      let postDataValues = {
        equipment_cost_ids: [[lineId ? 1 : 0, lineId || 0, postData]],
      };
      if (deleteId) {
        postDataValues = {
          equipment_cost_ids: [[2, lineId, false]],
        };
      }
      dispatch(updateHxAudit(auditId, appModels.EQUIPMENT, postDataValues));
    }
  };

  const isMobileView = detectMob();

  const isDisable =!formValues.name || !formValues.amount || !formValues.category_id;

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  // const categoryOptions = extractOptionsObject(equipmentCostInfo, formValues.category_id);

  let categoryOptions = [];

  if (equipmentCostInfo && equipmentCostInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (equipmentCostInfo && equipmentCostInfo.data) {
    categoryOptions = equipmentCostInfo.data;
  }

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: isMobileView ? '5px' : '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            {!deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Title
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  label="Title"
                  maxLength="150"
                  value={formValues.name}
                  onChange={(e) => onDataChange(e, 'name')}
                  className="bg-whitered"
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <FormGroup className="m-0">
                  <Label className="m-0">
                    Date
                  </Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        slotProps={{
                          actionBar: {
                            actions: ['clear', 'accept'],
                          },
                          textField: { variant: 'standard', error: false, InputLabelProps: { shrink: true } },
                        }}
                        name="date"
                        label=""
                        format={getDatePickerFormat(userInfo, 'date')}
                        className="ml-1 w-100"
                        value={formValues.date ? dayjs(formValues.date) : null}
                        onChange={onDateFieldChange}
                        maxDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Category
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Autocomplete
                  name="products_new"
                  className="bg-white min-width-200"
                  open={openId}
                  size="small"
                  onOpen={() => {
                    setOpen(true);
                    setProductKeyword('');
                  }}
                  onClose={() => {
                    setOpen(false);
                    setProductKeyword('');
                  }}
                  value={formValues.category_id && formValues.category_id.length ? formValues.category_id[1] : ''}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={categoryOptions}
                  onChange={(e, data) => { onProductChange(data); }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onProductKeywordChange}
                      variant="standard"
                      value={productKeyword}
                      className={formValues.category_id && formValues.category_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(equipmentCostInfo && equipmentCostInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {(formValues.category_id && formValues.category_id.length > 0 && formValues.category_id[0]) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={(e, data) => { onProductKeywordClear(data); }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                              )}
                              {/* <IconButton
                                        aria-label="toggle search visibility"
                                        onClick={(e, data) => { showProductModal(data, index); }}
                                      >
                                        <SearchIcon fontSize="small" />
                                      </IconButton> */}
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {((equipmentCostInfo && equipmentCostInfo.err)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentCostInfo)}</span></FormHelperText>)}
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Amount
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="amount"
                  label="Amount"
                  value={formValues.amount}
                  placeholder="0.00"
                  onKeyDown={decimalKeyPressDown}
                  onChange={(e) => onDataChange(e, 'amount')}
                  maxLength="10"
                  className="bg-whitered"
                />
                <div className="text-danger text-center d-inline font-11 font-weight-800">
                  {validationMsg}
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Description
                </Label>
                <Input
                  type="textarea"
                  name="Description"
                  label="Description"
                  placeholder="Description"
                  value={formValues.description}
                  onChange={(e) => onDataChange(e, 'description')}
                  className="bg-whitered"
                  rows="4"
                />
              </Col>
            </Row>
            )}
            {deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <p className="font-family-tab text-center">
                  Are you sure, you want to delete
                  {' '}
                  {editData.name}
                </p>
              </Col>
            </Row>
            )}
            {hxAuditUpdate && hxAuditUpdate.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(hxAuditUpdate && hxAuditUpdate.err) && (
            <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
            )}
            {hxAuditUpdate && hxAuditUpdate.data && !hxAuditUpdate.loading && (
            <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={`Cost ${lineId ? `${deleteId ? 'deleted' : 'updated'}` : 'added'} successfully.`} />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(hxAuditUpdate && hxAuditUpdate.data) && (
          <>
            <Button
              type="button"
              variant="contained"
              className="submit-btn"
              disabled={isDisable || (hxAuditUpdate && hxAuditUpdate.data) || hxAuditUpdate.loading}
              onClick={() => createNC()}
            >
              {lineId ? `${deleteId ? 'Yes' : 'Update'}` : 'Submit'}

            </Button>
            {deleteId && (
            <Button
              type="button"
              variant="contained"
              className="reset-btn"
              onClick={() => onClose()}
            >
              No

            </Button>
            )}
          </>
        )}
        {(hxAuditUpdate && hxAuditUpdate.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onClose()}
          disabled={hxAuditUpdate.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>

    </>
  );
});

export default AddEvent;
