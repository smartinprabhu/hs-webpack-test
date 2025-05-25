/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import {
  Menu, IconButton, Button, Drawer,
} from '@mui/material';
import moment from 'moment-timezone';

import { BsThreeDotsVertical } from 'react-icons/bs';

import Loader from '@shared/loading';
import CommodityIcon from '@images/sideNavImages/commodityTransactions_black.svg';

import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  tankerStatusJson,
} from '../../../commonComponents/utils/util';
import Action from '../actionItems/action';
import ActionStatus from './action';
import customData from '../../data/customData.json';
import actionCodes from '../../data/actionCodes.json';
import {
  getDefaultNoValue, extractNameObject, getListOfModuleOperations, TabPanel,
  getCompanyTimezoneDate, numToFloatView,
  getColumnArrayById,
} from '../../../util/appUtils';
import {
  getTankerDetails,
  resetTankerState,
} from '../../tankerService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import DetailViewHeader from '../../../commonComponents/detailViewHeader';
import DetailViewTab from '../../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import AuditLog from '../../../commonComponents/auditLogs';
import LogNotes from './logNotes';
import AddTransaction from '../addTransaction';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  TANKERIN: faArrowCircleLeft,
  TANKEROUT: faArrowCircleRight,
  VERIFY: faCheckCircle,
  CANCEL: faTimesCircle,
};

