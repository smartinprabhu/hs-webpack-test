/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CheckboxField, CheckboxFieldGroup, FormikAutocomplete, InputField,
} from '@shared/formFields';
import {
  TextField, CircularProgress, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Label, Row, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getTCList, getCompany, setInvRecipientsLocationId, getRecipientList,
} from '../../../siteService';
import {
  getAllCompanies, generateErrorMessage, extractOptionsObject, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {

      bearerEmail,
      bearerMobile,
      attachment,
      space,
      reference,
      referenceDisplay,
      approvalRequired,
      approvalButton,
      approvalRecipients,
      company,
      uuId,
    },
  } = props;
  const useStyles = makeStyles((themeStyle) => ({
    margin: {
      marginBottom: themeStyle.spacing(1.25),
      width: '100%',
    },
  }));
  const { values: formValues } = useFormikContext();
  const {
    approval_recipients_ids, company_id,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [typeOpen, setTypeOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    tcInfo, siteDetails, companyInfo, recipientsInfo, invRecipientsLocationId,
  } = useSelector((state) => state.site);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyKeyword, setCompanyKeyword] = useState('');

  const [recipientsOptions, setRecipientsOptions] = useState([]);
  const [recipientsKeyword, setRecipientsKeyword] = useState('');
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [tempRecipient, setTempRecipient] = useState([]);
  const companies = getAllCompanies(userInfo);
  const companiesSiteSpecific = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companiesSiteSpecific, appModels.SURVEY, categoryKeyword, 'title'));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && companyOpen) {
        await dispatch(getCompany(companies, appModels.COMPANY, companyKeyword));
      }
    })();
  }, [userInfo, companyKeyword, companyOpen]);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (editId) {
      setInvRecipientsLocationId(approval_recipients_ids);
    }
  }, [editId]);

  useEffect(() => {
    if (userInfo) {
      dispatch(setInvRecipientsLocationId(approval_recipients_ids));
    }
  }, [userInfo]);

  useEffect(() => {
    if (approval_recipients_ids) {
      dispatch(setInvRecipientsLocationId(approval_recipients_ids));
    }
  }, [approval_recipients_ids]);

  useEffect(() => {
    if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length && recipientsOpen) {
      setRecipientsOptions(getArrayFromValuesById(recipientsInfo.data, isAssociativeArray(invRecipientsLocationId || []), 'id'));
    } else if (recipientsInfo && recipientsInfo.loading) {
      setRecipientsOptions([{ name: 'Loading...' }]);
    } else {
      setRecipientsOptions([]);
    }
  }, [recipientsInfo, recipientsOpen]);

  useEffect(() => {
    if (invRecipientsLocationId) {
      setFieldValue('approval_recipients_ids', invRecipientsLocationId);
    }
  }, [invRecipientsLocationId]);

  useEffect(() => {
    if (userInfo && userInfo.data && recipientsOpen) {
      dispatch(getRecipientList(companies, appModels.ALARMRECIPIENTS, recipientsKeyword));
    }
  }, [userInfo, recipientsOpen, recipientsKeyword]);

  const handleRecipients = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setInvRecipientsLocationId(options));
    setCheckRows(options);
  };

  const onRecipientsKeywordClear = () => {
    setRecipientsKeyword(null);
    dispatch(setInvRecipientsLocationId([]));
    setCheckRows([]);
    setRecipientsOpen(false);
  };

  const onRecipientKeyWordChange = (event) => {
    setRecipientsKeyword(event.target.value);
  };

  const showRecipientsModal = () => {
    setModelValue(appModels.ALARMRECIPIENTS);
    setFieldName('approval_recipients_ids');
    setModalName('Approval Athority List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onCompanyKeyWordChange = (event) => {
    setCompanyKeyword(event.target.value);
  };

  const onCompanyKeywordClear = () => {
    setCompanyKeyword(null);
    setFieldValue('company_id', '');
    setCompanyOpen(false);
  };

  const showCompanyModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('company_id');
    setModalName('Company');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  // useEffect(() => {
  //   dispatch(setInvRecipientsLocationId(tempRecipient));
  // }, [tempRecipient]);

  const setFieldId = () => {
    setExtraMultipleModal(false);
    if (fieldName === 'approval_recipients_ids') {
      const temp = checkedRows.filter((item) => item.fieldName === fieldName);
      const tempData = [...approval_recipients_ids, ...temp];
      dispatch(setInvRecipientsLocationId([...new Set(tempData)]));
      setCheckRows([]);
    }
  };

  const companyOptions = extractOptionsObject(companyInfo, company_id);
  
  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={4} lg={4} md={4}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Bearer Info
        </span>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={bearerEmail.name} className="m-0">
            {bearerEmail.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={bearerEmail.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={bearerEmail.label1}
          />
          <CheckboxFieldGroup
            name={bearerEmail.name}
            checkedvalue="Optional"
            id="Optional"
            label={bearerEmail.label2}
          />
          <CheckboxFieldGroup
            name={bearerEmail.name}
            checkedvalue="None"
            id="None"
            label={bearerEmail.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={bearerMobile.name} className="m-0">
            {bearerMobile.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={bearerMobile.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={bearerMobile.label1}
          />
          <CheckboxFieldGroup
            name={bearerMobile.name}
            checkedvalue="Optional"
            id="Optional"
            label={bearerMobile.label2}
          />
          <CheckboxFieldGroup
            name={bearerMobile.name}
            checkedvalue="None"
            id="None"
            label={bearerMobile.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={attachment.name} className="m-0">
            {attachment.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={attachment.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={attachment.label1}
          />
          <CheckboxFieldGroup
            name={attachment.name}
            checkedvalue="Optional"
            id="Optional"
            label={attachment.label2}
          />
          <CheckboxFieldGroup
            name={attachment.name}
            checkedvalue="None"
            id="None"
            label={attachment.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={space.name} className="m-0">
            {space.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={space.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={space.label1}
          />
          <CheckboxFieldGroup
            name={space.name}
            checkedvalue="Optional"
            id="Optional"
            label={space.label2}
          />
          <CheckboxFieldGroup
            name={space.name}
            checkedvalue="None"
            id="None"
            label={space.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={reference.name} className="m-0">
            {reference.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={reference.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={reference.label1}
          />
          <CheckboxFieldGroup
            name={reference.name}
            checkedvalue="Optional"
            id="Optional"
            label={reference.label2}
          />
          <CheckboxFieldGroup
            name={reference.name}
            checkedvalue="None"
            id="None"
            label={reference.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <InputField
            name={referenceDisplay.name}
            label={referenceDisplay.label}
            autoComplete="off"
            type="text"
            maxLength="30"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <CheckboxField
            name={approvalRequired.name}
            label={approvalRequired.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <InputField
            name={approvalButton.name}
            label={approvalButton.label}
            formGroupClassName="mb-1"
            type="text"
            maxLength="12"
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <div>
            <FormControl className={classes.margin}>
              <Label for={approvalRecipients.name}>
                {approvalRecipients.label}
                {' '}
                <span className="text-danger">*</span>
              </Label>
              <Autocomplete
                multiple
                filterSelectedOptions
                name="categoryuser"
                open={recipientsOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setRecipientsOpen(true);
                  setRecipientsKeyword('');
                }}
                onClose={() => {
                  setRecipientsOpen(false);
                  setRecipientsKeyword('');
                }}
                value={approval_recipients_ids && approval_recipients_ids.length > 0 ? approval_recipients_ids : []}
                defaultValue={invRecipientsLocationId}
                onChange={(e, options) => handleRecipients(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={recipientsOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    className={((getOldData(invRecipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => onRecipientKeyWordChange(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(recipientsInfo && recipientsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((recipientsKeyword && recipientsKeyword.length > 0) || (approval_recipients_ids && approval_recipients_ids.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onRecipientsKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showRecipientsModal}
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
      </Col>
      <Col xs={12} sm={4} lg={4} md={4}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Other Info
        </span>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={company.name}
            label={company.label}
            isRequired
            oldValue={getOldData(company_id)}
            value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
            apiError={(companyInfo && companyInfo.err) ? generateErrorMessage(companyInfo) : false}
            open={companyOpen}
            size="small"
            onOpen={() => {
              setCompanyOpen(true);
              setCompanyKeyword('');
            }}
            onClose={() => {
              setCompanyOpen(false);
              setCompanyKeyword('');
            }}
            loading={companyOpen && companyInfo && companyInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={companyOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCompanyKeyWordChange}
                variant="outlined"
                className={((getOldData(company_id)) || (company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {companyInfo && companyInfo.loading && companyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(company_id)) || (company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCompanyKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCompanyModal}
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
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={uuId.name}
            label={uuId.label}
            autoComplete="off"
            disabled
            type="text"
          />
        </Col>
      </Col>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
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
            oldCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            oldApprovalData={invRecipientsLocationId && invRecipientsLocationId.length ? invRecipientsLocationId : []}
          />
        </ModalBody>
        <ModalFooter>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"                 
                variant="contained"
                onClick={() => { setExtraMultipleModal(false); if (fieldName === 'approval_recipients_ids') { setFieldId(); } }}
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal>
    </Row>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
