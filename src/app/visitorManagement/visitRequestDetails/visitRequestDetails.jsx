import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import {
  IconButton, Typography, Button, Divider, Menu,
} from '@mui/material';

import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle, faWindowClose, faCheck, faArrowCircleRight, faDownload,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import Drawer from '@mui/material/Drawer';
import VmsBlack from '@images/sideNavImages/vms_black.svg';
import userImage from '@images/userProfile.jpeg';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getDefaultNoValue,
  getListOfOperations,
  extractTextObject,
  getCompanyTimezoneDate,
  getLocalDateCustom,
  TabPanel,
} from '../../util/appUtils';
import AuditLog from '../../commonComponents/auditLogs';
import Documents from '../../commonComponents/documents';
import StatusLogs from '../visitRequestDetail/statusLogs';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import AssetInfo from '../visitRequestDetail/AssetInfo';
import CheckList from '../visitRequestDetail/checkList';
import {
  visitorStatusJson,
  detailViewHeaderClass,
} from '../../commonComponents/utils/util';
import {
  getAssetDetails,
  resetVisitState, getVisitorRequestDetail,
} from '../visitorManagementService';
import {
  getReadings, resetReadings,
} from '../../assets/equipmentService';
import customData from '../data/customData.json';
import actionCodes from '../data/actionCodes.json';

import Action from '../visitRequestDetail/actionItems/actionVisitRequest';
import AddVisitRequest from '../addVisitRequest';
import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  resetUpdateTenant,
} from '../../adminSetup/setupService';

const appModels = require('../../util/appModels').default;

const faIcons = {
  APPROVED: faCheckCircle,
  APPROVEDACTIVE: faCheckCircle,
  CHECKIN: faCheck,
  CHECKINACTIVE: faCheck,
  CHECKOUT: faArrowCircleRight,
  CHECKOUTACTIVE: faArrowCircleRight,
  CANCELLED: faTimesCircle,
  CANCELLEDACTIVE: faTimesCircle,
  REJECTED: faWindowClose,
  REJECTEDACTIVE: faWindowClose,
};

