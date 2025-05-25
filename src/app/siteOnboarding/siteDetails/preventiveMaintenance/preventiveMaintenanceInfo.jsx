/* eslint-disable import/no-unresolved */
import { Button, Drawer } from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import PPMSetting from './ppmSetting';

const WorkPermitInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirect, setRedirect] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirect(false);
  };

  const onLoadManage = () => {
    setRedirect(true);
  };

  const onLoadManageSettings = () => {
    if (document.getElementById('PPMSettingsForm')) {
      document.getElementById('PPMSettingsForm').reset();
    }
    setRedirect(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('PPMSettingsForm')) {
      document.getElementById('PPMSettingsForm').reset();
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
              disabled={ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length <= 0}
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
          open={isRedirect}
        >
          <DrawerHeader
            headerName="52 Week PPM"
            // pathName="Nature of work"
            imagePath=""
            onClose={closeManage}
          />
          <PPMSetting editId={editId} closeModal={closeEditWindow} />
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
  setDetailViewClose: PropTypes.func.isRequired,
};
export default WorkPermitInfo;
