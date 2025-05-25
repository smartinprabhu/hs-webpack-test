/* eslint-disable react/jsx-no-useless-fragment */
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faArrowsAltH,
  faCaretSquareDown,
  faCheckCircle,
  faEye,
  faRandom,
  faStoreAlt, faTag,
  faTimesCircle,
  faTools,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assetIcon from '@images/icons/assetDefault.svg';
import taggedIcon from '@images/icons/tagged.svg';
import InfoIcon from '@mui/icons-material/Info';
import {
  Dialog, DialogContent, DialogContentText,
  Button,
  Divider,
  IconButton,
  Menu,
  Tooltip,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import {
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import PropertyAndValue from '../../commonComponents/propertyAndValue';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  heldeskStatusJson,
  helpdeskPrioritiesJson,
  detailViewHeaderClass,
} from '../../commonComponents/utils/util';
import {
  resetImage,
} from '../../helpdesk/ticketService';
import {
  TabPanel,
  extractTextObject,
  getAllCompanies,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
  numToFloatView,
  getMenuItems,
} from '../../util/appUtils';
import AuditLog from '../assetDetails/auditLog';
import Comments from '../assetDetails/comments';
import Transactions from '../assetDetails/transactions';
import {
  getAssetDetail,
  getHistoryCard,
  resetAddLocationInfo,
  resetCreateBreakdown,
  resetMoveAsset,
  resetOperativeInfo,
  resetScrap,
  resetSelectedSpace,
  resetUpdateEquipment,
  resetUpdateLocationInfo,
} from '../equipmentService';
import {
  getAMCText,
  getCriticalLabel,
  getDefinitonByLabel,
  getEquipmentStateLabel,
  getTagText, getValidationTypesText,
} from '../utils/utils';
// import Readings from '../assetDetails/readings';
import { AddThemeColor, DetailViewTabsBackground } from '../../themes/theme';
import AssetsDetailUpdate from '../assetDetails/assetUpdate/assetsDetailUpdateNew';
import actionCodes from '../data/assetActionCodes.json';
import actionCodesITAsset from '../data/assetActionCodesITAsset.json';
import assetsActions from '../data/assetsActions.json';
import Action from './actionItems/action';
import Breakdown from './actionItems/breakdown';
import MoveAsset from './actionItems/moveAsset';
import OperativeAsset from './actionItems/operativeAsset';
import ReplaceAsset from './actionItems/replaceAsset';
import ScrapAsset from './actionItems/scrapAsset';
import StoreInWarehouse from './actionItems/storeInWarehouse';
import TagAsset from './actionItems/tagAsset';
import ValidateAsset from './actionItems/validateAsset';
import HistoryCard from './historycard';
import EquipmentCosts from './equipmentCosts';

import Calendar from '../../preventiveMaintenance/viewer/calendarSchedule';
import InspectionCalendar from '../../inspectionSchedule/viewer/calendarSchedule';

import {
  resetInspectionViewer, resetInspectionSpaceGroup,
} from '../../inspectionSchedule/inspectionService';

const appModels = require('../../util/appModels').default;

const faIcons = {
  MOVEASSET: faArrowsAltH,
  MOVEASSETACTIVE: faArrowsAltH,
  STOREWAREHOUSE: faStoreAlt,
  STOREWAREHOUSEACTIVE: faStoreAlt,
  TAGASSET: faTag,
  TAGASSETACTIVE: faTag,
  REPLACEASSET: faRandom,
  REPLACEASSETACTIVE: faRandom,
  VALIDATEASSET: faCheckCircle,
  VALIDATEASSETACTIVE: faCheckCircle,
  SCRAPASSET: faTimesCircle,
  SCRAPASSETACTIVE: faTimesCircle,
  BREAKDOWN: faCaretSquareDown,
  BREAKDOWNACTIVE: faCaretSquareDown,
  OPERATIVEASSET: faTools,
  OPERATIVEASSETACTIVE: faTools,
  CHECKLISTREPORT: faEye,
  ASSIGNACTIVE: faArrowCircleRight,
  ASSIGN: faArrowCircleRight,
  RETURNACTIVE: faArrowCircleLeft,
  RETURN: faArrowCircleLeft,
};

const TicketDetails = ({
  setViewModal,
  isITAsset,
  categoryType,
  isSearch,
  editId,
  setEditId,
}) => {
  const {
    equipmentsDetails,
  } = useSelector((state) => state.equipment);
  const defaultActionText = isITAsset ? 'IT Asset Actions' : 'Asset Actions';

  const dispatch = useDispatch();
  const { userRoles, userInfo } = useSelector((state) => state.user);

  const module = 'Inspection Schedule';
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');
  const isInspectionModule = menuList && menuList.length ? menuList.filter((item) => item === 'Inspection Viewer') : false;
  const isInspectionViewer = !!(isInspectionModule && isInspectionModule.length);

  const module2 = '52 Week PPM';
  const menuList2 = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module2, 'name');
  const isPpmModule = menuList2 && menuList2.length ? menuList2.filter((item) => item === 'Viewer') : false;
  const isPPMViewer = !!(isPpmModule && isPpmModule.length);

  // const { printReportInfo } = useSelector((state) => state.purchase);

  const companies = getAllCompanies(userInfo);

  // const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, showSelectedImage] = useState(false);
  // const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  // const [selectedActions, setSelectedActions] = useState(defaultActionText);
  // const [selectedActionImage, setSelectedActionImage] = useState('');
  // const [enterAction, setEnterAction] = useState(false);

  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [moveModal, showMoveModal] = useState(false);
  const [storeModal, showStoreModal] = useState(false);
  const [tagModal, showTagModal] = useState(false);
  const [replaceModal, showReplaceModal] = useState(false);
  const [validateModal, showValidateModal] = useState(false);
  const [scrapModal, showScrapModal] = useState(false);
  const [operativeModal, showOperativeModal] = useState(false);
  const [breakModal, showBreakModal] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState(false);
  const [buttonText, setButtonText] = useState(false);

  const [value, setValue] = useState(0);

  const tabs = ['Asset Overview', 'Transactions', 'PPM Schedule', 'Inspection Schedule', 'Asset History', 'Cost', 'Documents', 'Audit Log'];

  const detailedData = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length
    ? equipmentsDetails.data[0]
    : '';
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    dispatch(resetInspectionViewer());
    dispatch(resetInspectionSpaceGroup());
  };

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  let allowedList = assetsActions && assetsActions.actionItems ? assetsActions.actionItems.filter((item) => allowedOperations.includes(actionCodes[item.displayname])) : false;

  if (isITAsset) {
    allowedList = assetsActions && assetsActions.itAssetActionItems ? assetsActions.itAssetActionItems.filter((item) => allowedOperations.includes(actionCodesITAsset[item.displayname])) : false;
  }
  const isListLength = !!(allowedList && allowedList.length);

  useEffect(() => {
    if (equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 && isITAsset) {
      const historyIds = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].history_card_ids : false;
      if (historyIds) {
        dispatch(getHistoryCard(historyIds, appModels.HISTORYCARD, 'date', 'DESC'));
      }
    }
  }, [equipmentsDetails]);

  const toggleImage = (image) => {
    showSelectedImage(image);
    setModal(!modal);
  };

  const checkTicketsStatus = (val) => (
    <Box>
      {heldeskStatusJson.map(
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

  const checkTicketPriority = (val) => (
    <Box>
      {helpdeskPrioritiesJson.map(
        (priority) => val === priority.priority && (
          <Typography
            sx={{
              color: priority.color,
            }}
          >
            {val}
          </Typography>
        ),
      )}
    </Box>
  );
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const open = Boolean(anchorEl);
  // const isConstraintsShow = maintenanceConfigurationData
  //   && !maintenanceConfigurationData.loading
  //   && maintenanceConfigurationData.data
  //   && maintenanceConfigurationData.data.length
  //   && maintenanceConfigurationData.data[0].is_constraints;
  // const isCostShow = maintenanceConfigurationData
  //   && !maintenanceConfigurationData.loading
  //   && maintenanceConfigurationData.data
  //   && maintenanceConfigurationData.data.length
  //   && maintenanceConfigurationData.data[0].is_cost;
  // const actionsList = isITAsset
  //   ? assetsActions.itAssetActionItems
  //   : assetsActions.actionItems;

  // const woDetailData = equipmentsDetails
  //     && equipmentsDetails.data
  //     && equipmentsDetails.data.length > 0
  //   ? { data: [equipmentsDetails.data[0]] }
  //   : false;
  // const inspDeata1 = incidentsOrderInfo
  //     && incidentsOrderInfo.data
  //     && incidentsOrderInfo.data.data
  //     && incidentsOrderInfo.data.data.length
  //   ? { data: [incidentsOrderInfo.data.data[0]] }
  //   : false;
  // const inspDeata2 = incidentsOrderInfo
  //     && incidentsOrderInfo.data
  //     && incidentsOrderInfo.data.data
  //     && incidentsOrderInfo.data.data.length
  //     && incidentsOrderInfo.data.data.length > 1
  //   ? { data: [incidentsOrderInfo.data.data[1]] }
  //   : woDetailData;
  // const woData = selectedActions && selectedActions.includes('Assessment')
  //   ? inspDeata1
  //   : inspDeata2;

  // function checkActionAllowedDisabled(actionName) {
  //   let allowed = true;
  //   const woId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].mro_order_id
  //     ? equipmentsDetails.data[0].mro_order_id[0]
  //     : false;
  //   const escalateLevel = equipmentsDetails
  //     && equipmentsDetails.data
  //     && equipmentsDetails.data[0].current_escalation_level;
  //   if (escalateLevel !== 'level1' && actionName === 'Escalate Ticket') {
  //     allowed = false;
  //   }
  //   if (actionName === 'Go to Work Orders' && !woId) {
  //     allowed = false;
  //   }
  //   return allowed;
  // }
  const switchActionItem = (action) => {
    handleClose();
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  function checkActionAllowedDisabled(actionName) {
    let allowed = true;
    const woId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].mro_order_id
      ? equipmentsDetails.data[0].mro_order_id[0]
      : false;
    const escalateLevel = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].level;
    if (escalateLevel !== 'level1' && actionName === 'Escalate Ticket') {
      allowed = false;
    }
    if (actionName === 'Go to Work Orders' && !woId) {
      allowed = false;
    }
    return allowed;
  }

  useEffect(() => {
    if (selectedActions === 'Move an Asset') {
      showMoveModal(true);
    }
    if (selectedActions === 'Store in Warehouse') {
      showStoreModal(true);
    }
    if (selectedActions === 'Breakdown Asset') {
      showBreakModal(true);
    }
    if (selectedActions === 'Tag Asset') {
      showTagModal(true);
    }
    if (selectedActions === 'Replace Asset') {
      showReplaceModal(true);
    }
    if (selectedActions === 'Validate Asset') {
      showValidateModal(true);
    }
    if (selectedActions === 'Scrap an Asset') {
      showScrapModal(true);
    }
    if (selectedActions === 'Operative Asset') {
      showOperativeModal(true);
    }
    if (selectedActions === 'Assign Asset') {
      showActionModal(true);
      setTitle('Assign Asset');
      setButtonText('Assign');
    }
    if (selectedActions === 'Return Asset') {
      showActionModal(true);
      setTitle('Return Asset');
      setButtonText('Return');
    }
  }, [enterAction]);

  const cancelMove = () => {
    dispatch(resetMoveAsset());
    dispatch(resetSelectedSpace());
  };

  const cancelStore = () => {
    dispatch(resetScrap());
    dispatch(resetUpdateLocationInfo());
  };

  const cancelTag = () => {
    dispatch(resetScrap());
  };

  const cancelReplace = () => {
    dispatch(resetMoveAsset());
    dispatch(resetSelectedSpace());
  };

  const cancelValidate = () => {
    dispatch(resetMoveAsset());
  };

  const cancelScrap = () => {
    dispatch(resetScrap());
    dispatch(resetUpdateLocationInfo());
  };

  const cancelOperative = () => {
    dispatch(resetAddLocationInfo());
    dispatch(resetOperativeInfo());
  };

  const cancelBreakDown = () => {
    dispatch(resetCreateBreakdown());
  };

  const cancelAssignAsset = () => {
    dispatch(resetUpdateEquipment());
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if (viewId) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  };
  // useEffect(() => {
  //   if (equipmentsDetails && equipmentsDetails.data) {
  //     const ids = equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].order_ids : [];
  //     dispatch(getOrdersFullDetails(companies, appModels.ORDER, ids));

  //     const woId = equipmentsDetails.data.length > 0
  //       ? equipmentsDetails.data[0].mro_order_id[0]
  //       : false;
  //     if (woId) {
  //       dispatch(getOrderDetail(woId, appModels.ORDER));
  //     }
  //   }
  // }, [equipmentsDetails]);

  // const onViewReset = () => {
  //   setAddLink(false);
  //   setViewModal(true);
  //   setSelectedActions(defaultActionText);
  //   setSelectedActionImage('');
  // };

  function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].state : '';
    const assignStatus = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].assignment_status : '';

    if (actionName === 'Store in Warehouse' && whState === 'wh') {
      allowed = false;
    }
    if (actionName === 'Breakdown Asset' && whState === 'br') {
      allowed = false;
    }
    if (actionName === 'Scrap an Asset' && whState === 'sc') {
      allowed = false;
    }
    if (actionName === 'Operative Asset' && (whState === 'op' || whState === 'sc')) {
      allowed = false;
    }
    if (actionName === 'Assign Asset' && assignStatus === 'Assigned') {
      allowed = false;
    }
    if (actionName === 'Return Asset' && (assignStatus === 'Not Assigned' || !assignStatus)) {
      allowed = false;
    }
    return allowed;
  }

  function tagStatus(valueData) {
    if (valueData) {
      return <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailedData.valueData ? faCheckCircle : faTimesCircle} />;
    }
    return '';
  }

  const infoValue = (fieldname, fieldValue) => {
    if (getDefinitonByLabel(fieldValue) && getDefinitonByLabel(fieldValue) !== '') {
      return (
        <div>
          {fieldname}
          <span className="info">
            <Tooltip title={getDefinitonByLabel(fieldValue)} placement="right">
              <span className="ml-2">
                <InfoIcon color="info" sx={{ fontSize: 15 }} />
              </span>
            </Tooltip>
          </span>
        </div>
      );
    }
    return '';
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onViewEditReset = () => {
    dispatch(resetImage());
    dispatch(resetUpdateEquipment());
    setEditLink(false);
    if (detailedData) {
      dispatch(
        getAssetDetail(detailedData.id, appModels.EQUIPMENT, false),
      );
    }
  };

  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.name)}
            status={getEquipmentStateLabel(detailedData.state, detailedData.end_of_life)}
            subHeader={(
              <>
                ASSET -
                {' '}
                {getDefaultNoValue(detailedData.equipment_seq)}
              </>
            )}
            actionComponent={(
              <Box>
                {equipmentsDetails
                  && !equipmentsDetails.loading
                  && equipmentsDetails.data
                  && equipmentsDetails.data.length > 0
                  && allowedOperations.includes(actionCodes['Edit Asset'])
                  && (
                    <Button
                      type="button"
                      className="ticket-btn"
                      onClick={() => {
                        setEditLink(true);
                        handleClose(false);
                        setEditId(detailedData.id);
                      }}
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                      variant="outlined"
                    >
                      {isITAsset ? 'Edit' : 'Edit'}
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
                {/* <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {assetsActions && assetsActions.actionItems.map((actions) => (
                    (allowedOperations.includes(actionCodes[actions.displayname])) && (
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
                        <img
                          src={faIcons[actions.name]}
                          alt="assetactions"
                          className="mr-2"
                          height="15"
                          width="15"
                        />
                        {actions.displayname}
                      </MenuItem>
                      )
                    )))}
                </Menu> */}
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
                  {isITAsset
                    ? assetsActions
                    && assetsActions.itAssetActionItems.map(
                      (actions) => allowedOperations.includes(
                        actionCodesITAsset[actions.displayname],
                      )
                        && checkActionAllowed(
                          actions.displayname,
                        ) && (
                          <MenuItem
                            sx={{
                              font: 'normal normal normal 15px Suisse Intl',
                            }}
                            id="switchAction"
                            className="pl-2"
                            key={actions.id}
                            // disabled={
                            //   !checkActionAllowedDisabled(actions.displayname)
                            // }
                            onClick={() => switchActionItem(actions)}
                          >
                            {/* <img
                                src={faIcons[actions.name]}
                                alt="assetactions"
                                className="mr-2"
                                height="15"
                                width="15"
                              /> */}
                            <FontAwesomeIcon
                              className="mr-2"
                              icon={faIcons[actions.name]}
                            />
                            {actions.displayname}
                          </MenuItem>
                      ),
                    )
                    : assetsActions && assetsActions.actionItems.map(
                      (actions) => allowedOperations.includes(
                        actionCodes[actions.displayname],
                      )
                        && checkActionAllowed(
                          actions.displayname,
                        ) && (
                          <MenuItem
                            sx={{
                              font: 'normal normal normal 15px Suisse Intl',
                            }}
                            id="switchAction"
                            className="pl-2"
                            key={actions.id}
                            // disabled={
                            //   !checkActionAllowedDisabled(actions.displayname)
                            // }
                            onClick={() => switchActionItem(actions)}
                          >
                            {/* <img
                                src={faIcons[actions.name]}
                                alt="assetactions"
                                className="mr-2"
                                height="15"
                                width="15"
                              /> */}
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
                width: value === 2 || value === 3 ? '100%' : '75%',
                position: value === 2 || value === 3 ? 'fixed' : 'relative',
              }}
            >
              <DetailViewTab
                value={value}
                handleChange={handleTabChange}
                tabs={tabs}
              />
              <TabPanel value={value} index={0}>
                <Typography
                  sx={detailViewHeaderClass}
                >
                  General Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Category', 'category_id'),
                        value: extractTextObject(detailedData.category_id),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Model Code', 'model'),
                        value: getDefaultNoValue(detailedData.model),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Serial Number', 'serial'),
                        value: getDefaultNoValue(detailedData.serial),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Brand', 'brand'),
                        value: getDefaultNoValue(detailedData.brand),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Manufacturer', 'manufacturer_id'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.manufacturer_id),
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Criticality', 'criticality'),
                        value: getDefaultNoValue(
                          getCriticalLabel(detailedData.criticality),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('UNSPSC Code', 'commodity_id'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.commodity_id),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('End of Life', 'end_of_life'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(
                            detailedData.end_of_life,
                            userInfo,
                            'date',
                          ),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Description', 'equipment_number'),
                        value: getDefaultNoValue(detailedData.equipment_number),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Parent Asset', 'parent_id'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.parent_id),
                        ),
                      }}
                    />
                  </Box>
                </Box>
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Purchase Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Purchase Date', 'purchase_date'),
                        value: getCompanyTimezoneDate(
                          detailedData.purchase_date,
                          userInfo,
                          'date',
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Purchase Value', 'purchase_value'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.purchase_value),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Vendor', 'vendor_id'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.vendor_id),
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('PO Reference #', 'asset_id'),
                        value: getDefaultNoValue(detailedData.asset_id),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Customer', 'customer_id'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.customer_id),
                        ),
                      }}
                    />
                  </Box>
                </Box>
                <Divider />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Warranty / AMC Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Warranty Start date', 'warranty_start_date'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(
                            detailedData.warranty_start_date,
                            userInfo,
                            'date',
                          ),
                        ),
                      }}
                    />

                    <PropertyAndValue
                      data={{
                        property: infoValue('AMC Type', 'amc_type'),
                        value: getDefaultNoValue(
                          getAMCText(detailedData.amc_type),
                        ),
                      }}
                    />

                    <PropertyAndValue
                      data={{
                        property: infoValue('AMC Start date', 'amc_start_date'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(
                            detailedData.amc_start_date,
                            userInfo,
                            'date',
                          ),
                        ),
                      }}
                    />

                    <PropertyAndValue
                      data={{
                        property: infoValue('Installed Date', 'start_date'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(
                            detailedData.start_date,
                            userInfo,
                            'date',
                          ),
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('End date', 'warranty_end_date'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(
                            detailedData.warranty_end_date,
                            userInfo,
                            'date',
                          ),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('AMC Cost', 'amc_cost'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.amc_cost),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('End date', 'amc_end_date'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(
                            detailedData.amc_end_date,
                            userInfo,
                            'date',
                          ),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Warranty Description', 'warranty_description'),
                        value: getDefaultNoValue(detailedData.warranty_description),
                      }}
                    />
                  </Box>
                </Box>
                <Divider />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Maintenance Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Maintained By', 'maintained_by_id'),
                        value: getDefaultNoValue(extractTextObject(detailedData.maintained_by_id, userInfo, 'date')),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Managed By', 'managed_by_id'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.managed_by_id),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Last Breakdown', 'last_breakdown_on'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(detailedData.last_breakdown_on, userInfo, 'date'),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Expected MTBF', 'expected_mtbf'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.expected_mtbf),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('RAV', 'rav'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.rav),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Total Parts Cost', 'total_parts_cost'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.total_parts_cost),
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Monitored By', 'monitored_by_id'),
                        value: getDefaultNoValue(extractTextObject(detailedData.monitored_by_id)),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Total Labour Cost', 'total_labor_cost'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.total_labor_cost),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Breakdown Reason', 'breakdown_reason'),
                        value: getDefaultNoValue(detailedData.breakdown_reason, userInfo, 'date'),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Actual MTBF', 'mtbf_hours'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.mtbf_hours),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('MTTR', 'mttf_hours'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.mttf_hours),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Total Tools Cost', 'total_tools_cost'),
                        value: getDefaultNoValue(
                          numToFloatView(detailedData.total_tools_cost),
                        ),
                      }}
                    />
                  </Box>
                </Box>
                <Divider />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Validation Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Validation Status', 'validation_status'),
                        value: getDefaultNoValue(
                          getValidationTypesText(detailedData.validation_status),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Last Validated By', 'validated_by'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.validated_by),
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Last Validated Date', 'validated_on'),
                        value: getDefaultNoValue(
                          getCompanyTimezoneDate(detailedData.validated_on, userInfo, 'datetime'),
                        ),
                      }}
                    />
                    {!isITAsset
                      ? (
                        <PropertyAndValue
                          data={{
                            property: infoValue('Tag Status', 'tag_status'),
                            value: getDefaultNoValue(
                              getTagText(detailedData.tag_status),
                            ),
                          }}
                        />
                      )
                      : (
                        <>
                          <PropertyAndValue
                            data={{
                              property: infoValue('QR Tagged', 'is_qr_tagged'),
                              value: getDefaultNoValue(
                                tagStatus(detailedData.is_qr_tagged),
                              ),
                            }}
                          />
                          <PropertyAndValue
                            data={{
                              property: infoValue('NFC Tagged', 'is_nfc_tagged'),
                              value: getDefaultNoValue(
                                tagStatus(detailedData.is_nfc_tagged),
                              ),
                            }}
                          />
                          <PropertyAndValue
                            data={{
                              property: infoValue('RFID Tagged', 'is_rfid_tagged'),
                              value: getDefaultNoValue(
                                tagStatus(detailedData.is_rfid_tagged),
                              ),
                            }}
                          />
                          <PropertyAndValue
                            data={{
                              property: infoValue('Virtually Tagged', 'is_virtually_tagged'),
                              value: getDefaultNoValue(
                                tagStatus(detailedData.is_virtually_tagged),
                              ),
                            }}
                          />
                          <PropertyAndValue
                            data={{
                              property: infoValue('Assignment Status', 'assignment_status'),
                              value: getDefaultNoValue(detailedData.assignment_status),
                            }}
                          />
                        </>
                      )}

                  </Box>
                </Box>
                <Divider />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Additional Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <PropertyAndValue
                      data={{
                        property: infoValue('Geo Location(Latitude , Longitude)', 'geolocations'),
                        value: <>
                          <span className="mr-1 mt-0 ml-0 mb-0 p-0">{getDefaultNoValue(detailedData.latitude)}</span>
                          {detailedData.longitude && (<span>,</span>)}
                          <span className="mr-0 mt-0 ml-1 mb-0 p-0">{(detailedData.longitude ? detailedData.longitude : '')}</span>
                               </>,
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Positions(x , y)', 'positions'),
                        value: <>
                          {' '}
                          <span className="mr-1 mt-0 ml-0 mb-0 p-0 ">{getDefaultNoValue(detailedData.xpos)}</span>
                          {detailedData.ypos && (<span>,</span>)}
                          <span className="mr-0 mt-0 ml-1 mb-0 p-0 ">
                            {(detailedData.ypos ? detailedData.ypos : '')}
                          </span>
                          {' '}

                        </>,
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Working Hours', 'operating_hours'),
                        value: getDefaultNoValue(
                          extractTextObject(detailedData.operating_hours),
                        ),
                      }}
                    />
                    <PropertyAndValue
                      data={{
                        property: infoValue('Comment', 'comment'),
                        value: getDefaultNoValue(detailedData.comment),
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    {detailedData.make
                      && (
                        <PropertyAndValue
                          data={{
                            property: infoValue('Make', 'make'),
                            value: getDefaultNoValue(detailedData.make),
                          }}
                        />
                      )}
                    {detailedData.capacity
                      && (
                        <PropertyAndValue
                          data={{
                            property: infoValue('Capacity', 'capacity'),
                            value: getDefaultNoValue(detailedData.capacity),
                          }}
                        />
                      )}
                    {detailedData.last_service_done
                      && (
                        <PropertyAndValue
                          data={{
                            property: infoValue('Last Service Done Date', 'last_service_done'),
                            value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.last_service_done, userInfo, 'datetime')),
                          }}
                        />
                      )}
                    {detailedData.refilling_due_date
                      && (
                        <PropertyAndValue
                          data={{
                            property: infoValue('Refilling Due Date', 'refilling_due_date'),
                            value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.refilling_due_date, userInfo, 'datetime')),
                          }}
                        />
                      )}
                    {detailedData.employee_id
                      && (
                        <PropertyAndValue
                          data={{
                            property: infoValue('Assigned To', 'employee_id'),
                            value: getDefaultNoValue(extractTextObject(detailedData.employee_id)),
                          }}
                        />
                      )}
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Transactions detailData={equipmentsDetails} setViewModal={setViewModal} />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <HistoryCard
                  ids={equipmentsDetails.data[0].history_card_ids}
                  viewId={equipmentsDetails.data[0].id}
                  type="equipment"
                  setViewModal={setViewModal}
                  isITAsset={isITAsset}
                />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <EquipmentCosts
                  ids={equipmentsDetails.data[0].equipment_cost_ids}
                  viewId={equipmentsDetails.data[0].id}
                  type="equipment"
                  setViewModal={setViewModal}
                  isITAsset={isITAsset}
                />
              </TabPanel>
              <TabPanel value={value} index={6}>
                <Documents
                  viewId={equipmentsDetails.data[0].id}
                  ticketNumber={equipmentsDetails.data[0].name}
                  resModel={appModels.EQUIPMENT}
                  model={appModels.DOCUMENT}
                />
                <Divider />
              </TabPanel>
              <TabPanel value={value} index={7}>
                <Comments />
                <AuditLog ids={equipmentsDetails.data[0].message_ids} />
                <Divider />
              </TabPanel>
              <TabPanel value={value} index={2}>
                {isPPMViewer ? (
                  <Calendar userInfo={userInfo} assetName={detailedData.id} />
                ) : (
                  <ErrorContent errorTxt="No Access Found" />
                )}
                <Divider />
              </TabPanel>
              <TabPanel value={value} index={3}>
                {isInspectionViewer ? (
                  <InspectionCalendar userInfo={userInfo} assetName={detailedData.id} />
                ) : (
                  <ErrorContent errorTxt="No Access Found" />
                )}
                <Divider />
              </TabPanel>
              {/* <TabPanel value={value} index={5}>
                 <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  {detailedData.state_id
                      && (detailedData.state_id[1] === 'Customer Closed'
                        || detailedData.state_id[1] === 'Staff Closed'
                        || detailedData.state_id[1] === 'Closed') ? (
                          <Box
                            sx={{
                              width: '50%',
                            }}
                          >
                            <PropertyAndValue
                              data={{
                                property: 'Closed on',
                                value: getDefaultNoValue(
                                  getCompanyTimezoneDate(
                                    detailedData.close_time,
                                    userInfo,
                                    'datetime',
                                  ),
                                ),
                              }}
                            />
                            <PropertyAndValue
                              data={{
                                property: 'Closed by',
                                value: getDefaultNoValue(detailedData.closed_by_id),
                              }}
                            />
                            <PropertyAndValue
                              data={{
                                property: 'Close Comment',
                                value:
                              detailedData.close_comment
                                && detailedData.close_comment !== ''
                                && truncateHTMLTags(detailedData.close_comment)
                                  .length > 0 ? (
                                    <p
                                      className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar"
                                      dangerouslySetInnerHTML={{
                                        __html: htmlToReact(
                                          detailedData.close_comment,
                                        ),
                                      }}
                                    />
                                ) : (
                                  '-'
                                ),
                              }}
                            />
                          </Box>
                    ) : (
                      <ErrorContent errorTxt="No Data Found" />
                    )}
                </Box>
              </TabPanel> */}
            </Box>
            {(value !== 2 || value !== 3) && (
            <Box
              sx={{
                width: '25%',
                height: '100%',
                backgroundColor: '#F6F8FA',
              }}
            >
              <Box
                sx={DetailViewTabsBackground({
                  width: '100%',
                  height: '50px',
                })}
              />
              <Box
                sx={{
                  width: '100%',
                  height: '30%',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10%',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      font: 'normal normal normal 16px Suisse Intl',
                      letterSpacing: '0.63px',
                      color: '#000000',
                      marginBottom: '10px',
                    }}
                  >
                    Asset Image
                  </Typography>
                  <Typography
                    sx={{
                      font: 'normal normal normal 18px Suisse Intl',
                      letterSpacing: '1.05px',
                      color: '#000000',
                      fontWeight: 600,
                      marginBottom: '10px',
                    }}
                  >
                    {detailedData.image_medium
                      ? (
                        <img
                          src={detailedData.image_medium && detailedData && !detailedData.loading ? `data:image/png;base64,${detailedData.image_medium}` : assetMiniBlueIcon}
                          alt="visitor_image"
                          className="mr-2 cursor-pointer"
                          width="35"
                          height="35"
                          aria-hidden="image"
                          onClick={() => toggleImage(detailedData.image_medium ? `data:image/png;base64,${detailedData.image_medium}` : assetMiniBlueIcon)}
                        />
                      ) : ' - '}
                  </Typography>
                  <Typography
                    sx={{
                      font: 'normal normal normal 16px Suisse Intl',
                      letterSpacing: '0.63px',
                      color: '#6A6A6A',
                      marginBottom: '10px',
                    }}
                  >
                    {getDefaultNoValue(detailedData.equipment_seq)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      font: 'normal normal normal 16px Suisse Intl',
                      letterSpacing: '0.63px',
                      color: '#000000',
                      marginBottom: '10px',
                    }}
                  >
                    Location
                  </Typography>
                  {detailedData.location_id && (
                    <Typography
                      sx={{
                        font: 'normal normal normal 16px Suisse Intl',
                        letterSpacing: '0.63px',
                        color: '#6A6A6A',
                        marginBottom: '10px',
                      }}
                    >
                      {getDefaultNoValue(extractTextObject(detailedData.location_id))}
                    </Typography>
                  )}
                </Box>
                <Divider />
              </Box>
            </Box>
            )}
          </Box>
        </Box>
      )}
      {equipmentsDetails && equipmentsDetails.loading && <Loader />}
      {
        moveModal && (
          <MoveAsset
            atFinish={() => {
              showMoveModal(false); cancelMove();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            moveModal
          />
        )
      }
      {
        storeModal && (
          <StoreInWarehouse
            atFinish={() => {
              showStoreModal(false); cancelStore();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            storeModal
          />
        )
      }
      {
        tagModal && (
          <TagAsset
            atFinish={() => {
              showTagModal(false); cancelTag();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            tagModal
          />
        )
      }
      {
        replaceModal && (
          <ReplaceAsset
            atFinish={() => {
              showReplaceModal(false); cancelReplace();
              setSelectedActions(defaultActionText); cancelMove(); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            replaceModal
            isITAsset={isITAsset}
          />
        )
      }
      {
        validateModal && (
          <ValidateAsset
            atFinish={() => {
              showValidateModal(false); cancelValidate();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            validateModal
          />
        )
      }
      {
        scrapModal && (
          <ScrapAsset
            atFinish={() => {
              showScrapModal(false); cancelScrap();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            scrapModal
          />
        )
      }
      {
        operativeModal && (
          <OperativeAsset
            atFinish={() => {
              showOperativeModal(false); cancelOperative();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            operativeModal
          />
        )
      }
      {
        breakModal && (
          <Breakdown
            atFinish={() => {
              showBreakModal(false); cancelBreakDown();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            equipmentsDetails={equipmentsDetails}
            breakModal
          />
        )
      }
      {
        actionModal && (
          <Action
            atFinish={() => {
              showActionModal(false); cancelAssignAsset();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            atCancel={() => {
              showActionModal(false);
              dispatch(resetUpdateEquipment());
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            actionText={title}
            actionButton={buttonText}
            isITAsset={isITAsset}
            equipmentsDetails={equipmentsDetails}
            categoryType={categoryType}
            actionModal
          />
        )
      }
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        ModalProps={{
          disableEnforceFocus: true,
          sx: isSearch ? { zIndex: '1300' } : {},
        }}
        anchor="right"
        open={editLink}
      >
        <DrawerHeader
          headerName={isITAsset ? 'Update IT Asset' : 'Update Asset'}
          imagePath={assetIcon}
          onClose={() => {
            setEditLink(false);
            dispatch(resetImage());
            dispatch(resetUpdateEquipment());
            setEditId(false);
          }}
        />
        <AssetsDetailUpdate
          editId={editId}
          afterReset={onViewEditReset}
          closeModal={() => setEditLink(false)}
          isITAsset={isITAsset}
          categoryType={categoryType}
        />
      </Drawer>
      <Dialog size="lg" open={modal}>
        <DialogHeader title={detailedData.name} imagePath={false} onClose={() => { showSelectedImage(false); setModal(!modal); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedImage
              ? (
                <img
                  src={selectedImage || ''}
                  alt={detailedData.name}
                  width="100%"
                  aria-hidden="true"
                />
              )
              : ''}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* {closeActionModal && (
        <CloseWorkorder
          atFinish={() => {
            showCloseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicket();
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={woData}
          closeActionModal
        />
      )}
      {acceptModal && (
        <AcceptWorkorder
          atFinish={() => {
            showAcceptModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicket();
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={woData}
          selectedActions={selectedActions}
          acceptModal
        />
      )}
      {pauseActionModal && (
        <PauseWorkorder
          atFinish={() => {
            showPauseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={equipmentsDetails}
          pauseActionModal
          isTicket
          tId={
            equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0
              ? equipmentsDetails.data[0].id
              : false
          }
          wId={
            equipmentsDetails
              && equipmentsDetails.data
              && equipmentsDetails.data.length > 0
              && equipmentsDetails.data[0].mro_order_id
              && equipmentsDetails.data[0].mro_order_id.length
              ? equipmentsDetails.data[0].mro_order_id[0]
              : false
          }
        />
      )}
      {progressActionModal && (
        <InProgressTicket
          atFinish={() => {
            setProgressActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          progressActionModal
          tId={
            equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0
              ? equipmentsDetails.data[0].id
              : false
          }
        />
      )}
      {shareActionModal && (
        <ShareTicket
          atFinish={() => {
            setShareActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicketWithSucc();
          }}
          shareActionModal
          tId={
            equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0
              ? equipmentsDetails.data[0].id
              : false
          }
        />
      )} */}
    </>
  );
};
export default TicketDetails;
