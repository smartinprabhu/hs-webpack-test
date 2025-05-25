/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  TextField,
} from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText
  ,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import {
  getTCList,
} from '../../../siteService';
import {
  getTeamList,
} from '../../../../assets/equipmentService';
import {
  extractOptionsObject, getAllCompanies,
} from '../../../../util/appUtils';
import customData from '../../helpdesk/data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      slaCategoryAccess,
      hasTarget,
      isSecondLevelApproval,
      auditAccess,
      slaJson,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    night_approval_authority_shift_id, special_approval_authority_shift_id, general_approval_authority_shift_id,
    review_required, is_ehs_required, is_prepared_required, sla_category_access, audit_template_access,
  } = formValues;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [l1Open, setL1Open] = useState(false);
  const [l2Open, setL2Open] = useState(false);
  const [l3Open, setL3Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [l2Keyword, setL2Keyword] = useState('');
  const [l3Keyword, setL3Keyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const [auditOpen, setAuditOpen] = useState(false);
  const [SLAOpen, setSLAOpen] = useState(false);
  const {
    tcInfo,
  } = useSelector((state) => state.site);
  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companies, appModels.SURVEY, categoryKeyword, 'title'));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l1Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l2Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l2Keyword));
      }
    })();
  }, [userInfo, l2Keyword, l2Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l3Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l3Keyword));
      }
    })();
  }, [userInfo, l3Keyword, l3Open]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL2KeywordChange = (event) => {
    setL2Keyword(event.target.value);
  };

  const onL3KeywordChange = (event) => {
    setL3Keyword(event.target.value);
  };

  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('night_approval_authority_shift_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('night_approval_authority_shift_id');
    setModalName('Approval Team');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL2Clear = () => {
    setL2Keyword(null);
    setFieldValue('special_approval_authority_shift_id', '');
    setL2Open(false);
  };

  const showL2Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('special_approval_authority_shift_id');
    setModalName('Approval Team');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL3Clear = () => {
    setL3Keyword(null);
    setFieldValue('general_approval_authority_shift_id', '');
    setL3Open(false);
  };

  const showL3Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('general_approval_authority_shift_id');
    setModalName('Approval Team');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const l1Options = extractOptionsObject(teamsInfo, night_approval_authority_shift_id);
  const l2Options = extractOptionsObject(teamsInfo, special_approval_authority_shift_id);
  const l3Options = extractOptionsObject(teamsInfo, general_approval_authority_shift_id);

  function typeLable(staten) {
    if (customData && customData.accessTypesLabel[staten]) {
      const s = customData.accessTypesLabel[staten].label;
      return s;
    }
    return '';
  }

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={6} lg={6} md={6} className="mb-3">
        <Col xs={12} sm={12} lg={12} md={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={slaCategoryAccess.name}
            label={slaCategoryAccess.label}
            open={SLAOpen}
            oldvalue={typeLable(sla_category_access)}
            value={sla_category_access && sla_category_access.label ? sla_category_access.label : typeLable(sla_category_access)}
            size="small"
            onOpen={() => {
              setSLAOpen(true);
            }}
            onClose={() => {
              setSLAOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.catTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={slaCategoryAccess.label}
                className="input-small-custom without-padding"
                placeholder="Search"
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
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={hasTarget.name}
            label={hasTarget.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-2">
          <MuiCheckboxField
            name={isSecondLevelApproval.name}
            label={isSecondLevelApproval.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6} className="mb-3">
        <Col xs={12} sm={12} lg={12} md={12}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={auditAccess.name}
            label={auditAccess.label}
            labelClassName="mb-1"
            formGroupClassName="mb-1 w-100"
            open={auditOpen}
            oldvalue={typeLable(audit_template_access)}
            value={audit_template_access && audit_template_access.label ? audit_template_access.label : typeLable(audit_template_access)}
            size="small"
            onOpen={() => {
              setAuditOpen(true);
            }}
            onClose={() => {
              setAuditOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.catTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={auditAccess.label}
                className="input-small-custom without-padding"
                placeholder="Search"
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
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={slaJson.name}
            label={slaJson.label}
            autoComplete="off"
            type="text"
          />
        </Col>
      </Col>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
