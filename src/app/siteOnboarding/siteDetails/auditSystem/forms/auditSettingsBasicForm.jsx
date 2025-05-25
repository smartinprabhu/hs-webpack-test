/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CheckboxField, FormikAutocomplete,
} from '@shared/formFields';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, Modal, ModalBody,
} from 'reactstrap';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  getSubCategoryList, getCategorytLists, getAuditSpaceLists, getProductCompany,
} from '../../../siteService';
import {
  getAllCompanies, extractOptionsObject, generateErrorMessage,
} from '../../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const auditSettingBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      subCategoryId,
      categoryId,
      autoCreateTicket,
      spaceId,
      companyId,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    sub_category_id, category_id, space_id, company_id, auto_create_tickets_from_action,
  } = formValues;
  const dispatch = useDispatch();

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');

  const [subCatOpen, setSubCatOpen] = useState(false);
  const [subCatKeyword, setSubCatKeyword] = useState('');

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyKeyword, setCompanyKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const {
    siteDetails, catInfoList, subCatInfoList, audSpaceInfoList, productCompanyInfo,
  } = useSelector((state) => state.site);

  const companies = getAllCompanies(userInfo);
  const companiesSiteSpecific = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllCompanies(userInfo);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : [];
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getCategorytLists(companies, appModels.TICKETCATEGORY, categoryKeyword));
      }
    })();
  }, [categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getSubCategoryList(companies, appModels.TICKETSUBCATEGORY, subCatKeyword));
      }
    })();
  }, [subCatOpen, subCatKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getAuditSpaceLists(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [spaceOpen, spaceKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && companyOpen) {
        await dispatch(getProductCompany(companies, appModels.COMPANY, companyKeyword));
      }
    })();
  }, [userInfo, companyKeyword, companyOpen]);

  const onCategoryKeyWordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onSpaceKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSubCatKeyWordChange = (event) => {
    setSubCatKeyword(event.target.value);
  };

  const onCompanyKeyWordChange = (event) => {
    setCompanyKeyword(event.target.value);
  };

  const onCategoryClear = () => {
    setCategoryKeyword(null);
    setFieldValue('category_id', '');
    setCategoryOpen(false);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setSpaceOpen(false);
  };

  const onSubCategoryClear = () => {
    setSubCatKeyword(null);
    setFieldValue('sub_category_id', '');
    setSubCatOpen(false);
  };

  const onAccessProductKeywordClear = () => {
    setCompanyKeyword(null);
    setFieldValue('company_id', '');
    setCompanyOpen(false);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.TICKETCATEGORY);
    setFieldName('category_id');
    setModalName('Category List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showAccessCompanyModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('company_id');
    setModalName('Company');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showSubCategoryModal = () => {
    setModelValue(appModels.TICKETSUBCATEGORY);
    setFieldName('sub_category_id');
    setModalName('Sub Category List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const catOptions = extractOptionsObject(catInfoList, category_id);
  const spaceOptions = extractOptionsObject(audSpaceInfoList, space_id);
  const subCategoryOptions = extractOptionsObject(subCatInfoList, sub_category_id);
  const parentOptions = extractOptionsObject(productCompanyInfo, company_id);

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={6} lg={6} md={6}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Audit System Settings
        </span>
        <Col xs={12} sm={12} lg={12} md={12}>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={autoCreateTicket.name}
              label={autoCreateTicket.label}
            />
          </Col>
          {auto_create_tickets_from_action
            ? (
              <Col xs={12} sm={12} lg={12} md={12}>
                <FormikAutocomplete
                  name={subCategoryId.name}
                  label={subCategoryId.label}
                  formGroupClassName="m-1"
                  oldValue={getOldData(sub_category_id)}
                  value={sub_category_id && sub_category_id.name ? sub_category_id.name : getOldData(sub_category_id)}
                  apiError={(subCatInfoList && subCatInfoList.err && subCatOpen) ? generateErrorMessage(subCatInfoList) : false}
                  open={subCatOpen}
                  size="small"
                  onOpen={() => {
                    setSubCatOpen(true);
                    setSubCatKeyword('');
                  }}
                  onClose={() => {
                    setSubCatOpen(false);
                    setSubCatKeyword('');
                  }}
                  loading={subCatInfoList && subCatInfoList.loading && subCatOpen}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={subCategoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={(e) => { onSubCatKeyWordChange(e.target.value); }}
                      variant="outlined"
                      value={subCatKeyword}
                      className={((sub_category_id && sub_category_id.id) || (subCatKeyword && subCatKeyword.length > 0) || (sub_category_id && sub_category_id.length))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {subCatInfoList && subCatInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((sub_category_id && sub_category_id.id) || (subCatKeyword && subCatKeyword.length > 0) || (sub_category_id && sub_category_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onSubCategoryClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showSubCategoryModal}
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
            )
            : ''}
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={companyId.name}
              label={companyId.label}
              oldValue={getOldData(company_id)}
              value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
              apiError={(productCompanyInfo && productCompanyInfo.err) ? generateErrorMessage(productCompanyInfo) : false}
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
              loading={companyOpen && productCompanyInfo && productCompanyInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={parentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => { onCompanyKeyWordChange(e.target.value); }}
                  variant="outlined"
                  className={((getOldData(company_id)) || (company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {productCompanyInfo && productCompanyInfo.loading && companyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(company_id)) || (company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onAccessProductKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showAccessCompanyModal}
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
        </Col>
      </Col>
      {auto_create_tickets_from_action
        ? (
          <Col xs={12} sm={6} lg={6} md={6} className="mt-3">
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name={categoryId.name}
                label={categoryId.label}
                formGroupClassName="m-1"
                oldValue={getOldData(category_id)}
                value={category_id && category_id.name ? category_id.name : getOldData(category_id)}
                apiError={(catInfoList && catInfoList.err && categoryOpen) ? generateErrorMessage(catInfoList) : false}
                open={categoryOpen}
                size="small"
                onOpen={() => {
                  setCategoryOpen(true);
                  setCategoryKeyword('');
                }}
                onClose={() => {
                  setCategoryOpen(false);
                  setCategoryKeyword('');
                }}
                loading={catInfoList && catInfoList.loading && categoryOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={catOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => { onCategoryKeyWordChange(e.target.value); }}
                    variant="outlined"
                    value={categoryKeyword}
                    className={((category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0) || (category_id && category_id.length))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {catInfoList && catInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0) || (category_id && category_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCategoryClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showCategoryModal}
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
              <FormikAutocomplete
                name={spaceId.name}
                label={spaceId.label}
                formGroupClassName="m-1"
                oldValue={getOldData(space_id)}
                value={space_id && space_id.name ? space_id.name : getOldData(space_id)}
                apiError={(audSpaceInfoList && audSpaceInfoList.err && spaceOpen) ? generateErrorMessage(audSpaceInfoList) : false}
                open={spaceOpen}
                size="small"
                onOpen={() => {
                  setSpaceOpen(true);
                  setSpaceKeyword('');
                }}
                onClose={() => {
                  setSpaceOpen(false);
                  setSpaceKeyword('');
                }}
                loading={audSpaceInfoList && audSpaceInfoList.loading && spaceOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={spaceOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => { onSpaceKeyWordChange(e.target.value); }}
                    variant="outlined"
                    value={spaceKeyword}
                    className={((space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0) || (space_id && space_id.length))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {audSpaceInfoList && audSpaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0) || (space_id && space_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSpaceClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showSpaceModal}
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
          </Col>
        )
        : ''}

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
      {/* <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
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
            // oldRecipientsData={incReportALocationId && incReportALocationId.length ? incReportALocationId : []}
          />
        </ModalBody>
        <ModalFooter>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => { if (fieldName === 'sub_category_id') { setLocationIds(checkedRows); } }}
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal> */}
    </Row>
  );
});

auditSettingBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default auditSettingBasicForm;
