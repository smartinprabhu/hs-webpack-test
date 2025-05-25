/* eslint-disable import/no-unresolved */
import DrawerHeader from '@shared/drawerHeader';
import { Drawer } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Button } from '@mui/material';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import { getConfigPantryFilters, getProductCategoryFilters, resetUpdateProductCategory } from '../../../pantryManagement/pantryService';
import { getPantrySettingDetails } from '../../../siteOnboarding/siteService';
import { getPartsFilters } from '../../../adminSetup/maintenanceConfiguration/maintenanceService';
import Pantry from '../../../pantryManagement/configuration/pantry';
import Product from '../../../pantryManagement/configuration/product';
import ProductCategory from '../../../pantryManagement/configuration/productCategory';
import AddPantrySettings from './addPantrySettings';

const PantryInfo = (props) => {
  const {
    detailData,
    setDetailViewClose,
  } = props;
  const dispatch = useDispatch();

  const [isRedirect, setRedirect] = useState(false);
  const [isRedirectTwo, setRedirectTwo] = useState(false);
  const [isRedirectThree, setRedirectThree] = useState(false);
  const [isRedirectFour, setRedirectFour] = useState(false);

  const appModels = require('../../../util/appModels').default;

  const {
    configPantryFilters,
  } = useSelector((state) => state.pantry);
  const {
    pantrySettingsInfo,
  } = useSelector((state) => state.site);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirect(false);
    setRedirectTwo(false);
    setRedirectThree(false);
    setRedirectFour(false);
    setDetailViewClose(true);
    dispatch(getConfigPantryFilters([]));
  };

  const onLoadManage = () => {
    dispatch(getConfigPantryFilters([]));
    setRedirect(true);
    setDetailViewClose(false);
  };

  const onLoadManageProduct = () => {
    dispatch(getPartsFilters([]));
    setRedirectTwo(true);
    setDetailViewClose(false);
  };

  const onLoadManagePC = () => {
    dispatch(getProductCategoryFilters([]));
    setRedirectThree(true);
    setDetailViewClose(false);
  };

  const onLoadManageSettings = () => {
    dispatch(getPantrySettingDetails(detailData.id, appModels.PANTRYCONFIG));
    if (document.getElementById('pantrySettingsForm')) {
      document.getElementById('pantrySettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectFour(true);
    setDetailViewClose(false);
  };

  const closeEditWindow = () => {
    if (document.getElementById('pantrySettingsForm')) {
      document.getElementById('pantrySettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectFour(false);
    setDetailViewClose(true);
  };

  return (
    detailData && (
      <>
        <Row className="ml-0 mt-3 mr-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Settings
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              disabled={pantrySettingsInfo && pantrySettingsInfo.data && pantrySettingsInfo.data.length <= 0}
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSettings()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="ml-0 mr-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Pantry
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManage()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Product
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageProduct()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Product Category
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManagePC()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <p className="mt-2" />

        <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isRedirect}
        >
          <DrawerHeader
            title="Pantry"
            // pathName="Nature of work"
            imagePath=""
            closeDrawer={closeManage}
          />
          <Pantry />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isRedirectTwo}
        >
          <DrawerHeader
            title="Product"
            // pathName="Nature of work"
            imagePath=""
            closeDrawer={closeManage}
          />
          <Product />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isRedirectThree}
        >
          <DrawerHeader
            title="Product Category"
            // pathName="Nature of work"
            imagePath=""
            closeDrawer={closeManage}
          />
          <ProductCategory />
        </Drawer>
        <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isRedirectFour}
        >
          <DrawerHeader
            title="Pantry Settings"
            imagePath=""
            closeDrawer={closeManage}
          />
          <AddPantrySettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

PantryInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailViewClose: PropTypes.func.isRequired,
};
export default PantryInfo;
