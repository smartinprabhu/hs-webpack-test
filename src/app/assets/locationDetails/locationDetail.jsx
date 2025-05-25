/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {

  Col,
  Tooltip,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Redirect, useLocation } from 'react-router-dom';
import {
  Button, IconButton, Menu, Box, MenuItem, Dialog, DialogContent, DialogActions,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';

import plusCircleBlueIcon from '@images/icons/plusCircleBlue.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import importMiniIcon from '@images/icons/importMiniBlue.svg';
import noDataFoundImg from '@images/noDataFound.svg';
import plusCircleWhiteIcon from '@images/icons/plusCircleWhite.svg';
import locationIcon from '@images/icons/locationBlack.svg';
import DialogHeader from '../../commonComponents/dialogHeader';
import { setInitialValues } from '../../purchase/purchaseService';
import LocationDetailTabs from './locationDetailTabs';
import actionCodes from '../data/assetActionCodes.json';
import AddLocation from './addLocation';
import EditLocation from './editLocation/editLocation';
import AssetBulkUpload from '../assetDetails/assetBulkUpload';
import { getMaintenanceConfigurationData } from '../../helpdesk/ticketService';
import {
  resetCreateSpace, getEquipmentFilters,
  resetUpdateLocationInfo,
} from '../equipmentService';
import { getListOfOperations, generateErrorMessage } from '../../util/appUtils';
import assetActions from '../data/assetsActions.json';
import CopyHelpdeskUrl from './copyHelpdeskUrl';
import QrExport from '../mapView/dataExport/qrExport';

import DetailViewHeader from '../../commonComponents/detailViewHeader';

const appModels = require('../../util/appModels').default;

const faIcons = {
  ADDLOCATION: plusCircleBlueIcon,
  ADDLOCATIONACTIVE: plusCircleBlueIcon,
  ASSETBULKUPLOAD: importMiniIcon,
  ASSETBULKUPLOADACTIVE: importMiniIcon,
};

const LocationDetail = ({ collapse }) => {
  const dispatch = useDispatch();
  const defaultActionText = 'Location Actions';

  const [tooltipOpen1, setTooltipOpen1] = useState(false);
  const [addLocationModal, showAddLocationModal] = useState(false);
  const [editLocationModal, showEditLocationModal] = useState(false);
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [overviewLink, setOverviewLink] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);

  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [copyUrlModal, showCopyUrlModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    getFloorsInfo, getSpaceInfo, updateLocationInfo, createSpaceInfo,
    allLocationsInfo,
  } = useSelector((state) => state.equipment);
  const { companyDetail } = useSelector((state) => state.setup);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (selectedActions === 'Add Location') {
      showAddLocationModal(true);
    }
    if (selectedActions === 'Asset Bulk Upload') {
      showBulkUploadModal(true);
    }
    if (selectedActions === 'Copy Helpdesk URL') {
      showCopyUrlModal(true);
    }
  }, [enterAction]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getEquipmentFilters([]));
    }
  }, [userInfo]);

  useEffect(() => {
    if (changeLocationActionOpen === true) {
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [changeLocationActionOpen]);

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const onResetLocation = () => {
    dispatch(resetUpdateLocationInfo());
  };

  const handleQRExport = () => {
    setTimeout(() => {
      const content = document.getElementById('print_space_qr_report');
      const pri = document.getElementById('print_space_qr_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      setSelectedActions(defaultActionText);
      setSelectedActionImage('');
    }, 2000);
  };

  const switchActionItem = (action) => {
    if (action.displayname !== 'Download QR') {
      setLocationActionOpen(!changeLocationActionOpen);
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      setEnterAction(Math.random());
    } else {
      setLocationActionOpen(!changeLocationActionOpen);
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      handleQRExport();
    }
  };

  function getChildData(tData, id) {
    let res = [];
    if (tData && tData.length && id) {
      const data = tData.filter((space) => space && ((space.parent_id && space.parent_id.id === id) || (space.id === id)));
      if (data && data.length) {
        res = data;
      }
    }
    return res;
  }

  const toggle1 = () => setTooltipOpen1(!tooltipOpen1);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  if (allowedOperations && allowedOperations.length) {
    allowedOperations.push('copy_helpdesk_url');
  }

  const location = useLocation();
  const currentPath = location.pathname;

  if (overviewLink) {
    if (currentPath === '/asset-configuration') {
      return (<Redirect to="/site-configuration" />);
    }
    return (<Redirect to="/asset-overview" />);
  }
  const onCloseHelpdeskUrlModal = () => {
    showCopyUrlModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };
  const noData = getFloorsInfo && getFloorsInfo.err ? getFloorsInfo.err.data : false;

  const isUserError = (userInfo && userInfo.err) || (getFloorsInfo && getFloorsInfo.err);
  const isUserLoading = (userInfo && userInfo.loading) || (getFloorsInfo && getFloorsInfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const floorsErrmsg = (getFloorsInfo && getFloorsInfo.err) ? generateErrorMessage(getFloorsInfo) : userErrorMsg;
  const errorMsg = (getSpaceInfo && getSpaceInfo.err) ? generateErrorMessage(getSpaceInfo) : floorsErrmsg;

  const pathCode = companyDetail && companyDetail.data && companyDetail.data.length ? companyDetail.data[0].code : false;

  return (
    <>
      {((getSpaceInfo && getSpaceInfo.loading) || isUserLoading) && (
        <Col sm="12" md="12" lg="12" xs="12" className="p-2 text-center mt-5">
          <div className="mb-2 mt-2">
            <Loader />
          </div>
        </Col>
      )}
      {getSpaceInfo && !getSpaceInfo.loading && !isUserLoading && (
      <Box>
        <DetailViewHeader
          mainHeader={`Location Overview - ${getSpaceInfo?.data?.[0]?.name} (${getSpaceInfo?.data?.[0]?.sequence_asset_hierarchy})`}
          subHeader={getSpaceInfo?.data?.[0]?.space_name}
          extraHeader={getSpaceInfo?.data?.[0]?.sequence_asset_hierarchy}
          actionComponent={(
            <Box>
              {allowedOperations.includes(actionCodes['Edit Location']) && (
              <Button
                type="button"
                className="ticket-btn"
                onClick={() => { showEditLocationModal(true); dispatch(setInitialValues(false, false, false, false)); }}
                onMouseLeave={() => setButtonHover1(false)}
                onMouseEnter={() => setButtonHover1(true)}
                sx={{
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#fff',
                  },
                }}
                variant="outlined"
              >
                Edit
              </Button>
              )}
              <Button
                type="button"
                className="ticket-btn"
                onClick={() => setOverviewLink(true)}
                onMouseLeave={() => setButtonHover(false)}
                onMouseEnter={() => setButtonHover(true)}
                sx={{
                  backgroundColor: '#fff',
                  '&:hover': {
                    backgroundColor: '#fff',
                  },
                }}
                variant="outlined"
              >
                Close
              </Button>
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
                {assetActions && assetActions.locationActionItems.map((actions) => (
                  allowedOperations.includes(actionCodes[actions.accessName]) && (
                  <MenuItem
                    sx={{
                      font: 'normal normal normal 15px Suisse Intl',
                    }}
                    id="switchAction"
                    className="pl-2"
                    onClick={() => { switchActionItem(actions); handleClose(); }}
                  >
                    {actions.displayname}
                  </MenuItem>
                  )))}
              </Menu>
            </Box>
          )}
        />
        <LocationDetailTabs />
        {((getSpaceInfo && getSpaceInfo.err) || isUserError) && !(noData.status_code && noData.status_code === 404) && (
        <Col sm="12" md="12" lg="12" xs="12" className="p-2 text-center mt-5">
          <div className="mb-2 mt-2">
            <ErrorContent errorTxt={errorMsg} />
          </div>
        </Col>
        )}
        {noData && (noData.status_code && noData.status_code === 404) && (
        <Col sm="12" md="12" lg="12" xs="12" className="p-2 text-center mt-5">
          <img src={noDataFoundImg} width="120" height="120" alt="nodata" className="mb-2 mt-5" />
          <br />
          <h4 className="mb-3 font-weight-600">Nothing here... Yet!</h4>
          <Button
            type="button"
            id="Tooltip1"
            size="sm"
            className="pt-1 pb-1 pr-2 pl-2 btn-navyblue text-left textwrapdots w-100"
            onClick={() => { showAddLocationModal(true); }}
          >
            <img alt="add" width="16" height="16" className="mr-2 pb-2px" src={plusCircleWhiteIcon} />
            <span>
              Add New Location
            </span>
          </Button>
          <Tooltip placement="top" isOpen={tooltipOpen1} target="Tooltip1" toggle={toggle1}>
            Add New Location
          </Tooltip>
        </Col>
        )}
        <Dialog size={(createSpaceInfo && createSpaceInfo.data) ? 'sm' : 'xl'} fullWidth={!(createSpaceInfo && createSpaceInfo.data)} open={addLocationModal}>
          <DialogHeader title="Add Location" imagePath={locationIcon} onClose={() => { setSelectedActions(defaultActionText); setSelectedActionImage(''); showAddLocationModal(false); onReset(); }} response={createSpaceInfo} />
          <DialogContent>
            <AddLocation
              spaceCategory={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].asset_categ_type : ''}
              afterReset={() => { setSelectedActions(defaultActionText); setSelectedActionImage(''); showAddLocationModal(false); onReset(); }}
              spaceId={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : ''}
              pathName={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].path_name : pathCode}
            />
          </DialogContent>
        </Dialog>
        <Dialog size={(updateLocationInfo && updateLocationInfo.data) ? 'sm' : 'xl'} fullWidth={!(updateLocationInfo && updateLocationInfo.data)} open={editLocationModal}>
          <DialogHeader title="Edit Location" imagePath={locationIcon} onClose={() => { showEditLocationModal(false); onResetLocation(); }} response={updateLocationInfo} />
          <DialogContent>
            <EditLocation
              afterReset={() => { showEditLocationModal(false); onResetLocation(); }}
            />
          </DialogContent>
        </Dialog>
        {bulkUploadModal && (
        <AssetBulkUpload
          atFinish={() => {
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            showBulkUploadModal(false);
          }}
          bulkUploadModal
        />
        )}
        <div className="hidden-div" id="print_space_qr_report">
          <QrExport data={allLocationsInfo && allLocationsInfo.data ? getChildData(allLocationsInfo.data, getSpaceInfo?.data?.[0]?.id) : []} />
        </div>
        <iframe name="print_frame" title="Spaces_Export" id="print_space_qr_frame" width="0" height="0" frameBorder="0" src="about:blank" />
        <Dialog size="md" open={copyUrlModal}>
          <DialogHeader title="Copy Helpdesk URL" onClose={onCloseHelpdeskUrlModal} sx={{ width: '500px' }} hideClose />
          <DialogContent>
            <CopyHelpdeskUrl />
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              size="sm"
              variant="contained"
              className="float-right mt-2"
              onClick={() => onCloseHelpdeskUrlModal()}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      )}
    </>
  );
};

LocationDetail.propTypes = {
  collapse: PropTypes.bool,
};
LocationDetail.defaultProps = {
  collapse: false,
};

export default LocationDetail;
