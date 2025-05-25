/* eslint-disable import/no-unresolved */
import { Button, Drawer } from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import Checklist from '../../../adminSetup/maintenanceConfiguration/checklists';
import { getTeamFilters } from '../../../adminSetup/setupService';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  setCurrentTab,
} from '../../../inventory/inventoryService';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  getAssetCategoryFilters,
  getSpaceCategoryFilters,
  resetTC,
} from '../../siteService';
import AssetCategory from './assetCategory';
import SpaceCategory from './spaceCategory';

const AssetInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { parentSiteGroupInfo } = useSelector((state) => state.site);

  const [isRedirectOne, setRedirectOne] = useState(false);
  const [isRedirectTwo, setRedirectTwo] = useState(false);
  const [isRedirectThree, setRedirectThree] = useState(false);
  const [isRedirectFour, setRedirectFour] = useState(false);
  const [isRedirectFive, setRedirectFive] = useState(false);
  const [isRedirectSix, setRedirectSix] = useState(false);

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirectOne(false);
    setRedirectTwo(false);
    setRedirectThree(false);
    setRedirectFour(false);
  };

  const onLoadManageSpace = () => {
    dispatch(resetTC());
    dispatch(getSpaceCategoryFilters([]));
    setRedirectOne(true);
  };

  const onLoadManageAsset = () => {
    dispatch(resetTC());
    dispatch(getAssetCategoryFilters([]));
    setRedirectTwo(true);
  };

  const onLoadManageTeam = () => {
    dispatch(getTeamFilters([]));
    setRedirectThree(true);
  };

  const parentSiteArray = parentSiteGroupInfo && parentSiteGroupInfo.data
    && parentSiteGroupInfo.data.length && parentSiteGroupInfo.data.filter((item) => item.parent_id && item.parent_id[0] === detailData.id);
  const isParentIds = !!(parentSiteArray && parentSiteArray.length && parentSiteArray.length > 0);
  const isParent = detailData.is_parent;

  return (
    detailData && (
      <>

        {(isParentIds || isParent) && (
        <Row className="ml-0 mt-3 mr-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Space Category
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSpace()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        )}
        {(isParentIds || isParent) && (
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Equipment Category
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageAsset()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        )}
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Maintenance Teams
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => {
                dispatch(setCurrentTab('TEAMS'));
                history.push(window.location.pathname);
                history.push('/setup-team-management');
              }}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Spaces
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => {
                dispatch(setCurrentTab('BUILDINGS'));
                history.push(window.location.pathname);
                history.push('/setup-facility');
              }}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Equipment
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => {
                history.push(window.location.pathname);
                dispatch(setCurrentTab('EQUIPMENT'));
                history.push('/setup-facility');
              }}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <p className="mt-2" />

        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={isRedirectOne}
        >
          <DrawerHeader
            headerName="Space Category"
            imagePath=""
            onClose={closeManage}
          />
          <SpaceCategory />
        </Drawer>
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectTwo}
        >
          <DrawerHeader
            headerName="Equipment Category"
            imagePath=""
            onClose={closeManage}
          />
          <AssetCategory />
        </Drawer>
        {/* <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectThree}
        >
          <DrawerHeader
            headerName="Maintenance Teams"
            imagePath=""
            onClose={closeManage}
          />
          <Teams isSiteConfig />
        </Drawer> */}
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectFour}
        >
          <DrawerHeader
            headerName="Checklists"
            imagePath=""
            onClose={closeManage}
          />
          <Checklist />
        </Drawer>
      </>
    )
  );
};

AssetInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AssetInfo;
