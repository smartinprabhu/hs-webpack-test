/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import {
  faCheckCircle, faEdit,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Drawer,
  IconButton,
  Menu,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import { Markup } from 'interweave';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import ticketIcon from '@images/icons/ticketBlue.svg';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  getTicketDetail,
} from '../../helpdesk/ticketService';
import TicketDetail from '../../helpdesk/ticketDetails/ticketDetails';
import {
  auditActionStatusJson,
} from '../../commonComponents/utils/util';
import {
  extractNameObject,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  TabPanel,
  truncateFrontSlashs,
  truncateStars,
} from '../../util/appUtils';
import Action from '../auditDetail/actionNcItems/actions';
import UpdateTicketAction from '../auditDetail/forms/updateTicketAction';
import { getNonConformitieDetails, resetAuditAction } from '../auditService';
import customData from '../data/customData.json';
import {
  getResponseTypeLabel,
  getStateLabel,
} from '../utils/utils';

const appModels = require('../../util/appModels').default;

const faIcons = {
  START: faCheckCircle,
  CANCEL: faTimesCircle,
  CLOSE: faTimesCircle,
  CREATE: faEdit,
};

const AuditDetailInfo = (props) => {
  const { detailData, setDetailModal } = props;
  const defaultActionText = 'Actions';
  const dispatch = useDispatch();
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [actionModal, showActionModal] = useState(false);

  const [actionText, setActionText] = useState('');
  const [actionValue, setActionValue] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const [editModal1, showEditModal1] = useState(false);
  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
  }, [userInfo, viewId]);

  const onView = (id) => {
    setViewId(id);
    setViewModal(true);
  };

  const onViewReset = () => {
    setViewId(0);
    setViewModal(false);
  };

  const {
    printReportInfo,
  } = useSelector((state) => state.purchase);

  const tabs = ['Action Overview'];

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;
  const viewAuditId = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0].id : false;

  const loading = detailData && detailData.loading;

  useEffect(() => {
    if (customData && customData.actionNCTypes && customData.actionNCTypes[selectedActions]) {
      if (selectedActions !== 'Create Ticket') {
        setActionText(customData.actionNCTypes[selectedActions].text);
        setActionValue(customData.actionNCTypes[selectedActions].value);
        setActionMessage(customData.actionNCTypes[selectedActions].msg);
        setActionButton(customData.actionNCTypes[selectedActions].button);
        showActionModal(true);
      } else {
        dispatch(resetAuditAction());
        showEditModal1(true);
      }
    }
  }, [enterAction]);

  const closeEditAudit1 = () => {
    showEditModal1(false);
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setEnterAction(Math.random());
    setAnchorEl(null);
  };

  const checkActionAllowed = (actionName) => {
    const ticket = viewData && viewData.helpdesk_id;
    const state = viewData && viewData.state;
    let allowed = false;
    if (actionName === 'Start' && state !== 'open' && state !== 'done' && state !== 'cancelled') {
      allowed = true;
    } else if (actionName === 'Close' && state !== 'done' && state !== 'cancelled') {
      allowed = true;
    } else if (actionName === 'Cancel' && state !== 'done' && state !== 'cancelled') {
      allowed = true;
    } else if (actionName === 'Create Ticket' && state !== 'done' && state !== 'cancelled' && !ticket.id) {
      allowed = true;
    }
    return allowed;
  };

  const cancelStateChange = () => {
    dispatch(resetAuditAction());
    const viewId2 = detailData && detailData.data ? detailData.data[0].id : '';
    dispatch(getNonConformitieDetails(viewId2, appModels.AUDITACTION));
  };

  const cancelTicketChange = () => {
    dispatch(resetAuditAction());
    const viewId1 = detailData && detailData.data ? detailData.data[0].id : '';
    dispatch(getNonConformitieDetails(viewId1, appModels.AUDITACTION));
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const checkTicketsStatus = (val) => (
    <Box>
      {auditActionStatusJson.map(
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

  return (
    !loading && viewData && (
      <Box>
        <DetailViewHeader
          mainHeader={getDefaultNoValue(getResponseTypeLabel(viewData.type_action))}
          status={
            viewData.state
              ? getDefaultNoValue(checkTicketsStatus(viewData.state))
              : '-'
          }
          subHeader={(
            <>
              {getDefaultNoValue(getCompanyTimezoneDate(viewData.create_date, userInfo, 'datetime'))}
            </>
            )}
          actionComponent={(
            <Box>
              {/* {trackerDetails
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
            )} */}
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
                {customData && customData.actionNCItems.map((actions) => (
                  checkActionAllowed(actions.displayname) && (
                  <MenuItem
                    sx={{
                      font: 'normal normal normal 15px Suisse Intl',
                    }}
                    id="switchLocation"
                    key={actions.id}
                    className="pl-2"
                    onClick={() => switchActionItem(actions)}
                  >
                    <FontAwesomeIcon
                      className="mr-2"
                      color="primary"
                      icon={faIcons[actions.name]}
                    />
                    {actions.displayname}
                  </MenuItem>
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
                    header: 'General Information',
                    leftSideData:
                      [

                        {
                          property: 'Date of Deadline',
                          value: getDefaultNoValue(getCompanyTimezoneDate(viewData.date_deadline, userInfo, 'date')),
                        },
                        {
                          property: 'Responsibe',
                          value: getDefaultNoValue(extractNameObject(viewData.user_id, 'name')),
                        },
                        {
                          property: 'Description',
                          value: <Markup content={truncateFrontSlashs(truncateStars(viewData.description))} />,
                        },
                      ],
                    rightSideData:
                      [
                        {
                          property: 'Audit',
                          value: getDefaultNoValue(extractNameObject(viewData.audit_id, 'name')),
                        },
                        {
                          property: 'Helpdesk',
                          value: viewData.helpdesk_id && !viewData.helpdesk_id.id
                            ? <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(viewData.helpdesk_id, 'ticket_number'))}</span>
                            : (
                              <span className="m-0 p-0 font-weight-700 text-info text-capital cursor-pointer" aria-hidden onClick={() => onView(viewData.helpdesk_id.id)}>
                                {getDefaultNoValue(extractNameObject(viewData.helpdesk_id, 'ticket_number'))}
                              </span>
                            ),
                        },
                      ],
                  },
                ]}
              />
            </TabPanel>
          </Box>
        </Box>
        {actionModal && (
        <Action
          atFinish={() => {
            showActionModal(false); showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
          }}
          atCancel={() => {
            showActionModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          actionText={actionText}
          actionValue={actionValue}
          actionMessage={actionMessage}
          actionButton={actionButton}
          details={viewData}
          auditId={viewData && viewData.audit_id ? viewData.audit_id : false}
          actionModal
        />
        )}
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={editModal1}
        >
          <DrawerHeader
            headerName="Create Ticket"
            imagePath={false}
            onClose={closeEditAudit1}
          />
          <UpdateTicketAction
            isAuditAction
            editId={viewAuditId}
            detailData={viewData}
            atFinish={() => {
              showEditModal1(false); cancelTicketChange(); setSelectedActions(defaultActionText);
            }}
          />
        </Drawer>
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={viewModal}
        >
          <DrawerHeader
            headerName={ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0)
              ? `${'Ticket'}${' - '}${getDefaultNoValue(ticketDetail.data[0].ticket_number)}` : 'Ticket'}
            imagePath={ticketIcon}
            isEditable={false}
            onClose={() => onViewReset()}
            onEdit={false}
            onPrev={false}
            onNext={false}
          />
          <TicketDetail isIncident={false} setViewModal={setViewModal} />
        </Drawer>
      </Box>
    )
  );
};

AuditDetailInfo.propTypes = {
  setDetailModal: PropTypes.func.isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default AuditDetailInfo;
