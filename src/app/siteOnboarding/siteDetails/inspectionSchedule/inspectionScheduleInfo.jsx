/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Button, Drawer } from '@mui/material';
import { useHistory } from 'react-router-dom';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  setRecipientsLocationId,
} from '../../siteService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import {
  setCurrentTab,
} from '../../../inventory/inventoryService';
import AddInspectionSettings from './addInspectionSettings';
import { getInspectionFilters } from '../../../inspectionSchedule/inspectionService';
import InspectionSchedule from './inspectionSchedule';

const InspectionScheduleInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { inspectionSettingsInfo, recipientsLocationId } = useSelector((state) => state.site);

  const [isRedirectThree, setRedirectThree] = useState(false);
  const [isRedirectOne, setRedirectOne] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;
  const recipientData = inspectionSettingsInfo && inspectionSettingsInfo.data && inspectionSettingsInfo.data[0] ? inspectionSettingsInfo.data[0].recipients_ids : [];

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirectThree(false);
    dispatch(setRecipientsLocationId(recipientData));
  };

  const closeManageInspection = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirectOne(false);
  };

  const onLoadManageSettings = () => {
    dispatch(resetUpdateProductCategory());
    if (document.getElementById('inspectionSettingsForm')) {
      document.getElementById('inspectionSettingsForm').reset();
    }
    setRedirectThree(true);
  };

  const onLoadManageSchedule = () => {
    dispatch(getInspectionFilters([]));
    setRedirectOne(true);
  };

  const closeEditWindow = () => {
    dispatch(resetUpdateProductCategory());
    if (document.getElementById('inspectionSettingsForm')) {
      document.getElementById('inspectionSettingsForm').reset();
    }
    setRedirectThree(false);
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
              disabled={inspectionSettingsInfo && inspectionSettingsInfo.data && inspectionSettingsInfo.data.length <= 0}
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
              Inspection Schedule
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => {
                history.push(window.location.pathname);
                dispatch(setCurrentTab('SCHEDULE INSPECTION'));
                history.push('/setup-maintenance-configuration');
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
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectThree}
        >
          <DrawerHeader
            headerName="Inspection Settings"
            imagePath=""
            onClose={closeManage}
          />
          <AddInspectionSettings editId={editId} closeModal={closeEditWindow} />
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
            headerName="Inspection Schedule"
            imagePath=""
            onClose={closeManageInspection}
          />
          <InspectionSchedule />
        </Drawer>
      </>
    )
  );
};

InspectionScheduleInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default InspectionScheduleInfo;
