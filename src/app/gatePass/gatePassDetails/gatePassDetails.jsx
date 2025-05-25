import { IconButton, Button, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faCheckCircle, faTimesCircle,
  faSignOut, faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import GatepassIcon from '@images/sideNavImages/gatepass_black.svg';

import AuditLog from '../../commonComponents/auditLogs';
import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import SlaMatrix from './slaMatrix';
import StatusLogs from './statusLogs';
import GpAssets from './gpAssets';
import actionCodes from '../data/actionCodes.json';
import {
  gatePassStatusJson,
} from '../../commonComponents/utils/util';
import {
  resetUpdateGatePass,
} from '../gatePassService';
import {
  TabPanel,
  extractNameObject,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';
import AddGatePass from '../addGatePass';

import AssetInfo from './assetInfo';
import Action from './action';
import customData from '../data/customData.json';
import { getCustomButtonName, getCustomGatePassStatusName } from '../utils/utils';
import GatepassReport from './gatePassReport';

const faIcons = {
  REJECT: faTimesCircle,
  RETURNAPPROVE: faEnvelope,
  APPROVE: faCheckCircle,
  RETURN: faCheckCircle,
  EXITED: faSignOut,
  PRINT: faFilePdf,
};

const appModels = require('../../util/appModels').default;

const WorkPermitDetails = ({ offset }) => {
  const {
    gatePassDetails, gatePassConfig,
  } = useSelector((state) => state.gatepass);
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const defaultActionText = 'Gatepass Actions';

  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);

  const [actionModal, showActionModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const detailedData = gatePassDetails && gatePassDetails.data && gatePassDetails.data.length ? gatePassDetails.data[0] : '';
  let tabs = ['Requestor and Bearer Info', 'In/Out Info', 'Escalation Matrix', 'Status Logs', 'Attachments', 'Audit Logs'];
  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  if (detailedData && detailedData.gatepass_type === 'Item') {
    tabs = ['Requestor and Bearer Info', 'Items Info', 'In/Out Info', 'Escalation Matrix', 'Status Logs', 'Attachments', 'Audit Logs'];
  } else if (detailedData && detailedData.gatepass_type === 'Asset') {
    tabs = ['Requestor and Bearer Info', 'Assets Info', 'In/Out Info', 'Escalation Matrix', 'Status Logs', 'Attachments', 'Audit Logs'];
  }

  const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
  const userRole = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
  const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
  const userMail = userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : false;

  function isApproveUser() {
    let res = false;
    if (gpConfig && gpConfig.approval_recipients_ids && gpConfig.approval_recipients_ids.length) {
      const teamData = gpConfig.approval_recipients_ids.filter((item) => item.type === 'Team');
      const userData = gpConfig.approval_recipients_ids.filter((item) => item.type === 'User');
      const roleData = gpConfig.approval_recipients_ids.filter((item) => item.type === 'Role');
      const customMailData = gpConfig.approval_recipients_ids.filter((item) => item.type === 'Custom');
      if (userData && userData.length) {
        const userData1 = gpConfig.approval_recipients_ids.users_ids && gpConfig.approval_recipients_ids.users_ids.length ? gpConfig.approval_recipients_ids.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData && roleData.length) {
        const roleData1 = roleData.filter((item) => item.role_id && item.role_id.id && item.role_id.id === userRole);
        if (roleData1 && roleData1.length) {
          res = true;
        }
      }
      if (customMailData && customMailData.length) {
        const customMailData1 = customMailData.filter((item) => item.user_defined_email_ids && item.user_defined_email_ids.includes(userMail));
        if (customMailData1 && customMailData1.length) {
          res = true;
        }
      }
      if (teamData && teamData.length) {
        const teamMembers = gpConfig.approval_recipients_ids && gpConfig.approval_recipients_ids.team_members ?  gpConfig.approval_recipients_ids.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        })) : [];
        // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    }
    return res;
  }

  function isReturnApproveUser() {
    let res = false;
    if (gpConfig && gpConfig.approval_receiving_recipients_ids && gpConfig.approval_receiving_recipients_ids.length) {
      const teamData = gpConfig.approval_receiving_recipients_ids.filter((item) => item.type === 'Team');
      const userData = gpConfig.approval_receiving_recipients_ids.filter((item) => item.type === 'User');
      const roleData = gpConfig.approval_receiving_recipients_ids.filter((item) => item.type === 'Role');
      const customMailData = gpConfig.approval_receiving_recipients_ids.filter((item) => item.type === 'Custom');
      if (userData && userData.length) {
        const userData1 = gpConfig.approval_recipients_ids.users_ids && gpConfig.approval_recipients_ids.users_ids.length ? gpConfig.approval_recipients_ids.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData && roleData.length) {
        const roleData1 = roleData.filter((item) => item.role_id && item.role_id.id && item.role_id.id === userRole);
        if (roleData1 && roleData1.length) {
          res = true;
        }
      }
      if (customMailData && customMailData.length) {
        const customMailData1 = customMailData.filter((item) => item.user_defined_email_ids && item.user_defined_email_ids.includes(userMail));
        if (customMailData1 && customMailData1.length) {
          res = true;
        }
      }
      if (teamData && teamData.length) {
        const teamMembers = gpConfig.approval_receiving_recipients_ids && gpConfig.approval_receiving_recipients_ids.team_members ? gpConfig.approval_receiving_recipients_ids.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        })) : [];
        // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    }
    return res;
  }

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';

    if (actionName === 'Approve') {
      if (vrState !== 'Created' || !isApproveUser() || !gpConfig.approval_required) {
        allowed = false;
      }
    }
    if (actionName === 'Exit') {
      if (vrState !== 'Approved') {
        allowed = false;
      }
    }
    if (actionName === 'Return') {
      if (vrState !== 'Exited' || detailedData.type !== 'Returnable') {
        allowed = false;
      }
    }
    if (actionName === 'Return Approval') {
      if (vrState !== 'Returned' || !isReturnApproveUser() || !gpConfig.approval_receiving_required || detailedData.type !== 'Returnable') {
        allowed = false;
      }
    }
    if (actionName === 'Reject') {
      if (vrState !== 'Approved' && vrState !== 'Exited') {
        allowed = false;
      }
      if (vrState === 'Exited' && detailedData.type !== 'Returnable') {
        allowed = false;
      }
    }
    if (actionName === 'Print Report') {
      if (vrState === 'Created' || vrState === 'Rejected') {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkGatePassStatus = (val) => (
    <Box>
      {gatePassStatusJson.map(
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
          {getCustomGatePassStatusName(val, gpConfig)}
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
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  const handleAnswerPrint = (htmlId, fileName) => {
    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
    closeAction();
  };

  const switchActionItem = (action) => {
    if (action.displayname !== 'Print Report') {
      setSelectedActions(action.displayname);
      setActionMethod(action.method);
      setActionButton(action.buttonName);
      setActionMsg(action.message);
      setStatusName(action.statusName);
      setSelectedActionImage(action.name);
      showActionModal(true);
    } else {
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      handleAnswerPrint('print-gatepass-report', 'Gatepass Report');
    }
    handleClose();
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeEditWindow = () => {
    showEditModal(false);
    dispatch(resetUpdateGatePass());
  };

  return (
    <>
      {detailedData && (
      <Box>
        <DetailViewHeader
          mainHeader={getDefaultNoValue(extractNameObject(detailedData.requestor_id, 'name'))}
          subHeader={detailedData.gatepass_number}
          status={
                            detailedData.state ? checkGatePassStatus(detailedData.state) : '-'
                        }
          actionComponent={(
            <Box>
              {gatePassDetails
                                    && !gatePassDetails.loading
                                    && allowedOperations.includes(actionCodes['Edit Gate Pass']) && (
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
                                        setEditId(gatePassDetails && (gatePassDetails.data && gatePassDetails.data.length > 0) ? gatePassDetails.data[0].id : false);
                                        showEditModal(true);
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
                  checkActionAllowed(actions.displayname) && (
                  <MenuItem
                    sx={{
                      font: 'normal normal normal 15px Suisse Intl',
                    }}
                    id="switchAction"
                    className="pl-2"
                    key={actions.id}
                    onClick={() => switchActionItem(actions)}
                  >
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faIcons[actions.name]}
                    />
                    {getCustomButtonName(actions.displayname, gpConfig)}
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
                    header: 'Requestor Information',
                    leftSideData: [
                      {
                        property: 'Requestor',
                        value: getDefaultNoValue(extractNameObject(detailedData.requestor_id, 'name')),
                      },
                      {
                        property: 'Type',
                        value: getDefaultNoValue(detailedData.type),
                      },
                      {
                        property: 'Space',
                        value: getDefaultNoValue(detailedData?.space_id?.path_name),
                      },
                      {
                        property: gpConfig && gpConfig.reference_display ? gpConfig.reference_display : 'Reference',
                        value: getDefaultNoValue(detailedData.reference),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Asset / Item',
                        value: getDefaultNoValue(detailedData.gatepass_type),
                      },
                      {
                        property: 'Requested on',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.requested_on, userInfo, 'datetime')),
                      },
                      {
                        property: 'Purpose',
                        value: getDefaultNoValue(detailedData.description),
                      },
                    ],
                  },
                  {
                    header: 'Bearer Information',
                    leftSideData: [
                      {
                        property: 'Name',
                        value: getDefaultNoValue(detailedData.name),
                      },
                      {
                        property: 'Email',
                        value: getDefaultNoValue(detailedData.email),
                      },
                      {
                        property: 'Mobile',
                        value: getDefaultNoValue(detailedData.mobile),
                      },
                    ],
                    rightSideData: [
                      {
                        property: detailedData.type === 'Returnable' ? 'To be Returned on' : false,
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.to_be_returned_on, userInfo, 'datetime')),
                      },
                      {
                        property: 'Vendor',
                        value: getDefaultNoValue(extractNameObject(detailedData.vendor_id, 'name')),
                      },
                    ],
                  },
                  detailedData.type === 'Returnable' && (
                    {
                      header: 'Receiver Information',
                      leftSideData: [
                        {
                          property: 'Name',
                          value: getDefaultNoValue(detailedData.receiver_name),
                        },
                        {
                          property: 'Mobile',
                          value: getDefaultNoValue(detailedData.receiver_mobile),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Email',
                          value: getDefaultNoValue(detailedData.receiver_email),
                        },
                        {
                          property: 'Returned on',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.bearer_return_on, userInfo, 'datetime')),
                        },
                      ],
                    }),
                ]}
              />
            </TabPanel>
            {detailedData && detailedData.gatepass_type === 'Item' && (
            <TabPanel value={value} index={1}>
              <AssetInfo detailData={gatePassDetails} />
            </TabPanel>
            )}
            {detailedData && detailedData.gatepass_type === 'Asset' && (
            <TabPanel value={value} index={1}>
              <GpAssets />
            </TabPanel>
            )}
            <TabPanel value={value} index={detailedData && !detailedData.gatepass_type ? 1 : 2}>
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'Exit Information',
                    leftSideData: [
                      {
                        property: 'Exit Allowed by',
                        value: getDefaultNoValue(extractNameObject(detailedData.exit_allowed_by, 'name')),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Exit on',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.exit_on, userInfo, 'datetime')),
                      },
                    ],
                  },
                  detailedData.type === 'Returnable' && (
                    {
                      header: 'Return Information',
                      leftSideData: [
                        {
                          property: 'Return Allowed by',
                          value: getDefaultNoValue(extractNameObject(detailedData.return_allowed_by, 'name')),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Returned on',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.return_on, userInfo, 'datetime')),
                        },
                      ],
                    }),
                  {
                    header: 'Approve Information',
                    leftSideData: [
                      {
                        property: 'Approved by',
                        value: getDefaultNoValue(extractNameObject(detailedData.approved_by, 'name')),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Approved on',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.approved_on, userInfo, 'datetime')),
                      },
                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={detailedData && !detailedData.gatepass_type ? 2 : 3}>
              <SlaMatrix />
            </TabPanel>
            <TabPanel value={value} index={detailedData && !detailedData.gatepass_type ? 3 : 4}>
              <StatusLogs />
            </TabPanel>
            <TabPanel value={value} index={detailedData && !detailedData.gatepass_type ? 5 : 6}>
              <AuditLog ids={detailedData.message_ids} />
            </TabPanel>
            <TabPanel value={value} index={detailedData && !detailedData.gatepass_type ? 4 : 5}>
              <Documents
                viewId={detailedData.id}
                ticketNumber={detailedData.name}
                resModel={appModels.GATEPASS}
                model={appModels.DOCUMENT}
              />
              <Divider />
            </TabPanel>
          </Box>
          {/* <Box
                            sx={{
                                width: "25%",
                                height: "100%",
                                backgroundColor: "#F6F8FA",
                            }}
                        >
                            <DetailViewRightPanel
                                panelOneHeader="Requestor"
                                panelOneLabel={getDefaultNoValue(detailedData.requestor_id.name)}
                                panelTwoHeader={getDefaultNoValue(detailedData.type)}
                                panelTwoData={[
                                    {
                                        value: detailedData.type === 'Equipment' ? getDefaultNoValue(extractNameObject(detailedData.equipment_id, 'name')) : getDefaultNoValue(extractNameObject(detailedData.space_id, 'path_name'))
                                    },
                                ]}
                                panelThreeHeader="Gatepass Information"
                                panelThreeData={[
                                    {
                                        header: "Status",
                                        value:
                                            detailedData.state
                                                ? checkGatePassStatus(detailedData.state)
                                                : "-",
                                    }
                                ]}
                            />
                        </Box> */}
          {actionModal && (
          <Action
            atFinish={() => closeAction()}
            atCancel={() => closeAction()}
            detailData={detailedData}
            actionModal={actionModal}
            actionButton={actionButton}
            actionMsg={actionMsg}
            offset={offset}
            actionMethod={actionMethod}
            displayName={selectedActions}
            statusName={statusName}
            message={selectedActionImage}
          />
          )}
          <div className="d-none">
            <GatepassReport detailData={detailedData} gpConfig={gpConfig} />
          </div>
          <Drawer
            PaperProps={{
              sx: { width: '70%' },
            }}
            anchor="right"
            open={editModal}
          >
            <DrawerHeader
              headerName="Update Gate Pass"
              imagePath={GatepassIcon}
              onClose={closeEditWindow}
            />
            <AddGatePass editId={editId} closeModal={closeEditWindow} />
          </Drawer>
        </Box>
      </Box>
      )}
      {gatePassDetails && gatePassDetails.loading && <Loader />}
    </>
  );
};
export default WorkPermitDetails;
