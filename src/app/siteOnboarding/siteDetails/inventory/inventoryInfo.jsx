/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Col, Row } from 'reactstrap';
import { Button, Drawer } from '@mui/material';
import {
  setInitialValues, reorderingRulesFilters,
} from '../../../purchase/purchaseService';
import InventorySetting from './inventorySetting';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import { getInventorySettingDetails, setInvRecipientsLocationId } from '../../siteService';
import { getWareHouseFilters, getLocationFilters, getOperationTypeFilters } from '../../../inventory/inventoryService';
import Warehouses from '../../../inventory/configuration/warehouses';
import Location from '../../../inventory/configuration/location';
import OperationTypes from '../../../inventory/configuration/operationTypes';
import ReorderingRulesList from '../../../purchase/products/reorderingRules/reorderingRulesList';

const appModels = require('../../../util/appModels').default;

const InventoryInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirect, setRedirect] = useState(false);
  const [isRedirectOne, setRedirectOne] = useState(false);
  const [isRedirectTwo, setRedirectTwo] = useState(false);
  const [isRedirectThree, setRedirectThree] = useState(false);
  const [isRedirectFour, setRedirectFour] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;
  const recipientData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data[0] ? inventorySettingsInfo.data[0].recipients_ids : [];

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    dispatch(setInvRecipientsLocationId(recipientData));
    setRedirect(false);
    setRedirectOne(false);
    setRedirectTwo(false);
    setRedirectThree(false);
    setRedirectFour(false);
  };

  const onLoadManageWarehouses = () => {
    dispatch(getWareHouseFilters([]));
    setRedirectOne(true);
  };

  const onLoadManageLocations = () => {
    dispatch(getLocationFilters([]));
    setRedirectTwo(true);
  };

  const onLoadManageOperationTypes = () => {
    dispatch(getOperationTypeFilters([]));
    setRedirectThree(true);
  };

  const onLoadManageReorderingRules = () => {
    dispatch(reorderingRulesFilters([]));
    setRedirectFour(true);
  };

  const onLoadManageSettings = () => {
    dispatch(getInventorySettingDetails(detailData.id, appModels.INVENTORYCONFIG));
    if (document.getElementById('InventorySettingsForm')) {
      document.getElementById('InventorySettingsForm').reset();
    }
    setRedirect(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('InventorySettingsForm')) {
      document.getElementById('InventorySettingsForm').reset();
    }
    setRedirect(false);
    dispatch(resetUpdateProductCategory());
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
              disabled={inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length <= 0}
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSettings()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Warehouses
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageWarehouses()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Locations
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageLocations()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Operation Types
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageOperationTypes()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Reordering Rules
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageReorderingRules()}
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
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirect}
        >
          <DrawerHeader
            headerName="Inventory Settings"
            imagePath=""
            onClose={closeManage}
          />
          <InventorySetting editId={editId} closeModal={closeEditWindow} />
        </Drawer>
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectOne}
        >
          <DrawerHeader
            headerName="Warehouses"
            imagePath=""
            onClose={closeManage}
          />
          <Warehouses />
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
            headerName="Locations"
            imagePath=""
            onClose={closeManage}
          />
          <Location />
        </Drawer>
        <Drawer
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
            headerName="Operation Types"
            imagePath=""
            onClose={closeManage}
          />
          <OperationTypes />
        </Drawer>
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
            headerName="Reordering Rules"
            imagePath=""
            onClose={closeManage}
          />
          <ReorderingRulesList />
        </Drawer>
      </>
    )
  );
};

InventoryInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default InventoryInfo;
