/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  ButtonDropdown,
  Card,
  CardBody,
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faCheckCircle, faSpinner, faChevronDown, faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import escalate from '@images/icons/escalateBlue.svg';
import checklistIcon from '@images/icons/performChecklistBlack.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import workOrderIcon from '@images/icons/workorder.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import LocationDefault from '@images/drawerLite/locationLite.svg';
import {
  orderStateChange, getOrderDetail, resetEscalate, resetUpdateCheckList, updateReassignTeam, getOrderCheckLists, resetTaskChecklist, resetOrderCheckList,
} from '../workorderService';
import { getTeamList } from '../../assets/equipmentService';
import {
  getDefaultNoValue, generateErrorMessage, getListOfOperations, getAllowedCompanies,
} from '../../util/appUtils';
import {
  getWorkOrderStateLabel, getWorkOrderPriorityFormLabel, getTrimmedArray, getSLALabel, getSLAText, getSLATime,
} from '../utils/utils';
import actionCodes from '../data/workOrderActionCodes.json';
import workorderActions from '../data/workorderActions.json';
import { ticketStateChange } from '../../helpdesk/ticketService';
import CheckList from './actionItems/checkList';
import ActionWorkorder from './actionItems/actionWorkorder';
import CloseWorkorder from './actionItems/closeWorkorder';
import PauseWorkorder from './actionItems/pauseWorkorder';
import AcceptWorkorder from './actionItems/acceptWorkorder';
import ReviewWorkorder from '../../inspectionSchedule/viewer/reviewWorkorder';

const appModels = require('../../util/appModels').default;

const faIcons = {
  REASSIGNTEAM: escalate,
  REASSIGNTEAMACTIVE: escalate,
  PERFORMCHECKLIST: checklistIcon,
  PERFORMCHECKLISTACTIVE: checklistIcon,
  ASSIGN: checkCircleBlack,
  ASSIGNACTIVE: checkCircleBlack,
  START: checkCircleBlack,
  STARTACTIVE: checkCircleBlack,
  PAUSE: checkCircleBlack,
  PAUSEACTIVE: checkCircleBlack,
  REOPEN: checkCircleBlack,
  REOPENACTIVE: checkCircleBlack,
  CLOSE: closeCircle,
  CLOSEACTIVE: closeCircle,
  RESTART: checkCircleBlack,
  RESTARTACTIVE: checkCircleBlack,
  UNASSIGN: checkCircleBlack,
  UNASSIGNACTIVE: checkCircleBlack,
  REVIEW: checklistIcon,
  REVIEWACTIVE: checklistIcon,
};

