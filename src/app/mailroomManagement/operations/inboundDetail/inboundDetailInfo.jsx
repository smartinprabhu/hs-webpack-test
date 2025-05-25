/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStoreAlt,
  faCaretSquareDown, faTag, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  IconButton, Button,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import AuditLog from '../../../commonComponents/auditLogs';

import tabs from './tabs.json';
import {
  getDefaultNoValue, TabPanel, getCompanyTimezoneDate, getListOfModuleOperations, generateErrorMessage, extractNameObject,
} from '../../../util/appUtils';
import {
  resetVisitState,
} from '../../../visitorManagement/visitorManagementService';
import {
  getInboundMailDetails,
} from '../../mailService';
import Action from '../actionItems/actionMailroom';
import customData from '../../data/customData.json';
import actionCodes from '../../data/actionCodes.json';
import { MailStatusJson } from '../../../commonComponents/utils/util';
import DetailViewHeader from '../../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../../commonComponents/detailViewTab';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  resetCreateOrder,
  resetUpdateOrder,
} from '../../../pantryManagement/pantryService';

import AddInbound from '../../addInbound';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  DELIVERED: faCheckCircle,
  ARCHIVED: faStoreAlt,
  SHREDDED: faCaretSquareDown,
  RETURNED: faTag,
};

const InboundDetailInfo = (props) => {
  const { detailData, isEditable } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Inbound Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [actionModal, showActionModal] = useState(false);

  const [editModal, setEditLink] = useState(false);
  const [editId, setEditId] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    updateOrderInfo,
  } = useSelector((state) => state.pantry);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'code');

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      setActionMessage(customData.actionTypes[selectedActions].msg);
      setActionButton(customData.actionTypes[selectedActions].button);
      showActionModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    handleClose();
    setEnterAction(Math.random());
  };

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';
    const returnInvisibleState = ['Registered', 'Archived'];

    if (actionName === 'Deliver') {
      if (vrState !== 'Registered') {
        allowed = false;
      }
    }
    if (actionName === 'Archived') {
      if (vrState !== 'Registered') {
        allowed = false;
      }
    }
    if (actionName === 'Shredded') {
      if (vrState !== 'Archived') {
        allowed = false;
      }
    }
    if (actionName === 'Returned') {
      if (!returnInvisibleState.includes(vrState)) {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkStatus = (val) => (
    <Box>
      {MailStatusJson.map(
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
          {status.text}
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

  const onEditClose = () => {
    setEditId(false);
    setEditLink(false);
    if (updateOrderInfo && updateOrderInfo.data) {
      dispatch(getInboundMailDetails(editId, appModels.MAILINBOUND));
    }
    dispatch(resetUpdateOrder());
    dispatch(resetCreateOrder());
  };

  const checkActionsAvailable = () => {
    let data = false;
    const actions = customData && customData.actionItems;
    for (let i = 0; i < actions.length; i += 1) {
      if (allowedOperations.includes(actionCodes[actions[i].displayname])) {
        if (checkActionAllowed(actions[i].displayname)) {
          data = true;
          break;
        }
      }
    }
    return data;
  };

  const cancelStateChange = () => {
    dispatch(resetVisitState());
    const viewId = detailData && detailData.data ? detailData.data[0].id : '';
    dispatch(getInboundMailDetails(viewId, appModels.MAILINBOUND));
  };

  const detailedData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const loading = detailData && detailData.loading;

  return (
    <>
      {detailedData && (
      <>
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(extractNameObject(detailedData.employee_id, 'name'))}
            status={detailedData.state ? checkStatus(detailedData.state) : '-'}
            actionComponent={(
              <Box>
                {isEditable && (
                <Button
                  type="button"
                  variant="outlined"
                  sx={{
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                  }}
                  className="ticket-btn"
                  onClick={() => {
                    setEditLink(true);
                    handleClose(false);
                    setEditId(detailedData.id);
                  }}
                >
                  Edit
                </Button>
                )}
                {checkActionsAvailable() && (
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
                )}
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
                      </MenuItem>
                      )
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
                tabs={tabs.tabsList}
              />

              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: 'Sender Information',
                      leftSideData: [
                        {
                          property: 'Courier',
                          value: getDefaultNoValue(extractNameObject(detailedData.courier_id, 'name')),
                        },
                        {
                          property: 'Name',
                          value: getDefaultNoValue(detailedData.sender),
                        },
                        {
                          property: 'Shelf',
                          value: getDefaultNoValue(detailedData.shelf),
                        },
                        {
                          property: 'Registered On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.received_on, userInfo, 'datetime')),
                        },
                        {
                          property: 'Notes',
                          value: getDefaultNoValue(detailedData.notes),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Parcel Dimensions',
                          value: getDefaultNoValue(detailedData.parcel_dimensions),
                        },
                        {
                          property: 'Tracking Number',
                          value: getDefaultNoValue(detailedData.tracking_no),
                        },
                        {
                          property: 'Company',
                          value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                        },
                        {
                          property: 'Registered By',
                          value: getDefaultNoValue(extractNameObject(detailedData.received_by, 'name')),
                        },
                      ],
                    },
                    {
                      header: 'Receiver Information',
                      leftSideData: [
                        {
                          property: 'Type',
                          value: getDefaultNoValue(detailedData.recipient),
                        },
                        {
                          property: 'Name',
                          value: getDefaultNoValue(extractNameObject(detailedData.employee_id, 'name')),
                        },
                        {
                          property: 'Delivered On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.collected_on, userInfo, 'datetime')),
                        },
                        detailedData.department_id && detailedData.department_id.length > 0 && {
                          property: 'Department',
                          value: getDefaultNoValue(extractNameObject(detailedData.department_id, 'display_name')),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'ID',
                          value: getDefaultNoValue(extractNameObject(detailedData.employee_id, 'employee_id_seq')),
                        },
                        {
                          property: 'Email',
                          value: getDefaultNoValue(extractNameObject(detailedData.employee_id, 'work_email')),
                        },
                        {
                          property: 'Delivered By',
                          value: getDefaultNoValue(extractNameObject(detailedData.collected_by, 'name')),
                        },
                      ],
                    },
                  ]}
                />

              </TabPanel>
              <TabPanel value={value} index={1}>
                <AuditLog ids={detailedData.message_ids} />
              </TabPanel>
            </Box>

          </Box>
        </Box>
        {actionModal && (
        <Action
          atFinish={() => {
            showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          atCancel={() => {
            showActionModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          actionMessage={actionMessage}
          actionButton={actionButton}
          details={detailData}
          modelName={appModels.MAILINBOUND}
          isOutbound={false}
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
            headerName="Update Inbound Mail"
            onClose={onEditClose}
          />
          <AddInbound editId={editId} closeModal={() => onEditClose()} />
        </Drawer>

      </>
      )}
      {loading && <Loader />}
      {
      detailData && detailData.err && (
        <ErrorContent errorTxt={generateErrorMessage(detailData)} />
      )
    }
    </>
  );
};

InboundDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default InboundDetailInfo;
