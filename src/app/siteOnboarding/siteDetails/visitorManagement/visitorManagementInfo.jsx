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
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import { setAllowedHostId, setAllowedDomainId, getVMSSettingDetails } from '../../siteService';
import AddVisitorSettings from './addVMSettings';

const appModels = require('../../../util/appModels').default;

const HelpdeskInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    visitorSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  const [isRedirectThree, setRedirectThree] = useState(false);
  const [editId, setEditId] = useState(false);

  const closeManage = () => {
    dispatch(setAllowedHostId([]));
    dispatch(setAllowedDomainId([]));
    dispatch(setInitialValues(false, false, false, false));
    setRedirectThree(false);
  };

  const onLoadManageSettings = () => {
    if (siteDetails && siteDetails.data && siteDetails.data.length) {
      dispatch(getVMSSettingDetails(siteDetails.data[0].id, appModels.VMSCONFIGURATION));
      setEditId(detailData && detailData.id ? detailData.id : false);
    }
    if (document.getElementById('VMSSettingsForm')) {
      document.getElementById('VMSSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('VMSSettingsForm')) {
      document.getElementById('VMSSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(false);
  };

  return (
    detailData && (
      <>
        <Row className="ml-0 mt-3 mr-0 mb-3">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Settings
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              disabled={visitorSettingsInfo && visitorSettingsInfo.data && visitorSettingsInfo.data.length <= 0}
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
          open={isRedirectThree}
        >
          <DrawerHeader
            headerName="Visitor Management Settings"
            imagePath=""
            onClose={closeManage}
          />
          <AddVisitorSettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

HelpdeskInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default HelpdeskInfo;
