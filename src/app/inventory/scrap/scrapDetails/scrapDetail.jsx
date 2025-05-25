import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import {
  IconButton, Button, Menu, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Drawer from '@mui/material/Drawer';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import ticketIconBlack from '@images/icons/ticketBlack.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  faStoreAlt, faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import assetDefault from '@images/drawerLite/assetLite.svg';

import {
  getScrapDetail, resetUpdateScrap, resetActionData, getActionData,
} from '../../inventoryService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../../commonComponents/detailViewTab';
import DetailViewHeader from '../../../commonComponents/detailViewHeader';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
  TabPanel,

  getListOfModuleOperations,
} from '../../../util/appUtils';
import { ScrapStatusJson } from '../../../commonComponents/utils/util';
import customData from '../data/customData.json';
import actionCodes from '../../data/actionCodes.json';
import Products from './products';
import AddScrap from '../addScrap';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  START: faStoreAlt,
  STARTACTIVE: faStoreAlt,
  VALIDATE: faCheckCircle,
  VALIDATEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
};

const ScrapDetail = () => {
  const dispatch = useDispatch();
  const { scrapDetail } = useSelector((state) => state.inventory);
  const defaultActionText = 'Scrap Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [actionModal, showActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editId, setEditId] = useState(false);

  const [modal, setModal] = useState(actionModal);

  const tabs = ['Scrap Overview', 'Product Moves'];
  const { actionResultInfo } = useSelector((state) => state.inventory);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isValidatable = allowedOperations.includes(actionCodes['Validate Scrap']);

  const stateData = actionResultInfo && actionResultInfo.data ? actionResultInfo.data : false;

  const isStateNotChange = (stateData && stateData.data && typeof stateData.data === 'object');
  const isResult = (stateData && stateData.data && typeof stateData.data === 'boolean') || (stateData && !isStateNotChange && stateData.status);

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      showActionModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    handleClose();
  };

  function checkActionAllowed(actionName) {
    let allowed = false;
    const whState = scrapDetail && scrapDetail.data ? scrapDetail.data[0].state : '';
    if (whState === 'done') {
      allowed = false;
    }
    if (actionName === 'Validate' && (whState === 'draft') && isValidatable) {
      allowed = true;
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
    const viewId = scrapDetail && scrapDetail.data ? scrapDetail.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      dispatch(getScrapDetail(viewId, appModels.STOCKSCRAP));
    }
    showActionModal(false);
    setSelectedActions(defaultActionText);
  };

  const detailData = scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) ? scrapDetail.data[0] : '';
  const loading = scrapDetail && scrapDetail.loading;
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
    dispatch(getActionData(id, state, appModels.STOCKSCRAP));
  };

  const checkScrapStatus = (val) => (
    <Box>
      {ScrapStatusJson.map(
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
      {detailData && (
        <Box>

          <DetailViewHeader
            mainHeader={getDefaultNoValue((detailData.name))}
            status={
                detailData.state
                  ? checkScrapStatus(detailData.state)
                  : '-'
              }
            subHeader={(
              <>
                {detailData.create_date
                    && userInfo.data
                    && userInfo.data.timezone
                  ? moment
                    .utc(detailData.create_date)
                    .local()
                    .tz(userInfo.data.timezone)
                    .format('yyyy MMM Do, hh:mm A')
                  : '-'}
                {' '}

              </>
              )}
            actionComponent={(
              <Box>
                {scrapDetail
                    && !scrapDetail.loading
                    && scrapDetail.data
                    && scrapDetail.data.length > 0
                    && scrapDetail.data[0].state
                    && scrapDetail.data[0].state.length > 0
                    && allowedOperations.includes(actionCodes['Edit Scrap']) && (
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
                          setEditLink(true);
                          handleClose(false);
                          setEditId(detailData.id);
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

                  {customData
                      && customData.actionItems.map(
                        (actions) => checkActionAllowed(
                          actions.displayname,
                          scrapDetail,
                          'Actions',
                        ) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
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
                        ),
                      )}
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
                      header: 'GENERAL INFORMATION',
                      leftSideData:
                          [
                            {
                              property: 'Picking',
                              value: getDefaultNoValue(detailData.picking_id),
                            },
                            {
                              property: 'Created Date',
                              value: getDefaultNoValue(
                                getCompanyTimezoneDate(
                                  detailData.create_date,
                                  userInfo,
                                  'datetime',
                                ),
                              ),
                            },
                          ],
                      rightSideData:
                          [
                            {
                              property: 'Location',
                              value: getDefaultNoValue(extractTextObject(detailData.location_id)),
                            },
                          ],
                    },

                    {
                      header: 'SCRAP INFORMATION',
                      leftSideData: [
                        {
                          property: 'Product',
                          value: getDefaultNoValue(extractTextObject(detailData.product_id)),
                        },
                        {
                          property: 'Scrap Location',
                          value: getDefaultNoValue(detailData.scrap_location_id),
                        },

                      ],
                      rightSideData: [
                        {
                          property: 'Quantity',
                          value: getDefaultNoValue(detailData.scrap_qty),
                        },
                      ],
                    },

                  ]}
                />
                {/*    <ScrapOverview detail={scrapDetail} /> */}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Products />
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
                  panelOneHeader="SCRAP"
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
                        detailData.state
                          ? checkScrapStatus(detailData.state)
                          : "-",
                    },

                  ]}
                />
                </Box> */}
          </Box>

          <Drawer
            PaperProps={{
              sx: { width: '50%' },
            }}
            anchor="right"
            open={editLink}
          >

            <DrawerHeader
              headerName="Update Inventory Scrap"
              imagePath={InventoryBlue}
              onClose={() => { onUpdateReset(); setEditLink(false); }}
            />
            <AddScrap
              editId={editId}
              closeModal={() => { setEditLink(false); }}
              afterReset={() => { onUpdateReset(); }}
              isShow
            />
          </Drawer>

          <Dialog maxWidth="lg" open={actionModal}>
            <DialogHeader title={isValidatable ? `${actionText} Scrap` : 'Insufficient Quantity'} response={actionResultInfo} onClose={toggle} imagePath={ticketIconBlack} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F6F8FA',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10%',
                    fontFamily: 'Suisse Intl',
                  }}
                >
                  <Card>
                    <CardBody data-testid="success-case" className="bg-lightblue p-3">
                      <Row>
                        <Col md="4" xs="4" sm="4" lg="4">
                          <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                        </Col>
                        <Col md="7" xs="7" sm="7" lg="7">
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
                                  {checkScrapStatus(isResult && (scrapDetail && !scrapDetail.loading) ? getAlertStatus(actionText) : detailData.state)}
                                </span>
                              </Col>
                            </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Row className="justify-content-center">
                    {isResult && (scrapDetail && !scrapDetail.loading) && (
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

              <Button variant="contained" onClick={() => handleStateChange(detailData.id, actionCode)}>Confirm</Button>

              )}
              {isResult && (
              <Button variant="contained" disabled={scrapDetail.loading} onClick={toggle}>Ok</Button>

              )}
            </DialogActions>
          </Dialog>

        </Box>
      )}
      {((scrapDetail && scrapDetail.loading) || (loading)) && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
    </>
  );
};

/*  <Row className="m-0 bg-lightblue">
   <Col sm="12" md="12" lg="12" xs="12" className="p-0">
     <ScrapDetailInfo detail={scrapDetail} />
     <ScrapDetailTabs detail={scrapDetail} />
   </Col>
 </Row>
);
}; */

export default ScrapDetail;
