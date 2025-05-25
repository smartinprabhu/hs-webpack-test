/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
} from '@material-ui/core';
import { Box } from "@mui/system";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { IoCloseOutline } from 'react-icons/io5';

import MuiAutoComplete from "../../commonComponents/formFields/muiAutocomplete";
import MuiTextarea from "../../commonComponents/formFields/muiTextarea";
import DialogHeader from '../../commonComponents/dialogHeader';
import UploadDocuments from '../../commonComponents/uploadDocuments';
import { Dialog, DialogContent, DialogContentText, Typography, TextField, } from '@mui/material'

import { AddThemeColor } from '../../themes/theme';
import { generateErrorMessage, extractOptionsObject, getAllowedCompanies } from '../../util/appUtils';
import {
  getTeamList, getEmployeeDataList,
} from '../../assets/equipmentService';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    setFieldValue,
    editId,
    formField: {
      jobDescription,
      ehsInstructions,
      termsAndConditions,
      approvalAuthority,
      issuePermitAuthority,
      ehsAuthority,
      securityOffice,
      reviewer,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    approval_authority_id,
    issue_permit_approval_id,
    ehs_authority_id,
    security_office_id,
    reviewer_id,
  } = formValues;
  const dispatch = useDispatch();

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [l1Open, setL1Open] = useState(false);
  const [l2Open, setL2Open] = useState(false);
  const [l3Open, setL3Open] = useState(false);
  const [l4Open, setL4Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [l2Keyword, setL2Keyword] = useState('');
  const [l3Keyword, setL3Keyword] = useState('');
  const [l4Keyword, setL4Keyword] = useState('');

  const [ipOpen, setIpOpen] = useState(false);
  const [ipKeyword, setIpKeyword] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    teamsInfo, employeeListInfo,
  } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const { addProductCategoryInfo } = useSelector((state) => state.pantry);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  useEffect(() => {
    if (userInfo && userInfo.data && l1Open) {
      dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
    }
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    if (userInfo && userInfo.data && l2Open) {
      dispatch(getTeamList(companies, appModels.TEAM, l2Keyword));
    }
  }, [userInfo, l2Keyword, l2Open]);

  useEffect(() => {
    if (userInfo && userInfo.data && l3Open) {
      dispatch(getTeamList(companies, appModels.TEAM, l3Keyword));
    }
  }, [userInfo, l3Keyword, l3Open]);

  useEffect(() => {
    if (userInfo && userInfo.data && l4Open) {
      dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, l4Keyword));
    }
  }, [userInfo, l4Keyword, l4Open]);

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onIpKeywordChange = (event) => {
    setIpKeyword(event.target.value);
  };

  const onL2KeywordChange = (event) => {
    setL2Keyword(event.target.value);
  };

  const onL3KeywordChange = (event) => {
    setL3Keyword(event.target.value);
  };

  const onL4KeywordChange = (event) => {
    setL4Keyword(event.target.value);
  };

  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('approval_authority_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('approval_authority_id');
    setModalName('Approval Authority');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onIpClear = () => {
    setIpKeyword(null);
    setFieldValue('issue_permit_approval_id', '');
    setIpOpen(false);
  };

  const showIpModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('issue_permit_approval_id');
    setModalName('Issue Permit Authority');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL2Clear = () => {
    setL2Keyword(null);
    setFieldValue('ehs_authority_id', '');
    setL2Open(false);
  };

  const showL2Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('ehs_authority_id');
    setModalName('EHS Authority');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL3Clear = () => {
    setL3Keyword(null);
    setFieldValue('security_office_id', '');
    setL3Open(false);
  };

  const showL3Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('security_office_id');
    setModalName('Security Office');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL4Clear = () => {
    setL4Keyword(null);
    setFieldValue('reviewer_id', '');
    setL4Open(false);
  };

  const showL4Modal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name']);
    setFieldName('reviewer_id');
    setModalName('Reviewer');
    setPlaceholder('Users');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const l1Options = extractOptionsObject(teamsInfo, approval_authority_id);
  const l2Options = extractOptionsObject(teamsInfo, ehs_authority_id);
  const l3Options = extractOptionsObject(teamsInfo, security_office_id);
  const l4Options = extractOptionsObject(employeeListInfo, reviewer_id);
  const ipOptions = extractOptionsObject(teamsInfo, issue_permit_approval_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <Box
        sx={{
          marginTop: "20px",
          width: "100%",
          display: 'flex',
          gap: '35px'
        }}
      >
        <Box sx={{ width: '48%' }}>
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Other Info
          </Typography>
          <Box
            sx={{
              width: '100%',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <MuiTextarea
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              fullWidth
              variant="standard"
              multiline={true}
              name={jobDescription.name}
              label={jobDescription.label}
              formGroupClassName="m-1"
              type="textarea"
              maxRows="4"
              inputProps={{
                maxLength: 300,
              }}
            />
            {/* {wpConfig && wpConfig.is_ehs_required && (*/}
            <MuiTextarea
              sx={{
                marginTop: "auto",
                marginBottom: "10px",
              }}
              fullWidth
              variant="standard"
              multiline={true}
              name={ehsInstructions.name}
              label={ehsInstructions.label}
              formGroupClassName="m-1"
              type="textarea"
              maxRows="4"
              inputProps={{
                maxLength: 300,
              }}
            />
            {/*)}*/}
            <MuiTextarea
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              fullWidth
              variant="standard"
              multiline={true}
              name={termsAndConditions.name}
              label={termsAndConditions.label}
              formGroupClassName="m-1"
              type="textarea"
              maxRows="4"
              inputProps={{
                maxLength: 300,
              }}
            />
          </Box>
          {!editId ? (
            <>
              <Box>

                <UploadDocuments
                  saveData={addProductCategoryInfo}
                  limit='3'
                  model={appModels.WORKPERMIT}
                  uploadFileType='all'
                />


              </Box>
            </>
          ) : ''}
        </Box>
        <Box sx={{ width: '48%' }}>
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Approval Info
          </Typography>
          <Box
            sx={{
              width: '100%',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={approvalAuthority.name}
              label={approvalAuthority.label}
              formGroupClassName="m-1"
              open={l1Open}
              oldValue={getOldData(approval_authority_id)}
              value={approval_authority_id && approval_authority_id.name ? approval_authority_id.name : getOldData(approval_authority_id)}
              size="small"
              onOpen={() => {
                setL1Open(true);
                setL1Keyword('');
              }}
              onClose={() => {
                setL1Open(false);
                setL1Keyword('');
              }}
              loading={teamsInfo && teamsInfo.loading && teamsInfo}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
              options={l1Options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onL1KeywordChange}
                  variant="standard"
                  label={approvalAuthority.label}
                  value={l1Keyword}
                  className={((approval_authority_id && approval_authority_id.id) || (l1Keyword && l1Keyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((approval_authority_id && approval_authority_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onL1Clear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showL1Modal}
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
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={issuePermitAuthority.name}
              label={issuePermitAuthority.label}
              formGroupClassName="m-1"
              open={ipOpen}
              oldValue={getOldData(issue_permit_approval_id)}
              value={issue_permit_approval_id && issue_permit_approval_id.name ? issue_permit_approval_id.name : getOldData(approval_authority_id)}
              size="small"
              onOpen={() => {
                setIpOpen(true);
                setIpKeyword('');
              }}
              onClose={() => {
                setIpOpen(false);
                setIpKeyword('');
              }}
              loading={teamsInfo && teamsInfo.loading && teamsInfo}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
              options={ipOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onIpKeywordChange}
                  variant="standard"
                  label={issuePermitAuthority.label}
                  value={ipKeyword}
                  className={((issue_permit_approval_id && issue_permit_approval_id.id) || (ipKeyword && ipKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading && ipOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((issue_permit_approval_id && issue_permit_approval_id.id) || (ipKeyword && ipKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onIpClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showIpModal}
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
            {wpConfig && wpConfig.is_ehs_required && (
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={ehsAuthority.name}
                label={ehsAuthority.label}
                formGroupClassName="m-1"
                open={l2Open}
                oldValue={getOldData(ehs_authority_id)}
                value={ehs_authority_id && ehs_authority_id.name ? ehs_authority_id.name : getOldData(ehs_authority_id)}
                size="small"
                onOpen={() => {
                  setL2Open(true);
                  setL2Keyword('');
                }}
                onClose={() => {
                  setL2Open(false);
                  setL2Keyword('');
                }}
                apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={l2Options}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onL2KeywordChange}
                    variant="standard"
                    value={l2Keyword}
                    className={((ehs_authority_id && ehs_authority_id.id) || (l2Keyword && l2Keyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    label={ehsAuthority.label}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {teamsInfo && teamsInfo.loading && l2Open ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((ehs_authority_id && ehs_authority_id.id) || (l2Keyword && l2Keyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onL2Clear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showL2Modal}
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
            )}
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={securityOffice.name}
              label={securityOffice.label}
              formGroupClassName="m-1"
              open={l3Open}
              oldValue={getOldData(security_office_id)}
              value={security_office_id && security_office_id.name ? security_office_id.name : getOldData(security_office_id)}
              size="small"
              onOpen={() => {
                setL3Open(true);
                setL3Keyword('');
              }}
              onClose={() => {
                setL3Open(false);
                setL3Keyword('');
              }}
              apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={l3Options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onL3KeywordChange}
                  variant="standard"
                  label={securityOffice.label}
                  value={l3Keyword}
                  className={((security_office_id && security_office_id.id) || (l3Keyword && l3Keyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading && l3Open ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((security_office_id && security_office_id.id) || (l3Keyword && l3Keyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onL3Clear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showL3Modal}
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
            {wpConfig && wpConfig.review_required && (
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={reviewer.name}
                label={reviewer.label}
                formGroupClassName="m-1"
                open={l4Open}
                oldValue={getOldData(reviewer_id)}
                value={reviewer_id && reviewer_id.name ? reviewer_id.name : getOldData(reviewer_id)}
                size="small"
                onOpen={() => {
                  setL4Open(true);
                  setL4Keyword('');
                }}
                onClose={() => {
                  setL4Open(false);
                  setL4Keyword('');
                }}
                apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={l4Options}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onL4KeywordChange}
                    variant="standard"
                    label={reviewer.label}
                    value={l4Keyword}
                    className={((reviewer_id && reviewer_id.id) || (l4Keyword && l4Keyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {employeeListInfo && employeeListInfo.loading && l4Open ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((reviewer_id && reviewer_id.id) || (l4Keyword && l4Keyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onL4Clear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showL4Modal}
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
            )}
          </Box>
        </Box>
      </Box >
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
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

AdditionalForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalForm;
