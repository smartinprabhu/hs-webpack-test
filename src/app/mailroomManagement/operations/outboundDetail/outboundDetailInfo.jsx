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
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import DialogHeader from '../../../commonComponents/dialogHeader';
import AuditLog from '../../../commonComponents/auditLogs';

import {
  getDefaultNoValue, TabPanel, getCompanyTimezoneDate, getListOfModuleOperations, generateErrorMessage, extractNameObject,
} from '../../../util/appUtils';
import {
  resetVisitState,
} from '../../../visitorManagement/visitorManagementService';
import {
  getOutboundMailDetails,
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

import AddOutbound from '../../addOutbound';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  DELIVERED: faCheckCircle,
  ARCHIVED: faStoreAlt,
  SHREDDED: faCaretSquareDown,
  RETURNED: faTag,
};

const OutboundDetailInfo = (props) => {
  const { detailData, isEditable } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Outbound Actions';
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

  const [selectedImage, showSelectedImage] = useState(false);
  const [modal, setModal] = useState(false);

  const toggleImage = (image) => {
    showSelectedImage(image);
    setModal(!modal);
  };

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

  const tabs = ['Outbound Mail Overview', 'History'];

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
      dispatch(getOutboundMailDetails(editId, appModels.MAILOUTBOUND));
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
    dispatch(getOutboundMailDetails(viewId, appModels.MAILOUTBOUND));
  };

  const detailedData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const loading = detailData && detailData.loading;

  return (
    <>
      {detailedData && (
      <>
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.sent_to)}
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
                    allowedOperations.includes(actionCodes[actions.displaynameOutBound]) && (
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
                tabs={tabs}
              />

              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: 'Sender Information',
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
                          property: 'Shelf',
                          value: getDefaultNoValue(detailedData.shelf),
                        },
                        {
                          property: 'Registered On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.sent_on, userInfo, 'datetime')),
                        },
                        {
                          property: 'Notes',
                          value: getDefaultNoValue(detailedData.notes),
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
                          property: 'Parcel Dimensions',
                          value: getDefaultNoValue(detailedData.parcel_dimensions),
                        },
                        {
                          property: 'Registered By',
                          value: getDefaultNoValue(extractNameObject(detailedData.sent_by, 'name')),
                        },
                        detailedData.department_id && detailedData.department_id.length > 0 && {
                          property: 'Department',
                          value: getDefaultNoValue(extractNameObject(detailedData.department_id, 'display_name')),
                        },
                      ],
                    },
                    {
                      header: 'Receiver Information',
                      leftSideData: [
                        {
                          property: 'Name',
                          value: getDefaultNoValue(detailedData.sent_to),
                        },
                        {
                          property: 'Delivered On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.delivered_on, userInfo, 'datetime')),
                        },
                        {
                          property: 'Courier',
                          value: getDefaultNoValue(extractNameObject(detailedData.courier_id, 'name')),
                        },
                        {
                          property: 'Agent Name',
                          value: getDefaultNoValue(detailedData.agent_name),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Address',
                          value: getDefaultNoValue(detailedData.address),
                        },
                        {
                          property: 'Delivered By',
                          value: getDefaultNoValue(extractNameObject(detailedData.delivered_by, 'name')),
                        },
                        {
                          property: 'Tracking Number',
                          value: getDefaultNoValue(detailedData.tracking_no),
                        },
                        {
                          property: 'Signature',
                          value: (<span>
                            {' '}
                            {detailedData.signature
                              ? (
                                <img
                                  src={detailedData.signature ? `data:image/png;base64,${detailedData.signature}` : ''}
                                  alt="employee_image"
                                  className="mr-2 cursor-pointer"
                                  width="45"
                                  height="45"
                                  aria-hidden="true"
                                  onClick={() => toggleImage(detailedData.signature ? `data:image/png;base64,${detailedData.signature}` : '')}
                                />
                              ) : '' }
                            {' '}

                                  </span>),
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
          modelName={appModels.MAILOUTBOUND}
          isOutbound
          actionModal
        />
        )}
        <Dialog size="lg" fullWidth open={modal}>
          <DialogHeader title={detailedData.agent_name} imagePath={false} onClose={toggleImage} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {selectedImage
                ? (
                  <img
                    src={selectedImage || ''}
                    alt={detailedData.agent_name}
                    width="100%"
                    height="100%"
                    aria-hidden="true"
                  />
                )
                : ''}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={editModal}
        >
          <DrawerHeader
            headerName="Update Outbound Mail"
            onClose={onEditClose}
          />
          <AddOutbound editId={editId} closeModal={() => onEditClose()} />
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

OutboundDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default OutboundDetailInfo;
