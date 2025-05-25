/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  faCheckCircle, faClock, faTimesCircle, faStoreAlt, faCaretSquareDown,
} from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/system';
import {
  Button,
} from '@mui/material';
import moment from 'moment-timezone';
import Drawer from '@mui/material/Drawer';
import SiteCheck from '@images/icons/siteBlue.svg';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  getDefaultNoValue, getListOfOperations, extractNameObject,
} from '../../util/appUtils';
import {
  getNumberToCommas,
} from '../../util/staticFunctions';
import customData from '../data/customData.json';
import {
  getSiteDetail, resetUpdateSiteInfo, resetCopyStatus, resetAddSiteInfo,
} from '../siteService';
import AddSite from '../addSite';
import actionCodes from '../data/complianceActionCodes.json';

const appModels = require('../../util/appModels').default;

const faIcons = {
  PUBLISH: faCheckCircle,
  PUBLISHACTIVE: faCheckCircle,
  UNPUBLISH: faTimesCircle,
  UNPUBLISHACTIVE: faTimesCircle,
  STARTRENEWAL: faClock,
  STARTRENEWALACTIVE: faClock,
  COMPLETERENEWAL: faClock,
  COMPLETERENEWALACTIVE: faClock,
  SETASDRAFT: faStoreAlt,
  SETASDRAFTACTIVE: faStoreAlt,
  ARCHIVE: faCaretSquareDown,
  ARCHIVEACTIVE: faCaretSquareDown,
};

const siteDetailInfo = ({
  setEditId, editId,
}) => {
  const dispatch = useDispatch();
  const defaultActionText = 'Site Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [editModal, showEditModal] = useState(false);
  const {
    siteDetails, onBoardCopyInfo,
  } = useSelector((state) => state.site);
  const {
    userInfo, userRoles,
  } = useSelector((state) => state.user);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  const viewData = siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0] : false;

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) && (siteDetails && siteDetails.data)) {
      dispatch(getSiteDetail(siteDetails.data[0].id, appModels.BULIDINGCOMPLIANCE));
    }
  }, [tenantUpdateInfo]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const closeEditModalWindow = () => {
    dispatch(getSiteDetail(editId, appModels.COMPANY));
    // if (document.getElementById('siteForm')) {
    //   document.getElementById('siteForm').reset();
    // }
    // dispatch(resetAddSiteInfo());
    // dispatch(resetCopyStatus());
    dispatch(resetUpdateSiteInfo());
    showEditModal(false);
  };

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const siteData = siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0] : '';
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const loading = (siteDetails && siteDetails.loading) || (onBoardCopyInfo && onBoardCopyInfo.loading);

  return (
    !loading && viewData && (
      <DetailViewHeader
        mainHeader={extractNameObject(viewData.parent_id, 'name')}
        subHeader={(
            getDefaultNoValue(extractNameObject(viewData.res_company_categ_id, 'name')))}
        extraHeader={(
          <>
            {' '}
            {viewData.create_date
                  && userInfo.data
                  && userInfo.data.timezone
              ? moment
                .utc(viewData.create_date)
                .local()
                .tz(userInfo.data.timezone)
                .format('yyyy MMM Do, hh:mm A')
              : '-'}
          </>
)}
        actionComponent={(
          <Box>
            {siteDetails
                  && !siteDetails.loading
                  && allowedOperations.includes(actionCodes['Edit Site']) && (
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
                        // setEditLink(true);
                        setEditId(siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0].id : false);
                        showEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
            )}
            {/* <IconButton
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
                    id="switchLocation"
                    key={actions.id}
                    className="pl-2"
                    onClick={() => switchStatus(actions.id, actions.displayname, actions)}
                  >
                    {actions.displayname}
                  </MenuItem>
                  )
                )))}
            </Menu> */}
            <Drawer
              PaperProps={{
                sx: { width: '85%' },
              }}
              // ModalProps={{
              //   disableEnforceFocus: true,
              // }}
              anchor="right"
              open={editModal}
            >

              <DrawerHeader
                headerName="Update Site"
                imagePath={SiteCheck}
                onClose={() => { showEditModal(false); }}
              />
              <AddSite editId={editId} closeModal={() => { closeEditModalWindow(); }}/>
            </Drawer>
          </Box>
            )}
      />
    )
  );
};

export default siteDetailInfo;
