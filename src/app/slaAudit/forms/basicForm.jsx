/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import moment from 'moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';
import { useFormikContext } from 'formik';
import {
  Box,
  Dialog, DialogContent,
} from "@mui/material";

import {
  DateTimeField,
} from '@shared/formFields';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import DialogHeader from '../../commonComponents/dialogHeader';

import { getSlaTemplates, getSLAConfig, getAuditExists } from '../auditService';
import {
  generateErrorMessage, getAllowedCompanies, extractOptionsObject, getDateTimeSeconds,
} from '../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
// import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    setFieldTouched,
    isShow,
    formField: {
      title,
      dateAudit,
      auditTemplateId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    audit_date, audit_template_id,
  } = formValues;
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemKeyword, setSystemKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    slaTemplates,
    slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  useEffect(() => {
    if (audit_date && audit_template_id && audit_template_id.name) {
      setFieldValue('name', `${moment(audit_date).format('MMM-YY')} - ${audit_template_id.name}`);
      dispatch(getAuditExists(companies, audit_template_id.id, moment(audit_date).format('MMM-YY'), appModels.SLAAUDIT));
    }

    if (!audit_date || !audit_template_id) {
      setFieldValue('name', '');
    }
  }, [audit_date, audit_template_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && userCompanyId && isShow) {
      dispatch(getSLAConfig(userCompanyId, appModels.SLAAUDITCONFIG));
      setFieldValue('audit_date', new Date());
    }
  }, [userInfo, isShow]);

  useEffect(() => {
    if (userInfo && userInfo.data && systemOpen && slaAuditConfig && slaAuditConfig.data) {
      const tempLevel = slaAuditConfig.data.length ? slaAuditConfig.data[0].audit_template_access : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && systemKeyword) {
        domain = `${domain},["name","ilike","${systemKeyword}"]`;
      }

      if (!tempLevel && systemKeyword) {
        domain = `["name","ilike","${systemKeyword}"]`;
      }

      dispatch(getSlaTemplates(domain, appModels.AUDITTEMPLATE));
    }
  }, [userInfo, systemKeyword, systemOpen, slaAuditConfig]);

  const onWorkClear = () => {
    setSystemKeyword(null);
    setFieldValue('audit_template_id', '');
    setSystemOpen(false);
  };

  const showWorkModal = () => {
    setModelValue(appModels.AUDITTEMPLATE);
    setColumns(['id', 'name']);
    setFieldName('audit_template_id');
    setModalName('Audit Template List');
    let domain = '';
    const tempLevel = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length ? slaAuditConfig.data[0].audit_template_access : '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const systemOptions = extractOptionsObject(slaTemplates, audit_template_id);

  function getOldDataId(oldData) {
    return oldData && oldData.name ? oldData.name : '';
  }

  return (
    <>
      <Box>
        <MuiTextField
          sx={{
            marginTop: "auto",
            marginBottom: "10px",
          }}
          name={title.name}
          label={title.label}
          isRequired
          formGroupClassName="m-1"
          type="text"
          maxLength="150"
        />
        <Box
          sx={{
            marginTop: "auto",
            marginBottom: "10px",
            display: 'flex',
            gap: '10px'
          }}
        >
          <Box sx={{ width: '50%', }}>
            <DateTimeField
              name={dateAudit.name}
              label={dateAudit.label}
              isRequired
              dateFormat="MMM-YY"
              picker="month"
              formGroupClassName="m-1"
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={dateAudit.label}
              disablePastDate
              disableFuture
              defaultValue={audit_date ? new Date(getDateTimeSeconds(audit_date)) : ''}
            />
          </Box>
          <MuiAutoComplete
            sx={{ width: '50%', marginTop: '20px' }}
            name={auditTemplateId.name}
            label={auditTemplateId.label}
            isRequired
            className="bg-white"
            formGroupClassName="m-1"
            oldValue={getOldDataId(audit_template_id)}
            value={audit_template_id && audit_template_id.name ? audit_template_id.name : getOldDataId(audit_template_id)}
            apiError={(slaTemplates && slaTemplates.err) ? generateErrorMessage(slaTemplates) : false}
            open={systemOpen}
            size="small"
            onOpen={() => {
              setSystemOpen(true);
              setSystemKeyword('');
            }}
            onClose={() => {
              setSystemOpen(false);
              setSystemKeyword('');
            }}
            loading={slaTemplates && slaTemplates.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={systemOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={auditTemplateId.label}
                required
                onChange={(e) => setSystemKeyword(e.target.value)}
                variant="standard"
                value={systemKeyword}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {slaTemplates && slaTemplates.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldDataId(audit_template_id)) || (audit_template_id && audit_template_id.id) || (systemKeyword && systemKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onWorkClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showWorkModal}
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
        </Box>
      </Box>

      <Dialog maxWidth={'xl'} open={extraModal} >
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName="Search Template"
            setFieldValue={setFieldValue}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isShow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default BasicForm;
