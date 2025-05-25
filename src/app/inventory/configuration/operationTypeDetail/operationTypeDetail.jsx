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
import DetailViewRightPanel from "../../../commonComponents/detailViewRightPanel";
import DetailViewTab from "../../../commonComponents/detailViewTab";
import DrawerHeader from "../../../commonComponents/drawerHeader";

import Loader from "@shared/loading";
import AddOperationType from '../addOperationType';

import { LocationStatusJson } from "../../../commonComponents/utils/util";
import {
  TabPanel,
  extractTextObject,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfModuleOperations
} from "../../../util/appUtils";
import {
  resetUpdateOpType,
  getOperationType
} from '../../inventoryService';
const appModels = require('../../../util/appModels').default;

import actionCodes from '../../data/actionCodes.json';

const tabs = ["Operation Overview"];

const checkOperationTypeStatus = (val) => {
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


const OperationTypeDetail = () => {
  const dispatch = useDispatch();
  const { operationTypeDetails } = useSelector((state) => state.inventory);
  const defaultActionText = 'Operation';
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

  const detailData = operationTypeDetails && (operationTypeDetails.data && operationTypeDetails.data.length > 0) ? operationTypeDetails.data[0] : '';
  const loading = operationTypeDetails && operationTypeDetails.loading;

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
    const whState = operationTypeDetails && operationTypeDetails.data ? operationTypeDetails.data[0].active : '';
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
      dispatch(getOperationType(detailData.id, appModels.STOCKPICKINGTYPES));
    }
    dispatch(resetUpdateOpType());
    setEditLink(false);
  };

  const toggle = () => {
    setModal(!modal);
  };

  return (<>
    {detailData && (
      <>
        <Box>

          <DetailViewHeader
            mainHeader={getDefaultNoValue((detailData.name))}
            status={
              detailData.active
                ? checkOperationTypeStatus(detailData.active)
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
                {operationTypeDetails &&
                  !operationTypeDetails.loading &&
                  operationTypeDetails.data &&
                  operationTypeDetails.data.length > 0 &&
                  operationTypeDetails.data[0].active &&
                  allowedOperations.includes(actionCodes["Edit Operation Type"]) && (
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
                            operationTypeDetails,
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
                            property: "Reference Sequence",
                            value: getDefaultNoValue(extractTextObject(detailData.sequence_id)),
                          },
                          {
                            property: "Warehouse",
                            value: getDefaultNoValue(extractTextObject(detailData.warehouse_id)),
                          },
                        ],
                      rightSideData:
                        [
                          {
                            property: "Default Destination Location",
                            value: getDefaultNoValue(extractTextObject(detailData.default_location_dest_id)),
                          },
                          {
                            property: "Create Date",
                            value: getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime')),
                          },
                        ]
                    },
                  ]}
                />
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
                panelOneHeader="OPERATION TYPE"
                panelOneLabel={getDefaultNoValue((detailData.name))}
                panelOneValue1={getDefaultNoValue((detailData.code))}
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
                        ? checkOperationTypeStatus(detailData.active)
                        : "-",
                  },


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
              headerName="Update Operation Type"
              imagePath={InventoryBlue}
              onClose={() => setEditLink(false)}
            />
            <AddOperationType editId={editId} afterReset={() => { onUpdateReset(); }} />

          </Drawer>
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

export default OperationTypeDetail;