const TankerDetailInfo = (props) => {
  const { detailData, offset, isTanker } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Transaction Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionModal1, showActionModal1] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [actionId, setActionId] = useState('');
  const [actionValue, setActionValue] = useState('');

  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { tankerConfig, updateProductCategoryInfo } = useSelector((state) => state.tanker);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionButton(customData.actionTypes[selectedActions].button);
      showActionModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    dispatch(resetUpdateProductCategory());
    dispatch(resetTankerState());
    handleClose();
  };

  const cancelStateChange = () => {
    dispatch(resetUpdateProductCategory());
    dispatch(resetTankerState());
    const viewId = detailData && detailData.data ? detailData.data[0].id : '';
    dispatch(getTankerDetails(viewId, appModels.TANKERTRANSACTIONS));
  };

  const cancelStateChange1 = () => {
    dispatch(resetUpdateProductCategory());
    dispatch(resetTankerState());
  };

  const onCloseEdit = () => {
    dispatch(getTankerDetails(editId, appModels.TANKERTRANSACTIONS));
    dispatch(resetUpdateProductCategory());
    dispatch(resetTankerState());
    setEditId(false);
    showEditModal(false);
  };

  const checkActionsAvailable = () => {
    let data = true;
    const finalReading = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0].final_reading : false;
    if (finalReading > 0) {
      data = false;
    }
    return data;
  };

  const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
  const userRole = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
  const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
  const userMail = userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : false;

  const tankerConfigData = tankerConfig && tankerConfig.data && tankerConfig.data.length ? tankerConfig.data[0] : false;

  function isApproveUser() {
    let res = false;
    if (tankerConfigData && tankerConfigData.verification_authority_id && tankerConfigData.verification_authority_id.id) {
      const teamData = tankerConfigData.verification_authority_id.type === 'Team';
      const userData = tankerConfigData.verification_authority_id.type === 'User';
      const roleData = tankerConfigData.verification_authority_id.type === 'Role';
      const customMailData = tankerConfigData.verification_authority_id.type === 'Custom';
      if (userData) {
        const userData1 = tankerConfigData.verification_authority_id.users_ids && tankerConfigData.verification_authority_id.users_ids.length ? tankerConfigData.verification_authority_id.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = tankerConfigData.verification_authority_id.role_id && tankerConfigData.verification_authority_id.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = tankerConfigData.verification_authority_id.user_defined_email_ids && tankerConfigData.verification_authority_id.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = tankerConfigData.verification_authority_id.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        }));
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
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';

    if (actionName === 'Tanker In') {
      if (vrState !== 'Draft') {
        allowed = false;
      }
    }
    if (actionName === 'Tanker Out') {
      if (vrState !== 'In Progress') {
        allowed = false;
      }
    }
    if (actionName === 'Verify') {
      if (vrState !== 'Submitted' || !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if (vrState !== 'Submitted' || !isApproveUser()) {
        allowed = false;
      }
    }
    return allowed;
  };

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;
  const detailedData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const isEditable = detailedData && detailedData.is_requires_verification
    ? allowedOperations.includes(actionCodes['Edit Transaction']) && detailedData && detailedData.state !== 'Verified' && detailedData.state !== 'Cancelled'
    : allowedOperations.includes(actionCodes['Edit Transaction']) && detailedData && detailedData.state !== 'Verified' && detailedData.state !== 'Submitted' && detailedData.state !== 'Cancelled';

  const loading = detailData && detailData.loading;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchStatus = (status, statusName, data) => {
    if (customData && customData.actionTypes1 && customData.actionTypes1[statusName]) {
      setActionText(customData.actionTypes1[statusName].text);
      setActionCode(customData.actionTypes1[statusName].value);
      setActionMessage(customData.actionTypes1[statusName].msg);
      setActionButton(customData.actionTypes1[statusName].button);
    }

    handleClose();
    setActionId(status);
    setSelectedActions(statusName);
    setActionValue(statusName);
    dispatch(resetTankerState());
    showActionModal1(true);
  };

  const open = Boolean(anchorEl);
  const tabs = [isTanker ? 'Tanker Overview' : 'Tansaction Overview', 'Status Logs', 'Audit Logs'];
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const checkTankerStatus = (val) => (
    <Box>
      {tankerStatusJson.map(
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

  const tActions = detailedData.is_requires_verification ? (customData && customData.actionItemsVerify) : (customData && customData.actionItems);

  return (
    <>
      {detailData && detailData.loading && <Loader />}
      {detailedData && (
        <>
          <Box>
            <DetailViewHeader
              mainHeader={getDefaultNoValue(detailedData.name)}
              subHeader={(
                <>
                  {detailedData.create_date
                    && userInfo.data
                    && userInfo.data.timezone
                    ? moment
                      .utc(detailedData.create_date)
                      .local()
                      .tz(userInfo.data.timezone)
                      .format('yyyy MMM Do, hh:mm A')
                    : '-'}
                  {' '}
                </>
              )}
              status={
                !isTanker && detailedData.state
                  ? checkTankerStatus(detailedData.state)
                  : ''
              }
              actionComponent={(
                <Box>
                  {isEditable && !isTanker && (
                  <Button
                    type="button"
                    variant="outlined"
                    className="ticket-btn"
                    sx={{
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                    }}
                    onClick={() => {
                      handleClose(false);
                      setEditId(detailedData.id);
                      showEditModal(true);
                      dispatch(resetUpdateProductCategory());
                    }}
                  >
                    Edit
                  </Button>
                  )}
                  {!isTanker ? (
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
                  ) : ''}
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
                    {!isTanker && !detailedData.is_requires_verification && tActions.map((actions) => (
                      allowedOperations.includes(actionCodes[actions.displayname]) && (
                      <MenuItem
                        sx={{
                          font: 'normal normal normal 15px Suisse Intl',
                        }}
                        id="switchAction"
                        className="pl-2"
                        key={actions.id}
                        disabled={!checkActionsAvailable()}
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
                    {!isTanker && detailedData.is_requires_verification && tActions.map((actions) => (
                      checkActionAllowed(actions.displayname) && (
                      <MenuItem
                        sx={{
                          font: 'normal normal normal 15px Suisse Intl',
                        }}
                        id="switchAction"
                        className="pl-2"
                        key={actions.id}
                        disabled={actions.displayname === 'Tanker Out' && !checkActionsAvailable()}
                        onClick={() => (actions.displayname === 'Tanker Out' ? switchActionItem(actions) : switchStatus(actions.id, actions.displayname, actions))}
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
                  {isTanker ? (
                    <DetailViewLeftPanel
                      panelData={[
                        {
                          header: 'Tanker Information',
                          leftSideData:
                            [
                              {
                                property: 'Registration No',
                                value: getDefaultNoValue(detailedData?.name),
                              },
                              {
                                property: 'Commodity',
                                value: getDefaultNoValue(detailedData?.commodity?.name),
                              },
                            ],
                          rightSideData:
                            [
                              {
                                property: 'Capacity',
                                value: getDefaultNoValue(detailedData.capacity),
                              },
                              {
                                property: 'Vendor',
                                value: getDefaultNoValue(detailedData?.vendor_id?.name),
                              },
                            ],
                        },
                      ]}
                    />
                  ) : (
                    <DetailViewLeftPanel
                      panelData={[
                        {
                          header: 'Commodity Information',
                          leftSideData:
                          [
                            {
                              property: 'Commodity',
                              value: getDefaultNoValue(detailedData?.commodity?.name),
                            },
                            {
                              property: 'In Date',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.in_datetime, userInfo, 'datetime')),
                            },
                            {
                              property: 'Initial Reading',
                              value: numToFloatView(detailedData.initial_reading),
                            },
                            {
                              property: 'Difference',
                              value: numToFloatView(detailedData.difference),
                            },
                            {
                              property: 'Remarks',
                              value: <span className="text-break">
                                {getDefaultNoValue(detailedData.remark)}
                                     </span>,
                            },
                          ],
                          rightSideData:
                          [
                            {
                              property: 'Purchase Order',
                              value: getDefaultNoValue(extractNameObject(detailedData.purchase_order, 'name')),
                            },
                            {
                              property: 'Out Date',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.out_datetime, userInfo, 'datetime')),
                            },
                            {
                              property: 'Final Reading',
                              value: numToFloatView(detailedData.final_reading),
                            },
                            {
                              property: detailedData.is_enable_amount ? 'Amount' : '',
                              value: numToFloatView(detailedData.amount),
                            },
                          ],
                        },
                        {
                          header: 'Vendor Information',
                          leftSideData:
                          [
                            {
                              property: 'Vendor',
                              value: getDefaultNoValue(extractNameObject(detailedData.vendor_id, 'name')),
                            },
                            {
                              property: 'Driver',
                              value: getDefaultNoValue(detailedData.driver),
                            },
                          ],
                          rightSideData:
                          [
                            {
                              property: 'Delivery Challan',
                              value: getDefaultNoValue(detailedData.delivery_challan),
                            },
                            {
                              property: 'Driver`s Contact',
                              value: getDefaultNoValue(detailedData.driver_contact),
                            },
                          ],
                        },
                      ]}
                    />
                  )}
                </TabPanel>
                {!isTanker && (
                <TabPanel value={value} index={1}>
                  <LogNotes />
                </TabPanel>
                )}
                {!isTanker && (
                <TabPanel value={value} index={!isTanker ? 2 : 1}>
                  <AuditLog ids={detailedData.message_ids} />
                </TabPanel>
                )}
              </Box>
              {/* <Box
                sx={{
                  width: "25%",
                  height: "100%",
                  backgroundColor: "#F6F8FA",
                }}
              >
                <DetailViewRightPanel
                  panelOneHeader="Location"
                  panelOneLabel={getDefaultNoValue(extractNameObject(detailedData.location_id, 'path_name'))}
                  panelTwoHeader="Capacity"
                  panelTwoData={[
                    {
                      value:
                        <>
                          {getDefaultNoValue(detailedData.capacity)}
                          {' '}
                          {getDefaultNoValue(extractNameObject(detailedData.uom_id, 'name'))}
                        </>
                    }
                  ]}
                />
              </Box> */}
            </Box>
          </Box>
          <Drawer
            PaperProps={{
              sx: { width: '50%' },
            }}
            anchor="right"
            open={editModal}
          >
            <DrawerHeader
              headerName="Update Transaction"
              imagePath={CommodityIcon}
              onClose={() => {
                showEditModal(false); setEditId(false);
              }}
            />
            <AddTransaction selectedUser={detailedData} editData={detailData && (detailData.data && detailData.data.length > 0) ? detailData.data : false} closeModal={onCloseEdit} addModal={false} />
          </Drawer>
          {actionModal && (
            <Action
              atFinish={() => {
                showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              atCancel={() => {
                showActionModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              actionText={actionText}
              actionButton={actionButton}
              details={detailData}
              actionModal
            />
          )}
          {actionModal1 && (
          <ActionStatus
            atFinish={() => {
              showActionModal1(false); cancelStateChange1(); setSelectedActions(defaultActionText);
            }}
            atCancel={() => {
              showActionModal1(false);
            }}
            offset={offset}
            actionId={actionId}
            actionValue={actionValue}
            actionText={actionText}
            actionMethod={actionCode}
            actionMessage={actionMessage}
            actionButton={actionButton}
            detailData={
              detailData
              && detailData.data
              && detailData.data.length > 0
                ? detailData.data[0]
                : false
          }
            actionModal1
          />
          )}
        </>
      )}
    </>
  );
};

TankerDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default TankerDetailInfo;
