/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Button, Drawer } from '@mui/material';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import { getHelpdeskSettingDetails } from '../../siteService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import AddIncidentSettings from './addIncidentSettings';

const appModels = require('../../../util/appModels').default;

const IncidentInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    helpdeskSettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirectOne, setRedirectOne] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirectOne(false);
  };

  const onLoadManageSettings = () => {
    dispatch(getHelpdeskSettingDetails(detailData.id, appModels.MAINTENANCECONFIG));
    if (document.getElementById('incidentSettingsForm')) {
      document.getElementById('incidentSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectOne(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('incidentSettingsForm')) {
      document.getElementById('incidentSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectOne(false);
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

        <p className="mt-2" />

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
            headerName="Incident Settings"
            imagePath=""
            onClose={closeManage}
          />
          <AddIncidentSettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

IncidentInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default IncidentInfo;
