import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Box } from "@mui/system";
import React, { useState, useEffect } from 'react';
import { IconButton } from "@mui/material";
import { Button, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import moment from "moment-timezone";
import { useDispatch, useSelector } from 'react-redux';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Drawer from "@mui/material/Drawer";
import DrawerHeader from "../../../commonComponents/drawerHeader";
import DetailViewHeader from "../../../commonComponents/detailViewHeader";
import DetailViewTab from "../../../commonComponents/detailViewTab";
import DetailViewRightPanel from "../../../commonComponents/detailViewRightPanel";
import DetailViewLeftPanel from "../../../commonComponents/detailViewLeftPanel";
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import ticketIconBlack from '@images/icons/ticketBlack.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';

import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import DialogHeader from '../../../commonComponents/dialogHeader';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from "@shared/loading";

import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
  TabPanel,
  getListOfModuleOperations,
} from "../../../util/appUtils";
import {
  getAdjustmentDetail, resetUpdateAdjustment
  , resetUpdateScrap, resetAuditExists, resetActionData, getActionData,
} from '../../inventoryService';
const appModels = require('../../../util/appModels').default;
import { StockAuditStatusJson } from "../../../commonComponents/utils/util";
import Products from './products';
import ProductsAdjustments from './productsAdjustments';

// import { getInventText } from '../utils/utils';
import customData from '../data/customData.json';
import actionCodes from '../../data/actionCodes.json';