const visitRequestDetail = () => {
  const dispatch = useDispatch();
  const tabs = ['Visit Request Overview', 'Feedback Check List', 'Audit Logs', 'Status Logs', 'Attachments'];

  const { visitorRequestDetails, visitorConfiguration } = useSelector((state) => state.visitorManagement);
  const {
    assetDetails,
  } = useSelector((state) => state.visitorManagement);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(false);
  const [change, setChange] = useState(false);
  const [nameKeyword, setNameKeyword] = useState('');
  const [partsData, setPartsData] = useState([]);
  const [selectedImage, showSelectedImage] = useState(false);
  const [modal, setModal] = useState(false);
  const { assetReadings } = useSelector((state) => state.equipment);

  const additionalFields = assetReadings && assetReadings.data && assetReadings.data.length ? assetReadings.data : false;

  useEffect(() => {
    if (visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length && visitorRequestDetails.data.length > 0 && visitorRequestDetails.data[0].additional_fields_ids && visitorRequestDetails.data[0].additional_fields_ids.length && visitorRequestDetails.data[0].additional_fields_ids.length > 0) {
      const fields = ['id', 'name', 'value'];
      const ids = visitorRequestDetails.data[0].additional_fields_ids;
      dispatch(getReadings(ids, appModels.VISITADDITIONALFIELDS, false, false, fields));
    }
  }, [visitorRequestDetails]);

  const toggle = () => {
    showSelectedImage(false);
    setModal(!modal);
  };

  const toggleImage = (image) => {
    showSelectedImage(image);
    setModal(!modal);
  };

  const documentDownload = (datas, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:image/png;base64,${encodeURIComponent(datas)}`);
    element.setAttribute('download', filename);
    element.setAttribute('id', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  const open = Boolean(anchorEl);

  const detailedData = visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length ? visitorRequestDetails.data[0] : false;
  // const extendTime = detailedData && detailedData.planned_in ? new Date(getCompanyTimezoneDate(detailedData.planned_in, userInfo, 'datetime')) : false;
  // const extendDateTime = extendTime ? extendTime.setMinutes(extendTime.getMinutes() + 30) : false;
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  // const isCheckIn = detailedData && detailedData.planned_in && extendDateTime
  //       && ((new Date(getCompanyTimezoneDate(detailedData.planned_in, userInfo, 'datetime')) < new Date()) && (new Date() < new Date(extendDateTime)));

  const viewData = detailedData;

  const plannedIn = viewData && viewData.planned_in ? getLocalDateCustom(viewData.planned_in, 'YYYY-MM-DD HH:mm:ss') : false;
  const plannedOut = viewData && viewData.planned_out ? getLocalDateCustom(viewData.planned_out, 'YYYY-MM-DD HH:mm:ss') : false;
  const extendTime = plannedIn ? new Date(plannedIn) : false;
  const extendDateTime = extendTime ? extendTime.setMinutes(extendTime.getMinutes() + 30) : false;

  const isCheckIn = viewData.planned_in && viewData.planned_out && ((new Date(plannedIn) < new Date()) && (new Date(plannedOut) > new Date()));

  const isCheckOut = viewData.planned_out && (new Date(getCompanyTimezoneDate(viewData.planned_out, userInfo, 'datetime')) >= new Date());

  useEffect(() => {
    if (detailedData) {
      const ids = detailedData.visitor_assets_ids && detailedData.visitor_assets_ids && detailedData.visitor_assets_ids.length && detailedData.visitor_assets_ids;
      dispatch(getAssetDetails(appModels.ASSETDETAILS, ids, false));
    } else {
      dispatch(resetReadings());
    }
  }, [visitorRequestDetails]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData.state;
    const entryState = detailedData.entry_status;
    const { reason } = detailedData;

    const cancelInvisibleState = ['To Approve', 'Approved'];
    const rejectInvisibleState = ['To Approve'];
    const checkInvisibleState = ['To Approve', 'Cancelled', 'Rejected'];

    if (actionName === 'Approve') {
      if (vrState !== 'To Approve' || entryState === 'Checkout' || entryState === 'Checkin' || entryState === 'time_elapsed') {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if ((!cancelInvisibleState.includes(vrState) || entryState === 'Checkout') || (entryState === 'time_elapsed' && vrState === 'To Approve')) {
        allowed = false;
      }
    }
    if (actionName === 'Reject') {
      if ((!rejectInvisibleState.includes(vrState) || entryState === 'Checkout') || entryState === 'time_elapsed') {
        allowed = false;
      }
    }
    if (actionName === 'Check In') {
      if (entryState !== 'Invited' || (checkInvisibleState.includes(vrState)) || !isCheckIn) {
        allowed = false;
      }
    }
    if (actionName === 'Check Out') {
      if ((entryState !== 'Checkin') && (entryState !== 'time_elapsed' || vrState === 'To Approve' || reason !== 'Not Checked Out')) {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkVisitStatus = (val) => (
    <Box>
      {visitorStatusJson.map((status) => val === status.status && (
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
      ))}
    </Box>
  );
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
    handleClose();
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setEnterAction(Math.random());
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const cancelStateChange = () => {
    dispatch(resetVisitState());
    dispatch(getVisitorRequestDetail(detailedData.id, appModels.VISITREQUEST));
  };

  const closeEditModalWindow = () => {
    dispatch(getVisitorRequestDetail(detailedData.id, appModels.VISITREQUEST));
    dispatch(resetUpdateTenant());
    setEdit(false);
    setEditId(false);
  };

  const getDefaultNoValueData = (value) => {
    if (!value) return '-';
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value.replace(/'/g, '"'));
        if (parsedValue.label) return parsedValue.label;
      } catch (e) {
        return value;
      }
    }

    return value;
  };

  const additionalInfo = (details) => {
    if (!details || details.length === 0) return { header: 'Additional Information', leftSideData: [], rightSideData: [] };

    const midpoint = Math.ceil(details.length / 2);

    return {
      header: 'Additional Information',
      leftSideData: details.slice(0, midpoint).map((item) => ({
        property: item.name,
        value: getDefaultNoValueData(item.value),
      })),
      rightSideData: details.slice(midpoint).map((item) => ({
        property: item.name,
        value: getDefaultNoValueData(item.value),
      })),
    };
  };

  return (
    <>
      {detailedData && (
      <>
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.name)}
            status={
                                detailedData.entry_status ? checkVisitStatus(detailedData.entry_status)
                                  : '-'
                            }
            subHeader={(
              <>
                Type -
                {' '}
                {getDefaultNoValue(detailedData.type_of_visitor)}
                ,
                Visit For -
                {' '}
                {getDefaultNoValue(detailedData.visit_for)}
                ,
                Created on -
                {' '}
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
            actionComponent={(
              <Box>
                {visitorRequestDetails
                                        && !visitorRequestDetails.loading
                                        && visitorRequestDetails.data
                                        && visitorRequestDetails.data.length > 0
                                        && visitorRequestDetails.data[0].entry_status
                                        && visitorRequestDetails.data[0].entry_status.length > 0
                                        && allowedOperations.includes(actionCodes['Edit Visit Request']) && (
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
                                            setEdit(true);
                                            setEditId(detailedData.id);
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
                      ))))}
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
                      header: 'Visitor Information',
                      leftSideData:
                                                    [
                                                      {
                                                        property: 'Name',
                                                        value: getDefaultNoValue(detailedData.visitor_name),
                                                      },
                                                      {
                                                        property: 'Phone',
                                                        value: getDefaultNoValue(detailedData.phone),
                                                      },
                                                      {
                                                        property: 'Visitor Company',
                                                        value: getDefaultNoValue(detailedData.organization),
                                                      },
                                                      {
                                                        property: 'ID Proof Number',
                                                        value: getDefaultNoValue(detailedData.Visitor_id_details),
                                                      },
                                                    ],
                      rightSideData:
                                                    [

                                                      {
                                                        property: 'Photo',
                                                        value: detailedData.image_medium
                                                          ? (
                                                            <img
                                                              src={detailedData.image_medium ? `data:image/png;base64,${detailedData.image_medium}` : userImage}
                                                              alt="visitor_image"
                                                              className="mr-2 cursor-pointer"
                                                              width="35"
                                                              height="35"
                                                              aria-hidden="true"
                                                              onClick={() => toggleImage(detailedData.image_medium ? `data:image/png;base64,${detailedData.image_medium}` : userImage)}
                                                            />
                                                          ) : ' - ',
                                                      },
                                                      {
                                                        property: 'Email',
                                                        value: getDefaultNoValue(detailedData.email),
                                                      }, {
                                                        property: 'ID Proof',
                                                        value: getDefaultNoValue(extractTextObject(detailedData.id_proof)),
                                                      },

                                                      {
                                                        property: 'Attachment',
                                                        value: detailedData.attachment
                                                          ? (
                                                            <>
                                                              <img
                                                                src={detailedData.attachment ? `data:image/png;base64,${detailedData.attachment}` : ''}
                                                                alt="attachment"
                                                                className="mr-2 cursor-pointer"
                                                                width="35"
                                                                height="35"
                                                                aria-hidden="true"
                                                                onClick={() => toggleImage(detailedData.attachment ? `data:image/png;base64,${detailedData.attachment}` : '')}
                                                              />
                                                              <FontAwesomeIcon
                                                                className="cursor-pointer"
                                                                icon={faDownload}
                                                                onClick={() => documentDownload(detailedData.attachment, `${detailedData.visitor_name} ${extractTextObject(detailedData.id_proof)}`)}
                                                              />
                                                            </>
                                                          ) : ' - ',
                                                      },

                                                    ],
                    },
                    {
                      header: 'Employee Information',
                      leftSideData:
                                                    [
                                                      {
                                                        property: 'Name',
                                                        value: getDefaultNoValue(extractTextObject(detailedData.employee_id)),
                                                      },
                                                      {
                                                        property: 'Phone',
                                                        value: getDefaultNoValue(detailedData.employee_phone),
                                                      },
                                                      {
                                                        property: 'Host Name',
                                                        value: getDefaultNoValue(detailedData.host_name),
                                                      },
                                                    ],
                      rightSideData:
                                                    [
                                                      {
                                                        property: 'Photo',
                                                        value: detailedData.employee_image
                                                          ? (
                                                            <img
                                                              src={detailedData.employee_image ? `data:image/png;base64,${detailedData.employee_image}` : ''}
                                                              alt="employee_image"
                                                              className="mr-2 cursor-pointer"
                                                              width="35"
                                                              height="35"
                                                              aria-hidden="true"
                                                              onClick={() => toggleImage(detailedData.employee_image)}
                                                            />
                                                          )
                                                          : ' - ',
                                                      },
                                                      {
                                                        property: 'Email',
                                                        value: getDefaultNoValue(detailedData.employee_email),
                                                      },
                                                      {
                                                        property: 'Host Email',
                                                        value: getDefaultNoValue(detailedData.host_email),
                                                      },
                                                    ],
                    },
                    {
                      header: 'Visit Information',
                      leftSideData:
                                                    [
                                                      {
                                                        property: 'Planned In',
                                                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_in, userInfo, 'datetime')),
                                                      },
                                                      {
                                                        property: 'Space',
                                                        value: getDefaultNoValue(extractTextObject(detailedData.space_id)),
                                                      },
                                                      {
                                                        property: 'Visitor Badge',
                                                        value: getDefaultNoValue(detailedData.visitor_badge),
                                                      },
                                                    ],
                      rightSideData:
                                                    [
                                                      {
                                                        property: 'Planned Out',
                                                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_out, userInfo, 'datetime')),
                                                      },
                                                      {
                                                        property: 'Purpose',
                                                        value: getDefaultNoValue(detailedData.purpose),
                                                      },
                                                      {
                                                        property: 'Visiting Company',
                                                        value: getDefaultNoValue(extractTextObject(detailedData.tenant_id)),
                                                      },
                                                    ],
                    },
                    {
                      header: 'Status Information',
                      leftSideData:
                                                    [
                                                      {
                                                        property: 'Actual In',
                                                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.actual_in, userInfo, 'datetime')),
                                                      },
                                                      {
                                                        property: 'Allow Multiple Entry',
                                                        value: getDefaultNoValue(extractTextObject(detailedData.space_id)),
                                                      },
                                                      {
                                                        property: 'Origin',
                                                        value: getDefaultNoValue(detailedData.visitor_badge),
                                                      },
                                                      {
                                                        property: detailedData.entry_status === 'time_elapsed' && 'Reason',
                                                        value: getDefaultNoValue(detailedData.Reason),
                                                      },
                                                    ],
                      rightSideData:
                                                    [
                                                      {
                                                        property: 'Actual Out',
                                                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.actual_out, userInfo, 'datetime')),
                                                      },
                                                      {
                                                        property: 'Approval Status',
                                                        value: getDefaultNoValue(extractTextObject(detailedData.state)),
                                                      },
                                                      {
                                                        property: detailedData.time_elapsed_reason && 'Time Elapsed Reason',
                                                        value: getDefaultNoValue(detailedData.visitor_badge),
                                                      },
                                                      {
                                                        property: detailedData.state === 'Rejected' && 'Rejected Reason',
                                                        value: getDefaultNoValue(detailedData.rejected_reason),
                                                      },
                                                    ],
                    },
                    additionalFields ? additionalInfo(additionalFields) : '',
                  ]}
                />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Asset Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    font: 'normal normal medium 20px/24px Suisse Intl',
                  }}
                >
                  <AssetInfo detailData={visitorRequestDetails} assetDetails={assetDetails} />
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Box
                  sx={{
                    font: 'normal normal medium 20px/24px Suisse Intl',
                  }}
                >
                  <CheckList detailData={visitorRequestDetails} />
                </Box>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <AuditLog ids={detailedData.message_ids} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <StatusLogs />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Documents
                  viewId={detailedData.id}
                  reference={
                                            detailedData.name
                                        }
                  resModel={appModels.VISITREQUEST}
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
                                    panelOneHeader="Name"
                                    panelOneLabel={getDefaultNoValue(detailedData.visitor_name)}
                                    panelOneValue1={getDefaultNoValue(detailedData.type_of_visitor)}
                                    panelTwoHeader="Visit For"
                                    panelTwoData={[
                                        {
                                            value: getDefaultNoValue(detailedData.visit_for)
                                        },
                                    ]}
                                    panelThreeHeader="Visitor Information"
                                    panelThreeData={[
                                        {
                                            header: "Entry Status",
                                            value:
                                                detailedData.entry_status ? checkVisitStatus(detailedData.entry_status) : "-",
                                        }]}
                                />
                            </Box> */}
          </Box>
        </Box>

        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={isEdit}
        >

          <DrawerHeader
            headerName="Update Visit request"
            imagePath={VmsBlack}
            onClose={() => {
              setEdit(false);
              setEditId(false);
            }}
          />
          <AddVisitRequest
            editId={editId}
            afterReset={() => closeEditModalWindow()}
            closeModal={() => { setEdit(false); setChange(false); setNameKeyword(null); setPartsData([]); }}
            change={change}
            setChange={setChange}
            nameKeyword={nameKeyword}
            setNameKeyword={setNameKeyword}
            partsData={partsData}
            setPartsData={setPartsData}
            visitorConfiguration={visitorConfiguration}
          />
        </Drawer>
        <Dialog maxWidth="md" open={modal}>
          <DialogHeader title={detailedData.visitor_name} onClose={toggle} response={false} imagePath={false} />
          <DialogContent>

            <DialogContentText id="alert-dialog-description">
              {selectedImage
                ? (
                  <img
                    src={selectedImage || ''}
                    alt={detailedData.visitor_name}
                    width="100%"
                    height="100%"
                    aria-hidden="true"
                  />
                )
                : ''}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {actionModal && (
        <Action
          atFinish={() => {
            showActionModal(false); cancelStateChange(); setSelectedActions();
          }}
          atReset={() => {
            showActionModal(false); cancelStateChange(); setSelectedActions();
          }}
          actionText={actionText}
          actionCode={actionCode}
          actionMessage={actionMessage}
          actionButton={actionButton}
          details={visitorRequestDetails}
          actionModal
        />
        )}
      </>
      )}
      {visitorRequestDetails && visitorRequestDetails.loading && <Loader />}

    </>
  );
};
export default visitRequestDetail;
