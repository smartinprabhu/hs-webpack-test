/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Row,
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import * as PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faCheckCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import {
  Box
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { Button } from "@mui/material";

import { getTicketDetail, ticketStateChange, resetEscalate } from '../ticketService';
import { getTeamList } from '../../assets/equipmentService';
import ticketIcon from '@images/icons/ticketBlack.svg';
import {
  getDefaultNoValue, generateErrorMessage,
  getAllCompanies,
} from '../../util/appUtils';
import {
  getTrimmedArray,
} from '../../workorders/utils/utils';
import { orderStateChange } from '../../workorders/workorderService';
import AdvancedSearchModal from '../forms/searchModal';
import theme from '../../util/materialTheme';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const ReassignTicket = (props) => {
  const {
    ticketDetail, reassignModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [oldTeamId, setOldTeamId] = useState(['0', 'Not Assigned']);
  const [model, setmodel] = useState(reassignModal);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const columns = ['id', 'name'];
  const [extraModal, setExtraModal] = useState(false);
  const toggle = () => {
    setmodel(!model);
    atFinish();
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    stateChangeInfo,
  } = useSelector((state) => state.ticket);
  const { teamsInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(resetEscalate());
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  const handleStateChange = () => {
    const postData = { maintenance_team_id: teamId && teamId.id ? teamId.id : '' };
    const id = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    dispatch(ticketStateChange(id, postData, appModels.HELPDESK));
  };

  const cancelEscalate = () => {
    dispatch(resetEscalate());
    const viewId = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
      if (ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_order_id && ticketDetail.data[0].mro_order_id[0]) {
        const postData = { maintenance_team_id: teamId && teamId.id ? teamId.id : '' };
        dispatch(orderStateChange(ticketDetail.data[0].mro_order_id[0], postData, appModels.ORDER));
      }
    }
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onTeamKeywordClear = () => {
    setTeamKeyword(null);
    setOldTeamId('');
    setTeamId('');
    setTeamOpen(false);
  };

  const onTeamChange = (e, data) => {
    setTeamId(data);
    setOldTeamId(ticketDetail && ticketDetail.data ? ticketDetail.data[0].maintenance_team_id : []);
  };

  const onTeamModalChange = (data) => {
    setTeamId(data);
    setOldTeamId(ticketDetail && ticketDetail.data ? ticketDetail.data[0].maintenance_team_id : []);
  };

  const showSearchModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Team');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  let teamOptions = [];

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (teamsInfo && teamsInfo.data) {
    const mid = ticketDetail && ticketDetail.data ? ticketDetail.data[0].maintenance_team_id[0] : '';
    teamOptions = getTrimmedArray(teamsInfo.data, 'id', mid);
  }

  let actionResults;

  if (stateChangeInfo && stateChangeInfo.loading) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faSpinner} />
    );
  } else if (stateChangeInfo && stateChangeInfo.data) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
    );
  } else if (stateChangeInfo && stateChangeInfo.err) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faTimesCircle} />
    );
  } else {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faCheckCircle} />
    );
  }

  return (
    <Dialog maxWidth={'lg'} open={model}>
      <DialogHeader title="Reassign the Ticket" subtitle="Please follow these steps to Reassign the ticket" imagePath={ticketIcon} onClose={toggle} response={stateChangeInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F6F8FA",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10%",
              fontFamily: "Suisse Intl",
            }}
          >
            <Row className="mr-4">
              <Col sm="6" md="6" lg="6" xs="12">
                <Card className="border-0 ml-4">
                  <CardBody className="p-2 ml-2">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <p className="font-weight-700 mt-3">
                          <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                          Reassign this ticket to the new team.
                        </p>
                        <p className="font-weight-700">
                          {actionResults}
                          {stateChangeInfo && stateChangeInfo.err ? generateErrorMessage(stateChangeInfo) : 'The Ticket has been Reassigned successfully.'}
                        </p>
                      </Col>
                    </Row>

                  </CardBody>
                </Card>
              </Col>
              <Col sm="6" md="6" lg="6" xs="12">
                <Card className="bg-lightblue border-0">
                  <CardBody className="p-3">
                    <Row>
                      <Col sm="9" md="9" lg="9" xs="12">
                        <p className="font-weight-800 font-side-heading mb-1">
                          {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].subject : '')}
                        </p>
                        <p className="font-weight-500 font-side-heading mb-1">
                          #
                          {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].ticket_number : '')}
                        </p>
                        <span className="font-weight-800 font-side-heading mr-1">
                          {!(stateChangeInfo && stateChangeInfo.data) ? (<>Current</>) : (<>Previous</>)}
                          {' '}
                          Team :
                        </span>
                        <span className="font-weight-400">
                          {!(stateChangeInfo && stateChangeInfo.data)
                            ? getDefaultNoValue(
                              ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
                                && ticketDetail.data[0].maintenance_team_id && ticketDetail.data[0].maintenance_team_id.length > 0 ? ticketDetail.data[0].maintenance_team_id[1] : '',
                            ) : oldTeamId[1]}
                        </span>
                      </Col>
                      <Col sm="3" md="3" lg="3" xs="12">
                        <img src={ticketIcon} alt="ticket" width="25" className="mr-2 float-right" />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {!(stateChangeInfo && stateChangeInfo.data) && (
                  <ThemeProvider theme={theme}>
                    <FormGroup className="mt-3">
                      <Autocomplete
                        name="maintenance_team"
                        label="Maintenance Team"
                        open={teamOpen}
                        size="small"
                        onOpen={() => {
                          setTeamOpen(true);
                        }}
                        onClose={() => {
                          setTeamOpen(false);
                          setTeamKeyword('');
                        }}
                        classes={{
                          option: classes.option,
                        }}
                        onChange={onTeamChange}
                        value={teamId && teamId.name ? teamId.name : ''}
                        loading={teamsInfo && teamsInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={teamOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onTeamKeywordChange}
                            variant="outlined"
                            value={teamKeyword}
                            className={((teamId && teamId.id) || (teamKeyword && teamKeyword.length > 0))
                              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {((teamId && teamId.id) || (teamKeyword && teamKeyword.length > 0)) && (
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onTeamKeywordClear}
                                      >
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={showSearchModal}
                                      edge="end"
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
                      {(teamsInfo && teamsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
                    </FormGroup>
                  </ThemeProvider>
                )}
              </Col>
              {(stateChangeInfo && stateChangeInfo.data) && (
                <>
                  <Col sm="6" md="6" lg="6" xs="12" />
                  <Col sm="6" md="6" lg="6" xs="12">
                    <p className="mb-3 mt-2 font-weight-800 text-center">Reassigned to</p>
                    <Card className="bg-lightblue border-0 mb-2">
                      <CardBody className="p-3">
                        <Row>
                          <Col sm="9" md="9" lg="9" xs="12">
                            <p className="font-weight-800 font-side-heading mb-1">
                              {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].subject : '')}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              #
                              {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].ticket_number : '')}
                            </p>
                            <span className="font-weight-800 font-side-heading mr-1">
                              New Team :
                            </span>
                            <span className="font-weight-400">
                              {getDefaultNoValue(teamId && teamId.name ? teamId.name : '')}
                            </span>
                          </Col>
                          <Col sm="3" md="3" lg="3" xs="12">
                            <img src={ticketIcon} alt="ticket" width="25" className="mr-2 float-right" />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="border-0 pt-1">
        {!(stateChangeInfo && stateChangeInfo.data) ? (
          <Button
            disabled={(!teamId || (stateChangeInfo && stateChangeInfo.loading))}
            type="button"
            variant='contained'
            className="submit-btn"
            onClick={() => handleStateChange()}
          >
            Confirm
          </Button>
        )
          : (
            <Button
              type="button"
              variant='contained'
              className="submit-btn"
              onClick={() => { setTeamId(''); cancelEscalate(); toggle(); }}
            >
              Ok
            </Button>
          )}
      </DialogActions>
      <Dialog maxWidth={'lg'} fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            > */}
              <AdvancedSearchModal
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldName={otherFieldName}
                otherFieldValue={otherFieldValue}
                modalName={modalName}
                setFieldValue={setTeamId}
                onTeamModalChange={onTeamModalChange}
              />
            {/* </Box> */}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
ReassignTicket.propTypes = {
  ticketDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  reassignModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ReassignTicket;
