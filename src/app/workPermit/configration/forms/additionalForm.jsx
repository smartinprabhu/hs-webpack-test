/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { Box } from "@mui/system";
import { IoCloseOutline } from 'react-icons/io5';
import {
  Dialog, DialogContent, DialogContentText,
  Typography,
} from '@mui/material';

import { generateErrorMessage, extractOptionsObject, getAllowedCompanies } from '../../../util/appUtils';
import {
  getTeamList,
} from '../../../assets/equipmentService';
import AdvancedSearchModal from './advancedSearchModal';
import { AddThemeColor } from '../../../themes/theme'
import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import MuiTextArea from "../../../commonComponents/formFields/muiTextarea";
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    setFieldValue,
    formField: {
      ehsInstructions,
      termsAndConditions,
      approvalAuthority,
      issuePermitApprovalAuthority,
      ehsAuthority,
      securityOffice,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    approval_authority_id,
    ehs_authority_id,
    security_office_id,
    issue_permit_approval_id,
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

  const { userInfo } = useSelector((state) => state.user);
  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);

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

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l4Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l4Keyword));
      }
    })();
  }, [userInfo, l4Keyword, l4Open]);

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
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
    setFieldValue('issue_permit_approval_id', '');
    setL4Open(false);
  };

  const showL4Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('issue_permit_approval_id');
    setModalName('Issue Permit Approval Authority');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const l1Options = extractOptionsObject(teamsInfo, approval_authority_id);
  const l2Options = extractOptionsObject(teamsInfo, ehs_authority_id);
  const l3Options = extractOptionsObject(teamsInfo, security_office_id);
  const l4Options = extractOptionsObject(teamsInfo, issue_permit_approval_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: '20px'

        }}
      >
        <Box
          sx={{
            width: "50%",
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
            Approval Info
          </Typography>
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={approvalAuthority.name}
            label={approvalAuthority.label}
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
                label={approvalAuthority.label}
                variant="standard"
                value={l1Keyword}
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
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={issuePermitApprovalAuthority.name}
            label={issuePermitApprovalAuthority.label}
            open={l4Open}
            oldValue={getOldData(issue_permit_approval_id)}
            value={issue_permit_approval_id && issue_permit_approval_id.name ? issue_permit_approval_id.name : getOldData(issue_permit_approval_id)}
            size="small"
            onOpen={() => {
              setL4Open(true);
              setL4Keyword('');
            }}
            onClose={() => {
              setL4Open(false);
              setL4Keyword('');
            }}
            loading={teamsInfo && teamsInfo.loading && teamsInfo}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            options={l4Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL4KeywordChange}
                label={issuePermitApprovalAuthority.label}
                variant="standard"
                value={l1Keyword}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l4Open ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((issue_permit_approval_id && issue_permit_approval_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
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
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={ehsAuthority.name}
            label={ehsAuthority.label}
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
                label={ehsAuthority.label}
                onChange={onL2KeywordChange}
                variant="standard"
                value={l2Keyword}
                placeholder="Search & Select"
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
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={securityOffice.name}
            label={securityOffice.label}
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
                label={securityOffice.label}
                onChange={onL3KeywordChange}
                variant="standard"
                value={l3Keyword}
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
        </Box>

        <Box
          sx={{
            width: "50%",
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
            Other Info
          </Typography>

          <MuiTextArea
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={ehsInstructions.name}
            label={ehsInstructions.label}
            formGroupClassName="m-1"
            maxRows={4}
          />
          <MuiTextArea
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={termsAndConditions.name}
            label={termsAndConditions.label}
            formGroupClassName="m-1"
            maxRows={4}
          />
        </Box>
      </Box>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
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
  formField: PropTypes.objectOf([PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalForm;
