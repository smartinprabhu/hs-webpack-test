/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  FormGroup,
  Label,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Typography,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Autocomplete } from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import auditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, getAllowedCompanies,
  extractOptionsObject,
} from '../../util/appUtils';
import AdvancedSearchModal from '../../hazards/forms/advancedSearchModal';
import {
  updateHxModule,
  resetUpdateHxModule,
  getConfigurationSummary,
} from '../siteService';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getTeamMember,
} from '../../auditSystem/auditService';

const appModels = require('../../util/appModels').default;

const AssignOwner = ({
  assignModal, moduleData, atFinish, atCancel,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(assignModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [teamMemberOpen, setTeamMemberOpen] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');
  const [assignMember, setAssignMember] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { hxModuleUpdate } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);
  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (teamMemberOpen) {
      dispatch(getTeamMember(companies, appModels.TEAMMEMEBERS, teamMemberKeyword));
    }
  }, [teamMemberKeyword, teamMemberOpen]);

  useEffect(() => {
    dispatch(resetUpdateHxModule());
  }, []);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  function getStatusCount(data, sta) {
    let res = 0;
    if (data && data.length) {
      const statusDatas = data.filter((item) => item.state === sta);
      res = statusDatas.length > 0 ? statusDatas.length + 1 : 1;
    }
    return res;
  }

  const handleStateChange = async () => {
    const payload = {
      responsible_person_id: assignMember && assignMember.id ? assignMember.id : false,
    };

    try {
      dispatch(updateHxModule(moduleData.id, appModels.HXONBOARDING, payload));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    if (hxModuleUpdate && hxModuleUpdate.data && userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getConfigurationSummary(userInfo.data.company.id, appModels.HXONBOARDING));
    }
    dispatch(resetUpdateHxModule());
    atFinish();
  };

  const onDataMemberChange = (e) => {
    console.log(e);
    setAssignMember(e);
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetUpdateHxModule());
    atCancel();
  };

  const onMemberClear = () => {
    setTeamMemberKeyword(null);
    setAssignMember('');
    setTeamMemberOpen(false);
  };

  const showFacilityModal = () => {
    setModelValue(appModels.TEAMMEMEBERS);
    setColumns(['id', 'name']);
    setFieldName('assigned_id');
    setModalName('Team Members List');
    setCompanyValue(`["company_id","=",${userCompanyId}]`);
    setExtraModal(true);
    // setExtraMultipleModal(true);
  };

  const teamMembersOptions = extractOptionsObject(teamMembers, assignMember);
  const loading = (hxModuleUpdate && hxModuleUpdate.loading) || timeoutLoading;

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={assignModal}>
      <DialogHeader title="Assign Owner" onClose={toggleCancel} response={hxModuleUpdate} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-0 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {moduleData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={auditBlue} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(moduleData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Description: </span>
                        {getDefaultNoValue(moduleData.description)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxModuleUpdate && !hxModuleUpdate.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <FormGroup className="mb-0">
                    <Label className="m-0">
                      Responsible To
                    </Label>
                    <Autocomplete
                      name="assigned_to"
                      className="bg-white min-width-200"
                      isRequired
                      open={teamMemberOpen}
                      size="small"
                      value={assignMember && assignMember.name ? assignMember.name : ''}
                      onOpen={() => {
                        setTeamMemberOpen(true);
                        setTeamMemberKeyword('');
                      }}
                      onClose={() => {
                        setTeamMemberOpen(false);
                        setTeamMemberKeyword('');
                      }}
                      disableClearable
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={teamMembersOptions}
                      onChange={(e, data) => onDataMemberChange(data)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={(e) => setTeamMemberKeyword(e.target.value)}
                          variant="outlined"
                          value={teamMemberKeyword}
                          className={((assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {teamMembers && teamMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {((assignMember && assignMember.id) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onMemberClear}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                  )}
                                  <IconButton
                                    aria-label="toggle search visibility"
                                    onClick={showFacilityModal}
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
                  </FormGroup>
                </Col>
              </Row>
            )}
            <Row className="justify-content-center">
              {hxModuleUpdate && hxModuleUpdate.data && !loading && (
                <SuccessAndErrorFormat response={hxModuleUpdate} successMessage="The Owner has been assigned successfully.." />
              )}
              {hxModuleUpdate && hxModuleUpdate.err && (
                <SuccessAndErrorFormat response={hxModuleUpdate} />
              )}
              {loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {hxModuleUpdate && hxModuleUpdate.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || !(assignMember && assignMember.id)}
              onClick={() => handleStateChange()}
            >
              Assign
            </Button>
          )}
        {(hxModuleUpdate && hxModuleUpdate.data
          && (
            <Button
              type="button"
              size="sm"
              disabled={loading}
              variant="contained"
              className="submit-btn"
              onClick={toggle}
            >
              Ok
            </Button>
          )
        )}
      </DialogActions>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName="Search"
              setAssignMember={setAssignMember}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AssignOwner;
