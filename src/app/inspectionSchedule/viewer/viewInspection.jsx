/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  Modal,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import {
  IconButton, Button, Menu, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode, faDownload,
} from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode.react';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import performChecklistBlue from '@images/icons/performChecklistBlue.svg';
import workOrdersBlue from '@images/icons/workOrders.svg';
import workOrdersBlack from '@images/sideNavImages/workorder_black.svg';

import {
  generateErrorMessage,
  getDefaultNoValue,
  getListOfModuleOperations,
  downloadQr,
  TabPanel,
  getCompanyTimezoneDate,
  extractNameObject ,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import InspectionIcon from '@images/sideNavImages/inspection_black.svg';
import { getOrderData, getInspectionSchedulertDetail } from '../inspectionService';
import {
  resetEscalate,
  getOrderDetail,
} from '../../workorders/workorderService';
import {
  resetCancelReq,
} from '../../preventiveMaintenance/ppmService';
import ReviewWorkorder from './reviewWorkorder';
import actionCodes from '../data/actionCodes.json';
import OrderDetail from '../../workorders/workorderDetails/workorderDetails';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import Checklists from './checklists';
import MissedChecklists from './missedChecklists';
import { getWorkOrderStateLabelNew, getWorkOrderStateLabel } from '../../workorders/utils/utils';
import { inspectionStatusLogJson } from '../../commonComponents/utils/util';
import DialogHeader from '../../commonComponents/dialogHeader';
import InspectionCancelRequest from './inspectionCancelRequest';
import SchedulerDetail from '../inspectionDetails/inspectionDetails';

const appModels = require('../../util/appModels').default;

const faIcons = {
  REVIEW: performChecklistBlue,
  REVIEWACTIVE: performChecklistBlue,
  WORKORDER: workOrdersBlue,
  WORKORDERACTIVE: workOrdersBlue,
};

const ViewInspection = (props) => {
  const {
    atFinish, eventDetailModel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(eventDetailModel);
  const [reviewModal, showReviewModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [parentSchedule, setParentScheduleViewModal] = useState(false);
  const [parentScheduleId, setParentScheduleId] = useState(false);
  const {
    inspectionChecklistDetail,
    inspectionOrderInfo,
    inspectionCommenceInfo,
    inspectionSchedulerDetail,
  } = useSelector((state) => state.inspection);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const configData = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length ? inspectionCommenceInfo.data[0] : false;

  const defaultActionText = 'Inspection Actions';

  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [value, setValue] = useState(0);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const loading = inspectionChecklistDetail && inspectionChecklistDetail.loading;
  const isErr = ((inspectionChecklistDetail && inspectionChecklistDetail.err) || (inspectionChecklistDetail && inspectionChecklistDetail.data && !inspectionChecklistDetail.data.length));
  const inspDeata = inspectionChecklistDetail && inspectionChecklistDetail.data && inspectionChecklistDetail.data.data
    && inspectionChecklistDetail.data.data.length ? inspectionChecklistDetail.data.data[0] : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');

  const isReViewable = allowedOperations.includes(actionCodes['Review Inspection Schedule']);

  const canCreate = allowedOperations.includes(actionCodes['Create Cancel Request']);

  const orderData = inspectionOrderInfo && inspectionOrderInfo.data && inspectionOrderInfo.data.length ? inspectionOrderInfo.data[0] : false;

  useEffect(() => {
    dispatch(resetEscalate());
  }, []);

  useEffect(() => {
    if (parentScheduleId) {
      dispatch(getInspectionSchedulertDetail(parentScheduleId, appModels.INSPECTIONCHECKLIST, 'warehouse'));
    }
  }, [parentScheduleId]);

  useEffect(() => {
    if (inspDeata && inspDeata.id) {
      dispatch(getOrderData(inspDeata.id, appModels.ORDER));
      setValue(0);
    }
  }, [inspectionChecklistDetail]);

  /* const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }; */

  useEffect(() => {
    dispatch(resetEscalate());
    if (selectedActions === 'Review Work order') {
      showReviewModal(true);
    }
    if (selectedActions === 'Go to Work order') {
      if (orderData && orderData.id) {
        dispatch(getOrderDetail(orderData.id, appModels.ORDER));
        setAddLink(true);
        setModal(false);
      }
    }
    if (selectedActions === 'Cancel Inspection Schedule') {
      showCancelModal(true);
    }
  }, [enterAction]);

  function checkActionAllowed(actionName) {
    let allowed = false;
    const oId = orderData && orderData.id ? orderData.id : false;
    const status = inspDeata && inspDeata.state ? inspDeata.state : false;
    const rId = inspDeata && inspDeata.reviewed_by ? inspDeata.reviewed_by : false;
    if (actionName === 'Go to Work order' && oId) {
      allowed = true;
    }
    if (actionName === 'Review Work order' && (status === 'Completed') && oId && !rId) {
      allowed = true;
    }
    return allowed;
  }

  function checkActionDisabled(actionName) {
    let allowed = false;
    const oId = orderData && orderData.id ? orderData.id : false;
    const status = inspDeata && inspDeata.state ? inspDeata.state : false;
    const rId = inspDeata && inspDeata.reviewed_by ? inspDeata.reviewed_by : false;
    if (actionName === 'Go to Work order' && oId) {
      allowed = true;
    }
    if (actionName === 'Review Work order' && (status === 'Completed') && oId && !rId) {
      allowed = true;
    }
    if (actionName === 'Cancel Inspection Schedule' && canCreate && configData.is_can_cancel && (status === 'Upcoming' || status === 'Missed')) {
      allowed = true;
    }
    return allowed;
  }

  const toggle = () => {
    setModal(!modal);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    atFinish();
  };

  const openWorkOrder = () => {
    if (orderData && orderData.id) {
      dispatch(getOrderDetail(orderData.id, appModels.ORDER));
      setAddLink(true);
      setModal(false);
    }
  };

  const closeWorkOrder = () => {
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setAddLink(false);
    setModal(true);
  };

  const switchActionItem = (action) => {
    handleClose();
    dispatch(resetCancelReq());
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const actionDefaultItems = customData && customData.actionItems ? customData.actionItems : [];

  const actionItems = !isReViewable ? actionDefaultItems.filter((item) => item.name !== 'REVIEW') : actionDefaultItems;

  const ExtraHeaderComponent = () => {
    const [openQrPopover, setOpenQrPopover] = useState(false);
    const fileName = `Reference_${getDefaultNoValue(inspDeata.asset_number)}`;

    return (
      <>
        <Modal isOpen={openQrPopover} toggle={() => setOpenQrPopover(false)} size="sm">
          <ModalHeaderComponent title="Download QR" closeModalWindow={() => setOpenQrPopover(false)} size="sm" />
          <ModalBody>
            <div className="text-center">
              <QRCode
                value={getDefaultNoValue(inspDeata.asset_number)}
                renderAs="svg"
                includeMargin
                level="H"
                size={150}
                id="qrCode"
              />
            </div>
            <div>
              <Tooltip title="Download">
                <span className="float-right">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" color="primary" size="lg" icon={faDownload} onClick={() => downloadQr('qrCode', fileName)} />
                </span>
              </Tooltip>
            </div>
          </ModalBody>
        </Modal>
        <Button
          variant="contained"
          onClick={() => setOpenQrPopover(true)}
          size="sm"
          className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
        >
          <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faQrcode} />
          <span className="mr-2">Download QR</span>
        </Button>
      </>
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openQrPopover, setOpenQrPopover] = useState(false);
  const fileName = `Reference_${getDefaultNoValue(inspDeata.asset_number)}`;

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeCancelRequest = () => {
    showCancelModal(false);
    dispatch(resetCancelReq());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const open = Boolean(anchorEl);

  const getHeaderSchedule = (ef) => {
    let head = 'Scheduler';
    if (ef) {
      head = (
        <p>
          Scheduler
          <Button size="sm" variant="outlined" style={{ minWidth: '0px' }} className="px-1 py-0 ml-2 bg-white cursor-default">
            T
          </Button>
        </p>
      );
    }
    return head;
  };

  const tabs = ['Schedule Overview', 'Checklists'];
  const checkStatus = (val) => (
    <Box>
      {inspectionStatusLogJson.map(
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
  return (
    <>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={eventDetailModel}
      >
        <DrawerHeader
          headerName="Inspection Checklist"
          imagePath=""
          onClose={toggle}
        />
        <Box>
          {inspDeata && (
            <>
              <DetailViewHeader
                mainHeader={getDefaultNoValue(inspDeata.asset_name)}
                status={checkStatus(inspDeata.state)}
                subHeader={(
                  <>
                    {getDefaultNoValue(inspDeata.asset_number)}
                  </>
                )}
                actionComponent={(
                  <Box>
                    {canCreate && configData.is_can_cancel && (inspDeata.state === 'Upcoming' || inspDeata.state === 'Missed') && (
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
                      onClick={() => switchActionItem({ displayname: 'Cancel Inspection Schedule', name: 'Cancel Inspection Schedule' })}
                    >
                      Cancel Inspection Schedule
                    </Button>
                    )}
                    {actionItems?.some((action) => checkActionAllowed(action.displayname)) && (
                    <>
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
                        {actionItems && actionItems.map((actions) => (
                          checkActionAllowed(actions.displayname) && (
                          <MenuItem
                            sx={{
                              font: 'normal normal normal 15px Suisse Intl',
                            }}
                            id="switchAction"
                            className="pl-2"
                          // disabled={!checkActionAllowed(actions.displayname)}
                            key={actions.id}
                            onClick={() => switchActionItem(actions)}
                          >
                            {actions.displayname}
                          </MenuItem>
                          )
                        ))}
                      </Menu>
                    </>
                    )}
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
                    width: '75%',
                  }}
                >
                  <DetailViewTab
                    value={value}
                    handleChange={handleTabChange}
                    tabs={tabs}
                  />
                  <TabPanel value={value} index={0}>
                    <DetailViewLeftPanel
                      panelData={[{
                        header: ' Scheduler Information',
                        leftSideData: [
                          {
                            property: getHeaderSchedule(inspDeata.enforce_time),
                            value: <span className="text-info font-family-tab cursor-pointer" onClick={() => { setParentScheduleId(inspDeata.hx_inspection_uuid); setParentScheduleViewModal(true); }}>{getDefaultNoValue((inspDeata.group_name))}</span>,
                          },
                          {
                            property: 'Start Time',
                            value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.start_datetime, userInfo, 'datetime')),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Maintenance Team',
                            value: getDefaultNoValue(inspDeata.maintenance_team_name),
                          },
                          {
                            property: 'End Time',
                            value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.end_datetime, userInfo, 'datetime')),
                          },
                        ],
                      },
                      {
                        header: 'Inspection Information',
                        leftSideData: [
                          {
                            property: 'Order',
                            value:
  <div className={`${orderData && orderData.name ? 'cursor-pointer text-info' : ''} m-0`} onClick={openWorkOrder}>
    <span className="m-0 p-0 font-weight-700 text-capital">
      {getDefaultNoValue(orderData.name)}
    </span>
  </div>,
                          },
                          {
                            property: 'Actual Start Time',
                            value: getDefaultNoValue(inspDeata.date_start_execution ? getCompanyTimezoneDate(inspDeata.date_start_execution, userInfo, 'datetime') : ''),
                          },
                          {
                            property: inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done' ? 'Done By' : false,
                            value: getDefaultNoValue(inspDeata.employee_name),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Order Status',
                            value: getDefaultNoValue(getWorkOrderStateLabel(inspDeata.order_state ? inspDeata.order_state.toLowerCase() : '')),
                          },
                          {
                            property: 'Actual End Time',
                            value: getDefaultNoValue(inspDeata.date_execution ? getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime') : ''),
                          },
                        ],
                      },
                      {
                        header: 'Review Information',
                        leftSideData: [
                          {
                            property: 'Review Status',
                            value: getDefaultNoValue(inspDeata.review_status ? getWorkOrderStateLabelNew(inspDeata.review_status) : ''),

                          },
                          {
                            property: 'Reviewed By',
                            value: getDefaultNoValue(inspDeata.reviewed_by_name ? inspDeata.reviewed_by_name : ''),

                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Reviewed On',
                            value: getDefaultNoValue(inspDeata.reviewed_on ? getCompanyTimezoneDate(inspDeata.reviewed_on, userInfo, 'datetime') : ''),

                          },
                          {
                            property: 'Review Remarks',
                            value: getDefaultNoValue(inspDeata.reviewed_remark ? inspDeata.reviewed_remark : ''),

                          },

                        ],
                      }]}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {inspDeata.state === 'Completed'
                      ? <Checklists />
                      : ''}
                    {(inspDeata.state === 'Missed' || inspDeata.state === 'Upcoming' || (inspDeata.state !== 'Completed' && inspDeata.is_abnormal))
                      ? <MissedChecklists />
                      : ''}
                  </TabPanel>
                </Box>
                <Box
                  sx={{
                    width: '25%',
                    height: '100%',
                    backgroundColor: '#F6F8FA',
                  }}
                >
                  <DetailViewRightPanel
                    panelOneHeader="Location"
                    panelOneLabel={getDefaultNoValue(inspDeata.asset_path)}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
        {reviewModal && (
          <ReviewWorkorder
            atFinish={() => {
              showReviewModal(false); resetEscalate();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            inspDeata={orderData}
            isOrderId={inspDeata.id}
            reviewModal
          />
        )}
        {cancelModal && (
        <InspectionCancelRequest
          atFinish={() => closeCancelRequest()}
          atCancel={() => closeCancelRequest()}
          detailData={inspDeata}
          actionModal={cancelModal}
        />
        )}
        {loading && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
        )}
        {isErr && (
          <ErrorContent errorTxt={generateErrorMessage(inspectionChecklistDetail && inspectionChecklistDetail.err ? inspectionChecklistDetail.err : 'No Data Found')} />
        )}
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName={orderData && orderData.name ? orderData.name : ''}
          imagePath={workOrdersBlack}
          onClose={closeWorkOrder}
        />
        <OrderDetail setViewModal={setAddLink} />
      </Drawer>
      <Dialog size="sm" open={openQrPopover}>
        <DialogHeader title="Download QR" onClose={() => setOpenQrPopover(false)} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="text-center">
              <QRCode
                value={getDefaultNoValue(inspDeata.asset_number)}
                renderAs="svg"
                includeMargin
                level="H"
                size={150}
                id="qrCode"
              />
            </div>
            <div>
              <Tooltip title="Download">
                <span className="float-right">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" color="primary" size="lg" icon={faDownload} onClick={() => downloadQr('qrCode', fileName)} />
                </span>
              </Tooltip>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={parentSchedule}
      >
        <DrawerHeader
          headerName={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0)
            ? extractNameObject(inspectionSchedulerDetail.data[0].group_id, 'name') : ''}
          imagePath={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0) ? InspectionIcon : ''}
          onClose={() => { setParentScheduleId(false); setParentScheduleViewModal(false); }}
        />
        <SchedulerDetail  isWarehouse/>
      </Drawer>
    </>
  );
};

ViewInspection.propTypes = {
  eventDetailModel: PropTypes.bool.isRequired,
  atFinish: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};
export default ViewInspection;
