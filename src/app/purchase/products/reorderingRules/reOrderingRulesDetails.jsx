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
import AddReorderingRules from './addReorderingRules';

import { LocationStatusJson } from "../../../commonComponents/utils/util";
import {
  TabPanel,
  getDefaultNoValue,
  getListOfModuleOperations
} from "../../../util/appUtils";
import {
  clearEditReOderingRule,
  getReorderRuleDetails
} from '../../purchaseService';
const appModels = require('../../../util/appModels').default;


const tabs = ["Reordering Overview"];

const checkReorderingeStatus = (val) => {
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


const ReOrderingRulesDetails = () => {
  const dispatch = useDispatch();
  const { reOrderingRuleDetailsInfo } = useSelector((state) => state.purchase);

  const defaultActionText = 'Reordering Rules';
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

  const detailData = reOrderingRuleDetailsInfo && (reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0) ? reOrderingRuleDetailsInfo.data[0] : '';
  const loading = reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.loading;

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
    const whState = reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.data ? reOrderingRuleDetailsInfo.data[0].active : '';
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
    if (detailData && detailData.id) {
      dispatch(getReorderRuleDetails(appModels.REORDERINGRULES, detailData.id));
    }
    dispatch(clearEditReOderingRule());
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
              /* status={
                detailData.active 
                  ? checkReorderingeStatus(detailData.active)
                  : "-"
              } */
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
                  {reOrderingRuleDetailsInfo &&
                    !reOrderingRuleDetailsInfo.loading &&
                    reOrderingRuleDetailsInfo.data &&
                    reOrderingRuleDetailsInfo.data.length > 0 &&
                    (
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
                            reOrderingRuleDetailsInfo,
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
                              property: "Product",
                              value: detailData.product_id ? detailData.product_id : extractTextObject(detailData.product_id),
                            },
                            {
                              property: "Reorder Quantity",
                              value: detailData.product_max_qty ? detailData.product_max_qty : getDefaultNoValue(detailData.product_max_qty),
                            },
                            {
                              property: "Lead Time",
                              value: detailData.lead_days ? detailData.lead_days : getDefaultNoValue(detailData.lead_days),
                            },
                            {
                              property: "Product Unit Of Measure",
                              value: detailData.product_uom && detailData.product_uom.length ? detailData.product_uom[1] : getDefaultNoValue(detailData.product_uom),
                            },
                          ],
                        rightSideData:
                          [
                            {
                              property: "Reorder Level",
                              value: detailData.product_min_qty ? detailData.product_min_qty : getDefaultNoValue(detailData.product_min_qty),
                            },
                            {
                              property: "Alert Level",
                              value: detailData.product_alert_level_qty ? detailData.product_alert_level_qty : getDefaultNoValue(detailData.product_alert_level_qty),
                            },
                            {
                              property: "Lead Type",
                              value: detailData.lead_type ? detailData.lead_type : getDefaultNoValue(detailData.lead_type),
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
                  panelOneHeader="OPERATION TYPE"
                  panelOneLabel={getDefaultNoValue((detailData.display_name))}
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
                headerName="Update Reordering Rules"
                imagePath={InventoryBlue}
                onClose={() => setEditLink(false)}
              />

              <AddReorderingRules closeEditModal={() => setEditLink(false)} afterReset={() => { onUpdateReset(); }} editId={editId} />

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
                        {LocationStatusJson(isResult && (reOrderingRuleDetailsInfo && !reOrderingRuleDetailsInfo.loading) ? getAlertStatus(actionText) : detailData.state)}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            </Card>
              <Row className="justify-content-center">
              {isResult && (reOrderingRuleDetailsInfo && !reOrderingRuleDetailsInfo.loading) && (
              <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage={`This scrap has been ${getAlertText(actionText)} successfully..`} />
              )}
              {isError && (
              <SuccessAndErrorFormat response={actionResultInfo} />
              )}
              {((reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.loading) || (loading)) && (
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
  <Button color="primary" disabled={reOrderingRuleDetailsInfo.loading} onClick={toggle}>Ok</Button>

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

export default ReOrderingRulesDetails;
