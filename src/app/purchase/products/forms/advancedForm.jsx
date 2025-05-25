/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import { CircularProgress } from '@material-ui/core';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import { Typography, TextField, Box } from "@mui/material";
import { IoCloseOutline } from 'react-icons/io5';

import {
  decimalKeyPressDown, generateErrorMessage, getAllowedCompaniesCase, extractOptionsObject,
} from '../../../util/appUtils';
import {
  getInventoryDepartment,
} from '../../purchaseService';
import formikInitialValues from '../formModel/formInitialValues';
import AdvancedSearchModal from './searchModal';
import { AddThemeColor } from '../../../themes/theme';
import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import MuiTextField from "../../../commonComponents/formFields/muiTextField";
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const AdvancedForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    isEdit,
    isUpdate,
    formField: {
      cost,
      specificationValue,
      brandValue,
      department,
      alertLevel,
      reorderLevel,
      reorderQuantity,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    standard_price, department_id,
    brand, specification, alert_level_qty, reordering_min_qty, reordering_max_qty,
  } = formValues;

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompaniesCase(userInfo);
  const {
    departmentInfo, productsInfo, 
  } = useSelector((state) => state.purchase);
  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && departmentOpen) {
        await dispatch(getInventoryDepartment(companies, appModels.PRODUCTDEPARTMENT, departmentKeyword));
      }
    })();
  }, [departmentOpen, departmentKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      formikInitialValues.company_id = userCompanyId;
    }
  }, [userInfo]);

  /*const getCost = (id) => {
    const pdata = productsInfo && productsInfo.data ? productsInfo.data : [];
    const filteredType = pdata.filter((data) => data.id === id);
    if (filteredType && filteredType.length) {
      return filteredType[0].standard_price;
    }
    return 0;
  };

  useEffect(() => {
    if (isEdit && isUpdate) {
      setFieldValue('standard_price', getCost(isEdit));
    }
  }, [isUpdate, isEdit]);*/

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onDepartmentClear = () => {
    setDepartmentKeyword(null);
    setFieldValue('department_id', '');
    setDepartmentOpen(false);
  };

  const showDepartmentModal = () => {
    setModelValue(appModels.PRODUCTDEPARTMENT);
    setColumns(['id', 'name']);
    setFieldName('department_id');
    setModalName('Department List');
    setCompanyValue('');
    setExtraModal(true);
  };

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;

  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;
  const currentCompany = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : false;

  const isCompany = currentCompany && productsListId && (productsListId === currentCompany);
  const isSite = productsListAccess && productsListAccess === 'Own Site Level';

  const departmentMembersOptions = extractOptionsObject(departmentInfo, department_id);
  return (
    <>
      <Box
        sx={{
          marginTop: "20px",
          width: "50%",
          gap: '35px'
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: "normal normal medium 20px/24px Suisse Intl",
            letterSpacing: "0.7px",
            fontWeight: 500,
            marginBottom: "10px",
            paddingBottom: '4px'
          })}
        >
          Additional Information
        </Typography>
        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={specificationValue.name}
          label={specificationValue.label}
          setFieldValue={setFieldValue}
          inputProps={{ maxLength: 30 }}
          value={specification || ''}
        />

        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={brandValue.name}
          label={brandValue.label}
          setFieldValue={setFieldValue}
          inputProps={{ maxLength: 30 }}
          value={brand || ''}
        />

        <MuiAutoComplete
          sx={{
            marginTop: "auto",
            marginBottom: "10px",
          }}
          name={department.name}
          label={department.label}
          oldValue={getOldData(department_id)}
          value={department_id && department_id.name ? department_id.name : getOldData(department_id)}
          apiError={(departmentInfo && departmentInfo.err) ? generateErrorMessage(departmentInfo) : false}
          open={departmentOpen}
          onOpen={() => {
            setDepartmentOpen(true);
            setDepartmentKeyword('');
          }}
          onClose={() => {
            setDepartmentOpen(false);
            setDepartmentKeyword('');
          }}
          loading={departmentInfo && departmentInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={departmentMembersOptions}
          onChange={(e, data) => { setFieldValue('department_id', data); }}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => setDepartmentKeyword(e.target.value)}
              value={departmentKeyword}
              label={department.label}
              variant="standard"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {departmentInfo && departmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((getOldData(department_id)) || (department_id && department_id.id) || (departmentKeyword && departmentKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onDepartmentClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showDepartmentModal}
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

        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={cost.name}
          label={cost.label}
          setFieldValue={setFieldValue}
          value={standard_price || ''}
            // disabled={!isSite && !isCompany}
          inputProps={{ maxLength: 30 }}
          onKeyPress={decimalKeyPressDown}
        />

        <Dialog size="lg" fullWidth open={extraModal}>
          <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AdvancedSearchModal
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                setFieldValue={setFieldValue}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        {/* <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">
            Additional Information
          </p>
        </CardBody>
      </Card>
      <Row className="p-1 mb-2">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={reorderLevel.name}
              label={reorderLevel.label}
              value={reordering_min_qty || ''}
              type="text"
              formGroupClassName="m-1"
              maxLength="30"

            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={alertLevel.name}
              label={alertLevel.label}
              value={alert_level_qty || ''}
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
            />
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={reorderQuantity.name}
              label={reorderQuantity.label}
              value={reordering_max_qty || ''}
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
              onKeyPress={decimalKeyPress}
            />
          </Col>
                </Col>

    </Row> */}
      </Box>
    </>
  );
};

AdvancedForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default AdvancedForm;
