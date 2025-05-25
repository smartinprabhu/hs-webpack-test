/* eslint-disable react/jsx-no-useless-fragment */
import { IconButton, Button } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faSignIn,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';

import AuditLog from '../../commonComponents/auditLogs';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import {
  hxOnBoardingTaskJson,
} from '../../commonComponents/utils/util';
import {
  resetHxTask,
  getTaskMessages,
} from '../siteService';
import {
  TabPanel,
  extractNameObject,
  htmlToReact,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';

import customData from '../data/customData.json';
import CompleteTask from './completeTask';
import ReopenTask from './reopenTask';
import Checklists from './checklists';

const faIcons = {
  REOPEN: faSignIn,
  DONE: faCheckCircle,
};

const TaskDetail = ({ detailedData, moduleData }) => {
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { taskMessages } = useSelector((state) => state.site);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);

  const defaultActionText = 'Gatepass Actions';

  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);

  const [actionModal, showActionModal] = useState(false);
  const [reopenModal, showReopenModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const tabs = ['Overview', 'Checklists', 'Audit Logs'];

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  useMemo(() => {
    if (detailedData && detailedData.id) {
      dispatch(getTaskMessages(detailedData.id));
    }
  }, [detailedData]);

  const userId = userInfo && userInfo.data && userInfo.data.id;

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';

    if (actionName === 'Complete the task') {
      if (vrState === 'Done' || !(moduleData.responsible_person_id && moduleData.responsible_person_id.user_id && moduleData.responsible_person_id.user_id.id && moduleData.responsible_person_id.user_id.id === userId)) {
        allowed = false;
      }
    }
    if (actionName === 'Reopen the task') {
      if (vrState !== 'Done' || !(moduleData.responsible_person_id && moduleData.responsible_person_id.user_id && moduleData.responsible_person_id.user_id.id && moduleData.responsible_person_id.user_id.id === userId)) {
        allowed = false;
      }
    }
    return allowed;
  };

  const addDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const checkDisable = (actionName) => {
    if (!detailedData || !detailedData.days_required) return false;

    const actionsToDisable = ['Open']; // Actions to check
    const endDate = moment(addDays(detailedData.days_required)).local().startOf('day'); // Convert deadline to local date (ignoring time)
    const today = moment().startOf('day'); // Current date (ignoring time)

    // Check if the action is within the range and belongs to the actionsToDisable list
    const isAllow = endDate.isSameOrAfter(today);
    return actionsToDisable.includes(actionName) && !isAllow;
  };

  const checkAuditStatus = (val) => (
    <Box>
      {hxOnBoardingTaskJson.map(
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeAction = () => {
    showActionModal(false);
    showReopenModal(false);
    dispatch(resetHxTask());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  const switchActionItem = (action) => {
    dispatch(resetHxTask());
    setSelectedActions(action.displayname);
    setActionMethod(action.method);
    setActionButton(action.displayname);
    setActionMsg(action.message);
    setSelectedActionImage(action.name);
    if (action.displayname === 'Complete the task') {
      showActionModal(true);
    } else {
      showReopenModal(true);
    }
    handleClose();
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  function getDueDays(endDate) {
    if (!endDate) return '';

    const now = moment().startOf('day'); // Current date at midnight
    const dueDate = moment.utc(endDate).local().startOf('day'); // Convert endDate to local and set to midnight

    if (!dueDate.isValid()) return ''; // Validate the endDate

    if (dueDate.isSameOrAfter(now, 'day')) {
      const days = dueDate.diff(now, 'days'); // Difference in days (date only)
      if (days === 0) {
        return <span className="font-tiny text-warning">Due on Today</span>;
      }
      return (
        <span className="font-tiny text-info">
          Due in
          {' '}
          {days}
          {' '}
          {days > 1 ? 'days' : 'day'}

        </span>
      );
    }
    const expiredDays = now.diff(dueDate, 'days'); // Difference in days when expired
    return (
      <span className="font-tiny text-danger">

        {expiredDays}
        {' '}
        {expiredDays > 1 ? 'days' : 'day'}
        {' '}
        delay
      </span>
    );
  }

  return (
    <>
      {detailedData && (
      <Box>
        <DetailViewHeader
          mainHeader={`${moduleData && moduleData.name ? `${moduleData.name} - ` : ''}${getDefaultNoValue(detailedData.name)}`}
          subHeader=""
          status={
                            detailedData.state ? checkAuditStatus(detailedData.state) : '-'
                        }
          actionComponent={(
            <Box>
              {customData && customData.actionItems2.map((actions) => (

                checkActionAllowed(actions.displayname) && (
                <Button
                  type="button"
                  className="ticket-btn"
                  sx={{
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                  }}
                  variant="outlined"
                  disabled={checkDisable(actions.displayname)}
                  onClick={() => switchActionItem(actions)}
                >
                  <FontAwesomeIcon
                    className="mr-2"
                    icon={faIcons[actions.name]}
                  />
                  {actions.displayname}
                </Button>
                )
              ))}

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
                        property: 'Type',
                        value: getDefaultNoValue(detailedData.type),
                      },
                      {
                        property: detailedData.state === 'Done' ? 'Completed on' : false,
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.done_on, userInfo, 'datetime')),
                      },
                      {
                        property: detailedData.state !== 'Done' ? 'Due Date' : false,
                        value: getDefaultNoValue(getCompanyTimezoneDate(addDays(detailedData.days_required), userInfo, 'date')),
                      },
                      {
                        property: 'Company',
                        value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Reference',
                        value: getDefaultNoValue(detailedData.reference),
                      },
                      {
                        property: detailedData.state !== 'Done' ? 'Due Days' : false,
                        value: getDueDays(addDays(detailedData.days_required)),
                      },
                    ],
                  },
                  {
                    header: 'Detail Information',
                    leftSideData: [
                      {
                        property: 'Description',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.description), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                      {
                        property: 'Comments',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.comments), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Checklists detailData={detailedData} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <AuditLog ids={taskMessages && taskMessages.data && taskMessages.data.length ? taskMessages.data[0].message_ids : []} isMiniFont />
            </TabPanel>
          </Box>
          {actionModal && (
            <CompleteTask
              actionModal
              moduleData={moduleData}
              detailData={detailedData}
              atFinish={() => closeAction()}
              atCancel={() => closeAction()}
            />
          )}
          {reopenModal && (
            <ReopenTask
              actionModal={reopenModal}
              moduleData={moduleData}
              detailData={detailedData}
              atFinish={() => closeAction()}
              atCancel={() => closeAction()}
            />
          )}

        </Box>
      </Box>
      )}
    </>
  );
};
export default TaskDetail;