import {
  faStoreAlt, faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';


import AddAdjustment from '../addAdjustment';

const faIcons = {
  START: faStoreAlt,
  STARTACTIVE: faStoreAlt,
  VALIDATE: faCheckCircle,
  VALIDATEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
};

const checkAuditStatus = (val) => {
  return (
    <Box>
      {StockAuditStatusJson.map(
        (status) =>
          val === status.status && (
            <Box
              sx={{
                backgroundColor: status.backgroundColor,
                padding: "4px 8px 4px 8px",
                border: "none",
                borderRadius: "4px",
                color: status.color,
                fontFamily: "Suisse Intl",
              }}
            >
              {status.text}
            </Box>
          )
      )}
    </Box>
  );
};

const AdjustmentDetail = () => {
  const dispatch = useDispatch();
  const { adjustmentDetail } = useSelector((state) => state.inventory);

  const defaultActionText = 'Stock Audit Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [actionModal, showActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [modal, setModal] = useState(actionModal);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  const tabs = ["Overview", "Inventory Details", "Inventory Adjustments"];
  const { actionResultInfo } = useSelector((state) => state.inventory);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isStartable = allowedOperations.includes(actionCodes['Start Adjustment']);
  const isValidatable = allowedOperations.includes(actionCodes['Validate Adjustment']);
  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      showActionModal(true);
    }
  }, [enterAction]);

  const handleClose = () => {
    setAnchorEl(null);
  };


  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    handleClose();
  };

  function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = adjustmentDetail && adjustmentDetail.data ? adjustmentDetail.data[0].state : '';
    if (whState === 'done') {
      allowed = false;
    }
    if (actionName === 'Start' && (whState === 'cancel' || whState === 'confirm' || !isStartable)) {
      allowed = false;
    }
    if (actionName === 'Validate' && (whState === 'cancel' || whState === 'draft' || !isValidatable)) {
      allowed = false;
    }
    if (actionName === 'Set to Draft' && (whState === 'cancel' || whState === 'draft')) {
      allowed = false;
    }
    return allowed;
  }




  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const open = Boolean(anchorEl);

  const onUpdateReset = () => {
    dispatch(resetUpdateAdjustment());
    dispatch(resetUpdateScrap());
    setEditLink(false);
  };
  /* const loadTransfers = (key, value) => {
    const filters = [{
      key: 'id', value: key, label: value, type: 'id',
    }];
    dispatch(getTransferFilters([], [], filters));
    dispatch(setCurrentTab('Transfers'));
  }; */

  const toggle = () => {
    dispatch(resetActionData());
    setModal(!modal);
    const viewId = adjustmentDetail && adjustmentDetail.data ? adjustmentDetail.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      dispatch(getAdjustmentDetail(viewId, appModels.INVENTORY));
    }
    showActionModal(false);
    setSelectedActions(defaultActionText);
  };


  const detailData = adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) ? adjustmentDetail.data[0] : '';
  const loading = adjustmentDetail && adjustmentDetail.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  function getAlertStatus(actionValue) {
    let text = 'performed';
    if (customData && customData.actionTypes && customData.actionTypes[actionValue]) {
      text = customData.actionTypes[actionValue].targetStatus;
    }
    return text;
  }

  function getAlertText(actionValue) {
    let text = 'performed';
    if (customData && customData.actionTypes && customData.actionTypes[actionValue]) {
      text = customData.actionTypes[actionValue].msg;
    }
    return text;
  }

  const handleStateChange = (id, state) => {
    dispatch(getActionData(id, state, appModels.INVENTORY));
  };


  return (
    <>
      {detailData && (
        <>
          <Box>

            <DetailViewHeader
              mainHeader={getDefaultNoValue((detailData.name))}
              status={
                detailData.state
                  ? checkAuditStatus(detailData.state)
                  : "-"
              }
              subHeader={
                <>
                  {detailData.create_date &&
                    userInfo.data &&
                    userInfo.data.timezone
                    ? moment
                      .utc(detailData.create_date)
                      .local()
                      .tz(userInfo.data.timezone)
                      .format("yyyy MMM Do, hh:mm A")
                    : "-"}{" "}

                </>
              }
              actionComponent={
                <Box>
                  {adjustmentDetail &&
                    !adjustmentDetail.loading &&
                    adjustmentDetail.data &&
                    adjustmentDetail.data.length > 0 &&
                    adjustmentDetail.data[0].state &&
                    adjustmentDetail.data[0].state.length > 0 &&
                    allowedOperations.includes(actionCodes["Edit Scrap"]) && (
                      <Button
                        type="button"
                        variant='outlined'
                        className="ticket-btn"
                        sx={{
                          backgroundColor: "#fff",
                          '&:hover': {
                            backgroundColor: "#fff",
                          }
                        }}
                        onClick={() => {
                          setEditLink(true);
                          handleClose(false);
                          setEditId(detailData.id);
                        }}
                      >
                        {"Edit"}
                      </Button>
                    )}
                  <IconButton
                    sx={{
                      margin: "0px 5px 0px 5px",
                    }}
                    id="demo-positioned-button"
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
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
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >

                    {customData &&
                      customData.actionItems.map(
                        (actions) =>

                          checkActionAllowed(
                            actions.displayname,
                            adjustmentDetail,
                            'Actions'
                          ) && (
                            <MenuItem
                              sx={{
                                font: "normal normal normal 15px Suisse Intl",
                              }}
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              /*  disabled={
                                 !checkActionAllowedDisabled(actions.displayname)
                               } */
                              onClick={() => switchActionItem(actions)}
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faIcons[actions.name]}
                              />
                              {actions.displayname}

                            </MenuItem>
                          )
                      )}
                  </Menu>
                </Box>
              }
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "75%",
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
                        header: "GENERAL INFORMATION",
                        leftSideData:
                          [
                            {
                              property: "Audit Location",
                              value: getDefaultNoValue(extractTextObject(detailData.location_id)),
                            },
                            {
                              property: "Audit Date",
                              value: getDefaultNoValue(
                                getCompanyTimezoneDate(
                                  detailData.date,
                                  userInfo,
                                  "datetime"
                                )
                              ),
                            },
                          ],
                        rightSideData:
                          [
                            {
                              property: "Audited By",
                              value: getDefaultNoValue(extractTextObject(detailData.create_uid)),
                            },
                            /*{
                              property: "Created Date",
                              value: getDefaultNoValue(
                                getCompanyTimezoneDate(
                                  detailData.create_date,
                                  userInfo,
                                  "datetime"
                                )
                              ),
                            },*/
                          ]
                      },

                      {
                        header: "ADDITIONAL INFORMATION",
                        leftSideData: [
                          {
                            property: "Comments",
                            value: getDefaultNoValue(detailData.comments),
                          },

                        ],
                        rightSideData: [
                          {
                            property: "Reason",
                            value: getDefaultNoValue(extractTextObject(detailData.reason_id)),
                          }
                        ]
                      },

                    ]}
                  />
                  {/*    <ScrapOverview adjustmentDetail={adjustmentDetail} /> */}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Products />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <ProductsAdjustments />
                </TabPanel>
              </Box>


              <Box
                sx={{
                  width: "25%",
                  height: "100%",
                  backgroundColor: "#F6F8FA",
                }}
              >
                <DetailViewRightPanel
                  //panelOneHeader="STOCK AUDIT"
                  // panelOneLabel={getDefaultNoValue((detailData.display_name))}
                  //                  panelOneValue1={getDefaultNoValue((detailData.display_name))}
                  // panelOneValue2={getDefaultNoValue(detailData.mobile)}
                  //   panelThreeHeader="Inventory Information"
                  panelThreeData={[


                    {
                      header: "Company",
                      value: getDefaultNoValue(extractTextObject(detailData.company_id)),
                    },
                    /*{
                      header: "Status",
                      value:
                        detailData.state
                          ? checkAuditStatus(detailData.state)
                          : "-",
                    },*/


                  ]}
                />
              </Box>
            </Box>


            <Drawer
              PaperProps={{
                sx: { width: "50%" },
              }}
              anchor="right"
              open={editLink}
            >

              <DrawerHeader
                headerName="Update Stock Audit"
                imagePath={InventoryBlue}
                onClose={() => { onUpdateReset(); setEditLink(false) }}
              />
              <AddAdjustment
                editId={editId}
                isShow={true}
                isDrawerOpen={setEditLink}
                afterReset={() => { onUpdateReset(); setEditLink(false); dispatch(resetAuditExists()); }}
              />
            </Drawer>

            <Dialog maxWidth={'md'} open={actionModal} >
              <DialogHeader title={`${actionText} Stock Audit`} response={actionResultInfo} onClose={toggle} imagePath={ticketIconBlack} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#F6F8FA",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10%",
                      fontFamily: "Suisse Intl",
                    }}
                  >
                    <Card>
                      <CardBody data-testid="success-case" className="bg-lightblue p-3">
                        <Row>
                          <Col className='col-auto'>
                            <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                          </Col>
                          <Col className='col-auto'>
                            <Row>
                              <Col className='col-auto'>
                                <h6 className="mb-1">{detailData.name}</h6>
                              </Col>
                            </Row>
                            <Row>
                              <Col className='col-auto'>
                                <p className="mb-0 font-weight-500 font-tiny">
                                  {getDefaultNoValue(extractTextObject(detailData.location_id))}
                                </p>
                              </Col>
                            </Row>
                            <Row>
                              <Col className='col-auto'>
                                <span className="font-weight-800 font-side-heading mr-1">
                                  Status :
                                </span>
                              </Col>
                              <Col className='col-auto'>
                                <span className="font-weight-400 font-tiny">
                                  {checkAuditStatus(isResult && (adjustmentDetail && !adjustmentDetail.loading) ? getAlertStatus(actionText) : detailData.state)}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    <Row className="justify-content-center">
                      {isResult && (adjustmentDetail && !adjustmentDetail.loading) && (
                        <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage={`This scrap has been ${getAlertText(actionText)} successfully..`} />
                      )}
                      {isError && (
                        <SuccessAndErrorFormat response={actionResultInfo} />
                      )}

                    </Row>
                  </Box>
                </DialogContentText>
              </DialogContent>
              <DialogActions>

                {!isResult && (

                  <Button variant='contained' onClick={() => handleStateChange(detailData.id, actionCode)}>Confirm</Button>

                )}
                {isResult && (
                  <Button variant='contained' disabled={adjustmentDetail.loading} onClick={toggle}>Ok</Button>

                )}


              </DialogActions>
            </Dialog>

          </Box>
        </>
      )}
      {((adjustmentDetail && adjustmentDetail.loading) || (loading)) && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
    </>
  );
};

export default AdjustmentDetail;
