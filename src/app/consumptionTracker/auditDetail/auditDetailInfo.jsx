/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Menu, IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import {
  Progress,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faCheckCircle, faSave, faTimesCircle,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import Drawer from '@mui/material/Drawer';

import { useDispatch, useSelector } from 'react-redux';
import TrackerCheck from '@images/sideNavImages/consumption_black.svg';
import actionCodes from '../data/actionCodes.json';

import {
  getDefaultNoValue, numToFloatView, extractNameObject,
  getColumnArrayByField,
  getArrayFromValuesMultByIdIn, getListOfOperations,
} from '../../util/appUtils';
import { newpercalculate } from '../../util/staticFunctions';
import {
  getSlaStateLabel,
} from '../utils/utils';

import {
  cjStatusJson,
} from '../../commonComponents/utils/util';

import customData from '../data/customData.json';
import Action from './actionItems/actions';

import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import AddTracker from '../addTracker';
import {
  resetCtUpdateInfo, getCtDetail,
} from '../ctService';

const appModels = require('../../util/appModels').default;

const faIcons = {
  CANCEL: faTimesCircle,
  SUBMIT: faEnvelope,
  APPROVE: faCheckCircle,
  DRAFT: faSave,
  REVIEW: faFile,
};

const AuditDetailInfo = (props) => {
  const { detailData, offset, savedRecords } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Tracker Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusName, setStatusName] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [editLink, setEditLink] = useState(false);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const {
    ctCount, ctInfo, ctCountLoading,
    ctFilters, ctDetailsInfo, addCtInfo,
    updateCtInfo, ctExportInfo,
  } = useSelector((state) => state.consumptionTracker);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  useEffect(() => {
    dispatch(resetCtUpdateInfo());
  }, []);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const switchActionItem = (action) => {
    dispatch(resetCtUpdateInfo());
    setSelectedActions(action.displayname);
    setActionMethod(action.method);
    setActionButton(action.buttonName);
    setActionMsg(action.message);
    setStatusName(action.statusName);
    setSelectedActionImage(action.name);
    showActionModal(true);
  };

  const closeAction = () => {
    dispatch(resetCtUpdateInfo());
    dispatch(getCtDetail(viewData.id, appModels.CONSUMPTIONTRACKER));
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
    setAnchorEl(null);
  };

  const closeActionCancel = () => {
    dispatch(resetCtUpdateInfo());
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  function isReviewUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const data = viewData.checker_ids && viewData.checker_ids.length ? viewData.checker_ids.filter((item) => item.id === userRoleId) : [];
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  function isApproveUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const data = viewData.approver_ids && viewData.approver_ids.length ? viewData.approver_ids.filter((item) => item.id === userRoleId) : [];
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  const loading = detailData && detailData.loading;

  const rangeData = viewData && viewData.tracker_lines && viewData.tracker_lines.length ? viewData.tracker_lines.filter((item) => !item.is_not_applicable && item.answer && item.mro_activity_id.type !== 'Computed') : false;

  const sections = viewData && viewData.sla_category_logs ? viewData.sla_category_logs : [];

  function getAvgTotal(field) {
    let count = 0;
    for (let i = 0; i < sections.length; i += 1) {
      count += sections[i][field];
    }
    return count;
  }

  function getTotalQtnsCount() {
    let res = 0;
    const totalData = viewData && viewData.tracker_lines && viewData.tracker_lines.length ? viewData.tracker_lines.filter((item) => !item.is_not_applicable && item.mro_activity_id.type !== 'Computed') : 0;
    /* const unApplicableData = performanceLogs ? performanceLogs.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const unApplicableQtns = unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(viewData && viewData.tracker_lines ? viewData && viewData.tracker_lines : [], unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length; */
    res = totalData && totalData.length ? totalData.length : 0;
    return res;
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const checkConsumptionStatus = (val) => (
    <Box>
      {cjStatusJson.map(
        (status) => val === status.status && (
          <Box
            sx={{
              backgroundColor: status.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: status.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {val}
          </Box>
        ),
      )}
    </Box>
  );

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';

    if (actionName === 'Cancel Tracker') {
      if (vrState === 'Cancelled' || vrState === 'Approved') {
        allowed = false;
      }
      if (vrState === 'Submitted' && !isReviewUser()) {
        allowed = false;
      }
      if (vrState === 'Reviewed' && !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Set to Draft') {
      if (vrState === 'Cancelled' || vrState === 'Draft' || vrState === 'Approved') {
        allowed = false;
      }
      if (vrState === 'Submitted' && !isReviewUser()) {
        allowed = false;
      }
      if (vrState === 'Reviewed' && !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Submit for Review') {
      if (vrState !== 'Draft') {
        allowed = false;
      }
    }
    if (actionName === 'Review & Submit for Approval') {
      if (vrState !== 'Submitted' || !isReviewUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Approve') {
      if (vrState !== 'Reviewed' || !isApproveUser()) {
        allowed = false;
      }
    }
    return allowed;
  };

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  function getRangeScore(value, ranges) {
    let score = '';
    console.log(value);
    console.log(ranges);
    if (ranges && ranges.length) {
      const rangesData = ranges.filter((item) => parseFloat(item.min) <= parseFloat(value) && parseFloat(item.max) >= parseFloat(value));
      if (rangesData && rangesData.length) {
        score = rangesData[0].legend;
      }
    }

    return score;
  }

  const percentage = newpercalculate(getTotalQtnsCount(), rangeData && rangeData.length ? rangeData.length : 0);

  const closeEditModalWindow = () => {
    showEditModal(false);
  };

  return (
    <>
      {viewData && (
      <>
        <DetailViewHeader
          mainHeader={getDefaultNoValue(extractNameObject(viewData.temp_type_id, 'name'))}
          status={
                viewData.state
                  ? checkConsumptionStatus(viewData.state)
                  : '-'
              }
          subHeader={(
            <>
              {viewData.created_on
                    && userInfo.data
                    && userInfo.data.timezone
                ? moment
                  .utc(viewData.created_on)
                  .local()
                  .tz(userInfo.data.timezone)
                  .format('yyyy MMM Do, hh:mm A')
                : '-'}
              {' '}
              {getDefaultNoValue(viewData.audit_for)}
              {' '}
              {getDefaultNoValue(extractNameObject(viewData.company_id, 'name'))}
            </>
              )}
          mainTwoHeader={[
            {
              header: 'COVERAGE',
              value:
  <p className="mb-0 display-flex">
    <span className="mb-0 font-weight-800 font-14">
      {rangeData && rangeData.length ? rangeData.length : 0}
    </span>
    <span className="mb-0 font-weight-500 mr-3">
      {`/ ${getTotalQtnsCount()}`}
    </span>
    <Progress value={percentage} className="w-50 mt-1" color={getProgressColor(percentage)}>
      {percentage}
      {' '}
      %
    </Progress>
  </p>,
            },
          ]}
          actionComponent={(
            <Box>
              <IconButton
                sx={{
                  margin: '0px 5px 0px 5px',
                }}
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
              >
                <BsThreeDotsVertical color="#ffffff" />
              </IconButton>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >

                {customData
                      && customData.actionItems.map(
                        (actions) => checkActionAllowed(
                          actions.displayname,
                          ctDetailsInfo,
                          'Actions',
                        ) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                             /*  disabled={
                                !checkActionAllowedDisabled(actions.displayname)
                              } */
                          onClick={() => switchActionItem(actions)}
                        >
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faIcons[actions.name]}
                          />
                          {actions.displayname}

                        </MenuItem>
                        ),
                      )}
              </Menu>
            </Box>
              )}
        />

        {/*  !loading && viewData && (
    <Row className="mt-3 globalModal-header-cards">
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  PERIOD
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(viewData.audit_for)}
                </p>
                <p className="mb-0 font-weight-400 font-tiny">
                  {getDefaultNoValue(extractNameObject(viewData.company_id, 'name'))}
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md={(viewData.state === 'Submitted' || viewData.state === 'Reviewed' || viewData.state === 'Approved') ? '6' : '9'} lg={(viewData.state === 'Submitted' || viewData.state === 'Reviewed' || viewData.state === 'Approved') ? '6' : '9'} xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  STATUS
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(getSlaStateLabel(viewData.state))}
                </p>
              </Col>
              (viewData.state === 'Submitted' || viewData.state === 'Reviewed' || viewData.state === 'Approved') && (
              <Col sm="12" md="6" lg="6" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  OVERALL SCORE
                </p>
                <p className="mb-0 font-weight-700">
                  {numToFloatView(getAvgTotal('achieved_score') / sections.length)}
                  {' '}
                  /
                  {' '}
                  {numToFloatView(getAvgTotal('target') / sections.length)}
                  {' '}
                  (
                  {getRangeScore((getAvgTotal('achieved_score') / sections.length), viewData.sla_metric_id && viewData.sla_metric_id.scale_line_ids ? viewData.sla_metric_id.scale_line_ids : [])}
                  )
                </p>
              </Col>
                  )
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
                  COVERAGE
                </p>
                <p className="mb-0">
                  <span className="mb-0 font-weight-800 font-size-17px">
                    {rangeData && rangeData.length ? rangeData.length : 0}
                  </span>
                  <span className="mb-0 font-weight-500">
                    {`/
                  ${getTotalQtnsCount()}`}
                  </span>
                </p>
              </Col>
              <Col sm="12" md="12" lg="12" xs="12" className="">
                <Progress value={percentage} color={getProgressColor(percentage)}>
                  {percentage}
                  {' '}
                  %
                </Progress>
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
                    <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown">
                      <DropdownToggle
                        caret
                        className={selectedActionImage !== '' ? 'bg-white text-navy-blue text-left pb-05 pt-05 font-11 rounded-pill'
                          : 'pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left'}
                      >
                        {selectedActionImage !== ''
                          ? (
                            <FontAwesomeIcon
                              className="mr-2"
                              color="primary"
                              icon={faIcons[`${selectedActionImage}`]}
                            />
                          ) : ''}
                        <span className="font-weight-700">
                          {!selectedActionImage && (
                            <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                          )}
                          {selectedActions}
                          <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                        </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        {customData && customData.actionItems.map((actions) => (
                          checkActionAllowed(actions.displayname) && (
                          <DropdownItem
                            id="switchAction"
                            className="pl-2"
                            key={actions.id}
                            onClick={() => switchActionItem(actions)}
                          >
                            <FontAwesomeIcon
                              className="mr-2"
                              icon={faIcons[actions.name]}
                            />
                            {actions.displayname}
                          </DropdownItem>
                          )
                        ))}
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

    </Row> */}

        <Drawer
          PaperProps={{
            sx: { width: '50%' },
          }}
          anchor="right"
          open={editModal}
        >

          <DrawerHeader
            headerName="Update Breakdown Tracker"
            imagePath={TrackerCheck}
            onClose={closeEditModalWindow}
          />
          <AddTracker editId={editId} closeModal={closeEditModalWindow} />
        </Drawer>

        {actionModal && (
        <Action
          atFinish={() => closeAction()}
          atCancel={() => closeActionCancel()}
          detailData={viewData}
          actionModal={actionModal}
          actionButton={actionButton}
          actionMsg={actionMsg}
          offset={offset}
          actionMethod={actionMethod}
          displayName={selectedActions}
          statusName={statusName}
          message={selectedActionImage}
          savedRecords={savedRecords}
        />
        )}
      </>
      )}
    </>

  );
};

AuditDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AuditDetailInfo;
