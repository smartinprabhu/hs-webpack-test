import InventoryBlue from '@images/icons/inventoryBlue.svg';
import { Button, IconButton, Menu } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/system";
import moment from "moment-timezone";
import React, { useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import DetailViewHeader from "../../../commonComponents/detailViewHeader";
import DetailViewLeftPanel from "../../../commonComponents/detailViewLeftPanel";
import DetailViewTab from "../../../commonComponents/detailViewTab";
import DrawerHeader from "../../../commonComponents/drawerHeader";

import Loader from "@shared/loading";
import AddWarehouse from '../addWarehouse';

import { LocationStatusJson } from "../../../commonComponents/utils/util";
import {
  TabPanel,
  extractTextObject,
  getDefaultNoValue,
  getListOfModuleOperations
} from "../../../util/appUtils";
import {
  resetUpdateWarehouse, getWareHouse
} from '../../inventoryService';
const appModels = require('../../../util/appModels').default;

import actionCodes from '../../data/actionCodes.json';

const tabs = ["Warehouse Overview"];

const checkWareHouseStatus = (val) => {
  return (
    <Box>
      {LocationStatusJson.map(
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


const WareHouseDetail = () => {
  const dispatch = useDispatch();
  const { wareHouseDetails } = useSelector((state) => state.inventory);
  const defaultActionText = 'Warehouse Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [actionModal, showActionModal] = useState(false);
  const [modal, setModal] = useState(actionModal);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const detailData = wareHouseDetails && (wareHouseDetails.data && wareHouseDetails.data.length > 0) ? wareHouseDetails.data[0] : '';
  const loading = wareHouseDetails && wareHouseDetails.loading;

  const { actionResultInfo } = useSelector((state) => state.inventory);
  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = wareHouseDetails && wareHouseDetails.data ? wareHouseDetails.data[0].active : '';
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
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onUpdateReset = () => {
    dispatch(getWareHouse(detailData.id, appModels.WAREHOUSE));
    dispatch(resetUpdateWarehouse());
    setEditLink(false);
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      {detailData && (
        <>
          <Box>

            <DetailViewHeader
              mainHeader={getDefaultNoValue((detailData.name))}
              status={
                detailData.active
                  ? checkWareHouseStatus(detailData.active)
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
                  {wareHouseDetails &&
                    !wareHouseDetails.loading &&
                    wareHouseDetails.data &&
                    wareHouseDetails.data.length > 0 &&
                    wareHouseDetails.data[0].active &&
                    allowedOperations.includes(actionCodes["Edit Warehouse"]) && (
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
                    {/*      
                    {customData &&
                      customData.actionItems.map(
                        (actions) =>
                         
                          checkActionAllowed(
                            actions.displayname,
                            wareHouseDetails,
                            'Actions'
                          ) && ( */}
                    <MenuItem
                      sx={{
                        font: "normal normal normal 15px Suisse Intl",
                      }}
                      id="switchAction"
                      className="pl-2"
                    //  key={actions.id}
                    /*  disabled={
                       !checkActionAllowedDisabled(actions.displayname)
                     } */
                    // onClick={() => switchActionItem(actions)}
                    >
                      {/* <FontAwesomeIcon
                              className="mr-2"
                              icon={faIcons[actions.name]}
                            />
                             {actions.displayname} */}

                    </MenuItem>
                    {/*  )
                      )} */}
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
                  width: "100%",
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
                              property: "ADDRESS",
                              value: getDefaultNoValue(extractTextObject(detailData.partner_id)),
                            },
                            {
                              property: "Company",
                              value: getDefaultNoValue(extractTextObject(detailData.company_id)),
                            },
                          ],
                        rightSideData:
                          [
                            {
                              property: "Status",
                              value: (detailData.active ? 'Active' : 'Inactive'),
                            },
                          ]
                      },

                      /* {
                        header: "ADDITIONAL INFORMATION",
                        leftSideData: [
                          {
                            property: "Company",
                            value: getDefaultNoValue(extractTextObject(detailData.company_id)),
                          },
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
                      },*/

                    ]}
                  />
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
                  panelOneHeader="WARE HOUSE"
                  panelOneLabel={getDefaultNoValue((detailData.display_name))}
                  //                  panelOneValue1={getDefaultNoValue((detailData.display_name))}
                  // panelOneValue2={getDefaultNoValue(detailData.mobile)}
                  //   panelThreeHeader="Inventory Information"
                  panelThreeData={[


                    {
                      header: "Created on",
                      value: getDefaultNoValue(
                        getCompanyTimezoneDate(
                          detailData.create_date,
                          userInfo,
                          "datetime"
                        )
                      ),
                    },
                    {
                      header: "Status",
                      value:
                        detailData.active
                          ? checkWareHouseStatus(detailData.active)
                          : "-",
                    },


                  ]}
                />
              </Box> */}
            </Box>


            <Drawer
              PaperProps={{
                sx: { width: "50%" },
              }}
              anchor="right"
              open={editLink}
            >

              <DrawerHeader
                headerName="Update Warehouse sdsad"
                imagePath={InventoryBlue}
                onClose={() => setEditLink(false)}
              />
              <AddWarehouse editId={editId} afterReset={() => { onUpdateReset(); }} />

            </Drawer>

            {/* <Dialog maxWidth={'md'} open={actionModal} >
            <DialogHeader title={`${actionText} Stock Audit`} response={actionResultInfo} onClose={toggle} imagePath={ticketIconBlack}/>
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
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">{detailData.name}</h6>
                  </Row>
                  <Row>
                    <p className="mb-0 font-weight-500 font-tiny">
                      {getDefaultNoValue(extractTextObject(detailData.location_id))}
                    </p>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Status :
                      </span>
                      <span className="font-weight-400">
                        {LocationStatusJson(isResult && (wareHouseDetails && !wareHouseDetails.loading) ? getAlertStatus(actionText) : detailData.state)}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            </Card>
              <Row className="justify-content-center">
              {isResult && (wareHouseDetails && !wareHouseDetails.loading) && (
              <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage={`This scrap has been ${getAlertText(actionText)} successfully..`} />
              )}
              {isError && (
              <SuccessAndErrorFormat response={actionResultInfo} />
              )}
              {((wareHouseDetails && wareHouseDetails.loading) || (loading)) && (
              <CardBody className="mt-4" data-testid="loading-case">
                <Loader />
              </CardBody>
              )}
            </Row>
            </Box>
            </DialogContentText>
            </DialogContent>
            <DialogActions>

            {!isResult && (

<Button color="primary" onClick={() => handleStateChange(detailData.id, actionCode)}>Confirm</Button>

)}
{isResult && (
  <Button color="primary" disabled={wareHouseDetails.loading} onClick={toggle}>Ok</Button>

)}

           
            </DialogActions>
            </Dialog> */}

          </Box>
        </>
      )}
      {loading && (
        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
          <Loader />
        </div>
      )}
    </>
  );
}
export default WareHouseDetail;