const BasicInfo = () => {
  const dispatch = useDispatch();
  const defaultActionText = 'Work Order Actions';
  const [escalateModal, showEscalateModal] = useState(false);
  const [checkListModal, showCheckListModal] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [oldTeamId, setOldTeamId] = useState(['0', 'Not Assigned']);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [closeActionModal, showCloseActionModal] = useState(false);
  const [pauseActionModal, showPauseActionModal] = useState(false);
  const [acceptModal, showAcceptModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [reviewModal, showReviewModal] = useState(false);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    workorderDetails, stateChangeInfo, updateChecklist,
  } = useSelector((state) => state.workorder);
  const { teamsInfo } = useSelector((state) => state.equipment);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const notAllowedOperations = ['Perform Check List', 'Assign', 'Start', 'Pause', 'Reopen', 'Finish', 'Restart', 'Unassign', 'Review'];

  const inspDeata = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0] : false;

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    dispatch(resetEscalate());
  }, []);

  useEffect(() => {
    const viewId = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
      if (workorderDetails && workorderDetails.data && workorderDetails.data[0].help_desk_id && workorderDetails.data[0].help_desk_id[0]) {
        if (teamId && teamId.id) {
          const postData = { maintenance_team_id: teamId.id };
          dispatch(ticketStateChange(workorderDetails.data[0].help_desk_id[0], postData, appModels.HELPDESK));
        }
      }
    }
  }, [userInfo, stateChangeInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (updateChecklist && updateChecklist.data)) {
      const ids = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].check_list_ids : [];
      if (ids.length > 0) {
        dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
      }
    }
  }, [userInfo, updateChecklist]);

  const handleStateChange = () => {
    const postData = { maintenance_team_id: teamId && teamId.id ? teamId.id : '' };
    const id = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
    dispatch(orderStateChange(id, postData, appModels.ORDER));
    dispatch(updateReassignTeam(teamId && teamId.id ? teamId.id : '', id, 'create', appModels.ASSIGNTEAM));
  };

  useEffect(() => {
    if (selectedActions === 'Reassign to a Team') {
      setActionText('');
      setActionCode('');
      showEscalateModal(true);
    }
    if (selectedActions === 'Perform Check List') {
      dispatch(resetOrderCheckList());
      dispatch(resetTaskChecklist());
      showCheckListModal(true);
      setActionText('');
      setActionCode('');
    }
    if (selectedActions === 'Assign') {
      setActionText('Assign');
      setActionCode('assgined_request_order');
      showAcceptModal(true);
    }
    if (selectedActions === 'Start') {
      setActionText('Start');
      setActionCode('action_start');
      showActionModal(true);
    }
    if (selectedActions === 'Restart') {
      setActionText('Restart');
      setActionCode('action_restart');
      showActionModal(true);
    }
    if (selectedActions === 'Unassign') {
      setActionText('Unassign');
      setActionCode('action_unassign');
      showActionModal(true);
    }
    if (selectedActions === 'Pause') {
      setActionText('Pause');
      setActionCode('do_record');
      showPauseActionModal(true);
    }
    if (selectedActions === 'Reopen') {
      setActionText('Reopen');
      setActionCode('action_reopen');
      showActionModal(true);
    }
    if (selectedActions === 'Finish') {
      setActionText('Finish');
      setActionCode('do_record');
      showCloseActionModal(true);
    }
    if (selectedActions === 'Review') {
      dispatch(resetEscalate());
      setActionText('');
      setActionCode('');
      showReviewModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const cancelEscalate = () => {
    dispatch(resetEscalate());
  };

  const cancelCheckList = () => {
    dispatch(resetUpdateCheckList());
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onTeamChange = (e, data) => {
    setTeamId(data);
    setOldTeamId(workorderDetails && workorderDetails.data ? workorderDetails.data[0].maintenance_team_id : []);
  };

  let teamOptions = [];

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (teamsInfo && teamsInfo.data) {
    const mid = workorderDetails && workorderDetails.data ? workorderDetails.data[0].maintenance_team_id[0] : '';
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

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const whState = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 && workorderDetails.data[0].state ? workorderDetails.data[0].state : '';
    const rId = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0
      && workorderDetails.data[0].reviewed_by && workorderDetails.data[0].reviewed_by.length ? workorderDetails.data[0].reviewed_by[0] : false;
    if (actionName === 'Reassign to a Team' && (whState === 'in_progress' || whState === 'ready')) {
      allowed = true;
    }
    if (actionName === 'Perform Check List' && (whState === 'in_progress')) {
      allowed = true;
    }
    if (actionName === 'Assign' && (whState === 'draft' || whState === 'ready')) {
      allowed = true;
    }
    if (actionName === 'Unassign' && (whState === 'assigned' || whState === 'in_progress')) {
      allowed = true;
    }
    if (actionName === 'Pause' && (whState === 'in_progress')) {
      allowed = true;
    }
    if (actionName === 'Restart' && (whState === 'pause')) {
      allowed = true;
    }
    if (actionName === 'Finish' && (whState === 'in_progress')) {
      allowed = true;
    }
    if (actionName === 'Start' && (whState === 'assigned')) {
      allowed = true;
    }
    if (actionName === 'Reopen' && (whState === 'done' || whState === 'cancel')) {
      allowed = true;
    }
    if (actionName === 'Review' && whState === 'done' && !rId) {
      allowed = true;
    }
    return allowed;
  };

  return (
    <Row className="mt-3 globalModal-header-cards">
      {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
        <>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      REFERENCE
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getDefaultNoValue(workorderDetails.data[0].name)}
                    </p>
                    <span className="font-weight-500 font-tiny">
                      {getDefaultNoValue(workorderDetails.data[0].sequence)}
                    </span>
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={assetDefault} alt="asset" width="30" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      PRIORITY
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getWorkOrderPriorityFormLabel(workorderDetails.data[0].priority)}
                    </p>
                    {workorderDetails.data[0].state !== 'cancel' && (
                      <span className="font-weight-500 font-tiny">
                        {getSLAText(workorderDetails.data[0].date_scheduled, workorderDetails.data[0].date_execution) === 'Within SLA'
                          ? <FontAwesomeIcon className="text-success mr-2 mt-1" size="sm" icon={faClock} />
                          : <FontAwesomeIcon className="text-danger mr-2 mt-1" size="sm" icon={faClock} />}
                        {' '}
                        {' '}
                        {getSLALabel(workorderDetails.data[0].date_scheduled, workorderDetails.data[0].date_execution)}
                        {' '}
                        {' '}
                        {getSLAText(workorderDetails.data[0].date_scheduled, workorderDetails.data[0].date_execution) === 'SLA Elapsed'
                          ? (
                            <span className="text-danger font-weightt-400 ml-1">
                              {' '}
                              {getSLATime(workorderDetails.data[0].date_scheduled, workorderDetails.data[0].date_execution)}
                              {' '}
                            </span>
                          )
                          : ''}
                      </span>
                    )}
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={LocationDefault} alt="asset" width="22" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      STATUS
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getWorkOrderStateLabel(workorderDetails.data[0].state)}
                    </p>
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={logsIcon} alt="asset" width="25" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      ACTIONS
                    </p>
                    <p className="mb-0 font-weight-700">
                      <div className="mr-2 mt-1">
                        <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="mr-3 w-100  actionDropdown">
                          <DropdownToggle
                            caret
                            className={
                              selectedActionImage !== ''
                                ? 'bg-white text-navy-blue text-left pb-05 pt-05 font-11 rounded-pill'
                                : 'pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left'
                            }
                          >
                            {selectedActionImage !== ''
                              ? (
                                <img src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" alt="ticketactions" className="mr-2" />
                              ) : ''}
                            <span className="font-weight-700">
                              {selectedActions}
                              <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1" height="20" width="20" icon={faChevronDown} />
                            </span>
                          </DropdownToggle>
                          <DropdownMenu className="w-100">
                            {workorderActions && workorderActions.actionItems.map((actions) => (
                              (allowedOperations.includes(actionCodes[actions.displayname]) || notAllowedOperations.includes(actions.displayname)) && (
                                checkActionAllowed(actions.displayname) && (
                                  <DropdownItem
                                    id="switchAction"
                                    className="pl-2"
                                    key={actions.id}
                                    onClick={() => switchActionItem(actions)}
                                  >
                                    <img src={faIcons[actions.name]} alt="ticketactions" className="mr-2" height="15" width="15" />
                                    {actions.displayname}
                                  </DropdownItem>
                                )
                              )))}
                          </DropdownMenu>
                        </ButtonDropdown>
                      </div>
                    </p>
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={handPointerBlack} alt="asset" width="20" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </>
      )}
      <Modal size="lg" className="border-radius-50px modal-dialog-centered" isOpen={escalateModal}>
        <ModalHeaderComponent
          imagePath={workOrderIcon}
          closeModalWindow={() => { showEscalateModal(false); setTeamId(''); cancelEscalate(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
          title="Reassign to a Team"
          response={stateChangeInfo}
        />
        <ModalBody>
          <Row>
            <Col sm="6" md="6" lg="6" xs="12">
              <Card className="border-0">
                <CardBody className="p-2">
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      <p className="font-weight-700 mt-3">
                        <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                        Reassign this work order to the new team.
                      </p>
                      <p className="font-weight-700">
                        {actionResults}
                        {stateChangeInfo && stateChangeInfo.err ? generateErrorMessage(stateChangeInfo) : 'The work order has been reassigned successfully.'}
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col sm="6" md="6" lg="6" xs="12">
              <Card className="bg-lightblue border-0">
                <CardBody className="p-3">
                  {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
                    <Row>
                      <Col sm="9" md="9" lg="9" xs="12">
                        <p className="font-weight-800 font-side-heading mb-1">
                          {workorderDetails.data[0].name}
                        </p>
                        <p className="font-weight-500 font-side-heading mb-1">
                          {workorderDetails.data[0].sequence}
                        </p>
                        <span className="font-weight-800 font-side-heading mr-1">
                          {!(stateChangeInfo && stateChangeInfo.data) ? (<>Current</>) : (<>Previous</>)}
                          {' '}
                          Team :
                        </span>
                        <span className="font-weight-400">
                          {!(stateChangeInfo && stateChangeInfo.data)
                            ? getDefaultNoValue(workorderDetails.data[0].maintenance_team_id ? workorderDetails.data[0].maintenance_team_id[1] : '') : oldTeamId[1]}
                        </span>
                      </Col>
                      <Col sm="3" md="3" lg="3" xs="12">
                        <img src={workOrderIcon} alt="workorder" width="25" className="mr-2 float-right" />
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
              {!(stateChangeInfo && stateChangeInfo.data) && (
                <div>
                  <FormGroup className="mt-3">
                    <Label for="maintenance_team">Maintenance Team</Label>
                    <Autocomplete
                      name="maintenance_team"
                      label="Maintenance Team"
                      open={teamOpen}
                      size="small"
                      onOpen={() => {
                        setTeamKeyword('');
                        setTeamOpen(true);
                      }}
                      onClose={() => {
                        setTeamOpen(false);
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
                          className="without-padding custom-icons"
                          // className={teamId && teamId.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {teamId && (
                                    <IconButton onClick={() => {
                                      setOldTeamId('');
                                      setTeamId('');
                                      setTeamKeyword('');
                                    }}
                                    >
                                      <BackspaceIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton>
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
                </div>
              )}
            </Col>
            {(stateChangeInfo && stateChangeInfo.data) && (
              <>
                <Col sm="6" md="6" lg="6" xs="12" />
                <Col sm="6" md="6" lg="6" xs="12">
                  <p className="mb-3 mt-2 font-weight-800 text-center">Reassigned to</p>
                  <Card className="bg-lightblue border-0">
                    <CardBody className="p-3">
                      {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
                        <Row>
                          <Col sm="9" md="9" lg="9" xs="12">
                            <p className="font-weight-800 font-side-heading mb-1">
                              {workorderDetails.data[0].name}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              {workorderDetails.data[0].sequence}
                            </p>
                            <span className="font-weight-800 font-side-heading mr-1">
                              New Team :
                            </span>
                            <span className="font-weight-400">
                              {getDefaultNoValue(workorderDetails.data[0].maintenance_team_id ? workorderDetails.data[0].maintenance_team_id[1] : '')}
                            </span>
                          </Col>
                          <Col sm="3" md="3" lg="3" xs="12">
                            <img src={workOrderIcon} alt="workorder" width="25" className="mr-2 float-right" />
                          </Col>
                        </Row>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          {!(stateChangeInfo && stateChangeInfo.data) ? (
            <Button
              disabled={(!teamId || (stateChangeInfo && stateChangeInfo.loading))}
              type="button"
              size="sm"
              variant="contained"
              onClick={() => handleStateChange()}
            >
              Confirm
            </Button>
          )
            : (
              <Button
                type="button"
                size="sm"
                variant="contained"
                onClick={() => { showEscalateModal(false); setTeamId(''); cancelEscalate(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
              >
                Ok
              </Button>
            )}
        </ModalFooter>
      </Modal>
      {checkListModal && (
        <CheckList
          atFinish={() => {
            showCheckListModal(false);
            cancelCheckList();
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');

          }}
          workorderDetails={workorderDetails}
          refresh={() => {
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          checkListModal
        />
      )}
      {actionModal && (
        <ActionWorkorder
          atFinish={() => {
            showActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          actionModal
        />
      )}
      {closeActionModal && (
        <CloseWorkorder
          atFinish={() => {
            showCloseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          refresh={() => {
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          closeActionModal
        />
      )}
      {pauseActionModal && (
        <PauseWorkorder
          atFinish={() => {
            showPauseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          pauseActionModal
        />
      )}
      {acceptModal && (
        <AcceptWorkorder
          atFinish={() => {
            showAcceptModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          acceptModal
        />
      )}
      {reviewModal && (
        <ReviewWorkorder
          atFinish={() => {
            showReviewModal(false); resetEscalate();
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          woData={inspDeata}
          inspDeata={false}
          reviewModal
        />
      )}
    </Row>
  );
};
export default BasicInfo;
