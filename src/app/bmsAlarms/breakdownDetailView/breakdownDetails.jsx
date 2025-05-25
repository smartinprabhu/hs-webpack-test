/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import {
  IconButton, Typography, Button, Divider, Menu,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import Drawer from '@mui/material/Drawer';

import TrackerCheck from '@images/sideNavImages/consumption_black.svg';

import Loader from '@shared/loading';
import { Tooltip } from 'antd';
import {
  getDefaultNoValue,
  getListOfOperations,
  htmlToReact,
  getAllCompanies,
  getCompanyTimezoneDate,
  TabPanel,
  extractNameObject, truncate,
} from '../../util/appUtils';
import customData from '../data/customData.json';

import LogNotes from './logNotes';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import AddAlarm from '../addAlarm';

// import Documents from '../../helpdesk/viewTicket/documents';
import Documents from '../../commonComponents/documents';
// import Comments from './comments';
import Comments from '../../commonComponents/comments';
import AuditLog from '../../assets/assetDetails/auditLog';
import Action from './actionItems/action';
import { getTrackerDetail } from '../breakdownService';
import {
  breakDownStatusJson,
  helpdeskPrioritiesJson,
} from '../../commonComponents/utils/util';
import actionCodes from '../data/actionCodes.json';
import {
  resetUpdateParts,
} from '../../workorders/workorderService';
import SlaMatrix from './slaMatrix';

const appModels = require('../../util/appModels').default;

// const faIcons = {
//   ESCALATETICKET: escalate,
//   ESCALATETICKETACTIVE: escalate,
//   REASSIGNTICKET: reassign,
//   REASSIGNTICKETACTIVE: reassign,
//   SENDMESSAGE: message,
//   SENDMESSAGEACTIVE: message,
//   CLOSETICKET: closeIcon,
//   CLOSETICKETACTIVE: closeIcon,
//   OPENWORKORDER: workorders,
//   OPENWORKORDERACTIVE: workorders,
//   STARTASSESSMENT: workorders,
//   STARTASSESSMENTACTIVE: workorders,
//   FINISHASSESSMENT: workorders,
//   FINISHASSESSMENTACTIVE: workorders,
//   STARTREMEDIATION: workorders,
//   STARTREMEDIATIONACTIVE: workorders,
//   FINISHREMEDIATION: workorders,
//   FINISHREMEDIATIONACTIVE: workorders,
//   ONHOLDTICKET: holdIcon,
//   ONHOLDTICKETACTIVE: holdIcon,
//   SHARETICKET: shareIcon,
//   SHARETICKETACTIVE: shareIcon,
//   PROGRESSTICKET: reassign,
//   PROGRESSTICKETACTIVE: reassign,
//   PRINTPDFA: holdIcon,
//   PRINTPDFAACTIVE: holdIcon,
//   PRINTPDFB: holdIcon,
//   PRINTPDFBACTIVE: holdIcon,
//   PRINTPDFAB: holdIcon,
//   PRINTPDFABACTIVE: holdIcon,
// };

const TicketDetails = ({
  onViewEditReset,
  isDashboard,
  offset,
  // editId,
  // setEditId,
  isIncident,
  setViewModal,
  setParentTicket,
  setCurrentTicket,
}) => {
  const {
    trackerDetails,
    btConfigInfo,
  } = useSelector((state) => state.bmsAlarms);
  const { surveyStatus } = useSelector((state) => state.survey);
  const defaultActionText = 'Breakdown Actions';

  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { printReportInfo } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;
  const isCritical = configData && configData.criticality;

  const companies = getAllCompanies(userInfo);

  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);

  const tabs = ['BMS Alarms Overview', 'Status Logs', 'Notes', 'Attachments', 'Escalation Matrix'];

  const detailedData = trackerDetails && trackerDetails.data && trackerDetails.data.length
    ? trackerDetails.data[0]
    : '';
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const checkTrackerStatus = (val) => (
    <Box>
      {breakDownStatusJson.map(
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

  const checkTicketPriority = (val) => (
    <Box>
      {helpdeskPrioritiesJson.map(
        (priority) => val === priority.priority && (
          <Typography
            sx={{
              color: priority.color,
            }}
          >
            {val}
          </Typography>
        ),
      )}
    </Box>
  );
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isServiceImpacted = detailedData && detailedData.is_service_impacted ? detailedData.is_service_impacted : false;
  const Space = detailedData && detailedData.type_category === 'Space';
  const Equipment = detailedData && detailedData.type_category === 'Equipment';

  const open = Boolean(anchorEl);

  function checkActionAllowedDisabled(actionName) {
    let allowed = true;
    const woId = trackerDetails && trackerDetails.data && trackerDetails.data[0].mro_order_id
      ? trackerDetails.data[0].mro_order_id[0]
      : false;
    const escalateLevel = trackerDetails
      && trackerDetails.data
      && trackerDetails.data[0].current_escalation_level;
    if (escalateLevel !== 'level1' && actionName === 'Escalate Ticket') {
      allowed = false;
    }
    if (actionName === 'Go to Work Orders' && !woId) {
      allowed = false;
    }
    return allowed;
  }

  const switchActionItem = (action) => {
    handleClose();
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };


  const [addLink, setAddLink] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [editId, setEditId] = useState(false);

  const [actionId, setActionId] = useState('');
  const [actionValue, setActionValue] = useState('');

  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');


  useEffect(() => {
    if (tenantUpdateInfo && tenantUpdateInfo.data && detailedData && detailedData.id && isDashboard) {
      dispatch(getTrackerDetail(detailedData.id, appModels.BMSALARMS));
      // dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    }
  }, [tenantUpdateInfo]); 

  const onViewReset = () => {
    setAddLink(false);
    setViewModal(true);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';

    const stateConditonOne = ['In Progress', 'On-Hold', 'Close', 'Cancel'];
    const stateConditonTwo = ['Reopen', 'On-Hold', 'Close', 'Cancel'];
    const stateConditonThree = ['In Progress'];

    if (vrState === 'Open' && stateConditonOne.includes(actionName)) {
      allowed = true;
    }
    if (vrState === 'In Progress' && stateConditonTwo.includes(actionName)) {
      allowed = true;
    }
    if (vrState === 'On Hold' && stateConditonThree.includes(actionName)) {
      allowed = true;
    }
    return allowed;
  };

  const stateCurrent = trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) && trackerDetails.data[0].state ? trackerDetails.data[0].state : false;
  const isEditState = stateCurrent !== 'Closed';

  const closeEditModalWindow = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    showEditModal(false);
  };

  const stageId = detailedData.state ? (detailedData.state) : '';
  const stateName = getDefaultNoValue((detailedData.state));

  const switchStatus = (status, statusName, data) => {
    if (customData && customData.actionTypes && customData.actionTypes[statusName]) {
      setActionText(customData.actionTypes[statusName].text);
      setActionCode(customData.actionTypes[statusName].value);
      setActionMessage(customData.actionTypes[statusName].msg);
      setActionButton(customData.actionTypes[statusName].button);
    }

    handleClose();
    setActionId(status);
    setSelectedActions(statusName);
    setActionValue(statusName);
    showActionModal(true);
  };

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
  };

  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.subject)}
            status={
              detailedData.state
                ? checkTrackerStatus(detailedData.state)
                : '-'
            }
            // subHeader={(
            //   <>
            //     {detailedData.incident_date
            //       && userInfo.data
            //       && userInfo.data.timezone
            //       ? moment
            //         .utc(detailedData.incident_date)
            //         .local()
            //         .tz(userInfo.data.timezone)
            //         .format('yyyy MMM Do, hh:mm A')
            //       : '-'}
            //     {' '}
            //     Title -
            //     {' '}
            //     {truncate(getDefaultNoValue(detailedData.title), '70')}
            //   </>
            // )}
            actionComponent={(
              <Box>
                {allowedOperations.includes(actionCodes['Add Comment']) && (
                  <Comments
                    detailData={trackerDetails}
                    model={appModels.BMSALARMS}
                    messageType="comment"
                    getDetail={getTrackerDetail}
                    setTab={setValue}
                    tab={value}
                  />
                )}
                {trackerDetails
                  && !trackerDetails.loading
                  && isEditState
                  && allowedOperations.includes(actionCodes['Edit Alarm']) && (
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
                      onClick={() => {
                        showEditModal(true);
                        // setEditLink(true);
                        handleClose(false);
                        setEditId(trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) ? trackerDetails.data[0].id : false);
                      }}
                    >
                      Edit
                    </Button>
                )}
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
                  {customData && customData.actionItems.map((actions) => (
                    allowedOperations.includes(actionCodes[actions.displayname]) && (
                      checkActionAllowed(actions.displayname) && (
                      <MenuItem
                        sx={{
                          font: 'normal normal normal 15px Suisse Intl',
                        }}
                        id="switchLocation"
                        key={actions.id}
                        className="pl-2"
                        onClick={() => switchStatus(actions.id, actions.displayname, actions)}
                      >
                        {actions.displayname}
                      </MenuItem>
                      )
                    )))}
                </Menu>
              </Box>
            )}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              height: '100%',
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
                      header: 'Incident Information',
                      leftSideData:
                        [

                          {
                            property: 'Category',
                            value: getDefaultNoValue(extractNameObject(detailedData.category_id, 'name')),
                          },
                          {
                            property: 'Severity',
                            value: getDefaultNoValue(detailedData.severity),
                          },
                        ],
                      rightSideData:
                        [
                          {
                            property: 'Sub Category',
                            value: getDefaultNoValue(extractNameObject(detailedData.sub_category_id, 'name')),
                          },
                          {
                            property: 'Maintenance Team',
                            value: getDefaultNoValue(extractNameObject(detailedData.maintenance_team_id, 'name')),
                          },
                        ],
                    },
                    {
                      header: 'Asset Information',
                      leftSideData: [
                        {
                          property: 'Type',
                          value: getDefaultNoValue(detailedData.type_category),
                        },
                        {
                          property: 'Company',
                          value: getDefaultNoValue(
                            extractNameObject(detailedData.company_id, 'name'),
                          ),
                        },
                      ],
                      rightSideData: [
                        {
                          property: Space ? 'Space' : Equipment ? 'Asset' : false,
                          value: getDefaultNoValue(Space
                            ? extractNameObject(detailedData.space_id, 'path_name') : extractNameObject(detailedData.equipment_id, 'name')),
                        },
                        {
                          property: Equipment ? 'Asset Location' : false,
                          value: getDefaultNoValue(detailedData.equipment_id && detailedData.equipment_id.location_id && detailedData.equipment_id.location_id.path_name ? extractNameObject(detailedData.equipment_id.location_id, 'path_name') : ''),
                        },

                      ],
                    },
                    {
                      header: 'Resolution Information',
                      leftSideData: [
                        {
                          property: 'Planned SLA End Date',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_sla_end_date, userInfo, 'datetime')),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Resolution',
                          value: detailedData.resolution
                            ? (
                              <Tooltip title={detailedData.resolution} placement="bottom">
                                {truncate(detailedData.resolution, '120')}
                              </Tooltip>
                            )
                            : ' - ',
                        },
                      ],
                    },
                    {
                      header: 'Requestor Information',
                      leftSideData: [
                        {
                          property: 'Requested By',
                          value: getDefaultNoValue(detailedData.requested_by),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Generated On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.generated_on, userInfo, 'datetime')),
                        },
                      ],
                    },
                    {
                      header: 'Other Information',
                      leftSideData: [
                        {
                          property: 'Description',
                          value: <p
                            className="text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.description), { USE_PROFILES: { html: true } }) }}
                          />,
                        },
                      ],
                    },
                  ]}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <LogNotes />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <AuditLog ids={trackerDetails.data[0].message_ids} />
                <Divider />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Documents
                  viewId={trackerDetails.data[0].id}
                  ticketNumber={trackerDetails.data[0].name ? trackerDetails.data[0].name : ''}
                  resModel={appModels.BMSALARMS}
                  model={appModels.DOCUMENT}
                />
              </TabPanel>

              <TabPanel value={value} index={4}>
                <SlaMatrix />
              </TabPanel>
            </Box>
            {/* <Box
              sx={{
                width: '25%',
                height: '100%',
                backgroundColor: '#F6F8FA',
              }}
            >
              <DetailViewRightPanel
                panelOneHeader="Title"
                panelOneLabel={getDefaultNoValue(detailedData.title)}
                panelTwoHeader={getDefaultNoValue(
                  extractNameObject(detailedData.space_id, 'path_name'),
                )}
                panelTwoData={[
                  {
                    value: getDefaultNoValue(
                      extractNameObject(detailedData.equipment_id, 'name'),
                    ),
                  },
                ]}
                panelThreeHeader="Incident Information"
                panelThreeData={[
                  {
                    header: 'Status',
                    value:
                      detailedData.state_id
                        ? checkTrackerStatus(extractNameObject(detailedData.state_id, 'name'))
                        : '-',
                  },
                  {
                    header: 'Created on',
                    value: getDefaultNoValue(
                      getCompanyTimezoneDate(
                        detailedData.create_date,
                        userInfo,
                        'datetime',
                      ),
                    ),
                  },
                ]}
              />
            </Box> */}
          </Box>
        </Box>
      )}
      {trackerDetails && trackerDetails.loading && <Loader />}
      {actionModal && (
        <Action
          atFinish={() => {
            showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
          }}
          atCancel={() => {
            showActionModal(false);
          }}
          offset={offset}
          actionId={actionId}
          actionValue={actionValue}
          actionText={actionText}
          actionMethod={actionCode}
          actionMessage={actionMessage}
          actionButton={actionButton}
          detailData={
            trackerDetails
              && trackerDetails.data
              && trackerDetails.data.length > 0
              ? trackerDetails.data[0]
              : false
          }
          actionModal
        />
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Update BMS Alarm"
          imagePath={TrackerCheck}
          onClose={() => {
            showEditModal(false);
            onViewEditReset();
          }}
        />
        <AddAlarm isShow={editModal} editId={editId} closeModal={closeEditModalWindow} />
        {/* <CreateTicketForm
          editIds={editId}
          afterReset={onViewEditReset}
          closeModal={() => setEditLink(false)}
        /> */}
      </Drawer>
      {/* <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName={
            workorderDetails
              && workorderDetails.data
              && workorderDetails.data.length > 0
              ? `${'Work Order'}${' - '}${workorderDetails.data[0].name}`
              : 'Work Order'
          }
          onClose={() => onViewReset()}
        />
        <WorkorderDetails setViewModal={setAddLink} />
      </Drawer> */}
    </>
  );
};
export default TicketDetails;
