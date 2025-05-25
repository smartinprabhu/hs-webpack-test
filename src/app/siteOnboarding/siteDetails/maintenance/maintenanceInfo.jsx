/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Button, Drawer } from '@mui/material';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import {
  getHelpdeskSettingDetails,
} from '../../siteService';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import { getPPMFilters } from '../../../adminSetup/maintenanceConfiguration/maintenanceService';
import Operations from '../../../adminSetup/maintenanceConfiguration/operations';
import MaintenanceSettings from './maintenanceSettings';

const appModels = require('../../../util/appModels').default;

const WorkPermitInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    helpdeskSettingsInfo,
  } = useSelector((state) => state.site);

  const [isMaintenance, setMaintenance] = useState(false);
  const [isMaintenanceOperation, setMaintenanceOperation] = useState(false);
  const [isRedirect, setRedirect] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setMaintenance(false);
    setRedirect(false);
  };

  const closeOperation = () => {
    dispatch(setInitialValues(false, false, false, false));
    setMaintenanceOperation(false);
  };

  const onLoadMaintenanceOperation = () => {
    dispatch(getPPMFilters([]));
    setMaintenanceOperation(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('MaintenanceSettingsForm')) {
      document.getElementById('MaintenanceSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirect(false);
  };

  const onLoadManageSettings = () => {
    dispatch(getHelpdeskSettingDetails(detailData.id, appModels.MAINTENANCECONFIG));
    if (document.getElementById('MaintenanceSettingsForm')) {
      document.getElementById('MaintenanceSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirect(true);
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
              disabled={helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length <= 0}
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
              Maintenance Operations
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadMaintenanceOperation()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <p className="mt-2" />
        {/* <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isMaintenance}
        >
          <DrawerHeader
            title="Maintenance Checklist"
            imagePath=""
            closeDrawer={closeManage}
          />
          <MaintenanceChecklistInfo editId={editId} closeModal={closeEditWindow} />
        </Drawer> */}
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isMaintenanceOperation}
        >
          <DrawerHeader
            headerName="Maintenance Operation"
            imagePath=""
            onClose={closeOperation}
          />
          <Operations editId={editId} closeModal={closeEditWindow} />
        </Drawer>
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
            headerName="Maintenance Settings"
            imagePath=""
            onClose={closeManage}
          />
          <MaintenanceSettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

WorkPermitInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default WorkPermitInfo;
