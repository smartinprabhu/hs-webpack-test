/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  IconButton, Dialog,
} from '@mui/material';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import React, { useState, useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faCancel,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import Loader from '@shared/loading';
import DialogHeader from '../../commonComponents/dialogHeader';

import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import AuditLog from '../../commonComponents/auditLogs';
import {
  hxInspCancelStatusJson,
} from '../../commonComponents/utils/util';
import actionCodes from '../data/actionCodes.json';
import {
  TabPanel,
  extractNameObject,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
  getColumnArrayById,
} from '../../util/appUtils';

import customData from '../data/customData.json';

import { resetCancelReq, resetResumePPM } from '../../preventiveMaintenance/ppmService';

import { getDueDays } from '../../auditManagement/utils/utils';
import ApproveCancelRequest from './approveCancelRequest';
import WithdrawCancelRequest from './withdrawCancelRequest';
import CancelSchedules from './cancelSchedules';
import CancelDateRanges from './cancelDateRanges';
import RelatedSchedules from './relatedSchedules';
import InspectionResumeAllocation from './inspectionResumeAllocation';
import { getHxInspCancelDetails } from '../inspectionService';

const faIcons = {
  APPROVE: faCheck,
  WITHDRAW: faCancel,
  RESUME: faPlay,
};

const appModels = require('../../util/appModels').default;

const CancelRequestDetails = ({ offset }) => {
  const {
    hxInspCancelDetails,
    inspectionCommenceInfo,
  } = useSelector((state) => state.inspection);
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [typeSelected, setType] = React.useState('all');

  const [checkedRows, setCheckRows] = useState([]);
  const [parentSchedules, setParentSchedules] = useState([]);

  const defaultActionText = 'Gatepass Actions';

  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const [targetDateRanges, setTargetDateRanges] = useState([]);
  const [originalDateRanges, setOriginalDateRanges] = useState([]);

  const [cancelApprovalModal, showCancelApprovalModal] = useState(false);

  const [targetEndDate, setTargetEndDate] = useState(false);
  const [targetStartDate, setTargetStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  const [cancelWithdrawModal, showCancelWithdrawModal] = useState(false);
  const [resumeModal, showResumeModal] = useState(false);

  const detailedData = hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length ? hxInspCancelDetails.data[0] : '';
  const isChecklist = (detailedData && detailedData.hx_inspection_ids && detailedData.hx_inspection_ids.length > 0);
  let tabs = ['Overview', 'Inspection Schedules', 'Date Ranges', 'Audit Logs'];
  if (detailedData && detailedData.is_cancel_for_all_assets && !isChecklist) {
    tabs = ['Overview', 'Audit Logs'];
  }
  if (detailedData && detailedData.is_cancel_for_all_assets && isChecklist) {
    tabs = ['Overview', 'Inspection Schedules to Exclude', 'Audit Logs'];
  }

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isApprove = allowedOperations.includes(actionCodes['Approve Cancel Request']);
  const isResume = allowedOperations.includes(actionCodes['Resume Inspection Schedule']);

  // const isEditable = opEdit && detailedData && (detailedData.state === 'Upcoming' || detailedData.state === 'Started' || detailedData.state === 'Inprogress');

  const gpConfig = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length ? inspectionCommenceInfo.data[0] : false;

  const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
  const userRole = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
  const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
  const userMail = userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : false;

  useEffect(() => {
    if (detailedData.state === 'Approved' && hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length) {
      const dates = hxInspCancelDetails.data[0].date_range_ids && hxInspCancelDetails.data[0].date_range_ids.length > 0 ? hxInspCancelDetails.data[0].date_range_ids : [];
      const filteredDates = dates && dates.length > 0 ? dates.filter(item => item.is_all_upcoming === false) :[];
      if (filteredDates && filteredDates.length > 0) {
        const formattedRanges = filteredDates.map((range) => ({
          start: range.from_date,
          end: range.to_date,
          id: range.id,
        }));
        setTargetDateRanges(formattedRanges);
        setOriginalDateRanges(formattedRanges);
      }
    } else {
      setTargetDateRanges([]);
    }
  }, [hxInspCancelDetails]);

  useEffect(() => {
    if (hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length && hxInspCancelDetails.data[0].hx_inspection_ids && hxInspCancelDetails.data[0].hx_inspection_ids.length) {
      setCheckRows(hxInspCancelDetails.data[0].hx_inspection_ids);
      setParentSchedules(hxInspCancelDetails.data[0].hx_inspection_ids);
    } else {
      setCheckRows([]);
      setParentSchedules([]);
    }
  }, [hxInspCancelDetails]);

  function isApproveUser() {
    let res = false;
    const canCancelApprove = gpConfig && gpConfig.approval_required_for_cancel;
    if (detailedData && detailedData.cancel_approval_authority && detailedData.cancel_approval_authority.id) {
      const teamData = detailedData.cancel_approval_authority.type === 'Team';
      const userData = detailedData.cancel_approval_authority.type === 'User';
      const roleData = detailedData.cancel_approval_authority.type === 'Role';
      const customMailData = detailedData.cancel_approval_authority.type === 'Custom';
      if (userData) {
        const userData1 = detailedData.cancel_approval_authority.users_ids && detailedData.cancel_approval_authority.users_ids.length ? detailedData.cancel_approval_authority.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = detailedData.cancel_approval_authority.role_id && detailedData.cancel_approval_authority.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = detailedData.cancel_approval_authority.user_defined_email_ids && detailedData.cancel_approval_authority.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = detailedData.cancel_approval_authority.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        }));
        // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    }
    return canCancelApprove ? res : true;
  }

  function isRequestUser() {
    let res = false;
    const requestorId = detailedData.requested_by_id && detailedData.requested_by_id.id;
    if (requestorId) {
      if (requestorId === userId) {
        res = true;
      }
    }
    return res;
  }

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';
    const canCancel = gpConfig && gpConfig.is_can_cancel;

    if (actionName === 'Approve/Reject Cancellation Request') {
      if (vrState !== 'Pending' || !canCancel || !isApprove) {
        allowed = false;
      }
    }
    if (actionName === 'Withdraw Cancellation Request') {
      if (vrState !== 'Pending') {
        allowed = false;
      }
    }
    if (actionName === 'Resume Inspection Schedules') {
      if (vrState !== 'Approved' || !isResume || detailedData.is_cancel_for_all_assets) {
        allowed = false;
      }
    }

    return allowed;
  };

  function checkActionDisable(actionName) {
    let disable = false;
    const endDate = detailedData && detailedData.expires_on ? moment.utc(detailedData.expires_on).local().format('YYYY-MM-DD HH:mm:ss') : new Date();
    const isNotExpire = new Date(endDate) >= new Date();
    if (actionName === 'Approve/Reject Cancellation Request' && (!isApproveUser() || !isNotExpire)) {
      disable = true;
    }
    if (actionName === 'Withdraw Cancellation Request' && (!isRequestUser() || !isNotExpire)) {
      disable = true;
    }
    return disable;
  }

  const checkAuditStatus = (val) => (
    <Box>
      {hxInspCancelStatusJson.map(
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
          {val === 'Pending' ? getDueDays(detailedData.expires_on, new Date()) : ''}
        </Box>
        ),
      )}
    </Box>
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeCancelApproval = () => {
    showCancelApprovalModal(false);
    dispatch(resetCancelReq());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeCancelWithdrawel = () => {
    showCancelWithdrawModal(false);
    dispatch(resetCancelReq());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const resumeSchedules = () => {
    dispatch(getHxInspCancelDetails(detailedData.id, appModels.HXINSPECTIONCANCEL));
    showResumeModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const switchActionItem = (action) => {
    dispatch(resetCancelReq());
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    if (action.displayname === 'Approve/Reject Cancellation Request') {
      showCancelApprovalModal(true);
    }
    if (action.displayname === 'Withdraw Cancellation Request') {
      showCancelWithdrawModal(true);
    }
    if (action.displayname === 'Resume Inspection Schedules') {
      showResumeModal(true);
    }
    handleClose();
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {detailedData && (
      <Box>
        <DetailViewHeader
          mainHeader={`${getDefaultNoValue(detailedData.reason)}`}
          subHeader={detailedData.sequence}
          status={
                            detailedData.state ? checkAuditStatus(detailedData.state) : '-'
                        }
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
                {customData && customData.actionCancelItems.map((actions) => (
                  checkActionAllowed(actions.displayname) && (
                    <MenuItem
                      sx={{
                        font: 'normal normal normal 15px Suisse Intl',
                      }}
                      id="switchAction"
                      className="pl-2"
                      key={actions.id}
                      disabled={checkActionDisable(actions.displayname)}
                      onClick={() => switchActionItem(actions)}
                    >
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faIcons[actions.name]}
                      />
                      {actions.displayname}
                    </MenuItem>
                  )
                ))}
              </Menu>
            </Box>
                          )}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <DetailViewTab
              value={value}
              handleChange={handleTabChange}
              tabs={tabs}
            />

            <TabPanel value={value} index={0}>
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'General Information',
                    leftSideData: [
                      {
                        property: 'Requested By',
                        value: getDefaultNoValue(extractNameObject(detailedData.requested_by_id, 'name')),
                      },
                      {
                        property: 'Approved By',
                        value: getDefaultNoValue(extractNameObject(detailedData.approved_by_id, 'name')),
                      },
                      {
                        property: 'Expires On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.expires_on, userInfo, 'datetime')),
                      },
                      {
                        property: 'Reason',
                        value: getDefaultNoValue(detailedData.reason),
                      },
                      {
                        property: 'Cancelled for All Assets (Holiday)',
                        value: detailedData.is_cancel_for_all_assets ? 'Yes' : 'No',
                      },
                      detailedData.is_cancel_for_all_assets && {
                        property: 'Holiday End Date',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.to_date, userInfo, 'date')),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Requested On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.requested_on, userInfo, 'datetime')),
                      },
                      {
                        property: 'Approved On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.approved_on, userInfo, 'datetime')),
                      },
                      {
                        property: 'Company',
                        value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                      },
                      {
                        property: 'Remarks',
                        value: getDefaultNoValue(detailedData.remarks),
                      },
                      detailedData.is_cancel_for_all_assets && {
                        property: 'Holiday Start Date',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.from_date, userInfo, 'date')),
                      },
                    ],
                  },
                ]}
              />

            </TabPanel>
            {detailedData && detailedData.is_cancel_for_all_assets && isChecklist && (

            <TabPanel value={value} index={1}>
              <CancelSchedules />
            </TabPanel>

            )}
            {detailedData && !detailedData.is_cancel_for_all_assets && (
            <>
              <TabPanel value={value} index={1}>
                <CancelSchedules />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <CancelDateRanges />
              </TabPanel>
            </>
            )}
            <TabPanel value={value} index={detailedData && !detailedData.is_cancel_for_all_assets ? 3 : (detailedData.is_cancel_for_all_assets && isChecklist ? 2 : 1)}>
              <AuditLog ids={detailedData.message_ids} />
            </TabPanel>
          </Box>

        </Box>
        {cancelApprovalModal && (
        <ApproveCancelRequest
          atFinish={() => closeCancelApproval()}
          atCancel={() => closeCancelApproval()}
          detailData={detailedData}
          actionModal={cancelApprovalModal}
        />
        )}
        {cancelWithdrawModal && (
        <WithdrawCancelRequest
          atFinish={() => closeCancelWithdrawel()}
          atCancel={() => closeCancelWithdrawel()}
          detailData={detailedData}
          actionModal={cancelWithdrawModal}
        />
        )}
          {resumeModal && (
          <InspectionResumeAllocation
            actionModal={resumeModal}
            detailedData={detailedData}
            atCancel={() => resumeSchedules()}            
           onToggle={() => showResumeModal(false)}
            targetDateRanges={targetDateRanges}
            setTargetDateRanges={setTargetDateRanges}
            originalDateRanges={originalDateRanges}
            startDate={targetStartDate}
            endDate={endDate || targetEndDate}
            setEndDate={setEndDate}
          />
          )}
      </Box>
      )}
      {hxInspCancelDetails && hxInspCancelDetails.loading && <Loader />}
    </>
  );
};
export default CancelRequestDetails;
