/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col,
  Modal,
  ModalBody,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { FormikAutocomplete } from '@shared/formFields';
import {
  getIncidentTypes,
  getIncidentSeverties,
} from '../ticketService';
import theme from '../../util/materialTheme';
import {
  generateErrorMessage, extractOptionsObject,
  getAllCompanies,
} from '../../util/appUtils';
import SearchModal from './searchModal';

const appModels = require('../../util/appModels').default;

const IncidentForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    formField: {
      incidentTypeId,
      incidentSeverityId,
    },
  } = props;

  const { values: formValues } = useFormikContext();
  const {
    incident_type_id, incident_severity_id,
    sub_category_id,
  } = formValues;
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(reloadSpace);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [severityOpen, setSeverityOpen] = useState(false);
  const [severityKeyword, setSeverityKeyword] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    incidentTypes, incidentSeverties,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (sub_category_id && Object.keys(sub_category_id).length && Object.keys(sub_category_id).length > 0) {
      const tData = sub_category_id.incident_severity_id ? sub_category_id.incident_severity_id : '';
      if (tData && Object.keys(tData).length && Object.keys(tData).length > 0) {
        setFieldValue('incident_severity_id', { id: tData.id, name: tData.name });
      } else {
        setFieldValue('incident_severity_id', '');
      }
    }
  }, [sub_category_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen) {
        await dispatch(getIncidentTypes(companies, appModels.INCIDENTTYPE, categoryKeyword, 20));
      }
    })();
  }, [userInfo, categoryKeyword, categoryOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && severityOpen) {
        await dispatch(getIncidentSeverties(companies, appModels.INCIDENTSEVERITY, severityKeyword));
      }
    })();
  }, [userInfo, severityKeyword, severityOpen]);

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  const onKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onSeverityKeywordChange = (event) => {
    setSeverityKeyword(event.target.value);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.INCIDENTTYPE);
    setFieldName('incident_type_id');
    setModalName('Incident Type');
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const onKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('incident_type_id', '');
    setCategoryOpen(false);
  };

  const showSeverityModal = () => {
    setModelValue(appModels.INCIDENTSEVERITY);
    setFieldName('incident_severity_id');
    setModalName('Incident Severity');
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const onSeverityKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('incident_severity_id', '');
    setCategoryOpen(false);
  };

  const categoryOptions = extractOptionsObject(incidentTypes, incident_type_id);
  const severityOptions = extractOptionsObject(incidentSeverties, incident_severity_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800">Incident Information</span>
      <ThemeProvider theme={theme}>
        <Row className="mb-3 TicketForm-inputs">
          { /*
          <Col xs={12} sm={5} md={5} lg={5}>
            <FormikAutocomplete
              name={incidentState.name}
              label={incidentState.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={incidentOpen}
              oldvalue={incident_state}
              value={incident_state && incident_state.label ? incident_state.label : incident_state}
              size="small"
              onOpen={() => {
                setIncidentOpen(true);
              }}
              onClose={() => {
                setIncidentOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={ticketsActions.incidentStates}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
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
                */ }
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={incidentTypeId.name}
              label={incidentTypeId.label}
              isRequired
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={categoryOpen}
              size="small"
              oldvalue={getOldData(incident_type_id)}
              value={incident_type_id && incident_type_id.name ? incident_type_id.name : getOldData(incident_type_id)}
              onOpen={() => {
                setRefresh('1');
                setCategoryOpen(true);
                setCategoryKeyword('');
              }}
              onClose={() => {
                setCategoryOpen(false);
                setCategoryKeyword('');
              }}
              getOptionDisabled={() => incidentTypes && incidentTypes.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onKeywordChange}
                  variant="outlined"
                  value={categoryKeyword}
                  className={((getOldData(incident_type_id)) || (incident_type_id && incident_type_id.id) || (categoryKeyword && categoryKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {incidentTypes && incidentTypes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(incident_type_id)) || (incident_type_id && incident_type_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onKeywordClear}
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
            {(incidentTypes && incidentTypes.err && categoryOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(incidentTypes)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={incidentSeverityId.name}
              label={incidentSeverityId.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={severityOpen}
              size="small"
              oldvalue={getOldData(incident_severity_id)}
              value={incident_severity_id && incident_severity_id.name ? incident_severity_id.name : getOldData(incident_severity_id)}
              onOpen={() => {
                setRefresh('1');
                setSeverityOpen(true);
                setSeverityKeyword('');
              }}
              onClose={() => {
                setSeverityOpen(false);
                setSeverityKeyword('');
              }}
              loading={incidentSeverties && incidentSeverties.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={severityOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSeverityKeywordChange}
                  variant="outlined"
                  value={severityKeyword}
                  className={((getOldData(incident_severity_id)) || (incident_severity_id && incident_severity_id.id) || (severityKeyword && severityKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {incidentSeverties && incidentSeverties.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(incident_severity_id)) || (incident_severity_id && incident_severity_id.id) || (severityKeyword && severityKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSeverityKeywordClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSeverityModal}
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
            {(incidentSeverties && incidentSeverties.err && severityOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(incidentSeverties)}</span></FormHelperText>)}
          </Col>
        </Row>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
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
              modalName={modalName}
              setFieldValue={setFieldValue}
            />
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
};

IncidentForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reloadSpace: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default IncidentForm;
