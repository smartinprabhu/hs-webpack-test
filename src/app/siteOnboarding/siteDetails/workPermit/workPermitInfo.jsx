/* eslint-disable import/no-unresolved */
import { Button, Drawer } from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import NatureOfWork from '../../../workPermit/configration/natureofWork';
import { getNatureofWorkFilters } from '../../../workPermit/workPermitService';
import AddWorkpermitSettings from './addWorkpermitSettings';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';

const WorkPermitInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    workpermitSettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirect, setRedirect] = useState(false);
  const [isRedirectThree, setRedirectThree] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    dispatch(resetUpdateProductCategory());
    setRedirect(false);
    setRedirectThree(false);
  };

  const onLoadManage = () => {
    dispatch(getNatureofWorkFilters([]));
    setRedirect(true);
  };

  const onLoadManageSettings = () => {
    if (document.getElementById('workpermitSettingsForm')) {
      document.getElementById('workpermitSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('workpermitSettingsForm')) {
      document.getElementById('workpermitSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
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
              disabled={workpermitSettingsInfo && workpermitSettingsInfo.data && workpermitSettingsInfo.data.length <= 0}
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
              Nature of Work
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
            headerName="Nature of work"
            imagePath=""
            onClose={closeManage}
          />
          <NatureOfWork />
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
            headerName="Work Permit Settings"
            imagePath=""
            onClose={closeManage}
          />
          <AddWorkpermitSettings editId={editId} closeModal={closeEditWindow} />
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
